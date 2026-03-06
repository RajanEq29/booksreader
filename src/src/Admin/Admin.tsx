import { useState, useEffect } from 'react';
import { Users, LayoutDashboard, LogOut, ChevronRight, User, Mail, MessageSquare, FileText } from 'lucide-react';
import { getAllVisits } from '../../services/api';

interface UserVisit {
  id: string | number;
  title: string;
  timestamp: string;
  path: string;
  duration?: number; // in seconds
  pageVisits?: Record<number, number>; // pageIndex -> duration in seconds
}

interface UserData {
  id: string;
  name: string;
  phone: string;
  content: string; // Email
  message?: string;
  createdAt: string;
  visits?: UserVisit[];
  totalTimeSpent?: number; // in seconds
}

function Admin() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [expandedVisit, setExpandedVisit] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'recent' | 'name' | 'engagement'>('recent');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const result = await getAllVisits();
        if (result.success && result.data) {
          // Map backend data to frontend UserData interface
          const mappedUsers = result.data.map((u: any) => ({
            id: u._id,
            name: u.name,
            phone: u.phone,
            content: u.email || '',
            message: u.message,
            createdAt: u.createdAt,
            visits: u.visits.map((v: any) => ({
              id: v.id,
              title: v.title,
              timestamp: v.timestamp,
              path: v.path,
              duration: v.duration,
              pageVisits: v.pageVisits instanceof Map ? Object.fromEntries(v.pageVisits) : (v.pageVisits || {})
            })),
            totalTimeSpent: u.totalTimeSpent
          }));
          setUsers(mappedUsers);
        }
      } catch (error) {
        console.error("Error fetching from backend:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatTime = (seconds?: number) => {
    if (!seconds) return '0s';
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    let res = '';
    if (hrs > 0) res += `${hrs}h `;
    if (mins > 0) res += `${mins}m `;
    if (secs > 0 || res === '') res += `${secs}s`;
    return res.trim();
  };

  const getSortedUsers = () => {
    return [...users].sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'engagement') return (b.totalTimeSpent || 0) - (a.totalTimeSpent || 0);
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  };

  const stats = {
    totalUsers: users.length,
    totalSessions: users.reduce((acc: number, user: UserData) => acc + (user.visits?.length || 0), 0),
    totalTime: users.reduce((acc: number, user: UserData) => acc + (user.totalTimeSpent || 0), 0)
  };

  return (
    <div className="flex h-screen bg-[#F8F9FA] overflow-hidden">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-2xl font-bold text-[#8D5B41] font-serif">Heritage Admin</h2>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'dashboard' ? 'bg-[#FED6A8]/30 text-[#8D5B41]' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            <LayoutDashboard size={20} />
            <span className="font-semibold">Dashboard</span>
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'users' ? 'bg-[#FED6A8]/30 text-[#8D5B41]' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            <Users size={20} />
            <span className="font-semibold">Users List</span>
          </button>
        </nav>

        <div className="p-4 border-t border-gray-100 mt-auto">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-all">
            <LogOut size={20} />
            <span className="font-semibold">Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center sticky top-0 z-10">
          <h3 className="text-xl font-bold text-gray-800">
            {activeTab === 'users' ? 'Registered Users' : activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
          </h3>
          <div className="flex items-center gap-4">
            <div className="bg-[#FED6A8]/20 p-2 rounded-full">
              <User size={20} className="text-[#8D5B41]" />
            </div>
            <span className="font-medium text-gray-700">Admin User</span>
          </div>
        </header>

        <main className="p-8">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-[60vh]">
              <div className="w-12 h-12 border-4 border-[#8D5B41] border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-gray-500 font-medium">Loading analytics...</p>
            </div>
          ) : activeTab === 'dashboard' ? (
            <div className="space-y-8">
              {/* Stats Highlights */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-6">
                  <div className="w-16 h-16 bg-[#FED6A8]/20 rounded-2xl flex items-center justify-center text-[#8D5B41]">
                    <Users size={32} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Total Users</p>
                    <h4 className="text-3xl font-bold text-gray-800">{stats.totalUsers}</h4>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-6">
                  <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-500">
                    <FileText size={32} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Total Sessions</p>
                    <h4 className="text-3xl font-bold text-gray-800">{stats.totalSessions}</h4>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-6">
                  <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center text-green-500">
                    <LayoutDashboard size={32} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Total Time Spent</p>
                    <h4 className="text-3xl font-bold text-gray-800">{formatTime(stats.totalTime)}</h4>
                  </div>
                </div>
              </div>

              {/* Recent Activity List */}
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-50 flex justify-between items-center">
                  <h4 className="font-bold text-gray-700">Recent User Sessions</h4>
                  <button onClick={() => setActiveTab('users')} className="text-sm font-bold text-[#8D5B41] hover:underline flex items-center gap-1">
                    View All Users <ChevronRight size={14} />
                  </button>
                </div>
                <div className="divide-y divide-gray-50">
                  {users.slice(0, 5).map(user => (
                    <div key={user.id} className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-[#8D5B41] font-bold">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-gray-800 text-sm">{user.name}</p>
                          <p className="text-xs text-gray-400">{new Date(user.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-sm text-[#8D5B41]">{user.visits?.length || 0} visits</p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase">{formatTime(user.totalTimeSpent)} active</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : activeTab === 'users' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Users List Column */}
              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-white sticky top-0 z-10">
                  <div>
                    <h4 className="font-bold text-gray-700">All Users</h4>
                    <span className="text-xs font-bold text-gray-400">{users.length} registered</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-400">Sort:</span>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="text-xs font-bold text-[#8D5B41] bg-[#FED6A8]/10 px-2 py-1 rounded-lg border-none focus:ring-0 cursor-pointer"
                    >
                      <option value="recent">Recently Joined</option>
                      <option value="name">Name (A-Z)</option>
                      <option value="engagement">Most Engaged</option>
                    </select>
                  </div>
                </div>
                <div className="divide-y divide-gray-50 max-h-[600px] overflow-y-auto">
                  {getSortedUsers().map((user) => (
                    <div
                      key={user.id}
                      onClick={() => setSelectedUser(user)}
                      className={`p-4 flex items-center justify-between cursor-pointer transition-all hover:bg-gray-50 ${selectedUser?.id === user.id ? 'bg-[#FED6A8]/10 border-l-4 border-[#8D5B41]' : 'border-l-4 border-transparent'}`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-[#8D5B41] font-bold">
                          {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <div>
                          <p className="font-bold text-gray-800">{user.name}</p>
                          <div className="flex items-center gap-2">
                            <p className="text-sm text-gray-500">{user.content}</p>
                            <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-bold">
                              {formatTime(user.totalTimeSpent)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <ChevronRight size={18} className="text-gray-300" />
                    </div>
                  ))}
                </div>
              </div>

              {/* User Detail Column */}
              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden min-h-[500px]">
                {selectedUser ? (
                  <div className="h-full flex flex-col">
                    <div className="p-8 bg-[#FED6A8]/10 flex flex-col items-center text-center">
                      <div className="w-24 h-24 bg-white rounded-[32px] shadow-sm flex items-center justify-center text-3xl text-[#8D5B41] font-bold mb-4">
                        {selectedUser.name ? selectedUser.name.charAt(0).toUpperCase() : 'U'}
                      </div>
                      <h4 className="text-2xl font-bold text-gray-800">{selectedUser.name}</h4>
                      <p className="text-[#8D5B41] font-bold mt-1">Total Time: {formatTime(selectedUser.totalTimeSpent)}</p>
                      <p className="text-gray-400 text-xs mt-1">User Activity Analytics</p>
                    </div>

                    <div className="p-8 flex-1 overflow-y-auto max-h-[500px] space-y-4">
                      <div className="flex items-center justify-between mb-4">
                        <h5 className="font-bold text-gray-700 flex items-center gap-2">
                          <LayoutDashboard size={18} className="text-[#8D5B41]" />
                          Visited Books
                        </h5>
                        <span className="text-xs font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded">
                          {selectedUser.visits?.length || 0} Total Visits
                        </span>
                      </div>

                      {selectedUser.visits && selectedUser.visits.length > 0 ? (
                        <div className="space-y-4">
                          {[...(selectedUser.visits || [])].reverse().map((visit, idx) => (
                            <div key={idx} className="flex flex-col gap-2">
                              <div
                                onClick={() => setExpandedVisit(expandedVisit === idx ? null : idx)}
                                className={`p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-between group hover:bg-white hover:shadow-md transition-all cursor-pointer ${expandedVisit === idx ? 'ring-2 ring-[#8D5B41]/20' : ''}`}
                              >
                                <div className="flex items-center gap-4">
                                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-[#8D5B41] shadow-sm">
                                    <FileText size={18} />
                                  </div>
                                  <div>
                                    <p className="font-bold text-gray-800">{visit.title}</p>
                                    <div className="flex items-center gap-2">
                                      <p className="text-xs text-gray-400">{new Date(visit.timestamp).toLocaleString()}</p>
                                      <span className="text-[10px] font-bold text-[#8D5B41] bg-[#FED6A8]/30 px-1.5 rounded">
                                        {formatTime(visit.duration)} total
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  {visit.pageVisits && Object.keys(visit.pageVisits).length > 0 && (
                                    <span className="text-[10px] font-bold text-gray-400">
                                      {expandedVisit === idx ? 'Hide details' : 'View pages'}
                                    </span>
                                  )}
                                  <div className="text-[10px] font-black text-[#8D5B41] px-2 py-1 bg-[#FED6A8]/20 rounded-full uppercase tracking-tighter">
                                    ID: {visit.id}
                                  </div>
                                </div>
                              </div>

                              {/* Page breakdown */}
                              {expandedVisit === idx && visit.pageVisits && (
                                <div className="ml-14 space-y-2 border-l-2 border-[#FED6A8]/30 pl-4 animate-in slide-in-from-top-2 duration-200">
                                  {Object.entries(visit.pageVisits)
                                    .sort(([a], [b]) => {
                                      // Extract page number from path like "/home/2/page-5"
                                      const pageA = parseInt(a.split('-').pop() || '0');
                                      const pageB = parseInt(b.split('-').pop() || '0');
                                      return pageA - pageB;
                                    })
                                    .map(([subPath, duration]) => {
                                      const pageNum = subPath.split('-').pop();
                                      return (
                                        <div key={subPath} className="flex items-center justify-between text-sm py-1">
                                          <span className="text-gray-600">Page {pageNum}</span>
                                          <span className="font-bold text-[#8D5B41]">{formatTime(duration)}</span>
                                        </div>
                                      );
                                    })}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-12 flex flex-col items-center">
                          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 text-gray-300">
                            <MessageSquare size={24} />
                          </div>
                          <p className="text-gray-500 font-medium">No visit history found.</p>
                        </div>
                      )}
                    </div>

                    <div className="p-8 border-t border-gray-50 bg-gray-50/30">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-gray-400 shadow-sm">
                          <Mail size={16} />
                        </div>
                        <p className="text-sm font-semibold text-gray-600">{selectedUser.content}</p>
                      </div>
                      <button className="w-full py-4 bg-[#8D5B41] text-white font-bold rounded-2xl shadow-lg shadow-[#8D5B41]/20 hover:bg-[#744933] transition-all">
                        Contact User
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center p-12">
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mb-6">
                      <User size={40} />
                    </div>
                    <h4 className="text-xl font-bold text-gray-700 mb-2">No User Selected</h4>
                    <p className="text-gray-400 max-w-xs">Select a user from the list on the left to view which pages and books they have visited on the site.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div >
    </div >
  );
}

export default Admin;