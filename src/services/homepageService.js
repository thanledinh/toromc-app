import { apiService } from './api'
import { API_ENDPOINTS } from '../configs/api'

/**
 * Homepage service for fetching homepage data
 */
export const homepageService = {
  /**
   * Fetch homepage data
   * @returns {Promise<object>} - Homepage data
   */
  async getHomepageData() {
    try {
      const data = await apiService.get(API_ENDPOINTS.HOMEPAGE)
      return data
    } catch (error) {
      throw new Error(error.message || 'Không thể tải dữ liệu trang chủ')
    }
  },

  /**
   * Fetch settings data
   * @returns {Promise<object>} - Settings data
   */
  async getSettings() {
    try {
      const data = await apiService.get(API_ENDPOINTS.SETTINGS)
      return data
    } catch (error) {
      throw new Error(error.message || 'Không thể tải cấu hình')
    }
  },
}

export default homepageService
