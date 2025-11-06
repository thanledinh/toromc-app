// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://163.61.183.161:3000'

export const API_ENDPOINTS = {
  HOMEPAGE: `${API_BASE_URL}/api/homepage`,
  SETTINGS: `${API_BASE_URL}/api/settings`,
  AUTH: {
    LOGIN: `${API_BASE_URL}/api/auth/login`,
    REGISTER: `${API_BASE_URL}/api/auth/register`,
    LOGOUT: `${API_BASE_URL}/api/auth/logout`,
    REFRESH: `${API_BASE_URL}/api/auth/refresh`,
  },
  USER: {
    PROFILE: `${API_BASE_URL}/api/user/profile`,
    UPDATE: `${API_BASE_URL}/api/user/update`,
  }
}

export const API_CONFIG = {
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
}

export default API_ENDPOINTS
