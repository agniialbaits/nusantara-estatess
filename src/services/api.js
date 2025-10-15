// API service untuk komunikasi dengan backend
// NOTE: Generic data APIs tetap di sini. Auth dipindahkan ke src/services/authService.js

import { httpFetch } from './httpClient';

class ApiService {
  // Generic fetch method dengan error handling (delegasi ke httpFetch)
  async fetchData(endpoint, options = {}) {
    try {
      return await httpFetch(endpoint, options);
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Mengambil data properties dengan filter
  async getProperties(filters = {}) {
    const { tipe, lokasi, page = 1, limit = 10 } = filters;
    
    const queryParams = new URLSearchParams();
    if (tipe && tipe !== 'Semua Tipe') queryParams.append('tipe', tipe);
    if (lokasi && lokasi.trim() !== '') queryParams.append('lokasi', lokasi);
    queryParams.append('page', page);
    queryParams.append('limit', limit);

    const endpoint = `/properties?${queryParams.toString()}`;
    return await this.fetchData(endpoint);
  }

  // Mengambil detail property berdasarkan ID
  async getPropertyById(id) {
    return await this.fetchData(`/properties/${id}`);
  }

  // Register user (tetap di generic API)
  async register(userData) {
    return await this.fetchData('/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  // Search rumah (untuk backward compatibility)
  async searchRumah(searchData) {
    return await this.fetchData('/search-rumah', {
      method: 'POST',
      body: JSON.stringify(searchData),
    });
  }

  // Test database connection
  async testDatabase() {
    return await this.fetchData('/test-db');
  }

  // ==================== ADMIN ONLY METHODS ====================

  // Get all properties for admin
  async getAdminProperties(page = 1, limit = 20) {
    return await this.fetchData(`/admin/properties?page=${page}&limit=${limit}`);
  }

  // Add new property (admin only)
  async addProperty(propertyData) {
    return await this.fetchData('/admin/properties', {
      method: 'POST',
      body: JSON.stringify(propertyData),
    });
  }

  // Get property by ID (admin only)
  async getAdminPropertyById(id) {
    return await this.fetchData(`/admin/properties/${id}`);
  }

  // Update property (admin only)
  async updateProperty(id, propertyData) {
    return await this.fetchData(`/admin/properties/${id}`, {
      method: 'PUT',
      body: JSON.stringify(propertyData),
    });
  }

  // Delete property (admin only)
  async deleteProperty(id) {
    return await this.fetchData(`/admin/properties/${id}`, {
      method: 'DELETE',
    });
  }

  // Get admin statistics
  async getAdminStats() {
    return await this.fetchData('/admin/stats');
  }
}

// Export singleton instance
const apiService = new ApiService();
export default apiService;