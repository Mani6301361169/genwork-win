import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { apiFetch } from '../../services/api';
import { Eye, EyeOff, UserCheck, ShieldCheck, Sparkles } from 'lucide-react';

export const Login: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'STUDENT' | 'ADMIN'>('STUDENT');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
      setError(err.message || 'Failed to sign in. Please check your username/email and password.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const fillDemoStudent = () => {
    setActiveTab('STUDENT');
    setEmail('arun.v@college.edu');
    setPassword('Student123!');
  };

  const fillDemoAdmin = () => {
    setActiveTab('ADMIN');
    setEmail('admin@skillsprint.edu');
    setPassword('Admin123!');
  };

  const handleSSOClick = (provider: string) => {
    alert(`${provider} sign-in is enabled for institutional accounts. Log in with your campus credentials.`);
  };

  return (
    <div className="min-h-screen bg-neutral-100 dark:bg-black flex flex-col items-center justify-center p-4 sm:p-6 font-sans">
      <div className="w-full max-w-[440px] bg-white dark:bg-neutral-900 rounded-3xl p-6 sm:p-10 shadow-xl border-2 border-black dark:border-white">
        
        {/* Brand Header */}
        <div className="text-center mb-6">
          <h1 className="font-black text-3xl sm:text-4xl text-black dark:text-white tracking-wider uppercase inline-block">
            WINNIFY
          </h1>
          <h2 className="text-lg sm:text-xl font-black text-black dark:text-white mt-2 mb-1">
            Welcome back
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 font-bold max-w-xs mx-auto leading-relaxed">
            Sign in to continue to <span className="font-black text-black dark:text-white uppercase">CHALAPATHI INSTITUTE OF TECHNOLOGY</span>
          </p>
        </div>

        {/* Quick Demo Switcher & Credentials Bar */}
        <div className="mb-5 p-3.5 rounded-2xl bg-neutral-50 dark:bg-neutral-800 border-2 border-black dark:border-neutral-700">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[11px] font-black text-black dark:text-white flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> Quick Demo Logins:
            </span>
            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => setActiveTab('STUDENT')}
                className={`text-[10px] font-black px-2.5 py-1 rounded-lg transition-colors border ${
                  activeTab === 'STUDENT'
                    ? 'bg-black text-white dark:bg-white dark:text-black border-black'
                    : 'text-neutral-700 dark:text-neutral-300 border-transparent hover:border-black'
                }`}
              >
                Student
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('ADMIN')}
                className={`text-[10px] font-black px-2.5 py-1 rounded-lg transition-colors border ${
                  activeTab === 'ADMIN'
                    ? 'bg-black text-white dark:bg-white dark:text-black border-black'
                    : 'text-neutral-700 dark:text-neutral-300 border-transparent hover:border-black'
                }`}
              >
                Admin
              </button>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={fillDemoStudent}
              className="flex-1 py-2 px-3 bg-white dark:bg-neutral-900 hover:bg-neutral-100 dark:hover:bg-neutral-800 border-2 border-black dark:border-white text-black dark:text-white rounded-xl text-[11px] font-black transition-all shadow-xs flex items-center justify-center gap-1"
            >
              <UserCheck className="w-3.5 h-3.5" /> Auto-Fill Student
            </button>
            <button
              type="button"
              onClick={fillDemoAdmin}
              className="flex-1 py-2 px-3 bg-white dark:bg-neutral-900 hover:bg-neutral-100 dark:hover:bg-neutral-800 border-2 border-black dark:border-white text-black dark:text-white rounded-xl text-[11px] font-black transition-all shadow-xs flex items-center justify-center gap-1"
            >
              <ShieldCheck className="w-3.5 h-3.5" /> Auto-Fill Admin
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-2xl bg-neutral-100 dark:bg-neutral-800 border-2 border-black dark:border-white text-black dark:text-white text-xs font-black">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs sm:text-sm font-black text-black dark:text-white mb-1.5">
              <span className="text-black dark:text-white mr-0.5 font-black">*</span>Username or email
            </label>
            <input
              type="text"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter username or email"
              className="w-full px-4 py-3 rounded-2xl border-2 border-black dark:border-white bg-white dark:bg-neutral-800 text-black dark:text-white text-xs sm:text-sm font-bold placeholder:text-neutral-400 outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all"
            />
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-black text-black dark:text-white mb-1.5">
              <span className="text-black dark:text-white mr-0.5 font-black">*</span>Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full px-4 py-3 pr-11 rounded-2xl border-2 border-black dark:border-white bg-white dark:bg-neutral-800 text-black dark:text-white text-xs sm:text-sm font-bold placeholder:text-neutral-400 outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-black dark:text-white hover:opacity-75 p-1"
                aria-label="Toggle Password Visibility"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 mt-2 bg-black dark:bg-white text-white dark:text-black hover:bg-neutral-800 dark:hover:bg-neutral-200 border-2 border-black font-black text-sm rounded-2xl shadow-md active:scale-[0.99] transition-all flex items-center justify-center gap-2"
          >
            {isSubmitting ? 'Signing in...' : 'Sign in'}
          </button>

          <div className="flex justify-end pt-1">
            <Link
              to="/forgot-password"
              className="text-xs sm:text-sm font-black text-black dark:text-white hover:underline"
            >
              Forgot password?
            </Link>
          </div>
        </form>

        {/* Divider */}
        <div className="relative my-5">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t-2 border-neutral-300 dark:border-neutral-700"></div>
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-white dark:bg-neutral-900 px-3 text-black dark:text-white font-black uppercase">or</span>
          </div>
        </div>

        {/* SSO Buttons */}
        <div className="space-y-3">
          <button
            type="button"
            onClick={() => handleSSOClick('Google')}
            className="w-full py-3 px-4 bg-white dark:bg-neutral-800 border-2 border-black dark:border-white text-black dark:text-white font-black text-xs sm:text-sm rounded-2xl hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors flex items-center justify-center gap-3"
          >
            <span className="w-4 h-4 rounded-full border-2 border-black dark:border-white flex items-center justify-center text-[10px] font-black">G</span>
            Sign in with Google
          </button>

          <button
            type="button"
            onClick={() => handleSSOClick('Microsoft')}
            className="w-full py-3 px-4 bg-white dark:bg-neutral-800 border-2 border-black dark:border-white text-black dark:text-white font-black text-xs sm:text-sm rounded-2xl hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors flex items-center justify-center gap-3"
          >
            <span className="w-4 h-4 border-2 border-black dark:border-white flex items-center justify-center text-[10px] font-black">M</span>
            Sign in with Microsoft
          </button>
        </div>

        {/* Footer Link */}
        <div className="mt-6 text-center text-xs text-neutral-700 dark:text-neutral-300 font-bold">
          New to SkillSprint?{' '}
          <Link to="/register" className="font-black text-black dark:text-white hover:underline">
            Create Student Account
          </Link>
        </div>
      </div>
    </div>
  );
};
