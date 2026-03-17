import React from 'react';
import { ChevronRight, User } from 'lucide-react';
import type { UserData, SortOrder } from '../../types/admin';

interface UserListProps {
    users: UserData[];
    selectedUserId?: string;
    onUserSelect: (user: UserData) => void;
    sortBy: SortOrder;
    setSortBy: (s: SortOrder) => void;
    searchQuery: string;
    setSearchQuery: (q: string) => void;
    minTime: number;
    setMinTime: (t: number) => void;
    formatTime: (s: number) => string;
}

export const UserList: React.FC<UserListProps> = ({
    users,
    selectedUserId,
    onUserSelect,
    sortBy,
    setSortBy,
    searchQuery,
    setSearchQuery,
    minTime,
    setMinTime,
    formatTime
}) => {
    return (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden h-full flex flex-col">
            <div className="p-6 border-b border-gray-50 flex flex-col gap-4">
                <div className="flex justify-between items-center">
                    <div>
                        <h4 className="font-bold text-gray-700">All Users</h4>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{users.length} matching</span>
                    </div>
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as any)}
                        className="text-xs font-bold text-[#8D5B41] bg-[#FED6A8]/10 px-2 py-1 rounded-lg border-none focus:ring-0 cursor-pointer"
                    >
                        <option value="recent">Recent</option>
                        <option value="name">Name</option>
                        <option value="engagement">Engaged</option>
                    </select>
                </div>

                <div className="flex flex-col gap-2">
                    <input
                        type="text"
                        placeholder="Search users..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="text-xs font-medium border-gray-100 bg-gray-50 rounded-xl px-4 py-2 focus:ring-[#8D5B41]"
                    />
                    <select
                        value={minTime}
                        onChange={(e) => setMinTime(parseInt(e.target.value))}
                        className="text-xs font-medium border-gray-100 bg-gray-50 rounded-xl px-4 py-2 focus:ring-[#8D5B41]"
                    >
                        <option value={0}>Any activity</option>
                        <option value={60}>1m+</option>
                        <option value={300}>5m+</option>
                        <option value={600}>10m+</option>
                    </select>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-gray-50">
                {users.map((user) => (
                    <div
                        key={user.id}
                        onClick={() => onUserSelect(user)}
                        className={`p-4 flex items-center justify-between cursor-pointer transition-all hover:bg-gray-50 ${selectedUserId === user.id ? 'bg-[#FED6A8]/10 border-l-4 border-[#8D5B41]' : 'border-l-4 border-transparent'}`}
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-[#8D5B41] font-bold text-sm">
                                {user.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <p className="font-bold text-gray-800 text-sm">{user.name}</p>
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-bold">
                                        {formatTime(user.totalTimeSpent)}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <ChevronRight size={16} className="text-gray-300" />
                    </div>
                ))}
                {users.length === 0 && (
                    <div className="p-8 text-center text-gray-400 text-sm italic">No users found</div>
                )}
            </div>
        </div>
    );
};

interface UserDetailProps {
    user: UserData | null;
    formatTime: (s: number) => string;
}

export const UserDetail: React.FC<UserDetailProps> = ({ user, formatTime }) => {
    if (!user) {
        return (
            <div className="h-full flex flex-col items-center justify-center text-center p-12 bg-white rounded-3xl border border-dotted border-gray-200">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mb-4">
                    <User size={32} />
                </div>
                <h4 className="font-bold text-gray-700">Select a User</h4>
                <p className="text-xs text-gray-400 mt-2">Pick someone from the list to see their detailed interaction history.</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden h-full flex flex-col">
            <div className="p-8 bg-[#FED6A8]/10 flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-white rounded-[24px] shadow-sm flex items-center justify-center text-2xl text-[#8D5B41] font-bold mb-3">
                    {user.name.charAt(0).toUpperCase()}
                </div>
                <h4 className="text-xl font-bold text-gray-800">{user.name}</h4>
                <p className="text-xs font-bold text-[#8D5B41] mt-1 uppercase tracking-widest">{formatTime(user.totalTimeSpent)} Active</p>
            </div>

            <div className="p-6 flex-1 overflow-y-auto space-y-4">
                <h5 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Visit History</h5>
                {user.visits.length > 0 ? (
                    <div className="space-y-3">
                        {[...user.visits].reverse().map((visit, idx) => (
                            <div key={idx} className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                <div className="flex justify-between items-start mb-2">
                                    <p className="font-bold text-gray-800 text-sm">{visit.title}</p>
                                    <span className="text-[10px] font-bold text-[#8D5B41] bg-white px-2 py-1 rounded-lg border border-[#FED6A8]/30">
                                        {formatTime(visit.duration || 0)}
                                    </span>
                                </div>
                                <p className="text-[10px] text-gray-400 font-medium">{new Date(visit.timestamp).toLocaleString()}</p>

                                {visit.pageVisits && Object.keys(visit.pageVisits).length > 0 && (
                                    <div className="mt-3 flex flex-wrap gap-1">
                                        {Object.entries(visit.pageVisits).map(([path, dur]) => (
                                            <span key={path} className="text-[9px] bg-white border border-gray-100 px-2 py-0.5 rounded-full text-gray-500 font-bold">
                                                P{path.split('-').pop()}: {formatTime(dur)}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-gray-400 text-sm italic py-8">No visits recorded</p>
                )}
            </div>
        </div>
    );
};
