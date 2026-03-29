import React, { useMemo, useState } from 'react';
import {
  AlertCircle,
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  Bell,
  CheckCircle2,
  Database,
  FileText,
  Megaphone,
  MessageSquare,
  Shield,
  Star,
  Trophy,
  TrendingUp,
} from 'lucide-react';
import { cn } from '../../lib/cn';
import { defaultNotifications, notificationCategories, notificationStatusMap, type NotificationItem } from './notificationsData';

export function NotificationsPopover({ isDarkMode }: { isDarkMode: boolean }) {
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState('All');
  const [unreadOnly, setUnreadOnly] = useState(false);
  const [items, setItems] = useState<NotificationItem[]>(() => defaultNotifications);

  const categories = notificationCategories;
  const unreadCount = items.filter((item) => !item.read).length;
  const filtered = useMemo(() => {
    return items.filter((item) => {
      const matchesCategory = filter === 'All' || item.category === filter;
      const matchesUnread = !unreadOnly || !item.read;
      return matchesCategory && matchesUnread;
    });
  }, [items, filter, unreadOnly]);

  const iconMap: Record<string, React.ElementType> = {
    offer: ArrowUpRight,
    counter: ArrowDownRight,
    accepted: CheckCircle2,
    declined: AlertCircle,
    escrow: Shield,
    insurance: Shield,
    listing: Megaphone,
    price: TrendingUp,
    watch: Star,
    market: BarChart3,
    security: Shield,
    alert: AlertCircle,
    system: FileText,
    sync: Database,
    leaderboard: Trophy,
    message: MessageSquare,
  };

  const toneClass = (tone: string) => {
    if (tone === 'success') return 'bg-emerald-500/10 text-emerald-400';
    if (tone === 'warning') return 'bg-orange-500/10 text-orange-400';
    if (tone === 'danger') return 'bg-red-500/10 text-red-400';
    if (tone === 'info') return 'bg-blue-500/10 text-blue-400';
    return isDarkMode ? 'bg-white/5 text-gray-300' : 'bg-gray-100 text-gray-600';
  };

  const updateNotification = (id: string, updates: Partial<NotificationItem>) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, ...updates } : item)));
  };

  const markAllRead = () => setItems((prev) => prev.map((item) => ({ ...item, read: true })));
  const clearRead = () => setItems((prev) => prev.filter((item) => !item.read));

  const handleAction = (id: string, action: string) => {
    updateNotification(id, { status: notificationStatusMap[action] ?? action, read: true, time: 'Just now' });
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="p-3 bg-gray-100 dark:bg-white/5 rounded-2xl text-gray-500 hover:text-orange-500 transition-all relative"
        type="button"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-orange-500 text-white text-[10px] font-bold flex items-center justify-center border-2 border-white dark:border-[#0a0a0a]">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div
          className={cn(
            'absolute right-0 mt-4 w-[420px] max-w-[90vw] rounded-3xl border shadow-2xl z-30 overflow-hidden',
            isDarkMode ? 'bg-[#0b0b0b] border-white/10' : 'bg-white border-gray-200'
          )}
        >
          <div className="p-5 border-b border-white/5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-sm font-bold">Notifications</div>
                <div className={cn('text-[10px] uppercase tracking-widest', isDarkMode ? 'text-gray-400' : 'text-gray-500')}>
                  {unreadCount} unread · {items.length} total
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={markAllRead}
                  className={cn(
                    'px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-widest',
                    isDarkMode ? 'bg-white/5 border border-white/10 text-gray-300' : 'bg-gray-100 border border-gray-200 text-gray-600'
                  )}
                  type="button"
                >
                  Mark all read
                </button>
                <button
                  onClick={clearRead}
                  className={cn(
                    'px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-widest',
                    isDarkMode ? 'bg-white/5 border border-white/10 text-gray-300' : 'bg-gray-100 border border-gray-200 text-gray-600'
                  )}
                  type="button"
                >
                  Clear read
                </button>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {categories.map((category) => {
                const count = category === 'All' ? items.length : items.filter((item) => item.category === category).length;
                return (
                  <button
                    key={category}
                    onClick={() => setFilter(category)}
                    className={cn(
                      'px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-colors',
                      filter === category ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20' : cn(isDarkMode ? 'bg-white/5 text-gray-300' : 'bg-gray-100 text-gray-600')
                    )}
                    type="button"
                  >
                    {category} · {count}
                  </button>
                );
              })}
              <button
                onClick={() => setUnreadOnly((prev) => !prev)}
                className={cn(
                  'px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest',
                  unreadOnly ? 'bg-emerald-500/20 text-emerald-300' : cn(isDarkMode ? 'bg-white/5 text-gray-300' : 'bg-gray-100 text-gray-600')
                )}
                type="button"
              >
                Unread only
              </button>
            </div>
          </div>

          <div className="max-h-[420px] overflow-y-auto">
            {filtered.length === 0 ? (
              <div className={cn('px-5 py-10 text-center text-sm', isDarkMode ? 'text-gray-400' : 'text-gray-500')}>No notifications match your filters.</div>
            ) : (
              <div className="p-4 space-y-3">
                {filtered.map((item) => {
                  const Icon = iconMap[item.type] ?? Bell;
                  return (
                    <div
                      key={item.id}
                      className={cn(
                        'rounded-2xl border p-4 transition-colors cursor-pointer',
                        isDarkMode ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200',
                        !item.read && 'ring-1 ring-orange-500/40'
                      )}
                      onClick={() => updateNotification(item.id, { read: true })}
                    >
                      <div className="flex items-start gap-3">
                        <div className={cn('h-10 w-10 rounded-2xl flex items-center justify-center', toneClass(item.tone))}>
                          <Icon size={18} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <div className="text-sm font-bold">{item.title}</div>
                            <span className={cn('text-[10px] font-bold uppercase tracking-widest', isDarkMode ? 'text-gray-400' : 'text-gray-500')}>{item.time}</span>
                          </div>
                          <p className={cn('text-xs mt-1', isDarkMode ? 'text-gray-400' : 'text-gray-500')}>{item.message}</p>
                          <div className="mt-3 flex flex-wrap items-center gap-2">
                            <span className={cn('px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest', toneClass(item.tone))}>{item.status}</span>
                            {!item.read && <span className="px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest bg-orange-500/10 text-orange-400">New</span>}
                          </div>
                          {item.actions && (
                            <div className="mt-3 flex flex-wrap gap-2">
                              {item.actions.map((action) => (
                                <button
                                  key={action}
                                  onClick={(event) => {
                                    event.stopPropagation();
                                    handleAction(item.id, action);
                                  }}
                                  className={cn(
                                    'px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-colors',
                                    action === 'Decline' || action === 'Delist'
                                      ? 'bg-red-500/20 text-red-300'
                                      : action === 'Accept'
                                        ? 'bg-emerald-500/20 text-emerald-300'
                                        : cn(isDarkMode ? 'bg-white/5 border border-white/10 text-gray-300' : 'bg-white border border-gray-200 text-gray-600')
                                  )}
                                  type="button"
                                >
                                  {action}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
