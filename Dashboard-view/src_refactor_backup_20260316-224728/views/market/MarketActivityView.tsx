import React, { useMemo, useState } from 'react';
import { BarChart3, Clock, TrendingUp } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { cn } from '../../lib/cn';
import { chartPalette } from '../../lib/palette';
import { formatMoney } from '../../lib/money';
import { featuredTopCards } from '../../data/featuredTopCards';
import { hashString } from '../../lib/user';

type MarketActivityViewProps = {
  isDarkMode: boolean;
};

const labels = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

const seeded = (seed: string, index: number) => {
  const base = hashString(`${seed}:${index}`);
  return (base % 1000) / 1000;
};

const buildMonthlySales = (seed: string) =>
  labels.map((label, index) => ({
    name: label,
    sales: Math.max(0, Math.round(40 + seeded(seed, index) * 120)),
  }));

export function MarketActivityView({ isDarkMode }: MarketActivityViewProps) {
  const panelBg = isDarkMode ? 'bg-white/5' : 'bg-white';
  const panelBorder = isDarkMode ? 'border-white/10' : 'border-gray-100';
  const muted = isDarkMode ? 'text-gray-400' : 'text-gray-500';

  const [focus, setFocus] = useState(featuredTopCards[0]?.name ?? 'Alexander Isak');
  const seriesColor = chartPalette[2];
  const monthly = useMemo(() => buildMonthlySales(focus), [focus]);

  const totals = useMemo(() => {
    const volume = featuredTopCards.reduce((sum, c) => sum + (c.value || 0), 0);
    const cap = Math.round(volume * 10.4);
    const listings = 1284 + (volume % 37);
    return { volume, cap, listings };
  }, []);

  const feed = useMemo(
    () => [
      { id: 'a1', type: 'Sold', text: 'Ronaldo Nazario - Ultimate Edition sold', value: 12_000_000, time: '2m ago' },
      { id: 'a2', type: 'Listed', text: 'Mohamed Salah - Liverpool Edition listed', value: 4_700_000, time: '18m ago' },
      { id: 'a3', type: 'Bid', text: 'Bid placed on Virgil van Dijk - Liverpool Edition', value: 5_000_000, time: '1h ago' },
      { id: 'a4', type: 'Sold', text: 'Steven Gerrard - Liverpool Edition sold', value: 4_800_000, time: 'Yesterday' },
    ],
    []
  );

  return (
    <div className="p-8 flex flex-col gap-8">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Market Activity</h2>
          <p className={cn('text-sm', muted)}>Live sales, listings, and monthly velocity.</p>
        </div>
        <select value={focus} onChange={(e) => setFocus(e.target.value)} className={cn('px-4 py-2.5 rounded-2xl text-sm border-none', panelBg, panelBorder, muted)}>
          {featuredTopCards.slice(0, 5).map((c) => (
            <option key={c.id} value={c.name}>
              Focus: {c.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className={cn('rounded-3xl border p-6', panelBorder, panelBg)}>
          <div className={cn('text-[10px] uppercase tracking-widest', muted)}>Active Listings</div>
          <div className="text-4xl font-black tracking-tighter mt-1">{totals.listings.toLocaleString()}</div>
        </div>
        <div className={cn('rounded-3xl border p-6', panelBorder, panelBg)}>
          <div className={cn('text-[10px] uppercase tracking-widest', muted)}>24h Volume</div>
          <div className="text-4xl font-black tracking-tighter mt-1">{formatMoney(Math.round(totals.volume * 0.025))}</div>
        </div>
        <div className={cn('rounded-3xl border p-6', panelBorder, panelBg)}>
          <div className={cn('text-[10px] uppercase tracking-widest', muted)}>Market Cap</div>
          <div className="text-4xl font-black tracking-tighter mt-1">{formatMoney(totals.cap)}</div>
        </div>
        <div className={cn('rounded-3xl border p-6', panelBorder, panelBg)}>
          <div className={cn('text-[10px] uppercase tracking-widest', muted)}>Trend</div>
          <div className="text-4xl font-black tracking-tighter mt-1 text-emerald-400">Up</div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className={cn('col-span-12 lg:col-span-8 rounded-3xl border p-6', panelBorder, panelBg)}>
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                <BarChart3 size={18} />
              </div>
              <div>
                <div className="text-sm font-bold">Monthly Sales</div>
                <div className={cn('text-[10px] uppercase tracking-widest', muted)}>{focus}</div>
              </div>
            </div>
            <div className={cn('text-[10px] uppercase tracking-widest', muted)}>Hover bars for sales count</div>
          </div>

          <div className="mt-4 h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthly}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'} />
                <XAxis dataKey="name" stroke={isDarkMode ? '#888' : '#666'} />
                <YAxis stroke={isDarkMode ? '#888' : '#666'} />
                <Tooltip
                  contentStyle={{
                    background: isDarkMode ? 'rgba(10,10,10,0.92)' : 'rgba(255,255,255,0.95)',
                    border: isDarkMode ? '1px solid rgba(255,255,255,0.12)' : '1px solid rgba(0,0,0,0.08)',
                    borderRadius: 14,
                  }}
                  formatter={(value: any) => [`${value}`, 'Sales']}
                />
                <Bar dataKey="sales" fill={seriesColor} radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className={cn('col-span-12 lg:col-span-4 rounded-3xl border p-6', panelBorder, panelBg)}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-500">
                <TrendingUp size={18} />
              </div>
              <div>
                <div className="text-sm font-bold">Live Feed</div>
                <div className={cn('text-[10px] uppercase tracking-widest', muted)}>Recent market events</div>
              </div>
            </div>
            <Clock size={16} className={muted} />
          </div>

          <div className="mt-5 space-y-3">
            {feed.map((item) => (
              <div key={item.id} className={cn('rounded-2xl border p-4', panelBorder, panelBg)}>
                <div className="flex items-center justify-between gap-3">
                  <div className="text-sm font-bold">{item.type}</div>
                  <div className={cn('text-[10px] uppercase tracking-widest', muted)}>{item.time}</div>
                </div>
                <div className={cn('text-xs mt-1', muted)}>{item.text}</div>
                <div className="mt-2 font-black text-orange-400">{formatMoney(item.value)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

