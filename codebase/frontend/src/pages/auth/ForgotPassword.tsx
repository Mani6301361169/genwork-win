import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Key, CheckCircle2 } from 'lucide-react';

export const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isCaptchaChecked, setIsCaptchaChecked] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isCaptchaChecked) {
      alert('Please complete the reCAPTCHA checkbox.');
      return;
    }
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#ECE8FF] via-[#F4F1FF] to-[#E4DDFF] flex flex-col items-center justify-center p-4 sm:p-6 font-sans">
      <div className="w-full max-w-[440px] bg-white rounded-[32px] p-6 sm:p-10 shadow-[0_20px_50px_rgba(99,91,255,0.12)] border border-purple-100/60">
        
        {/* Top Key Icon Box */}
        <div className="w-14 h-14 bg-[#F0EEFF] rounded-2xl flex items-center justify-center mx-auto mb-4 text-[#635BFF]">
          <Key className="w-7 h-7" />
        </div>

        <h2 className="text-lg sm:text-xl font-bold text-gray-900 text-center mb-1">
          Forgot your password?
        </h2>
        <p className="text-xs sm:text-sm text-gray-500 text-center mb-6 leading-relaxed">
          Enter your registered email and we'll send you reset instructions.
        </p>

        {submitted ? (
          <div className="text-center py-4 space-y-4">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
            <h3 className="text-base font-bold text-gray-900">Instructions Sent</h3>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              Password recovery instructions have been sent to <span className="font-bold text-gray-900">{email}</span>. Please check your inbox.
            </p>
            <div className="pt-2">
              <Link
                to="/login"
                className="inline-block w-full py-3.5 bg-[#635BFF] hover:bg-[#5349EE] text-white font-bold text-sm rounded-2xl shadow-md transition-all"
              >
                Back to sign in
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs sm:text-sm font-bold text-gray-900 mb-1.5">
                <span className="text-red-500 mr-0.5 font-bold">*</span>Email address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@institution.edu"
                className="w-full px-4 py-3 rounded-2xl border border-indigo-200 focus:border-[#635BFF] focus:ring-4 focus:ring-indigo-100 bg-white text-gray-900 text-xs sm:text-sm font-medium placeholder:text-gray-400 outline-none transition-all"
              />
            </div>

            {/* reCAPTCHA Mock Container */}
            <div className="border border-gray-200 bg-[#F9FAFB] p-3.5 rounded-2xl flex items-center justify-between my-4">
              <label className="flex items-center gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isCaptchaChecked}
                  onChange={(e) => setIsCaptchaChecked(e.target.checked)}
                  className="w-5 h-5 rounded border-gray-300 text-[#635BFF] focus:ring-[#635BFF] cursor-pointer"
                />
                <span className="text-xs sm:text-sm font-medium text-gray-700">
                  I'm not a robot
                </span>
              </label>
              <div className="flex flex-col items-center justify-center">
                <svg className="w-6 h-6 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2A10 10 0 0 0 2 12a10 10 0 0 0 10 10 10 10 0 0 0 10-10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
                </svg>
                <span className="text-[9px] text-gray-400 font-semibold mt-0.5">reCAPTCHA</span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-[#635BFF] hover:bg-[#5349EE] active:scale-[0.99] text-white font-bold text-sm rounded-2xl shadow-md shadow-indigo-200 transition-all flex items-center justify-center"
            >
              Send reset instructions
            </button>

            <div className="text-center pt-2">
              <Link
                to="/login"
                className="text-xs sm:text-sm font-semibold text-[#635BFF] hover:underline inline-block"
              >
                Back to sign in
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
