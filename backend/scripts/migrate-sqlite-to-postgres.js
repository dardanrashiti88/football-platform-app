#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

if (!process.env.DB_CLIENT) {
  process.env.DB_CLIENT = 'postgres';
}

const { db, init } = require('../database/db');

const sqlitePath = process.env.SQLITE_PATH || path.join(__dirname, '..', 'database', 'fodr.sqlite');
const connectionString = process.env.DATABASE_URL || process.env.FODR_DATABASE_URL;

if (!connectionString) {
  console.error('Set DATABASE_URL or FODR_DATABASE_URL before running the migration.');
  process.exit(1);
}

if (!fs.existsSync(sqlitePath)) {
  console.error(`SQLite database not found at ${sqlitePath}`);
  process.exit(1);
}

const source = new sqlite3.Database(sqlitePath, sqlite3.OPEN_READONLY);

const readAll = (sql) =>
  new Promise((resolve, reject) => {
    source.all(sql, (error, rows) => {
      if (error) reject(error);
      else resolve(rows || []);
    });
  });

const setSequence = async (client, table, column = 'id') => {
  const sequenceQuery = `SELECT pg_get_serial_sequence('${table}', '${column}') AS sequence_name`;
  const sequenceResult = await client.query(sequenceQuery);
  const sequenceName = sequenceResult.rows?.[0]?.sequence_name;
  if (!sequenceName) return;
  await client.query(
    `SELECT setval('${sequenceName}', COALESCE((SELECT MAX(${column}) FROM ${table}), 1), EXISTS(SELECT 1 FROM ${table}))`
  );
};

const migrate = async () => {
  await init();
  const client = await db.connect();

  try {
    console.log(`Migrating data from ${sqlitePath} to PostgreSQL...`);
    await client.query('BEGIN');
    await client.query(
      'TRUNCATE quiz_options, quiz_questions, user_cards, user_cardgame_state, user_preferences, user_wallets, news_articles, users RESTART IDENTITY CASCADE'
    );

    const users = await readAll(
      `SELECT id, username, email, password_hash, first_name, last_name, gender, dob, COALESCE(is_admin, 0) AS is_admin, created_at
         FROM users`
    );
    for (const row of users) {
      await client.query(
        `INSERT INTO users (id, username, email, password_hash, first_name, last_name, gender, dob, is_admin, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, COALESCE($10::timestamptz, NOW()))`,
        [
          row.id,
          row.username,
          row.email,
          row.password_hash,
          row.first_name,
          row.last_name,
          row.gender,
          row.dob,
          Number(row.is_admin) || 0,
          row.created_at || null
        ]
      );
    }

    const wallets = await readAll('SELECT user_id, coins, updated_at FROM user_wallets');
    for (const row of wallets) {
      await client.query(
        `INSERT INTO user_wallets (user_id, coins, updated_at)
         VALUES ($1, $2, COALESCE($3::timestamptz, NOW()))`,
        [row.user_id, row.coins, row.updated_at || null]
      );
    }

    const preferences = await readAll(
      `SELECT user_id, home_layout, sidebar_layout, favorite_team, favorite_leagues,
              prioritize_favorite_teams, accent_color, notifications, onboarding_completed, updated_at
         FROM user_preferences`
    );
    for (const row of preferences) {
      await client.query(
        `INSERT INTO user_preferences
          (user_id, home_layout, sidebar_layout, favorite_team, favorite_leagues,
           prioritize_favorite_teams, accent_color, notifications, onboarding_completed, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, COALESCE($10::timestamptz, NOW()))`,
        [
          row.user_id,
          row.home_layout,
          row.sidebar_layout,
          row.favorite_team,
          row.favorite_leagues,
          Number(row.prioritize_favorite_teams) || 0,
          row.accent_color,
          row.notifications,
          Number(row.onboarding_completed) || 0,
          row.updated_at || null
        ]
      );
    }

    const cardgameState = await readAll('SELECT user_id, pack_state, updated_at FROM user_cardgame_state');
    for (const row of cardgameState) {
      await client.query(
        `INSERT INTO user_cardgame_state (user_id, pack_state, updated_at)
         VALUES ($1, $2, COALESCE($3::timestamptz, NOW()))`,
        [row.user_id, row.pack_state, row.updated_at || null]
      );
    }

    const newsArticles = await readAll(
      `SELECT id, slug, title, meta, excerpt, body, image_url, uploaded_at, source_type, source_id,
              published, author_user_id, created_at, updated_at
         FROM news_articles`
    );
    for (const row of newsArticles) {
      await client.query(
        `INSERT INTO news_articles
          (id, slug, title, meta, excerpt, body, image_url, uploaded_at, source_type, source_id,
           published, author_user_id, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8::timestamptz, $9, $10, $11, $12, COALESCE($13::timestamptz, NOW()), COALESCE($14::timestamptz, NOW()))`,
        [
          row.id,
          row.slug,
          row.title,
          row.meta,
          row.excerpt,
          row.body,
          row.image_url,
          row.uploaded_at || null,
          row.source_type,
          row.source_id,
          Number(row.published) || 0,
          row.author_user_id || null,
          row.created_at || null,
          row.updated_at || null
        ]
      );
    }

    const quizQuestions = await readAll(
      'SELECT id, competition, difficulty, prompt, explanation, created_at FROM quiz_questions'
    );
    for (const row of quizQuestions) {
      await client.query(
        `INSERT INTO quiz_questions (id, competition, difficulty, prompt, explanation, created_at)
         VALUES ($1, $2, $3, $4, $5, COALESCE($6::timestamptz, NOW()))`,
        [row.id, row.competition, row.difficulty, row.prompt, row.explanation, row.created_at || null]
      );
    }

    const quizOptions = await readAll(
      'SELECT id, question_id, option_index, option_text, is_correct FROM quiz_options'
    );
    for (const row of quizOptions) {
      await client.query(
        `INSERT INTO quiz_options (id, question_id, option_index, option_text, is_correct)
         VALUES ($1, $2, $3, $4, $5)`,
        [row.id, row.question_id, row.option_index, row.option_text, Number(row.is_correct) || 0]
      );
    }

    const cards = await readAll(
      `SELECT id, user_id, card_name, card_position, club, started, card_value, sell_value, card_note,
              image, created_at, COALESCE(is_verified, 1) AS is_verified, verification_status,
              verification_code, verified_at, acquired_via
         FROM user_cards`
    );
    for (const row of cards) {
      await client.query(
        `INSERT INTO user_cards
          (id, user_id, card_name, card_position, club, started, card_value, sell_value, card_note,
           image, created_at, is_verified, verification_status, verification_code, verified_at, acquired_via)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, COALESCE($11::timestamptz, NOW()), $12, $13, $14, $15::timestamptz, $16)`,
        [
          row.id,
          row.user_id,
          row.card_name,
          row.card_position,
          row.club,
          row.started,
          row.card_value,
          row.sell_value,
          row.card_note,
          row.image,
          row.created_at || null,
          Number(row.is_verified) || 0,
          row.verification_status,
          row.verification_code,
          row.verified_at || null,
          row.acquired_via
        ]
      );
    }

    await setSequence(client, 'users');
    await setSequence(client, 'user_cards');
    await setSequence(client, 'news_articles');
    await setSequence(client, 'quiz_questions');
    await setSequence(client, 'quiz_options');

    await client.query('COMMIT');
    console.log('SQLite to PostgreSQL migration completed successfully.');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Migration failed:', error);
    process.exitCode = 1;
  } finally {
    client.release();
    source.close();
    await db.end();
  }
};

migrate().catch((error) => {
  console.error('Migration failed:', error);
  process.exit(1);
});
