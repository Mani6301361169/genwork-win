import React from 'react';

interface WinnifyEmptyStateProps {
  title: string;
  description: string;
  type?: 'plus' | 'cross';
}

export const WinnifyEmptyIllustration: React.FC<{ type?: 'plus' | 'cross' }> = ({ type = 'plus' }) => (
  <div className="relative w-28 h-24 mx-auto mb-4 flex items-center justify-center select-none">
    {/* Soft light purple backdrop circle */}
    <div className="absolute w-20 h-20 bg-indigo-100/70 rounded-full top-1 left-2 backdrop-blur-xs" />
    
    {/* Main floating card window */}
    <div className="relative z-10 w-24 h-16 bg-white rounded-2xl shadow-md border border-indigo-100/80 flex flex-col overflow-hidden">
      {/* Header bar */}
      <div className="h-6 bg-gradient-to-r from-indigo-400 to-purple-500 flex items-center px-2.5 gap-1">
        <div className="w-1.5 h-1.5 rounded-full bg-white/70" />
        <div className="w-1.5 h-1.5 rounded-full bg-white/70" />
        <div className="w-1.5 h-1.5 rounded-full bg-white/70" />
      </div>
      {/* Skeleton content lines */}
      <div className="p-2 space-y-1.5">
        <div className="w-10 h-1.5 bg-slate-200 rounded-full" />
        <div className="w-14 h-1.5 bg-slate-100 rounded-full" />
      </div>
    </div>

    {/* Floating Badge overlay (+ or x) */}
    <div className="absolute bottom-1 right-2 z-20 w-8 h-8 rounded-full bg-[#5341bc] text-white flex items-center justify-center shadow-lg border-2 border-white font-extrabold text-sm">
      {type === 'plus' ? '+' : '✕'}
    </div>
  </div>
);

export const WinnifyEmptyState: React.FC<WinnifyEmptyStateProps> = ({ title, description, type = 'plus' }) => {
  return (
    <div className="py-12 px-6 text-center max-w-md mx-auto">
      <WinnifyEmptyIllustration type={type} />
      <h3 className="text-sm font-extrabold text-slate-900 tracking-tight mb-1">{title}</h3>
      <p className="text-xs text-slate-500 font-medium leading-relaxed">{description}</p>
    </div>
  );
};
