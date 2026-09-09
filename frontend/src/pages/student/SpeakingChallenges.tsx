import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiFetch } from '../../services/api';
import { Challenge } from '../../types';
import { Mic, Search, Clock, CheckCircle2, Sparkles } from 'lucide-react';
import { SkeletonLoader } from '../../components/common/SkeletonLoader';

export const SpeakingChallenges: React.FC = () => {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeDifficulty, setActiveDifficulty] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const categories = [
    'All',
    'Daily Life',
    'Technology',
    'Education',
    'Career',
    'Leadership',
    'Opinion',
    'Communication',
    'Current Topics',
    'Personal Experience',
  ];

  const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced'];

  useEffect(() => {
    const fetchChallenges = async () => {
      setIsLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (activeCategory !== 'All') queryParams.append('category', activeCategory);
        if (activeDifficulty !== 'All') queryParams.append('difficulty', activeDifficulty);
        if (searchTerm) queryParams.append('search', searchTerm);

        const res = await apiFetch<{ challenges: Challenge[] }>(`/challenges?${queryParams.toString()}`);
        setChallenges(res.challenges);
      } catch (err) {
        console.error('Failed to fetch challenges:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchChallenges();
  }, [activeCategory, activeDifficulty, searchTerm]);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Mic className="w-6 h-6 text-brand-500" /> Speaking Challenges
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            Record 60-90 second prompts to get AI analysis on your fluency, grammar, and confidence.
          </p>
        </div>
      </div>

      {/* Search & Difficulty Bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white dark:bg-navy-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-soft">
        
        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search topics or keywords..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-brand-500 focus:outline-none"
          />
        </div>

        {/* Difficulty Selector */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
          <span className="text-xs font-bold text-slate-500 mr-1 shrink-0">Difficulty:</span>
          {difficulties.map((diff) => (
            <button
              key={diff}
              onClick={() => setActiveDifficulty(diff)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                activeDifficulty === diff
                  ? 'bg-brand-500 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              {diff}
            </button>
          ))}
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 whitespace-nowrap ${
              activeCategory === cat
                ? 'bg-gradient-to-r from-brand-600 to-accent-600 text-white shadow-soft'
                : 'bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Challenges Grid */}
      {isLoading ? (
        <SkeletonLoader count={6} />
      ) : challenges.length === 0 ? (
        <div className="bg-white dark:bg-navy-900 rounded-3xl p-12 text-center border border-slate-200 dark:border-slate-800">
          <p className="text-sm font-bold text-slate-600 dark:text-slate-400">No challenges found matching your filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {challenges.map((ch) => (
            <div
              key={ch.id}
              className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-soft flex flex-col justify-between hover:border-brand-300 dark:hover:border-brand-700 transition-all group"
            >
              <div>
                {/* Header Pills */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="px-2.5 py-0.5 rounded-full bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-300 font-extrabold text-[10px]">
                    {ch.category}
                  </span>

                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2.5 py-0.5 rounded-full font-extrabold text-[10px] ${
                        ch.difficulty === 'Beginner'
                          ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                          : ch.difficulty === 'Intermediate'
                          ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                          : 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300'
                      }`}
                    >
                      {ch.difficulty}
                    </span>

                    {ch.isCompleted && (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Done
                      </span>
                    )}
                  </div>
                </div>

                <h3 className="text-base font-extrabold text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                  {ch.title}
                </h3>
                <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-3">
                  {ch.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="flex items-center gap-1 text-xs font-bold text-slate-500">
                  <Clock className="w-3.5 h-3.5" /> {ch.durationSeconds} Seconds
                </span>

                <Link
                  to={`/student/challenges/${ch.id}`}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
                >
                  <Mic className="w-3.5 h-3.5" /> Start Challenge
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
