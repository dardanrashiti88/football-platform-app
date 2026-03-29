import React, { useMemo, useState } from 'react';
import { FileText, Play, RefreshCw } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../../lib/cn';

type ReportsViewProps = {
  isDarkMode: boolean;
};

type Report = {
  id: string;
  name: string;
  description: string;
  status: 'Ready' | 'Running' | 'Needs Data';
  frequency: string;
  lastRun: string;
};

const reports: Report[] = [
  { id: 'rp-1', name: 'Top Cards Weekly', description: 'Snapshot of top 50 cards by market value.', status: 'Ready', frequency: 'Weekly', lastRun: 'Today' },
  { id: 'rp-2', name: 'Inventory Health', description: 'Rarity and value distribution of your inventory.', status: 'Ready', frequency: 'Daily', lastRun: 'Yesterday' },
  { id: 'rp-3', name: 'Market Volatility', description: 'Measures price swings for top assets over time.', status: 'Running', frequency: 'Hourly', lastRun: 'Just now' },
  { id: 'rp-4', name: 'Watchlist Alerts', description: 'All watchlist spikes, dips, and triggers.', status: 'Needs Data', frequency: 'Realtime', lastRun: '—' },
];

export function ReportsView({ isDarkMode }: ReportsViewProps) {
  const panelBg = isDarkMode ? 'bg-white/5' : 'bg-white';
  const panelBorder = isDarkMode ? 'border-white/10' : 'border-gray-100';
  const muted = isDarkMode ? 'text-gray-400' : 'text-gray-500';

  const [selectedId, setSelectedId] = useState(reports[0]?.id ?? '');
  const selected = useMemo(() => reports.find((r) => r.id === selectedId) ?? reports[0], [selectedId]);

  const statusColor = (status: Report['status']) => {
    if (status === 'Ready') return 'text-emerald-400';
    if (status === 'Running') return 'text-orange-400';
    return 'text-gray-400';
  };

  return (
    <div className="p-8 flex flex-col gap-8">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Reports</h2>
          <p className={cn('text-sm', muted)}>Generate and download analytics reports.</p>
        </div>
        <motion.button whileTap={{ scale: 0.98 }} type="button" className="px-5 py-3 rounded-2xl bg-orange-500 text-white text-sm font-black hover:bg-orange-600 transition flex items-center gap-2">
          <RefreshCw size={18} />
          Refresh
        </motion.button>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className={cn('col-span-12 lg:col-span-5 rounded-3xl border overflow-hidden', panelBorder, panelBg)}>
          <div className={cn('px-6 py-4 border-b flex items-center justify-between', panelBorder)}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-500">
                <FileText size={18} />
              </div>
              <div>
                <div className="text-sm font-bold">Available Reports</div>
                <div className={cn('text-[10px] uppercase tracking-widest', muted)}>{reports.length} templates</div>
              </div>
            </div>
          </div>
          <div className="divide-y divide-white/5">
            {reports.map((report) => (
              <button
                key={report.id}
                type="button"
                onClick={() => setSelectedId(report.id)}
                className={cn('w-full text-left px-6 py-4 hover:bg-white/5 transition', selectedId === report.id && 'bg-white/5')}
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <div className="text-sm font-bold truncate">{report.name}</div>
                    <div className={cn('text-[10px] uppercase tracking-widest truncate', muted)}>{report.frequency}</div>
                  </div>
                  <div className={cn('text-[10px] font-bold uppercase tracking-widest', statusColor(report.status))}>{report.status}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className={cn('col-span-12 lg:col-span-7 rounded-3xl border p-6', panelBorder, panelBg)}>
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <div className="text-lg font-bold">{selected.name}</div>
              <p className={cn('text-sm mt-1', muted)}>{selected.description}</p>
            </div>
            <div className={cn('text-[10px] uppercase tracking-widest', muted)}>Last run: {selected.lastRun}</div>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className={cn('rounded-2xl border p-4', panelBorder, panelBg)}>
              <div className={cn('text-[10px] uppercase tracking-widest', muted)}>Category</div>
              <div className="text-sm font-bold mt-1">Market Intelligence</div>
            </div>
            <div className={cn('rounded-2xl border p-4', panelBorder, panelBg)}>
              <div className={cn('text-[10px] uppercase tracking-widest', muted)}>Format</div>
              <div className="text-sm font-bold mt-1">PDF + CSV</div>
            </div>
            <div className={cn('rounded-2xl border p-4', panelBorder, panelBg)}>
              <div className={cn('text-[10px] uppercase tracking-widest', muted)}>Owner</div>
              <div className="text-sm font-bold mt-1">You</div>
            </div>
            <div className={cn('rounded-2xl border p-4', panelBorder, panelBg)}>
              <div className={cn('text-[10px] uppercase tracking-widest', muted)}>Access</div>
              <div className="text-sm font-bold mt-1">Private</div>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <motion.button whileTap={{ scale: 0.98 }} type="button" className="px-5 py-3 rounded-2xl bg-orange-500 text-white text-sm font-black hover:bg-orange-600 transition flex items-center gap-2">
              <Play size={18} />
              Run Report
            </motion.button>
            <button type="button" className={cn('px-5 py-3 rounded-2xl border text-sm font-black', panelBorder, panelBg, muted)}>
              Download Latest
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

