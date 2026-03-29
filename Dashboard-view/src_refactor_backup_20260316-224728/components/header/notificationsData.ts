export type NotificationItem = {
  id: string;
  category: string;
  type: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  status: string;
  tone: 'success' | 'warning' | 'danger' | 'info' | 'neutral';
  actions?: string[];
};

export const notificationCategories = ['All', 'Trading', 'Watchlist', 'Market', 'Security', 'System'] as const;

export const notificationStatusMap: Record<string, string> = {
  Accept: 'Accepted',
  Decline: 'Declined',
  Counter: 'Counter Sent',
  Extend: 'Extended',
  Delist: 'Delisted',
  View: 'Opened',
  Review: 'Reviewed',
  'Set Floor': 'Floor Updated',
  'Add Alert': 'Alert Added',
  'Lock Down': 'Locked',
  Reschedule: 'Rescheduled',
  Open: 'Opened',
  Share: 'Shared',
  Reply: 'Replied',
  'Open Thread': 'Opened',
};

export const defaultNotifications: NotificationItem[] = [
  {
    id: 'nt-1',
    category: 'Trading',
    type: 'offer',
    title: 'New trade offer received',
    message: 'scout_master wants Isak - Liverpool Edition for $12,400 + swap.',
    time: '2m ago',
    read: false,
    status: 'Pending',
    tone: 'warning',
    actions: ['Accept', 'Counter', 'Decline'],
  },
  {
    id: 'nt-2',
    category: 'Market',
    type: 'price',
    title: 'Watchlist spike',
    message: 'Haaland - City Edition up +12.4% in the last 24h.',
    time: '6h ago',
    read: false,
    status: 'Price alert',
    tone: 'success',
    actions: ['View', 'Add Alert'],
  },
  {
    id: 'nt-3',
    category: 'System',
    type: 'sync',
    title: 'Data sources synced',
    message: 'Pricing feeds refreshed for 1,284 cards.',
    time: '2d ago',
    read: true,
    status: 'Synced',
    tone: 'success',
  },
  {
    id: 'nt-4',
    category: 'Security',
    type: 'alert',
    title: 'Geo-lock blocked attempt',
    message: 'Attempted access from Madrid blocked by Geo-lock.',
    time: 'Yesterday',
    read: false,
    status: 'Blocked',
    tone: 'danger',
    actions: ['Review', 'Lock Down'],
  },
  {
    id: 'nt-5',
    category: 'Market',
    type: 'leaderboard',
    title: 'Top cards leaderboard changed',
    message: 'Ronaldo Nazario - Ultimate Edition moved to #1 with +6.1% growth.',
    time: '2d ago',
    read: true,
    status: 'Update',
    tone: 'info',
  },
  {
    id: 'nt-6',
    category: 'Trading',
    type: 'message',
    title: 'New trade message',
    message: 'collector_x: \"Can we bundle the Mbappe card?\"',
    time: '3d ago',
    read: false,
    status: 'Message',
    tone: 'neutral',
    actions: ['Reply', 'Open Thread'],
  },
];

