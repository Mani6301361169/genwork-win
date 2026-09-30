import React from 'react';
import { MessageSquare, X, Plus } from 'lucide-react';

export const FeedbackMentoring: React.FC = () => {
  return (
    <div className="space-y-6 max-w-5xl mx-auto font-sans text-slate-900 pb-16">
      
      {/* HEADER TITLE & SUBTITLE */}
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Comments
        </h1>
        <p className="text-xs font-bold text-slate-500">
          Feedback from your teachers and admins
        </p>
      </div>

      {/* EMPTY COMMENTS CONTAINER */}
      <div className="bg-white rounded-3xl p-8 sm:p-16 shadow-sm border border-slate-100 min-h-[450px] flex flex-col items-center justify-center text-center space-y-4">
        
        {/* Lavender Graphic Icon */}
        <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-indigo-50 border border-indigo-100">
          <MessageSquare className="w-10 h-10 text-indigo-500" />
          <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-slate-700 text-white flex items-center justify-center shadow-md">
            <X className="w-4 h-4" />
          </div>
        </div>

        {/* Text */}
        <div className="space-y-1.5 max-w-sm">
          <h3 className="text-base font-black text-slate-900">
            No comments yet
          </h3>
          <p className="text-xs font-medium text-slate-500 leading-relaxed">
            Feedback from your teachers and admins will appear here.
          </p>
        </div>

      </div>

    </div>
  );
};
