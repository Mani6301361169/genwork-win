import React, { useState } from 'react';
import { apiFetch } from '../../services/api';
import { Trophy, Plus, Trash2, CheckCircle2 } from 'lucide-react';

export const AdminChallenges: React.FC = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Technology');
  const [difficulty, setDifficulty] = useState('Intermediate');
  const [durationSeconds, setDurationSeconds] = useState(60);
  const [isCreated, setIsCreated] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await apiFetch('/admin/challenges', {
        method: 'POST',
        body: JSON.stringify({ title, description, category, difficulty, durationSeconds }),
      });
      setIsCreated(true);
      setTitle('');
      setDescription('');
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
          <Trophy className="w-6 h-6 text-brand-500" /> Manage Challenges
        </h1>
        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
          Create new speaking prompts and campus placement challenges for students.
        </p>
      </div>

      <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-soft">
        
        {isCreated && (
          <div className="mb-6 p-3 rounded-xl bg-emerald-50 text-emerald-600 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" /> New Challenge Created Successfully! Appears live on student dashboard.
          </div>
        )}

        <form onSubmit={handleCreate} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Challenge Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Explain Microservices vs Monolithic Architecture"
              className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-semibold"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Category *</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-semibold"
            >
              <option value="Technology">Technology</option>
              <option value="Opinion">Opinion</option>
              <option value="Career">Career</option>
              <option value="Leadership">Leadership</option>
              <option value="Education">Education</option>
              <option value="Communication">Communication</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Difficulty</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-semibold"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Duration (Seconds)</label>
              <input
                type="number"
                value={durationSeconds}
                onChange={(e) => setDurationSeconds(parseInt(e.target.value, 10))}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-semibold"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Question Prompt & Description *</label>
            <textarea
              rows={3}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide clear speaking instructions for students..."
              className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-semibold"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" /> {isSubmitting ? 'Creating...' : 'Publish Challenge'}
          </button>
        </form>

      </div>
    </div>
  );
};
