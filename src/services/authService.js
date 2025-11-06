import { apiService } from './api'
import { API_ENDPOINTS } from '../configs/api'

/**
 * Authentication service for user auth operations
 */
export const authService = {
  /**
   * Đăng ký tài khoản mới
   * @param {object} userData - Thông tin đăng ký
   * @param {string} userData.lastNickname - Username
   * @param {string} userData.password - Mật khẩu
   * @param {string} userData.mailAddress - Email
   * @param {string} userData.premiumId - Premium ID
   * @returns {Promise<object>} - Kết quả đăng ký
   */
  async register(userData) {
    try {
      const data = await apiService.post(API_ENDPOINTS.AUTH.REGISTER, {
        lastNickname: userData.username || userData.lastNickname,
        password: userData.password,
        mailAddress: userData.email || userData.mailAddress,
        premiumId: userData.premiumId || `premium_${Date.now()}`
      })
      
      // Lưu token và thông tin user vào localStorage nếu đăng ký thành công
      if (data.token) {
        apiService.setToken(data.token)
      }
      
      if (data.uniqueId) {
        localStorage.setItem('user', JSON.stringify(data))
        localStorage.setItem('uniqueId', data.uniqueId)
      }
      
      return data
    } catch (error) {
      throw new Error(error.message || 'Đăng ký không thành công')
    }
  },

  /**
   * Đăng nhập
   * @param {object} credentials - Thông tin đăng nhập
   * @param {string} credentials.lastNickname - Username
   * @param {string} credentials.password - Mật khẩu
   * @returns {Promise<object>} - Thông tin user sau khi đăng nhập
   */
  async login(credentials) {
    try {
      const data = await apiService.post(API_ENDPOINTS.AUTH.LOGIN, {
        lastNickname: credentials.username || credentials.lastNickname,
        password: credentials.password
      })
      
      // Lưu token vào localStorage
      if (data.token) {
        apiService.setToken(data.token)
      }
      
      // Lưu thông tin user vào localStorage
      const userData = data.user || data
      if (userData.uniqueId || data.uniqueId) {
        localStorage.setItem('user', JSON.stringify(userData))
        localStorage.setItem('uniqueId', userData.uniqueId || data.uniqueId)
      }
      
      return data
    } catch (error) {
      throw new Error(error.message || 'Đăng nhập không thành công')
    }
  },

  /**
   * Lấy thông tin profile user
   * @param {string} uniqueId - ID của user
   * @returns {Promise<object>} - Thông tin profile
   */
  async getProfile(uniqueId) {
    try {
      if (!uniqueId) {
        uniqueId = localStorage.getItem('uniqueId')
      }
      
      if (!uniqueId) {
        throw new Error('Không tìm thấy thông tin user')
      }
      
      const data = await apiService.get(`${API_ENDPOINTS.AUTH.PROFILE}/${uniqueId}`)
      return data
    } catch (error) {
      throw new Error(error.message || 'Không thể tải thông tin profile')
    }
  },

  /**
   * Kiểm tra session
   * @param {string} uniqueId - ID của user
   * @returns {Promise<object>} - Thông tin session
   */
  async checkSession(uniqueId) {
    try {
      if (!uniqueId) {
        uniqueId = localStorage.getItem('uniqueId')
      }
      
      if (!uniqueId) {
        throw new Error('Không tìm thấy thông tin session')
      }
      
      const data = await apiService.get(`${API_ENDPOINTS.AUTH.SESSION}/${uniqueId}`)
      return data
    } catch (error) {
      throw new Error(error.message || 'Session không hợp lệ')
    }
  },

  /**
   * Gia hạn session
   * @param {string} uniqueId - ID của user
   * @returns {Promise<object>} - Thông tin session mới
   */
  async refreshSession(uniqueId) {
    try {
      if (!uniqueId) {
        uniqueId = localStorage.getItem('uniqueId')
      }
      
      if (!uniqueId) {
        throw new Error('Không tìm thấy thông tin session')
      }
      
      const data = await apiService.post(`${API_ENDPOINTS.AUTH.REFRESH_SESSION}/${uniqueId}/refresh`)
      return data
    } catch (error) {
      throw new Error(error.message || 'Không thể gia hạn session')
    }
  },

  /**
   * Lấy thông tin user từ token
   * @returns {Promise<object>} - Thông tin user
   */
  async getMe() {
    try {
      const token = apiService.getToken()
      if (!token) {
        throw new Error('Không tìm thấy token')
      }
      
      const data = await apiService.get(API_ENDPOINTS.AUTH.ME)
      return data
    } catch (error) {
      throw new Error(error.message || 'Không thể lấy thông tin user')
    }
  },

  /**
   * Verify token
   * @param {string} token - Token cần verify (optional, nếu không có sẽ dùng token từ localStorage)
   * @returns {Promise<object>} - Kết quả verify
   */
  async verifyToken(token = null) {
    try {
      const tokenToVerify = token || apiService.getToken()
      if (!tokenToVerify) {
        throw new Error('Không tìm thấy token')
      }
      
      const data = await apiService.post(API_ENDPOINTS.AUTH.VERIFY, {
        token: tokenToVerify
      })
      return data
    } catch (error) {
      throw new Error(error.message || 'Token không hợp lệ')
    }
  },

  /**
   * Đăng xuất
   */
  logout() {
    localStorage.removeItem('user')
    localStorage.removeItem('uniqueId')
    apiService.setToken(null)
  },

  /**
   * Lấy thông tin user từ localStorage
   * @returns {object|null} - Thông tin user hoặc null
   */
  getCurrentUser() {
    try {
      const user = localStorage.getItem('user')
      return user ? JSON.parse(user) : null
    } catch {
      return null
    }
  },

  /**
   * Kiểm tra user đã đăng nhập chưa
   * @returns {boolean} - True nếu đã đăng nhập
   */
  isAuthenticated() {
    const user = this.getCurrentUser()
    const uniqueId = localStorage.getItem('uniqueId')
    const token = apiService.getToken()
    return !!(user && uniqueId && token)
  },

  /**
   * Lấy token từ localStorage
   * @returns {string|null} - Token hoặc null
   */
  getToken() {
    return apiService.getToken()
  }
}

export default authService
