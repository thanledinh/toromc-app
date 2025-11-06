import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import { UI } from '../configs/constants'

const MainLayout = ({ children }) => {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > UI.SCROLL_THRESHOLD)
    }
    
    handleScroll()
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100">
      {/* Background */}
      <div className="pointer-events-none fixed inset-0 -z-10 opacity-90" aria-hidden>
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(circle at 20% 20%, rgba(245,158,11,0.28), transparent 55%), radial-gradient(circle at 80% 10%, rgba(59,130,246,0.25), transparent 45%), radial-gradient(circle at 50% 80%, rgba(147,51,234,0.2), transparent 55%)',
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage:
              'linear-gradient(120deg, rgba(148,163,184,0.5) 1px, transparent 1px), linear-gradient(0deg, rgba(148,163,184,0.35) 1px, transparent 1px)',
            backgroundSize: '80px 80px',
          }}
        />
      </div>

      {children || <Outlet />}
    </div>
  )
}

export default MainLayout
