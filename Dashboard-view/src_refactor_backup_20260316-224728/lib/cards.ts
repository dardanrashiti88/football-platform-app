import { formatMoney } from './money';

export const normalizeCardImage = (path: string) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  if (path.startsWith('../../images/')) return path;
  if (path.startsWith('../images/')) return path.replace('../images/', '../../images/');
  if (path.startsWith('./images/')) return path.replace('./images/', '../../images/');
  if (path.startsWith('images/')) return `../../${path}`;
  return path;
};

export const deriveRarity = (value: number) => {
  if (value >= 5_000_000) return 'Legendary';
  if (value >= 3_000_000) return 'Epic';
  if (value >= 1_500_000) return 'Rare';
  if (value >= 750_000) return 'Common';
  return 'Starter';
};

export const deriveCondition = (value: number) => {
  if (value >= 4_500_000) return 'PSA 10';
  if (value >= 3_000_000) return 'BGS 9.5';
  if (value >= 1_500_000) return 'PSA 9';
  return 'Mint';
};

export const buildHistory = (value: number) => {
  const base = Math.max(0, Math.round(value));
  return [
    {
      user: 'You',
      avatar: 'https://i.pravatar.cc/40?u=fodr-you',
      price: formatMoney(base),
      date: 'Today',
      action: 'Owned',
    },
    {
      user: 'Market Vault',
      avatar: 'https://i.pravatar.cc/40?u=fodr-market',
      price: formatMoney(base * 0.92),
      date: '2w ago',
      action: 'Sold to you',
    },
    {
      user: 'Scout Hub',
      avatar: 'https://i.pravatar.cc/40?u=fodr-scout',
      price: formatMoney(base * 0.85),
      date: '2mo ago',
      action: 'Sold to Market Vault',
    },
  ];
};

export const extractCardValue = (card: any) => {
  const raw = Number(card?.rawValue);
  if (Number.isFinite(raw) && raw > 0) return raw;
  const fallbackRaw = Number(card?.card_value);
  if (Number.isFinite(fallbackRaw) && fallbackRaw > 0) return fallbackRaw;
  if (typeof card?.value === 'string') {
    const parsed = Number(card.value.replace(/[$,]/g, ''));
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return Number(card?.value) || 0;
};

export const toDashboardCard = (card: any) => {
  const rawValue = Number(card.card_value ?? card.value ?? 0);
  const year = card.started ? String(card.started).slice(0, 4) : '2025';
  const edition =
    card.edition ||
    card.card_edition ||
    card.edition_name ||
    card.editionType ||
    card.edition_type ||
    card.collection ||
    card.set ||
    card.series ||
    '';

  return {
    id: Number(card.id) || Math.floor(Math.random() * 100000),
    name: card.card_name || card.name || 'Unknown Card',
    team: card.club || card.team || 'Unknown Club',
    edition: edition || `${card.club || card.team || 'Club'} Edition`,
    year,
    rarity: deriveRarity(rawValue),
    value: formatMoney(rawValue),
    rawValue,
    condition: deriveCondition(rawValue),
    image: normalizeCardImage(card.image || ''),
    ownersCount: Math.max(1, (Number(card.id) || 1) % 7 + 1),
    history: buildHistory(rawValue),
  };
};

export const buildTopCards = (cards: any[]) =>
  [...cards]
    .sort((a, b) => (b.rawValue ?? 0) - (a.rawValue ?? 0))
    .slice(0, 5)
    .map((card, index) => ({
      id: `inv-${card.id ?? index}`,
      name: card.name,
      value: card.rawValue ?? 0,
      change: '+0.0%',
      rarity: card.rarity ?? 'Elite',
      condition: card.condition ?? 'PSA 10',
      serial: `#${String((index + 1) * 3).padStart(2, '0')}/100`,
      image: card.image,
    }));

