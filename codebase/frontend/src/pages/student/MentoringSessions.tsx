import React, { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import { WinnifyEmptyState } from '../../components/common/WinnifyEmptyState';

export const MentoringSessions: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="space-y-6 max-w-6xl mx-auto font-sans">
      
      {/* Search & Filter Toolbar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search sessions..."
            className="w-full bg-white border border-slate-200/80 rounded-2xl pl-11 pr-4 py-3 text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 shadow-xs"
          />
        </div>

        <button className="flex items-center gap-2 bg-white border border-slate-200/80 rounded-2xl px-5 py-3 text-xs font-extrabold text-slate-700 hover:bg-slate-50 transition-colors shadow-xs shrink-0">
          <Filter className="w-4 h-4 text-slate-500" />
          <span>Filters</span>
        </button>
      </div>

      {/* Main Container with Empty State */}
      <div className="bg-white rounded-3xl p-12 sm:p-20 border border-slate-200/80 shadow-xs min-h-[440px] flex items-center justify-center">
        <WinnifyEmptyState
          title="No Data Available"
          description="No mentoring sessions have been assigned to you yet."
          type="plus"
        />
      </div>

    </div>
  );
};

export default MentoringSessions;
