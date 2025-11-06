import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { ArrowRightIcon, ArrowLeftIcon } from '../components/icons'
import { ROUTES } from '../configs/constants'
import { loginUser, registerUser, clearError, selectAuth } from '../redux/slices/authSlice'
import { useToast } from '../hooks/useToast'

export default function Auth() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const { showToast } = useToast()
  
  // Redux state
  const { isAuthenticated, isLoading, error } = useSelector(selectAuth)
  
  const urlMode = useMemo(() => new URLSearchParams(location.search).get('mode') || 'login', [location.search])
  const [mode, setMode] = useState(urlMode === 'register' ? 'register' : 'login')
  
  // Form states
  const [loginForm, setLoginForm] = useState({
    username: '',
    password: '',
    rememberMe: false
  })
  
  const [registerForm, setRegisterForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  })

  // Effects
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    params.set('mode', mode)
    const next = `${location.pathname}?${params.toString()}`
    if (`${location.pathname}${location.search}` !== next) {
      window.history.replaceState(null, '', next)
    }
  }, [mode, location.pathname, location.search])

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate(ROUTES.DASHBOARD)
      showToast('Đã đăng nhập thành công!', 'success')
    }
  }, [isAuthenticated, navigate, showToast])

  // Handle errors
  useEffect(() => {
    if (error) {
      showToast(error, 'error')
      dispatch(clearError())
    }
  }, [error, showToast, dispatch])

  // Handlers
  const toggleMode = () => {
    setMode((m) => (m === 'login' ? 'register' : 'login'))
    // Reset forms when switching modes
    setLoginForm({ username: '', password: '', rememberMe: false })
    setRegisterForm({ username: '', email: '', password: '', confirmPassword: '' })
  }

  const handleLoginChange = (e) => {
    const { name, value, type, checked } = e.target
    setLoginForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleRegisterChange = (e) => {
    const { name, value } = e.target
    setRegisterForm(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    
    if (!loginForm.username || !loginForm.password) {
      showToast('Vui lòng điền đầy đủ thông tin', 'warning')
      return
    }

    try {
      await dispatch(loginUser({
        lastNickname: loginForm.username,
        password: loginForm.password
      })).unwrap()
      
      showToast('Đăng nhập thành công!', 'success')
    } catch (error) {
      // Error handled by useEffect
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    
    if (!registerForm.username || !registerForm.email || !registerForm.password || !registerForm.confirmPassword) {
      showToast('Vui lòng điền đầy đủ thông tin', 'warning')
      return
    }

    if (registerForm.password !== registerForm.confirmPassword) {
      showToast('Mật khẩu xác nhận không khớp', 'error')
      return
    }

    if (registerForm.password.length < 6) {
      showToast('Mật khẩu phải có ít nhất 6 ký tự', 'warning')
      return
    }

    try {
      await dispatch(registerUser({
        lastNickname: registerForm.username,
        mailAddress: registerForm.email,
        password: registerForm.password,
        premiumId: `premium_${Date.now()}_${registerForm.username}`
      })).unwrap()
      
      showToast('Đăng ký thành công!', 'success')
    } catch (error) {
      // Error handled by useEffect
    }
  }

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100">
      <div className="pointer-events-none fixed inset-0 -z-10 opacity-90" aria-hidden>
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(circle at 20% 20%, rgba(16,185,129,0.28), transparent 55%), radial-gradient(circle at 80% 10%, rgba(59,130,246,0.25), transparent 45%), radial-gradient(circle at 50% 80%, rgba(147,51,234,0.2), transparent 55%)',
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

      <div className="mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center px-6 py-12">
        <div className="mb-8 flex w-full items-center justify-between">
          <Link
            to={ROUTES.HOME}
            className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full border border-amber-500/40 bg-amber-500/10 px-4 py-2 text-sm font-semibold text-amber-100 transition hover:-translate-y-0.5 hover:border-amber-300 hover:bg-amber-500/20 hover:text-white"
          >
            <span
              className="absolute inset-0 opacity-0 blur-lg transition-opacity duration-500 group-hover:opacity-70"
              style={{
                background:
                  'linear-gradient(90deg, rgba(16,185,129,0.5) 0%, rgba(59,130,246,0.15) 100%)',
              }}
            />
            <span className="relative flex items-center gap-2">
              <ArrowLeftIcon className="h-4 w-4" />
              Về trang chủ
            </span>
          </Link>
        </div>

        <div className="relative w-full max-w-6xl overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-2 shadow-[0_35px_120px_-50px_rgba(16,185,129,0.9)]">
          <div
            className="pointer-events-none absolute inset-0 opacity-0 blur-3xl transition-opacity duration-700"
            style={{
              background:
                'linear-gradient(120deg, rgba(16,185,129,0.35) 0%, rgba(59,130,246,0.25) 50%, rgba(168,85,247,0.25) 100%)',
            }}
          />

          <div className="relative grid grid-cols-1 lg:grid-cols-[1.05fr_1.3fr]">
            <div className="relative hidden h-full items-center justify-center border-r border-t border-b border-white/10 bg-gradient-to-br from-amber-500/10 via-slate-900 to-slate-900/50 p-10 lg:flex rounded-l-3xl">
              <div className="relative z-10 space-y-4">
                <p className="inline-flex items-center gap-2 rounded-full border border-amber-400/40 bg-amber-500/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-amber-200">
                  ToroMC Auth
                </p>
                <h2 className="text-4xl font-semibold text-white">
                  {mode === 'login' ? 'Chào mừng trở lại!' : 'Gia nhập ToroMC ngay!'}
                </h2>
                <p className="max-w-sm text-slate-300">
                  {mode === 'login'
                    ? 'Đăng nhập để tiếp tục thống trị chiến trường.'
                    : 'Tạo tài khoản trong vài giây để bắt đầu hành trình.'}
                </p>
              </div>
              <div className="pointer-events-none absolute -top-10 right-10 h-40 w-40 rounded-full bg-sky-500/25 blur-3xl animate-float" />
              <div className="pointer-events-none absolute -bottom-10 left-10 h-48 w-48 rounded-full bg-amber-500/30 blur-3xl animate-float-slower" />
            </div>

            <div className="relative p-6 sm:p-12">
              <div className="mb-6 flex items-center justify-between">
                <div className="text-lg font-semibold text-white">{mode === 'login' ? 'Đăng nhập' : 'Đăng ký'}</div>
                <button
                  type="button"
                  onClick={toggleMode}
                  className="group inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold text-slate-200 transition hover:border-amber-300/50 hover:bg-amber-500/20 hover:text-white"
                >
                  {mode === 'login' ? 'Chưa có tài khoản? Đăng ký' : 'Đã có tài khoản? Đăng nhập'}
                  <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </button>
              </div>

              <div className="relative min-h-[460px] overflow-hidden">
                <div
                  className={`absolute inset-0 transition-transform duration-700 ease-[cubic-bezier(.22,1,.36,1)] ${
                    mode === 'login' ? 'translate-x-0' : '-translate-x-full'
                  }`}
                >
                  <form
                    className="grid gap-5 rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-sm"
                    onSubmit={handleLogin}
                  >
                    <div>
                      <label className="text-xs uppercase tracking-[0.3em] text-slate-400">Email hoặc Username</label>
                      <input
                        type="text"
                        name="username"
                        value={loginForm.username}
                        onChange={handleLoginChange}
                        className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-amber-400/60"
                        placeholder="your@email.com"
                        required
                        disabled={isLoading}
                      />
                    </div>
                    <div>
                      <label className="text-xs uppercase tracking-[0.3em] text-slate-400">Mật khẩu</label>
                      <input
                        type="password"
                        name="password"
                        value={loginForm.password}
                        onChange={handleLoginChange}
                        className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-amber-400/60"
                        placeholder="••••••••"
                        required
                        disabled={isLoading}
                      />
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <label className="inline-flex items-center gap-2 text-slate-300">
                        <input 
                          type="checkbox" 
                          name="rememberMe"
                          checked={loginForm.rememberMe}
                          onChange={handleLoginChange}
                          className="h-4 w-4 rounded border-white/20 bg-slate-900/60" 
                          disabled={isLoading}
                        />
                        Ghi nhớ đăng nhập
                      </label>
                      <button type="button" className="text-amber-300 hover:text-amber-100">Quên mật khẩu?</button>
                    </div>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-2xl border border-amber-500/50 bg-amber-500/20 px-6 py-3 text-sm font-semibold text-amber-100 transition hover:-translate-y-0.5 hover:border-amber-300 hover:bg-amber-500/30 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                    </button>
                  </form>
                </div>

                <div
                  className={`absolute inset-0 transition-transform duration-700 ease-[cubic-bezier(.22,1,.36,1)] ${
                    mode === 'register' ? 'translate-x-0' : 'translate-x-full'
                  }`}
                >
                  <form
                    className="grid gap-6 rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-sm"
                    onSubmit={handleRegister}
                  >
                    <div className="grid gap-6 md:grid-cols-2">
                      <div>
                        <label className="text-xs uppercase tracking-[0.3em] text-slate-400">Username</label>
                        <input
                          type="text"
                          name="username"
                          value={registerForm.username}
                          onChange={handleRegisterChange}
                          className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-amber-400/60"
                          placeholder="toromc_player"
                          required
                          disabled={isLoading}
                        />
                      </div>
                      <div>
                        <label className="text-xs uppercase tracking-[0.3em] text-slate-400">Email</label>
                        <input
                          type="email"
                          name="email"
                          value={registerForm.email}
                          onChange={handleRegisterChange}
                          className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-amber-400/60"
                          placeholder="your@email.com"
                          required
                          disabled={isLoading}
                        />
                      </div>
                    </div>
                    <div className="grid gap-6 md:grid-cols-2">
                      <div>
                        <label className="text-xs uppercase tracking-[0.3em] text-slate-400">Mật khẩu</label>
                        <input
                          type="password"
                          name="password"
                          value={registerForm.password}
                          onChange={handleRegisterChange}
                          className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-amber-400/60"
                          placeholder="••••••••"
                          required
                          minLength={6}
                          disabled={isLoading}
                        />
                      </div>
                      <div>
                        <label className="text-xs uppercase tracking-[0.3em] text-slate-400">Xác nhận mật khẩu</label>
                        <input
                          type="password"
                          name="confirmPassword"
                          value={registerForm.confirmPassword}
                          onChange={handleRegisterChange}
                          className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-amber-400/60"
                          placeholder="••••••••"
                          required
                          minLength={6}
                          disabled={isLoading}
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="group relative inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl border border-amber-500/50 bg-amber-500/20 px-6 py-3 text-sm font-semibold text-amber-100 transition hover:-translate-y-0.5 hover:border-amber-300 hover:bg-amber-500/30 hover:text-white md:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? 'Đang tạo tài khoản...' : 'Tạo tài khoản'}
                    </button>
                  </form>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between text-xs text-slate-400">
                <span>Bằng việc tiếp tục, bạn đồng ý với điều khoản của ToroMC.</span>
                <button
                  type="button"
                  onClick={() => navigate(ROUTES.HOME)}
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 font-semibold text-slate-200 transition hover:border-white/30 hover:bg-white/10 hover:text-white"
                >
                  Về trang chủ
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


