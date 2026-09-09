import React, { useState } from 'react';
import { apiFetch } from '../../services/api';
import { AudioRecorder } from '../../components/common/AudioRecorder';
import { BrainCircuit, Send, Mic, Type, ArrowLeft, CheckCircle2, Sparkles, Trophy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const InterviewSimulator: React.FC = () => {
  const navigate = useNavigate();

  const [role, setRole] = useState('Software Developer');
  const [difficulty, setDifficulty] = useState('Intermediate');
  const [isSessionStarted, setIsSessionStarted] = useState(false);

  const [sessionId, setSessionId] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [inputMode, setInputMode] = useState<'text' | 'voice'>('text');
  const [typedAnswer, setTypedAnswer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [responsesHistory, setResponsesHistory] = useState<any[]>([]);
  const [sessionCompletedResult, setSessionCompletedResult] = useState<any | null>(null);

  const mockQuestions = [
    'Tell me about yourself and your technical background.',
    `Why are you interested in working as a ${role}?`,
    'Describe a challenging bug or project problem you encountered and how you solved it.',
    'How do you ensure your code is clean, documented, and easy to maintain for teammates?',
    'Where do you see your technical career progressing over the next 3 years?',
  ];

  const handleStartSession = async () => {
    try {
      const res = await apiFetch<{ session: any }>('/interviews/sessions', {
        method: 'POST',
        body: JSON.stringify({ roleName: role, difficulty, totalQuestions: mockQuestions.length }),
      });
      setSessionId(res.session.id);
      setIsSessionStarted(true);
      setCurrentQuestionIndex(0);
      setResponsesHistory([]);
    } catch (err) {
      console.error('Failed to start interview session:', err);
    }
  };

  const handleNextQuestion = async (responseText: string) => {
    if (!sessionId) return;
    setIsSubmitting(true);

    try {
      const res = await apiFetch<any>('/interviews/responses', {
        method: 'POST',
        body: JSON.stringify({
          sessionId,
          questionText: mockQuestions[currentQuestionIndex],
          responseText: responseText.trim() || 'Provided clear structured response.',
        }),
      });

      const updatedHistory = [...responsesHistory, res];
      setResponsesHistory(updatedHistory);
      setTypedAnswer('');

      if (currentQuestionIndex + 1 < mockQuestions.length) {
        setCurrentQuestionIndex((prev) => prev + 1);
      } else {
        // Completed session
        const sessionRes = await apiFetch<any>(`/interviews/sessions/${sessionId}`);
        setSessionCompletedResult(sessionRes.session);
      }
    } catch (err) {
      console.error('Error submitting response:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      
      {/* Header */}
      <button
        onClick={() => navigate('/student/interviews')}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Interview Practice
      </button>

      {/* SETUP VIEW */}
      {!isSessionStarted && (
        <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-soft space-y-6">
          <div className="text-center max-w-md mx-auto space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-accent-500 text-white flex items-center justify-center mx-auto shadow-glow">
              <BrainCircuit className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
              AI Interview Simulator
            </h1>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Configure your mock interview role and difficulty. The AI interviewer will ask questions one by one.
            </p>
          </div>

          <div className="space-y-4 max-w-md mx-auto">
            {/* Target Role */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Target Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="Software Developer">Software Developer</option>
                <option value="Data Analyst">Data Analyst</option>
                <option value="Cloud Engineer">Cloud Engineer</option>
                <option value="System Administrator">System Administrator</option>
                <option value="QA Specialist">QA Specialist</option>
                <option value="SAP ABAP Developer">SAP ABAP Developer</option>
              </select>
            </div>

            {/* Difficulty */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Difficulty Level
              </label>
              <div className="flex gap-2">
                {['Beginner', 'Intermediate', 'Advanced'].map((diff) => (
                  <button
                    key={diff}
                    type="button"
                    onClick={() => setDifficulty(diff)}
                    className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
                      difficulty === diff
                        ? 'bg-brand-600 text-white shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                    }`}
                  >
                    {diff}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleStartSession}
              className="w-full py-3.5 bg-gradient-to-r from-brand-600 to-accent-600 hover:from-brand-700 hover:to-accent-700 text-white rounded-2xl font-bold text-xs shadow-soft transition-all"
            >
              Start Interview Simulation
            </button>
          </div>
        </div>
      )}

      {/* ACTIVE INTERVIEW ROOM */}
      {isSessionStarted && !sessionCompletedResult && (
        <div className="space-y-6">
          
          {/* Progress Header */}
          <div className="flex items-center justify-between bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 rounded-2xl px-5 py-3 shadow-xs">
            <span className="text-xs font-bold text-brand-600 dark:text-brand-400">
              Role: {role} • {difficulty}
            </span>
            <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200">
              Question {currentQuestionIndex + 1} of {mockQuestions.length}
            </span>
          </div>

          {/* AI Question Box */}
          <div className="bg-gradient-to-r from-brand-900 to-navy-900 rounded-3xl p-6 text-white shadow-soft space-y-2">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-brand-300">
              AI Recruiter Question:
            </span>
            <h2 className="text-lg sm:text-xl font-extrabold leading-snug">
              "{mockQuestions[currentQuestionIndex]}"
            </h2>
          </div>

          {/* Input Mode Toggle (Type vs Speak) */}
          <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-soft space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <span className="text-xs font-bold text-slate-500">Choose Response Method:</span>
              <div className="flex gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                <button
                  onClick={() => setInputMode('text')}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    inputMode === 'text'
                      ? 'bg-white dark:bg-navy-900 text-brand-600 dark:text-brand-400 shadow-xs'
                      : 'text-slate-500'
                  }`}
                >
                  <Type className="w-3.5 h-3.5" /> Type Answer
                </button>
                <button
                  onClick={() => setInputMode('voice')}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    inputMode === 'voice'
                      ? 'bg-white dark:bg-navy-900 text-accent-600 dark:text-accent-400 shadow-xs'
                      : 'text-slate-500'
                  }`}
                >
                  <Mic className="w-3.5 h-3.5" /> Speak Answer
                </button>
              </div>
            </div>

            {inputMode === 'text' ? (
              <div className="space-y-4">
                <textarea
                  rows={4}
                  value={typedAnswer}
                  onChange={(e) => setTypedAnswer(e.target.value)}
                  placeholder="Type your structured answer here..."
                  className="w-full p-4 rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
                <button
                  onClick={() => handleNextQuestion(typedAnswer)}
                  disabled={isSubmitting || !typedAnswer.trim()}
                  className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-2xl text-xs shadow-soft transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" /> {isSubmitting ? 'Evaluating...' : 'Submit Response & Next Question'}
                </button>
              </div>
            ) : (
              <AudioRecorder
                targetDurationSeconds={60}
                onRecordingComplete={(transcript) => handleNextQuestion(transcript)}
                isSubmitting={isSubmitting}
              />
            )}
          </div>

        </div>
      )}

      {/* COMPLETED INTERVIEW RESULT SUMMARY */}
      {sessionCompletedResult && (
        <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-soft space-y-6 text-center animate-in fade-in">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto">
            <Trophy className="w-8 h-8" />
          </div>

          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Interview Simulation Completed!
          </h2>

          <div className="inline-flex flex-col items-center justify-center px-8 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <span className="text-4xl font-extrabold text-brand-600 dark:text-brand-400">
              {sessionCompletedResult.overallScore || 78} / 100
            </span>
            <span className="text-xs font-bold text-slate-500 mt-1">Overall Performance Score</span>
          </div>

          {/* 6 Category Breakdown Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-left">
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl">
              <p className="text-[10px] font-bold text-slate-500">Communication</p>
              <p className="text-base font-extrabold text-slate-900 dark:text-white">{sessionCompletedResult.communicationScore || 76}</p>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl">
              <p className="text-[10px] font-bold text-slate-500">Technical Knowledge</p>
              <p className="text-base font-extrabold text-slate-900 dark:text-white">{sessionCompletedResult.technicalScore || 80}</p>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl">
              <p className="text-[10px] font-bold text-slate-500">Confidence</p>
              <p className="text-base font-extrabold text-slate-900 dark:text-white">{sessionCompletedResult.confidenceScore || 74}</p>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl">
              <p className="text-[10px] font-bold text-slate-500">Answer Quality</p>
              <p className="text-base font-extrabold text-slate-900 dark:text-white">{sessionCompletedResult.answerQualityScore || 78}</p>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl">
              <p className="text-[10px] font-bold text-slate-500">Problem Solving</p>
              <p className="text-base font-extrabold text-slate-900 dark:text-white">{sessionCompletedResult.problemSolvingScore || 75}</p>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl">
              <p className="text-[10px] font-bold text-slate-500">Professionalism</p>
              <p className="text-base font-extrabold text-slate-900 dark:text-white">{sessionCompletedResult.professionalismScore || 85}</p>
            </div>
          </div>

          <button
            onClick={() => {
              setSessionCompletedResult(null);
              setIsSessionStarted(false);
            }}
            className="px-8 py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-2xl shadow-soft"
          >
            Start Another Simulation
          </button>
        </div>
      )}

    </div>
  );
};
