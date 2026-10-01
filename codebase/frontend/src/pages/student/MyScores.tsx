import React from 'react';
import { Award, ChevronRight, TrendingDown } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';

export const MyScores: React.FC = () => {
  const weeklyBreakdown = [
    { date: '17 – 23 AUG', score: 0, status: 'Missed', isActive: false },
    { date: '24 – 30 AUG', score: 0, status: 'Missed', isActive: false },
    { date: '31 AUG – 6 SEP', score: 0, status: 'Missed', isActive: false },
    { date: '7 – 13 SEP', score: 0, status: 'Missed', isActive: false },
    { date: '14 – 20 SEP', score: 0, status: 'Missed', isActive: false },
    { date: 'WINSPEAK', score: 0, status: '5-week average', isActive: true },
  ];

  const trajectoryData = [
    { date: '13 – 19 Jul', score: 0 },
    { date: '20 – 26 Jul', score: 0 },
    { date: '27 Jul – 2 Aug', score: 0 },
    { date: '3 – 9 Aug', score: 0 },
    { date: '10 – 16 Aug', score: 0 },
    { date: '17 – 23 Aug', score: 0 },
    { date: '24 – 30 Aug', score: 0 },
    { date: '31 Aug – 6 Sep', score: 0 },
    { date: '7 – 13 Sep', score: 0 },
    { date: '14 – 20 Sep', score: 0 },
  ];

  const dimensions = [
    { name: '• Clarity', score: 0, delta: '-', stroke: '#0d9488' },
    { name: '• Fluency', score: 0, delta: '-', stroke: '#7c3aed' },
    { name: '• Grammar', score: 0, delta: '-', stroke: '#4f46e5' },
    { name: '• Relevancy', score: 0, delta: '-', stroke: '#e11d48' },
    { name: '• Structure', score: 0, delta: '-', stroke: '#d97706' },
    { name: '• Vocabulary', score: 0, delta: '-', stroke: '#16a34a' },
  ];

  const recentChallenges: { title: string; type: string; score: number }[] = [];

  return (
    <div className="space-y-8 max-w-6xl mx-auto font-sans text-slate-900 pb-16">
      
      {/* HEADER TITLE */}
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Scores
        </h1>
        <p className="text-xs font-bold text-slate-500">
          Your WinSpeak performance over time
        </p>
      </div>

      {/* 1. TOP CARD: WINSPEAK SCORE */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100 space-y-3">
        <p className="text-xs font-black uppercase tracking-widest text-slate-400">
          WINSPEAK SCORE
        </p>

        <div className="flex items-baseline gap-2">
          <span className="text-5xl font-black tracking-tight text-slate-900">0</span>
          <span className="text-xl font-bold text-slate-400">/ 100</span>
        </div>

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 text-amber-900 text-xs font-black border border-amber-200">
          <Award className="w-4 h-4 text-amber-600" /> Rank #-- in your Semester
        </div>

        <p className="text-xs font-medium text-slate-600">
          Total Challenges Completed: 0 · based on last 5 weeks · a missed week counts as 0
        </p>
        
        <p className="text-[11px] font-medium text-slate-400">
          Score reflects Winnify Challenges only. Practice Arena is excluded.
        </p>
      </div>

      {/* 2. HOW YOUR WINSPEAK IS CALCULATED (5-WEEK ROLLING ROW) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100 space-y-4">
        <div>
          <h3 className="text-base font-black text-slate-900">
            How your WinSpeak is calculated
          </h3>
          <p className="text-xs font-medium text-slate-500">
            Average of the based on last 5 weeks. A missed week counts as 0.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {weeklyBreakdown.map((item, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-2xl border text-center space-y-1 ${
                item.isActive
                  ? 'bg-indigo-50 border-indigo-200 text-indigo-900 font-black'
                  : 'bg-slate-50/80 border-slate-100 text-slate-700'
              }`}
            >
              <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">{item.date}</p>
              <p className="text-2xl font-black text-slate-900">{item.score}</p>
              <p className="text-[10px] font-medium text-slate-500">{item.status}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 3. SUMMARY METRICS ROW (4 CARDS) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 text-center space-y-1">
          <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">THIS WEEK'S SCORE</p>
          <p className="text-3xl font-black text-slate-900">0</p>
          <p className="text-[10px] font-bold text-slate-400">Missed → 0</p>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 text-center space-y-1">
          <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">STRENGTH</p>
          <p className="text-3xl font-black text-slate-900">15</p>
          <p className="text-[10px] font-bold text-slate-400">Relevancy</p>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 text-center space-y-1">
          <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">FOCUS ON THIS</p>
          <p className="text-3xl font-black text-slate-900">12</p>
          <p className="text-[10px] font-bold text-slate-400">Grammar</p>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 text-center space-y-1">
          <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">BEST SCORE · 3 - 9 AUG</p>
          <p className="text-3xl font-black text-slate-900">84</p>
        </div>
      </div>

      {/* 4. WINSPEAK SCORE TRAJECTORY GRAPH */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100 space-y-4">
        <h3 className="text-base font-black text-slate-900">
          WinSpeak Score Trajectory
        </h3>

        <div className="h-64 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trajectoryData}>
              <defs>
                <linearGradient id="purpleGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="date" stroke="#94a3b8" fontSize={10} tickLine={false} />
              <YAxis domain={[0, 100]} stroke="#94a3b8" fontSize={10} tickLine={false} />
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderRadius: '12px', color: '#fff', fontSize: '11px' }} />
              <Area type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#purpleGradient)" dot={{ r: 4, fill: '#6366f1' }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 5. DIMENSION WISE TREND GRID */}
      <div className="space-y-4">
        <h3 className="text-base font-black text-slate-900">
          Dimension Wise Trend
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {dimensions.map((dim, idx) => (
            <div key={idx} className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-slate-800">{dim.name}</span>
              </div>
              
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-slate-900">{dim.score}</span>
                <span className="text-xs font-black text-rose-600">{dim.delta}</span>
              </div>

              {/* Sparkline Simulation */}
              <div className="h-10 w-full pt-1">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trajectoryData.slice(4)}>
                    <Area type="monotone" dataKey="score" stroke={dim.stroke} strokeWidth={2} fill="none" dot={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 6. RECENT CHALLENGES */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100 space-y-4">
        <h3 className="text-base font-black text-slate-900">
          Recent Challenges
        </h3>

        <div className="space-y-3">
          {recentChallenges.map((rc, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-slate-50/80 border border-slate-100 flex items-center justify-between gap-4">
              <div>
                <h4 className="text-xs font-black text-slate-900">{rc.title}</h4>
                <p className="text-[11px] font-medium text-slate-500 mt-0.5">{rc.type}</p>
              </div>

              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-full bg-slate-200 text-slate-800 font-black text-xs">
                  {rc.score}
                </span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
