import React from 'react';

export const SkeletonLoader: React.FC<{ count?: number }> = ({ count = 3 }) => {
  return (
    <div className="space-y-4 w-full animate-pulse">
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="p-6 rounded-3xl bg-slate-200/60 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 h-28 w-full"
        />
      ))}
    </div>
  );
};
