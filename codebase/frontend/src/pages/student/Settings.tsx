import React, { useState } from 'react';
import { apiFetch } from '../../services/api';
import { Settings as SettingsIcon, Sun, Mic, Lock, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const Settings: React.FC = () => {
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
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <SettingsIcon className="w-6 h-6 text-[#064e3b]" /> Account Settings
        </h1>
        <p className="text-xs text-slate-600 mt-1">
          Manage your audio device settings and security credentials.
        </p>
      </div>

      {/* 1. Theme Preferences */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
        <h2 className="text-xs font-extrabold uppercase tracking-widest text-slate-500">
          Appearance Theme
        </h2>

        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
          <div className="flex items-center gap-3">
            <Sun className="w-5 h-5 text-amber-500" />
            <div>
              <p className="text-xs font-bold text-slate-900">
                Light Mode Theme
              </p>
              <p className="text-[11px] text-slate-500">Clean, crisp light mode interface for optimal readability.</p>
            </div>
          </div>

          <span className="px-3 py-1 bg-[#064e3b] text-white rounded-lg text-xs font-bold shadow-xs">
            Active Light Mode
          </span>
        </div>
      </div>

      {/* 2. Audio & Microphone Test */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
        <h2 className="text-xs font-extrabold uppercase tracking-widest text-slate-500">
          Microphone Settings & Test
        </h2>

        <div className="p-4 bg-slate-50 rounded-xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Mic className="w-5 h-5 text-[#064e3b]" />
              <div>
                <p className="text-xs font-bold text-slate-900">Test Microphone Input</p>
                <p className="text-[11px] text-slate-500">Ensure browser audio capture works before starting a challenge.</p>
              </div>
            </div>

            <button
              onClick={handleTestMic}
              className="px-4 py-2 bg-slate-200 text-slate-900 rounded-xl text-xs font-bold hover:bg-slate-300 transition-colors"
            >
              Test Mic Now
            </button>
          </div>

          {micTestStatus && (
            <p className="text-xs font-bold text-[#064e3b] pt-2 border-t border-slate-200">
              {micTestStatus}
            </p>
          )}
        </div>
      </div>

      {/* 3. Password Security */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
        <h2 className="text-xs font-extrabold uppercase tracking-widest text-slate-500">
          Password & Security
        </h2>

        {passwordMsg && (
          <div
            className={`p-3 rounded-xl text-xs font-bold ${
              passwordMsg.error ? 'bg-rose-50 text-rose-600 border border-rose-200' : 'bg-emerald-50 text-emerald-600 border border-emerald-200'
            }`}
          >
            {passwordMsg.text}
          </div>
        )}

        <form onSubmit={handleChangePassword} className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Current Password</label>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-xs font-semibold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">New Password</label>
            <input
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-xs font-semibold"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmittingPassword}
            className="w-full py-3 bg-[#064e3b] hover:bg-[#047857] text-white font-bold text-xs rounded-xl shadow-sm"
          >
            {isSubmittingPassword ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>

    </div>
  );
};
