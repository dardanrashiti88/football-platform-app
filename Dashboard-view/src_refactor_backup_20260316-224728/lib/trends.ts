import { chartPalette } from './palette';
import { extractCardValue } from './cards';
import { hashString } from './user';

export type TrendSeries = {
  key: string;
  label: string;
  color: string;
  card: any;
};

export const buildTrendSeries = (cards: any[]): TrendSeries[] =>
  cards.map((card, index) => ({
    key: `card_${card.id ?? index}`,
    label: card.name || 'Card',
    color: chartPalette[index % chartPalette.length],
    card,
  }));

const seeded = (seed: string, index: number) => {
  const base = hashString(`${seed}:${index}`);
  return (base % 1000) / 1000;
};

export const buildTrendData = (labels: string[], series: TrendSeries[]) =>
  labels.map((label, index) => {
    const entry: Record<string, any> = { name: label };
    series.forEach((item) => {
      const base = extractCardValue(item.card) / 1_000_000 || 0.5;
      const wobble = (seeded(item.key, index) - 0.5) * 0.9;
      entry[item.key] = Number((base + wobble).toFixed(2));
    });
    return entry;
  });

export const rangeLabels = {
  months: ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'],
  weeks: ['W1', 'W2', 'W3', 'W4', 'W5'],
  days: ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'],
};

