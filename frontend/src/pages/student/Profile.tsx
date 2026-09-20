import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { apiFetch } from '../../services/api';
import { User as UserIcon, Flame, Award, Edit3, X, Check, ShieldCheck } from 'lucide-react';

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
    <div className="max-w-3xl mx-auto space-y-6 font-sans text-black">
      
      {/* Header Profile Card */}
      <div className="bg-white border-2 border-black rounded-3xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
          
          <div className="w-24 h-24 rounded-full bg-black text-white font-extrabold text-3xl flex items-center justify-center border-2 border-black shrink-0">
            {profile?.fullName ? profile.fullName.charAt(0) : 'S'}
          </div>

          <div className="space-y-1 flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h1 className="text-2xl font-extrabold text-black">
                {profile?.fullName}
              </h1>
              <button
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-black text-white rounded-xl text-xs font-extrabold hover:bg-zinc-800 transition-colors border-2 border-black"
              >
                <Edit3 className="w-3.5 h-3.5" /> Edit Profile
              </button>
            </div>

            <p className="text-xs font-extrabold text-black">
              Student ID: {profile?.studentId || '21CS001'} • {profile?.department?.name || 'Computer Science'}
            </p>
            <p className="text-xs text-zinc-700 font-semibold">
              {profile?.college} • {profile?.academicYear} (Graduating {profile?.graduationYear || 2026})
            </p>
          </div>

        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t-2 border-black">
          <div className="p-3 bg-zinc-50 border-2 border-black rounded-2xl text-center">
            <span className="text-2xl font-extrabold text-black">{profile?.overallScore || 72}</span>
            <p className="text-[10px] font-extrabold text-black uppercase mt-0.5">Average Score</p>
          </div>
          <div className="p-3 bg-zinc-50 border-2 border-black rounded-2xl text-center">
            <span className="text-2xl font-extrabold text-black">🔥 {profile?.currentStreak || 1}d</span>
            <p className="text-[10px] font-extrabold text-black uppercase mt-0.5">Current Streak</p>
          </div>
          <div className="p-3 bg-zinc-50 border-2 border-black rounded-2xl text-center">
            <span className="text-2xl font-extrabold text-black">{profile?.totalXP || 450}</span>
            <p className="text-[10px] font-extrabold text-black uppercase mt-0.5">Total XP Points</p>
          </div>
          <div className="p-3 bg-zinc-50 border-2 border-black rounded-2xl text-center">
            <span className="text-2xl font-extrabold text-black">{profile?.bestScore || 88}</span>
            <p className="text-[10px] font-extrabold text-black uppercase mt-0.5">Personal Best</p>
          </div>
        </div>
      </div>

      {/* Student Workspace Plan & Placement Badges */}
      <div className="bg-black text-white border-2 border-black rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-white" />
            <h2 className="text-sm font-extrabold uppercase tracking-widest text-white">
              Student Placement Subscription
            </h2>
          </div>
          <span className="px-3 py-1 rounded-full bg-white text-black font-extrabold text-[10px] border border-white">
            Campus Pro Active
          </span>
        </div>

        <p className="text-xs text-zinc-300 font-medium leading-relaxed">
          Your institution provides full unlimited access to SkillSprint AI Speaking Practice, Mock Interview Simulator, Campus Departmental Benchmarks, and 1-on-1 Faculty Mentoring.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="p-3 bg-zinc-900 border border-zinc-700 rounded-xl text-xs font-bold text-white flex items-center gap-2">
            <Check className="w-4 h-4 text-white" /> Unlimited AI Audio Evaluations
          </div>
          <div className="p-3 bg-zinc-900 border border-zinc-700 rounded-xl text-xs font-bold text-white flex items-center gap-2">
            <Check className="w-4 h-4 text-white" /> 150+ Interview Question Bank
          </div>
          <div className="p-3 bg-zinc-900 border border-zinc-700 rounded-xl text-xs font-bold text-white flex items-center gap-2">
            <Check className="w-4 h-4 text-white" /> Placement Readiness Certificate
          </div>
        </div>
      </div>

      {/* Account Details Box */}
      <div className="bg-white border-2 border-black rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
        <h2 className="text-xs font-extrabold uppercase tracking-widest text-black">
          Student Information
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-bold">
          <div>
            <span className="text-zinc-500 block text-[10px] uppercase">Email Address</span>
            <span className="text-black font-extrabold">{user?.email}</span>
          </div>
          <div>
            <span className="text-zinc-500 block text-[10px] uppercase">Mobile Phone</span>
            <span className="text-black font-extrabold">{profile?.phone || '+91 9876543210'}</span>
          </div>
          <div>
            <span className="text-zinc-500 block text-[10px] uppercase">Department</span>
            <span className="text-black font-extrabold">{profile?.department?.name}</span>
          </div>
          <div>
            <span className="text-zinc-500 block text-[10px] uppercase">Academic Batch</span>
            <span className="text-black font-extrabold">{profile?.academicYear}</span>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-white border-2 border-black rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative text-black">
            <button onClick={() => setIsEditing(false)} className="absolute top-6 right-6 p-1 text-black hover:bg-zinc-100 border border-black rounded-lg">
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-extrabold text-black mb-4">Edit Student Profile</h3>

            <form onSubmit={handleUpdate} className="space-y-3 text-xs">
              <div>
                <label className="block font-extrabold text-black mb-1">Full Name</label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full p-2.5 rounded-xl border-2 border-black bg-white text-black font-bold"
                />
              </div>

              <div>
                <label className="block font-extrabold text-black mb-1">Phone Number</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full p-2.5 rounded-xl border-2 border-black bg-white text-black font-bold"
                />
              </div>

              <div>
                <label className="block font-extrabold text-black mb-1">College</label>
                <input
                  type="text"
                  value={formData.college}
                  onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                  className="w-full p-2.5 rounded-xl border-2 border-black bg-white text-black font-bold"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-4 py-3.5 bg-black text-white font-extrabold rounded-xl text-xs border-2 border-black"
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
