import React, { useEffect, useRef, useState } from 'react';
import { cn } from '../../lib/cn';

type SelectedSetPanelProps = {
  selectedSet: any;
  panelBg: string;
  panelBorder: string;
  muted: string;
  showMissing: boolean;
  buildSetCards: (set: any) => any[];
  onClose: () => void;
};

export function SelectedSetPanel({
  selectedSet,
  panelBg,
  panelBorder,
  muted,
  showMissing,
  buildSetCards,
  onClose,
}: SelectedSetPanelProps) {
  const [activeCard, setActiveCard] = useState<any | null>(null);
  const [noteDraft, setNoteDraft] = useState('');
  const [notesByCard, setNotesByCard] = useState<Record<string, string>>(() => {
    if (typeof window === 'undefined') return {};
    try {
      const raw = window.localStorage.getItem('fodrCollectionNotes');
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  });
  const noteInputRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    setActiveCard(null);
    setNoteDraft('');
  }, [selectedSet?.id]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem('fodrCollectionNotes', JSON.stringify(notesByCard));
  }, [notesByCard]);

  const getNoteKey = (card: any) => `${selectedSet?.id ?? 'collection'}:${card?.id ?? card?.name ?? 'card'}`;

  const openCard = (card: any, focusNote = false) => {
    setActiveCard(card);
    const key = getNoteKey(card);
    setNoteDraft(notesByCard[key] ?? '');
    if (focusNote) {
      setTimeout(() => noteInputRef.current?.focus(), 0);
    }
  };

  const saveNote = () => {
    if (!activeCard) return;
    const key = getNoteKey(activeCard);
    setNotesByCard((prev) => ({ ...prev, [key]: noteDraft.trim() }));
  };

  return (
    <div className={cn('rounded-3xl border p-6', panelBorder, panelBg)}>
      <div className="flex items-center justify-between">
        <div>
          <div className="text-lg font-bold">{selectedSet.name} Cards</div>
          <div className={cn('text-[10px] uppercase tracking-widest', muted)}>
            {selectedSet.total} total · {selectedSet.owned} owned · {selectedSet.total - selectedSet.owned} missing
          </div>
        </div>
        <button onClick={onClose} className={cn('px-3 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest', panelBg, panelBorder, muted)} type="button">
          Close
        </button>
      </div>

      {activeCard && (
        <div className={cn('mt-4 rounded-2xl border p-4', panelBorder, panelBg)}>
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="w-full max-w-[180px]">
              <div className={cn('h-[240px] rounded-2xl overflow-hidden border flex items-center justify-center', panelBorder, panelBg)}>
                {activeCard.image ? (
                  <img src={activeCard.image} alt={activeCard.name} className="h-full w-full object-contain" />
                ) : (
                  <div className={cn('text-xs font-bold uppercase tracking-widest', muted)}>No Image</div>
                )}
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-lg font-bold">{activeCard.name}</div>
                  <div className={cn('text-[10px] uppercase tracking-widest', muted)}>
                    {activeCard.rarity} · {activeCard.serial}
                  </div>
                </div>
                <div className="text-right">
                  <div className={cn('text-[10px] uppercase tracking-widest', muted)}>Value</div>
                  <div className="text-lg font-bold text-orange-400">{activeCard.value}</div>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-3 text-xs">
                <div className={cn('rounded-xl border px-3 py-2', panelBorder, panelBg)}>
                  <div className={cn('text-[10px] uppercase tracking-widest', muted)}>Team</div>
                  <div className="font-bold">{activeCard.team || 'Unknown'}</div>
                </div>
              </div>
              <div className="mt-4">
                <div className={cn('text-[10px] uppercase tracking-widest', muted)}>Card Note</div>
                <textarea
                  ref={noteInputRef}
                  value={noteDraft}
                  onChange={(e) => setNoteDraft(e.target.value)}
                  placeholder="Add a personal note about this card..."
                  className={cn('mt-2 w-full min-h-[90px] rounded-xl border px-3 py-2 text-xs font-medium outline-none', panelBg, panelBorder, muted)}
                />
                <div className="mt-3 flex flex-wrap gap-2">
                  <button onClick={saveNote} className="px-3 py-2 rounded-lg bg-orange-500 text-[10px] font-bold uppercase tracking-widest text-white" type="button">
                    Save Note
                  </button>
                  <button onClick={() => setActiveCard(null)} className={cn('px-3 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest', panelBg, panelBorder, muted)} type="button">
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

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
                <span className={cn('px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest', card.status === 'Owned' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-orange-500/20 text-orange-300')}>
                  {card.status}
                </span>
              </div>
              <div className="mt-3 flex items-center justify-between text-xs">
                <span className={muted}>Estimated Value</span>
                <span className="font-bold text-orange-400">{card.value}</span>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  onClick={() => openCard(card, false)}
                  disabled={card.status !== 'Owned'}
                  className={cn('px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest', card.status === 'Owned' ? cn(panelBg, panelBorder, muted) : 'cursor-not-allowed opacity-50')}
                  type="button"
                >
                  View Card
                </button>
                <button
                  onClick={() => openCard(card, true)}
                  disabled={card.status !== 'Owned'}
                  className={cn('px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest', card.status === 'Owned' ? cn(panelBg, panelBorder, muted) : 'cursor-not-allowed opacity-50')}
                  type="button"
                >
                  Add Note
                </button>
                {card.status === 'Missing' && (
                  <button className="px-2 py-1 rounded-lg bg-orange-500 text-[10px] font-bold uppercase tracking-widest text-white" type="button">
                    Find Card
                  </button>
                )}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

