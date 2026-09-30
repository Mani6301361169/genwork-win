import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Home,
  FileText,
  Sparkles,
  Building2,
  Gamepad2,
  BookOpen,
  Trophy,
  BarChart3,
  History,
  MessageSquare,
  Users,
  CreditCard,
  Building,
  MoreHorizontal,
  X,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpenMobile, onCloseMobile }) => {
  const { user } = useAuth();
  const profile = user?.profile;
  const location = useLocation();

  const isMentoringActive = location.pathname.startsWith('/student/mentoring');
  const [isMentoringOpen, setIsMentoringOpen] = useState(true);

  const getInitials = (name?: string) => {
    if (!name) return 'MR';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const navItems = [
    { label: 'Home', icon: Home, path: '/student/dashboard' },
    { label: 'Daily Quiz', icon: FileText, path: '/student/quiz' },
    { label: 'Winnify Challenges', icon: Sparkles, path: '/student/challenges' },
    { label: 'Campus Challenges', icon: Building2, path: '/student/campus' },
    { label: 'Practice Arena', icon: Gamepad2, path: '/student/interviews' },
    { label: 'Learning Management', icon: BookOpen, path: '/student/learning' },
    { label: 'Leaderboard', icon: Trophy, path: '/student/leaderboard' },
    { label: 'Scores', icon: BarChart3, path: '/student/scores' },
    { label: 'History', icon: History, path: '/student/history' },
    { label: 'Comments', icon: MessageSquare, path: '/student/feedback' },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white dark:bg-neutral-900 border-r-2 border-black dark:border-white w-64 py-5 px-3 select-none">
      
      {/* Mobile Close Button */}
      <div className="md:hidden flex justify-between items-center px-2 mb-3 pb-2 border-b-2 border-black dark:border-white">
        <span className="font-black text-black dark:text-white text-lg tracking-wider">WINNIFY</span>
        <button onClick={onCloseMobile} className="p-1.5 rounded-xl text-black dark:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Institution Name Banner */}
      <div className="flex items-center justify-between px-3 py-2.5 mb-3 rounded-xl bg-neutral-50 dark:bg-neutral-800 border-2 border-black dark:border-white">
        <span className="text-xs font-black uppercase text-black dark:text-white tracking-tight truncate">
          {profile?.college || 'CHALAPATHI INSTITUTE OF TECH'}
        </span>
        <Building className="w-4 h-4 text-black dark:text-white shrink-0 ml-1" />
      </div>

      {/* User Profile Badge */}
      <div className="flex items-center justify-between p-2.5 mb-4 bg-neutral-100 dark:bg-neutral-800/80 rounded-2xl border-2 border-black dark:border-white">
        <div className="flex items-center gap-2.5 overflow-hidden">
          <div className="w-9 h-9 rounded-full bg-black text-white dark:bg-white dark:text-black flex items-center justify-center font-black text-xs shrink-0 border border-black">
            {getInitials(profile?.fullName)}
          </div>
          <div className="truncate">
            <p className="text-xs font-black text-black dark:text-white truncate uppercase">
              {profile?.fullName || 'MANISHANKAR REDDY'}
            </p>
          </div>
        </div>
        <button className="text-black dark:text-white hover:opacity-75 p-1 shrink-0">
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>

      {/* Workspace Subtitle Badge */}
      <div className="px-3 mb-2 flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-black dark:text-white">
        <span className="w-2.5 h-2.5 rounded-full bg-black dark:bg-white inline-block border border-black" />
        <span>STUDENT WORKSPACE</span>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-1 custom-scrollbar">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onCloseMobile}
              className={({ isActive }) =>
                `flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-black transition-all border ${
                  isActive
                    ? 'bg-black text-white dark:bg-white dark:text-black border-black dark:border-white shadow-xs'
                    : 'text-black dark:text-neutral-200 border-transparent hover:bg-neutral-100 dark:hover:bg-neutral-800'
                }`
              }
            >
              <div className="flex items-center gap-3 truncate">
                <Icon className="w-4 h-4 shrink-0" />
                <span className="truncate">{item.label}</span>
              </div>
            </NavLink>
          );
        })}

        {/* Collapsible Mentoring Group */}
        <div key="mentoring-group" className="pt-0.5">
          <button
            type="button"
            onClick={() => setIsMentoringOpen(!isMentoringOpen)}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-black transition-all border ${
              isMentoringActive
                ? 'bg-black text-white dark:bg-white dark:text-black border-black dark:border-white'
                : 'text-black dark:text-neutral-200 border-transparent hover:bg-neutral-100 dark:hover:bg-neutral-800'
            }`}
          >
            <div className="flex items-center gap-3 truncate">
              <Users className="w-4 h-4 shrink-0" />
              <span className="truncate">Mentoring</span>
            </div>
            <ChevronDown
              className={`w-3.5 h-3.5 shrink-0 transition-transform duration-200 ${
                isMentoringOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          {isMentoringOpen && (
            <div className="ml-5 border-l-2 border-black dark:border-white pl-3 space-y-1 my-1">
              <NavLink
                to="/student/mentoring/dashboard"
                onClick={onCloseMobile}
                className={({ isActive }) =>
                  `block px-3 py-2 rounded-2xl text-xs font-black transition-all border ${
                    isActive || location.pathname === '/student/mentoring'
                      ? 'bg-black text-white dark:bg-white dark:text-black border-black dark:border-white'
                      : 'text-neutral-800 dark:text-neutral-300 border-transparent hover:bg-neutral-100 dark:hover:bg-neutral-800'
                  }`
                }
              >
                Dashboard
              </NavLink>
              <NavLink
                to="/student/mentoring/sessions"
                onClick={onCloseMobile}
                className={({ isActive }) =>
                  `block px-3 py-2 rounded-2xl text-xs font-black transition-all border ${
                    isActive
                      ? 'bg-black text-white dark:bg-white dark:text-black border-black dark:border-white'
                      : 'text-neutral-800 dark:text-neutral-300 border-transparent hover:bg-neutral-100 dark:hover:bg-neutral-800'
                  }`
                }
              >
                My Sessions
              </NavLink>
              <NavLink
                to="/student/mentoring/action-items"
                onClick={onCloseMobile}
                className={({ isActive }) =>
                  `block px-3 py-2 rounded-2xl text-xs font-black transition-all border ${
                    isActive
                      ? 'bg-black text-white dark:bg-white dark:text-black border-black dark:border-white'
                      : 'text-neutral-800 dark:text-neutral-300 border-transparent hover:bg-neutral-100 dark:hover:bg-neutral-800'
                  }`
                }
              >
                Action Items
              </NavLink>
            </div>
          )}
        </div>

        {/* My Subscription Link */}
        <NavLink
          to="/student/subscription"
          onClick={onCloseMobile}
          className={({ isActive }) =>
            `flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-black transition-all border ${
              isActive
                ? 'bg-black text-white dark:bg-white dark:text-black border-black dark:border-white shadow-xs'
                : 'text-black dark:text-neutral-200 border-transparent hover:bg-neutral-100 dark:hover:bg-neutral-800'
            }`
          }
        >
          <div className="flex items-center gap-3 truncate">
            <CreditCard className="w-4 h-4 shrink-0" />
            <span className="truncate">My Subscription</span>
          </div>
        </NavLink>
      </nav>

      {/* Bottom Winnify Black Logo */}
      <div className="pt-4 border-t-2 border-black dark:border-white mt-2 px-3 text-left">
        <span className="text-xl font-black text-black dark:text-white tracking-wider uppercase">
          WINNIFY
        </span>
      </div>

    </div>
  );

  return (
    <>
      <aside className="hidden md:block shrink-0 h-screen sticky top-0">
        {sidebarContent}
      </aside>

      {isOpenMobile && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div className="fixed inset-0 bg-black/70 backdrop-blur-xs" onClick={onCloseMobile} />
          <div className="relative z-10 w-64 h-full animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
