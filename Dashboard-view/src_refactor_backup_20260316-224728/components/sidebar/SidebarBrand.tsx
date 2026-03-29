import React from 'react';
import { X } from 'lucide-react';
import { postToParent } from '../../lib/parent';

export function SidebarBrand() {
  return (
    <div className="p-6 flex items-center gap-3">
      <div className="w-10 h-10 rounded-2xl flex items-center justify-center bg-white/5 border border-white/10 shadow-lg">
        <img src="../../images/web-logo/CUSTOM~1.PNG" alt="FODR logo" className="w-9 h-9 object-contain" loading="lazy" />
      </div>
      <div className="flex items-center gap-2">
        <span className="font-black text-xl tracking-tighter uppercase">FODR</span>
        <button
          type="button"
          onClick={() => postToParent({ type: 'FODR_DASHBOARD_CLOSE' })}
          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full border border-white/10 bg-white/5 text-[10px] font-bold uppercase tracking-widest text-gray-300 hover:text-white hover:bg-orange-500/20 transition"
        >
          <X size={12} />
          Close
        </button>
      </div>
    </div>
  );
}

