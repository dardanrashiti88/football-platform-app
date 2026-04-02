const getApiBase = () => {
  if (typeof window === 'undefined') {
    return 'http://localhost:3002/api';
  }

  const { hostname, origin, port } = window.location;

  if (port === '8080') {
    return `${origin}/api`;
  }

  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'http://localhost:3002/api';
  }

  return `${origin}/api`;
};

export const API_BASE = getApiBase();

const requestJson = async (path, { method = 'GET', payload } = {}) => {
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: payload ? { 'Content-Type': 'application/json' } : undefined,
    body: typeof payload === 'undefined' ? undefined : JSON.stringify(payload)
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
};

export const getJson = (path) => requestJson(path);
export const postJson = (path, payload) => requestJson(path, { method: 'POST', payload });
export const putJson = (path, payload) => requestJson(path, { method: 'PUT', payload });
export const deleteJson = (path, payload) => requestJson(path, { method: 'DELETE', payload });
