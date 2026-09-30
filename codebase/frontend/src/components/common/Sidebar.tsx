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
    <div className="flex flex-col h-full bg-white border-r border-slate-200/80 w-64 py-5 px-3 select-none">
      
      {/* Mobile Close Button */}
      <div className="md:hidden flex justify-between items-center px-2 mb-3 pb-2 border-b border-slate-200">
        <span className="font-black text-amber-500 text-lg tracking-wider">WINNIFY</span>
        <button onClick={onCloseMobile} className="p-1.5 rounded-xl text-slate-700 hover:bg-slate-100">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Institution Name Banner */}
      <div className="flex items-center justify-between px-3 py-2 mb-3 rounded-xl hover:bg-slate-50 transition-colors">
        <span className="text-xs font-black uppercase text-slate-800 tracking-tight truncate">
          {profile?.college || 'CHALAPATHI INSTITUTE OF TECH'}
        </span>
        <Building className="w-4 h-4 text-slate-500 shrink-0 ml-1" />
      </div>

      {/* User Profile Badge */}
      <div className="flex items-center justify-between p-2.5 mb-4 bg-slate-50/80 rounded-2xl border border-slate-200/60">
        <div className="flex items-center gap-2.5 overflow-hidden">
          <div className="w-9 h-9 rounded-full bg-purple-600 text-white flex items-center justify-center font-black text-xs shrink-0 shadow-sm">
            {getInitials(profile?.fullName)}
          </div>
          <div className="truncate">
            <p className="text-xs font-extrabold text-slate-900 truncate uppercase">
              {profile?.fullName || 'MANISHANKAR REDDY'}
            </p>
          </div>
        </div>
        <button className="text-slate-400 hover:text-slate-700 p-1 shrink-0">
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>

      {/* Workspace Subtitle Badge */}
      <div className="px-3 mb-2 flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-rose-500">
        <span className="w-2 h-2 rounded-full bg-rose-500 inline-block" />
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
                `flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-extrabold transition-all ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700 shadow-sm font-black'
                    : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
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
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-extrabold transition-all ${
              isMentoringActive
                ? 'text-indigo-700 font-black'
                : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <div className="flex items-center gap-3 truncate">
              <Users className="w-4 h-4 shrink-0" />
              <span className="truncate">Mentoring</span>
            </div>
            <ChevronDown
              className={`w-3.5 h-3.5 text-slate-400 shrink-0 transition-transform duration-200 ${
                isMentoringOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          {isMentoringOpen && (
            <div className="ml-5 border-l-2 border-slate-200/80 pl-3 space-y-1 my-1">
              <NavLink
                to="/student/mentoring/dashboard"
                onClick={onCloseMobile}
                className={({ isActive }) =>
                  `block px-3 py-2 rounded-2xl text-xs font-extrabold transition-all ${
                    isActive || location.pathname === '/student/mentoring'
                      ? 'bg-indigo-50 text-indigo-700 font-black shadow-xs'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`
                }
              >
                Dashboard
              </NavLink>
              <NavLink
                to="/student/mentoring/sessions"
                onClick={onCloseMobile}
                className={({ isActive }) =>
                  `block px-3 py-2 rounded-2xl text-xs font-extrabold transition-all ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-700 font-black shadow-xs'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`
                }
              >
                My Sessions
              </NavLink>
              <NavLink
                to="/student/mentoring/action-items"
                onClick={onCloseMobile}
                className={({ isActive }) =>
                  `block px-3 py-2 rounded-2xl text-xs font-extrabold transition-all ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-700 font-black shadow-xs'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
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
            `flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-extrabold transition-all ${
              isActive
                ? 'bg-indigo-50 text-indigo-700 shadow-sm font-black'
                : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
            }`
          }
        >
          <div className="flex items-center gap-3 truncate">
            <CreditCard className="w-4 h-4 shrink-0" />
            <span className="truncate">My Subscription</span>
          </div>
        </NavLink>
      </nav>

      {/* Bottom Winnify Orange Logo */}
      <div className="pt-4 border-t border-slate-100 mt-2 px-3 text-left">
        <span className="text-xl font-black text-amber-500 tracking-wider">
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
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs" onClick={onCloseMobile} />
          <div className="relative z-10 w-64 h-full animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
