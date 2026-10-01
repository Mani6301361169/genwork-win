import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../../services/api';
import { Challenge } from '../../types';
import { Mic, ArrowRight } from 'lucide-react';

export const SpeakingChallenges: React.FC = () => {
  const navigate = useNavigate();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [, setIsLoading] = useState(true);

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

  // Hardcoded past weekly challenges matching timeline if API returns empty
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

  const itemsToRender = challenges.length > 0 ? challenges.map((c, i) => ({
    id: c.id,
    title: c.title,
    description: c.description,
    isActive: i === 0 || !c.isOverdue,
    isOverdue: !!c.isOverdue,
    timeLeft: c.statusText || (i === 0 ? 'Active 1-week window' : 'Overdue (>1 week)'),
    dateRange: i === 0 ? 'Current Week' : `Week -${i}`,
  })) : weeklyTimeline;

  return (
    <div className="space-y-6 max-w-5xl mx-auto font-sans text-black dark:text-white pb-16">
      
      {/* TIMELINE CONTAINER */}
      <div className="relative pl-8 sm:pl-12 space-y-8 border-l-2 border-dashed border-black dark:border-white ml-4 sm:ml-6">
        
        {itemsToRender.map((item) => (
          <div key={item.id} className="relative">
            
            {/* Timeline Microphone Node */}
            <div className={`absolute -left-[45px] sm:-left-[61px] top-4 w-9 h-9 rounded-full flex items-center justify-center border-2 border-black dark:border-white shadow-sm ${
              item.isActive ? 'bg-black text-white dark:bg-white dark:text-black' : 'bg-neutral-200 text-black dark:bg-neutral-800 dark:text-white'
            }`}>
              <Mic className="w-4 h-4" />
            </div>

            {item.isActive ? (
              /* ACTIVE CURRENT WEEK HERO CARD */
              <div className="bg-black text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden border-2 border-black dark:border-white">
                
                <div className="space-y-4 max-w-2xl relative z-10">
                  <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                    "{item.title}"
                  </h2>
                  <p className="text-xs sm:text-sm font-bold text-neutral-300 leading-relaxed">
                    {item.description}
                  </p>

                  <div className="flex items-center gap-3 pt-1">
                    <span className="px-3 py-1 rounded-full bg-white text-black font-black text-xs border border-white">
                      Active (Current Week)
                    </span>
                    <span className="px-3 py-1 rounded-full bg-neutral-800 text-white font-bold text-xs border border-neutral-700">
                      {item.timeLeft}
                    </span>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={() => navigate(`/student/challenges/${item.id}`)}
                      className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white text-black hover:bg-neutral-200 font-black text-xs shadow-md transition-all border-2 border-white"
                    >
                      Start Challenge <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Microphone Illustration */}
                <div className="hidden lg:flex absolute right-6 top-1/2 -translate-y-1/2 items-center justify-center w-32 h-32 rounded-full bg-neutral-900 border-2 border-white">
                  <Mic className="w-12 h-12 text-white" />
                </div>

              </div>
            ) : (
              /* OVERDUE PAST WEEK CARD - FULLY COMPLETABLE */
              <div className="bg-white dark:bg-neutral-900 rounded-3xl p-6 sm:p-8 shadow-sm border-2 border-black dark:border-white space-y-4">
                
                <h3 className="text-lg font-black text-black dark:text-white tracking-tight">
                  "{item.title}"
                </h3>
                
                <p className="text-xs font-bold text-neutral-600 dark:text-neutral-400 leading-relaxed max-w-3xl">
                  {item.description}
                </p>

                {/* Overdue Warning Callout Box */}
                <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border-2 border-amber-500 text-amber-900 dark:text-amber-200 text-xs font-black leading-relaxed flex items-center gap-2">
                  <span>⚠️ <strong>Overdue Notice:</strong> This challenge was posted over 1 week ago. You can still practice, record, and submit to complete it and earn your score!</span>
                </div>

                {/* Footer Badges & Action */}
                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <span className="px-3 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800 text-black dark:text-white font-black text-xs border-2 border-black dark:border-white">
                    {item.dateRange}
                  </span>
                  
                  <span className="px-3 py-1 rounded-full bg-amber-200 dark:bg-amber-800 text-amber-900 dark:text-amber-100 font-black text-xs border-2 border-amber-500">
                    Overdue (&gt;1 week)
                  </span>

                  <button
                    onClick={() => navigate(`/student/challenges/${item.id}`)}
                    className="ml-auto px-6 py-2.5 rounded-xl bg-black text-white dark:bg-white dark:text-black hover:bg-neutral-800 dark:hover:bg-neutral-200 border-2 border-black font-black text-xs transition-colors shadow-sm flex items-center gap-1.5"
                  >
                    Complete Challenge <ArrowRight className="w-4 h-4" />
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
