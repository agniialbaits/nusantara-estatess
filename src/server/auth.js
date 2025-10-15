// Auth endpoints – mirrors Postman: POST /api/login
import { httpFetch } from './client';

/**
 * POST /api/login
 * @param {{ username: string; password: string }} credentials
 */
export async function login(credentials) {
  return httpFetch('/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
}