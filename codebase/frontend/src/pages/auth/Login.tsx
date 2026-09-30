import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { apiFetch } from '../../services/api';
import { LogIn, Sparkles, UserCheck, ShieldCheck } from 'lucide-react';

export const Login: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'STUDENT' | 'ADMIN'>('STUDENT');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const data = await apiFetch<{ token: string; user: any }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      login(data.token, data.user);
      if (data.user.role === 'ADMIN' || data.user.role === 'SUPER_ADMIN') {
        navigate('/admin/dashboard');
      } else {
        navigate('/student/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to sign in. Please check your email and password.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const fillDemoStudent = () => {
    setActiveTab('STUDENT');
    setEmail('student@skillsprint.edu');
    setPassword('student123');
  };

  const fillDemoAdmin = () => {
    setActiveTab('ADMIN');
    setEmail('admin@skillsprint.edu');
    setPassword('admin123');
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-black text-white dark:bg-white dark:text-black font-extrabold text-2xl shadow-sm mb-4">
          SS
        </div>
        <h2 className="text-3xl font-extrabold text-black dark:text-white tracking-tight">
          Welcome to SkillSprint
        </h2>
        <p className="mt-2 text-xs font-semibold text-neutral-600 dark:text-neutral-400">
          Practice. Improve. Get Placement Ready.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white dark:bg-neutral-900 py-8 px-6 sm:px-10 shadow-sm border border-neutral-200 dark:border-neutral-800 rounded-3xl">
          
          {/* Student vs Admin Toggle Tabs */}
          <div className="flex p-1 bg-neutral-100 dark:bg-neutral-800 rounded-2xl mb-6">
            <button
              onClick={() => setActiveTab('STUDENT')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-extrabold transition-all ${
                activeTab === 'STUDENT'
                  ? 'bg-black text-white dark:bg-white dark:text-black shadow-xs'
                  : 'text-neutral-500 hover:text-black dark:hover:text-white'
              }`}
            >
              <UserCheck className="w-4 h-4" /> Student Login
            </button>
            <button
              onClick={() => setActiveTab('ADMIN')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-extrabold transition-all ${
                activeTab === 'ADMIN'
                  ? 'bg-black text-white dark:bg-white dark:text-black shadow-xs'
                  : 'text-neutral-500 hover:text-black dark:hover:text-white'
              }`}
            >
              <ShieldCheck className="w-4 h-4" /> Admin Portal
            </button>
          </div>

          {/* Quick One-Click Demo Credentials */}
          <div className="mb-6 p-3.5 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700">
            <p className="text-[11px] font-extrabold text-black dark:text-white mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> One-Click Demo Logins:
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={fillDemoStudent}
                className="flex-1 py-2 px-3 bg-black hover:bg-neutral-800 text-white dark:bg-white dark:hover:bg-neutral-200 dark:text-black rounded-xl text-[11px] font-extrabold transition-colors shadow-xs"
              >
                Demo Student
              </button>
              <button
                type="button"
                onClick={fillDemoAdmin}
                className="flex-1 py-2 px-3 bg-black hover:bg-neutral-800 text-white dark:bg-white dark:hover:bg-neutral-200 dark:text-black rounded-xl text-[11px] font-extrabold transition-colors shadow-xs"
              >
                Demo Admin
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-neutral-100 border border-black text-black text-xs font-bold">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-black dark:text-white mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={activeTab === 'STUDENT' ? 'student@skillsprint.edu' : 'admin@skillsprint.edu'}
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-black dark:text-white text-xs font-semibold focus:ring-2 focus:ring-black dark:focus:ring-white focus:outline-none"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-bold text-black dark:text-white">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-[11px] font-extrabold text-black dark:text-white hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-black dark:text-white text-xs font-semibold focus:ring-2 focus:ring-black dark:focus:ring-white focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 py-3 px-4 bg-black hover:bg-neutral-800 text-white dark:bg-white dark:hover:bg-neutral-200 dark:text-black rounded-xl font-extrabold text-xs shadow-sm transition-all flex items-center justify-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              {isSubmitting ? 'Signing In...' : `Sign In as ${activeTab === 'STUDENT' ? 'Student' : 'Admin'}`}
            </button>
          </form>

          {activeTab === 'STUDENT' && (
            <div className="mt-6 text-center text-xs text-neutral-600 dark:text-neutral-400">
              New to SkillSprint?{' '}
              <Link to="/register" className="font-extrabold text-black dark:text-white hover:underline">
                Create Student Account
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
