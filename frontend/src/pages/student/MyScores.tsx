import React, { useEffect, useState } from 'react';
import { apiFetch } from '../../services/api';
import { BarChart3, TrendingUp, Sparkles, Award } from 'lucide-react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { SkeletonLoader } from '../../components/common/SkeletonLoader';

export const MyScores: React.FC = () => {
  const [scoresData, setScoresData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchScores = async () => {
      try {
        const res = await apiFetch<any>('/analytics/scores');
        setScoresData(res);
      } catch (err) {
        console.error('Failed to load score analytics:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchScores();
  }, []);

  if (isLoading) return <SkeletonLoader count={4} />;

  const skillProgress = scoresData?.skillProgress || [
    { skill: 'Fluency', score: 72, fullMark: 100 },
    { skill: 'Grammar', score: 78, fullMark: 100 },
    { skill: 'Vocabulary', score: 82, fullMark: 100 },
    { skill: 'Confidence', score: 70, fullMark: 100 },
    { skill: 'Technical', score: 71, fullMark: 100 },
    { skill: 'Relevance', score: 85, fullMark: 100 },
    { skill: 'Structure', score: 74, fullMark: 100 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-brand-500" /> Performance Analytics
        </h1>
        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
          Detailed skill breakdown across fluency, grammar, technical readiness, and speaking confidence.
        </p>
      </div>

      {/* Radar Chart & Bar Chart Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Radar Skill Hexagon */}
        <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-soft">
          <h2 className="text-sm font-extrabold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-accent-500" /> Skill Competency Radar
          </h2>
          <p className="text-[11px] text-slate-500 mb-4">Multi-dimensional evaluation of your speaking and placement abilities.</p>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={skillProgress}>
                <PolarGrid stroke="#94a3b8" />
                <PolarAngleAxis dataKey="skill" stroke="#94a3b8" fontSize={11} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#94a3b8" fontSize={10} />
                <Radar name="Student Skill" dataKey="score" stroke="#6366f1" fill="#6366f1" fillOpacity={0.5} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar Comparison Chart */}
        <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-soft">
          <h2 className="text-sm font-extrabold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
            <Award className="w-4 h-4 text-emerald-500" /> Domain Score Breakdown
          </h2>
          <p className="text-[11px] text-slate-500 mb-4">Comparative score analysis across primary skill categories.</p>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={skillProgress}>
                <XAxis dataKey="skill" stroke="#94a3b8" fontSize={10} tickLine={false} />
                <YAxis domain={[0, 100]} stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', color: '#fff', fontSize: '11px' }} />
                <Bar dataKey="score" fill="#a855f7" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
};
