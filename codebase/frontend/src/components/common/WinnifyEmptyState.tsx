import React from 'react';

interface WinnifyEmptyStateProps {
  title: string;
  description: string;
  type?: 'plus' | 'cross';
}

export const WinnifyEmptyIllustration: React.FC<{ type?: 'plus' | 'cross' }> = ({ type = 'plus' }) => (
  <div className="relative w-28 h-24 mx-auto mb-4 flex items-center justify-center select-none">
    {/* Soft backdrop circle */}
    <div className="absolute w-20 h-20 bg-neutral-200 dark:bg-neutral-800 rounded-full top-1 left-2" />
    
    {/* Main floating card window */}
    <div className="relative z-10 w-24 h-16 bg-white dark:bg-neutral-900 rounded-2xl shadow-md border-2 border-black dark:border-white flex flex-col overflow-hidden">
      {/* Header bar */}
      <div className="h-6 bg-black dark:bg-white flex items-center px-2.5 gap-1">
        <div className="w-1.5 h-1.5 rounded-full bg-white dark:bg-black" />
        <div className="w-1.5 h-1.5 rounded-full bg-white dark:bg-black" />
        <div className="w-1.5 h-1.5 rounded-full bg-white dark:bg-black" />
      </div>
      {/* Skeleton content lines */}
      <div className="p-2 space-y-1.5">
        <div className="w-10 h-1.5 bg-neutral-300 dark:bg-neutral-700 rounded-full" />
        <div className="w-14 h-1.5 bg-neutral-200 dark:bg-neutral-800 rounded-full" />
      </div>
    </div>

    {/* Floating Badge overlay (+ or x) */}
    <div className="absolute bottom-1 right-2 z-20 w-8 h-8 rounded-full bg-black text-white dark:bg-white dark:text-black flex items-center justify-center shadow-lg border-2 border-white dark:border-black font-black text-sm">
      {type === 'plus' ? '+' : '✕'}
    </div>
  </div>
);

export const WinnifyEmptyState: React.FC<WinnifyEmptyStateProps> = ({ title, description, type = 'plus' }) => {
  return (
    <div className="py-12 px-6 text-center max-w-md mx-auto">
      <WinnifyEmptyIllustration type={type} />
      <h3 className="text-sm font-black text-black dark:text-white tracking-tight mb-1">{title}</h3>
      <p className="text-xs text-neutral-600 dark:text-neutral-400 font-bold leading-relaxed">{description}</p>
    </div>
  );
};
