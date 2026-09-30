import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { apiFetch } from '../../services/api';
import { Challenge } from '../../types';
import { useNavigate, Link } from 'react-router-dom';
import {
  Mic,
  Lightbulb,
  ArrowRight,
  TrendingDown,
  Award,
  ChevronRight,
  Sparkles,
  Clock,
  Radio
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const profile = user?.profile;
  const navigate = useNavigate();

  const [featuredChallenge, setFeaturedChallenge] = useState<Challenge | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await apiFetch<{ challenge: Challenge }>('/challenges/today');
        setFeaturedChallenge(res.challenge);
      } catch (err) {
        console.error('Failed to load dashboard challenge:', err);
      }
    };
    fetchDashboardData();
  }, []);

  const overallScore = profile?.overallScore || 74;

  const cohortLeaderboard = [
    { rank: 1, name: 'JASMINE MOHAMMED', score: 78, badgeColor: 'bg-amber-400 text-amber-950' },
    { rank: 2, name: 'KOWSHIK NAIDU VALISETTY', score: 71, badgeColor: 'bg-slate-300 text-slate-800' },
    { rank: 3, name: 'ABHIRAMI PRATIVADA', score: 69, badgeColor: 'bg-amber-700 text-white' },
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto font-sans text-slate-900 pb-12">
      
      {/* PAGE SUBTITLE */}
      <div>
        <p className="text-xs font-bold text-slate-500">Time to Shine</p>
      </div>

      {/* 1. THIS WEEK'S CHALLENGE HERO BANNER */}
      <div className="bg-gradient-to-r from-[#5338ec] to-[#6d4df6] text-white rounded-3xl p-6 sm:p-8 shadow-lg relative overflow-hidden border border-purple-400/20">
        
        {/* Subtle Background Glow Accent */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 space-y-4 max-w-2xl">
          <p className="text-xs font-extrabold uppercase tracking-widest text-purple-200">
            This Week's Challenge
          </p>

          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            "{featuredChallenge?.title || 'My Favourite App'}"
          </h1>

          <p className="text-xs sm:text-sm font-medium text-purple-100 leading-relaxed">
            {featuredChallenge?.description || 'Describe your favourite mobile app to someone who has never used it – what it does, how it works, and why you enjoy it.'}
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <span className="px-3 py-1 rounded-full bg-[#22c55e] text-white font-extrabold text-xs">
              Active
            </span>
            <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white font-bold text-xs">
              4d 08:04:48 left
            </span>
          </div>

          <div className="pt-2">
            <button
              onClick={() => navigate(featuredChallenge ? `/student/challenges/${featuredChallenge.id}` : '/student/challenges')}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-slate-900 hover:bg-slate-100 font-extrabold text-xs shadow-md transition-all"
            >
              Start Challenge <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right Microphone Graphic Illustration */}
        <div className="hidden lg:flex absolute right-8 top-1/2 -translate-y-1/2 items-center justify-center w-36 h-36 rounded-full bg-white/10 backdrop-blur-md border-2 border-white/20">
          <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center">
            <Mic className="w-10 h-10 text-white" />
          </div>
        </div>

      </div>

      {/* 2. MIDDLE ROW: WINSPEAK SCORE (LEFT) & COHORT LEADERBOARD (RIGHT) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* WINSPEAK SCORE CARD (LEFT 50%) */}
        <div className="md:col-span-6 bg-[#5338ec] text-white rounded-3xl p-6 sm:p-8 shadow-md border border-purple-400/20 flex flex-col justify-between space-y-6">
          
          <div className="space-y-4">
            <p className="text-xs font-black uppercase tracking-widest text-purple-200">
              WINSPEAK SCORE
            </p>

            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-black tracking-tight">{overallScore}</span>
              <span className="text-xl font-extrabold text-purple-200">/ 100</span>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/10 text-purple-100 text-xs font-bold border border-white/10">
              <TrendingDown className="w-3.5 h-3.5 text-purple-200" /> -10 vs last week
            </div>

            <p className="text-xs font-medium text-purple-200">
              5-week rolling average
            </p>
          </div>

          {/* Strongest & Weakest Sub-cards */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="p-3.5 bg-white/10 border border-white/15 rounded-2xl space-y-1">
              <p className="text-[10px] font-black uppercase tracking-wider text-purple-200">STRONGEST</p>
              <p className="text-sm font-black text-white truncate">Relevancy</p>
            </div>

            <div className="p-3.5 bg-white/10 border border-white/15 rounded-2xl space-y-1">
              <p className="text-[10px] font-black uppercase tracking-wider text-purple-200">WEAKEST</p>
              <p className="text-sm font-black text-white truncate">Grammar</p>
            </div>
          </div>

        </div>

        {/* COHORT LEADERBOARD CARD (RIGHT 50%) */}
        <div className="md:col-span-6 bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100 flex flex-col justify-between space-y-4">
          
          <div>
            <h3 className="text-base font-extrabold text-slate-900">
              Cohort Leaderboard
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              AI-T2 · T2 · of 6 students
            </p>

            <div className="mt-4 space-y-3">
              {cohortLeaderboard.map((item) => (
                <div key={item.rank} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50/80 border border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center font-black text-xs shrink-0 ${item.badgeColor}`}>
                      {item.rank}
                    </div>
                    <span className="text-xs font-extrabold text-slate-900 tracking-tight uppercase">
                      {item.name}
                    </span>
                  </div>
                  <span className="text-xs font-black text-slate-900">{item.score}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2 text-center">
            <button
              onClick={() => navigate('/student/leaderboard')}
              className="w-full inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-full border border-slate-200 text-slate-800 hover:bg-slate-50 font-extrabold text-xs transition-colors"
            >
              View Full Leaderboard <ChevronRight className="w-4 h-4 text-slate-500" />
            </button>
          </div>

        </div>

      </div>

      {/* 3. BOTTOM ROW: YOUR FOCUS THIS WEEK */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-base font-black text-slate-900">
            Your Focus This Week
          </h3>
          <span className="text-xs font-medium text-slate-500">
            • Refreshes Monday
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Card 1 */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-[#5338ec] text-white flex items-center justify-center shadow-md">
              <Lightbulb className="w-5 h-5 text-white" />
            </div>
            <h4 className="text-sm font-extrabold text-slate-900">
              Smooth out your pacing
            </h4>
            <p className="text-xs text-slate-600 font-medium leading-relaxed">
              Reduce filler words and link your sentences – a steady pace reads as confidence.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-[#5338ec] text-white flex items-center justify-center shadow-md">
              <Lightbulb className="w-5 h-5 text-white" />
            </div>
            <h4 className="text-sm font-extrabold text-slate-900">
              Tighten your grammar
            </h4>
            <p className="text-xs text-slate-600 font-medium leading-relaxed">
              Watch subject-verb agreement in longer sentences; pause once to check the verb.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-[#5338ec] text-white flex items-center justify-center shadow-md">
              <Lightbulb className="w-5 h-5 text-white" />
            </div>
            <h4 className="text-sm font-extrabold text-slate-900">
              Structure your answer
            </h4>
            <p className="text-xs text-slate-600 font-medium leading-relaxed">
              Use the open-anchor-close pattern: one hook, one anchor sentence, one closer.
            </p>
          </div>

        </div>
      </div>

    </div>
  );
};
