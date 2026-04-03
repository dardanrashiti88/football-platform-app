import { getJson } from '../core/api.js';
import { onEvent } from '../core/events.js';

const NEWS_ITEMS = [
  {
    id: 'isak',
    uploadedAt: '4/3/2026',
    textUrl: new URL('../../../news/isak/text/info', import.meta.url),
    imageUrl: new URL(
      '../../../news/isak/images/2-training-pitch-gallery-020426_348a077c12ac7459c77edbffd248a9b8.webp',
      import.meta.url
    ).href
  },
  {
    id: 'florian',
    uploadedAt: '3/26/2026',
    textUrl: new URL('../../../news/Florian/text/info', import.meta.url),
    imageUrl: new URL(
      '../../../news/Florian/images/florian-wirtz_2em8s4r19zyf103rb9qloaqgy.jpg',
      import.meta.url
    ).href
  },
  {
    id: 'diomande',
    uploadedAt: '3/26/2026',
    textUrl: new URL('../../../news/diamonte/text/info', import.meta.url),
    imageUrl: new URL('../../../news/diamonte/images/3DR18JJ.webp', import.meta.url).href
  },
  {
    id: 'messi',
    uploadedAt: '3/26/2026',
    textUrl: new URL('../../../news/messi/text/info', import.meta.url),
    imageUrl: new URL(
      '../../../news/messi/images/images_voltaxMediaLibrary_mmsport_si_01kmqtp64k4hfcp70axc.webp',
      import.meta.url
    ).href
  },
  {
    id: 'netherlands',
    uploadedAt: '3/26/2026',
    textUrl: new URL('../../../news/netherlands/text/info', import.meta.url),
    imageUrl: new URL(
      '../../../news/netherlands/images/tijjani-reijnders_btpsxgtw2i801edbgzr2gz21k.jpg',
      import.meta.url
    ).href
  },
  {
    id: 'madueke',
    uploadedAt: '3/26/2026',
    textUrl: new URL('../../../news/madueke/text/info', import.meta.url),
    imageUrl: new URL(
      '../../../news/madueke/images/images_voltaxMediaLibrary_mmsport_si_01kmt7q6xm81d02mw1n4.webp',
      import.meta.url
    ).href,
    fallbackTitle: 'Noni Madueke',
    fallbackExcerpt: 'Article text has not been added yet.'
  },
  {
    id: 'rodri',
    uploadedAt: '3/26/2026',
    textUrl: new URL('../../../news/rodri/text/info', import.meta.url),
    imageUrl: new URL(
      '../../../news/rodri/images/images_voltaxMediaLibrary_mmsport_si_01kmt9vq8y5pbmd00sm8.webp',
      import.meta.url
    ).href
  },
  {
    id: 'salah',
    uploadedAt: '3/26/2026',
    textUrl: new URL('../../../news/salah/text/info', import.meta.url),
    imageUrl: new URL(
      '../../../news/salah/images/mohamed-salah_7llm5eygdolh1xtn8l8uf4erq.jpg',
      import.meta.url
    ).href
  }
];

const escapeHtml = (value = '') =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const toTitleCase = (value = '') =>
  String(value)
    .split(/[\s-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');

const parseArticle = (rawText, item) => {
  const blocks = String(rawText || '')
    .replace(/\r\n/g, '\n')
    .split(/\n\s*\n/)
    .map((block) => block.replace(/\n+/g, ' ').trim())
    .filter(Boolean)
    .filter(
      (block) =>
        !/^(share|watch every press conference|free newsletter|join over|read the latest)/i.test(block)
    );

  const title = blocks.shift() || item.fallbackTitle || toTitleCase(item.id);

  let meta = '';
  if (
    blocks[0] &&
    (/fotmob\s*-/i.test(blocks[0]) ||
      /\b(?:march|april|may|june|july|august|september|october|november|december|january|february)\b/i.test(
        blocks[0]
      ) ||
      /•/.test(blocks[0]))
  ) {
    meta = blocks.shift();
  }

  const excerpt = blocks.shift() || item.fallbackExcerpt || '';
  const paragraphs = blocks.slice(0, 3);

  return { title, meta, excerpt, paragraphs };
};

const createPlaceholder = (title = '') => {
  const initials = String(title)
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || '')
    .join('');

  return `
    <div class="news-article-placeholder">
      <span>${escapeHtml(initials || 'N')}</span>
    </div>
  `;
};

const renderArticle = (article, index) => {
  const featuredClass = index === 0 ? ' news-article--featured' : '';
  const media = article.imageUrl
    ? `<img src="${article.imageUrl}" alt="${escapeHtml(article.title)}" loading="lazy" decoding="async" />`
    : createPlaceholder(article.title);

  return `
    <article class="news-article${featuredClass}" data-article-id="${escapeHtml(article.slug || article.id || '')}">
      <div class="news-article-media">
        ${media}
      </div>
      <div class="news-article-body">
        <div class="news-article-kicker">Football News</div>
        <h3 class="news-article-title">${escapeHtml(article.title)}</h3>
        ${
          article.uploadedAt
            ? `<div class="news-article-date">Uploaded ${escapeHtml(article.uploadedAt)}</div>`
            : ''
        }
        ${article.meta ? `<div class="news-article-meta">${escapeHtml(article.meta)}</div>` : ''}
        ${article.excerpt ? `<p class="news-article-excerpt">${escapeHtml(article.excerpt)}</p>` : ''}
        ${article.paragraphs
          .map((paragraph) => `<p class="news-article-paragraph">${escapeHtml(paragraph)}</p>`)
          .join('')}
      </div>
    </article>
  `;
};

const loadLocalArticles = async () =>
  Promise.all(
    NEWS_ITEMS.map(async (item) => {
      const response = await fetch(item.textUrl);
      if (!response.ok) {
        throw new Error(`Failed to load ${item.id}`);
      }
      const text = await response.text();
      return { ...item, slug: item.id, ...parseArticle(text, item) };
    })
  );

const sortArticles = (articles = []) =>
  [...articles].sort((left, right) => {
    const leftTime = Date.parse(left?.uploadedAt || left?.uploadedAtLabel || '') || 0;
    const rightTime = Date.parse(right?.uploadedAt || right?.uploadedAtLabel || '') || 0;
    return rightTime - leftTime;
  });

const mergeArticles = (apiArticles = [], localArticles = []) => {
  const byKey = new Map();
  localArticles.forEach((article) => {
    const key = article.slug || article.id;
    byKey.set(key, article);
  });
  apiArticles.forEach((article) => {
    const key = article.slug || article.id;
    byKey.set(key, { ...byKey.get(key), ...article });
  });
  return sortArticles([...byKey.values()]);
};

const renderNews = async (root) => {
  root.innerHTML = '<div class="news-loading">Loading news...</div>';

  let localArticles = [];
  try {
    localArticles = await loadLocalArticles();
  } catch (error) {
    console.warn('Unable to load file-based news content.', error);
  }

  try {
    const apiData = await getJson('/news');
    if (Array.isArray(apiData?.articles) && apiData.articles.length) {
      const articles = mergeArticles(apiData.articles, localArticles);
      root.innerHTML = articles.map(renderArticle).join('');
      return;
    }
  } catch (error) {
    console.warn('Unable to load API-backed news feed, falling back to file news.', error);
  }

  if (localArticles.length) {
    root.innerHTML = sortArticles(localArticles).map(renderArticle).join('');
    return;
  }

  root.innerHTML = '<div class="news-loading">News is unavailable right now.</div>';
};

export const initNews = () => {
  const grid = document.querySelector('#news-grid');
  if (!grid) return;
  void renderNews(grid);
  onEvent('fodr:news-updated', () => {
    void renderNews(grid);
  });
};
