import React, { useEffect, useState } from 'react';
import { apiFetch } from '../../services/api';
import { LearningContent } from '../../types';
import { BookOpen, Clock, X } from 'lucide-react';
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
    <div className="space-y-6 max-w-7xl mx-auto font-sans text-black">
      <div>
        <h1 className="text-2xl font-extrabold text-black tracking-tight flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-black" /> Learning Management & Skill Guides
        </h1>
        <p className="text-xs text-zinc-700 font-medium mt-1">
          Bite-sized 5-minute guides on communication, interview frameworks, resume building, and placement readiness strategies.
        </p>
      </div>

      {/* Categories */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all shrink-0 whitespace-nowrap border-2 border-black ${
              selectedCategory === cat
                ? 'bg-black text-white shadow-xs'
                : 'bg-white text-black hover:bg-zinc-100'
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
              className="bg-white border-2 border-black rounded-3xl p-6 shadow-xs flex flex-col justify-between hover:bg-black hover:text-white transition-all group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-md bg-black text-white group-hover:bg-white group-hover:text-black font-extrabold text-[10px] border border-black">
                    {item.category}
                  </span>
                  <span className="flex items-center gap-1 text-[11px] font-extrabold text-zinc-600 group-hover:text-zinc-400">
                    <Clock className="w-3.5 h-3.5" /> {item.estimatedMinutes} min
                  </span>
                </div>

                <h3 className="text-base font-extrabold leading-snug">
                  {item.title}
                </h3>
                <p className="text-xs text-zinc-700 group-hover:text-zinc-300 line-clamp-3 leading-relaxed font-medium">
                  {item.description}
                </p>
              </div>

              <button
                onClick={() => setActiveItem(item)}
                className="mt-6 w-full py-3 bg-black text-white group-hover:bg-white group-hover:text-black rounded-xl text-xs font-extrabold transition-colors border-2 border-black"
              >
                Read Learning Guide
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Guide Reader Modal */}
      {activeItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-white border-2 border-black rounded-3xl p-6 sm:p-8 max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl relative animate-in zoom-in-95 text-black">
            <button
              onClick={() => setActiveItem(null)}
              className="absolute top-6 right-6 p-1.5 rounded-xl text-black hover:bg-zinc-100 border border-black"
            >
              <X className="w-5 h-5" />
            </button>

            <span className="px-2.5 py-0.5 rounded-md bg-black text-white font-extrabold text-[10px] border border-black">
              {activeItem.category} • {activeItem.estimatedMinutes} min read
            </span>

            <h2 className="text-xl font-extrabold text-black mt-3 mb-4">
              {activeItem.title}
            </h2>

            <div className="text-xs text-zinc-900 leading-relaxed whitespace-pre-line space-y-3 font-medium">
              {activeItem.bodyText}
            </div>

            <button
              onClick={() => setActiveItem(null)}
              className="mt-6 w-full py-3.5 bg-black text-white font-extrabold rounded-2xl text-xs border-2 border-black"
            >
              Mark Completed & Continue
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
