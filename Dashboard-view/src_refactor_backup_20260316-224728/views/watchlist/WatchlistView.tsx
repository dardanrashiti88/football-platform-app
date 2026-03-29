import React, { useEffect, useMemo, useState } from 'react';
import { Star, Trash2 } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../../lib/cn';
import { normalizeCardImage } from '../../lib/cards';
import { formatMoney } from '../../lib/money';
import { featuredTopCards } from '../../data/featuredTopCards';
import type { DashboardCard } from '../../types';

type WatchlistViewProps = {
  isDarkMode: boolean;
  cards: DashboardCard[];
};

const KEY = 'fodrWatchlist';

const read = (): string[] => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr.filter((x) => typeof x === 'string') : [];
  } catch {
    return [];
  }
};

export function WatchlistView({ isDarkMode, cards }: WatchlistViewProps) {
  const panelBg = isDarkMode ? 'bg-white/5' : 'bg-white';
  const panelBorder = isDarkMode ? 'border-white/10' : 'border-gray-100';
  const muted = isDarkMode ? 'text-gray-400' : 'text-gray-500';

  const [watch, setWatch] = useState<string[]>(() => read());

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(KEY, JSON.stringify(watch));
  }, [watch]);

  const candidates = useMemo(() => featuredTopCards.slice(0, 5), []);
  const watchedRows = useMemo(() => {
    const names = new Set(watch.map((n) => n.toLowerCase()));
    const featured = candidates.filter((c) => names.has(c.name.toLowerCase()));
    const invMatches = cards.filter((c) => names.has(c.name.toLowerCase()));
    const merged = new Map<string, any>();
    featured.forEach((c) => merged.set(c.name.toLowerCase(), c));
    invMatches.forEach((c) => merged.set(c.name.toLowerCase(), c));
    return Array.from(merged.values());
  }, [watch, candidates, cards]);

  const toggle = (name: string) => {
    setWatch((prev) => {
      const set = new Set(prev.map((n) => n.toLowerCase()));
      const key = name.toLowerCase();
      if (set.has(key)) return prev.filter((n) => n.toLowerCase() !== key);
      return [...prev, name];
    });
  };

  return (
    <div className="p-8 flex flex-col gap-8">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Watchlist</h2>
          <p className={cn('text-sm', muted)}>Track cards you care about and get alerts.</p>
        </div>
        <div className={cn('px-4 py-2 rounded-2xl border text-[10px] font-bold uppercase tracking-widest', panelBg, panelBorder, muted)}>
          {watch.length} watched
        </div>
      </div>

      <div className={cn('rounded-3xl border p-6', panelBorder, panelBg)}>
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-500">
              <Star size={18} />
            </div>
            <div>
              <div className="text-sm font-bold">Quick Add</div>
              <div className={cn('text-[10px] uppercase tracking-widest', muted)}>Top cards in the game</div>
            </div>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          {candidates.map((c) => {
            const active = watch.some((n) => n.toLowerCase() === c.name.toLowerCase());
            return (
              <motion.button
                key={c.id}
                type="button"
                whileTap={{ scale: 0.98 }}
                onClick={() => toggle(c.name)}
                className={cn(
                  'px-4 py-2 rounded-2xl text-[11px] font-black uppercase tracking-widest border transition',
                  active ? 'bg-orange-500 text-white border-orange-500' : cn(panelBg, panelBorder, muted)
                )}
              >
                {active ? 'Watching' : 'Watch'} · {c.name}
              </motion.button>
            );
          })}
        </div>
      </div>

      <div className={cn('rounded-3xl border overflow-hidden', panelBorder, panelBg)}>
        <div className={cn('px-6 py-4 border-b flex items-center justify-between', panelBorder)}>
          <div className="text-sm font-bold">Watched Cards</div>
          <div className={cn('text-[10px] uppercase tracking-widest', muted)}>Click star to remove</div>
        </div>

        {watchedRows.length === 0 ? (
          <div className={cn('px-6 py-10 text-center text-sm', muted)}>No watched cards yet. Add from Quick Add.</div>
        ) : (
          <div className="divide-y divide-white/5">
            {watchedRows.map((row: any) => {
              const name = row.name;
              const value = typeof row.value === 'number' ? formatMoney(row.value) : row.value;
              return (
                <div key={name} className="px-6 py-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-14 h-14 rounded-2xl bg-black/20 overflow-hidden border border-white/10 flex items-center justify-center">
                      <img src={normalizeCardImage(row.image)} alt={name} className="w-full h-full object-contain" loading="lazy" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-bold truncate">{name}</div>
                      <div className={cn('text-[10px] uppercase tracking-widest truncate', muted)}>{row.edition || `${row.team || row.club} Edition`}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="font-black text-orange-400">{value}</div>
                      <div className="text-[10px] font-bold text-emerald-500">+2.4%</div>
                    </div>
                    <button type="button" onClick={() => toggle(name)} className="p-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-red-500/10 transition" aria-label="Remove from watchlist">
                      <Trash2 size={16} className="text-red-300" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

