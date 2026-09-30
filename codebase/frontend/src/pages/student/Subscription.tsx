import React from 'react';
import { WinnifyEmptyState } from '../../components/common/WinnifyEmptyState';

export const Subscription: React.FC = () => {
  return (
    <div className="space-y-6 max-w-6xl mx-auto font-sans">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Subscription
        </h1>
        <p className="text-xs text-slate-500 font-medium mt-1">
          Your Winnify subscription & receipt
        </p>
      </div>

      {/* Main Empty State Container */}
      <div className="bg-transparent rounded-3xl p-12 sm:p-20 min-h-[400px] flex items-center justify-center">
        <WinnifyEmptyState
          title="No payment required"
          description="Your institution has not enabled the Winnify fee."
          type="cross"
        />
      </div>

    </div>
  );
};

export default Subscription;
