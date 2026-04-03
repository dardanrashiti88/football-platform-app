const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { db, init, run, get, all, usePostgres, currentTimestampExpression } = require('./database/db');
const { createMetricsMiddleware, renderMetrics } = require('./monitoring/metrics');
const {
  ensureNewsArticlesSeeded,
  listNewsArticles,
  saveNewsArticle
} = require('./services/news-store');

const PORT = process.env.PORT || 3002;
const DEFAULT_COINS = 12500000000;
const SHARED_PRICES_PATH = path.join(__dirname, '..', 'shared', 'card-prices.json');
const SERVICE_NAME = 'fod-backend';
const ADMIN_EMAILS = new Set(
  String(process.env.FODR_ADMIN_EMAILS || '')
    .split(',')
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean)
);

const app = express();
app.use(cors());
app.use(express.json());
app.use(createMetricsMiddleware(SERVICE_NAME));

const setNoCacheHeaders = (res) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
  res.set('Surrogate-Control', 'no-store');
};

// Serve the frontend + images from the backend port (fixes "Cannot GET /frontend/...").
app.use('/images', express.static(path.join(__dirname, '..', 'images')));
app.use('/news', express.static(path.join(__dirname, '..', 'news')));
app.use(
  '/frontend',
  express.static(path.join(__dirname, '..', 'frontend'), {
    etag: false,
    lastModified: false,
    setHeaders: (res) => setNoCacheHeaders(res)
  })
);
app.use(
  '/mobile-version',
  express.static(path.join(__dirname, '..', 'mobile-version'), {
    etag: false,
    lastModified: false,
    setHeaders: (res) => setNoCacheHeaders(res)
  })
);
app.use('/playersinfo', express.static(path.join(__dirname, '..', 'db-api', 'comps-teamplayers-info')));
app.use(
  '/comps-teamplayers-info',
  express.static(path.join(__dirname, '..', 'db-api', 'comps-teamplayers-info'))
);
app.use('/shared', express.static(path.join(__dirname, '..', 'shared')));
app.use('/db-api', express.static(path.join(__dirname, '..', 'db-api')));
app.get('/metrics', (req, res) => {
  res.set('Content-Type', 'text/plain; version=0.0.4; charset=utf-8');
  res.send(renderMetrics(SERVICE_NAME));
});
app.get('/', (req, res) => res.redirect('/frontend/index.html'));
app.get('/mobile', (req, res) => {
  setNoCacheHeaders(res);
  res.redirect('/mobile-version/index.html?v=mobile45');
});
app.get('/mobile-match', (req, res) => {
  setNoCacheHeaders(res);
  const query = new URLSearchParams();
  if (req.query.matchId) {
    query.set('matchId', String(req.query.matchId));
  }
  if (req.query.competitionId) {
    query.set('competitionId', String(req.query.competitionId));
  }
  if (req.query.homeName) {
    query.set('homeName', String(req.query.homeName));
  }
  if (req.query.awayName) {
    query.set('awayName', String(req.query.awayName));
  }
  query.set('v', 'mobile45');
  res.redirect(`/mobile-version/match.html?${query.toString()}`);
});
app.get('/mobile-player', (req, res) => {
  setNoCacheHeaders(res);
  const query = new URLSearchParams();
  if (req.query.league) {
    query.set('league', String(req.query.league));
  }
  if (req.query.teamId) {
    query.set('teamId', String(req.query.teamId));
  }
  if (req.query.teamName) {
    query.set('teamName', String(req.query.teamName));
  }
  query.set('v', 'mobile45');
  res.redirect(`/mobile-version/player.html?${query.toString()}`);
});
app.get('/mobile-version', (req, res) => {
  setNoCacheHeaders(res);
  res.redirect('/mobile-version/index.html?v=mobile45');
});
app.get('/mobile-v5', (req, res) => {
  setNoCacheHeaders(res);
  res.redirect('/mobile-version/index.html?v=mobile45');
});
app.get('/mobile-v6', (req, res) => {
  setNoCacheHeaders(res);
  res.redirect('/mobile-version/index.html?v=mobile45');
});
app.get('/mobile-v7', (req, res) => {
  setNoCacheHeaders(res);
  res.redirect('/mobile-version/index.html?v=mobile45');
});
app.get('/mobile-v8', (req, res) => {
  setNoCacheHeaders(res);
  res.redirect('/mobile-version/index.html?v=mobile45');
});

const startupReady = init().then(() => ensureNewsArticlesSeeded());

const sanitizeUser = (user) => {
  if (!user) return null;
  const { password_hash, ...safe } = user;
  return safe;
};

const getCardOverrideKey = ({ name, card_name, club }) =>
  `${String(card_name || name || '').trim().toLowerCase()}::${String(club || '').trim().toLowerCase()}`;

const loadSharedCardPrices = () => {
  try {
    const raw = fs.readFileSync(SHARED_PRICES_PATH, 'utf8');
    const parsed = JSON.parse(raw);
    return parsed?.cards && typeof parsed.cards === 'object' ? parsed.cards : {};
  } catch {
    return {};
  }
};

const isAdminEmail = (email = '') => ADMIN_EMAILS.has(String(email).trim().toLowerCase());

const parseJsonField = (value, fallback) => {
  if (!value) return fallback;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
};

const COMPETITION_KEYS = [
  'premier',
  'ucl',
  'laliga',
  'bundesliga',
  'seriea',
  'championship',
  'ligue1',
  'facup',
  'carabaocup',
  'europa',
  'conference',
  'worldcup'
];

const COMPETITION_ALIASES = {
  'premier-league': 'premier',
  premierleague: 'premier',
  'champions-league': 'ucl',
  championsleague: 'ucl',
  'la-liga': 'laliga',
  'serie-a': 'seriea',
  'efl-championship': 'championship',
  'fa-cup': 'facup',
  'carabao-cup': 'carabaocup',
  'europa-league': 'europa',
  'conference-league': 'conference',
  'world-cup': 'worldcup'
};

const normalizeCompetitionKey = (value) => {
  const raw = typeof value === 'string' ? value.trim().toLowerCase() : '';
  if (!raw) return '';
  return COMPETITION_KEYS.includes(raw) ? raw : (COMPETITION_ALIASES[raw] || '');
};

const normalizeCompetitionLayout = (value) => {
  const allowed = new Set(COMPETITION_KEYS);
  const seen = new Set();
  return Array.from({ length: 12 }, (_, index) => {
    const item = Array.isArray(value) ? value[index] : null;
    const normalized = normalizeCompetitionKey(item);
    if (!normalized || !allowed.has(normalized) || seen.has(normalized)) return null;
    seen.add(normalized);
    return normalized;
  });
};

const DEFAULT_LAYOUT = normalizeCompetitionLayout([
  'premier',
  'ucl',
  'laliga',
  'bundesliga',
  'seriea',
  'championship'
]);

const DEFAULT_PREFERENCES = {
  homeLayout: DEFAULT_LAYOUT,
  sidebarLayout: DEFAULT_LAYOUT,
  favoriteTeam: '',
  favoriteLeagues: ['premier', 'ucl', 'laliga'],
  prioritizeFavoriteTeams: true,
  accentColor: '#e7c84b',
  notifications: {
    matches: true,
    goals: true,
    social: true,
    directMessages: true
  },
  onboardingComplete: false,
  updatedAt: null
};

const normalizePreferences = (raw = {}) => ({
  homeLayout: normalizeCompetitionLayout(raw.homeLayout || DEFAULT_PREFERENCES.homeLayout),
  sidebarLayout: normalizeCompetitionLayout(raw.sidebarLayout || DEFAULT_PREFERENCES.sidebarLayout),
  favoriteTeam: String(raw.favoriteTeam || '').trim(),
  favoriteLeagues: normalizeCompetitionLayout(raw.favoriteLeagues || DEFAULT_PREFERENCES.favoriteLeagues).filter(Boolean),
  prioritizeFavoriteTeams: raw.prioritizeFavoriteTeams !== false,
  accentColor: String(raw.accentColor || DEFAULT_PREFERENCES.accentColor).trim() || DEFAULT_PREFERENCES.accentColor,
  notifications: {
    matches: raw.notifications?.matches !== false,
    goals: raw.notifications?.goals !== false,
    social: raw.notifications?.social !== false,
    directMessages: raw.notifications?.directMessages !== false
  },
  onboardingComplete: Boolean(raw.onboardingComplete),
  updatedAt: raw.updatedAt ? String(raw.updatedAt) : null
});

const readPreferencesRecord = async (userId) => {
  const row = await get(
    `SELECT user_id, home_layout, sidebar_layout, favorite_team, favorite_leagues,
            prioritize_favorite_teams, accent_color, notifications, onboarding_completed, updated_at
       FROM user_preferences
      WHERE user_id = ?`,
    [userId]
  );

  if (!row) return { ...DEFAULT_PREFERENCES };

  return normalizePreferences({
    homeLayout: parseJsonField(row.home_layout, DEFAULT_PREFERENCES.homeLayout),
    sidebarLayout: parseJsonField(row.sidebar_layout, DEFAULT_PREFERENCES.sidebarLayout),
    favoriteTeam: row.favorite_team,
    favoriteLeagues: parseJsonField(row.favorite_leagues, DEFAULT_PREFERENCES.favoriteLeagues),
    prioritizeFavoriteTeams: Number(row.prioritize_favorite_teams) === 1,
    accentColor: row.accent_color,
    notifications: parseJsonField(row.notifications, DEFAULT_PREFERENCES.notifications),
    onboardingComplete: Number(row.onboarding_completed) === 1,
    updatedAt: row.updated_at
  });
};

const savePreferencesRecord = async (userId, rawPreferences = {}) => {
  const preferences = normalizePreferences({
    ...DEFAULT_PREFERENCES,
    ...rawPreferences,
    updatedAt: new Date().toISOString()
  });

  const payload = [
    JSON.stringify(preferences.homeLayout),
    JSON.stringify(preferences.sidebarLayout),
    preferences.favoriteTeam || null,
    JSON.stringify(preferences.favoriteLeagues),
    preferences.prioritizeFavoriteTeams ? 1 : 0,
    preferences.accentColor,
    JSON.stringify(preferences.notifications),
    preferences.onboardingComplete ? 1 : 0,
    preferences.updatedAt,
    userId
  ];

  const existing = await get('SELECT user_id FROM user_preferences WHERE user_id = ?', [userId]);
  if (existing) {
    await run(
      `UPDATE user_preferences
          SET home_layout = ?,
              sidebar_layout = ?,
              favorite_team = ?,
              favorite_leagues = ?,
              prioritize_favorite_teams = ?,
              accent_color = ?,
              notifications = ?,
              onboarding_completed = ?,
              updated_at = ?
        WHERE user_id = ?`,
      payload
    );
  } else {
    await run(
      `INSERT INTO user_preferences
        (home_layout, sidebar_layout, favorite_team, favorite_leagues, prioritize_favorite_teams, accent_color, notifications, onboarding_completed, updated_at, user_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      payload
    );
  }

  return readPreferencesRecord(userId);
};

const readCardgameState = async (userId) => {
  const row = await get('SELECT pack_state, updated_at FROM user_cardgame_state WHERE user_id = ?', [userId]);
  if (!row) return { packState: null, updatedAt: null };
  return {
    packState: parseJsonField(row.pack_state, null),
    updatedAt: row.updated_at || null
  };
};

const saveCardgameState = async (userId, packState) => {
  const serialized = JSON.stringify(packState || null);
  const updatedAt = new Date().toISOString();
  const existing = await get('SELECT user_id FROM user_cardgame_state WHERE user_id = ?', [userId]);

  if (existing) {
    await run(
      `UPDATE user_cardgame_state
          SET pack_state = ?,
              updated_at = ?
        WHERE user_id = ?`,
      [serialized, updatedAt, userId]
    );
  } else {
    await run(
      `INSERT INTO user_cardgame_state (pack_state, updated_at, user_id)
       VALUES (?, ?, ?)`,
      [serialized, updatedAt, userId]
    );
  }

  return readCardgameState(userId);
};

const requireAdminUser = async (userId) => {
  const user = await get('SELECT id, email, is_admin FROM users WHERE id = ?', [userId]);
  if (!user) return null;
  if (Number(user.is_admin) === 1 || isAdminEmail(user.email)) {
    if (Number(user.is_admin) !== 1) {
      await run('UPDATE users SET is_admin = 1 WHERE id = ?', [userId]);
    }
    return { ...user, is_admin: 1 };
  }
  return null;
};

const getCardOverride = (card) => loadSharedCardPrices()[getCardOverrideKey(card)] || null;

const applyCardOverride = (card) => {
  if (!card) return card;
  const override = getCardOverride(card);
  if (!override) return card;
  return {
    ...card,
    card_value: Number.isFinite(Number(override.value)) ? Number(override.value) : card.card_value,
    sell_value: Number.isFinite(Number(override.sell)) ? Number(override.sell) : card.sell_value
  };
};

const createVerificationCode = (card, userId) => {
  const playerSeed = String(card?.name || card?.card_name || 'card')
    .replace(/[^a-z0-9]/gi, '')
    .toUpperCase()
    .slice(0, 4)
    .padEnd(4, 'X');
  const randomSeed = crypto.randomBytes(2).toString('hex').toUpperCase();
  return `FODR-${playerSeed}-${String(userId).padStart(3, '0')}-${randomSeed}`;
};

const normalizeVerificationCode = (value) =>
  String(value || '')
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '');

const ensureWallet = async (userId) => {
  if (!userId) return null;
  const wallet = await get('SELECT user_id, coins FROM user_wallets WHERE user_id = ?', [userId]);
  if (wallet) return wallet;
  await run('INSERT INTO user_wallets (user_id, coins) VALUES (?, ?)', [userId, DEFAULT_COINS]);
  return { user_id: userId, coins: DEFAULT_COINS };
};

app.get('/api/health', (req, res) => {
  res.json({ ok: true, database: usePostgres ? 'postgres' : 'sqlite' });
});

app.get('/api/quiz/questions', async (req, res) => {
  try {
    const competition = String(req.query.competition || '').trim();
    const difficulty = String(req.query.difficulty || '').trim();
    const limitRaw = Number.parseInt(String(req.query.limit || '10'), 10);
    const limit = Number.isFinite(limitRaw) ? Math.min(30, Math.max(1, limitRaw)) : 10;

    if (!competition || !difficulty) {
      return res.status(400).json({ error: 'competition and difficulty are required.' });
    }

    const questions = await all(
      `SELECT id, prompt
       FROM quiz_questions
       WHERE competition = ? AND difficulty = ?
       ORDER BY RANDOM()
       LIMIT ?`,
      [competition, difficulty, limit]
    );

    if (!questions.length) {
      return res.json({ questions: [] });
    }

    const placeholders = questions.map(() => '?').join(', ');
    const optionRows = await all(
      `SELECT id, question_id, option_index, option_text, is_correct
       FROM quiz_options
       WHERE question_id IN (${placeholders})
       ORDER BY question_id ASC, option_index ASC`,
      questions.map((q) => q.id)
    );

    const byQuestion = new Map();
    optionRows.forEach((row) => {
      if (!byQuestion.has(row.question_id)) byQuestion.set(row.question_id, []);
      byQuestion.get(row.question_id).push(row);
    });

    const shaped = questions
      .map((q) => {
        const opts = byQuestion.get(q.id) || [];
        const options = opts
          .slice()
          .sort((a, b) => Number(a.option_index) - Number(b.option_index))
          .map((o) => o.option_text);
        const correctRow = opts.find((o) => Number(o.is_correct) === 1) || null;
        const correctIndex = correctRow ? Number(correctRow.option_index) : NaN;
        if (options.length !== 4 || !Number.isInteger(correctIndex)) return null;
        return { id: q.id, prompt: q.prompt, options, correctIndex };
      })
      .filter(Boolean);

    res.json({ questions: shaped });
  } catch (err) {
    console.error('Quiz questions error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

app.get('/api/quiz/count', async (req, res) => {
  try {
    const competition = String(req.query.competition || '').trim();
    if (!competition) {
      return res.status(400).json({ error: 'competition is required.' });
    }

    const rows = await all(
      `SELECT difficulty, COUNT(*) as n
       FROM quiz_questions
       WHERE competition = ?
       GROUP BY difficulty`,
      [competition]
    );

    const counts = { easy: 0, medium: 0, hard: 0 };
    rows.forEach((row) => {
      const key = String(row.difficulty || '').trim();
      if (!key) return;
      counts[key] = Number(row.n) || 0;
    });

    res.json({ competition, counts });
  } catch (err) {
    console.error('Quiz count error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

app.post('/api/auth/register', async (req, res) => {
  try {
    const {
      username,
      email,
      password,
      first_name,
      last_name,
      gender,
      dob
    } = req.body || {};

    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Username, email, and password are required.' });
    }

    const existing = await get('SELECT id FROM users WHERE email = ? OR username = ?', [email, username]);
    if (existing) {
      return res.status(409).json({ error: 'Email or username already exists.' });
    }

    const hash = await bcrypt.hash(password, 10);
    const userCountRow = await get('SELECT COUNT(*) as count FROM users');
    const shouldBeAdmin = Number(userCountRow?.count || 0) === 0 || isAdminEmail(email);
    await run(
      `INSERT INTO users (username, email, password_hash, first_name, last_name, gender, dob, is_admin)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
      , [username, email, hash, first_name || null, last_name || null, gender || null, dob || null, shouldBeAdmin ? 1 : 0]
    );

    const user = await get('SELECT * FROM users WHERE email = ?', [email]);
    if (user?.id) {
      await ensureWallet(user.id);
    }
    res.json({ user: sanitizeUser(user) });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const user = await get('SELECT * FROM users WHERE email = ?', [email]);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    if (isAdminEmail(user.email) && Number(user.is_admin) !== 1) {
      await run('UPDATE users SET is_admin = 1 WHERE id = ?', [user.id]);
      user.is_admin = 1;
    }

    await ensureWallet(user.id);
    res.json({ user: sanitizeUser(user) });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

app.get('/api/preferences/:userId', async (req, res) => {
  try {
    const userId = Number(req.params.userId);
    if (!userId) {
      return res.status(400).json({ error: 'Invalid user.' });
    }
    const preferences = await readPreferencesRecord(userId);
    res.json({ preferences });
  } catch (err) {
    console.error('Preferences read error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

app.put('/api/preferences/:userId', async (req, res) => {
  try {
    const userId = Number(req.params.userId);
    if (!userId) {
      return res.status(400).json({ error: 'Invalid user.' });
    }
    const preferences = await savePreferencesRecord(userId, req.body || {});
    res.json({ preferences });
  } catch (err) {
    console.error('Preferences save error:', err);
    res.status(500).json({ error: err.message || 'Server error.' });
  }
});

app.get('/api/news', async (req, res) => {
  try {
    const articles = await listNewsArticles();
    res.json({ articles });
  } catch (err) {
    console.error('News list error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

app.get('/api/admin/news', async (req, res) => {
  try {
    const userId = Number(req.query.userId);
    const adminUser = await requireAdminUser(userId);
    if (!adminUser) {
      return res.status(403).json({ error: 'Admin access is required.' });
    }
    const articles = await listNewsArticles({ includeUnpublished: true });
    res.json({ articles });
  } catch (err) {
    console.error('Admin news list error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

app.post('/api/admin/news', async (req, res) => {
  try {
    const userId = Number(req.body?.userId);
    const adminUser = await requireAdminUser(userId);
    if (!adminUser) {
      return res.status(403).json({ error: 'Admin access is required.' });
    }
    const article = await saveNewsArticle({
      payload: req.body || {},
      authorUserId: userId
    });
    res.json({ article });
  } catch (err) {
    console.error('Admin news create error:', err);
    res.status(500).json({ error: err.message || 'Server error.' });
  }
});

app.put('/api/admin/news/:articleId', async (req, res) => {
  try {
    const userId = Number(req.body?.userId);
    const articleId = Number(req.params.articleId);
    const adminUser = await requireAdminUser(userId);
    if (!adminUser) {
      return res.status(403).json({ error: 'Admin access is required.' });
    }
    if (!articleId) {
      return res.status(400).json({ error: 'Invalid article.' });
    }
    const article = await saveNewsArticle({
      articleId,
      payload: req.body || {},
      authorUserId: userId
    });
    res.json({ article });
  } catch (err) {
    console.error('Admin news update error:', err);
    res.status(500).json({ error: err.message || 'Server error.' });
  }
});

app.get('/api/cardgame/balance/:userId', async (req, res) => {
  try {
    const userId = Number(req.params.userId);
    if (!userId) {
      return res.status(400).json({ error: 'Invalid user.' });
    }
    const wallet = await ensureWallet(userId);
    res.json({ coins: wallet.coins });
  } catch (err) {
    console.error('Balance error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

app.post('/api/cardgame/purchase', async (req, res) => {
  try {
    const { userId, cost } = req.body || {};
    const parsedUser = Number(userId);
    const parsedCost = Number(cost);
    if (!parsedUser || !Number.isFinite(parsedCost) || parsedCost <= 0) {
      return res.status(400).json({ error: 'Invalid purchase request.' });
    }
    const wallet = await ensureWallet(parsedUser);
    if (wallet.coins < parsedCost) {
      return res.status(400).json({ error: 'Not enough coins.' });
    }
    const nextCoins = wallet.coins - parsedCost;
    await run(`UPDATE user_wallets SET coins = ?, updated_at = ${currentTimestampExpression} WHERE user_id = ?`, [
      nextCoins,
      parsedUser
    ]);
    res.json({ coins: nextCoins });
  } catch (err) {
    console.error('Purchase error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

app.post('/api/cardgame/sell', async (req, res) => {
  try {
    const { userId, amount } = req.body || {};
    const parsedUser = Number(userId);
    const parsedAmount = Number(amount);
    if (!parsedUser || !Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      return res.status(400).json({ error: 'Invalid sell request.' });
    }
    const wallet = await ensureWallet(parsedUser);
    const nextCoins = wallet.coins + parsedAmount;
    await run(`UPDATE user_wallets SET coins = ?, updated_at = ${currentTimestampExpression} WHERE user_id = ?`, [
      nextCoins,
      parsedUser
    ]);
    res.json({ coins: nextCoins });
  } catch (err) {
    console.error('Sell error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

app.post('/api/cardgame/quest-reward', async (req, res) => {
  try {
    const { userId, amount } = req.body || {};
    const parsedUser = Number(userId);
    const parsedAmount = Number(amount);
    if (!parsedUser || !Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      return res.status(400).json({ error: 'Invalid quest reward request.' });
    }
    const wallet = await ensureWallet(parsedUser);
    const nextCoins = wallet.coins + parsedAmount;
    await run(`UPDATE user_wallets SET coins = ?, updated_at = ${currentTimestampExpression} WHERE user_id = ?`, [
      nextCoins,
      parsedUser
    ]);
    res.json({ coins: nextCoins, rewarded: parsedAmount });
  } catch (err) {
    console.error('Quest reward error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

app.get('/api/cardgame/state/:userId', async (req, res) => {
  try {
    const userId = Number(req.params.userId);
    if (!userId) {
      return res.status(400).json({ error: 'Invalid user.' });
    }
    const state = await readCardgameState(userId);
    res.json(state);
  } catch (err) {
    console.error('Cardgame state read error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

app.put('/api/cardgame/state/:userId', async (req, res) => {
  try {
    const userId = Number(req.params.userId);
    if (!userId) {
      return res.status(400).json({ error: 'Invalid user.' });
    }
    const state = await saveCardgameState(userId, req.body?.packState || null);
    res.json(state);
  } catch (err) {
    console.error('Cardgame state save error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

app.post('/api/cardgame/inventory/add', async (req, res) => {
  try {
    const { userId, card } = req.body || {};
    const parsedUser = Number(userId);
    if (!parsedUser || !card || !card.name || !card.image) {
      return res.status(400).json({ error: 'Invalid card payload.' });
    }
    await ensureWallet(parsedUser);
    const override = getCardOverride({ name: card.name, club: card.club });
    const verificationCode = createVerificationCode(card, parsedUser);
    const result = await run(
      `INSERT INTO user_cards
        (user_id, card_name, card_position, club, started, card_value, sell_value, card_note, image, is_verified, verification_status, verification_code, verified_at, acquired_via)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        parsedUser,
        card.name,
        card.position || null,
        card.club || null,
        card.started || null,
        Number.isFinite(Number(override?.value)) ? Number(override.value) : (Number(card.value) || null),
        Number.isFinite(Number(override?.sell)) ? Number(override.sell) : (Number(card.sell) || null),
        card.note || null,
        card.image,
        0,
        'pending',
        verificationCode,
        null,
        card.acquiredVia || 'new'
      ]
    );
    res.json({ cardId: result.lastID, verificationCode, verificationStatus: 'pending' });
  } catch (err) {
    console.error('Inventory add error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

app.get('/api/cardgame/inventory/:userId', async (req, res) => {
  try {
    const userId = Number(req.params.userId);
    if (!userId) {
      return res.status(400).json({ error: 'Invalid user.' });
    }
    await ensureWallet(userId);
    const rows = await all(
      `SELECT id, card_name, card_position, club, started, card_value, sell_value, card_note, image, created_at,
              is_verified, verification_status, verification_code, verified_at, acquired_via
         FROM user_cards
        WHERE user_id = ?
        ORDER BY created_at DESC`,
      [userId]
    );
    res.json({ cards: rows.map((row) => applyCardOverride(row)) });
  } catch (err) {
    console.error('Inventory list error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

app.post('/api/cardgame/inventory/verify', async (req, res) => {
  try {
    const { userId, cardId, verificationCode } = req.body || {};
    const parsedUser = Number(userId);
    const parsedCard = Number(cardId);
    if (!parsedUser || !parsedCard) {
      return res.status(400).json({ error: 'Invalid verification request.' });
    }

    const card = await get(
      `SELECT id, user_id, card_name, club, is_verified, verification_status, verification_code
         FROM user_cards
        WHERE id = ? AND user_id = ?`,
      [parsedCard, parsedUser]
    );

    if (!card) {
      return res.status(404).json({ error: 'Card not found.' });
    }

    if (Number(card.is_verified) === 1) {
      return res.json({
        ok: true,
        cardId: parsedCard,
        verificationStatus: 'verified',
        verificationCode: card.verification_code,
      });
    }

    const submittedCode = normalizeVerificationCode(verificationCode);
    const expectedCode = normalizeVerificationCode(card.verification_code);

    if (!submittedCode) {
      return res.status(400).json({ error: 'Paste or type the verification code first.' });
    }

    if (!expectedCode || submittedCode !== expectedCode) {
      return res.status(400).json({ error: 'Verification code does not match this card.' });
    }

    await run(
      `UPDATE user_cards
          SET is_verified = 1,
              verification_status = 'verified',
              verified_at = ${currentTimestampExpression}
        WHERE id = ? AND user_id = ?`,
      [parsedCard, parsedUser]
    );

    res.json({
      ok: true,
      cardId: parsedCard,
      verificationStatus: 'verified',
      verificationCode: card.verification_code,
    });
  } catch (err) {
    console.error('Inventory verify error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

app.post('/api/cardgame/inventory/sell', async (req, res) => {
  try {
    const { userId, cardId } = req.body || {};
    const parsedUser = Number(userId);
    const parsedCard = Number(cardId);
    if (!parsedUser || !parsedCard) {
      return res.status(400).json({ error: 'Invalid sell request.' });
    }
    const card = await get(
      'SELECT id, card_name, club, sell_value FROM user_cards WHERE id = ? AND user_id = ?',
      [parsedCard, parsedUser]
    );
    if (!card) {
      return res.status(404).json({ error: 'Card not found.' });
    }
    const wallet = await ensureWallet(parsedUser);
    const sellValue = Number(applyCardOverride(card)?.sell_value) || 0;
    const nextCoins = wallet.coins + sellValue;
    await run('DELETE FROM user_cards WHERE id = ? AND user_id = ?', [parsedCard, parsedUser]);
    await run(`UPDATE user_wallets SET coins = ?, updated_at = ${currentTimestampExpression} WHERE user_id = ?`, [
      nextCoins,
      parsedUser
    ]);
    res.json({ coins: nextCoins });
  } catch (err) {
    console.error('Inventory sell error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

const startServer = async () => {
  await startupReady;
  const HOST = process.env.HOST || '0.0.0.0';
  return new Promise((resolve, reject) => {
    const server = app.listen(PORT, HOST, () => {
      const displayHost = HOST === '0.0.0.0' ? 'localhost' : HOST;
      console.log(`FODR backend running on http://${displayHost}:${PORT}`);
      resolve(server);
    });
    server.on('error', reject);
  });
};

if (require.main === module) {
  startServer().catch((err) => {
    console.error('DB init error:', err);
    process.exit(1);
  });
}

module.exports = { app, startServer, startupReady };
