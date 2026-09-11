import React, { useState, useEffect, useRef } from 'react';
import { Mic, Square, RotateCcw, AlertTriangle, CheckCircle2, Lock, Edit3 } from 'lucide-react';

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
  const MIN_RECORDING_SECONDS = 30;

  const [isRecording, setIsRecording] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(targetDurationSeconds);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);
  const [micPermissionDenied, setMicPermissionDenied] = useState(false);
  const [transcriptText, setTranscriptText] = useState<string>('');
  const [isEditingTranscript, setIsEditingTranscript] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<any>(null);
  const speechRecognitionRef = useRef<any>(null);
  
  // Refs for race-condition safe checks across callbacks
  const isRecordingRef = useRef(false);
  const elapsedSecondsRef = useRef(0);
  const accumulatedTranscriptRef = useRef('');

  // Keep refs in sync with state
  useEffect(() => {
    isRecordingRef.current = isRecording;
  }, [isRecording]);

  useEffect(() => {
    elapsedSecondsRef.current = elapsedSeconds;
  }, [elapsedSeconds]);

  // Initialize Continuous Web Speech Recognition with auto-restart on pause/end
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        let interimTranscript = '';
        let finalChunk = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const trans = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalChunk += trans + ' ';
          } else {
            interimTranscript += trans;
          }
        }

        if (finalChunk) {
          accumulatedTranscriptRef.current += finalChunk;
        }

        const fullTranscript = (accumulatedTranscriptRef.current + interimTranscript).trim();
        setTranscriptText(fullTranscript);
      };

      // Handle browser Web Speech API auto-stop (silence timeout) by restarting while recording
      recognition.onend = () => {
        if (isRecordingRef.current) {
          try {
            recognition.start();
          } catch (e) {
            // Already started or restarting
          }
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition event:', event.error);
        if (event.error === 'not-allowed') {
          setMicPermissionDenied(true);
        }
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
      if (speechRecognitionRef.current) {
        try {
          speechRecognitionRef.current.stop();
        } catch (e) {}
      }
    };
  }, []);

  const startRecording = async () => {
    setMicPermissionDenied(false);
    setTranscriptText('');
    accumulatedTranscriptRef.current = '';
    setRecordedAudioUrl(null);
    setAudioBlob(null);
    setIsEditingTranscript(false);
    audioChunksRef.current = [];
    setTimerSeconds(targetDurationSeconds);
    setElapsedSeconds(0);
    elapsedSecondsRef.current = 0;

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

        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start(200);
      setIsRecording(true);
      isRecordingRef.current = true;

      if (speechRecognitionRef.current) {
        try {
          speechRecognitionRef.current.start();
        } catch (e) {
          console.warn('Speech recognition start note:', e);
        }
      }

      timerIntervalRef.current = setInterval(() => {
        setElapsedSeconds((prevElapsed) => {
          const newElapsed = prevElapsed + 1;
          elapsedSecondsRef.current = newElapsed;

          setTimerSeconds((prevTimer) => {
            if (prevTimer <= 1) {
              if (newElapsed >= MIN_RECORDING_SECONDS) {
                stopRecording(true);
              }
              return 0;
            }
            return prevTimer - 1;
          });

          return newElapsed;
        });
      }, 1000);
    } catch (err: any) {
      console.error('Microphone permission error:', err);
      setMicPermissionDenied(true);
    }
  };

  const stopRecording = (force = false) => {
    // Strictly prevent stopping before 30 seconds unless forced by timer expiry
    if (!force && elapsedSecondsRef.current < MIN_RECORDING_SECONDS) {
      return;
    }

    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }

    isRecordingRef.current = false;
    setIsRecording(false);

    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }

    if (speechRecognitionRef.current) {
      try {
        speechRecognitionRef.current.stop();
      } catch (e) {
        console.warn('Speech recognition stop note', e);
      }
    }
  };

  const resetRecording = () => {
    setRecordedAudioUrl(null);
    setAudioBlob(null);
    setTranscriptText('');
    accumulatedTranscriptRef.current = '';
    setIsEditingTranscript(false);
    setTimerSeconds(targetDurationSeconds);
    setElapsedSeconds(0);
    elapsedSecondsRef.current = 0;
  };

  const handleSubmit = () => {
    const finalTranscript = transcriptText.trim() || 'No audio transcript detected.';
    onRecordingComplete(finalTranscript, audioBlob);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const canStopRecording = elapsedSeconds >= MIN_RECORDING_SECONDS;
  const remainingMinimum = Math.max(0, MIN_RECORDING_SECONDS - elapsedSeconds);

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm text-center max-w-xl mx-auto">
      
      {/* Microphone Permission Denied Alert */}
      {micPermissionDenied && (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 text-left mb-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-rose-900">
                Microphone access is required for speaking practice
              </h4>
              <p className="text-xs text-rose-700 mt-1.5 leading-relaxed">
                SkillSprint needs permission to record your voice to perform real AI analysis.
                Please click the lock icon in your browser address bar and allow Microphone access.
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
      )}

      {/* Timer Display */}
      <div className="mb-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-100 text-slate-700 font-mono text-xs font-bold mb-3">
          <span>Target Duration: {targetDurationSeconds}s</span>
        </div>
        <div
          className={`text-5xl sm:text-6xl font-extrabold font-mono tracking-tight transition-colors ${
            isRecording
              ? 'text-amber-500 animate-pulse'
              : timerSeconds === 0
              ? 'text-emerald-600'
              : 'text-slate-900'
          }`}
        >
          {formatTime(timerSeconds)}
        </div>

        {/* 30-Second Minimum Recording Status Indicator */}
        {isRecording && (
          <div className="mt-3 text-xs font-bold transition-colors">
            {!canStopRecording ? (
              <span className="inline-flex items-center gap-1.5 text-amber-700 bg-amber-50 px-3.5 py-1.5 rounded-full border border-amber-200">
                <Lock className="w-3.5 h-3.5 text-amber-600" />
                Must record for at least 30s ({remainingMinimum}s remaining)
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-emerald-700 bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Minimum 30s reached! You can now stop recording.
              </span>
            )}
          </div>
        )}
      </div>

      {/* Live Audio Waveform Simulation */}
      {isRecording && (
        <div className="flex items-center justify-center gap-1.5 h-12 mb-6">
          {[40, 70, 30, 90, 50, 80, 45, 95, 60, 35, 75, 50].map((h, i) => (
            <div
              key={i}
              className="w-1.5 bg-[#064e3b] rounded-full animate-pulse"
              style={{
                height: `${Math.max(15, Math.round(h * Math.random()))}px`,
                animationDelay: `${i * 0.1}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* Audio Playback preview */}
      {recordedAudioUrl && !isRecording && (
        <div className="mb-6 p-4 rounded-2xl bg-slate-50 border border-slate-200">
          <div className="flex items-center justify-center gap-2 text-xs font-bold text-emerald-700 mb-3">
            <CheckCircle2 className="w-4 h-4" /> Voice Recording Captured ({elapsedSeconds} seconds)
          </div>
          <audio src={recordedAudioUrl} controls className="w-full h-10 rounded-lg" />
        </div>
      )}

      {/* Real Live Spoken Transcript Display / Editor */}
      {(transcriptText || isRecording) && (
        <div className="mb-6 text-left bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[11px] font-extrabold uppercase tracking-wider text-[#064e3b] flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" />
              Real Spoken Audio Transcript:
            </p>
            {!isRecording && transcriptText && (
              <button
                onClick={() => setIsEditingTranscript(!isEditingTranscript)}
                className="text-[11px] font-bold text-emerald-700 hover:text-emerald-900 inline-flex items-center gap-1"
              >
                <Edit3 className="w-3 h-3" />
                {isEditingTranscript ? 'Done Editing' : 'Edit Transcript'}
              </button>
            )}
          </div>

          {isEditingTranscript ? (
            <textarea
              rows={3}
              value={transcriptText}
              onChange={(e) => setTranscriptText(e.target.value)}
              className="w-full p-3 rounded-xl border border-emerald-300 bg-white text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
              placeholder="Spoken words will appear here..."
            />
          ) : (
            <p className="text-xs text-slate-800 italic leading-relaxed font-medium">
              "{transcriptText.trim() || (isRecording ? 'Listening to your voice...' : 'No transcript recorded.')}"
            </p>
          )}
        </div>
      )}

      {/* Action Control Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        {!isRecording && !recordedAudioUrl && (
          <button
            onClick={startRecording}
            className="flex items-center justify-center gap-2.5 px-8 py-3.5 bg-[#064e3b] hover:bg-[#047857] text-white rounded-2xl font-extrabold text-xs shadow-sm transition-all w-full sm:w-auto"
          >
            <Mic className="w-5 h-5" /> Start Recording
          </button>
        )}

        {isRecording && (
          <button
            onClick={() => stopRecording(false)}
            disabled={!canStopRecording}
            className={`flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-2xl font-extrabold text-xs transition-all w-full sm:w-auto ${
              canStopRecording
                ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-md cursor-pointer animate-bounce'
                : 'bg-slate-300 text-slate-500 cursor-not-allowed border border-slate-300'
            }`}
          >
            <Square className="w-4 h-4 fill-current" />
            {canStopRecording ? 'Stop Recording' : `Must record for 30s (${remainingMinimum}s left)`}
          </button>
        )}

        {recordedAudioUrl && !isRecording && (
          <>
            <button
              onClick={resetRecording}
              className="flex items-center justify-center gap-2 px-5 py-3 bg-slate-100 text-slate-700 rounded-2xl font-extrabold text-xs hover:bg-slate-200 transition-colors w-full sm:w-auto"
            >
              <RotateCcw className="w-4 h-4" /> Record Again
            </button>

            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex items-center justify-center gap-2 px-8 py-3.5 bg-[#064e3b] hover:bg-[#047857] text-white rounded-2xl font-extrabold text-xs shadow-sm transition-all disabled:opacity-50 w-full sm:w-auto"
            >
              {isSubmitting ? 'Performing Real AI Analysis...' : 'Submit for AI Analysis'}
            </button>
          </>
        )}
      </div>

    </div>
  );
};
