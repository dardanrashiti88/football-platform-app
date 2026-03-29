import React from 'react';
import { cn } from '../lib/cn';
import { chartPalette } from '../lib/palette';
import { hashString, getInitials } from '../lib/user';

type UserBadgeProps = {
  user: any | null;
  isDarkMode: boolean;
  onLoginClick?: () => void;
};

export function UserBadge({ user, isDarkMode, onLoginClick }: UserBadgeProps) {
  const seed = String(user?.username || user?.email || 'guest').toLowerCase();
  const hash = hashString(seed);
  const avatarA = chartPalette[hash % chartPalette.length];
  const avatarB = chartPalette[(hash + 3) % chartPalette.length];
  const initials = getInitials(user);
  const username = String(user?.username || '').trim();
  const displayUser = username ? username.toUpperCase() : 'LOGIN';

  return (
    <button
      type="button"
      onClick={() => {
        if (user?.id) return;
        onLoginClick?.();
      }}
      className={cn(
        'flex items-center gap-3 pl-3 pr-4 py-2.5 rounded-2xl border transition-all shadow-sm active:scale-[0.99]',
        isDarkMode ? 'bg-white/5 border-white/10 text-gray-200 hover:border-orange-500/40' : 'bg-gray-100 border-gray-200 text-gray-800 hover:border-orange-500/40'
      )}
      aria-label={user?.username ? `Profile ${user.username}` : 'Login'}
      title={user?.email ? user.email : 'Sign in to sync your inventory'}
    >
      <div className="relative">
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center text-white font-black text-xs shadow-lg"
          style={{ backgroundImage: `linear-gradient(135deg, ${avatarA}, ${avatarB})` }}
        >
          {initials}
        </div>
        <span
          className={cn(
            'absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2',
            isDarkMode ? 'border-[#0a0a0a]' : 'border-white',
            user?.id ? 'bg-emerald-500' : 'bg-gray-400'
          )}
          aria-hidden="true"
        />
      </div>
      <div className="flex flex-col items-start leading-tight">
        <span className={cn('text-[10px] font-bold uppercase tracking-widest', isDarkMode ? 'text-gray-400' : 'text-gray-500')}>Profile</span>
        <span className="text-sm font-black tracking-tight">{displayUser}</span>
      </div>
    </button>
  );
}

