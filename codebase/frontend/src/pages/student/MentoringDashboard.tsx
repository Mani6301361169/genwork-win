import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Mail } from 'lucide-react';
import { WinnifyEmptyState } from '../../components/common/WinnifyEmptyState';

export const MentoringDashboard: React.FC = () => {
  const { user } = useAuth();
  const profile = user?.profile;

  const getInitials = (name?: string) => {
    if (!name) return 'LK';
    const parts = name.split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto font-sans">
      
      {/* Top Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Dashboard
        </h1>
      </div>

      {/* Student Profile Info Card */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        
        {/* Left Side: Avatar & Details */}
        <div className="flex items-center gap-4">
          <div className="w-13 h-13 rounded-full bg-purple-600 text-white flex items-center justify-center font-black text-sm shrink-0 shadow-md">
            {getInitials(profile?.fullName || 'Lidiya K')}
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-base font-black text-slate-900">
                {profile?.fullName || 'Lidiya K'}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-extrabold uppercase tracking-wider shadow-xs">
                Available
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 font-medium">
              <span>{user?.email || 'kalingapatnam@city.ac.in'}</span>
              <span>{profile?.phone || '9392627899'}</span>
              <span>{profile?.academicYear || '2023-24'}</span>
              <button className="p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors ml-1">
                <Mail className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Vertical Divider */}
        <div className="hidden md:block w-px h-12 bg-slate-200" />

        {/* Right Side: Stats Columns */}
        <div className="flex items-center justify-around md:justify-end gap-8 sm:gap-12 text-center">
          <div>
            <span className="text-xl font-black text-slate-900 block">0</span>
            <span className="text-xs text-slate-500 font-bold">Sessions</span>
          </div>

          <div>
            <span className="text-xl font-black text-slate-900 block">0%</span>
            <span className="text-xs text-slate-500 font-bold">Attendance</span>
          </div>

          <div>
            <span className="text-xl font-black text-slate-900 block">0</span>
            <span className="text-xs text-slate-500 font-bold">Action Items</span>
          </div>
        </div>

      </div>

      {/* 2-Column Grid: Recent Sessions & Engagement Score */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Recent Sessions Card */}
        <div>
          <h2 className="text-[11px] font-black uppercase text-slate-500 mb-2.5 tracking-wider px-1">
            RECENT SESSIONS
          </h2>
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs min-h-[220px] flex items-center justify-center">
            <WinnifyEmptyState
              title="No Sessions Yet"
              description="Your mentoring session history will show up here once your first session is recorded."
              type="plus"
            />
          </div>
        </div>

        {/* Mentoring Engagement Score Card */}
        <div>
          <h2 className="text-[11px] font-black uppercase text-slate-500 mb-2.5 tracking-wider px-1">
            MENTORING ENGAGEMENT SCORE
          </h2>
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs min-h-[220px] flex items-center justify-center">
            <WinnifyEmptyState
              title="No Sessions Yet"
              description="Your mentoring session history will show up here once your first session is recorded."
              type="cross"
            />
          </div>
        </div>

      </div>

      {/* Session Frequency Card */}
      <div>
        <h2 className="text-sm font-black text-slate-900 mb-2.5 px-1">
          Session Frequency
        </h2>
        <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-xs min-h-[200px] flex items-center justify-center">
          <WinnifyEmptyState
            title="No Sessions Yet"
            description=""
            type="cross"
          />
        </div>
      </div>

    </div>
  );
};

export default MentoringDashboard;
