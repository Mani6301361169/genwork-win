import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { ShieldCheck, CheckCircle2, Award, Zap, Building2, Calendar, FileText } from 'lucide-react';

export const Subscription: React.FC = () => {
  const { user } = useAuth();
  const profile = user?.profile;

  const planFeatures = [
    'Unlimited AI Speaking Practice & Audio Recording',
    'Real-time NLP Transcript & Pacing Analysis',
    '150+ Technical & HR Mock Interview Questions',
    'Campus & Departmental Placement Benchmarks',
    '1-on-1 Faculty Mentoring & Action Item Tracking',
    'Bite-sized Learning Center & STAR Framework Guides',
    'Official Placement Readiness Index Certificate',
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6 font-sans text-black">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-black tracking-tight flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-black" /> My Workspace Subscription & Plan
        </h1>
        <p className="text-xs text-zinc-700 font-medium mt-1">
          Manage your student workspace license, placement readiness credentials, and active campus privileges.
        </p>
      </div>

      {/* Main Subscription Banner Card */}
      <div className="bg-black text-white rounded-3xl p-8 border-2 border-black shadow-lg space-y-6 relative overflow-hidden">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-6">
          <div>
            <span className="px-3 py-1 rounded-full bg-white text-black font-extrabold text-[10px] uppercase tracking-wider border border-white">
              Institutional License
            </span>
            <h2 className="text-2xl font-extrabold text-white mt-2">
              Campus Pro Student Workspace
            </h2>
            <p className="text-xs text-zinc-300 font-medium mt-1">
              Sponsored by {profile?.college || 'SkillSprint Institute of Technology'}
            </p>
          </div>

          <div className="bg-zinc-900 border-2 border-zinc-700 p-4 rounded-2xl text-center shrink-0">
            <span className="text-xs font-extrabold uppercase text-zinc-400 block">Status</span>
            <span className="text-base font-extrabold text-white flex items-center justify-center gap-1 mt-0.5">
              <CheckCircle2 className="w-4 h-4 text-white" /> Active Access
            </span>
          </div>
        </div>

        {/* License Meta Details */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-zinc-400 block text-[10px] uppercase font-bold">Student Roll No.</span>
            <span className="font-extrabold text-white font-mono">{profile?.studentId || 'SKP-2026-001'}</span>
          </div>
          <div>
            <span className="text-zinc-400 block text-[10px] uppercase font-bold">Department</span>
            <span className="font-extrabold text-white">{profile?.department?.name || 'Computer Science'}</span>
          </div>
          <div>
            <span className="text-zinc-400 block text-[10px] uppercase font-bold">Graduation Year</span>
            <span className="font-extrabold text-white">{profile?.graduationYear || 2026}</span>
          </div>
          <div>
            <span className="text-zinc-400 block text-[10px] uppercase font-bold">Valid Until</span>
            <span className="font-extrabold text-white">June 30, 2026</span>
          </div>
        </div>

      </div>

      {/* Included Plan Features Grid */}
      <div className="bg-white border-2 border-black rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
        <h2 className="text-xs font-extrabold uppercase tracking-widest text-black">
          Included Campus Pro Privileges
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {planFeatures.map((feat, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-zinc-50 border-2 border-black flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-black shrink-0 mt-0.5" />
              <span className="text-xs font-extrabold text-black leading-snug">{feat}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Placement Readiness Badge & Certification */}
      <div className="bg-white border-2 border-black rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 text-xs font-extrabold text-black">
            <Award className="w-4 h-4 text-black" /> Placement Readiness Verification
          </div>
          <h3 className="text-base font-extrabold text-black">
            Official Placement Readiness Certificate
          </h3>
          <p className="text-xs text-zinc-700 font-medium">
            Maintain an average score of 75+ across speaking and mock interviews to unlock your verified campus placement badge.
          </p>
        </div>

        <div className="shrink-0 text-center bg-black text-white p-4 rounded-2xl border-2 border-black min-w-44">
          <span className="text-xs font-extrabold uppercase text-zinc-400 block">Current Readiness</span>
          <span className="text-2xl font-extrabold text-white font-mono">{profile?.overallScore || 72} / 100</span>
          <span className="text-[10px] font-bold text-zinc-300 block mt-1">
            {profile?.overallScore && profile.overallScore >= 75 ? 'Ready for Campus Drives' : '3 Points to Certification'}
          </span>
        </div>
      </div>

    </div>
  );
};
