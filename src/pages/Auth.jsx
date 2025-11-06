import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

const ArrowRightIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" d="M5 12h14m-6-6 6 6-6 6" />
  </svg>
)

const ArrowLeftIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" d="M19 12H5m6 6-6-6 6-6" />
  </svg>
)

export default function Auth() {
  const navigate = useNavigate()
  const location = useLocation()
  const urlMode = useMemo(() => new URLSearchParams(location.search).get('mode') || 'login', [location.search])
  const [mode, setMode] = useState(urlMode === 'register' ? 'register' : 'login')

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    params.set('mode', mode)
    const next = `${location.pathname}?${params.toString()}`
    if (`${location.pathname}${location.search}` !== next) {
      window.history.replaceState(null, '', next)
    }
  }, [mode, location.pathname, location.search])

  const toggleMode = () => setMode((m) => (m === 'login' ? 'register' : 'login'))

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
            to="/"
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
                    onSubmit={(e) => {
                      e.preventDefault()
                    }}
                  >
                    <div>
                      <label className="text-xs uppercase tracking-[0.3em] text-slate-400">Email hoặc Username</label>
                      <input
                        type="text"
                        className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-amber-400/60"
                        placeholder="your@email.com"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-xs uppercase tracking-[0.3em] text-slate-400">Mật khẩu</label>
                      <input
                        type="password"
                        className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-amber-400/60"
                        placeholder="••••••••"
                        required
                      />
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <label className="inline-flex items-center gap-2 text-slate-300">
                        <input type="checkbox" className="h-4 w-4 rounded border-white/20 bg-slate-900/60" />
                        Ghi nhớ đăng nhập
                      </label>
                      <button type="button" className="text-amber-300 hover:text-amber-100">Quên mật khẩu?</button>
                    </div>
                    <button
                      type="submit"
                    className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-2xl border border-amber-500/50 bg-amber-500/20 px-6 py-3 text-sm font-semibold text-amber-100 transition hover:-translate-y-0.5 hover:border-amber-300 hover:bg-amber-500/30 hover:text-white"
                    >
                      Đăng nhập
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
                    onSubmit={(e) => {
                      e.preventDefault()
                    }}
                  >
                    <div className="grid gap-6 md:grid-cols-2">
                      <div>
                        <label className="text-xs uppercase tracking-[0.3em] text-slate-400">Username</label>
                        <input
                          type="text"
                        className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-amber-400/60"
                          placeholder="toromc_player"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-xs uppercase tracking-[0.3em] text-slate-400">Email</label>
                        <input
                          type="email"
                        className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-amber-400/60"
                          placeholder="your@email.com"
                          required
                        />
                      </div>
                    </div>
                    <div className="grid gap-6 md:grid-cols-2">
                      <div>
                        <label className="text-xs uppercase tracking-[0.3em] text-slate-400">Mật khẩu</label>
                        <input
                          type="password"
                        className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-amber-400/60"
                          placeholder="••••••••"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-xs uppercase tracking-[0.3em] text-slate-400">Xác nhận mật khẩu</label>
                        <input
                          type="password"
                        className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-amber-400/60"
                          placeholder="••••••••"
                          required
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="group relative inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl border border-amber-500/50 bg-amber-500/20 px-6 py-3 text-sm font-semibold text-amber-100 transition hover:-translate-y-0.5 hover:border-amber-300 hover:bg-amber-500/30 hover:text-white md:w-auto"
                    >
                      Tạo tài khoản
                    </button>
                  </form>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between text-xs text-slate-400">
                <span>Bằng việc tiếp tục, bạn đồng ý với điều khoản của ToroMC.</span>
                <button
                  type="button"
                  onClick={() => navigate('/')}
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


