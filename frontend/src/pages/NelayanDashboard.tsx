import { useNavigate } from 'react-router-dom';

/* ─── Icons ───────────────────────────────────────────── */
const IconAnchor = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <circle cx="12" cy="5" r="3"/>
    <line x1="12" y1="22" x2="12" y2="8"/>
    <path d="M5 12H2a10 10 0 0 0 20 0h-3"/>
  </svg>
);
const IconBriefcase = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
    <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
  </svg>
);
const IconHome = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
    <polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
);
const IconFish = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <path d="M6.5 12c.94-3.46 4.94-6 8.5-6 3.56 0 6.06 2.54 7 6-.94 3.46-3.44 6-7 6-3.56 0-7.56-2.54-8.5-6z"/>
    <path d="M18 12 6 12"/>
    <path d="m6.5 15.5-3 3.5 3-3.5"/>
    <path d="m6.5 8.5-3-3.5 3 3.5"/>
    <circle cx="17" cy="12" r="1" fill="currentColor"/>
  </svg>
);
const IconChart = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <line x1="18" y1="20" x2="18" y2="10"/>
    <line x1="12" y1="20" x2="12" y2="4"/>
    <line x1="6" y1="20" x2="6" y2="14"/>
  </svg>
);
const IconLogout = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
    <polyline points="16 17 21 12 16 7"/>
    <line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
);
const IconStar = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);
const IconWave = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/>
    <path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/>
    <path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/>
  </svg>
);
const IconBell = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
    <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
  </svg>
);

/* ─── Stat Card ────────────────────────────────────────── */
const StatCard = ({
  icon, label, value, sub, color, delay,
}: {
  icon: React.ReactNode; label: string; value: string; sub: string; color: string; delay: string;
}) => (
  <div className={`stat-card p-6 animate-fadeInUp ${delay}`}>
    <div className="flex items-start justify-between mb-4">
      <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: `${color}20`, color }}>
        {icon}
      </div>
      <span className="text-xs px-2 py-1 rounded-full" style={{ background: `${color}15`, color }}>
        {sub}
      </span>
    </div>
    <p className="text-slate-400 text-sm mb-1">{label}</p>
    <p className="text-white text-2xl font-bold" style={{ fontFamily: 'Poppins, sans-serif' }}>{value}</p>
  </div>
);

/* ─── Project Card ─────────────────────────────────────── */
const ProjectCard = ({
  name, target, collected, status, color, delay,
}: {
  name: string; target: string; collected: string; status: string; color: string; delay: string;
}) => {
  const pct = Math.round((parseFloat(collected.replace(/[^0-9.]/g, '')) / parseFloat(target.replace(/[^0-9.]/g, ''))) * 100);
  return (
    <div className={`glass rounded-2xl p-5 hover:border-opacity-40 transition-all duration-300 animate-fadeInUp ${delay}`} style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
      <div className="flex items-center justify-between mb-3">
        <div>
          <h4 className="text-white font-semibold text-sm">{name}</h4>
          <p className="text-slate-400 text-xs mt-0.5">Target: {target}</p>
        </div>
        <span className="text-xs px-3 py-1 rounded-full font-medium" style={{ background: `${color}15`, color }}>
          {status}
        </span>
      </div>
      <div className="w-full h-1.5 rounded-full mb-2" style={{ background: 'rgba(255,255,255,0.08)' }}>
        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${color}, ${color}cc)` }}/>
      </div>
      <div className="flex justify-between text-xs">
        <span style={{ color }}>Terkumpul: {collected}</span>
        <span className="text-slate-400">{pct}%</span>
      </div>
    </div>
  );
};

/* ─── Nelayan Dashboard ────────────────────────────────── */
export default function NelayanDashboard() {
  const navigate = useNavigate();
  const email = localStorage.getItem('email') || 'nelayan@lautanuang.id';
  const firstName = email.split('@')[0].split('.')[0];
  const displayName = firstName.charAt(0).toUpperCase() + firstName.slice(1);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/auth');
  };

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Selamat pagi' : hour < 17 ? 'Selamat siang' : 'Selamat malam';

  const navItems = [
    { icon: <IconHome />, label: 'Dashboard', active: true },
    { icon: <IconFish />, label: 'Proyek Saya' },
    { icon: <IconChart />, label: 'Laporan Keuangan' },
    { icon: <IconWave />, label: 'Perikanan' },
    { icon: <IconBriefcase />, label: 'Pengajuan Modal' },
    { icon: <IconStar />, label: 'Reputasi & Rating' },
  ];

  const projects = [
    { name: 'Budi Daya Udang Vaname — Tambak A', target: 'Rp 50.000.000', collected: 'Rp 38.500.000', status: 'Aktif', color: '#10b981', delay: 'delay-200' },
    { name: 'Penangkapan Ikan Laut Dalam', target: 'Rp 30.000.000', collected: 'Rp 12.000.000', status: 'Funding', color: '#06b6d4', delay: 'delay-300' },
    { name: 'Jaring Apung Kerapu', target: 'Rp 20.000.000', collected: 'Rp 20.000.000', status: 'Selesai', color: '#f59e0b', delay: 'delay-400' },
  ];

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'linear-gradient(135deg, #020b18 0%, #041224 100%)' }}>

      {/* ── Sidebar ── */}
      <aside className="sidebar hidden lg:flex flex-col w-64 flex-shrink-0 py-6 px-4">
        {/* Logo */}
        <div className="flex items-center gap-3 px-2 mb-10">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #059669, #10b981)' }}>
            <IconAnchor />
          </div>
          <div>
            <span className="text-white font-bold text-sm" style={{ fontFamily: 'Poppins, sans-serif' }}>Lautan Uang</span>
            <p className="text-xs" style={{ color: '#10b981' }}>Nelayan</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex flex-col gap-1 flex-1">
          {navItems.map((item) => (
            <div key={item.label} className={`sidebar-item ${item.active ? 'active' : ''}`} style={item.active ? { borderLeftColor: '#10b981', color: '#10b981', background: 'rgba(16,185,129,0.12)' } : {}}>
              {item.icon}
              <span className="text-sm">{item.label}</span>
            </div>
          ))}
        </nav>

        {/* Profile card */}
        <div className="glass rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold" style={{ background: 'linear-gradient(135deg, #059669, #10b981)' }}>
              {displayName.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium truncate">{displayName}</p>
              <p className="text-xs text-slate-400 truncate">Nelayan Aktif</p>
            </div>
          </div>
          <button onClick={handleLogout} className="mt-3 w-full flex items-center gap-2 text-xs text-slate-400 hover:text-red-400 transition-colors justify-center py-1.5 rounded-lg hover:bg-red-400/10">
            <IconLogout />
            Keluar
          </button>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <main className="flex-1 overflow-y-auto">

        {/* Header */}
        <div className="sticky top-0 z-20 flex items-center justify-between px-6 py-4" style={{ background: 'rgba(2,11,24,0.8)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div>
            <h1 className="text-white font-bold text-xl" style={{ fontFamily: 'Poppins, sans-serif' }}>
              {greeting}, {displayName}! 🎣
            </h1>
            <p className="text-slate-400 text-xs mt-0.5">
              {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative w-9 h-9 rounded-xl flex items-center justify-center glass text-slate-400 hover:text-white transition-colors">
              <IconBell />
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full" style={{ background: '#10b981' }}/>
            </button>
            <button id="btn-nelayan-logout" onClick={handleLogout} className="flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-xl transition-all" style={{ background: 'rgba(239,68,68,0.12)', color: '#fca5a5', border: '1px solid rgba(239,68,68,0.2)' }}
              onMouseOver={e => Object.assign((e.currentTarget as HTMLElement).style, { background: 'rgba(239,68,68,0.2)' })}
              onMouseOut={e => Object.assign((e.currentTarget as HTMLElement).style, { background: 'rgba(239,68,68,0.12)' })}
            >
              <IconLogout />
              <span className="hidden sm:inline">Keluar</span>
            </button>
          </div>
        </div>

        <div className="p-6 space-y-8">

          {/* Stats Grid */}
          <section>
            <h2 className="text-white font-semibold mb-4 text-lg" style={{ fontFamily: 'Poppins, sans-serif' }}>Ringkasan Akun</h2>
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
              <StatCard icon={<span className="text-xl">💰</span>} label="Total Modal Diterima" value="Rp 70,5 Jt" sub="↑ 12% bulan ini" color="#10b981" delay="delay-100" />
              <StatCard icon={<span className="text-xl">🎣</span>} label="Proyek Aktif" value="2 Proyek" sub="1 funding" color="#06b6d4" delay="delay-200" />
              <StatCard icon={<span className="text-xl">📅</span>} label="Cicilan Berjalan" value="Rp 3,2 Jt" sub="Jatuh tempo 5 hari" color="#f59e0b" delay="delay-300" />
              <StatCard icon={<span className="text-xl">⭐</span>} label="Rating Nelayan" value="4.8 / 5.0" sub="42 ulasan" color="#a78bfa" delay="delay-400" />
            </div>
          </section>

          {/* Projects */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white font-semibold text-lg" style={{ fontFamily: 'Poppins, sans-serif' }}>Proyek Saya</h2>
              <button className="text-sm px-4 py-2 rounded-xl font-medium btn-emerald">+ Ajukan Proyek Baru</button>
            </div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {projects.map((p) => <ProjectCard key={p.name} {...p} />)}
            </div>
          </section>

          {/* Activity Feed */}
          <section>
            <h2 className="text-white font-semibold mb-4 text-lg" style={{ fontFamily: 'Poppins, sans-serif' }}>Aktivitas Terbaru</h2>
            <div className="glass rounded-2xl divide-y" style={{ border: '1px solid rgba(255,255,255,0.06)', divideColor: 'rgba(255,255,255,0.04)' }}>
              {[
                { icon: '💸', text: 'Investasi masuk dari Budi S.', time: '2 jam lalu', color: '#10b981' },
                { icon: '📋', text: 'Laporan bulayan Proyek Udang telah dikirim', time: '1 hari lalu', color: '#06b6d4' },
                { icon: '⭐', text: 'Mendapat ulasan bintang 5 dari investor', time: '3 hari lalu', color: '#f59e0b' },
                { icon: '✅', text: 'Proyek Jaring Apung Kerapu selesai', time: '1 minggu lalu', color: '#a78bfa' },
              ].map((act, i) => (
                <div key={i} className="flex items-center gap-4 px-5 py-4">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${act.color}15` }}>
                    <span>{act.icon}</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-white text-sm">{act.text}</p>
                    <p className="text-slate-500 text-xs mt-0.5">{act.time}</p>
                  </div>
                  <div className="w-2 h-2 rounded-full" style={{ background: act.color }}/>
                </div>
              ))}
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}