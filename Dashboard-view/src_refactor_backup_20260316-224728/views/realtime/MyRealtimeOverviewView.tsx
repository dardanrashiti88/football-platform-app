import React, { useMemo, useState } from 'react';
import { Activity, ArrowUpRight, Wallet } from 'lucide-react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { motion } from 'motion/react';
import { cn } from '../../lib/cn';
import { extractCardValue, normalizeCardImage } from '../../lib/cards';
import { formatMoney } from '../../lib/money';
import { buildTrendData, buildTrendSeries, rangeLabels } from '../../lib/trends';
import type { DashboardCard } from '../../types';
import { StatCard } from '../../components/StatCard';

type MyRealtimeOverviewViewProps = {
  isDarkMode: boolean;
  cards: DashboardCard[];
  onCardClick?: (card: DashboardCard) => void;
};

export function MyRealtimeOverviewView({ isDarkMode, cards, onCardClick }: MyRealtimeOverviewViewProps) {
  const [range, setRange] = useState<keyof typeof rangeLabels>('months');
  const labels = rangeLabels[range];

  const totals = useMemo(() => {
    const totalRaw = cards.reduce((sum, c) => sum + extractCardValue(c), 0);
    const count = cards.length;
    const avg = count ? Math.round(totalRaw / count) : 0;
    const top = [...cards].sort((a, b) => extractCardValue(b) - extractCardValue(a)).slice(0, 5);
    return { totalRaw, count, avg, top };
  }, [cards]);

  const series = useMemo(() => buildTrendSeries(totals.top.slice(0, 3)), [totals.top]);
  const trendData = useMemo(() => buildTrendData(labels, series), [labels, series]);
  const primarySeriesKey = series[0]?.key ?? null;

  const panelBg = isDarkMode ? 'bg-white/5' : 'bg-white';
  const panelBorder = isDarkMode ? 'border-white/10' : 'border-gray-100';
  const muted = isDarkMode ? 'text-gray-400' : 'text-gray-500';

  return (
    <div className="p-8 flex flex-col gap-8">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">My Realtime Overview</h2>
          <p className={cn('text-sm', muted)}>Your inventory value, trends, and top assets.</p>
        </div>
        <div className={cn('flex items-center gap-2 rounded-2xl border px-3 py-2', panelBorder, panelBg)}>
          {(['days', 'weeks', 'months'] as const).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setRange(key)}
              className={cn(
                'px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-widest',
                range === key ? 'bg-orange-500 text-white' : cn(panelBg, panelBorder, muted)
              )}
            >
              {key}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard label="Total Assets" value={totals.count.toLocaleString()} change="Synced" isPositive />
        <StatCard label="Portfolio Value" value={formatMoney(totals.totalRaw)} change="+2.4%" isPositive />
        <StatCard label="Avg Card Value" value={formatMoney(totals.avg)} change="-0.6%" isPositive={false} />
        <StatCard label="Top Asset" value={totals.top[0]?.name ?? '—'} change={totals.top[0] ? formatMoney(extractCardValue(totals.top[0])) : undefined} isPositive />
      </div>

      <div className={cn('rounded-3xl border p-6', panelBorder, panelBg)}>
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-500">
              <Wallet size={18} />
            </div>
            <div>
              <div className="text-sm font-bold">Portfolio Trend</div>
              <div className={cn('text-[10px] uppercase tracking-widest', muted)}>Top assets moving average</div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest">
            <span className={muted}>24h</span>
            <span className="text-emerald-500 font-bold flex items-center gap-1">
              <ArrowUpRight size={12} /> +2.4%
            </span>
          </div>
        </div>

        <div className="mt-4 h-[300px]">
          {!primarySeriesKey ? (
            <div className={cn('h-full rounded-2xl border flex items-center justify-center text-center px-6', panelBorder, panelBg)}>
              <div>
                <div className="text-sm font-bold">No trend data yet</div>
                <p className={cn('text-xs mt-1', muted)}>Sync your inventory (login + open packs) to see your portfolio trend.</p>
              </div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f97316" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#f97316" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical stroke={isDarkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'} />
                <XAxis dataKey="name" stroke={isDarkMode ? '#888' : '#666'} />
                <YAxis stroke={isDarkMode ? '#888' : '#666'} domain={['auto', 'auto']} />
                <Tooltip
                  contentStyle={{
                    background: isDarkMode ? 'rgba(10,10,10,0.92)' : 'rgba(255,255,255,0.95)',
                    border: isDarkMode ? '1px solid rgba(255,255,255,0.12)' : '1px solid rgba(0,0,0,0.08)',
                    borderRadius: 14,
                  }}
                  formatter={(value: any) => [`${value}M`, 'Value']}
                />
                <Area type="monotone" dataKey={primarySeriesKey} stroke="#f97316" strokeWidth={2.5} fill="url(#areaFill)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-500">
          <Activity size={18} />
        </div>
        <div>
          <div className="text-sm font-bold">Your Top Cards</div>
          <div className={cn('text-[10px] uppercase tracking-widest', muted)}>Click to open details</div>
        </div>
      </div>

      {totals.count === 0 ? (
        <div className={cn('rounded-3xl border p-10 text-center', panelBorder, panelBg)}>
          <div className="text-lg font-bold">No cards synced yet</div>
          <p className={cn('text-sm mt-1', muted)}>Open packs or buy cards in FODR, then come back to see them here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {totals.top.map((card) => (
            <motion.button
              key={card.id}
              type="button"
              whileHover={{ y: -10, scale: 1.02 }}
              onClick={() => onCardClick?.(card)}
              className={cn('text-left rounded-[2.5rem] overflow-hidden border shadow-sm hover:shadow-2xl transition-all duration-500 group', panelBorder, panelBg)}
            >
              <div className="h-[320px] bg-black/20 flex items-center justify-center overflow-hidden">
                <img src={normalizeCardImage(card.image)} alt={card.name} className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-105" loading="lazy" />
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-black text-lg leading-tight">{card.name}</div>
                    <div className={cn('text-[10px] uppercase tracking-widest', muted)}>
                      {card.edition} · {card.year}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-orange-400 font-black">{card.value}</div>
                    <div className="text-[10px] font-bold text-emerald-500">+2.4%</div>
                  </div>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      )}
    </div>
  );
}
