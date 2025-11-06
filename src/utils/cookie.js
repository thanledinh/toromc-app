/**
 * Cookie utility functions
 */

/**
 * Set a cookie
 * @param {string} name - Cookie name
 * @param {string} value - Cookie value
 * @param {number} days - Number of days until expiration (default: 7)
 * @param {object} options - Additional options (path, domain, secure, sameSite)
 */
export const setCookie = (name, value, days = 7, options = {}) => {
  const {
    path = '/',
    domain = '',
    secure = true,
    sameSite = 'Strict'
  } = options

  const expires = new Date()
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000)

  let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)};expires=${expires.toUTCString()};path=${path}`

  if (domain) {
    cookieString += `;domain=${domain}`
  }

  if (secure) {
    cookieString += ';secure'
  }

  if (sameSite) {
    cookieString += `;sameSite=${sameSite}`
  }

  document.cookie = cookieString
}

/**
 * Get a cookie value
 * @param {string} name - Cookie name
 * @returns {string|null} - Cookie value or null if not found
 */
export const getCookie = (name) => {
  const nameEQ = encodeURIComponent(name) + '='
  const cookies = document.cookie.split(';')

  for (let i = 0; i < cookies.length; i++) {
    let cookie = cookies[i]
    while (cookie.charAt(0) === ' ') {
      cookie = cookie.substring(1, cookie.length)
    }
    if (cookie.indexOf(nameEQ) === 0) {
      return decodeURIComponent(cookie.substring(nameEQ.length, cookie.length))
    }
  }

  return null
}

/**
 * Remove a cookie
 * @param {string} name - Cookie name
 * @param {object} options - Additional options (path, domain)
 */
export const removeCookie = (name, options = {}) => {
  const { path = '/', domain = '' } = options

  let cookieString = `${encodeURIComponent(name)}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=${path}`

  if (domain) {
    cookieString += `;domain=${domain}`
  }

  document.cookie = cookieString
}

/**
 * Check if a cookie exists
 * @param {string} name - Cookie name
 * @returns {boolean} - True if cookie exists
 */
export const hasCookie = (name) => {
  return getCookie(name) !== null
}

export default {
  setCookie,
  getCookie,
  removeCookie,
  hasCookie,
}
