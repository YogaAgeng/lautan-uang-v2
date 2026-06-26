import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

/* ─── Types ────────────────────────────────────────────── */
interface Campaign {
  id: number;
  title: string;
  description: string;
  targetAmount: string;
  currentAmount: string;
  status: 'ACTIVE' | 'FUNDED' | 'CLOSED';
  userId: number;
  createdAt: string;
  user?: { id: number; email: string };
}

interface Transaction {
  id: number;
  amount: string;
  campaignId: number;
  createdAt: string;
  user?: { email: string; role: string };
  campaign?: { title: string };
}

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
const IconX = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <line x1="18" y1="6" x2="6" y2="18"/>
    <line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

/* ─── Helpers ──────────────────────────────────────────── */
const formatRupiah = (val: string | number) => {
  const num = typeof val === 'string' ? parseInt(val, 10) : val;
  if (isNaN(num)) return 'Rp 0';
  if (num >= 1_000_000_000) return `Rp ${(num / 1_000_000_000).toFixed(1)} M`;
  if (num >= 1_000_000) return `Rp ${(num / 1_000_000).toFixed(1)} Jt`;
  if (num >= 1_000) return `Rp ${(num / 1_000).toFixed(0)} Rb`;
  return `Rp ${num.toLocaleString('id-ID')}`;
};

const timeAgo = (dateStr: string) => {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins} menit lalu`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} jam lalu`;
  const days = Math.floor(hours / 24);
  return `${days} hari lalu`;
};

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
  campaign,
  onInvest,
  delay,
}: {
  campaign: Campaign;
  onInvest: (c: Campaign) => void;
  delay: string;
}) => {
  const target = parseInt(campaign.targetAmount, 10);
  const current = parseInt(campaign.currentAmount, 10);
  const pct = target > 0 ? Math.min(100, Math.round((current / target) * 100)) : 0;
  const color = '#06b6d4';

  return (
    <div
      className={`glass rounded-2xl p-5 transition-all duration-300 animate-fadeInUp ${delay}`}
      style={{ border: '1px solid rgba(255,255,255,0.07)' }}
      onMouseOver={e => Object.assign((e.currentTarget as HTMLElement).style, { borderColor: `${color}40`, transform: 'translateY(-4px)', boxShadow: `0 12px 40px ${color}18` })}
      onMouseOut={e => Object.assign((e.currentTarget as HTMLElement).style, { borderColor: 'rgba(255,255,255,0.07)', transform: 'translateY(0)', boxShadow: 'none' })}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0 pr-2">
          <span className="text-xs px-2 py-0.5 rounded-full mb-2 inline-block" style={{ background: `${color}15`, color }}>Perikanan</span>
          <h4 className="text-white font-semibold text-sm leading-snug truncate">{campaign.title}</h4>
          <p className="text-slate-400 text-xs mt-0.5 truncate">oleh {campaign.user?.email?.split('@')[0] || 'Nelayan'}</p>
        </div>
        <div className="text-right flex-shrink-0 ml-3">
          <p className="text-xs text-slate-400">Sisa Dana</p>
          <p className="font-bold text-sm" style={{ color, fontFamily: 'Poppins, sans-serif' }}>
            {formatRupiah(target - current)}
          </p>
        </div>
      </div>
      <div className="flex justify-between text-xs text-slate-400 mb-1.5">
        <span>Terkumpul: <span className="text-white font-medium">{formatRupiah(current)}</span></span>
        <span>Target: {formatRupiah(target)}</span>
      </div>
      <div className="w-full h-1.5 rounded-full mb-3" style={{ background: 'rgba(255,255,255,0.08)' }}>
        <div className="h-full rounded-full" style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${color}, ${color}cc)` }}/>
      </div>
      <button
        id={`btn-invest-${campaign.id}`}
        onClick={() => onInvest(campaign)}
        className="w-full py-2 rounded-xl text-xs font-semibold transition-all duration-300"
        style={{ background: `${color}15`, color, border: `1px solid ${color}30` }}
        onMouseOver={e => Object.assign((e.currentTarget as HTMLElement).style, { background: `${color}25` })}
        onMouseOut={e => Object.assign((e.currentTarget as HTMLElement).style, { background: `${color}15` })}
      >
        Investasikan Sekarang →
      </button>
    </div>
  );
};

/* ─── Invest Modal ─────────────────────────────────────── */
const InvestModal = ({
  campaign,
  onClose,
  onSuccess,
}: {
  campaign: Campaign;
  onClose: () => void;
  onSuccess: () => void;
}) => {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const remaining = parseInt(campaign.targetAmount, 10) - parseInt(campaign.currentAmount, 10);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.post(`/campaigns/${campaign.id}/invest`, { amount: Number(amount) });
      setSuccess(true);
      setTimeout(() => {
        onSuccess();
      }, 1500);
    } catch (err: any) {
      const status = err.response?.status;
      if (status === 409) {
        setError('⚡ Terjadi tabrakan transaksi (Race Condition). Silakan coba lagi dalam beberapa detik.');
      } else {
        setError(err.response?.data?.message || 'Terjadi kesalahan server.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)' }}>
      <div className="w-full max-w-md rounded-2xl p-6 animate-fadeInUp" style={{ background: 'rgba(4,18,36,0.95)', border: '1px solid rgba(245,158,11,0.25)' }}>
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-white font-bold text-lg" style={{ fontFamily: 'Poppins, sans-serif' }}>💼 Investasi Sekarang</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors"><IconX /></button>
        </div>

        {/* Campaign info */}
        <div className="rounded-xl p-4 mb-5" style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.15)' }}>
          <p className="text-white font-semibold text-sm mb-1 truncate">{campaign.title}</p>
          <div className="flex justify-between text-xs text-slate-400 mt-1">
            <span>Terkumpul: <span className="text-white">{formatRupiah(campaign.currentAmount)}</span></span>
            <span>Sisa: <span style={{ color: '#f59e0b' }}>{formatRupiah(remaining)}</span></span>
          </div>
          <div className="w-full h-1.5 rounded-full mt-2" style={{ background: 'rgba(255,255,255,0.08)' }}>
            <div className="h-full rounded-full" style={{
              width: `${Math.min(100, Math.round((parseInt(campaign.currentAmount) / parseInt(campaign.targetAmount)) * 100))}%`,
              background: 'linear-gradient(90deg, #d97706, #f59e0b)',
            }}/>
          </div>
        </div>

        {/* Success state */}
        {success ? (
          <div className="text-center py-6">
            <div className="text-5xl mb-3">✅</div>
            <p className="text-white font-semibold">Investasi Berhasil!</p>
            <p className="text-slate-400 text-sm mt-1">Dana Anda telah disalurkan ke kampanye ini.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="px-4 py-3 rounded-xl text-sm" style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', color: '#fca5a5' }}>
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Jumlah Investasi (IDR)</label>
              <input
                id="input-invest-amount"
                type="number"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                required
                min={1}
                max={remaining}
                placeholder={`Maks. ${formatRupiah(remaining)}`}
                className="w-full px-4 py-2.5 rounded-xl text-sm text-white placeholder-slate-500 outline-none transition-all"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
                onFocus={e => (e.currentTarget.style.borderColor = '#f59e0b')}
                onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')}
              />
              {amount && !isNaN(Number(amount)) && (
                <p className="mt-1 text-xs" style={{ color: '#f59e0b' }}>{formatRupiah(amount)}</p>
              )}
            </div>

            {/* Quick amount buttons */}
            <div className="flex gap-2">
              {[100_000, 500_000, 1_000_000].map(preset => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setAmount(String(Math.min(preset, remaining)))}
                  className="flex-1 py-1.5 rounded-lg text-xs font-medium transition-all"
                  style={{ background: 'rgba(245,158,11,0.1)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.2)' }}
                  onMouseOver={e => Object.assign((e.currentTarget as HTMLElement).style, { background: 'rgba(245,158,11,0.2)' })}
                  onMouseOut={e => Object.assign((e.currentTarget as HTMLElement).style, { background: 'rgba(245,158,11,0.1)' })}
                >
                  {formatRupiah(preset)}
                </button>
              ))}
            </div>

            <div className="flex gap-3 pt-1">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium text-slate-400 transition-all"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
              >
                Batal
              </button>
              <button
                id="btn-confirm-invest"
                type="submit"
                disabled={loading || !amount}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-60"
                style={{ background: 'linear-gradient(135deg, #d97706, #f59e0b)', boxShadow: '0 4px 15px rgba(245,158,11,0.3)' }}
              >
                {loading ? 'Memproses...' : 'Konfirmasi Investasi'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

/* ─── Investor Dashboard ───────────────────────────────── */
export default function InvestorDashboard() {
  const navigate = useNavigate();
  const email = localStorage.getItem('email') || 'investor@lautanuang.id';
  const userId = parseInt(localStorage.getItem('userId') || '0', 10);
  const firstName = email.split('@')[0].split('.')[0];
  const displayName = firstName.charAt(0).toUpperCase() + firstName.slice(1);

  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [myTransactions, setMyTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');
  const [investTarget, setInvestTarget] = useState<Campaign | null>(null);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/auth');
  };

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Selamat pagi' : hour < 17 ? 'Selamat siang' : 'Selamat malam';

  /* Fetch campaigns + transactions */
  const fetchData = async () => {
    setLoading(true);
    setFetchError('');
    try {
      const res = await api.get<Campaign[]>('/campaigns');
      setCampaigns(res.data);

      // Fetch transactions dari semua kampanye yang pernah diinvest (ambil beberapa kampanye)
      // Kita kumpulkan semua transaksi dari semua kampanye, lalu filter yang milik investor ini
      const txPromises = res.data.slice(0, 10).map(c =>
        api.get<Transaction[]>(`/campaigns/${c.id}/transactions`)
          .then(r => r.data.map(tx => ({ ...tx, campaign: { title: c.title } })))
          .catch(() => [] as Transaction[])
      );
      const allTxArrays = await Promise.all(txPromises);
      const allTx = allTxArrays.flat();
      // Filter transaksi milik user ini (berdasarkan userId yang disimpan — bandingkan via endpoint)
      // Karena backend mengembalikan user.email pada transaksi, filter by email
      const mine = allTx.filter(tx => tx.user?.email === email);
      setMyTransactions(mine.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    } catch (err: any) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        handleLogout();
      } else {
        setFetchError('Gagal memuat data. Pastikan server berjalan.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  /* Derived stats */
  const totalInvested = myTransactions.reduce((sum, tx) => sum + parseInt(tx.amount, 10), 0);
  const activeInvestments = campaigns.filter(c =>
    myTransactions.some(tx => tx.campaignId === c.id) && c.status === 'ACTIVE'
  ).length;

  const navItems = [
    { icon: <IconHome />, label: 'Dashboard', active: true },
    { icon: <IconSearch />, label: 'Temukan Proyek' },
    { icon: <IconWallet />, label: 'Portofolio Saya' },
    { icon: <IconBarChart />, label: 'Analitik Return' },
    { icon: <IconPieChart />, label: 'Alokasi Dana' },
    { icon: <IconGlobe />, label: 'Pasar Sekunder' },
    { icon: <IconStar />, label: 'Proyek Unggulan' },
  ];

  const delays = ['delay-100', 'delay-200', 'delay-300', 'delay-400'];

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
              {campaigns.length > 0 && <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full" style={{ background: '#f59e0b' }}/>}
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
                <p className="text-cyan-300 text-sm font-medium mb-1">Total Investasi Saya</p>
                <p className="text-white text-4xl font-bold" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  {loading ? '...' : formatRupiah(totalInvested)}
                </p>
                <p className="text-slate-300 text-sm mt-1">
                  {myTransactions.length} transaksi tercatat
                </p>
              </div>
              <div className="flex gap-6">
                <div>
                  <p className="text-slate-400 text-xs mb-1">Proyek Aktif</p>
                  <p className="font-bold text-lg text-white" style={{ fontFamily: 'Poppins, sans-serif' }}>{activeInvestments} Proyek</p>
                </div>
                <div>
                  <p className="text-slate-400 text-xs mb-1">Kampanye Tersedia</p>
                  <p className="font-bold text-lg text-white" style={{ fontFamily: 'Poppins, sans-serif' }}>{campaigns.length} Proyek</p>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <section>
            <h2 className="text-white font-semibold mb-4 text-lg" style={{ fontFamily: 'Poppins, sans-serif' }}>Ringkasan Investasi</h2>
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
              <StatCard icon={<IconWallet />} label="Total Diinvestasikan" value={loading ? '...' : formatRupiah(totalInvested)} sub="Semua waktu" color="#f59e0b" delay="delay-100" />
              <StatCard icon={<IconTrendUp />} label="Transaksi Berhasil" value={String(myTransactions.length)} sub="Transaksi" color="#10b981" delay="delay-200" />
              <StatCard icon={<span className="text-xl">🏆</span>} label="Kampanye Didanai" value={`${activeInvestments} Aktif`} sub="Dari investasi saya" color="#06b6d4" delay="delay-300" />
              <StatCard icon={<IconPieChart />} label="Kampanye Tersedia" value={String(campaigns.length)} sub="Siap diinvestasi" color="#a78bfa" delay="delay-400" />
            </div>
          </section>

          {/* Opportunities */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white font-semibold text-lg" style={{ fontFamily: 'Poppins, sans-serif' }}>Peluang Investasi</h2>
              <button onClick={fetchData} className="text-sm px-4 py-2 rounded-xl font-medium btn-gold">Refresh ↻</button>
            </div>

            {/* Loading */}
            {loading && (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="glass rounded-2xl p-5 animate-pulse" style={{ border: '1px solid rgba(255,255,255,0.07)', height: '160px' }}>
                    <div className="h-3 rounded w-1/3 mb-3" style={{ background: 'rgba(255,255,255,0.06)' }}/>
                    <div className="h-4 rounded w-3/4 mb-2" style={{ background: 'rgba(255,255,255,0.06)' }}/>
                    <div className="h-3 rounded w-full mb-4" style={{ background: 'rgba(255,255,255,0.04)' }}/>
                    <div className="h-1.5 rounded-full w-full" style={{ background: 'rgba(255,255,255,0.06)' }}/>
                  </div>
                ))}
              </div>
            )}

            {/* Error */}
            {!loading && fetchError && (
              <div className="rounded-2xl p-6 text-center" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
                <p className="text-red-400 text-sm mb-3">⚠️ {fetchError}</p>
                <button onClick={fetchData} className="text-xs px-4 py-2 rounded-xl font-medium" style={{ background: 'rgba(239,68,68,0.15)', color: '#f87171' }}>
                  Coba Lagi
                </button>
              </div>
            )}

            {/* Empty */}
            {!loading && !fetchError && campaigns.length === 0 && (
              <div className="glass rounded-2xl p-10 text-center" style={{ border: '1px solid rgba(255,255,255,0.07)' }}>
                <div className="text-5xl mb-4">🎣</div>
                <p className="text-white font-semibold mb-2">Belum ada kampanye tersedia</p>
                <p className="text-slate-400 text-sm">Kampanye dari nelayan akan muncul di sini.</p>
              </div>
            )}

            {/* Campaign cards */}
            {!loading && campaigns.length > 0 && (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-4">
                {campaigns.map((c, i) => (
                  <OpportunityCard
                    key={c.id}
                    campaign={c}
                    onInvest={setInvestTarget}
                    delay={delays[i % delays.length]}
                  />
                ))}
              </div>
            )}
          </section>

          {/* Recent transactions */}
          <section>
            <h2 className="text-white font-semibold mb-4 text-lg" style={{ fontFamily: 'Poppins, sans-serif' }}>Transaksi Saya</h2>
            <div className="glass rounded-2xl divide-y" style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
              {myTransactions.length === 0 ? (
                <div className="px-5 py-10 text-center">
                  <p className="text-slate-400 text-sm">Belum ada transaksi. Mulai investasi sekarang!</p>
                </div>
              ) : (
                myTransactions.slice(0, 5).map((tx) => (
                  <div key={tx.id} className="flex items-center gap-4 px-5 py-4">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(245,158,11,0.15)' }}>
                      <span>📤</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm truncate">Investasi — {tx.campaign?.title || `Kampanye #${tx.campaignId}`}</p>
                      <p className="text-slate-500 text-xs mt-0.5">{timeAgo(tx.createdAt)}</p>
                    </div>
                    <p className="font-semibold text-sm" style={{ color: '#f59e0b' }}>-{formatRupiah(tx.amount)}</p>
                  </div>
                ))
              )}
            </div>
          </section>

        </div>
      </main>

      {/* ── Invest Modal ── */}
      {investTarget && (
        <InvestModal
          campaign={investTarget}
          onClose={() => setInvestTarget(null)}
          onSuccess={() => { setInvestTarget(null); fetchData(); }}
        />
      )}
    </div>
  );
}