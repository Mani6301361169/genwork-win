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
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#064e3b] border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-bold text-slate-600">Loading SkillSprint Workspace...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar onOpenMobileMenu={() => setIsMobileMenuOpen(true)} />
      <div className="flex flex-1 w-full">
        <Sidebar isOpenMobile={isMobileMenuOpen} onCloseMobile={() => setIsMobileMenuOpen(false)} />
        <main className="flex-1 px-6 sm:px-8 lg:px-10 py-8 pb-20 md:pb-10 max-w-7xl mx-auto w-full overflow-x-hidden">
          <Outlet />
        </main>
      </div>
      <MobileNav />
    </div>
  );
};
