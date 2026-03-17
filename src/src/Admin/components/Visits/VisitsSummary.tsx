import React, { useState } from 'react';
import type { BookVisitSummary } from '../../types/admin';
import { ChevronDown, ChevronRight, Clock, Calendar } from 'lucide-react';

interface VisitsSummaryProps {
    summaries: BookVisitSummary[];
    formatTime: (seconds: number) => string;
    searchQuery: string;
    setSearchQuery: (q: string) => void;
    minTime: number;
    setMinTime: (t: number) => void;
}

const VisitsSummary: React.FC<VisitsSummaryProps> = ({
    summaries,
    formatTime,
    searchQuery,
    setSearchQuery,
    minTime,
    setMinTime
}) => {
    const [expandedBook, setExpandedBook] = useState<string | null>(null);

    const filtered = summaries.filter(s =>
        s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.users.some(u => u.name.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <div className="space-y-6">
            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                    <input
                        type="text"
                        placeholder="Search by book or user..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full text-sm border-gray-100 bg-gray-50 rounded-xl px-4 py-2 focus:ring-[#8D5B41] focus:border-[#8D5B41]"
                    />
                </div>
                <select
                    value={minTime}
                    onChange={(e) => setMinTime(parseInt(e.target.value))}
                    className="text-sm border-gray-100 bg-gray-50 rounded-xl px-4 py-2 focus:ring-[#8D5B41] focus:border-[#8D5B41]"
                >
                    <option value={0}>Any Duration</option>
                    <option value={60}>Min 1m</option>
                    <option value={300}>Min 5m</option>
                    <option value={600}>Min 10m</option>
                </select>
            </div>

            <div className="space-y-4">
                {filtered.map((book) => (
                    <div key={book.title} className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                        <div
                            onClick={() => setExpandedBook(expandedBook === book.title ? null : book.title)}
                            className="p-4 md:p-6 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-[#FED6A8]/20 rounded-2xl flex items-center justify-center text-[#8D5B41]">
                                    <Clock size={24} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-800">{book.title}</h4>
                                    <p className="text-xs text-gray-400 font-medium">{book.totalVisits} total visits</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-6">
                                <div className="hidden sm:block text-right">
                                    <p className="text-sm font-bold text-[#8D5B41]">{formatTime(book.totalTimeSpent)}</p>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Total Time</p>
                                </div>
                                {expandedBook === book.title ? <ChevronDown size={20} className="text-gray-300" /> : <ChevronRight size={20} className="text-gray-300" />}
                            </div>
                        </div>

                        {expandedBook === book.title && (
                            <div className="border-t border-gray-50 bg-gray-50/50 p-4 md:p-6 animate-in slide-in-from-top-2">
                                <h5 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Users who visited this book</h5>
                                <div className="space-y-3">
                                    {book.users.map((user, uIdx) => (
                                        <div key={uIdx} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-[#8D5B41] font-bold text-xs">
                                                        {user.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-gray-800">{user.name}</p>
                                                        <p className="text-[10px] text-gray-400">{user.email}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-4 text-[10px] font-bold">
                                                    <div className="flex items-center gap-1 text-gray-500">
                                                        <Calendar size={12} />
                                                        {new Date(user.timestamp).toLocaleDateString()}
                                                    </div>
                                                    <div className="flex items-center gap-1 text-[#8D5B41] bg-[#FED6A8]/30 px-2 py-1 rounded-lg">
                                                        <Clock size={12} />
                                                        {formatTime(user.duration)}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Page level details */}
                                            {Object.keys(user.pageVisits).length > 0 && (
                                                <div className="mt-4 pt-4 border-t border-gray-50 flex flex-wrap gap-2">
                                                    {Object.entries(user.pageVisits).sort().map(([path, dur]) => (
                                                        <div key={path} className="bg-gray-50 px-3 py-1 rounded-full flex items-center gap-2 border border-gray-100">
                                                            <span className="text-[10px] text-gray-500">Page {path.split('-').pop()}</span>
                                                            <span className="text-[10px] font-bold text-[#8D5B41]">{formatTime(dur)}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default VisitsSummary;
