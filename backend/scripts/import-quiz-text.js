/* eslint-disable no-console */
/**
 * Import quiz questions from a loose "Q1. ... A) ... B) ... C) ... D) ..." text file.
 *
 * Usage:
 *   node backend/scripts/import-quiz-text.js --file path/to/questions.txt --competition premier --difficulty medium --replace
 *
 * Notes:
 * - We keep the *last* occurrence of each Q-number (useful when you paste corrections/replacements).
 * - We require exactly 4 options (A-D) and exactly 1 correct marked with "✅".
 * - If parsing fails for a question, we skip it and report it at the end.
 */

process.env.FODR_DB_PATH = process.env.FODR_DB_PATH || '/tmp/fodr.sqlite';

const fs = require('fs');
const path = require('path');
const { init, run, all } = require('../database/db');

const readArg = (name) => {
  const idx = process.argv.indexOf(name);
  if (idx === -1) return null;
  return process.argv[idx + 1] || null;
};

const hasFlag = (name) => process.argv.includes(name);

const normalizeText = (raw) =>
  String(raw || '')
    .replace(/\r/g, '\n')
    // Ensure Q blocks and A/B/C/D options start on their own line even if pasted without newlines.
    .replace(/(Q\d+\.)/g, '\n$1')
    .replace(/([A-D]\))/g, '\n$1')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

const stripOptionNoise = (value) => {
  // Remove "✅ ..." and any trailing parenthetical notes from the option label text.
  // Keep the core text the user wants shown as an answer option.
  return String(value || '')
    .replace(/\s*✅.*$/u, '')
    .replace(/\s*\(.*?\)\s*$/u, '')
    .trim();
};

const parseQuestions = (lines) => {
  const byNumber = new Map();

  /** @type {{ number: number, prompt: string, options: string[], correctIndexes: number[] } | null} */
  let current = null;

  const flush = () => {
    if (!current) return;
    byNumber.set(current.number, current);
  };

  for (const line of lines) {
    const qMatch = line.match(/^Q(\d+)\.\s*(.+)$/u);
    if (qMatch) {
      flush();
      current = {
        number: Number.parseInt(qMatch[1], 10),
        prompt: qMatch[2].trim(),
        options: ['', '', '', ''],
        correctIndexes: []
      };
      continue;
    }

    if (!current) continue;

    const optMatch = line.match(/^([A-D])\)\s*(.+)$/u);
    if (!optMatch) continue;

    const idx = optMatch[1].charCodeAt(0) - 65; // A=0
    const rawOption = optMatch[2];
    const isCorrect = rawOption.includes('✅');
    const optionText = stripOptionNoise(rawOption);

    if (idx >= 0 && idx < 4) {
      current.options[idx] = optionText;
      if (isCorrect && !current.correctIndexes.includes(idx)) current.correctIndexes.push(idx);
    }
  }

  flush();

  const parsed = Array.from(byNumber.values()).sort((a, b) => a.number - b.number);

  const good = [];
  const bad = [];

  for (const q of parsed) {
    const filled = q.options.every((o) => o && o.trim().length > 0);
    if (!filled) {
      bad.push({ number: q.number, reason: 'missing options', prompt: q.prompt });
      continue;
    }
    if (!q.correctIndexes.length) {
      bad.push({ number: q.number, reason: 'missing correct marker ✅', prompt: q.prompt });
      continue;
    }
    if (q.correctIndexes.length > 1) {
      bad.push({ number: q.number, reason: 'multiple correct markers ✅', prompt: q.prompt });
      continue;
    }
    good.push({ ...q, correctIndex: q.correctIndexes[0] });
  }

  return { good, bad };
};

const main = async () => {
  const file = readArg('--file') || readArg('-f');
  const competition = readArg('--competition') || readArg('-c');
  const difficulty = readArg('--difficulty') || readArg('-d');
  const replace = hasFlag('--replace');

  if (!file || !competition || !difficulty) {
    console.log('Missing args.\n');
    console.log(
      'Usage:\n  node backend/scripts/import-quiz-text.js --file path/to/questions.txt --competition premier --difficulty medium --replace'
    );
    process.exit(1);
  }

  const abs = path.isAbsolute(file) ? file : path.join(process.cwd(), file);
  const raw = fs.readFileSync(abs, 'utf8');
  const lines = normalizeText(raw);

  const { good, bad } = parseQuestions(lines);

  console.log(`Parsed: ${good.length} valid questions, ${bad.length} skipped`);

  if (!good.length) {
    console.error('No valid questions found. Nothing to import.');
    process.exit(1);
  }

  await init();

  await run('BEGIN');
  try {
    if (replace) {
      await run('DELETE FROM quiz_questions WHERE competition = ? AND difficulty = ?', [competition, difficulty]);
    }

    for (const q of good) {
      const inserted = await run(
        'INSERT INTO quiz_questions (competition, difficulty, prompt, explanation) VALUES (?, ?, ?, ?)',
        [competition, difficulty, q.prompt, null]
      );
      const questionId = inserted.lastID;
      for (let i = 0; i < 4; i += 1) {
        await run(
          'INSERT INTO quiz_options (question_id, option_index, option_text, is_correct) VALUES (?, ?, ?, ?)',
          [questionId, i, q.options[i], i === q.correctIndex ? 1 : 0]
        );
      }
    }

    await run('COMMIT');
  } catch (err) {
    await run('ROLLBACK').catch(() => {});
    throw err;
  }

  const countRow = await all(
    'SELECT COUNT(*) as n FROM quiz_questions WHERE competition = ? AND difficulty = ?',
    [competition, difficulty]
  );
  const count = Array.isArray(countRow) && countRow[0] ? Number(countRow[0].n) : NaN;
  console.log(`Imported. DB now has ${Number.isFinite(count) ? count : '?'} questions for ${competition}/${difficulty}.`);

  if (bad.length) {
    console.log('\nSkipped questions (first 30):');
    bad.slice(0, 30).forEach((b) => {
      console.log(`- Q${b.number}: ${b.reason} — ${b.prompt.slice(0, 110)}`);
    });
    if (bad.length > 30) console.log(`...and ${bad.length - 30} more`);
  }
};

main().catch((err) => {
  console.error('Import failed:', err);
  process.exit(1);
});
