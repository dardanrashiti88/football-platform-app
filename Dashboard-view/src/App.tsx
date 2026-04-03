/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import sharedCardPricesData from '@shared/card-prices.json';
import { 
  Search, Bell, Globe, LayoutGrid, BarChart3, Megaphone, 
  Share2, Database, FileText, Settings, ChevronDown, 
  MoreHorizontal, ArrowUpRight, ArrowDownRight, Users, ExternalLink,
  Sun, Moon, Trash2, Mail, MessageSquare, Clock, ArrowLeft,
  TrendingUp, TrendingDown, Activity, Zap, Shield, Wallet,
  Filter, Plus, Minus, Info, CheckCircle2, AlertCircle,
  BookOpen, Star, Trophy, Layers, Sparkles
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, AreaChart, Area, BarChart, Bar, Cell
} from 'recharts';
import { motion, AnimatePresence } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const emitDashboardAction = (message: string) => {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(
    new CustomEvent('fodr-dashboard-action', {
      detail: {
        message,
        timestamp: Date.now(),
      },
    }),
  );
};

const sharedCardPrices =
  sharedCardPricesData && typeof sharedCardPricesData === 'object' && 'cards' in sharedCardPricesData
    ? (sharedCardPricesData.cards as Record<string, { value?: number; sell?: number }>)
    : {};

const getSharedPriceKey = (name: string, club: string) =>
  `${String(name || '').trim().toLowerCase()}::${String(club || '').trim().toLowerCase()}`;

const getSharedPriceValue = (name: string, club: string, fallbackValue: number) => {
  const override = sharedCardPrices[getSharedPriceKey(name, club)];
  if (Number.isFinite(Number(override?.value))) {
    return Number(override?.value);
  }
  return Number(fallbackValue || 0);
};

// --- Mock Data ---

const seedNow = Date.now();
const hourMs = 60 * 60 * 1000;
const dayMs = 24 * hourMs;

const trendDataYears = [
  { name: '2020', 'Isak - Liverpool Edition': 2.1, 'Messi - Barcelona Edition': 25.0, 'Ronaldo - Real Edition': 15.0, 'Ronaldo - Brazil Edition': 18.0, 'Neymar - Brazil Edition': 22.0, 'Pele - Brazil Edition': 30.0 },
  { name: '2021', 'Isak - Liverpool Edition': 3.5, 'Messi - Barcelona Edition': 22.0, 'Ronaldo - Real Edition': 12.0, 'Ronaldo - Brazil Edition': 17.5, 'Neymar - Brazil Edition': 20.0, 'Pele - Brazil Edition': 30.0 },
  { name: '2022', 'Isak - Liverpool Edition': 5.0, 'Messi - Barcelona Edition': 18.0, 'Ronaldo - Real Edition': 10.0, 'Ronaldo - Brazil Edition': 17.0, 'Neymar - Brazil Edition': 18.0, 'Pele - Brazil Edition': 30.0 },
  { name: '2023', 'Isak - Liverpool Edition': 7.2, 'Messi - Barcelona Edition': 15.0, 'Ronaldo - Real Edition': 8.5, 'Ronaldo - Brazil Edition': 16.5, 'Neymar - Brazil Edition': 16.0, 'Pele - Brazil Edition': 30.0 },
  { name: '2024', 'Isak - Liverpool Edition': 8.0, 'Messi - Barcelona Edition': 19.0, 'Ronaldo - Real Edition': 7.5, 'Ronaldo - Brazil Edition': 16.0, 'Neymar - Brazil Edition': 15.0, 'Pele - Brazil Edition': 30.0 },
  { name: '2025', 'Isak - Liverpool Edition': 8.7, 'Messi - Barcelona Edition': 20.0, 'Ronaldo - Real Edition': 7.1, 'Ronaldo - Brazil Edition': 15.5, 'Neymar - Brazil Edition': 14.0, 'Pele - Brazil Edition': 30.0 },
  { name: '2026', 'Isak - Liverpool Edition': 9.2, 'Messi - Barcelona Edition': 21.0, 'Ronaldo - Real Edition': 7.3, 'Ronaldo - Brazil Edition': 15.0, 'Neymar - Brazil Edition': 13.0, 'Pele - Brazil Edition': 30.0 },
];

const trendDataMonths = [
  { name: 'JUN', 'Isak - Liverpool Edition': 8.2, 'Messi - Barcelona Edition': 18.5, 'Ronaldo - Real Edition': 6.8, 'Ronaldo - Brazil Edition': 15.2, 'Neymar - Brazil Edition': 13.5, 'Pele - Brazil Edition': 30.0 },
  { name: 'JUL', 'Isak - Liverpool Edition': 7.6, 'Messi - Barcelona Edition': 19.6, 'Ronaldo - Real Edition': 7.4, 'Ronaldo - Brazil Edition': 14.3, 'Neymar - Brazil Edition': 14.1, 'Pele - Brazil Edition': 28.8 },
  { name: 'AUG', 'Isak - Liverpool Edition': 9.1, 'Messi - Barcelona Edition': 18.2, 'Ronaldo - Real Edition': 6.6, 'Ronaldo - Brazil Edition': 16.1, 'Neymar - Brazil Edition': 12.7, 'Pele - Brazil Edition': 31.4 },
  { name: 'SEP', 'Isak - Liverpool Edition': 8.4, 'Messi - Barcelona Edition': 20.1, 'Ronaldo - Real Edition': 7.9, 'Ronaldo - Brazil Edition': 15.0, 'Neymar - Brazil Edition': 13.9, 'Pele - Brazil Edition': 29.2 },
  { name: 'OCT', 'Isak - Liverpool Edition': 9.6, 'Messi - Barcelona Edition': 19.0, 'Ronaldo - Real Edition': 6.9, 'Ronaldo - Brazil Edition': 16.4, 'Neymar - Brazil Edition': 12.4, 'Pele - Brazil Edition': 32.0 },
  { name: 'NOV', 'Isak - Liverpool Edition': 8.8, 'Messi - Barcelona Edition': 20.6, 'Ronaldo - Real Edition': 7.6, 'Ronaldo - Brazil Edition': 14.6, 'Neymar - Brazil Edition': 13.6, 'Pele - Brazil Edition': 30.1 },
  { name: 'DEC', 'Isak - Liverpool Edition': 9.4, 'Messi - Barcelona Edition': 19.4, 'Ronaldo - Real Edition': 7.2, 'Ronaldo - Brazil Edition': 16.0, 'Neymar - Brazil Edition': 12.9, 'Pele - Brazil Edition': 31.0 },
];

const trendDataWeeks = [
  { name: 'W1', 'Isak - Liverpool Edition': 8.6, 'Messi - Barcelona Edition': 19.8, 'Ronaldo - Real Edition': 7.0, 'Ronaldo - Brazil Edition': 15.0, 'Neymar - Brazil Edition': 13.1, 'Pele - Brazil Edition': 30.0 },
  { name: 'W2', 'Isak - Liverpool Edition': 8.7, 'Messi - Barcelona Edition': 20.0, 'Ronaldo - Real Edition': 7.1, 'Ronaldo - Brazil Edition': 15.0, 'Neymar - Brazil Edition': 13.0, 'Pele - Brazil Edition': 30.0 },
  { name: 'W3', 'Isak - Liverpool Edition': 8.65, 'Messi - Barcelona Edition': 19.9, 'Ronaldo - Real Edition': 7.05, 'Ronaldo - Brazil Edition': 14.95, 'Neymar - Brazil Edition': 12.9, 'Pele - Brazil Edition': 30.0 },
  { name: 'W4', 'Isak - Liverpool Edition': 8.75, 'Messi - Barcelona Edition': 20.1, 'Ronaldo - Real Edition': 7.15, 'Ronaldo - Brazil Edition': 15.05, 'Neymar - Brazil Edition': 13.1, 'Pele - Brazil Edition': 30.0 },
  { name: 'W5', 'Isak - Liverpool Edition': 8.7, 'Messi - Barcelona Edition': 20.0, 'Ronaldo - Real Edition': 7.1, 'Ronaldo - Brazil Edition': 15.0, 'Neymar - Brazil Edition': 13.0, 'Pele - Brazil Edition': 30.0 },
  { name: 'W6', 'Isak - Liverpool Edition': 8.8, 'Messi - Barcelona Edition': 20.2, 'Ronaldo - Real Edition': 7.2, 'Ronaldo - Brazil Edition': 15.1, 'Neymar - Brazil Edition': 13.2, 'Pele - Brazil Edition': 30.0 },
  { name: 'W7', 'Isak - Liverpool Edition': 8.7, 'Messi - Barcelona Edition': 20.0, 'Ronaldo - Real Edition': 7.1, 'Ronaldo - Brazil Edition': 15.0, 'Neymar - Brazil Edition': 13.0, 'Pele - Brazil Edition': 30.0 },
];

const trendDataDays = [
  { name: 'MON', 'Isak - Liverpool Edition': 8.68, 'Messi - Barcelona Edition': 19.95, 'Ronaldo - Real Edition': 7.08, 'Ronaldo - Brazil Edition': 15.02, 'Neymar - Brazil Edition': 13.05, 'Pele - Brazil Edition': 30.0 },
  { name: 'TUE', 'Isak - Liverpool Edition': 8.7, 'Messi - Barcelona Edition': 20.0, 'Ronaldo - Real Edition': 7.1, 'Ronaldo - Brazil Edition': 15.0, 'Neymar - Brazil Edition': 13.0, 'Pele - Brazil Edition': 30.0 },
  { name: 'WED', 'Isak - Liverpool Edition': 8.72, 'Messi - Barcelona Edition': 20.05, 'Ronaldo - Real Edition': 7.12, 'Ronaldo - Brazil Edition': 14.98, 'Neymar - Brazil Edition': 12.95, 'Pele - Brazil Edition': 30.0 },
  { name: 'THU', 'Isak - Liverpool Edition': 8.69, 'Messi - Barcelona Edition': 19.98, 'Ronaldo - Real Edition': 7.09, 'Ronaldo - Brazil Edition': 15.01, 'Neymar - Brazil Edition': 13.02, 'Pele - Brazil Edition': 30.0 },
  { name: 'FRI', 'Isak - Liverpool Edition': 8.71, 'Messi - Barcelona Edition': 20.02, 'Ronaldo - Real Edition': 7.11, 'Ronaldo - Brazil Edition': 14.99, 'Neymar - Brazil Edition': 12.98, 'Pele - Brazil Edition': 30.0 },
  { name: 'SAT', 'Isak - Liverpool Edition': 8.73, 'Messi - Barcelona Edition': 20.08, 'Ronaldo - Real Edition': 7.13, 'Ronaldo - Brazil Edition': 15.03, 'Neymar - Brazil Edition': 13.06, 'Pele - Brazil Edition': 30.0 },
  { name: 'SUN', 'Isak - Liverpool Edition': 8.7, 'Messi - Barcelona Edition': 20.0, 'Ronaldo - Real Edition': 7.1, 'Ronaldo - Brazil Edition': 15.0, 'Neymar - Brazil Edition': 13.0, 'Pele - Brazil Edition': 30.0 },
];

const xComData = [
  { day: '27', value: 40 },
  { day: '28', value: 30 },
  { day: '29', value: 45 },
  { day: '30', value: 35 },
  { day: '31', value: 60 },
  { day: '1', value: 25 },
  { day: '2', value: 30 },
];

const myCardTrendData = [
  { name: 'JUN', Messi: 2.35, Pele: 1.92, Maradona: 1.35, Ronaldo: 0.88, Mbappe: 0.72 },
  { name: 'JUL', Messi: 2.42, Pele: 1.85, Maradona: 1.48, Ronaldo: 0.94, Mbappe: 0.68 },
  { name: 'AUG', Messi: 2.28, Pele: 2.05, Maradona: 1.41, Ronaldo: 0.9, Mbappe: 0.76 },
  { name: 'SEP', Messi: 2.5, Pele: 1.97, Maradona: 1.58, Ronaldo: 0.83, Mbappe: 0.8 },
  { name: 'OCT', Messi: 2.62, Pele: 2.12, Maradona: 1.46, Ronaldo: 0.95, Mbappe: 0.86 },
  { name: 'NOV', Messi: 2.48, Pele: 2.04, Maradona: 1.62, Ronaldo: 0.9, Mbappe: 0.78 },
  { name: 'DEC', Messi: 2.58, Pele: 2.18, Maradona: 1.55, Ronaldo: 0.98, Mbappe: 0.84 },
];

const myTopCards = [
  {
    id: 'my-messi',
    name: 'Messi - Barcelona Edition',
    value: 2500000,
    change: '+6.2%',
    rarity: 'Mythic',
    condition: 'BGS 9.5',
    serial: '#01/10',
    image: 'https://picsum.photos/seed/my-messi/120/160',
  },
  {
    id: 'my-pele',
    name: 'Pele - Brazil Edition',
    value: 2100000,
    change: '+4.8%',
    rarity: 'Iconic',
    condition: 'PSA 8',
    serial: '#03/50',
    image: 'https://picsum.photos/seed/my-pele/120/160',
  },
  {
    id: 'my-maradona',
    name: 'Maradona - Napoli Edition',
    value: 1650000,
    change: '+9.1%',
    rarity: 'Mythic',
    condition: 'PSA 10',
    serial: '#10/10',
    image: 'https://picsum.photos/seed/my-maradona/120/160',
  },
  {
    id: 'my-ronaldo',
    name: 'Ronaldo - Brazil Edition',
    value: 980000,
    change: '-1.2%',
    rarity: 'Legendary',
    condition: 'PSA 9',
    serial: '#22/100',
    image: 'https://picsum.photos/seed/my-ronaldo/120/160',
  },
  {
    id: 'my-mbappe',
    name: 'Mbappe - PSG Edition',
    value: 850000,
    change: '+3.6%',
    rarity: 'Epic',
    condition: 'PSA 10',
    serial: '#99/500',
    image: 'https://picsum.photos/seed/my-mbappe/120/160',
  },
];

const mySignals = [
  { label: 'Vault Health', value: '96%', tone: 'ok' },
  { label: 'Insurance Cover', value: '$8.4M', tone: 'ok' },
  { label: 'Listings', value: '4 Active', tone: 'warn' },
  { label: 'Incoming Offers', value: '3 New', tone: 'alert' },
];

const myOffers = [
  { id: 'offer-1', card: 'Mbappe - PSG Edition', price: '$4,700', from: 'collector_x', status: 'Review' },
  { id: 'offer-2', card: 'Ronaldo - Brazil Edition', price: '$950,000', from: 'vault_king', status: 'Counter' },
  { id: 'offer-3', card: 'Pele - Brazil Edition', price: '$2,050,000', from: 'santos_archive', status: 'Review' },
];

const leads = [
  { 
    date: 'Today, 14:12', 
    username: 'alex_collector', 
    email: 'alex@vault.com', 
    cardLink: 'isak-liverpool-2024', 
    cardType: 'Isak - Liverpool Edition', 
    country: 'UK',
    timestamp: seedNow - hourMs * 2,
    rarity: 'Legendary',
    condition: 'PSA 10',
    serial: '#08/50',
    price: '$12,400',
    prevOwner: 'scout_master',
    marketTrend: '+12.4%',
    leadScore: 92
  },
  { 
    date: 'Today, 08:34', 
    username: 'crypto_king', 
    email: 'king@cards.io', 
    cardLink: 'messi-barcelona-2012', 
    cardType: 'Messi - Barcelona Edition', 
    country: 'Spain',
    timestamp: seedNow - hourMs * 8,
    rarity: 'Mythic',
    condition: 'BGS 9.5',
    serial: '#01/10',
    price: '$2,500,000',
    prevOwner: 'barca_museum',
    marketTrend: '+45.2%',
    leadScore: 99
  },
  { 
    date: 'Aug 4, 17:57', 
    username: 'vintage_pro', 
    email: 'pro@vintage.net', 
    cardLink: 'ronaldo-real-2017', 
    cardType: 'Ronaldo - Real Edition', 
    country: 'Portugal',
    timestamp: seedNow - dayMs * 2 - hourMs * 3,
    rarity: 'Legendary',
    condition: 'PSA 9',
    serial: '#22/100',
    price: '$85,000',
    prevOwner: 'cr7_fanatic',
    marketTrend: '-2.1%',
    leadScore: 88
  },
  { 
    date: 'Aug 4, 13:40', 
    username: 'soccer_fan_99', 
    email: 'fan99@gmail.com', 
    cardLink: 'pele-brazil-1970', 
    cardType: 'Pele - Brazil Edition', 
    country: 'Brazil',
    timestamp: seedNow - dayMs * 2 - hourMs * 8,
    rarity: 'Iconic',
    condition: 'Ungraded (Mint)',
    serial: 'N/A',
    price: '$450,000',
    prevOwner: 'santos_archive',
    marketTrend: '+5.8%',
    leadScore: 95
  },
  { 
    date: 'Aug 3, 10:22', 
    username: 'maradona_fan', 
    email: 'diego@legend.ar', 
    cardLink: 'maradona-napoli-1987', 
    cardType: 'Maradona - Napoli Edition', 
    country: 'Argentina',
    timestamp: seedNow - dayMs * 4 - hourMs * 6,
    expanded: true,
    rarity: 'Mythic',
    condition: 'PSA 10 (Gem Mint)',
    serial: '#10/10',
    price: '$1,200,000',
    prevOwner: 'napoli_vault',
    marketTrend: '+22.5%',
    leadScore: 98,
    services: ['Insurance', 'Vaulting'],
    source: 'Direct Marketplace Sale',
    potentialRevenue: '$250,000 (Commission)',
    note: 'Aug 3, 15:17'
  },
  { 
    date: 'Aug 3, 09:01', 
    username: 'card_shark', 
    email: 'shark@ocean.me', 
    cardLink: 'mbappe-psg-2022', 
    cardType: 'Mbappe - PSG Edition', 
    country: 'France',
    timestamp: seedNow - dayMs * 8 - hourMs * 2,
    rarity: 'Rare',
    condition: 'PSA 10',
    serial: '#99/500',
    price: '$4,500',
    prevOwner: 'psg_store',
    marketTrend: '+8.2%',
    leadScore: 82
  },
  { 
    date: 'Aug 2, 20:32', 
    username: 'j_smith', 
    email: 'jsmith@web.net', 
    cardLink: 'haaland-city-2023', 
    cardType: 'Haaland - City Edition', 
    country: 'Norway',
    timestamp: seedNow - dayMs * 14 - hourMs * 5,
    rarity: 'Rare',
    condition: 'PSA 9',
    serial: '#150/1000',
    price: '$2,800',
    prevOwner: 'city_fan_base',
    marketTrend: '+12.1%',
    leadScore: 78
  },
];

const dayOnDayData = [
  {
    name: 'Messi - Barcelona Edition',
    currentValue: 18500000,
    prevValue: 17200000,
    change: '+7.56%',
    volume: 1245000,
    rarity: 'Mythic',
    marketCap: 450000000,
    lastSale: 2500000,
    trend: 'up',
    id: 'messi-1'
  },
  {
    name: 'Ronaldo - Brazil Edition',
    currentValue: 12400000,
    prevValue: 12850000,
    change: '-3.50%',
    volume: 850000,
    rarity: 'Legendary',
    marketCap: 280000000,
    lastSale: 1200000,
    trend: 'down',
    id: 'ronaldo-1'
  },
  {
    name: 'Maradona - Napoli Edition',
    currentValue: 9850000,
    prevValue: 8200000,
    change: '+20.12%',
    volume: 2100000,
    rarity: 'Mythic',
    marketCap: 185000000,
    lastSale: 1200000,
    trend: 'up',
    id: 'maradona-1'
  },
  {
    name: 'Pele - Brazil Edition',
    currentValue: 25000000,
    prevValue: 24500000,
    change: '+2.04%',
    volume: 450000,
    rarity: 'Iconic',
    marketCap: 650000000,
    lastSale: 450000,
    trend: 'up',
    id: 'pele-1'
  },
  {
    name: 'Mbappe - PSG Edition',
    currentValue: 4200000,
    prevValue: 3800000,
    change: '+10.53%',
    volume: 1800000,
    rarity: 'Rare',
    marketCap: 95000000,
    lastSale: 4500,
    trend: 'up',
    id: 'mbappe-1'
  }
];

const inventoryCards = [
  { 
    id: 1, 
    name: 'Lionel Messi', 
    team: 'Barcelona', 
    year: '2012', 
    rarity: 'Legendary', 
    value: '$2,500,000', 
    condition: 'PSA 10', 
    image: 'https://picsum.photos/seed/messi/200/300',
    ownersCount: 3,
    history: [
      { user: 'Alex G.', avatar: 'https://picsum.photos/seed/u1/40/40', price: '$2,485,000', date: '2h ago', action: 'Sold to you' },
      { user: 'Sarah M.', avatar: 'https://picsum.photos/seed/u2/40/40', price: '$2,100,000', date: '6m ago', action: 'Sold to Alex G.' },
      { user: 'David K.', avatar: 'https://picsum.photos/seed/u3/40/40', price: '$1,850,000', date: '1y ago', action: 'Sold to Sarah M.' }
    ]
  },
  { 
    id: 2, 
    name: 'Cristiano Ronaldo', 
    team: 'Real Madrid', 
    year: '2008', 
    rarity: 'Legendary', 
    value: '$1,800,000', 
    condition: 'PSA 9', 
    image: 'https://picsum.photos/seed/ronaldo/200/300',
    ownersCount: 5,
    history: [
      { user: 'Marco R.', avatar: 'https://picsum.photos/seed/u4/40/40', price: '$1,750,000', date: '1d ago', action: 'Sold to you' },
      { user: 'Elena V.', avatar: 'https://picsum.photos/seed/u5/40/40', price: '$1,600,000', date: '3m ago', action: 'Sold to Marco R.' },
      { user: 'John S.', avatar: 'https://picsum.photos/seed/u6/40/40', price: '$1,450,000', date: '9m ago', action: 'Sold to Elena V.' }
    ]
  },
  { 
    id: 3, 
    name: 'Erling Haaland', 
    team: 'Man City', 
    year: '2023', 
    rarity: 'Rare', 
    value: '$450,000', 
    condition: 'PSA 10', 
    image: 'https://picsum.photos/seed/haaland/200/300',
    ownersCount: 1,
    history: [
      { user: 'Mint Master', avatar: 'https://picsum.photos/seed/u7/40/40', price: '$420,000', date: '1w ago', action: 'Sold to you' }
    ]
  },
  { 
    id: 4, 
    name: 'Kylian Mbappe', 
    team: 'PSG', 
    year: '2018', 
    rarity: 'Epic', 
    value: '$850,000', 
    condition: 'BGS 9.5', 
    image: 'https://picsum.photos/seed/mbappe/200/300',
    ownersCount: 2,
    history: [
      { user: 'Paris Collect', avatar: 'https://picsum.photos/seed/u8/40/40', price: '$830,000', date: '3d ago', action: 'Sold to you' },
      { user: 'Leo T.', avatar: 'https://picsum.photos/seed/u9/40/40', price: '$700,000', date: '4m ago', action: 'Sold to Paris Collect' }
    ]
  },
  { 
    id: 5, 
    name: 'Zinedine Zidane', 
    team: 'France', 
    year: '1998', 
    rarity: 'Legendary', 
    value: '$1,200,000', 
    condition: 'PSA 8', 
    image: 'https://picsum.photos/seed/zidane/200/300',
    ownersCount: 4,
    history: [
      { user: 'Vintage Vault', avatar: 'https://picsum.photos/seed/u10/40/40', price: '$1,150,000', date: '5d ago', action: 'Sold to you' },
      { user: 'Robert P.', avatar: 'https://picsum.photos/seed/u11/40/40', price: '$1,000,000', date: '1y ago', action: 'Sold to Vintage Vault' }
    ]
  },
  { 
    id: 6, 
    name: 'Ronaldinho', 
    team: 'Barcelona', 
    year: '2005', 
    rarity: 'Epic', 
    value: '$650,000', 
    condition: 'PSA 10', 
    image: 'https://picsum.photos/seed/ronaldinho/200/300',
    ownersCount: 2,
    history: [
      { user: 'Samba King', avatar: 'https://picsum.photos/seed/u12/40/40', price: '$640,000', date: '2w ago', action: 'Sold to you' }
    ]
  },
  { 
    id: 7, 
    name: 'Pele', 
    team: 'Brazil', 
    year: '1958', 
    rarity: 'Mythic', 
    value: '$5,000,000', 
    condition: 'PSA 7', 
    image: 'https://picsum.photos/seed/pele_card/200/300',
    ownersCount: 6,
    history: [
      { user: 'Museum of Sport', avatar: 'https://picsum.photos/seed/u13/40/40', price: '$4,800,000', date: '1m ago', action: 'Sold to you' },
      { user: 'Billionaire B.', avatar: 'https://picsum.photos/seed/u14/40/40', price: '$4,200,000', date: '3y ago', action: 'Sold to Museum of Sport' }
    ]
  },
  { 
    id: 8, 
    name: 'Diego Maradona', 
    team: 'Argentina', 
    year: '1986', 
    rarity: 'Mythic', 
    value: '$4,500,000', 
    condition: 'PSA 8', 
    image: 'https://picsum.photos/seed/maradona/200/300',
    ownersCount: 4,
    history: [
      { user: 'Hand of God', avatar: 'https://picsum.photos/seed/u15/40/40', price: '$4,400,000', date: '2w ago', action: 'Sold to you' },
      { user: 'Diego Fan', avatar: 'https://picsum.photos/seed/u16/40/40', price: '$3,900,000', date: '2y ago', action: 'Sold to Hand of God' }
    ]
  },
];

const cardDatabase = [
  {
    id: 'card-messi-2012',
    name: 'Messi - Barcelona Edition',
    player: 'Lionel Messi',
    club: 'Barcelona',
    edition: 'Champions League',
    year: '2012',
    rarity: 'Mythic',
    serial: '#01/10',
    value: 2500000,
    priceChange: '+6.2%',
    changePct: 6.2,
    demand: 'Very High',
    inCirculation: 10,
    scarcityScore: 98,
    popularity: 98,
    description: 'Peak-era Messi with low population grade and championship imprint.',
    stats: { goals: 45, assists: 18, trophies: 4 },
    image: 'https://picsum.photos/seed/db-messi/240/320',
    spark: [24, 28, 26, 30, 29, 33, 35],
  },
  {
    id: 'card-pele-1970',
    name: 'Pele - Brazil Edition',
    player: 'Pele',
    club: 'Brazil',
    edition: 'World Cup Legends',
    year: '1970',
    rarity: 'Iconic',
    serial: '#03/50',
    value: 2100000,
    priceChange: '+4.8%',
    changePct: 4.8,
    demand: 'High',
    inCirculation: 50,
    scarcityScore: 96,
    popularity: 92,
    description: 'Historic World Cup card with museum-grade provenance.',
    stats: { goals: 7, assists: 4, trophies: 3 },
    image: 'https://picsum.photos/seed/db-pele/240/320',
    spark: [20, 22, 21, 23, 24, 26, 27],
  },
  {
    id: 'card-maradona-1987',
    name: 'Maradona - Napoli Edition',
    player: 'Diego Maradona',
    club: 'Napoli',
    edition: 'Serie A 1987',
    year: '1987',
    rarity: 'Mythic',
    serial: '#10/10',
    value: 1650000,
    priceChange: '+9.1%',
    changePct: 9.1,
    demand: 'Very High',
    inCirculation: 10,
    scarcityScore: 97,
    popularity: 95,
    description: 'Title-winning season card with ultra-low pop count.',
    stats: { goals: 15, assists: 12, trophies: 2 },
    image: 'https://picsum.photos/seed/db-maradona/240/320',
    spark: [18, 20, 24, 23, 25, 28, 30],
  },
  {
    id: 'card-ronaldo-2008',
    name: 'Ronaldo - Real Edition',
    player: 'Cristiano Ronaldo',
    club: 'Real Madrid',
    edition: 'La Liga 2008',
    year: '2008',
    rarity: 'Legendary',
    serial: '#22/100',
    value: 980000,
    priceChange: '-1.2%',
    changePct: -1.2,
    demand: 'Medium',
    inCirculation: 100,
    scarcityScore: 88,
    popularity: 93,
    description: 'Prime Madrid era card with deep collector base.',
    stats: { goals: 26, assists: 8, trophies: 1 },
    image: 'https://picsum.photos/seed/db-ronaldo/240/320',
    spark: [12, 13, 12, 11, 12, 11, 10],
  },
  {
    id: 'card-ronaldo-brazil-2002',
    name: 'Ronaldo - Brazil Edition',
    player: 'Ronaldo Nazario',
    club: 'Brazil',
    edition: 'World Cup 2002',
    year: '2002',
    rarity: 'Legendary',
    serial: '#08/50',
    value: 1200000,
    priceChange: '+3.7%',
    changePct: 3.7,
    demand: 'High',
    inCirculation: 50,
    scarcityScore: 91,
    popularity: 90,
    description: 'Golden boot World Cup card with strong global demand.',
    stats: { goals: 8, assists: 3, trophies: 2 },
    image: 'https://picsum.photos/seed/db-ronaldo-bra/240/320',
    spark: [16, 17, 18, 17, 18, 19, 20],
  },
  {
    id: 'card-mbappe-2018',
    name: 'Mbappe - PSG Edition',
    player: 'Kylian Mbappe',
    club: 'PSG',
    edition: 'Ligue 1 2018',
    year: '2018',
    rarity: 'Epic',
    serial: '#99/500',
    value: 850000,
    priceChange: '+3.6%',
    changePct: 3.6,
    demand: 'High',
    inCirculation: 500,
    scarcityScore: 80,
    popularity: 91,
    description: 'Breakout season card with strong collector activity.',
    stats: { goals: 28, assists: 10, trophies: 2 },
    image: 'https://picsum.photos/seed/db-mbappe/240/320',
    spark: [9, 10, 11, 12, 12, 13, 14],
  },
  {
    id: 'card-neymar-2017',
    name: 'Neymar - Brazil Edition',
    player: 'Neymar Jr',
    club: 'Brazil',
    edition: 'Copa 2017',
    year: '2017',
    rarity: 'Rare',
    serial: '#44/250',
    value: 420000,
    priceChange: '+2.2%',
    changePct: 2.2,
    demand: 'Medium',
    inCirculation: 250,
    scarcityScore: 74,
    popularity: 86,
    description: 'Fan-favorite card with steady demand in LATAM.',
    stats: { goals: 12, assists: 9, trophies: 1 },
    image: 'https://picsum.photos/seed/db-neymar/240/320',
    spark: [6, 6, 7, 8, 8, 9, 9],
  },
  {
    id: 'card-isak-2024',
    name: 'Isak - Liverpool Edition',
    player: 'Alexander Isak',
    club: 'Liverpool',
    edition: 'Premier 2024',
    year: '2024',
    rarity: 'Rare',
    serial: '#08/50',
    value: 12000000,
    priceChange: '+12.4%',
    changePct: 12.4,
    demand: 'Surging',
    inCirculation: 50,
    scarcityScore: 84,
    popularity: 79,
    description: 'Breakout season with rapid price appreciation.',
    stats: { goals: 18, assists: 7, trophies: 1 },
    image: 'https://picsum.photos/seed/db-isak/240/320',
    spark: [8, 9, 11, 12, 12, 13, 14],
  },
  {
    id: 'card-haaland-2023',
    name: 'Haaland - City Edition',
    player: 'Erling Haaland',
    club: 'Man City',
    edition: 'Premier 2023',
    year: '2023',
    rarity: 'Rare',
    serial: '#150/1000',
    value: 280000,
    priceChange: '+6.9%',
    changePct: 6.9,
    demand: 'High',
    inCirculation: 1000,
    scarcityScore: 68,
    popularity: 88,
    description: 'High liquidity card with strong retail demand.',
    stats: { goals: 36, assists: 5, trophies: 2 },
    image: 'https://picsum.photos/seed/db-haaland/240/320',
    spark: [4, 5, 6, 7, 8, 9, 10],
  },
  {
    id: 'card-zidane-1998',
    name: 'Zidane - France Edition',
    player: 'Zinedine Zidane',
    club: 'France',
    edition: 'World Cup 1998',
    year: '1998',
    rarity: 'Legendary',
    serial: '#07/50',
    value: 1450000,
    priceChange: '+8.4%',
    changePct: 8.4,
    demand: 'High',
    inCirculation: 50,
    scarcityScore: 92,
    popularity: 90,
    description: 'Historic final performance card with vault verification.',
    stats: { goals: 2, assists: 3, trophies: 1 },
    image: 'https://picsum.photos/seed/db-zidane/240/320',
    spark: [15, 16, 18, 19, 21, 22, 24],
  },
  {
    id: 'card-ronaldinho-2005',
    name: 'Ronaldinho - Barcelona Edition',
    player: 'Ronaldinho',
    club: 'Barcelona',
    edition: 'UCL 2005',
    year: '2005',
    rarity: 'Epic',
    serial: '#12/99',
    value: 620000,
    priceChange: '+4.1%',
    changePct: 4.1,
    demand: 'Medium',
    inCirculation: 99,
    scarcityScore: 86,
    popularity: 89,
    description: 'Ballon d’Or season card with top grading.',
    stats: { goals: 15, assists: 14, trophies: 2 },
    image: 'https://picsum.photos/seed/db-ronaldinho/240/320',
    spark: [10, 11, 12, 12, 13, 14, 15],
  },
  {
    id: 'card-kaka-2007',
    name: 'Kaka - Milan Edition',
    player: 'Kaka',
    club: 'AC Milan',
    edition: 'UCL 2007',
    year: '2007',
    rarity: 'Epic',
    serial: '#05/75',
    value: 780000,
    priceChange: '+3.2%',
    changePct: 3.2,
    demand: 'Medium',
    inCirculation: 75,
    scarcityScore: 85,
    popularity: 84,
    description: 'Champions League run card with premium foil.',
    stats: { goals: 10, assists: 7, trophies: 2 },
    image: 'https://picsum.photos/seed/db-kaka/240/320',
    spark: [9, 9, 10, 11, 12, 12, 13],
  },
];

const marketActivity = {
  latestTrades: [
    { id: 'trade-1', card: 'Messi - Barcelona Edition', value: '$2.45M', by: 'vault_prime', time: '2m ago', status: 'Matched' },
    { id: 'trade-2', card: 'Maradona - Napoli Edition', value: '$1.58M', by: 'napoli_vault', time: '12m ago', status: 'Escrow' },
    { id: 'trade-3', card: 'Haaland - City Edition', value: '$285K', by: 'north_star', time: '20m ago', status: 'Confirmed' },
  ],
  recentSales: [
    { id: 'sale-1', card: 'Pele - Brazil Edition', value: '$2.12M', buyer: 'museum_of_sport', time: '1h ago' },
    { id: 'sale-2', card: 'Zidane - France Edition', value: '$1.38M', buyer: 'legendary_hub', time: '4h ago' },
    { id: 'sale-3', card: 'Ronaldo - Real Edition', value: '$940K', buyer: 'galactico_fund', time: '6h ago' },
  ],
  highestBids: [
    { id: 'bid-1', card: 'Messi - Barcelona Edition', bid: '$2.55M', bidders: 14 },
    { id: 'bid-2', card: 'Maradona - Napoli Edition', bid: '$1.7M', bidders: 9 },
    { id: 'bid-3', card: 'Pele - Brazil Edition', bid: '$2.2M', bidders: 11 },
  ],
};

const collectionSets = [
  {
    id: 'set-world-cup-legends',
    name: 'World Cup Legends',
    owned: 7,
    total: 12,
    theme: 'Iconic World Cup moments',
    missing: ['Ronaldo 2002', 'Zidane 1998', 'Maradona 1986', 'Cruyff 1974', 'Garrincha 1962'],
  },
  {
    id: 'set-ucl-icons',
    name: 'Champions League Icons',
    owned: 5,
    total: 10,
    theme: 'UCL winners and MVPs',
    missing: ['Kaka 2007', 'Ronaldinho 2005', 'Iniesta 2009', 'Benzema 2022', 'Shevchenko 2003'],
  },
  {
    id: 'set-modern-superstars',
    name: 'Modern Superstars',
    owned: 4,
    total: 8,
    theme: 'Next-gen elite cards',
    missing: ['Mbappe 2018', 'Haaland 2023', 'Bellingham 2024', 'Vini Jr 2022'],
  },
  {
    id: 'set-liverpool',
    name: 'Liverpool Edition',
    owned: 6,
    total: 12,
    theme: 'Anfield legends and modern stars',
    missing: ['Gerrard 2005', 'Salah 2019', 'Dalglish 1986', 'Van Dijk 2020'],
  },
  {
    id: 'set-real-madrid',
    name: 'Real Madrid Edition',
    owned: 5,
    total: 12,
    theme: 'Galacticos and UCL royalty',
    missing: ['Ronaldo 2017', 'Zidane 2002', 'Raul 2000', 'Modric 2018'],
  },
  {
    id: 'set-barcelona',
    name: 'Barcelona Edition',
    owned: 7,
    total: 12,
    theme: 'Camp Nou icons and tiki-taka era',
    missing: ['Messi 2012', 'Xavi 2011', 'Iniesta 2010', 'Ronaldinho 2005'],
  },
  {
    id: 'set-manchester-united',
    name: 'Manchester United Edition',
    owned: 4,
    total: 10,
    theme: 'Old Trafford legends',
    missing: ['Cantona 1996', 'Beckham 1999', 'Ronaldo 2008', 'Rooney 2011'],
  },
  {
    id: 'set-manchester-city',
    name: 'Manchester City Edition',
    owned: 3,
    total: 10,
    theme: 'Modern dominance era',
    missing: ['De Bruyne 2022', 'Haaland 2023', 'Aguero 2012', 'Silva 2019'],
  },
  {
    id: 'set-arsenal',
    name: 'Arsenal Edition',
    owned: 2,
    total: 10,
    theme: 'Invincibles and modern rebuild',
    missing: ['Henry 2004', 'Bergkamp 2002', 'Vieira 2003', 'Saka 2022'],
  },
  {
    id: 'set-chelsea',
    name: 'Chelsea Edition',
    owned: 4,
    total: 10,
    theme: 'Stamford Bridge classics',
    missing: ['Drogba 2012', 'Lampard 2005', 'Hazard 2017', 'Terry 2006'],
  },
  {
    id: 'set-tottenham',
    name: 'Tottenham Edition',
    owned: 2,
    total: 9,
    theme: 'North London stars',
    missing: ['Kane 2018', 'Son 2021', 'Bale 2013', 'Modric 2010'],
  },
  {
    id: 'set-ac-milan',
    name: 'AC Milan Edition',
    owned: 4,
    total: 10,
    theme: 'Rossoneri legends',
    missing: ['Maldini 2003', 'Kaka 2007', 'Shevchenko 2004', 'Pirlo 2006'],
  },
  {
    id: 'set-inter-milan',
    name: 'Inter Milan Edition',
    owned: 3,
    total: 10,
    theme: 'Nerazzurri elite',
    missing: ['Zanetti 2010', 'Milito 2010', 'Sneijder 2010', 'Lukaku 2021'],
  },
  {
    id: 'set-juventus',
    name: 'Juventus Edition',
    owned: 5,
    total: 10,
    theme: 'Bianconeri dynasty',
    missing: ['Del Piero 2003', 'Nedved 2003', 'Buffon 2006', 'Ronaldo 2019'],
  },
  {
    id: 'set-napoli',
    name: 'Napoli Edition',
    owned: 3,
    total: 9,
    theme: 'Napoli legends',
    missing: ['Maradona 1987', 'Hamsik 2014', 'Osimhen 2023', 'Kvaratskhelia 2023'],
  },
  {
    id: 'set-roma',
    name: 'Roma Edition',
    owned: 2,
    total: 9,
    theme: 'Giallorossi heroes',
    missing: ['Totti 2001', 'De Rossi 2008', 'Dzeko 2017', 'Salah 2016'],
  },
  {
    id: 'set-lazio',
    name: 'Lazio Edition',
    owned: 2,
    total: 8,
    theme: 'Biancocelesti stars',
    missing: ['Mihajlovic 2000', 'Nesta 2000', 'Immobile 2021', 'Veron 1999'],
  },
  {
    id: 'set-bayern',
    name: 'Bayern Munich Edition',
    owned: 6,
    total: 12,
    theme: 'Bundesliga dominance',
    missing: ['Lahm 2013', 'Muller 2020', 'Lewandowski 2020', 'Robben 2013'],
  },
  {
    id: 'set-dortmund',
    name: 'Borussia Dortmund Edition',
    owned: 3,
    total: 9,
    theme: 'Yellow Wall favorites',
    missing: ['Reus 2013', 'Gotze 2012', 'Sancho 2019', 'Hummels 2013'],
  },
  {
    id: 'set-rb-leipzig',
    name: 'RB Leipzig Edition',
    owned: 2,
    total: 8,
    theme: 'Modern Bundesliga risers',
    missing: ['Nkunku 2022', 'Werner 2020', 'Olmo 2023', 'Gvardiol 2023'],
  },
  {
    id: 'set-psg',
    name: 'PSG Edition',
    owned: 5,
    total: 10,
    theme: 'Parisian superstars',
    missing: ['Mbappe 2021', 'Neymar 2019', 'Messi 2022', 'Cavani 2017'],
  },
  {
    id: 'set-marseille',
    name: 'Marseille Edition',
    owned: 2,
    total: 8,
    theme: 'French giants',
    missing: ['Drogba 2004', 'Payet 2017', 'Ribery 2006', 'Papin 1991'],
  },
  {
    id: 'set-lyon',
    name: 'Lyon Edition',
    owned: 1,
    total: 8,
    theme: 'Ligue 1 classics',
    missing: ['Juninho 2005', 'Benzema 2008', 'Lacazette 2017', 'Essien 2004'],
  },
  {
    id: 'set-monaco',
    name: 'Monaco Edition',
    owned: 2,
    total: 8,
    theme: 'Princes of Ligue 1',
    missing: ['Mbappe 2017', 'Falcao 2013', 'Fabinho 2017', 'B. Silva 2017'],
  },
  {
    id: 'set-ajax',
    name: 'Ajax Edition',
    owned: 3,
    total: 9,
    theme: 'Total football legacy',
    missing: ['Cruyff 1973', 'Van Basten 1987', 'De Jong 2019', 'De Ligt 2019'],
  },
  {
    id: 'set-psv',
    name: 'PSV Edition',
    owned: 1,
    total: 7,
    theme: 'Eindhoven icons',
    missing: ['Ronaldo 1996', 'Robben 2004', 'Depay 2015', 'Van Nistelrooy 2001'],
  },
  {
    id: 'set-feyenoord',
    name: 'Feyenoord Edition',
    owned: 1,
    total: 7,
    theme: 'Rotterdam pride',
    missing: ['Van Persie 2002', 'Kuyt 2017', 'Gio 2002', 'Wijnaldum 2014'],
  },
  {
    id: 'set-benfica',
    name: 'Benfica Edition',
    owned: 2,
    total: 8,
    theme: 'Lisbon giants',
    missing: ['Eusebio 1965', 'Rui Costa 1994', 'Di Maria 2009', 'Felix 2019'],
  },
  {
    id: 'set-porto',
    name: 'Porto Edition',
    owned: 2,
    total: 8,
    theme: 'Dragons of Portugal',
    missing: ['Deco 2004', 'Falcao 2011', 'Hulk 2011', 'Pepe 2005'],
  },
  {
    id: 'set-sporting',
    name: 'Sporting Edition',
    owned: 1,
    total: 7,
    theme: 'Lisbon academy legends',
    missing: ['Ronaldo 2003', 'Figo 1995', 'Nani 2008', 'Bruno 2019'],
  },
  {
    id: 'set-atletico',
    name: 'Atletico Madrid Edition',
    owned: 3,
    total: 9,
    theme: 'Rojiblancos warriors',
    missing: ['Griezmann 2018', 'Forlan 2010', 'Torres 2012', 'Godin 2014'],
  },
  {
    id: 'set-sevilla',
    name: 'Sevilla Edition',
    owned: 1,
    total: 7,
    theme: 'Europa League kings',
    missing: ['Rakitic 2014', 'Bacca 2015', 'Navas 2016', 'Ocampos 2020'],
  },
  {
    id: 'set-valencia',
    name: 'Valencia Edition',
    owned: 1,
    total: 7,
    theme: 'Mestalla icons',
    missing: ['Villa 2008', 'Silva 2010', 'Mata 2010', 'Ayala 2004'],
  },
  {
    id: 'set-villarreal',
    name: 'Villarreal Edition',
    owned: 1,
    total: 7,
    theme: 'Yellow Submarine',
    missing: ['Riquelme 2006', 'Fornals 2019', 'Gerard 2008', 'Parejo 2021'],
  },
  {
    id: 'set-galatasaray',
    name: 'Galatasaray Edition',
    owned: 1,
    total: 7,
    theme: 'Turkish giants',
    missing: ['Hagi 2000', 'Drogba 2014', 'Sneijder 2013', 'Icardi 2023'],
  },
  {
    id: 'set-fenerbahce',
    name: 'Fenerbahce Edition',
    owned: 1,
    total: 7,
    theme: 'Istanbul rivals',
    missing: ['Alex 2007', 'Roberto Carlos 2008', 'Emre 2004', 'Kuyt 2013'],
  },
  {
    id: 'set-besiktas',
    name: 'Besiktas Edition',
    owned: 1,
    total: 7,
    theme: 'Black Eagles',
    missing: ['Quaresma 2017', 'Gomez 2016', 'Talisca 2016', 'Cenk 2017'],
  },
  {
    id: 'set-celtic',
    name: 'Celtic Edition',
    owned: 1,
    total: 6,
    theme: 'Glasgow legends',
    missing: ['Larsson 2003', 'Nakamura 2006', 'McStay 1993', 'Forrest 2019'],
  },
  {
    id: 'set-rangers',
    name: 'Rangers Edition',
    owned: 1,
    total: 6,
    theme: 'Ibrox heroes',
    missing: ['Gazza 1996', 'Ferguson 2003', 'Tavernier 2021', 'Morelos 2020'],
  },
  {
    id: 'set-brazil',
    name: 'Brazil Edition',
    owned: 6,
    total: 12,
    theme: 'Selecao immortals',
    missing: ['Pele 1970', 'Ronaldo 2002', 'Ronaldinho 2005', 'Neymar 2013'],
  },
  {
    id: 'set-argentina',
    name: 'Argentina Edition',
    owned: 5,
    total: 12,
    theme: 'Albiceleste icons',
    missing: ['Maradona 1986', 'Messi 2022', 'Batistuta 1998', 'Riquelme 2006'],
  },
  {
    id: 'set-france',
    name: 'France Edition',
    owned: 4,
    total: 10,
    theme: 'Les Bleus legends',
    missing: ['Zidane 1998', 'Henry 2000', 'Mbappe 2018', 'Griezmann 2016'],
  },
  {
    id: 'set-england',
    name: 'England Edition',
    owned: 3,
    total: 10,
    theme: 'Three Lions greats',
    missing: ['Beckham 2002', 'Gerrard 2006', 'Kane 2018', 'Rooney 2004'],
  },
  {
    id: 'set-germany',
    name: 'Germany Edition',
    owned: 4,
    total: 10,
    theme: 'Die Mannschaft history',
    missing: ['Klose 2014', 'Lahm 2014', 'Kroos 2014', 'Ballack 2002'],
  },
  {
    id: 'set-spain',
    name: 'Spain Edition',
    owned: 4,
    total: 10,
    theme: 'La Roja golden era',
    missing: ['Xavi 2010', 'Iniesta 2010', 'Casillas 2010', 'Ramos 2012'],
  },
  {
    id: 'set-portugal',
    name: 'Portugal Edition',
    owned: 3,
    total: 9,
    theme: 'Selecao das Quinas',
    missing: ['Ronaldo 2016', 'Figo 2000', 'Pepe 2016', 'Bernardo 2019'],
  },
  {
    id: 'set-italy',
    name: 'Italy Edition',
    owned: 3,
    total: 9,
    theme: 'Azzurri classics',
    missing: ['Baggio 1994', 'Totti 2006', 'Cannavaro 2006', 'Pirlo 2006'],
  },
  {
    id: 'set-netherlands',
    name: 'Netherlands Edition',
    owned: 2,
    total: 8,
    theme: 'Dutch masters',
    missing: ['Cruyff 1974', 'Bergkamp 1998', 'Van Persie 2010', 'Robben 2014'],
  },
  {
    id: 'set-usa',
    name: 'USA Edition',
    owned: 2,
    total: 8,
    theme: 'USMNT highlights',
    missing: ['Donovan 2010', 'Pulisic 2021', 'Dempsey 2014', 'Howard 2010'],
  },
  {
    id: 'set-mexico',
    name: 'Mexico Edition',
    owned: 2,
    total: 8,
    theme: 'El Tri favorites',
    missing: ['Hernandez 2011', 'Ochoa 2014', 'Rafa 2006', 'Lozano 2018'],
  },
  {
    id: 'set-japan',
    name: 'Japan Edition',
    owned: 1,
    total: 8,
    theme: 'Samurai Blue era',
    missing: ['Honda 2010', 'Kagawa 2012', 'Nakata 2002', 'Mitoma 2022'],
  },
  {
    id: 'set-croatia',
    name: 'Croatia Edition',
    owned: 1,
    total: 7,
    theme: 'Vatreni legends',
    missing: ['Modric 2018', 'Rakitic 2018', 'Suker 1998', 'Perisic 2018'],
  },
  {
    id: 'set-inter-miami',
    name: 'Inter Miami Edition',
    owned: 1,
    total: 7,
    theme: 'MLS rise',
    missing: ['Messi 2023', 'Busquets 2023', 'Alba 2023', 'Martinez 2024'],
  },
  {
    id: 'set-la-galaxy',
    name: 'LA Galaxy Edition',
    owned: 1,
    total: 7,
    theme: 'MLS classics',
    missing: ['Beckham 2008', 'Keane 2012', 'Donovan 2009', 'Ibrahimovic 2019'],
  },
  {
    id: 'set-al-nassr',
    name: 'Al Nassr Edition',
    owned: 1,
    total: 6,
    theme: 'Saudi stars',
    missing: ['Ronaldo 2023', 'Talisca 2021', 'Ghareeb 2022', 'Laporte 2023'],
  },
  {
    id: 'set-al-hilal',
    name: 'Al Hilal Edition',
    owned: 1,
    total: 6,
    theme: 'Saudi champions',
    missing: ['Neymar 2023', 'Mitrovic 2023', 'Malcom 2023', 'Milinkovic 2023'],
  },
  {
    id: 'set-flamengo',
    name: 'Flamengo Edition',
    owned: 1,
    total: 7,
    theme: 'Brazilian giants',
    missing: ['Zico 1981', 'Adriano 2009', 'Gabigol 2019', 'Gerson 2020'],
  },
  {
    id: 'set-boca',
    name: 'Boca Juniors Edition',
    owned: 1,
    total: 7,
    theme: 'La Bombonera heroes',
    missing: ['Riquelme 2001', 'Tevez 2003', 'Palermo 2000', 'Roman 2007'],
  },
  {
    id: 'set-river-plate',
    name: 'River Plate Edition',
    owned: 1,
    total: 7,
    theme: 'Monumental legends',
    missing: ['Gallardo 1996', 'Aimar 2000', 'Ortega 1999', 'Alvarez 2021'],
  },
  {
    id: 'set-santos',
    name: 'Santos Edition',
    owned: 1,
    total: 6,
    theme: 'Historic Brazilian club',
    missing: ['Pele 1962', 'Neymar 2011', 'Coutinho 1958', 'Robinho 2002'],
  },
  {
    id: 'set-corinthians',
    name: 'Corinthians Edition',
    owned: 1,
    total: 6,
    theme: 'Timao legends',
    missing: ['Ronaldo 2009', 'Rivelino 1976', 'Tevez 2005', 'Casagrande 1982'],
  },
  {
    id: 'set-palmeiras',
    name: 'Palmeiras Edition',
    owned: 1,
    total: 6,
    theme: 'Brazilian powerhouse',
    missing: ['Dudu 2018', 'Endrick 2024', 'Marcos 1999', 'Ademir 1961'],
  },
  {
    id: 'set-america-mx',
    name: 'Club America Edition',
    owned: 1,
    total: 6,
    theme: 'Liga MX giants',
    missing: ['Cuauhtemoc 2002', 'Ochoa 2007', 'Borghetti 2000', 'Aguilar 2016'],
  },
  {
    id: 'set-chivas',
    name: 'Chivas Edition',
    owned: 1,
    total: 6,
    theme: 'Liga MX classics',
    missing: ['Chicharito 2010', 'Bravo 2007', 'Bofo 2006', 'Ramoncito 1997'],
  },
  {
    id: 'set-monterrey',
    name: 'Monterrey Edition',
    owned: 1,
    total: 6,
    theme: 'Liga MX elite',
    missing: ['Suazo 2009', 'Funes Mori 2019', 'Pabon 2014', 'Ocampos 2024'],
  },
  {
    id: 'set-tigres',
    name: 'Tigres Edition',
    owned: 1,
    total: 6,
    theme: 'Liga MX champions',
    missing: ['Gignac 2016', 'Nahuel 2017', 'Zelarayan 2018', 'Quinones 2019'],
  },
];

const rarityTiers = [
  { tier: 'Legendary', color: 'bg-orange-500', score: '90-100', supply: '0-100', count: 120 },
  { tier: 'Ultra Rare', color: 'bg-emerald-500', score: '80-89', supply: '101-250', count: 320 },
  { tier: 'Rare', color: 'bg-blue-500', score: '65-79', supply: '251-1000', count: 980 },
  { tier: 'Common', color: 'bg-gray-500', score: '0-64', supply: '1000+', count: 6200 },
];

// --- Components ---

const SidebarItem = ({ icon: Icon, label, active = false, hasSubmenu = false, badge, onClick }: any) => (
  <div 
    onClick={onClick}
    className={cn(
      "flex items-center justify-between px-4 py-2.5 cursor-pointer transition-all duration-200 group rounded-xl mb-0.5",
      active 
        ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20" 
        : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-gray-200"
    )}
  >
    <div className="flex items-center gap-3">
      <Icon size={18} className={cn(active ? "text-white" : "text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-200")} />
      <span className="text-[13px] font-medium">{label}</span>
    </div>
    <div className="flex items-center gap-2">
      {badge && <span className="bg-orange-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">{badge}</span>}
      {hasSubmenu && <ChevronDown size={14} className={cn(active ? "text-white" : "opacity-50")} />}
    </div>
  </div>
);

const GridLines = () => (
  <div className="fixed inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.05]" style={{ zIndex: 0 }}>
    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="grid-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid-pattern)" />
    </svg>
  </div>
);

const StatCard = ({ label, value, change, isPositive = true }: any) => {
  const points = isPositive 
    ? "0,20 10,15 20,18 30,10 40,12 50,5" 
    : "0,5 10,12 20,10 30,18 40,15 50,20";

  return (
    <div className="bg-white dark:bg-white/5 rounded-2xl p-4 flex flex-col gap-1 shadow-sm border border-gray-100 dark:border-white/5 transition-all duration-300 relative overflow-hidden group">
      <div className="flex justify-between items-start">
        <span className="text-gray-500 dark:text-gray-400 text-[11px] font-medium uppercase tracking-wider">{label}</span>
        <div className="opacity-40 group-hover:opacity-100 transition-opacity">
          <svg width="40" height="20" viewBox="0 0 50 25" className={isPositive ? "text-emerald-500" : "text-red-500"}>
            <polyline
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              points={points}
            />
          </svg>
        </div>
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-xl font-bold text-gray-900 dark:text-white">{value}</span>
        <span className={cn("text-[11px] font-bold", isPositive ? "text-emerald-500" : "text-red-500")}>
          {isPositive ? '+' : ''}{change}
        </span>
      </div>
    </div>
  );
};

const PlaceholderView = ({ title, icon: Icon }: any) => {
  const [requested, setRequested] = useState(false);

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
      <div className="w-24 h-24 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center mb-6">
        <Icon size={48} className="text-gray-400" />
      </div>
      <h2 className="text-3xl font-bold mb-2">{title}</h2>
      <p className="text-gray-500 dark:text-gray-400 max-w-md">
        This module is currently being integrated. You'll soon be able to track your {title.toLowerCase()} metrics,
        campaigns, and performance data right here.
      </p>
      <button
        onClick={() => {
          setRequested(true);
          emitDashboardAction(`${title} early access request queued`);
        }}
        className="mt-8 bg-orange-500 text-white px-6 py-3 rounded-2xl font-bold hover:bg-orange-600 transition-colors"
      >
        {requested ? 'Request Queued' : 'Request Early Access'}
      </button>
    </div>
  );
};

const operationsDeckConfigs: Record<string, any> = {
  'Command Center': {
    title: 'Command Center',
    subtitle: 'Master routing, task orchestration, and live command channels across the full dashboard.',
    accent: 'orange',
    metrics: [
      { label: 'Live Queues', value: '18', change: '+4' },
      { label: 'Command Uptime', value: '99.8%', change: '+0.2%' },
      { label: 'Task Relays', value: '42', change: '+9' },
      { label: 'Escalations', value: '6', change: '-2' },
    ],
    presets: ['Balanced', 'Aggressive', 'Silent', 'Night Ops'],
    groups: [
      { title: 'Routing', description: 'Command and queue control', actions: ['Auto Route', 'Hot Queue', 'Priority Lock', 'Silent Relay'] },
      { title: 'Execution', description: 'Execution deck toggles', actions: ['Burst Mode', 'Failover', 'Retry Stack', 'Live Override'] },
      { title: 'Ops Signals', description: 'Command signal outputs', actions: ['Beacon', 'Command Ping', 'Wide Broadcast', 'Auto Summary'] },
      { title: 'Safety', description: 'Operational safeguards', actions: ['Freeze Deck', 'Escrow Gate', 'Risk Fuse', 'Kill Switch'] },
    ],
  },
  'Alert Lab': {
    title: 'Alert Lab',
    subtitle: 'Build and tune alert ladders for cards, value shifts, user activity, and market conditions.',
    accent: 'blue',
    metrics: [
      { label: 'Active Alerts', value: '57', change: '+11' },
      { label: 'Triggered Today', value: '23', change: '+5' },
      { label: 'Quiet Channels', value: '4', change: '-1' },
      { label: 'Escalated', value: '8', change: '+2' },
    ],
    presets: ['Low Noise', 'Balanced', 'High Sensitivity', 'Sniper'],
    groups: [
      { title: 'Price Alerts', description: 'Card value triggers', actions: ['Floor Break', 'Ceiling Hit', 'Spread Alert', 'Spike Capture'] },
      { title: 'User Alerts', description: 'Collector behavior tracking', actions: ['New Buyer', 'Repeat Bidder', 'Top Collector', 'Dormant Wake'] },
      { title: 'Channel Alerts', description: 'Delivery routing', actions: ['Push', 'Email', 'SMS', 'In-App'] },
      { title: 'Escalation', description: 'Escalation ladders', actions: ['Level One', 'Level Two', 'Crisis Push', 'Auto Mute'] },
    ],
  },
  'Vault Ops': {
    title: 'Vault Ops',
    subtitle: 'Lock, audit, insure, and route physical or digital card custody through a dedicated operations deck.',
    accent: 'emerald',
    metrics: [
      { label: 'Vault Locks', value: '13', change: '+1' },
      { label: 'Audits Ready', value: '9', change: '+3' },
      { label: 'Insured Cards', value: '71', change: '+6' },
      { label: 'Custody Paths', value: '12', change: '+2' },
    ],
    presets: ['Secure', 'Transfer', 'Audit', 'Emergency'],
    groups: [
      { title: 'Custody', description: 'Ownership and vault controls', actions: ['Lock Vault', 'Open Audit', 'Custody Move', 'Seal Batch'] },
      { title: 'Insurance', description: 'Protection layers', actions: ['Full Cover', 'Partial Cover', 'Revalue Policy', 'Claim Desk'] },
      { title: 'Verification', description: 'Authenticity operations', actions: ['Deep Scan', 'Code Match', 'Grade Sync', 'Serial Review'] },
      { title: 'Access', description: 'Access gates and roles', actions: ['Admin Gate', 'Viewer Pass', 'Broker Access', 'Geo Lock'] },
    ],
  },
  'Pricing Engine': {
    title: 'Pricing Engine',
    subtitle: 'Tune valuation logic, spread controls, and floor/ceiling logic for live card pricing.',
    accent: 'violet',
    metrics: [
      { label: 'Engine Models', value: '12', change: '+2' },
      { label: 'Floor Locks', value: '17', change: '+4' },
      { label: 'Price Drifts', value: '5', change: '-1' },
      { label: 'Manual Overrides', value: '3', change: '+1' },
    ],
    presets: ['Market', 'Conservative', 'Collector Bias', 'Volatile'],
    groups: [
      { title: 'Floor Logic', description: 'Minimum value rules', actions: ['Hard Floor', 'Soft Floor', 'Drop Shield', 'Floor Trail'] },
      { title: 'Upside Logic', description: 'Growth and ceiling logic', actions: ['Ceiling Boost', 'Hot Streak', 'Scarcity Lift', 'Demand Lift'] },
      { title: 'Spread Control', description: 'Bid/ask management', actions: ['Tight Spread', 'Wide Spread', 'Bid Clamp', 'Ask Clamp'] },
      { title: 'Manual Tools', description: 'Override deck', actions: ['Pin Price', 'Freeze Drift', 'Manual Reprice', 'Backtest'] },
    ],
  },
  'Signal Matrix': {
    title: 'Signal Matrix',
    subtitle: 'Watch all live pulses from collectors, cards, feeds, watchlists, and negotiation traffic in one matrix.',
    accent: 'red',
    metrics: [
      { label: 'Pulse Streams', value: '29', change: '+7' },
      { label: 'Hot Signals', value: '11', change: '+3' },
      { label: 'Dormant Signals', value: '6', change: '-2' },
      { label: 'Priority Flags', value: '5', change: '+1' },
    ],
    presets: ['Scout', 'Trader', 'Investor', 'Radar'],
    groups: [
      { title: 'Market Signals', description: 'Market pulse monitoring', actions: ['Live Demand', 'Price Pulse', 'Floor Heat', 'Volume Spike'] },
      { title: 'Collector Signals', description: 'Collector movement patterns', actions: ['Buyer Rush', 'Repeat Visits', 'Big Wallet', 'Bundle Interest'] },
      { title: 'Card Signals', description: 'Card-level movement', actions: ['Rare Pop', 'Fresh Listing', 'Watch Surge', 'Verification Lag'] },
      { title: 'Threat Signals', description: 'Risk and anomaly detection', actions: ['Bot Sweep', 'Fraud Ping', 'Shadow Bid', 'Ghost Listing'] },
    ],
  },
};

const OperationsDeckView = ({ isDarkMode, config }: { isDarkMode: boolean; config: any }) => {
  const panelBg = isDarkMode ? 'bg-white/5' : 'bg-white';
  const panelBorder = isDarkMode ? 'border-white/10' : 'border-gray-100';
  const muted = isDarkMode ? 'text-gray-400' : 'text-gray-500';
  const chipBg = isDarkMode ? 'bg-white/10' : 'bg-gray-100';
  const [activePreset, setActivePreset] = useState(config.presets[0]);
  const [rangeState, setRangeState] = useState({ intensity: 68, threshold: 42, cadence: 24 });
  const [statusNote, setStatusNote] = useState<string | null>(null);
  const [activeActions, setActiveActions] = useState<Record<string, boolean>>({});

  const accentStyles: Record<string, string> = {
    orange: 'bg-orange-500 text-white shadow-lg shadow-orange-500/20',
    blue: 'bg-blue-500 text-white shadow-lg shadow-blue-500/20',
    emerald: 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20',
    violet: 'bg-violet-500 text-white shadow-lg shadow-violet-500/20',
    red: 'bg-red-500 text-white shadow-lg shadow-red-500/20',
  };

  const accentSoft: Record<string, string> = {
    orange: 'bg-orange-500/20 text-orange-300',
    blue: 'bg-blue-500/20 text-blue-300',
    emerald: 'bg-emerald-500/20 text-emerald-300',
    violet: 'bg-violet-500/20 text-violet-300',
    red: 'bg-red-500/20 text-red-300',
  };

  const toggleAction = (groupTitle: string, actionLabel: string) => {
    const key = `${groupTitle}:${actionLabel}`;
    setActiveActions((prev) => {
      const nextValue = !prev[key];
      const next = { ...prev, [key]: nextValue };
      const message = `${config.title}: ${actionLabel} ${nextValue ? 'enabled' : 'disabled'}`;
      setStatusNote(message);
      emitDashboardAction(message);
      return next;
    });
  };

  return (
    <div className="p-6 lg:p-8 flex flex-col gap-8">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{config.title}</h2>
          <p className={cn('text-sm', muted)}>{config.subtitle}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {config.presets.map((preset: string) => (
            <button
              key={preset}
              onClick={() => {
                setActivePreset(preset);
                const message = `${config.title}: ${preset} preset loaded`;
                setStatusNote(message);
                emitDashboardAction(message);
              }}
              className={cn(
                'px-3 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-colors',
                activePreset === preset ? accentStyles[config.accent] : cn(panelBg, panelBorder, 'border', muted)
              )}
            >
              {preset}
            </button>
          ))}
        </div>
      </div>

      {statusNote && (
        <div className={cn('rounded-2xl border px-4 py-3 text-[10px] font-bold uppercase tracking-widest', panelBorder, panelBg, muted)}>
          {statusNote}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {config.metrics.map((metric: any) => (
          <div key={metric.label} className={cn('rounded-2xl border p-4', panelBg, panelBorder)}>
            <div className={cn('text-[10px] uppercase tracking-widest', muted)}>{metric.label}</div>
            <div className="mt-2 text-xl font-bold">{metric.value}</div>
            <div className={cn('mt-1 text-[10px] font-bold uppercase tracking-widest', accentSoft[config.accent])}>
              {metric.change}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1.3fr_1fr] gap-6">
        <div className={cn('rounded-3xl border p-6', panelBg, panelBorder)}>
          <div className="text-sm font-bold">Control Surface</div>
          <div className={cn('text-[10px] uppercase tracking-widest', muted)}>Dense deck of live buttons and toggles</div>
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-5">
            {config.groups.map((group: any) => (
              <div key={group.title} className={cn('rounded-2xl border p-4', panelBorder)}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-sm font-bold">{group.title}</div>
                    <div className={cn('text-[10px] uppercase tracking-widest', muted)}>{group.description}</div>
                  </div>
                  <span className={cn('px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest', accentSoft[config.accent])}>
                    {group.actions.length} slots
                  </span>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  {group.actions.map((actionLabel: string) => {
                    const key = `${group.title}:${actionLabel}`;
                    const active = !!activeActions[key];
                    return (
                      <button
                        key={actionLabel}
                        onClick={() => toggleAction(group.title, actionLabel)}
                        className={cn(
                          'px-3 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-colors',
                          active ? accentStyles[config.accent] : cn(panelBg, panelBorder, 'border', muted)
                        )}
                      >
                        {actionLabel}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={cn('rounded-3xl border p-6', panelBg, panelBorder)}>
          <div className="text-sm font-bold">Settings Matrix</div>
          <div className={cn('text-[10px] uppercase tracking-widest', muted)}>Live thresholds and cadence tuning</div>
          <div className="mt-5 space-y-5">
            {[
              { key: 'intensity', label: 'Intensity' },
              { key: 'threshold', label: 'Threshold' },
              { key: 'cadence', label: 'Cadence' },
            ].map((slider) => (
              <div key={slider.key}>
                <div className="flex items-center justify-between text-xs">
                  <span className={muted}>{slider.label}</span>
                  <span className="font-bold">{rangeState[slider.key as keyof typeof rangeState]}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={rangeState[slider.key as keyof typeof rangeState]}
                  onChange={(event) =>
                    setRangeState((prev) => ({ ...prev, [slider.key]: Number(event.target.value) }))
                  }
                  className="mt-2 w-full"
                />
              </div>
            ))}
          </div>

          <div className="mt-6 grid grid-cols-2 gap-2">
            {['Save Deck', 'Reset Deck', 'Sync Nodes', 'Export Config', 'Open Logs', 'Broadcast'].map((label) => (
              <button
                key={label}
                onClick={() => {
                  const message = `${config.title}: ${label} triggered`;
                  setStatusNote(message);
                  emitDashboardAction(message);
                }}
                className={cn('px-3 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest', chipBg, muted)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const ProfileView = ({
  isDarkMode,
  user,
  cards,
  allCards,
}: {
  isDarkMode: boolean;
  user: any | null;
  cards: any[];
  allCards: any[];
}) => {
  const panelBg = isDarkMode ? 'bg-white/5' : 'bg-white';
  const panelBorder = isDarkMode ? 'border-white/10' : 'border-gray-100';
  const muted = isDarkMode ? 'text-gray-400' : 'text-gray-500';
  const chipBg = isDarkMode ? 'bg-white/10' : 'bg-gray-100';
  const [profileTab, setProfileTab] = useState<'Overview' | 'Pinned' | 'Collections' | 'Activity'>('Overview');

  const formatMoney = (value: number) => `$${Math.round(value).toLocaleString()}`;
  const portfolioValue = cards.reduce((sum, card) => sum + Number(card.valueNumber || 0), 0);
  const editions = Array.from(new Set(cards.map((card) => card.edition).filter(Boolean)));
  const pinnedCards = [...cards].sort((a, b) => Number(b.valueNumber || 0) - Number(a.valueNumber || 0)).slice(0, 4);
  const followers = Math.max(180, cards.length * 83 + editions.length * 21 + String(user?.username || 'fodr').length * 11);
  const following = Math.max(42, editions.length * 7 + 18);
  const posts = Math.max(12, cards.length * 3 + 6);
  const pendingCount = allCards.filter((card) => !card.isVerified).length;
  const publicCollections = editions.slice(0, 6).map((edition, index) => ({
    edition,
    count: cards.filter((card) => card.edition === edition).length,
    audience: `${120 + index * 47} collectors`,
  }));
  const activityFeed = [
    pinnedCards[0] && {
      id: 'activity-1',
      title: `Pinned ${pinnedCards[0].name} publicly`,
      body: `${pinnedCards[0].edition} is now featured at the top of the profile showcase.`,
      time: '2h ago',
    },
    pinnedCards[1] && {
      id: 'activity-2',
      title: `Shared ${pinnedCards[1].name} collection update`,
      body: `Collectors are now watching ${pinnedCards[1].edition} from your public page.`,
      time: 'Today',
    },
    {
      id: 'activity-3',
      title: 'Updated showcase value',
      body: `${formatMoney(portfolioValue)} public collection value is now displayed on profile.`,
      time: 'Today',
    },
    pendingCount > 0 && {
      id: 'activity-4',
      title: 'Verification queue updated',
      body: `${pendingCount} card${pendingCount === 1 ? '' : 's'} waiting for verification before public visibility.`,
      time: 'Just now',
    },
  ].filter(Boolean) as Array<{ id: string; title: string; body: string; time: string }>;

  if (!user) {
    return (
      <div className="p-8">
        <div className={cn('rounded-3xl border p-8 text-center', panelBg, panelBorder)}>
          <h2 className="text-2xl font-bold">Profile</h2>
          <p className={cn('mt-3 text-sm', muted)}>Login in FODR to open your social collector profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 flex flex-col gap-8">
      <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-[#151515] via-[#2c1212] to-[#101a2c] p-8 text-white shadow-2xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(249,115,22,0.25),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.18),transparent_30%)]" />
        <div className="relative flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex flex-col gap-5 lg:max-w-3xl">
            <div className="flex items-center gap-5">
              <img
                src="https://picsum.photos/seed/fodr-profile/160/160"
                alt="Profile"
                className="h-28 w-28 rounded-[2rem] border border-white/20 object-cover shadow-xl"
                referrerPolicy="no-referrer"
              />
              <div>
                <div className="text-3xl font-black uppercase tracking-tight">{String(user?.username || 'FODR User')}</div>
                <div className="mt-1 text-sm font-bold uppercase tracking-[0.25em] text-orange-300">Collector Profile</div>
                <div className="mt-3 max-w-2xl text-sm text-white/75">
                  Public social profile for your cards, pinned showcases, collection value, and collector reputation across FODR.
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              {[
                { label: 'Followers', value: followers.toLocaleString() },
                { label: 'Following', value: following.toLocaleString() },
                { label: 'Posts', value: posts.toLocaleString() },
                { label: 'Account Value', value: formatMoney(portfolioValue) },
              ].map((stat) => (
                <div key={stat.label} className="min-w-[150px] rounded-2xl border border-white/15 bg-white/5 px-4 py-3 backdrop-blur-xl">
                  <div className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/55">{stat.label}</div>
                  <div className="mt-2 text-2xl font-black">{stat.value}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 lg:w-[320px]">
            {[
              { label: 'Pinned Cards', value: String(pinnedCards.length) },
              { label: 'Public Collections', value: String(publicCollections.length) },
              { label: 'Verified Cards', value: String(cards.length) },
              { label: 'Pending Queue', value: String(pendingCount) },
            ].map((item) => (
              <div key={item.label} className="rounded-2xl border border-white/15 bg-black/20 px-4 py-3 backdrop-blur-xl">
                <div className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/50">{item.label}</div>
                <div className="mt-2 text-xl font-black">{item.value}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="flex flex-wrap gap-2">
        {(['Overview', 'Pinned', 'Collections', 'Activity'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setProfileTab(tab)}
            className={cn(
              'px-4 py-2 rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-colors',
              profileTab === tab ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20' : cn(chipBg, muted)
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {profileTab === 'Overview' && (
        <div className="grid grid-cols-1 xl:grid-cols-[1.5fr_1fr] gap-6">
          <div className={cn('rounded-3xl border p-6', panelBg, panelBorder)}>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-lg font-bold">Pinned Public Cards</div>
                <div className={cn('text-[10px] uppercase tracking-widest', muted)}>Cards currently showcased on your profile</div>
              </div>
              <span className="rounded-full bg-orange-500/20 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-orange-300">
                Public
              </span>
            </div>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              {pinnedCards.map((card) => (
                <div key={card.id} className={cn('rounded-2xl border p-4', panelBorder, panelBg)}>
                  <div className="flex items-start gap-4">
                    <img src={card.image} alt={card.name} className="h-28 w-20 rounded-2xl object-contain bg-black/20" referrerPolicy="no-referrer" />
                    <div className="flex-1">
                      <div className="text-lg font-bold">{card.name}</div>
                      <div className={cn('mt-1 text-[10px] uppercase tracking-widest', muted)}>
                        {card.edition} · {card.rarity}
                      </div>
                      <div className="mt-4 text-sm font-bold text-orange-400">{card.value}</div>
                      <div className={cn('mt-3 text-xs leading-relaxed', muted)}>
                        {card.note || `${card.name} is currently pinned as part of your public collector showcase.`}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={cn('rounded-3xl border p-6', panelBg, panelBorder)}>
            <div className="text-lg font-bold">Collector Snapshot</div>
            <div className={cn('mt-1 text-[10px] uppercase tracking-widest', muted)}>Social profile information</div>
            <div className="mt-6 space-y-4">
              {[
                ['Username', `@${String(user?.username || '').toLowerCase()}`],
                ['Public Collections', String(publicCollections.length)],
                ['Pinned Showcase Value', formatMoney(pinnedCards.reduce((sum, card) => sum + Number(card.valueNumber || 0), 0))],
                ['Most Valuable Edition', publicCollections[0]?.edition || 'No collection yet'],
                ['Account Valuation', formatMoney(portfolioValue)],
              ].map(([label, value]) => (
                <div key={label} className="flex items-center justify-between border-b border-gray-100 pb-3 text-sm last:border-b-0 dark:border-white/10">
                  <span className={muted}>{label}</span>
                  <span className="font-bold">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {profileTab === 'Pinned' && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
          {pinnedCards.map((card) => (
            <div key={card.id} className={cn('rounded-3xl border p-4', panelBg, panelBorder)}>
              <img src={card.image} alt={card.name} className="h-64 w-full rounded-[1.5rem] object-contain bg-black/20" referrerPolicy="no-referrer" />
              <div className="mt-4 text-lg font-bold">{card.name}</div>
              <div className={cn('mt-1 text-[10px] uppercase tracking-widest', muted)}>{card.edition}</div>
              <div className="mt-3 text-sm font-bold text-orange-400">{card.value}</div>
            </div>
          ))}
        </div>
      )}

      {profileTab === 'Collections' && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {publicCollections.map((collection) => (
            <div key={collection.edition} className={cn('rounded-3xl border p-5', panelBg, panelBorder)}>
              <div className="text-lg font-bold">{collection.edition}</div>
              <div className={cn('mt-1 text-[10px] uppercase tracking-widest', muted)}>Public collection</div>
              <div className="mt-5 flex items-center justify-between text-sm">
                <span className={muted}>Cards</span>
                <span className="font-bold">{collection.count}</span>
              </div>
              <div className="mt-3 flex items-center justify-between text-sm">
                <span className={muted}>Audience</span>
                <span className="font-bold">{collection.audience}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {profileTab === 'Activity' && (
        <div className={cn('rounded-3xl border p-6', panelBg, panelBorder)}>
          <div className="text-lg font-bold">Profile Activity</div>
          <div className={cn('mt-1 text-[10px] uppercase tracking-widest', muted)}>Public actions and showcase updates</div>
          <div className="mt-6 space-y-4">
            {activityFeed.map((item) => (
              <div key={item.id} className={cn('rounded-2xl border p-4', panelBorder, panelBg)}>
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="text-sm font-bold">{item.title}</div>
                    <div className={cn('mt-2 text-xs leading-relaxed', muted)}>{item.body}</div>
                  </div>
                  <span className={cn('text-[10px] font-bold uppercase tracking-widest', muted)}>{item.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const ReportsView = ({ isDarkMode }: { isDarkMode: boolean }) => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [reportSearch, setReportSearch] = useState('');
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
  const [reportActionMessage, setReportActionMessage] = useState<string | null>(null);
  const [reportList, setReportList] = useState(() => ([
    {
      id: 'rep-sales-daily',
      category: 'Sales',
      title: 'Daily Sales Summary',
      description: 'Revenue, average sale price, margin by edition.',
      frequency: 'Daily',
      status: 'Ready',
      lastRun: 'Today 08:10',
      owner: 'Vault IQ',
      format: 'PDF + CSV',
      size: '1.2MB',
      autoSchedule: true
    },
    {
      id: 'rep-sales-monthly',
      category: 'Sales',
      title: 'Monthly Sales Performance',
      description: 'Net sales, growth rate, top buyers, and payout fees.',
      frequency: 'Monthly',
      status: 'Queued',
      lastRun: 'Mar 14 06:00',
      owner: 'Finance',
      format: 'PDF + XLSX',
      size: '6.4MB',
      autoSchedule: true
    },
    {
      id: 'rep-trades-open',
      category: 'Trades',
      title: 'Open Trades Pipeline',
      description: 'All active trades, escrow status, counter timelines.',
      frequency: 'Hourly',
      status: 'Ready',
      lastRun: 'Just now',
      owner: 'Trading Desk',
      format: 'CSV',
      size: '420KB',
      autoSchedule: true
    },
    {
      id: 'rep-trades-closed',
      category: 'Trades',
      title: 'Closed Trades Ledger',
      description: 'Accepted, declined, and expired offers with outcomes.',
      frequency: 'Daily',
      status: 'Ready',
      lastRun: 'Today 07:30',
      owner: 'Trading Desk',
      format: 'PDF + CSV',
      size: '2.8MB',
      autoSchedule: true
    },
    {
      id: 'rep-sold-items',
      category: 'Sold Items',
      title: 'Sold Items Register',
      description: 'Sold card inventory with buyer, price, and margin.',
      frequency: 'Daily',
      status: 'Ready',
      lastRun: 'Today 09:05',
      owner: 'Ops',
      format: 'XLSX',
      size: '3.1MB',
      autoSchedule: true
    },
    {
      id: 'rep-listings',
      category: 'Listings',
      title: 'Active Listings Digest',
      description: 'Listings performance, time on market, and pricing band.',
      frequency: 'Daily',
      status: 'Ready',
      lastRun: 'Today 06:45',
      owner: 'Marketplace',
      format: 'PDF + CSV',
      size: '1.9MB',
      autoSchedule: true
    },
    {
      id: 'rep-revenue',
      category: 'Revenue',
      title: 'Revenue Forecast',
      description: 'Projected revenue, fee capture, and seasonal variance.',
      frequency: 'Weekly',
      status: 'Queued',
      lastRun: 'Mar 13 07:00',
      owner: 'Finance',
      format: 'PDF',
      size: '2.1MB',
      autoSchedule: false
    },
    {
      id: 'rep-commission',
      category: 'Revenue',
      title: 'Commission Breakdown',
      description: 'Commission split by category, tier, and channel.',
      frequency: 'Monthly',
      status: 'Ready',
      lastRun: 'Mar 01 09:00',
      owner: 'Finance',
      format: 'XLSX',
      size: '1.3MB',
      autoSchedule: true
    },
    {
      id: 'rep-compliance',
      category: 'Compliance',
      title: 'Compliance & KYC Log',
      description: 'KYC status, flagged accounts, and audit notes.',
      frequency: 'Weekly',
      status: 'Ready',
      lastRun: 'Mar 15 05:00',
      owner: 'Compliance',
      format: 'PDF',
      size: '900KB',
      autoSchedule: true
    },
    {
      id: 'rep-risk',
      category: 'Risk',
      title: 'Risk Exposure Report',
      description: 'Volatility, concentration risk, and insurance gaps.',
      frequency: 'Weekly',
      status: 'Ready',
      lastRun: 'Mar 14 05:30',
      owner: 'Risk',
      format: 'PDF + CSV',
      size: '2.4MB',
      autoSchedule: true
    },
    {
      id: 'rep-demand',
      category: 'Market',
      title: 'Market Demand Snapshot',
      description: 'Search volume, watchlist spikes, and demand index.',
      frequency: 'Daily',
      status: 'Ready',
      lastRun: 'Today 08:20',
      owner: 'Market Intel',
      format: 'PDF',
      size: '1.1MB',
      autoSchedule: true
    },
    {
      id: 'rep-pricing',
      category: 'Market',
      title: 'Pricing Movement Radar',
      description: 'Top movers, floor price shifts, and volatility heatmap.',
      frequency: 'Daily',
      status: 'Queued',
      lastRun: 'Mar 14 04:00',
      owner: 'Market Intel',
      format: 'PDF + CSV',
      size: '3.6MB',
      autoSchedule: false
    }
  ]));

  const categories = ['All', 'Sales', 'Trades', 'Sold Items', 'Listings', 'Revenue', 'Compliance', 'Risk', 'Market'];
  const panelBg = isDarkMode ? 'bg-white/5' : 'bg-white';
  const panelBorder = isDarkMode ? 'border-white/10' : 'border-gray-200';
  const muted = isDarkMode ? 'text-gray-400' : 'text-gray-500';

  const filteredReports = reportList.filter((report) => {
    const matchesCategory = activeCategory === 'All' || report.category === activeCategory;
    const query = reportSearch.trim().toLowerCase();
    const matchesSearch =
      !query ||
      report.title.toLowerCase().includes(query) ||
      report.description.toLowerCase().includes(query) ||
      report.category.toLowerCase().includes(query);
    return matchesCategory && matchesSearch;
  });

  useEffect(() => {
    if (!selectedReportId && filteredReports.length > 0) {
      setSelectedReportId(filteredReports[0].id);
    }
  }, [filteredReports, selectedReportId]);

  const selectedReport = reportList.find((report) => report.id === selectedReportId) ?? filteredReports[0];
  const updateReport = (id: string, updates: Partial<typeof reportList[number]>) => {
    setReportList((prev) => prev.map((report) => (report.id === id ? { ...report, ...updates } : report)));
  };
  const handleGenerate = (id: string) => {
    updateReport(id, { status: 'Queued', lastRun: 'Just now' });
    const report = reportList.find((item) => item.id === id);
    const message = `${report?.title ?? 'Report'} queued`;
    setReportActionMessage(message);
    emitDashboardAction(message);
  };

  return (
    <div className="p-8 flex flex-col gap-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Reports Center</h2>
          <p className={cn('text-sm', muted)}>
            Sales, trades, sold items, and market intelligence reports in one command desk.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => {
              filteredReports.forEach((report) => updateReport(report.id, { status: 'Queued', lastRun: 'Just now' }));
              const message = `Bundle generated for ${filteredReports.length} reports`;
              setReportActionMessage(message);
              emitDashboardAction(message);
            }}
            className="px-4 py-2 rounded-xl bg-orange-500 text-xs font-bold uppercase tracking-widest text-white shadow-lg shadow-orange-500/20"
          >
            Generate Bundle
          </button>
          <button
            onClick={() => {
              const message = 'Reports center exported';
              setReportActionMessage(message);
              emitDashboardAction(message);
            }}
            className={cn('px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest', panelBg, panelBorder, 'border')}
          >
            Export Center
          </button>
        </div>
      </div>
      {reportActionMessage && <div className={cn('text-[10px] uppercase tracking-widest', muted)}>{reportActionMessage}</div>}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className={cn('rounded-2xl border p-4', panelBg, panelBorder)}>
          <div className="text-[10px] uppercase tracking-widest text-gray-400">Sales Reports</div>
          <div className="mt-2 text-2xl font-bold">12</div>
          <div className="text-xs text-emerald-400 font-bold">+3 new</div>
        </div>
        <div className={cn('rounded-2xl border p-4', panelBg, panelBorder)}>
          <div className="text-[10px] uppercase tracking-widest text-gray-400">Trade Reports</div>
          <div className="mt-2 text-2xl font-bold">9</div>
          <div className="text-xs text-orange-400 font-bold">2 queued</div>
        </div>
        <div className={cn('rounded-2xl border p-4', panelBg, panelBorder)}>
          <div className="text-[10px] uppercase tracking-widest text-gray-400">Sold Items</div>
          <div className="mt-2 text-2xl font-bold">7</div>
          <div className="text-xs text-emerald-400 font-bold">Ready</div>
        </div>
        <div className={cn('rounded-2xl border p-4', panelBg, panelBorder)}>
          <div className="text-[10px] uppercase tracking-widest text-gray-400">Compliance</div>
          <div className="mt-2 text-2xl font-bold">4</div>
          <div className="text-xs text-blue-400 font-bold">Reviewed</div>
        </div>
      </div>

      <div className={cn('rounded-3xl border p-6', panelBg, panelBorder)}>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:w-80">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={reportSearch}
              onChange={(event) => setReportSearch(event.target.value)}
              placeholder="Search reports by title, category, or detail"
              className={cn(
                'w-full rounded-xl pl-9 pr-3 py-2 text-xs font-medium',
                isDarkMode ? 'bg-white/5 border border-white/10 text-gray-200' : 'bg-gray-50 border border-gray-200 text-gray-700'
              )}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={cn(
                  'px-3 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-colors',
                  activeCategory === category
                    ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20'
                    : cn(isDarkMode ? 'bg-white/5 border border-white/10 text-gray-300' : 'bg-gray-50 border border-gray-200 text-gray-600')
                )}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1.6fr_1fr] gap-6">
        <div className={cn('rounded-3xl border overflow-hidden', panelBg, panelBorder)}>
          <div className={cn('px-6 py-4 border-b', panelBorder)}>
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-gray-400">
              <span>Report Catalog</span>
              <span>{filteredReports.length} reports</span>
            </div>
          </div>
          <div className="divide-y divide-white/5">
            {filteredReports.map((report) => (
              <button
                key={report.id}
                onClick={() => setSelectedReportId(report.id)}
                className={cn(
                  'w-full text-left px-6 py-4 transition-colors',
                  selectedReportId === report.id
                    ? 'bg-orange-500/10'
                    : isDarkMode ? 'hover:bg-white/5' : 'hover:bg-gray-50'
                )}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-sm font-bold">{report.title}</div>
                    <p className={cn('text-xs mt-1', muted)}>{report.description}</p>
                    <div className={cn('mt-2 flex flex-wrap gap-2 text-[10px] uppercase tracking-widest', muted)}>
                      <span>{report.category}</span>
                      <span>•</span>
                      <span>{report.frequency}</span>
                      <span>•</span>
                      <span>{report.format}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={cn('text-[10px] font-bold uppercase tracking-widest', report.status === 'Ready' ? 'text-emerald-400' : 'text-orange-400')}>
                      {report.status}
                    </div>
                    <div className={cn('text-[10px]', muted)}>{report.lastRun}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className={cn('rounded-3xl border p-6', panelBg, panelBorder)}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-sm font-bold">{selectedReport?.title ?? 'Select a report'}</div>
                <p className={cn('text-xs mt-1', muted)}>{selectedReport?.description}</p>
              </div>
              {selectedReport && (
                <button
                  onClick={() => handleGenerate(selectedReport.id)}
                  className="px-3 py-2 rounded-xl bg-orange-500 text-[10px] font-bold uppercase tracking-widest text-white"
                >
                  Generate
                </button>
              )}
            </div>
            {selectedReport && (
              <div className="mt-6 grid grid-cols-2 gap-4 text-xs">
                <div>
                  <div className={cn('text-[10px] uppercase tracking-widest', muted)}>Category</div>
                  <div className="mt-1 font-bold">{selectedReport.category}</div>
                </div>
                <div>
                  <div className={cn('text-[10px] uppercase tracking-widest', muted)}>Frequency</div>
                  <div className="mt-1 font-bold">{selectedReport.frequency}</div>
                </div>
                <div>
                  <div className={cn('text-[10px] uppercase tracking-widest', muted)}>Owner</div>
                  <div className="mt-1 font-bold">{selectedReport.owner}</div>
                </div>
                <div>
                  <div className={cn('text-[10px] uppercase tracking-widest', muted)}>Format</div>
                  <div className="mt-1 font-bold">{selectedReport.format}</div>
                </div>
                <div>
                  <div className={cn('text-[10px] uppercase tracking-widest', muted)}>Last Run</div>
                  <div className="mt-1 font-bold">{selectedReport.lastRun}</div>
                </div>
                <div>
                  <div className={cn('text-[10px] uppercase tracking-widest', muted)}>File Size</div>
                  <div className="mt-1 font-bold">{selectedReport.size}</div>
                </div>
              </div>
            )}
            {selectedReport && (
              <div className="mt-6 flex flex-wrap gap-2">
                <button
                  onClick={() => {
                    const message = `${selectedReport.title} PDF download prepared`;
                    setReportActionMessage(message);
                    emitDashboardAction(message);
                  }}
                  className="px-3 py-2 rounded-xl bg-emerald-500/20 text-emerald-300 text-[10px] font-bold uppercase tracking-widest"
                >
                  Download PDF
                </button>
                <button
                  onClick={() => {
                    const message = `${selectedReport.title} CSV download prepared`;
                    setReportActionMessage(message);
                    emitDashboardAction(message);
                  }}
                  className={cn('px-3 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest', panelBg, panelBorder, 'border')}
                >
                  Download CSV
                </button>
                <button
                  onClick={() => {
                    const message = `${selectedReport.title} share link copied`;
                    setReportActionMessage(message);
                    emitDashboardAction(message);
                  }}
                  className={cn('px-3 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest', panelBg, panelBorder, 'border')}
                >
                  Share
                </button>
              </div>
            )}
          </div>

          <div className={cn('rounded-3xl border p-6', panelBg, panelBorder)}>
            <div className="flex items-center justify-between">
              <div className="text-sm font-bold">Scheduling & Delivery</div>
              <Clock size={16} className="text-orange-400" />
            </div>
            <div className="mt-4 space-y-3 text-xs">
              {filteredReports.slice(0, 4).map((report) => (
                <div key={report.id} className={cn('flex items-center justify-between rounded-xl border px-3 py-2', panelBorder)}>
                  <div>
                    <div className="font-bold">{report.title}</div>
                    <div className={cn('text-[10px] uppercase tracking-widest', muted)}>{report.frequency}</div>
                  </div>
                  <button
                    onClick={() => updateReport(report.id, { autoSchedule: !report.autoSchedule })}
                    className={cn(
                      'px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-widest',
                      report.autoSchedule ? 'bg-emerald-500/20 text-emerald-300' : cn(panelBg, panelBorder, 'border', muted)
                    )}
                  >
                    {report.autoSchedule ? 'Scheduled' : 'Manual'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const SettingsView = ({ isDarkMode }: { isDarkMode: boolean }) => {
  const panelBg = isDarkMode ? 'bg-white/5' : 'bg-white';
  const panelBorder = isDarkMode ? 'border-white/10' : 'border-gray-200';
  const muted = isDarkMode ? 'text-gray-400' : 'text-gray-500';

  const [settingsSearch, setSettingsSearch] = useState('');
  const [activeProfile, setActiveProfile] = useState('Competitive');
  const [riskTolerance, setRiskTolerance] = useState(62);
  const [autoBidCap, setAutoBidCap] = useState(150000);
  const [maxTradeValue, setMaxTradeValue] = useState(2500000);
  const [priceDrift, setPriceDrift] = useState(3);
  const [refreshInterval, setRefreshInterval] = useState(15);
  const [retentionDays, setRetentionDays] = useState(180);
  const [sessionTimeout, setSessionTimeout] = useState(30);
  const [regions, setRegions] = useState<string[]>(['EU', 'NA', 'MEA']);
  const [channels, setChannels] = useState<string[]>(['In-app', 'Email', 'Push']);
  const [tradeModes, setTradeModes] = useState<string[]>(['Direct Sale', 'Swap', 'Escrow']);
  const [integrations, setIntegrations] = useState<string[]>(['Ledger', 'Discord']);
  const [uiDensity, setUiDensity] = useState('Dense');
  const [alertSensitivity, setAlertSensitivity] = useState('Balanced');
  const [settingsSavedAt, setSettingsSavedAt] = useState<string | null>(null);
  const [commandSwitches, setCommandSwitches] = useState<Record<string, boolean>>({
    'Freeze Trades': false,
    'Lock Vault': true,
    'Pause Listings': false,
    'Block Exports': false,
    'Emergency Mode': false,
    'Manual Pricing': true,
  });

  const toggleListItem = (value: string, list: string[], setter: (value: string[]) => void) => {
    setter(list.includes(value) ? list.filter((item) => item !== value) : [...list, value]);
  };

  const toggleSections = [
    {
      title: 'Trading Controls',
      description: 'Guardrails, approvals, and trading automation.',
      items: [
        { key: 'autoEscrow', label: 'Auto-escrow on accepted trades', description: 'Open escrow the moment a trade is accepted.', default: true },
        { key: 'autoCounter', label: 'Auto-counter below floor', description: 'Auto-counter any offer below your floor price.', default: true },
        { key: 'instantAccept', label: 'Instant accept at target', description: 'Immediately accept if target price is met.', default: false },
        { key: 'tradeApproval', label: 'Require manual approval', description: 'Stop any automated trade from completing.', default: true },
        { key: 'swapOnly', label: 'Swap only for top 10 cards', description: 'Restrict swap targets to top card tier.', default: false },
        { key: 'multiOffer', label: 'Allow multi-offer bundles', description: 'Approve bundles for high-value trades.', default: true },
        { key: 'floorGuard', label: 'Floor guardrails', description: 'Block offers below floor minus tolerance.', default: true },
        { key: 'outboundLimit', label: 'Outbound trade limit', description: 'Cap simultaneous outbound offers.', default: false }
      ]
    },
    {
      title: 'Market Data & Alerts',
      description: 'Pricing feeds, refresh cadence, and alerting.',
      items: [
        { key: 'priceRefresh', label: 'High frequency price sync', description: 'Sync pricing every few minutes.', default: true },
        { key: 'watchlistAlerts', label: 'Watchlist spike alerts', description: 'Notify when watchlist spikes.', default: true },
        { key: 'volumeAlerts', label: 'Volume anomaly alerts', description: 'Detect abnormal volume surges.', default: true },
        { key: 'floorWatch', label: 'Floor drift alarms', description: 'Alert on floor price shifts.', default: true },
        { key: 'demandIndex', label: 'Demand index notifications', description: 'Push demand index updates.', default: false },
        { key: 'priceAnomaly', label: 'Price anomaly scans', description: 'Detect outlier pricing in marketplace.', default: true },
        { key: 'insiderTracker', label: 'Insider watch channel', description: 'Monitor top wallet movement.', default: false },
        { key: 'marketPulse', label: 'Market pulse briefing', description: 'Daily market pulse summary.', default: true }
      ]
    },
    {
      title: 'Security & Compliance',
      description: 'Vault access, KYC, and security posture.',
      items: [
        { key: 'twoFactor', label: 'Two-factor authentication', description: 'Require MFA on critical actions.', default: true },
        { key: 'geoLock', label: 'Geo-lock access', description: 'Restrict access to trusted regions.', default: true },
        { key: 'sessionLock', label: 'Session hard lock', description: 'Auto-lock after inactivity.', default: true },
        { key: 'deviceApproval', label: 'Device approval flow', description: 'Approve new devices before login.', default: true },
        { key: 'kycAlerts', label: 'KYC monitoring', description: 'Alert on KYC anomalies.', default: true },
        { key: 'escrowReview', label: 'Escrow review gate', description: 'Require review before escrow release.', default: true },
        { key: 'vaultAudit', label: 'Weekly vault audit', description: 'Run weekly vault security audit.', default: true },
        { key: 'riskFreeze', label: 'Risk freeze mode', description: 'Freeze trades during risk events.', default: false }
      ]
    },
    {
      title: 'Notifications & Channels',
      description: 'Delivery channels and notification rules.',
      items: [
        { key: 'smsAlerts', label: 'SMS alerts', description: 'Send SMS for high priority events.', default: false },
        { key: 'emailDigest', label: 'Email daily digest', description: 'Send a daily summary email.', default: true },
        { key: 'pushRealtime', label: 'Push realtime updates', description: 'Push trading events instantly.', default: true },
        { key: 'soundAlerts', label: 'Sound alerts', description: 'Play audio cues for trades.', default: false },
        { key: 'vipOnly', label: 'VIP only mode', description: 'Only notify on top tier cards.', default: false },
        { key: 'quietHours', label: 'Quiet hours', description: 'Suppress notifications overnight.', default: true },
        { key: 'adminBroadcasts', label: 'Admin broadcast channel', description: 'Enable platform announcements.', default: true },
        { key: 'webhookAlerts', label: 'Webhook alerts', description: 'Send alerts to webhooks.', default: false }
      ]
    },
    {
      title: 'Automation & AI',
      description: 'Automation rules and AI driven decisions.',
      items: [
        { key: 'autoList', label: 'Auto-list top movers', description: 'Auto-list when price spikes.', default: true },
        { key: 'autoBid', label: 'Auto-bid on watchlist', description: 'Auto-bid on watchlist targets.', default: false },
        { key: 'smartFloor', label: 'Smart floor pricing', description: 'Use AI to adjust floor prices.', default: true },
        { key: 'autoRebalance', label: 'Auto portfolio rebalance', description: 'Rebalance across rarity tiers.', default: false },
        { key: 'autoHedge', label: 'Auto hedge exposure', description: 'Hedge concentrated holdings.', default: false },
        { key: 'pricePrediction', label: 'AI price prediction', description: 'Enable predictive signals.', default: true },
        { key: 'offerTriage', label: 'Offer triage', description: 'Rank offers by probability.', default: true },
        { key: 'autoSnapshot', label: 'Auto snapshot', description: 'Capture end of day snapshot.', default: true }
      ]
    },
    {
      title: 'Display & UX',
      description: 'Layout density, visuals, and accessibility.',
      items: [
        { key: 'denseMode', label: 'Dense layout', description: 'Show more data per screen.', default: true },
        { key: 'motionFx', label: 'Motion effects', description: 'Enable advanced motion effects.', default: true },
        { key: 'reducedMotion', label: 'Reduced motion', description: 'Reduce animation intensity.', default: false },
        { key: 'highContrast', label: 'High contrast mode', description: 'Boost contrast across UI.', default: false },
        { key: 'compactCharts', label: 'Compact charts', description: 'Use compact chart rendering.', default: true },
        { key: 'focusMode', label: 'Focus mode', description: 'Limit distractions during trade.', default: false },
        { key: 'liveBlur', label: 'Background blur', description: 'Enable glass blur effect.', default: true },
        { key: 'autoTheme', label: 'Auto theme switch', description: 'Match OS theme automatically.', default: false }
      ]
    },
    {
      title: 'Integrations',
      description: 'Connected tools and outbound systems.',
      items: [
        { key: 'ledgerSync', label: 'Ledger sync', description: 'Sync transactions with ledger.', default: true },
        { key: 'slackPush', label: 'Slack alerts', description: 'Send alerts to Slack channel.', default: false },
        { key: 'discordPush', label: 'Discord alerts', description: 'Send alerts to Discord.', default: true },
        { key: 'crmSync', label: 'CRM sync', description: 'Sync collector profiles to CRM.', default: false },
        { key: 'apiAccess', label: 'API access', description: 'Enable API token usage.', default: true },
        { key: 'marketExport', label: 'Market export feed', description: 'Export pricing feed to partners.', default: false },
        { key: 'vaultBridge', label: 'Vault bridge', description: 'Connect to external vault storage.', default: true },
        { key: 'insurerBridge', label: 'Insurer bridge', description: 'Sync to insurance provider.', default: true }
      ]
    },
    {
      title: 'Privacy & Retention',
      description: 'Retention, privacy, and audit controls.',
      items: [
        { key: 'maskPII', label: 'Mask PII', description: 'Hide sensitive customer data.', default: true },
        { key: 'auditTrail', label: 'Audit trail logging', description: 'Record all sensitive changes.', default: true },
        { key: 'downloadLogs', label: 'Download logs', description: 'Allow log export by admins.', default: false },
        { key: 'dataPurge', label: 'Scheduled purge', description: 'Purge old data on schedule.', default: false },
        { key: 'legalHold', label: 'Legal hold', description: 'Lock data for compliance.', default: false },
        { key: 'snapshotEncryption', label: 'Snapshot encryption', description: 'Encrypt daily snapshots.', default: true },
        { key: 'tokenRotation', label: 'Token rotation', description: 'Rotate API tokens monthly.', default: true },
        { key: 'consentTracking', label: 'Consent tracking', description: 'Track user consent status.', default: true }
      ]
    }
  ];

  const defaultToggleState = toggleSections.reduce<Record<string, boolean>>((acc, section) => {
    section.items.forEach((item) => {
      acc[item.key] = item.default;
    });
    return acc;
  }, {});
  const [toggleState, setToggleState] = useState(defaultToggleState);

  const matchesSearch = (text: string) => text.toLowerCase().includes(settingsSearch.trim().toLowerCase());
  const filteredSections = toggleSections
    .map((section) => ({
      ...section,
      items: section.items.filter((item) => !settingsSearch.trim() || matchesSearch(item.label) || matchesSearch(item.description) || matchesSearch(section.title))
    }))
    .filter((section) => section.items.length > 0);

  return (
    <div className="p-8 flex flex-col gap-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">System Settings</h2>
          <p className={cn('text-sm', muted)}>Full cockpit for trading, security, data feeds, and automation.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {['Competitive', 'Balanced', 'Conservative', 'Experimental'].map((profile) => (
            <button
              key={profile}
              onClick={() => setActiveProfile(profile)}
              className={cn(
                'px-3 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest',
                activeProfile === profile
                  ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20'
                  : cn(panelBg, panelBorder, 'border', muted)
              )}
            >
              {profile}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1.4fr_1fr] gap-6">
        <div className={cn('rounded-3xl border p-6', panelBg, panelBorder)}>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="text-sm font-bold">Global Controls</div>
              <div className={cn('text-[10px] uppercase tracking-widest', muted)}>Search and tune every setting</div>
            </div>
            <div className="relative w-full lg:w-80">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={settingsSearch}
                onChange={(event) => setSettingsSearch(event.target.value)}
                placeholder="Search settings"
                className={cn(
                  'w-full rounded-xl pl-9 pr-3 py-2 text-xs font-medium',
                  isDarkMode ? 'bg-white/5 border border-white/10 text-gray-200' : 'bg-gray-50 border border-gray-200 text-gray-700'
                )}
              />
            </div>
          </div>
          <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            <div className={cn('rounded-2xl border p-3', panelBorder)}>
              <div className={cn('text-[10px] uppercase tracking-widest', muted)}>Risk Tolerance</div>
              <div className="mt-2 text-lg font-bold">{riskTolerance}%</div>
              <input
                type="range"
                min={0}
                max={100}
                value={riskTolerance}
                onChange={(event) => setRiskTolerance(Number(event.target.value))}
                className="mt-2 w-full"
              />
            </div>
            <div className={cn('rounded-2xl border p-3', panelBorder)}>
              <div className={cn('text-[10px] uppercase tracking-widest', muted)}>Auto-bid Cap</div>
              <div className="mt-2 text-lg font-bold">${autoBidCap.toLocaleString()}</div>
              <input
                type="range"
                min={25000}
                max={500000}
                step={5000}
                value={autoBidCap}
                onChange={(event) => setAutoBidCap(Number(event.target.value))}
                className="mt-2 w-full"
              />
            </div>
            <div className={cn('rounded-2xl border p-3', panelBorder)}>
              <div className={cn('text-[10px] uppercase tracking-widest', muted)}>Max Trade Value</div>
              <div className="mt-2 text-lg font-bold">${maxTradeValue.toLocaleString()}</div>
              <input
                type="range"
                min={500000}
                max={5000000}
                step={50000}
                value={maxTradeValue}
                onChange={(event) => setMaxTradeValue(Number(event.target.value))}
                className="mt-2 w-full"
              />
            </div>
            <div className={cn('rounded-2xl border p-3', panelBorder)}>
              <div className={cn('text-[10px] uppercase tracking-widest', muted)}>Price Drift</div>
              <div className="mt-2 text-lg font-bold">{priceDrift}%</div>
              <input
                type="range"
                min={1}
                max={10}
                value={priceDrift}
                onChange={(event) => setPriceDrift(Number(event.target.value))}
                className="mt-2 w-full"
              />
            </div>
          </div>
        </div>

        <div className={cn('rounded-3xl border p-6 space-y-5', panelBg, panelBorder)}>
          <div>
            <div className="text-sm font-bold">Command Switches</div>
            <div className={cn('text-[10px] uppercase tracking-widest', muted)}>Critical system toggles</div>
          </div>
          <div className="grid grid-cols-2 gap-2 text-[10px] font-bold uppercase tracking-widest">
            {['Freeze Trades', 'Lock Vault', 'Pause Listings', 'Block Exports', 'Emergency Mode', 'Manual Pricing'].map((label) => (
              <button
                key={label}
                onClick={() => {
                  setCommandSwitches((prev) => {
                    const next = !prev[label];
                    emitDashboardAction(`${label} ${next ? 'enabled' : 'disabled'}`);
                    return { ...prev, [label]: next };
                  });
                }}
                className={cn(
                  'px-3 py-2 rounded-xl border transition-colors',
                  commandSwitches[label] ? 'bg-orange-500 text-white border-orange-400' : cn(panelBorder, panelBg, muted),
                )}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <span className={muted}>Refresh interval</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setRefreshInterval((prev) => Math.max(5, prev - 5))}
                  className={cn('px-2 py-1 rounded-lg border', panelBorder, panelBg, muted)}
                >
                  <Minus size={12} />
                </button>
                <span className="font-bold">{refreshInterval} min</span>
                <button
                  onClick={() => setRefreshInterval((prev) => Math.min(60, prev + 5))}
                  className={cn('px-2 py-1 rounded-lg border', panelBorder, panelBg, muted)}
                >
                  <Plus size={12} />
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className={muted}>Session timeout</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSessionTimeout((prev) => Math.max(10, prev - 5))}
                  className={cn('px-2 py-1 rounded-lg border', panelBorder, panelBg, muted)}
                >
                  <Minus size={12} />
                </button>
                <span className="font-bold">{sessionTimeout} min</span>
                <button
                  onClick={() => setSessionTimeout((prev) => Math.min(120, prev + 5))}
                  className={cn('px-2 py-1 rounded-lg border', panelBorder, panelBg, muted)}
                >
                  <Plus size={12} />
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className={muted}>Retention days</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setRetentionDays((prev) => Math.max(30, prev - 30))}
                  className={cn('px-2 py-1 rounded-lg border', panelBorder, panelBg, muted)}
                >
                  <Minus size={12} />
                </button>
                <span className="font-bold">{retentionDays} days</span>
                <button
                  onClick={() => setRetentionDays((prev) => Math.min(365, prev + 30))}
                  className={cn('px-2 py-1 rounded-lg border', panelBorder, panelBg, muted)}
                >
                  <Plus size={12} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className={cn('rounded-3xl border p-6', panelBg, panelBorder)}>
          <div className="text-sm font-bold">Allowed Regions</div>
          <div className={cn('text-[10px] uppercase tracking-widest', muted)}>Geo access policy</div>
          <div className="mt-4 flex flex-wrap gap-2">
            {['EU', 'NA', 'SA', 'APAC', 'MEA'].map((region) => (
              <button
                key={region}
                onClick={() => toggleListItem(region, regions, setRegions)}
                className={cn(
                  'px-3 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest',
                  regions.includes(region)
                    ? 'bg-emerald-500/20 text-emerald-300'
                    : cn(panelBg, panelBorder, 'border', muted)
                )}
              >
                {region}
              </button>
            ))}
          </div>
        </div>

        <div className={cn('rounded-3xl border p-6', panelBg, panelBorder)}>
          <div className="text-sm font-bold">Notification Channels</div>
          <div className={cn('text-[10px] uppercase tracking-widest', muted)}>Delivery endpoints</div>
          <div className="mt-4 flex flex-wrap gap-2">
            {['In-app', 'Email', 'SMS', 'Push', 'Webhook', 'Slack', 'Discord'].map((channel) => (
              <button
                key={channel}
                onClick={() => toggleListItem(channel, channels, setChannels)}
                className={cn(
                  'px-3 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest',
                  channels.includes(channel)
                    ? 'bg-orange-500/20 text-orange-300'
                    : cn(panelBg, panelBorder, 'border', muted)
                )}
              >
                {channel}
              </button>
            ))}
          </div>
        </div>

        <div className={cn('rounded-3xl border p-6', panelBg, panelBorder)}>
          <div className="text-sm font-bold">Trade Modes</div>
          <div className={cn('text-[10px] uppercase tracking-widest', muted)}>Allowed trade execution modes</div>
          <div className="mt-4 flex flex-wrap gap-2">
            {['Direct Sale', 'Auction', 'Swap', 'Swap + Cash', 'Private Listing', 'Escrow'].map((mode) => (
              <button
                key={mode}
                onClick={() => toggleListItem(mode, tradeModes, setTradeModes)}
                className={cn(
                  'px-3 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest',
                  tradeModes.includes(mode)
                    ? 'bg-blue-500/20 text-blue-300'
                    : cn(panelBg, panelBorder, 'border', muted)
                )}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {filteredSections.map((section) => (
          <div key={section.title} className={cn('rounded-3xl border p-6', panelBg, panelBorder)}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-sm font-bold">{section.title}</div>
                <div className={cn('text-[10px] uppercase tracking-widest', muted)}>{section.description}</div>
              </div>
              <button
                onClick={() => {
                  const nextState = { ...toggleState };
                  section.items.forEach((item) => {
                    nextState[item.key] = !section.items.every((entry) => toggleState[entry.key]);
                  });
                  setToggleState(nextState);
                }}
                className={cn('px-3 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest', panelBg, panelBorder, 'border')}
              >
                Toggle All
              </button>
            </div>
            <div className="mt-4 grid grid-cols-1 gap-3">
              {section.items.map((item) => (
                <button
                  key={item.key}
                  onClick={() => setToggleState((prev) => ({ ...prev, [item.key]: !prev[item.key] }))}
                  className={cn(
                    'w-full rounded-2xl border px-4 py-3 text-left transition-colors',
                    toggleState[item.key] ? 'border-emerald-500/40 bg-emerald-500/10' : cn(panelBorder, panelBg)
                  )}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="text-xs font-bold uppercase tracking-widest">{item.label}</div>
                      <div className={cn('text-[10px] mt-1', muted)}>{item.description}</div>
                    </div>
                    <div className={cn('px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest', toggleState[item.key] ? 'bg-emerald-500/20 text-emerald-300' : cn(panelBg, panelBorder, 'border', muted))}>
                      {toggleState[item.key] ? 'On' : 'Off'}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className={cn('rounded-3xl border p-6', panelBg, panelBorder)}>
          <div className="text-sm font-bold">Integration Stack</div>
          <div className={cn('text-[10px] uppercase tracking-widest', muted)}>Active integrations and webhooks</div>
          <div className="mt-4 flex flex-wrap gap-2">
            {['Ledger', 'Slack', 'Discord', 'Salesforce', 'Zapier', 'Notion', 'Google Sheets'].map((integration) => (
              <button
                key={integration}
                onClick={() => toggleListItem(integration, integrations, setIntegrations)}
                className={cn(
                  'px-3 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest',
                  integrations.includes(integration)
                    ? 'bg-emerald-500/20 text-emerald-300'
                    : cn(panelBg, panelBorder, 'border', muted)
                )}
              >
                {integration}
              </button>
            ))}
          </div>
          <div className="mt-6 space-y-2 text-xs">
            {integrations.map((integration) => (
              <div key={integration} className={cn('flex items-center justify-between rounded-xl border px-3 py-2', panelBorder)}>
                <span className="font-bold">{integration}</span>
                <span className="text-emerald-400 font-bold uppercase tracking-widest text-[10px]">Connected</span>
              </div>
            ))}
          </div>
        </div>

        <div className={cn('rounded-3xl border p-6', panelBg, panelBorder)}>
          <div className="text-sm font-bold">Display Preferences</div>
          <div className={cn('text-[10px] uppercase tracking-widest', muted)}>UI density and alert sensitivity</div>
          <div className="mt-4 flex flex-wrap gap-2">
            {['Compact', 'Dense', 'Comfortable', 'Expanded'].map((mode) => (
              <button
                key={mode}
                onClick={() => setUiDensity(mode)}
                className={cn(
                  'px-3 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest',
                  uiDensity === mode ? 'bg-orange-500 text-white' : cn(panelBg, panelBorder, 'border', muted)
                )}
              >
                {mode}
              </button>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {['Low', 'Balanced', 'High', 'Extreme'].map((level) => (
              <button
                key={level}
                onClick={() => setAlertSensitivity(level)}
                className={cn(
                  'px-3 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest',
                  alertSensitivity === level ? 'bg-blue-500/20 text-blue-300' : cn(panelBg, panelBorder, 'border', muted)
                )}
              >
                {level}
              </button>
            ))}
          </div>
          <div className="mt-6 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className={muted}>Card density</span>
              <span className="font-bold">{uiDensity}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className={muted}>Alert sensitivity</span>
              <span className="font-bold">{alertSensitivity}</span>
            </div>
          </div>
        </div>
      </div>

      <div className={cn('rounded-3xl border p-6', panelBg, panelBorder)}>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="text-sm font-bold">Save Configuration</div>
            <div className={cn('text-[10px] uppercase tracking-widest', muted)}>Apply changes across the platform</div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => {
                setSettingsSavedAt('Just now');
                emitDashboardAction('Settings saved across dashboard systems');
              }}
              className="px-4 py-2 rounded-xl bg-orange-500 text-xs font-bold uppercase tracking-widest text-white"
            >
              Save Settings
            </button>
            <button
              onClick={() => {
                setToggleState(defaultToggleState);
                setCommandSwitches({
                  'Freeze Trades': false,
                  'Lock Vault': true,
                  'Pause Listings': false,
                  'Block Exports': false,
                  'Emergency Mode': false,
                  'Manual Pricing': true,
                });
                setSettingsSavedAt('Defaults restored');
                emitDashboardAction('Settings restored to defaults');
              }}
              className={cn('px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest', panelBg, panelBorder, 'border')}
            >
              Reset Defaults
            </button>
          </div>
        </div>
        {settingsSavedAt && (
          <div className={cn('mt-4 text-[10px] uppercase tracking-widest', muted)}>
            Last configuration event: {settingsSavedAt}
          </div>
        )}
      </div>
    </div>
  );
};

const InventoryView = ({
  onCardClick,
  cards,
  loading,
  error,
  user,
  onReload
}: {
  onCardClick: (card: any) => void;
  cards: any[];
  loading: boolean;
  error: string | null;
  user: any | null;
  onReload: () => void;
}) => {
  const sparklineData = [
    { value: 400 }, { value: 300 }, { value: 600 }, { value: 800 }, { value: 500 }, { value: 900 }, { value: 1100 }
  ];
  const [searchQuery, setSearchQuery] = useState('');
  const [rarityFilter, setRarityFilter] = useState('All');
  const [sortBy, setSortBy] = useState('Value High');
  const [viewMode, setViewMode] = useState<'Grid' | 'List'>('Grid');
  const [showTradeableOnly, setShowTradeableOnly] = useState(false);
  const [activeInsight, setActiveInsight] = useState('Overview');
  const [inventoryActionNote, setInventoryActionNote] = useState<string | null>(null);

  const copyInventoryCode = async (card: any) => {
    if (!card?.verificationCode) {
      const message = `${card?.name || 'This card'} does not have a visible code yet`;
      setInventoryActionNote(message);
      emitDashboardAction(message);
      return;
    }

    if (!navigator?.clipboard?.writeText) {
      const message = 'Clipboard copy is not available in this browser';
      setInventoryActionNote(message);
      emitDashboardAction(message);
      return;
    }

    try {
      await navigator.clipboard.writeText(String(card.verificationCode));
      const message = `${card.name} code copied`;
      setInventoryActionNote(message);
      emitDashboardAction(message);
    } catch {
      const message = `Could not copy ${card.name} code`;
      setInventoryActionNote(message);
      emitDashboardAction(message);
    }
  };

  const tradeableIds = new Set([1, 2, 3, 5, 7]);
  const parsePrice = (value: string) => Number(value.replace(/[$,]/g, '')) || 0;
  const formatMoney = (value: number) => `$${Math.round(value).toLocaleString()}`;
  const totalAssets = cards.length;
  const portfolioValueRaw = cards.reduce((sum, card) => {
    const explicit = Number((card as any).valueNumber);
    if (Number.isFinite(explicit) && explicit > 0) return sum + explicit;
    return sum + parsePrice(String((card as any).value || '0'));
  }, 0);
  const avgValueRaw = totalAssets ? Math.round(portfolioValueRaw / totalAssets) : 0;
  const editionsCount = new Set(cards.map((card) => (card as any).edition).filter(Boolean)).size;

  const portfolioTrend = [
    { name: 'JAN', total: 12.4, floor: 9.2 },
    { name: 'FEB', total: 13.1, floor: 9.6 },
    { name: 'MAR', total: 14.7, floor: 10.2 },
    { name: 'APR', total: 13.9, floor: 10.5 },
    { name: 'MAY', total: 15.8, floor: 11.1 },
    { name: 'JUN', total: 16.4, floor: 11.6 },
    { name: 'JUL', total: 17.9, floor: 12.3 },
  ];

  const rarityAllocation = [
    { name: 'Mythic', value: 28, color: '#f97316' },
    { name: 'Legendary', value: 24, color: '#facc15' },
    { name: 'Epic', value: 20, color: '#60a5fa' },
    { name: 'Rare', value: 18, color: '#22c55e' },
    { name: 'Common', value: 10, color: '#9ca3af' },
  ];

  const liquidityBuckets = [
    { name: 'Instant', value: 6 },
    { name: 'Fast (24h)', value: 10 },
    { name: 'Medium (7d)', value: 14 },
    { name: 'Long (30d)', value: 8 },
  ];

  const regionExposure = [
    { name: 'EU', value: 38 },
    { name: 'NA', value: 34 },
    { name: 'SA', value: 12 },
    { name: 'ASIA', value: 10 },
    { name: 'MEA', value: 6 },
  ];

  const activityFeed = [
    { id: 'act-1', label: 'Listed Messi - Barcelona Edition', time: '12m ago', tone: 'up' },
    { id: 'act-2', label: 'Updated insurance on Pele - Brazil Edition', time: '1h ago', tone: 'neutral' },
    { id: 'act-3', label: 'Received trade offer for Maradona - Napoli Edition', time: '2h ago', tone: 'up' },
    { id: 'act-4', label: 'Vault audit completed', time: '1d ago', tone: 'neutral' },
  ];

  const filteredCards = cards.filter((card) => {
    const query = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !query ||
      String(card.name || '').toLowerCase().includes(query) ||
      String(card.team || '').toLowerCase().includes(query) ||
      String(card.rarity || '').toLowerCase().includes(query);
    const matchesRarity = rarityFilter === 'All' || String(card.rarity || '') === rarityFilter;
    const matchesTradeable = !showTradeableOnly || tradeableIds.has(card.id);
    return matchesSearch && matchesRarity && matchesTradeable;
  });

  const sortedCards = [...filteredCards].sort((a, b) => {
    switch (sortBy) {
      case 'Value Low':
        return parsePrice(a.value) - parsePrice(b.value);
      case 'Year Newest':
        return Number(b.year) - Number(a.year);
      case 'Year Oldest':
        return Number(a.year) - Number(b.year);
      case 'Most Owners':
        return b.ownersCount - a.ownersCount;
      default:
        return parsePrice(b.value) - parsePrice(a.value);
    }
  });

  return (
    <div className="p-8 flex flex-col gap-8">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-bold tracking-tight">Inventory Portfolio</h2>
        <p className="text-sm text-gray-500">
          {user?.username ? `Synced for @${String(user.username).toLowerCase()}` : 'Login in FODR to sync your inventory.'}
        </p>
      </div>

      {(loading || error || !user) && (
        <div className="bg-white dark:bg-white/5 rounded-3xl p-4 border border-gray-100 dark:border-white/10 flex items-center justify-between gap-4">
          <div className="text-sm">
            {loading && <span className="font-bold">Syncing inventory…</span>}
            {!loading && error && <span className="font-bold text-red-400">{error}</span>}
            {!loading && !error && !user && <span className="font-bold text-orange-400">Not logged in.</span>}
          </div>
          <button
            type="button"
            onClick={onReload}
            className="px-4 py-2 rounded-2xl bg-orange-500 text-white text-xs font-bold uppercase tracking-widest hover:bg-orange-600 transition"
          >
            Reload
          </button>
        </div>
      )}

      {inventoryActionNote && (
        <div className="bg-white dark:bg-white/5 rounded-3xl px-4 py-3 border border-gray-100 dark:border-white/10 text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-gray-300">
          {inventoryActionNote}
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {['Overview', 'Liquidity', 'Risk', 'Allocations', 'Momentum'].map((label) => (
          <button
            key={label}
            onClick={() => setActiveInsight(label)}
            className={cn(
              'px-3 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-colors',
              activeInsight === label
                ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20'
                : 'bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-500'
            )}
          >
            {label}
          </button>
        ))}
        <button
          onClick={() => setShowTradeableOnly((prev) => !prev)}
          className={cn(
            'px-3 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-colors',
            showTradeableOnly ? 'bg-emerald-500 text-white' : 'bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-500'
          )}
        >
          Tradeable Only
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="relative overflow-hidden bg-white dark:bg-white/5 rounded-[2.5rem] p-10 border border-gray-100 dark:border-white/5 shadow-sm group hover:shadow-2xl transition-all duration-500 md:col-span-1">
          <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/5 rounded-full -mr-32 -mt-32 blur-3xl group-hover:bg-orange-500/10 transition-colors" />
          <div className="flex items-center justify-between mb-8">
            <div className="w-16 h-16 bg-orange-100 dark:bg-orange-500/20 rounded-3xl flex items-center justify-center text-orange-600">
              <Database size={32} />
            </div>
            <div className="flex flex-col items-end">
              <span className="text-sm font-bold text-emerald-500 flex items-center gap-1">
                <ArrowUpRight size={16} /> +12%
              </span>
              <span className="text-[11px] text-gray-400 font-medium">vs last month</span>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mb-2">Total Assets</span>
            <div className="flex items-baseline gap-3">
              <span className="text-6xl font-black tracking-tighter">{totalAssets.toLocaleString()}</span>
              <span className="text-xl font-bold text-gray-400">Cards</span>
            </div>
          </div>
          <div className="mt-10 h-24 w-full opacity-60 group-hover:opacity-100 transition-opacity">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sparklineData}>
                <defs>
                  <linearGradient id="colorTotalLarge" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} vertical={false} />
                <Area type="monotone" dataKey="value" stroke="#f97316" strokeWidth={4} fillOpacity={1} fill="url(#colorTotalLarge)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="relative overflow-hidden bg-white dark:bg-white/5 rounded-[2.5rem] p-10 border border-gray-100 dark:border-white/5 shadow-sm group hover:shadow-2xl transition-all duration-500 md:col-span-1">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full -mr-32 -mt-32 blur-3xl group-hover:bg-blue-500/10 transition-colors" />
          <div className="flex items-center justify-between mb-8">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-500/20 rounded-3xl flex items-center justify-center text-blue-600">
              <Globe size={32} />
            </div>
            <div className="flex flex-col items-end">
              <span className="text-sm font-bold text-emerald-500 flex items-center gap-1">
                <ArrowUpRight size={16} /> +5.4%
              </span>
              <span className="text-[11px] text-gray-400 font-medium">Market Cap</span>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mb-2">Portfolio Value</span>
            <div className="flex items-baseline gap-3">
              <span className="text-6xl font-black tracking-tighter">{formatMoney(portfolioValueRaw)}</span>
              <span className="text-xl font-bold text-gray-400">USD</span>
            </div>
          </div>
          <div className="mt-10 h-24 w-full opacity-60 group-hover:opacity-100 transition-opacity">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sparklineData.map(d => ({ value: d.value * 1.2 }))}>
                <defs>
                  <linearGradient id="colorValueLarge" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} vertical={false} />
                <Area type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={4} fillOpacity={1} fill="url(#colorValueLarge)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
// ... (Continues in Part 3)
{/* Avg Value - SMALLER BOTTOM CARD */}
        <div className="relative overflow-hidden bg-white dark:bg-white/5 rounded-[2rem] p-6 border border-gray-100 dark:border-white/5 shadow-sm group hover:shadow-xl transition-all duration-500">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-purple-500/10 transition-colors" />
          <div className="flex items-center justify-between mb-6">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-500/20 rounded-2xl flex items-center justify-center text-purple-600">
              <BarChart3 size={24} />
            </div>
            <div className="flex flex-col items-end">
              <span className="text-[11px] font-bold text-red-500 flex items-center gap-1">
                <ArrowDownRight size={12} /> -2.1%
              </span>
              <span className="text-[10px] text-gray-400 font-medium">Avg Price</span>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.1em] mb-1">Avg. Card Value</span>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black tracking-tighter">{formatMoney(avgValueRaw)}</span>
              <span className="text-sm font-bold text-gray-400">/ Card</span>
            </div>
          </div>
          <div className="mt-6 h-12 w-full opacity-50 group-hover:opacity-100 transition-opacity">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sparklineData.map(d => ({ value: 1000 - d.value }))}>
                <defs>
                  <linearGradient id="colorAvg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} vertical={false} />
                <Area type="monotone" dataKey="value" stroke="#a855f7" strokeWidth={2} fillOpacity={1} fill="url(#colorAvg)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Active Collectors - SMALLER BOTTOM CARD */}
        <div className="relative overflow-hidden bg-white dark:bg-white/5 rounded-[2rem] p-6 border border-gray-100 dark:border-white/5 shadow-sm group hover:shadow-xl transition-all duration-500">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-emerald-500/10 transition-colors" />
          <div className="flex items-center justify-between mb-6">
            <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-500/20 rounded-2xl flex items-center justify-center text-emerald-600">
              <Users size={24} />
            </div>
            <div className="flex flex-col items-end">
              <span className="text-[11px] font-bold text-emerald-500 flex items-center gap-1">
                <ArrowUpRight size={12} /> +8
              </span>
              <span className="text-[10px] text-gray-400 font-medium">New Bidders</span>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.1em] mb-1">Active Collectors</span>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black tracking-tighter">{editionsCount.toLocaleString()}</span>
              <span className="text-sm font-bold text-gray-400">Editions</span>
            </div>
          </div>
          <div className="mt-6 h-12 w-full opacity-50 group-hover:opacity-100 transition-opacity">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sparklineData.map(d => ({ value: d.value * 0.5 + 200 }))}>
                <defs>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} vertical={false} />
                <Area type="monotone" dataKey="value" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorUsers)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Inventory Controls */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white dark:bg-white/5 p-4 rounded-[2rem] border border-gray-100 dark:border-white/5 shadow-sm">
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-80">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search by player, team, or rarity..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-white/5 border-none rounded-2xl text-sm focus:ring-2 focus:ring-orange-500/20 transition-all"
            />
          </div>
          <select
            value={rarityFilter}
            onChange={(e) => setRarityFilter(e.target.value)}
            className="px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl text-sm font-bold text-gray-500"
          >
            {['All', 'Mythic', 'Legendary', 'Epic', 'Rare', 'Common'].map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl text-sm font-bold text-gray-500"
          >
            {['Value High', 'Value Low', 'Year Newest', 'Year Oldest', 'Most Owners'].map((option) => (
              <option key={option} value={option}>
                Sort: {option}
              </option>
            ))}
          </select>
          <button
            onClick={() => {
              setActiveInsight('Risk');
              const message = 'Inventory tools opened in Risk mode';
              setInventoryActionNote(message);
              emitDashboardAction(message);
            }}
            className="p-3 bg-gray-50 dark:bg-white/5 rounded-2xl text-gray-500 hover:text-gray-900 dark:hover:text-white transition-all hover:rotate-90"
          >
            <Settings size={20} />
          </button>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            onClick={() => setViewMode(viewMode === 'Grid' ? 'List' : 'Grid')}
            className="flex-1 md:flex-none px-4 py-3 bg-white dark:bg-white/10 border border-gray-200 dark:border-white/10 rounded-2xl text-sm font-bold hover:bg-gray-50 dark:hover:bg-white/20 transition-all"
          >
            View: {viewMode}
          </button>
          <button
            onClick={() => {
              const message = 'Add New Card flow armed for inventory sync';
              setInventoryActionNote(message);
              emitDashboardAction(message);
            }}
            className="flex-1 md:flex-none px-6 py-3 bg-orange-500 text-white rounded-2xl text-sm font-bold hover:bg-orange-600 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-orange-500/20"
          >
            Add New Card
          </button>
          <button
            onClick={() => {
              setShowTradeableOnly(true);
              const message = 'Bulk List prepared for tradeable cards';
              setInventoryActionNote(message);
              emitDashboardAction(message);
            }}
            className="flex-1 md:flex-none px-6 py-3 bg-emerald-500 text-white rounded-2xl text-sm font-bold hover:bg-emerald-600 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-emerald-500/20"
          >
            Bulk List
          </button>
          <button
            onClick={() => {
              const message = `Inventory CSV prepared for ${sortedCards.length} cards`;
              setInventoryActionNote(message);
              emitDashboardAction(message);
            }}
            className="flex-1 md:flex-none px-6 py-3 bg-white dark:bg-white/10 border border-gray-200 dark:border-white/10 rounded-2xl text-sm font-bold hover:bg-gray-50 dark:hover:bg-white/20 transition-all"
          >
            Export CSV
          </button>
          <button
            onClick={() => {
              setSearchQuery('');
              setRarityFilter('All');
              setSortBy('Value High');
            }}
            className="flex-1 md:flex-none px-4 py-3 bg-white dark:bg-white/10 border border-gray-200 dark:border-white/10 rounded-2xl text-sm font-bold hover:bg-gray-50 dark:hover:bg-white/20 transition-all"
          >
            Reset
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-white/5 rounded-3xl p-6 border border-gray-100 dark:border-white/5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-bold">Portfolio Trend</h4>
            <span className="text-[10px] uppercase tracking-widest text-gray-400">YTD</span>
          </div>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={portfolioTrend}>
                <defs>
                  <linearGradient id="portfolioTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.35}/>
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.1} />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#9ca3af' }} />
                <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} />
                <Tooltip contentStyle={{ backgroundColor: '#111', border: 'none', borderRadius: '12px', color: '#fff' }} />
                <Area type="monotone" dataKey="total" stroke="#f97316" strokeWidth={3} fill="url(#portfolioTotal)" />
                <Line type="monotone" dataKey="floor" stroke="#60a5fa" strokeWidth={2} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-white/5 rounded-3xl p-6 border border-gray-100 dark:border-white/5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-bold">Rarity Allocation</h4>
            <span className="text-[10px] uppercase tracking-widest text-gray-400">%</span>
          </div>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={rarityAllocation}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.1} />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#9ca3af' }} />
                <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} />
                <Tooltip contentStyle={{ backgroundColor: '#111', border: 'none', borderRadius: '12px', color: '#fff' }} />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {rarityAllocation.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-white/5 rounded-3xl p-6 border border-gray-100 dark:border-white/5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-bold">Liquidity Buckets</h4>
            <span className="text-[10px] uppercase tracking-widest text-gray-400">Cards</span>
          </div>
          <div className="space-y-3">
            {liquidityBuckets.map((bucket) => (
              <div key={bucket.name} className="flex items-center justify-between text-sm">
                <span className="text-gray-400">{bucket.name}</span>
                <span className="font-bold">{bucket.value}</span>
              </div>
            ))}
            <div className="h-24">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={liquidityBuckets}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.1} />
                  <XAxis dataKey="name" tick={{ fontSize: 9, fill: '#9ca3af' }} />
                  <YAxis hide />
                  <Bar dataKey="value" fill="#22c55e" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-white/5 rounded-3xl p-6 border border-gray-100 dark:border-white/5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-bold">Region Exposure</h4>
            <span className="text-[10px] uppercase tracking-widest text-gray-400">%</span>
          </div>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={regionExposure}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.1} />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#9ca3af' }} />
                <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} />
                <Tooltip contentStyle={{ backgroundColor: '#111', border: 'none', borderRadius: '12px', color: '#fff' }} />
                <Bar dataKey="value" fill="#60a5fa" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-white/5 rounded-3xl p-6 border border-gray-100 dark:border-white/5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-bold">Risk & Alerts</h4>
            <span className="text-[10px] uppercase tracking-widest text-gray-400">Signals</span>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Insurance Coverage</span>
              <span className="font-bold text-emerald-500">Active</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Floor Price Alerts</span>
              <span className="font-bold text-orange-500">3 Active</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Volatility Score</span>
              <span className="font-bold text-red-500">High</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Vault Audit</span>
              <span className="font-bold">Scheduled</span>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {['Set Alerts', 'Rebalance', 'Vault Check', 'Share Report'].map((label) => (
              <button
                key={label}
                onClick={() => {
                  setInventoryActionNote(`${label} action queued`);
                  emitDashboardAction(`${label} action queued`);
                }}
                className="px-3 py-2 rounded-xl bg-gray-50 dark:bg-white/10 border border-gray-200 dark:border-white/10 text-[10px] font-bold uppercase tracking-widest"
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-white/5 rounded-3xl p-6 border border-gray-100 dark:border-white/5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-bold">Recent Activity</h4>
            <span className="text-[10px] uppercase tracking-widest text-gray-400">Live</span>
          </div>
          <div className="space-y-3">
            {activityFeed.map((item) => (
              <div key={item.id} className="flex items-center justify-between text-sm">
                <span className="text-gray-400">{item.label}</span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">{item.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Cards Grid */}
      <div className={cn(viewMode === 'Grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8' : 'flex flex-col gap-4')}>
        {sortedCards.map((card) => (
          <motion.div 
            key={card.id}
            whileHover={{ y: -10, scale: 1.02 }}
            onClick={() => onCardClick(card)}
            className={cn(
              "bg-white dark:bg-white/5 rounded-[2.5rem] overflow-hidden border border-gray-100 dark:border-white/5 shadow-sm hover:shadow-2xl transition-all duration-500 group cursor-pointer",
              viewMode === 'List' && 'flex items-center gap-6 p-6'
            )}
          >
            <div
              className={cn(
                'relative overflow-hidden bg-black/30',
                viewMode === 'Grid' ? 'aspect-[2/3]' : 'h-28 w-28 rounded-2xl'
              )}
            >
              <img 
                src={card.image} 
                alt={card.name} 
                className="absolute inset-0 w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute top-6 right-6">
                <span className={cn(
                  "text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl backdrop-blur-xl border border-white/20",
                  card.rarity === 'Legendary' ? "bg-orange-500/80 text-white" :
                  card.rarity === 'Mythic' ? "bg-purple-500/80 text-white" :
                  card.rarity === 'Epic' ? "bg-blue-500/80 text-white" :
                  "bg-gray-500/80 text-white"
                )}>
                  {card.rarity}
                </span>
              </div>
              <div className="absolute bottom-6 left-6 right-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                <button
                  onClick={(event) => {
                    event.stopPropagation();
                    onCardClick(card);
                  }}
                  className="w-full py-2.5 bg-white/20 backdrop-blur-md border border-white/30 rounded-xl text-white text-xs font-bold hover:bg-white/30 transition-all"
                >
                  Quick View Details
                </button>
              </div>
            </div>
            <div className={cn(viewMode === 'Grid' ? 'p-6' : 'flex-1')}>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="font-black text-xl leading-tight group-hover:text-orange-500 transition-colors">{card.name}</h4>
                  <p className="text-xs text-gray-400 font-medium mt-1">{card.team} • {card.year}</p>
                </div>
                <div className="text-right">
                  <span className="text-lg font-black text-orange-500 block">{card.value}</span>
                  <span className="text-[10px] text-emerald-500 font-bold">+2.4%</span>
                </div>
              </div>
              <div className="rounded-2xl border border-gray-100 dark:border-white/10 bg-gray-50 dark:bg-white/5 p-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-[10px] text-gray-400 uppercase font-black tracking-[0.22em]">Card Code</div>
                    <div className="mt-2 font-mono text-[11px] font-bold tracking-[0.18em] text-orange-400 break-all">
                      {card.verificationCode || 'NOT ASSIGNED'}
                    </div>
                  </div>
                  <button
                    onClick={(event) => {
                      event.stopPropagation();
                      copyInventoryCode(card);
                    }}
                    disabled={!card.verificationCode}
                    className={cn(
                      'shrink-0 px-3 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-colors',
                      card.verificationCode
                        ? 'bg-orange-500 text-white hover:bg-orange-600'
                        : 'bg-gray-200 text-gray-500 dark:bg-white/10 dark:text-gray-500 cursor-not-allowed'
                    )}
                  >
                    Copy
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-100 dark:border-white/5">
                <div className="flex flex-col">
                  <span className="text-[10px] text-gray-400 uppercase font-black tracking-tighter">Condition</span>
                  <span className="text-sm font-black">{card.condition}</span>
                </div>
                <div className="flex gap-2">
                  <div className="w-8 h-8 rounded-full bg-gray-50 dark:bg-white/5 flex items-center justify-center text-gray-400 group-hover:bg-orange-500 group-hover:text-white transition-all">
                    <ArrowUpRight size={16} />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const CardVerificationView = ({
  isDarkMode,
  cards,
  loading,
  error,
  user,
  onReload,
}: {
  isDarkMode: boolean;
  cards: any[];
  loading: boolean;
  error: string | null;
  user: any | null;
  onReload: () => void;
}) => {
  const panelBg = isDarkMode ? 'bg-white/5' : 'bg-white';
  const panelBorder = isDarkMode ? 'border-white/10' : 'border-gray-100';
  const muted = isDarkMode ? 'text-gray-400' : 'text-gray-500';
  const [verificationSearch, setVerificationSearch] = useState('');
  const [queueFilter, setQueueFilter] = useState<'Pending' | 'Verified'>('Pending');
  const [verifyingIds, setVerifyingIds] = useState<number[]>([]);
  const [verificationNote, setVerificationNote] = useState<string | null>(null);
  const [verificationInputs, setVerificationInputs] = useState<Record<number, string>>({});

  const pendingCards = cards.filter((card) => !card.isVerified);
  const verifiedCards = cards.filter((card) => card.isVerified);
  const activePool = queueFilter === 'Pending' ? pendingCards : verifiedCards;
  const filteredCards = activePool.filter((card) => {
    const query = verificationSearch.trim().toLowerCase();
    if (!query) return true;
    return (
      String(card.name || '').toLowerCase().includes(query) ||
      String(card.team || '').toLowerCase().includes(query) ||
      String(card.verificationCode || '').toLowerCase().includes(query)
    );
  });

  const updateVerificationInput = (cardId: number, value: string) => {
    setVerificationInputs((prev) => ({ ...prev, [cardId]: value }));
  };

  const copyVerificationCode = async (card: any) => {
    if (!card?.verificationCode) {
      const message = `${card?.name || 'This card'} does not have a verification code yet`;
      setVerificationNote(message);
      emitDashboardAction(message);
      return;
    }

    if (!navigator?.clipboard?.writeText) {
      const message = 'Clipboard copy is not available in this browser';
      setVerificationNote(message);
      emitDashboardAction(message);
      return;
    }

    try {
      await navigator.clipboard.writeText(String(card.verificationCode));
      const message = `${card.name} verification code copied`;
      setVerificationNote(message);
      emitDashboardAction(message);
    } catch {
      const message = `Could not copy ${card.name} verification code`;
      setVerificationNote(message);
      emitDashboardAction(message);
    }
  };

  const pasteVerificationCode = async (card: any) => {
    if (!navigator?.clipboard?.readText) {
      const message = 'Clipboard paste is not available in this browser';
      setVerificationNote(message);
      emitDashboardAction(message);
      return;
    }

    try {
      const clipText = await navigator.clipboard.readText();
      updateVerificationInput(card.id, clipText);
      const message = `${card.name} code pasted into verification field`;
      setVerificationNote(message);
      emitDashboardAction(message);
    } catch {
      const message = `Could not paste code for ${card.name}`;
      setVerificationNote(message);
      emitDashboardAction(message);
    }
  };

  const handleVerify = async (card: any) => {
    if (!user?.id || !card?.id || verifyingIds.includes(card.id)) return;
    const submittedCode = String(verificationInputs[card.id] || '').trim();
    if (!submittedCode) {
      const message = `Paste or type the verification code for ${card.name} first`;
      setVerificationNote(message);
      emitDashboardAction(message);
      return;
    }
    setVerifyingIds((prev) => [...prev, card.id]);
    try {
      const res = await fetch('http://localhost:3002/api/cardgame/inventory/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, cardId: card.id, verificationCode: submittedCode }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || 'Verification failed.');
      const message = `${card.name} verified and moved into owned inventory`;
      setVerificationNote(message);
      emitDashboardAction(message);
      setVerificationInputs((prev) => {
        const next = { ...prev };
        delete next[card.id];
        return next;
      });
      onReload();
    } catch (verifyError: any) {
      const message = verifyError?.message || 'Verification failed.';
      setVerificationNote(message);
      emitDashboardAction(message);
    } finally {
      setVerifyingIds((prev) => prev.filter((id) => id !== card.id));
    }
  };

  return (
    <div className="p-6 lg:p-8 flex flex-col gap-8">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Card Verification</h2>
          <p className={cn('text-sm', muted)}>
            New cards from packs and purchases must clear verification before they become fully owned.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {(['Pending', 'Verified'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setQueueFilter(mode)}
              className={cn(
                'px-3 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-colors',
                queueFilter === mode ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20' : cn(panelBg, panelBorder, muted)
              )}
            >
              {mode}
            </button>
          ))}
          <button
            onClick={onReload}
            className="px-3 py-2 rounded-xl bg-orange-500 text-[10px] font-bold uppercase tracking-widest text-white"
          >
            Refresh Queue
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className={cn('rounded-3xl border p-5', panelBorder, panelBg)}>
          <div className={cn('text-[10px] uppercase tracking-widest', muted)}>Pending Cards</div>
          <div className="mt-3 text-3xl font-black">{pendingCards.length}</div>
          <div className="mt-2 text-xs text-orange-400 font-bold">Require manual verification</div>
        </div>
        <div className={cn('rounded-3xl border p-5', panelBorder, panelBg)}>
          <div className={cn('text-[10px] uppercase tracking-widest', muted)}>Verified Cards</div>
          <div className="mt-3 text-3xl font-black">{verifiedCards.length}</div>
          <div className="mt-2 text-xs text-emerald-400 font-bold">Unlocked for ownership views</div>
        </div>
        <div className={cn('rounded-3xl border p-5', panelBorder, panelBg)}>
          <div className={cn('text-[10px] uppercase tracking-widest', muted)}>Verification Rule</div>
          <div className="mt-3 text-sm font-bold">Pack + Shop cards enter pending state first</div>
          <div className="mt-2 text-xs text-gray-400">After verification they appear in inventory portfolio and collector metrics.</div>
        </div>
      </div>

      {(loading || error || !user) && (
        <div className={cn('rounded-3xl border p-4 flex items-center justify-between gap-4', panelBorder, panelBg)}>
          <div className="text-sm">
            {loading && <span className="font-bold">Syncing verification queue…</span>}
            {!loading && error && <span className="font-bold text-red-400">{error}</span>}
            {!loading && !error && !user && <span className="font-bold text-orange-400">Login in FODR to verify new cards.</span>}
          </div>
          <button
            onClick={onReload}
            className="px-4 py-2 rounded-2xl bg-orange-500 text-white text-xs font-bold uppercase tracking-widest hover:bg-orange-600 transition"
          >
            Reload
          </button>
        </div>
      )}

      {verificationNote && (
        <div className={cn('rounded-2xl border px-4 py-3 text-[10px] font-bold uppercase tracking-widest', panelBorder, panelBg, muted)}>
          {verificationNote}
        </div>
      )}

      <div className={cn('rounded-3xl border p-4', panelBorder, panelBg)}>
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:w-80">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={verificationSearch}
              onChange={(event) => setVerificationSearch(event.target.value)}
              placeholder="Search player, club, or verification code"
              className={cn('w-full rounded-xl pl-9 pr-3 py-2 text-xs font-bold outline-none', panelBg, panelBorder, 'border', muted)}
            />
          </div>
          <div className={cn('text-[10px] uppercase tracking-widest', muted)}>
            Showing {filteredCards.length} {queueFilter.toLowerCase()} cards
          </div>
        </div>
      </div>

      {filteredCards.length === 0 ? (
        <div className={cn('rounded-3xl border p-10 text-center', panelBorder, panelBg)}>
          <div className="text-lg font-bold">{queueFilter === 'Pending' ? 'No cards waiting for verification.' : 'No verified cards found.'}</div>
          <div className={cn('mt-2 text-sm', muted)}>
            {queueFilter === 'Pending'
              ? 'Open a pack or buy a card and it will appear here first.'
              : 'Verified cards will appear here after approval.'}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {filteredCards.map((card) => {
            const isVerifying = verifyingIds.includes(card.id);
            return (
              <div key={card.id} className={cn('rounded-3xl border p-5', panelBorder, panelBg)}>
                <div className="flex items-start gap-4">
                  <div className="w-28 h-40 rounded-2xl overflow-hidden bg-black/30 flex items-center justify-center shrink-0">
                    <img src={card.image} alt={card.name} className="h-full w-full object-contain" referrerPolicy="no-referrer" />
                  </div>
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="text-lg font-bold">{card.name}</div>
                        <div className={cn('text-[10px] uppercase tracking-widest', muted)}>
                          {card.team} · {card.edition} · {card.position || 'Card Asset'}
                        </div>
                      </div>
                      <span
                        className={cn(
                          'px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest',
                          card.isVerified ? 'bg-emerald-500/20 text-emerald-300' : 'bg-orange-500/20 text-orange-300'
                        )}
                      >
                        {card.isVerified ? 'Verified' : 'Pending'}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className={cn('rounded-2xl border p-3', panelBorder)}>
                        <div className={cn('text-[10px] uppercase tracking-widest', muted)}>Card Value</div>
                        <div className="mt-2 font-bold text-orange-400">{card.value}</div>
                      </div>
                      <div className={cn('rounded-2xl border p-3', panelBorder)}>
                        <div className={cn('text-[10px] uppercase tracking-widest', muted)}>Acquired Via</div>
                        <div className="mt-2 font-bold uppercase">{card.acquiredVia || 'new'}</div>
                      </div>
                      <div className={cn('rounded-2xl border p-3 col-span-2', panelBorder)}>
                        <div className="flex items-center justify-between gap-3">
                          <div className={cn('text-[10px] uppercase tracking-widest', muted)}>Verification Code</div>
                          <button
                            onClick={() => copyVerificationCode(card)}
                            disabled={!card.verificationCode}
                            className={cn(
                              'px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-colors',
                              card.verificationCode
                                ? 'bg-orange-500 text-white hover:bg-orange-600'
                                : 'bg-gray-200 text-gray-500 dark:bg-white/10 dark:text-gray-500 cursor-not-allowed'
                            )}
                          >
                            Copy Code
                          </button>
                        </div>
                        <div className="mt-2 font-bold tracking-[0.2em] text-orange-300 break-all">{card.verificationCode || 'Awaiting code'}</div>
                      </div>
                      {!card.isVerified && (
                        <div className={cn('rounded-2xl border p-3 col-span-2', panelBorder)}>
                          <div className={cn('text-[10px] uppercase tracking-widest', muted)}>Type or Paste Code</div>
                          <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                            <input
                              value={verificationInputs[card.id] || ''}
                              onChange={(event) => updateVerificationInput(card.id, event.target.value)}
                              placeholder="Paste or type the verification code here"
                              className={cn(
                                'w-full rounded-xl px-3 py-2 text-xs font-bold outline-none',
                                panelBg,
                                panelBorder,
                                'border',
                                muted
                              )}
                            />
                            <button
                              onClick={() => pasteVerificationCode(card)}
                              className="px-4 py-2 rounded-xl bg-orange-500 text-[10px] font-bold uppercase tracking-widest text-white hover:bg-orange-600 transition-colors"
                            >
                              Paste
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {!card.isVerified && (
                        <button
                          onClick={() => handleVerify(card)}
                          disabled={isVerifying}
                          className={cn(
                            'px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest text-white transition-colors',
                            isVerifying ? 'bg-orange-300 cursor-wait' : 'bg-orange-500 hover:bg-orange-600'
                          )}
                        >
                          {isVerifying ? 'Verifying…' : 'Verify Card'}
                        </button>
                      )}
                      <button
                        onClick={() => {
                          const message = `${card.name} verification packet inspected`;
                          setVerificationNote(message);
                          emitDashboardAction(message);
                        }}
                        className={cn('px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest', panelBg, panelBorder, 'border', muted)}
                      >
                        Inspect Packet
                      </button>
                      <button
                        onClick={() => {
                          const message = `${card.name} sent to manual review queue`;
                          setVerificationNote(message);
                          emitDashboardAction(message);
                        }}
                        className={cn('px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest', panelBg, panelBorder, 'border', muted)}
                      >
                        Manual Review
                      </button>
                    </div>

                    {card.isVerified && card.verifiedAt && (
                      <div className="text-[10px] uppercase tracking-widest text-emerald-400">
                        Verified at {card.verifiedAt}
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
  );
};

const CardDetailView = ({ card, onBack, isDarkMode }: { card: any, onBack: () => void, isDarkMode: boolean }) => {
  const [detailRange, setDetailRange] = useState<'1D' | '1W' | '1M' | '1Y' | 'ALL'>('1M');
  const [detailTab, setDetailTab] = useState<'Overview' | 'Liquidity' | 'Offers' | 'Security' | 'Notes'>('Overview');
  const [watchlisted, setWatchlisted] = useState(true);
  const [alertEnabled, setAlertEnabled] = useState(true);
  const [vaultLocked, setVaultLocked] = useState(true);
  const [notes, setNotes] = useState<string[]>(['Vaulted in Zurich', 'Insurance renewed - 2026']);
  const [noteInput, setNoteInput] = useState('');
  const [detailActionMessage, setDetailActionMessage] = useState<string | null>(null);
  const [offerStatuses, setOfferStatuses] = useState<Record<string, string>>({});

  const offerInbox = [
    { id: 'off-1', from: 'collector_x', type: 'Swap + Cash', price: '$2.6M', status: 'New' },
    { id: 'off-2', from: 'vault_prime', type: 'Direct Buy', price: '$2.4M', status: 'Review' },
    { id: 'off-3', from: 'legacy_fund', type: 'Auction Bid', price: '$2.55M', status: 'Counter' },
  ];
  const depthData = [
    { name: 'Bid 1', value: 24 },
    { name: 'Bid 2', value: 18 },
    { name: 'Bid 3', value: 12 },
    { name: 'Ask 1', value: 16 },
    { name: 'Ask 2', value: 20 },
    { name: 'Ask 3', value: 28 },
  ];

  const getDetailData = () => {
    const sourceData = detailRange === '1D' ? trendDataDays : 
                      detailRange === '1W' ? trendDataWeeks : 
                      trendDataMonths;
    
    const possibleKeys = [
      `${card.name} - ${card.team} Edition`,
      `${card.name} - ${card.team}`,
      card.name,
      'Messi - Barcelona Edition'
    ];

    return sourceData.map(d => {
      const key = Object.keys(d).find(k => possibleKeys.some(pk => k.includes(card.name) || pk === k)) || 'Messi - Barcelona Edition';
      return {
        name: d.name,
        value: (d as any)[key] || 20
      };
    });
  };

  const pushDetailAction = (message: string) => {
    setDetailActionMessage(message);
    emitDashboardAction(message);
  };

  const updateOfferStatus = (offerId: string, status: string) => {
    setOfferStatuses((prev) => ({ ...prev, [offerId]: status }));
    pushDetailAction(`${card.name} offer ${status.toLowerCase()}`);
  };

  const copyDetailVerificationCode = async () => {
    if (!card?.verificationCode) {
      pushDetailAction(`${card.name} does not have a visible card code yet`);
      return;
    }

    if (!navigator?.clipboard?.writeText) {
      pushDetailAction('Clipboard copy is not available in this browser');
      return;
    }

    try {
      await navigator.clipboard.writeText(String(card.verificationCode));
      pushDetailAction(`${card.name} card code copied`);
    } catch {
      pushDetailAction(`Could not copy ${card.name} card code`);
    }
  };

  return (
    <div className="p-8 flex flex-col gap-8">
      <div className="flex items-center gap-4">
        <button 
          onClick={onBack}
          className="p-2 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl hover:bg-gray-50 dark:hover:bg-white/10 transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h2 className="text-2xl font-bold">{card.name} Details</h2>
          <p className="text-sm text-gray-500">Real-time performance and market analytics for {card.name}</p>
        </div>
      </div>

      {detailActionMessage && (
        <div className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:border-white/10 dark:bg-white/5 dark:text-gray-300">
          {detailActionMessage}
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {(['Overview', 'Liquidity', 'Offers', 'Security', 'Notes'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setDetailTab(tab)}
            className={cn(
              'px-3 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-colors',
              detailTab === tab ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20' : 'bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-500'
            )}
          >
            {tab}
          </button>
        ))}
        <button
          onClick={() => setWatchlisted((prev) => !prev)}
          className={cn(
            'px-3 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-colors',
            watchlisted ? 'bg-emerald-500 text-white' : 'bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-500'
          )}
        >
          {watchlisted ? 'Watchlisted' : 'Add Watchlist'}
        </button>
        <button
          onClick={() => pushDetailAction(`${card.name} listed for sale deck prepared`)}
          className="px-3 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest bg-orange-500 text-white"
        >
          List for Sale
        </button>
        <button
          onClick={() => pushDetailAction(`${card.name} trade builder opened`)}
          className="px-3 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-500"
        >
          Trade
        </button>
        <button
          onClick={() => setAlertEnabled((prev) => !prev)}
          className={cn(
            'px-3 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-colors',
            alertEnabled ? 'bg-emerald-500/20 text-emerald-300' : 'bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-500'
          )}
        >
          {alertEnabled ? 'Alerts On' : 'Alerts Off'}
        </button>
        <button
          onClick={() => setVaultLocked((prev) => !prev)}
          className={cn(
            'px-3 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-colors',
            vaultLocked ? 'bg-blue-500/20 text-blue-300' : 'bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-500'
          )}
        >
          {vaultLocked ? 'Vault Locked' : 'Unlock Vault'}
        </button>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
          <div className="bg-white dark:bg-white/5 rounded-3xl overflow-hidden border border-gray-100 dark:border-white/5 shadow-sm">
            <div className="relative w-full aspect-[2/3] overflow-hidden bg-black/30">
              <img 
                src={card.image} 
                alt={card.name} 
                className="absolute inset-0 w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <span className="text-[10px] font-bold px-2 py-1 bg-orange-500 text-white rounded-lg uppercase tracking-wider">{card.rarity}</span>
                <span className="text-xl font-bold text-orange-500">{card.value}</span>
              </div>
              <h3 className="text-2xl font-bold mb-1">{card.name}</h3>
              <p className="text-gray-500 mb-6">{card.team} • {card.year} Season</p>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 dark:bg-white/5 p-3 rounded-2xl">
                  <div className="text-[10px] text-gray-400 font-bold uppercase mb-1">Condition</div>
                  <div className="font-bold">{card.condition}</div>
                </div>
                <div className="bg-gray-50 dark:bg-white/5 p-3 rounded-2xl">
                  <div className="text-[10px] text-gray-400 font-bold uppercase mb-1">Prev. Owners</div>
                  <div className="font-bold">{card.ownersCount}</div>
                </div>
              </div>

              <div className="mt-4 rounded-2xl bg-gray-50 dark:bg-white/5 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.22em]">Card Verification Code</div>
                    <div className="mt-2 font-mono text-[11px] font-bold tracking-[0.2em] text-orange-400 break-all">
                      {card.verificationCode || 'NOT ASSIGNED'}
                    </div>
                  </div>
                  <button
                    onClick={copyDetailVerificationCode}
                    disabled={!card.verificationCode}
                    className={cn(
                      'shrink-0 px-3 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-colors',
                      card.verificationCode
                        ? 'bg-orange-500 text-white hover:bg-orange-600'
                        : 'bg-gray-200 text-gray-500 dark:bg-white/10 dark:text-gray-500 cursor-not-allowed'
                    )}
                  >
                    Copy
                  </button>
                </div>
                <div className="mt-3 flex items-center justify-between gap-3 text-[10px] uppercase tracking-widest">
                  <span className={cn(Number(card?.isVerified) === 1 ? 'text-emerald-400' : 'text-orange-400')}>
                    {Number(card?.isVerified) === 1 ? 'Verified' : 'Pending Verification'}
                  </span>
                  <span className="text-gray-400">{card?.verifiedAt ? `Verified ${card.verifiedAt}` : 'Awaiting verification'}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-white/5 rounded-3xl p-6 border border-gray-100 dark:border-white/5 shadow-sm">
            <h4 className="font-bold mb-4">Ownership Provenance</h4>
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Authenticity Score</span>
                <span className="text-sm font-bold text-emerald-500">Verified 100%</span>
              </div>
              <div className="w-full h-2 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 w-full" />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Chain of Custody</span>
                <span className="text-sm font-bold text-orange-500">Complete</span>
              </div>
            </div>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-white/5 rounded-3xl p-6 border border-gray-100 dark:border-white/5 shadow-sm">
              <div className="text-[10px] font-bold text-gray-400 uppercase mb-1">24h Change</div>
              <div className="text-2xl font-bold text-emerald-500">+$12,450</div>
            </div>
            <div className="bg-white dark:bg-white/5 rounded-3xl p-6 border border-gray-100 dark:border-white/5 shadow-sm">
              <div className="text-[10px] font-bold text-gray-400 uppercase mb-1">Last Purchase</div>
              <div className="text-2xl font-bold">{card.history[0]?.price || card.value}</div>
            </div>
            <div className="bg-white dark:bg-white/5 rounded-3xl p-6 border border-gray-100 dark:border-white/5 shadow-sm">
              <div className="text-[10px] font-bold text-gray-400 uppercase mb-1">Market Cap</div>
              <div className="text-2xl font-bold">$124.5M</div>
            </div>
          </div>

          {detailTab === 'Overview' && (
            <>
              <div className="bg-white dark:bg-white/5 rounded-3xl p-6 border border-gray-100 dark:border-white/5 shadow-sm">
                <div className="flex items-center justify-between mb-8">
                  <h4 className="font-bold">Value Appreciation Trend</h4>
                  <div className="flex gap-2">
                    {(['1D', '1W', '1M', '1Y', 'ALL'] as const).map((p) => (
                      <button 
                        key={p} 
                        onClick={() => setDetailRange(p)}
                        className={cn(
                          "px-3 py-1 rounded-lg text-[10px] font-bold transition-colors",
                          p === detailRange ? "bg-orange-500 text-white" : "bg-gray-100 dark:bg-white/5 text-gray-500 hover:bg-gray-200 dark:hover:bg-white/10"
                        )}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={getDetailData()}>
                      <defs>
                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={true} stroke={isDarkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"} />
                      <XAxis dataKey="name" axisLine={true} tickLine={true} tick={{fontSize: 10, fill: '#888'}} />
                      <YAxis axisLine={true} tickLine={true} tick={{fontSize: 10, fill: '#888'}} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#111', border: 'none', borderRadius: '12px', color: '#fff' }}
                        itemStyle={{ color: '#f97316' }}
                      />
                      <Area type="monotone" dataKey="value" stroke="#f97316" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white dark:bg-white/5 rounded-3xl p-6 border border-gray-100 dark:border-white/5 shadow-sm">
                <h4 className="font-bold mb-6">Ownership & Transaction History</h4>
                <div className="flex flex-col gap-4">
                  {card.history.map((entry: any, i: number) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-white/5 rounded-2xl hover:bg-gray-100 dark:hover:bg-white/10 transition-colors group">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <img 
                            src={entry.avatar} 
                            alt={entry.user} 
                            className="w-10 h-10 rounded-full border-2 border-white dark:border-white/10"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white dark:border-[#1a1a1a] flex items-center justify-center">
                            <div className="w-1.5 h-1.5 bg-white rounded-full" />
                          </div>
                        </div>
                        <div>
                          <div className="text-sm font-bold group-hover:text-orange-500 transition-colors">{entry.user}</div>
                          <div className="text-[10px] text-gray-400">{entry.action} • {entry.date}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold">{entry.price}</div>
                        <div className="text-[10px] text-emerald-500 font-bold">Verified Transaction</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {detailTab === 'Liquidity' && (
            <div className="bg-white dark:bg-white/5 rounded-3xl p-6 border border-gray-100 dark:border-white/5 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h4 className="font-bold">Market Depth & Liquidity</h4>
                <span className="text-[10px] uppercase tracking-widest text-gray-400">Live</span>
              </div>
              <div className="h-[220px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={depthData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.1} />
                    <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#9ca3af' }} />
                    <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} />
                    <Tooltip contentStyle={{ backgroundColor: '#111', border: 'none', borderRadius: '12px', color: '#fff' }} />
                    <Bar dataKey="value" fill="#60a5fa" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Avg Time to Sell</span>
                  <span className="font-bold">5.2 days</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Bid Coverage</span>
                  <span className="font-bold text-emerald-500">78%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Active Buyers</span>
                  <span className="font-bold">32</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Liquidity Grade</span>
                  <span className="font-bold text-orange-500">A-</span>
                </div>
              </div>
            </div>
          )}

          {detailTab === 'Offers' && (
            <div className="bg-white dark:bg-white/5 rounded-3xl p-6 border border-gray-100 dark:border-white/5 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h4 className="font-bold">Offer Inbox</h4>
                <button
                  onClick={() => {
                    setDetailTab('Offers');
                    pushDetailAction(`Viewing all ${card.name} offers`);
                  }}
                  className="text-[10px] uppercase tracking-widest text-gray-400"
                >
                  View All
                </button>
              </div>
              <div className="space-y-4">
                {offerInbox.map((offer) => (
                  <div key={offer.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-white/5 rounded-2xl">
                    <div>
                      <div className="text-sm font-bold">@{offer.from}</div>
                      <div className="text-[10px] text-gray-400 uppercase tracking-widest">{offer.type}</div>
                    </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-orange-500">{offer.price}</div>
                        <div className="text-[10px] text-gray-400 uppercase tracking-widest">{offerStatuses[offer.id] ?? offer.status}</div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => updateOfferStatus(offer.id, 'Accepted')}
                          className="px-3 py-2 rounded-xl bg-emerald-500 text-[10px] font-bold uppercase tracking-widest text-white"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => updateOfferStatus(offer.id, 'Countered')}
                          className="px-3 py-2 rounded-xl bg-white dark:bg-white/10 border border-gray-200 dark:border-white/10 text-[10px] font-bold uppercase tracking-widest"
                        >
                          Counter
                        </button>
                        <button
                          onClick={() => updateOfferStatus(offer.id, 'Declined')}
                          className="px-3 py-2 rounded-xl bg-white dark:bg-white/10 border border-gray-200 dark:border-white/10 text-[10px] font-bold uppercase tracking-widest"
                        >
                          Decline
                        </button>
                      </div>
                    </div>
                ))}
              </div>
            </div>
          )}

          {detailTab === 'Security' && (
            <div className="bg-white dark:bg-white/5 rounded-3xl p-6 border border-gray-100 dark:border-white/5 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h4 className="font-bold">Security & Protection</h4>
                <Shield size={18} className="text-emerald-500" />
              </div>
              <div className="space-y-4 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Insurance Status</span>
                  <span className="font-bold text-emerald-500">Active</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Escrow Required</span>
                  <span className="font-bold">Yes</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Authentication</span>
                  <span className="font-bold text-emerald-500">Verified</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Vault Access</span>
                  <span className="font-bold">{vaultLocked ? 'Locked' : 'Open'}</span>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {['Renew Insurance', 'Request Audit', 'Share Proof', 'Export Certificate'].map((label) => (
                  <button
                    key={label}
                    onClick={() => pushDetailAction(`${card.name} · ${label}`)}
                    className="px-3 py-2 rounded-xl bg-white dark:bg-white/10 border border-gray-200 dark:border-white/10 text-[10px] font-bold uppercase tracking-widest"
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {detailTab === 'Notes' && (
            <div className="bg-white dark:bg-white/5 rounded-3xl p-6 border border-gray-100 dark:border-white/5 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h4 className="font-bold">Notes & Actions</h4>
                <button
                  onClick={() => {
                    if (!noteInput.trim()) return;
                    setNotes((prev) => [noteInput.trim(), ...prev]);
                    setNoteInput('');
                  }}
                  className="px-3 py-2 rounded-xl bg-orange-500 text-[10px] font-bold uppercase tracking-widest text-white"
                >
                  Add Note
                </button>
              </div>
              <div className="flex items-center gap-2">
                <input
                  value={noteInput}
                  onChange={(e) => setNoteInput(e.target.value)}
                  placeholder="Add a note about this card..."
                  className="flex-1 px-4 py-2 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-sm"
                />
              </div>
              <div className="mt-4 space-y-3">
                {notes.map((note) => (
                  <div key={note} className="p-3 rounded-xl bg-gray-50 dark:bg-white/5 text-sm">
                    {note}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const TradingView = ({
  isDarkMode,
  cards,
  loading,
  error,
  user,
}: {
  isDarkMode: boolean;
  cards: any[];
  loading: boolean;
  error: string | null;
  user: any | null;
}) => {
  const panelBg = isDarkMode ? 'bg-white/5' : 'bg-white';
  const panelBorder = isDarkMode ? 'border-white/10' : 'border-gray-100';
  const muted = isDarkMode ? 'text-gray-400' : 'text-gray-500';
  const chipBg = isDarkMode ? 'bg-white/10' : 'bg-gray-100';
  const detailStrong = isDarkMode ? 'text-gray-200' : 'text-gray-700';

  const quickFilters = ['All', 'High Delta', 'Expiring Soon', 'My Watchlist', 'Rare Serial', 'Graded 10'];
  const locationSeeds = ['Liverpool, UK', 'Madrid, ES', 'Milan, IT', 'Rio, BR', 'Oslo, NO', 'Berlin, DE', 'Paris, FR'];
  const traderSeeds = ['vault_prime', 'card_shark', 'market_maker', 'legends_hub', 'north_star', 'golden_archive'];
  const expirySeeds = ['2h', '6h', '12h', '1d', '2d', '3d'];
  const statusSeeds = ['New', 'Review', 'Counter'];
  const sentSeeds = ['Just now', '45m ago', '3h ago', '1d ago'];
  const historyOutcomes = ['Accepted', 'Completed', 'Countered', 'Declined'];
  const formatMoney = (value: number) => `$${value.toLocaleString()}`;

  const tradingInventoryCards = cards.map((card, index) => ({
    ...card,
    serial: card.verificationCode ? `#${String(card.verificationCode).slice(-8)}` : `#${String(index + 1).padStart(2, '0')}/100`,
    editionLabel: card.edition || `${card.team} Edition`,
    trend: `${card.valueNumber >= 5_000_000 ? '+' : '-'}${(2.4 + (index % 5) * 0.7).toFixed(1)}%`,
  }));

  const tradeMarketCards = tradingInventoryCards.slice(0, 8).map((card, index) => ({
    id: `market-${card.id}`,
    inventoryId: card.id,
    name: card.name,
    edition: card.editionLabel,
    year: card.year,
    rarity: card.rarity,
    condition: card.condition,
    serial: card.serial,
    owner: traderSeeds[index % traderSeeds.length],
    location: locationSeeds[index % locationSeeds.length],
    value: Number(card.valueNumber || 0),
    lastSale: Math.max(50000, Math.round(Number(card.valueNumber || 0) * (0.9 + (index % 3) * 0.03))),
    trend: `${index % 3 === 0 ? '-' : '+'}${(2.8 + (index % 4) * 1.2).toFixed(1)}%`,
    liquidity: ['High', 'Medium', 'Medium', 'High', 'Low'][index % 5],
    offers: `${3 + index * 2} active`,
    listedSince: ['2h', '6h', '14h', '1d', '2d'][index % 5],
    escrow: card.isVerified ? 'Verified' : 'Pending',
    description: card.note || `${card.name} trading card synced from your verified inventory.`,
    tags: [card.team, card.rarity, card.editionLabel.split(' ')[0]].filter(Boolean),
    image: card.image,
  }));

  const tradeOffers = tradingInventoryCards.slice(0, Math.min(3, tradingInventoryCards.length)).map((card, index) => {
    const offered = tradingInventoryCards[(index + 1) % tradingInventoryCards.length] || card;
    const yourValue = Number(card.valueNumber || 0);
    const offeredValue = Math.round(yourValue * (1.08 + index * 0.05));
    const deltaValue = offeredValue - yourValue;
    const deltaSign = deltaValue >= 0 ? '+' : '-';
    return {
      id: `offer-${card.id}`,
      from: traderSeeds[index % traderSeeds.length],
      yourCard: `${card.name} - ${card.editionLabel}`,
      offeredCard: `${offered.name} - ${offered.editionLabel}`,
      yourValue,
      offeredValue,
      delta: `${deltaSign}$${Math.abs(deltaValue).toLocaleString()}`,
      status: statusSeeds[index % statusSeeds.length],
      expires: expirySeeds[index % expirySeeds.length],
      note: card.verificationCode ? `Code ${String(card.verificationCode).slice(-6)} included` : 'Verified ownership required',
    };
  });

  const tradeOutgoingSeed = tradingInventoryCards.slice(0, Math.min(3, tradingInventoryCards.length)).map((card, index) => {
    const targetA = tradingInventoryCards[(index + 1) % tradingInventoryCards.length] || card;
    const targetB = tradingInventoryCards[(index + 2) % tradingInventoryCards.length];
    return {
      id: `out-${card.id}`,
      to: traderSeeds[(index + 2) % traderSeeds.length],
      yourCard: `${card.name} - ${card.editionLabel}`,
      targets: [targetA.name, targetB?.name].filter(Boolean),
      offer: formatMoney(Math.round(Number(card.valueNumber || 0) * (1.02 + index * 0.06))),
      status: ['Pending', 'Countered', 'Viewed'][index % 3],
      sentAt: sentSeeds[index % sentSeeds.length],
      options: index === 0 ? ['Require Escrow'] : index === 1 ? ['Include Insurance'] : [],
      cash: index === 1 ? '$250,000' : '',
    };
  });

  const tradeHistory = tradingInventoryCards.slice(0, Math.min(4, tradingInventoryCards.length)).map((card, index) => ({
    id: `hist-${card.id}`,
    card: `${card.name} - ${card.editionLabel}`,
    outcome: historyOutcomes[index % historyOutcomes.length],
    value: formatMoney(Math.round(Number(card.valueNumber || 0) * (0.92 + index * 0.02))),
    time: ['3d ago', '6d ago', '2w ago', '1m ago'][index % 4],
  }));

  const targetCatalog = tradeMarketCards;

  const [selectedInventoryId, setSelectedInventoryId] = useState<number | null>(null);
  const [selectedTargetIds, setSelectedTargetIds] = useState<string[]>([]);
  const [showInventoryPicker, setShowInventoryPicker] = useState(false);
  const [showTargetPicker, setShowTargetPicker] = useState(false);
  const [tradeOptions, setTradeOptions] = useState<string[]>([]);
  const [cashAmount, setCashAmount] = useState('');
  const [selectedOfferId, setSelectedOfferId] = useState<string | null>(tradeOffers[0]?.id ?? null);
  const [tradeTab, setTradeTab] = useState<'Incoming' | 'Outgoing' | 'History' | 'Watchlist'>('Incoming');
  const [activeFilters, setActiveFilters] = useState<string[]>(['All']);
  const [offerStatus, setOfferStatus] = useState<Record<string, string>>({});
  const [activityLog, setActivityLog] = useState<string[]>([]);
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const [outgoingOffers, setOutgoingOffers] = useState(tradeOutgoingSeed);
  const [tradeDeskMessage, setTradeDeskMessage] = useState<string | null>(null);
  const [automation, setAutomation] = useState({
    autoCounter: true,
    escrowOnly: true,
    priceLock: true,
    instantNotify: true,
    bundleMode: false,
  });

  const selectedInventory = tradingInventoryCards.find((card) => card.id === selectedInventoryId) ?? null;
  const selectedOffer = tradeOffers.find((offer) => offer.id === selectedOfferId) ?? tradeOffers[0];

  const logAction = (label: string) => {
    const time = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    setActivityLog((prev) => [`${label} · ${time}`, ...prev].slice(0, 6));
    setTradeDeskMessage(label);
    emitDashboardAction(label);
  };

  const toggleFilter = (filter: string) => {
    setActiveFilters((prev) =>
      prev.includes(filter) ? prev.filter((item) => item !== filter) : [...prev, filter]
    );
  };

  const updateOfferStatus = (id: string, status: string) => {
    setOfferStatus((prev) => ({ ...prev, [id]: status }));
    logAction(`${status} ${id}`);
  };

  const toggleAutomation = (key: keyof typeof automation) => {
    setAutomation((prev) => ({ ...prev, [key]: !prev[key] }));
    logAction(`${key} ${automation[key] ? 'disabled' : 'enabled'}`);
  };

  const toggleTarget = (id: string) => {
    setSelectedTargetIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleTradeOption = (option: string) => {
    setTradeOptions((prev) =>
      prev.includes(option) ? prev.filter((item) => item !== option) : [...prev, option]
    );
    if (option === 'Add Cash' && tradeOptions.includes(option)) {
      setCashAmount('');
    }
  };

  const sendOffer = () => {
    if (!selectedInventory || selectedTargetIds.length === 0) {
      logAction('Select card and target');
      return;
    }
    const targets = selectedTargetIds
      .map((id) => targetCatalog.find((card) => card.id === id))
      .filter(Boolean) as Array<(typeof targetCatalog)[number]>;
    const cashValue = tradeOptions.includes('Add Cash') ? Number.parseFloat(cashAmount || '0') : 0;
    const offeredValue = targets.reduce((sum, card) => sum + card.value, 0) + (Number.isFinite(cashValue) ? cashValue : 0);
    const outgoing = {
      id: `out-${Date.now()}`,
      to: 'marketplace',
      yourCard: selectedInventory.name,
      targets: targets.map((card) => card.name),
      offer: formatMoney(offeredValue),
      status: 'Pending',
      sentAt: 'Just now',
      options: tradeOptions.length > 0 ? tradeOptions : ['Standard'],
      cash: cashValue && Number.isFinite(cashValue) ? formatMoney(cashValue) : null,
    };
    setOutgoingOffers((prev) => [outgoing, ...prev]);
    logAction('Offer sent');
    setSelectedInventoryId(null);
    setSelectedTargetIds([]);
    setTradeOptions([]);
    setCashAmount('');
    setSelectedAction(null);
    setShowInventoryPicker(false);
    setShowTargetPicker(false);
    setTradeTab('Outgoing');
  };

  const updateOutgoingStatus = (id: string, status: string) => {
    setOutgoingOffers((prev) => prev.map((offer) => (offer.id === id ? { ...offer, status } : offer)));
    logAction(`Trade ${status.toLowerCase()}`);
  };

  const tradingIdsKey = tradingInventoryCards.map((card) => card.id).join('|');

  useEffect(() => {
    setOutgoingOffers(tradeOutgoingSeed);
  }, [tradingIdsKey]);

  useEffect(() => {
    if (!tradeOffers.length) {
      setSelectedOfferId(null);
      return;
    }
    if (!selectedOfferId || !tradeOffers.some((offer) => offer.id === selectedOfferId)) {
      setSelectedOfferId(tradeOffers[0].id);
    }
  }, [selectedOfferId, tradeOffers]);

  useEffect(() => {
    if (!tradingInventoryCards.length) {
      setSelectedInventoryId(null);
      return;
    }
    if (selectedInventoryId && !tradingInventoryCards.some((card) => card.id === selectedInventoryId)) {
      setSelectedInventoryId(null);
    }
  }, [selectedInventoryId, tradingInventoryCards]);

  return (
    <div className="p-6 lg:p-8 pb-24 lg:pb-32 flex flex-col gap-8">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Trading Desk</h2>
          <p className={cn('text-sm', muted)}>
            List your real verified cards for trade, compare offers, and negotiate swaps in real time.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => logAction('Create Trade')}
            className="px-3 py-2 rounded-xl bg-orange-500 text-xs font-bold text-white shadow-lg shadow-orange-500/20"
          >
            <Plus size={14} className="inline-block mr-2" />
            Create Trade
          </button>
          <button
            onClick={() => logAction('Filters deck opened')}
            className={cn('px-3 py-2 rounded-xl text-xs font-bold', chipBg, muted)}
          >
            <Filter size={14} className="inline-block mr-2" />
            Filters
          </button>
          <button
            onClick={() => logAction('Trade rules reviewed')}
            className={cn('px-3 py-2 rounded-xl text-xs font-bold', chipBg, muted)}
          >
            <Database size={14} className="inline-block mr-2" />
            Trade Rules
          </button>
          <button
            onClick={() => logAction('Negotiations inbox opened')}
            className={cn('px-3 py-2 rounded-xl text-xs font-bold', chipBg, muted)}
          >
            <MessageSquare size={14} className="inline-block mr-2" />
            Negotiations
          </button>
        </div>
      </div>

      {tradeDeskMessage && (
        <div className={cn('rounded-2xl border px-4 py-3 text-[10px] font-bold uppercase tracking-widest', panelBorder, panelBg, muted)}>
          {tradeDeskMessage}
        </div>
      )}

      {(loading || error || !user) && (
        <div className={cn('rounded-3xl border p-4 flex items-center justify-between gap-4', panelBorder, panelBg)}>
          <div className="text-sm">
            {loading && <span className="font-bold">Syncing trading inventory…</span>}
            {!loading && error && <span className="font-bold text-red-400">{error}</span>}
            {!loading && !error && !user && <span className="font-bold text-orange-400">Login in FODR to load your real trading cards.</span>}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { label: 'Open Offers', value: String(tradeOffers.length), change: `${tradeOffers.filter((offer) => offer.status === 'New').length} new`, tone: 'up' },
          { label: 'Active Trades', value: String(outgoingOffers.length), change: `${outgoingOffers.filter((offer) => offer.status === 'Pending').length} pending`, tone: 'neutral' },
          { label: 'Tradeable Cards', value: String(tradingInventoryCards.length), change: user?.username ? `@${String(user.username).toLowerCase()}` : 'inventory sync', tone: 'up' },
          { label: 'Success Rate', value: tradingInventoryCards.length ? '82%' : '0%', change: tradingInventoryCards.length ? '+6%' : 'awaiting cards', tone: 'up' },
        ].map((stat) => (
          <div key={stat.label} className={cn('rounded-2xl border p-4', panelBg, panelBorder)}>
            <div className="text-[10px] uppercase tracking-widest text-gray-400">{stat.label}</div>
            <div className="mt-2 text-lg font-bold">{stat.value}</div>
            <div
              className={cn(
                'mt-1 text-[10px] font-bold uppercase tracking-widest',
                stat.tone === 'up' && 'text-emerald-400',
                stat.tone === 'neutral' && muted
              )}
            >
              {stat.change}
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        {quickFilters.map((filter) => (
          <button
            key={filter}
            onClick={() => toggleFilter(filter)}
            className={cn(
              'px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-colors',
              activeFilters.includes(filter)
                ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20'
                : cn(chipBg, muted)
            )}
          >
            {filter}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 flex flex-col gap-6">
          <div className={cn('rounded-3xl border p-6', panelBg, panelBorder)}>
            <div className="flex items-center justify-between">
              <div className="text-sm font-bold">Your Inventory for Trade</div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => logAction('List selected')}
                  className="px-3 py-1.5 rounded-lg bg-orange-500 text-[10px] font-bold uppercase tracking-widest text-white"
                >
                  List Selected
                </button>
                <button
                  onClick={() => logAction('Manage trade inventory')}
                  className={cn('text-[10px] font-bold uppercase tracking-widest', muted)}
                >
                  Manage
                </button>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              {tradingInventoryCards.slice(0, 6).map((card) => (
                <button
                  key={card.id}
                  onClick={() => {
                    setSelectedInventoryId(card.id);
                    logAction(`Selected ${card.name}`);
                  }}
                  className={cn(
                    'flex items-center gap-3 rounded-2xl border p-3 text-left transition-all',
                    panelBorder,
                    panelBg,
                    selectedInventoryId === card.id && 'ring-2 ring-orange-400/50'
                  )}
                >
                  <img src={card.image} alt={card.name} className="h-14 w-12 rounded-xl object-contain bg-black/20" referrerPolicy="no-referrer" />
                  <div className="flex-1">
                    <div className="text-sm font-bold">{card.name}</div>
                    <div className={cn('text-[10px] uppercase tracking-widest', muted)}>
                      {card.team} · {card.rarity} · {card.condition}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold">{card.value}</div>
                    <div className="text-[10px] uppercase tracking-widest text-emerald-400">{card.verificationStatus === 'verified' ? 'Tradeable' : 'Pending'}</div>
                  </div>
                </button>
              ))}
              {tradingInventoryCards.length === 0 && !loading && (
                <div className={cn('md:col-span-2 rounded-2xl border border-dashed p-6 text-center text-sm', panelBorder, muted)}>
                  No verified cards available for trading yet.
                </div>
              )}
            </div>
          </div>

          <div className={cn('rounded-3xl border p-6', panelBg, panelBorder)}>
            <div className="flex items-center justify-between">
              <div className="text-sm font-bold">Trade Builder</div>
              <button
                onClick={() => logAction('Trade draft saved')}
                className={cn('text-[10px] font-bold uppercase tracking-widest', muted)}
              >
                Save Draft
              </button>
            </div>
            <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className={cn('rounded-2xl border p-4', panelBorder, panelBg)}>
                <div className="text-[10px] uppercase tracking-widest text-gray-400">Your Card</div>
                {selectedInventory ? (
                  <div className="mt-3 flex items-center gap-3">
                    <img src={selectedInventory.image} alt={selectedInventory.name} className="h-16 w-14 rounded-xl object-contain bg-black/20" referrerPolicy="no-referrer" />
                    <div className="flex-1">
                      <div className="text-sm font-bold">{selectedInventory.name}</div>
                      <div className={cn('text-[10px] uppercase tracking-widest', muted)}>
                        {selectedInventory.rarity} · {selectedInventory.condition}
                      </div>
                      <div className="text-sm font-bold text-orange-400">{selectedInventory.value}</div>
                    </div>
                    <button
                      onClick={() => setSelectedInventoryId(null)}
                      className={cn('text-[10px] font-bold uppercase tracking-widest', muted)}
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="mt-3 space-y-3">
                    <button
                      onClick={() => setShowInventoryPicker((prev) => !prev)}
                      className={cn('w-full flex items-center justify-center gap-2 rounded-xl border border-dashed px-3 py-4 text-[10px] font-bold uppercase tracking-widest', panelBorder, muted)}
                    >
                      <Plus size={14} />
                      Add trading card
                    </button>
                    {showInventoryPicker && (
                      <div className="space-y-2">
                        {tradingInventoryCards.slice(0, 4).map((card) => (
                          <button
                            key={card.id}
                            onClick={() => {
                              setSelectedInventoryId(card.id);
                              setShowInventoryPicker(false);
                              logAction(`Selected ${card.name}`);
                            }}
                            className={cn('flex items-center gap-3 rounded-xl border p-2 text-left', panelBorder, panelBg)}
                          >
                            <img src={card.image} alt={card.name} className="h-10 w-9 rounded-lg object-contain bg-black/20" referrerPolicy="no-referrer" />
                            <div className="flex-1">
                              <div className="text-xs font-bold">{card.name}</div>
                              <div className={cn('text-[10px] uppercase tracking-widest', muted)}>{card.rarity}</div>
                            </div>
                            <div className="text-[10px] font-bold text-orange-400">{card.value}</div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
                <div className="mt-4 space-y-2">
                  {['Add Cash', 'Include Insurance', 'Require Escrow'].map((option) => (
                    <button
                      key={option}
                      onClick={() => {
                        toggleTradeOption(option);
                        logAction(option);
                      }}
                      className={cn(
                        'w-full text-left px-3 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-colors',
                        tradeOptions.includes(option) ? 'bg-orange-500 text-white' : cn(chipBg, muted)
                      )}
                    >
                      {option}
                    </button>
                  ))}
                </div>
                {tradeOptions.includes('Add Cash') && (
                  <div className="mt-4 space-y-2">
                    <div className={cn('text-[10px] uppercase tracking-widest', muted)}>Cash Add-On</div>
                    <div className="flex items-center gap-2">
                      <span className={cn('text-xs font-bold', muted)}>$</span>
                      <input
                        value={cashAmount}
                        onChange={(e) => setCashAmount(e.target.value.replace(/[^0-9.]/g, ''))}
                        placeholder="0"
                        className={cn(
                          'flex-1 rounded-xl border px-3 py-2 text-xs font-bold outline-none',
                          panelBorder,
                          panelBg,
                          muted
                        )}
                      />
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {['50000', '100000', '250000', '500000'].map((amount) => (
                        <button
                          key={amount}
                          onClick={() => setCashAmount(amount)}
                          className={cn('px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-widest', chipBg, muted)}
                        >
                          +${Number(amount).toLocaleString()}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                <div className="mt-4">
                  <div className={cn('text-[10px] uppercase tracking-widest', muted)}>Active Terms</div>
                  {tradeOptions.length > 0 ? (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {tradeOptions.map((option) => (
                        <span
                          key={option}
                          className={cn('px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest', chipBg, muted)}
                        >
                          {option}
                        </span>
                      ))}
                      {tradeOptions.includes('Add Cash') && cashAmount && (
                        <span className={cn('px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest', chipBg, muted)}>
                          Cash +${Number.parseFloat(cashAmount || '0').toLocaleString()}
                        </span>
                      )}
                    </div>
                  ) : (
                    <div className={cn('mt-2 text-[10px] uppercase tracking-widest', muted)}>No terms selected</div>
                  )}
                </div>
              </div>
              <div className={cn('rounded-2xl border p-4', panelBorder, panelBg)}>
                <div className="text-[10px] uppercase tracking-widest text-gray-400">Target Trade</div>
                {selectedTargetIds.length > 0 ? (
                  <div className="mt-3 space-y-3">
                    {selectedTargetIds.map((id) => {
                      const card = targetCatalog.find((item) => item.id === id);
                      if (!card) return null;
                      return (
                        <div key={card.id} className={cn('flex items-center gap-3 rounded-xl border p-3', panelBorder, panelBg)}>
                          <img src={card.image} alt={card.name} className="h-12 w-10 rounded-lg object-contain bg-black/20" referrerPolicy="no-referrer" />
                          <div className="flex-1">
                            <div className="text-xs font-bold">{card.name}</div>
                            <div className={cn('text-[10px] uppercase tracking-widest', muted)}>{card.serial}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-xs font-bold text-orange-400">${card.value.toLocaleString()}</div>
                            <button
                              onClick={() => toggleTarget(card.id)}
                              className={cn('mt-1 text-[10px] font-bold uppercase tracking-widest', muted)}
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      );
                    })}
                    <button
                      onClick={() => setShowTargetPicker((prev) => !prev)}
                      className={cn('w-full flex items-center justify-center gap-2 rounded-xl border border-dashed px-3 py-3 text-[10px] font-bold uppercase tracking-widest', panelBorder, muted)}
                    >
                      <Plus size={14} />
                      Add more targets
                    </button>
                  </div>
                ) : (
                  <div className="mt-3">
                    <button
                      onClick={() => setShowTargetPicker((prev) => !prev)}
                      className={cn('w-full flex items-center justify-center gap-2 rounded-xl border border-dashed px-3 py-4 text-[10px] font-bold uppercase tracking-widest', panelBorder, muted)}
                    >
                      <Plus size={14} />
                      Add target cards
                    </button>
                  </div>
                )}
                {showTargetPicker && (
                  <div className="mt-4 space-y-2">
                    {targetCatalog.slice(0, 6).map((card) => (
                      <button
                        key={card.id}
                        onClick={() => {
                          toggleTarget(card.id);
                          logAction(`Target ${card.name}`);
                        }}
                        className={cn(
                          'flex items-center gap-3 rounded-xl border p-3 text-left transition-colors',
                          panelBorder,
                          panelBg,
                          selectedTargetIds.includes(card.id) && 'ring-2 ring-orange-400/50'
                        )}
                      >
                          <img src={card.image} alt={card.name} className="h-12 w-10 rounded-lg object-contain bg-black/20" referrerPolicy="no-referrer" />
                        <div className="flex-1">
                          <div className="text-xs font-bold">{card.name}</div>
                          <div className={cn('text-[10px] uppercase tracking-widest', muted)}>{card.serial}</div>
                        </div>
                        <div className="text-xs font-bold text-orange-400">${card.value.toLocaleString()}</div>
                      </button>
                    ))}
                  </div>
                )}

                <div className="mt-6 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="text-[10px] uppercase tracking-widest text-gray-400">Trade Market</div>
                    <button
                      onClick={() => logAction('Market refreshed')}
                      className={cn('text-[10px] font-bold uppercase tracking-widest', muted)}
                    >
                      Refresh
                    </button>
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    {tradeMarketCards.map((card) => (
                      <div key={card.id} className={cn('rounded-2xl border p-4', panelBorder, panelBg)}>
                        <div className="flex items-start gap-4">
                          <img src={card.image} alt={card.name} className="h-20 w-16 rounded-xl object-contain bg-black/20" referrerPolicy="no-referrer" />
                          <div className="flex-1 space-y-2">
                            <div className="flex items-start justify-between gap-4">
                              <div>
                                <div className="text-sm font-bold">{card.name}</div>
                                <div className={cn('text-[10px] uppercase tracking-widest', muted)}>
                                  {card.edition} · {card.year}
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-sm font-bold text-orange-400">{formatMoney(card.value)}</div>
                                <div className={cn('text-[10px] uppercase tracking-widest', card.trend.startsWith('+') ? 'text-emerald-400' : 'text-red-400')}>
                                  {card.trend}
                                </div>
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3 text-[10px] uppercase tracking-widest text-gray-400">
                              <div>Rarity: <span className={detailStrong}>{card.rarity}</span></div>
                              <div>Condition: <span className={detailStrong}>{card.condition}</span></div>
                              <div>Serial: <span className={detailStrong}>{card.serial}</span></div>
                              <div>Owner: <span className={detailStrong}>@{card.owner}</span></div>
                              <div>Location: <span className={detailStrong}>{card.location}</span></div>
                              <div>Listed: <span className={detailStrong}>{card.listedSince}</span></div>
                              <div>Last Sale: <span className={detailStrong}>{formatMoney(card.lastSale)}</span></div>
                              <div>Liquidity: <span className={detailStrong}>{card.liquidity}</span></div>
                              <div>Offers: <span className={detailStrong}>{card.offers}</span></div>
                              <div>Escrow: <span className={detailStrong}>{card.escrow}</span></div>
                            </div>
                            <p className={cn('text-[11px] leading-relaxed', muted)}>{card.description}</p>
                            <div className="flex flex-wrap gap-2">
                              {card.tags.map((tag) => (
                                <span key={tag} className={cn('px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest', chipBg, muted)}>
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="mt-3 flex flex-wrap gap-2">
                          <button
                            onClick={() => toggleTarget(card.id)}
                            className={cn(
                              'px-3 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-colors',
                              selectedTargetIds.includes(card.id) ? 'bg-emerald-500 text-white' : 'bg-orange-500 text-white'
                            )}
                          >
                            {selectedTargetIds.includes(card.id) ? 'Added' : 'Add Target'}
                          </button>
                          <button
                            onClick={() => logAction(`Compare ${card.name}`)}
                            className={cn('px-3 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest', chipBg, muted)}
                          >
                            Compare
                          </button>
                          <button
                            onClick={() => logAction(`Message @${card.owner}`)}
                            className={cn('px-3 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest', chipBg, muted)}
                          >
                            Message Owner
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              {['Send Offer', 'Auto-Match', 'Counter', 'Bundle Trade', 'Swap + Cash', 'Generate Contract'].map((label) => (
                <button
                  key={label}
                  onClick={() => {
                    if (label === 'Send Offer') {
                      sendOffer();
                    } else {
                      setSelectedAction(label);
                      logAction(label);
                    }
                  }}
                  className={cn(
                    'px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-colors',
                    label === 'Send Offer'
                      ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20'
                      : cn(chipBg, muted),
                    selectedAction === label && 'ring-2 ring-orange-400/50'
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className={cn('rounded-3xl border p-6', panelBg, panelBorder)}>
            <div className="flex items-center justify-between">
              <div className="text-sm font-bold">Offers Center</div>
              <div className="flex gap-2 text-[10px] uppercase tracking-widest text-gray-400">
                {(['Incoming', 'Outgoing', 'History', 'Watchlist'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setTradeTab(tab)}
                    className={cn(
                      'px-2 py-1 rounded-lg',
                      tradeTab === tab ? 'bg-orange-500 text-white' : cn(chipBg, muted)
                    )}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>
            <div className="mt-4 space-y-3">
              {tradeTab === 'Incoming' &&
                tradeOffers.map((offer) => (
                  <button
                    key={offer.id}
                    onClick={() => setSelectedOfferId(offer.id)}
                    className={cn(
                      'w-full rounded-2xl border p-3 text-left transition-all',
                      panelBorder,
                      panelBg,
                      selectedOfferId === offer.id && 'ring-2 ring-orange-400/50'
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs font-bold">@{offer.from}</div>
                        <div className={cn('text-[10px] uppercase tracking-widest', muted)}>
                          Offers {offer.offeredCard}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-bold text-emerald-400">{offer.delta}</div>
                        <div className={cn('text-[10px] uppercase tracking-widest', muted)}>
                          {offerStatus[offer.id] ?? offer.status}
                        </div>
                      </div>
                    </div>
                    <div className="mt-2 flex items-center justify-between text-[10px] uppercase tracking-widest text-gray-400">
                      <span>For {offer.yourCard}</span>
                      <span>Expires {offer.expires}</span>
                    </div>
                  </button>
                ))}
                {tradeTab === 'Outgoing' &&
                  outgoingOffers.map((offer) => (
                    <div key={offer.id} className={cn('rounded-2xl border p-3 space-y-2', panelBorder, panelBg)}>
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="text-xs font-bold">{offer.yourCard}</div>
                        <div className={cn('text-[10px] uppercase tracking-widest', muted)}>To {offer.to}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-bold text-orange-400">{offer.offer}</div>
                        <div className={cn('text-[10px] uppercase tracking-widest', muted)}>{offer.status}</div>
                      </div>
                    </div>
                    <div className="text-[10px] uppercase tracking-widest text-gray-400">
                      Target: {offer.targets.join(', ')}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {offer.options.length > 0 && offer.options.map((option) => (
                        <span key={option} className={cn('px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest', chipBg, muted)}>
                          {option}
                        </span>
                      ))}
                      {offer.cash && (
                        <span className={cn('px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest', chipBg, muted)}>
                          Cash {offer.cash}
                        </span>
                      )}
                      <span className={cn('px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest', chipBg, muted)}>
                        Sent {offer.sentAt}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => updateOutgoingStatus(offer.id, 'Accepted')}
                        className="px-3 py-1.5 rounded-xl bg-emerald-500 text-[10px] font-bold uppercase tracking-widest text-white"
                      >
                        Mark Accepted
                      </button>
                      <button
                        onClick={() => updateOutgoingStatus(offer.id, 'Declined')}
                        className={cn('px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-widest', chipBg, muted)}
                      >
                        Mark Declined
                      </button>
                      <button
                        onClick={() => updateOutgoingStatus(offer.id, 'Countered')}
                        className={cn('px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-widest', chipBg, muted)}
                      >
                        Mark Countered
                      </button>
                    </div>
                  </div>
                ))}
              {tradeTab === 'History' &&
                tradeHistory.map((entry) => (
                  <div key={entry.id} className={cn('rounded-2xl border p-3', panelBorder, panelBg)}>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs font-bold">{entry.card}</div>
                        <div className={cn('text-[10px] uppercase tracking-widest', muted)}>{entry.time}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-bold text-emerald-400">{entry.value}</div>
                        <div className={cn('text-[10px] uppercase tracking-widest', muted)}>{entry.outcome}</div>
                      </div>
                    </div>
                  </div>
                ))}
              {tradeTab === 'Watchlist' && (
                <div className={cn('rounded-2xl border p-3 text-sm', panelBorder, panelBg)}>
                  Watchlist is empty. Add cards from inventory to track trade opportunities.
                </div>
              )}
            </div>
          </div>

          <div className={cn('rounded-3xl border p-6', panelBg, panelBorder)}>
            <div className="flex items-center justify-between">
              <div className="text-sm font-bold">Trade Comparison</div>
              <button
                onClick={() => logAction('Trade comparison deep dive opened')}
                className={cn('text-[10px] font-bold uppercase tracking-widest', muted)}
              >
                Deep Dive
              </button>
            </div>
            {selectedOffer && (
              <div className="mt-4 grid grid-cols-1 gap-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-[10px] uppercase tracking-widest text-gray-400">Your Card</div>
                    <div className="text-sm font-bold">{selectedOffer.yourCard}</div>
                  </div>
                  <div className="text-sm font-bold">{formatMoney(selectedOffer.yourValue)}</div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-[10px] uppercase tracking-widest text-gray-400">Offered</div>
                    <div className="text-sm font-bold">{selectedOffer.offeredCard}</div>
                  </div>
                  <div className="text-sm font-bold text-emerald-400">{formatMoney(selectedOffer.offeredValue)}</div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className={muted}>Delta</span>
                    <span className="font-bold text-emerald-400">{selectedOffer.delta}</span>
                  </div>
                  <div className="mt-3 text-[10px] uppercase tracking-widest text-gray-400">Note</div>
                  <div className="mt-1 text-xs">{selectedOffer.note}</div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => updateOfferStatus(selectedOffer.id, 'Accepted')}
                    className="px-3 py-2 rounded-xl bg-emerald-500 text-[10px] font-bold uppercase tracking-widest text-white"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => updateOfferStatus(selectedOffer.id, 'Countered')}
                    className={cn('px-3 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest', chipBg, muted)}
                  >
                    Counter
                  </button>
                  <button
                    onClick={() => updateOfferStatus(selectedOffer.id, 'Declined')}
                    className={cn('px-3 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest', chipBg, muted)}
                  >
                    Decline
                  </button>
                  <button
                    onClick={() => logAction('Message sender')}
                    className={cn('px-3 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest', chipBg, muted)}
                  >
                    Message
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className={cn('rounded-3xl border p-6', panelBg, panelBorder)}>
            <div className="flex items-center justify-between">
              <div className="text-sm font-bold">Automation & Safety</div>
              <button
                onClick={() => logAction('Automation policy reviewed')}
                className={cn('text-[10px] font-bold uppercase tracking-widest', muted)}
              >
                Policy
              </button>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {(
                [
                  ['autoCounter', 'Auto-Counter'],
                  ['escrowOnly', 'Escrow Only'],
                  ['priceLock', 'Price Lock'],
                  ['instantNotify', 'Instant Notify'],
                  ['bundleMode', 'Bundle Mode'],
                ] as Array<[keyof typeof automation, string]>
              ).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => toggleAutomation(key)}
                  className={cn(
                    'px-3 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-colors',
                    automation[key] ? 'bg-emerald-500/20 text-emerald-300' : cn(chipBg, muted)
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
            {activityLog.length > 0 && (
              <div className="mt-4">
                <div className={cn('text-[10px] uppercase tracking-widest', muted)}>Activity Log</div>
                <div className="mt-2 space-y-1 text-[10px]">
                  {activityLog.map((entry) => (
                    <div key={entry} className={cn('flex items-center justify-between', muted)}>
                      <span>{entry}</span>
                      <span className="text-emerald-400 font-bold">Logged</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const ChatsView = ({
  isDarkMode,
  cards,
  loading,
  error,
  user,
}: {
  isDarkMode: boolean;
  cards: any[];
  loading: boolean;
  error: string | null;
  user: any | null;
}) => {
  const panelBg = isDarkMode ? 'bg-white/5' : 'bg-white';
  const panelBorder = isDarkMode ? 'border-white/10' : 'border-gray-100';
  const muted = isDarkMode ? 'text-gray-400' : 'text-gray-500';
  const chipBg = isDarkMode ? 'bg-white/10' : 'bg-gray-100';
  const chatStorageKey = user
    ? `fodr-dashboard-chats:${String(user?.id ?? user?.userId ?? user?.email ?? user?.username ?? 'user')}`
    : null;
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const [newChatCardId, setNewChatCardId] = useState('');
  const [newChatHandle, setNewChatHandle] = useState('');
  const [newChatLabel, setNewChatLabel] = useState('');
  const [chatNote, setChatNote] = useState<string | null>(null);
  const [conversations, setConversations] = useState<
    Array<{
      id: string;
      cardId: string;
      handle: string;
      label: string;
      updatedAt: string;
      createdAt: string;
      messages: Array<{
        id: string;
        from: 'you';
        text: string;
        createdAt: string;
      }>;
    }>
  >([]);

  const sortConversations = (
    items: Array<{
      id: string;
      cardId: string;
      handle: string;
      label: string;
      updatedAt: string;
      createdAt: string;
      messages: Array<{
        id: string;
        from: 'you';
        text: string;
        createdAt: string;
      }>;
    }>
  ) =>
    [...items].sort((a, b) => {
      const left = new Date(b.updatedAt || b.createdAt).getTime();
      const right = new Date(a.updatedAt || a.createdAt).getTime();
      return left - right;
    });

  const formatTimestamp = (value?: string) => {
    if (!value) return 'Now';
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return 'Now';
    return new Intl.DateTimeFormat('en-GB', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(parsed);
  };

  const buildLabelFromHandle = (value: string) =>
    String(value || '')
      .trim()
      .replace(/^@+/, '')
      .split(/[\s._-]+/)
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ') || 'Collector';

  const buildInitials = (label: string) => {
    const parts = String(label || '')
      .trim()
      .split(/\s+/)
      .filter(Boolean);
    return parts.slice(0, 2).map((part) => part.charAt(0).toUpperCase()).join('') || 'C';
  };

  useEffect(() => {
    if (!chatStorageKey) {
      setConversations([]);
      setSelectedChatId(null);
      return;
    }

    try {
      const validCardIds = new Set(cards.map((card) => String(card.id)));
      const raw = localStorage.getItem(chatStorageKey);
      const parsed = raw ? JSON.parse(raw) : [];
      const normalized = Array.isArray(parsed)
        ? parsed
            .filter((item) => item && typeof item === 'object' && validCardIds.has(String(item.cardId)))
            .map((item) => ({
              id: String(item.id || `chat-${item.cardId}`),
              cardId: String(item.cardId),
              handle: String(item.handle || '').replace(/^@+/, ''),
              label: String(item.label || buildLabelFromHandle(String(item.handle || 'collector'))),
              updatedAt: String(item.updatedAt || item.createdAt || new Date().toISOString()),
              createdAt: String(item.createdAt || item.updatedAt || new Date().toISOString()),
              messages: Array.isArray(item.messages)
                ? item.messages
                    .filter((message) => message && typeof message === 'object')
                    .map((message) => ({
                      id: String(message.id || `msg-${Date.now()}`),
                      from: 'you' as const,
                      text: String(message.text || ''),
                      createdAt: String(message.createdAt || new Date().toISOString()),
                    }))
                    .filter((message) => message.text.trim())
                : [],
            }))
        : [];

      setConversations(sortConversations(normalized));
    } catch {
      setConversations([]);
    }
  }, [chatStorageKey, cards]);

  useEffect(() => {
    if (!chatStorageKey) return;
    try {
      localStorage.setItem(chatStorageKey, JSON.stringify(conversations));
    } catch {
      // Ignore storage failures for dashboard chats.
    }
  }, [chatStorageKey, conversations]);

  useEffect(() => {
    if (!conversations.length) {
      setSelectedChatId(null);
      return;
    }
    if (!selectedChatId || !conversations.some((conversation) => conversation.id === selectedChatId)) {
      setSelectedChatId(conversations[0].id);
    }
  }, [selectedChatId, conversations]);

  const activeConversation = conversations.find((conversation) => conversation.id === selectedChatId) ?? conversations[0] ?? null;
  const activeCard = activeConversation
    ? cards.find((card) => String(card.id) === String(activeConversation.cardId)) ?? null
    : null;
  const activeThread = activeConversation?.messages || [];
  const availableCards = cards.filter(
    (card) => !conversations.some((conversation) => String(conversation.cardId) === String(card.id))
  );

  useEffect(() => {
    if (!newChatCardId && availableCards.length) {
      setNewChatCardId(String(availableCards[0].id));
    }
    if (newChatCardId && !availableCards.some((card) => String(card.id) === String(newChatCardId))) {
      setNewChatCardId(availableCards[0] ? String(availableCards[0].id) : '');
    }
  }, [availableCards, newChatCardId]);

  const startConversation = () => {
    if (!user) {
      setChatNote('Login first to create a chat thread.');
      return;
    }

    const selectedCard = cards.find((card) => String(card.id) === String(newChatCardId));
    const cleanedHandle = String(newChatHandle || '').trim().replace(/^@+/, '');
    const cleanedLabel = String(newChatLabel || '').trim();

    if (!selectedCard) {
      setChatNote('Choose a card first.');
      return;
    }
    if (!cleanedHandle) {
      setChatNote('Add the collector handle you want to message.');
      return;
    }

    const createdAt = new Date().toISOString();
    const thread = {
      id: `chat-${selectedCard.id}-${Date.now()}`,
      cardId: String(selectedCard.id),
      handle: cleanedHandle,
      label: cleanedLabel || buildLabelFromHandle(cleanedHandle),
      createdAt,
      updatedAt: createdAt,
      messages: [],
    };

    setConversations((prev) => sortConversations([thread, ...prev]));
    setSelectedChatId(thread.id);
    setNewChatHandle('');
    setNewChatLabel('');
    setChatNote(`Chat opened for ${selectedCard.name}.`);
    emitDashboardAction(`Chat opened with @${cleanedHandle} about ${selectedCard.name}`);
  };

  const sendMessage = () => {
    if (!activeConversation || !messageInput.trim()) return;
    const createdAt = new Date().toISOString();
    const nextMessage = {
      id: `msg-${activeConversation.id}-${Date.now()}`,
      from: 'you' as const,
      text: messageInput.trim(),
      createdAt,
    };

    setConversations((prev) =>
      sortConversations(
        prev.map((conversation) =>
          conversation.id === activeConversation.id
            ? {
                ...conversation,
                updatedAt: createdAt,
                messages: [...conversation.messages, nextMessage],
              }
            : conversation
        )
      )
    );
    setMessageInput('');
    setChatNote(`Message saved in ${activeConversation.label}.`);
    emitDashboardAction(`Message sent to ${activeConversation.label} about ${activeCard?.name || 'your card'}`);
  };

  return (
    <div className="p-6 lg:p-8 flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold tracking-tight">Chats</h2>
        <p className={cn('text-sm', muted)}>
          Clean message threads for {user?.username ? `@${String(user.username).toLowerCase()}` : 'your account'} and the cards you want to discuss.
        </p>
      </div>

      {(loading || error || !user) && (
        <div className={cn('rounded-3xl border p-4 flex items-center justify-between gap-4', panelBorder, panelBg)}>
          <div className="text-sm">
            {loading && <span className="font-bold">Syncing chat cards…</span>}
            {!loading && error && <span className="font-bold text-red-400">{error}</span>}
            {!loading && !error && !user && <span className="font-bold text-orange-400">Login in FODR to open your saved chat threads.</span>}
          </div>
        </div>
      )}

      {user && (
        <div className={cn('rounded-3xl border p-5', panelBg, panelBorder)}>
          <div className="flex flex-col gap-2">
            <div className="text-sm font-bold">Start A New Chat</div>
            <p className={cn('text-xs', muted)}>
              Pick one of your verified cards, add the collector handle, and open a real thread. No random traders, no seeded fake messages.
            </p>
          </div>
          <div className="mt-4 grid grid-cols-1 gap-3 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)_minmax(0,1fr)_auto]">
            <select
              value={newChatCardId}
              onChange={(event) => setNewChatCardId(event.target.value)}
              className={cn('rounded-2xl border px-4 py-3 text-sm outline-none', panelBorder, panelBg)}
            >
              {availableCards.length === 0 ? (
                <option value="">All verified cards already have chats</option>
              ) : (
                availableCards.map((card) => (
                  <option key={card.id} value={String(card.id)}>
                    {card.name} · {card.edition}
                  </option>
                ))
              )}
            </select>
            <input
              value={newChatHandle}
              onChange={(event) => setNewChatHandle(event.target.value)}
              placeholder="@collector_handle"
              className={cn('rounded-2xl border px-4 py-3 text-sm outline-none', panelBorder, panelBg)}
            />
            <input
              value={newChatLabel}
              onChange={(event) => setNewChatLabel(event.target.value)}
              placeholder="Display name (optional)"
              className={cn('rounded-2xl border px-4 py-3 text-sm outline-none', panelBorder, panelBg)}
            />
            <button
              onClick={startConversation}
              disabled={!availableCards.length}
              className={cn(
                'px-5 py-3 rounded-2xl text-sm font-bold text-white transition-colors',
                availableCards.length ? 'bg-orange-500 hover:bg-orange-600' : 'bg-gray-400 cursor-not-allowed'
              )}
            >
              Open Chat
            </button>
          </div>
          {chatNote && <div className={cn('mt-3 text-xs font-semibold', isDarkMode ? 'text-orange-300' : 'text-orange-600')}>{chatNote}</div>}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-[360px_minmax(0,1fr)] gap-6">
        <div className={cn('rounded-3xl border p-4', panelBg, panelBorder)}>
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm font-bold">Conversation List</div>
            <span className={cn('text-[10px] uppercase tracking-widest', muted)}>{conversations.length} threads</span>
          </div>
          <div className="space-y-3">
            {conversations.map((conversation) => (
              <button
                key={conversation.id}
                onClick={() => setSelectedChatId(conversation.id)}
                className={cn(
                  'w-full rounded-2xl border p-3 text-left transition-all',
                  panelBorder,
                  panelBg,
                  selectedChatId === conversation.id && 'ring-2 ring-orange-400/50'
                )}
              >
                <div className="flex items-start gap-3">
                  <div className="h-12 w-12 rounded-2xl bg-orange-500/15 text-orange-400 flex items-center justify-center text-sm font-black uppercase">
                    {buildInitials(conversation.label)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <div className="text-sm font-bold truncate">{conversation.label}</div>
                      <span className={cn('text-[10px] uppercase tracking-widest', muted)}>
                        {conversation.messages.length} msg
                      </span>
                    </div>
                    <div className={cn('mt-1 text-[10px] uppercase tracking-widest', muted)}>
                      @{conversation.handle}
                    </div>
                    <div className={cn('mt-2 text-xs truncate', muted)}>
                      {(() => {
                        const card = cards.find((entry) => String(entry.id) === String(conversation.cardId));
                        const lastMessage = conversation.messages[conversation.messages.length - 1];
                        if (lastMessage) return lastMessage.text;
                        return `No messages yet · ${card?.name || 'Card'}${card?.edition ? ` · ${card.edition}` : ''}`;
                      })()}
                    </div>
                  </div>
                </div>
              </button>
            ))}
            {conversations.length === 0 && !loading && (
              <div className={cn('rounded-2xl border border-dashed p-5 text-center text-sm', panelBorder, muted)}>
                No chats yet. Open one from your verified cards and your messages will stay here.
              </div>
            )}
          </div>
        </div>

        <div className={cn('rounded-3xl border p-4 lg:p-6 flex flex-col min-h-[620px]', panelBg, panelBorder)}>
          {activeConversation ? (
            <>
              <div className="flex items-center gap-4 border-b border-gray-100 pb-4 dark:border-white/10">
                <div className="h-14 w-14 rounded-2xl bg-orange-500/15 text-orange-400 flex items-center justify-center text-lg font-black uppercase">
                  {buildInitials(activeConversation.label)}
                </div>
                <div className="flex-1">
                  <div className="text-lg font-bold">{activeConversation.label}</div>
                  <div className={cn('text-[10px] uppercase tracking-widest', muted)}>
                    @{activeConversation.handle}
                  </div>
                  <div className={cn('mt-1 text-xs', muted)}>
                    {activeCard ? `Discussing ${activeCard.name} · ${activeCard.edition}` : 'Card unavailable'}
                  </div>
                </div>
                <button
                  onClick={() => emitDashboardAction(`Negotiation thread opened for ${activeCard?.name || 'selected card'}`)}
                  className={cn('px-3 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest', chipBg, muted)}
                >
                  Open Negotiation
                </button>
              </div>

              <div className="flex-1 overflow-y-auto py-5 space-y-4">
                {activeThread.length === 0 ? (
                  <div className={cn('rounded-2xl border border-dashed p-6 text-sm text-center', panelBorder, muted)}>
                    No messages in this thread yet. Start the conversation below.
                  </div>
                ) : (
                  activeThread.map((message) => (
                    <div
                      key={message.id}
                      className="max-w-[78%] rounded-2xl px-4 py-3 text-sm leading-relaxed ml-auto bg-orange-500 text-white"
                    >
                      <div>{message.text}</div>
                      <div className="mt-2 text-[10px] uppercase tracking-widest text-orange-100">
                        You · {formatTimestamp(message.createdAt)}
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="border-t border-gray-100 pt-4 dark:border-white/10">
                <div className="flex flex-col gap-3 lg:flex-row">
                  <input
                    value={messageInput}
                    onChange={(event) => setMessageInput(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' && !event.shiftKey) {
                        event.preventDefault();
                        sendMessage();
                      }
                    }}
                    placeholder="Type your message about the card value, trade terms, or verification..."
                    className={cn('w-full rounded-2xl border px-4 py-3 text-sm outline-none', panelBorder, panelBg, muted)}
                  />
                  <button
                    onClick={sendMessage}
                    className="px-5 py-3 rounded-2xl bg-orange-500 text-sm font-bold text-white hover:bg-orange-600 transition-colors"
                  >
                    Send
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className={cn('flex-1 rounded-2xl border border-dashed p-8 text-center text-sm', panelBorder, muted)}>
              {user ? 'Open a chat from the form or choose a thread to start messaging.' : 'Login to access your dashboard chats.'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const NegotiationsView = ({
  isDarkMode,
  cards,
  loading,
  error,
  user,
}: {
  isDarkMode: boolean;
  cards: any[];
  loading: boolean;
  error: string | null;
  user: any | null;
}) => {
  const panelBg = isDarkMode ? 'bg-white/5' : 'bg-white';
  const panelBorder = isDarkMode ? 'border-white/10' : 'border-gray-100';
  const muted = isDarkMode ? 'text-gray-400' : 'text-gray-500';
  const chipBg = isDarkMode ? 'bg-white/10' : 'bg-gray-100';
  const bidders = ['vault_prime', 'golden_archive', 'north_star', 'samba_archive', 'market_maker', 'card_shark'];
  const [negotiationState, setNegotiationState] = useState<Record<number, { status: string; counterValue: number }>>({});

  const formatMoney = (value: number) => `$${Math.round(value).toLocaleString()}`;

  const negotiations = cards.slice(0, Math.min(cards.length, 6)).map((card, index) => {
    const askingPrice = Number(card.valueNumber || 0);
    const incomingOffer = Math.round(askingPrice * (0.78 + (index % 4) * 0.06));
    const suggestedCounter = Math.round((askingPrice + incomingOffer) / 2);
    const state = negotiationState[card.id];
    return {
      id: card.id,
      name: card.name,
      edition: card.edition,
      image: card.image,
      bidder: bidders[index % bidders.length],
      askingPrice,
      incomingOffer,
      suggestedCounter,
      liveCounter: state?.counterValue ?? suggestedCounter,
      status: state?.status ?? ['Open', 'Review', 'Counter Sent', 'Awaiting Reply'][index % 4],
      spread: askingPrice - incomingOffer,
      note: card.note || `Negotiation desk opened for ${card.name}.`,
    };
  });

  const updateNegotiation = (cardId: number, status: string, nextCounter?: number) => {
    setNegotiationState((prev) => ({
      ...prev,
      [cardId]: {
        status,
        counterValue: typeof nextCounter === 'number' ? nextCounter : prev[cardId]?.counterValue || 0,
      },
    }));
  };

  const raiseCounter = (cardId: number, currentCounter: number) => {
    const nextCounter = Math.round(currentCounter * 1.04);
    updateNegotiation(cardId, 'Counter Sent', nextCounter);
    emitDashboardAction(`Counter raised to ${formatMoney(nextCounter)}`);
  };

  return (
    <div className="p-6 lg:p-8 flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold tracking-tight">Negotiations</h2>
        <p className={cn('text-sm', muted)}>
          Live card-value negotiation desk for {user?.username ? `@${String(user.username).toLowerCase()}` : 'your collection'}.
        </p>
      </div>

      {(loading || error || !user) && (
        <div className={cn('rounded-3xl border p-4 flex items-center justify-between gap-4', panelBorder, panelBg)}>
          <div className="text-sm">
            {loading && <span className="font-bold">Syncing negotiation cards…</span>}
            {!loading && error && <span className="font-bold text-red-400">{error}</span>}
            {!loading && !error && !user && <span className="font-bold text-orange-400">Login in FODR to load your real card negotiations.</span>}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { label: 'Open Negotiations', value: String(negotiations.length), tone: 'text-orange-400' },
          { label: 'Avg Spread', value: negotiations.length ? formatMoney(negotiations.reduce((sum, item) => sum + item.spread, 0) / negotiations.length) : '$0', tone: 'text-emerald-400' },
          { label: 'Counters Sent', value: String(negotiations.filter((item) => item.status === 'Counter Sent').length), tone: 'text-blue-400' },
          { label: 'Awaiting Reply', value: String(negotiations.filter((item) => item.status === 'Awaiting Reply').length), tone: muted },
        ].map((stat) => (
          <div key={stat.label} className={cn('rounded-2xl border p-4', panelBg, panelBorder)}>
            <div className={cn('text-[10px] uppercase tracking-widest', muted)}>{stat.label}</div>
            <div className={cn('mt-2 text-lg font-bold', stat.tone)}>{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {negotiations.map((item) => (
          <div key={item.id} className={cn('rounded-3xl border p-5', panelBg, panelBorder)}>
            <div className="flex items-start gap-4">
              <img src={item.image} alt={item.name} className="h-28 w-20 rounded-2xl object-contain bg-black/20" referrerPolicy="no-referrer" />
              <div className="flex-1 space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-lg font-bold">{item.name}</div>
                    <div className={cn('text-[10px] uppercase tracking-widest', muted)}>
                      {item.edition} · bidder @{item.bidder}
                    </div>
                  </div>
                  <span className={cn('px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest', chipBg, muted)}>
                    {item.status}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-3 text-xs">
                  <div className={cn('rounded-2xl border p-3', panelBorder)}>
                    <div className={cn('text-[10px] uppercase tracking-widest', muted)}>Ask</div>
                    <div className="mt-2 font-bold text-orange-400">{formatMoney(item.askingPrice)}</div>
                  </div>
                  <div className={cn('rounded-2xl border p-3', panelBorder)}>
                    <div className={cn('text-[10px] uppercase tracking-widest', muted)}>Offer</div>
                    <div className="mt-2 font-bold text-emerald-400">{formatMoney(item.incomingOffer)}</div>
                  </div>
                  <div className={cn('rounded-2xl border p-3', panelBorder)}>
                    <div className={cn('text-[10px] uppercase tracking-widest', muted)}>Counter</div>
                    <div className="mt-2 font-bold">{formatMoney(item.liveCounter)}</div>
                  </div>
                </div>

                <div className={cn('rounded-2xl border p-4', panelBorder)}>
                  <div className="flex items-center justify-between text-[10px] uppercase tracking-widest">
                    <span className={muted}>Spread</span>
                    <span className="font-bold text-red-400">{formatMoney(item.spread)}</span>
                  </div>
                  <div className={cn('mt-3 text-xs leading-relaxed', muted)}>{item.note}</div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => {
                      updateNegotiation(item.id, 'Accepted', item.liveCounter);
                      emitDashboardAction(`${item.name} negotiation accepted`);
                    }}
                    className="px-4 py-2 rounded-xl bg-emerald-500 text-[10px] font-bold uppercase tracking-widest text-white"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => raiseCounter(item.id, item.liveCounter)}
                    className="px-4 py-2 rounded-xl bg-orange-500 text-[10px] font-bold uppercase tracking-widest text-white"
                  >
                    Counter +4%
                  </button>
                  <button
                    onClick={() => {
                      updateNegotiation(item.id, 'Declined', item.liveCounter);
                      emitDashboardAction(`${item.name} negotiation declined`);
                    }}
                    className={cn('px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest', chipBg, muted)}
                  >
                    Decline
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {negotiations.length === 0 && !loading && (
          <div className={cn('xl:col-span-2 rounded-3xl border border-dashed p-8 text-center text-sm', panelBorder, muted)}>
            No live negotiations yet. Your verified cards will appear here when deal discussions start.
          </div>
        )}
      </div>
    </div>
  );
};

const CardDatabaseView = ({
  isDarkMode,
  watchlistIds,
  toggleWatchlist,
}: {
  isDarkMode: boolean;
  watchlistIds: string[];
  toggleWatchlist: (id: string) => void;
}) => {
  const [search, setSearch] = useState('');
  const [playerFilter, setPlayerFilter] = useState('All');
  const [clubFilter, setClubFilter] = useState('All');
  const [rarityFilter, setRarityFilter] = useState('All');
  const [editionFilter, setEditionFilter] = useState('All');
  const [yearFilter, setYearFilter] = useState('All');
  const [selectedCardId, setSelectedCardId] = useState<string | null>(cardDatabase[0]?.id ?? null);
  const [viewMode, setViewMode] = useState<'Grid' | 'List'>('Grid');
  const [sortBy, setSortBy] = useState('Value High');
  const [quickFilters, setQuickFilters] = useState<string[]>([]);
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [showDetails, setShowDetails] = useState(true);
  const [exportedAt, setExportedAt] = useState<string | null>(null);
  const [databaseActionNote, setDatabaseActionNote] = useState<string | null>(null);

  const panelBg = isDarkMode ? 'bg-white/5' : 'bg-white';
  const panelBorder = isDarkMode ? 'border-white/10' : 'border-gray-100';
  const muted = isDarkMode ? 'text-gray-400' : 'text-gray-500';

  const unique = (items: string[]) => ['All', ...Array.from(new Set(items))];
  const players = unique(cardDatabase.map((card) => card.player));
  const clubs = unique(cardDatabase.map((card) => card.club));
  const rarities = unique(cardDatabase.map((card) => card.rarity));
  const editions = unique(cardDatabase.map((card) => card.edition));
  const years = unique(cardDatabase.map((card) => card.year));

  const filteredCards = cardDatabase.filter((card) => {
    const query = search.trim().toLowerCase();
    const matchesSearch =
      !query ||
      card.name.toLowerCase().includes(query) ||
      card.player.toLowerCase().includes(query) ||
      card.club.toLowerCase().includes(query);
    const matchesPlayer = playerFilter === 'All' || card.player === playerFilter;
    const matchesClub = clubFilter === 'All' || card.club === clubFilter;
    const matchesRarity = rarityFilter === 'All' || card.rarity === rarityFilter;
    const matchesEdition = editionFilter === 'All' || card.edition === editionFilter;
    const matchesYear = yearFilter === 'All' || card.year === yearFilter;
    const matchesQuick =
      quickFilters.length === 0 ||
      quickFilters.every((filter) => {
        switch (filter) {
          case 'High Demand':
            return ['Very High', 'High', 'Surging'].includes(card.demand);
          case 'Low Supply':
            return card.inCirculation <= 50;
          case 'Price Up':
            return card.changePct > 0;
          case 'Price Down':
            return card.changePct < 0;
          case 'Legendary+':
            return ['Legendary', 'Mythic', 'Iconic'].includes(card.rarity);
          case 'New Era':
            return Number(card.year) >= 2018;
          case 'Vintage':
            return Number(card.year) <= 2005;
          case 'Watchlist Only':
            return watchlistIds.includes(card.id);
          default:
            return true;
        }
      });
    return matchesSearch && matchesPlayer && matchesClub && matchesRarity && matchesEdition && matchesYear && matchesQuick;
  });

  const sortedCards = [...filteredCards].sort((a, b) => {
    switch (sortBy) {
      case 'Value Low':
        return a.value - b.value;
      case 'Scarcity':
        return b.scarcityScore - a.scarcityScore;
      case 'Popularity':
        return b.popularity - a.popularity;
      case 'Newest':
        return Number(b.year) - Number(a.year);
      case 'Oldest':
        return Number(a.year) - Number(b.year);
      case 'Biggest Gain':
        return b.changePct - a.changePct;
      case 'Biggest Drop':
        return a.changePct - b.changePct;
      default:
        return b.value - a.value;
    }
  });

  const selectedCard =
    cardDatabase.find((card) => card.id === selectedCardId) ?? sortedCards[0] ?? null;

  const toggleQuickFilter = (filter: string) => {
    setQuickFilters((prev) =>
      prev.includes(filter) ? prev.filter((item) => item !== filter) : [...prev, filter]
    );
  };
  const toggleCompare = (id: string) => {
    setCompareIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };
  const clearFilters = () => {
    setSearch('');
    setPlayerFilter('All');
    setClubFilter('All');
    setRarityFilter('All');
    setEditionFilter('All');
    setYearFilter('All');
    setQuickFilters([]);
  };
  const addFilteredToWatchlist = () => {
    sortedCards.forEach((card) => {
      if (!watchlistIds.includes(card.id)) toggleWatchlist(card.id);
    });
  };
  const removeFilteredFromWatchlist = () => {
    sortedCards.forEach((card) => {
      if (watchlistIds.includes(card.id)) toggleWatchlist(card.id);
    });
  };
  const compareCards = compareIds.map((id) => cardDatabase.find((card) => card.id === id)).filter(Boolean) as typeof cardDatabase;
  const compareValue = compareCards.reduce((sum, card) => sum + card.value, 0);
  const pushDatabaseAction = (message: string) => {
    setDatabaseActionNote(message);
    emitDashboardAction(message);
  };

  return (
    <div className="p-6 lg:p-8 pb-40 lg:pb-56 flex flex-col gap-8">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Card Database</h2>
          <p className={cn('text-sm', muted)}>Browse the full platform catalog and open any card for details.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className={cn('flex items-center gap-2 rounded-xl border px-3 py-2', panelBorder, panelBg)}>
            <Search size={14} className={muted} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search player, club, edition..."
              className={cn('bg-transparent text-xs font-bold outline-none', muted)}
            />
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className={cn('px-3 py-2 rounded-xl text-xs font-bold', panelBg, panelBorder, muted)}
          >
            {['Value High', 'Value Low', 'Scarcity', 'Popularity', 'Newest', 'Oldest', 'Biggest Gain', 'Biggest Drop'].map((option) => (
              <option key={option} value={option}>
                Sort: {option}
              </option>
            ))}
          </select>
          <button
            onClick={() => setViewMode(viewMode === 'Grid' ? 'List' : 'Grid')}
            className={cn('px-3 py-2 rounded-xl text-xs font-bold', panelBg, panelBorder, muted)}
          >
            View: {viewMode}
          </button>
          <button
            onClick={clearFilters}
            className={cn('px-3 py-2 rounded-xl text-xs font-bold', panelBg, panelBorder, muted)}
          >
            Clear Filters
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {['High Demand', 'Low Supply', 'Price Up', 'Price Down', 'Legendary+', 'New Era', 'Vintage', 'Watchlist Only'].map((filter) => (
          <button
            key={filter}
            onClick={() => toggleQuickFilter(filter)}
            className={cn(
              'px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-colors',
              quickFilters.includes(filter) ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20' : cn(panelBg, panelBorder, muted)
            )}
          >
            {filter}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {[
          { label: 'Player', value: playerFilter, setValue: setPlayerFilter, options: players },
          { label: 'Club', value: clubFilter, setValue: setClubFilter, options: clubs },
          { label: 'Rarity', value: rarityFilter, setValue: setRarityFilter, options: rarities },
          { label: 'Edition', value: editionFilter, setValue: setEditionFilter, options: editions },
          { label: 'Year', value: yearFilter, setValue: setYearFilter, options: years },
        ].map((filter) => (
          <label key={filter.label} className={cn('rounded-2xl border p-3 flex flex-col gap-2', panelBorder, panelBg)}>
            <span className={cn('text-[10px] uppercase tracking-widest', muted)}>{filter.label}</span>
            <select
              value={filter.value}
              onChange={(e) => filter.setValue(e.target.value)}
              className={cn('bg-transparent text-xs font-bold outline-none', muted)}
            >
              {filter.options.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={addFilteredToWatchlist}
          className={cn('px-3 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest', panelBg, panelBorder, muted)}
        >
          Add Filtered to Watchlist
        </button>
        <button
          onClick={removeFilteredFromWatchlist}
          className={cn('px-3 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest', panelBg, panelBorder, muted)}
        >
          Remove Filtered
        </button>
        <button
          onClick={() => {
            setExportedAt('Just now');
          }}
          className={cn('px-3 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest', panelBg, panelBorder, muted)}
        >
          Export List
        </button>
        <button
          onClick={() => setShowDetails((prev) => !prev)}
          className={cn('px-3 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest', panelBg, panelBorder, muted)}
        >
          {showDetails ? 'Hide Details' : 'Show Details'}
        </button>
        {exportedAt && (
          <span className={cn('px-3 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest', panelBg, panelBorder, muted)}>
            Exported: {exportedAt}
          </span>
        )}
      </div>

      {databaseActionNote && (
        <div className={cn('rounded-2xl border px-4 py-3 text-[10px] font-bold uppercase tracking-widest', panelBorder, panelBg, muted)}>
          {databaseActionNote}
        </div>
      )}

      {selectedCard && showDetails && (
        <div className={cn('rounded-3xl border p-6 grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-6', panelBorder, panelBg)}>
          <div className="flex items-start gap-4">
            <img src={selectedCard.image} alt={selectedCard.name} className="h-32 w-24 rounded-2xl object-cover" />
            <div className="space-y-2">
              <div className="text-xl font-bold">{selectedCard.name}</div>
              <div className={cn('text-[10px] uppercase tracking-widest', muted)}>
                {selectedCard.edition} · {selectedCard.year} · {selectedCard.rarity}
              </div>
              <div className="flex flex-wrap gap-2 text-[10px] uppercase tracking-widest">
                <span className={cn('px-2 py-1 rounded-lg', panelBorder, panelBg)}>Serial {selectedCard.serial}</span>
                <span className={cn('px-2 py-1 rounded-lg', panelBorder, panelBg)}>{selectedCard.club}</span>
                <span className={cn('px-2 py-1 rounded-lg', panelBorder, panelBg)}>{selectedCard.player}</span>
              </div>
              <div className="text-lg font-bold text-orange-400">${selectedCard.value.toLocaleString()}</div>
              <div className={cn('text-[10px] font-bold uppercase tracking-widest', selectedCard.changePct >= 0 ? 'text-emerald-400' : 'text-red-400')}>
                {selectedCard.priceChange} • Demand {selectedCard.demand}
              </div>
              <p className={cn('text-sm', muted)}>{selectedCard.description}</p>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => toggleWatchlist(selectedCard.id)}
                  className={cn(
                    'px-3 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest',
                    watchlistIds.includes(selectedCard.id) ? 'bg-emerald-500 text-white' : 'bg-orange-500 text-white'
                  )}
                >
                  {watchlistIds.includes(selectedCard.id) ? 'In Watchlist' : 'Add to Watchlist'}
                </button>
                <button
                  onClick={() => toggleCompare(selectedCard.id)}
                  className={cn('px-3 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest', panelBorder, panelBg, muted)}
                >
                  {compareIds.includes(selectedCard.id) ? 'Remove Compare' : 'Compare'}
                </button>
                <button
                  onClick={() => pushDatabaseAction(`Market view opened for ${selectedCard.name}`)}
                  className={cn('px-3 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest', panelBorder, panelBg, muted)}
                >
                  View Market
                </button>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className={cn('rounded-2xl border p-4', panelBorder, panelBg)}>
              <div className={cn('text-[10px] uppercase tracking-widest', muted)}>Stats</div>
              <div className="mt-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className={muted}>Goals</span>
                  <span className="font-bold">{selectedCard.stats.goals}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className={muted}>Assists</span>
                  <span className="font-bold">{selectedCard.stats.assists}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className={muted}>Trophies</span>
                  <span className="font-bold">{selectedCard.stats.trophies}</span>
                </div>
              </div>
            </div>
            <div className={cn('rounded-2xl border p-4', panelBorder, panelBg)}>
              <div className={cn('text-[10px] uppercase tracking-widest', muted)}>Rarity Index</div>
              <div className="mt-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className={muted}>Scarcity Score</span>
                  <span className="font-bold">{selectedCard.scarcityScore}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className={muted}>In Circulation</span>
                  <span className="font-bold">{selectedCard.inCirculation}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className={muted}>Popularity</span>
                  <span className="font-bold">{selectedCard.popularity}</span>
                </div>
              </div>
            </div>
            <div className={cn('rounded-2xl border p-4', panelBorder, panelBg)}>
              <div className={cn('text-[10px] uppercase tracking-widest', muted)}>Market Health</div>
              <div className="mt-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className={muted}>Demand</span>
                  <span className="font-bold">{selectedCard.demand}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className={muted}>Price Change</span>
                  <span className={cn('font-bold', selectedCard.changePct >= 0 ? 'text-emerald-400' : 'text-red-400')}>
                    {selectedCard.priceChange}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className={muted}>Edition</span>
                  <span className="font-bold">{selectedCard.edition}</span>
                </div>
              </div>
            </div>
            <div className={cn('rounded-2xl border p-4', panelBorder, panelBg)}>
              <div className={cn('text-[10px] uppercase tracking-widest', muted)}>Identifiers</div>
              <div className="mt-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className={muted}>Serial</span>
                  <span className="font-bold">{selectedCard.serial}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className={muted}>Year</span>
                  <span className="font-bold">{selectedCard.year}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className={muted}>Club</span>
                  <span className="font-bold">{selectedCard.club}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {compareCards.length > 0 && (
        <div className={cn('rounded-2xl border p-4 flex flex-col gap-3', panelBorder, panelBg)}>
          <div className="flex items-center justify-between">
            <div className="text-sm font-bold">Compare Queue ({compareCards.length})</div>
            <button
              onClick={() => setCompareIds([])}
              className={cn('text-[10px] font-bold uppercase tracking-widest', muted)}
            >
              Clear
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {compareCards.map((card) => (
              <span key={card.id} className={cn('px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest', panelBorder, panelBg, muted)}>
                {card.name}
              </span>
            ))}
          </div>
          <div className="text-[10px] uppercase tracking-widest text-gray-400">
            Total Compared Value: <span className="text-orange-400 font-bold">${compareValue.toLocaleString()}</span>
          </div>
        </div>
      )}

      <div className={cn(viewMode === 'Grid' ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4' : 'flex flex-col gap-3')}>
        {sortedCards.map((card) => (
          <button
            key={card.id}
            onClick={() => setSelectedCardId(card.id)}
            className={cn(
              'rounded-2xl border p-4 text-left transition-all',
              panelBorder,
              panelBg,
              selectedCardId === card.id && 'ring-2 ring-orange-400/50'
            )}
          >
            <div className="flex items-start gap-4">
              <img src={card.image} alt={card.name} className="h-16 w-12 rounded-xl object-cover" />
              <div className="flex-1">
                <div className="text-sm font-bold">{card.name}</div>
                <div className={cn('text-[10px] uppercase tracking-widest', muted)}>
                  {card.player} · {card.club}
                </div>
                <div className="mt-2 flex items-center justify-between text-[10px] uppercase tracking-widest text-gray-400">
                  <span>{card.rarity}</span>
                  <span>{card.serial}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold text-orange-400">${card.value.toLocaleString()}</div>
                <div className={cn('text-[10px] font-bold', card.changePct >= 0 ? 'text-emerald-400' : 'text-red-400')}>
                  {card.priceChange}
                </div>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className={cn('px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest', panelBorder, panelBg, muted)}>
                {card.edition}
              </span>
              <span className={cn('px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest', panelBorder, panelBg, muted)}>
                {card.year}
              </span>
              <button
                onClick={(event) => {
                  event.stopPropagation();
                  toggleWatchlist(card.id);
                }}
                className={cn(
                  'px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest',
                  watchlistIds.includes(card.id) ? 'bg-emerald-500 text-white' : 'bg-orange-500 text-white'
                )}
              >
                {watchlistIds.includes(card.id) ? 'Watching' : 'Add'}
              </button>
              <button
                onClick={(event) => {
                  event.stopPropagation();
                  toggleCompare(card.id);
                }}
                className={cn('px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest', panelBorder, panelBg, muted)}
              >
                {compareIds.includes(card.id) ? 'Compared' : 'Compare'}
              </button>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

const WatchlistView = ({
  isDarkMode,
  watchlistIds,
  toggleWatchlist,
}: {
  isDarkMode: boolean;
  watchlistIds: string[];
  toggleWatchlist: (id: string) => void;
}) => {
  const panelBg = isDarkMode ? 'bg-white/5' : 'bg-white';
  const panelBorder = isDarkMode ? 'border-white/10' : 'border-gray-100';
  const muted = isDarkMode ? 'text-gray-400' : 'text-gray-500';
  const [sortBy, setSortBy] = useState('Value High');
  const [filters, setFilters] = useState<string[]>([]);
  const [alertThreshold, setAlertThreshold] = useState('5');
  const [viewMode, setViewMode] = useState<'Grid' | 'List'>('Grid');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [queuedIds, setQueuedIds] = useState<string[]>([]);
  const [lastExport, setLastExport] = useState<string | null>(null);
  const [watchlistActionNote, setWatchlistActionNote] = useState<string | null>(null);
  const watchedCards = cardDatabase.filter((card) => watchlistIds.includes(card.id));

  const toggleFilter = (filter: string) => {
    setFilters((prev) => (prev.includes(filter) ? prev.filter((item) => item !== filter) : [...prev, filter]));
  };

  const filteredCards = watchedCards.filter((card) => {
    if (filters.length === 0) return true;
    return filters.every((filter) => {
      switch (filter) {
        case 'Gainers':
          return card.changePct > 0;
        case 'Losers':
          return card.changePct < 0;
        case 'High Demand':
          return ['Very High', 'High', 'Surging'].includes(card.demand);
        case 'Low Supply':
          return card.inCirculation <= 50;
        case 'Legendary+':
          return ['Legendary', 'Mythic', 'Iconic'].includes(card.rarity);
        case 'Near Alert':
          return Math.abs(card.changePct) >= Number(alertThreshold);
        default:
          return true;
      }
    });
  });

  const clearWatchlist = () => {
    watchlistIds.forEach((id) => toggleWatchlist(id));
  };
  const toggleQueue = (id: string) => {
    setQueuedIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };
  const pushWatchlistAction = (message: string) => {
    setWatchlistActionNote(message);
    emitDashboardAction(message);
  };

  const sortedCards = [...filteredCards].sort((a, b) => {
    switch (sortBy) {
      case 'Value Low':
        return a.value - b.value;
      case 'Biggest Gain':
        return b.changePct - a.changePct;
      case 'Biggest Drop':
        return a.changePct - b.changePct;
      case 'Scarcity':
        return b.scarcityScore - a.scarcityScore;
      default:
        return b.value - a.value;
    }
  });

  const sparkline = (points: number[]) => {
    const min = Math.min(...points);
    const max = Math.max(...points);
    const range = max - min || 1;
    return points
      .map((point, index) => `${index * 10},${20 - ((point - min) / range) * 20}`)
      .join(' ');
  };

  return (
    <div className="p-6 lg:p-8 flex flex-col gap-8">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Watchlist</h2>
          <p className={cn('text-sm', muted)}>Track price movement and market demand for saved cards.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className={cn('px-3 py-2 rounded-xl text-xs font-bold', panelBg, panelBorder, muted)}
          >
            {['Value High', 'Value Low', 'Biggest Gain', 'Biggest Drop', 'Scarcity'].map((option) => (
              <option key={option} value={option}>
                Sort: {option}
              </option>
            ))}
          </select>
          <button
            onClick={() => setViewMode(viewMode === 'Grid' ? 'List' : 'Grid')}
            className={cn('px-3 py-2 rounded-xl text-xs font-bold', panelBg, panelBorder, muted)}
          >
            View: {viewMode}
          </button>
          <button
            onClick={() => pushWatchlistAction('Alert rules drawer opened')}
            className={cn('px-3 py-2 rounded-xl text-xs font-bold', panelBg, panelBorder, muted)}
          >
            <Bell size={14} className="inline-block mr-2" />
            Alert Rules
          </button>
          <button
            onClick={clearWatchlist}
            className={cn('px-3 py-2 rounded-xl text-xs font-bold', panelBg, panelBorder, muted)}
          >
            Clear Watchlist
          </button>
          <button
            onClick={() => setLastExport('Just now')}
            className={cn('px-3 py-2 rounded-xl text-xs font-bold', panelBg, panelBorder, muted)}
          >
            Export
          </button>
        </div>
      </div>

      {lastExport && (
        <div className={cn('text-[10px] uppercase tracking-widest', muted)}>Exported: {lastExport}</div>
      )}

      {watchlistActionNote && (
        <div className={cn('rounded-2xl border px-4 py-3 text-[10px] font-bold uppercase tracking-widest', panelBorder, panelBg, muted)}>
          {watchlistActionNote}
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {['Gainers', 'Losers', 'High Demand', 'Low Supply', 'Legendary+', 'Near Alert'].map((filter) => (
          <button
            key={filter}
            onClick={() => toggleFilter(filter)}
            className={cn(
              'px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-colors',
              filters.includes(filter) ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20' : cn(panelBg, panelBorder, muted)
            )}
          >
            {filter}
          </button>
        ))}
        <div className={cn('flex items-center gap-2 rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest', panelBg, panelBorder, muted)}>
          Alert %
          <input
            value={alertThreshold}
            onChange={(e) => setAlertThreshold(e.target.value.replace(/[^0-9.]/g, ''))}
            className={cn('w-10 bg-transparent text-[10px] font-bold outline-none', muted)}
          />
        </div>
      </div>

      {watchedCards.length === 0 ? (
        <div className={cn('rounded-3xl border p-8 text-center', panelBorder, panelBg)}>
          <p className="text-lg font-bold">Your watchlist is empty.</p>
          <p className={cn('text-sm', muted)}>Add cards from the Card Database to start tracking.</p>
        </div>
      ) : (
        <div className={cn(viewMode === 'Grid' ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4' : 'flex flex-col gap-3')}>
          {sortedCards.map((card) => (
            <div key={card.id} className={cn('rounded-2xl border p-4', panelBorder, panelBg)}>
              <div className="flex items-start gap-4">
                <img src={card.image} alt={card.name} className="h-16 w-12 rounded-xl object-cover" />
                <div className="flex-1">
                  <div className="text-sm font-bold">{card.name}</div>
                  <div className={cn('text-[10px] uppercase tracking-widest', muted)}>
                    {card.club} · {card.year}
                  </div>
                  <div className="mt-3 flex items-center gap-3">
                    <div className="text-sm font-bold text-orange-400">${card.value.toLocaleString()}</div>
                    <div className={cn('text-[10px] font-bold', card.changePct >= 0 ? 'text-emerald-400' : 'text-red-400')}>
                      {card.priceChange}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => toggleWatchlist(card.id)}
                  className={cn('text-[10px] font-bold uppercase tracking-widest', muted)}
                >
                  Remove
                </button>
              </div>
              <div className="mt-4 flex items-center justify-between text-[10px] uppercase tracking-widest text-gray-400">
                <span>Demand {card.demand}</span>
                <span>Scarcity {card.scarcityScore}</span>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  onClick={() => setExpandedId(expandedId === card.id ? null : card.id)}
                  className={cn('px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest', panelBg, panelBorder, muted)}
                >
                  {expandedId === card.id ? 'Hide Details' : 'Details'}
                </button>
                <button
                  onClick={() => pushWatchlistAction(`Alert set for ${card.name}`)}
                  className={cn('px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest', panelBg, panelBorder, muted)}
                >
                  Set Alert
                </button>
                <button
                  onClick={() => pushWatchlistAction(`Note draft opened for ${card.name}`)}
                  className={cn('px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest', panelBg, panelBorder, muted)}
                >
                  Add Note
                </button>
                <button
                  onClick={() => toggleQueue(card.id)}
                  className={cn(
                    'px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest',
                    queuedIds.includes(card.id) ? 'bg-orange-500 text-white' : cn(panelBg, panelBorder, muted)
                  )}
                >
                  {queuedIds.includes(card.id) ? 'Queued' : 'Queue Trade'}
                </button>
              </div>
              <div className="mt-3">
                <svg width="100%" height="30" viewBox="0 0 60 20">
                  <polyline
                    fill="none"
                    stroke={card.changePct >= 0 ? '#22c55e' : '#ef4444'}
                    strokeWidth="2"
                    points={sparkline(card.spark)}
                  />
                </svg>
              </div>
              {expandedId === card.id && (
                <div className="mt-4 grid grid-cols-2 gap-3 text-[10px] uppercase tracking-widest text-gray-400">
                  <div>Edition: <span className="text-gray-200">{card.edition}</span></div>
                  <div>Year: <span className="text-gray-200">{card.year}</span></div>
                  <div>Rarity: <span className="text-gray-200">{card.rarity}</span></div>
                  <div>Serial: <span className="text-gray-200">{card.serial}</span></div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const TopCardsView = ({
  isDarkMode,
  watchlistIds,
  toggleWatchlist,
}: {
  isDarkMode: boolean;
  watchlistIds: string[];
  toggleWatchlist: (id: string) => void;
}) => {
  const panelBg = isDarkMode ? 'bg-white/5' : 'bg-white';
  const panelBorder = isDarkMode ? 'border-white/10' : 'border-gray-100';
  const muted = isDarkMode ? 'text-gray-400' : 'text-gray-500';
  const [mode, setMode] = useState<'Dashboard' | 'Single'>('Dashboard');
  const [metric, setMetric] = useState<'Value' | 'Popularity' | 'Growth' | 'Scarcity'>('Value');
  const [limit, setLimit] = useState(5);
  const [rarityFilter, setRarityFilter] = useState('All');
  const [onlyWatchlist, setOnlyWatchlist] = useState(false);

  const rarityOptions = ['All', ...Array.from(new Set(cardDatabase.map((card) => card.rarity)))];

  const filtered = cardDatabase.filter((card) => {
    if (rarityFilter !== 'All' && card.rarity !== rarityFilter) return false;
    if (onlyWatchlist && !watchlistIds.includes(card.id)) return false;
    return true;
  });

  const rankBy = (field: 'value' | 'popularity' | 'changePct' | 'scarcityScore') =>
    [...filtered].sort((a, b) => b[field] - a[field]).slice(0, limit);

  const mostExpensive = rankBy('value');
  const topGrowth = rankBy('changePct');
  const popular = rankBy('popularity');
  const mostScarce = rankBy('scarcityScore');

  const singleList = (() => {
    switch (metric) {
      case 'Popularity':
        return popular;
      case 'Growth':
        return topGrowth;
      case 'Scarcity':
        return mostScarce;
      default:
        return mostExpensive;
    }
  })();

  return (
    <div className="p-6 lg:p-8 flex flex-col gap-8">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Top Cards</h2>
          <p className={cn('text-sm', muted)}>Market-leading cards, players, and growth leaders.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setMode(mode === 'Dashboard' ? 'Single' : 'Dashboard')}
            className={cn('px-3 py-2 rounded-xl text-xs font-bold', panelBg, panelBorder, muted)}
          >
            Mode: {mode}
          </button>
          <select
            value={metric}
            onChange={(e) => setMetric(e.target.value as typeof metric)}
            className={cn('px-3 py-2 rounded-xl text-xs font-bold', panelBg, panelBorder, muted)}
          >
            {['Value', 'Popularity', 'Growth', 'Scarcity'].map((option) => (
              <option key={option} value={option}>
                Metric: {option}
              </option>
            ))}
          </select>
          <select
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
            className={cn('px-3 py-2 rounded-xl text-xs font-bold', panelBg, panelBorder, muted)}
          >
            {[5, 10, 15].map((value) => (
              <option key={value} value={value}>
                Top {value}
              </option>
            ))}
          </select>
          <select
            value={rarityFilter}
            onChange={(e) => setRarityFilter(e.target.value)}
            className={cn('px-3 py-2 rounded-xl text-xs font-bold', panelBg, panelBorder, muted)}
          >
            {rarityOptions.map((option) => (
              <option key={option} value={option}>
                Rarity: {option}
              </option>
            ))}
          </select>
          <button
            onClick={() => setOnlyWatchlist((prev) => !prev)}
            className={cn(
              'px-3 py-2 rounded-xl text-xs font-bold',
              onlyWatchlist ? 'bg-orange-500 text-white' : cn(panelBg, panelBorder, muted)
            )}
          >
            Watchlist Only
          </button>
        </div>
      </div>

      {mode === 'Dashboard' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {[
            { title: 'Most Expensive', data: mostExpensive, key: 'value' },
            { title: 'Most Popular Players', data: popular, key: 'popularity' },
            { title: 'Highest Value Growth', data: topGrowth, key: 'changePct' },
          ].map((section) => (
            <div key={section.title} className={cn('rounded-3xl border p-6', panelBorder, panelBg)}>
              <div className="flex items-center justify-between">
                <div className="text-sm font-bold">{section.title}</div>
                <Trophy size={16} className="text-orange-400" />
              </div>
              <div className="mt-4 space-y-3">
                {section.data.map((card, index) => (
                  <div key={card.id} className="flex items-center gap-3">
                    <div className="text-[10px] font-bold text-gray-400 w-6">#{index + 1}</div>
                    <img src={card.image} alt={card.name} className="h-12 w-10 rounded-lg object-cover" />
                    <div className="flex-1">
                      <div className="text-xs font-bold">{card.name}</div>
                      <div className={cn('text-[10px] uppercase tracking-widest', muted)}>{card.club}</div>
                    </div>
                    <div className="text-right text-xs font-bold text-orange-400">
                      {section.key === 'value' && `$${card.value.toLocaleString()}`}
                      {section.key === 'popularity' && `${card.popularity} pts`}
                      {section.key === 'changePct' && `${card.priceChange}`}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={cn('rounded-3xl border p-6', panelBorder, panelBg)}>
          <div className="flex items-center justify-between">
            <div className="text-sm font-bold">Leaderboard: {metric}</div>
            <Trophy size={16} className="text-orange-400" />
          </div>
          <div className="mt-4 space-y-3">
            {singleList.map((card, index) => (
              <div key={card.id} className="flex items-center gap-3">
                <div className="text-[10px] font-bold text-gray-400 w-6">#{index + 1}</div>
                <img src={card.image} alt={card.name} className="h-12 w-10 rounded-lg object-cover" />
                <div className="flex-1">
                  <div className="text-xs font-bold">{card.name}</div>
                  <div className={cn('text-[10px] uppercase tracking-widest', muted)}>{card.club}</div>
                </div>
                <div className="text-right text-xs font-bold text-orange-400">
                  {metric === 'Value' && `$${card.value.toLocaleString()}`}
                  {metric === 'Popularity' && `${card.popularity} pts`}
                  {metric === 'Growth' && `${card.priceChange}`}
                  {metric === 'Scarcity' && `${card.scarcityScore} score`}
                </div>
                <button
                  onClick={() => toggleWatchlist(card.id)}
                  className={cn(
                    'ml-2 px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest',
                    watchlistIds.includes(card.id) ? 'bg-emerald-500 text-white' : 'bg-orange-500 text-white'
                  )}
                >
                  {watchlistIds.includes(card.id) ? 'Watching' : 'Add'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const MarketActivityView = ({ isDarkMode }: { isDarkMode: boolean }) => {
  const panelBg = isDarkMode ? 'bg-white/5' : 'bg-white';
  const panelBorder = isDarkMode ? 'border-white/10' : 'border-gray-100';
  const muted = isDarkMode ? 'text-gray-400' : 'text-gray-500';
  const [activeTypes, setActiveTypes] = useState<string[]>(['Trades', 'Sales', 'Bids']);
  const [range, setRange] = useState('24H');
  const [minValue, setMinValue] = useState('');
  const [search, setSearch] = useState('');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastRefresh, setLastRefresh] = useState('Just now');

  const toggleType = (type: string) => {
    setActiveTypes((prev) => (prev.includes(type) ? prev.filter((item) => item !== type) : [...prev, type]));
  };

  const parseMoney = (value: string) => {
    const numeric = Number(value.replace(/[^0-9.]/g, ''));
    if (value.includes('M')) return numeric * 1_000_000;
    if (value.includes('K')) return numeric * 1_000;
    return numeric;
  };

  const minValueNumber = Number.parseFloat(minValue || '0');
  const filterByValue = (value: string) => {
    if (!minValueNumber) return true;
    return parseMoney(value) >= minValueNumber;
  };
  const matchesSearch = (label: string) => {
    if (!search.trim()) return true;
    return label.toLowerCase().includes(search.trim().toLowerCase());
  };

  return (
    <div className="p-6 lg:p-8 flex flex-col gap-8">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Market Activity</h2>
          <p className={cn('text-sm', muted)}>Latest trades, sales, and bids happening on the platform.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {['1H', '24H', '7D', '30D'].map((value) => (
            <button
              key={value}
              onClick={() => setRange(value)}
              className={cn(
                'px-3 py-2 rounded-xl text-xs font-bold',
                range === value ? 'bg-orange-500 text-white' : cn(panelBg, panelBorder, muted)
              )}
            >
              {value}
            </button>
          ))}
          <button
            onClick={() => {
              setLastRefresh('Just now');
              setAutoRefresh((prev) => !prev);
            }}
            className={cn('px-3 py-2 rounded-xl text-xs font-bold', panelBg, panelBorder, muted)}
          >
            {autoRefresh ? 'Auto-Refresh On' : 'Auto-Refresh Off'}
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {['Trades', 'Sales', 'Bids'].map((type) => (
          <button
            key={type}
            onClick={() => toggleType(type)}
            className={cn(
              'px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-colors',
              activeTypes.includes(type) ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20' : cn(panelBg, panelBorder, muted)
            )}
          >
            {type}
          </button>
        ))}
        <div className={cn('flex items-center gap-2 rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest', panelBg, panelBorder, muted)}>
          Min Value
          <input
            value={minValue}
            onChange={(e) => setMinValue(e.target.value.replace(/[^0-9.]/g, ''))}
            placeholder="0"
            className={cn('w-16 bg-transparent text-[10px] font-bold outline-none', muted)}
          />
        </div>
        {['100000', '500000', '1000000'].map((value) => (
          <button
            key={value}
            onClick={() => setMinValue(value)}
            className={cn('px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest', panelBg, panelBorder, muted)}
          >
            ${Number(value).toLocaleString()}+
          </button>
        ))}
        <div className={cn('flex items-center gap-2 rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest', panelBg, panelBorder, muted)}>
          <Search size={12} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search card..."
            className={cn('w-24 bg-transparent text-[10px] font-bold outline-none', muted)}
          />
        </div>
        <span className={cn('px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest', panelBg, panelBorder, muted)}>
          Updated: {lastRefresh}
        </span>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {activeTypes.includes('Trades') && (
        <div className={cn('rounded-3xl border p-6', panelBorder, panelBg)}>
          <div className="text-sm font-bold">Latest Trades</div>
          <div className="mt-4 space-y-3">
            {marketActivity.latestTrades
              .filter((trade) => filterByValue(trade.value))
              .filter((trade) => matchesSearch(trade.card))
              .map((trade) => (
              <div key={trade.id} className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold">{trade.card}</div>
                  <div className={cn('text-[10px] uppercase tracking-widest', muted)}>
                    {trade.by} · {trade.time}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-bold text-orange-400">{trade.value}</div>
                  <div className={cn('text-[10px] uppercase tracking-widest', muted)}>{trade.status}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        )}
        {activeTypes.includes('Sales') && (
        <div className={cn('rounded-3xl border p-6', panelBorder, panelBg)}>
          <div className="text-sm font-bold">Recently Sold</div>
          <div className="mt-4 space-y-3">
            {marketActivity.recentSales
              .filter((sale) => filterByValue(sale.value))
              .filter((sale) => matchesSearch(sale.card))
              .map((sale) => (
              <div key={sale.id} className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold">{sale.card}</div>
                  <div className={cn('text-[10px] uppercase tracking-widest', muted)}>
                    {sale.buyer} · {sale.time}
                  </div>
                </div>
                <div className="text-xs font-bold text-emerald-400">{sale.value}</div>
              </div>
            ))}
          </div>
        </div>
        )}
        {activeTypes.includes('Bids') && (
        <div className={cn('rounded-3xl border p-6', panelBorder, panelBg)}>
          <div className="text-sm font-bold">Highest Bids</div>
          <div className="mt-4 space-y-3">
            {marketActivity.highestBids
              .filter((bid) => filterByValue(bid.bid))
              .filter((bid) => matchesSearch(bid.card))
              .map((bid) => (
              <div key={bid.id} className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold">{bid.card}</div>
                  <div className={cn('text-[10px] uppercase tracking-widest', muted)}>
                    {bid.bidders} bidders
                  </div>
                </div>
                <div className="text-xs font-bold text-orange-400">{bid.bid}</div>
              </div>
            ))}
          </div>
        </div>
        )}
      </div>
    </div>
  );
};

const CollectionsView = ({ isDarkMode }: { isDarkMode: boolean }) => {
  const panelBg = isDarkMode ? 'bg-white/5' : 'bg-white';
  const panelBorder = isDarkMode ? 'border-white/10' : 'border-gray-100';
  const muted = isDarkMode ? 'text-gray-400' : 'text-gray-500';
  const [showCompleted, setShowCompleted] = useState(true);
  const [showMissing, setShowMissing] = useState(true);
  const [sortBy, setSortBy] = useState('Progress');
  const [trackedSets, setTrackedSets] = useState<string[]>(['set-legends']);
  const [search, setSearch] = useState('');
  const [nearCompletionOnly, setNearCompletionOnly] = useState(false);
  const [selectedSetId, setSelectedSetId] = useState<string | null>(null);
  const [collectionActionNote, setCollectionActionNote] = useState<string | null>(null);
  const detailsRef = useRef<HTMLDivElement | null>(null);

  const toggleTracked = (id: string) => {
    setTrackedSets((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  const filteredSets = collectionSets.filter((set) => {
    if (!showCompleted && set.owned === set.total) return false;
    if (search.trim() && !set.name.toLowerCase().includes(search.trim().toLowerCase())) return false;
    if (nearCompletionOnly && set.owned / set.total < 0.7) return false;
    return true;
  });

  const sortedSets = [...filteredSets].sort((a, b) => {
    const progressA = a.owned / a.total;
    const progressB = b.owned / b.total;
    if (sortBy === 'Name') return a.name.localeCompare(b.name);
    if (sortBy === 'Missing') return b.total - b.owned - (a.total - a.owned);
    return progressB - progressA;
  });

  const selectedSet = collectionSets.find((set) => set.id === selectedSetId) ?? null;
  const pushCollectionAction = (message: string) => {
    setCollectionActionNote(message);
    emitDashboardAction(message);
  };
  const rarityCycle = ['Common', 'Rare', 'Ultra Rare', 'Legendary'];
  const buildSetCards = (set: (typeof collectionSets)[number]) => {
    const ownedCount = Math.min(set.owned, set.total);
    const missingCount = Math.max(set.total - ownedCount, 0);
    const baseName = set.name.replace(' Edition', '');
    const ownedNames = Array.from({ length: ownedCount }, (_, index) => `${baseName} Card ${index + 1}`);
    const missingNames = [...set.missing];
    while (missingNames.length < missingCount) {
      missingNames.push(`${baseName} Slot ${missingNames.length + 1}`);
    }
    const ownedCards = ownedNames.map((name, index) => ({
      name,
      status: 'Owned',
      rarity: rarityCycle[index % rarityCycle.length],
      serial: `#${String(index + 1).padStart(2, '0')}/${set.total}`,
      value: `$${(120 + index * 15).toLocaleString()}`,
    }));
    const missingCards = missingNames.slice(0, missingCount).map((name, index) => ({
      name,
      status: 'Missing',
      rarity: rarityCycle[(index + 1) % rarityCycle.length],
      serial: `#${String(ownedCount + index + 1).padStart(2, '0')}/${set.total}`,
      value: `~$${(90 + index * 12).toLocaleString()}`,
    }));
    return [...ownedCards, ...missingCards];
  };

  useEffect(() => {
    if (selectedSetId && detailsRef.current) {
      detailsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [selectedSetId]);

  return (
    <div className="p-6 lg:p-8 flex flex-col gap-8">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Collections</h2>
          <p className={cn('text-sm', muted)}>Track set completion and missing cards.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className={cn('flex items-center gap-2 rounded-xl border px-3 py-2', panelBorder, panelBg)}>
            <Search size={14} className={muted} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search sets..."
              className={cn('bg-transparent text-xs font-bold outline-none', muted)}
            />
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className={cn('px-3 py-2 rounded-xl text-xs font-bold', panelBg, panelBorder, muted)}
          >
            {['Progress', 'Name', 'Missing'].map((option) => (
              <option key={option} value={option}>
                Sort: {option}
              </option>
            ))}
          </select>
          <button
            onClick={() => setShowCompleted((prev) => !prev)}
            className={cn('px-3 py-2 rounded-xl text-xs font-bold', showCompleted ? 'bg-orange-500 text-white' : cn(panelBg, panelBorder, muted))}
          >
            Show Completed
          </button>
          <button
            onClick={() => setShowMissing((prev) => !prev)}
            className={cn('px-3 py-2 rounded-xl text-xs font-bold', showMissing ? 'bg-orange-500 text-white' : cn(panelBg, panelBorder, muted))}
          >
            Show Missing
          </button>
          <button
            onClick={() => setNearCompletionOnly((prev) => !prev)}
            className={cn('px-3 py-2 rounded-xl text-xs font-bold', nearCompletionOnly ? 'bg-orange-500 text-white' : cn(panelBg, panelBorder, muted))}
          >
            Near Completion
          </button>
        </div>
      </div>
      {collectionActionNote && (
        <div className={cn('rounded-2xl border px-4 py-3 text-[10px] font-bold uppercase tracking-widest', panelBorder, panelBg, muted)}>
          {collectionActionNote}
        </div>
      )}
      {selectedSet && (
        <div ref={detailsRef} className={cn('rounded-3xl border p-6', panelBorder, panelBg)}>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-lg font-bold">{selectedSet.name} Cards</div>
              <div className={cn('text-[10px] uppercase tracking-widest', muted)}>
                {selectedSet.total} total · {selectedSet.owned} owned · {selectedSet.total - selectedSet.owned} missing
              </div>
            </div>
            <button
              onClick={() => setSelectedSetId(null)}
              className={cn('px-3 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest', panelBg, panelBorder, muted)}
            >
              Close
            </button>
          </div>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {buildSetCards(selectedSet)
              .filter((card) => (showMissing ? true : card.status === 'Owned'))
              .map((card) => (
                <div key={`${selectedSet.id}-${card.name}`} className={cn('rounded-2xl border p-4', panelBorder, panelBg)}>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-sm font-bold">{card.name}</div>
                      <div className={cn('text-[10px] uppercase tracking-widest', muted)}>
                        {card.rarity} · {card.serial}
                      </div>
                    </div>
                    <span
                      className={cn(
                        'px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest',
                        card.status === 'Owned' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-orange-500/20 text-orange-300'
                      )}
                    >
                      {card.status}
                    </span>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-xs">
                    <span className={muted}>Estimated Value</span>
                    <span className="font-bold text-orange-400">{card.value}</span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      onClick={() => pushCollectionAction(`${card.name} detail opened`)}
                      className={cn('px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest', panelBg, panelBorder, muted)}
                    >
                      View Card
                    </button>
                    <button
                      onClick={() => pushCollectionAction(`Note draft opened for ${card.name}`)}
                      className={cn('px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest', panelBg, panelBorder, muted)}
                    >
                      Add Note
                    </button>
                    {card.status === 'Missing' && (
                      <button
                        onClick={() => pushCollectionAction(`Marketplace search opened for ${card.name}`)}
                        className="px-2 py-1 rounded-lg bg-orange-500 text-[10px] font-bold uppercase tracking-widest text-white"
                      >
                        Find Card
                      </button>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {sortedSets.map((set) => {
          const percent = Math.round((set.owned / set.total) * 100);
          return (
            <div key={set.id} className={cn('rounded-3xl border p-6', panelBorder, panelBg)}>
              <div className="text-sm font-bold">{set.name}</div>
              <div className={cn('text-[10px] uppercase tracking-widest', muted)}>{set.theme}</div>
              <div className="mt-4">
                <div className="flex items-center justify-between text-xs">
                  <span className={muted}>
                    {set.owned}/{set.total} collected
                  </span>
                  <span className="font-bold">{percent}%</span>
                </div>
                <div className="mt-2 h-2 rounded-full bg-white/10">
                  <div className="h-2 rounded-full bg-orange-500" style={{ width: `${percent}%` }} />
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <div className={cn('text-[10px] uppercase tracking-widest', muted)}>Missing Cards</div>
                {showMissing && (
                  <div className="flex flex-wrap gap-2">
                    {set.missing.slice(0, 4).map((missing) => (
                      <span key={missing} className={cn('px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest', panelBorder, panelBg, muted)}>
                        {missing}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedSetId(set.id)}
                  className="flex-1 px-3 py-2 rounded-xl bg-orange-500 text-[10px] font-bold uppercase tracking-widest text-white"
                >
                  View Set
                </button>
                <button
                  onClick={() => toggleTracked(set.id)}
                  className={cn('px-3 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest', panelBg, panelBorder, muted)}
                >
                  {trackedSets.includes(set.id) ? 'Tracking' : 'Track Set'}
                </button>
                <button
                  onClick={() => pushCollectionAction(`Missing card list opened for ${set.name}`)}
                  className={cn('px-3 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest', panelBg, panelBorder, muted)}
                >
                  Add Missing
                </button>
                <button
                  onClick={() => pushCollectionAction(`${set.name} collection shared`)}
                  className={cn('px-3 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest', panelBg, panelBorder, muted)}
                >
                  Share
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const RarityIndexView = ({ isDarkMode }: { isDarkMode: boolean }) => {
  const panelBg = isDarkMode ? 'bg-white/5' : 'bg-white';
  const panelBorder = isDarkMode ? 'border-white/10' : 'border-gray-100';
  const muted = isDarkMode ? 'text-gray-400' : 'text-gray-500';
  const [tierFilters, setTierFilters] = useState<string[]>(['Legendary', 'Ultra Rare', 'Rare', 'Common']);
  const [sortBy, setSortBy] = useState('Scarcity');
  const [showLowPop, setShowLowPop] = useState(false);
  const [search, setSearch] = useState('');
  const rareCards = [...cardDatabase]
    .filter((card) => {
      if (showLowPop && card.inCirculation > 50) return false;
      if (search.trim() && !card.name.toLowerCase().includes(search.trim().toLowerCase())) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'Supply') return a.inCirculation - b.inCirculation;
      if (sortBy === 'Value') return b.value - a.value;
      return b.scarcityScore - a.scarcityScore;
    })
    .slice(0, 8);

  const toggleTier = (tier: string) => {
    setTierFilters((prev) => (prev.includes(tier) ? prev.filter((item) => item !== tier) : [...prev, tier]));
  };

  return (
    <div className="p-6 lg:p-8 flex flex-col gap-8">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Rarity Index</h2>
          <p className={cn('text-sm', muted)}>Scarcity tiers and most limited cards in circulation.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className={cn('flex items-center gap-2 rounded-xl border px-3 py-2', panelBorder, panelBg)}>
            <Search size={14} className={muted} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search cards..."
              className={cn('bg-transparent text-xs font-bold outline-none', muted)}
            />
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className={cn('px-3 py-2 rounded-xl text-xs font-bold', panelBg, panelBorder, muted)}
          >
            {['Scarcity', 'Supply', 'Value'].map((option) => (
              <option key={option} value={option}>
                Sort: {option}
              </option>
            ))}
          </select>
          <button
            onClick={() => setShowLowPop((prev) => !prev)}
            className={cn('px-3 py-2 rounded-xl text-xs font-bold', showLowPop ? 'bg-orange-500 text-white' : cn(panelBg, panelBorder, muted))}
          >
            Low Pop Only
          </button>
          <button
            onClick={() => {
              setTierFilters(['Legendary', 'Ultra Rare', 'Rare', 'Common']);
              setSearch('');
              setShowLowPop(false);
              setSortBy('Scarcity');
            }}
            className={cn('px-3 py-2 rounded-xl text-xs font-bold', panelBg, panelBorder, muted)}
          >
            Reset Filters
          </button>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {rarityTiers.map((tier) => (
          <button
            key={tier.tier}
            onClick={() => toggleTier(tier.tier)}
            className={cn(
              'px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-colors',
              tierFilters.includes(tier.tier) ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20' : cn(panelBg, panelBorder, muted)
            )}
          >
            {tier.tier}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className={cn('rounded-3xl border p-6', panelBorder, panelBg)}>
          <div className="text-sm font-bold">Rarity Tiers</div>
          <div className="mt-4 space-y-3">
            {rarityTiers.map((tier) => (
              <div key={tier.tier} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className={cn('h-3 w-3 rounded-full', tier.color)} />
                  <div>
                    <div className="text-xs font-bold">{tier.tier}</div>
                    <div className={cn('text-[10px] uppercase tracking-widest', muted)}>
                      Scarcity {tier.score} · Supply {tier.supply}
                    </div>
                  </div>
                </div>
                <div className="text-xs font-bold">{tier.count}</div>
              </div>
            ))}
          </div>
        </div>
        <div className={cn('rounded-3xl border p-6', panelBorder, panelBg)}>
          <div className="text-sm font-bold">Most Scarce Cards</div>
          <div className="mt-4 space-y-3">
            {rareCards
              .filter((card) => {
                if (tierFilters.length === 0) return true;
                if (tierFilters.includes('Legendary') && ['Legendary', 'Mythic', 'Iconic'].includes(card.rarity)) return true;
                if (tierFilters.includes('Ultra Rare') && card.rarity === 'Epic') return true;
                if (tierFilters.includes('Rare') && card.rarity === 'Rare') return true;
                if (tierFilters.includes('Common') && card.rarity === 'Common') return true;
                return false;
              })
              .map((card) => (
              <div key={card.id} className="flex items-center gap-3">
                <img src={card.image} alt={card.name} className="h-12 w-10 rounded-lg object-cover" />
                <div className="flex-1">
                  <div className="text-xs font-bold">{card.name}</div>
                  <div className={cn('text-[10px] uppercase tracking-widest', muted)}>
                    {card.serial} · {card.rarity}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-bold text-orange-400">{card.scarcityScore}</div>
                  <div className={cn('text-[10px] uppercase tracking-widest', muted)}>Score</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
// --- Main Dashboard Views ---

const RealtimeOverview = ({ isDarkMode }: { isDarkMode: boolean }) => {
  const [activeTab, setActiveTab] = useState('Realtime Overview');
  const [expandedLeadIndex, setExpandedLeadIndex] = useState<number | null>(null);
  const [activeRange, setActiveRange] = useState<'Days' | 'Weeks' | 'Months' | 'Years'>('Months');
  const [activeDatePreset, setActiveDatePreset] = useState('Last 30 days');
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');
  const [topRangeOpen, setTopRangeOpen] = useState(false);
  const [chartRangeOpen, setChartRangeOpen] = useState(false);
  const [overviewActionNote, setOverviewActionNote] = useState<string | null>(null);

  useEffect(() => {
    setExpandedLeadIndex(null);
  }, [activeRange, activeDatePreset, customStart, customEnd]);

  const miniMetrics = [
    { title: 'Messi', subtitle: 'Barca', value: '$20M', change: '+12%', trend: 'up', color: '#22c55e' },
    { title: 'Isak', subtitle: 'LFC', value: '$12M', change: '+5%', trend: 'up', color: '#10b981' },
    { title: 'Ronaldo', subtitle: 'Real', value: '$7.1M', change: '+2%', trend: 'up', color: '#22c55e' },
    { title: 'Ronaldo', subtitle: 'Brazil', value: '$15M', change: '+8%', trend: 'up', color: '#22c55e' },
    { title: 'Neymar', subtitle: 'Brazil', value: '$13M', change: '+4%', trend: 'up', color: '#22c55e' },
    { title: 'Pele', subtitle: 'Brazil', value: '$30M', change: '+10%', trend: 'up', color: '#22c55e' },
    { title: 'Expenses', subtitle: 'Monthly', value: '$884', change: '-2%', trend: 'down', color: '#ef4444' },
    { title: 'CTR', subtitle: 'Avg', value: '2.5%', change: '-0.2%', trend: 'down', color: '#ef4444' },
    { title: 'CPA', subtitle: 'Avg', value: '$5.41', change: '+0.34', trend: 'up', color: '#f97316' },
  ];

  const trendSeries = [
    { key: 'Isak - Liverpool Edition', label: 'Isak - LFC', color: '#ef4444' },
    { key: 'Messi - Barcelona Edition', label: 'Messi - Barca', color: '#f97316' },
    { key: 'Ronaldo - Real Edition', label: 'Ronaldo - Real', color: '#60a5fa' },
    { key: 'Ronaldo - Brazil Edition', label: 'Ronaldo - Brazil', color: '#facc15' },
    { key: 'Neymar - Brazil Edition', label: 'Neymar - Brazil', color: '#22c55e' },
    { key: 'Pele - Brazil Edition', label: 'Pele - Brazil', color: '#38bdf8' },
  ];

  const rangeOptions = [
    { id: 'Days', label: 'Days', badge: '7D', data: trendDataDays, changeScale: 0.4 },
    { id: 'Weeks', label: 'Weeks', badge: '6W', data: trendDataWeeks, changeScale: 0.7 },
    { id: 'Months', label: 'Months', badge: '6M', data: trendDataMonths, changeScale: 1 },
    { id: 'Years', label: 'Years', badge: '7Y', data: trendDataYears, changeScale: 1.3 },
  ];
  const datePresets = ['Today', 'Last 7 days', 'Last 30 days', 'Last 90 days', 'Year to date', 'Custom'];
  const activeRangeConfig = rangeOptions.find((option) => option.id === activeRange) ?? rangeOptions[2];
  const rangeData = activeRangeConfig.data;
  const rangeBadge = activeRangeConfig.badge;
  const changeScale = activeRangeConfig.changeScale;

  const overviewTabs = ['Realtime Overview', 'Day on Day', 'Week on Week', 'SQR', 'Keyword Performance'];
  const sparkUp = '0,18 10,12 20,15 30,8 40,10 50,4';
  const sparkDown = '0,4 10,10 20,8 30,14 40,12 50,18';
  const tableHeaderClass = cn(
    'text-[10px] uppercase tracking-widest border-t',
    isDarkMode ? 'text-gray-500 border-white/5' : 'text-gray-400 border-gray-100'
  );
  const tableDividerClass = isDarkMode ? 'divide-white/5' : 'divide-gray-100';
  const tableRowHoverClass = isDarkMode ? 'hover:bg-white/5' : 'hover:bg-gray-50';
  const tableStrongText = isDarkMode ? 'text-gray-200' : 'text-gray-700';
  const tableSubtleText = isDarkMode ? 'text-gray-400' : 'text-gray-500';
  const detailPanelBg = isDarkMode ? 'bg-white/5' : 'bg-gray-50';
  const detailBorder = isDarkMode ? 'border-white/10' : 'border-gray-200';

  const toggleTopMenu = () => {
    setTopRangeOpen((prev) => !prev);
    setChartRangeOpen(false);
  };
  const toggleChartMenu = () => {
    setChartRangeOpen((prev) => !prev);
    setTopRangeOpen(false);
  };
  const handleRangeSelect = (range: 'Days' | 'Weeks' | 'Months' | 'Years') => {
    setActiveRange(range);
    setTopRangeOpen(false);
    setChartRangeOpen(false);
  };
  const handlePresetSelect = (preset: string) => {
    setActiveDatePreset(preset);
    if (preset !== 'Custom') {
      setTopRangeOpen(false);
      setChartRangeOpen(false);
    }
  };
  const pushOverviewAction = (message: string) => {
    setOverviewActionNote(message);
    emitDashboardAction(message);
  };

  const resolveDateRange = () => {
    const now = Date.now();
    if (activeDatePreset === 'Today') {
      const start = new Date();
      start.setHours(0, 0, 0, 0);
      return { start: start.getTime(), end: now };
    }
    if (activeDatePreset === 'Last 7 days') {
      return { start: now - dayMs * 7, end: now };
    }
    if (activeDatePreset === 'Last 30 days') {
      return { start: now - dayMs * 30, end: now };
    }
    if (activeDatePreset === 'Last 90 days') {
      return { start: now - dayMs * 90, end: now };
    }
    if (activeDatePreset === 'Year to date') {
      const start = new Date(new Date().getFullYear(), 0, 1);
      return { start: start.getTime(), end: now };
    }
    if (activeDatePreset === 'Custom' && customStart && customEnd) {
      const start = new Date(customStart);
      const end = new Date(customEnd);
      if (!Number.isNaN(start.getTime()) && !Number.isNaN(end.getTime())) {
        return { start: start.getTime(), end: end.getTime() + dayMs - 1 };
      }
    }
    return null;
  };

  const activeDateLabel =
    activeDatePreset === 'Custom' && customStart && customEnd
      ? `${customStart} to ${customEnd}`
      : activeDatePreset;
  const dateRange = resolveDateRange();
  const filteredLeads = dateRange
    ? leads.filter((lead) => lead.timestamp >= dateRange.start && lead.timestamp <= dateRange.end)
    : leads;
  const visibleLeads = filteredLeads.slice(0, 6);

  const parseCurrency = (value: string) => {
    const numeric = Number.parseFloat(value.replace(/[$,]/g, ''));
    return Number.isFinite(numeric) ? numeric : 0;
  };
  const formatCurrency = (value: number) => `$${Math.round(value).toLocaleString()}`;
  const formatChange = (value: string) => {
    const trimmed = value.trim();
    const isPercent = trimmed.includes('%');
    const numeric = Number.parseFloat(trimmed.replace(/[%+]/g, ''));
    if (!Number.isFinite(numeric)) {
      return value;
    }
    const sign = trimmed.startsWith('-') ? -1 : 1;
    const scaled = Math.abs(numeric) * changeScale;
    const decimals = isPercent ? 1 : 2;
    return `${sign < 0 ? '-' : '+'}${scaled.toFixed(decimals)}${isPercent ? '%' : ''}`;
  };
  const renderRangeMenu = (isOpen: boolean, onToggle: () => void, align: 'left' | 'right' = 'right') => (
    <div className="relative">
      <button
        onClick={onToggle}
        className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest px-3 py-2 rounded-xl border border-white/10 bg-white/5 text-gray-300 hover:text-white transition-colors"
      >
        {activeRangeConfig.label}
        <ChevronDown size={14} className={cn('transition-transform', isOpen && 'rotate-180')} />
      </button>
      {isOpen && (
        <div
          className={cn(
            'absolute mt-2 w-64 rounded-2xl border p-4 shadow-xl z-20',
            align === 'right' ? 'right-0' : 'left-0',
            isDarkMode ? 'bg-[#0b0b0b] border-white/10' : 'bg-white border-gray-200'
          )}
        >
          <div className={cn('text-[10px] uppercase tracking-widest', tableSubtleText)}>Range Mode</div>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {rangeOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => handleRangeSelect(option.id as 'Days' | 'Weeks' | 'Months' | 'Years')}
                className={cn(
                  'px-3 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-colors',
                  activeRange === option.id
                    ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20'
                    : cn(isDarkMode ? 'bg-white/5 border border-white/10 text-gray-300' : 'bg-gray-50 border border-gray-200 text-gray-600')
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
          <div className={cn('mt-4 text-[10px] uppercase tracking-widest', tableSubtleText)}>Date Preset</div>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {datePresets.map((preset) => (
              <button
                key={preset}
                onClick={() => handlePresetSelect(preset)}
                className={cn(
                  'px-3 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-colors',
                  activeDatePreset === preset
                    ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20'
                    : cn(isDarkMode ? 'bg-white/5 border border-white/10 text-gray-300' : 'bg-gray-50 border border-gray-200 text-gray-600')
                )}
              >
                {preset}
              </button>
            ))}
          </div>
          {activeDatePreset === 'Custom' && (
            <div className="mt-3 grid grid-cols-2 gap-2">
              <input
                type="date"
                value={customStart}
                onChange={(event) => {
                  setCustomStart(event.target.value);
                  setActiveDatePreset('Custom');
                }}
                className={cn(
                  'w-full rounded-xl border px-2 py-1.5 text-[10px] font-bold uppercase tracking-widest',
                  isDarkMode ? 'bg-white/5 border-white/10 text-gray-200' : 'bg-gray-50 border-gray-200 text-gray-600'
                )}
              />
              <input
                type="date"
                value={customEnd}
                onChange={(event) => {
                  setCustomEnd(event.target.value);
                  setActiveDatePreset('Custom');
                }}
                className={cn(
                  'w-full rounded-xl border px-2 py-1.5 text-[10px] font-bold uppercase tracking-widest',
                  isDarkMode ? 'bg-white/5 border-white/10 text-gray-200' : 'bg-gray-50 border-gray-200 text-gray-600'
                )}
              />
            </div>
          )}
          <div className={cn('mt-3 text-[10px] uppercase tracking-widest', tableSubtleText)}>
            Active: {activeDateLabel}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="p-6 lg:p-8 flex flex-col gap-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-bold tracking-tight">Cards Realtime Overview</h2>
          <p className={cn("text-sm", isDarkMode ? "text-gray-400" : "text-gray-500")}>
            Live performance across key card assets and marketing signals.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {renderRangeMenu(topRangeOpen, toggleTopMenu)}
          <span
            className={cn(
              'px-3 py-2 rounded-xl border text-[10px] font-bold uppercase tracking-widest',
              isDarkMode ? 'border-white/10 bg-white/5 text-gray-300' : 'border-gray-200 bg-white text-gray-600'
            )}
          >
            {activeDateLabel}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 xl:grid-cols-9 gap-3">
        {miniMetrics.map((item) => {
          const scaledChange = formatChange(item.change);
          return (
            <div
              key={item.title + item.subtitle}
              className={cn(
                "rounded-2xl border p-3 flex flex-col gap-2 transition-all",
                isDarkMode ? "bg-white/5 border-white/10" : "bg-white border-gray-100 shadow-sm"
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-gray-400">{item.title}</div>
                  <div className="text-[10px] uppercase tracking-widest text-gray-500">{item.subtitle}</div>
                </div>
                <svg width="52" height="22" viewBox="0 0 50 22">
                  <polyline
                    fill="none"
                    stroke={item.color}
                    strokeWidth="2"
                    points={item.trend === 'up' ? sparkUp : sparkDown}
                  />
                </svg>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-sm font-bold">{item.value}</span>
                <span className={cn("text-[10px] font-bold", item.trend === 'up' ? "text-emerald-400" : "text-red-400")}>
                  {scaledChange}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {overviewActionNote && (
        <div className={cn('rounded-2xl border px-4 py-3 text-[10px] font-bold uppercase tracking-widest', detailBorder, detailPanelBg, tableSubtleText)}>
          {overviewActionNote}
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className={cn("xl:col-span-2 rounded-3xl border p-6", isDarkMode ? "bg-white/5 border-white/10" : "bg-white border-gray-100 shadow-sm")}>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col gap-2">
              <div className="text-sm font-bold">Trends</div>
              <div className="flex flex-wrap gap-3 text-[10px] uppercase tracking-widest text-gray-400">
                {trendSeries.map((series) => (
                  <div key={series.key} className="flex items-center gap-2">
                    <span className="inline-flex h-2 w-2 rounded-full" style={{ backgroundColor: series.color }} />
                    <span>{series.label}</span>
                  </div>
                ))}
              </div>
            </div>
            {renderRangeMenu(chartRangeOpen, toggleChartMenu)}
          </div>
          <div className="h-[340px] mt-6">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={rangeData}>
                <CartesianGrid strokeDasharray="3 3" vertical={true} stroke={isDarkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"} />
                <XAxis dataKey="name" axisLine={true} tickLine={true} tick={{ fontSize: 10, fill: '#9ca3af' }} />
                <YAxis axisLine={true} tickLine={true} tick={{ fontSize: 10, fill: '#9ca3af' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: isDarkMode ? '#111' : '#fff', border: 'none', borderRadius: '12px' }}
                />
                {trendSeries.map((series) => (
                  <Line key={series.key} type="monotone" dataKey={series.key} stroke={series.color} strokeWidth={2.5} dot={false} />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className={cn("rounded-3xl border p-6", isDarkMode ? "bg-white/5 border-white/10" : "bg-white border-gray-100 shadow-sm")}>
            <div className="flex items-start justify-between">
              <div>
                <div className="text-xs font-bold uppercase tracking-widest text-gray-400">Instagram</div>
                <div className="mt-4 text-[10px] uppercase tracking-widest text-gray-400">Followers</div>
                <div className="text-xl font-bold">
                  135,145 <span className="text-emerald-400 text-xs font-bold">+16</span>
                </div>
              </div>
              <div className="relative h-14 w-14">
                <div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: 'conic-gradient(#f97316 0 70%, rgba(255,255,255,0.08) 70% 100%)',
                  }}
                />
                <div
                  className="absolute inset-2 rounded-full flex items-center justify-center text-[10px] font-bold text-gray-300"
                  style={{ backgroundColor: isDarkMode ? '#0a0a0a' : '#ffffff' }}
                >
                  {rangeBadge}
                </div>
              </div>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-4 text-xs">
              <div>
                <div className="text-[10px] uppercase tracking-widest text-gray-400">Likes</div>
                <div className="mt-1 font-bold">697</div>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-widest text-gray-400">Comments</div>
                <div className="mt-1 font-bold">22</div>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-widest text-gray-400">Saves</div>
                <div className="mt-1 font-bold">566</div>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-widest text-gray-400">Shares</div>
                <div className="mt-1 font-bold">71</div>
              </div>
            </div>
            <div className="mt-6">
              <div className="text-[10px] uppercase tracking-widest text-gray-400">Top Posts</div>
              <div className="mt-3 flex gap-3">
                {['/seed/post1', '/seed/post2', '/seed/post3', '/seed/post4'].map((seed) => (
                  <img
                    key={seed}
                    src={`https://picsum.photos${seed}/64/64`}
                    alt="Post"
                    className="h-12 w-12 rounded-xl object-cover"
                    referrerPolicy="no-referrer"
                  />
                ))}
              </div>
            </div>
          </div>

          <div className={cn("rounded-3xl border p-6", isDarkMode ? "bg-white/5 border-white/10" : "bg-white border-gray-100 shadow-sm")}>
            <div className="flex items-start justify-between">
              <div>
                <div className="text-xs font-bold uppercase tracking-widest text-gray-400">X.com</div>
                <div className="mt-4 text-[10px] uppercase tracking-widest text-gray-400">Followers</div>
                <div className="text-xl font-bold">
                  45,015 <span className="text-emerald-400 text-xs font-bold">+7</span>
                </div>
              </div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{rangeBadge}</div>
            </div>
            <div className="mt-6 h-20">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={xComData}>
                  <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                    {xComData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 4 ? '#60a5fa' : 'rgba(255,255,255,0.12)'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-6 space-y-2 text-[10px] uppercase tracking-widest text-gray-400">
              <div className="flex items-center justify-between">
                <span>Impressions</span>
                <span className="text-red-400 font-bold">933 -57%</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Engagement Rate</span>
                <span className="text-emerald-400 font-bold">15.8% +82%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={cn("rounded-3xl border overflow-hidden", isDarkMode ? "bg-white/5 border-white/10" : "bg-white border-gray-100 shadow-sm")}>
        <div className="flex items-center justify-between px-6 pt-5">
          <div className="flex flex-wrap gap-4 text-[11px] font-bold uppercase tracking-widest text-gray-400">
            {overviewTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "pb-3 border-b-2 transition-colors",
                  activeTab === tab ? "text-white border-orange-500" : "border-transparent hover:text-gray-200"
                )}
              >
                {tab}
              </button>
            ))}
          </div>
          <button
            onClick={() => pushOverviewAction(`Overview layout synced to ${activeTab}`)}
            className="h-9 w-9 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
          >
            <LayoutGrid size={16} />
          </button>
        </div>
        <div className="overflow-x-auto">
          {activeTab === 'Day on Day' ? (
            <table className="w-full text-left text-xs">
              <thead className={tableHeaderClass}>
                <tr>
                  <th className="px-6 py-4">Asset Name</th>
                  <th className="px-6 py-4">Current Value</th>
                  <th className="px-6 py-4">24h Change</th>
                  <th className="px-6 py-4">Volume</th>
                  <th className="px-6 py-4">Market Cap</th>
                  <th className="px-6 py-4">Trend</th>
                </tr>
              </thead>
              <tbody className={cn('divide-y', tableDividerClass)}>
                {dayOnDayData.map((item) => (
                  <tr key={item.id} className={cn('transition-colors', tableRowHoverClass)}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-500">
                          <Database size={16} />
                        </div>
                        <span className="text-sm font-bold">{item.name}</span>
                      </div>
                    </td>
                    <td className={cn('px-6 py-4 text-sm font-medium', tableStrongText)}>
                      ${item.currentValue.toLocaleString()}
                    </td>
                    <td className={cn('px-6 py-4 text-sm font-bold', item.trend === 'up' ? 'text-emerald-500' : 'text-red-500')}>
                      {item.change}
                    </td>
                    <td className={cn('px-6 py-4 text-sm', tableSubtleText)}>
                      ${item.volume.toLocaleString()}
                    </td>
                    <td className={cn('px-6 py-4 text-sm', tableSubtleText)}>
                      ${item.marketCap.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <div
                        className={cn(
                          'w-12 h-6 rounded-full flex items-center justify-center',
                          item.trend === 'up' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'
                        )}
                      >
                        {item.trend === 'up' ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <table className="w-full text-left text-xs">
              <thead className={tableHeaderClass}>
                <tr>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Username</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Card Link</th>
                  <th className="px-6 py-4">Card Type</th>
                  <th className="px-6 py-4">Country</th>
                  <th className="px-6 py-4" />
                </tr>
              </thead>
              <tbody className={cn('divide-y', tableDividerClass)}>
                {visibleLeads.length === 0 ? (
                  <tr>
                    <td colSpan={7} className={cn('px-6 py-8 text-center text-sm', tableSubtleText)}>
                      No activity found for {activeDateLabel}. Try a different date preset.
                    </td>
                  </tr>
                ) : (
                  visibleLeads.map((lead, i) => {
                    const isExpanded = expandedLeadIndex === i;
                    const salePrice = parseCurrency(lead.price);
                    const platformFee = salePrice * 0.025;
                    const netSettlement = salePrice - platformFee;
                    const trendPositive = lead.marketTrend?.startsWith('+');

                    return (
                      <React.Fragment key={i}>
                        <tr
                          className={cn('transition-colors cursor-pointer', tableRowHoverClass)}
                          onClick={() => setExpandedLeadIndex(isExpanded ? null : i)}
                        >
                          <td className={cn('px-6 py-4', tableSubtleText)}>{lead.date}</td>
                          <td className="px-6 py-4 text-sm font-bold">{lead.username}</td>
                          <td className={cn('px-6 py-4', tableSubtleText)}>{lead.email}</td>
                          <td className="px-6 py-4 text-orange-400 underline decoration-white/10">{lead.cardLink}</td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center rounded-full bg-orange-500/10 px-2 py-1 text-[10px] font-bold text-orange-400">
                              {lead.cardType}
                            </span>
                          </td>
                          <td className={cn('px-6 py-4', tableSubtleText)}>{lead.country}</td>
                          <td className={cn('px-6 py-4 text-right', tableSubtleText)}>
                            <ChevronDown size={14} className={cn('transition-transform', isExpanded && 'rotate-180')} />
                          </td>
                        </tr>
                        {isExpanded && (
                          <tr className={cn('border-t', detailBorder)}>
                            <td colSpan={7} className="px-6 pb-6 pt-4">
                              <div className={cn('rounded-2xl border p-5', detailBorder, detailPanelBg)}>
                                <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.2fr_1.2fr_0.6fr]">
                                  <div className="space-y-4">
                                    <div className="text-[10px] uppercase tracking-widest text-gray-400">Card Attributes</div>
                                    <div className="flex flex-wrap gap-2">
                                      <span className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest">
                                        {lead.rarity}
                                      </span>
                                      <span className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest">
                                        {lead.condition}
                                      </span>
                                      <span className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest">
                                        {lead.serial}
                                      </span>
                                    </div>

                                    <div className="space-y-2 text-xs">
                                      <div className="text-[10px] uppercase tracking-widest text-gray-400">Previous Owner</div>
                                      <div className="flex items-center gap-2 font-bold text-orange-400">
                                        <Users size={14} />
                                        @{lead.prevOwner}
                                      </div>
                                    </div>

                                    <div className="space-y-2 text-xs">
                                      <div className="text-[10px] uppercase tracking-widest text-gray-400">Market Trend</div>
                                      <div className={cn('font-bold', trendPositive ? 'text-emerald-400' : 'text-red-400')}>
                                        {lead.marketTrend}
                                      </div>
                                    </div>

                                    <div className="flex flex-wrap gap-3 pt-2">
                                      <button
                                        onClick={() => pushOverviewAction(`Card details opened for ${lead.cardLink}`)}
                                        className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-orange-600"
                                      >
                                        View Card Details
                                        <ExternalLink size={14} />
                                      </button>
                                      <button
                                        onClick={() => pushOverviewAction(`Transaction history opened for ${lead.cardLink}`)}
                                        className={cn('inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold', detailPanelBg, 'border', detailBorder)}
                                      >
                                        Transaction History
                                      </button>
                                    </div>
                                  </div>

                                  <div className="space-y-4">
                                    <div className="text-[10px] uppercase tracking-widest text-gray-400">Transaction Summary</div>
                                    <div className={cn('rounded-xl border p-4 text-xs', detailBorder, detailPanelBg)}>
                                      <div className="flex items-center justify-between py-1">
                                        <span className={tableSubtleText}>Sale Price</span>
                                        <span className="font-bold text-orange-400">{formatCurrency(salePrice)}</span>
                                      </div>
                                      <div className="flex items-center justify-between py-1">
                                        <span className={tableSubtleText}>Platform Fee (2.5%)</span>
                                        <span className={tableSubtleText}>{formatCurrency(platformFee)}</span>
                                      </div>
                                      <div className="mt-2 border-t border-white/10 pt-2 flex items-center justify-between">
                                        <span className="font-bold">Net Settlement</span>
                                        <span className="font-bold">{formatCurrency(netSettlement)}</span>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="flex flex-col items-center justify-center gap-3">
                                    <div className="relative h-20 w-20">
                                      <div
                                        className="absolute inset-0 rounded-full"
                                        style={{
                                          background: `conic-gradient(#f97316 0 ${lead.leadScore}%, rgba(255,255,255,0.1) ${lead.leadScore}% 100%)`,
                                        }}
                                      />
                                      <div
                                        className="absolute inset-2 rounded-full flex items-center justify-center text-lg font-bold"
                                        style={{ backgroundColor: isDarkMode ? '#0a0a0a' : '#ffffff' }}
                                      >
                                        {lead.leadScore}
                                      </div>
                                    </div>
                                    <div className="text-[10px] uppercase tracking-widest text-orange-400">Authenticity</div>
                                    <div className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-emerald-400">
                                      <CheckCircle2 size={14} />
                                      Verified Asset
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

const MyRealtimeOverview = ({
  isDarkMode,
  cards,
  loading,
  error,
  user,
}: {
  isDarkMode: boolean;
  cards: any[];
  loading: boolean;
  error: string | null;
  user: any | null;
}) => {
  const [activeRange, setActiveRange] = useState('1M');
  const [activeChips, setActiveChips] = useState<string[]>(['All Assets']);
  const [selectedQuickAction, setSelectedQuickAction] = useState<string | null>(null);
  const [selectedConsoleControl, setSelectedConsoleControl] = useState<string | null>(null);
  const [lastAction, setLastAction] = useState<string | null>(null);
  const [activityLog, setActivityLog] = useState<string[]>([]);
  const [showHeaderFilters, setShowHeaderFilters] = useState(true);
  const [showAllTopCards, setShowAllTopCards] = useState(false);
  const [showQuickCustomize, setShowQuickCustomize] = useState(false);
  const [showCommandQueue, setShowCommandQueue] = useState(false);
  const [showInboxPanel, setShowInboxPanel] = useState(false);
  const [showPolicyPanel, setShowPolicyPanel] = useState(false);
  const [quickActionMode, setQuickActionMode] = useState('Balanced');
  const [policyReviewDays, setPolicyReviewDays] = useState(12);
  const [insuredValue, setInsuredValue] = useState('$8.4M');
  const [offerDeck, setOfferDeck] = useState(() => myOffers.map((offer) => ({ ...offer })));
  const [automationState, setAutomationState] = useState<Record<string, boolean>>({
    autoList: true,
    priceAlerts: true,
    autoBid: false,
    vaultLock: true,
    loanMode: false,
    instantNotify: true,
    fraudScan: true,
    geoLock: false,
    hedgeMode: true,
    auctionPulse: false,
    reserveShield: true,
    liquiditySweep: true,
    routeOptimizer: false,
    counterSniper: true,
    floorGuard: true,
    escrowSync: false,
  });
  const ranges = ['1W', '1M', '3M', '1Y', 'ALL'];
  const panelBg = isDarkMode ? 'bg-white/5' : 'bg-white';
  const panelBorder = isDarkMode ? 'border-white/10' : 'border-gray-100';
  const muted = isDarkMode ? 'text-gray-400' : 'text-gray-500';
  const chipBg = isDarkMode ? 'bg-white/10' : 'bg-gray-100';

  const allUniqueInventory = React.useMemo(() => {
    const sorted = [...(cards || [])].sort((a, b) => {
      const av = Number((a as any)?.valueNumber) || 0;
      const bv = Number((b as any)?.valueNumber) || 0;
      return bv - av;
    });
    const uniqueCards: any[] = [];
    const seen = new Set<string>();

    sorted.forEach((card) => {
      const key = [
        String((card as any)?.name || '').trim().toLowerCase(),
        String((card as any)?.edition || (card as any)?.team || '').trim().toLowerCase(),
      ].join('::');

      if (!key || seen.has(key)) return;
      seen.add(key);
      uniqueCards.push(card);
    });

    return uniqueCards;
  }, [cards]);

  const topUniqueInventory = React.useMemo(() => allUniqueInventory.slice(0, 6), [allUniqueInventory]);
  const displayedTopCards = React.useMemo(
    () => (showAllTopCards ? allUniqueInventory : topUniqueInventory),
    [allUniqueInventory, showAllTopCards, topUniqueInventory]
  );

  const kpis = [
    { label: 'Portfolio Value', value: '$9.8M', change: '+4.6%', tone: 'up' },
    { label: '24h Change', value: '+$120K', change: '+1.2%', tone: 'up' },
    { label: 'Vaulted Cards', value: '18', change: 'Stable', tone: 'neutral' },
    { label: 'Listed Value', value: '$2.1M', change: '-0.8%', tone: 'down' },
    { label: 'Offer Volume', value: '$480K', change: '+3 Offers', tone: 'up' },
    { label: 'Liquidity', value: '82%', change: 'Healthy', tone: 'up' },
  ];

  const quickActions = [
    { label: 'Add Card', icon: Plus, tone: 'primary' },
    { label: 'List for Sale', icon: ArrowUpRight, tone: 'ghost' },
    { label: 'Transfer', icon: ArrowDownRight, tone: 'ghost' },
    { label: 'Vault', icon: Shield, tone: 'ghost' },
    { label: 'Insure', icon: CheckCircle2, tone: 'ghost' },
    { label: 'Audit', icon: Info, tone: 'ghost' },
    { label: 'Alerts', icon: AlertCircle, tone: 'ghost' },
    { label: 'Message', icon: MessageSquare, tone: 'ghost' },
    { label: 'Route Trade', icon: Globe, tone: 'ghost' },
    { label: 'Open Radar', icon: Search, tone: 'ghost' },
    { label: 'Sync Feeds', icon: Activity, tone: 'ghost' },
    { label: 'Lock Deck', icon: Shield, tone: 'ghost' },
  ];
  const commandCenter = [
    { label: 'Price Scan', icon: Search },
    { label: 'Sync Market', icon: Globe },
    { label: 'Broadcast', icon: Megaphone },
    { label: 'Share Snapshot', icon: Share2 },
    { label: 'Export CSV', icon: FileText },
    { label: 'Open Vault', icon: Shield },
    { label: 'Send Offer', icon: ArrowUpRight },
    { label: 'Request Appraisal', icon: Info },
    { label: 'Move to Auction', icon: TrendingUp },
    { label: 'Delist', icon: Trash2 },
    { label: 'Message Buyers', icon: MessageSquare },
    { label: 'Set Floor Price', icon: Minus },
    { label: 'Increase Floor', icon: Plus },
    { label: 'Security Lock', icon: AlertCircle },
    { label: 'Route Capital', icon: Wallet },
    { label: 'Trigger Sweep', icon: Sparkles },
    { label: 'Open Broadcast', icon: Megaphone },
    { label: 'Send Recon', icon: Activity },
    { label: 'Offer Ladder', icon: BarChart3 },
    { label: 'Auto Hedge', icon: Shield },
    { label: 'Vault Relay', icon: Layers },
    { label: 'Signal Burst', icon: Bell },
  ];
  const cockpitReadouts = [
    { label: 'Market Radar', value: 'ONLINE', tone: 'text-emerald-400' },
    { label: 'Trade Vector', value: 'ARMED', tone: 'text-orange-400' },
    { label: 'Vault Pressure', value: '72%', tone: 'text-sky-400' },
    { label: 'Offer Queue', value: '18', tone: 'text-fuchsia-400' },
    { label: 'Fraud Scan', value: 'CLEAR', tone: 'text-emerald-400' },
    { label: 'Escrow Bus', value: 'SYNC', tone: 'text-yellow-300' },
    { label: 'Signal Noise', value: 'LOW', tone: 'text-cyan-300' },
    { label: 'Auction Pulse', value: 'FAST', tone: 'text-rose-400' },
  ];
  const flightDeckSections = [
    {
      title: 'Trade Helm',
      controls: [
        { label: 'Arm Bid', icon: TrendingUp },
        { label: 'Cut Bid', icon: TrendingDown },
        { label: 'Push Offer', icon: ArrowUpRight },
        { label: 'Recall Offer', icon: ArrowDownRight },
        { label: 'Open Comms', icon: MessageSquare },
        { label: 'Freeze Lane', icon: Shield },
      ],
    },
    {
      title: 'Market Radar',
      controls: [
        { label: 'Scan Floor', icon: Search },
        { label: 'Sweep Sellers', icon: Users },
        { label: 'Track Spikes', icon: Activity },
        { label: 'Watch Feed', icon: Bell },
        { label: 'News Pulse', icon: Megaphone },
        { label: 'Data Sync', icon: Database },
      ],
    },
    {
      title: 'Vault Systems',
      controls: [
        { label: 'Seal Vault', icon: Shield },
        { label: 'Load Vault', icon: Wallet },
        { label: 'Run Audit', icon: FileText },
        { label: 'Route Insurance', icon: CheckCircle2 },
        { label: 'Open Policy', icon: BookOpen },
        { label: 'Pulse Lock', icon: AlertCircle },
      ],
    },
    {
      title: 'Execution Grid',
      controls: [
        { label: 'Auction Mode', icon: Trophy },
        { label: 'Boost Listing', icon: Sparkles },
        { label: 'Share Blast', icon: Share2 },
        { label: 'Signal Route', icon: Globe },
        { label: 'Stack Layer', icon: Layers },
        { label: 'Deck Config', icon: Settings },
      ],
    },
  ];

  const trendLabels = React.useMemo(() => {
    switch (activeRange) {
      case '1W':
        return ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
      case '1M':
        return ['W1', 'W2', 'W3', 'W4'];
      case '3M':
        return ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8', 'W9', 'W10', 'W11', 'W12'];
      case '1Y':
        return ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
      case 'ALL':
        return ['2022', '2023', '2024', '2025', '2026'];
      default:
        return ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL'];
    }
  }, [activeRange]);

  const trendPalette = ['#f97316', '#60a5fa', '#22c55e', '#facc15', '#ef4444', '#a78bfa', '#38bdf8'];

  const inventoryTrendSeries = React.useMemo(() => {
    return topUniqueInventory.map((card, index) => ({
      key: `card_${String(card.id)}`,
      label: String(card.name || 'Card'),
      color: trendPalette[index % trendPalette.length],
      baseMillions: (Number((card as any).valueNumber) || 0) / 1_000_000,
      seed: Number(card.id) || 0,
    }));
  }, [topUniqueInventory]);

  const inventoryTrendData = React.useMemo(() => {
    const len = trendLabels.length;
    if (len === 0) return [];

    const hashString = (input: string) => {
      let h = 2166136261;
      for (let i = 0; i < input.length; i += 1) {
        h = Math.imul(h ^ input.charCodeAt(i), 16777619);
      }
      return h >>> 0;
    };
    const rand01 = (seed: number) => {
      // xorshift32
      let x = seed | 0;
      x ^= x << 13;
      x ^= x >>> 17;
      x ^= x << 5;
      return ((x >>> 0) % 1_000_000) / 1_000_000;
    };

    const rows: any[] = trendLabels.map((label) => ({ name: label }));
    inventoryTrendSeries.forEach((series) => {
      const seedBase = (series.seed || hashString(series.label)) >>> 0;
      const phase = ((seedBase % 360) * Math.PI) / 180;

      for (let i = 0; i < len; i += 1) {
        const remaining = len > 1 ? (len - 1 - i) / (len - 1) : 0;
        const r = rand01((seedBase + i * 0x9e3779b9) >>> 0);
        const wave = Math.sin((i / Math.max(1, len - 1)) * Math.PI * 2 + phase) * 0.06 * remaining;
        const noise = (r - 0.5) * 0.04 * remaining;
        const value = Math.max(0, series.baseMillions * (1 + wave + noise));
        // Keep a clean look (millions with 2 decimals).
        rows[i][series.key] = Number.isFinite(value) ? Number(value.toFixed(2)) : 0;
      }
    });
    return rows;
  }, [trendLabels, inventoryTrendSeries]);

  const toggleChip = (chip: string) => {
    setActiveChips((prev) =>
      prev.includes(chip) ? prev.filter((item) => item !== chip) : [...prev, chip]
    );
  };
  const toggleAutomation = (key: string) => {
    setAutomationState((prev) => ({ ...prev, [key]: !prev[key] }));
    const label = automationLabels[key as keyof typeof automationLabels];
    if (label) {
      logAction(`${label} ${automationState[key] ? 'disabled' : 'enabled'}`);
    }
  };
  const logAction = (label: string) => {
    const time = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    setLastAction(label);
    setActivityLog((prev) => [`${label} · ${time}`, ...prev].slice(0, 6));
  };
  const automationLabels: Record<string, string> = {
    autoList: 'Auto-list',
    priceAlerts: 'Price alerts',
    autoBid: 'Auto-bid',
    vaultLock: 'Vault lock',
    loanMode: 'Loan mode',
    instantNotify: 'Instant notify',
    fraudScan: 'Fraud scan',
    geoLock: 'Geo lock',
    hedgeMode: 'Hedge mode',
    auctionPulse: 'Auction pulse',
    reserveShield: 'Reserve shield',
    liquiditySweep: 'Liquidity sweep',
    routeOptimizer: 'Route optimizer',
    counterSniper: 'Counter sniper',
    floorGuard: 'Floor guard',
    escrowSync: 'Escrow sync',
  };
  const triggerConsoleControl = (label: string) => {
    setSelectedConsoleControl(label);
    setShowCommandQueue(true);
    logAction(label);
  };
  const handleOfferAction = (offerId: string, nextStatus: string) => {
    setOfferDeck((prev) =>
      prev.map((offer) => (offer.id === offerId ? { ...offer, status: nextStatus } : offer))
    );
    setShowInboxPanel(true);
    logAction(`${nextStatus} · ${offerId}`);
  };
  const queuedCommands = activityLog.slice(0, 10);
  const inboxCounts = offerDeck.reduce<Record<string, number>>((acc, offer) => {
    acc[offer.status] = (acc[offer.status] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="p-6 lg:p-8 flex flex-col gap-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-bold tracking-tight">My Realtime Overview</h2>
          <p className={cn('text-sm', muted)}>
            Live snapshot of your most valuable cards, offers, and vault health.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {ranges.map((range) => (
            <button
              key={range}
              onClick={() => setActiveRange(range)}
              className={cn(
                'px-3 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-colors',
                activeRange === range
                  ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20'
                  : cn(panelBg, panelBorder, 'border text-gray-300 hover:text-white')
              )}
            >
              {range}
            </button>
          ))}
          <button
            onClick={() => {
              const next = !showHeaderFilters;
              setShowHeaderFilters(next);
              logAction(next ? 'Filter deck opened' : 'Filter deck hidden');
            }}
            className={cn('px-3 py-2 rounded-xl border text-xs font-bold', panelBg, panelBorder)}
          >
            <Filter size={14} className="inline-block mr-2" />
            {showHeaderFilters ? 'Hide Filters' : 'Filters'}
          </button>
          <button
            onClick={() => {
              setSelectedQuickAction('Add Card');
              setShowQuickCustomize(true);
              logAction('Add Card panel opened');
            }}
            className="px-3 py-2 rounded-xl bg-orange-500 text-xs font-bold text-white shadow-lg shadow-orange-500/20"
          >
            <Plus size={14} className="inline-block mr-2" />
            Add Card
          </button>
        </div>
      </div>

      {showHeaderFilters && (
        <div className="flex flex-wrap gap-2">
          {['All Assets', 'Vaulted', 'Listed', 'On Loan', 'Negotiation', 'Watchlist', 'High Risk', 'Insured', 'Floor Price', 'Recently Sold'].map((chip) => (
            <button
              key={chip}
              onClick={() => toggleChip(chip)}
              className={cn(
                'px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-colors',
                activeChips.includes(chip)
                  ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20'
                  : cn(chipBg, muted)
              )}
            >
              {chip}
            </button>
          ))}
          <button
            onClick={() => {
              setActiveChips(['All Assets']);
              logAction('Filters reset');
            }}
            className={cn('px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest', chipBg, muted)}
          >
            Reset Filters
          </button>
          {lastAction && (
            <span className={cn('px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest', chipBg, muted)}>
              Last action: {lastAction}
            </span>
          )}
        </div>
      )}

      {(showQuickCustomize || showCommandQueue || showInboxPanel || showPolicyPanel) && (
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">
          {showQuickCustomize && (
            <div className={cn('rounded-3xl border p-4', panelBg, panelBorder)}>
              <div className="flex items-center justify-between">
                <div className="text-xs font-bold uppercase tracking-[0.2em] text-orange-400">Quick Action Config</div>
                <button
                  onClick={() => setShowQuickCustomize(false)}
                  className={cn('text-[10px] font-bold uppercase tracking-widest', muted)}
                >
                  Close
                </button>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2">
                {['Balanced', 'Aggressive', 'Silent', 'Broadcast'].map((mode) => (
                  <button
                    key={mode}
                    onClick={() => {
                      setQuickActionMode(mode);
                      logAction(`Quick mode · ${mode}`);
                    }}
                    className={cn(
                      'px-3 py-2 rounded-xl border text-[10px] font-bold uppercase tracking-widest',
                      panelBg,
                      panelBorder,
                      quickActionMode === mode ? 'bg-orange-500 text-white' : 'text-gray-300'
                    )}
                  >
                    {mode}
                  </button>
                ))}
              </div>
              <div className={cn('mt-3 text-[10px] uppercase tracking-widest', muted)}>
                Active Mode: <span className="text-orange-400 font-bold">{quickActionMode}</span>
              </div>
            </div>
          )}

          {showCommandQueue && (
            <div className={cn('rounded-3xl border p-4 xl:col-span-2', panelBg, panelBorder)}>
              <div className="flex items-center justify-between">
                <div className="text-xs font-bold uppercase tracking-[0.2em] text-orange-400">Command Queue</div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setActivityLog([]);
                      setLastAction(null);
                    }}
                    className={cn('text-[10px] font-bold uppercase tracking-widest', muted)}
                  >
                    Clear
                  </button>
                  <button
                    onClick={() => setShowCommandQueue(false)}
                    className={cn('text-[10px] font-bold uppercase tracking-widest', muted)}
                  >
                    Close
                  </button>
                </div>
              </div>
              <div className="mt-3 space-y-2">
                {queuedCommands.length === 0 ? (
                  <div className={cn('rounded-2xl border p-3 text-xs', panelBg, panelBorder, muted)}>
                    Queue is clear.
                  </div>
                ) : (
                  queuedCommands.map((entry) => (
                    <div key={entry} className={cn('rounded-2xl border px-3 py-2 text-xs flex items-center justify-between', panelBg, panelBorder)}>
                      <span>{entry}</span>
                      <span className="font-bold text-emerald-400">Queued</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {showInboxPanel && (
            <div className={cn('rounded-3xl border p-4', panelBg, panelBorder)}>
              <div className="flex items-center justify-between">
                <div className="text-xs font-bold uppercase tracking-[0.2em] text-orange-400">Offer Inbox</div>
                <button
                  onClick={() => setShowInboxPanel(false)}
                  className={cn('text-[10px] font-bold uppercase tracking-widest', muted)}
                >
                  Close
                </button>
              </div>
              <div className="mt-3 space-y-2 text-xs">
                {Object.keys(inboxCounts).length === 0 ? (
                  <div className={muted}>No offers tracked.</div>
                ) : (
                  Object.entries(inboxCounts).map(([status, count]) => (
                    <div key={status} className="flex items-center justify-between">
                      <span className={muted}>{status}</span>
                      <span className="font-bold text-orange-400">{count}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {showPolicyPanel && (
            <div className={cn('rounded-3xl border p-4', panelBg, panelBorder)}>
              <div className="flex items-center justify-between">
                <div className="text-xs font-bold uppercase tracking-[0.2em] text-orange-400">Policy Detail</div>
                <button
                  onClick={() => setShowPolicyPanel(false)}
                  className={cn('text-[10px] font-bold uppercase tracking-widest', muted)}
                >
                  Close
                </button>
              </div>
              <div className="mt-3 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className={muted}>Insured Value</span>
                  <span className="font-bold text-emerald-400">{insuredValue}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className={muted}>Review Window</span>
                  <span className="font-bold text-orange-400">{policyReviewDays} days</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      <div className={cn('rounded-[28px] border p-5 lg:p-6', panelBg, panelBorder)}>
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="text-sm font-bold">Flight Deck Console</div>
            <div className={cn('text-[10px] uppercase tracking-[0.24em]', muted)}>
              Dense control surface for trade routing, vault ops, and market interception
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {['Alpha Grid', 'Beta Sweep', 'Gamma Lock', 'Omega Alert'].map((preset) => (
              <button
                key={preset}
                onClick={() => triggerConsoleControl(preset)}
                className={cn(
                  'px-3 py-2 rounded-xl border text-[10px] font-bold uppercase tracking-widest transition-colors',
                  panelBg,
                  panelBorder,
                  selectedConsoleControl === preset ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20' : 'text-gray-300 hover:text-white'
                )}
              >
                {preset}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-8 gap-3">
          {cockpitReadouts.map((readout) => (
            <div key={readout.label} className={cn('rounded-2xl border p-3', panelBg, panelBorder)}>
              <div className="text-[10px] uppercase tracking-widest text-gray-400">{readout.label}</div>
              <div className={cn('mt-2 text-sm font-black tracking-wider', readout.tone)}>{readout.value}</div>
            </div>
          ))}
        </div>

        <div className="mt-5 grid grid-cols-1 xl:grid-cols-4 gap-4">
          {flightDeckSections.map((section) => (
            <div key={section.title} className={cn('rounded-3xl border p-4', panelBg, panelBorder)}>
              <div className="flex items-center justify-between">
                <div className="text-xs font-bold uppercase tracking-[0.22em] text-orange-400">{section.title}</div>
                <MoreHorizontal size={14} className="text-gray-500" />
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2">
                {section.controls.map((control) => (
                  <button
                    key={control.label}
                    onClick={() => triggerConsoleControl(control.label)}
                    className={cn(
                      'flex min-h-[52px] flex-col items-start justify-center rounded-2xl border px-3 py-2 text-left text-[10px] font-bold uppercase tracking-widest transition-all',
                      panelBg,
                      panelBorder,
                      selectedConsoleControl === control.label
                        ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20 ring-2 ring-orange-300/50'
                        : 'text-gray-300 hover:text-white hover:border-orange-400/40'
                    )}
                  >
                    <control.icon size={14} className="mb-2" />
                    {control.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-6 gap-4">
        {kpis.map((kpi) => (
          <div key={kpi.label} className={cn('rounded-2xl border p-4', panelBg, panelBorder)}>
            <div className="text-[10px] uppercase tracking-widest text-gray-400">{kpi.label}</div>
            <div className="mt-2 text-lg font-bold">{kpi.value}</div>
            <div
              className={cn(
                'mt-1 text-[10px] font-bold uppercase tracking-widest',
                kpi.tone === 'up' && 'text-emerald-400',
                kpi.tone === 'down' && 'text-red-400',
                kpi.tone === 'neutral' && muted
              )}
            >
              {kpi.change}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className={cn('xl:col-span-2 rounded-3xl border p-6', panelBg, panelBorder)}>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="text-sm font-bold">My Cards Trend</div>
              <div className={cn('text-[10px] uppercase tracking-widest', muted)}>
                Price movement for your top 6 unique cards
              </div>
            </div>
          <div className="flex flex-wrap items-center gap-3 text-[10px] uppercase tracking-widest text-gray-400">
              {inventoryTrendSeries.map((series) => (
                <span key={series.key} className="inline-flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: series.color }} />
                  {series.label}
                </span>
              ))}
            </div>
          </div>
          <div className="h-[340px] mt-6">
            {inventoryTrendSeries.length === 0 ? (
              <div className={cn('h-full rounded-2xl border flex items-center justify-center text-xs', panelBg, panelBorder, muted)}>
                {loading ? 'Syncing inventory…' : 'No cards to visualize yet.'}
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={inventoryTrendData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={true} stroke={isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'} />
                  <XAxis dataKey="name" axisLine={true} tickLine={true} tick={{ fontSize: 10, fill: '#9ca3af' }} />
                  <YAxis
                    axisLine={true}
                    tickLine={true}
                    tick={{ fontSize: 10, fill: '#9ca3af' }}
                    tickFormatter={(value) => `${value}M`}
                  />
                  <Tooltip
                    contentStyle={{ backgroundColor: isDarkMode ? '#111' : '#fff', border: 'none', borderRadius: '12px' }}
                    formatter={(value: any) => {
                      const numeric = Number(value) || 0;
                      return `$${Math.round(numeric * 1_000_000).toLocaleString()}`;
                    }}
                  />
                  {inventoryTrendSeries.map((series) => (
                    <Line key={series.key} type="monotone" dataKey={series.key} stroke={series.color} strokeWidth={2.5} dot={false} />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className={cn('rounded-3xl border p-6', panelBg, panelBorder)}>
            <div className="flex items-center justify-between">
              <div className="text-sm font-bold">Top 6 Most Expensive</div>
              <button
                onClick={() => {
                  const next = !showAllTopCards;
                  setShowAllTopCards(next);
                  logAction(next ? 'Top cards expanded' : 'Top cards collapsed');
                }}
                className={cn('text-[10px] font-bold uppercase tracking-widest', muted)}
              >
                {showAllTopCards ? 'Show Top 6' : 'View All'}
              </button>
            </div>
            <div className="mt-4 space-y-3">
              {(loading || error || !user) && (
                <div className={cn('rounded-2xl border p-3 text-xs', panelBorder, panelBg, muted)}>
                  {loading && <span className="font-bold text-orange-300">Syncing inventory…</span>}
                  {!loading && error && <span className="font-bold text-red-300">{error}</span>}
                  {!loading && !error && !user && <span className="font-bold text-orange-300">Login in FODR to sync your inventory.</span>}
                </div>
              )}

              {!loading && !error && user && topUniqueInventory.length === 0 && (
                <div className={cn('rounded-2xl border p-3 text-xs', panelBorder, panelBg, muted)}>
                  No cards found in your inventory yet.
                </div>
              )}

              {displayedTopCards.map((card) => (
                <div key={card.id} className="flex items-center gap-3">
                  <img
                    src={card.image}
                    alt={card.name}
                    className="h-12 w-12 rounded-xl object-contain bg-black/30"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex-1">
                    <div className="text-sm font-bold">{card.name}</div>
                    <div className={cn('text-[10px] uppercase tracking-widest', muted)}>
                      {card.edition || card.team} · {card.rarity}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-orange-400">{card.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={cn('rounded-3xl border p-6', panelBg, panelBorder)}>
            <div className="flex items-center justify-between">
              <div className="text-sm font-bold">Quick Actions</div>
              <button
                onClick={() => {
                  const next = !showQuickCustomize;
                  setShowQuickCustomize(next);
                  logAction(next ? 'Quick config opened' : 'Quick config closed');
                }}
                className={cn('text-[10px] font-bold uppercase tracking-widest', muted)}
              >
                Customize
              </button>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {quickActions.map((action) => (
                <button
                  key={action.label}
                  onClick={() => {
                    setSelectedQuickAction(action.label);
                    setShowCommandQueue(true);
                    logAction(action.label);
                  }}
                  className={cn(
                    'flex items-center gap-2 rounded-xl px-3 py-2 text-[10px] font-bold uppercase tracking-widest transition-colors',
                    action.tone === 'primary'
                      ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20'
                      : cn(panelBg, panelBorder, 'border text-gray-300 hover:text-white'),
                    selectedQuickAction === action.label && 'ring-2 ring-orange-400/60'
                  )}
                >
                  <action.icon size={14} />
                  {action.label}
                </button>
              ))}
            </div>
          </div>

          <div className={cn('rounded-3xl border p-6', panelBg, panelBorder)}>
            <div className="flex items-center justify-between">
              <div className="text-sm font-bold">Command Center</div>
              <button
                onClick={() => {
                  const next = !showCommandQueue;
                  setShowCommandQueue(next);
                  logAction(next ? 'Queue opened' : 'Queue hidden');
                }}
                className={cn('text-[10px] font-bold uppercase tracking-widest', muted)}
              >
                Queue
              </button>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {commandCenter.map((command) => (
                <button
                  key={command.label}
                  onClick={() => {
                    setShowCommandQueue(true);
                    logAction(command.label);
                  }}
                  className={cn(
                    'flex items-center gap-2 rounded-xl px-3 py-2 text-[10px] font-bold uppercase tracking-widest transition-colors',
                    panelBg,
                    panelBorder,
                    'border text-gray-300 hover:text-white'
                  )}
                >
                  <command.icon size={14} />
                  {command.label}
                </button>
              ))}
            </div>
            {activityLog.length > 0 && (
              <div className="mt-4 space-y-2">
                <div className={cn('text-[10px] uppercase tracking-widest', muted)}>Recent Actions</div>
                <div className="space-y-1 text-[10px]">
                  {activityLog.map((entry) => (
                    <div key={entry} className={cn('flex items-center justify-between', muted)}>
                      <span>{entry}</span>
                      <span className="text-emerald-400 font-bold">Queued</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className={cn('rounded-3xl border p-6', panelBg, panelBorder)}>
          <div className="flex items-center justify-between">
            <div className="text-sm font-bold">My Signals</div>
            <Zap size={16} className="text-orange-400" />
          </div>
          <div className="mt-4 space-y-4">
            {mySignals.map((signal) => (
              <div key={signal.label} className="flex items-center justify-between">
                <span className={cn('text-xs uppercase tracking-widest', muted)}>{signal.label}</span>
                <span
                  className={cn(
                    'text-xs font-bold',
                    signal.tone === 'ok' && 'text-emerald-400',
                    signal.tone === 'warn' && 'text-orange-400',
                    signal.tone === 'alert' && 'text-red-400'
                  )}
                >
                  {signal.value}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-6 space-y-3">
            <div className={cn('text-[10px] uppercase tracking-widest', muted)}>Automation & Alerts</div>
            <div className="grid grid-cols-2 gap-2">
              {Object.keys(automationState).map((key) => (
                <button
                  key={key}
                  onClick={() => toggleAutomation(key)}
                  className={cn(
                    'px-3 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-colors',
                    automationState[key] ? 'bg-emerald-500/20 text-emerald-300' : cn(chipBg, muted)
                  )}
                >
                  {automationLabels[key]}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => logAction('Run scan')}
                className={cn('px-3 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest', chipBg, muted)}
              >
                Run Scan
              </button>
              <button
                onClick={() => logAction('Export snapshot')}
                className={cn('px-3 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest', chipBg, muted)}
              >
                Export
              </button>
              <button
                onClick={() => logAction('Add alert')}
                className={cn('px-3 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest', chipBg, muted)}
              >
                Add Alert
              </button>
            </div>
          </div>
        </div>

          <div className={cn('rounded-3xl border p-6', panelBg, panelBorder)}>
            <div className="flex items-center justify-between">
              <div className="text-sm font-bold">Open Offers</div>
              <button
                onClick={() => {
                  const next = !showInboxPanel;
                  setShowInboxPanel(next);
                  logAction(next ? 'Inbox opened' : 'Inbox hidden');
                }}
                className={cn('text-[10px] font-bold uppercase tracking-widest', muted)}
              >
                Inbox
              </button>
            </div>
            <div className="mt-4 space-y-3">
            {offerDeck.map((offer) => (
              <div key={offer.id} className={cn('rounded-2xl border p-3', panelBorder, panelBg)}>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold">{offer.card}</div>
                    <div className={cn('text-[10px] uppercase tracking-widest', muted)}>From {offer.from} · {offer.status}</div>
                  </div>
                  <div className="text-xs font-bold text-orange-400">{offer.price}</div>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    onClick={() => handleOfferAction(offer.id, 'Accepted')}
                    className="px-3 py-1.5 rounded-xl bg-emerald-500 text-[10px] font-bold uppercase tracking-widest text-white"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleOfferAction(offer.id, 'Countered')}
                    className={cn('px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-widest', chipBg, muted)}
                  >
                    Counter
                  </button>
                  <button
                    onClick={() => handleOfferAction(offer.id, 'Declined')}
                    className={cn('px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-widest', chipBg, muted)}
                  >
                    Decline
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={cn('rounded-3xl border p-6', panelBg, panelBorder)}>
          <div className="flex items-center justify-between">
            <div className="text-sm font-bold">Storage & Insurance</div>
            <Shield size={16} className="text-emerald-400" />
          </div>
            <div className="mt-4 space-y-4">
              <div>
                <div className="flex items-center justify-between text-xs">
                  <span className={muted}>Vault Capacity</span>
                  <span className="font-bold">72%</span>
              </div>
              <div className="mt-2 h-2 rounded-full bg-white/10">
                <div className="h-2 rounded-full bg-emerald-500" style={{ width: '72%' }} />
              </div>
            </div>
              <div>
                <div className="flex items-center justify-between text-xs">
                  <span className={muted}>Insured Value</span>
                  <span className="font-bold">{insuredValue}</span>
                </div>
                <div className="mt-2 h-2 rounded-full bg-white/10">
                  <div className="h-2 rounded-full bg-orange-500" style={{ width: '84%' }} />
                </div>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <Mail size={14} className="text-orange-400" />
                <span className={muted}>Next policy review in {policyReviewDays} days</span>
              </div>
            <div className="flex items-center gap-3 text-xs">
              <Clock size={14} className="text-blue-400" />
              <span className={muted}>Vault audit scheduled for Friday</span>
            </div>
          </div>
          <div className="mt-5 grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                setPolicyReviewDays(365);
                setInsuredValue('$9.1M');
                logAction('Policy renewed');
              }}
              className="px-3 py-2 rounded-xl bg-orange-500 text-[10px] font-bold uppercase tracking-widest text-white"
            >
              Renew
            </button>
            <button
              onClick={() => {
                const next = !showPolicyPanel;
                setShowPolicyPanel(next);
                logAction(next ? 'Policy panel opened' : 'Policy panel hidden');
              }}
              className={cn('px-3 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest', chipBg, muted)}
            >
              View Policy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const DayOnDayView = ({ isDarkMode }: { isDarkMode: boolean }) => (
  <div className="p-8 flex flex-col gap-8">
    <div className="flex flex-col gap-1">
      <h2 className="text-2xl font-bold tracking-tight">Day on Day Performance</h2>
      <p className="text-sm text-gray-500">Comparative analysis of daily market fluctuations.</p>
    </div>

    <div className="bg-white dark:bg-white/5 rounded-3xl overflow-hidden border border-gray-100 dark:border-white/5 shadow-sm">
      <table className="w-full text-left">
        <thead>
          <tr className="bg-gray-50 dark:bg-white/5 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 dark:border-white/5">
            <th className="px-6 py-4">Asset Name</th>
            <th className="px-6 py-4">Current Value</th>
            <th className="px-6 py-4">24h Change</th>
            <th className="px-6 py-4">Volume</th>
            <th className="px-6 py-4">Market Cap</th>
            <th className="px-6 py-4">Trend</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-white/5">
          {dayOnDayData.map((item) => (
            <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group">
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-500">
                    <Database size={16} />
                  </div>
                  <span className="text-sm font-bold group-hover:text-orange-500 transition-colors">{item.name}</span>
                </div>
              </td>
              <td className="px-6 py-4 text-sm font-medium">${item.currentValue.toLocaleString()}</td>
              <td className={cn("px-6 py-4 text-sm font-bold", item.trend === 'up' ? "text-emerald-500" : "text-red-500")}>
                {item.change}
              </td>
              <td className="px-6 py-4 text-sm text-gray-500">${item.volume.toLocaleString()}</td>
              <td className="px-6 py-4 text-sm text-gray-500">${item.marketCap.toLocaleString()}</td>
              <td className="px-6 py-4">
                <div className={cn("w-12 h-6 rounded-full flex items-center justify-center", item.trend === 'up' ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500")}>
                  {item.trend === 'up' ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

// --- Main App Component ---

export default function App() {
  const [activeView, setActiveView] = useState('Realtime Overview');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [fodrUser, setFodrUser] = useState<any | null>(() => {
    let user: any | null = null;
    try {
      const raw = localStorage.getItem('fodrUser');
      user = raw ? JSON.parse(raw) : null;
    } catch {
      user = null;
    }

    // Fallback for cases where the dashboard is opened on a different origin than the main app.
    // Parent app can also pass uid/uname via query params.
    try {
      const params = new URLSearchParams(window.location.search);
      const uid = Number(params.get('uid') || params.get('userId') || '') || null;
      const uname = params.get('uname') || params.get('username') || '';
      if (!user && uid) {
        user = { id: uid, username: uname || undefined };
      }
    } catch {
      // ignore
    }

    return user;
  });
  const queryUserId = (() => {
    try {
      const params = new URLSearchParams(window.location.search);
      return Number(params.get('uid') || params.get('userId') || '') || null;
    } catch {
      return null;
    }
  })();
  const userId = Number(fodrUser?.id) || queryUserId || null;
  const [liveInventoryCards, setLiveInventoryCards] = useState<any[]>([]);
  const [inventoryLoading, setInventoryLoading] = useState(false);
  const [inventoryError, setInventoryError] = useState<string | null>(null);
  const [inventoryReloadToken, setInventoryReloadToken] = useState(0);
  const [selectedCard, setSelectedCard] = useState<any>(null);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notificationFilter, setNotificationFilter] = useState('All');
  const [notificationUnreadOnly, setNotificationUnreadOnly] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [dashboardToast, setDashboardToast] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<any[]>(() => ([
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
      actions: ['Accept', 'Counter', 'Decline']
    },
    {
      id: 'nt-2',
      category: 'Trading',
      type: 'counter',
      title: 'Counter-offer arrived',
      message: 'vault_prime countered on Messi - Barcelona Edition.',
      time: '18m ago',
      read: false,
      status: 'Counter',
      tone: 'info',
      actions: ['Accept', 'Counter', 'Decline']
    },
    {
      id: 'nt-3',
      category: 'Trading',
      type: 'accepted',
      title: 'Trade accepted',
      message: 'Pele - Brazil Edition swap completed with vintage_pro.',
      time: '1h ago',
      read: true,
      status: 'Accepted',
      tone: 'success'
    },
    {
      id: 'nt-4',
      category: 'Trading',
      type: 'declined',
      title: 'Trade declined',
      message: 'Ronaldo - Brazil Edition offer declined by card_shark.',
      time: '2h ago',
      read: true,
      status: 'Declined',
      tone: 'danger'
    },
    {
      id: 'nt-5',
      category: 'Trading',
      type: 'escrow',
      title: 'Escrow funded',
      message: 'Escrow secured for Maradona - Napoli Edition trade.',
      time: '3h ago',
      read: false,
      status: 'Funded',
      tone: 'success',
      actions: ['View', 'Message']
    },
    {
      id: 'nt-6',
      category: 'Trading',
      type: 'insurance',
      title: 'Insurance added',
      message: 'Collector insurance applied to Mbappe - PSG Edition.',
      time: '4h ago',
      read: true,
      status: 'Insured',
      tone: 'info'
    },
    {
      id: 'nt-7',
      category: 'Market',
      type: 'listing',
      title: 'Listing expiring soon',
      message: 'Your listing for Neymar - Brazil Edition expires in 6 hours.',
      time: '5h ago',
      read: false,
      status: 'Action needed',
      tone: 'warning',
      actions: ['Extend', 'Delist']
    },
    {
      id: 'nt-8',
      category: 'Watchlist',
      type: 'price',
      title: 'Watchlist spike',
      message: 'Haaland - City Edition up +12.4% in the last 24h.',
      time: '6h ago',
      read: false,
      status: 'Price alert',
      tone: 'success',
      actions: ['View', 'Add Alert']
    },
    {
      id: 'nt-9',
      category: 'Watchlist',
      type: 'watch',
      title: 'New high on watchlist',
      message: 'Messi - Barcelona Edition hit a new 30-day high.',
      time: '7h ago',
      read: true,
      status: 'New high',
      tone: 'info'
    },
    {
      id: 'nt-10',
      category: 'Market',
      type: 'market',
      title: 'Highest bid updated',
      message: 'Top bid for Ronaldo - Real Edition now $92,000.',
      time: '8h ago',
      read: false,
      status: 'Bid change',
      tone: 'info',
      actions: ['View', 'Set Floor']
    },
    {
      id: 'nt-11',
      category: 'Security',
      type: 'security',
      title: 'Vault audit scheduled',
      message: 'Weekly vault audit is scheduled for Friday 10:00.',
      time: 'Yesterday',
      read: true,
      status: 'Scheduled',
      tone: 'neutral',
      actions: ['View', 'Reschedule']
    },
    {
      id: 'nt-12',
      category: 'Security',
      type: 'alert',
      title: 'Geo-lock blocked attempt',
      message: 'Attempted access from Madrid blocked by Geo-lock.',
      time: 'Yesterday',
      read: false,
      status: 'Blocked',
      tone: 'danger',
      actions: ['Review', 'Lock Down']
    },
    {
      id: 'nt-13',
      category: 'System',
      type: 'system',
      title: 'Daily market report ready',
      message: 'Market summary and top movers are ready to review.',
      time: 'Yesterday',
      read: true,
      status: 'Report',
      tone: 'info',
      actions: ['Open', 'Share']
    },
    {
      id: 'nt-14',
      category: 'System',
      type: 'sync',
      title: 'Data sources synced',
      message: 'Pricing feeds refreshed for 1,284 cards.',
      time: '2d ago',
      read: true,
      status: 'Synced',
      tone: 'success'
    },
    {
      id: 'nt-15',
      category: 'Market',
      type: 'leaderboard',
      title: 'Top cards leaderboard changed',
      message: 'Pele - Brazil Edition moved to #1 with +6.1% growth.',
      time: '2d ago',
      read: true,
      status: 'Update',
      tone: 'info'
    },
    {
      id: 'nt-16',
      category: 'Trading',
      type: 'message',
      title: 'New trade message',
      message: 'collector_x: "Can we bundle the Mbappe card?"',
      time: '3d ago',
      read: false,
      status: 'Message',
      tone: 'neutral',
      actions: ['Reply', 'Open Thread']
    }
  ]));
  const [watchlistIds, setWatchlistIds] = useState<string[]>([
    'card-messi-2012',
    'card-pele-1970',
    'card-maradona-1987',
  ]);
  const previousInventoryIdsRef = useRef<number[] | null>(null);
  const previousInventoryUserRef = useRef<number | null>(null);

  const toggleWatchlist = (id: string) => {
    setWatchlistIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  useEffect(() => {
    const onDashboardAction = (event: Event) => {
      const customEvent = event as CustomEvent<{ message?: string }>;
      const message = customEvent.detail?.message;
      if (!message) return;
      setDashboardToast(message);
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
      toastTimerRef.current = setTimeout(() => setDashboardToast(null), 2600);
    };

    window.addEventListener('fodr-dashboard-action', onDashboardAction as EventListener);
    return () => {
      window.removeEventListener('fodr-dashboard-action', onDashboardAction as EventListener);
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
  }, []);

  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key !== 'fodrUser') return;
      try {
        setFodrUser(event.newValue ? JSON.parse(event.newValue) : null);
      } catch {
        setFodrUser(null);
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      const data: any = event?.data || {};
      const type = data?.type;

      if (type === 'FODR_DASHBOARD_INVENTORY_CHANGED') {
        setInventoryReloadToken((prev) => prev + 1);
        return;
      }

      if (type === 'FODR_DASHBOARD_USER') {
        const nextUser = data?.user;
        setFodrUser(nextUser && typeof nextUser === 'object' ? nextUser : null);
        return;
      }

      if (type === 'FODR_DASHBOARD_NAVIGATE' && typeof data?.view === 'string') {
        setSelectedCard(null);
        setActiveView(data.view);
      }
    };

    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, []);

  useEffect(() => {
    if (typeof BroadcastChannel === 'undefined') return;
    const channel = new BroadcastChannel('fodr-inventory');
    const onMessage = () => setInventoryReloadToken((prev) => prev + 1);
    channel.addEventListener('message', onMessage);
    return () => {
      channel.removeEventListener('message', onMessage);
      channel.close();
    };
  }, []);

  useEffect(() => {
    if (previousInventoryUserRef.current !== userId) {
      previousInventoryUserRef.current = userId;
      previousInventoryIdsRef.current = null;
    }
  }, [userId]);

	  const normalizeImage = (src: string) => {
	    if (!src) return '';
	    if (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('data:')) return src;
	    if (src.startsWith('../images/')) return src.replace(/^\.\.\/images\//, '/images/');
	    if (src.startsWith('./images/')) return src.replace(/^\.\//, '/');
	    const idx = src.indexOf('/images/');
	    if (idx !== -1) return src.slice(idx);
	    if (src.startsWith('images/')) return `/${src}`;
	    if (src.startsWith('/images/')) return src;
	    return src;
	  };

  const deriveEdition = (image: string, club: string) => {
    const lower = (image || '').toLowerCase();
    if (lower.includes('/ultimate/')) return 'Ultimate Edition';
    if (lower.includes('/liverpool-special/')) return 'Liverpool Edition';
    return club ? `${club} Edition` : 'Edition';
  };

  const deriveRarity = (value: number) => {
    if (value >= 10_000_000) return 'Mythic';
    if (value >= 7_000_000) return 'Legendary';
    if (value >= 3_000_000) return 'Epic';
    if (value >= 1_000_000) return 'Rare';
    return 'Common';
  };

  const formatMoney = (value: number) => `$${Math.round(value).toLocaleString()}`;

  const mapInventoryRow = (row: any) => {
    const team = String(row?.club || '') || 'Club';
    const valueNumber = getSharedPriceValue(String(row?.card_name || ''), team, Number(row?.card_value) || 0);
    const image = normalizeImage(String(row?.image || ''));
    const year = String(row?.started || '').trim() || (row?.created_at ? String(row.created_at).slice(0, 4) : '----');
    const edition = deriveEdition(image, team);
    const rarity = deriveRarity(valueNumber);
    const isVerified = Number(row?.is_verified) === 1;
    return {
      id: Number(row?.id) || Math.floor(Math.random() * 1_000_000),
      name: String(row?.card_name || 'Card'),
      team,
      year,
      edition,
      rarity,
      valueNumber,
      value: formatMoney(valueNumber),
      condition: 'PSA 10',
      image,
      ownersCount: 1,
      position: row?.card_position || '',
      note: row?.card_note || '',
      isVerified,
      verificationStatus: String(row?.verification_status || (isVerified ? 'verified' : 'pending')),
      verificationCode: String(row?.verification_code || ''),
      verifiedAt: row?.verified_at || null,
      acquiredVia: String(row?.acquired_via || 'new'),
      history: [
        {
          user: fodrUser?.username ? `@${fodrUser.username}` : 'You',
          avatar: '/images/web-logo/CUSTOM~1.PNG',
          price: formatMoney(valueNumber),
          date: row?.created_at ? 'Owned' : 'Today',
          action: isVerified ? 'Verified in inventory' : 'Awaiting verification'
        }
      ]
    };
  };

	  useEffect(() => {
	    if (!userId) {
	      setLiveInventoryCards([]);
	      setInventoryLoading(false);
	      setInventoryError(null);
	      return;
	    }

	    let cancelled = false;
	    const load = async () => {
	      setInventoryLoading(true);
	      setInventoryError(null);
	      try {
	        const API_BASE = 'http://localhost:3002/api';
	        const res = await fetch(`${API_BASE}/cardgame/inventory/${userId}`);
	        const data = await res.json().catch(() => ({}));
	        if (!res.ok) throw new Error(data?.error || 'Failed to load inventory');
	        const rows = Array.isArray(data?.cards) ? data.cards : [];
	        const mapped = rows.map(mapInventoryRow);
	        if (!cancelled) setLiveInventoryCards(mapped);
	      } catch (err: any) {
        if (!cancelled) {
          setInventoryError(err?.message || 'Failed to load inventory');
          setLiveInventoryCards([]);
        }
      } finally {
        if (!cancelled) setInventoryLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [userId, inventoryReloadToken]);

  useEffect(() => {
    if (!userId || inventoryLoading) return;

    const currentIds = liveInventoryCards.map((card) => Number(card.id)).filter((id) => Number.isFinite(id));
    const previousIds = previousInventoryIdsRef.current;

    if (!previousIds) {
      previousInventoryIdsRef.current = currentIds;
      return;
    }

    const addedCards = liveInventoryCards.filter((card) => !previousIds.includes(Number(card.id)));
    previousInventoryIdsRef.current = currentIds;

    if (!addedCards.length) return;

    setNotifications((prev) => {
      const existingIds = new Set(prev.map((item) => item.id));
      const created = addedCards
        .filter((card) => !existingIds.has(`nt-card-${card.id}`))
        .map((card) => ({
          id: `nt-card-${card.id}`,
          category: 'System',
          type: 'card',
          title: 'New card acquired',
          message: `You acquired ${card.name} - ${card.edition}. Use the verification code below to unlock it in your collection.`,
          time: 'Just now',
          read: false,
          status: card.isVerified ? 'Verified' : 'Verify now',
          tone: card.isVerified ? 'success' : 'warning',
          actions: card.isVerified ? ['View'] : ['Copy Code', 'Verify Card'],
          verificationCode: card.verificationCode || '',
          cardId: card.id,
          cardName: card.name,
        }));

      return created.length ? [...created, ...prev] : prev;
    });

    const firstNewCard = addedCards[0];
    if (firstNewCard) {
      emitDashboardAction(`${firstNewCard.name} added to notifications with verification code`);
    }
  }, [liveInventoryCards, inventoryLoading, userId]);

  const notificationCategories = ['All', 'Trading', 'Watchlist', 'Market', 'Security', 'System'];
  const unreadCount = notifications.filter((item) => !item.read).length;
  const filteredNotifications = notifications.filter((item) => {
    const matchesCategory = notificationFilter === 'All' || item.category === notificationFilter;
    const matchesUnread = !notificationUnreadOnly || !item.read;
    return matchesCategory && matchesUnread;
  });

  const updateNotification = (id: string, updates: Partial<typeof notifications[number]>) => {
    setNotifications((prev) => prev.map((item) => (item.id === id ? { ...item, ...updates } : item)));
  };
  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((item) => ({ ...item, read: true })));
  };
  const clearReadNotifications = () => {
    setNotifications((prev) => prev.filter((item) => !item.read));
  };
  const handleNotificationAction = (id: string, action: string) => {
    const item = notifications.find((entry) => entry.id === id);

    if (action === 'Copy Code') {
      const code = String(item?.verificationCode || '');
      if (!code) {
        emitDashboardAction('No verification code available to copy');
        return;
      }
      if (!navigator?.clipboard?.writeText) {
        emitDashboardAction('Clipboard copy is not available in this browser');
        return;
      }
      navigator.clipboard
        .writeText(code)
        .then(() => {
          updateNotification(id, { status: 'Code Copied', read: true, time: 'Just now' });
          emitDashboardAction(`Verification code copied for ${item?.cardName || 'new card'}`);
        })
        .catch(() => {
          emitDashboardAction('Could not copy verification code');
        });
      return;
    }

    if (action === 'Verify Card') {
      setSelectedCard(null);
      setActiveView('Card Verification');
      setNotificationOpen(false);
      updateNotification(id, { status: 'Verification Desk', read: true, time: 'Just now' });
      emitDashboardAction(`Opened Card Verification for ${item?.cardName || 'new card'}`);
      return;
    }

    if (action === 'View' && item?.cardId) {
      setSelectedCard(null);
      setActiveView('Inventory Dashboard');
      setNotificationOpen(false);
      updateNotification(id, { status: 'Opened', read: true, time: 'Just now' });
      emitDashboardAction(`Opened inventory for ${item?.cardName || 'new card'}`);
      return;
    }

    const statusMap: Record<string, string> = {
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
      'Open Thread': 'Opened'
    };
    updateNotification(id, { status: statusMap[action] ?? action, read: true, time: 'Just now' });
    emitDashboardAction(`Notification ${action.toLowerCase()} action completed`);
  };

  const verifiedInventoryCards = liveInventoryCards.filter((card) => card.isVerified);
  const pendingVerificationCards = liveInventoryCards.filter((card) => !card.isVerified);

  const topUtilityButtons = [
    { key: 'Realtime Overview', label: 'Pulse', icon: Activity },
    { key: 'Inventory Dashboard', label: 'Vault', icon: LayoutGrid },
    { key: 'Watchlist', label: 'Watch', icon: Star },
    { key: 'Market Activity', label: 'Radar', icon: Globe },
    { key: 'Reports', label: 'Reports', icon: FileText },
    { key: 'sync', label: 'Sync', icon: Database },
    { key: 'Settings', label: 'Config', icon: Settings },
    { key: 'security', label: 'Guard', icon: Shield },
  ] as const;

  const handleTopUtilityAction = (action: (typeof topUtilityButtons)[number]['key']) => {
    setProfileMenuOpen(false);

    if (action === 'sync') {
      setInventoryReloadToken((prev) => prev + 1);
      emitDashboardAction('Top bar sync started for inventory data');
      return;
    }

    if (action === 'security') {
      setActiveView('Settings');
      setSelectedCard(null);
      emitDashboardAction('Security controls opened');
      return;
    }

    setActiveView(action);
    setSelectedCard(null);
    emitDashboardAction(`${action} opened from top command strip`);
  };

  const exitDashboardToMainWeb = () => {
    emitDashboardAction('Returning to FODR main web');
    try {
      if (window.parent && window.parent !== window) {
        window.parent.postMessage({ type: 'FODR_DASHBOARD_CLOSE' }, '*');
        return;
      }
    } catch {
      // fall through to direct navigation
    }
    window.location.href = '/frontend/index.html';
  };

  const renderContent = () => {
    if (selectedCard) {
      return <CardDetailView card={selectedCard} onBack={() => setSelectedCard(null)} isDarkMode={isDarkMode} />;
    }

    switch (activeView) {
      case 'Realtime Overview': return <RealtimeOverview isDarkMode={isDarkMode} />;
      case 'My Realtime Overview':
        return (
          <MyRealtimeOverview
            isDarkMode={isDarkMode}
            cards={verifiedInventoryCards}
            loading={inventoryLoading}
            error={inventoryError}
            user={fodrUser}
          />
        );
      case 'Profile':
        return (
          <ProfileView
            isDarkMode={isDarkMode}
            user={fodrUser}
            cards={verifiedInventoryCards}
            allCards={liveInventoryCards}
          />
        );
      case 'Card Verification':
        return (
          <CardVerificationView
            isDarkMode={isDarkMode}
            cards={liveInventoryCards}
            loading={inventoryLoading}
            error={inventoryError}
            user={fodrUser}
            onReload={() => setInventoryReloadToken((prev) => prev + 1)}
          />
        );
      case 'Card Database':
        return <CardDatabaseView isDarkMode={isDarkMode} watchlistIds={watchlistIds} toggleWatchlist={toggleWatchlist} />;
      case 'Watchlist':
        return <WatchlistView isDarkMode={isDarkMode} watchlistIds={watchlistIds} toggleWatchlist={toggleWatchlist} />;
      case 'Market Activity': return <MarketActivityView isDarkMode={isDarkMode} />;
      case 'Top Cards':
        return <TopCardsView isDarkMode={isDarkMode} watchlistIds={watchlistIds} toggleWatchlist={toggleWatchlist} />;
      case 'Collections': return <CollectionsView isDarkMode={isDarkMode} />;
      case 'Rarity Index': return <RarityIndexView isDarkMode={isDarkMode} />;
      case 'Day on Day': return <DayOnDayView isDarkMode={isDarkMode} />;
      case 'Inventory Dashboard':
        return (
          <InventoryView
            onCardClick={setSelectedCard}
            cards={verifiedInventoryCards}
            loading={inventoryLoading}
            error={inventoryError}
            user={fodrUser}
            onReload={() => setInventoryReloadToken((prev) => prev + 1)}
          />
        );
      case 'Trading':
        return (
          <TradingView
            isDarkMode={isDarkMode}
            cards={verifiedInventoryCards}
            loading={inventoryLoading}
            error={inventoryError}
            user={fodrUser}
          />
        );
      case 'Chats':
        return (
          <ChatsView
            isDarkMode={isDarkMode}
            cards={verifiedInventoryCards}
            loading={inventoryLoading}
            error={inventoryError}
            user={fodrUser}
          />
        );
      case 'Negotiations':
        return (
          <NegotiationsView
            isDarkMode={isDarkMode}
            cards={verifiedInventoryCards}
            loading={inventoryLoading}
            error={inventoryError}
            user={fodrUser}
          />
        );
      case 'Social Media': return <PlaceholderView title="Social Media Intelligence" icon={Share2} />;
      case 'Data Sources': return <PlaceholderView title="Data Sources" icon={Database} />;
      case 'Command Center':
        return <OperationsDeckView isDarkMode={isDarkMode} config={operationsDeckConfigs['Command Center']} />;
      case 'Alert Lab':
        return <OperationsDeckView isDarkMode={isDarkMode} config={operationsDeckConfigs['Alert Lab']} />;
      case 'Vault Ops':
        return <OperationsDeckView isDarkMode={isDarkMode} config={operationsDeckConfigs['Vault Ops']} />;
      case 'Pricing Engine':
        return <OperationsDeckView isDarkMode={isDarkMode} config={operationsDeckConfigs['Pricing Engine']} />;
      case 'Signal Matrix':
        return <OperationsDeckView isDarkMode={isDarkMode} config={operationsDeckConfigs['Signal Matrix']} />;
      case 'Reports': return <ReportsView isDarkMode={isDarkMode} />;
      case 'Settings': return <SettingsView isDarkMode={isDarkMode} />;
      default: return <RealtimeOverview isDarkMode={isDarkMode} />;
    }
  };

  const notificationIconMap: Record<string, React.ElementType> = {
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
    card: Sparkles
  };
  const toneClass = (tone: string) => {
    if (tone === 'success') return 'bg-emerald-500/10 text-emerald-400';
    if (tone === 'warning') return 'bg-orange-500/10 text-orange-400';
    if (tone === 'danger') return 'bg-red-500/10 text-red-400';
    if (tone === 'info') return 'bg-blue-500/10 text-blue-400';
    return isDarkMode ? 'bg-white/5 text-gray-300' : 'bg-gray-100 text-gray-600';
  };

  return (
    <div className={cn("min-h-screen flex transition-colors duration-500", isDarkMode ? "bg-[#0a0a0a] text-white" : "bg-gray-50 text-gray-900")}>
      <GridLines />
      
      {/* Sidebar */}
      <aside className={cn(
        "w-64 border-r flex flex-col z-10 transition-colors duration-500",
        isDarkMode ? "bg-[#0a0a0a] border-white/5" : "bg-white border-gray-200"
      )}>
        <div className="p-6 flex items-center gap-3">
          <img
            src="/images/web-logo/logo-2.png"
            alt="FODR logo"
            className="h-12 w-auto object-contain drop-shadow-[0_6px_14px_rgba(0,0,0,0.18)]"
            loading="lazy"
          />
          <span className="font-black text-xl tracking-tighter uppercase">FODR</span>
          <button
            onClick={exitDashboardToMainWeb}
            className={cn(
              'ml-auto inline-flex items-center gap-2 rounded-2xl border px-3 py-2 text-[10px] font-bold uppercase tracking-widest transition-all',
              isDarkMode
                ? 'border-white/10 bg-white/5 text-gray-300 hover:border-orange-500/40 hover:text-orange-300'
                : 'border-gray-200 bg-gray-50 text-gray-600 hover:border-orange-300 hover:text-orange-500'
            )}
          >
            <ArrowLeft size={14} />
            <span>Exit</span>
          </button>
        </div>

        <nav className="flex-1 px-4 py-4 overflow-y-auto">
          <div className="mb-6">
            <p className="px-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Intelligence</p>
            <SidebarItem icon={Activity} label="Realtime Overview" active={activeView === 'Realtime Overview'} onClick={() => {setActiveView('Realtime Overview'); setSelectedCard(null);}} />
            <SidebarItem icon={Wallet} label="My Realtime Overview" active={activeView === 'My Realtime Overview'} onClick={() => {setActiveView('My Realtime Overview'); setSelectedCard(null);}} />
          </div>

          <div className="mb-6">
            <p className="px-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Portfolio</p>
            <SidebarItem icon={LayoutGrid} label="Inventory Dashboard" active={activeView === 'Inventory Dashboard'} onClick={() => {setActiveView('Inventory Dashboard'); setSelectedCard(null);}} />
            <SidebarItem
              icon={Shield}
              label="Card Verification"
              active={activeView === 'Card Verification'}
              onClick={() => {setActiveView('Card Verification'); setSelectedCard(null);}}
              badge={pendingVerificationCards.length > 0 ? String(pendingVerificationCards.length) : undefined}
            />
            <SidebarItem icon={TrendingUp} label="Trading" active={activeView === 'Trading'} onClick={() => {setActiveView('Trading'); setSelectedCard(null);}} />
            <SidebarItem
              icon={MessageSquare}
              label="Chats"
              active={activeView === 'Chats'}
              onClick={() => {setActiveView('Chats'); setSelectedCard(null);}}
              badge={verifiedInventoryCards.length > 0 ? String(Math.min(verifiedInventoryCards.length, 6)) : undefined}
            />
            <SidebarItem
              icon={Mail}
              label="Negotiations"
              active={activeView === 'Negotiations'}
              onClick={() => {setActiveView('Negotiations'); setSelectedCard(null);}}
              badge={verifiedInventoryCards.length > 0 ? String(Math.min(verifiedInventoryCards.length, 6)) : undefined}
            />
          </div>

          <div className="mb-6">
            <p className="px-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Market</p>
            <SidebarItem icon={BookOpen} label="Card Database" active={activeView === 'Card Database'} onClick={() => {setActiveView('Card Database'); setSelectedCard(null);}} />
            <SidebarItem icon={Star} label="Watchlist" active={activeView === 'Watchlist'} onClick={() => {setActiveView('Watchlist'); setSelectedCard(null);}} />
            <SidebarItem icon={BarChart3} label="Market Activity" active={activeView === 'Market Activity'} onClick={() => {setActiveView('Market Activity'); setSelectedCard(null);}} />
            <SidebarItem icon={Trophy} label="Top Cards" active={activeView === 'Top Cards'} onClick={() => {setActiveView('Top Cards'); setSelectedCard(null);}} />
          </div>

          <div className="mb-6">
            <p className="px-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Collections</p>
            <SidebarItem icon={Layers} label="Collections" active={activeView === 'Collections'} onClick={() => {setActiveView('Collections'); setSelectedCard(null);}} />
            <SidebarItem icon={Sparkles} label="Rarity Index" active={activeView === 'Rarity Index'} onClick={() => {setActiveView('Rarity Index'); setSelectedCard(null);}} />
          </div>

          <div className="mb-6">
            <p className="px-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Marketing</p>
            <SidebarItem icon={Share2} label="Social Media" active={activeView === 'Social Media'} onClick={() => {setActiveView('Social Media'); setSelectedCard(null);}} badge="New" />
            <SidebarItem icon={Database} label="Data Sources" active={activeView === 'Data Sources'} onClick={() => {setActiveView('Data Sources'); setSelectedCard(null);}} />
          </div>

          <div className="mb-6">
            <p className="px-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Operations</p>
            <SidebarItem icon={Zap} label="Command Center" active={activeView === 'Command Center'} onClick={() => {setActiveView('Command Center'); setSelectedCard(null);}} />
            <SidebarItem icon={Bell} label="Alert Lab" active={activeView === 'Alert Lab'} onClick={() => {setActiveView('Alert Lab'); setSelectedCard(null);}} />
            <SidebarItem icon={Shield} label="Vault Ops" active={activeView === 'Vault Ops'} onClick={() => {setActiveView('Vault Ops'); setSelectedCard(null);}} />
            <SidebarItem icon={BarChart3} label="Pricing Engine" active={activeView === 'Pricing Engine'} onClick={() => {setActiveView('Pricing Engine'); setSelectedCard(null);}} />
            <SidebarItem icon={Globe} label="Signal Matrix" active={activeView === 'Signal Matrix'} onClick={() => {setActiveView('Signal Matrix'); setSelectedCard(null);}} />
          </div>

          <div className="mt-auto pt-6 border-t border-gray-100 dark:border-white/5">
            <SidebarItem icon={FileText} label="Reports" active={activeView === 'Reports'} onClick={() => {setActiveView('Reports'); setSelectedCard(null);}} />
            <SidebarItem icon={Settings} label="Settings" active={activeView === 'Settings'} onClick={() => {setActiveView('Settings'); setSelectedCard(null);}} />
          </div>
        </nav>

      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative z-10">
        {/* Header */}
        <header className={cn(
          "h-20 border-b flex items-center justify-between px-8 transition-colors duration-500",
          isDarkMode ? "bg-[#0a0a0a]/80 border-white/5" : "bg-white/80 border-gray-200",
          "backdrop-blur-xl sticky top-0"
        )}>
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

          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-3 bg-gray-100 dark:bg-white/5 rounded-2xl text-gray-500 hover:text-orange-500 transition-all hover:rotate-12"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <div className="relative">
              <button
                onClick={() => setNotificationOpen((prev) => !prev)}
                className="p-3 bg-gray-100 dark:bg-white/5 rounded-2xl text-gray-500 hover:text-orange-500 transition-all relative"
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-orange-500 text-white text-[10px] font-bold flex items-center justify-center border-2 border-white dark:border-[#0a0a0a]">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {notificationOpen && (
                <div
                  className={cn(
                    "absolute right-0 mt-4 w-[420px] max-w-[90vw] rounded-3xl border shadow-2xl z-30 overflow-hidden",
                    isDarkMode ? "bg-[#0b0b0b] border-white/10" : "bg-white border-gray-200"
                  )}
                >
                  <div className="p-5 border-b border-white/5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="text-sm font-bold">Notifications</div>
                        <div className={cn("text-[10px] uppercase tracking-widest", isDarkMode ? "text-gray-400" : "text-gray-500")}>
                          {unreadCount} unread · {notifications.length} total
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={markAllNotificationsRead}
                          className={cn(
                            "px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-widest",
                            isDarkMode ? "bg-white/5 border border-white/10 text-gray-300" : "bg-gray-100 border border-gray-200 text-gray-600"
                          )}
                        >
                          Mark all read
                        </button>
                        <button
                          onClick={clearReadNotifications}
                          className={cn(
                            "px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-widest",
                            isDarkMode ? "bg-white/5 border border-white/10 text-gray-300" : "bg-gray-100 border border-gray-200 text-gray-600"
                          )}
                        >
                          Clear read
                        </button>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {notificationCategories.map((category) => {
                        const count = category === 'All'
                          ? notifications.length
                          : notifications.filter((item) => item.category === category).length;
                        return (
                          <button
                            key={category}
                            onClick={() => setNotificationFilter(category)}
                            className={cn(
                              "px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-colors",
                              notificationFilter === category
                                ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20"
                                : cn(isDarkMode ? "bg-white/5 text-gray-300" : "bg-gray-100 text-gray-600")
                            )}
                          >
                            {category} · {count}
                          </button>
                        );
                      })}
                      <button
                        onClick={() => setNotificationUnreadOnly((prev) => !prev)}
                        className={cn(
                          "px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest",
                          notificationUnreadOnly ? "bg-emerald-500/20 text-emerald-300" : cn(isDarkMode ? "bg-white/5 text-gray-300" : "bg-gray-100 text-gray-600")
                        )}
                      >
                        Unread only
                      </button>
                    </div>
                  </div>

                  <div className="max-h-[420px] overflow-y-auto">
                    {filteredNotifications.length === 0 ? (
                      <div className={cn("px-5 py-10 text-center text-sm", isDarkMode ? "text-gray-400" : "text-gray-500")}>
                        No notifications match your filters.
                      </div>
                    ) : (
                      <div className="p-4 space-y-3">
                        {filteredNotifications.map((item) => {
                          const Icon = notificationIconMap[item.type] ?? Bell;
                          return (
                            <div
                              key={item.id}
                              className={cn(
                                "rounded-2xl border p-4 transition-colors",
                                isDarkMode ? "bg-white/5 border-white/10" : "bg-gray-50 border-gray-200",
                                !item.read && "ring-1 ring-orange-500/40"
                              )}
                              onClick={() => updateNotification(item.id, { read: true })}
                            >
                              <div className="flex items-start gap-3">
                                <div className={cn("h-10 w-10 rounded-2xl flex items-center justify-center", toneClass(item.tone))}>
                                  <Icon size={18} />
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center justify-between gap-2">
                                    <div className="text-sm font-bold">{item.title}</div>
                                    <span className={cn("text-[10px] font-bold uppercase tracking-widest", isDarkMode ? "text-gray-400" : "text-gray-500")}>
                                      {item.time}
                                    </span>
                                  </div>
                                  <p className={cn("text-xs mt-1", isDarkMode ? "text-gray-400" : "text-gray-500")}>
                                    {item.message}
                                  </p>
                                  {item.verificationCode && (
                                    <div className="mt-3 rounded-xl border border-orange-500/20 bg-orange-500/5 px-3 py-2">
                                      <div className="text-[10px] font-bold uppercase tracking-widest text-orange-400">Verification Code</div>
                                      <div className="mt-1 break-all font-mono text-[11px] font-bold tracking-[0.18em] text-orange-300">
                                        {item.verificationCode}
                                      </div>
                                    </div>
                                  )}
                                  <div className="mt-3 flex flex-wrap items-center gap-2">
                                    <span className={cn("px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest", toneClass(item.tone))}>
                                      {item.status}
                                    </span>
                                    {!item.read && (
                                      <span className="px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest bg-orange-500/10 text-orange-400">
                                        New
                                      </span>
                                    )}
                                  </div>
                                  {item.actions && (
                                    <div className="mt-3 flex flex-wrap gap-2">
                                      {item.actions.map((action) => (
                                        <button
                                          key={action}
                                          onClick={(event) => {
                                            event.stopPropagation();
                                            handleNotificationAction(item.id, action);
                                          }}
                                          className={cn(
                                            "px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-colors",
                                            action === 'Decline' || action === 'Delist'
                                              ? "bg-red-500/20 text-red-300"
                                              : action === 'Accept'
                                                ? "bg-emerald-500/20 text-emerald-300"
                                                : cn(isDarkMode ? "bg-white/5 border border-white/10 text-gray-300" : "bg-white border border-gray-200 text-gray-600")
                                          )}
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
            <div className="flex items-center gap-2">
              {topUtilityButtons.map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => handleTopUtilityAction(key)}
                  title={label}
                  className={cn(
                    'group flex h-12 min-w-[52px] flex-col items-center justify-center rounded-2xl border px-2 transition-all',
                    isDarkMode
                      ? 'bg-white/5 border-white/10 text-gray-400 hover:border-orange-500/40 hover:text-orange-300'
                      : 'bg-white border-gray-200 text-gray-500 hover:border-orange-300 hover:text-orange-500'
                  )}
                >
                  <Icon size={16} />
                  <span className="mt-1 text-[9px] font-bold uppercase tracking-widest">{label}</span>
                </button>
              ))}
            </div>
            <div className="h-8 w-[1px] bg-gray-200 dark:bg-white/10 mx-2" />
            <button
              onClick={() => {
                setActiveView('Trading');
                setSelectedCard(null);
                emitDashboardAction('New Action launched in Trading Desk');
              }}
              className="flex items-center gap-2 px-4 py-2.5 bg-orange-500 text-white rounded-2xl text-sm font-bold hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/20 active:scale-95"
            >
              <Plus size={18} />
              <span>New Action</span>
            </button>
            <div className="relative">
              <button
                onClick={() => setProfileMenuOpen((prev) => !prev)}
                className={cn(
                  'flex items-center gap-3 rounded-2xl border px-3 py-2 transition-colors',
                  isDarkMode ? 'bg-white/5 border-white/10 hover:border-orange-500/40' : 'bg-white border-gray-200 hover:border-orange-300'
                )}
              >
                <img src="https://picsum.photos/seed/admin/40/40" alt="User" className="h-10 w-10 rounded-full" referrerPolicy="no-referrer" />
                <div className="text-left">
                  <div className="max-w-[120px] truncate text-sm font-bold">
                    {fodrUser?.username ? String(fodrUser.username) : 'FODR User'}
                  </div>
                  <div className="text-[10px] uppercase tracking-widest text-gray-400">Profile</div>
                </div>
                <MoreHorizontal size={18} className="text-gray-400" />
              </button>

              {profileMenuOpen && (
                <div
                  className={cn(
                    'absolute right-0 mt-3 w-60 rounded-2xl border p-3 text-[10px] font-bold uppercase tracking-widest shadow-2xl z-30',
                    isDarkMode ? 'bg-[#0b0b0b] border-white/10 text-gray-300' : 'bg-white border-gray-200 text-gray-600'
                  )}
                >
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => {
                        setActiveView('Profile');
                        setSelectedCard(null);
                        setProfileMenuOpen(false);
                        emitDashboardAction('Profile page opened');
                      }}
                      className="text-left hover:text-orange-400 transition-colors"
                    >
                      Open Profile
                    </button>
                    <button
                      onClick={() => {
                        setActiveView('Settings');
                        setSelectedCard(null);
                        setProfileMenuOpen(false);
                        emitDashboardAction('Profile settings opened');
                      }}
                      className="text-left hover:text-orange-400 transition-colors"
                    >
                      Profile Settings
                    </button>
                    <button
                      onClick={() => {
                        setActiveView('Inventory Dashboard');
                        setSelectedCard(null);
                        setProfileMenuOpen(false);
                        emitDashboardAction('Jumped to inventory dashboard');
                      }}
                      className="text-left hover:text-orange-400 transition-colors"
                    >
                      View Inventory
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* View Content */}
        <div className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeView + (selectedCard ? selectedCard.id : '')}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {dashboardToast && (
        <div className="fixed bottom-6 right-6 z-50 rounded-2xl border border-orange-500/30 bg-[#111111]/95 px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-orange-300 shadow-2xl shadow-orange-500/10">
          {dashboardToast}
        </div>
      )}
    </div>
  );
}
