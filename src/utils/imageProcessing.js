import { UI } from '../configs/constants'

/**
 * Process image to remove background and resize
 * @param {string} url - Image URL
 * @returns {Promise<string>} - Processed image data URL
 */
export const processImage = (url) => {
  return new Promise((resolve, reject) => {
    if (!url) {
      resolve('')
      return
    }

    const img = new Image()
    img.crossOrigin = 'anonymous'
    
    img.onload = () => {
      try {
        const maxSize = UI.MAX_LOGO_SIZE
        const scale = Math.min(1, maxSize / Math.max(img.width, img.height))
        const w = Math.max(1, Math.round(img.width * scale))
        const h = Math.max(1, Math.round(img.height * scale))
        
        const canvas = document.createElement('canvas')
        canvas.width = w
        canvas.height = h
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, w, h)
        
        const imageData = ctx.getImageData(0, 0, w, h)
        const data = imageData.data
        
        // Get background color from top-left corner
        const keyR = data[0], keyG = data[1], keyB = data[2]
        const threshold = UI.COLOR_THRESHOLD
        
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i]
          const g = data[i + 1]
          const b = data[i + 2]
          const dr = r - keyR
          const dg = g - keyG
          const db = b - keyB
          const dist = Math.sqrt(dr * dr + dg * dg + db * db)
          
          if (dist <= threshold) {
            data[i + 3] = 0 // alpha = 0
          }
        }
        
        ctx.putImageData(imageData, 0, 0)
        const dataUrl = canvas.toDataURL('image/png')
        resolve(dataUrl)
      } catch (error) {
        resolve('')
      }
    }
    
    img.onerror = () => resolve('')
    img.src = url
  })
}

/**
 * Update favicon dynamically
 * @param {string} iconUrl - Icon URL
 */
export const updateFavicon = (iconUrl) => {
  if (!iconUrl) return
  
  let link = document.querySelector("link[rel='icon']")
  if (!link) {
    link = document.createElement('link')
    link.rel = 'icon'
    document.head.appendChild(link)
  }
  link.type = 'image/png'
  link.href = iconUrl
}
