// Auth-specific API calls isolated from generic services
// Provides a clean login function that hits the deployed backend

import { httpFetch } from './httpClient';

/**
 * Login with username and password
 * @param {{ username: string; password: string }} credentials
 * @returns {Promise<any>} server response (e.g., token/user info)
 */
export async function login(credentials) {
  // Endpoint matches: https://nusantara-estates-backend-dev.vercel.app/api/login
  // Configure base via VITE_API_BASE_URL for prod: "https://nusantara-estates-backend-dev.vercel.app/api"
  return httpFetch('/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
}

/**
 * Persist token if backend returns one
 * @param {string} token
 */
export function saveAuthToken(token) {
  if (typeof window !== 'undefined' && window.localStorage) {
    window.localStorage.setItem('token', token);
  }
}

/**
 * Clear token on logout
 */
export function clearAuthToken() {
  if (typeof window !== 'undefined' && window.localStorage) {
    window.localStorage.removeItem('token');
  }
}