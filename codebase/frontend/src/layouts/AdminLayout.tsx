import React from 'react';
import { Outlet, Navigate, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Users, Trophy, Megaphone, MessageSquare, ArrowLeft, LogOut } from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const { user, isLoading, logout } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-navy-950">
        <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) {
    return <Navigate to="/login" replace />;
  }

  const adminNavs = [
    { label: 'Admin Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
    { label: 'Student Directory', icon: Users, path: '/admin/students' },
    { label: 'Manage Challenges', icon: Trophy, path: '/admin/challenges' },
    { label: 'Announcements', icon: Megaphone, path: '/admin/announcements' },
    { label: 'Student Feedback', icon: MessageSquare, path: '/admin/feedback' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-navy-950 flex flex-col font-sans">
      <header className="bg-white dark:bg-navy-900 border-b border-slate-200 dark:border-slate-800 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-600 to-accent-500 text-white font-extrabold flex items-center justify-center">
            SS
          </div>
          <div>
            <span className="font-extrabold text-slate-900 dark:text-white text-base">SkillSprint</span>
            <span className="ml-2 px-2 py-0.5 rounded-full bg-accent-500/10 text-accent-600 dark:text-accent-400 text-[10px] font-bold uppercase tracking-wider">
              Faculty Admin Portal
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <NavLink
            to="/student/dashboard"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-200 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Student View
          </NavLink>

          <button
            onClick={logout}
            className="p-2 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl text-xs font-bold transition-colors"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      <div className="flex flex-1 max-w-7xl mx-auto w-full">
        <aside className="w-64 bg-white dark:bg-navy-900 border-r border-slate-200 dark:border-slate-800 p-4 shrink-0 hidden md:block">
          <nav className="space-y-1">
            {adminNavs.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                      isActive
                        ? 'bg-brand-600 text-white shadow-soft'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`
                  }
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </aside>

        <main className="flex-1 p-6 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
