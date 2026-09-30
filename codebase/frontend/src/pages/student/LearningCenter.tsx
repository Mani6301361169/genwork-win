import React, { useState } from 'react';
import { Search, Filter, FolderKanban, Plus } from 'lucide-react';

export const LearningCenter: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="space-y-6 max-w-6xl mx-auto font-sans text-slate-900 pb-16">
      
      {/* SEARCH AND FILTERS BAR */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Search Input */}
        <div className="relative w-full sm:w-96">
          <input
            type="text"
            placeholder="Search by Subject Name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-4 pr-10 py-3 rounded-full bg-white border border-slate-200 text-slate-900 text-xs font-bold focus:outline-none shadow-xs placeholder-slate-400"
          />
          <Search className="w-4 h-4 absolute right-4 top-3.5 text-slate-400" />
        </div>

        {/* Filters Button */}
        <button className="flex items-center gap-2 px-5 py-3 rounded-full bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-extrabold text-xs shadow-xs transition-colors shrink-0">
          <Filter className="w-4 h-4 text-slate-500" /> Filters
        </button>

      </div>

      {/* TABLE CONTAINER & EMPTY STATE */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100 min-h-[480px] flex flex-col">
        
        {/* Table Header Row */}
        <div className="grid grid-cols-6 gap-4 p-4 rounded-2xl bg-slate-100/70 text-slate-700 text-xs font-black uppercase tracking-wider text-center">
          <div>Program Name</div>
          <div>Sem No</div>
          <div>Subject Name</div>
          <div>Type</div>
          <div>Faculty</div>
          <div>Credits</div>
        </div>

        {/* Empty State Content */}
        <div className="flex-1 flex flex-col items-center justify-center py-16 text-center space-y-4">
          
          <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-indigo-50 border border-indigo-100">
            <FolderKanban className="w-10 h-10 text-indigo-500" />
            <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-md">
              <Plus className="w-4 h-4" />
            </div>
          </div>

          <div className="space-y-1 max-w-sm">
            <h3 className="text-base font-black text-slate-900">
              No Data Available
            </h3>
            <p className="text-xs font-medium text-slate-500 leading-relaxed">
              There is nothing here yet. Start by adding some content.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};
