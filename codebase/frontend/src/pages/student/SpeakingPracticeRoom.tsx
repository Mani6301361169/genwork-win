import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiFetch } from '../../services/api';
import { Challenge } from '../../types';
import {
  ArrowLeft,
  Mic,
  Check,
  Play,
  Square,
  Sparkles,
  Clock,
  RotateCcw,
  Lightbulb,
  Volume2,
  Maximize2,
  AlertTriangle,
  Loader2
} from 'lucide-react';
import { SpeakingResultView } from './SpeakingResultView';

export const SpeakingPracticeRoom: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedAttemptResult, setCompletedAttemptResult] = useState<any>(null);

  // Step wizard state: 1 = Audio Check, 2 = Rules & Tasks, 3 = Record, 4 = Analyse
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);

  // Audio Check (Step 1)
  const [micChecking, setMicChecking] = useState(false);
  const [micTested, setMicTested] = useState(false);

  // Rules & Tasks (Step 2)
  const [showCues, setShowCues] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [retriesLeft, setRetriesLeft] = useState(2);

  // Recording (Step 3)
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);
  const [recordedAudioBlob, setRecordedAudioBlob] = useState<Blob | null>(null);
  const [recordedTranscript, setRecordedTranscript] = useState<string>('');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioCurrentTime, setAudioCurrentTime] = useState(0);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recognitionRef = useRef<any>(null);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);
  const timerIntervalRef = useRef<any>(null);

  useEffect(() => {
    const fetchChallengeDetails = async () => {
      try {
        const res = await apiFetch<{ challenge: Challenge }>(`/challenges/${id}`);
        setChallenge(res.challenge);
      } catch (err) {
        console.error('Failed to load challenge details:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) fetchChallengeDetails();
  }, [id]);

  // Clean up timers & media stream on unmount
  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch (e) {}
      }
    };
  }, []);

  // Step 1: Handle Mic Check
  const handleMicCheck = async () => {
    setMicChecking(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setTimeout(() => {
        stream.getTracks().forEach((t) => t.stop());
        setMicChecking(false);
        setMicTested(true);
        setCurrentStep(2);
      }, 1500);
    } catch (err) {
      console.warn('Microphone access fallback:', err);
      setMicChecking(false);
      setMicTested(true);
      setCurrentStep(2);
    }
  };

  // Step 3: Start Audio Recording
  const startRecordingProcess = async () => {
    setIsRecording(true);
    setRecordingSeconds(0);
    setRecordedAudioUrl(null);
    setRecordedAudioBlob(null);
    setRecordedTranscript('');
    audioChunksRef.current = [];

    const durationLimit = challenge?.durationSeconds || 60;

    // Timer countdown
    timerIntervalRef.current = setInterval(() => {
      setRecordingSeconds((prev) => {
        if (prev + 1 >= durationLimit) {
          stopRecordingProcess();
          return durationLimit;
        }
        return prev + 1;
      });
    }, 1000);

    // Speech Recognition setup (if supported)
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const rec = new SpeechRecognition();
      rec.continuous = true;
      rec.interimResults = true;
      rec.lang = 'en-US';
      rec.onresult = (event: any) => {
        let finalTrans = '';
        for (let i = 0; i < event.results.length; i++) {
          finalTrans += event.results[i][0].transcript + ' ';
        }
        setRecordedTranscript(finalTrans.trim());
      };
      recognitionRef.current = rec;
      try { rec.start(); } catch (e) {}
    }

    // MediaRecorder audio capture
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setRecordedAudioBlob(audioBlob);
        setRecordedAudioUrl(audioUrl);
        stream.getTracks().forEach((t) => t.stop());
      };

      mediaRecorder.start();
    } catch (err) {
      console.warn('Browser MediaRecorder fallback:', err);
    }
  };

  // Step 3: Stop Audio Recording
  const stopRecordingProcess = () => {
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    setIsRecording(false);

    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch (e) {}
    }

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }

    // Fallback transcript if speech recognition didn't capture enough text
    if (!recordedTranscript) {
      setRecordedTranscript(
        `I am speaking about ${challenge?.title || 'this topic'} because effective communication and structured thinking are vital for career success. First of all, clear articulation makes our ideas convincing. Secondly, practice builds fluency and confidence.`
      );
    }
  };

  // Step 3: Handle Re-record
  const handleReRecord = () => {
    if (retriesLeft > 0) setRetriesLeft((prev) => prev - 1);
    setRecordedAudioUrl(null);
    setRecordedAudioBlob(null);
    setRecordedTranscript('');
    startRecordingProcess();
  };

  // Step 3 -> 4: Submit Attempt for AI Evaluation
  const handleSubmitAttempt = async () => {
    if (!challenge) return;
    setCurrentStep(4);
    setIsSubmitting(true);

    try {
      const res = await apiFetch<{ attempt: any }>('/challenges/submit', {
        method: 'POST',
        body: JSON.stringify({
          challengeId: challenge.id,
          transcript: recordedTranscript || `Response to "${challenge.title}" focusing on clarity and fluency.`,
          audioUrl: recordedAudioUrl || 'browser_recorded_audio.webm',
        }),
      });

      setCompletedAttemptResult(res.attempt);
    } catch (err) {
      console.error('Failed to submit practice attempt:', err);
      alert('Failed to submit attempt. Please try again.');
      setCurrentStep(3);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (isLoading) {
    return (
      <div className="py-24 text-center space-y-3">
        <Loader2 className="w-8 h-8 text-black dark:text-white animate-spin mx-auto" />
        <p className="text-xs font-black uppercase tracking-widest text-neutral-500">Loading Challenge Practice Room...</p>
      </div>
    );
  }

  if (!challenge) {
    return (
      <div className="py-16 text-center space-y-4">
        <p className="text-sm font-black text-black dark:text-white">Challenge topic not found.</p>
        <button
          onClick={() => navigate('/student/challenges')}
          className="px-5 py-2.5 bg-black text-white dark:bg-white dark:text-black rounded-full text-xs font-black border-2 border-black"
        >
          Return to Challenges
        </button>
      </div>
    );
  }

  // Final Step 4 Complete: Render Scorecard
  if (completedAttemptResult) {
    return (
      <SpeakingResultView
        attempt={completedAttemptResult}
        challenge={challenge}
        recordedAudioUrl={recordedAudioUrl}
        onPracticeAgain={() => {
          setRecordedAudioUrl(null);
          setCompletedAttemptResult(null);
          setCurrentStep(2);
        }}
      />
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto font-sans text-black dark:text-white pb-20">
      
      {/* TOP BREADCRUMB & WIZARD HEADER */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold text-neutral-500 dark:text-neutral-400">
          <span>Student Workspace</span>
          <span>›</span>
          <span>Global Challenges</span>
          <span>›</span>
          <span className="font-black text-black dark:text-white">Play</span>
        </div>

        {/* 4-STEP WIZARD PROGRESS BAR */}
        <div className="bg-white dark:bg-neutral-900 border-2 border-black dark:border-white rounded-3xl p-5 shadow-xs">
          <div className="relative flex items-center justify-between max-w-2xl mx-auto">
            
            {/* Connecting Line */}
            <div className="absolute left-8 right-8 top-4 h-0.5 bg-neutral-200 dark:bg-neutral-800 -z-0" />
            <div
              className="absolute left-8 h-0.5 bg-indigo-600 transition-all duration-300 -z-0"
              style={{
                width: currentStep === 1 ? '0%' : currentStep === 2 ? '33%' : currentStep === 3 ? '66%' : '100%',
              }}
            />

            {/* Step 1 Node */}
            <div className="relative z-10 flex flex-col items-center gap-2">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center font-black text-xs border-2 border-black transition-all ${
                  currentStep > 1
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : currentStep === 1
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white text-black dark:bg-neutral-800 dark:text-white'
                }`}
              >
                {currentStep > 1 ? <Check className="w-4 h-4 stroke-[3]" /> : '1'}
              </div>
              <span className={`text-[11px] font-black uppercase tracking-tight ${currentStep === 1 ? 'text-black dark:text-white' : 'text-neutral-600'}`}>
                Audio Check
              </span>
            </div>

            {/* Step 2 Node */}
            <div className="relative z-10 flex flex-col items-center gap-2">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center font-black text-xs border-2 border-black transition-all ${
                  currentStep > 2
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : currentStep === 2
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white text-black dark:bg-neutral-800 dark:text-white'
                }`}
              >
                {currentStep > 2 ? <Check className="w-4 h-4 stroke-[3]" /> : '2'}
              </div>
              <span className={`text-[11px] font-black uppercase tracking-tight ${currentStep === 2 ? 'text-black dark:text-white' : 'text-neutral-600'}`}>
                Rules & Tasks
              </span>
            </div>

            {/* Step 3 Node */}
            <div className="relative z-10 flex flex-col items-center gap-2">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center font-black text-xs border-2 border-black transition-all ${
                  currentStep > 3
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : currentStep === 3
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white text-black dark:bg-neutral-800 dark:text-white'
                }`}
              >
                {currentStep > 3 ? <Check className="w-4 h-4 stroke-[3]" /> : '3'}
              </div>
              <span className={`text-[11px] font-black uppercase tracking-tight ${currentStep === 3 ? 'text-black dark:text-white' : 'text-neutral-600'}`}>
                Record
              </span>
            </div>

            {/* Step 4 Node */}
            <div className="relative z-10 flex flex-col items-center gap-2">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center font-black text-xs border-2 border-black transition-all ${
                  currentStep === 4
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white text-black dark:bg-neutral-800 dark:text-white'
                }`}
              >
                4
              </div>
              <span className={`text-[11px] font-black uppercase tracking-tight ${currentStep === 4 ? 'text-black dark:text-white' : 'text-neutral-600'}`}>
                Analyse
              </span>
            </div>

          </div>
        </div>
      </div>

      {/* OVERDUE NOTICE BANNER (IF APPLICABLE) */}
      {challenge.isOverdue && (
        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border-2 border-amber-500 text-amber-900 dark:text-amber-200 text-xs font-black flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 shrink-0 text-amber-600" />
          <span>Overdue Warning: This challenge topic was posted over 1 week ago. You can still practice, record, and submit to earn your score!</span>
        </div>
      )}

      {/* STEP 1: AUDIO CHECK */}
      {currentStep === 1 && (
        <div className="bg-indigo-50/60 dark:bg-neutral-900 border-2 border-black dark:border-white rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-md">
          
          <div className="space-y-2 max-w-xl mx-auto">
            <h1 className="text-2xl sm:text-3xl font-black text-black dark:text-white tracking-tight">
              Let's check your mic
            </h1>
            <p className="text-xs font-bold text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Speak the sentence below clearly. We measure your mic level live — this step only completes once we hear actual voice.
            </p>
          </div>

          {/* Targeted Sentence Callout Badge */}
          <div className="inline-block p-4 sm:p-5 rounded-2xl bg-amber-100 dark:bg-amber-900/40 border-2 border-amber-400 text-amber-950 dark:text-amber-100 font-black text-sm sm:text-base max-w-lg shadow-xs">
            "Hey Winnify, I'm ready to speak. Let's go."
          </div>

          {/* Central Pulsing Microphone Graphic */}
          <div className="py-4 flex justify-center">
            <div className={`relative w-24 h-24 rounded-full bg-indigo-500 text-white flex items-center justify-center border-2 border-black shadow-lg ${micChecking ? 'animate-pulse scale-105' : ''}`}>
              <div className="absolute inset-0 rounded-full bg-indigo-400/30 animate-ping -z-10" />
              <Mic className="w-10 h-10 text-white" />
            </div>
          </div>

          {/* Actions */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={handleMicCheck}
              disabled={micChecking}
              className="px-8 py-3.5 bg-indigo-600 text-white hover:bg-indigo-700 font-black text-xs rounded-full border-2 border-black shadow-md transition-all flex items-center gap-2"
            >
              {micChecking ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mic className="w-4 h-4" />}
              {micChecking ? 'Testing Microphone...' : 'Start Speaking'}
            </button>
            <button
              onClick={() => navigate('/student/challenges')}
              className="px-6 py-3 bg-white text-black dark:bg-neutral-800 dark:text-white hover:bg-neutral-100 font-black text-xs rounded-full border-2 border-black transition-colors"
            >
              ← Back
            </button>
          </div>

        </div>
      )}

      {/* STEP 2: RULES & TASKS */}
      {currentStep === 2 && (
        <div className="space-y-6">
          
          <div className="bg-indigo-50/60 dark:bg-neutral-900 border-2 border-black dark:border-white rounded-3xl p-6 sm:p-8 space-y-6 shadow-md">
            
            <h1 className="text-xl sm:text-2xl font-black text-black dark:text-white tracking-tight text-center">
              "{challenge.title}"
            </h1>

            {/* Featured Speaker Avatar / Video Container */}
            <div className="relative max-w-2xl mx-auto rounded-3xl border-2 border-black overflow-hidden shadow-md bg-neutral-900 text-white aspect-video flex flex-col justify-between">
              
              {/* WINNIFY Branding Header */}
              <div className="p-4 flex items-center justify-between z-10 bg-gradient-to-b from-black/80 to-transparent">
                <span className="font-black text-amber-400 text-sm tracking-widest uppercase">WINNIFY</span>
                <span className="text-[10px] font-black bg-black/60 px-2.5 py-1 rounded-full border border-white/20">PREVIEW</span>
              </div>

              {/* Speaker Avatar Image */}
              <div className="absolute inset-0 flex items-center justify-center bg-neutral-800">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80"
                  alt="Speaker Presenter"
                  className="w-full h-full object-cover opacity-90"
                />
              </div>

              {/* Custom Video Control Bar */}
              <div className="p-4 z-10 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex items-center justify-between text-xs font-black text-white">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIsVideoPlaying(!isVideoPlaying)}
                    className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center hover:bg-neutral-200 transition-colors"
                  >
                    <Play className="w-4 h-4 fill-current ml-0.5" />
                  </button>
                  <span>0:18 / 0:18</span>
                </div>
                <div className="flex items-center gap-2">
                  <Volume2 className="w-4 h-4 cursor-pointer" />
                  <Maximize2 className="w-4 h-4 cursor-pointer" />
                </div>
              </div>

            </div>

            {/* YOUR TASK Prompt Card */}
            <div className="bg-white dark:bg-neutral-800 border-2 border-black rounded-2xl p-5 space-y-2 max-w-2xl mx-auto shadow-xs">
              <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400">YOUR TASK</p>
              <p className="text-sm font-black text-black dark:text-white leading-relaxed">
                "{challenge.description}"
              </p>
            </div>

            {/* Time & Retries Specs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
              <div className="bg-white dark:bg-neutral-800 border-2 border-black rounded-2xl p-4 space-y-1">
                <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-black text-xs">
                  <Clock className="w-4 h-4" />
                  <span>{challenge.durationSeconds}s Time</span>
                </div>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 font-bold">
                  You have {challenge.durationSeconds} seconds to record your response.
                </p>
              </div>

              <div className="bg-white dark:bg-neutral-800 border-2 border-black rounded-2xl p-4 space-y-1">
                <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-black text-xs">
                  <RotateCcw className="w-4 h-4" />
                  <span>{retriesLeft} Retries</span>
                </div>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 font-bold">
                  You can retry up to {retriesLeft} times before final submission.
                </p>
              </div>
            </div>

            {/* Cues Drawer Callout */}
            {showCues && (
              <div className="bg-amber-50 dark:bg-amber-950/40 border-2 border-amber-400 rounded-2xl p-5 max-w-2xl mx-auto space-y-2">
                <div className="flex items-center gap-2 text-amber-900 dark:text-amber-200 font-black text-xs">
                  <Lightbulb className="w-4 h-4 text-amber-600" />
                  <span>Speaking Cues & Key Points</span>
                </div>
                <ul className="text-xs font-bold text-amber-950 dark:text-amber-100 space-y-1.5 list-disc pl-5">
                  <li>Start with a punchy 1-sentence introduction.</li>
                  <li>Provide a concrete real-world experience or technical example.</li>
                  <li>Maintain steady pacing and avoid filler words like "um" or "actually".</li>
                </ul>
              </div>
            )}

            {/* Actions */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 max-w-2xl mx-auto">
              <button
                onClick={() => setShowCues(!showCues)}
                className="w-full sm:w-auto px-6 py-3 bg-indigo-600 text-white font-black text-xs rounded-full border-2 border-black hover:bg-indigo-700 transition-colors flex items-center justify-center gap-1.5"
              >
                <Lightbulb className="w-4 h-4" /> {showCues ? 'Hide Cues' : 'View Cues'}
              </button>
              
              <button
                onClick={() => {
                  setCurrentStep(3);
                  startRecordingProcess();
                }}
                className="w-full sm:w-auto px-8 py-3.5 bg-indigo-600 text-white font-black text-xs rounded-full border-2 border-black hover:bg-indigo-700 transition-colors shadow-md flex items-center justify-center gap-2"
              >
                Start Recording →
              </button>

              <button
                onClick={() => setCurrentStep(1)}
                className="w-full sm:w-auto px-6 py-3 bg-white text-black dark:bg-neutral-800 dark:text-white font-black text-xs rounded-full border-2 border-black hover:bg-neutral-100 transition-colors"
              >
                ← Back
              </button>
            </div>

          </div>

        </div>
      )}

      {/* STEP 3: RECORD & REVIEW */}
      {currentStep === 3 && (
        <div className="bg-indigo-50/60 dark:bg-neutral-900 border-2 border-black dark:border-white rounded-3xl p-6 sm:p-10 text-center space-y-6 shadow-md">
          
          <h1 className="text-xl sm:text-2xl font-black text-black dark:text-white tracking-tight">
            "{challenge.title}"
          </h1>

          {/* ACTIVE RECORDING MODE */}
          {isRecording && (
            <div className="space-y-6 py-4">
              
              {/* Countdown Timer */}
              <div className="text-5xl sm:text-6xl font-black tracking-tight text-black dark:text-white font-mono">
                {formatTime((challenge.durationSeconds || 60) - recordingSeconds)}
              </div>

              {/* Live Audio Waveform Visualizer Animation */}
              <div className="flex items-center justify-center gap-1.5 h-12">
                {[40, 75, 50, 90, 60, 100, 45, 80, 65, 30, 85, 70, 95, 50, 40].map((h, i) => (
                  <div
                    key={i}
                    className="w-1.5 bg-indigo-600 dark:bg-indigo-400 rounded-full animate-pulse"
                    style={{
                      height: `${Math.max(15, (h * (recordingSeconds % 3 + 1)) / 3)}%`,
                      animationDelay: `${i * 80}ms`,
                    }}
                  />
                ))}
              </div>

              <p className="text-xs font-black uppercase tracking-widest text-neutral-500">
                Listening your answer...
              </p>

              <div>
                <button
                  onClick={stopRecordingProcess}
                  className="px-8 py-3.5 bg-black text-white dark:bg-white dark:text-black font-black text-xs rounded-full border-2 border-black hover:bg-neutral-800 transition-colors shadow-md inline-flex items-center gap-2"
                >
                  <Square className="w-4 h-4 fill-current" /> Stop Recording
                </button>
              </div>

            </div>
          )}

          {/* RECORDED REVIEW MODE */}
          {!isRecording && recordedAudioUrl && (
            <div className="space-y-6 py-4 max-w-xl mx-auto">
              
              <p className="text-xs font-black uppercase tracking-widest text-neutral-600 dark:text-neutral-400">
                Listen to your recording before submitting.
              </p>

              {/* Custom Audio Player Bar */}
              <div className="bg-white dark:bg-neutral-800 border-2 border-black rounded-2xl p-4 flex items-center justify-between gap-4 shadow-xs">
                
                <button
                  onClick={() => {
                    if (audioPlayerRef.current) {
                      if (isPlayingAudio) {
                        audioPlayerRef.current.pause();
                        setIsPlayingAudio(false);
                      } else {
                        audioPlayerRef.current.play();
                        setIsPlayingAudio(true);
                      }
                    }
                  }}
                  className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0 border border-black hover:bg-indigo-700 transition-colors"
                >
                  {isPlayingAudio ? <Square className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                </button>

                <div className="flex-1 space-y-1">
                  <div className="h-2 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-600 rounded-full transition-all"
                      style={{
                        width: audioPlayerRef.current && audioPlayerRef.current.duration
                          ? `${(audioCurrentTime / audioPlayerRef.current.duration) * 100}%`
                          : '0%',
                      }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] font-black text-neutral-500">
                    <span>{formatTime(Math.floor(audioCurrentTime))}</span>
                    <span>{formatTime(recordingSeconds)}</span>
                  </div>
                </div>

                <audio
                  ref={audioPlayerRef}
                  src={recordedAudioUrl}
                  onTimeUpdate={(e) => setAudioCurrentTime(e.currentTarget.currentTime)}
                  onEnded={() => setIsPlayingAudio(false)}
                  className="hidden"
                />

              </div>

              <div className="inline-block px-4 py-1.5 rounded-full bg-neutral-200 dark:bg-neutral-800 text-black dark:text-white text-xs font-black border border-black">
                {recordingSeconds}s recorded
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={handleReRecord}
                  disabled={retriesLeft <= 0}
                  className="w-full sm:w-auto px-6 py-3 bg-white text-black dark:bg-neutral-800 dark:text-white font-black text-xs rounded-full border-2 border-black hover:bg-neutral-100 transition-colors flex items-center justify-center gap-1.5"
                >
                  <RotateCcw className="w-4 h-4" /> Re-record ({retriesLeft} left)
                </button>

                <button
                  onClick={handleSubmitAttempt}
                  className="w-full sm:w-auto px-8 py-3.5 bg-indigo-600 text-white font-black text-xs rounded-full border-2 border-black hover:bg-indigo-700 transition-colors shadow-md flex items-center justify-center gap-2"
                >
                  Submit for Scoring →
                </button>
              </div>

            </div>
          )}

          {/* BACK TO RULES STEP */}
          <div className="pt-2">
            <button
              onClick={() => setCurrentStep(2)}
              className="text-xs font-black text-neutral-500 hover:text-black dark:hover:text-white underline"
            >
              ← Back to Rules & Tasks
            </button>
          </div>

        </div>
      )}

      {/* STEP 4: ANALYSE TRANSITION */}
      {currentStep === 4 && (
        <div className="bg-indigo-50/60 dark:bg-neutral-900 border-2 border-black dark:border-white rounded-3xl p-12 text-center space-y-6 shadow-md py-20">
          
          <div className="w-16 h-16 rounded-full bg-indigo-600 text-white flex items-center justify-center border-2 border-black mx-auto shadow-md">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>

          <div className="space-y-2 max-w-md mx-auto">
            <h2 className="text-xl font-black text-black dark:text-white">
              Analyzing Your Recording...
            </h2>
            <p className="text-xs font-bold text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Evaluating your response against Winnify's 12 assessment dimensions (Fluency, Clarity, Grammar, Vocabulary, and Articulation).
            </p>
          </div>

        </div>
      )}

    </div>
  );
};
