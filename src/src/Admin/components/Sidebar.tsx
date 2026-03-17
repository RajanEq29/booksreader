import React from 'react';
import { Users, LayoutDashboard, LogOut, FileText } from 'lucide-react';
import type { AdminTab } from '../types/admin';

interface SidebarProps {
    activeTab: AdminTab;
    setActiveTab: (tab: AdminTab) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
    return (
        <div className="hidden md:flex w-64 bg-white border-r border-gray-200 flex-col">
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
                <button
                    onClick={() => setActiveTab('visits')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'visits' ? 'bg-[#FED6A8]/30 text-[#8D5B41]' : 'text-gray-500 hover:bg-gray-50'}`}
                >
                    <FileText size={20} />
                    <span className="font-semibold">Visits Records</span>
                </button>
            </nav>

            <div className="p-4 border-t border-gray-100 mt-auto">
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-all">
                    <LogOut size={20} />
                    <span className="font-semibold">Logout</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
