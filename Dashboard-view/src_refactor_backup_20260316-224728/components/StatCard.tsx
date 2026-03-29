import React from 'react';
import { cn } from '../lib/cn';

type StatCardProps = {
  label: string;
  value: React.ReactNode;
  change?: React.ReactNode;
  isPositive?: boolean;
};

export function StatCard({ label, value, change, isPositive = true }: StatCardProps) {
  const points = isPositive ? '0,20 10,15 20,18 30,10 40,12 50,5' : '0,5 10,12 20,10 30,18 40,15 50,20';

  return (
    <div className="bg-white dark:bg-white/5 rounded-2xl p-4 flex flex-col gap-1 shadow-sm border border-gray-100 dark:border-white/5 transition-all duration-300 relative overflow-hidden group">
      <div className="flex justify-between items-start">
        <span className="text-gray-500 dark:text-gray-400 text-[11px] font-medium uppercase tracking-wider">{label}</span>
        <div className="opacity-40 group-hover:opacity-100 transition-opacity">
          <svg width="40" height="20" viewBox="0 0 50 25" className={isPositive ? 'text-emerald-500' : 'text-red-500'}>
            <polyline fill="none" stroke="currentColor" strokeWidth="3" points={points} />
          </svg>
        </div>
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-xl font-bold text-gray-900 dark:text-white">{value}</span>
        {change != null && (
          <span className={cn('text-[11px] font-bold', isPositive ? 'text-emerald-500' : 'text-red-500')}>{change}</span>
        )}
      </div>
    </div>
  );
}

