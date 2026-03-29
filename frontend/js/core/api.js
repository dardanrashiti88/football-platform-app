const getApiBase = () => {
  if (typeof window === 'undefined') {
    return 'http://localhost:3002/api';
  }

  const { hostname, origin } = window.location;
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'http://localhost:3002/api';
  }

  return `${origin}/api`;
};

export const API_BASE = getApiBase();

export const postJson = async (path, payload) => {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
};
