import React, { useEffect, useMemo, useState } from 'react';
import {
  BarChart3,
  BookOpen,
  Database,
  FileText,
  Settings,
  Share2,
  Sparkles,
  Star,
  TrendingUp,
  Trophy,
} from 'lucide-react';
import { cn } from './lib/cn';
import { GridLines } from './components/GridLines';
import { DashboardHeader } from './components/header/DashboardHeader';
import { Sidebar } from './components/sidebar/Sidebar';
import { postToParent } from './lib/parent';
import { useFodrUser } from './hooks/useFodrUser';
import { useInventory } from './hooks/useInventory';
import { PlaceholderView } from './views/PlaceholderView';
import { CollectionsView } from './views/collections/CollectionsView';
import { CardDatabaseView } from './views/database/CardDatabaseView';
import { CardDetailView } from './views/inventory/CardDetailView';
import { InventoryDashboardView } from './views/inventory/InventoryDashboardView';
import { MarketActivityView } from './views/market/MarketActivityView';
import { MyRealtimeOverviewView } from './views/realtime/MyRealtimeOverviewView';
import { RealtimeOverviewView } from './views/realtime/RealtimeOverviewView';
import { ReportsView } from './views/reports/ReportsView';
import { RarityIndexView } from './views/rarity/RarityIndexView';
import { SettingsView } from './views/settings/SettingsView';
import { SocialMediaView } from './views/social/SocialMediaView';
import { DataSourcesView } from './views/sources/DataSourcesView';
import { TopCardsView } from './views/top/TopCardsView';
import { TradingView } from './views/trading/TradingView';
import { WatchlistView } from './views/watchlist/WatchlistView';
import type { DashboardCard } from './types';

type ViewKey =
  | 'Realtime Overview'
  | 'My Realtime Overview'
  | 'Inventory Dashboard'
  | 'Trading'
  | 'Card Database'
  | 'Watchlist'
  | 'Market Activity'
  | 'Top Cards'
  | 'Collections'
  | 'Rarity Index'
  | 'Social Media'
  | 'Data Sources'
  | 'Reports'
  | 'Settings';

const DEFAULT_VIEW: ViewKey = 'Realtime Overview';
const VIEW_KEYS: ViewKey[] = [
  'Realtime Overview',
  'My Realtime Overview',
  'Inventory Dashboard',
  'Trading',
  'Card Database',
  'Watchlist',
  'Market Activity',
  'Top Cards',
  'Collections',
  'Rarity Index',
  'Social Media',
  'Data Sources',
  'Reports',
  'Settings',
];

const isViewKey = (value: any): value is ViewKey => VIEW_KEYS.includes(value);

const coerceUserId = (user: any | null): number | null => {
  const id = Number(user?.id);
  return Number.isFinite(id) ? id : null;
};

export default function App() {
  const [activeView, setActiveView] = useState<ViewKey>(DEFAULT_VIEW);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [selectedCard, setSelectedCard] = useState<DashboardCard | null>(null);

  const user = useFodrUser();
  const userId = useMemo(() => coerceUserId(user), [user]);
  const inventory = useInventory(userId);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      const data = (event as any)?.data;
      if (!data || typeof data !== 'object') return;
      if (data.type === 'FODR_DASHBOARD_NAVIGATE' && isViewKey(data.view)) {
        setActiveView(data.view);
        setSelectedCard(null);
      }
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, []);

  const navigate = (view: ViewKey) => {
    setActiveView(view);
    setSelectedCard(null);
  };

  const openCardDetails = (card: DashboardCard) => {
    setActiveView('Inventory Dashboard');
    setSelectedCard(card);
  };

  const bodyClass = cn(
    'min-h-screen flex transition-colors duration-500',
    isDarkMode ? 'bg-[#0a0a0a] text-white' : 'bg-gray-50 text-gray-900'
  );

  const content = (() => {
    if (activeView === 'Realtime Overview') return <RealtimeOverviewView isDarkMode={isDarkMode} />;
    if (activeView === 'My Realtime Overview') return <MyRealtimeOverviewView isDarkMode={isDarkMode} cards={inventory.cards} onCardClick={openCardDetails} />;
    if (activeView === 'Inventory Dashboard') {
      if (selectedCard) return <CardDetailView card={selectedCard} onBack={() => setSelectedCard(null)} isDarkMode={isDarkMode} />;
      return <InventoryDashboardView cards={inventory.cards} onCardClick={openCardDetails} />;
    }
    if (activeView === 'Trading') return <TradingView isDarkMode={isDarkMode} cards={inventory.cards} />;
    if (activeView === 'Card Database') return <CardDatabaseView isDarkMode={isDarkMode} cards={inventory.cards} />;
    if (activeView === 'Watchlist') return <WatchlistView isDarkMode={isDarkMode} cards={inventory.cards} />;
    if (activeView === 'Market Activity') return <MarketActivityView isDarkMode={isDarkMode} />;
    if (activeView === 'Top Cards') return <TopCardsView isDarkMode={isDarkMode} cards={inventory.cards} />;
    if (activeView === 'Collections') return <CollectionsView isDarkMode={isDarkMode} cards={inventory.cards} />;
    if (activeView === 'Rarity Index') return <RarityIndexView isDarkMode={isDarkMode} cards={inventory.cards} />;
    if (activeView === 'Reports') return <ReportsView isDarkMode={isDarkMode} />;
    if (activeView === 'Settings') return <SettingsView isDarkMode={isDarkMode} onToggleTheme={() => setIsDarkMode((prev) => !prev)} />;
    if (activeView === 'Social Media') return <SocialMediaView isDarkMode={isDarkMode} />;
    if (activeView === 'Data Sources') return <DataSourcesView isDarkMode={isDarkMode} />;

    const placeholders: Record<string, { title: string; icon: any }> = {
      'Top Cards': { title: 'Top Cards', icon: Trophy },
    };

    const fallback = placeholders[activeView] ?? { title: String(activeView), icon: Trophy };
    return <PlaceholderView title={fallback.title} icon={fallback.icon} />;
  })();

  return (
    <div className={bodyClass}>
      <GridLines />

      <Sidebar isDarkMode={isDarkMode} activeView={activeView} onNavigate={navigate} user={user} />

      <div className="flex-1 flex flex-col relative z-10">
        <DashboardHeader isDarkMode={isDarkMode} onToggleTheme={() => setIsDarkMode((prev) => !prev)} user={user} />

        {!userId && (
          <div className="px-8 pt-6">
            <div className={cn('rounded-2xl border px-4 py-3 flex items-center justify-between gap-3', isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200')}>
              <div>
                <div className="text-xs font-bold uppercase tracking-widest">Not logged in</div>
                <div className={cn('text-xs mt-1', isDarkMode ? 'text-gray-300' : 'text-gray-700')}>
                  Login in FODR to sync inventory and unlock portfolio analytics.
                </div>
              </div>
              <button
                type="button"
                onClick={() => postToParent({ type: 'FODR_OPEN_LOGIN' })}
                className="px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-widest bg-orange-500 text-white hover:bg-orange-600 active:scale-95 transition"
              >
                Open Login
              </button>
            </div>
          </div>
        )}

        {(inventory.loading || inventory.error) && (
          <div className="px-8 pt-6">
            <div className={cn('rounded-2xl border px-4 py-3 flex items-center justify-between gap-3', isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200')}>
              <div className="text-xs font-bold uppercase tracking-widest">
                {inventory.loading ? 'Syncing inventory…' : 'Inventory sync error'}
              </div>
              {inventory.error && (
                <div className="flex items-center gap-2">
                  <div className={cn('text-xs', isDarkMode ? 'text-gray-300' : 'text-gray-700')}>{inventory.error}</div>
                  <button
                    type="button"
                    onClick={inventory.reload}
                    className="px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-widest bg-orange-500 text-white hover:bg-orange-600 active:scale-95 transition"
                  >
                    Retry
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        <main className="flex-1 overflow-y-auto">{content}</main>
      </div>
    </div>
  );
}
