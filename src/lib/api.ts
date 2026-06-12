let BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://minecraft-server-backend-ub33.onrender.com';

export function getApiUrl() {
  let url = BASE_URL;
  if (typeof window !== 'undefined') {
    url = localStorage.getItem('backend_api_url') || BASE_URL;
  }
  url = url.trim().replace(/\/+$/, '');
  return url || 'https://minecraft-server-backend-ub33.onrender.com';
}

export function setApiUrl(url: string) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('backend_api_url', url);
  }
  BASE_URL = url;
}

async function apiFetch(url: string, options: RequestInit = {}) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('portal_auth_token') : null;
  const headers = new Headers(options.headers || {});
  if (token) headers.set('Authorization', `Bearer ${token}`);
  
  const res = await fetch(url, { ...options, headers });
  if (res.status === 401) {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('portal_auth_token');
      window.location.href = '/login';
    }
    throw new Error('Unauthorized');
  }
  return res;
}

export async function fetchServerStatus() {
  const res = await apiFetch(`${getApiUrl()}/api/server/status`);
  if (!res.ok) throw new Error('Failed to fetch server status');
  return res.json();
}

export async function startServer() {
  const res = await apiFetch(`${getApiUrl()}/api/server/start`, { method: 'POST' });
  if (!res.ok) throw new Error('Failed to start server');
  return res.json();
}

export async function stopServer() {
  const res = await apiFetch(`${getApiUrl()}/api/server/stop`, { method: 'POST' });
  if (!res.ok) throw new Error('Failed to stop server');
  return res.json();
}

export async function rebootServer() {
  const res = await apiFetch(`${getApiUrl()}/api/server/reboot`, { method: 'POST' });
  if (!res.ok) throw new Error('Failed to reboot server');
  return res.json();
}

export interface Metrics {
  cpu_usage: number;
  ram_usage: number;
  tps: number;
}

export async function fetchMetrics(): Promise<Metrics> {
  const res = await apiFetch(`${getApiUrl()}/api/server/metrics`);
  if (!res.ok) throw new Error('Failed to fetch metrics');
  return res.json();
}

export async function fetchWhitelist() {
  const res = await apiFetch(`${getApiUrl()}/api/minecraft/whitelist`);
  if (!res.ok) throw new Error('Failed to fetch whitelist');
  return res.json();
}

export async function addToWhitelist(username: string) {
  const res = await apiFetch(`${getApiUrl()}/api/minecraft/whitelist`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username })
  });
  if (!res.ok) throw new Error('Failed to add to whitelist');
  return res.json();
}

export async function removeFromWhitelist(username: string) {
  const res = await apiFetch(`${getApiUrl()}/api/minecraft/whitelist`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username })
  });
  if (!res.ok) throw new Error('Failed to remove from whitelist');
  return res.json();
}

export async function fetchOnlinePlayers() {
  const res = await apiFetch(`${getApiUrl()}/api/minecraft/players`);
  if (!res.ok) throw new Error('Failed to fetch online players');
  return res.json();
}

export async function fetchWorldState() {
  const res = await apiFetch(`${getApiUrl()}/api/minecraft/world/state`);
  if (!res.ok) throw new Error('Failed to fetch world state');
  return res.json();
}

export const executeCommand = async (command: string) => {
  const res = await apiFetch(`${getApiUrl()}/api/minecraft/command`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ command }),
  });
  if (!res.ok) throw new Error('Command failed');
  return res.json();
};

export const setTime = async (action: 'day' | 'night') => {
  const res = await apiFetch(`${getApiUrl()}/api/minecraft/time`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action }),
  });
  if (!res.ok) throw new Error('Time set failed');
  return res.json();
};

export const setWeather = async (action: 'clear' | 'rain' | 'thunder') => {
  const res = await apiFetch(`${getApiUrl()}/api/minecraft/weather`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action }),
  });
  if (!res.ok) throw new Error('Weather set failed');
  return res.json();
};

export const setGameMode = async (mode: string, username: string) => {
  const res = await apiFetch(`${getApiUrl()}/api/minecraft/gamemode`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ mode, username }),
  });
  if (!res.ok) throw new Error('Gamemode set failed');
  return res.json();
};
