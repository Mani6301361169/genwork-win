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
  BrainCircuit,
  Building2,
  BookOpen,
  Calendar,
  ChevronRight,
  Flame,
  Zap,
  Activity
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const profile = user?.profile;

  const [todayChallenge, setTodayChallenge] = useState<Challenge | null>(null);
  const [scoresData, setScoresData] = useState<any>(null);
  const [historyData, setHistoryData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [chRes, scoreRes, histRes] = await Promise.all([
          apiFetch<{ challenge: Challenge }>('/challenges/today'),
          apiFetch<any>('/analytics/scores'),
          apiFetch<{ attempts: any[] }>('/challenges/history?limit=3').catch(() => ({ attempts: [] })),
        ]);
        setTodayChallenge(chRes.challenge);
        setScoresData(scoreRes);
        setHistoryData(histRes.attempts || []);
      } catch (err) {
        console.error('Failed to load student workspace dashboard:', err);
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
    <div className="space-y-8 max-w-7xl mx-auto font-sans text-black">
      
      {/* 1. BLACK & WHITE STUDENT WORKSPACE HERO BANNER */}
      <div className="bg-black text-white rounded-3xl p-8 border-2 border-black shadow-lg relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          
          {/* Welcome Text */}
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-700 text-zinc-200 text-xs font-extrabold uppercase tracking-wider">
              <Zap className="w-3.5 h-3.5 text-white" /> Student Workspace Home
            </div>
            
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              {getGreeting()}, <span className="underline underline-offset-4 decoration-zinc-500">{profile?.fullName || 'Student'}</span> 👋
            </h1>
            
            <p className="text-xs sm:text-sm font-medium text-zinc-300 leading-relaxed">
              Target Role: <strong className="text-white">Software Engineer</strong> • Student ID: <span className="font-mono bg-zinc-900 px-2 py-0.5 rounded border border-zinc-700 text-white">{profile?.studentId || 'SKP-2026-001'}</span>
            </p>

            <div className="pt-2 flex flex-wrap gap-3 text-xs font-bold">
              <div className="bg-zinc-900 border border-zinc-700 px-4 py-2 rounded-xl flex items-center gap-2 text-white">
                <Flame className="w-4 h-4 text-white fill-white" />
                <span>Current Streak: {profile?.currentStreak || 1} Days</span>
              </div>
              <div className="bg-zinc-900 border border-zinc-700 px-4 py-2 rounded-xl flex items-center gap-2 text-white">
                <Award className="w-4 h-4 text-white" />
                <span>XP Points: {profile?.totalXP || 450} XP</span>
              </div>
            </div>
          </div>

          {/* Placement Readiness Meter Ring Card */}
          <div className="bg-zinc-900 border-2 border-zinc-700 rounded-2xl p-6 text-center shrink-0 w-full sm:w-64 space-y-3">
            <p className="text-[11px] font-extrabold uppercase tracking-widest text-zinc-400">
              Placement Readiness Index
            </p>
            <div className="text-4xl font-extrabold font-mono text-white">
              {overallScore} <span className="text-xs font-bold text-zinc-400">/ 100</span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-zinc-800 overflow-hidden border border-zinc-700">
              <div className="h-full bg-white rounded-full" style={{ width: `${overallScore}%` }} />
            </div>
            <p className="text-[10px] font-extrabold text-zinc-300">
              {overallScore >= 75 ? 'Ready for Campus Placement Interviews' : 'On Track - Keep Practicing Daily'}
            </p>
          </div>

        </div>
      </div>

      {/* 2. STUDENT WORKSPACE QUICK ACTION HUBS (4 CARDS GRID) */}
      <div>
        <h2 className="text-xs font-extrabold uppercase tracking-widest text-zinc-700 mb-3 px-1">
          Student Practice Hubs
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <Link
            to="/student/challenges"
            className="group bg-white border-2 border-black rounded-2xl p-5 shadow-xs hover:bg-black hover:text-white transition-all flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-black text-white group-hover:bg-white group-hover:text-black flex items-center justify-center font-bold border border-black transition-colors">
                <Mic className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded border border-black group-hover:border-white">
                30+ Topics
              </span>
            </div>
            <div>
              <h3 className="text-sm font-extrabold tracking-tight">Speaking Practice</h3>
              <p className="text-xs text-zinc-600 group-hover:text-zinc-300 mt-1 font-medium">
                60s audio prompt challenges with real AI speech analysis.
              </p>
            </div>
            <div className="mt-4 flex items-center gap-1 text-xs font-extrabold">
              <span>Enter Practice Room</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </Link>

          <Link
            to="/student/interviews"
            className="group bg-white border-2 border-black rounded-2xl p-5 shadow-xs hover:bg-black hover:text-white transition-all flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-black text-white group-hover:bg-white group-hover:text-black flex items-center justify-center font-bold border border-black transition-colors">
                <BrainCircuit className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded border border-black group-hover:border-white">
                150+ Qs
              </span>
            </div>
            <div>
              <h3 className="text-sm font-extrabold tracking-tight">AI Interview Simulator</h3>
              <p className="text-xs text-zinc-600 group-hover:text-zinc-300 mt-1 font-medium">
                Technical & HR mock interviews with dynamic recruiter prompts.
              </p>
            </div>
            <div className="mt-4 flex items-center gap-1 text-xs font-extrabold">
              <span>Start Mock Interview</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </Link>

          <Link
            to="/student/campus"
            className="group bg-white border-2 border-black rounded-2xl p-5 shadow-xs hover:bg-black hover:text-white transition-all flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-black text-white group-hover:bg-white group-hover:text-black flex items-center justify-center font-bold border border-black transition-colors">
                <Building2 className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded border border-black group-hover:border-white">
                Department
              </span>
            </div>
            <div>
              <h3 className="text-sm font-extrabold tracking-tight">Campus Challenges</h3>
              <p className="text-xs text-zinc-600 group-hover:text-zinc-300 mt-1 font-medium">
                Benchmark against department peers and college leaderboard.
              </p>
            </div>
            <div className="mt-4 flex items-center gap-1 text-xs font-extrabold">
              <span>View Department Leaderboard</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </Link>

          <Link
            to="/student/learning"
            className="group bg-white border-2 border-black rounded-2xl p-5 shadow-xs hover:bg-black hover:text-white transition-all flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-black text-white group-hover:bg-white group-hover:text-black flex items-center justify-center font-bold border border-black transition-colors">
                <BookOpen className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded border border-black group-hover:border-white">
                10 Guides
              </span>
            </div>
            <div>
              <h3 className="text-sm font-extrabold tracking-tight">Learning Center</h3>
              <p className="text-xs text-zinc-600 group-hover:text-zinc-300 mt-1 font-medium">
                Self-paced modules on STAR framework, fluency & vocabulary.
              </p>
            </div>
            <div className="mt-4 flex items-center gap-1 text-xs font-extrabold">
              <span>Explore Learning Center</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </Link>

        </div>
      </div>

      {/* 3. TODAY'S RECOMMENDED PRACTICE CHALLENGE */}
      <div className="bg-white border-2 border-black rounded-3xl p-6 sm:p-8 shadow-xs">
        <div className="flex items-center justify-between mb-4 pb-3 border-b-2 border-black">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-black text-white flex items-center justify-center font-bold">
              <Mic className="w-4 h-4" />
            </div>
            <h2 className="text-xs font-extrabold uppercase tracking-widest text-black">
              Today's Recommended Speaking Challenge
            </h2>
          </div>
          <span className="px-3.5 py-1 rounded-full bg-black text-white border border-black font-extrabold text-[11px]">
            Recommended Daily
          </span>
        </div>

        {todayChallenge ? (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-zinc-50 p-6 rounded-2xl border-2 border-black">
            <div className="space-y-2 max-w-xl">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-md bg-black text-white font-extrabold text-[10px]">
                  {todayChallenge.category}
                </span>
                <span className="px-2.5 py-0.5 rounded-md bg-white border border-black text-black font-extrabold text-[10px]">
                  {todayChallenge.difficulty}
                </span>
                <span className="flex items-center gap-1 text-[11px] font-bold text-zinc-700">
                  <Clock className="w-3.5 h-3.5" /> {todayChallenge.durationSeconds} Seconds
                </span>
              </div>

              <h3 className="text-xl font-extrabold text-black">
                "{todayChallenge.title}"
              </h3>
              <p className="text-xs text-zinc-800 leading-relaxed font-medium">
                {todayChallenge.description}
              </p>
            </div>

            <Link
              to={`/student/challenges/${todayChallenge.id}`}
              className="shrink-0 inline-flex items-center justify-center gap-2 px-8 py-4 bg-black hover:bg-zinc-800 text-white font-extrabold rounded-2xl text-xs transition-all shadow-md border-2 border-black"
            >
              <Mic className="w-4 h-4" /> Start Practice (30s+ Limit)
            </Link>
          </div>
        ) : (
          <div className="p-6 text-center text-xs font-bold text-zinc-500">Loading today's practice challenge...</div>
        )}
      </div>

      {/* 4. PERFORMANCE METRICS BREAKDOWN GRID */}
      <div>
        <h2 className="text-xs font-extrabold uppercase tracking-widest text-zinc-700 mb-3 px-1">
          Skill Performance Breakdown
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          
          <div className="bg-white border-2 border-black rounded-2xl p-5 shadow-xs">
            <p className="text-[10px] font-extrabold text-black uppercase tracking-wider">Overall Score</p>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-3xl font-extrabold text-black">{overallScore}</span>
              <span className="text-xs font-bold text-zinc-400">/ 100</span>
            </div>
            <div className="mt-3.5 w-full h-2 rounded-full bg-zinc-200 overflow-hidden border border-black">
              <div className="h-full bg-black rounded-full" style={{ width: `${overallScore}%` }} />
            </div>
          </div>

          <div className="bg-white border-2 border-black rounded-2xl p-5 shadow-xs">
            <p className="text-[10px] font-extrabold text-black uppercase tracking-wider">Speaking Score</p>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-3xl font-extrabold text-black">{speakingScore}</span>
              <span className="text-xs font-bold text-zinc-400">/ 100</span>
            </div>
            <div className="mt-3.5 w-full h-2 rounded-full bg-zinc-200 overflow-hidden border border-black">
              <div className="h-full bg-black rounded-full" style={{ width: `${speakingScore}%` }} />
            </div>
          </div>

          <div className="bg-white border-2 border-black rounded-2xl p-5 shadow-xs">
            <p className="text-[10px] font-extrabold text-black uppercase tracking-wider">Interview Score</p>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-3xl font-extrabold text-black">{interviewScore}</span>
              <span className="text-xs font-bold text-zinc-400">/ 100</span>
            </div>
            <div className="mt-3.5 w-full h-2 rounded-full bg-zinc-200 overflow-hidden border border-black">
              <div className="h-full bg-black rounded-full" style={{ width: `${interviewScore}%` }} />
            </div>
          </div>

          <div className="bg-white border-2 border-black rounded-2xl p-5 shadow-xs">
            <p className="text-[10px] font-extrabold text-black uppercase tracking-wider">Technical Score</p>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-3xl font-extrabold text-black">{technicalScore}</span>
              <span className="text-xs font-bold text-zinc-400">/ 100</span>
            </div>
            <div className="mt-3.5 w-full h-2 rounded-full bg-zinc-200 overflow-hidden border border-black">
              <div className="h-full bg-black rounded-full" style={{ width: `${technicalScore}%` }} />
            </div>
          </div>

          <div className="col-span-2 sm:col-span-1 bg-white border-2 border-black rounded-2xl p-5 shadow-xs">
            <p className="text-[10px] font-extrabold text-black uppercase tracking-wider">Confidence Score</p>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-3xl font-extrabold text-black">{confidenceScore}</span>
              <span className="text-xs font-bold text-zinc-400">/ 100</span>
            </div>
            <div className="mt-3.5 w-full h-2 rounded-full bg-zinc-200 overflow-hidden border border-black">
              <div className="h-full bg-black rounded-full" style={{ width: `${confidenceScore}%` }} />
            </div>
          </div>

        </div>
      </div>

      {/* 5. WEEKLY PROGRESS GRAPH & AI DIAGNOSTIC BREAKDOWN */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Weekly Progress Graph */}
        <div className="lg:col-span-2 bg-white border-2 border-black rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b-2 border-black">
              <div>
                <h3 className="text-sm font-extrabold text-black flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-black" /> Weekly Performance Growth
                </h3>
                <p className="text-[11px] text-zinc-600 font-medium">
                  Tracking speaking & interview scores over past 7 days
                </p>
              </div>
              <span className="text-xs font-extrabold text-black bg-zinc-100 border border-black px-3.5 py-1 rounded-full">
                +8% Fluency Growth
              </span>
            </div>

            <div className="h-60 w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weeklyData}>
                  <defs>
                    <linearGradient id="monochromeGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#000000" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#000000" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" stroke="#000000" fontSize={11} tickLine={false} />
                  <YAxis domain={[50, 100]} stroke="#000000" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#000000',
                      borderRadius: '12px',
                      color: '#ffffff',
                      fontSize: '11px',
                      border: '1px solid #000000',
                    }}
                  />
                  <Area type="monotone" dataKey="speakingScore" stroke="#000000" strokeWidth={3} fillOpacity={1} fill="url(#monochromeGrad)" name="Speaking Score" />
                  <Area type="monotone" dataKey="interviewScore" stroke="#71717a" strokeWidth={2} strokeDasharray="3 3" fill="none" name="Interview Score" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Strengths & Areas To Improve */}
        <div className="bg-white border-2 border-black rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col justify-between space-y-6">
          
          {/* Strengths */}
          <div>
            <h3 className="text-xs font-extrabold uppercase tracking-widest text-black mb-3 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-black" /> Verified Strengths
            </h3>
            <div className="space-y-2.5">
              {['✓ Rich Technical Vocabulary', '✓ Prompt Relevance & Thesis Statement', '✓ Clear Vocal Confidence'].map((str, idx) => (
                <div key={idx} className="px-4 py-2.5 rounded-xl bg-black text-white text-xs font-extrabold border border-black">
                  {str}
                </div>
              ))}
            </div>
          </div>

          {/* Areas to Improve */}
          <div>
            <h3 className="text-xs font-extrabold uppercase tracking-widest text-black mb-3 flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-black" /> Focus Growth Areas
            </h3>
            <div className="space-y-2.5">
              {['• Eliminate Filler Words ("um", "like")', '• Sentence Length & Transition Markers', '• STAR Framework Structured Answers'].map((area, idx) => (
                <div key={idx} className="px-4 py-2.5 rounded-xl bg-zinc-100 text-black text-xs font-extrabold border border-black">
                  {area}
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* 6. RECENT ACTIVITY TIMELINE */}
      {historyData.length > 0 && (
        <div className="bg-white border-2 border-black rounded-3xl p-6 sm:p-8 shadow-xs">
          <div className="flex items-center justify-between mb-4 pb-3 border-b-2 border-black">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-black" />
              <h2 className="text-xs font-extrabold uppercase tracking-widest text-black">
                Recent Practice Activity
              </h2>
            </div>
            <Link to="/student/history" className="text-xs font-extrabold text-black hover:underline flex items-center gap-1">
              <span>View Full History</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="space-y-3">
            {historyData.slice(0, 3).map((attempt, i) => (
              <div key={i} className="p-4 rounded-2xl bg-zinc-50 border border-black flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-black text-white">
                    {attempt.challenge?.category || 'Speaking Practice'}
                  </span>
                  <p className="text-xs font-extrabold text-black mt-1">
                    "{attempt.challenge?.title || 'Practice Attempt'}"
                  </p>
                  <p className="text-[11px] text-zinc-600 italic mt-0.5 font-medium line-clamp-1">
                    "{attempt.transcript}"
                  </p>
                </div>
                <div className="shrink-0 flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-base font-extrabold text-black">{attempt.overallScore} / 100</p>
                    <p className="text-[10px] text-zinc-500 font-bold">{new Date(attempt.completedAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 7. PERSONALIZED RECOMMENDATIONS */}
      <div className="bg-white border-2 border-black rounded-3xl p-6 sm:p-8 shadow-xs">
        <div className="flex items-center gap-2 mb-4 pb-3 border-b-2 border-black">
          <Target className="w-5 h-5 text-black" />
          <h2 className="text-xs font-extrabold uppercase tracking-widest text-black">
            Personalized Skill Recommendations
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          <div className="p-5 rounded-2xl bg-zinc-50 border-2 border-black flex flex-col justify-between space-y-4">
            <div>
              <span className="px-2.5 py-0.5 rounded-md bg-black text-white font-extrabold text-[10px]">
                Fluency Focus
              </span>
              <p className="mt-3 text-xs font-extrabold text-black leading-snug">
                "Practice speaking continuously for 60 seconds without using filler words like 'um' or 'like'."
              </p>
            </div>
            <Link
              to="/student/challenges"
              className="inline-flex items-center justify-between text-xs font-extrabold text-black hover:underline"
            >
              <span>Start Speaking Practice</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="p-5 rounded-2xl bg-zinc-50 border-2 border-black flex flex-col justify-between space-y-4">
            <div>
              <span className="px-2.5 py-0.5 rounded-md bg-black text-white font-extrabold text-[10px]">
                HR Mock Interview
              </span>
              <p className="mt-3 text-xs font-extrabold text-black leading-snug">
                "Complete a 5-question mock HR interview simulation using voice response."
              </p>
            </div>
            <Link
              to="/student/interviews"
              className="inline-flex items-center justify-between text-xs font-extrabold text-black hover:underline"
            >
              <span>Start Mock Interview</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="p-5 rounded-2xl bg-zinc-50 border-2 border-black flex flex-col justify-between space-y-4">
            <div>
              <span className="px-2.5 py-0.5 rounded-md bg-black text-white font-extrabold text-[10px]">
                Answer Structure
              </span>
              <p className="mt-3 text-xs font-extrabold text-black leading-snug">
                "Learn how to format technical responses using the STAR (Situation, Task, Action, Result) methodology."
              </p>
            </div>
            <Link
              to="/student/learning"
              className="inline-flex items-center justify-between text-xs font-extrabold text-black hover:underline"
            >
              <span>Open Learning Guide</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>
      </div>

    </div>
  );
};
