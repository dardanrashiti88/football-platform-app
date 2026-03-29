import React, { useMemo, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { cn } from '../../lib/cn';
import { buildHistory, extractCardValue } from '../../lib/cards';
import { formatMoney } from '../../lib/money';
import { hashString } from '../../lib/user';
import type { DashboardCard } from '../../types';
import { DetailLeftPanel } from './detail/LeftPanel';
import { DetailOverviewPanel } from './detail/OverviewPanel';
import { DetailLiquidityPanel } from './detail/LiquidityPanel';
import { DetailOffersPanel } from './detail/OffersPanel';
import { DetailSecurityPanel } from './detail/SecurityPanel';
import { DetailNotesPanel } from './detail/NotesPanel';

type CardDetailViewProps = {
  card: DashboardCard;
  onBack: () => void;
  isDarkMode: boolean;
};

const seeded = (seed: string, index: number) => {
  const base = hashString(`${seed}:${index}`);
  return (base % 1000) / 1000;
};

export function CardDetailView({ card, onBack, isDarkMode }: CardDetailViewProps) {
  const [detailRange, setDetailRange] = useState<'1D' | '1W' | '1M' | '1Y' | 'ALL'>('1M');
  const [detailTab, setDetailTab] = useState<'Overview' | 'Liquidity' | 'Offers' | 'Security' | 'Notes'>('Overview');
  const [watchlisted, setWatchlisted] = useState(true);
  const [alertEnabled, setAlertEnabled] = useState(true);
  const [vaultLocked, setVaultLocked] = useState(true);
  const [notes, setNotes] = useState<string[]>(['Vaulted in Zurich', 'Insurance renewed - 2026']);
  const [noteInput, setNoteInput] = useState('');

  const safeValue = extractCardValue(card);
  const displayValue = typeof card.value === 'string' ? card.value : formatMoney(safeValue);
  const edition = card.edition || `${card.team || 'Club'} Edition`;
  const serial = (card as any).serial || `#${String(card.id ?? 1).padStart(3, '0')}/100`;
  const cardId = (card as any).cardId || `FODR-${String(card.id ?? 1).padStart(5, '0')}`;
  const position = (card as any).position || 'ST';
  const release = (card as any).release || `${card.year || '2025'} Collection`;
  const safeHistory = Array.isArray(card.history) ? card.history : buildHistory(safeValue);
  const safeImage = card.image || '';

  const trendData = useMemo(() => {
    const labels =
      detailRange === '1D'
        ? ['00', '04', '08', '12', '16', '20', '24']
        : detailRange === '1W'
          ? ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN']
          : detailRange === '1M'
            ? ['W1', 'W2', 'W3', 'W4', 'W5']
            : detailRange === '1Y'
              ? ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']
              : ['2020', '2021', '2022', '2023', '2024', '2025', '2026'];

    const base = extractCardValue(card) / 1_000_000 || 0.5;
    return labels.map((label, index) => {
      const wobble = (seeded(card.name, index) - 0.5) * 0.9;
      const wave = Math.sin(index / 2) * 0.25;
      return { name: label, value: Number((base + wobble + wave).toFixed(2)) };
    });
  }, [card, detailRange]);

  const offerInbox = [
    { id: 'off-1', from: 'collector_x', type: 'Swap + Cash', price: '$2.6M', status: 'New' },
    { id: 'off-2', from: 'vault_prime', type: 'Direct Buy', price: '$2.4M', status: 'Review' },
    { id: 'off-3', from: 'legacy_fund', type: 'Auction Bid', price: '$2.55M', status: 'Counter' },
  ];
  const depthData = [
    { name: 'Bid 1', value: 24 },
    { name: 'Bid 2', value: 18 },
    { name: 'Bid 3', value: 12 },
    { name: 'Ask 1', value: 16 },
    { name: 'Ask 2', value: 20 },
    { name: 'Ask 3', value: 28 },
  ];

  return (
    <div className="p-8 flex flex-col gap-8">
      <div className="flex items-center gap-4">
        <button
          onClick={onBack}
          className="p-2 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl hover:bg-gray-50 dark:hover:bg-white/10 transition-colors"
          type="button"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h2 className="text-2xl font-bold">{card.name} Details</h2>
          <p className="text-sm text-gray-500">Real-time performance and market analytics for {card.name}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {(['Overview', 'Liquidity', 'Offers', 'Security', 'Notes'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setDetailTab(tab)}
            className={cn(
              'px-3 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-colors',
              detailTab === tab ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20' : 'bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-500'
            )}
            type="button"
          >
            {tab}
          </button>
        ))}
        <button
          onClick={() => setWatchlisted((prev) => !prev)}
          className={cn(
            'px-3 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-colors',
            watchlisted ? 'bg-emerald-500 text-white' : 'bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-500'
          )}
          type="button"
        >
          {watchlisted ? 'Watchlisted' : 'Add Watchlist'}
        </button>
        <button className="px-3 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest bg-orange-500 text-white" type="button">
          List for Sale
        </button>
        <button
          onClick={() => setAlertEnabled((prev) => !prev)}
          className={cn(
            'px-3 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-colors',
            alertEnabled ? 'bg-emerald-500/20 text-emerald-300' : 'bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-500'
          )}
          type="button"
        >
          {alertEnabled ? 'Alerts On' : 'Alerts Off'}
        </button>
        <button
          onClick={() => setVaultLocked((prev) => !prev)}
          className={cn(
            'px-3 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-colors',
            vaultLocked ? 'bg-blue-500/20 text-blue-300' : 'bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-500'
          )}
          type="button"
        >
          {vaultLocked ? 'Vault Locked' : 'Unlock Vault'}
        </button>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <DetailLeftPanel
          card={card}
          meta={{
            displayValue,
            edition,
            serial,
            cardId,
            position,
            release,
            safeImage,
          }}
        />

        <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-white/5 rounded-3xl p-6 border border-gray-100 dark:border-white/5 shadow-sm">
              <div className="text-[10px] font-bold text-gray-400 uppercase mb-1">24h Change</div>
              <div className="text-2xl font-bold text-emerald-500">+{formatMoney(Math.max(0, Math.round(safeValue * 0.001)))}</div>
            </div>
            <div className="bg-white dark:bg-white/5 rounded-3xl p-6 border border-gray-100 dark:border-white/5 shadow-sm">
              <div className="text-[10px] font-bold text-gray-400 uppercase mb-1">Last Purchase</div>
              <div className="text-2xl font-bold">{safeHistory[0]?.price || displayValue}</div>
            </div>
            <div className="bg-white dark:bg-white/5 rounded-3xl p-6 border border-gray-100 dark:border-white/5 shadow-sm">
              <div className="text-[10px] font-bold text-gray-400 uppercase mb-1">Market Cap</div>
              <div className="text-2xl font-bold">{formatMoney(Math.max(0, Math.round(safeValue * 10.4)))}</div>
            </div>
          </div>

          {detailTab === 'Overview' && (
            <DetailOverviewPanel
              isDarkMode={isDarkMode}
              detailRange={detailRange}
              onRangeChange={setDetailRange}
              trendData={trendData}
              history={safeHistory}
            />
          )}

          {detailTab === 'Liquidity' && (
            <DetailLiquidityPanel depthData={depthData} />
          )}

          {detailTab === 'Offers' && (
            <DetailOffersPanel offers={offerInbox} />
          )}

          {detailTab === 'Security' && (
            <DetailSecurityPanel vaultLocked={vaultLocked} />
          )}

          {detailTab === 'Notes' && (
            <DetailNotesPanel
              notes={notes}
              noteInput={noteInput}
              onNoteInputChange={setNoteInput}
              onAddNote={() => {
                if (!noteInput.trim()) return;
                setNotes((prev) => [noteInput.trim(), ...prev]);
                setNoteInput('');
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
