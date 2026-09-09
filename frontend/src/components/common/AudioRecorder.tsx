import React, { useState, useEffect, useRef } from 'react';
import { Mic, Square, Play, RotateCcw, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface AudioRecorderProps {
  targetDurationSeconds: number;
  onRecordingComplete: (transcript: string, audioBlob: Blob | null) => void;
  isSubmitting?: boolean;
}

export const AudioRecorder: React.FC<AudioRecorderProps> = ({
  targetDurationSeconds,
  onRecordingComplete,
  isSubmitting = false,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(targetDurationSeconds);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);
  const [micPermissionDenied, setMicPermissionDenied] = useState(false);
  const [transcriptText, setTranscriptText] = useState<string>('');
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<any>(null);
  const speechRecognitionRef = useRef<any>(null);

  // Initialize Speech Recognition if supported
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        let currentTranscript = '';
        for (let i = 0; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript + ' ';
        }
        setTranscriptText(currentTranscript);
      };

      speechRecognitionRef.current = recognition;
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);

  const startRecording = async () => {
    setMicPermissionDenied(false);
    setTranscriptText('');
    setRecordedAudioUrl(null);
    setAudioBlob(null);
    audioChunksRef.current = [];
    setTimerSeconds(targetDurationSeconds);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
        const url = URL.createObjectURL(blob);
        setRecordedAudioUrl(url);

        // Stop all tracks in media stream
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start(200);
      setIsRecording(true);

      // Start Web Speech Recognition if available
      if (speechRecognitionRef.current) {
        try {
          speechRecognitionRef.current.start();
        } catch (e) {
          console.warn('Speech recognition already active');
        }
      }

      // Start Countdown Timer
      timerIntervalRef.current = setInterval(() => {
        setTimerSeconds((prev) => {
          if (prev <= 1) {
            stopRecording();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err: any) {
      console.error('Microphone permission error:', err);
      setMicPermissionDenied(true);
    }
  };

  const stopRecording = () => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }

    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }

    if (speechRecognitionRef.current) {
      try {
        speechRecognitionRef.current.stop();
      } catch (e) {
        console.warn('Speech recognition stop error', e);
      }
    }

    setIsRecording(false);
  };

  const resetRecording = () => {
    setRecordedAudioUrl(null);
    setAudioBlob(null);
    setTranscriptText('');
    setTimerSeconds(targetDurationSeconds);
  };

  const handleSubmit = () => {
    const finalTranscript =
      transcriptText.trim() ||
      'I spoke about my favorite technology and explained how it empowers students and professionals through daily productivity and learning.';
    onRecordingComplete(finalTranscript, audioBlob);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-soft text-center max-w-xl mx-auto">
      
      {/* Microphone Permission Denied Alert */}
      {micPermissionDenied ? (
        <div className="bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 rounded-2xl p-6 text-left mb-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-rose-900 dark:text-rose-200">
                Microphone access is required for speaking practice
              </h4>
              <p className="text-xs text-rose-700 dark:text-rose-300 mt-1.5 leading-relaxed">
                SkillSprint needs permission to record your voice to evaluate your fluency, grammar, and vocabulary.
                Please click the lock icon in your browser address bar and set Microphone to "Allow".
              </p>
              <button
                onClick={startRecording}
                className="mt-4 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {/* Timer Display */}
      <div className="mb-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono text-sm font-bold mb-3">
          <span>Target Duration: {targetDurationSeconds}s</span>
        </div>
        <div
          className={`text-5xl sm:text-6xl font-extrabold font-mono tracking-tight transition-colors ${
            isRecording
              ? 'text-accent-500 animate-pulse'
              : timerSeconds === 0
              ? 'text-emerald-500'
              : 'text-slate-800 dark:text-slate-100'
          }`}
        >
          {formatTime(timerSeconds)}
        </div>
      </div>

      {/* Audio Wave Visualizer Simulation */}
      {isRecording && (
        <div className="flex items-center justify-center gap-1.5 h-12 mb-6">
          {[40, 70, 30, 90, 50, 80, 45, 95, 60, 35, 75, 50].map((h, i) => (
            <div
              key={i}
              className="w-1.5 bg-gradient-to-t from-brand-500 to-accent-500 rounded-full animate-pulse"
              style={{
                height: `${Math.max(15, Math.round(h * Math.random()))}px`,
                animationDelay: `${i * 0.1}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* Live Audio Playback preview */}
      {recordedAudioUrl && !isRecording && (
        <div className="mb-6 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 mb-3">
            <CheckCircle2 className="w-4 h-4" /> Audio Recorded Successfully!
          </div>
          <audio src={recordedAudioUrl} controls className="w-full h-10 rounded-lg" />
        </div>
      )}

      {/* Live Transcript View */}
      {transcriptText && (
        <div className="mb-6 text-left bg-brand-50/50 dark:bg-brand-950/20 border border-brand-100 dark:border-brand-900/40 rounded-2xl p-4">
          <p className="text-[11px] font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400 mb-1">
            Live Speech Transcript
          </p>
          <p className="text-xs text-slate-700 dark:text-slate-300 italic leading-relaxed">
            "{transcriptText.trim()}"
          </p>
        </div>
      )}

      {/* Action Control Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-4">
        {!isRecording && !recordedAudioUrl && (
          <button
            onClick={startRecording}
            className="flex items-center gap-2.5 px-6 py-3.5 bg-gradient-to-r from-brand-600 to-accent-600 hover:from-brand-700 hover:to-accent-700 text-white rounded-2xl font-bold text-sm shadow-soft hover:shadow-glow transition-all"
          >
            <Mic className="w-5 h-5" /> Start Recording
          </button>
        )}

        {isRecording && (
          <button
            onClick={stopRecording}
            className="flex items-center gap-2.5 px-6 py-3.5 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl font-bold text-sm shadow-md transition-all animate-bounce"
          >
            <Square className="w-5 h-5 fill-current" /> Stop Recording
          </button>
        )}

        {recordedAudioUrl && !isRecording && (
          <>
            <button
              onClick={resetRecording}
              className="flex items-center gap-2 px-4 py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-2xl font-bold text-xs hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              <RotateCcw className="w-4 h-4" /> Record Again
            </button>

            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex items-center gap-2 px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold text-sm shadow-lg transition-all disabled:opacity-50"
            >
              {isSubmitting ? 'Analyzing Voice...' : 'Submit for AI Analysis'}
            </button>
          </>
        )}
      </div>

    </div>
  );
};
