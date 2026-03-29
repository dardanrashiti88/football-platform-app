import React from 'react';
import { Bell, Moon, Plus, Search, Sun } from 'lucide-react';
import { cn } from '../../lib/cn';
import { postToParent } from '../../lib/parent';
import { UserBadge } from '../UserBadge';
import { NotificationsPopover } from './NotificationsPopover';

type DashboardHeaderProps = {
  isDarkMode: boolean;
  onToggleTheme: () => void;
  user: any | null;
};

export function DashboardHeader({ isDarkMode, onToggleTheme, user }: DashboardHeaderProps) {
  return (
    <header
      className={cn(
        'h-20 border-b flex items-center justify-between px-8 transition-colors duration-500',
        isDarkMode ? 'bg-[#0a0a0a]/80 border-white/5' : 'bg-white/80 border-gray-200',
        'backdrop-blur-xl sticky top-0'
      )}
    >
      <div className="flex items-center gap-4 flex-1">
        <div className="relative w-96">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search assets, users, or reports..."
            className="w-full pl-12 pr-4 py-2.5 bg-gray-100 dark:bg-white/5 border-none rounded-2xl text-sm focus:ring-2 focus:ring-orange-500/20 transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={onToggleTheme}
          className="p-3 bg-gray-100 dark:bg-white/5 rounded-2xl text-gray-500 hover:text-orange-500 transition-all hover:rotate-12"
          type="button"
          aria-label="Toggle theme"
        >
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <NotificationsPopover isDarkMode={isDarkMode} />

        <div className="h-8 w-[1px] bg-gray-200 dark:bg-white/10 mx-2" />
        <button className="flex items-center gap-2 px-4 py-2.5 bg-orange-500 text-white rounded-2xl text-sm font-bold hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/20 active:scale-95" type="button">
          <Plus size={18} />
          <span>New Action</span>
        </button>

        <UserBadge
          user={user}
          isDarkMode={isDarkMode}
          onLoginClick={() => postToParent({ type: 'FODR_OPEN_LOGIN' })}
        />
      </div>
    </header>
  );
}

