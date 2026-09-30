import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, CheckCircle2, AlertCircle, Sparkles, ArrowRight, RotateCcw, Target, Gauge, Type, Lightbulb, Zap, Award, Volume2, Play, Square } from 'lucide-react';
import confetti from 'canvas-confetti';

interface AnnotatedWord {
  text: string;
  type: 'filler' | 'advanced' | 'transition' | 'normal';
}

interface VocabularyEnhancement {
  word: string;
  suggestion: string;
  reason: string;
}

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
  const [isPlayingSpeech, setIsPlayingSpeech] = useState(false);

  useEffect(() => {
    confetti({
      particleCount: 90,
      spread: 75,
      origin: { y: 0.55 },
    });

    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const overall = attempt.overallScore || 63;
  const feedback = attempt.aiFeedback || attempt.feedback || {
    strengths: ['You initiated your speaking practice clearly with good tone.', 'High prompt keyword alignment.', 'Clear vocal articulation.'],
    improvements: ['Reduce filler words like "um" or "actually".', 'Increase speaking length to at least 45-65 words.', 'Use logical transition phrases for structure.'],
    nextPracticeRecommendation: 'Try another 60-second speaking challenge focusing on continuous fluency.',
  };

  // Winnify-style CEFR & PTE Band Calculations
  const cefrLevel = attempt.cefrLevel || (overall >= 78 ? 'C1 Advanced' : overall >= 63 ? 'B2 Upper-Intermediate' : overall >= 50 ? 'B1 Intermediate' : 'A2 Elementary');
  const pteEquivalent = attempt.pteEquivalent || Math.round(10 + (overall / 100) * 80);
  const wpm = attempt.wpm || 128;
  const wordCount = attempt.wordCount || (attempt.transcript ? attempt.transcript.split(/\s+/).length : 24);
  const fillerCount = attempt.fillerCount ?? 1;

  // Annotated transcript parsing fallback
  const rawTranscript = attempt.transcript || 'Why continuous learning is essential for software developers in modern technology ecosystems.';
  const annotatedWords: AnnotatedWord[] = attempt.annotatedWords || rawTranscript.split(/\s+/).map((word: string) => {
    const clean = word.toLowerCase().replace(/[^a-z]/g, '');
    if (['um', 'uh', 'like', 'actually', 'basically', 'literally', 'honestly'].includes(clean)) {
      return { text: word, type: 'filler' };
    }
    if (['firstly', 'secondly', 'however', 'therefore', 'consequently', 'furthermore', 'because'].includes(clean)) {
      return { text: word, type: 'transition' };
    }
    if (['continuous', 'learning', 'essential', 'software', 'developers', 'technology', 'ecosystems', 'architecture', 'efficiency'].includes(clean)) {
      return { text: word, type: 'advanced' };
    }
    return { text: word, type: 'normal' };
  });

  const vocabularyEnhancements: VocabularyEnhancement[] = attempt.vocabularyEnhancements || [
    { word: 'essential', suggestion: 'paramount / indispensable', reason: 'Upgrades basic adjective to C1 formal academic tone.' },
    { word: 'good', suggestion: 'exemplary / advantageous', reason: 'Enhances vocabulary sophistication and precision.' },
  ];

  const metrics = [
    { label: 'Fluency & Flow', score: attempt.fluencyScore || 65, color: 'bg-emerald-500' },
    { label: 'Grammatical Accuracy', score: attempt.grammarScore || 72, color: 'bg-teal-500' },
    { label: 'Lexical Sophistication', score: attempt.vocabularyScore || 78, color: 'bg-amber-500' },
    { label: 'Pronunciation & Intonation', score: attempt.pronunciationScore || 74, color: 'bg-indigo-500' },
    { label: 'Prompt Relevance', score: attempt.relevanceScore || 80, color: 'bg-blue-500' },
    { label: 'Vocal Confidence', score: attempt.confidenceScore || 68, color: 'bg-purple-500' },
    { label: 'Answer Logic & Structure', score: attempt.structureScore || 70, color: 'bg-cyan-500' },
  ];

  const toggleSpeechSynthesis = () => {
    if (!('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported in this browser.');
      return;
    }

    if (isPlayingSpeech) {
      window.speechSynthesis.cancel();
      setIsPlayingSpeech(false);
    } else {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(rawTranscript);
      utterance.rate = 0.95;
      utterance.onend = () => setIsPlayingSpeech(false);
      utterance.onerror = () => setIsPlayingSpeech(false);

      setIsPlayingSpeech(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  const audioSourceToPlay = recordedAudioUrl || (attempt.audioUrl && attempt.audioUrl.startsWith('blob:') ? attempt.audioUrl : null);

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in zoom-in-95 duration-300 pb-12">
      
      {/* WINNIFY HERO SCORE BANNER WITH SOLID DARK BACKDROP */}
      <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-slate-800">
        
        {/* Subtle Background Accent */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-extrabold border border-emerald-500/30">
            <Sparkles className="w-4 h-4 text-amber-400" /> Winnify™ Speaking AI Engine v2.4
          </div>
          
          <div className="px-3.5 py-1.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-black border border-amber-500/40 flex items-center gap-1.5">
            <Award className="w-4 h-4 text-amber-400" /> CEFR Level: {cefrLevel}
          </div>
        </div>

        {/* Prompt Title */}
        <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight relative z-10 mb-6">
          "{challenge?.title || 'Why Continuous Learning Is Essential for Software Developers'}"
        </h2>

        {/* Score & PTE Band Ring Grid */}
        <div className="my-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-center relative z-10">
          
          {/* Circular Score Badge */}
          <div className="md:col-span-4 flex flex-col items-center justify-center text-center">
            <div className="relative inline-flex flex-col items-center justify-center w-36 h-36 rounded-full bg-slate-950 border-4 border-emerald-400/80 shadow-[0_0_30px_rgba(16,185,129,0.3)] shrink-0">
              <span className="text-5xl font-black text-emerald-400 tracking-tight">{overall}</span>
              <span className="text-[11px] font-black text-slate-300 uppercase tracking-widest mt-1">Overall Band</span>
            </div>
          </div>

          {/* PTE Band Description Card */}
          <div className="md:col-span-8 bg-slate-800/90 border border-slate-700/80 rounded-2xl p-5 space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-amber-500 text-slate-950 font-black text-xs">
              PTE Band Score Equivalent: <span className="text-slate-950 text-sm">{pteEquivalent} / 90</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-medium">
              Your speech evaluation matches standard international English assessment scales (PTE Academic / CEFR Framework).
            </p>
          </div>

        </div>

        {/* ACOUSTIC METRICS SUMMARY CARDS */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 relative z-10">
          
          <div className="p-4 bg-slate-800/90 rounded-2xl border border-slate-700/80 text-center space-y-1">
            <p className="text-[11px] uppercase font-black text-amber-400 tracking-wider flex items-center justify-center gap-1">
              <Zap className="w-3.5 h-3.5 text-amber-400" /> PACE
            </p>
            <p className="text-xl font-black text-white">{wpm} <span className="text-xs font-normal text-slate-400">WPM</span></p>
          </div>

          <div className="p-4 bg-slate-800/90 rounded-2xl border border-slate-700/80 text-center space-y-1">
            <p className="text-[11px] uppercase font-black text-blue-400 tracking-wider flex items-center justify-center gap-1">
              <Type className="w-3.5 h-3.5 text-blue-400" /> WORD OUTPUT
            </p>
            <p className="text-xl font-black text-white">{wordCount} <span className="text-xs font-normal text-slate-400">words</span></p>
          </div>

          <div className="p-4 bg-slate-800/90 rounded-2xl border border-slate-700/80 text-center space-y-1">
            <p className="text-[11px] uppercase font-black text-rose-400 tracking-wider flex items-center justify-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 text-rose-400" /> FILLERS
            </p>
            <p className="text-xl font-black text-white">{fillerCount} <span className="text-xs font-normal text-slate-400">caught</span></p>
          </div>

          <div className="p-4 bg-slate-800/90 rounded-2xl border border-slate-700/80 text-center space-y-1">
            <p className="text-[11px] uppercase font-black text-emerald-400 tracking-wider flex items-center justify-center gap-1">
              <Target className="w-3.5 h-3.5 text-emerald-400" /> TOP SKILL
            </p>
            <p className="text-base font-extrabold text-emerald-300 truncate">{attempt.strongestArea || 'Vocabulary'}</p>
          </div>

        </div>

      </div>

      {/* RECORDED VOICE AUDIO PLAYBACK PLAYER CARD */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <h3 className="text-sm font-black text-emerald-400 flex items-center gap-2">
            <Volume2 className="w-5 h-5 text-emerald-400" /> Listen to Your Recorded Voice Speech
          </h3>
          <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 text-xs font-extrabold rounded-full border border-emerald-500/30">
            {audioSourceToPlay ? 'Actual Mic Audio Capture' : 'AI Audio Playback Stream'}
          </span>
        </div>

        {audioSourceToPlay ? (
          <div className="space-y-2">
            <audio controls src={audioSourceToPlay} className="w-full h-12 rounded-xl bg-slate-800 border border-slate-700 p-1" />
            <p className="text-xs text-slate-300 font-medium">
              🎧 Re-listening to your recorded voice allows you to hear your actual pronunciation, pause rhythm, and vocal pitch.
            </p>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-slate-800/90 rounded-2xl border border-slate-700/80">
            <div className="space-y-0.5 text-left">
              <p className="text-xs font-extrabold text-white">AI Voice Speech Readout</p>
              <p className="text-[11px] text-slate-300">Play standard C1 audio articulation for your transcript.</p>
            </div>
            <button
              onClick={toggleSpeechSynthesis}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition-all ${
                isPlayingSpeech
                  ? 'bg-rose-600 hover:bg-rose-700 text-white'
                  : 'bg-emerald-500 hover:bg-emerald-600 text-slate-950 shadow-md'
              }`}
            >
              {isPlayingSpeech ? <Square className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
              {isPlayingSpeech ? 'Stop Readout' : 'Play Audio Readout'}
            </button>
          </div>
        )}
      </div>

      {/* WINNIFY INTERACTIVE TRANSCRIPT ANALYZER */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Type className="w-5 h-5 text-emerald-600 dark:text-emerald-400" /> Winnify™ Speech Transcript Analysis
            </h3>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Tokenized speech analysis highlighting filler words, transition phrases, and C1/C2 vocabulary.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleSpeechSynthesis}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black border transition-all ${
                isPlayingSpeech
                  ? 'bg-rose-500 text-white border-rose-600'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-700 hover:bg-slate-200'
              }`}
            >
              <Volume2 className="w-3.5 h-3.5" />
              {isPlayingSpeech ? 'Stop Voice' : 'Listen Transcript'}
            </button>

            {/* Color Legend */}
            <div className="hidden sm:flex items-center gap-2 text-xs font-bold">
              <span className="flex items-center gap-1.5 text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 px-2.5 py-1 rounded-lg border border-rose-200 dark:border-rose-900">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" /> Filler
              </span>
              <span className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-200 dark:border-emerald-900">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" /> C1 Vocab
              </span>
              <span className="flex items-center gap-1.5 text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2.5 py-1 rounded-lg border border-blue-200 dark:border-blue-900">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block" /> Transition
              </span>
            </div>
          </div>
        </div>

        {/* Annotated Text Box */}
        <div className="p-5 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 leading-relaxed text-sm font-medium text-slate-800 dark:text-slate-200 flex flex-wrap gap-2">
          {annotatedWords.map((item, idx) => {
            if (item.type === 'filler') {
              return (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-lg bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-200 border border-rose-300 dark:border-rose-800 text-xs font-bold shadow-sm"
                  title="Filler word detected — replace with a silent pause"
                >
                  {item.text}
                </span>
              );
            }
            if (item.type === 'advanced') {
              return (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-950/80 text-emerald-900 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-800 text-xs font-bold shadow-sm"
                  title="Advanced C1/C2 vocabulary detected"
                >
                  {item.text}
                </span>
              );
            }
            if (item.type === 'transition') {
              return (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-lg bg-blue-100 dark:bg-blue-950/80 text-blue-900 dark:text-blue-200 border border-blue-300 dark:border-blue-800 text-xs font-bold shadow-sm"
                  title="Structural transition marker"
                >
                  {item.text}
                </span>
              );
            }
            return <span key={idx} className="py-1">{item.text}</span>;
          })}
        </div>
      </div>

      {/* DETAILED SCORE BREAKDOWN (7 DIMENSIONS) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm">
        <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-6 flex items-center gap-2">
          <Gauge className="w-4 h-4 text-emerald-500" /> Winnify 7-Dimension Skill Breakdown
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {metrics.map((m) => (
            <div key={m.label} className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 space-y-2">
              <div className="flex justify-between items-center text-xs font-extrabold">
                <span className="text-slate-800 dark:text-slate-200">{m.label}</span>
                <span className="text-slate-900 dark:text-white font-mono font-black text-sm">{m.score} / 100</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${m.color}`}
                  style={{ width: `${m.score}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* WINNIFY VOCABULARY UPGRADE SUGGESTIONS */}
      {vocabularyEnhancements.length > 0 && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
          <h3 className="text-xs font-extrabold uppercase tracking-widest text-emerald-700 dark:text-emerald-400 flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-amber-500" /> Winnify™ C1 Vocabulary Recommendations
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {vocabularyEnhancements.map((enh, idx) => (
              <div key={idx} className="p-4 bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 rounded-2xl space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-bold">
                  <span className="line-through text-slate-400">{enh.word}</span>
                  <span className="text-slate-400">→</span>
                  <span className="text-emerald-800 dark:text-emerald-300 font-extrabold text-sm">{enh.suggestion}</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">{enh.reason}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* STRUCTURED STRENGTHS & IMPROVEMENTS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* WHAT YOU DID WELL */}
        <div className="bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 rounded-3xl p-6 shadow-sm space-y-4">
          <h4 className="text-xs font-extrabold uppercase tracking-widest text-emerald-900 dark:text-emerald-400 flex items-center gap-2">
            <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600 dark:text-emerald-400" /> What You Did Well
          </h4>
          <ul className="space-y-3">
            {feedback.strengths.map((str: string, idx: number) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs font-extrabold text-emerald-950 dark:text-emerald-100">
                <span className="text-emerald-600 shrink-0 font-black">✓</span>
                <span>{str}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* AREAS TO IMPROVE */}
        <div className="bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 rounded-3xl p-6 shadow-sm space-y-4">
          <h4 className="text-xs font-extrabold uppercase tracking-widest text-amber-900 dark:text-amber-400 flex items-center gap-2">
            <AlertCircle className="w-4.5 h-4.5 text-amber-600 dark:text-amber-400" /> Areas to Improve
          </h4>
          <ul className="space-y-3">
            {feedback.improvements.map((imp: string, idx: number) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs font-extrabold text-amber-950 dark:text-amber-100">
                <span className="text-amber-600 shrink-0 font-black">•</span>
                <span>{imp}</span>
              </li>
            ))}
          </ul>
        </div>

      </div>

      {/* NEXT PRACTICE ACTION CARD */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 text-center shadow-sm">
        <p className="text-[11px] font-extrabold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 mb-1">
          Next Winnify Recommended Action
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
            className="flex items-center gap-2 px-8 py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-2xl font-bold text-xs shadow-md transition-colors"
          >
            Explore Next Challenges <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

    </div>
  );
};
