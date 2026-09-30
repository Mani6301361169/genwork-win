import React, { useEffect, useState } from 'react';
import { apiFetch } from '../../services/api';
import { Users, Trophy, CheckCircle2, TrendingUp, Sparkles, Megaphone, Shield } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { SkeletonLoader } from '../../components/common/SkeletonLoader';

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        const res = await apiFetch<any>('/admin/stats');
        setStats(res);
      } catch (err) {
        console.error('Failed to load admin stats:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAdminStats();
  }, []);

  if (isLoading) return <SkeletonLoader count={4} />;

  return (
    <div className="space-y-6">
      
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
          <Shield className="w-6 h-6 text-brand-500" /> Faculty Admin Portal
        </h1>
        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
          Campus placement metrics, active student tracking, and challenge administration.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-soft">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 mb-1">
            <Users className="w-4 h-4 text-brand-500" /> Total Students
          </div>
          <p className="text-3xl font-extrabold text-slate-900 dark:text-white">{stats?.totalStudents || 20}</p>
        </div>

        <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-soft">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 mb-1">
            <TrendingUp className="w-4 h-4 text-amber-500" /> Active Students
          </div>
          <p className="text-3xl font-extrabold text-amber-500">{stats?.activeStudents || 18}</p>
        </div>

        <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-soft">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 mb-1">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Challenges Completed
          </div>
          <p className="text-3xl font-extrabold text-emerald-500">{stats?.challengesCompleted || 142}</p>
        </div>

        <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-soft">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 mb-1">
            <Trophy className="w-4 h-4 text-accent-500" /> Campus Avg Score
          </div>
          <p className="text-3xl font-extrabold text-accent-500">{stats?.averageScore || 74} / 100</p>
        </div>

      </div>

      {/* Participation Chart */}
      <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-soft">
        <h2 className="text-sm font-extrabold text-slate-900 dark:text-white mb-2">
          Weekly Student Participation
        </h2>
        <p className="text-[11px] text-slate-500 mb-4">Number of daily practice submissions across all campus departments.</p>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stats?.weeklyParticipation || []}>
              <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', color: '#fff', fontSize: '11px' }} />
              <Bar dataKey="attempts" fill="#6366f1" radius={[8, 8, 0, 0]} name="Submissions" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
};
