import React from 'react';
import { Shield } from 'lucide-react';
import { cn } from '../../../lib/cn';

export function DetailSecurityPanel({ vaultLocked }: { vaultLocked: boolean }) {
  return (
    <div className="bg-white dark:bg-white/5 rounded-3xl p-6 border border-gray-100 dark:border-white/5 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h4 className="font-bold">Security & Protection</h4>
        <Shield size={18} className="text-emerald-500" />
      </div>
      <div className="space-y-4 text-sm">
        {[
          ['Insurance Status', 'Active'],
          ['Escrow Required', 'Yes'],
          ['Authentication', 'Verified'],
          ['Vault Access', vaultLocked ? 'Locked' : 'Open'],
        ].map(([label, value]) => (
          <div key={label} className="flex items-center justify-between">
            <span className="text-gray-400">{label}</span>
            <span className={cn('font-bold', value === 'Active' || value === 'Verified' ? 'text-emerald-500' : '')}>{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

