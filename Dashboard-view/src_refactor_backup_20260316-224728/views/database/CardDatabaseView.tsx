import React, { useMemo, useState } from 'react';
import { BookOpen, Search, Star } from 'lucide-react';
import { cn } from '../../lib/cn';
import { extractCardValue, normalizeCardImage } from '../../lib/cards';
import { formatMoney } from '../../lib/money';
import { featuredTopCards } from '../../data/featuredTopCards';
import type { DashboardCard } from '../../types';

type CardDatabaseViewProps = {
  isDarkMode: boolean;
  cards: DashboardCard[];
};

type DbRow = {
  id: string;
  name: string;
  edition: string;
  year: string;
  rarity: string;
  value: number;
  condition: string;
  image: string;
  owned: boolean;
};

const toDbRows = (inventory: DashboardCard[]): DbRow[] => {
  const ownedNames = new Set(inventory.map((c) => c.name.toLowerCase()));
  const featured: DbRow[] = featuredTopCards.map((card) => ({
    id: String(card.id),
    name: card.name,
    edition: card.edition,
    year: card.year,
    rarity: card.rarity,
    value: card.value,
    condition: card.condition,
    image: card.image,
    owned: ownedNames.has(card.name.toLowerCase()),
  }));

  const invExtra: DbRow[] = inventory
    .filter((c) => !ownedNames.has(c.name.toLowerCase()) || !featured.some((f) => f.name.toLowerCase() === c.name.toLowerCase()))
    .slice(0, 50)
    .map((c) => ({
      id: `inv-${c.id}`,
      name: c.name,
      edition: c.edition || `${c.team} Edition`,
      year: c.year,
      rarity: c.rarity,
      value: extractCardValue(c),
      condition: c.condition,
      image: c.image,
      owned: true,
    }));

  return [...featured, ...invExtra];
};

export function CardDatabaseView({ isDarkMode, cards }: CardDatabaseViewProps) {
  const panelBg = isDarkMode ? 'bg-white/5' : 'bg-white';
  const panelBorder = isDarkMode ? 'border-white/10' : 'border-gray-100';
  const muted = isDarkMode ? 'text-gray-400' : 'text-gray-500';

  const [search, setSearch] = useState('');
  const [rarity, setRarity] = useState('All');
  const [ownedOnly, setOwnedOnly] = useState(false);

  const rows = useMemo(() => toDbRows(cards), [cards]);
  const rarities = useMemo(() => {
    const set = new Set(rows.map((r) => r.rarity).filter(Boolean));
    return ['All', ...Array.from(set)];
  }, [rows]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows.filter((row) => {
      const matchesQ = !q || row.name.toLowerCase().includes(q) || row.edition.toLowerCase().includes(q);
      const matchesRarity = rarity === 'All' || row.rarity === rarity;
      const matchesOwned = !ownedOnly || row.owned;
      return matchesQ && matchesRarity && matchesOwned;
    });
  }, [rows, search, rarity, ownedOnly]);

  return (
    <div className="p-8 flex flex-col gap-8">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Card Database</h2>
          <p className={cn('text-sm', muted)}>Search featured cards and your synced inventory.</p>
        </div>
        <div className={cn('flex items-center gap-2 rounded-2xl border px-3 py-2', panelBorder, panelBg)}>
          <BookOpen size={16} className={muted} />
          <span className={cn('text-[10px] uppercase tracking-widest', muted)}>{rows.length} cards indexed</span>
        </div>
      </div>

      <div className={cn('rounded-3xl border p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3', panelBorder, panelBg)}>
        <div className="flex items-center gap-3 flex-wrap">
          <div className={cn('flex items-center gap-2 rounded-2xl border px-3 py-2', panelBorder, panelBg)}>
            <Search size={16} className={muted} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search cards..."
              className={cn('bg-transparent outline-none text-sm font-bold min-w-[220px]', muted)}
            />
          </div>
          <select value={rarity} onChange={(e) => setRarity(e.target.value)} className={cn('px-4 py-2.5 rounded-2xl text-sm border-none', panelBg, panelBorder, muted)}>
            {rarities.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => setOwnedOnly((p) => !p)}
            className={cn(
              'px-4 py-2.5 rounded-2xl text-[11px] font-black uppercase tracking-widest transition',
              ownedOnly ? 'bg-orange-500 text-white' : cn(panelBg, panelBorder, muted)
            )}
          >
            Owned Only
          </button>
        </div>
        <div className={cn('text-[10px] uppercase tracking-widest', muted)}>{filtered.length} results</div>
      </div>

      <div className={cn('rounded-3xl border overflow-hidden', panelBorder, panelBg)}>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className={cn('text-[10px] font-bold uppercase tracking-widest', muted)}>
              <tr className={cn('border-b', panelBorder)}>
                <th className="text-left px-6 py-4">Card</th>
                <th className="text-left px-6 py-4">Edition</th>
                <th className="text-left px-6 py-4">Rarity</th>
                <th className="text-right px-6 py-4">Value</th>
                <th className="text-left px-6 py-4">Condition</th>
                <th className="text-right px-6 py-4">Watch</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.slice(0, 80).map((row) => (
                <tr key={row.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-black/20 border border-white/10 overflow-hidden flex items-center justify-center">
                        {row.image ? (
                          <img src={normalizeCardImage(row.image)} alt={row.name} className="w-full h-full object-contain" loading="lazy" />
                        ) : (
                          <div className={cn('text-[10px] uppercase tracking-widest', muted)}>N/A</div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-bold truncate">{row.name}</div>
                        <div className={cn('text-[10px] uppercase tracking-widest', muted)}>
                          {row.year} {row.owned ? '· Owned' : '· Not owned'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-bold">{row.edition}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest bg-orange-500/15 text-orange-300">{row.rarity}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="font-black text-orange-400">{formatMoney(row.value)}</span>
                  </td>
                  <td className="px-6 py-4 text-sm font-bold">{row.condition}</td>
                  <td className="px-6 py-4 text-right">
                    <button type="button" className={cn('inline-flex items-center gap-2 px-3 py-2 rounded-2xl border text-[10px] font-black uppercase tracking-widest', panelBorder, panelBg, muted)}>
                      <Star size={14} />
                      Watch
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className={cn('px-6 py-10 text-center text-sm', muted)}>
                    No matches. Try a different search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

