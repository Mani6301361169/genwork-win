import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Award, Sparkles, AlertTriangle, ArrowRight, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';

interface SpeakingResultViewProps {
  attempt: any;
  challenge: any;
  recordedAudioUrl?: string | null;
  onPracticeAgain: () => void;
}

export const SpeakingResultView: React.FC<SpeakingResultViewProps> = ({
  attempt,
  challenge,
  recordedAudioUrl,
  onPracticeAgain,
}) => {
  const navigate = useNavigate();

  useEffect(() => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.55 },
    });
  }, []);

  const overallScore = attempt.overallScore ?? 0;
  const clarityScore = attempt.clarityScore ?? attempt.pronunciationScore ?? 0;
  const fluencyScore = attempt.fluencyScore ?? 0;
  const grammarScore = attempt.grammarScore ?? 0;
  const relevanceScore = attempt.relevanceScore ?? 0;
  const structureScore = attempt.structureScore ?? 0;
  const vocabularyScore = attempt.vocabularyScore ?? 0;

  const confidenceMeter = attempt.confidenceScore ?? 0;
  const durationText = `${attempt.durationSeconds || 31}s`;

  const feedbackSummary = attempt.aiFeedbackJson
    ? (typeof attempt.aiFeedbackJson === 'string'
        ? JSON.parse(attempt.aiFeedbackJson).overallSummary || JSON.parse(attempt.aiFeedbackJson).nextPracticeRecommendation
        : attempt.aiFeedbackJson.overallSummary)
    : "Your answer didn't quite match the topic. Take another look at the question and try again — you've got this!";

  const strengthsList = attempt.aiFeedbackJson
    ? (typeof attempt.aiFeedbackJson === 'string'
        ? JSON.parse(attempt.aiFeedbackJson).strengths
        : attempt.aiFeedbackJson.strengths)
    : [];

  const improvementsList = attempt.aiFeedbackJson
    ? (typeof attempt.aiFeedbackJson === 'string'
        ? JSON.parse(attempt.aiFeedbackJson).improvements
        : attempt.aiFeedbackJson.improvements)
    : [];

  const transcript = attempt.transcript || "No transcript recorded for this attempt.";
  const fillerCount = (transcript.match(/\b(um|uh|like|actually|basically)\b/gi) || []).length;

  const dimensions = [
    { name: 'Clarity', score: clarityScore, weight: '16.67%' },
    { name: 'Fluency', score: fluencyScore, weight: '16.67%' },
    { name: 'Grammar', score: grammarScore, weight: '16.67%' },
    { name: 'Relevancy', score: relevanceScore, weight: '16.66%' },
    { name: 'Structure', score: structureScore, weight: '16.66%' },
    { name: 'Vocabulary', score: vocabularyScore, weight: '16.67%' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6 font-sans text-black dark:text-white pb-20">
      
      {/* 1. TOP HEADER SCORE BANNER */}
      <div className="bg-indigo-600 text-white rounded-3xl p-6 sm:p-8 shadow-xl border-2 border-black relative overflow-hidden space-y-4">
        <p className="text-[10px] font-black uppercase tracking-widest text-indigo-200">
          YOUR CHALLENGE SCORE
        </p>

        <div className="flex items-baseline gap-2">
          <span className="text-6xl font-black tracking-tight">{overallScore}</span>
          <span className="text-2xl font-black text-indigo-200">/100</span>
        </div>

        <div className="inline-block px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-white font-black text-xs border border-white/30">
          "{overallScore >= 70 ? 'Authoritative & Convincing Voice!' : 'Super brave voice!'}"
        </div>

        <p className="text-xs font-black text-indigo-100 flex items-center gap-1.5">
          <Award className="w-4 h-4 text-amber-300" />
          <span>{overallScore >= 70 ? 'Placement Ready' : 'Needs work'} • {durationText}</span>
        </p>
      </div>

      {/* 2. CONFIDENCE METER */}
      <div className="bg-white dark:bg-neutral-900 rounded-3xl p-6 shadow-sm border-2 border-black dark:border-white space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-black text-black dark:text-white">
            Confidence Meter <span className="text-indigo-600 dark:text-indigo-400">{confidenceMeter}%</span>
          </h3>
        </div>

        {/* Gradient Rainbow Slider Bar */}
        <div className="relative pt-2">
          <div className="h-3 rounded-full bg-gradient-to-r from-red-500 via-amber-400 via-yellow-400 to-emerald-500 border border-black shadow-xs" />
          <div
            className="absolute top-1 w-5 h-5 rounded-full bg-white border-2 border-black shadow-md transform -translate-x-1/2 transition-all"
            style={{ left: `${Math.max(5, Math.min(95, confidenceMeter))}%` }}
          />
          <div className="flex justify-between text-[10px] font-black text-neutral-600 dark:text-neutral-400 uppercase mt-2">
            <span>LOW</span>
            <span>MEDIUM</span>
            <span>HIGH</span>
          </div>
        </div>
      </div>

      {/* 3. WINNIFY ANALYSIS CALLOUT */}
      <div className="bg-indigo-50/70 dark:bg-neutral-900 rounded-3xl p-6 shadow-sm border-2 border-black dark:border-white space-y-2">
        <h3 className="text-sm font-black text-black dark:text-white">
          Winnify Analysis
        </h3>
        <div className="p-4 rounded-2xl bg-white dark:bg-neutral-800 border-2 border-black text-xs font-black leading-relaxed text-black dark:text-white">
          {feedbackSummary}
        </div>
      </div>

      {/* 4. DIMENSION BREAKDOWN GRID */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-base font-black text-black dark:text-white">
            Dimension Breakdown
          </h3>
          <span className="text-xs font-black text-indigo-600 dark:text-indigo-400">
            View All Details
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {dimensions.map((dim, idx) => (
            <div key={idx} className="bg-white dark:bg-neutral-900 rounded-2xl p-5 shadow-xs border-2 border-black dark:border-white space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-black text-black dark:text-white">
                  {dim.name} <span className="text-indigo-600 dark:text-indigo-400">{dim.score}</span><span className="text-xs text-neutral-600 font-bold">/100</span>
                </span>
                <span className="text-[10px] font-black text-neutral-600 dark:text-neutral-400 uppercase">
                  Weight {dim.weight}
                </span>
              </div>

              {/* Score Slider Bar */}
              <div className="relative pt-1">
                <div className="h-2.5 rounded-full bg-gradient-to-r from-red-500 via-yellow-400 to-emerald-500 border border-black" />
                <div
                  className="absolute top-0.5 w-4 h-4 rounded-full bg-white border-2 border-black shadow-xs transform -translate-x-1/2"
                  style={{ left: `${Math.max(5, Math.min(95, dim.score))}%` }}
                />
                <div className="flex justify-between text-[9px] font-black text-neutral-600 dark:text-neutral-400 uppercase mt-1">
                  <span>LOW</span>
                  <span>HIGH</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. ANNOTATED TRANSCRIPT */}
      <div className="bg-white dark:bg-neutral-900 rounded-3xl p-6 shadow-sm border-2 border-black dark:border-white space-y-4">
        <h3 className="text-base font-black text-black dark:text-white">
          Annotated Transcript
        </h3>

        <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800 border-2 border-black text-xs font-bold leading-relaxed text-black dark:text-white font-mono min-h-[60px]">
          "{transcript}"
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="px-3.5 py-1.5 rounded-full bg-rose-100 text-rose-900 font-black text-xs border border-rose-300">
            Filler Words · {fillerCount}
          </span>
          <span className="px-3.5 py-1.5 rounded-full bg-amber-100 text-amber-900 font-black text-xs border border-amber-300">
            Grammar · 0
          </span>
          <span className="px-3.5 py-1.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-black dark:text-white font-black text-xs border border-black">
            Pauses · 0 pauses
          </span>
        </div>
      </div>

      {/* 6. STRENGTHS & AREAS TO IMPROVE */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Strengths */}
        <div className="bg-white dark:bg-neutral-900 rounded-3xl p-6 shadow-sm border-2 border-black dark:border-white space-y-3">
          <h4 className="text-sm font-black text-black dark:text-white">
            Strengths
          </h4>
          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border-2 border-emerald-500 text-emerald-900 dark:text-emerald-200 text-xs font-black leading-relaxed">
            {strengthsList && strengthsList.length > 0 ? (
              <ul className="list-disc pl-4 space-y-1">
                {strengthsList.map((s: string, i: number) => <li key={i}>{s}</li>)}
              </ul>
            ) : (
              <span>✓ No specific strengths called out for this attempt.</span>
            )}
          </div>
        </div>

        {/* Areas to Improve */}
        <div className="bg-white dark:bg-neutral-900 rounded-3xl p-6 shadow-sm border-2 border-black dark:border-white space-y-3">
          <h4 className="text-sm font-black text-black dark:text-white">
            Areas to Improve
          </h4>
          <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border-2 border-amber-500 text-amber-900 dark:text-amber-200 text-xs font-black leading-relaxed flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
            <div>
              {improvementsList && improvementsList.length > 0 ? (
                <ul className="list-disc pl-4 space-y-1">
                  {improvementsList.map((imp: string, i: number) => <li key={i}>{imp}</li>)}
                </ul>
              ) : (
                <span>Focus on increasing speaking volume and prompt keyword alignment.</span>
              )}
            </div>
          </div>
        </div>

      </div>

      {/* 7. BETTER WAY TO SAY IT */}
      <div className="bg-white dark:bg-neutral-900 rounded-3xl p-6 shadow-sm border-2 border-black dark:border-white space-y-3">
        <h4 className="text-sm font-black text-black dark:text-white">
          Better Way to Say It
        </h4>
        <div className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-neutral-800 border-2 border-black text-xs font-black leading-relaxed text-black dark:text-white">
          A model response isn't available for this attempt yet. Try practicing again out loud with structured points!
        </div>
      </div>

      {/* FOOTER ACTIONS */}
      <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
        <button
          onClick={onPracticeAgain}
          className="w-full sm:w-auto px-8 py-3.5 bg-indigo-600 text-white font-black text-xs rounded-full border-2 border-black hover:bg-indigo-700 transition-colors shadow-md flex items-center justify-center gap-2"
        >
          <RotateCcw className="w-4 h-4" /> Practice Again
        </button>
        <button
          onClick={() => navigate('/student/challenges')}
          className="w-full sm:w-auto px-6 py-3.5 bg-white text-black dark:bg-neutral-800 dark:text-white font-black text-xs rounded-full border-2 border-black hover:bg-neutral-100 transition-colors flex items-center justify-center gap-1.5"
        >
          Return to Challenges <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
