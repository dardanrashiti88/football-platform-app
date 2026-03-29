import React from 'react';
import { Share2, TrendingUp, Users } from 'lucide-react';
import { cn } from '../../lib/cn';
import { StatCard } from '../../components/StatCard';

type SocialMediaViewProps = {
  isDarkMode: boolean;
};

export function SocialMediaView({ isDarkMode }: SocialMediaViewProps) {
  const panelBg = isDarkMode ? 'bg-white/5' : 'bg-white';
  const panelBorder = isDarkMode ? 'border-white/10' : 'border-gray-100';
  const muted = isDarkMode ? 'text-gray-400' : 'text-gray-500';

  return (
    <div className="p-8 flex flex-col gap-8">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Social Media</h2>
          <p className={cn('text-sm', muted)}>Track community buzz and campaign performance.</p>
        </div>
        <div className={cn('px-4 py-2 rounded-2xl border text-[10px] font-bold uppercase tracking-widest', panelBg, panelBorder, muted)}>
          Beta
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard label="Mentions (24h)" value="12,840" change="+8.1%" isPositive />
        <StatCard label="Engagement" value="4.2%" change="+0.3%" isPositive />
        <StatCard label="New Followers" value="1,284" change="+2.2%" isPositive />
        <StatCard label="Trending Tag" value="#FODRPACKS" change="Hot" isPositive />
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className={cn('col-span-12 lg:col-span-7 rounded-3xl border p-6', panelBorder, panelBg)}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-500">
              <Share2 size={18} />
            </div>
            <div>
              <div className="text-sm font-bold">Campaigns</div>
              <div className={cn('text-[10px] uppercase tracking-widest', muted)}>Creator & drop promos</div>
            </div>
          </div>

          <div className="mt-5 space-y-3">
            {[
              { id: 'c1', name: 'Liverpool Edition Drop', status: 'Running', reach: '1.2M', uplift: '+14%' },
              { id: 'c2', name: 'Ultimate Icon Week', status: 'Scheduled', reach: '—', uplift: '—' },
              { id: 'c3', name: 'Marketplace Highlight', status: 'Running', reach: '620K', uplift: '+6%' },
            ].map((c) => (
              <div key={c.id} className={cn('rounded-2xl border p-4 flex items-center justify-between gap-4', panelBorder, panelBg)}>
                <div>
                  <div className="text-sm font-bold">{c.name}</div>
                  <div className={cn('text-[10px] uppercase tracking-widest', muted)}>{c.status}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-black text-orange-400">{c.reach}</div>
                  <div className={cn('text-[10px] uppercase tracking-widest', muted)}>{c.uplift}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={cn('col-span-12 lg:col-span-5 rounded-3xl border p-6', panelBorder, panelBg)}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400">
              <Users size={18} />
            </div>
            <div>
              <div className="text-sm font-bold">Community Pulse</div>
              <div className={cn('text-[10px] uppercase tracking-widest', muted)}>What people talk about</div>
            </div>
          </div>
          <div className="mt-5 space-y-3">
            {[
              { id: 'p1', label: 'Pack openings', value: 'High', icon: TrendingUp },
              { id: 'p2', label: 'Ultimate icons', value: 'Rising', icon: TrendingUp },
              { id: 'p3', label: 'Liverpool edition', value: 'Hot', icon: TrendingUp },
            ].map((p) => (
              <div key={p.id} className={cn('rounded-2xl border p-4 flex items-center justify-between', panelBorder, panelBg)}>
                <div className="text-sm font-bold">{p.label}</div>
                <div className="flex items-center gap-2 text-emerald-400 font-black">
                  <p.icon size={16} />
                  {p.value}
                </div>
              </div>
            ))}
          </div>
          <button type="button" className="mt-5 w-full px-4 py-3 rounded-2xl bg-orange-500 text-white text-sm font-black hover:bg-orange-600 transition">
            Create Campaign
          </button>
        </div>
      </div>
    </div>
  );
}

