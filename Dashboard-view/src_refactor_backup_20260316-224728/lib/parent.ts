export const postToParent = (message: any) => {
  if (typeof window === 'undefined') return;
  if (!window.parent) return;
  window.parent.postMessage(message, '*');
};

