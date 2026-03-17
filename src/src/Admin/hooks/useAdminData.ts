import { useState, useEffect, useMemo } from 'react';
import { getAllVisits } from '../../../services/api';
import type { UserData, SortOrder, AdminTab, BookVisitSummary, PageVisitItem } from '../types/admin';

export const useAdminData = () => {
    const [users, setUsers] = useState<UserData[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
    const [sortBy, setSortBy] = useState<SortOrder>('recent');
    const [selectedUser, setSelectedUser] = useState<UserData | null>(null);

    // Filters
    const [userSearch, setUserSearch] = useState('');
    const [userMinTime, setUserMinTime] = useState(0);
    const [visitSearch, setVisitSearch] = useState('');
    const [visitMinTime, setVisitMinTime] = useState(0);

    const fetchData = async () => {
        setLoading(true);
        try {
            const result = await getAllVisits();
            if (result.success && result.data) {
                const mappedUsers: UserData[] = result.data.map((u: any) => ({
                    id: u._id,
                    name: u.name,
                    phone: u.phone,
                    email: u.email || '',
                    message: u.message,
                    createdAt: u.createdAt,
                    visits: (u.visits || []).map((v: any) => ({
                        id: v.id,
                        title: v.title,
                        timestamp: v.timestamp,
                        path: v.path,
                        duration: v.duration,
                        pageVisits: v.pageVisits instanceof Map ? Object.fromEntries(v.pageVisits) : (v.pageVisits || {})
                    })),
                    totalTimeSpent: u.totalTimeSpent || 0
                }));
                setUsers(mappedUsers);
            }
        } catch (error) {
            console.error("Error fetching admin data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const stats = useMemo(() => ({
        totalUsers: users.length,
        totalSessions: users.reduce((acc, user) => acc + (user.visits?.length || 0), 0),
        totalTime: users.reduce((acc, user) => acc + (user.totalTimeSpent || 0), 0)
    }), [users]);

    const filteredUsers = useMemo(() => {
        return [...users]
            .filter(user => {
                const matchesSearch =
                    user.name.toLowerCase().includes(userSearch.toLowerCase()) ||
                    user.email.toLowerCase().includes(userSearch.toLowerCase()) ||
                    user.phone.includes(userSearch);
                const matchesTime = user.totalTimeSpent >= userMinTime;
                return matchesSearch && matchesTime;
            })
            .sort((a, b) => {
                if (sortBy === 'name') return a.name.localeCompare(b.name);
                if (sortBy === 'engagement') return b.totalTimeSpent - a.totalTimeSpent;
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            });
    }, [users, userSearch, userMinTime, sortBy]);

    // Transform data for the new "Visits summary" view
    const bookSummaries = useMemo(() => {
        const summaryMap: Record<string, BookVisitSummary> = {};

        users.forEach(user => {
            user.visits?.forEach(visit => {
                const key = visit.title;
                if (!summaryMap[key]) {
                    summaryMap[key] = {
                        title: visit.title,
                        path: visit.path,
                        totalVisits: 0,
                        totalTimeSpent: 0,
                        users: []
                    };
                }

                summaryMap[key].totalVisits += 1;
                summaryMap[key].totalTimeSpent += (visit.duration || 0);

                // Find if user already exists for this book in summary
                const existingUser = summaryMap[key].users.find(u => u.email === user.email);
                if (existingUser) {
                    existingUser.duration += (visit.duration || 0);
                    // Merge page visits
                    if (visit.pageVisits) {
                        Object.entries(visit.pageVisits).forEach(([path, dur]) => {
                            existingUser.pageVisits[path] = (existingUser.pageVisits[path] || 0) + dur;
                        });
                    }
                } else {
                    summaryMap[key].users.push({
                        name: user.name,
                        email: user.email,
                        phone: user.phone,
                        pageVisits: { ...(visit.pageVisits || {}) },
                        timestamp: visit.timestamp,
                        duration: visit.duration || 0
                    });
                }
            });
        });

        return Object.values(summaryMap).sort((a, b) => b.totalVisits - a.totalVisits);
    }, [users]);

    const allPageVisits = useMemo((): PageVisitItem[] => {
        const pages: PageVisitItem[] = [];
        users.forEach(user => {
            user.visits?.forEach(visit => {
                if (visit.pageVisits) {
                    Object.entries(visit.pageVisits).forEach(([path, duration]) => {
                        const pageNum = path.split('-').pop() || '0';
                        const matchesSearch =
                            user.name.toLowerCase().includes(visitSearch.toLowerCase()) ||
                            visit.title.toLowerCase().includes(visitSearch.toLowerCase());
                        const matchesTime = duration >= visitMinTime;

                        if (matchesSearch && matchesTime) {
                            pages.push({
                                userName: user.name,
                                bookTitle: visit.title,
                                pageIndex: pageNum,
                                duration,
                                timestamp: visit.timestamp,
                                userId: user.id
                            });
                        }
                    });
                }
            });
        });
        return pages.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    }, [users, visitSearch, visitMinTime]);

    return {
        users,
        loading,
        activeTab,
        setActiveTab,
        sortBy,
        setSortBy,
        selectedUser,
        setSelectedUser,
        userSearch,
        setUserSearch,
        userMinTime,
        setUserMinTime,
        visitSearch,
        setVisitSearch,
        visitMinTime,
        setVisitMinTime,
        stats,
        filteredUsers,
        bookSummaries,
        allPageVisits,
        refreshData: fetchData
    };
};
