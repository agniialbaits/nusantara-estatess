// Public endpoints – mirrors Postman: GET /api/properties, GET /api/properties/:id
import { httpFetch } from './client';

/**
 * GET /api/properties?tipe=&lokasi=&page=1&limit=10
 */
export async function getProperties({ tipe = '', lokasi = '', page = 1, limit = 10 } = {}) {
  const params = new URLSearchParams();
  if (typeof tipe === 'string') params.append('tipe', tipe);
  if (typeof lokasi === 'string') params.append('lokasi', lokasi);
  params.append('page', String(page));
  params.append('limit', String(limit));
  return httpFetch(`/properties?${params.toString()}`);
}

/**
 * GET /api/properties/:id
 */
export async function getPropertyById(id) {
  return httpFetch(`/properties/${id}`);
}