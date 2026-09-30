import React, { useState } from 'react';
import { apiFetch } from '../../services/api';
import { Megaphone, Send, CheckCircle2 } from 'lucide-react';

export const AdminAnnouncements: React.FC = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isImportant, setIsImportant] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiFetch('/admin/announcements', {
        method: 'POST',
        body: JSON.stringify({ title, content, isImportant }),
      });
      setIsSubmitted(true);
      setTitle('');
      setContent('');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
          <Megaphone className="w-6 h-6 text-brand-500" /> Campus Announcements
        </h1>
        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
          Publish broadcast announcements to all registered students.
        </p>
      </div>

      <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-soft">
        {isSubmitted && (
          <div className="mb-6 p-3 rounded-xl bg-emerald-50 text-emerald-600 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" /> Announcement Published Successfully!
          </div>
        )}

        <form onSubmit={handlePublish} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Placement Drive Schedule 2026"
              className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-semibold"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Announcement Body</label>
            <textarea
              rows={4}
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Details regarding upcoming campus interviews..."
              className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-semibold"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="important"
              checked={isImportant}
              onChange={(e) => setIsImportant(e.target.checked)}
              className="rounded text-brand-600 focus:ring-brand-500"
            />
            <label htmlFor="important" className="font-bold text-slate-700 dark:text-slate-300">
              Mark as High Priority / Important
            </label>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2"
          >
            <Send className="w-4 h-4" /> Broadcast Announcement
          </button>
        </form>
      </div>
    </div>
  );
};
