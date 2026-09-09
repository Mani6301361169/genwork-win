import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Flame, Bell, User as UserIcon, LogOut, Shield } from 'lucide-react';

interface NavbarProps {
  onOpenMobileMenu?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenMobileMenu }) => {
  const { user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);

  const profile = user?.profile;
  const streak = profile?.currentStreak || 1;

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-xs">
      <div className="w-full px-6 py-3.5 flex items-center justify-between">
        
        {/* Left: Mobile Menu Toggle & Brand Logo */}
        <div className="flex items-center gap-4">
          <button
            onClick={onOpenMobileMenu}
            className="md:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors"
            aria-label="Open Navigation Menu"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#064e3b] text-[#f59e0b] flex items-center justify-center font-extrabold text-base shadow-sm">
              SS
            </div>
            <div className="flex items-center gap-2.5">
              <span className="text-xl font-extrabold text-[#064e3b] tracking-tight">
                SkillSprint
              </span>
              <span className="hidden sm:inline-block text-[10px] uppercase font-extrabold tracking-wider px-2.5 py-0.5 rounded-md bg-emerald-50 text-[#064e3b] border border-emerald-200">
                Placement Ready
              </span>
            </div>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3 sm:gap-4">
          
          {/* Daily Streak Badge */}
          {user?.role === 'STUDENT' && (
            <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 font-extrabold text-xs">
              <Flame className="w-4 h-4 fill-amber-500 text-amber-500" />
              <span>{streak} Day Streak</span>
            </div>
          )}

          {/* Notifications Button */}
          <button
            className="relative p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#e11d48]"></span>
          </button>

          {/* User Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-slate-100 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-[#064e3b] text-white flex items-center justify-center font-bold text-xs shadow-sm">
                {profile?.fullName ? profile.fullName.charAt(0) : 'U'}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-xs font-bold text-slate-900 leading-tight">
                  {profile?.fullName || user?.email}
                </p>
                <p className="text-[10px] text-[#064e3b] font-extrabold">
                  {user?.role === 'ADMIN' ? 'Admin Faculty' : profile?.department?.code || 'Student'}
                </p>
              </div>
            </button>

            {/* Dropdown Menu */}
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in">
                <div className="px-4 py-2.5 border-b border-slate-100">
                  <p className="text-sm font-bold text-slate-900">{profile?.fullName}</p>
                  <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                </div>

                <div className="py-1">
                  {user?.role === 'ADMIN' && (
                    <a
                      href="/admin/dashboard"
                      className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-[#064e3b] hover:bg-slate-50"
                    >
                      <Shield className="w-4 h-4" /> Admin Portal
                    </a>
                  )}

                  <a
                    href="/student/profile"
                    className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
                  >
                    <UserIcon className="w-4 h-4" /> My Profile
                  </a>

                  <button
                    onClick={logout}
                    className="w-full flex items-center gap-2 px-4 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 text-left"
                  >
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};
