// Lightweight HTTP client with base URL and token handling
// Configure base URL via Vite env: VITE_API_BASE_URL
// Fallbacks to local dev API if env is not set

const DEFAULT_BASE_URL = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE_URL)
  ? import.meta.env.VITE_API_BASE_URL
  : 'http://localhost:5174/api';

async function readResponseSafely(response) {
  // Try to read JSON first, fall back to text
  const contentType = response.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    try {
      return await response.json();
    } catch (_) {
      return null;
    }
  }
  try {
    const text = await response.text();
    return text || null;
  } catch (_) {
    return null;
  }
}

export async function httpFetch(endpoint, options = {}) {
  const token = (typeof window !== 'undefined' && window.localStorage)
    ? window.localStorage.getItem('token')
    : null;

  const url = `${DEFAULT_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
    ...options,
  });

  const payload = await readResponseSafely(response);

  if (!response.ok) {
    const error = new Error(
      (payload && typeof payload === 'object' && (payload.message || payload.error))
        || (typeof payload === 'string' ? payload : `HTTP ${response.status}`)
    );
    error.status = response.status;
    error.payload = payload;
    throw error;
  }

  return payload;
}

export function getBaseUrl() {
  return DEFAULT_BASE_URL;
}