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
  Award
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
    { day: 'Mon', speakingScore: 70, interviewScore: 65 },
    { day: 'Tue', speakingScore: 72, interviewScore: 66 },
    { day: 'Wed', speakingScore: 75, interviewScore: 68 },
    { day: 'Thu', speakingScore: 74, interviewScore: 70 },
    { day: 'Fri', speakingScore: 78, interviewScore: 72 },
    { day: 'Sat', speakingScore: 76, interviewScore: 71 },
    { day: 'Sun', speakingScore: 79, interviewScore: 74 },
  ];

  return (
    <div className="space-y-6">
      
      {/* 1. Cinematic Pro Header Banner */}
      <div className="bg-gradient-cinematic text-white border border-gold-500/30 rounded-2xl p-6 sm:p-8 shadow-emerald-glow relative overflow-hidden">
        <div className="space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/40 text-gold-400 text-xs font-extrabold border border-gold-500/30">
            <Sparkles className="w-3.5 h-3.5 text-gold-400" /> SkillSprint Personal Coach
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {getGreeting()}, <span className="bg-gradient-to-r from-white via-gold-400 to-teal-light bg-clip-text text-transparent">{profile?.fullName || 'Student'}</span> 👋
          </h1>
          <p className="text-xs sm:text-sm font-medium text-emerald-100">
            Build your confidence. One practice at a time.
          </p>

          <div className="pt-2 flex flex-wrap gap-3 text-xs font-bold">
            <div className="bg-black/40 border border-gold-500/30 px-4 py-2 rounded-xl flex items-center gap-2 text-gold-400">
              <Trophy className="w-4 h-4 text-gold-400" />
              <span>Current Streak: {profile?.currentStreak || 1} Days</span>
            </div>
            <div className="bg-black/40 border border-emerald-deep/40 px-4 py-2 rounded-xl flex items-center gap-2 text-teal-light">
              <Award className="w-4 h-4 text-teal-light" />
              <span>Total XP: {profile?.totalXP || 450} Points</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. TODAY'S PRACTICE */}
      <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-teal-dark/40 rounded-2xl p-6 sm:p-8 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-cinematic text-gold-400 border border-gold-500/30 flex items-center justify-center font-bold">
              <Mic className="w-4 h-4" />
            </div>
            <h2 className="text-xs font-extrabold uppercase tracking-widest text-slate-600 dark:text-slate-400">
              Today's Practice Challenge
            </h2>
          </div>
          <span className="px-3 py-1 rounded-full bg-gold-500/10 text-gold-700 dark:text-gold-400 font-extrabold text-[11px] border border-gold-500/30">
            Recommended Daily
          </span>
        </div>

        {todayChallenge ? (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-slate-50 dark:bg-teal-deep/30 p-6 rounded-xl border border-slate-200 dark:border-teal-dark/50">
            <div className="space-y-2 max-w-xl">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-md bg-emerald-deep text-gold-400 font-extrabold text-[10px]">
                  {todayChallenge.category}
                </span>
                <span className="px-2.5 py-0.5 rounded-md bg-teal-dark/40 text-teal-light font-extrabold text-[10px]">
                  {todayChallenge.difficulty}
                </span>
                <span className="flex items-center gap-1 text-[11px] font-bold text-slate-500 dark:text-slate-400">
                  <Clock className="w-3 h-3" /> {todayChallenge.durationSeconds}s
                </span>
              </div>

              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                "{todayChallenge.title}"
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                {todayChallenge.description}
              </p>
            </div>

            <Link
              to={`/student/challenges/${todayChallenge.id}`}
              className="shrink-0 inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-cinematic text-gold-400 border border-gold-500/30 font-extrabold rounded-xl text-xs hover:shadow-gold-glow transition-all"
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
        <h2 className="text-xs font-extrabold uppercase tracking-widest text-slate-600 dark:text-slate-400 mb-3 px-1">
          My Performance Breakdown
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          
          <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-teal-dark/40 rounded-2xl p-5 shadow-sm">
            <p className="text-[10px] font-extrabold text-emerald-deep dark:text-emerald-light uppercase tracking-wider">Overall Score</p>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">{overallScore}</span>
              <span className="text-xs font-bold text-slate-400">/ 100</span>
            </div>
            <div className="mt-3 w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <div className="h-full bg-emerald-deep dark:bg-emerald-light rounded-full" style={{ width: `${overallScore}%` }} />
            </div>
          </div>

          <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-teal-dark/40 rounded-2xl p-5 shadow-sm">
            <p className="text-[10px] font-extrabold text-gold-600 dark:text-gold-400 uppercase tracking-wider">Speaking Score</p>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">{speakingScore}</span>
              <span className="text-xs font-bold text-slate-400">/ 100</span>
            </div>
            <div className="mt-3 w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <div className="h-full bg-gold-500 rounded-full" style={{ width: `${speakingScore}%` }} />
            </div>
          </div>

          <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-teal-dark/40 rounded-2xl p-5 shadow-sm">
            <p className="text-[10px] font-extrabold text-teal-medium dark:text-teal-light uppercase tracking-wider">Interview Score</p>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">{interviewScore}</span>
              <span className="text-xs font-bold text-slate-400">/ 100</span>
            </div>
            <div className="mt-3 w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <div className="h-full bg-teal-metallic rounded-full" style={{ width: `${interviewScore}%` }} />
            </div>
          </div>

          <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-teal-dark/40 rounded-2xl p-5 shadow-sm">
            <p className="text-[10px] font-extrabold text-crimson-600 dark:text-crimson-400 uppercase tracking-wider">Technical Score</p>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">{technicalScore}</span>
              <span className="text-xs font-bold text-slate-400">/ 100</span>
            </div>
            <div className="mt-3 w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <div className="h-full bg-crimson-500 rounded-full" style={{ width: `${technicalScore}%` }} />
            </div>
          </div>

          <div className="col-span-2 sm:col-span-1 bg-white dark:bg-neutral-900 border border-slate-200 dark:border-teal-dark/40 rounded-2xl p-5 shadow-sm">
            <p className="text-[10px] font-extrabold text-emerald-medium dark:text-gold-400 uppercase tracking-wider">Confidence Score</p>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">{confidenceScore}</span>
              <span className="text-xs font-bold text-slate-400">/ 100</span>
            </div>
            <div className="mt-3 w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <div className="h-full bg-gradient-gold rounded-full" style={{ width: `${confidenceScore}%` }} />
            </div>
          </div>

        </div>
      </div>

      {/* 4. WEEKLY PROGRESS GRAPH & FEEDBACK SIDE-BY-SIDE */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Weekly Progress Graph */}
        <div className="lg:col-span-2 bg-white dark:bg-neutral-900 border border-slate-200 dark:border-teal-dark/40 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-deep dark:text-gold-400" /> Weekly Progress Trend
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Tracking speaking & interview performance over the past 7 days
                </p>
              </div>
              <span className="text-xs font-extrabold text-emerald-deep dark:text-gold-400 border border-emerald-deep/30 dark:border-gold-500/30 px-3 py-1 rounded-full bg-emerald-50 dark:bg-teal-deep">
                +8% Fluency Growth
              </span>
            </div>

            <div className="h-56 w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weeklyData}>
                  <defs>
                    <linearGradient id="emeraldGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#047857" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#047857" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis domain={[50, 100]} stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#042f2e',
                      borderColor: '#0f766e',
                      borderRadius: '12px',
                      color: '#ffffff',
                      fontSize: '11px',
                    }}
                  />
                  <Area type="monotone" dataKey="speakingScore" stroke="#047857" strokeWidth={3} fillOpacity={1} fill="url(#emeraldGrad)" name="Speaking Score" />
                  <Area type="monotone" dataKey="interviewScore" stroke="#f59e0b" strokeWidth={2} strokeDasharray="3 3" fill="none" name="Interview Score" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Strengths & Areas To Improve */}
        <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-teal-dark/40 rounded-2xl p-6 shadow-sm flex flex-col justify-between space-y-6">
          
          {/* Strengths */}
          <div>
            <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-600 dark:text-slate-400 mb-3 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-deep dark:text-gold-400" /> Your Strengths
            </h3>
            <div className="space-y-2">
              {['✓ Rich Vocabulary', '✓ Prompt Relevance', '✓ Steady Confidence'].map((str, idx) => (
                <div key={idx} className="px-3.5 py-2.5 rounded-xl bg-emerald-50 dark:bg-teal-deep/50 border border-emerald-deep/20 dark:border-teal-dark text-emerald-deep dark:text-teal-light text-xs font-bold">
                  {str}
                </div>
              ))}
            </div>
          </div>

          {/* Areas to Improve */}
          <div>
            <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-600 dark:text-slate-400 mb-3 flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-crimson-500" /> Areas to Improve
            </h3>
            <div className="space-y-2">
              {['• Speaking Fluency & Pace', '• Complex Grammar Structures', '• Answer Structure (STAR)'].map((area, idx) => (
                <div key={idx} className="px-3.5 py-2.5 rounded-xl bg-crimson-50 dark:bg-rose-950/30 border border-crimson-500/20 dark:border-crimson-600/30 text-crimson-700 dark:text-crimson-400 text-xs font-bold">
                  {area}
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* 5. PERSONALIZED RECOMMENDATIONS */}
      <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-teal-dark/40 rounded-2xl p-6 sm:p-8 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Target className="w-5 h-5 text-gold-500" />
          <h2 className="text-xs font-extrabold uppercase tracking-widest text-slate-600 dark:text-slate-400">
            Personalized Recommendations
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          <div className="p-5 rounded-xl bg-slate-50 dark:bg-teal-deep/40 border border-slate-200 dark:border-teal-dark flex flex-col justify-between">
            <div>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-deep text-gold-400 font-extrabold text-[10px]">
                Fluency Focus
              </span>
              <p className="mt-3 text-xs font-bold text-slate-900 dark:text-white leading-snug">
                "Practice speaking without filler words such as 'um' and 'like'."
              </p>
            </div>
            <Link
              to="/student/challenges"
              className="mt-4 inline-flex items-center justify-between text-xs font-extrabold text-emerald-deep dark:text-gold-400 hover:underline"
            >
              <span>Practice Now</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="p-5 rounded-xl bg-slate-50 dark:bg-teal-deep/40 border border-slate-200 dark:border-teal-dark flex flex-col justify-between">
            <div>
              <span className="px-2.5 py-0.5 rounded-full bg-gold-500 text-slate-950 font-extrabold text-[10px]">
                HR Prep
              </span>
              <p className="mt-3 text-xs font-bold text-slate-900 dark:text-white leading-snug">
                "Try answering one HR interview question today using voice response."
              </p>
            </div>
            <Link
              to="/student/interviews"
              className="mt-4 inline-flex items-center justify-between text-xs font-extrabold text-gold-600 dark:text-gold-400 hover:underline"
            >
              <span>Practice Now</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="p-5 rounded-xl bg-slate-50 dark:bg-teal-deep/40 border border-slate-200 dark:border-teal-dark flex flex-col justify-between">
            <div>
              <span className="px-2.5 py-0.5 rounded-full bg-crimson-500 text-white font-extrabold text-[10px]">
                Answer Structure
              </span>
              <p className="mt-3 text-xs font-bold text-slate-900 dark:text-white leading-snug">
                "Improve your answer structure using the STAR framework."
              </p>
            </div>
            <Link
              to="/student/learning"
              className="mt-4 inline-flex items-center justify-between text-xs font-extrabold text-crimson-600 dark:text-crimson-400 hover:underline"
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
