import { API_ENDPOINTS, API_CONFIG } from '../configs/api'
import { getCookie, setCookie, removeCookie } from '../utils/cookie'

/**
 * Base API service class
 */
class ApiService {
  constructor() {
    this.baseURL = API_ENDPOINTS
    this.config = API_CONFIG
    this.TOKEN_COOKIE_NAME = 'toromc_auth_token'
  }

  /**
   * Lấy token từ cookies
   * @returns {string|null} - Token hoặc null
   */
  getToken() {
    try {
      return getCookie(this.TOKEN_COOKIE_NAME)
    } catch {
      return null
    }
  }

  /**
   * Lưu token vào cookies
   * @param {string} token - Token cần lưu
   * @param {number} days - Số ngày hết hạn (mặc định: 7 ngày)
   */
  setToken(token, days = 7) {
    if (token) {
      setCookie(this.TOKEN_COOKIE_NAME, token, days, {
        secure: true,
        sameSite: 'Strict',
        path: '/'
      })
    } else {
      removeCookie(this.TOKEN_COOKIE_NAME, { path: '/' })
    }
  }

  /**
   * Make HTTP request
   * @param {string} url - Request URL
   * @param {object} options - Request options
   * @returns {Promise<any>} - Response data
   */
  async request(url, options = {}) {
    // Lấy token từ cookies
    const token = this.getToken()
    
    // Tạo headers với token nếu có
    const headers = {
      ...this.config.headers,
      ...options.headers,
    }
    
    // Thêm token vào query string nếu là GET request và có token
    // Với POST/PUT/DELETE, token sẽ được truyền trong body hoặc headers nếu cần
    if (token && options.useToken !== false) {
      const method = options.method || 'GET'
      // Chỉ thêm token vào query string cho GET request
      if (method === 'GET') {
        if (url.includes('?')) {
          url += `&token=${encodeURIComponent(token)}`
        } else {
          url += `?token=${encodeURIComponent(token)}`
        }
      }
      // Có thể thêm vào headers nếu backend yêu cầu
      // headers['Authorization'] = `Bearer ${token}`
    }

    const config = {
      ...this.config,
      ...options,
      headers,
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
