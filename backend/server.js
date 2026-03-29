const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { db, init, run, get, all } = require('./database/db');

const PORT = process.env.PORT || 3002;
const DEFAULT_COINS = 12500000000;
const SHARED_PRICES_PATH = path.join(__dirname, '..', 'shared', 'card-prices.json');

const app = express();
app.use(cors());
app.use(express.json());

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

init().catch((err) => {
  console.error('DB init error:', err);
  process.exit(1);
});

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
  res.json({ ok: true });
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
    await run(
      `INSERT INTO users (username, email, password_hash, first_name, last_name, gender, dob)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
      , [username, email, hash, first_name || null, last_name || null, gender || null, dob || null]
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

    await ensureWallet(user.id);
    res.json({ user: sanitizeUser(user) });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error.' });
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
    await run('UPDATE user_wallets SET coins = ?, updated_at = datetime(\'now\') WHERE user_id = ?', [
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
    await run('UPDATE user_wallets SET coins = ?, updated_at = datetime(\'now\') WHERE user_id = ?', [
      nextCoins,
      parsedUser
    ]);
    res.json({ coins: nextCoins });
  } catch (err) {
    console.error('Sell error:', err);
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
              verified_at = datetime('now')
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
    await run('UPDATE user_wallets SET coins = ?, updated_at = datetime(\'now\') WHERE user_id = ?', [
      nextCoins,
      parsedUser
    ]);
    res.json({ coins: nextCoins });
  } catch (err) {
    console.error('Inventory sell error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

const startServer = () => {
  const HOST = process.env.HOST || '0.0.0.0';
  app.listen(PORT, HOST, () => {
    const displayHost = HOST === '0.0.0.0' ? 'localhost' : HOST;
    console.log(`FODR backend running on http://${displayHost}:${PORT}`);
  });
};

if (require.main === module) {
  startServer();
}

module.exports = { app, startServer };
