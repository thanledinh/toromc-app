/**
 * Smooth scroll to element by ID
 * @param {string} elementId - Element ID to scroll to
 */
export const scrollToElement = (elementId) => {
  if (!elementId) return

  const element = document.getElementById(elementId)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

/**
 * Check if element is in viewport
 * @param {HTMLElement} element - Element to check
 * @returns {boolean} - Whether element is in viewport
 */
export const isElementInViewport = (element) => {
  if (!element) return false

  const rect = element.getBoundingClientRect()
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  )
}

/**
 * Get scroll position
 * @returns {number} - Current scroll Y position
 */
export const getScrollY = () => {
  return window.scrollY || window.pageYOffset || document.documentElement.scrollTop
}

export default {
  scrollToElement,
  isElementInViewport,
  getScrollY,
}
