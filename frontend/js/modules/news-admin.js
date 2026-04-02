import { emitEvent, onEvent } from '../core/events.js';
import { getJson, postJson, putJson } from '../core/api.js';
import { loadUser } from './auth.js';

let adminCard = null;
let articleSelect = null;
let titleInput = null;
let slugInput = null;
let metaInput = null;
let imageInput = null;
let uploadedInput = null;
let excerptInput = null;
let bodyInput = null;
let publishedInput = null;
let statusLine = null;
let createBtn = null;
let saveBtn = null;
let articlesCache = [];

const buildCard = () => {
  if (adminCard) return adminCard;
  adminCard = document.createElement('div');
  adminCard.className = 'settings-card settings-card--admin';
  adminCard.id = 'settings-news-admin';
  adminCard.innerHTML = `
    <h3>News Admin</h3>
    <div class="setting-item setting-item--stacked">
      <span>Manage published stories</span>
      <select class="select" id="admin-news-select"></select>
    </div>
    <div class="setting-item setting-item--stacked">
      <span>Title</span>
      <input class="select settings-input" id="admin-news-title" type="text" placeholder="Headline" />
    </div>
    <div class="setting-item setting-item--stacked">
      <span>Slug</span>
      <input class="select settings-input" id="admin-news-slug" type="text" placeholder="headline-slug" />
    </div>
    <div class="setting-item setting-item--stacked">
      <span>Meta line</span>
      <input class="select settings-input" id="admin-news-meta" type="text" placeholder="Author · Date" />
    </div>
    <div class="setting-item setting-item--stacked">
      <span>Image URL</span>
      <input class="select settings-input" id="admin-news-image" type="text" placeholder="/news/... or https://..." />
    </div>
    <div class="setting-item setting-item--stacked">
      <span>Upload date</span>
      <input class="select settings-input" id="admin-news-uploaded" type="date" />
    </div>
    <div class="setting-item setting-item--stacked">
      <span>Excerpt</span>
      <textarea class="select settings-textarea" id="admin-news-excerpt" rows="3" placeholder="Short summary"></textarea>
    </div>
    <div class="setting-item setting-item--stacked">
      <span>Body</span>
      <textarea class="select settings-textarea" id="admin-news-body" rows="8" placeholder="Full article"></textarea>
    </div>
    <div class="setting-item">
      <span>Published</span>
      <label class="toggle">
        <input type="checkbox" id="admin-news-published" checked />
        <span class="toggle-slider"></span>
      </label>
    </div>
    <div class="setting-item setting-item--admin-actions">
      <button class="setting-btn" type="button" id="admin-news-create">New Article</button>
      <button class="setting-btn" type="button" id="admin-news-save">Save Article</button>
    </div>
    <div class="setting-item">
      <span>Admin status</span>
      <span class="meta" id="admin-news-status">Ready</span>
    </div>
  `;

  articleSelect = adminCard.querySelector('#admin-news-select');
  titleInput = adminCard.querySelector('#admin-news-title');
  slugInput = adminCard.querySelector('#admin-news-slug');
  metaInput = adminCard.querySelector('#admin-news-meta');
  imageInput = adminCard.querySelector('#admin-news-image');
  uploadedInput = adminCard.querySelector('#admin-news-uploaded');
  excerptInput = adminCard.querySelector('#admin-news-excerpt');
  bodyInput = adminCard.querySelector('#admin-news-body');
  publishedInput = adminCard.querySelector('#admin-news-published');
  statusLine = adminCard.querySelector('#admin-news-status');
  createBtn = adminCard.querySelector('#admin-news-create');
  saveBtn = adminCard.querySelector('#admin-news-save');

  articleSelect?.addEventListener('change', () => {
    const selected = articlesCache.find((article) => String(article.id) === articleSelect.value);
    fillForm(selected || null);
  });

  createBtn?.addEventListener('click', () => fillForm(null));
  saveBtn?.addEventListener('click', () => {
    void saveCurrentArticle();
  });

  return adminCard;
};

const fillForm = (article) => {
  const uploadedDate = article?.uploadedAt ? String(article.uploadedAt).slice(0, 10) : '';
  if (articleSelect) articleSelect.value = article ? String(article.id) : '';
  if (titleInput) titleInput.value = article?.title || '';
  if (slugInput) slugInput.value = article?.slug || '';
  if (metaInput) metaInput.value = article?.meta || '';
  if (imageInput) imageInput.value = article?.imageUrl || '';
  if (uploadedInput) uploadedInput.value = uploadedDate;
  if (excerptInput) excerptInput.value = article?.excerpt || '';
  if (bodyInput) bodyInput.value = article?.body || '';
  if (publishedInput) publishedInput.checked = article ? article.published !== false : true;
  if (statusLine) statusLine.textContent = article ? `Editing ${article.slug}` : 'Creating a new article';
};

const renderOptions = () => {
  if (!articleSelect) return;
  articleSelect.innerHTML = '<option value="">New article</option>';
  articlesCache.forEach((article) => {
    const option = document.createElement('option');
    option.value = String(article.id);
    option.textContent = article.title;
    articleSelect.appendChild(option);
  });
};

const fetchArticles = async () => {
  const user = loadUser();
  if (!user?.id || !user?.is_admin) return;
  const data = await getJson(`/admin/news?userId=${user.id}`);
  articlesCache = Array.isArray(data?.articles) ? data.articles : [];
  renderOptions();
  fillForm(articlesCache[0] || null);
};

const saveCurrentArticle = async () => {
  const user = loadUser();
  if (!user?.id || !user?.is_admin) return;
  const selectedId = articleSelect?.value ? Number(articleSelect.value) : null;
  const payload = {
    userId: user.id,
    title: titleInput?.value || '',
    slug: slugInput?.value || '',
    meta: metaInput?.value || '',
    imageUrl: imageInput?.value || '',
    uploadedAt: uploadedInput?.value || '',
    excerpt: excerptInput?.value || '',
    body: bodyInput?.value || '',
    published: publishedInput?.checked ? 1 : 0
  };

  statusLine.textContent = 'Saving article...';
  const response = selectedId
    ? await putJson(`/admin/news/${selectedId}`, payload)
    : await postJson('/admin/news', payload);
  statusLine.textContent = 'Saved.';
  await fetchArticles();
  emitEvent('fodr:news-updated', { article: response?.article || null });
};

const attachCardIfNeeded = async () => {
  const settingsGrid = document.querySelector('.settings-grid');
  const user = loadUser();
  if (!settingsGrid) return;

  if (!user?.is_admin) {
    adminCard?.remove();
    return;
  }

  const card = buildCard();
  if (!card.isConnected) {
    settingsGrid.appendChild(card);
  }
  await fetchArticles();
};

export const initNewsAdmin = () => {
  void attachCardIfNeeded();
  onEvent('fodr:user', () => {
    void attachCardIfNeeded();
  });
  onEvent('fodr:logout', () => {
    adminCard?.remove();
  });
};
