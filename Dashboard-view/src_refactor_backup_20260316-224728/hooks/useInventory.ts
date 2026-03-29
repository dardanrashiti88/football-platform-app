import { useCallback, useEffect, useRef, useState } from 'react';
import { API_BASE } from '../lib/config';
import { buildTopCards, toDashboardCard } from '../lib/cards';
import type { DashboardCard, TopCardSummary } from '../types';

type InventoryState = {
  cards: DashboardCard[];
  topCards: TopCardSummary[];
  loading: boolean;
  error: string | null;
};

export function useInventory(userId: number | null) {
  const [state, setState] = useState<InventoryState>({
    cards: [],
    topCards: [],
    loading: false,
    error: null,
  });
  const abortRef = useRef<AbortController | null>(null);

  const load = useCallback(async () => {
    abortRef.current?.abort();
    abortRef.current = new AbortController();

    if (!userId) {
      setState({ cards: [], topCards: [], loading: false, error: null });
      return;
    }

    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const res = await fetch(`${API_BASE}/cardgame/inventory/${userId}`, {
        signal: abortRef.current.signal,
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setState((prev) => ({ ...prev, loading: false, error: data?.error || 'Failed to load inventory' }));
        return;
      }

      const cards = Array.isArray(data.cards) ? data.cards.map(toDashboardCard) : [];
      const topCards = cards.length ? buildTopCards(cards) : [];
      setState({ cards, topCards, loading: false, error: null });
    } catch (err: any) {
      if (err?.name === 'AbortError') return;
      setState((prev) => ({ ...prev, loading: false, error: 'Failed to load inventory' }));
    }
  }, [userId]);

  useEffect(() => {
    load();
    return () => abortRef.current?.abort();
  }, [load]);

  useEffect(() => {
    if (typeof BroadcastChannel === 'undefined') return;
    const channel = new BroadcastChannel('fodr-inventory');
    const onMessage = () => load();
    channel.addEventListener('message', onMessage);
    return () => {
      channel.removeEventListener('message', onMessage);
      channel.close();
    };
  }, [load]);

  return {
    ...state,
    reload: load,
  };
}

