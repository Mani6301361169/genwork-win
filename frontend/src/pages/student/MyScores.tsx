import React, { useEffect, useState } from 'react';
import { apiFetch } from '../../services/api';
import { BarChart3, Sparkles, Award } from 'lucide-react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
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
    <div className="space-y-6 max-w-7xl mx-auto font-sans text-black">
      <div>
        <h1 className="text-2xl font-extrabold text-black tracking-tight flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-black" /> My Scores & Skill Analytics
        </h1>
        <p className="text-xs text-zinc-700 font-medium mt-1">
          Detailed skill breakdown across fluency, grammar, technical readiness, and speaking confidence.
        </p>
      </div>

      {/* Radar Chart & Bar Chart Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Radar Skill Hexagon */}
        <div className="bg-white border-2 border-black rounded-3xl p-6 shadow-xs">
          <h2 className="text-sm font-extrabold text-black mb-2 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-black" /> Skill Competency Radar
          </h2>
          <p className="text-[11px] text-zinc-600 font-medium mb-4">Multi-dimensional evaluation of your speaking and placement abilities.</p>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={skillProgress}>
                <PolarGrid stroke="#000000" />
                <PolarAngleAxis dataKey="skill" stroke="#000000" fontSize={11} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#000000" fontSize={10} />
                <Radar name="Student Skill" dataKey="score" stroke="#000000" fill="#000000" fillOpacity={0.4} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar Comparison Chart */}
        <div className="bg-white border-2 border-black rounded-3xl p-6 shadow-xs">
          <h2 className="text-sm font-extrabold text-black mb-2 flex items-center gap-2">
            <Award className="w-4 h-4 text-black" /> Domain Score Breakdown
          </h2>
          <p className="text-[11px] text-zinc-600 font-medium mb-4">Comparative score analysis across primary skill categories.</p>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={skillProgress}>
                <XAxis dataKey="skill" stroke="#000000" fontSize={10} tickLine={false} />
                <YAxis domain={[0, 100]} stroke="#000000" fontSize={11} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#000000', borderRadius: '12px', color: '#fff', fontSize: '11px', border: '1px solid #000' }} />
                <Bar dataKey="score" fill="#000000" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
};
