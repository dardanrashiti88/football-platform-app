import { showSettings, showHome } from '../core/views.js';

export const initSettings = () => {
  const settingsOpen = document.querySelector('#settings-open');
  const settingsBack = document.querySelector('#settings-back');
  const accentRadios = document.querySelectorAll('input[name="accent"]');

  const applyAccent = (value) => {
    if (!value) return;
    document.documentElement.style.setProperty('--ui-accent', value);
  };

  if (settingsOpen) {
    settingsOpen.addEventListener('click', () => {
      showSettings();
    });
  }

  if (settingsBack) {
    settingsBack.addEventListener('click', () => {
      showHome();
    });
  }

  accentRadios.forEach((radio) => {
    radio.addEventListener('change', () => {
      if (radio.checked) {
        applyAccent(radio.value);
      }
    });
  });

  const checkedAccent = Array.from(accentRadios).find((radio) => radio.checked);
  if (checkedAccent) {
    applyAccent(checkedAccent.value);
  }
};
