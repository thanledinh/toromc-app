import { useEffect, useState } from 'react'
import { processImage } from '../utils/imageProcessing'

/**
 * Custom hook to process logo image
 * @param {string} url - Image URL
 * @returns {string} - Processed image URL
 */
export const useProcessedLogo = (url) => {
  const [processed, setProcessed] = useState('')

  useEffect(() => {
    if (!url) {
      setProcessed('')
      return
    }

    let cancelled = false

    processImage(url).then((result) => {
      if (!cancelled) {
        setProcessed(result)
      }
    })

    return () => {
      cancelled = true
    }
  }, [url])

  return processed || url || ''
}

export default useProcessedLogo
