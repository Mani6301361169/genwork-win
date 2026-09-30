import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../../services/api';
import { Challenge } from '../../types';
import { Mic, ArrowRight, AlertCircle, Calendar } from 'lucide-react';

export const SpeakingChallenges: React.FC = () => {
  const navigate = useNavigate();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        const res = await apiFetch<{ challenges: Challenge[] }>('/challenges');
        setChallenges(res.challenges);
      } catch (err) {
        console.error('Failed to fetch Winnify challenges:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchChallenges();
  }, []);

  // Hardcoded past weekly challenges matching Image 2 timeline if API returns empty
  const weeklyTimeline = [
    {
      id: 'active-1',
      title: 'My Favourite App',
      description: 'Describe your favourite mobile app to someone who has never used it – what it does, how it works, and why you enjoy it.',
      isActive: true,
      timeLeft: '4d 08:04:16 left',
      dateRange: 'Current Week',
    },
    {
      id: 'past-1',
      title: 'Is Social Media Making Us Less Social?',
      description: 'We scroll, post, and like – but are we truly connecting? Is social media making us less social? Think about your own life. Take a stand and make your case – like you are on a TED stage.',
      isActive: false,
      dateRange: '14 - 20 Sep',
      isMissed: true,
    },
    {
      id: 'past-2',
      title: 'Sound and Mood',
      description: 'What kind of music or background sound do you usually listen to, and what do you like about it? Tell us how it makes you feel.',
      isActive: false,
      dateRange: '7 - 13 Sep',
      isMissed: true,
    },
    {
      id: 'past-3',
      title: 'My Calm Place',
      description: 'Describe a place where you feel calm or comfortable. Explain why it works for you.',
      isActive: false,
      dateRange: '31 Aug - 6 Sep',
      isMissed: true,
    },
  ];

  const itemsToRender = challenges.length >= 4 ? challenges.map((c, i) => ({
    id: c.id,
    title: c.title,
    description: c.description,
    isActive: i === 0,
    timeLeft: '4d 08:04:16 left',
    dateRange: i === 0 ? 'Current Week' : `${14 - i * 7} - ${20 - i * 7} Sep`,
    isMissed: i > 0,
  })) : weeklyTimeline;

  return (
    <div className="space-y-6 max-w-5xl mx-auto font-sans text-slate-900 pb-16">
      
      {/* TIMELINE CONTAINER */}
      <div className="relative pl-8 sm:pl-12 space-y-8 border-l-2 border-dashed border-indigo-300 dark:border-indigo-800 ml-4 sm:ml-6">
        
        {itemsToRender.map((item, idx) => (
          <div key={item.id} className="relative">
            
            {/* Timeline Microphone Node */}
            <div className={`absolute -left-[45px] sm:-left-[61px] top-4 w-9 h-9 rounded-full flex items-center justify-center border-2 border-white shadow-sm ${
              item.isActive ? 'bg-[#5338ec] text-white ring-4 ring-purple-100' : 'bg-indigo-100 text-indigo-600'
            }`}>
              <Mic className="w-4 h-4" />
            </div>

            {item.isActive ? (
              /* ACTIVE CURRENT WEEK HERO CARD */
              <div className="bg-gradient-to-r from-[#5338ec] to-[#6d4df6] text-white rounded-3xl p-6 sm:p-8 shadow-lg relative overflow-hidden border border-purple-400/20">
                
                <div className="space-y-4 max-w-2xl relative z-10">
                  <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                    "{item.title}"
                  </h2>
                  <p className="text-xs sm:text-sm font-medium text-purple-100 leading-relaxed">
                    {item.description}
                  </p>

                  <div className="flex items-center gap-3 pt-1">
                    <span className="px-3 py-1 rounded-full bg-[#22c55e] text-white font-extrabold text-xs">
                      Active
                    </span>
                    <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white font-bold text-xs">
                      {item.timeLeft}
                    </span>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={() => navigate(`/student/challenges/${item.id}`)}
                      className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white text-slate-900 hover:bg-slate-100 font-extrabold text-xs shadow-md transition-all"
                    >
                      Start Challenge <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Microphone Illustration */}
                <div className="hidden lg:flex absolute right-6 top-1/2 -translate-y-1/2 items-center justify-center w-32 h-32 rounded-full bg-white/10 backdrop-blur-md border-2 border-white/20">
                  <Mic className="w-12 h-12 text-white" />
                </div>

              </div>
            ) : (
              /* MISSED PAST WEEK CARD */
              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100 space-y-4">
                
                <h3 className="text-lg font-black text-slate-900 tracking-tight">
                  {item.title}
                </h3>
                
                <p className="text-xs font-medium text-slate-600 leading-relaxed max-w-3xl">
                  {item.description}
                </p>

                {/* Warning Pink Callout Box */}
                <div className="p-3 rounded-2xl bg-rose-50/80 border border-rose-100 text-rose-600 text-xs font-semibold leading-relaxed">
                  You didn't submit this week – practising now won't affect your rank or score.
                </div>

                {/* Footer Badges & Action */}
                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 font-bold text-xs border border-slate-200">
                    {item.dateRange}
                  </span>
                  
                  {item.isMissed && (
                    <span className="px-3 py-1 rounded-full bg-rose-500 text-white font-black text-xs">
                      Missed
                    </span>
                  )}

                  <button
                    onClick={() => navigate(`/student/challenges/${item.id}`)}
                    className="ml-auto px-5 py-2 rounded-xl bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-extrabold text-xs transition-colors"
                  >
                    Practice
                  </button>
                </div>

              </div>
            )}

          </div>
        ))}

      </div>

    </div>
  );
};
