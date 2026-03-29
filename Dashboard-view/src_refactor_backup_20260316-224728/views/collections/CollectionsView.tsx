import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Search } from 'lucide-react';
import { cn } from '../../lib/cn';
import { extractCardValue } from '../../lib/cards';
import { formatMoney } from '../../lib/money';
import { collectionSets } from '../../data/collectionSets';
import type { DashboardCard } from '../../types';
import { SelectedSetPanel } from './SelectedSetPanel';

type CollectionsViewProps = {
  isDarkMode: boolean;
  cards: DashboardCard[];
};

export function CollectionsView({ isDarkMode, cards }: CollectionsViewProps) {
  const panelBg = isDarkMode ? 'bg-white/5' : 'bg-white';
  const panelBorder = isDarkMode ? 'border-white/10' : 'border-gray-100';
  const muted = isDarkMode ? 'text-gray-400' : 'text-gray-500';

  const [showCompleted, setShowCompleted] = useState(true);
  const [showMissing, setShowMissing] = useState(true);
  const [sortBy, setSortBy] = useState('Progress');
  const [search, setSearch] = useState('');
  const [nearCompletionOnly, setNearCompletionOnly] = useState(false);
  const [selectedSetId, setSelectedSetId] = useState<string | null>(null);
  const detailsRef = useRef<HTMLDivElement | null>(null);

  const liverpoolSetCards = [
    'Mohamed Salah',
    'Virgil van Dijk',
    'Steven Gerrard',
    'Alexander Isak',
    'Florian Wirtz',
    'Diogo Jota',
    'Xabi Alonso',
    'Fabinho',
    'Ibrahima Konate',
    'Sadio Mane',
    'Dominik Szoboszlai',
    'Kenny Dalglish',
    'Roberto Firmino',
    'Ryan Gravenberch',
    'Andy Robertson',
    'Trent Alexander-Arnold',
  ];

  const liverpoolInventoryMap = useMemo(() => {
    const map = new Map<string, DashboardCard>();
    cards
      .filter((card) => String(card.team || '').toLowerCase() === 'liverpool')
      .forEach((card) => {
        const name = card?.name;
        if (!name) return;
        const existing = map.get(name);
        if (!existing || extractCardValue(card) > extractCardValue(existing)) {
          map.set(name, card);
        }
      });
    return map;
  }, [cards]);

  const ownedLiverpool = Array.from(liverpoolInventoryMap.keys());
  const ownedLiverpoolSet = new Set(ownedLiverpool);
  const missingLiverpool = liverpoolSetCards.filter((name) => !ownedLiverpoolSet.has(name));

  const dynamicSets = useMemo(() => {
    return collectionSets.map((set) => {
      if (set.id !== 'set-liverpool') return set;
      const cappedOwned = Math.min(ownedLiverpool.length, liverpoolSetCards.length);
      return {
        ...set,
        total: liverpoolSetCards.length,
        owned: cappedOwned,
        missing: missingLiverpool,
        ownedCards: ownedLiverpool,
      } as typeof set & { ownedCards?: string[] };
    });
  }, [ownedLiverpool.length, missingLiverpool]);

  const filteredSets = dynamicSets.filter((set) => {
    if (!showCompleted && set.owned === set.total) return false;
    if (search.trim() && !set.name.toLowerCase().includes(search.trim().toLowerCase())) return false;
    if (nearCompletionOnly && set.owned / set.total < 0.7) return false;
    return true;
  });

  const sortedSets = [...filteredSets].sort((a, b) => {
    const progressA = a.owned / a.total;
    const progressB = b.owned / b.total;
    if (sortBy === 'Name') return a.name.localeCompare(b.name);
    if (sortBy === 'Missing') return b.total - b.owned - (a.total - a.owned);
    return progressB - progressA;
  });

  const selectedSet = dynamicSets.find((set) => set.id === selectedSetId) ?? null;

  const buildSetCards = (set: (typeof collectionSets)[number]) => {
    const ownedCount = Math.min(set.owned, set.total);
    const missingCount = Math.max(set.total - ownedCount, 0);
    const baseName = set.name.replace(' Edition', '');
    const ownedNames = Array.isArray((set as any).ownedCards)
      ? (set as any).ownedCards
      : Array.from({ length: ownedCount }, (_, index) => `${baseName} Card ${index + 1}`);

    const missingNames = [...set.missing];
    while (missingNames.length < missingCount) {
      missingNames.push(`${baseName} Slot ${missingNames.length + 1}`);
    }

    const ownedCards = ownedNames.map((name, index) => {
      const sourceCard = (set as any).id === 'set-liverpool' ? liverpoolInventoryMap.get(name) : null;
      const rawValue = sourceCard ? extractCardValue(sourceCard) : 0;
      return {
        id: sourceCard?.id ?? `${set.id}-${index}`,
        name,
        status: 'Owned',
        rarity: sourceCard?.rarity ?? 'Common',
        serial: `#${String(index + 1).padStart(2, '0')}/${set.total}`,
        value: sourceCard ? formatMoney(rawValue) : `$${(120 + index * 15).toLocaleString()}`,
        team: sourceCard?.team ?? 'Unknown',
        image: sourceCard?.image ?? '',
      };
    });

    if ((set as any).id === 'set-liverpool') {
      return ownedCards;
    }

    const missingCards = missingNames.slice(0, missingCount).map((name, index) => ({
      id: `${set.id}-missing-${index}`,
      name,
      status: 'Missing',
      rarity: 'Rare',
      serial: `#${String(ownedCount + index + 1).padStart(2, '0')}/${set.total}`,
      value: `~$${(90 + index * 12).toLocaleString()}`,
      team: baseName,
      image: '',
    }));

    return [...ownedCards, ...missingCards];
  };

  useEffect(() => {
    if (selectedSetId && detailsRef.current) {
      detailsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [selectedSetId]);

  return (
    <div className="p-6 lg:p-8 flex flex-col gap-8">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Collections</h2>
          <p className={cn('text-sm', muted)}>Track set completion and missing cards.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className={cn('flex items-center gap-2 rounded-xl border px-3 py-2', panelBorder, panelBg)}>
            <Search size={14} className={muted} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search sets..."
              className={cn('bg-transparent text-xs font-bold outline-none', muted)}
            />
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className={cn('px-3 py-2 rounded-xl text-xs font-bold', panelBg, panelBorder, muted)}
          >
            {['Progress', 'Name', 'Missing'].map((option) => (
              <option key={option} value={option}>
                Sort: {option}
              </option>
            ))}
          </select>
          <button
            onClick={() => setShowCompleted((prev) => !prev)}
            className={cn('px-3 py-2 rounded-xl text-xs font-bold', showCompleted ? 'bg-orange-500 text-white' : cn(panelBg, panelBorder, muted))}
            type="button"
          >
            Show Completed
          </button>
          <button
            onClick={() => setShowMissing((prev) => !prev)}
            className={cn('px-3 py-2 rounded-xl text-xs font-bold', showMissing ? 'bg-orange-500 text-white' : cn(panelBg, panelBorder, muted))}
            type="button"
          >
            Show Missing
          </button>
          <button
            onClick={() => setNearCompletionOnly((prev) => !prev)}
            className={cn('px-3 py-2 rounded-xl text-xs font-bold', nearCompletionOnly ? 'bg-orange-500 text-white' : cn(panelBg, panelBorder, muted))}
            type="button"
          >
            Near Completion
          </button>
        </div>
      </div>

      {selectedSet && (
        <div ref={detailsRef}>
          <SelectedSetPanel
            selectedSet={selectedSet}
            panelBg={panelBg}
            panelBorder={panelBorder}
            muted={muted}
            showMissing={showMissing}
            buildSetCards={buildSetCards}
            onClose={() => setSelectedSetId(null)}
          />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {sortedSets.map((set) => {
          const percent = Math.min(100, Math.round((set.owned / set.total) * 100));
          return (
            <div key={set.id} className={cn('rounded-3xl border p-6', panelBorder, panelBg)}>
              <div className="text-sm font-bold">{set.name}</div>
              <div className={cn('text-[10px] uppercase tracking-widest', muted)}>{set.theme}</div>
              <div className="mt-4">
                <div className="flex items-center justify-between text-xs">
                  <span className={muted}>
                    {set.owned}/{set.total} collected
                  </span>
                  <span className="font-bold">{percent}%</span>
                </div>
                <div className="mt-2 h-2 rounded-full bg-white/10">
                  <div className="h-2 rounded-full bg-orange-500" style={{ width: `${percent}%` }} />
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <div className={cn('text-[10px] uppercase tracking-widest', muted)}>{set.total - set.owned} missing</div>
                <button
                  onClick={() => setSelectedSetId(set.id)}
                  className="px-3 py-2 rounded-xl bg-orange-500 text-[10px] font-bold uppercase tracking-widest text-white"
                  type="button"
                >
                  Open
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
