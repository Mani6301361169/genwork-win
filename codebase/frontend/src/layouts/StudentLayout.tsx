import React, { useState } from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sidebar } from '../components/common/Sidebar';
import { Menu, ChevronRight } from 'lucide-react';

export const StudentLayout: React.FC = () => {
  const { user, isLoading } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-100 dark:bg-black">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-black dark:border-white border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-black text-black dark:text-white">Loading Winnify Workspace...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Render dynamic multi-segment breadcrumbs
  const renderBreadcrumb = () => {
    const path = location.pathname;

    if (path.includes('/student/mentoring/sessions')) {
      return (
        <>
          <span className="font-bold text-neutral-600 dark:text-neutral-400">Mentoring</span>
          <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
          <span className="font-black text-black dark:text-white">Sessions</span>
        </>
      );
    }

    if (path.includes('/student/mentoring/action-items')) {
      return (
        <>
          <span className="font-bold text-neutral-600 dark:text-neutral-400">Mentoring</span>
          <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
          <span className="font-black text-black dark:text-white">Action Items</span>
        </>
      );
    }

    if (path.includes('/student/mentoring')) {
      return (
        <>
          <span className="font-bold text-neutral-600 dark:text-neutral-400">Mentoring</span>
          <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
          <span className="font-black text-black dark:text-white">Dashboard</span>
        </>
      );
    }

    let title = 'Home';
    if (path.includes('/student/challenges')) title = 'Global Challenges';
    else if (path.includes('/student/campus')) title = 'Campus Challenges';
    else if (path.includes('/student/interviews')) title = 'Practice Arena';
    else if (path.includes('/student/learning')) title = 'Learning Management';
    else if (path.includes('/student/leaderboard')) title = 'Leaderboard';
    else if (path.includes('/student/scores')) title = 'Scores';
    else if (path.includes('/student/history')) title = 'History';
    else if (path.includes('/student/feedback')) title = 'Comments';
    else if (path.includes('/student/subscription')) title = 'My Subscription';
    else if (path.includes('/student/profile')) title = 'Student Profile';

    return <span className="font-black text-black dark:text-white">{title}</span>;
  };

  return (
    <div className="min-h-screen bg-neutral-100 dark:bg-black text-black dark:text-white flex font-sans">
      
      {/* Sidebar */}
      <Sidebar isOpenMobile={isMobileMenuOpen} onCloseMobile={() => setIsMobileMenuOpen(false)} />

      {/* Main Content Workspace */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        
        {/* Top Breadcrumb Bar */}
        <header className="px-6 sm:px-8 py-3.5 flex items-center justify-between text-xs font-bold bg-transparent">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden p-1.5 rounded-xl bg-white dark:bg-neutral-900 text-black dark:text-white border-2 border-black dark:border-white shadow-xs"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-1.5 text-black dark:text-white font-bold text-xs">
              <span className="font-black text-black dark:text-white">Student Workspace</span>
              <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
              {renderBreadcrumb()}
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-[11px] font-black text-black dark:text-white bg-white dark:bg-neutral-900 px-3 py-1 rounded-full border-2 border-black dark:border-white shadow-xs">
            ★ Winnify AI Platform Active
          </div>
        </header>

        {/* Page Main Content Area */}
        <main className="flex-1 px-6 sm:px-8 lg:px-10 py-4 pb-16 w-full max-w-7xl mx-auto">
          <Outlet />
        </main>
      </div>

    </div>
  );
};
