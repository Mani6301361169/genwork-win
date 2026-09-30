import React, { useEffect, useState } from 'react';
import { apiFetch } from '../../services/api';
import { MessageSquare, Star } from 'lucide-react';
import { SkeletonLoader } from '../../components/common/SkeletonLoader';

export const AdminFeedback: React.FC = () => {
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const res = await apiFetch<{ feedbacks: any[] }>('/admin/feedbacks');
        setFeedbacks(res.feedbacks);
      } catch (err) {
        console.error('Failed to load feedback:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchFeedbacks();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
          <MessageSquare className="w-6 h-6 text-brand-500" /> Student Feedback & Mentoring Requests
        </h1>
        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
          Review student questions, mentoring requests, and technical suggestions.
        </p>
      </div>

      {isLoading ? (
        <SkeletonLoader count={3} />
      ) : feedbacks.length === 0 ? (
        <div className="bg-white dark:bg-navy-900 rounded-3xl p-12 text-center border border-slate-200 dark:border-slate-800">
          <p className="text-sm font-bold text-slate-600 dark:text-slate-400">No feedback submissions yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {feedbacks.map((fb) => (
            <div
              key={fb.id}
              className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-soft space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-300 font-extrabold text-[10px]">
                  {fb.category}
                </span>
                <span className="text-[10px] text-slate-400 font-semibold">{new Date(fb.createdAt).toLocaleDateString()}</span>
              </div>

              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">{fb.subject}</h3>
              <p className="text-xs text-slate-600 dark:text-slate-300">{fb.message}</p>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between text-[11px] font-bold text-slate-500">
                <span>Student: {fb.student?.fullName} ({fb.student?.department?.code})</span>
                <span className="text-amber-500">Rating: {fb.rating} / 5 ⭐</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
