import React, { useMemo, useState } from 'react';
import { ArrowUpRight, MessageSquare, Shield, TrendingUp, Users } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../../lib/cn';
import { extractCardValue } from '../../lib/cards';
import { formatMoney } from '../../lib/money';
import type { DashboardCard } from '../../types';

type TradingViewProps = {
  isDarkMode: boolean;
  cards: DashboardCard[];
};

type Offer = {
  id: string;
  from: string;
  cardName: string;
  type: string;
  price: number;
  status: 'New' | 'Review' | 'Counter' | 'Accepted' | 'Declined';
  time: string;
};

const buildOffers = (cards: DashboardCard[]): Offer[] => {
  const top = [...cards].sort((a, b) => extractCardValue(b) - extractCardValue(a)).slice(0, 3);
  const baseNames = top.length ? top.map((c) => c.name) : ['Alexander Isak', 'Mohamed Salah', 'Virgil van Dijk'];
  return [
    { id: 'off-1', from: 'scout_master', cardName: baseNames[0], type: 'Swap + Cash', price: 2_650_000, status: 'New', time: '2m ago' },
    { id: 'off-2', from: 'vault_prime', cardName: baseNames[1] ?? baseNames[0], type: 'Direct Buy', price: 2_420_000, status: 'Review', time: '18m ago' },
    { id: 'off-3', from: 'legacy_fund', cardName: baseNames[2] ?? baseNames[0], type: 'Auction Bid', price: 2_550_000, status: 'Counter', time: '1h ago' },
    { id: 'off-4', from: 'collector_x', cardName: baseNames[0], type: 'Direct Buy', price: 2_100_000, status: 'Declined', time: 'Yesterday' },
  ];
};

export function TradingView({ isDarkMode, cards }: TradingViewProps) {
  const panelBg = isDarkMode ? 'bg-white/5' : 'bg-white';
  const panelBorder = isDarkMode ? 'border-white/10' : 'border-gray-100';
  const muted = isDarkMode ? 'text-gray-400' : 'text-gray-500';

  const [selected, setSelected] = useState<string>('off-1');
  const offers = useMemo(() => buildOffers(cards), [cards]);
  const selectedOffer = offers.find((o) => o.id === selected) ?? offers[0];

  const stats = useMemo(() => {
    const active = offers.filter((o) => o.status === 'New' || o.status === 'Review' || o.status === 'Counter').length;
    const accepted = offers.filter((o) => o.status === 'Accepted').length;
    const declined = offers.filter((o) => o.status === 'Declined').length;
    const successRate = active + accepted + declined ? Math.round((accepted / (accepted + declined + active)) * 100) : 0;
    return { active, accepted, declined, successRate };
  }, [offers]);

  const statusChip = (status: Offer['status']) => {
    if (status === 'New') return 'bg-orange-500/20 text-orange-300';
    if (status === 'Review') return 'bg-blue-500/20 text-blue-300';
    if (status === 'Counter') return 'bg-purple-500/20 text-purple-300';
    if (status === 'Accepted') return 'bg-emerald-500/20 text-emerald-300';
    return 'bg-red-500/20 text-red-300';
  };

  return (
    <div className="p-8 flex flex-col gap-8">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Trading</h2>
          <p className={cn('text-sm', muted)}>Offers, escrow status, and quick actions.</p>
        </div>
        <motion.button
          type="button"
          whileTap={{ scale: 0.98 }}
          className="px-5 py-3 rounded-2xl bg-orange-500 text-white text-sm font-black hover:bg-orange-600 transition"
        >
          Create Listing
        </motion.button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className={cn('rounded-3xl border p-6', panelBorder, panelBg)}>
          <div className={cn('text-[10px] uppercase tracking-widest', muted)}>Active Offers</div>
          <div className="text-4xl font-black tracking-tighter mt-1">{stats.active}</div>
        </div>
        <div className={cn('rounded-3xl border p-6', panelBorder, panelBg)}>
          <div className={cn('text-[10px] uppercase tracking-widest', muted)}>Escrow Protected</div>
          <div className="text-4xl font-black tracking-tighter mt-1">Yes</div>
        </div>
        <div className={cn('rounded-3xl border p-6', panelBorder, panelBg)}>
          <div className={cn('text-[10px] uppercase tracking-widest', muted)}>Accepted</div>
          <div className="text-4xl font-black tracking-tighter mt-1">{stats.accepted}</div>
        </div>
        <div className={cn('rounded-3xl border p-6', panelBorder, panelBg)}>
          <div className={cn('text-[10px] uppercase tracking-widest', muted)}>Success Rate</div>
          <div className="text-4xl font-black tracking-tighter mt-1">{stats.successRate}%</div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className={cn('col-span-12 lg:col-span-7 rounded-3xl border overflow-hidden', panelBorder, panelBg)}>
          <div className={cn('px-6 py-4 border-b flex items-center justify-between', panelBorder)}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-500">
                <TrendingUp size={18} />
              </div>
              <div>
                <div className="text-sm font-bold">Offer Inbox</div>
                <div className={cn('text-[10px] uppercase tracking-widest', muted)}>Click an offer to inspect</div>
              </div>
            </div>
            <div className={cn('text-[10px] uppercase tracking-widest', muted)}>{offers.length} total</div>
          </div>

          <div className="divide-y divide-white/5">
            {offers.map((offer) => (
              <button
                key={offer.id}
                type="button"
                onClick={() => setSelected(offer.id)}
                className={cn(
                  'w-full text-left px-6 py-4 flex items-center justify-between gap-4 hover:bg-white/5 transition',
                  selected === offer.id && 'bg-white/5'
                )}
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <div className="text-sm font-bold truncate">{offer.cardName}</div>
                    <span className={cn('px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest', statusChip(offer.status))}>{offer.status}</span>
                  </div>
                  <div className={cn('text-[10px] uppercase tracking-widest truncate', muted)}>
                    From {offer.from} · {offer.type}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-black text-orange-400">{formatMoney(offer.price)}</div>
                  <div className={cn('text-[10px] uppercase tracking-widest', muted)}>{offer.time}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="col-span-12 lg:col-span-5 flex flex-col gap-6">
          <div className={cn('rounded-3xl border p-6', panelBorder, panelBg)}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                <Shield size={18} />
              </div>
              <div>
                <div className="text-sm font-bold">Offer Details</div>
                <div className={cn('text-[10px] uppercase tracking-widest', muted)}>Review and respond</div>
              </div>
            </div>

            <div className="mt-5 space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className={muted}>From</span>
                <span className="font-bold">{selectedOffer.from}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className={muted}>Type</span>
                <span className="font-bold">{selectedOffer.type}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className={muted}>Price</span>
                <span className="font-black text-orange-400">{formatMoney(selectedOffer.price)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className={muted}>Escrow</span>
                <span className="font-bold text-emerald-400">Protected</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-2">
              <motion.button whileTap={{ scale: 0.98 }} type="button" className="px-3 py-2 rounded-2xl bg-emerald-500/20 text-emerald-200 text-[10px] font-black uppercase tracking-widest">
                Accept
              </motion.button>
              <motion.button whileTap={{ scale: 0.98 }} type="button" className={cn('px-3 py-2 rounded-2xl border text-[10px] font-black uppercase tracking-widest', panelBorder, panelBg, muted)}>
                Counter
              </motion.button>
              <motion.button whileTap={{ scale: 0.98 }} type="button" className="px-3 py-2 rounded-2xl bg-red-500/20 text-red-200 text-[10px] font-black uppercase tracking-widest">
                Decline
              </motion.button>
            </div>
          </div>

          <div className={cn('rounded-3xl border p-6', panelBorder, panelBg)}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                <Users size={18} />
              </div>
              <div>
                <div className="text-sm font-bold">Trade Chat</div>
                <div className={cn('text-[10px] uppercase tracking-widest', muted)}>Secure messaging</div>
              </div>
            </div>
            <div className={cn('mt-4 rounded-2xl border p-4 text-sm', panelBorder, panelBg, muted)}>
              <div className="flex items-center gap-2">
                <MessageSquare size={16} />
                <span>Chat opens when you select an offer.</span>
              </div>
            </div>
            <button type="button" className="mt-4 w-full px-4 py-3 rounded-2xl bg-orange-500 text-white text-sm font-black hover:bg-orange-600 transition flex items-center justify-center gap-2">
              <ArrowUpRight size={18} />
              Open Thread
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

