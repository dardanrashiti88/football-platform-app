import React, { useMemo } from 'react';
import { ArrowUpRight, Crown, TrendingUp, Trophy } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../../lib/cn';
import { normalizeCardImage } from '../../lib/cards';
import { formatMoney } from '../../lib/money';
import { featuredTopCards } from '../../data/featuredTopCards';
import { StatCard } from '../../components/StatCard';
import type { DashboardCard } from '../../types';

type TopCardsViewProps = {
  isDarkMode: boolean;
  cards: DashboardCard[];
};

export function TopCardsView({ isDarkMode, cards }: TopCardsViewProps) {
  const panelBg = isDarkMode ? 'bg-white/5' : 'bg-white';
  const panelBorder = isDarkMode ? 'border-white/10' : 'border-gray-100';
  const muted = isDarkMode ? 'text-gray-400' : 'text-gray-500';

  const globalTop = featuredTopCards.slice(0, 5);

  const stats = useMemo(() => {
    const total = globalTop.reduce((sum, card) => sum + (card.value || 0), 0);
    const avg = globalTop.length ? Math.round(total / globalTop.length) : 0;
    const highest = globalTop[0]?.value ?? 0;
    const ownedCount = cards.filter((c) => globalTop.some((g) => g.name.toLowerCase() === c.name.toLowerCase())).length;
    return { total, avg, highest, ownedCount };
  }, [cards, globalTop]);

  return (
    <div className="p-8 flex flex-col gap-8">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Top Cards</h2>
          <p className={cn('text-sm', muted)}>The most expensive cards in FODR right now.</p>
        </div>
        <div className={cn('px-4 py-2 rounded-2xl border text-[10px] font-bold uppercase tracking-widest', panelBg, panelBorder, muted)}>
          Updated: Today
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard label="Global Top 5 Value" value={formatMoney(stats.total)} change="+2.1%" isPositive />
        <StatCard label="Average Top Value" value={formatMoney(stats.avg)} change="+0.8%" isPositive />
        <StatCard label="Highest Card" value={formatMoney(stats.highest)} change="Record" isPositive />
        <StatCard label="You Own" value={`${stats.ownedCount}/5`} change="Synced" isPositive />
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className={cn('col-span-12 lg:col-span-8 rounded-3xl border overflow-hidden', panelBorder, panelBg)}>
          <div className={cn('px-6 py-4 border-b flex items-center justify-between', panelBorder)}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-500">
                <Trophy size={18} />
              </div>
              <div>
                <div className="text-sm font-bold">Leaderboard</div>
                <div className={cn('text-[10px] uppercase tracking-widest', muted)}>Top 5 most valuable</div>
              </div>
            </div>
            <div className={cn('text-[10px] uppercase tracking-widest', muted)}>Value</div>
          </div>

          <div className="divide-y divide-white/5">
            {globalTop.map((card, index) => (
              <div key={card.id} className="px-6 py-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center font-black">
                    #{index + 1}
                  </div>
                  <div className="w-14 h-14 rounded-2xl bg-black/20 overflow-hidden border border-white/10 flex items-center justify-center">
                    <img src={normalizeCardImage(card.image)} alt={card.name} className="w-full h-full object-contain" loading="lazy" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-bold truncate">{card.name}</div>
                    <div className={cn('text-[10px] uppercase tracking-widest truncate', muted)}>
                      {card.edition} · {card.year}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-black text-orange-400">{formatMoney(card.value)}</div>
                  <div className="text-[10px] font-bold text-emerald-500">{card.priceChange}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
          <div className={cn('rounded-3xl border p-6', panelBorder, panelBg)}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-500">
                <Crown size={18} />
              </div>
              <div>
                <div className="text-sm font-bold">Spotlight</div>
                <div className={cn('text-[10px] uppercase tracking-widest', muted)}>Most valuable card</div>
              </div>
            </div>
            <div className="mt-4">
              <div className="h-[240px] rounded-3xl bg-black/20 border border-white/10 flex items-center justify-center overflow-hidden">
                <img src={normalizeCardImage(globalTop[0].image)} alt={globalTop[0].name} className="w-full h-full object-contain" loading="lazy" />
              </div>
              <div className="mt-4 flex items-start justify-between gap-3">
                <div>
                  <div className="text-lg font-black leading-tight">{globalTop[0].name}</div>
                  <div className={cn('text-[10px] uppercase tracking-widest', muted)}>{globalTop[0].edition}</div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-black text-orange-400">{formatMoney(globalTop[0].value)}</div>
                  <div className="text-[10px] font-bold text-emerald-500 flex items-center justify-end gap-1">
                    <ArrowUpRight size={12} />
                    {globalTop[0].priceChange}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className={cn('rounded-3xl border p-6', panelBorder, panelBg)}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                <TrendingUp size={18} />
              </div>
              <div>
                <div className="text-sm font-bold">Notes</div>
                <div className={cn('text-[10px] uppercase tracking-widest', muted)}>Quick market summary</div>
              </div>
            </div>
            <ul className={cn('mt-4 text-sm space-y-3', muted)}>
              <li>Ultimate Edition icons are trending up this week.</li>
              <li>Liverpool Edition supply is low, demand is high.</li>
              <li>Expect more volatility after new pack drops.</li>
            </ul>
            <motion.button
              type="button"
              whileTap={{ scale: 0.98 }}
              className="mt-5 w-full px-4 py-3 rounded-2xl bg-orange-500 text-white text-sm font-black hover:bg-orange-600 transition"
            >
              View Market Activity
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}

