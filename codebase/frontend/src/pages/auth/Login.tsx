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
    <div className="min-h-screen bg-gradient-to-br from-[#ECE8FF] via-[#F4F1FF] to-[#E4DDFF] flex flex-col items-center justify-center p-4 sm:p-6 font-sans">
      <div className="w-full max-w-[440px] bg-white rounded-[32px] p-6 sm:p-10 shadow-[0_20px_50px_rgba(99,91,255,0.12)] border border-purple-100/60">
        
        {/* Brand Header */}
        <div className="text-center mb-6">
          <h1 className="font-black text-3xl sm:text-4xl text-[#F59E0B] tracking-wider uppercase drop-shadow-[0_2px_0px_rgba(217,119,6,0.8)] inline-block">
            WINNIFY
          </h1>
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mt-2 mb-1">
            Welcome back
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 font-medium max-w-xs mx-auto leading-relaxed">
            Sign in to continue to <span className="font-extrabold text-gray-900 uppercase">CHALAPATHI INSTITUTE OF TECHNOLOGY</span>
          </p>
        </div>

        {/* Quick Demo Switcher & Credentials Bar */}
        <div className="mb-5 p-3 rounded-2xl bg-indigo-50/60 border border-indigo-100">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[11px] font-bold text-indigo-900 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" /> Quick Demo Logins:
            </span>
            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => setActiveTab('STUDENT')}
                className={`text-[10px] font-bold px-2 py-0.5 rounded-lg transition-colors ${
                  activeTab === 'STUDENT' ? 'bg-[#635BFF] text-white' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Student
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('ADMIN')}
                className={`text-[10px] font-bold px-2 py-0.5 rounded-lg transition-colors ${
                  activeTab === 'ADMIN' ? 'bg-[#635BFF] text-white' : 'text-gray-600 hover:text-gray-900'
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
              className="flex-1 py-1.5 px-2.5 bg-white hover:bg-indigo-50 border border-indigo-200 text-indigo-950 rounded-xl text-[11px] font-bold transition-all shadow-xs flex items-center justify-center gap-1"
            >
              <UserCheck className="w-3 h-3 text-indigo-600" /> Auto-Fill Student
            </button>
            <button
              type="button"
              onClick={fillDemoAdmin}
              className="flex-1 py-1.5 px-2.5 bg-white hover:bg-indigo-50 border border-indigo-200 text-indigo-950 rounded-xl text-[11px] font-bold transition-all shadow-xs flex items-center justify-center gap-1"
            >
              <ShieldCheck className="w-3 h-3 text-indigo-600" /> Auto-Fill Admin
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs sm:text-sm font-bold text-gray-900 mb-1.5">
              <span className="text-red-500 mr-0.5 font-bold">*</span>Username or email
            </label>
            <input
              type="text"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter username or email"
              className="w-full px-4 py-3 rounded-2xl border border-indigo-200 focus:border-[#635BFF] focus:ring-4 focus:ring-indigo-100 bg-white text-gray-900 text-xs sm:text-sm font-medium placeholder:text-gray-400 outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-bold text-gray-900 mb-1.5">
              <span className="text-red-500 mr-0.5 font-bold">*</span>Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full px-4 py-3 pr-11 rounded-2xl border border-indigo-200 focus:border-[#635BFF] focus:ring-4 focus:ring-indigo-100 bg-white text-gray-900 text-xs sm:text-sm font-medium placeholder:text-gray-400 outline-none transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                aria-label="Toggle Password Visibility"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 mt-2 bg-[#635BFF] hover:bg-[#5349EE] active:scale-[0.99] text-white font-bold text-sm rounded-2xl shadow-md shadow-indigo-200 transition-all flex items-center justify-center gap-2"
          >
            {isSubmitting ? 'Signing in...' : 'Sign in'}
          </button>

          <div className="flex justify-end pt-1">
            <Link
              to="/forgot-password"
              className="text-xs sm:text-sm font-semibold text-[#635BFF] hover:underline"
            >
              Forgot password?
            </Link>
          </div>
        </form>

        {/* Divider */}
        <div className="relative my-5">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-white px-3 text-gray-400 font-medium">or</span>
          </div>
        </div>

        {/* SSO Buttons */}
        <div className="space-y-3">
          <button
            type="button"
            onClick={() => handleSSOClick('Google')}
            className="w-full py-3 px-4 bg-[#F2F3F6] hover:bg-gray-200 text-gray-800 font-semibold text-xs sm:text-sm rounded-2xl transition-colors flex items-center justify-center gap-3"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            Sign in with Google
          </button>

          <button
            type="button"
            onClick={() => handleSSOClick('Microsoft')}
            className="w-full py-3 px-4 bg-[#F2F3F6] hover:bg-gray-200 text-gray-800 font-semibold text-xs sm:text-sm rounded-2xl transition-colors flex items-center justify-center gap-3"
          >
            <svg className="w-4 h-4" viewBox="0 0 23 23">
              <path fill="#f35325" d="M1 1h10v10H1z"/>
              <path fill="#81bc06" d="M12 1h10v10H12z"/>
              <path fill="#05a6f0" d="M1 12h10v10H1z"/>
              <path fill="#ffba08" d="M12 12h10v10H12z"/>
            </svg>
            Sign in with Microsoft
          </button>
        </div>

        {/* Footer Link */}
        <div className="mt-6 text-center text-xs text-gray-500">
          New to SkillSprint?{' '}
          <Link to="/register" className="font-bold text-[#635BFF] hover:underline">
            Create Student Account
          </Link>
        </div>
      </div>
    </div>
  );
};
