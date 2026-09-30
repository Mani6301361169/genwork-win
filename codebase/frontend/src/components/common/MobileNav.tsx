import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Mic, BrainCircuit, Trophy, User } from 'lucide-react';

export const MobileNav: React.FC = () => {
  const items = [
    { label: 'Home', icon: LayoutDashboard, path: '/student/dashboard' },
    { label: 'Speaking', icon: Mic, path: '/student/challenges' },
    { label: 'Interview', icon: BrainCircuit, path: '/student/interviews' },
    { label: 'Rank', icon: Trophy, path: '/student/leaderboard' },
    { label: 'Profile', icon: User, path: '/student/profile' },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/90 dark:bg-navy-900/90 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 px-2 py-1.5 flex justify-around items-center">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl text-[10px] font-bold transition-all ${
                isActive
                  ? 'text-brand-600 dark:text-brand-400'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`
            }
          >
            <Icon className="w-5 h-5" />
            <span>{item.label}</span>
          </NavLink>
        );
      })}
    </div>
  );
};
