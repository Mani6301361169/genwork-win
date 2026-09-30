import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { apiFetch } from '../../services/api';
import { Challenge } from '../../types';
import { useNavigate } from 'react-router-dom';
import {
  Mic,
  Lightbulb,
  ArrowRight,
  TrendingDown,
  ChevronRight
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
    { rank: 1, name: 'JASMINE MOHAMMED', score: 78, badgeColor: 'bg-black text-white dark:bg-white dark:text-black' },
    { rank: 2, name: 'KOWSHIK NAIDU VALISETTY', score: 71, badgeColor: 'bg-neutral-200 text-black dark:bg-neutral-800 dark:text-white' },
    { rank: 3, name: 'ABHIRAMI PRATIVADA', score: 69, badgeColor: 'bg-neutral-100 text-black dark:bg-neutral-900 dark:text-white' },
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto font-sans text-black dark:text-white pb-12">
      
      {/* PAGE SUBTITLE */}
      <div>
        <p className="text-xs font-black text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">Time to Shine</p>
      </div>

      {/* 1. THIS WEEK'S CHALLENGE HERO BANNER */}
      <div className="bg-black text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden border-2 border-black dark:border-white">
        
        <div className="relative z-10 space-y-4 max-w-2xl">
          <p className="text-xs font-black uppercase tracking-widest text-neutral-300">
            This Week's Challenge
          </p>

          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            "{featuredChallenge?.title || 'My Favourite App'}"
          </h1>

          <p className="text-xs sm:text-sm font-bold text-neutral-300 leading-relaxed">
            {featuredChallenge?.description || 'Describe your favourite mobile app to someone who has never used it – what it does, how it works, and why you enjoy it.'}
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <span className="px-3 py-1 rounded-full bg-white text-black font-black text-xs border border-white">
              Active
            </span>
            <span className="px-3 py-1 rounded-full bg-neutral-800 text-white font-bold text-xs border border-neutral-700">
              4d 08:04:48 left
            </span>
          </div>

          <div className="pt-2">
            <button
              onClick={() => navigate(featuredChallenge ? `/student/challenges/${featuredChallenge.id}` : '/student/challenges')}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-black hover:bg-neutral-200 font-black text-xs shadow-md transition-all border-2 border-white"
            >
              Start Challenge <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right Microphone Graphic Illustration */}
        <div className="hidden lg:flex absolute right-8 top-1/2 -translate-y-1/2 items-center justify-center w-36 h-36 rounded-full bg-neutral-900 border-2 border-white">
          <div className="w-20 h-20 rounded-full bg-neutral-800 border border-white flex items-center justify-center">
            <Mic className="w-10 h-10 text-white" />
          </div>
        </div>

      </div>

      {/* 2. MIDDLE ROW: WINSPEAK SCORE (LEFT) & COHORT LEADERBOARD (RIGHT) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* WINSPEAK SCORE CARD (LEFT 50%) */}
        <div className="md:col-span-6 bg-black dark:bg-neutral-900 text-white rounded-3xl p-6 sm:p-8 shadow-md border-2 border-black dark:border-white flex flex-col justify-between space-y-6">
          
          <div className="space-y-4">
            <p className="text-xs font-black uppercase tracking-widest text-neutral-300">
              WINSPEAK SCORE
            </p>

            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-black tracking-tight">{overallScore}</span>
              <span className="text-xl font-black text-neutral-400">/ 100</span>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-neutral-800 text-white text-xs font-black border border-neutral-700">
              <TrendingDown className="w-3.5 h-3.5 text-neutral-300" /> -10 vs last week
            </div>

            <p className="text-xs font-bold text-neutral-400">
              5-week rolling average
            </p>
          </div>

          {/* Strongest & Weakest Sub-cards */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="p-3.5 bg-neutral-900 border border-neutral-700 rounded-2xl space-y-1">
              <p className="text-[10px] font-black uppercase tracking-wider text-neutral-400">STRONGEST</p>
              <p className="text-sm font-black text-white truncate">Relevancy</p>
            </div>

            <div className="p-3.5 bg-neutral-900 border border-neutral-700 rounded-2xl space-y-1">
              <p className="text-[10px] font-black uppercase tracking-wider text-neutral-400">WEAKEST</p>
              <p className="text-sm font-black text-white truncate">Grammar</p>
            </div>
          </div>

        </div>

        {/* COHORT LEADERBOARD CARD (RIGHT 50%) */}
        <div className="md:col-span-6 bg-white dark:bg-neutral-900 text-black dark:text-white rounded-3xl p-6 sm:p-8 shadow-sm border-2 border-black dark:border-white flex flex-col justify-between space-y-4">
          
          <div>
            <h3 className="text-base font-black text-black dark:text-white">
              Cohort Leaderboard
            </h3>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 font-bold">
              AI-T2 · T2 · of 6 students
            </p>

            <div className="mt-4 space-y-3">
              {cohortLeaderboard.map((item) => (
                <div key={item.rank} className="flex items-center justify-between p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-800 border-2 border-black dark:border-white">
                  <div className="flex items-center gap-3">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center font-black text-xs shrink-0 border border-black ${item.badgeColor}`}>
                      {item.rank}
                    </div>
                    <span className="text-xs font-black text-black dark:text-white tracking-tight uppercase">
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
              className="w-full inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-full border-2 border-black dark:border-white text-black dark:text-white bg-white dark:bg-neutral-900 hover:bg-neutral-100 dark:hover:bg-neutral-800 font-black text-xs transition-colors"
            >
              View Full Leaderboard <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>

      {/* 3. BOTTOM ROW: YOUR FOCUS THIS WEEK */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-base font-black text-black dark:text-white">
            Your Focus This Week
          </h3>
          <span className="text-xs font-bold text-neutral-600 dark:text-neutral-400">
            • Refreshes Monday
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Card 1 */}
          <div className="bg-white dark:bg-neutral-900 rounded-3xl p-6 shadow-sm border-2 border-black dark:border-white space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-black text-white dark:bg-white dark:text-black flex items-center justify-center shadow-md border border-black">
              <Lightbulb className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-black text-black dark:text-white">
              Smooth out your pacing
            </h4>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 font-bold leading-relaxed">
              Reduce filler words and link your sentences – a steady pace reads as confidence.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white dark:bg-neutral-900 rounded-3xl p-6 shadow-sm border-2 border-black dark:border-white space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-black text-white dark:bg-white dark:text-black flex items-center justify-center shadow-md border border-black">
              <Lightbulb className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-black text-black dark:text-white">
              Tighten your grammar
            </h4>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 font-bold leading-relaxed">
              Watch subject-verb agreement in longer sentences; pause once to check the verb.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white dark:bg-neutral-900 rounded-3xl p-6 shadow-sm border-2 border-black dark:border-white space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-black text-white dark:bg-white dark:text-black flex items-center justify-center shadow-md border border-black">
              <Lightbulb className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-black text-black dark:text-white">
              Structure your answer
            </h4>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 font-bold leading-relaxed">
              Use the open-anchor-close pattern: one hook, one anchor sentence, one closer.
            </p>
          </div>

        </div>
      </div>

    </div>
  );
};
