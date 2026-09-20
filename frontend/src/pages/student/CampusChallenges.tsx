import React, { useEffect, useState } from 'react';
import { apiFetch } from '../../services/api';
import { CampusChallenge } from '../../types';
import { Building2, Play } from 'lucide-react';
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
    <div className="space-y-6 max-w-7xl mx-auto font-sans text-black">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-black tracking-tight flex items-center gap-2">
            <Building2 className="w-6 h-6 text-black" /> Departmental Campus Challenges
          </h1>
          <p className="text-xs text-zinc-700 font-medium mt-1">
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
                className="bg-white border-2 border-black rounded-3xl p-6 shadow-xs flex flex-col justify-between space-y-4 hover:bg-black hover:text-white transition-all group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-black text-white group-hover:bg-white group-hover:text-black font-extrabold text-[10px] border border-black">
                      {item.department} ({item.departmentCode})
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-zinc-100 text-black group-hover:bg-zinc-900 group-hover:text-white font-extrabold text-[10px] border border-black">
                      {item.category}
                    </span>
                  </div>

                  <h3 className="text-base font-extrabold tracking-tight">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-xs text-zinc-700 group-hover:text-zinc-300 leading-relaxed font-medium">
                    {item.description}
                  </p>
                </div>

                {/* Progress Bar & Counter */}
                <div className="space-y-2 pt-2 border-t-2 border-black group-hover:border-zinc-800">
                  <div className="flex justify-between items-center text-xs font-extrabold">
                    <span>
                      Total: {item.totalQuestions} Questions
                    </span>
                    <span>
                      Completed: {item.completed} | Remaining: {item.remaining}
                    </span>
                  </div>

                  <div className="w-full h-2 rounded-full bg-zinc-200 group-hover:bg-zinc-800 overflow-hidden border border-black">
                    <div className="h-full bg-black group-hover:bg-white rounded-full" style={{ width: `${percentage}%` }} />
                  </div>
                </div>

                <Link
                  to="/student/challenges"
                  className="w-full py-3 bg-black text-white group-hover:bg-white group-hover:text-black rounded-xl text-xs font-extrabold text-center transition-colors flex items-center justify-center gap-2 border-2 border-black"
                >
                  <Play className="w-3.5 h-3.5 fill-current" /> Start Practice Suite
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
