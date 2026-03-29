import React from 'react';
import { MoreHorizontal } from 'lucide-react';
import { hashString, getInitials } from '../../lib/user';
import { chartPalette } from '../../lib/palette';

type SidebarUserCardProps = {
  user: any | null;
};

export function SidebarUserCard({ user }: SidebarUserCardProps) {
  const seed = String(user?.username || user?.email || 'guest').toLowerCase();
  const hash = hashString(seed);
  const avatarA = chartPalette[hash % chartPalette.length];
  const avatarB = chartPalette[(hash + 3) % chartPalette.length];
  const initials = getInitials(user);
  const username = String(user?.username || '').trim();
  const displayUser = username ? username.toUpperCase() : 'LOGIN';

  return (
    <div className="p-4">
      <div className="bg-gray-100 dark:bg-white/5 rounded-2xl p-4 flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-white font-black text-xs shadow-lg"
          style={{ backgroundImage: `linear-gradient(135deg, ${avatarA}, ${avatarB})` }}
          aria-hidden="true"
        >
          {initials}
        </div>
        <div className="flex-1 overflow-hidden">
          <p className="text-sm font-bold truncate">{displayUser}</p>
          <p className="text-[10px] text-gray-400 truncate">{user?.id ? 'Connected Account' : 'Not logged in'}</p>
        </div>
        <button className="text-gray-400 hover:text-orange-500 transition-colors" type="button">
          <MoreHorizontal size={18} />
        </button>
      </div>
    </div>
  );
}

