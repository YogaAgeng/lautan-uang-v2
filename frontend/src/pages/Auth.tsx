import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

/* ─── Ikon SVG inline ─────────────────────────────────── */
const IconFish = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
    <path d="M12 4C9.5 4 7.5 5.5 6.3 7.6L2 6l3 4.5L2 15l4.3-1.6C7.5 15.5 9.5 17 12 17c2.5 0 4.5-1.5 5.7-3.6L22 15l-3-4.5L22 6l-4.3 1.6C16.5 5.5 14.5 4 12 4zm0 2c2.2 0 4 1.8 4 4s-1.8 4-4 4-4-1.8-4-4 1.8-4 4-4zm1 2.5a1.5 1.5 0 100 3 1.5 1.5 0 000-3z"/>
  </svg>
);

const IconChart = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
    <path d="M3 3v18h18M9 17V9m4 8V5m4 12v-4"/>
    <path d="M9 17V9m4 8V5m4 12v-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const IconEmail = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <rect x="2" y="4" width="20" height="16" rx="2"/>
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
  </svg>
);

const IconLock = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);

const IconEye = ({ show }: { show: boolean }) => show ? (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
) : (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);

const IconAnchor = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
    <circle cx="12" cy="5" r="3"/>
    <line x1="12" y1="22" x2="12" y2="8"/>
    <path d="M5 12H2a10 10 0 0 0 20 0h-3"/>
  </svg>
);

const IconWallet = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
    <path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4"/>
    <path d="M4 6v12c0 1.1.9 2 2 2h14v-4"/>
    <circle cx="18" cy="12" r="2"/>
  </svg>
);

/* ─── Wave Animation Component ────────────────────────── */
const OceanWaves = () => (
  <div className="absolute bottom-0 left-0 right-0 overflow-hidden" style={{ height: '120px' }}>
    <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="absolute bottom-0 w-[200%] animate-wave" style={{ height: '100%' }}>
      <path d="M0,60 C150,100 350,0 600,60 C850,120 1050,20 1200,60 L1200,120 L0,120 Z" fill="rgba(6,182,212,0.08)"/>
    </svg>
    <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="absolute bottom-0 w-[200%] animate-wave" style={{ height: '80%', animationDelay: '-3s', animationDuration: '12s' }}>
      <path d="M0,40 C200,80 400,10 600,50 C800,90 1000,30 1200,50 L1200,120 L0,120 Z" fill="rgba(8,145,178,0.06)"/>
    </svg>
  </div>
);

/* ─── Feature Bullet ──────────────────────────────────── */
const Feature = ({ icon, text, delay }: { icon: string; text: string; delay: string }) => (
  <div className={`flex items-center gap-3 animate-fadeInLeft ${delay}`}>
    <span className="text-xl">{icon}</span>
    <span className="text-slate-300 text-sm">{text}</span>
  </div>
);

/* ─── Main Auth Page ──────────────────────────────────── */
export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'INVESTOR' | 'NELAYAN'>('INVESTOR');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [shakeError, setShakeError] = useState(false);

  const navigate = useNavigate();

  const triggerShake = () => {
    setShakeError(true);
    setTimeout(() => setShakeError(false), 500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/register';
      const payload = isLogin ? { email, password } : { email, password, role };

      const response = await api.post(endpoint, payload);

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('role', response.data.user.role);
        localStorage.setItem('email', response.data.user.email); // BUG-05 fix: simpan email

        if (response.data.user.role === 'NELAYAN') {
          navigate('/nelayan');
        } else {
          navigate('/investor');
        }
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Terjadi kesalahan pada server';
      setError(msg);
      triggerShake();
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setEmail('');
    setPassword('');
  };

  return (
    <div className="min-h-screen flex bg-ocean-deep relative overflow-hidden" style={{ background: 'radial-gradient(ellipse at top, #0d3b6e 0%, #020b18 70%)' }}>

      {/* ── Floating particles ── */}
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full opacity-10 animate-float"
          style={{
            width: `${[120, 80, 160, 60, 100, 140][i]}px`,
            height: `${[120, 80, 160, 60, 100, 140][i]}px`,
            background: `radial-gradient(circle, ${['#06b6d4','#0891b2','#22d3ee','#0e5190','#14b8a6','#06b6d4'][i]}, transparent)`,
            top: `${[10, 60, 5, 75, 40, 25][i]}%`,
            left: `${[5, 15, 50, 8, 70, 80][i]}%`,
            animationDelay: `${i * 0.7}s`,
          }}
        />
      ))}

      {/* ══ LEFT PANEL — Branding ══════════════════════════ */}
      <div className="hidden lg:flex flex-col justify-between w-[45%] relative p-12 overflow-hidden">

        {/* Brand */}
        <div className="animate-fadeInLeft">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center animate-pulse-glow" style={{ background: 'linear-gradient(135deg, #0891b2, #06b6d4)' }}>
              <IconAnchor />
            </div>
            <span className="text-white font-bold text-xl tracking-wide" style={{ fontFamily: 'Poppins, sans-serif' }}>Lautan Uang</span>
          </div>
        </div>

        {/* Hero text */}
        <div className="flex-1 flex flex-col justify-center">
          <h1 className="text-5xl font-bold leading-tight mb-6 animate-fadeInLeft" style={{ fontFamily: 'Poppins, sans-serif' }}>
            <span className="text-white">Investasi</span>{' '}
            <span className="text-shimmer">Berkelanjutan</span>
            <br />
            <span className="text-white">untuk Nelayan</span>
            <br />
            <span className="text-white">Indonesia</span>
          </h1>
          <p className="text-slate-400 text-lg mb-10 leading-relaxed animate-fadeInLeft delay-100">
            Platform crowdfunding modern yang menghubungkan investor dengan nelayan lokal untuk membangun ekonomi maritim yang kuat.
          </p>

          <div className="flex flex-col gap-4">
            <Feature icon="🎣" text="Dukung nelayan lokal secara langsung" delay="delay-100" />
            <Feature icon="📈" text="Return investasi transparan & terverifikasi" delay="delay-200" />
            <Feature icon="🛡️" text="Dana terlindungi dengan sistem escrow" delay="delay-300" />
            <Feature icon="🌊" text="Berkontribusi untuk ekonomi maritim Indonesia" delay="delay-400" />
          </div>
        </div>

        {/* Stats strip */}
        <div className="grid grid-cols-3 gap-4 animate-fadeInUp delay-300">
          {[
            { val: '2.4K+', label: 'Nelayan Aktif' },
            { val: 'Rp 12M', label: 'Modal Disalurkan' },
            { val: '94%', label: 'Tingkat Sukses' },
          ].map((s) => (
            <div key={s.label} className="glass rounded-xl p-4 text-center">
              <div className="text-cyan-400 font-bold text-xl" style={{ fontFamily: 'Poppins, sans-serif' }}>{s.val}</div>
              <div className="text-slate-400 text-xs mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        <OceanWaves />
      </div>

      {/* ══ RIGHT PANEL — Form ════════════════════════════ */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 relative z-10">
        <div
          className={`w-full max-w-md animate-fadeInUp ${shakeError ? 'animate-shake' : ''}`}
        >
          {/* Card */}
          <div className="glass rounded-2xl p-8" style={{ background: 'rgba(4,18,36,0.75)', border: '1px solid rgba(6,182,212,0.18)' }}>

            {/* Mobile brand */}
            <div className="flex items-center gap-2 mb-6 lg:hidden">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #0891b2, #06b6d4)' }}>
                <IconAnchor />
              </div>
              <span className="text-white font-bold" style={{ fontFamily: 'Poppins, sans-serif' }}>Lautan Uang</span>
            </div>

            {/* Toggle tabs */}
            <div className="flex bg-white/5 rounded-xl p-1 mb-8">
              {(['login', 'daftar'] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setIsLogin(tab === 'login')}
                  className="flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all duration-300"
                  style={
                    (tab === 'login') === isLogin
                      ? { background: 'linear-gradient(135deg, #0e5190, #0891b2)', color: 'white', boxShadow: '0 4px 15px rgba(8,145,178,0.3)' }
                      : { color: 'rgba(148,163,184,0.7)' }
                  }
                >
                  {tab === 'login' ? 'Masuk' : 'Daftar'}
                </button>
              ))}
            </div>

            {/* Heading */}
            <div className="mb-6">
              <h2 className="text-white text-2xl font-bold mb-1" style={{ fontFamily: 'Poppins, sans-serif' }}>
                {isLogin ? 'Selamat datang kembali! 👋' : 'Bergabung sekarang ✨'}
              </h2>
              <p className="text-slate-400 text-sm">
                {isLogin
                  ? 'Masuk ke akun Lautan Uang Anda'
                  : 'Buat akun baru dan mulai perjalanan Anda'}
              </p>
            </div>

            {/* Error banner */}
            {error && (
              <div className="mb-5 flex items-center gap-3 px-4 py-3 rounded-xl text-sm" style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', color: '#fca5a5' }}>
                <span>⚠️</span>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Role selector (Register only) */}
              {!isLogin && (
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-3">Saya adalah seorang...</label>
                  <div className="grid grid-cols-2 gap-3">
                    {([
                      { val: 'NELAYAN' as const, label: 'Nelayan', emoji: '🎣', desc: 'Cari modal usaha', color: '#10b981' },
                      { val: 'INVESTOR' as const, label: 'Investor', emoji: '💼', desc: 'Investasi & dapatkan hasil', color: '#f59e0b' },
                    ] as const).map((r) => (
                      <button
                        key={r.val}
                        type="button"
                        onClick={() => setRole(r.val)}
                        className="flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-300 text-center"
                        style={
                          role === r.val
                            ? { borderColor: r.color, background: `${r.color}18`, boxShadow: `0 0 20px ${r.color}30` }
                            : { borderColor: 'rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)' }
                        }
                      >
                        <span className="text-2xl">{r.emoji}</span>
                        <span className="text-white text-sm font-semibold">{r.label}</span>
                        <span className="text-xs" style={{ color: role === r.val ? r.color : 'rgba(148,163,184,0.6)' }}>{r.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Alamat Email</label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                    <IconEmail />
                  </div>
                  <input
                    id="email"
                    type="email"
                    className="input-ocean w-full pl-11 pr-4 py-3 rounded-xl text-sm"
                    placeholder="nama@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Kata Sandi</label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                    <IconLock />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    className="input-ocean w-full pl-11 pr-12 py-3 rounded-xl text-sm"
                    placeholder="Minimal 8 karakter"
                    minLength={8}  // BUG-03 frontend: validasi sebelum kirim request
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                  >
                    <IconEye show={showPassword} />
                  </button>
                </div>
              </div>

              {/* Forgot password (login only) */}
              {isLogin && (
                <div className="text-right">
                  <button type="button" className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors">
                    Lupa kata sandi?
                  </button>
                </div>
              )}

              {/* Submit */}
              <button
                id="btn-submit-auth"
                type="submit"
                disabled={loading}
                className="btn-ocean w-full py-3.5 rounded-xl text-sm font-semibold mt-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                    </svg>
                    Memproses...
                  </>
                ) : (
                  isLogin ? 'Masuk ke Akun →' : `Buat Akun ${role === 'NELAYAN' ? 'Nelayan' : 'Investor'} →`
                )}
              </button>
            </form>

            {/* Switch mode link */}
            <p className="mt-6 text-center text-sm text-slate-400">
              {isLogin ? 'Belum punya akun?' : 'Sudah punya akun?'}{' '}
              <button
                id="btn-switch-auth-mode"
                type="button"
                onClick={switchMode}
                className="font-semibold transition-colors"
                style={{ color: '#06b6d4' }}
                onMouseOver={e => (e.currentTarget.style.color = '#22d3ee')}
                onMouseOut={e => (e.currentTarget.style.color = '#06b6d4')}
              >
                {isLogin ? 'Daftar sekarang' : 'Masuk di sini'}
              </button>
            </p>
          </div>

          {/* Footer note */}
          <p className="text-center text-xs text-slate-600 mt-4">
            Dengan mendaftar, Anda menyetujui{' '}
            <span className="text-slate-500 hover:text-slate-300 cursor-pointer transition-colors">Syarat & Ketentuan</span>
            {' '}dan{' '}
            <span className="text-slate-500 hover:text-slate-300 cursor-pointer transition-colors">Kebijakan Privasi</span>
          </p>
        </div>
      </div>
    </div>
  );
}