import React, { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Navbar } from '../components/common/Navbar';
import { Sidebar } from '../components/common/Sidebar';
import { MobileNav } from '../components/common/MobileNav';

export const StudentLayout: React.FC = () => {
  const { user, isLoading } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-navy-950">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-bold text-slate-500">Loading SkillSprint Workspace...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-navy-950 flex flex-col font-sans transition-colors">
      <Navbar onOpenMobileMenu={() => setIsMobileMenuOpen(true)} />
      <div className="flex flex-1 w-full max-w-7xl mx-auto">
        <Sidebar isOpenMobile={isMobileMenuOpen} onCloseMobile={() => setIsMobileMenuOpen(false)} />
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 pb-20 md:pb-8 max-w-full overflow-x-hidden">
          <Outlet />
        </main>
      </div>
      <MobileNav />
    </div>
  );
};
