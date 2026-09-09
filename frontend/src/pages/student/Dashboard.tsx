import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { apiFetch } from '../../services/api';
import { Challenge } from '../../types';
import { Link } from 'react-router-dom';
import {
  Mic,
  Trophy,
  Target,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight,
  TrendingUp,
  Award,
  BookOpen
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const profile = user?.profile;

  const [todayChallenge, setTodayChallenge] = useState<Challenge | null>(null);
  const [scoresData, setScoresData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [chRes, scoreRes] = await Promise.all([
          apiFetch<{ challenge: Challenge }>('/challenges/today'),
          apiFetch<any>('/analytics/scores'),
        ]);
        setTodayChallenge(chRes.challenge);
        setScoresData(scoreRes);
      } catch (err) {
        console.error('Failed to load dashboard:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const overallScore = scoresData?.overallScore || profile?.overallScore || 72;
  const speakingScore = scoresData?.speakingScore || profile?.speakingScore || 78;
  const interviewScore = scoresData?.interviewScore || profile?.interviewScore || 68;
  const technicalScore = scoresData?.technicalScore || profile?.technicalScore || 71;
  const confidenceScore = scoresData?.confidenceScore || profile?.confidenceScore || 70;

  const weeklyData = scoresData?.weeklyData || [
    { day: 'Mon', speakingScore: 70, interviewScore: 65, practiceCompleted: 1 },
    { day: 'Tue', speakingScore: 72, interviewScore: 66, practiceCompleted: 2 },
    { day: 'Wed', speakingScore: 75, interviewScore: 68, practiceCompleted: 1 },
    { day: 'Thu', speakingScore: 74, interviewScore: 70, practiceCompleted: 3 },
    { day: 'Fri', speakingScore: 78, interviewScore: 72, practiceCompleted: 2 },
    { day: 'Sat', speakingScore: 76, interviewScore: 71, practiceCompleted: 1 },
    { day: 'Sun', speakingScore: 79, interviewScore: 74, practiceCompleted: 2 },
  ];

  return (
    <div className="space-y-6">
      
      {/* 1. Personalized Greeting Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-brand-900 via-brand-800 to-accent-900 rounded-3xl p-6 sm:p-8 text-white shadow-soft">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-brand-200 text-xs font-bold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-accent-400" /> SkillSprint Personal Coach
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {getGreeting()}, {profile?.fullName || 'Student'} 👋
          </h1>
          <p className="mt-1 text-sm text-brand-100 font-medium">
            Build your confidence. One practice at a time.
          </p>

          <div className="mt-6 flex flex-wrap gap-4 text-xs font-bold">
            <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>Current Streak: {profile?.currentStreak || 1} Days</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl flex items-center gap-2">
              <Award className="w-4 h-4 text-emerald-400" />
              <span>Total XP: {profile?.totalXP || 450} Points</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. TODAY'S PRACTICE */}
      <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-soft">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center font-bold">
              <Mic className="w-4 h-4" />
            </div>
            <h2 className="text-xs font-extrabold uppercase tracking-widest text-slate-500 dark:text-slate-400">
              Today's Practice Challenge
            </h2>
          </div>
          <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs">
            Recommended Daily
          </span>
        </div>

        {todayChallenge ? (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-slate-50 dark:bg-slate-800/40 p-6 rounded-2xl border border-slate-200/60 dark:border-slate-700/60">
            <div className="space-y-2 max-w-xl">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-md bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-300 font-bold text-[10px]">
                  {todayChallenge.category}
                </span>
                <span className="px-2.5 py-0.5 rounded-md bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-[10px]">
                  {todayChallenge.difficulty}
                </span>
                <span className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                  <Clock className="w-3 h-3" /> {todayChallenge.durationSeconds}s
                </span>
              </div>

              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                "{todayChallenge.title}"
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {todayChallenge.description}
              </p>
            </div>

            <Link
              to={`/student/challenges/${todayChallenge.id}`}
              className="shrink-0 inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-brand-600 to-accent-600 hover:from-brand-700 hover:to-accent-700 text-white font-bold rounded-2xl text-xs shadow-soft hover:shadow-glow transition-all"
            >
              <Mic className="w-4 h-4" /> Start Practice
            </Link>
          </div>
        ) : (
          <div className="p-4 text-center text-xs text-slate-500">Loading today's practice challenge...</div>
        )}
      </div>

      {/* 3. MY PERFORMANCE GRID */}
      <div>
        <h2 className="text-xs font-extrabold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-3 px-1">
          My Performance Breakdown
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          
          <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-soft">
            <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400">Overall Score</p>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-3xl font-extrabold text-brand-600 dark:text-brand-400">{overallScore}</span>
              <span className="text-xs font-bold text-slate-400">/ 100</span>
            </div>
            <div className="mt-3 w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <div className="h-full bg-brand-500 rounded-full" style={{ width: `${overallScore}%` }} />
            </div>
          </div>

          <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-soft">
            <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400">Speaking Score</p>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-3xl font-extrabold text-accent-500">{speakingScore}</span>
              <span className="text-xs font-bold text-slate-400">/ 100</span>
            </div>
            <div className="mt-3 w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <div className="h-full bg-accent-500 rounded-full" style={{ width: `${speakingScore}%` }} />
            </div>
          </div>

          <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-soft">
            <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400">Interview Score</p>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-3xl font-extrabold text-emerald-500">{interviewScore}</span>
              <span className="text-xs font-bold text-slate-400">/ 100</span>
            </div>
            <div className="mt-3 w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${interviewScore}%` }} />
            </div>
          </div>

          <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-soft">
            <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400">Technical Score</p>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-3xl font-extrabold text-indigo-500">{technicalScore}</span>
              <span className="text-xs font-bold text-slate-400">/ 100</span>
            </div>
            <div className="mt-3 w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${technicalScore}%` }} />
            </div>
          </div>

          <div className="col-span-2 sm:col-span-1 bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-soft">
            <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400">Confidence Score</p>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-3xl font-extrabold text-amber-500">{confidenceScore}</span>
              <span className="text-xs font-bold text-slate-400">/ 100</span>
            </div>
            <div className="mt-3 w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <div className="h-full bg-amber-500 rounded-full" style={{ width: `${confidenceScore}%` }} />
            </div>
          </div>

        </div>
      </div>

      {/* 4. WEEKLY PROGRESS GRAPH & FEEDBACK SIDE-BY-SIDE */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Weekly Progress Recharts Graph */}
        <div className="lg:col-span-2 bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-soft flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-brand-500" /> Weekly Progress Trend
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Tracking speaking & interview performance over the past 7 days
                </p>
              </div>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-full">
                +8% Fluency Growth
              </span>
            </div>

            <div className="h-56 w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weeklyData}>
                  <defs>
                    <linearGradient id="speakingGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="interviewGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#a855f7" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis domain={[50, 100]} stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderColor: '#1e293b',
                      borderRadius: '12px',
                      color: '#fff',
                      fontSize: '11px',
                    }}
                  />
                  <Area type="monotone" dataKey="speakingScore" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#speakingGrad)" name="Speaking Score" />
                  <Area type="monotone" dataKey="interviewScore" stroke="#a855f7" strokeWidth={3} fillOpacity={1} fill="url(#interviewGrad)" name="Interview Score" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Strengths & Areas To Improve */}
        <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-soft flex flex-col justify-between space-y-6">
          
          {/* Strengths */}
          <div>
            <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-3 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Your Strengths
            </h3>
            <div className="space-y-2">
              {['✓ Rich Vocabulary', '✓ Prompt Relevance', '✓ Steady Confidence'].map((str, idx) => (
                <div key={idx} className="px-3.5 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-800/40 text-emerald-800 dark:text-emerald-300 text-xs font-bold">
                  {str}
                </div>
              ))}
            </div>
          </div>

          {/* Areas to Improve */}
          <div>
            <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-3 flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-amber-500" /> Areas to Improve
            </h3>
            <div className="space-y-2">
              {['• Speaking Fluency & Pace', '• Complex Grammar Structures', '• Answer Structure (STAR)'].map((area, idx) => (
                <div key={idx} className="px-3.5 py-2 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-800/40 text-amber-800 dark:text-amber-300 text-xs font-bold">
                  {area}
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* 5. PERSONALIZED RECOMMENDATIONS */}
      <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-soft">
        <div className="flex items-center gap-2 mb-4">
          <Target className="w-5 h-5 text-accent-500" />
          <h2 className="text-xs font-extrabold uppercase tracking-widest text-slate-500 dark:text-slate-400">
            Personalized Recommendations
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          <div className="p-5 rounded-2xl bg-brand-50/50 dark:bg-brand-950/20 border border-brand-100 dark:border-brand-900/40 flex flex-col justify-between">
            <div>
              <span className="px-2.5 py-0.5 rounded-full bg-brand-200 dark:bg-brand-900 text-brand-800 dark:text-brand-200 font-extrabold text-[10px]">
                Fluency Focus
              </span>
              <p className="mt-3 text-xs font-bold text-slate-800 dark:text-slate-100 leading-snug">
                "Practice speaking without filler words such as 'um' and 'like'."
              </p>
            </div>
            <Link
              to="/student/challenges"
              className="mt-4 inline-flex items-center justify-between text-xs font-extrabold text-brand-600 dark:text-brand-400 hover:underline"
            >
              <span>Practice Now</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="p-5 rounded-2xl bg-accent-50/50 dark:bg-accent-950/20 border border-accent-100 dark:border-accent-900/40 flex flex-col justify-between">
            <div>
              <span className="px-2.5 py-0.5 rounded-full bg-accent-200 dark:bg-accent-900 text-accent-800 dark:text-accent-200 font-extrabold text-[10px]">
                HR Prep
              </span>
              <p className="mt-3 text-xs font-bold text-slate-800 dark:text-slate-100 leading-snug">
                "Try answering one HR interview question today using voice response."
              </p>
            </div>
            <Link
              to="/student/interviews"
              className="mt-4 inline-flex items-center justify-between text-xs font-extrabold text-accent-600 dark:text-accent-400 hover:underline"
            >
              <span>Practice Now</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="p-5 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40 flex flex-col justify-between">
            <div>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-200 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 font-extrabold text-[10px]">
                Answer Structure
              </span>
              <p className="mt-3 text-xs font-bold text-slate-800 dark:text-slate-100 leading-snug">
                "Improve your answer structure using the STAR framework."
              </p>
            </div>
            <Link
              to="/student/learning"
              className="mt-4 inline-flex items-center justify-between text-xs font-extrabold text-emerald-600 dark:text-emerald-400 hover:underline"
            >
              <span>Practice Now</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

        </div>
      </div>

    </div>
  );
};
