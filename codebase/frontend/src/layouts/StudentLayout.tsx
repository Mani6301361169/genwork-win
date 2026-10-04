import React, { useState } from 'react';
import { Outlet, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sidebar } from '../components/common/Sidebar';
import { Menu, ChevronRight, Bell, BarChart3, LogOut } from 'lucide-react';

export const StudentLayout: React.FC = () => {
  const { user, isLoading, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleSignOut = () => {
    logout();
    navigate('/login');
  };

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

    if (path.includes('/student/daily-quiz') || path.includes('/student/quiz')) {
      return <span className="font-black text-black dark:text-white">Daily Quiz</span>;
    }

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
    if (path.includes('/student/challenges')) title = 'Winnify Challenges';
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
    <div className="min-h-screen bg-[#f3f4f6] dark:bg-black text-black dark:text-white flex font-sans">
      
      {/* Sidebar */}
      <Sidebar isOpenMobile={isMobileMenuOpen} onCloseMobile={() => setIsMobileMenuOpen(false)} />

      {/* Main Content Workspace */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        
        {/* Top Breadcrumb & Header Bar */}
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

          {/* Right Header Controls: Notification Bell Icon & Sign Out */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleSignOut}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white dark:bg-neutral-900 text-rose-600 dark:text-rose-400 border border-neutral-300 dark:border-neutral-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 font-black text-xs transition-all shadow-2xs"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
              <span>Sign Out</span>
            </button>

            <div className="relative">
              <button
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="relative p-2 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors"
                title="Notifications"
              >
                <Bell className="w-5 h-5 text-black dark:text-white" />
                <span className="absolute top-0 right-0 w-4 h-4 rounded-full bg-rose-500 text-white font-black text-[9px] flex items-center justify-center border border-white dark:border-black">
                  50
                </span>
              </button>

              {/* Notifications Overlay Dropdown */}
              {isNotificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-xl z-50 p-4 space-y-3 animate-in fade-in zoom-in-95 duration-150">
                  <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-2">
                    <h3 className="font-black text-sm text-black dark:text-white">Notifications</h3>
                  </div>
                  <p className="text-[11px] font-bold text-neutral-400">This week</p>

                  <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                    {/* Item 1 */}
                    <div className="space-y-1.5 p-2.5 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
                      <div className="flex items-center justify-between text-xs font-black text-black dark:text-white">
                        <div className="flex items-center gap-1.5">
                          <BarChart3 className="w-4 h-4 text-amber-500" />
                          <span>WinSpeak score updated</span>
                        </div>
                        <span className="text-[10px] font-bold text-neutral-400">8m ago</span>
                      </div>
                      <p className="text-xs font-normal text-neutral-500 dark:text-neutral-400">
                        Your average across your last 5 weekly challenges.
                      </p>
                      <div className="inline-block px-3 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800 text-xs font-bold text-neutral-700 dark:text-neutral-300">
                        Your updated WinSpeak : <span className="font-black text-black dark:text-white">0</span>
                      </div>
                    </div>

                    {/* Item 2 */}
                    <div className="space-y-1.5 p-2.5 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
                      <div className="flex items-center justify-between text-xs font-black text-black dark:text-white">
                        <div className="flex items-center gap-1.5">
                          <Bell className="w-4 h-4 text-amber-500" />
                          <span>A new Campus Challenge is live!</span>
                        </div>
                        <span className="text-[10px] font-bold text-neutral-400">1d ago</span>
                      </div>
                      <p className="text-xs font-normal text-neutral-500 dark:text-neutral-400">
                        Your campus just dropped a challenge. Climb the leaderboard before your friends do.
                      </p>
                      <div className="inline-block px-3 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800 text-xs font-bold text-neutral-700 dark:text-neutral-300">
                        Challenge : <span className="font-bold text-black dark:text-white">Opinion & Explanation</span>
                      </div>
                    </div>

                    {/* Item 3 */}
                    <div className="space-y-1.5 p-2.5 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
                      <div className="flex items-center justify-between text-xs font-black text-black dark:text-white">
                        <div className="flex items-center gap-1.5">
                          <Bell className="w-4 h-4 text-amber-500" />
                          <span>A new Campus Challenge is live!</span>
                        </div>
                        <span className="text-[10px] font-bold text-neutral-400">1d ago</span>
                      </div>
                      <p className="text-xs font-normal text-neutral-500 dark:text-neutral-400">
                        Your campus just dropped a challenge. Climb the leaderboard before your friends do.
                      </p>
                      <div className="inline-block px-3 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800 text-xs font-bold text-neutral-700 dark:text-neutral-300">
                        Challenge : <span className="font-bold text-black dark:text-white">Situational Communication</span>
                      </div>
                    </div>

                    {/* Item 4 */}
                    <div className="space-y-1.5 p-2.5 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
                      <div className="flex items-center justify-between text-xs font-black text-black dark:text-white">
                        <div className="flex items-center gap-1.5">
                          <Bell className="w-4 h-4 text-amber-500" />
                          <span>A new Campus Challenge is live!</span>
                        </div>
                        <span className="text-[10px] font-bold text-neutral-400">1d ago</span>
                      </div>
                      <p className="text-xs font-normal text-neutral-500 dark:text-neutral-400">
                        Your campus just dropped a challenge. Climb the leaderboard before your friends do.
                      </p>
                      <div className="inline-block px-3 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800 text-xs font-bold text-neutral-700 dark:text-neutral-300">
                        Doesn't affect your WinSpeak score
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
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

