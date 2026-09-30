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
      <div className="min-h-screen flex items-center justify-center bg-[#e6e4ff]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#5338ec] border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-bold text-slate-700">Loading Winnify Workspace...</span>
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
          <span className="font-extrabold text-slate-600">Mentoring</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-black text-slate-900">Sessions</span>
        </>
      );
    }

    if (path.includes('/student/mentoring/action-items')) {
      return (
        <>
          <span className="font-extrabold text-slate-600">Mentoring</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-black text-slate-900">Action Items</span>
        </>
      );
    }

    if (path.includes('/student/mentoring')) {
      return (
        <>
          <span className="font-extrabold text-slate-600">Mentoring</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-black text-slate-900">Dashboard</span>
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

    return <span className="font-black text-slate-900">{title}</span>;
  };

  return (
    <div className="min-h-screen bg-[#e6e4ff] flex font-sans">
      
      {/* Sidebar */}
      <Sidebar isOpenMobile={isMobileMenuOpen} onCloseMobile={() => setIsMobileMenuOpen(false)} />

      {/* Main Content Workspace */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        
        {/* Top Breadcrumb Bar */}
        <header className="px-6 sm:px-8 py-3.5 flex items-center justify-between text-slate-700 text-xs font-bold bg-transparent">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden p-1.5 rounded-xl bg-white text-slate-800 shadow-sm border border-slate-200"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-1.5 text-slate-600 font-medium text-xs">
              <span className="font-extrabold text-slate-800">Student Workspace</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              {renderBreadcrumb()}
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-[11px] font-extrabold text-indigo-700 bg-white/80 backdrop-blur-md px-3 py-1 rounded-full border border-indigo-100 shadow-xs">
            ✨ Winnify AI Platform Active
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
