import React from 'react';
import {
  Activity,
  BarChart3,
  BookOpen,
  Database,
  FileText,
  Layers,
  LayoutGrid,
  Settings,
  Share2,
  Sparkles,
  Star,
  TrendingUp,
  Trophy,
  Wallet,
} from 'lucide-react';
import { cn } from '../../lib/cn';
import { SidebarBrand } from './SidebarBrand';
import { SidebarItem } from './SidebarItem';
import { SidebarUserCard } from './SidebarUserCard';

type SidebarProps = {
  isDarkMode: boolean;
  activeView: string;
  onNavigate: (view: string) => void;
  user: any | null;
};

export function Sidebar({ isDarkMode, activeView, onNavigate, user }: SidebarProps) {
  const groups: Array<{ title: string; items: Array<{ label: string; view: string; icon: React.ElementType; badge?: string }> }> = [
    {
      title: 'Intelligence',
      items: [
        { label: 'Realtime Overview', view: 'Realtime Overview', icon: Activity },
        { label: 'My Realtime Overview', view: 'My Realtime Overview', icon: Wallet },
      ],
    },
    {
      title: 'Portfolio',
      items: [
        { label: 'Inventory Dashboard', view: 'Inventory Dashboard', icon: LayoutGrid },
        { label: 'Trading', view: 'Trading', icon: TrendingUp },
      ],
    },
    {
      title: 'Market',
      items: [
        { label: 'Card Database', view: 'Card Database', icon: BookOpen },
        { label: 'Watchlist', view: 'Watchlist', icon: Star },
        { label: 'Market Activity', view: 'Market Activity', icon: BarChart3 },
        { label: 'Top Cards', view: 'Top Cards', icon: Trophy },
      ],
    },
    {
      title: 'Collections',
      items: [
        { label: 'Collections', view: 'Collections', icon: Layers },
        { label: 'Rarity Index', view: 'Rarity Index', icon: Sparkles },
      ],
    },
    {
      title: 'Marketing',
      items: [
        { label: 'Social Media', view: 'Social Media', icon: Share2, badge: 'New' },
        { label: 'Data Sources', view: 'Data Sources', icon: Database },
      ],
    },
  ];

  return (
    <aside
      className={cn(
        'w-64 border-r flex flex-col z-10 transition-colors duration-500',
        isDarkMode ? 'bg-[#0a0a0a] border-white/5' : 'bg-white border-gray-200'
      )}
    >
      <SidebarBrand />

      <nav className="flex-1 px-4 py-4 overflow-y-auto">
        {groups.map((group) => (
          <div key={group.title} className="mb-6">
            <p className="px-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">{group.title}</p>
            {group.items.map((item) => (
              <SidebarItem
                key={item.view}
                icon={item.icon}
                label={item.label}
                badge={item.badge}
                active={activeView === item.view}
                onClick={() => onNavigate(item.view)}
              />
            ))}
          </div>
        ))}

        <div className="mt-auto pt-6 border-t border-gray-100 dark:border-white/5">
          <SidebarItem icon={FileText} label="Reports" active={activeView === 'Reports'} onClick={() => onNavigate('Reports')} />
          <SidebarItem icon={Settings} label="Settings" active={activeView === 'Settings'} onClick={() => onNavigate('Settings')} />
        </div>
      </nav>

      <SidebarUserCard user={user} />
    </aside>
  );
}

