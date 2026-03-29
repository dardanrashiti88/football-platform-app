import React from 'react';
import { Database, Globe, Lock, PlugZap } from 'lucide-react';
import { cn } from '../../lib/cn';

type DataSourcesViewProps = {
  isDarkMode: boolean;
};

const sources = [
  { id: 's1', name: 'FODR Inventory API', type: 'Internal', status: 'Connected', icon: PlugZap, detail: 'localhost:3002/api' },
  { id: 's2', name: 'Market Pricing Engine', type: 'Internal', status: 'Connected', icon: Database, detail: 'Simulated pricing curves' },
  { id: 's3', name: 'Community Signals', type: 'External', status: 'Limited', icon: Globe, detail: 'Social + marketplace sentiment' },
  { id: 's4', name: 'Vault Verification', type: 'Security', status: 'Verified', icon: Lock, detail: 'Ownership & authenticity records' },
];

export function DataSourcesView({ isDarkMode }: DataSourcesViewProps) {
  const panelBg = isDarkMode ? 'bg-white/5' : 'bg-white';
  const panelBorder = isDarkMode ? 'border-white/10' : 'border-gray-100';
  const muted = isDarkMode ? 'text-gray-400' : 'text-gray-500';

  const statusChip = (status: string) => {
    const s = status.toLowerCase();
    if (s.includes('connect')) return 'bg-emerald-500/20 text-emerald-300';
    if (s.includes('verify')) return 'bg-blue-500/20 text-blue-300';
    return 'bg-orange-500/20 text-orange-300';
  };

  return (
    <div className="p-8 flex flex-col gap-8">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Data Sources</h2>
          <p className={cn('text-sm', muted)}>Connections powering your dashboard.</p>
        </div>
        <div className={cn('px-4 py-2 rounded-2xl border text-[10px] font-bold uppercase tracking-widest', panelBg, panelBorder, muted)}>
          {sources.length} sources
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {sources.map((source) => {
          const Icon = source.icon;
          return (
            <div key={source.id} className={cn('rounded-3xl border p-6', panelBorder, panelBg)}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-500">
                    <Icon size={18} />
                  </div>
                  <div>
                    <div className="text-sm font-bold">{source.name}</div>
                    <div className={cn('text-[10px] uppercase tracking-widest', muted)}>{source.type}</div>
                  </div>
                </div>
                <span className={cn('px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest', statusChip(source.status))}>{source.status}</span>
              </div>
              <div className={cn('mt-4 rounded-2xl border p-4 text-sm', panelBorder, panelBg, muted)}>{source.detail}</div>
              <div className="mt-4 flex flex-wrap gap-2">
                <button type="button" className="px-4 py-2 rounded-2xl bg-orange-500 text-white text-[11px] font-black uppercase tracking-widest hover:bg-orange-600 transition">
                  Test
                </button>
                <button type="button" className={cn('px-4 py-2 rounded-2xl border text-[11px] font-black uppercase tracking-widest', panelBorder, panelBg, muted)}>
                  Configure
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

