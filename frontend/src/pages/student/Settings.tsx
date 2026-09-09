import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { apiFetch } from '../../services/api';
import { Settings as SettingsIcon, Sun, Moon, Mic, Lock, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const Settings: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordMsg, setPasswordMsg] = useState<{ text: string; error: boolean } | null>(null);
  const [isSubmittingPassword, setIsSubmittingPassword] = useState(false);

  const [micTestStatus, setMicTestStatus] = useState<string | null>(null);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMsg(null);
    setIsSubmittingPassword(true);

    try {
      await apiFetch('/auth/change-password', {
        method: 'POST',
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      setPasswordMsg({ text: 'Password changed successfully!', error: false });
      setCurrentPassword('');
      setNewPassword('');
    } catch (err: any) {
      setPasswordMsg({ text: err.message || 'Failed to change password.', error: true });
    } finally {
      setIsSubmittingPassword(false);
    }
  };

  const handleTestMic = async () => {
    setMicTestStatus('Testing microphone...');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setMicTestStatus('✅ Microphone working properly!');
      setTimeout(() => {
        stream.getTracks().forEach((track) => track.stop());
      }, 2000);
    } catch (err) {
      setMicTestStatus('❌ Microphone permission denied or device not found.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
          <SettingsIcon className="w-6 h-6 text-brand-500" /> Account Settings
        </h1>
        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
          Manage your theme preferences, audio device settings, and security credentials.
        </p>
      </div>

      {/* 1. Theme Preferences */}
      <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-soft space-y-4">
        <h2 className="text-xs font-extrabold uppercase tracking-widest text-slate-500">
          Appearance Theme
        </h2>

        <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
          <div className="flex items-center gap-3">
            {theme === 'dark' ? <Moon className="w-5 h-5 text-amber-400" /> : <Sun className="w-5 h-5 text-amber-500" />}
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white">
                {theme === 'dark' ? 'Dark Navy Theme' : 'Light Mode Theme'}
              </p>
              <p className="text-[11px] text-slate-500">Switch application dark and light mode styling.</p>
            </div>
          </div>

          <button
            onClick={toggleTheme}
            className="px-4 py-2 bg-brand-600 text-white rounded-xl text-xs font-bold shadow-xs hover:bg-brand-700 transition-colors"
          >
            Toggle Theme
          </button>
        </div>
      </div>

      {/* 2. Audio & Microphone Test */}
      <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-soft space-y-4">
        <h2 className="text-xs font-extrabold uppercase tracking-widest text-slate-500">
          Microphone Settings & Test
        </h2>

        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Mic className="w-5 h-5 text-brand-500" />
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">Test Microphone Input</p>
                <p className="text-[11px] text-slate-500">Ensure browser audio capture works before starting a challenge.</p>
              </div>
            </div>

            <button
              onClick={handleTestMic}
              className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white rounded-xl text-xs font-bold hover:bg-slate-300 transition-colors"
            >
              Test Mic Now
            </button>
          </div>

          {micTestStatus && (
            <p className="text-xs font-bold text-brand-600 dark:text-brand-400 pt-2 border-t border-slate-200 dark:border-slate-700">
              {micTestStatus}
            </p>
          )}
        </div>
      </div>

      {/* 3. Password Security */}
      <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-soft space-y-4">
        <h2 className="text-xs font-extrabold uppercase tracking-widest text-slate-500">
          Password & Security
        </h2>

        {passwordMsg && (
          <div
            className={`p-3 rounded-xl text-xs font-bold ${
              passwordMsg.error ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'
            }`}
          >
            {passwordMsg.text}
          </div>
        )}

        <form onSubmit={handleChangePassword} className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Current Password</label>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">New Password</label>
            <input
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmittingPassword}
            className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow-soft"
          >
            {isSubmittingPassword ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>

    </div>
  );
};
