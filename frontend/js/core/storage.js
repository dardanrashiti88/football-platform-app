export const storage = {
  get(key) {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch {
      // ignore storage errors
    }
  },
  remove(key) {
    try {
      localStorage.removeItem(key);
    } catch {
      // ignore storage errors
    }
  }
};
