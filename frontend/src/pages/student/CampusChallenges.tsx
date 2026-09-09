import React, { useEffect, useState } from 'react';
import { apiFetch } from '../../services/api';
import { CampusChallenge } from '../../types';
import { Building2, CheckCircle2, Play, Trophy } from 'lucide-react';
import { SkeletonLoader } from '../../components/common/SkeletonLoader';
import { Link } from 'react-router-dom';

export const CampusChallenges: React.FC = () => {
  const [campusList, setCampusList] = useState<CampusChallenge[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCampus = async () => {
      try {
        const res = await apiFetch<{ campusChallenges: CampusChallenge[] }>('/analytics/campus');
        setCampusList(res.campusChallenges);
      } catch (err) {
        console.error('Failed to load campus challenges:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCampus();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Building2 className="w-6 h-6 text-brand-500" /> Campus Challenges
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            Department-specific campus recruitment practice suites created by college faculty and recruiters.
          </p>
        </div>
      </div>

      {isLoading ? (
        <SkeletonLoader count={4} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {campusList.map((item) => {
            const percentage = Math.round((item.completed / item.totalQuestions) * 100);
            return (
              <div
                key={item.id}
                className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-soft flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-300 font-extrabold text-[10px]">
                      {item.department} ({item.departmentCode})
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-extrabold text-[10px]">
                      {item.category}
                    </span>
                  </div>

                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Progress Bar & Counter */}
                <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex justify-between items-center text-xs font-bold">
                    <span className="text-slate-500">
                      Total: <span className="text-slate-900 dark:text-white">{item.totalQuestions} Questions</span>
                    </span>
                    <span className="text-emerald-600 dark:text-emerald-400">
                      Completed: {item.completed} | Remaining: {item.remaining}
                    </span>
                  </div>

                  <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${percentage}%` }} />
                  </div>
                </div>

                <Link
                  to="/student/challenges"
                  className="w-full py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold text-center transition-colors flex items-center justify-center gap-2"
                >
                  <Play className="w-3.5 h-3.5 fill-current" /> Start Practice
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
