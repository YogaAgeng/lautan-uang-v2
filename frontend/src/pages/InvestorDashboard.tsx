import { useNavigate } from 'react-router-dom';

/* ─── Icons ───────────────────────────────────────────── */
const IconTrendUp = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
    <polyline points="17 6 23 6 23 12"/>
  </svg>
);
const IconWallet = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4"/>
    <path d="M4 6v12c0 1.1.9 2 2 2h14v-4"/>
    <circle cx="18" cy="12" r="2"/>
  </svg>
);
const IconHome = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
    <polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
);
const IconPieChart = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <path d="M21.21 15.89A10 10 0 1 1 8 2.83"/>
    <path d="M22 12A10 10 0 0 0 12 2v10z"/>
  </svg>
);
const IconBarChart = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <line x1="18" y1="20" x2="18" y2="10"/>
    <line x1="12" y1="20" x2="12" y2="4"/>
    <line x1="6" y1="20" x2="6" y2="14"/>
  </svg>
);
const IconSearch = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <circle cx="11" cy="11" r="8"/>
    <line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);
const IconLogout = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
    <polyline points="16 17 21 12 16 7"/>
    <line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
);
const IconBell = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
    <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
  </svg>
);
const IconGlobe = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <circle cx="12" cy="12" r="10"/>
    <line x1="2" y1="12" x2="22" y2="12"/>
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
  </svg>
);
const IconStar = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
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

/* ─── Opportunity Card ─────────────────────────────────── */
const OpportunityCard = ({
  name, owner, target, collected, roi, category, delay,
}: {
  name: string; owner: string; target: string; collected: string; roi: string; category: string; delay: string;
}) => {
  const pct = Math.round((parseFloat(collected.replace(/[^0-9]/g, '')) / parseFloat(target.replace(/[^0-9]/g, ''))) * 100);
  const catColors: Record<string, string> = {
    'Budidaya': '#10b981',
    'Tangkap': '#06b6d4',
    'Pengolahan': '#f59e0b',
    'Infrastruktur': '#a78bfa',
  };
  const color = catColors[category] || '#06b6d4';

  return (
    <div className={`glass rounded-2xl p-5 transition-all duration-300 cursor-pointer group animate-fadeInUp ${delay}`}
      style={{ border: '1px solid rgba(255,255,255,0.07)' }}
      onMouseOver={e => Object.assign((e.currentTarget as HTMLElement).style, { borderColor: `${color}40`, transform: 'translateY(-4px)', boxShadow: `0 12px 40px ${color}18` })}
      onMouseOut={e => Object.assign((e.currentTarget as HTMLElement).style, { borderColor: 'rgba(255,255,255,0.07)', transform: 'translateY(0)', boxShadow: 'none' })}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <span className="text-xs px-2 py-0.5 rounded-full mb-2 inline-block" style={{ background: `${color}15`, color }}>{category}</span>
          <h4 className="text-white font-semibold text-sm leading-snug">{name}</h4>
          <p className="text-slate-400 text-xs mt-0.5">oleh {owner}</p>
        </div>
        <div className="text-right flex-shrink-0 ml-3">
          <p className="text-xs text-slate-400">Est. ROI</p>
          <p className="font-bold text-lg" style={{ color, fontFamily: 'Poppins, sans-serif' }}>{roi}</p>
        </div>
      </div>
      <div className="flex justify-between text-xs text-slate-400 mb-1.5">
        <span>Terkumpul: <span className="text-white font-medium">{collected}</span></span>
        <span>Target: {target}</span>
      </div>
      <div className="w-full h-1.5 rounded-full mb-3" style={{ background: 'rgba(255,255,255,0.08)' }}>
        <div className="h-full rounded-full" style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${color}, ${color}cc)` }}/>
      </div>
      <button className="w-full py-2 rounded-xl text-xs font-semibold transition-all duration-300" style={{ background: `${color}15`, color, border: `1px solid ${color}30` }}
        onMouseOver={e => Object.assign((e.currentTarget as HTMLElement).style, { background: `${color}25` })}
        onMouseOut={e => Object.assign((e.currentTarget as HTMLElement).style, { background: `${color}15` })}
      >
        Investasikan Sekarang →
      </button>
    </div>
  );
};

/* ─── Investor Dashboard ───────────────────────────────── */
export default function InvestorDashboard() {
  const navigate = useNavigate();
  const email = localStorage.getItem('email') || 'investor@lautanuang.id';
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
    { icon: <IconSearch />, label: 'Temukan Proyek' },
    { icon: <IconWallet />, label: 'Portofolio Saya' },
    { icon: <IconBarChart />, label: 'Analitik Return' },
    { icon: <IconPieChart />, label: 'Alokasi Dana' },
    { icon: <IconGlobe />, label: 'Pasar Sekunder' },
    { icon: <IconStar />, label: 'Proyek Unggulan' },
  ];

  const opportunities = [
    { name: 'Budidaya Lobster Premium Lombok', owner: 'Pak Ahmad Suryadi', target: 'Rp75.000.000', collected: 'Rp52.000.000', roi: '18%', category: 'Budidaya', delay: 'delay-100' },
    { name: 'Kapal Penangkap Tuna Samudra Biru', owner: 'Koperasi Nelayan Bima', target: 'Rp120.000.000', collected: 'Rp88.000.000', roi: '22%', category: 'Tangkap', delay: 'delay-200' },
    { name: 'Pabrik Pengolahan Ikan Teri NTB', owner: 'CV Mina Bahari', target: 'Rp200.000.000', collected: 'Rp95.000.000', roi: '15%', category: 'Pengolahan', delay: 'delay-300' },
    { name: 'Cold Storage Pelabuhan Kendari', owner: 'PT Laut Sejahtera', target: 'Rp350.000.000', collected: 'Rp210.000.000', roi: '12%', category: 'Infrastruktur', delay: 'delay-400' },
  ];

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'linear-gradient(135deg, #020b18 0%, #0a0e1a 100%)' }}>

      {/* ── Sidebar ── */}
      <aside className="sidebar hidden lg:flex flex-col w-64 flex-shrink-0 py-6 px-4">
        {/* Logo */}
        <div className="flex items-center gap-3 px-2 mb-10">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #d97706, #f59e0b)' }}>
            <IconWallet />
          </div>
          <div>
            <span className="text-white font-bold text-sm" style={{ fontFamily: 'Poppins, sans-serif' }}>Lautan Uang</span>
            <p className="text-xs" style={{ color: '#f59e0b' }}>Investor</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex flex-col gap-1 flex-1">
          {navItems.map((item) => (
            <div key={item.label} className={`sidebar-item ${item.active ? 'active' : ''}`} style={item.active ? { borderLeftColor: '#f59e0b', color: '#f59e0b', background: 'rgba(245,158,11,0.1)' } : {}}>
              {item.icon}
              <span className="text-sm">{item.label}</span>
            </div>
          ))}
        </nav>

        {/* Profile card */}
        <div className="glass rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm" style={{ background: 'linear-gradient(135deg, #d97706, #f59e0b)' }}>
              {displayName.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium truncate">{displayName}</p>
              <p className="text-xs text-slate-400 truncate">Investor Verified ✓</p>
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
        <div className="sticky top-0 z-20 flex items-center justify-between px-6 py-4" style={{ background: 'rgba(2,11,24,0.85)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div>
            <h1 className="text-white font-bold text-xl" style={{ fontFamily: 'Poppins, sans-serif' }}>
              {greeting}, {displayName}! 💼
            </h1>
            <p className="text-slate-400 text-xs mt-0.5">
              {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative w-9 h-9 rounded-xl flex items-center justify-center glass text-slate-400 hover:text-white transition-colors">
              <IconBell />
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full" style={{ background: '#f59e0b' }}/>
            </button>
            <button id="btn-investor-logout" onClick={handleLogout} className="flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-xl transition-all" style={{ background: 'rgba(239,68,68,0.12)', color: '#fca5a5', border: '1px solid rgba(239,68,68,0.2)' }}
              onMouseOver={e => Object.assign((e.currentTarget as HTMLElement).style, { background: 'rgba(239,68,68,0.2)' })}
              onMouseOut={e => Object.assign((e.currentTarget as HTMLElement).style, { background: 'rgba(239,68,68,0.12)' })}
            >
              <IconLogout />
              <span className="hidden sm:inline">Keluar</span>
            </button>
          </div>
        </div>

        <div className="p-6 space-y-8">

          {/* Portfolio summary banner */}
          <div className="rounded-2xl p-6 relative overflow-hidden animate-fadeInUp" style={{ background: 'linear-gradient(135deg, #0d3b6e, #1a6b8a 50%, #0a3d62)' }}>
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-64 h-64 rounded-full" style={{ background: 'radial-gradient(circle, #f59e0b, transparent)', transform: 'translate(30%, -30%)' }}/>
            </div>
            <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <p className="text-cyan-300 text-sm font-medium mb-1">Total Portofolio</p>
                <p className="text-white text-4xl font-bold" style={{ fontFamily: 'Poppins, sans-serif' }}>Rp 248.500.000</p>
                <p className="text-slate-300 text-sm mt-1">↑ <span style={{ color: '#10b981' }}>+8.3%</span> dari bulan lalu</p>
              </div>
              <div className="flex gap-6">
                <div>
                  <p className="text-slate-400 text-xs mb-1">Keuntungan Total</p>
                  <p className="font-bold text-lg" style={{ color: '#10b981', fontFamily: 'Poppins, sans-serif' }}>Rp 32,1 Jt</p>
                </div>
                <div>
                  <p className="text-slate-400 text-xs mb-1">Proyek Aktif</p>
                  <p className="font-bold text-lg text-white" style={{ fontFamily: 'Poppins, sans-serif' }}>7 Proyek</p>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <section>
            <h2 className="text-white font-semibold mb-4 text-lg" style={{ fontFamily: 'Poppins, sans-serif' }}>Ringkasan Investasi</h2>
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
              <StatCard icon={<IconWallet />} label="Saldo Tersedia" value="Rp 15,5 Jt" sub="Siap investasi" color="#f59e0b" delay="delay-100" />
              <StatCard icon={<IconTrendUp />} label="Return Bulan Ini" value="+Rp 4,8 Jt" sub="↑ 18.2% p.a." color="#10b981" delay="delay-200" />
              <StatCard icon={<span className="text-xl">🏆</span>} label="Proyek Dibiayai" value="12 Total" sub="7 aktif" color="#06b6d4" delay="delay-300" />
              <StatCard icon={<IconPieChart />} label="Rata-rata ROI" value="17.4%" sub="Per tahun" color="#a78bfa" delay="delay-400" />
            </div>
          </section>

          {/* Opportunities */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white font-semibold text-lg" style={{ fontFamily: 'Poppins, sans-serif' }}>Peluang Investasi</h2>
              <button className="text-sm px-4 py-2 rounded-xl font-medium btn-gold">Lihat Semua →</button>
            </div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-4">
              {opportunities.map((op) => <OpportunityCard key={op.name} {...op} />)}
            </div>
          </section>

          {/* Recent transactions */}
          <section>
            <h2 className="text-white font-semibold mb-4 text-lg" style={{ fontFamily: 'Poppins, sans-serif' }}>Transaksi Terbaru</h2>
            <div className="glass rounded-2xl divide-y" style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
              {[
                { icon: '📤', text: 'Investasi — Budidaya Lobster Lombok', amount: '-Rp 15.000.000', time: '1 jam lalu', color: '#f59e0b', plus: false },
                { icon: '📥', text: 'Return — Kapal Tuna Sulawesi Bulan 3', amount: '+Rp 2.700.000', time: '2 hari lalu', color: '#10b981', plus: true },
                { icon: '📤', text: 'Investasi — Pabrik Pengolahan Teri', amount: '-Rp 25.000.000', time: '5 hari lalu', color: '#f59e0b', plus: false },
                { icon: '📥', text: 'Return — Cold Storage Kendari Bulan 2', amount: '+Rp 3.500.000', time: '1 minggu lalu', color: '#10b981', plus: true },
              ].map((tx, i) => (
                <div key={i} className="flex items-center gap-4 px-5 py-4">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${tx.color}15` }}>
                    <span>{tx.icon}</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-white text-sm">{tx.text}</p>
                    <p className="text-slate-500 text-xs mt-0.5">{tx.time}</p>
                  </div>
                  <p className="font-semibold text-sm" style={{ color: tx.color }}>{tx.amount}</p>
                </div>
              ))}
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}