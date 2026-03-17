import React from 'react';
import { Users, FileText, LayoutDashboard } from 'lucide-react';

interface StatsGridProps {
    stats: {
        totalUsers: number;
        totalSessions: number;
        totalTime: number;
    };
    formatTime: (seconds: number) => string;
}

const StatsGrid: React.FC<StatsGridProps> = ({ stats, formatTime }) => {
    const items = [
        {
            label: 'Total Users',
            value: stats.totalUsers,
            icon: Users,
            color: 'bg-[#FED6A8]/20',
            textColor: 'text-[#8D5B41]'
        },
        {
            label: 'Total Sessions',
            value: stats.totalSessions,
            icon: FileText,
            color: 'bg-blue-50',
            textColor: 'text-blue-500'
        },
        {
            label: 'Total Time',
            value: formatTime(stats.totalTime),
            icon: LayoutDashboard,
            color: 'bg-green-50',
            textColor: 'text-green-500'
        }
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {items.map((item, idx) => (
                <div key={idx} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-6">
                    <div className={`w-14 h-14 md:w-16 md:h-16 ${item.color} rounded-2xl flex items-center justify-center ${item.textColor}`}>
                        <item.icon size={28} />
                    </div>
                    <div>
                        <p className="text-[10px] md:text-sm font-bold text-gray-400 uppercase tracking-widest">{item.label}</p>
                        <h4 className="text-xl md:text-3xl font-bold text-gray-800">{item.value}</h4>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default StatsGrid;
