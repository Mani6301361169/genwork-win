import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiFetch } from '../../services/api';
import { Challenge } from '../../types';
import { AudioRecorder } from '../../components/common/AudioRecorder';
import { ArrowLeft, Mic, Sparkles, AlertCircle } from 'lucide-react';
import { SpeakingResultView } from './SpeakingResultView';

export const SpeakingPracticeRoom: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedAttemptResult, setCompletedAttemptResult] = useState<any>(null);

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

  const handleRecordingComplete = async (transcript: string, audioBlob: Blob | null) => {
    if (!challenge) return;

    setIsSubmitting(true);
    try {
      const res = await apiFetch<{ attempt: any }>('/challenges/submit', {
        method: 'POST',
        body: JSON.stringify({
          challengeId: challenge.id,
          transcript,
          audioUrl: 'browser_recorded_audio.webm',
        }),
      });

      setCompletedAttemptResult(res.attempt);
    } catch (err) {
      console.error('Failed to submit practice attempt:', err);
      alert('Failed to submit attempt. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="py-20 text-center">
        <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs font-bold text-slate-500">Preparing speaking room...</p>
      </div>
    );
  }

  if (!challenge) {
    return (
      <div className="py-12 text-center">
        <p className="text-sm font-bold text-slate-600 dark:text-slate-400">Challenge topic not found.</p>
        <button
          onClick={() => navigate('/student/challenges')}
          className="mt-4 px-4 py-2 bg-brand-600 text-white rounded-xl text-xs font-bold"
        >
          Return to Challenges
        </button>
      </div>
    );
  }

  if (completedAttemptResult) {
    return (
      <SpeakingResultView
        attempt={completedAttemptResult}
        challenge={challenge}
        onPracticeAgain={() => setCompletedAttemptResult(null)}
      />
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      
      {/* Back Button */}
      <button
        onClick={() => navigate('/student/challenges')}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Challenges
      </button>

      {/* Challenge Topic Card */}
      <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-soft text-center space-y-4">
        
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-300 font-extrabold text-xs">
          <Sparkles className="w-3.5 h-3.5 text-accent-500" /> {challenge.category} • {challenge.difficulty}
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          "{challenge.title}"
        </h1>

        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 text-xs text-slate-700 dark:text-slate-300 leading-relaxed max-w-xl mx-auto">
          <p className="font-bold text-slate-900 dark:text-white mb-1">Question Prompt & Instructions:</p>
          <p>"{challenge.description}"</p>
          <p className="mt-2 font-bold text-brand-600 dark:text-brand-400 flex items-center justify-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" /> Speak naturally for {challenge.durationSeconds} seconds.
          </p>
        </div>
      </div>

      {/* Audio Recorder Room */}
      <AudioRecorder
        targetDurationSeconds={challenge.durationSeconds}
        onRecordingComplete={handleRecordingComplete}
        isSubmitting={isSubmitting}
      />

    </div>
  );
};
