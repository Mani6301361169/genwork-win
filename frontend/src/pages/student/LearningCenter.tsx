import React, { useEffect, useState } from 'react';
import { apiFetch } from '../../services/api';
import { LearningContent } from '../../types';
import { BookOpen, Clock, Award, X, Sparkles } from 'lucide-react';
import { SkeletonLoader } from '../../components/common/SkeletonLoader';

export const LearningCenter: React.FC = () => {
  const [items, setItems] = useState<LearningContent[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeItem, setActiveItem] = useState<LearningContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const categories = [
    'All',
    'Communication',
    'English',
    'Interview Preparation',
    'Resume Building',
    'Aptitude',
    'Technical Skills',
    'Soft Skills',
    'Placement Preparation',
  ];

  useEffect(() => {
    const fetchLearning = async () => {
      setIsLoading(true);
      try {
        const param = selectedCategory !== 'All' ? `?category=${encodeURIComponent(selectedCategory)}` : '';
        const res = await apiFetch<{ learningContent: LearningContent[] }>(`/analytics/learning${param}`);
        setItems(res.learningContent);
      } catch (err) {
        console.error('Failed to load learning content:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLearning();
  }, [selectedCategory]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-brand-500" /> Learning Center
        </h1>
        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
          Bite-sized 5-minute guides on communication, interview frameworks, resume building, and placement strategies.
        </p>
      </div>

      {/* Categories */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 whitespace-nowrap ${
              selectedCategory === cat
                ? 'bg-brand-600 text-white shadow-soft'
                : 'bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      {isLoading ? (
        <SkeletonLoader count={4} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-soft flex flex-col justify-between hover:border-brand-400 transition-all"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-300 font-extrabold text-[10px]">
                    {item.category}
                  </span>
                  <span className="flex items-center gap-1 text-[11px] font-bold text-slate-500">
                    <Clock className="w-3.5 h-3.5" /> {item.estimatedMinutes} min
                  </span>
                </div>

                <h3 className="text-base font-extrabold text-slate-900 dark:text-white leading-snug">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <button
                onClick={() => setActiveItem(item)}
                className="mt-6 w-full py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-brand-600 hover:text-white dark:hover:bg-brand-600 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-bold transition-all"
              >
                Start Learning
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Guide Reader Modal */}
      {activeItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl relative animate-in zoom-in-95">
            <button
              onClick={() => setActiveItem(null)}
              className="absolute top-6 right-6 p-1.5 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <span className="px-2.5 py-0.5 rounded-full bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-300 font-extrabold text-[10px]">
              {activeItem.category} • {activeItem.estimatedMinutes} min read
            </span>

            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white mt-3 mb-4">
              {activeItem.title}
            </h2>

            <div className="prose dark:prose-invert text-xs text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line space-y-3">
              {activeItem.bodyText}
            </div>

            <button
              onClick={() => setActiveItem(null)}
              className="mt-6 w-full py-3 bg-brand-600 text-white font-bold rounded-2xl text-xs"
            >
              Got It, Completed!
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
