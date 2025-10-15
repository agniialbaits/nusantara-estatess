// Centralized API client reusing existing HTTP utilities
// Uses Vite env VITE_API_BASE_URL (configured in .env and .env.production)

export { httpFetch, getBaseUrl } from '../services/httpClient';