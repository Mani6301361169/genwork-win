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
      
      {/* 1. Header Banner - Clean Dark Monochromatic Card in All Modes */}
      <div className="bg-neutral-900 text-white border border-neutral-800 rounded-2xl p-6 sm:p-8 shadow-sm">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-800 text-neutral-200 text-xs font-extrabold border border-neutral-700">
            <Sparkles className="w-3.5 h-3.5" /> SkillSprint Personal Coach
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {getGreeting()}, {profile?.fullName || 'Student'} 👋
          </h1>
          <p className="text-xs sm:text-sm font-medium text-neutral-400">
            Build your confidence. One practice at a time.
          </p>

          <div className="pt-2 flex flex-wrap gap-3 text-xs font-bold">
            <div className="bg-neutral-800 border border-neutral-700 px-4 py-2 rounded-xl flex items-center gap-2">
              <Trophy className="w-4 h-4 text-white" />
              <span>Current Streak: {profile?.currentStreak || 1} Days</span>
            </div>
            <div className="bg-neutral-800 border border-neutral-700 px-4 py-2 rounded-xl flex items-center gap-2">
              <Award className="w-4 h-4 text-white" />
              <span>Total XP: {profile?.totalXP || 450} Points</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. TODAY'S PRACTICE */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 sm:p-8 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-black text-white dark:bg-white dark:text-black flex items-center justify-center font-bold">
              <Mic className="w-4 h-4" />
            </div>
            <h2 className="text-xs font-extrabold uppercase tracking-widest text-neutral-500 dark:text-neutral-400">
              Today's Practice Challenge
            </h2>
          </div>
          <span className="px-3 py-1 rounded-full bg-black text-white dark:bg-white dark:text-black font-extrabold text-[11px]">
            Recommended Daily
          </span>
        </div>

        {todayChallenge ? (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-neutral-50 dark:bg-neutral-800/60 p-6 rounded-xl border border-neutral-200 dark:border-neutral-700/60">
            <div className="space-y-2 max-w-xl">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-md bg-black text-white dark:bg-white dark:text-black font-extrabold text-[10px]">
                  {todayChallenge.category}
                </span>
                <span className="px-2.5 py-0.5 rounded-md bg-neutral-200 dark:bg-neutral-700 text-neutral-800 dark:text-neutral-200 font-extrabold text-[10px]">
                  {todayChallenge.difficulty}
                </span>
                <span className="flex items-center gap-1 text-[11px] font-bold text-neutral-500 dark:text-neutral-400">
                  <Clock className="w-3 h-3" /> {todayChallenge.durationSeconds}s
                </span>
              </div>

              <h3 className="text-lg font-extrabold text-black dark:text-white">
                "{todayChallenge.title}"
              </h3>
              <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed font-medium">
                {todayChallenge.description}
              </p>
            </div>

            <Link
              to={`/student/challenges/${todayChallenge.id}`}
              className="shrink-0 inline-flex items-center justify-center gap-2 px-6 py-3 bg-black hover:bg-neutral-800 text-white dark:bg-white dark:hover:bg-neutral-200 dark:text-black font-extrabold rounded-xl text-xs transition-all shadow-sm"
            >
              <Mic className="w-4 h-4" /> Start Practice
            </Link>
          </div>
        ) : (
          <div className="p-4 text-center text-xs text-neutral-500">Loading today's practice challenge...</div>
        )}
      </div>

      {/* 3. MY PERFORMANCE GRID */}
      <div>
        <h2 className="text-xs font-extrabold uppercase tracking-widest text-neutral-500 dark:text-neutral-400 mb-3 px-1">
          My Performance Breakdown
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5 shadow-sm">
            <p className="text-[10px] font-extrabold text-neutral-500 uppercase tracking-wider">Overall Score</p>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-2xl sm:text-3xl font-extrabold text-black dark:text-white">{overallScore}</span>
              <span className="text-xs font-bold text-neutral-400">/ 100</span>
            </div>
            <div className="mt-3 w-full h-1.5 rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
              <div className="h-full bg-black dark:bg-white rounded-full" style={{ width: `${overallScore}%` }} />
            </div>
          </div>

          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5 shadow-sm">
            <p className="text-[10px] font-extrabold text-neutral-500 uppercase tracking-wider">Speaking Score</p>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-2xl sm:text-3xl font-extrabold text-black dark:text-white">{speakingScore}</span>
              <span className="text-xs font-bold text-neutral-400">/ 100</span>
            </div>
            <div className="mt-3 w-full h-1.5 rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
              <div className="h-full bg-black dark:bg-white rounded-full" style={{ width: `${speakingScore}%` }} />
            </div>
          </div>

          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5 shadow-sm">
            <p className="text-[10px] font-extrabold text-neutral-500 uppercase tracking-wider">Interview Score</p>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-2xl sm:text-3xl font-extrabold text-black dark:text-white">{interviewScore}</span>
              <span className="text-xs font-bold text-neutral-400">/ 100</span>
            </div>
            <div className="mt-3 w-full h-1.5 rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
              <div className="h-full bg-black dark:bg-white rounded-full" style={{ width: `${interviewScore}%` }} />
            </div>
          </div>

          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5 shadow-sm">
            <p className="text-[10px] font-extrabold text-neutral-500 uppercase tracking-wider">Technical Score</p>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-2xl sm:text-3xl font-extrabold text-black dark:text-white">{technicalScore}</span>
              <span className="text-xs font-bold text-neutral-400">/ 100</span>
            </div>
            <div className="mt-3 w-full h-1.5 rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
              <div className="h-full bg-black dark:bg-white rounded-full" style={{ width: `${technicalScore}%` }} />
            </div>
          </div>

          <div className="col-span-2 sm:col-span-1 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5 shadow-sm">
            <p className="text-[10px] font-extrabold text-neutral-500 uppercase tracking-wider">Confidence Score</p>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-2xl sm:text-3xl font-extrabold text-black dark:text-white">{confidenceScore}</span>
              <span className="text-xs font-bold text-neutral-400">/ 100</span>
            </div>
            <div className="mt-3 w-full h-1.5 rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
              <div className="h-full bg-black dark:bg-white rounded-full" style={{ width: `${confidenceScore}%` }} />
            </div>
          </div>

        </div>
      </div>

      {/* 4. WEEKLY PROGRESS GRAPH & FEEDBACK SIDE-BY-SIDE */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Weekly Progress Graph */}
        <div className="lg:col-span-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-extrabold text-black dark:text-white flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" /> Weekly Progress Trend
                </h3>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                  Tracking speaking & interview performance over the past 7 days
                </p>
              </div>
              <span className="text-xs font-bold text-black dark:text-white border border-black dark:border-white px-3 py-1 rounded-full">
                +8% Fluency Growth
              </span>
            </div>

            <div className="h-56 w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weeklyData}>
                  <defs>
                    <linearGradient id="monoGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#737373" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#737373" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" stroke="#a3a3a3" fontSize={11} tickLine={false} />
                  <YAxis domain={[50, 100]} stroke="#a3a3a3" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#171717',
                      borderColor: '#404040',
                      borderRadius: '12px',
                      color: '#ffffff',
                      fontSize: '11px',
                    }}
                  />
                  <Area type="monotone" dataKey="speakingScore" stroke="#171717" strokeWidth={2.5} fillOpacity={1} fill="url(#monoGrad)" name="Speaking Score" />
                  <Area type="monotone" dataKey="interviewScore" stroke="#a3a3a3" strokeWidth={1.5} strokeDasharray="3 3" fill="none" name="Interview Score" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Strengths & Areas To Improve */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 shadow-sm flex flex-col justify-between space-y-6">
          
          {/* Strengths */}
          <div>
            <h3 className="text-xs font-extrabold uppercase tracking-widest text-neutral-500 dark:text-neutral-400 mb-3 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-black dark:text-white" /> Your Strengths
            </h3>
            <div className="space-y-2">
              {['✓ Rich Vocabulary', '✓ Prompt Relevance', '✓ Steady Confidence'].map((str, idx) => (
                <div key={idx} className="px-3.5 py-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-black dark:text-white text-xs font-bold">
                  {str}
                </div>
              ))}
            </div>
          </div>

          {/* Areas to Improve */}
          <div>
            <h3 className="text-xs font-extrabold uppercase tracking-widest text-neutral-500 dark:text-neutral-400 mb-3 flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-neutral-500" /> Areas to Improve
            </h3>
            <div className="space-y-2">
              {['• Speaking Fluency & Pace', '• Complex Grammar Structures', '• Answer Structure (STAR)'].map((area, idx) => (
                <div key={idx} className="px-3.5 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200 text-xs font-bold">
                  {area}
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* 5. PERSONALIZED RECOMMENDATIONS */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 sm:p-8 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Target className="w-5 h-5 text-black dark:text-white" />
          <h2 className="text-xs font-extrabold uppercase tracking-widest text-neutral-500 dark:text-neutral-400">
            Personalized Recommendations
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          <div className="p-5 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 flex flex-col justify-between">
            <div>
              <span className="px-2.5 py-0.5 rounded-full bg-black text-white dark:bg-white dark:text-black font-extrabold text-[10px]">
                Fluency Focus
              </span>
              <p className="mt-3 text-xs font-bold text-black dark:text-white leading-snug">
                "Practice speaking without filler words such as 'um' and 'like'."
              </p>
            </div>
            <Link
              to="/student/challenges"
              className="mt-4 inline-flex items-center justify-between text-xs font-extrabold text-black dark:text-white hover:underline"
            >
              <span>Practice Now</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="p-5 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 flex flex-col justify-between">
            <div>
              <span className="px-2.5 py-0.5 rounded-full bg-black text-white dark:bg-white dark:text-black font-extrabold text-[10px]">
                HR Prep
              </span>
              <p className="mt-3 text-xs font-bold text-black dark:text-white leading-snug">
                "Try answering one HR interview question today using voice response."
              </p>
            </div>
            <Link
              to="/student/interviews"
              className="mt-4 inline-flex items-center justify-between text-xs font-extrabold text-black dark:text-white hover:underline"
            >
              <span>Practice Now</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="p-5 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 flex flex-col justify-between">
            <div>
              <span className="px-2.5 py-0.5 rounded-full bg-black text-white dark:bg-white dark:text-black font-extrabold text-[10px]">
                Answer Structure
              </span>
              <p className="mt-3 text-xs font-bold text-black dark:text-white leading-snug">
                "Improve your answer structure using the STAR framework."
              </p>
            </div>
            <Link
              to="/student/learning"
              className="mt-4 inline-flex items-center justify-between text-xs font-extrabold text-black dark:text-white hover:underline"
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
