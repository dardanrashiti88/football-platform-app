import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { cn } from '../../../lib/cn';

type OverviewPanelProps = {
  isDarkMode: boolean;
  detailRange: '1D' | '1W' | '1M' | '1Y' | 'ALL';
  onRangeChange: (range: '1D' | '1W' | '1M' | '1Y' | 'ALL') => void;
  trendData: Array<{ name: string; value: number }>;
  history: any[];
};

export function DetailOverviewPanel({ isDarkMode, detailRange, onRangeChange, trendData, history }: OverviewPanelProps) {
  return (
    <>
      <div className="bg-white dark:bg-white/5 rounded-3xl p-6 border border-gray-100 dark:border-white/5 shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <h4 className="font-bold">Value Appreciation Trend</h4>
          <div className="flex gap-2">
            {(['1D', '1W', '1M', '1Y', 'ALL'] as const).map((p) => (
              <button
                key={p}
                onClick={() => onRangeChange(p)}
                className={cn(
                  'px-3 py-1 rounded-lg text-[10px] font-bold transition-colors',
                  p === detailRange ? 'bg-orange-500 text-white' : 'bg-gray-100 dark:bg-white/5 text-gray-500 hover:bg-gray-200 dark:hover:bg-white/10'
                )}
                type="button"
              >
                {p}
              </button>
            ))}
          </div>
        </div>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendData}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={true} stroke={isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'} />
              <XAxis dataKey="name" axisLine={true} tickLine={true} tick={{ fontSize: 10, fill: '#888' }} />
              <YAxis axisLine={true} tickLine={true} tick={{ fontSize: 10, fill: '#888' }} />
              <Tooltip contentStyle={{ backgroundColor: '#111', border: 'none', borderRadius: '12px', color: '#fff' }} itemStyle={{ color: '#f97316' }} />
              <Area type="monotone" dataKey="value" stroke="#f97316" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white dark:bg-white/5 rounded-3xl p-6 border border-gray-100 dark:border-white/5 shadow-sm">
        <h4 className="font-bold mb-6">Ownership & Transaction History</h4>
        <div className="flex flex-col gap-4">
          {history.map((entry: any, i: number) => (
            <div key={i} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-white/5 rounded-2xl hover:bg-gray-100 dark:hover:bg-white/10 transition-colors group">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <img src={entry.avatar} alt={entry.user} className="w-10 h-10 rounded-full border-2 border-white dark:border-white/10" referrerPolicy="no-referrer" />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white dark:border-[#1a1a1a] flex items-center justify-center">
                    <CheckCircle2 size={10} className="text-white" />
                  </div>
                </div>
                <div>
                  <div className="text-sm font-bold group-hover:text-orange-500 transition-colors">{entry.user}</div>
                  <div className="text-[10px] text-gray-400">
                    {entry.action} • {entry.date}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold">{entry.price}</div>
                <div className="text-[10px] text-emerald-500 font-bold">Verified Transaction</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

