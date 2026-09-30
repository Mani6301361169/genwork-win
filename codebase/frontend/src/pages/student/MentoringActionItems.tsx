import React from 'react';
import { WinnifyEmptyState } from '../../components/common/WinnifyEmptyState';

export const MentoringActionItems: React.FC = () => {
  return (
    <div className="space-y-6 max-w-6xl mx-auto font-sans">
      
      {/* Page Title & Subtitle */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Action Items
        </h1>
        <p className="text-xs text-slate-500 font-medium text-center mt-2">
          Tasks assigned by your mentor across mentoring sessions
        </p>
      </div>

      {/* Main Container with Empty State */}
      <div className="bg-transparent rounded-3xl p-12 sm:p-20 min-h-[400px] flex items-center justify-center">
        <WinnifyEmptyState
          title="No Data Available"
          description="No action items assigned yet."
          type="cross"
        />
      </div>

    </div>
  );
};

export default MentoringActionItems;
