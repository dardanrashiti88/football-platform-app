export type DashboardHistoryEntry = {
  user: string;
  avatar: string;
  price: string;
  date: string;
  action: string;
};

export type DashboardCard = {
  id: number;
  name: string;
  team: string;
  edition?: string;
  year: string;
  rarity: string;
  value: string;
  rawValue: number;
  condition: string;
  image: string;
  ownersCount: number;
  history: DashboardHistoryEntry[];
  club?: string;
};

export type TopCardSummary = {
  id: string;
  name: string;
  value: number;
  change: string;
  rarity: string;
  condition: string;
  serial: string;
  image: string;
};

