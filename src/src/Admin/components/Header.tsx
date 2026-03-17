import React from 'react';
import { User, Menu } from 'lucide-react';

interface HeaderProps {
    title: string;
    onMenuClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ title, onMenuClick }) => {
    return (
        <header className="bg-white border-b border-gray-200 px-4 md:px-8 py-4 flex justify-between items-center sticky top-0 z-20">
            <div className="flex items-center gap-3">
                <button
                    onClick={onMenuClick}
                    className="md:hidden p-2 hover:bg-gray-100 rounded-lg text-gray-500"
                >
                    <Menu size={20} />
                </button>
                <h3 className="text-lg md:text-xl font-bold text-gray-800 truncate">
                    {title}
                </h3>
            </div>
            <div className="flex items-center gap-2 md:gap-4">
                <div className="hidden sm:block text-right">
                    <p className="text-sm font-bold text-gray-700 leading-tight">Admin User</p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Super Admin</p>
                </div>
                <div className="bg-[#FED6A8]/20 p-2 rounded-full">
                    <User size={20} className="text-[#8D5B41]" />
                </div>
            </div>
        </header>
    );
};

export default Header;
