import React, { useState } from 'react';
import { Crown, Trophy, TrendingUp, TrendingDown } from 'lucide-react';

export const Leaderboard: React.FC = () => {
  const [period, setPeriod] = useState<'OVERALL' | 'WEEKLY'>('OVERALL');

  const topThree = [
    {
      rank: 2,
      name: 'KOWSHIK NAIDU VALISETTY',
      initials: 'KN',
      score: 0,
      delta: '0',
      deltaType: 'up',
      pedestalStyle: 'bg-gradient-to-b from-emerald-100 to-emerald-200 border-emerald-300 text-emerald-900',
      avatarBg: 'bg-emerald-600',
      wreathColor: 'text-emerald-700',
    },
    {
      rank: 1,
      name: 'JASMINE MOHAMMED',
      initials: 'JM',
      score: 0,
      delta: '0',
      deltaType: 'up',
      pedestalStyle: 'bg-gradient-to-b from-purple-100 to-purple-200 border-purple-300 text-purple-900 h-80',
      avatarBg: 'bg-purple-600',
      wreathColor: 'text-purple-700',
    },
    {
      rank: 3,
      name: 'ABHIRAMI PRATIVADA',
      initials: 'AP',
      score: 0,
      delta: '0',
      deltaType: 'up',
      pedestalStyle: 'bg-gradient-to-b from-rose-100 to-rose-200 border-rose-300 text-rose-900',
      avatarBg: 'bg-rose-600',
      wreathColor: 'text-rose-700',
    },
  ];

  const listRows = [
    { rank: 4, name: 'BASHEERUN SHAIK', initials: 'BS', score: 0, delta: '-', deltaUp: true },
    { rank: 5, name: 'VENKATA SWANAGA LAKSHMI IKKURTHI', initials: 'VS', score: 0, delta: '-', deltaUp: true },
    { rank: 6, name: 'VENKATA SAI KOTHAMASU', initials: 'VS', score: 0, delta: '-', deltaUp: true },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto font-sans text-slate-900 pb-16">
      
      {/* HEADER TITLE & SUBTITLE */}
      <div className="space-y-3">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Leaderboard
        </h1>
        <p className="text-xs font-bold text-slate-500">
          Top speakers · overall WinSpeak score
        </p>

        {/* OVERALL / WEEKLY TOGGLE PILLS */}
        <div className="inline-flex bg-white p-1 rounded-full border border-slate-200 shadow-xs">
          <button
            onClick={() => setPeriod('OVERALL')}
            className={`px-5 py-1.5 rounded-full text-xs font-extrabold transition-all ${
              period === 'OVERALL' ? 'bg-black text-white shadow-xs' : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            Overall
          </button>
          <button
            onClick={() => setPeriod('WEEKLY')}
            className={`px-5 py-1.5 rounded-full text-xs font-extrabold transition-all ${
              period === 'WEEKLY' ? 'bg-black text-white shadow-xs' : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            Weekly
          </button>
        </div>
      </div>

      {/* TOP 3 PODIUM CONTAINER */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-slate-100 min-h-[380px] flex items-end justify-center">
        <div className="grid grid-cols-3 gap-4 sm:gap-8 items-end max-w-2xl w-full">
          {topThree.map((item) => (
            <div
              key={item.rank}
              className={`rounded-3xl p-4 sm:p-6 border text-center flex flex-col items-center justify-between shadow-xs ${item.pedestalStyle}`}
            >
              {/* Crown / Wreath Header */}
              <div className="space-y-1">
                <div className={`flex items-center justify-center gap-1 text-xs font-black uppercase tracking-wider ${item.wreathColor}`}>
                  <Crown className="w-4 h-4" />
                  <span>{item.rank}</span>
                </div>
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">BEST RANKING</p>
              </div>

              {/* Avatar Circle */}
              <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full text-white flex items-center justify-center font-black text-base shadow-md my-2 ${item.avatarBg}`}>
                {item.initials}
              </div>

              {/* Name & Score */}
              <div className="space-y-1">
                <p className="text-xs font-black tracking-tight truncate uppercase max-w-[130px] mx-auto">
                  {item.name}
                </p>
                <div className="text-xs font-bold text-slate-700 flex items-center justify-center gap-1">
                  <span>Score : <strong className="font-black text-slate-900">{item.score}</strong></span>
                  <span className={`text-[11px] font-extrabold ${item.deltaType === 'up' ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {item.deltaType === 'up' ? '▲' : '▼'}{item.delta}
                  </span>
                </div>
              </div>

            </div>
          ))}
        </div>
      </div>

      {/* RANKED LIST ROWS BELOW */}
      <div className="space-y-3">
        {listRows.map((row) => (
          <div
            key={row.rank}
            className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-100 flex items-center justify-between gap-4 hover:shadow-md transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-black text-xs shrink-0">
                {row.initials}
              </div>
              <div>
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-tight">
                  {row.name}
                </h4>
                <p className="text-xs font-medium text-slate-500 mt-0.5">
                  Score : <strong className="font-extrabold text-slate-800">{row.score} / 100</strong>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-1 rounded-lg text-xs font-black flex items-center gap-1 ${
                row.deltaUp ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
              }`}>
                {row.delta}
              </span>
              
              <span className="px-3.5 py-1.5 rounded-full bg-amber-600 text-white font-extrabold text-xs">
                Rank {row.rank}
              </span>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
