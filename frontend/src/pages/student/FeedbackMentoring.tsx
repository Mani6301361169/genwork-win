import React, { useState } from 'react';
import { apiFetch } from '../../services/api';
import { MessageSquare, Users, Send, CheckCircle2 } from 'lucide-react';

export const FeedbackMentoring: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'FEEDBACK' | 'MENTORING'>('FEEDBACK');
  const [category, setCategory] = useState('Platform');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [rating, setRating] = useState(5);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await apiFetch('/analytics/feedback', {
        method: 'POST',
        body: JSON.stringify({ category, subject, message, rating }),
      });
      setIsSubmitted(true);
      setSubject('');
      setMessage('');
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
          <MessageSquare className="w-6 h-6 text-brand-500" /> Feedback & Mentoring
        </h1>
        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
          Submit platform feedback or request one-on-one placement mentoring from college faculty.
        </p>
      </div>

      <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-soft">
        
        {/* Toggle Tabs */}
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl mb-6">
          <button
            onClick={() => { setActiveTab('FEEDBACK'); setIsSubmitted(false); }}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'FEEDBACK'
                ? 'bg-white dark:bg-navy-900 text-brand-600 dark:text-brand-400 shadow-xs'
                : 'text-slate-500'
            }`}
          >
            <MessageSquare className="w-4 h-4" /> Platform Feedback
          </button>
          <button
            onClick={() => { setActiveTab('MENTORING'); setIsSubmitted(false); }}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'MENTORING'
                ? 'bg-white dark:bg-navy-900 text-accent-600 dark:text-accent-400 shadow-xs'
                : 'text-slate-500'
            }`}
          >
            <Users className="w-4 h-4" /> Faculty Mentoring Request
          </button>
        </div>

        {isSubmitted ? (
          <div className="text-center py-8">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Submission Received!</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              Thank you! Our placement mentors will review your submission shortly.
            </p>
            <button
              onClick={() => setIsSubmitted(false)}
              className="mt-6 px-6 py-2.5 bg-brand-600 text-white rounded-xl text-xs font-bold"
            >
              Submit Another Inquiry
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold"
              >
                <option value="Platform">Platform & Features</option>
                <option value="Content">Speaking Content & Topics</option>
                <option value="Mentoring">1-on-1 Faculty Mentoring</option>
                <option value="Placement">Placement Guidance</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Subject
              </label>
              <input
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder={activeTab === 'FEEDBACK' ? 'e.g. Speech recognition feedback' : 'e.g. Request mock interview with faculty'}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Message & Details
              </label>
              <textarea
                rows={4}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Describe your inquiry or feedback in detail..."
                className="w-full p-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-gradient-to-r from-brand-600 to-accent-600 hover:from-brand-700 hover:to-accent-700 text-white rounded-xl font-bold text-xs shadow-soft flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" /> {isSubmitting ? 'Submitting...' : 'Submit Request'}
            </button>
          </form>
        )}

      </div>
    </div>
  );
};
