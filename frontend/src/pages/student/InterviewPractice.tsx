import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../../services/api';
import { InterviewCategory, InterviewQuestion } from '../../types';
import { BrainCircuit, ChevronRight, Zap } from 'lucide-react';
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
    <div className="space-y-6 max-w-7xl mx-auto font-sans text-black">
      
      {/* Banner */}
      <div className="bg-black text-white rounded-3xl p-8 border-2 border-black shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-700 text-zinc-200 text-xs font-extrabold uppercase tracking-wider">
            <Zap className="w-3.5 h-3.5 text-white" /> AI Practice Arena & Interview Coach
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Interview Practice Arena & Simulator
          </h1>
          <p className="text-xs text-zinc-300 leading-relaxed font-medium">
            Practice HR, Technical, and Behavioral interview questions with real-time NLP speech analysis or test your placement readiness in our AI Simulator.
          </p>
        </div>

        <button
          onClick={() => navigate('/student/simulator')}
          className="shrink-0 inline-flex items-center justify-center gap-2 px-6 py-4 bg-white hover:bg-zinc-100 text-black rounded-2xl font-extrabold text-xs shadow-md transition-all border-2 border-white"
        >
          <BrainCircuit className="w-4 h-4" /> Launch AI Simulator
        </button>
      </div>

      {/* Domain Selection */}
      <div>
        <h2 className="text-xs font-extrabold uppercase tracking-widest text-black mb-3 px-1">
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
                className={`p-4 rounded-2xl border-2 border-black text-left transition-all ${
                  selectedCategory?.id === cat.id
                    ? 'bg-black text-white shadow-xs font-extrabold'
                    : 'bg-white text-black hover:bg-zinc-100'
                }`}
              >
                <div className="text-xs font-extrabold truncate">{cat.name}</div>
                <div className="text-[10px] mt-1 opacity-80 font-bold">{cat.totalQuestions} Questions</div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Question Explorer for Selected Category */}
      {selectedCategory && (
        <div className="bg-white border-2 border-black rounded-3xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b-2 border-black">
            <div>
              <h3 className="text-base font-extrabold text-black">
                {selectedCategory.name} Question Bank
              </h3>
              <p className="text-xs text-zinc-600 font-medium">{selectedCategory.description}</p>
            </div>
            <button
              onClick={() => navigate('/student/simulator')}
              className="text-xs font-extrabold text-black underline flex items-center gap-1"
            >
              Practice in Simulator <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {questions.map((q, idx) => (
              <div
                key={q.id}
                className="p-4 rounded-2xl bg-zinc-50 border-2 border-black space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-extrabold text-black uppercase">
                    Question #{idx + 1} • {q.difficulty}
                  </span>
                  <span className="text-[10px] font-bold text-zinc-500">Est. {q.estimatedMinutes} Mins</span>
                </div>
                <h4 className="text-xs font-extrabold text-black">{q.questionText}</h4>
                <div className="pt-2 border-t border-black text-[11px] text-zinc-800 font-medium">
                  <span className="font-extrabold text-black">Recommended Response Approach: </span>
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
