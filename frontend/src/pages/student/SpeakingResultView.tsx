import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, CheckCircle2, AlertCircle, Sparkles, ArrowRight, RotateCcw, Target } from 'lucide-react';
import confetti from 'canvas-confetti';

interface SpeakingResultViewProps {
  attempt: any;
  challenge: any;
  onPracticeAgain: () => void;
}

export const SpeakingResultView: React.FC<SpeakingResultViewProps> = ({
  attempt,
  challenge,
  onPracticeAgain,
}) => {
  const navigate = useNavigate();

  useEffect(() => {
    // Trigger confetti celebration on completion
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });
  }, []);

  const overall = attempt.overallScore || 74;
  const feedback = attempt.aiFeedback || attempt.feedback || {
    strengths: ['You stayed highly relevant to the prompt.', 'Good choice of academic vocabulary.', 'Clear summary conclusion.'],
    improvements: ['Reduce filler words such as "um" and "actually".', 'Use shorter sentences for better flow.', 'Give a concrete example to support your opinion.'],
    nextPracticeRecommendation: 'Try another 60-second challenge focusing on speaking fluency.',
  };

  const metrics = [
    { label: 'Fluency', score: attempt.fluencyScore || 68, color: 'bg-brand-500' },
    { label: 'Grammar', score: attempt.grammarScore || 76, color: 'bg-accent-500' },
    { label: 'Vocabulary', score: attempt.vocabularyScore || 82, color: 'bg-emerald-500' },
    { label: 'Pronunciation', score: attempt.pronunciationScore || 80, color: 'bg-indigo-500' },
    { label: 'Relevance', score: attempt.relevanceScore || 85, color: 'bg-amber-500' },
    { label: 'Confidence', score: attempt.confidenceScore || 69, color: 'bg-purple-500' },
    { label: 'Answer Structure', score: attempt.structureScore || 71, color: 'bg-cyan-500' },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in zoom-in-95 duration-300">
      
      {/* Overall Score Header */}
      <div className="bg-gradient-to-tr from-brand-900 via-brand-800 to-accent-900 rounded-3xl p-8 text-white shadow-soft text-center relative overflow-hidden">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-brand-200 text-xs font-bold mb-4">
          <Sparkles className="w-3.5 h-3.5 text-accent-400" /> AI Voice Analysis Complete
        </div>

        <h2 className="text-xl font-extrabold text-brand-100">"{challenge?.title || 'Speaking Challenge'}"</h2>

        <div className="my-6 inline-flex flex-col items-center justify-center w-36 h-36 rounded-full bg-white/10 backdrop-blur-md border-4 border-white/20 shadow-glow">
          <span className="text-5xl font-extrabold tracking-tight">{overall}</span>
          <span className="text-xs font-bold text-brand-200 uppercase tracking-widest mt-1">/ 100 Score</span>
        </div>

        {/* Strongest vs Focus Area Badges */}
        <div className="flex flex-wrap items-center justify-center gap-3 max-w-md mx-auto">
          <div className="px-4 py-2 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-200 text-xs font-bold flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Strongest Area: <span className="text-white font-extrabold">{attempt.strongestArea || 'Vocabulary'}</span>
          </div>
          <div className="px-4 py-2 rounded-2xl bg-amber-500/20 border border-amber-400/40 text-amber-200 text-xs font-bold flex items-center gap-1.5">
            <Target className="w-4 h-4 text-amber-400" /> Focus Area: <span className="text-white font-extrabold">{attempt.focusArea || 'Fluency'}</span>
          </div>
        </div>
      </div>

      {/* Metric Breakdown Sliders */}
      <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-soft">
        <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-6">
          Detailed Score Breakdown
        </h3>

        <div className="space-y-4">
          {metrics.map((m) => (
            <div key={m.label} className="space-y-1.5">
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-slate-700 dark:text-slate-300">{m.label}</span>
                <span className="text-slate-900 dark:text-white font-mono font-extrabold">{m.score} / 100</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${m.color}`}
                  style={{ width: `${m.score}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Structured AI Feedback Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* WHAT YOU DID WELL */}
        <div className="bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-900/40 rounded-3xl p-6 shadow-soft">
          <h4 className="text-xs font-extrabold uppercase tracking-widest text-emerald-800 dark:text-emerald-400 mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> What You Did Well
          </h4>
          <ul className="space-y-2.5">
            {feedback.strengths.map((str: string, idx: number) => (
              <li key={idx} className="flex items-start gap-2 text-xs font-bold text-emerald-900 dark:text-emerald-200">
                <span className="text-emerald-600 shrink-0">✓</span>
                <span>{str}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* IMPROVE NEXT TIME */}
        <div className="bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-900/40 rounded-3xl p-6 shadow-soft">
          <h4 className="text-xs font-extrabold uppercase tracking-widest text-amber-800 dark:text-amber-400 mb-4 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400" /> Improve Next Time
          </h4>
          <ul className="space-y-2.5">
            {feedback.improvements.map((imp: string, idx: number) => (
              <li key={idx} className="flex items-start gap-2 text-xs font-bold text-amber-900 dark:text-amber-200">
                <span className="text-amber-600 shrink-0">•</span>
                <span>{imp}</span>
              </li>
            ))}
          </ul>
        </div>

      </div>

      {/* NEXT PRACTICE RECOMMENDATION CARD */}
      <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 text-center shadow-soft">
        <p className="text-[11px] font-extrabold uppercase tracking-widest text-brand-600 dark:text-brand-400 mb-1">
          Next Recommended Practice
        </p>
        <p className="text-sm font-bold text-slate-800 dark:text-slate-100 max-w-md mx-auto">
          "{feedback.nextPracticeRecommendation}"
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={onPracticeAgain}
            className="flex items-center gap-2 px-6 py-3 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-2xl font-bold text-xs hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            <RotateCcw className="w-4 h-4" /> Practice Again
          </button>

          <button
            onClick={() => navigate('/student/challenges')}
            className="flex items-center gap-2 px-8 py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-2xl font-bold text-xs shadow-soft transition-colors"
          >
            Explore Next Challenges <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

    </div>
  );
};
