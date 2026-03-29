import { storage } from '../core/storage.js';
import { onEvent } from '../core/events.js';
import { loadUser } from './auth.js';
import { closeProfile } from '../core/views.js';

const PROFILE_IMAGE_KEY = 'fodrProfileImage';
const DEFAULT_AVATAR = '../images/icons/Copy_of_User-removebg-preview.png';

const getImageKey = (user) => {
  const username = user?.username || 'guest';
  return `${PROFILE_IMAGE_KEY}:${username}`;
};

const setTopbarAvatar = (src) => {
  const dot = document.querySelector('.avatar-dot');
  if (!dot) return;
  if (src) {
    dot.style.backgroundImage = `url('${src}')`;
    dot.classList.add('has-avatar');
  } else {
    dot.style.backgroundImage = '';
    dot.classList.remove('has-avatar');
  }
};

const setText = (el, value) => {
  if (!el) return;
  el.textContent = value;
};

const applyProfileData = (user) => {
  const avatar = document.querySelector('#profile-avatar');
  const nameEl = document.querySelector('#profile-name');
  const handleEl = document.querySelector('#profile-handle');
  const postsEl = document.querySelector('#profile-posts');
  const followersEl = document.querySelector('#profile-followers');
  const followingEl = document.querySelector('#profile-following');

  const username = user?.username ? String(user.username) : 'Guest';
  setText(nameEl, username.toUpperCase());
  setText(handleEl, `@${username.toLowerCase()}`);

  if (user?.posts) {
    setText(postsEl, user.posts);
  }
  if (user?.followers) {
    setText(followersEl, user.followers);
  }
  if (user?.following) {
    setText(followingEl, user.following);
  }

  if (!user) {
    setText(postsEl, '0');
    setText(followersEl, '0');
    setText(followingEl, '0');
  }

  if (!avatar) return;
  const storedImage = user ? storage.get(getImageKey(user)) : null;
  avatar.src = storedImage || DEFAULT_AVATAR;
  setTopbarAvatar(storedImage);
};

const setupAvatarUpload = () => {
  const avatar = document.querySelector('#profile-avatar');
  const input = document.querySelector('#profile-avatar-input');
  const trigger = document.querySelector('#profile-avatar-btn');

  if (!input) return;

  if (trigger) {
    trigger.addEventListener('click', () => {
      input.click();
    });
  }

  input.addEventListener('change', () => {
    const file = input.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const user = loadUser();
      const dataUrl = typeof reader.result === 'string' ? reader.result : '';
      if (!dataUrl) return;
      storage.set(getImageKey(user), dataUrl);
      if (avatar) {
        avatar.src = dataUrl;
      }
      setTopbarAvatar(dataUrl);
    };
    reader.readAsDataURL(file);
  });
};

export const initProfile = () => {
  const backBtn = document.querySelector('#profile-back');
  if (backBtn) {
    backBtn.addEventListener('click', () => {
      closeProfile();
    });
  }

  setupAvatarUpload();

  const currentUser = loadUser();
  applyProfileData(currentUser);

  onEvent('fodr:user', (event) => {
    applyProfileData(event?.detail?.user || null);
  });

  onEvent('fodr:logout', () => {
    applyProfileData(null);
  });
};
