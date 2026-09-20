import React, { useEffect, useState } from 'react';
import { apiFetch } from '../../services/api';
import { LeaderboardEntry, Department } from '../../types';
import { Trophy, Medal } from 'lucide-react';
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
    <div className="space-y-6 max-w-7xl mx-auto font-sans text-black">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-black tracking-tight flex items-center gap-2">
            <Trophy className="w-6 h-6 text-black" /> Student Leaderboard & Rankings
          </h1>
          <p className="text-xs text-zinc-700 font-medium mt-1">
            Compare your overall placement readiness score across campus engineering & management departments.
          </p>
        </div>

        {/* Self Rank Highlighter Card */}
        {currentUserRank && (
          <div className="bg-black text-white px-5 py-3 rounded-2xl border-2 border-black shadow-xs flex items-center gap-3">
            <Medal className="w-5 h-5 text-white shrink-0" />
            <div className="text-xs">
              <span className="opacity-80">Your Rank:</span>{' '}
              <span className="font-extrabold text-sm">#{currentUserRank.rank}</span>{' '}
              <span className="ml-2 font-extrabold">({currentUserRank.score} Points)</span>
            </div>
          </div>
        )}
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white border-2 border-black rounded-3xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-4">
        
        {/* Time Period Tabs */}
        <div className="flex bg-zinc-100 p-1 rounded-2xl border border-black">
          {(['WEEKLY', 'MONTHLY', 'OVERALL'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 py-1.5 rounded-xl text-xs font-extrabold transition-all border border-transparent ${
                period === p
                  ? 'bg-black text-white shadow-xs border-black'
                  : 'text-black hover:bg-zinc-200'
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
            className="px-3.5 py-2 rounded-xl border-2 border-black bg-white text-black text-xs font-extrabold"
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
            className="px-3.5 py-2 rounded-xl border-2 border-black bg-white text-black text-xs font-extrabold"
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
        <div className="bg-white border-2 border-black rounded-3xl shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-black text-white border-b-2 border-black text-[11px] font-extrabold uppercase tracking-wider">
                  <th className="py-3.5 px-6">Rank</th>
                  <th className="py-3.5 px-6">Student</th>
                  <th className="py-3.5 px-6">Department</th>
                  <th className="py-3.5 px-6 text-center">Completed</th>
                  <th className="py-3.5 px-6 text-center">Streak</th>
                  <th className="py-3.5 px-6 text-right">Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 text-xs font-medium">
                {entries.map((entry) => (
                  <tr
                    key={entry.rank}
                    className={`transition-colors ${
                      entry.isCurrentUser
                        ? 'bg-zinc-100 font-extrabold border-l-4 border-l-black'
                        : 'hover:bg-zinc-50'
                    }`}
                  >
                    <td className="py-4 px-6 font-extrabold">
                      {entry.rank === 1 ? (
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-black text-white font-extrabold text-xs border border-black">
                          1st
                        </span>
                      ) : entry.rank === 2 ? (
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-zinc-800 text-white font-extrabold text-xs border border-black">
                          2nd
                        </span>
                      ) : entry.rank === 3 ? (
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-zinc-600 text-white font-extrabold text-xs border border-black">
                          3rd
                        </span>
                      ) : (
                        <span className="text-black font-extrabold ml-2">#{entry.rank}</span>
                      )}
                    </td>

                    <td className="py-4 px-6 font-extrabold text-black">
                      {entry.studentName}
                    </td>

                    <td className="py-4 px-6 text-zinc-800 font-semibold">
                      <span className="px-2 py-0.5 rounded bg-black text-white text-[10px] font-extrabold">
                        {entry.departmentCode}
                      </span>{' '}
                      • {entry.academicYear}
                    </td>

                    <td className="py-4 px-6 text-center font-extrabold text-black">
                      {entry.challengesCompleted}
                    </td>

                    <td className="py-4 px-6 text-center font-extrabold text-black">
                      🔥 {entry.streak}d
                    </td>

                    <td className="py-4 px-6 text-right font-extrabold text-black text-sm">
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
