import React, { useEffect, useState } from 'react';
import { apiFetch } from '../../services/api';
import { LeaderboardEntry, Department } from '../../types';
import { Trophy, Medal, Award, Flame, Filter } from 'lucide-react';
import { SkeletonLoader } from '../../components/common/SkeletonLoader';

export const Leaderboard: React.FC = () => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [currentUserRank, setCurrentUserRank] = useState<LeaderboardEntry | null>(null);
  const [departments, setDepartments] = useState<Department[]>([]);

  const [period, setPeriod] = useState<'WEEKLY' | 'MONTHLY' | 'OVERALL'>('OVERALL');
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedYear, setSelectedYear] = useState('All');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDepts = async () => {
      try {
        const res = await apiFetch<{ departments: Department[] }>('/auth/departments');
        setDepartments(res.departments);
      } catch (e) {
        console.error(e);
      }
    };
    fetchDepts();
  }, []);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setIsLoading(true);
      try {
        const queryParams = new URLSearchParams();
        queryParams.append('period', period);
        if (selectedDept !== 'All') queryParams.append('departmentId', selectedDept);
        if (selectedYear !== 'All') queryParams.append('academicYear', selectedYear);

        const res = await apiFetch<{ leaderboard: LeaderboardEntry[]; currentUserRank: LeaderboardEntry }>(
          `/analytics/leaderboard?${queryParams.toString()}`
        );
        setEntries(res.leaderboard);
        setCurrentUserRank(res.currentUserRank);
      } catch (err) {
        console.error('Failed to load leaderboard:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaderboard();
  }, [period, selectedDept, selectedYear]);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Trophy className="w-6 h-6 text-amber-500" /> Student Leaderboard
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            Compare your overall placement readiness score across campus departments and academic batches.
          </p>
        </div>

        {/* Self Rank Highlighter Card */}
        {currentUserRank && (
          <div className="bg-gradient-to-r from-brand-600 to-accent-600 text-white px-5 py-2.5 rounded-2xl shadow-soft flex items-center gap-3">
            <Medal className="w-5 h-5 text-amber-300 shrink-0" />
            <div className="text-xs">
              <span className="opacity-80">Your Rank:</span>{' '}
              <span className="font-extrabold text-sm">#{currentUserRank.rank}</span>{' '}
              <span className="ml-2 font-bold">({currentUserRank.score} Points)</span>
            </div>
          </div>
        )}
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 shadow-soft flex flex-wrap items-center justify-between gap-4">
        
        {/* Time Period Tabs */}
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl">
          {(['WEEKLY', 'MONTHLY', 'OVERALL'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 py-1.5 rounded-xl text-xs font-extrabold transition-all ${
                period === p
                  ? 'bg-white dark:bg-navy-900 text-brand-600 dark:text-brand-400 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {p.charAt(0) + p.slice(1).toLowerCase()}
            </button>
          ))}
        </div>

        {/* Dropdowns */}
        <div className="flex flex-wrap items-center gap-3">
          
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold"
          >
            <option value="All">All Departments</option>
            {departments.map((d) => (
              <option key={d.id} value={d.id}>
                {d.code} - {d.name}
              </option>
            ))}
          </select>

          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold"
          >
            <option value="All">All Batches</option>
            <option value="1st Year">1st Year</option>
            <option value="2nd Year">2nd Year</option>
            <option value="3rd Year">3rd Year</option>
            <option value="4th Year">4th Year</option>
          </select>

        </div>
      </div>

      {/* Leaderboard Table */}
      {isLoading ? (
        <SkeletonLoader count={5} />
      ) : (
        <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-soft overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                  <th className="py-3.5 px-6">Rank</th>
                  <th className="py-3.5 px-6">Student</th>
                  <th className="py-3.5 px-6">Department</th>
                  <th className="py-3.5 px-6 text-center">Completed</th>
                  <th className="py-3.5 px-6 text-center">Streak</th>
                  <th className="py-3.5 px-6 text-right">Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs font-medium">
                {entries.map((entry) => (
                  <tr
                    key={entry.rank}
                    className={`transition-colors ${
                      entry.isCurrentUser
                        ? 'bg-brand-50/80 dark:bg-brand-950/40 font-bold border-l-4 border-l-brand-500'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    <td className="py-4 px-6 font-extrabold">
                      {entry.rank === 1 ? (
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-amber-400 text-slate-900 font-extrabold text-xs shadow-xs">
                          🥇 1
                        </span>
                      ) : entry.rank === 2 ? (
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-slate-300 text-slate-900 font-extrabold text-xs shadow-xs">
                          🥈 2
                        </span>
                      ) : entry.rank === 3 ? (
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-amber-700 text-white font-extrabold text-xs shadow-xs">
                          🥉 3
                        </span>
                      ) : (
                        <span className="text-slate-500 ml-2">#{entry.rank}</span>
                      )}
                    </td>

                    <td className="py-4 px-6 font-bold text-slate-900 dark:text-white">
                      {entry.studentName}
                    </td>

                    <td className="py-4 px-6 text-slate-600 dark:text-slate-400">
                      <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-bold">
                        {entry.departmentCode}
                      </span>{' '}
                      • {entry.academicYear}
                    </td>

                    <td className="py-4 px-6 text-center font-bold text-slate-700 dark:text-slate-300">
                      {entry.challengesCompleted}
                    </td>

                    <td className="py-4 px-6 text-center text-amber-600 font-bold">
                      🔥 {entry.streak}d
                    </td>

                    <td className="py-4 px-6 text-right font-extrabold text-brand-600 dark:text-brand-400 text-sm">
                      {entry.score} / 100
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};
