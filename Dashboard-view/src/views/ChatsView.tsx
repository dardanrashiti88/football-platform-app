import { useEffect, useState } from 'react';
import { cn } from '../lib/cn';

type DashboardCard = {
  id: string | number;
  name?: string;
  edition?: string;
};

type DashboardUser =
  | {
      id?: string | number;
      userId?: string | number;
      email?: string;
      username?: string;
    }
  | null;

type ChatMessage = {
  id: string;
  from: 'you';
  text: string;
  createdAt: string;
};

type ChatConversation = {
  id: string;
  cardId: string;
  handle: string;
  label: string;
  updatedAt: string;
  createdAt: string;
  messages: ChatMessage[];
};

type ChatsViewProps = {
  isDarkMode: boolean;
  cards: DashboardCard[];
  loading: boolean;
  error: string | null;
  user: DashboardUser;
  onAction: (message: string) => void;
};

const sortConversations = (items: ChatConversation[]) =>
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

export const ChatsView = ({
  isDarkMode,
  cards,
  loading,
  error,
  user,
  onAction,
}: ChatsViewProps) => {
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
  const [conversations, setConversations] = useState<ChatConversation[]>([]);

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

  const activeConversation =
    conversations.find((conversation) => conversation.id === selectedChatId) ?? conversations[0] ?? null;
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
    const thread: ChatConversation = {
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
    onAction(`Chat opened with @${cleanedHandle} about ${selectedCard.name}`);
  };

  const sendMessage = () => {
    if (!activeConversation || !messageInput.trim()) return;
    const createdAt = new Date().toISOString();
    const nextMessage: ChatMessage = {
      id: `msg-${activeConversation.id}-${Date.now()}`,
      from: 'you',
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
    onAction(`Message sent to ${activeConversation.label} about ${activeCard?.name || 'your card'}`);
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
                  onClick={() => onAction(`Negotiation thread opened for ${activeCard?.name || 'selected card'}`)}
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
