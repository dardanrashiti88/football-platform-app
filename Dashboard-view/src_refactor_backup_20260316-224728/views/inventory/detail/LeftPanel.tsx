import React from 'react';
import type { DashboardCard } from '../../../types';

type DetailMeta = {
  displayValue: string;
  edition: string;
  serial: string;
  cardId: string;
  position: string;
  release: string;
  safeImage: string;
};

export function DetailLeftPanel({ card, meta }: { card: DashboardCard; meta: DetailMeta }) {
  return (
    <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
      <div className="bg-white dark:bg-white/5 rounded-3xl overflow-hidden border border-gray-100 dark:border-white/5 shadow-sm">
        <div className="h-[420px] flex items-center justify-center bg-black/20">
          {meta.safeImage ? (
            <img src={meta.safeImage} alt={card.name} className="w-full h-full object-contain" />
          ) : (
            <div className="text-xs font-bold uppercase tracking-widest text-gray-400">No Image</div>
          )}
        </div>
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <span className="text-[10px] font-bold px-2 py-1 bg-orange-500 text-white rounded-lg uppercase tracking-wider">{card.rarity}</span>
            <span className="text-xl font-bold text-orange-500">{meta.displayValue}</span>
          </div>
          <h3 className="text-2xl font-bold mb-1">{card.name}</h3>
          <p className="text-gray-500 mb-6">
            {card.team} • {card.year} Season
          </p>

          <div className="grid grid-cols-2 gap-4">
            {[
              ['Edition', meta.edition],
              ['Release', meta.release],
              ['Card ID', meta.cardId],
              ['Serial', meta.serial],
              ['Position', meta.position],
              ['Condition', card.condition || 'Mint'],
              ['Prev. Owners', String(card.ownersCount ?? 1)],
              ['Status', 'Owned'],
            ].map(([label, value]) => (
              <div key={label} className="bg-gray-50 dark:bg-white/5 p-3 rounded-2xl">
                <div className="text-[10px] text-gray-400 font-bold uppercase mb-1">{label}</div>
                <div className="font-bold">{value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-white/5 rounded-3xl p-6 border border-gray-100 dark:border-white/5 shadow-sm">
        <h4 className="font-bold mb-4">Ownership Provenance</h4>
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">Authenticity Score</span>
            <span className="text-sm font-bold text-emerald-500">Verified 100%</span>
          </div>
          <div className="w-full h-2 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 w-full" />
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">Chain of Custody</span>
            <span className="text-sm font-bold text-orange-500">Complete</span>
          </div>
        </div>
      </div>
    </div>
  );
}

