import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Mic,
  Building2,
  BrainCircuit,
  BookOpen,
  Trophy,
  BarChart3,
  History,
  MessageSquare,
  Users,
  User,
  Settings,
  LogOut,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpenMobile, onCloseMobile }) => {
  const { logout } = useAuth();

  const navItems = [
    { label: 'Student Workspace', icon: LayoutDashboard, path: '/student/dashboard' },
    { label: 'Speaking Practice', icon: Mic, path: '/student/challenges' },
    { label: 'Campus Challenges', icon: Building2, path: '/student/campus' },
    { label: 'Interview Simulator', icon: BrainCircuit, path: '/student/interviews' },
    { label: 'Learning Center', icon: BookOpen, path: '/student/learning' },
    { label: 'Leaderboard', icon: Trophy, path: '/student/leaderboard' },
    { label: 'My Scores', icon: BarChart3, path: '/student/scores' },
    { label: 'Practice History', icon: History, path: '/student/history' },
    { label: 'Feedback', icon: MessageSquare, path: '/student/feedback' },
    { label: 'Mentoring', icon: Users, path: '/student/mentoring' },
    { label: 'Student Profile', icon: User, path: '/student/profile' },
    { label: 'Account Settings', icon: Settings, path: '/student/settings' },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white border-r-2 border-black w-64 py-6 px-4">
      {/* Mobile Header */}
      <div className="md:hidden flex justify-between items-center px-2 mb-4 pb-3 border-b-2 border-black">
        <span className="font-extrabold text-black text-lg">SkillSprint</span>
        <button onClick={onCloseMobile} className="p-1.5 rounded-xl text-black hover:bg-zinc-100">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Workspace Header Tag */}
      <div className="hidden md:block mb-4 px-3 py-2 bg-black text-white rounded-xl border border-black">
        <p className="text-[10px] font-extrabold uppercase tracking-widest text-zinc-300">Workspace</p>
        <p className="text-xs font-extrabold text-white">Student Hub</p>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-1.5 overflow-y-auto pr-1 custom-scrollbar">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onCloseMobile}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-black text-white shadow-sm font-extrabold border border-black'
                    : 'text-zinc-800 hover:bg-zinc-100 hover:text-black'
                }`
              }
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Logout button */}
      <div className="pt-4 border-t-2 border-black mt-3">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-extrabold text-black hover:bg-zinc-100 border border-black transition-colors"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          <span>Logout Workspace</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden md:block shrink-0 h-[calc(100vh-65px)] sticky top-[65px]">
        {sidebarContent}
      </aside>

      {isOpenMobile && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={onCloseMobile} />
          <div className="relative z-10 w-64 h-full animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
