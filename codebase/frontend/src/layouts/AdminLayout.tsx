import React from 'react';
import { Outlet, Navigate, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Users, Trophy, Megaphone, MessageSquare, ArrowLeft, LogOut } from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const { user, isLoading, logout } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-100 dark:bg-black">
        <div className="w-8 h-8 border-4 border-black dark:border-white border-t-transparent rounded-full animate-spin" />
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
    <div className="min-h-screen bg-neutral-100 dark:bg-black text-black dark:text-white flex flex-col font-sans">
      <header className="bg-white dark:bg-neutral-900 border-b-2 border-black dark:border-white px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-black text-white dark:bg-white dark:text-black font-black flex items-center justify-center border-2 border-black">
            SS
          </div>
          <div>
            <span className="font-black text-black dark:text-white text-base">SkillSprint</span>
            <span className="ml-2 px-2.5 py-0.5 rounded-full bg-black text-white dark:bg-white dark:text-black text-[10px] font-black uppercase tracking-wider border border-black">
              Faculty Admin Portal
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <NavLink
            to="/student/dashboard"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-black dark:text-white text-xs font-black border-2 border-black dark:border-white hover:bg-neutral-200 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Student View
          </NavLink>

          <button
            onClick={logout}
            className="p-2 text-black dark:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 border-2 border-black dark:border-white rounded-xl text-xs font-black transition-colors flex items-center gap-1"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </header>

      <div className="flex flex-1 max-w-7xl mx-auto w-full">
        <aside className="w-64 bg-white dark:bg-neutral-900 border-r-2 border-black dark:border-white p-4 shrink-0 hidden md:block">
          <nav className="space-y-1">
            {adminNavs.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-black transition-all border ${
                      isActive
                        ? 'bg-black text-white dark:bg-white dark:text-black border-black dark:border-white shadow-xs'
                        : 'text-black dark:text-neutral-300 border-transparent hover:bg-neutral-100 dark:hover:bg-neutral-800'
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
