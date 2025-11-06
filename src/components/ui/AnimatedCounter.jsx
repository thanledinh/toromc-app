import { useEffect, useState } from 'react'
import { ANIMATION } from '../../configs/constants'

const AnimatedCounter = ({ 
  value, 
  prefix = '', 
  suffix = '', 
  duration = ANIMATION.COUNTER_DURATION, 
  className = 'text-3xl font-semibold text-white' 
}) => {
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    let start = null
    let animationFrame = 0
    const target = Number.isFinite(Number(value)) ? Number(value) : 0

    const step = (timestamp) => {
      if (!start) {
        start = timestamp
      }
      const progress = Math.min((timestamp - start) / duration, 1)
      const current = Math.round(target * progress)
      setDisplayValue(current > target ? target : current)
      if (progress < 1) {
        animationFrame = window.requestAnimationFrame(step)
      }
    }

    animationFrame = window.requestAnimationFrame(step)

    return () => {
      window.cancelAnimationFrame(animationFrame)
    }
  }, [value, duration])

  const formatted = displayValue.toLocaleString('vi-VN')

  return <span className={className}>{`${prefix}${formatted}${suffix}`}</span>
}

export default AnimatedCounter
