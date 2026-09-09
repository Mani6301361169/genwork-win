import React, { useEffect, useState } from 'react';
import { apiFetch } from '../../services/api';
import { ChallengeAttempt } from '../../types';
import { History as HistoryIcon, Clock, CheckCircle2, ChevronRight, X, Sparkles } from 'lucide-react';
import { SkeletonLoader } from '../../components/common/SkeletonLoader';

export const History: React.FC = () => {
  const [attempts, setAttempts] = useState<ChallengeAttempt[]>([]);
  const [selectedAttempt, setSelectedAttempt] = useState<ChallengeAttempt | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await apiFetch<{ attempts: ChallengeAttempt[] }>('/challenges/history');
        setAttempts(res.attempts);
      } catch (err) {
        console.error('Failed to fetch history:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchHistory();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
          <HistoryIcon className="w-6 h-6 text-brand-500" /> Attempt History
        </h1>
        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
          Review all your past speaking practice recordings, AI scores, and feedback logs.
        </p>
      </div>

      {isLoading ? (
        <SkeletonLoader count={4} />
      ) : attempts.length === 0 ? (
        <div className="bg-white dark:bg-navy-900 rounded-3xl p-12 text-center border border-slate-200 dark:border-slate-800">
          <p className="text-sm font-bold text-slate-600 dark:text-slate-400">No speaking attempts recorded yet.</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-soft overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                  <th className="py-3.5 px-6">Challenge Name</th>
                  <th className="py-3.5 px-6">Category</th>
                  <th className="py-3.5 px-6">Date</th>
                  <th className="py-3.5 px-6">Duration</th>
                  <th className="py-3.5 px-6">Score</th>
                  <th className="py-3.5 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs font-medium">
                {attempts.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-4 px-6 font-bold text-slate-900 dark:text-white">
                      {item.challengeName}
                    </td>
                    <td className="py-4 px-6">
                      <span className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] font-bold">
                        {item.category}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-slate-500">{item.date}</td>
                    <td className="py-4 px-6 text-slate-500">{item.duration}</td>
                    <td className="py-4 px-6 font-extrabold text-brand-600 dark:text-brand-400">
                      {item.score} / 100
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => setSelectedAttempt(item)}
                        className="inline-flex items-center gap-1 text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline"
                      >
                        View Feedback <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Attempt Review Modal */}
      {selectedAttempt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl relative animate-in zoom-in-95 space-y-4">
            <button
              onClick={() => setSelectedAttempt(null)}
              className="absolute top-6 right-6 p-1.5 rounded-xl text-slate-500 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <span className="px-2.5 py-0.5 rounded-full bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-300 font-extrabold text-[10px]">
              {selectedAttempt.category} • {selectedAttempt.date}
            </span>

            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
              "{selectedAttempt.challengeName}"
            </h2>

            <div className="flex items-center gap-2 p-3 bg-brand-50 dark:bg-brand-950/40 rounded-2xl">
              <span className="text-2xl font-extrabold text-brand-600">{selectedAttempt.score} / 100</span>
              <span className="text-xs font-bold text-slate-600 dark:text-slate-400 ml-2">Overall Score</span>
            </div>

            {/* Transcript */}
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl text-xs space-y-1">
              <p className="font-bold text-slate-900 dark:text-white">Your Transcript Response:</p>
              <p className="text-slate-700 dark:text-slate-300 italic">"{selectedAttempt.transcript}"</p>
            </div>

            {/* AI Feedback */}
            {selectedAttempt.feedback?.strengths && (
              <div className="space-y-2 text-xs">
                <p className="font-bold text-emerald-600 dark:text-emerald-400">What You Did Well:</p>
                <ul className="list-disc pl-5 text-slate-700 dark:text-slate-300 space-y-1">
                  {selectedAttempt.feedback.strengths.map((s, idx) => (
                    <li key={idx}>{s}</li>
                  ))}
                </ul>
              </div>
            )}

            <button
              onClick={() => setSelectedAttempt(null)}
              className="w-full py-3 bg-brand-600 text-white font-bold rounded-2xl text-xs"
            >
              Close Attempt Review
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
