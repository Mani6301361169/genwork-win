import React from 'react';
import { Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

interface EmptyStateProps {
  title: string;
  description: string;
  actionText?: string;
  actionPath?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionText = 'Start Practicing',
  actionPath = '/student/challenges',
}) => {
  return (
    <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 sm:p-12 text-center max-w-md mx-auto my-6 shadow-soft">
      <div className="w-14 h-14 rounded-2xl bg-brand-50 dark:bg-brand-950/40 text-brand-600 dark:text-brand-400 flex items-center justify-center mx-auto mb-4">
        <Sparkles className="w-7 h-7" />
      </div>
      <h3 className="text-lg font-extrabold text-slate-900 dark:text-white mb-2">{title}</h3>
      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-6">{description}</p>
      {actionPath && (
        <Link
          to={actionPath}
          className="inline-flex items-center gap-2 px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-2xl font-bold text-xs shadow-soft transition-all"
        >
          {actionText}
        </Link>
      )}
    </div>
  );
};
