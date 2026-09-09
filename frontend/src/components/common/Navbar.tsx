import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Sun, Moon, Flame, Bell, User as UserIcon, LogOut, Shield } from 'lucide-react';

interface NavbarProps {
  onOpenMobileMenu?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenMobileMenu }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [showDropdown, setShowDropdown] = useState(false);

  const profile = user?.profile;
  const streak = profile?.currentStreak || 1;

  return (
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-neutral-950/95 backdrop-blur-md border-b border-slate-200 dark:border-teal-dark/40 transition-colors shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
        
        {/* Left: Mobile Menu Toggle & Brand Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenMobileMenu}
            className="md:hidden p-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-teal-dark/30 transition-colors"
            aria-label="Open Navigation Menu"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-cinematic text-gold-400 flex items-center justify-center font-extrabold text-base border border-gold-500/30 shadow-emerald-glow">
              SS
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-extrabold bg-gradient-to-r from-emerald-deep via-teal-medium to-gold-500 bg-clip-text text-transparent tracking-tight">
                SkillSprint
              </span>
              <span className="hidden sm:inline-block text-[10px] uppercase font-extrabold tracking-wider px-2 py-0.5 rounded-md bg-emerald-deep/10 text-emerald-deep dark:bg-emerald-deep/40 dark:text-gold-400 border border-emerald-deep/20 dark:border-gold-500/30">
                Placement Ready
              </span>
            </div>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3 sm:gap-4">
          
          {/* Daily Streak Badge */}
          {user?.role === 'STUDENT' && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-700 dark:text-gold-400 font-extrabold text-xs">
              <Flame className="w-4 h-4 fill-gold-500 text-gold-500" />
              <span>{streak} Day Streak</span>
            </div>
          )}

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-teal-dark/30 transition-colors"
            title="Toggle Light/Dark Theme"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5 text-gold-400" /> : <Moon className="w-5 h-5 text-emerald-deep" />}
          </button>

          {/* Notifications Button */}
          <button
            className="relative p-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-teal-dark/30 transition-colors"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-crimson-500"></span>
          </button>

          {/* User Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-2.5 p-1 rounded-xl hover:bg-slate-100 dark:hover:bg-teal-dark/30 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-cinematic text-gold-400 flex items-center justify-center font-extrabold text-xs border border-gold-500/30 shadow-xs">
                {profile?.fullName ? profile.fullName.charAt(0) : 'U'}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                  {profile?.fullName || user?.email}
                </p>
                <p className="text-[10px] text-teal-medium dark:text-teal-light font-extrabold">
                  {user?.role === 'ADMIN' ? 'Admin Faculty' : profile?.department?.code || 'Student'}
                </p>
              </div>
            </button>

            {/* Dropdown Menu */}
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-neutral-900 rounded-2xl shadow-xl border border-slate-200 dark:border-teal-dark/50 py-2 z-50 animate-in fade-in">
                <div className="px-4 py-2.5 border-b border-slate-100 dark:border-slate-800">
                  <p className="text-sm font-bold text-slate-900 dark:text-white">{profile?.fullName}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user?.email}</p>
                </div>

                <div className="py-1">
                  {user?.role === 'ADMIN' && (
                    <a
                      href="/admin/dashboard"
                      className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-emerald-medium dark:text-teal-light hover:bg-slate-50 dark:hover:bg-teal-dark/30"
                    >
                      <Shield className="w-4 h-4" /> Admin Portal
                    </a>
                  )}

                  <a
                    href="/student/profile"
                    className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-teal-dark/30"
                  >
                    <UserIcon className="w-4 h-4" /> My Profile
                  </a>

                  <button
                    onClick={logout}
                    className="w-full flex items-center gap-2 px-4 py-2 text-xs font-bold text-crimson-600 dark:text-crimson-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-left"
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
