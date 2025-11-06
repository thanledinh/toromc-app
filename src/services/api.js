import { API_ENDPOINTS, API_CONFIG } from '../configs/api'

/**
 * Base API service class
 */
class ApiService {
  constructor() {
    this.baseURL = API_ENDPOINTS
    this.config = API_CONFIG
  }

  /**
   * Make HTTP request
   * @param {string} url - Request URL
   * @param {object} options - Request options
   * @returns {Promise<any>} - Response data
   */
  async request(url, options = {}) {
    const config = {
      ...this.config,
      ...options,
      headers: {
        ...this.config.headers,
        ...options.headers,
      },
    }

    try {
      const response = await fetch(url, config)
      
      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(errorText || `HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('API request failed:', error)
      throw error
    }
  }

  /**
   * GET request
   * @param {string} url - Request URL
   * @param {object} options - Request options
   * @returns {Promise<any>} - Response data
   */
  async get(url, options = {}) {
    return this.request(url, {
      ...options,
      method: 'GET',
    })
  }

  /**
   * POST request
   * @param {string} url - Request URL
   * @param {any} data - Request body data
   * @param {object} options - Request options
   * @returns {Promise<any>} - Response data
   */
  async post(url, data, options = {}) {
    return this.request(url, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  /**
   * PUT request
   * @param {string} url - Request URL
   * @param {any} data - Request body data
   * @param {object} options - Request options
   * @returns {Promise<any>} - Response data
   */
  async put(url, data, options = {}) {
    return this.request(url, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  /**
   * DELETE request
   * @param {string} url - Request URL
   * @param {object} options - Request options
   * @returns {Promise<any>} - Response data
   */
  async delete(url, options = {}) {
    return this.request(url, {
      ...options,
      method: 'DELETE',
    })
  }
}

export const apiService = new ApiService()
export default apiService
