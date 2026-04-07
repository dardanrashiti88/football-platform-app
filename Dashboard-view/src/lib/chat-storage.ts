export type DashboardUser =
  | {
      id?: string | number;
      userId?: string | number;
      email?: string;
      username?: string;
    }
  | null;

export type ChatMessage = {
  id: string;
  from: 'you' | 'them';
  text: string;
  createdAt: string;
  read?: boolean;
};

export type ChatConversation = {
  id: string;
  cardId: string;
  handle: string;
  label: string;
  updatedAt: string;
  createdAt: string;
  messages: ChatMessage[];
};

export const DASHBOARD_CHAT_STORAGE_EVENT = 'fodr-dashboard-chats-updated';

export const getDashboardChatStorageKey = (user: DashboardUser) =>
  user
    ? `fodr-dashboard-chats:${String(user?.id ?? user?.userId ?? user?.email ?? user?.username ?? 'user')}`
    : null;

export const buildChatLabelFromHandle = (value: string) =>
  String(value || '')
    .trim()
    .replace(/^@+/, '')
    .split(/[\s._-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ') || 'Collector';

export const sortChatConversations = (items: ChatConversation[]) =>
  [...items].sort((a, b) => {
    const left = new Date(b.updatedAt || b.createdAt).getTime();
    const right = new Date(a.updatedAt || a.createdAt).getTime();
    return left - right;
  });

export const normalizeChatConversations = (
  raw: unknown,
  validCardIds?: Set<string>,
) => {
  if (!Array.isArray(raw)) return [] as ChatConversation[];

  return raw
    .filter((item) => item && typeof item === 'object')
    .filter((item) => {
      if (!validCardIds) return true;
      return validCardIds.has(String((item as { cardId?: string | number }).cardId || ''));
    })
    .map((item) => {
      const base = item as Partial<ChatConversation> & { messages?: unknown[] };
      const handle = String(base.handle || '').replace(/^@+/, '') || 'collector';
      const createdAt = String(base.createdAt || base.updatedAt || new Date().toISOString());
      const messages = Array.isArray(base.messages)
        ? base.messages
            .filter((message) => message && typeof message === 'object')
            .map((message, index) => {
              const entry = message as Partial<ChatMessage>;
              const from = entry.from === 'them' ? 'them' : 'you';
              const text = String(entry.text || '').trim();
              return {
                id: String(entry.id || `msg-${Date.now()}-${index}`),
                from,
                text,
                createdAt: String(entry.createdAt || createdAt),
                read: from === 'them' ? Boolean(entry.read) : true,
              } satisfies ChatMessage;
            })
            .filter((message) => message.text)
        : [];

      return {
        id: String(base.id || `chat-${base.cardId || handle}`),
        cardId: String(base.cardId || ''),
        handle,
        label: String(base.label || buildChatLabelFromHandle(handle)),
        updatedAt: String(base.updatedAt || messages[messages.length - 1]?.createdAt || createdAt),
        createdAt,
        messages,
      } satisfies ChatConversation;
    });
};

export const readDashboardChats = (
  storageKey: string | null,
  validCardIds?: Set<string>,
) => {
  if (!storageKey || typeof window === 'undefined') return [] as ChatConversation[];

  try {
    const raw = localStorage.getItem(storageKey);
    const parsed = raw ? JSON.parse(raw) : [];
    return sortChatConversations(normalizeChatConversations(parsed, validCardIds));
  } catch {
    return [] as ChatConversation[];
  }
};

export const countConversationUnreadMessages = (conversation: ChatConversation) =>
  conversation.messages.filter((message) => message.from === 'them' && !message.read).length;

export const countUnreadChatUsers = (conversations: ChatConversation[]) =>
  new Set(
    conversations
      .filter((conversation) => countConversationUnreadMessages(conversation) > 0)
      .map((conversation) => conversation.handle || conversation.id),
  ).size;

export const markConversationAsRead = (conversation: ChatConversation) => {
  let changed = false;
  const messages = conversation.messages.map((message) => {
    if (message.from !== 'them' || message.read) return message;
    changed = true;
    return {
      ...message,
      read: true,
    };
  });

  if (!changed) return conversation;
  return {
    ...conversation,
    messages,
  };
};

export const persistDashboardChats = (
  storageKey: string | null,
  conversations: ChatConversation[],
) => {
  if (!storageKey || typeof window === 'undefined') return;

  try {
    const normalized = sortChatConversations(normalizeChatConversations(conversations));
    localStorage.setItem(storageKey, JSON.stringify(normalized));
    window.dispatchEvent(
      new CustomEvent(DASHBOARD_CHAT_STORAGE_EVENT, {
        detail: {
          storageKey,
          unreadUsers: countUnreadChatUsers(normalized),
        },
      }),
    );
  } catch {
    // Ignore storage failures for dashboard chats.
  }
};
