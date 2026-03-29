import React, { useMemo } from 'react';
import { Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { Sparkles, Trophy } from 'lucide-react';
import { cn } from '../../lib/cn';
import { extractCardValue, normalizeCardImage } from '../../lib/cards';
import { chartPalette } from '../../lib/palette';
import { formatMoney } from '../../lib/money';
import type { DashboardCard } from '../../types';

type RarityIndexViewProps = {
  isDarkMode: boolean;
  cards: DashboardCard[];
};

export function RarityIndexView({ isDarkMode, cards }: RarityIndexViewProps) {
  const panelBg = isDarkMode ? 'bg-white/5' : 'bg-white';
  const panelBorder = isDarkMode ? 'border-white/10' : 'border-gray-100';
  const muted = isDarkMode ? 'text-gray-400' : 'text-gray-500';

  const rarityData = useMemo(() => {
    const counts = new Map<string, number>();
    cards.forEach((c) => counts.set(c.rarity || 'Unknown', (counts.get(c.rarity || 'Unknown') ?? 0) + 1));
    const entries = Array.from(counts.entries()).map(([name, value]) => ({ name, value }));
    const sorted = entries.sort((a, b) => b.value - a.value);
    return sorted.map((entry, index) => ({ ...entry, fill: chartPalette[index % chartPalette.length] }));
  }, [cards]);

  const totals = useMemo(() => {
    const total = cards.length;
    const unique = new Set(cards.map((c) => c.rarity)).size;
    const legendary = cards.filter((c) => String(c.rarity).toLowerCase() === 'legendary').length;
    const top = [...cards].sort((a, b) => extractCardValue(b) - extractCardValue(a)).slice(0, 5);
    return { total, unique, legendary, top };
  }, [cards]);

  return (
    <div className="p-8 flex flex-col gap-8">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Rarity Index</h2>
          <p className={cn('text-sm', muted)}>Distribution of your inventory by rarity.</p>
        </div>
        <div className={cn('px-4 py-2 rounded-2xl border text-[10px] font-bold uppercase tracking-widest', panelBg, panelBorder, muted)}>
          {totals.total} cards
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className={cn('rounded-3xl border p-6', panelBorder, panelBg)}>
          <div className={cn('text-[10px] uppercase tracking-widest', muted)}>Total Assets</div>
          <div className="text-4xl font-black tracking-tighter mt-1">{totals.total.toLocaleString()}</div>
        </div>
        <div className={cn('rounded-3xl border p-6', panelBorder, panelBg)}>
          <div className={cn('text-[10px] uppercase tracking-widest', muted)}>Unique Rarities</div>
          <div className="text-4xl font-black tracking-tighter mt-1">{totals.unique}</div>
        </div>
        <div className={cn('rounded-3xl border p-6', panelBorder, panelBg)}>
          <div className={cn('text-[10px] uppercase tracking-widest', muted)}>Legendary Owned</div>
          <div className="text-4xl font-black tracking-tighter mt-1">{totals.legendary}</div>
        </div>
        <div className={cn('rounded-3xl border p-6', panelBorder, panelBg)}>
          <div className={cn('text-[10px] uppercase tracking-widest', muted)}>Rarity Score</div>
          <div className="text-4xl font-black tracking-tighter mt-1 text-orange-400">
            {Math.min(100, Math.round((totals.legendary / Math.max(1, totals.total)) * 100))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className={cn('col-span-12 lg:col-span-6 rounded-3xl border p-6', panelBorder, panelBg)}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-500">
              <Sparkles size={18} />
            </div>
            <div>
              <div className="text-sm font-bold">Rarity Distribution</div>
              <div className={cn('text-[10px] uppercase tracking-widest', muted)}>Hover to see counts</div>
            </div>
          </div>

          <div className="mt-4 h-[320px]">
            {rarityData.length === 0 ? (
              <div className={cn('h-full rounded-2xl border flex items-center justify-center text-center px-6', panelBorder, panelBg)}>
                <div>
                  <div className="text-sm font-bold">No inventory data</div>
                  <p className={cn('text-xs mt-1', muted)}>Login and sync your inventory to see rarity analytics.</p>
                </div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip
                    contentStyle={{
                      background: isDarkMode ? 'rgba(10,10,10,0.92)' : 'rgba(255,255,255,0.95)',
                      border: isDarkMode ? '1px solid rgba(255,255,255,0.12)' : '1px solid rgba(0,0,0,0.08)',
                      borderRadius: 14,
                    }}
                    formatter={(value: any) => [`${value}`, 'Cards']}
                  />
                  <Pie data={rarityData} dataKey="value" nameKey="name" outerRadius={120} innerRadius={60} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>

          {rarityData.length > 0 && (
            <div className="mt-4 grid grid-cols-2 gap-3">
              {rarityData.map((entry) => (
                <div key={entry.name} className={cn('rounded-2xl border p-3 flex items-center justify-between', panelBorder, panelBg)}>
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-3 h-3 rounded-full" style={{ background: entry.fill }} />
                    <span className="text-xs font-bold truncate">{entry.name}</span>
                  </div>
                  <span className={cn('text-xs font-black', muted)}>{entry.value}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className={cn('col-span-12 lg:col-span-6 rounded-3xl border p-6', panelBorder, panelBg)}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400">
              <Trophy size={18} />
            </div>
            <div>
              <div className="text-sm font-bold">Top Value Cards</div>
              <div className={cn('text-[10px] uppercase tracking-widest', muted)}>Highest priced assets you own</div>
            </div>
          </div>

          <div className="mt-5 space-y-3">
            {totals.top.length === 0 ? (
              <div className={cn('rounded-2xl border p-6 text-center text-sm', panelBorder, panelBg, muted)}>No cards to rank yet.</div>
            ) : (
              totals.top.map((card) => (
                <div key={card.id} className={cn('rounded-2xl border p-4 flex items-center justify-between gap-4', panelBorder, panelBg)}>
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-14 h-14 rounded-2xl bg-black/20 border border-white/10 overflow-hidden flex items-center justify-center">
                      <img src={normalizeCardImage(card.image)} alt={card.name} className="w-full h-full object-contain" loading="lazy" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-bold truncate">{card.name}</div>
                      <div className={cn('text-[10px] uppercase tracking-widest truncate', muted)}>{card.rarity}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-black text-orange-400">{formatMoney(extractCardValue(card))}</div>
                    <div className={cn('text-[10px] uppercase tracking-widest', muted)}>{card.condition}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

