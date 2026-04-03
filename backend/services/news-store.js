const fs = require('fs');
const path = require('path');
const { run, get, all, usePostgres } = require('../database/db');

const NEWS_ROOT = path.join(__dirname, '..', '..', 'news');

const escapeSlug = (value = '') =>
  String(value)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);

const toDisplayDate = (value) => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
};

const toIsoOrNull = (value) => {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
};

const toTitleCase = (value = '') =>
  String(value)
    .split(/[\s-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');

const parseArticleText = (rawText, fallbackId) => {
  const blocks = String(rawText || '')
    .replace(/\r\n/g, '\n')
    .split(/\n\s*\n/)
    .map((block) => block.replace(/\n+/g, ' ').trim())
    .filter(Boolean)
    .filter(
      (block) =>
        !/^(share|watch every press conference|free newsletter|join over|read the latest)/i.test(block)
    );

  const title = blocks.shift() || toTitleCase(fallbackId);

  let meta = '';
  if (
    blocks[0]
    && (/fotmob\s*-/i.test(blocks[0])
      || /\b(?:march|april|may|june|july|august|september|october|november|december|january|february)\b/i.test(
        blocks[0]
      )
      || /•/.test(blocks[0]))
  ) {
    meta = blocks.shift();
  }

  const excerpt = blocks.shift() || '';
  const body = blocks.join('\n\n');

  return {
    title,
    meta,
    excerpt,
    body: body || excerpt || title
  };
};

const readSeedArticles = () => {
  if (!fs.existsSync(NEWS_ROOT)) return [];

  return fs.readdirSync(NEWS_ROOT, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => {
      const folder = entry.name;
      const textPath = path.join(NEWS_ROOT, folder, 'text', 'info');
      if (!fs.existsSync(textPath)) return null;

      const imagesDir = path.join(NEWS_ROOT, folder, 'images');
      const imageFile = fs.existsSync(imagesDir)
        ? fs.readdirSync(imagesDir).find((name) => !name.startsWith('.'))
        : null;

      const raw = fs.readFileSync(textPath, 'utf8');
      const parsed = parseArticleText(raw, folder);
      const stat = fs.statSync(textPath);

      return {
        slug: escapeSlug(folder),
        title: parsed.title,
        meta: parsed.meta,
        excerpt: parsed.excerpt,
        body: parsed.body,
        imageUrl: imageFile ? `/news/${folder}/images/${imageFile}` : '',
        uploadedAt: stat.mtime.toISOString(),
        published: 1,
        sourceType: 'seed',
        sourceId: folder,
        authorUserId: null
      };
    })
    .filter(Boolean);
};

const normalizeArticleRow = (row) => ({
  id: Number(row.id),
  slug: row.slug,
  title: row.title,
  meta: row.meta || '',
  excerpt: row.excerpt || '',
  body: row.body || '',
  imageUrl: row.image_url || '',
  uploadedAt: row.uploaded_at || row.created_at || null,
  uploadedAtLabel: toDisplayDate(row.uploaded_at || row.created_at || null),
  published: Number(row.published) === 1,
  sourceType: row.source_type || 'manual',
  sourceId: row.source_id || '',
  authorUserId: row.author_user_id ? Number(row.author_user_id) : null,
  createdAt: row.created_at || null,
  updatedAt: row.updated_at || null
});

const ensureNewsArticlesSeeded = async () => {
  const seedArticles = readSeedArticles();
  for (const article of seedArticles) {
    const existing = await get(
      'SELECT id FROM news_articles WHERE slug = ? OR (source_type = ? AND source_id = ?) LIMIT 1',
      [article.slug, article.sourceType, article.sourceId]
    );
    if (existing) {
      await run(
        `UPDATE news_articles
            SET slug = ?,
                title = ?,
                meta = ?,
                excerpt = ?,
                body = ?,
                image_url = ?,
                uploaded_at = ?,
                published = ?,
                source_type = ?,
                source_id = ?,
                author_user_id = ?,
                updated_at = ?
          WHERE id = ?`,
        [
          article.slug,
          article.title,
          article.meta || null,
          article.excerpt || null,
          article.body,
          article.imageUrl || null,
          article.uploadedAt,
          article.published,
          article.sourceType,
          article.sourceId,
          article.authorUserId,
          article.uploadedAt,
          existing.id
        ]
      );
      continue;
    }

    await run(
      `INSERT INTO news_articles
        (slug, title, meta, excerpt, body, image_url, uploaded_at, published, source_type, source_id, author_user_id, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)` ,
      [
        article.slug,
        article.title,
        article.meta || null,
        article.excerpt || null,
        article.body,
        article.imageUrl || null,
        article.uploadedAt,
        article.published,
        article.sourceType,
        article.sourceId,
        article.authorUserId,
        article.uploadedAt
      ]
    );
  }
};

const listNewsArticles = async ({ includeUnpublished = false } = {}) => {
  const rows = includeUnpublished
    ? await all(
      `SELECT id, slug, title, meta, excerpt, body, image_url, uploaded_at, published,
              source_type, source_id, author_user_id, created_at, updated_at
         FROM news_articles
        ORDER BY COALESCE(uploaded_at, created_at) DESC, id DESC`
    )
    : await all(
      `SELECT id, slug, title, meta, excerpt, body, image_url, uploaded_at, published,
              source_type, source_id, author_user_id, created_at, updated_at
         FROM news_articles
        WHERE published = 1
        ORDER BY COALESCE(uploaded_at, created_at) DESC, id DESC`
    );

  return rows.map(normalizeArticleRow);
};

const getNewsArticleById = async (articleId) => {
  const row = await get(
    `SELECT id, slug, title, meta, excerpt, body, image_url, uploaded_at, published,
            source_type, source_id, author_user_id, created_at, updated_at
       FROM news_articles
      WHERE id = ?`,
    [articleId]
  );
  return row ? normalizeArticleRow(row) : null;
};

const saveNewsArticle = async ({ articleId = null, payload, authorUserId = null }) => {
  const slug = escapeSlug(payload.slug || payload.title || `article-${Date.now()}`);
  const normalized = {
    slug,
    title: String(payload.title || '').trim(),
    meta: String(payload.meta || '').trim(),
    excerpt: String(payload.excerpt || '').trim(),
    body: String(payload.body || '').trim(),
    imageUrl: String(payload.imageUrl || payload.image_url || '').trim(),
    uploadedAt: toIsoOrNull(payload.uploadedAt || payload.uploaded_at) || new Date().toISOString(),
    published: payload.published === false || payload.published === 0 || payload.published === '0' ? 0 : 1
  };

  if (!normalized.title || !normalized.body) {
    throw new Error('Title and body are required.');
  }

  const duplicate = await get(
    `SELECT id FROM news_articles WHERE slug = ? ${articleId ? 'AND id <> ?' : ''} LIMIT 1`,
    articleId ? [normalized.slug, articleId] : [normalized.slug]
  );
  if (duplicate) {
    throw new Error('Slug already exists. Choose another one.');
  }

  if (articleId) {
    await run(
      `UPDATE news_articles
          SET slug = ?,
              title = ?,
              meta = ?,
              excerpt = ?,
              body = ?,
              image_url = ?,
              uploaded_at = ?,
              published = ?,
              author_user_id = ?,
              updated_at = ?
        WHERE id = ?`,
      [
        normalized.slug,
        normalized.title,
        normalized.meta || null,
        normalized.excerpt || null,
        normalized.body,
        normalized.imageUrl || null,
        normalized.uploadedAt,
        normalized.published,
        authorUserId,
        new Date().toISOString(),
        articleId
      ]
    );
    return getNewsArticleById(articleId);
  }

  const inserted = await run(
    `INSERT INTO news_articles
      (slug, title, meta, excerpt, body, image_url, uploaded_at, published, source_type, source_id, author_user_id, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)` ,
    [
      normalized.slug,
      normalized.title,
      normalized.meta || null,
      normalized.excerpt || null,
      normalized.body,
      normalized.imageUrl || null,
      normalized.uploadedAt,
      normalized.published,
      'manual',
      normalized.slug,
      authorUserId,
      new Date().toISOString()
    ]
  );

  return getNewsArticleById(inserted.lastID);
};

module.exports = {
  ensureNewsArticlesSeeded,
  listNewsArticles,
  getNewsArticleById,
  saveNewsArticle,
  parseArticleText,
  readSeedArticles,
  normalizeArticleRow,
  usePostgres
};
