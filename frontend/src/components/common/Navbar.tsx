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
    <header className="sticky top-0 z-30 bg-white border-b-2 border-black shadow-xs">
      <div className="w-full px-6 py-3.5 flex items-center justify-between">
        
        {/* Left: Mobile Menu Toggle & Brand Logo */}
        <div className="flex items-center gap-4">
          <button
            onClick={onOpenMobileMenu}
            className="md:hidden p-2 rounded-xl text-black hover:bg-zinc-100 transition-colors"
            aria-label="Open Navigation Menu"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-black text-white flex items-center justify-center font-extrabold text-sm border-2 border-black shadow-xs">
              SS
            </div>
            <div className="flex items-center gap-2.5">
              <span className="text-xl font-extrabold text-black tracking-tight">
                SkillSprint
              </span>
              <span className="hidden sm:inline-block text-[10px] uppercase font-extrabold tracking-wider px-2.5 py-0.5 rounded-md bg-black text-white border border-black">
                Placement Ready
              </span>
            </div>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3 sm:gap-4">
          
          {/* Daily Streak Badge */}
          {user?.role === 'STUDENT' && (
            <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-zinc-100 border-2 border-black text-black font-extrabold text-xs">
              <Flame className="w-4 h-4 text-black fill-black" />
              <span>{streak} Day Streak</span>
            </div>
          )}

          {/* Notifications Button */}
          <button
            className="relative p-2 rounded-xl text-black hover:bg-zinc-100 transition-colors border border-transparent hover:border-black"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-black border border-white"></span>
          </button>

          {/* User Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-zinc-100 transition-colors border border-transparent hover:border-black"
            >
              <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-extrabold text-xs border border-black">
                {profile?.fullName ? profile.fullName.charAt(0) : 'U'}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-xs font-extrabold text-black leading-tight">
                  {profile?.fullName || user?.email}
                </p>
                <p className="text-[10px] text-zinc-600 font-extrabold uppercase">
                  {user?.role === 'ADMIN' ? 'Faculty Admin' : profile?.department?.code || 'Student Workspace'}
                </p>
              </div>
            </button>

            {/* Dropdown Menu */}
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border-2 border-black py-2 z-50 animate-in fade-in">
                <div className="px-4 py-2.5 border-b border-zinc-200">
                  <p className="text-sm font-extrabold text-black">{profile?.fullName}</p>
                  <p className="text-xs text-zinc-600 font-medium truncate">{user?.email}</p>
                </div>

                <div className="py-1">
                  {user?.role === 'ADMIN' && (
                    <a
                      href="/admin/dashboard"
                      className="flex items-center gap-2 px-4 py-2 text-xs font-extrabold text-black hover:bg-zinc-100"
                    >
                      <Shield className="w-4 h-4" /> Admin Portal
                    </a>
                  )}

                  <a
                    href="/student/profile"
                    className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-zinc-800 hover:bg-zinc-100"
                  >
                    <UserIcon className="w-4 h-4" /> Profile & Settings
                  </a>

                  <button
                    onClick={logout}
                    className="w-full text-left flex items-center gap-2 px-4 py-2 text-xs font-bold text-black hover:bg-zinc-100 border-t border-zinc-100 mt-1"
                  >
                    <LogOut className="w-4 h-4" /> Logout
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
