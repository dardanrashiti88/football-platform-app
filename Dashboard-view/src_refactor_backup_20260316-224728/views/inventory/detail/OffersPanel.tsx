import React from 'react';

export function DetailOffersPanel({ offers }: { offers: Array<{ id: string; from: string; type: string; price: string; status: string }> }) {
  return (
    <div className="bg-white dark:bg-white/5 rounded-3xl p-6 border border-gray-100 dark:border-white/5 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h4 className="font-bold">Offer Inbox</h4>
        <button className="text-[10px] uppercase tracking-widest text-gray-400" type="button">
          View All
        </button>
      </div>
      <div className="space-y-4">
        {offers.map((offer) => (
          <div key={offer.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-white/5 rounded-2xl">
            <div>
              <div className="text-sm font-bold">@{offer.from}</div>
              <div className="text-[10px] text-gray-400 uppercase tracking-widest">{offer.type}</div>
            </div>
            <div className="text-right">
              <div className="text-sm font-bold text-orange-500">{offer.price}</div>
              <div className="text-[10px] text-gray-400 uppercase tracking-widest">{offer.status}</div>
            </div>
            <button className="px-3 py-2 rounded-xl bg-emerald-500 text-[10px] font-bold uppercase tracking-widest text-white" type="button">
              Accept
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

