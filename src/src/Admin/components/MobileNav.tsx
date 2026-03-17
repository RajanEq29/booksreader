import React from 'react';
import { X, Users, LayoutDashboard, LogOut, FileText } from 'lucide-react';
import type { AdminTab } from '../types/admin';

interface MobileNavProps {
    isOpen: boolean;
    onClose: () => void;
    activeTab: AdminTab;
    setActiveTab: (tab: AdminTab) => void;
}

const MobileNav: React.FC<MobileNavProps> = ({ isOpen, onClose, activeTab, setActiveTab }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 md:hidden">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
            <div className="absolute top-0 left-0 w-72 h-full bg-white shadow-2xl animate-in slide-in-from-left duration-300 flex flex-col">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-[#8D5B41] font-serif">Heritage Admin</h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg text-gray-400">
                        <X size={20} />
                    </button>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    {[
                        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
                        { id: 'users', label: 'Users List', icon: Users },
                        { id: 'visits', label: 'Visits Records', icon: FileText }
                    ].map((item) => (
                        <button
                            key={item.id}
                            onClick={() => {
                                setActiveTab(item.id as AdminTab);
                                onClose();
                            }}
                            className={`w-full flex items-center gap-3 px-4 py-4 rounded-2xl transition-all ${activeTab === item.id ? 'bg-[#FED6A8]/30 text-[#8D5B41]' : 'text-gray-500 hover:bg-gray-50'}`}
                        >
                            <item.icon size={20} />
                            <span className="font-bold">{item.label}</span>
                        </button>
                    ))}
                </nav>

                <div className="p-4 border-t border-gray-100">
                    <button className="w-full flex items-center gap-3 px-4 py-4 rounded-2xl text-red-500 hover:bg-red-50 transition-all">
                        <LogOut size={20} />
                        <span className="font-bold">Logout</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MobileNav;
