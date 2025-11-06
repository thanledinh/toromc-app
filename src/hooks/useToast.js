import { useEffect, useState } from 'react'
import { ANIMATION } from '../configs/constants'

/**
 * Custom hook for toast notifications
 * @returns {object} - Toast state and functions
 */
export const useToast = () => {
  const [toast, setToast] = useState(null)

  useEffect(() => {
    if (!toast) return

    const timer = setTimeout(() => {
      setToast(null)
    }, ANIMATION.TOAST_DURATION)

    return () => clearTimeout(timer)
  }, [toast])

  const showToast = (message, tone = 'success') => {
    setToast({ message, tone })
  }

  const hideToast = () => {
    setToast(null)
  }

  return {
    toast,
    showToast,
    hideToast,
  }
}

export default useToast
