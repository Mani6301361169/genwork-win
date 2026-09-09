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
    <div className="space-y-8">
      
      {/* 1. Deep Emerald Metallic Header Banner */}
      <div className="bg-gradient-to-r from-[#064e3b] via-[#047857] to-[#0f766e] text-white rounded-2xl p-8 shadow-sm relative overflow-hidden">
        <div className="space-y-3.5 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/20 text-amber-300 text-xs font-extrabold border border-amber-400/30">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> SkillSprint Personal Coach
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {getGreeting()}, <span className="text-amber-300">{profile?.fullName || 'Student'}</span> 👋
          </h1>
          <p className="text-xs sm:text-sm font-medium text-emerald-100">
            Build your confidence. One practice at a time.
          </p>

          <div className="pt-2 flex flex-wrap gap-3 text-xs font-bold">
            <div className="bg-black/20 border border-amber-400/30 px-4 py-2 rounded-xl flex items-center gap-2 text-amber-300">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>Current Streak: {profile?.currentStreak || 1} Days</span>
            </div>
            <div className="bg-black/20 border border-emerald-300/30 px-4 py-2 rounded-xl flex items-center gap-2 text-emerald-100">
              <Award className="w-4 h-4 text-emerald-300" />
              <span>Total XP: {profile?.totalXP || 450} Points</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. TODAY'S PRACTICE */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#064e3b] text-amber-400 flex items-center justify-center font-bold">
              <Mic className="w-4 h-4" />
            </div>
            <h2 className="text-xs font-extrabold uppercase tracking-widest text-slate-500">
              Today's Practice Challenge
            </h2>
          </div>
          <span className="px-3.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 font-extrabold text-[11px]">
            Recommended Daily
          </span>
        </div>

        {todayChallenge ? (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-slate-50 p-6 rounded-xl border border-slate-200">
            <div className="space-y-2 max-w-xl">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-md bg-[#064e3b] text-white font-extrabold text-[10px]">
                  {todayChallenge.category}
                </span>
                <span className="px-2.5 py-0.5 rounded-md bg-slate-200 text-slate-800 font-extrabold text-[10px]">
                  {todayChallenge.difficulty}
                </span>
                <span className="flex items-center gap-1 text-[11px] font-bold text-slate-500">
                  <Clock className="w-3 h-3" /> {todayChallenge.durationSeconds}s
                </span>
              </div>

              <h3 className="text-lg font-extrabold text-slate-900">
                "{todayChallenge.title}"
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                {todayChallenge.description}
              </p>
            </div>

            <Link
              to={`/student/challenges/${todayChallenge.id}`}
              className="shrink-0 inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#064e3b] hover:bg-[#047857] text-white font-extrabold rounded-xl text-xs transition-all shadow-sm"
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
        <h2 className="text-xs font-extrabold uppercase tracking-widest text-slate-500 mb-3 px-1">
          My Performance Breakdown
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <p className="text-[10px] font-extrabold text-[#064e3b] uppercase tracking-wider">Overall Score</p>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-3xl font-extrabold text-slate-900">{overallScore}</span>
              <span className="text-xs font-bold text-slate-400">/ 100</span>
            </div>
            <div className="mt-3.5 w-full h-2 rounded-full bg-slate-100 overflow-hidden">
              <div className="h-full bg-[#064e3b] rounded-full" style={{ width: `${overallScore}%` }} />
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <p className="text-[10px] font-extrabold text-[#d97706] uppercase tracking-wider">Speaking Score</p>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-3xl font-extrabold text-slate-900">{speakingScore}</span>
              <span className="text-xs font-bold text-slate-400">/ 100</span>
            </div>
            <div className="mt-3.5 w-full h-2 rounded-full bg-slate-100 overflow-hidden">
              <div className="h-full bg-[#f59e0b] rounded-full" style={{ width: `${speakingScore}%` }} />
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <p className="text-[10px] font-extrabold text-[#0f766e] uppercase tracking-wider">Interview Score</p>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-3xl font-extrabold text-slate-900">{interviewScore}</span>
              <span className="text-xs font-bold text-slate-400">/ 100</span>
            </div>
            <div className="mt-3.5 w-full h-2 rounded-full bg-slate-100 overflow-hidden">
              <div className="h-full bg-[#0f766e] rounded-full" style={{ width: `${interviewScore}%` }} />
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <p className="text-[10px] font-extrabold text-[#be123c] uppercase tracking-wider">Technical Score</p>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-3xl font-extrabold text-slate-900">{technicalScore}</span>
              <span className="text-xs font-bold text-slate-400">/ 100</span>
            </div>
            <div className="mt-3.5 w-full h-2 rounded-full bg-slate-100 overflow-hidden">
              <div className="h-full bg-[#e11d48] rounded-full" style={{ width: `${technicalScore}%` }} />
            </div>
          </div>

          <div className="col-span-2 sm:col-span-1 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <p className="text-[10px] font-extrabold text-[#047857] uppercase tracking-wider">Confidence Score</p>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-3xl font-extrabold text-slate-900">{confidenceScore}</span>
              <span className="text-xs font-bold text-slate-400">/ 100</span>
            </div>
            <div className="mt-3.5 w-full h-2 rounded-full bg-slate-100 overflow-hidden">
              <div className="h-full bg-[#059669] rounded-full" style={{ width: `${confidenceScore}%` }} />
            </div>
          </div>

        </div>
      </div>

      {/* 4. WEEKLY PROGRESS GRAPH & FEEDBACK SIDE-BY-SIDE */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Weekly Progress Graph */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-[#064e3b]" /> Weekly Progress Trend
                </h3>
                <p className="text-[11px] text-slate-500">
                  Tracking speaking & interview performance over the past 7 days
                </p>
              </div>
              <span className="text-xs font-extrabold text-[#064e3b] bg-emerald-50 border border-emerald-200 px-3.5 py-1 rounded-full">
                +8% Fluency Growth
              </span>
            </div>

            <div className="h-60 w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weeklyData}>
                  <defs>
                    <linearGradient id="emeraldGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#047857" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#047857" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" stroke="#64748b" fontSize={11} tickLine={false} />
                  <YAxis domain={[50, 100]} stroke="#64748b" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
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
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col justify-between space-y-6">
          
          {/* Strengths */}
          <div>
            <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-500 mb-3 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#064e3b]" /> Your Strengths
            </h3>
            <div className="space-y-2.5">
              {['✓ Rich Vocabulary', '✓ Prompt Relevance', '✓ Steady Confidence'].map((str, idx) => (
                <div key={idx} className="px-4 py-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold">
                  {str}
                </div>
              ))}
            </div>
          </div>

          {/* Areas to Improve */}
          <div>
            <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-500 mb-3 flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-rose-600" /> Areas to Improve
            </h3>
            <div className="space-y-2.5">
              {['• Speaking Fluency & Pace', '• Complex Grammar Structures', '• Answer Structure (STAR)'].map((area, idx) => (
                <div key={idx} className="px-4 py-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-xs font-bold">
                  {area}
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* 5. PERSONALIZED RECOMMENDATIONS */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Target className="w-5 h-5 text-[#f59e0b]" />
          <h2 className="text-xs font-extrabold uppercase tracking-widest text-slate-500">
            Personalized Recommendations
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
            <div>
              <span className="px-2.5 py-0.5 rounded-full bg-[#064e3b] text-white font-extrabold text-[10px]">
                Fluency Focus
              </span>
              <p className="mt-3 text-xs font-bold text-slate-900 leading-snug">
                "Practice speaking without filler words such as 'um' and 'like'."
              </p>
            </div>
            <Link
              to="/student/challenges"
              className="mt-4 inline-flex items-center justify-between text-xs font-extrabold text-[#064e3b] hover:underline"
            >
              <span>Practice Now</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
            <div>
              <span className="px-2.5 py-0.5 rounded-full bg-[#f59e0b] text-slate-950 font-extrabold text-[10px]">
                HR Prep
              </span>
              <p className="mt-3 text-xs font-bold text-slate-900 leading-snug">
                "Try answering one HR interview question today using voice response."
              </p>
            </div>
            <Link
              to="/student/interviews"
              className="mt-4 inline-flex items-center justify-between text-xs font-extrabold text-[#d97706] hover:underline"
            >
              <span>Practice Now</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
            <div>
              <span className="px-2.5 py-0.5 rounded-full bg-[#e11d48] text-white font-extrabold text-[10px]">
                Answer Structure
              </span>
              <p className="mt-3 text-xs font-bold text-slate-900 leading-snug">
                "Improve your answer structure using the STAR framework."
              </p>
            </div>
            <Link
              to="/student/learning"
              className="mt-4 inline-flex items-center justify-between text-xs font-extrabold text-[#be123c] hover:underline"
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
