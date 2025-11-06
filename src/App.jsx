import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import './assets/styles/App.css'
import {
  fetchHomepage,
  selectHomepageData,
  selectHomepageError,
  selectHomepageStatus,
  fetchSettings,
  selectHomepageSettings,
  selectHomepageSettingsStatus,
} from './redux/slices/homepageSlice'
import { 
  MenuIcon,
  CloseIcon, 
  ArrowRightIcon,
  CopyIcon,
  CheckIcon,
  AlertIcon,
  DiscordIcon,
  SparkIcon,
  LightningIcon,
  ChevronDownIcon
} from './components/icons'
import { AnimatedCounter, Toast } from './components/ui'
import { useProcessedLogo, useToast } from './hooks'
import { copyToClipboard, scrollToElement, updateFavicon } from './utils'
import { ANIMATION, UI, ROUTES } from './configs/constants'



function App() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const homepage = useSelector(selectHomepageData)
  const status = useSelector(selectHomepageStatus)
  const error = useSelector(selectHomepageError)
  const settings = useSelector(selectHomepageSettings)
  const settingsStatus = useSelector(selectHomepageSettingsStatus)

  const {
    navLinks = [],
    stats = [],
    ipAddresses = [],
    featureCards = [],
    modes = [],
    steps = [],
    faqs = [],
    contactCards = [],
    upcomingEvents = [],
  } = homepage

  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('home')
  const [isScrolled, setIsScrolled] = useState(false)
  const { toast, showToast } = useToast()
  const [copiedTarget, setCopiedTarget] = useState('')
  const [activeMode, setActiveMode] = useState(0)
  const [openFaq, setOpenFaq] = useState(null)
  const copyTimeoutRef = useRef(null)

  const isLoading = status === 'loading'
  const isError = status === 'failed'

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchHomepage())
    }
  }, [status, dispatch])

  useEffect(() => {
    if (settingsStatus === 'idle') {
      dispatch(fetchSettings())
    }
  }, [settingsStatus, dispatch])

  const navAnchors = useMemo(
    () => navLinks.map((link) => link.anchorId).filter(Boolean),
    [navLinks],
  )

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > UI.SCROLL_THRESHOLD)
    }
    handleScroll()
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (!navAnchors.length) {
      return undefined
    }

    const sections = navAnchors
      .map((anchor) => document.getElementById(anchor))
      .filter(Boolean)

    if (!sections.length) {
      return undefined
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        })
      },
      {
        threshold: UI.INTERSECTION_THRESHOLD,
        rootMargin: UI.INTERSECTION_ROOT_MARGIN,
      },
    )

    sections.forEach((section) => observer.observe(section))

    return () => {
      sections.forEach((section) => observer.unobserve(section))
      observer.disconnect()
    }
  }, [navAnchors])

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMenuOpen(false)
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    setActiveMode(0)
  }, [modes.length])

  useEffect(() => {
    if (modes.length < 2) {
      return undefined
    }

    const timer = window.setInterval(() => {
      setActiveMode((prev) => {
        if (!modes.length) {
          return 0
        }
        return (prev + 1) % modes.length
      })
    }, ANIMATION.MODE_SWITCH_DURATION)

    return () => window.clearInterval(timer)
  }, [modes.length])


  useEffect(
    () => () => {
      if (copyTimeoutRef.current) {
        window.clearTimeout(copyTimeoutRef.current)
      }
    },
    [],
  )

  const activeModeData = modes.length ? modes[Math.min(activeMode, modes.length - 1)] : null

  const handleNavClick = (anchorId) => {
    if (!anchorId) return
    setIsMenuOpen(false)
    scrollToElement(anchorId)
  }

  const handleCopy = async (item) => {
    if (!item || !item.value) return

    const success = await copyToClipboard(item.value)
    
    if (success) {
      setCopiedTarget(item.value)
      showToast(`${item.label}: Đã copy IP`, 'success')

      if (copyTimeoutRef.current) {
        window.clearTimeout(copyTimeoutRef.current)
      }
      copyTimeoutRef.current = window.setTimeout(() => setCopiedTarget(''), 2000)
    } else {
      showToast('Không thể copy IP, vui lòng thử lại.', 'error')
    }
  }

  const logoSrc = useProcessedLogo(settings.logoUrl)

  useEffect(() => {
    if (logoSrc) {
      updateFavicon(logoSrc)
    }
  }, [logoSrc])

  const toggleFaq = (id) => {
    setOpenFaq((prev) => (prev === id ? null : id))
  }

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100">
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

      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? 'border-b border-amber-500/20 bg-slate-950/90 backdrop-blur-xl shadow-[0_20px_60px_-35px_rgba(245,158,11,0.8)]'
            : 'bg-transparent'
        }`}
      >
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="relative flex h-20 w-20 items-center justify-center overflow-hidden rounded-xl border border-amber-500/40 bg-amber-500/10 shadow-[0_0_35px_-10px_rgba(245,158,11,0.9)]">
              <img
                src={logoSrc || '/logo/logo.png'}
                alt="ToroMC Logo"
                className="h-20 w-20 object-contain"
                draggable={false}
              />
            </div>
            <div className="leading-tight">
              <p className="text-xl font-semibold text-white">ToroMC</p>
              <p className="text-[11px] uppercase tracking-[0.4em] text-amber-300/70">Dominion</p>
            </div>
          </div>

          <div className="hidden items-center gap-1 lg:flex">
            {navLinks.map((link) => (
              <button
                key={link.id ?? link.anchorId ?? link.label}
                type="button"
                onClick={() => handleNavClick(link.anchorId)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  activeSection === link.anchorId
                    ? 'bg-amber-500/20 text-amber-200 shadow-[0_14px_44px_-20px_rgba(245,158,11,1)] backdrop-blur'
                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="hidden items-center gap-3 lg:flex">
            <button
              type="button"
              onClick={() => handleNavClick('contact')}
              className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full border border-amber-500/40 bg-amber-500/10 px-5 py-2 text-sm font-semibold text-amber-200 transition hover:-translate-y-0.5 hover:border-amber-300 hover:bg-amber-500/20 hover:text-white"
            >
              <span
                className="absolute inset-0 opacity-0 blur-lg transition-opacity duration-500 group-hover:opacity-70"
                style={{
                  background:
                    'linear-gradient(90deg, rgba(245,158,11,0.5) 0%, rgba(59,130,246,0.15) 100%)',
                }}
              />
              <span className="relative flex items-center gap-2">
                <DiscordIcon className="h-4 w-4" />
                Discord
              </span>
            </button>
            <button
              type="button"
              onClick={() => navigate(ROUTES.LOGIN)}
              className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full border border-amber-400/60 bg-amber-500/20 px-5 py-2 text-sm font-semibold text-amber-100 transition hover:-translate-y-0.5 hover:border-amber-300 hover:bg-amber-500/30 hover:text-white"
            >
              <span
                className="absolute inset-0 opacity-0 blur-lg transition-opacity duration-500 group-hover:opacity-70"
                style={{
                  background:
                    'linear-gradient(100deg, rgba(245,158,11,0.55) 0%, rgba(59,130,246,0.25) 60%, transparent 100%)',
                }}
              />
              <span className="relative flex items-center gap-2">
                Đăng nhập
                <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </span>
            </button>
          </div>

          <button
            type="button"
            className="inline-flex items-center justify-center rounded-lg border border-white/10 bg-white/5 p-2 text-slate-200 transition hover:border-white/30 hover:text-white lg:hidden"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <CloseIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
          </button>
        </nav>

        {isMenuOpen && (
          <div className="mx-auto max-w-6xl px-6 pb-6 lg:hidden">
            <div className="space-y-2 rounded-2xl border border-white/10 bg-white/5 p-4">
              {navLinks.map((link) => (
                <button
                  key={link.id ?? link.anchorId ?? link.label}
                  type="button"
                  onClick={() => handleNavClick(link.anchorId)}
                  className={`w-full rounded-xl px-4 py-3 text-left text-sm font-semibold transition ${
                    activeSection === link.anchorId
                      ? 'bg-amber-500/20 text-amber-200'
                      : 'text-slate-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {link.label}
                </button>
              ))}
              <div className="grid gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => handleNavClick('contact')}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-amber-500/40 bg-amber-500/15 px-4 py-3 text-sm font-semibold text-amber-100 transition hover:border-amber-300 hover:bg-amber-500/20 hover:text-white"
                >
                  <DiscordIcon className="h-4 w-4" />
                  Discord
                </button>
                <button
                  type="button"
                  onClick={() => handleNavClick('how-to')}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-slate-200 transition hover:border-white/30 hover:bg-white/10"
                >
                  <LightningIcon className="h-4 w-4" />
                  Tải Launcher
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsMenuOpen(false)
                    navigate(ROUTES.LOGIN)
                  }}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-amber-400/60 bg-amber-500/20 px-4 py-3 text-sm font-semibold text-amber-100 transition hover:border-amber-300 hover:bg-amber-500/30 hover:text-white"
                >
                  Đăng nhập
                  <ArrowRightIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      <Toast toast={toast} />

      <main className="relative pt-28">
        <section id="home" data-section className="relative px-6 pb-24">
          <div className="relative mx-auto grid max-w-6xl gap-12 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] px-6 py-16 sm:px-12 lg:grid-cols-[1.6fr_1fr]">
            <div className="pointer-events-none absolute inset-0">
              <div
                className="absolute inset-0 opacity-80 blur-3xl"
                style={{
                  background:
                    'radial-gradient(circle at 15% 30%, rgba(16,185,129,0.32), transparent 55%), radial-gradient(circle at 85% 20%, rgba(59,130,246,0.25), transparent 55%)',
                }}
              />
              <div className="absolute -top-16 right-16 h-40 w-40 rounded-full bg-sky-500/25 blur-3xl animate-float" />
              <div className="absolute -bottom-12 left-20 h-48 w-48 rounded-full bg-amber-500/30 blur-3xl animate-float-slower" />
            </div>

            <div className="relative z-10 space-y-8">
              <span className="inline-flex items-center gap-2 rounded-full border border-amber-400/40 bg-amber-500/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-amber-200">
                <SparkIcon className="h-3.5 w-3.5" />
                ToroMC Official
              </span>
              <h1 className="text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl">
                Sẵn sàng cho chiến trường mạnh mẽ nhất tại Việt Nam
              </h1>
              <p className="max-w-xl text-base text-slate-300 sm:text-lg">
                ToroMC mang đến trải nghiệm Minecraft cạnh tranh với hệ thống anti-cheat chủ động, hạ tầng ping thấp và cộng đồng đam mê PvP. Gia nhập ngay để bắt đầu hành trình thống trị server.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row">
                <button
                  type="button"
                  onClick={() => handleNavClick('modes')}
                  className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full border border-amber-500/50 bg-amber-500/20 px-7 py-3 text-base font-semibold text-amber-100 transition hover:-translate-y-1 hover:border-amber-300 hover:bg-amber-500/30 hover:text-white"
                >
                  <span
                    className="absolute inset-0 opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-80"
                    style={{
                      background:
                        'linear-gradient(100deg, rgba(16,185,129,0.55) 0%, rgba(59,130,246,0.25) 60%, transparent 100%)',
                    }}
                  />
                  <span className="relative flex items-center gap-3">
                    <SparkIcon className="h-4 w-4" />
                    Tham gia ngay
                  </span>
                  <ArrowRightIcon className="relative h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleNavClick('how-to')}
                  className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-7 py-3 text-base font-semibold text-slate-200 transition hover:-translate-y-1 hover:border-white/30 hover:bg-white/10"
                >
                  <LightningIcon className="h-4 w-4" />
                  Xem hướng dẫn
                </button>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="flex items-center gap-3 text-sm text-amber-200">
                  <div className="h-2 w-2 rounded-full bg-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.9)]" />
                  24/7 Online • Bảo trì định kỳ thứ 2 hàng tuần
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-400">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full border border-white/10 bg-white/5 text-xs font-semibold text-white">
                    <SparkIcon className="h-3 w-3" />
                  </div>
                  50.000+ tài khoản đã kích hoạt
                </div>
              </div>


            </div>

            <div className="relative z-10 flex flex-col gap-6 rounded-3xl border border-white/10 bg-slate-950/70 p-7 shadow-[0_35px_110px_-60px_rgba(16,185,129,1)]">
              <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.35em] text-amber-300/70">Server Gateway</p>
                <h2 className="text-2xl font-semibold text-white">ToroMC Network</h2>
                <p className="text-sm text-slate-400">
                  Chọn cụm phù hợp, copy IP và vào chiến. Hệ thống sẽ tự cân bằng tải giữa các lobby.
                </p>
              </div>
              <div className="space-y-4">
                {ipAddresses.length ? (
                  ipAddresses.map((item) => (
                    <div
                      key={item.id ?? item.label}
                    className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-4 transition hover:-translate-y-1 hover:border-amber-400/50 hover:bg-amber-500/10"
                    >
                      <div
                        className="pointer-events-none absolute inset-0 opacity-0 transition group-hover:opacity-100"
                        style={{
                          background:
                            'linear-gradient(120deg, rgba(16,185,129,0.35) 0%, rgba(59,130,246,0.2) 60%, transparent 100%)',
                        }}
                      />
                      <div className="relative flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">{item.label}</p>
                          <p className="text-xl font-semibold text-white">{item.value}</p>
                          {item.description && <p className="text-xs text-slate-400">{item.description}</p>}
                        </div>
                        <button
                          type="button"
                          onClick={() => handleCopy(item)}
                          className="inline-flex items-center gap-2 self-start rounded-full border border-amber-400/40 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-amber-100 transition hover:border-amber-300 hover:bg-amber-500/20"
                        >
                          {copiedTarget === item.value ? (
                            <>
                              <CheckIcon className="h-4 w-4" />
                              Đã copy
                            </>
                          ) : (
                            <>
                              <CopyIcon className="h-4 w-4" />
                              Copy IP
                            </>
                          )}
                        </button>
                      </div>
                      {item.note && <p className="relative mt-2 text-xs text-slate-500">{item.note}</p>}
                    </div>
                  ))
                ) : (
                  <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-sm text-slate-400">
                    Đang cập nhật địa chỉ máy chủ...
                  </div>
                )}
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                {stats.length ? (
                  stats.map((stat) => (
                    <div key={stat.id ?? stat.label} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
                      <AnimatedCounter
                        value={stat.value}
                        suffix={stat.suffix ?? ''}
                        className="text-3xl font-semibold text-white"
                      />
                      <p className="mt-2 text-[11px] uppercase tracking-[0.4em] text-slate-400">{stat.label}</p>
                      {stat.subLabel && <p className="text-[11px] text-slate-500">{stat.subLabel}</p>}
                    </div>
                  ))
                ) : (
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center text-sm text-slate-400 sm:col-span-3">
                    Đang cập nhật thống kê...
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        <section id="features" data-section className="relative px-6 py-24">
          <div className="mx-auto max-w-6xl">
            <div className="text-center">
              <p className="text-xs uppercase tracking-[0.4em] text-amber-300/70">Tính năng</p>
              <h2 className="mt-4 text-4xl font-semibold text-white sm:text-5xl">
                Nâng cấp mạnh mẽ cho mọi trận chiến
              </h2>
              <p className="mx-auto mt-4 max-w-3xl text-base text-slate-300">
                ToroMC xây dựng nền tảng chơi chuyên nghiệp từ hạ tầng chống DDoS, anti-cheat đến hệ thống sự kiện được quản lý bằng công cụ riêng.
              </p>
            </div>
            <div className="mt-16 grid gap-6 md:grid-cols-2">
              {featureCards.length ? (
                featureCards.map((feature) => (
                  <div
                    key={feature.id ?? feature.title}
                    className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-8 transition-all duration-300 hover:-translate-y-2 hover:border-amber-400/50 hover:shadow-[0_35px_90px_-45px_rgba(245,158,11,0.8)]"
                  >
                    <div
                      className="pointer-events-none absolute inset-0 opacity-0 transition duration-500 group-hover:opacity-100"
                      style={{ background: feature.glow }}
                    />
                    <div className="relative z-10 space-y-4">
                      <h3 className="text-2xl font-semibold text-white">{feature.title}</h3>
                      <p className="text-sm text-slate-300">{feature.description}</p>
                      <ul className="mt-6 space-y-3">
                        {(feature.highlights ?? []).map((highlight) => (
                          <li key={highlight} className="flex items-start gap-3 text-sm text-slate-200">
                            <span className="mt-1 h-2.5 w-2.5 rounded-full bg-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.9)]" />
                            <span>{highlight}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 text-center text-sm text-slate-400 md:col-span-2">
                  Đang cập nhật dữ liệu tính năng...
                </div>
              )}
            </div>
          </div>
        </section>

        <section id="modes" data-section className="relative px-6 py-24">
          <div className="mx-auto max-w-6xl">
            <div className="text-center">
              <p className="text-xs uppercase tracking-[0.4em] text-amber-300/70">Chế độ chơi</p>
              <h2 className="mt-4 text-4xl font-semibold text-white sm:text-5xl">
                Chọn sân chơi để chứng minh bản lĩnh
              </h2>
              <p className="mx-auto mt-4 max-w-3xl text-base text-slate-300">
                Từ Survival RPG tới các giải BedWars và PvP xếp hạng, ToroMC luôn duy trì meta cân bằng và phần thưởng hấp dẫn cho người chơi try-hard.
              </p>
            </div>
            <div className="mt-16 grid gap-10 lg:grid-cols-[1.6fr_1fr]">
              {activeModeData ? (
                <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-10">
                  <div className="absolute inset-0 opacity-90" style={{ background: activeModeData.gradient }} />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/80" />
                  <div className="relative z-10 flex flex-col gap-6">
                    <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.35em] text-white/80">
                      {activeModeData.tag && (
                        <span className="rounded-full border border-white/30 bg-black/30 px-3 py-1">{activeModeData.tag}</span>
                      )}
                      <span className="text-amber-200">Chế độ nổi bật</span>
                    </div>
                    <h3 className="text-3xl font-bold text-white sm:text-4xl">{activeModeData.title}</h3>
                    <p className="text-base text-slate-200/90">{activeModeData.description}</p>
                    <ul className="space-y-3">
                      {(activeModeData.features ?? []).map((feature) => (
                        <li key={feature} className="flex items-center gap-3 text-sm text-slate-100/90">
                          <span className="flex h-7 w-7 items-center justify-center rounded-full border border-white/30 bg-black/30 text-amber-200">
                            <CheckIcon className="h-4 w-4" />
                          </span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="flex flex-wrap items-center gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => handleNavClick('contact')}
                        className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-white transition hover:border-amber-300 hover:bg-amber-500/30"
                      >
                        Đăng ký giải đấu
                        <ArrowRightIcon className="h-4 w-4" />
                      </button>
                      <span className="text-xs text-slate-300">Chế độ tự động đổi sau 6 giây</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center rounded-3xl border border-white/10 bg-white/[0.04] p-10 text-sm text-slate-400">
                  Dữ liệu chế độ chơi đang được cập nhật...
                </div>
              )}

              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="uppercase tracking-[0.35em]">Chọn chế độ</span>
                  <span>Di chuột hoặc nhấn để xem</span>
                </div>
                <div className="space-y-3">
                  {modes.length ? (
                    modes.map((mode, index) => (
                      <button
                        key={mode.id ?? mode.title ?? index}
                        type="button"
                        onClick={() => setActiveMode(index)}
                        onMouseEnter={() => setActiveMode(index)}
                        className={`w-full rounded-2xl border px-4 py-4 text-left transition duration-300 ${
                          activeMode === index
                            ? 'border-amber-400/60 bg-amber-500/10 text-white shadow-[0_25px_70px_-45px_rgba(245,158,11,1)]'
                            : 'border-white/10 bg-white/5 text-slate-300 hover:border-amber-400/40 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-base font-semibold">{mode.title}</span>
                          {mode.tag && (
                            <span
                              className={`text-xs uppercase tracking-[0.3em] ${
                                activeMode === index ? 'text-amber-200' : 'text-slate-500'
                              }`}
                            >
                              {mode.tag}
                            </span>
                          )}
                        </div>
                        <p className="mt-2 text-xs text-slate-400">{mode.description}</p>
                      </button>
                    ))
                  ) : (
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center text-sm text-slate-400">
                      Chưa có dữ liệu chế độ chơi.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="how-to" data-section className="relative px-6 py-24">
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr]">
              <div>
              <p className="text-xs uppercase tracking-[0.4em] text-amber-300/70">Bắt đầu nhanh</p>
                <h2 className="mt-4 text-4xl font-semibold text-white sm:text-5xl">
                  Chỉ vài bước để vào ToroMC
                </h2>
                <p className="mt-4 max-w-2xl text-base text-slate-300">
                  Tải launcher, kết nối tài khoản, tham gia Discord và bắt đầu hành trình chinh phục server mạnh mẽ nhất. Hệ thống tự động hoá giúp bạn không bỏ lỡ bất kỳ sự kiện nào.
                </p>
                <div className="mt-10 space-y-8">
                  {steps.length ? (
                    steps.map((step, index) => (
                      <div
                        key={step.id ?? step.title ?? index}
                        className="relative flex gap-5 rounded-3xl border border-white/10 bg-white/[0.02] p-6 transition hover:border-amber-400/40 hover:bg-white/[0.05]"
                      >
                        <div className="relative flex flex-col items-center">
                          <div className="flex h-12 w-12 items-center justify-center rounded-full border border-amber-400/50 bg-amber-500/20 text-base font-semibold text-amber-100">
                            {String(index + 1).padStart(2, '0')}
                          </div>
                          {index !== steps.length - 1 && (
                            <span className="absolute left-1/2 top-12 h-[calc(100%-48px)] w-px -translate-x-1/2 bg-gradient-to-b from-amber-400/40 to-transparent" />
                          )}
                        </div>
                        <div className="space-y-3">
                          <h3 className="text-lg font-semibold text-white">{step.title}</h3>
                          <p className="text-sm text-slate-300">{step.description}</p>
                          <a
                            href={step.link}
                            className="inline-flex items-center gap-2 text-sm font-semibold text-amber-300 transition hover:text-amber-100"
                          >
                            {step.action}
                            <ArrowRightIcon className="h-4 w-4" />
                          </a>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-6 text-center text-sm text-slate-400">
                      Đang cập nhật hướng dẫn tham gia...
                    </div>
                  )}
                </div>
              </div>
              <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-900/50 p-8">
                <div
                  className="absolute inset-0 opacity-70"
                  style={{
                    background:
                      'radial-gradient(circle at 30% 20%, rgba(245,158,11,0.3), transparent 55%), radial-gradient(circle at 80% 70%, rgba(59,130,246,0.2), transparent 55%)',
                  }}
                />
                <div className="relative z-10 space-y-6">
                  <div>
                    <p className="text-xs uppercase tracking-[0.35em] text-amber-200">Tham gia an toàn</p>
                    <h3 className="mt-2 text-2xl font-semibold text-white">Chuẩn bị trước khi vào server</h3>
                  </div>
                  <p className="text-sm text-slate-300">
                    Sử dụng Launcher ToroMC để tự động cài đặt resource pack, tối ưu FPS và kết nối Discord nhận thông báo realtime.
                  </p>
                  <div className="space-y-4 rounded-2xl border border-white/10 bg-white/5 p-6">
                    <div className="flex items-center justify-between text-xs uppercase tracking-[0.35em] text-slate-400">
                      <span>Sự kiện sắp tới</span>
                      <span>GMT+7</span>
                    </div>
                    <div className="space-y-3">
                      {upcomingEvents.length ? (
                        upcomingEvents.map((event) => (
                          <div
                            key={event.id ?? event.title}
                            className="flex items-center justify-between rounded-xl border border-white/5 bg-slate-950/50 px-4 py-3"
                          >
                            <div>
                              <p className="text-sm font-semibold text-white">{event.title}</p>
                              <p className="text-xs text-slate-400">{event.time}</p>
                            </div>
                            <span className="rounded-full border border-amber-400/40 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.35em] text-amber-200">
                              {event.type}
                            </span>
                          </div>
                        ))
                      ) : (
                        <div className="rounded-xl border border-white/10 bg-slate-950/50 px-4 py-4 text-center text-sm text-slate-400">
                          Đang cập nhật sự kiện...
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>


      

        <section id="faq" data-section className="relative px-6 py-24">
          <div className="mx-auto max-w-6xl">
            <div className="text-center">
              <p className="text-xs uppercase tracking-[0.4em] text-amber-300/70">FAQ</p>
              <h2 className="mt-4 text-4xl font-semibold text-white sm:text-5xl">
                Giải đáp nhanh cho tân thủ ToroMC
              </h2>
              <p className="mx-auto mt-4 max-w-3xl text-base text-slate-300">
                Nếu bạn cần thêm thông tin, hãy mở ticket trên Discord hoặc tham khảo mục hướng dẫn chi tiết của chúng tôi.
              </p>
            </div>
            <div className="mt-16 grid gap-6 md:grid-cols-2">
              {faqs.length ? (
                faqs.map((faq, index) => {
                  const id = faq.id ?? index
                  const isOpen = openFaq === id
                  return (
                    <div
                      key={id}
                      className="rounded-3xl border border-white/10 bg-white/[0.02] p-6 transition hover:border-emerald-400/40 hover:bg-white/[0.05]"
                    >
                      <button
                        type="button"
                        onClick={() => toggleFaq(id)}
                        className="flex w-full items-center justify-between gap-3 text-left"
                        aria-expanded={isOpen}
                      >
                        <span className="text-lg font-semibold text-white">{faq.question}</span>
                        <span
                          className={`flex h-9 w-9 items-center justify-center rounded-full border transition ${
                            isOpen
                              ? 'border-amber-400/60 bg-amber-500/20 text-amber-200'
                              : 'border-white/10 bg-white/5 text-slate-400'
                          }`}
                        >
                          <ChevronDownIcon
                            className={`h-4 w-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                          />
                        </span>
                      </button>
                      <div
                        className={`overflow-hidden text-sm text-slate-300 transition-[max-height,opacity] duration-500 ${
                          isOpen ? 'mt-4 max-h-48 opacity-100' : 'max-h-0 opacity-0'
                        }`}
                      >
                        <p>{faq.answer}</p>
                      </div>
                    </div>
                  )
                })
              ) : (
                <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-6 text-center text-sm text-slate-400 md:col-span-2">
                  Đang cập nhật câu hỏi thường gặp...
                </div>
              )}
            </div>
          </div>
        </section>

        <section id="contact" data-section className="relative px-6 pb-28">
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr]">
              <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-8">
                <div
                  className="absolute inset-0 opacity-80"
                  style={{
                    background:
                      'radial-gradient(circle at 15% 20%, rgba(16,185,129,0.35), transparent 55%), radial-gradient(circle at 85% 80%, rgba(168,85,247,0.25), transparent 55%)',
                  }}
                />
                <div className="relative z-10 space-y-4">
                  <p className="text-xs uppercase tracking-[0.4em] text-amber-300/70">Liên hệ</p>
                  <h2 className="text-3xl font-semibold text-white">ToroMC Support Center</h2>
                  <p className="text-sm text-slate-300">
                    Đội ngũ ToroMC luôn sẵn sàng hỗ trợ bạn từ việc tối ưu client cho tới xử lý sự cố trong trận đấu. Tham gia Discord để không bỏ lỡ thông báo mới nhất.
                  </p>
                  <div className="flex flex-col gap-3 text-sm text-slate-300">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.8)]" />
                      Ticket ưu tiên cho sự cố trận đấu
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-sky-400 shadow-[0_0_12px_rgba(56,189,248,0.8)]" />
                      Staff hoạt động 24/7
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-purple-400 shadow-[0_0_12px_rgba(192,132,252,0.8)]" />
                      Broadcast sự kiện qua Discord, TikTok, Facebook
                    </div>
                  </div>
                  <a
                    href="https://discord.gg/5j9nMj6wdR"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-amber-500/40 bg-amber-500/15 px-5 py-2 text-sm font-semibold text-amber-100 transition hover:border-amber-300 hover:bg-amber-500/25 hover:text-white"
                  >
                    Tham gia Discord ngay
                    <ArrowRightIcon className="h-4 w-4" />
                  </a>
                </div>
              </div>
              <div className="grid gap-6 sm:grid-cols-2">
                {contactCards.length ? (
                  contactCards.map((card) => (
                    <div
                      key={card.id ?? card.title}
                      className="flex h-full flex-col justify-between rounded-3xl border border-white/10 bg-white/[0.03] p-6 transition hover:border-emerald-400/40 hover:bg-white/[0.06]"
                    >
                      <div className="space-y-3">
                        <h3 className="text-lg font-semibold text-white">{card.title}</h3>
                        <p className="text-sm text-slate-300">{card.description}</p>
                      </div>
                      <a
                        href={card.link}
                        className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-amber-300 transition hover:text-amber-100"
                      >
                        {card.action}
                        <ArrowRightIcon className="h-4 w-4" />
                      </a>
                    </div>
                  ))
                ) : (
                  <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 text-center text-sm text-slate-400 sm:col-span-2">
                    Đang cập nhật thông tin liên hệ...
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>


      </main>
    </div>
  )
}

export default App
 
