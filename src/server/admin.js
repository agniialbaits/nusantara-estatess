// Admin endpoints – mirrors Postman Admin APIs
// Requires Bearer token – our http client auto-injects localStorage token
import { httpFetch } from './client';

/**
 * GET /api/admin/properties?page=1&limit=20
 */
export async function getAdminProperties({ page = 1, limit = 20 } = {}) {
  const params = new URLSearchParams({ page: String(page), limit: String(limit) });
  return httpFetch(`/admin/properties?${params.toString()}`);
}

/**
 * POST /api/admin/properties
 */
export async function createProperty(data) {
  return httpFetch('/admin/properties', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * GET /api/admin/properties/:id
 */
export async function getAdminPropertyById(id) {
  return httpFetch(`/admin/properties/${id}`);
}

/**
 * PUT /api/admin/properties/:id
 */
export async function updateProperty(id, data) {
  return httpFetch(`/admin/properties/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

/**
 * DELETE /api/admin/properties/:id
 */
export async function deleteProperty(id) {
  return httpFetch(`/admin/properties/${id}`, {
    method: 'DELETE',
  });
}