import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { apiFetch } from '../../services/api';
import { User as UserIcon, Flame, Award, Edit3, X, Check } from 'lucide-react';

export const Profile: React.FC = () => {
  const { user, updateUserProfile } = useAuth();
  const profile = user?.profile;

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: profile?.fullName || '',
    phone: profile?.phone || '',
    college: profile?.college || 'SkillSprint Institute of Technology',
    academicYear: profile?.academicYear || '3rd Year',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await apiFetch<{ profile: any }>('/auth/profile', {
        method: 'PUT',
        body: JSON.stringify(formData),
      });
      updateUserProfile(res.profile);
      setIsEditing(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      
      {/* Header Profile Card */}
      <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-soft">
        <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
          
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-brand-600 to-accent-500 text-white font-extrabold text-3xl flex items-center justify-center shadow-glow shrink-0">
            {profile?.fullName ? profile.fullName.charAt(0) : 'S'}
          </div>

          <div className="space-y-1 flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                {profile?.fullName}
              </h1>
              <button
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold hover:bg-slate-200 transition-colors"
              >
                <Edit3 className="w-3.5 h-3.5" /> Edit Profile
              </button>
            </div>

            <p className="text-xs font-bold text-brand-600 dark:text-brand-400">
              Student ID: {profile?.studentId || '21CS001'} • {profile?.department?.name || 'Computer Science'}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {profile?.college} • {profile?.academicYear} (Graduating {profile?.graduationYear || 2026})
            </p>
          </div>

        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
          <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl text-center">
            <span className="text-2xl font-extrabold text-brand-600 dark:text-brand-400">{profile?.overallScore || 72}</span>
            <p className="text-[10px] font-bold text-slate-500 uppercase mt-0.5">Average Score</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl text-center">
            <span className="text-2xl font-extrabold text-amber-500">🔥 {profile?.currentStreak || 1}d</span>
            <p className="text-[10px] font-bold text-slate-500 uppercase mt-0.5">Current Streak</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl text-center">
            <span className="text-2xl font-extrabold text-emerald-500">{profile?.totalXP || 450}</span>
            <p className="text-[10px] font-bold text-slate-500 uppercase mt-0.5">Total XP Points</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl text-center">
            <span className="text-2xl font-extrabold text-accent-500">{profile?.bestScore || 88}</span>
            <p className="text-[10px] font-bold text-slate-500 uppercase mt-0.5">Personal Best</p>
          </div>
        </div>
      </div>

      {/* Account Details Box */}
      <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-soft space-y-4">
        <h2 className="text-xs font-extrabold uppercase tracking-widest text-slate-500">
          Student Information
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold">
          <div>
            <span className="text-slate-400 block text-[10px]">Email Address</span>
            <span className="text-slate-900 dark:text-white font-bold">{user?.email}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px]">Mobile Phone</span>
            <span className="text-slate-900 dark:text-white font-bold">{profile?.phone || '+91 9876543210'}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px]">Department</span>
            <span className="text-slate-900 dark:text-white font-bold">{profile?.department?.name}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px]">Academic Batch</span>
            <span className="text-slate-900 dark:text-white font-bold">{profile?.academicYear}</span>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative">
            <button onClick={() => setIsEditing(false)} className="absolute top-6 right-6 p-1 text-slate-500">
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white mb-4">Edit Profile</h3>

            <form onSubmit={handleUpdate} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Phone Number</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">College</label>
                <input
                  type="text"
                  value={formData.college}
                  onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-4 py-3 bg-brand-600 text-white font-bold rounded-xl text-xs"
              >
                {isSubmitting ? 'Saving...' : 'Save Profile Changes'}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
