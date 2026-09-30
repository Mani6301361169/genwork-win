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
    <div className="min-h-screen bg-neutral-100 dark:bg-black flex flex-col items-center justify-center p-4 sm:p-6 font-sans">
      <div className="w-full max-w-[440px] bg-white dark:bg-neutral-900 rounded-3xl p-6 sm:p-10 shadow-xl border-2 border-black dark:border-white">
        
        {/* Top Key Icon Box */}
        <div className="w-14 h-14 bg-black text-white dark:bg-white dark:text-black rounded-2xl flex items-center justify-center mx-auto mb-4 border-2 border-black">
          <Key className="w-7 h-7" />
        </div>

        <h2 className="text-lg sm:text-xl font-black text-black dark:text-white text-center mb-1">
          Forgot your password?
        </h2>
        <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 text-center mb-6 leading-relaxed font-bold">
          Enter your registered email and we'll send you reset instructions.
        </p>

        {submitted ? (
          <div className="text-center py-4 space-y-4">
            <CheckCircle2 className="w-12 h-12 text-black dark:text-white mx-auto" />
            <h3 className="text-base font-black text-black dark:text-white">Instructions Sent</h3>
            <p className="text-xs sm:text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed font-bold">
              Password recovery instructions have been sent to <span className="font-black text-black dark:text-white">{email}</span>. Please check your inbox.
            </p>
            <div className="pt-2">
              <Link
                to="/login"
                className="inline-block w-full py-3.5 bg-black text-white dark:bg-white dark:text-black font-black text-sm rounded-2xl shadow-md border-2 border-black transition-all"
              >
                Back to sign in
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs sm:text-sm font-black text-black dark:text-white mb-1.5">
                <span className="text-black dark:text-white mr-0.5 font-black">*</span>Email address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@institution.edu"
                className="w-full px-4 py-3 rounded-2xl border-2 border-black dark:border-white bg-white dark:bg-neutral-800 text-black dark:text-white text-xs sm:text-sm font-bold placeholder:text-neutral-400 outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all"
              />
            </div>

            {/* reCAPTCHA Mock Container */}
            <div className="border-2 border-black dark:border-white bg-neutral-50 dark:bg-neutral-800 p-3.5 rounded-2xl flex items-center justify-between my-4">
              <label className="flex items-center gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isCaptchaChecked}
                  onChange={(e) => setIsCaptchaChecked(e.target.checked)}
                  className="w-5 h-5 rounded border-2 border-black text-black focus:ring-black cursor-pointer"
                />
                <span className="text-xs sm:text-sm font-black text-black dark:text-white">
                  I'm not a robot
                </span>
              </label>
              <div className="flex flex-col items-center justify-center">
                <span className="text-xs font-black text-black dark:text-white">✔</span>
                <span className="text-[9px] text-black dark:text-white font-black mt-0.5">reCAPTCHA</span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-black text-white dark:bg-white dark:text-black hover:bg-neutral-800 dark:hover:bg-neutral-200 border-2 border-black font-black text-sm rounded-2xl shadow-md transition-all flex items-center justify-center"
            >
              Send reset instructions
            </button>

            <div className="text-center pt-2">
              <Link
                to="/login"
                className="text-xs sm:text-sm font-black text-black dark:text-white hover:underline inline-block"
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
