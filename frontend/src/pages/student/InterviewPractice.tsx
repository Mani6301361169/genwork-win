import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { apiFetch } from '../../services/api';
import { InterviewCategory, InterviewQuestion } from '../../types';
import { BrainCircuit, Play, Code, Users, Award, ChevronRight, Sparkles } from 'lucide-react';
import { SkeletonLoader } from '../../components/common/SkeletonLoader';

export const InterviewPractice: React.FC = () => {
  const [categories, setCategories] = useState<InterviewCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<InterviewCategory | null>(null);
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await apiFetch<{ categories: InterviewCategory[] }>('/interviews/categories');
        setCategories(res.categories);
        if (res.categories.length > 0) {
          setSelectedCategory(res.categories[0]);
        }
      } catch (err) {
        console.error('Failed to load interview categories:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchQuestions = async () => {
      if (!selectedCategory) return;
      try {
        const res = await apiFetch<{ questions: InterviewQuestion[] }>(
          `/interviews/categories/${selectedCategory.id}/questions`
        );
        setQuestions(res.questions);
      } catch (err) {
        console.error('Failed to fetch questions:', err);
      }
    };
    fetchQuestions();
  }, [selectedCategory]);

  return (
    <div className="space-y-6">
      
      {/* Banner */}
      <div className="bg-gradient-to-r from-brand-900 via-indigo-950 to-navy-900 rounded-3xl p-6 sm:p-8 text-white shadow-soft flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-brand-200 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-accent-400" /> Interactive Interview Coach
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Interview Practice & Simulator
          </h1>
          <p className="text-xs text-brand-100 leading-relaxed font-medium">
            Practice HR, Technical, and Behavioral questions with real-time AI feedback or test yourself in our full Interview Simulator.
          </p>
        </div>

        <button
          onClick={() => navigate('/student/simulator')}
          className="shrink-0 inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-accent-500 to-purple-600 hover:from-accent-600 hover:to-purple-700 text-white rounded-2xl font-bold text-xs shadow-glow transition-all"
        >
          <BrainCircuit className="w-4 h-4" /> Start AI Simulator
        </button>
      </div>

      {/* Category Grid */}
      <div>
        <h2 className="text-xs font-extrabold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-3 px-1">
          Select Interview Domain
        </h2>

        {isLoading ? (
          <SkeletonLoader count={3} />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat)}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  selectedCategory?.id === cat.id
                    ? 'bg-brand-500 text-white border-brand-500 shadow-soft font-bold'
                    : 'bg-white dark:bg-navy-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-brand-300'
                }`}
              >
                <div className="text-xs font-extrabold truncate">{cat.name}</div>
                <div className="text-[10px] mt-1 opacity-80">{cat.totalQuestions} Questions</div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Question Explorer for Selected Category */}
      {selectedCategory && (
        <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-soft space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                {selectedCategory.name} Question Bank
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">{selectedCategory.description}</p>
            </div>
            <button
              onClick={() => navigate('/student/simulator')}
              className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
            >
              Practice in Simulator <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {questions.map((q, idx) => (
              <div
                key={q.id}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-extrabold text-brand-600 dark:text-brand-400">
                    Question #{idx + 1} • {q.difficulty}
                  </span>
                  <span className="text-[10px] font-bold text-slate-500">Est. {q.estimatedMinutes} Mins</span>
                </div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">{q.questionText}</h4>
                <div className="pt-2 border-t border-slate-200/40 dark:border-slate-700/40 text-[11px] text-slate-600 dark:text-slate-400">
                  <span className="font-bold text-slate-800 dark:text-slate-200">Recommended Approach: </span>
                  {q.sampleAnswer}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
