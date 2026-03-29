import React, { useMemo, useState } from 'react';
import { ArrowDownRight, ArrowUpRight, LayoutGrid, List, Search, Users, Wallet } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../../lib/cn';
import { extractCardValue } from '../../lib/cards';
import { formatMoney } from '../../lib/money';
import type { DashboardCard } from '../../types';

type InventoryDashboardViewProps = {
  cards: DashboardCard[];
  onCardClick: (card: DashboardCard) => void;
};

export function InventoryDashboardView({ cards, onCardClick }: InventoryDashboardViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [rarityFilter, setRarityFilter] = useState('All');
  const [sortBy, setSortBy] = useState('Value High');
  const [viewMode, setViewMode] = useState<'Grid' | 'List'>('Grid');

  const portfolioTotalRaw = useMemo(() => cards.reduce((sum, card) => sum + extractCardValue(card), 0), [cards]);
  const totalAssetsCount = cards.length;
  const totalPortfolioValue = formatMoney(portfolioTotalRaw);
  const avgCardValue = totalAssetsCount ? formatMoney(portfolioTotalRaw / totalAssetsCount) : formatMoney(0);
  const editionCount = useMemo(() => new Set(cards.map((card) => card.edition || `${card.team || 'Club'} Edition`)).size, [cards]);

  const filteredCards = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return cards.filter((card) => {
      const matchesSearch =
        !query ||
        card.name.toLowerCase().includes(query) ||
        String(card.team || '').toLowerCase().includes(query) ||
        String(card.rarity || '').toLowerCase().includes(query);
      const matchesRarity = rarityFilter === 'All' || card.rarity === rarityFilter;
      return matchesSearch && matchesRarity;
    });
  }, [cards, searchQuery, rarityFilter]);

  const sortedCards = useMemo(() => {
    const parsePrice = (value: string) => Number(value.replace(/[$,]/g, '')) || 0;
    return [...filteredCards].sort((a, b) => {
      switch (sortBy) {
        case 'Value Low':
          return parsePrice(a.value) - parsePrice(b.value);
        case 'Year Newest':
          return Number(b.year) - Number(a.year);
        case 'Year Oldest':
          return Number(a.year) - Number(b.year);
        default:
          return parsePrice(b.value) - parsePrice(a.value);
      }
    });
  }, [filteredCards, sortBy]);

  const rarities = useMemo(() => {
    const unique = new Set(cards.map((card) => card.rarity).filter(Boolean));
    return ['All', ...Array.from(unique)];
  }, [cards]);

  return (
    <div className="p-8 flex flex-col gap-8">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Inventory Portfolio</h2>
          <p className="text-sm text-gray-500">Your synced card inventory from FODR.</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setViewMode('Grid')}
            className={cn(
              'px-3 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest border',
              viewMode === 'Grid' ? 'bg-orange-500 text-white border-orange-500' : 'bg-white/5 border-white/10 text-gray-300'
            )}
          >
            <LayoutGrid size={14} className="inline-block mr-1" />
            Grid
          </button>
          <button
            type="button"
            onClick={() => setViewMode('List')}
            className={cn(
              'px-3 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest border',
              viewMode === 'List' ? 'bg-orange-500 text-white border-orange-500' : 'bg-white/5 border-white/10 text-gray-300'
            )}
          >
            <List size={14} className="inline-block mr-1" />
            List
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <div className="relative overflow-hidden bg-white dark:bg-white/5 rounded-[2rem] p-6 border border-gray-100 dark:border-white/5 shadow-sm">
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full -mr-16 -mt-16 blur-3xl" />
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-500/20 rounded-2xl flex items-center justify-center text-orange-600">
              <Users size={22} />
            </div>
            <span className="text-[11px] font-bold text-emerald-500 flex items-center gap-1">
              <ArrowUpRight size={12} /> +{editionCount}
            </span>
          </div>
          <div className="mt-4">
            <div className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.1em] mb-1">Total Assets</div>
            <div className="text-4xl font-black tracking-tighter">{totalAssetsCount.toLocaleString()}</div>
          </div>
        </div>

        <div className="relative overflow-hidden bg-white dark:bg-white/5 rounded-[2rem] p-6 border border-gray-100 dark:border-white/5 shadow-sm">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full -mr-16 -mt-16 blur-3xl" />
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-500/20 rounded-2xl flex items-center justify-center text-blue-600">
              <Wallet size={22} />
            </div>
            <span className="text-[11px] font-bold text-emerald-500 flex items-center gap-1">
              <ArrowUpRight size={12} /> +5.4%
            </span>
          </div>
          <div className="mt-4">
            <div className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.1em] mb-1">Portfolio Value</div>
            <div className="text-4xl font-black tracking-tighter">{totalPortfolioValue}</div>
          </div>
        </div>

        <div className="relative overflow-hidden bg-white dark:bg-white/5 rounded-[2rem] p-6 border border-gray-100 dark:border-white/5 shadow-sm">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full -mr-16 -mt-16 blur-3xl" />
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-500/20 rounded-2xl flex items-center justify-center text-purple-600">
              <Wallet size={22} />
            </div>
            <span className="text-[11px] font-bold text-red-500 flex items-center gap-1">
              <ArrowDownRight size={12} /> -2.1%
            </span>
          </div>
          <div className="mt-4">
            <div className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.1em] mb-1">Avg. Card Value</div>
            <div className="text-4xl font-black tracking-tighter">{avgCardValue}</div>
          </div>
        </div>

        <div className="relative overflow-hidden bg-white dark:bg-white/5 rounded-[2rem] p-6 border border-gray-100 dark:border-white/5 shadow-sm">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full -mr-16 -mt-16 blur-3xl" />
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-500/20 rounded-2xl flex items-center justify-center text-emerald-600">
              <Users size={22} />
            </div>
            <span className="text-[11px] font-bold text-emerald-500 flex items-center gap-1">
              <ArrowUpRight size={12} /> Stable
            </span>
          </div>
          <div className="mt-4">
            <div className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.1em] mb-1">Active Editions</div>
            <div className="text-4xl font-black tracking-tighter">{editionCount}</div>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white dark:bg-white/5 p-4 rounded-[2rem] border border-gray-100 dark:border-white/5 shadow-sm">
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-80">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search cards..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-100 dark:bg-white/5 border-none rounded-2xl text-sm focus:ring-2 focus:ring-orange-500/20 transition-all"
            />
          </div>
          <select
            value={rarityFilter}
            onChange={(e) => setRarityFilter(e.target.value)}
            className="px-4 py-2.5 bg-gray-100 dark:bg-white/5 rounded-2xl text-sm border-none focus:ring-2 focus:ring-orange-500/20"
          >
            {rarities.map((rarity) => (
              <option key={rarity} value={rarity}>
                {rarity}
              </option>
            ))}
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2.5 bg-gray-100 dark:bg-white/5 rounded-2xl text-sm border-none focus:ring-2 focus:ring-orange-500/20"
          >
            {['Value High', 'Value Low', 'Year Newest', 'Year Oldest'].map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        <div className="text-[11px] text-gray-400 font-bold uppercase tracking-widest">
          {sortedCards.length} cards
        </div>
      </div>

      <div className={cn(viewMode === 'Grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6' : 'flex flex-col gap-4')}>
        {sortedCards.map((card) => (
          <motion.div
            key={card.id}
            whileHover={{ y: -8, scale: 1.02 }}
            onClick={() => onCardClick(card)}
            className={cn(
              'bg-white dark:bg-white/5 rounded-[2.5rem] overflow-hidden border border-gray-100 dark:border-white/5 shadow-sm hover:shadow-2xl transition-all duration-500 group cursor-pointer',
              viewMode === 'List' && 'flex items-center gap-6 p-6'
            )}
          >
            <div className={cn('relative overflow-hidden', viewMode === 'Grid' ? 'h-[320px]' : 'h-36 w-32 rounded-2xl')}>
              <img src={card.image} alt={card.name} className="w-full h-full object-contain bg-black/20 transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute top-6 right-6">
                <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl backdrop-blur-xl border border-white/20 bg-orange-500/80 text-white">
                  {card.rarity}
                </span>
              </div>
            </div>
            <div className={cn(viewMode === 'Grid' ? 'p-4' : 'flex-1')}>
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-black text-xl leading-tight group-hover:text-orange-500 transition-colors">{card.name}</h4>
                  <p className="text-xs text-gray-400 font-medium mt-1">
                    {card.team} • {card.year}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-lg font-black text-orange-500 block">{card.value}</span>
                  <span className="text-[10px] text-emerald-500 font-bold">+2.4%</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

