import React, { useState } from 'react';
import { Search, Filter, Plus, LayoutGrid, Eye, X } from 'lucide-react';

export const History: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReport, setSelectedReport] = useState<any>(null);

  const historyRows = [
    { week: '—', challenge: 'My Placement Introduction', type: 'Practice – Winnify Global', typeStyle: 'bg-amber-800 text-white', date: '21 Aug 2026, 10:41', status: 'Ready', score: 33 },
    { week: '17 – 23 Aug', challenge: 'A Skill I\'d Love to Learn in College', type: 'Winnify Global', typeStyle: 'bg-indigo-100 text-indigo-700', date: '21 Aug 2026, 10:31', status: 'Ready', score: 70 },
    { week: '10 – 16 Aug', challenge: 'My Placement Introduction', type: 'Winnify Global', typeStyle: 'bg-indigo-100 text-indigo-700', date: '21 Aug 2026, 10:26', status: 'Ready', score: 57 },
    { week: '3 – 9 Aug', challenge: 'Multitasking – Help or Hindrance?', type: 'Winnify Global', typeStyle: 'bg-indigo-100 text-indigo-700', date: '21 Aug 2026, 10:22', status: 'Ready', score: 84 },
    { week: '—', challenge: 'Debate Talk', type: 'Practice – Debate Talk', typeStyle: 'bg-amber-800 text-white', date: '02 Aug 2026, 15:38', status: 'Ready', score: 50 },
    { week: '—', challenge: 'Behavioural Interview', type: 'Practice – Behavioural Interview', typeStyle: 'bg-amber-800 text-white', date: '02 Aug 2026, 12:09', status: 'Ready', score: 60 },
    { week: '—', challenge: 'Behavioural Interview', type: 'Practice – Behavioural Interview', typeStyle: 'bg-amber-800 text-white', date: '28 Jul 2026, 16:21', status: 'Ready', score: 49 },
    { week: '27 Jul – 2 Aug', challenge: 'Today as a Reel', type: 'Winnify Global', typeStyle: 'bg-indigo-100 text-indigo-700', date: '28 Jul 2026, 16:18', status: 'Ready', score: 68 },
    { week: '—', challenge: 'My Guiltless Habit', type: 'Practice – Winnify Global', typeStyle: 'bg-amber-800 text-white', date: '24 Jul 2026, 11:20', status: 'Ready', score: 62 },
    { week: '—', challenge: 'My Guiltless Habit', type: 'Practice – Winnify Global', typeStyle: 'bg-amber-800 text-white', date: '24 Jul 2026, 11:16', status: 'Ready', score: 64 },
    { week: '13 – 19 Jul', challenge: 'My Guiltless Habit', type: 'Winnify Global', typeStyle: 'bg-indigo-100 text-indigo-700', date: '24 Jul 2026, 11:14', status: 'Ready', score: 58 },
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto font-sans text-slate-900 pb-16">
      
      {/* HEADER TITLE & SEARCH BAR */}
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            History
          </h1>
          <p className="text-xs font-bold text-slate-500">
            Your past challenges and practice sessions
          </p>
        </div>

        {/* Search & Filter Inputs */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-96">
            <input
              type="text"
              placeholder="Search challenges..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-4 pr-10 py-2.5 rounded-full bg-white border border-slate-200 text-slate-900 text-xs font-bold focus:outline-none shadow-xs"
            />
            <Search className="w-4 h-4 absolute right-4 top-3 text-slate-400" />
          </div>

          <button className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-extrabold text-xs shadow-xs shrink-0">
            <Filter className="w-4 h-4 text-slate-500" /> Filters
          </button>
        </div>

        {/* View Tabs Bar */}
        <div className="flex items-center justify-between p-2 rounded-2xl bg-slate-100/70 border border-slate-200/60">
          <div className="flex items-center gap-2">
            <button className="px-4 py-1.5 rounded-xl bg-white text-slate-900 font-extrabold text-xs shadow-xs">
              Default View
            </button>
            <button className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-slate-600 hover:text-slate-900 font-extrabold text-xs">
              <Plus className="w-3.5 h-3.5" /> Add View
            </button>
          </div>

          <div className="flex items-center gap-1 text-slate-400">
            <LayoutGrid className="w-4 h-4 p-0.5 cursor-pointer hover:text-slate-800" />
          </div>
        </div>
      </div>

      {/* DATA TABLE CONTAINER */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100/70 border-b border-slate-200/80 text-[11px] font-black uppercase tracking-wider text-slate-700">
                <th className="py-3.5 px-6">Week ↑↓</th>
                <th className="py-3.5 px-6">Challenge ↑↓</th>
                <th className="py-3.5 px-6">Type ↑↓</th>
                <th className="py-3.5 px-6">Submitted On ↑↓</th>
                <th className="py-3.5 px-6">Status ↑↓</th>
                <th className="py-3.5 px-6">Score ↑↓</th>
                <th className="py-3.5 px-6 text-center">Report</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-800">
              {historyRows.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-4 px-6 text-slate-500 font-bold">{row.week}</td>
                  <td className="py-4 px-6 font-black text-slate-900">{row.challenge}</td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black ${row.typeStyle}`}>
                      {row.type}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-slate-600 font-bold">{row.date}</td>
                  <td className="py-4 px-6">
                    <span className="px-3 py-1 rounded-full bg-[#4d7c0f] text-white font-black text-[10px]">
                      {row.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 font-black text-slate-900">{row.score}</td>
                  <td className="py-4 px-6 text-center">
                    <button
                      onClick={() => setSelectedReport(row)}
                      className="text-slate-400 hover:text-slate-900 p-1"
                      title="View Evaluation Report"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* REPORT MODAL */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full space-y-4 shadow-2xl relative">
            <button
              onClick={() => setSelectedReport(null)}
              className="absolute top-5 right-5 p-1 text-slate-400 hover:text-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-black text-slate-900">
              "{selectedReport.challenge}"
            </h3>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2 text-xs">
              <p className="font-bold text-slate-700">Submitted: {selectedReport.date}</p>
              <p className="font-bold text-slate-700">Overall Score: <span className="font-black text-slate-900 text-sm">{selectedReport.score} / 100</span></p>
            </div>

            <button
              onClick={() => setSelectedReport(null)}
              className="w-full py-3 bg-black text-white font-extrabold rounded-2xl text-xs"
            >
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
