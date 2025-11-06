// Application Constants

// Routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
  SETTINGS: '/settings',
}

// Animation Durations
export const ANIMATION = {
  FAST: 200,
  NORMAL: 300,
  SLOW: 500,
  COUNTER_DURATION: 1400,
  TOAST_DURATION: 2400,
  MODE_SWITCH_DURATION: 6000,
}

// UI Constants
export const UI = {
  SCROLL_THRESHOLD: 32,
  INTERSECTION_THRESHOLD: 0.45,
  INTERSECTION_ROOT_MARGIN: '-15% 0px -35% 0px',
  MAX_LOGO_SIZE: 192,
  COLOR_THRESHOLD: 45,
}

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'toromc_auth_token',
  USER_PREFERENCES: 'toromc_user_preferences',
  THEME: 'toromc_theme',
}

// Status Constants
export const STATUS = {
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCEEDED: 'succeeded',
  FAILED: 'failed',
}

export default {
  ROUTES,
  ANIMATION,
  UI,
  STORAGE_KEYS,
  STATUS,
}
