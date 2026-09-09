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
    <header className="sticky top-0 z-30 bg-white/90 dark:bg-black/90 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800 transition-colors">
      <div className="px-4 sm:px-6 py-3 flex items-center justify-between">
        
        {/* Left: Mobile Menu Toggle & Brand Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenMobileMenu}
            className="md:hidden p-2 rounded-lg text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-900"
            aria-label="Open Navigation Menu"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-black text-white dark:bg-white dark:text-black flex items-center justify-center font-extrabold text-lg shadow-sm">
              SS
            </div>
            <div>
              <span className="text-xl font-extrabold text-black dark:text-white tracking-tight">
                SkillSprint
              </span>
              <span className="hidden sm:inline-block text-[10px] uppercase font-extrabold tracking-widest ml-2 px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-900 text-black dark:text-white border border-neutral-200 dark:border-neutral-800">
                Placement Ready
              </span>
            </div>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3 sm:gap-4">
          
          {/* Daily Streak Badge */}
          {user?.role === 'STUDENT' && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-100 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-black dark:text-white font-bold text-xs sm:text-sm">
              <Flame className="w-4 h-4 fill-black text-black dark:fill-white dark:text-white" />
              <span>{streak} Day Streak</span>
            </div>
          )}

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors"
            title="Toggle Light/Dark Theme"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5 text-white" /> : <Moon className="w-5 h-5 text-black" />}
          </button>

          {/* Notifications Button */}
          <button
            className="relative p-2 rounded-xl text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-black dark:bg-white"></span>
          </button>

          {/* User Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-2.5 p-1 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-black dark:bg-white text-white dark:text-black flex items-center justify-center font-bold text-sm shadow-sm">
                {profile?.fullName ? profile.fullName.charAt(0) : 'U'}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-xs font-bold text-black dark:text-white leading-tight">
                  {profile?.fullName || user?.email}
                </p>
                <p className="text-[10px] text-neutral-500 dark:text-neutral-400 font-medium">
                  {user?.role === 'ADMIN' ? 'Admin Faculty' : profile?.department?.code || 'Student'}
                </p>
              </div>
            </button>

            {/* Dropdown Menu */}
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-neutral-900 rounded-2xl shadow-xl border border-neutral-200 dark:border-neutral-800 py-2 z-50 animate-in fade-in">
                <div className="px-4 py-2.5 border-b border-neutral-100 dark:border-neutral-800">
                  <p className="text-sm font-bold text-black dark:text-white">{profile?.fullName}</p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">{user?.email}</p>
                </div>

                <div className="py-1">
                  {user?.role === 'ADMIN' && (
                    <a
                      href="/admin/dashboard"
                      className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-black dark:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800"
                    >
                      <Shield className="w-4 h-4" /> Admin Portal
                    </a>
                  )}

                  <a
                    href="/student/profile"
                    className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                  >
                    <UserIcon className="w-4 h-4" /> My Profile
                  </a>

                  <button
                    onClick={logout}
                    className="w-full flex items-center gap-2 px-4 py-2 text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-left"
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
