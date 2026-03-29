import React from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../lib/cn';

type SidebarItemProps = {
  icon: React.ElementType;
  label: string;
  active?: boolean;
  hasSubmenu?: boolean;
  badge?: string;
  onClick?: () => void;
};

export function SidebarItem({ icon: Icon, label, active = false, hasSubmenu = false, badge, onClick }: SidebarItemProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'flex items-center justify-between px-4 py-2.5 cursor-pointer transition-all duration-200 group rounded-xl mb-0.5',
        active
          ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
          : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-gray-200'
      )}
    >
      <div className="flex items-center gap-3">
        <Icon size={18} className={cn(active ? 'text-white' : 'text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-200')} />
        <span className="text-[13px] font-medium">{label}</span>
      </div>
      <div className="flex items-center gap-2">
        {badge && <span className="bg-orange-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">{badge}</span>}
        {hasSubmenu && <ChevronDown size={14} className={cn(active ? 'text-white' : 'opacity-50')} />}
      </div>
    </div>
  );
}

