import React, { useEffect, useState } from 'react';
import { apiFetch } from '../../services/api';
import { ChallengeAttempt } from '../../types';
import { History as HistoryIcon, ChevronRight, X } from 'lucide-react';
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
    <div className="space-y-6 max-w-7xl mx-auto font-sans text-black">
      <div>
        <h1 className="text-2xl font-extrabold text-black tracking-tight flex items-center gap-2">
          <HistoryIcon className="w-6 h-6 text-black" /> Practice Attempt History
        </h1>
        <p className="text-xs text-zinc-700 font-medium mt-1">
          Review all your past speaking practice recordings, AI scores, and feedback logs.
        </p>
      </div>

      {isLoading ? (
        <SkeletonLoader count={4} />
      ) : attempts.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border-2 border-black">
          <p className="text-sm font-extrabold text-black">No speaking attempts recorded yet.</p>
        </div>
      ) : (
        <div className="bg-white border-2 border-black rounded-3xl shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-black text-white border-b-2 border-black text-[11px] font-extrabold uppercase tracking-wider">
                  <th className="py-3.5 px-6">Challenge Name</th>
                  <th className="py-3.5 px-6">Category</th>
                  <th className="py-3.5 px-6">Date</th>
                  <th className="py-3.5 px-6">Duration</th>
                  <th className="py-3.5 px-6">Score</th>
                  <th className="py-3.5 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 text-xs font-medium">
                {attempts.map((item) => (
                  <tr key={item.id} className="hover:bg-zinc-50 transition-colors">
                    <td className="py-4 px-6 font-extrabold text-black">
                      {item.challengeName}
                    </td>
                    <td className="py-4 px-6">
                      <span className="px-2.5 py-0.5 rounded bg-black text-white text-[10px] font-extrabold border border-black">
                        {item.category}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-zinc-700 font-bold">{item.date}</td>
                    <td className="py-4 px-6 text-zinc-700 font-bold">{item.duration}</td>
                    <td className="py-4 px-6 font-extrabold text-black text-sm">
                      {item.score} / 100
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => setSelectedAttempt(item)}
                        className="inline-flex items-center gap-1 text-xs font-extrabold text-black underline hover:text-zinc-700"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-white border-2 border-black rounded-3xl p-6 sm:p-8 max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl relative animate-in zoom-in-95 space-y-4 text-black">
            <button
              onClick={() => setSelectedAttempt(null)}
              className="absolute top-6 right-6 p-1.5 rounded-xl text-black hover:bg-zinc-100 border border-black"
            >
              <X className="w-5 h-5" />
            </button>

            <span className="px-2.5 py-0.5 rounded-md bg-black text-white font-extrabold text-[10px] border border-black">
              {selectedAttempt.category} • {selectedAttempt.date}
            </span>

            <h2 className="text-xl font-extrabold text-black">
              "{selectedAttempt.challengeName}"
            </h2>

            <div className="flex items-center gap-2 p-4 bg-zinc-100 border-2 border-black rounded-2xl">
              <span className="text-2xl font-extrabold text-black">{selectedAttempt.score} / 100</span>
              <span className="text-xs font-bold text-zinc-700 ml-2">Overall Score</span>
            </div>

            {/* Transcript */}
            <div className="p-4 bg-zinc-50 border-2 border-black rounded-2xl text-xs space-y-1">
              <p className="font-extrabold text-black">Spoken Transcript Response:</p>
              <p className="text-black italic font-medium">"{selectedAttempt.transcript}"</p>
            </div>

            {/* AI Feedback */}
            {selectedAttempt.feedback?.strengths && (
              <div className="space-y-2 text-xs">
                <p className="font-extrabold text-black">What You Did Well:</p>
                <ul className="list-disc pl-5 text-zinc-800 font-medium space-y-1">
                  {selectedAttempt.feedback.strengths.map((s, idx) => (
                    <li key={idx}>{s}</li>
                  ))}
                </ul>
              </div>
            )}

            <button
              onClick={() => setSelectedAttempt(null)}
              className="w-full py-3.5 bg-black text-white font-extrabold rounded-2xl text-xs border-2 border-black"
            >
              Close Attempt Review
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
