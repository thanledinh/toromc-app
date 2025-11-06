// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'

export const API_ENDPOINTS = {
  HOMEPAGE: `${API_BASE_URL}/api/homepage`,
  SETTINGS: `${API_BASE_URL}/api/settings`,
  AUTH: {
    LOGIN: `${API_BASE_URL}/auth/login`,
    REGISTER: `${API_BASE_URL}/auth/register`,
    PROFILE: `${API_BASE_URL}/auth/profile`,
    SESSION: `${API_BASE_URL}/auth/session`,
    REFRESH_SESSION: `${API_BASE_URL}/auth/session`,
    ME: `${API_BASE_URL}/auth/me`,
    VERIFY: `${API_BASE_URL}/auth/verify`,
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
