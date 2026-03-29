import React, { useMemo, useState } from 'react';
import { Activity, Trophy } from 'lucide-react';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { motion } from 'motion/react';
import { cn } from '../../lib/cn';
import { normalizeCardImage } from '../../lib/cards';
import { formatMoney } from '../../lib/money';
import { buildTrendData, buildTrendSeries, rangeLabels } from '../../lib/trends';
import { featuredTopCards } from '../../data/featuredTopCards';
import { StatCard } from '../../components/StatCard';

type RealtimeOverviewViewProps = {
  isDarkMode: boolean;
};

const buildTotals = () => {
  const base = featuredTopCards.reduce((sum, card) => sum + (card.value || 0), 0);
  const listings = 1284 + (base % 37);
  const volume = Math.round(base * 0.025);
  const marketCap = Math.round(base * 10.4);
  return { listings, volume, marketCap };
};

export function RealtimeOverviewView({ isDarkMode }: RealtimeOverviewViewProps) {
  const [range, setRange] = useState<keyof typeof rangeLabels>('months');
  const labels = rangeLabels[range];

  const series = useMemo(() => buildTrendSeries(featuredTopCards.slice(0, 5)), []);
  const trendData = useMemo(() => buildTrendData(labels, series), [labels, series]);
  const totals = useMemo(() => buildTotals(), []);

  const panelBg = isDarkMode ? 'bg-white/5' : 'bg-white';
  const panelBorder = isDarkMode ? 'border-white/10' : 'border-gray-100';
  const muted = isDarkMode ? 'text-gray-400' : 'text-gray-500';

  return (
    <div className="p-8 flex flex-col gap-8">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Realtime Overview</h2>
          <p className={cn('text-sm', muted)}>Live market pulse for the most valuable cards in FODR.</p>
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
        <StatCard label="Active Listings" value={totals.listings.toLocaleString()} change="+15" isPositive />
        <StatCard label="24h Volume" value={formatMoney(totals.volume)} change="+3.2%" isPositive />
        <StatCard label="Market Cap" value={formatMoney(totals.marketCap)} change="+1.1%" isPositive />
        <StatCard label="Top Cards" value="5" change="Updated" isPositive />
      </div>

      <div className={cn('rounded-3xl border p-6', panelBorder, panelBg)}>
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-500">
              <Activity size={18} />
            </div>
            <div>
              <div className="text-sm font-bold">Trends</div>
              <div className={cn('text-[10px] uppercase tracking-widest', muted)}>Top 5 card value lines</div>
            </div>
          </div>
          <div className={cn('text-[10px] uppercase tracking-widest', muted)}>Values shown in millions</div>
        </div>

        <div className="mt-4 h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData}>
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
              {series.map((s) => (
                <Line
                  key={s.key}
                  type="monotone"
                  dataKey={s.key}
                  stroke={s.color}
                  strokeWidth={2.5}
                  dot={false}
                  activeDot={{ r: 4 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-500">
          <Trophy size={18} />
        </div>
        <div>
          <div className="text-sm font-bold">Top 5 Cards</div>
          <div className={cn('text-[10px] uppercase tracking-widest', muted)}>Most expensive assets in the game</div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        {featuredTopCards.slice(0, 5).map((card) => (
          <motion.div
            key={card.id}
            whileHover={{ y: -10, scale: 1.02 }}
            className={cn('rounded-[2.5rem] overflow-hidden border shadow-sm hover:shadow-2xl transition-all duration-500 group', panelBorder, panelBg)}
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
                  <div className="text-orange-400 font-black">{formatMoney(card.value)}</div>
                  <div className="text-[10px] font-bold text-emerald-500">{card.priceChange}</div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

