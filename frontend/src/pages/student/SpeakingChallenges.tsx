import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiFetch } from '../../services/api';
import { Challenge } from '../../types';
import { Mic, Search, Clock, CheckCircle2, Globe } from 'lucide-react';
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
        console.error('Failed to fetch speaking challenges:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchChallenges();
  }, [activeCategory, activeDifficulty, searchTerm]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans text-black">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-black tracking-tight flex items-center gap-2">
            <Globe className="w-6 h-6 text-black" /> Global Speaking Challenges
          </h1>
          <p className="text-xs text-zinc-700 font-medium mt-1">
            Record 60-90 second prompts to receive real NLP speech analysis on fluency, grammar, and vocal confidence.
          </p>
        </div>
      </div>

      {/* Search & Difficulty Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-4 rounded-2xl border-2 border-black shadow-xs">
        
        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-black" />
          <input
            type="text"
            placeholder="Search topic title or keyword..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border-2 border-black bg-white text-black text-xs font-bold focus:outline-none"
          />
        </div>

        {/* Difficulty Selector */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
          <span className="text-xs font-extrabold text-black mr-1 shrink-0 uppercase tracking-wider">Difficulty:</span>
          {difficulties.map((diff) => (
            <button
              key={diff}
              onClick={() => setActiveDifficulty(diff)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all shrink-0 border-2 border-black ${
                activeDifficulty === diff
                  ? 'bg-black text-white shadow-xs'
                  : 'bg-white text-black hover:bg-zinc-100'
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
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all shrink-0 whitespace-nowrap border-2 border-black ${
              activeCategory === cat
                ? 'bg-black text-white shadow-xs'
                : 'bg-white text-black hover:bg-zinc-100'
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
        <div className="bg-white rounded-3xl p-12 text-center border-2 border-black">
          <p className="text-sm font-extrabold text-black">No speaking challenges found matching your query filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {challenges.map((ch) => (
            <div
              key={ch.id}
              className="bg-white border-2 border-black rounded-3xl p-6 shadow-xs flex flex-col justify-between hover:bg-black hover:text-white transition-all group"
            >
              <div>
                {/* Header Pills */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="px-2.5 py-0.5 rounded-md bg-black text-white group-hover:bg-white group-hover:text-black font-extrabold text-[10px] border border-black">
                    {ch.category}
                  </span>

                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-md bg-zinc-100 text-black group-hover:bg-zinc-900 group-hover:text-white border border-black font-extrabold text-[10px]">
                      {ch.difficulty}
                    </span>

                    {ch.isCompleted && (
                      <span className="flex items-center gap-1 text-[10px] font-extrabold text-black group-hover:text-white">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Done
                      </span>
                    )}
                  </div>
                </div>

                <h3 className="text-base font-extrabold tracking-tight">
                  {ch.title}
                </h3>
                <p className="mt-2 text-xs text-zinc-700 group-hover:text-zinc-300 leading-relaxed line-clamp-3 font-medium">
                  {ch.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t-2 border-black group-hover:border-zinc-800 flex items-center justify-between">
                <span className="flex items-center gap-1 text-xs font-extrabold text-zinc-600 group-hover:text-zinc-400">
                  <Clock className="w-3.5 h-3.5" /> {ch.durationSeconds}s Target
                </span>

                <Link
                  to={`/student/challenges/${ch.id}`}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-black text-white group-hover:bg-white group-hover:text-black rounded-xl text-xs font-extrabold shadow-xs transition-colors border-2 border-black"
                >
                  <Mic className="w-3.5 h-3.5" /> Start Practice
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
