const path = require('path');
const fs = require('fs');
const usePostgres =
  String(process.env.DB_CLIENT || '').toLowerCase() === 'postgres'
  || Boolean(process.env.DATABASE_URL || process.env.FODR_DATABASE_URL);

const normalizeSqlForPg = (sql) => {
  let index = 0;
  return String(sql).replace(/\?/g, () => {
    index += 1;
    return `$${index}`;
  });
};

const adaptInsertSqlForPg = (sql) => {
  const trimmed = String(sql).trim().replace(/;$/, '');
  if (/^insert\s+/i.test(trimmed) && !/\breturning\b/i.test(trimmed)) {
    return `${trimmed} RETURNING *`;
  }
  return trimmed;
};

const toSqliteTimestampExpression = "datetime('now')";
const toPostgresTimestampExpression = 'NOW()';
const currentTimestampExpression = usePostgres
  ? toPostgresTimestampExpression
  : toSqliteTimestampExpression;

let db = null;
let dbPath = null;

if (usePostgres) {
  // Load pg only when Postgres is enabled so SQLite-only installs keep working.
  const { Pool } = require('pg');
  db = new Pool({
    connectionString: process.env.DATABASE_URL || process.env.FODR_DATABASE_URL
  });
} else {
  const sqlite3 = require('sqlite3').verbose();
  const defaultDbPath = path.join(__dirname, 'fodr.sqlite');
  const envDbPath = process.env.FODR_DB_PATH;
  const envIsTmp = envDbPath && envDbPath.includes('/tmp');
  const hasDefaultDb = fs.existsSync(defaultDbPath) && fs.statSync(defaultDbPath).size > 0;

  const resolveDbPath = () => {
    if (!envDbPath) return defaultDbPath;
    if (!envIsTmp) return envDbPath;
    if (fs.existsSync(envDbPath)) return envDbPath;

    fs.mkdirSync(path.dirname(envDbPath), { recursive: true });
    if (hasDefaultDb) {
      fs.copyFileSync(defaultDbPath, envDbPath);
    }
    return envDbPath;
  };

  dbPath = resolveDbPath();
  db = new sqlite3.Database(dbPath);
}

const run = async (sql, params = []) => {
  if (usePostgres) {
    const result = await db.query(normalizeSqlForPg(adaptInsertSqlForPg(sql)), params);
    const firstRow = result.rows?.[0] || null;
    return {
      lastID: firstRow?.id ?? firstRow?.user_id ?? null,
      changes: result.rowCount || 0,
      rows: result.rows || []
    };
  }

  return new Promise((resolve, reject) => {
    db.run(sql, params, function onRun(err) {
      if (err) reject(err);
      else resolve(this);
    });
  });
};

const get = async (sql, params = []) => {
  if (usePostgres) {
    const result = await db.query(normalizeSqlForPg(sql), params);
    return result.rows?.[0] || null;
  }

  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

const all = async (sql, params = []) => {
  if (usePostgres) {
    const result = await db.query(normalizeSqlForPg(sql), params);
    return result.rows || [];
  }

  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

const ensureColumn = async (table, name, definition) => {
  if (usePostgres) {
    const columns = await all(
      `SELECT column_name
         FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = ?`,
      [table]
    );
    if (columns.some((column) => column.column_name === name)) return;
    await run(`ALTER TABLE ${table} ADD COLUMN ${name} ${definition}`);
    return;
  }

  const columns = await all(`PRAGMA table_info(${table})`);
  if (columns.some((column) => column.name === name)) return;
  await run(`ALTER TABLE ${table} ADD COLUMN ${name} ${definition}`);
};

const init = async () => {
  if (usePostgres) {
    await run(
      `CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username TEXT NOT NULL UNIQUE,
        email TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        first_name TEXT,
        last_name TEXT,
        gender TEXT,
        dob TEXT,
        is_admin INTEGER NOT NULL DEFAULT 0,
        created_at TIMESTAMPTZ DEFAULT (${toPostgresTimestampExpression})
      )`
    );

    await run(
      `CREATE TABLE IF NOT EXISTS user_wallets (
        user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
        coins BIGINT NOT NULL DEFAULT 0,
        updated_at TIMESTAMPTZ DEFAULT (${toPostgresTimestampExpression})
      )`
    );

    await run(
      `CREATE TABLE IF NOT EXISTS user_cards (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        card_name TEXT NOT NULL,
        card_position TEXT,
        club TEXT,
        started TEXT,
        card_value BIGINT,
        sell_value BIGINT,
        card_note TEXT,
        image TEXT,
        created_at TIMESTAMPTZ DEFAULT (${toPostgresTimestampExpression}),
        is_verified INTEGER NOT NULL DEFAULT 1,
        verification_status TEXT DEFAULT 'verified',
        verification_code TEXT,
        verified_at TIMESTAMPTZ,
        acquired_via TEXT
      )`
    );

    await run(
      `CREATE TABLE IF NOT EXISTS user_preferences (
        user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
        home_layout TEXT,
        sidebar_layout TEXT,
        favorite_team TEXT,
        favorite_leagues TEXT,
        prioritize_favorite_teams INTEGER NOT NULL DEFAULT 0,
        accent_color TEXT,
        notifications TEXT,
        onboarding_completed INTEGER NOT NULL DEFAULT 0,
        updated_at TIMESTAMPTZ DEFAULT (${toPostgresTimestampExpression})
      )`
    );

    await run(
      `CREATE TABLE IF NOT EXISTS user_cardgame_state (
        user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
        pack_state TEXT,
        updated_at TIMESTAMPTZ DEFAULT (${toPostgresTimestampExpression})
      )`
    );

    await run(
      `CREATE TABLE IF NOT EXISTS news_articles (
        id SERIAL PRIMARY KEY,
        slug TEXT NOT NULL UNIQUE,
        title TEXT NOT NULL,
        meta TEXT,
        excerpt TEXT,
        body TEXT NOT NULL,
        image_url TEXT,
        uploaded_at TIMESTAMPTZ,
        source_type TEXT DEFAULT 'manual',
        source_id TEXT,
        published INTEGER NOT NULL DEFAULT 1,
        author_user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
        created_at TIMESTAMPTZ DEFAULT (${toPostgresTimestampExpression}),
        updated_at TIMESTAMPTZ DEFAULT (${toPostgresTimestampExpression})
      )`
    );
  } else {
    await run(
      `CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        email TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        first_name TEXT,
        last_name TEXT,
        gender TEXT,
        dob TEXT,
        created_at TEXT DEFAULT (${toSqliteTimestampExpression})
      )`
    );

    await run(
      `CREATE TABLE IF NOT EXISTS user_wallets (
        user_id INTEGER PRIMARY KEY,
        coins INTEGER NOT NULL DEFAULT 0,
        updated_at TEXT DEFAULT (${toSqliteTimestampExpression}),
        FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
      )`
    );

    await run(
      `CREATE TABLE IF NOT EXISTS user_cards (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        card_name TEXT NOT NULL,
        card_position TEXT,
        club TEXT,
        started TEXT,
        card_value INTEGER,
        sell_value INTEGER,
        card_note TEXT,
        image TEXT,
        created_at TEXT DEFAULT (${toSqliteTimestampExpression}),
        FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
      )`
    );

    await run(
      `CREATE TABLE IF NOT EXISTS user_preferences (
        user_id INTEGER PRIMARY KEY,
        home_layout TEXT,
        sidebar_layout TEXT,
        favorite_team TEXT,
        favorite_leagues TEXT,
        prioritize_favorite_teams INTEGER NOT NULL DEFAULT 0,
        accent_color TEXT,
        notifications TEXT,
        onboarding_completed INTEGER NOT NULL DEFAULT 0,
        updated_at TEXT DEFAULT (${toSqliteTimestampExpression}),
        FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
      )`
    );

    await run(
      `CREATE TABLE IF NOT EXISTS user_cardgame_state (
        user_id INTEGER PRIMARY KEY,
        pack_state TEXT,
        updated_at TEXT DEFAULT (${toSqliteTimestampExpression}),
        FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
      )`
    );

    await run(
      `CREATE TABLE IF NOT EXISTS news_articles (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        slug TEXT NOT NULL UNIQUE,
        title TEXT NOT NULL,
        meta TEXT,
        excerpt TEXT,
        body TEXT NOT NULL,
        image_url TEXT,
        uploaded_at TEXT,
        source_type TEXT DEFAULT 'manual',
        source_id TEXT,
        published INTEGER NOT NULL DEFAULT 1,
        author_user_id INTEGER,
        created_at TEXT DEFAULT (${toSqliteTimestampExpression}),
        updated_at TEXT DEFAULT (${toSqliteTimestampExpression}),
        FOREIGN KEY(author_user_id) REFERENCES users(id) ON DELETE SET NULL
      )`
    );
  }

  await ensureColumn('users', 'is_admin', 'INTEGER NOT NULL DEFAULT 0');

  await ensureColumn('user_cards', 'is_verified', 'INTEGER NOT NULL DEFAULT 1');
  await ensureColumn('user_cards', 'verification_status', `TEXT DEFAULT 'verified'`);
  await ensureColumn('user_cards', 'verification_code', 'TEXT');
  await ensureColumn('user_cards', 'verified_at', usePostgres ? 'TIMESTAMPTZ' : 'TEXT');
  await ensureColumn('user_cards', 'acquired_via', 'TEXT');

  if (usePostgres) {
    await run(
      `CREATE TABLE IF NOT EXISTS quiz_questions (
        id SERIAL PRIMARY KEY,
        competition TEXT NOT NULL,
        difficulty TEXT NOT NULL,
        prompt TEXT NOT NULL,
        explanation TEXT,
        created_at TIMESTAMPTZ DEFAULT (${toPostgresTimestampExpression})
      )`
    );

    await run(
      `CREATE TABLE IF NOT EXISTS quiz_options (
        id SERIAL PRIMARY KEY,
        question_id INTEGER NOT NULL REFERENCES quiz_questions(id) ON DELETE CASCADE,
        option_index INTEGER NOT NULL,
        option_text TEXT NOT NULL,
        is_correct INTEGER NOT NULL DEFAULT 0,
        UNIQUE(question_id, option_index)
      )`
    );
  } else {
    await run(
      `CREATE TABLE IF NOT EXISTS quiz_questions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        competition TEXT NOT NULL,
        difficulty TEXT NOT NULL,
        prompt TEXT NOT NULL,
        explanation TEXT,
        created_at TEXT DEFAULT (${toSqliteTimestampExpression})
      )`
    );

    await run(
      `CREATE TABLE IF NOT EXISTS quiz_options (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        question_id INTEGER NOT NULL,
        option_index INTEGER NOT NULL,
        option_text TEXT NOT NULL,
        is_correct INTEGER NOT NULL DEFAULT 0,
        FOREIGN KEY(question_id) REFERENCES quiz_questions(id) ON DELETE CASCADE,
        UNIQUE(question_id, option_index)
      )`
    );
  }

  await run(`CREATE INDEX IF NOT EXISTS idx_quiz_questions_comp_diff ON quiz_questions (competition, difficulty)`);
  await run(`CREATE INDEX IF NOT EXISTS idx_quiz_options_question ON quiz_options (question_id)`);

  const seedSetIfMissing = async ({ competition, difficulty, seed }) => {
    const existing = await get(
      'SELECT id FROM quiz_questions WHERE competition = ? AND difficulty = ? LIMIT 1',
      [competition, difficulty]
    );
    if (existing) return;

    for (const q of seed) {
      const inserted = await run(
        'INSERT INTO quiz_questions (competition, difficulty, prompt, explanation) VALUES (?, ?, ?, ?)',
        [competition, difficulty, q.prompt, q.explanation || null]
      );
      const questionId = inserted.lastID;
      for (let i = 0; i < q.options.length; i += 1) {
        await run(
          'INSERT INTO quiz_options (question_id, option_index, option_text, is_correct) VALUES (?, ?, ?, ?)',
          [questionId, i, q.options[i], i === q.correctIndex ? 1 : 0]
        );
      }
    }
  };

  await seedSetIfMissing({
    competition: 'premier',
    difficulty: 'easy',
    seed: [
      {
        prompt: "Which stadium do Liverpool play at?",
        options: ['Old Trafford', 'Stamford Bridge', 'Anfield', 'Etihad Stadium'],
        correctIndex: 2
      },
      {
        prompt: "Which club plays at Old Trafford?",
        options: ['Manchester City', 'Manchester United', 'Leeds United', 'Sheffield United'],
        correctIndex: 1
      },
      {
        prompt: 'What colour are Chelsea home shirts?',
        options: ['Red', 'White', 'Blue', 'Yellow'],
        correctIndex: 2
      },
      {
        prompt: "Which club is nicknamed \"The Gunners\"?",
        options: ['Burnley', 'Arsenal', 'Sheffield United', 'Wolves'],
        correctIndex: 1
      },
      {
        prompt: "What is Manchester City's stadium called?",
        options: ['Old Trafford', 'Anfield', 'Etihad Stadium', 'Stamford Bridge'],
        correctIndex: 2
      },
      {
        prompt: "Which club is nicknamed \"The Spurs\"?",
        options: ['West Ham', 'Crystal Palace', 'Tottenham Hotspur', 'Brentford'],
        correctIndex: 2
      },
      {
        prompt: 'In what year was the Premier League founded?',
        options: ['1888', '1985', '2000', '1992'],
        correctIndex: 3
      },
      {
        prompt: "Which club plays at the Emirates Stadium?",
        options: ['Tottenham', 'West Ham', 'Arsenal', 'Crystal Palace'],
        correctIndex: 2
      },
      {
        prompt: "Which club is nicknamed \"The Foxes\"?",
        options: ['Wolves', 'Crystal Palace', 'Leicester City', 'Norwich City'],
        correctIndex: 2
      },
      {
        prompt: "Who holds the record for most Premier League goals overall?",
        options: ['Wayne Rooney', 'Andrew Cole', 'Alan Shearer', 'Frank Lampard'],
        correctIndex: 2
      }
    ]
  });

  await seedSetIfMissing({
    competition: 'premier',
    difficulty: 'medium',
    seed: [
      {
        prompt: 'How many Premier League goals did Erling Haaland score in 2022–23?',
        options: ['30', '34', '36', '40'],
        correctIndex: 2
      },
      {
        prompt: 'Who holds the record for most Premier League appearances?',
        options: ['Gareth Barry', 'James Milner', 'Ryan Giggs', 'Frank Lampard'],
        correctIndex: 0
      },
      {
        prompt: 'Who holds the record for most Premier League clean sheets?',
        options: ['Petr Cech', 'David Seaman', 'Peter Schmeichel', 'Ederson'],
        correctIndex: 0
      },
      {
        prompt: 'Which club finished a Premier League season unbeaten in 2003–04?',
        options: ['Arsenal', 'Manchester United', 'Chelsea', 'Liverpool'],
        correctIndex: 0
      },
      {
        prompt: 'Which club recorded 100 points in a Premier League season?',
        options: ['Manchester City', 'Liverpool', 'Chelsea', 'Arsenal'],
        correctIndex: 0
      },
      {
        prompt: 'Which club has the record for fewest points in a Premier League season (11 in 2007–08)?',
        options: ['Derby County', 'Sunderland', 'Huddersfield Town', 'Sheffield United'],
        correctIndex: 0
      },
      {
        prompt: 'Who scored the first ever Premier League goal in 1992?',
        options: ['Alan Shearer', 'Teddy Sheringham', 'Brian Deane', 'Mark Hughes'],
        correctIndex: 2
      },
      {
        prompt: 'Who scored the fastest Premier League goal (7.69 seconds)?',
        options: ['Shane Long', 'Ledley King', 'Christian Eriksen', 'Robin van Persie'],
        correctIndex: 0
      },
      {
        prompt: 'Which club won the Premier League in 2015–16 as massive underdogs?',
        options: ['Leicester City', 'Tottenham Hotspur', 'Arsenal', 'Chelsea'],
        correctIndex: 0
      },
      {
        prompt: 'Who scored the title-winning goal for Manchester City vs QPR in 2012?',
        options: ['Sergio Aguero', 'Carlos Tevez', 'Yaya Toure', 'Mario Balotelli'],
        correctIndex: 0
      }
    ]
  });
};

module.exports = {
  db,
  init,
  run,
  get,
  all,
  usePostgres,
  dbPath,
  currentTimestampExpression,
  toSqliteTimestampExpression,
  toPostgresTimestampExpression
};
