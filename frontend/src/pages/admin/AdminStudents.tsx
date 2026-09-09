import React, { useEffect, useState } from 'react';
import { apiFetch } from '../../services/api';
import { Users, Search, Award } from 'lucide-react';
import { SkeletonLoader } from '../../components/common/SkeletonLoader';

export const AdminStudents: React.FC = () => {
  const [students, setStudents] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
      setIsLoading(true);
      try {
        const param = search ? `?search=${encodeURIComponent(search)}` : '';
        const res = await apiFetch<{ students: any[] }>(`/admin/students${param}`);
        setStudents(res.students);
      } catch (err) {
        console.error('Failed to load students:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStudents();
  }, [search]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Users className="w-6 h-6 text-brand-500" /> Student Directory
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            View registered students, academic departments, scores, and practice activity logs.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search student name or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>
      </div>

      {isLoading ? (
        <SkeletonLoader count={5} />
      ) : (
        <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-soft overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                  <th className="py-3.5 px-6">Student ID</th>
                  <th className="py-3.5 px-6">Name</th>
                  <th className="py-3.5 px-6">Email</th>
                  <th className="py-3.5 px-6">Department</th>
                  <th className="py-3.5 px-6">Year</th>
                  <th className="py-3.5 px-6 text-right">Avg Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs font-medium">
                {students.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-4 px-6 font-mono font-bold text-brand-600 dark:text-brand-400">{s.studentId}</td>
                    <td className="py-4 px-6 font-bold text-slate-900 dark:text-white">{s.fullName}</td>
                    <td className="py-4 px-6 text-slate-500">{s.email}</td>
                    <td className="py-4 px-6">{s.department}</td>
                    <td className="py-4 px-6 text-slate-500">{s.academicYear}</td>
                    <td className="py-4 px-6 text-right font-extrabold text-emerald-600">{s.overallScore} / 100</td>
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
