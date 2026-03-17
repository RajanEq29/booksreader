import { useState } from 'react';
import { useAdminData } from './hooks/useAdminData';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import MobileNav from './components/MobileNav';
import StatsGrid from './components/Dashboard/StatsGrid';
import VisitsSummary from './components/Visits/VisitsSummary';
import { UserList, UserDetail } from './components/Users/UserComponents';
import { ChevronRight } from 'lucide-react';

function Admin() {
  const {
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
    // allPageVisits
  } = useAdminData();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  const getPageTitle = () => {
    switch (activeTab) {
      case 'users': return 'Registered Users';
      case 'visits': return 'Visits Records';
      default: return 'Admin Dashboard';
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-[#F8F9FA]">
        <div className="w-12 h-12 border-4 border-[#8D5B41] border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-[#8D5B41] font-bold tracking-widest uppercase text-xs">Loading Analytics...</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#F8F9FA] overflow-hidden">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <MobileNav
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          title={getPageTitle()}
          onMenuClick={() => setIsMobileMenuOpen(true)}
        />

        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          {activeTab === 'dashboard' && (
            <div className="space-y-8 animate-in fade-in duration-500">
              <StatsGrid stats={stats} formatTime={formatTime} />

              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-50 flex justify-between items-center">
                  <h4 className="font-bold text-gray-700">Recent Engagement</h4>
                  <button onClick={() => setActiveTab('users')} className="text-xs font-black text-[#8D5B41] hover:underline flex items-center gap-1 uppercase tracking-tighter">
                    Manage Users <ChevronRight size={14} />
                  </button>
                </div>
                <div className="divide-y divide-gray-50">
                  {users.slice(0, 5).map(user => (
                    <div key={user.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-[#8D5B41] font-bold">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-gray-800 text-sm">{user.name}</p>
                          <p className="text-[10px] text-gray-400 font-medium">{new Date(user.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-sm text-[#8D5B41]">{formatTime(user.totalTimeSpent)}</p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase">{user.visits.length} sessions</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full animate-in fade-in duration-500">
              <div className="lg:col-span-5 xl:col-span-4 h-full overflow-hidden">
                <UserList
                  users={filteredUsers}
                  selectedUserId={selectedUser?.id}
                  onUserSelect={setSelectedUser}
                  sortBy={sortBy}
                  setSortBy={setSortBy}
                  searchQuery={userSearch}
                  setSearchQuery={setUserSearch}
                  minTime={userMinTime}
                  setMinTime={setUserMinTime}
                  formatTime={formatTime}
                />
              </div>
              <div className="hidden lg:block lg:col-span-7 xl:col-span-8 h-full overflow-hidden">
                <UserDetail user={selectedUser} formatTime={formatTime} />
              </div>

              {/* Mobile User Detail (Overlay or Modal would be better, but we'll show it below list for now) */}
              {selectedUser && (
                <div className="lg:hidden mt-4">
                  <UserDetail user={selectedUser} formatTime={formatTime} />
                </div>
              )}
            </div>
          )}

          {activeTab === 'visits' && (
            <div className="animate-in fade-in duration-300">
              <VisitsSummary
                summaries={bookSummaries}
                formatTime={formatTime}
                searchQuery={visitSearch}
                setSearchQuery={setVisitSearch}
                minTime={visitMinTime}
                setMinTime={setVisitMinTime}
              />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default Admin;