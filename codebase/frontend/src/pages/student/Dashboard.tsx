import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  Mic,
  Lightbulb,
  ChevronRight,
  TrendingDown,
  Check,
  Trophy,
  MoreHorizontal
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const profile = user?.profile;
  const navigate = useNavigate();

  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const overallScore = profile?.overallScore || 0;

  const cohortLeaderboard = [
    { rank: 1, name: 'JASMINE MOHAMMED', score: 78, color: 'bg-amber-500 text-white' },
    { rank: 2, name: 'ABHIRAMI PRATVADA', score: 71, color: 'bg-slate-400 text-white' },
    { rank: 3, name: 'BASHEERUN SHAIK', score: 69, color: 'bg-amber-700 text-white' },
  ];

  const recentActivities = [
    {
      id: '1',
      title: 'How I Stand Apart',
      subtitle: 'Winnify Global · today',
      score: 0,
      scoreColor: 'bg-amber-800 text-amber-100',
    },
    {
      id: '2',
      title: 'My Placement Introduction',
      subtitle: 'Practice – Winnify Global · 5 weeks ago',
      score: 33,
      scoreColor: 'bg-amber-600 text-white',
    },
    {
      id: '3',
      title: 'A Skill I\'d Love to Learn in College',
      subtitle: 'Winnify Global · 5 weeks ago',
      score: 70,
      scoreColor: 'bg-emerald-600 text-white',
    },
    {
      id: '4',
      title: 'My Placement Introduction',
      subtitle: 'Winnify Global · 5 weeks ago',
      score: 57,
      scoreColor: 'bg-amber-600 text-white',
    },
    {
      id: '5',
      title: 'Multitasking – Help or Hindrance?',
      subtitle: 'Winnify Global · 5 weeks ago',
      score: 84,
      scoreColor: 'bg-emerald-600 text-white',
    },
  ];

  const options = [
    { key: 'A', text: '150 cm³' },
    { key: 'B', text: '25 cm³' },
    { key: 'C', text: '216 cm³' },
    { key: 'D', text: '125 cm³' },
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto font-sans text-black dark:text-white pb-16">
      
      {/* PAGE HEADER & GREETING */}
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-black text-black dark:text-white tracking-tight">
          Good Evening, {profile?.fullName ? profile.fullName.split(' ')[0] : 'MANISHANKAR'}
        </h1>
        <p className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
          Time to Shine
        </p>
      </div>

      {/* 1. DAILY QUIZ CARD */}
      <div className="space-y-3">
        <h2 className="text-base font-black text-black dark:text-white">Daily Quiz</h2>

        <div className="bg-white dark:bg-neutral-900 rounded-3xl p-6 shadow-xs border border-neutral-200 dark:border-neutral-800 space-y-5">
          
          {/* Top row tag & streak */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 font-bold text-xs">
                Logical Reasoning
              </span>
              <button className="text-neutral-400 hover:text-black dark:hover:text-white p-1">
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-neutral-500 dark:text-neutral-400">01/10/2026</span>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-700 text-amber-100 font-bold text-xs flex items-center gap-1">
                🔥 1
              </span>
            </div>
          </div>

          {/* Question Text */}
          <h3 className="text-sm sm:text-base font-bold text-black dark:text-white leading-snug">
            A cube has a total surface area of 150 cm². What is its volume?
          </h3>

          {/* 4 Option Buttons */}
          <div className="space-y-2.5">
            {options.map((opt) => {
              const isSelected = selectedOption === opt.key;
              return (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => setSelectedOption(opt.key)}
                  className={`w-full flex items-center gap-4 p-3.5 rounded-2xl text-xs font-bold transition-all text-left border ${
                    isSelected
                      ? 'bg-indigo-50/80 dark:bg-indigo-950/40 border-indigo-500 text-indigo-900 dark:text-indigo-200 shadow-xs'
                      : 'bg-neutral-100/70 dark:bg-neutral-800/60 border-transparent hover:bg-neutral-200/50 dark:hover:bg-neutral-800 text-black dark:text-white'
                  }`}
                >
                  <span className={`w-7 h-7 rounded-xl flex items-center justify-center font-black text-xs shrink-0 ${
                    isSelected
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-600'
                  }`}>
                    {opt.key}
                  </span>
                  <span className="flex-1 font-semibold">{opt.text}</span>
                </button>
              );
            })}
          </div>

          {/* Dotted Divider & Footer Tracker */}
          <div className="border-t border-dashed border-neutral-200 dark:border-neutral-800 pt-3 flex flex-wrap items-center justify-between gap-3 text-xs">
            
            <div className="flex items-center gap-2 text-neutral-400 font-bold">
              <span>Last 7 days</span>
              <div className="flex items-center gap-1.5 ml-1">
                <span className="w-2.5 h-2.5 rounded-full bg-neutral-300 dark:bg-neutral-700 inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-neutral-300 dark:bg-neutral-700 inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-neutral-300 dark:bg-neutral-700 inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-neutral-300 dark:bg-neutral-700 inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-neutral-300 dark:bg-neutral-700 inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-700 inline-block" />
                <span className="w-3 h-3 rounded-full border-2 border-dashed border-indigo-500 inline-block" />
              </div>
            </div>

            <span className="text-[11px] font-bold text-neutral-400">
              Doesn't affect your WinSpeak score
            </span>
          </div>

        </div>
      </div>

      {/* 2. THIS WEEK'S CHALLENGE HERO BANNER */}
      <div className="space-y-3">
        <h2 className="text-base font-black text-black dark:text-white">This Week's Challenge</h2>

        <div className="bg-[#5c54ed] text-white rounded-3xl p-6 sm:p-8 shadow-md relative overflow-hidden flex flex-col justify-between min-h-[220px]">
          
          {/* Background Microchip Graphic Lines */}
          <div className="absolute right-12 top-1/2 -translate-y-1/2 pointer-events-none opacity-90 hidden md:block">
            <div className="relative w-44 h-44 flex items-center justify-center">
              {/* Outer Cloud Elements */}
              <div className="absolute w-28 h-8 bg-white/20 rounded-full -top-4 right-2 blur-xs" />
              <div className="absolute w-24 h-6 bg-white/20 rounded-full bottom-2 -left-6 blur-xs" />
              
              {/* Mic Stand Icon */}
              <div className="w-24 h-32 rounded-3xl bg-[#ef4444] border-4 border-slate-900 shadow-xl flex flex-col items-center justify-center relative">
                <div className="w-12 h-14 bg-slate-900 rounded-full mb-1 flex items-center justify-center">
                  <Mic className="w-6 h-6 text-white" />
                </div>
                <div className="w-2.5 h-6 bg-slate-900" />
                <div className="w-10 h-2 bg-slate-900 rounded-full" />
              </div>
            </div>
          </div>

          <div className="relative z-10 space-y-3 max-w-xl">
            <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              How I Stand Apart
            </h3>

            <p className="text-xs sm:text-sm font-medium text-indigo-100 leading-relaxed">
              How do you differentiate yourself from other candidates with similar backgrounds and qualifications?
            </p>

            {/* Badges */}
            <div className="flex items-center gap-2 pt-1">
              <span className="px-3 py-1 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center gap-1 shadow-xs">
                <Check className="w-3.5 h-3.5" /> Completed
              </span>
              <span className="px-3 py-1 rounded-full bg-indigo-900/60 text-amber-300 font-bold text-xs flex items-center gap-1">
                🏆 #26
              </span>
            </div>

            {/* Buttons */}
            <div className="flex items-center gap-3 pt-3">
              <button
                onClick={() => navigate('/student/challenges/1')}
                className="px-6 py-2.5 rounded-full bg-white text-black hover:bg-neutral-100 font-bold text-xs shadow-md transition-all"
              >
                View report
              </button>
              <button
                onClick={() => navigate('/student/challenges/1')}
                className="px-6 py-2.5 rounded-full bg-white text-black hover:bg-neutral-100 font-bold text-xs shadow-md transition-all"
              >
                Practice
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* 3. WINSPEAK SCORE (LEFT) & COHORT LEADERBOARD (RIGHT) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* WINSPEAK SCORE CARD (LEFT 6 COLS) */}
        <div className="md:col-span-6 bg-[#5c54ed] text-white rounded-3xl p-6 sm:p-7 shadow-md flex flex-col justify-between space-y-6">
          
          <div className="space-y-3">
            <p className="text-[11px] font-black uppercase tracking-wider text-indigo-200">
              WINSPEAK SCORE
            </p>

            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-black tracking-tight">{overallScore}</span>
              <span className="text-2xl font-extrabold text-indigo-200">/ 100</span>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-900/50 text-white text-xs font-bold">
              <TrendingDown className="w-3.5 h-3.5 text-indigo-200" /> ! +0 vs last week
            </div>

            <p className="text-xs font-medium text-indigo-200">
              5-week rolling average
            </p>
          </div>

          {/* Sub-cards */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="p-4 bg-indigo-700/60 rounded-2xl border border-indigo-400/30 space-y-1">
              <p className="text-[10px] font-black uppercase tracking-wider text-indigo-200">STRONGEST</p>
              <p className="text-base font-extrabold text-white">Clarity</p>
            </div>

            <div className="p-4 bg-indigo-700/60 rounded-2xl border border-indigo-400/30 space-y-1">
              <p className="text-[10px] font-black uppercase tracking-wider text-indigo-200">WEAKEST</p>
              <p className="text-base font-extrabold text-white">—</p>
            </div>
          </div>

        </div>

        {/* COHORT LEADERBOARD CARD (RIGHT 6 COLS) */}
        <div className="md:col-span-6 bg-white dark:bg-neutral-900 text-black dark:text-white rounded-3xl p-6 sm:p-7 shadow-xs border border-neutral-200 dark:border-neutral-800 flex flex-col justify-between space-y-4">
          
          <div>
            <h3 className="text-base font-black text-black dark:text-white">
              Cohort Leaderboard
            </h3>
            <p className="text-xs text-neutral-400 font-semibold">
              AI-T2 · T2 · of 6 students
            </p>

            <div className="mt-4 space-y-2.5">
              {cohortLeaderboard.map((item) => (
                <div key={item.rank} className="flex items-center justify-between p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-800/70 border border-neutral-200 dark:border-neutral-700">
                  <div className="flex items-center gap-3">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center font-black text-xs shrink-0 ${item.color}`}>
                      {item.rank}
                    </div>
                    <span className="text-xs font-bold text-black dark:text-white uppercase tracking-tight">
                      {item.name}
                    </span>
                  </div>
                  <span className="text-xs font-black text-black dark:text-white">{item.score}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2 text-center">
            <button
              onClick={() => navigate('/student/leaderboard')}
              className="w-full inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-full border border-neutral-300 dark:border-neutral-700 text-black dark:text-white bg-white dark:bg-neutral-900 hover:bg-neutral-100 dark:hover:bg-neutral-800 font-bold text-xs transition-colors"
            >
              View Full Leaderboard <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>

      {/* 4. YOUR FOCUS THIS WEEK */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-base font-black text-black dark:text-white">
            Your Focus This Week
          </h3>
          <span className="text-xs font-bold text-neutral-400">
            • Refreshes Monday
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Card 1 */}
          <div className="bg-white dark:bg-neutral-900 rounded-3xl p-6 shadow-xs border border-neutral-200 dark:border-neutral-800 space-y-3 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-9 h-9 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
                <Lightbulb className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-black text-black dark:text-white">
                Sharpen your diction
              </h4>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium leading-relaxed">
                Slow down on key words and over-articulate consonants so every point lands cleanly.
              </p>
            </div>
            <div className="pt-2">
              <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 font-bold text-xs">
                Clarity
              </span>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white dark:bg-neutral-900 rounded-3xl p-6 shadow-xs border border-neutral-200 dark:border-neutral-800 space-y-3 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-9 h-9 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
                <Lightbulb className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-black text-black dark:text-white">
                Smooth out your pacing
              </h4>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium leading-relaxed">
                Reduce filler words and link your sentences – a steady pace reads as confidence.
              </p>
            </div>
            <div className="pt-2">
              <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 font-bold text-xs">
                Fluency
              </span>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white dark:bg-neutral-900 rounded-3xl p-6 shadow-xs border border-neutral-200 dark:border-neutral-800 space-y-3 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-9 h-9 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
                <Lightbulb className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-black text-black dark:text-white">
                Tighten your grammar
              </h4>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium leading-relaxed">
                Watch subject-verb agreement in longer sentences; pause once to check the verb matches the subject.
              </p>
            </div>
            <div className="pt-2">
              <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 font-bold text-xs">
                Grammar
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* 5. RECENT ACTIVITY */}
      <div className="space-y-3">
        <h3 className="text-base font-black text-black dark:text-white">
          Recent Activity
        </h3>

        <div className="space-y-2.5">
          {recentActivities.map((act) => (
            <div
              key={act.id}
              onClick={() => navigate('/student/challenges/1')}
              className="bg-white dark:bg-neutral-900 rounded-3xl p-4 shadow-xs border border-neutral-200 dark:border-neutral-800 flex items-center justify-between hover:bg-neutral-50 dark:hover:bg-neutral-800/60 cursor-pointer transition-all"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shrink-0">
                  <Mic className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-black dark:text-white">
                    {act.title}
                  </h4>
                  <p className="text-xs font-medium text-neutral-400">
                    {act.subtitle}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs ${act.scoreColor}`}>
                  {act.score}
                </span>
                <ChevronRight className="w-4 h-4 text-neutral-400" />
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
