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
}

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
const IconEdit = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);
const IconTrash = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <polyline points="3 6 5 6 21 6"/>
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
    <path d="M10 11v6"/>
    <path d="M14 11v6"/>
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
  </svg>
);
const IconPlus = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <line x1="12" y1="5" x2="12" y2="19"/>
    <line x1="5" y1="12" x2="19" y2="12"/>
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

const statusColor: Record<string, string> = {
  ACTIVE: '#10b981',
  FUNDED: '#f59e0b',
  CLOSED: '#64748b',
};
const statusLabel: Record<string, string> = {
  ACTIVE: 'Aktif',
  FUNDED: 'Terpenuhi',
  CLOSED: 'Ditutup',
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

/* ─── Project Card ─────────────────────────────────────── */
const ProjectCard = ({
  campaign, onEdit, onDelete, delay,
}: {
  campaign: Campaign;
  onEdit: (c: Campaign) => void;
  onDelete: (c: Campaign) => void;
  delay: string;
}) => {
  const target = parseInt(campaign.targetAmount, 10);
  const current = parseInt(campaign.currentAmount, 10);
  const pct = target > 0 ? Math.min(100, Math.round((current / target) * 100)) : 0;
  const color = statusColor[campaign.status] || '#10b981';

  return (
    <div
      className={`glass rounded-2xl p-5 transition-all duration-300 animate-fadeInUp ${delay}`}
      style={{ border: '1px solid rgba(255,255,255,0.08)' }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0 pr-2">
          <h4 className="text-white font-semibold text-sm truncate">{campaign.title}</h4>
          <p className="text-slate-400 text-xs mt-0.5 truncate">{campaign.description}</p>
          <p className="text-slate-500 text-xs mt-0.5">Target: {formatRupiah(campaign.targetAmount)}</p>
        </div>
        <div className="flex flex-col items-end gap-2 flex-shrink-0">
          <span className="text-xs px-2.5 py-1 rounded-full font-medium" style={{ background: `${color}15`, color }}>
            {statusLabel[campaign.status]}
          </span>
          {/* Edit & Delete buttons — hanya tampil jika masih ACTIVE */}
          {campaign.status === 'ACTIVE' && (
            <div className="flex gap-1.5">
              <button
                id={`btn-edit-campaign-${campaign.id}`}
                onClick={() => onEdit(campaign)}
                className="w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-200"
                style={{ background: 'rgba(6,182,212,0.12)', color: '#06b6d4', border: '1px solid rgba(6,182,212,0.2)' }}
                onMouseOver={e => Object.assign((e.currentTarget as HTMLElement).style, { background: 'rgba(6,182,212,0.25)' })}
                onMouseOut={e => Object.assign((e.currentTarget as HTMLElement).style, { background: 'rgba(6,182,212,0.12)' })}
                title="Edit kampanye"
              >
                <IconEdit />
              </button>
              <button
                id={`btn-delete-campaign-${campaign.id}`}
                onClick={() => onDelete(campaign)}
                className="w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-200"
                style={{ background: 'rgba(239,68,68,0.12)', color: '#f87171', border: '1px solid rgba(239,68,68,0.2)' }}
                onMouseOver={e => Object.assign((e.currentTarget as HTMLElement).style, { background: 'rgba(239,68,68,0.25)' })}
                onMouseOut={e => Object.assign((e.currentTarget as HTMLElement).style, { background: 'rgba(239,68,68,0.12)' })}
                title="Hapus kampanye"
              >
                <IconTrash />
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="w-full h-1.5 rounded-full mb-2" style={{ background: 'rgba(255,255,255,0.08)' }}>
        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${color}, ${color}cc)` }}/>
      </div>
      <div className="flex justify-between text-xs">
        <span style={{ color }}>Terkumpul: {formatRupiah(campaign.currentAmount)}</span>
        <span className="text-slate-400">{pct}%</span>
      </div>
    </div>
  );
};

/* ─── Campaign Form Modal ──────────────────────────────── */
const CampaignModal = ({
  mode,
  initial,
  onClose,
  onSuccess,
}: {
  mode: 'create' | 'edit';
  initial?: Campaign;
  onClose: () => void;
  onSuccess: () => void;
}) => {
  const [title, setTitle] = useState(initial?.title || '');
  const [description, setDescription] = useState(initial?.description || '');
  const [targetAmount, setTargetAmount] = useState(initial?.targetAmount || '');
  const [status, setStatus] = useState(initial?.status || 'ACTIVE');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (mode === 'create') {
        await api.post('/campaigns', { title, description, targetAmount: Number(targetAmount) });
      } else {
        await api.put(`/campaigns/${initial!.id}`, { title, description, targetAmount: Number(targetAmount), status });
      }
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Terjadi kesalahan server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)' }}>
      <div className="w-full max-w-md rounded-2xl p-6 animate-fadeInUp" style={{ background: 'rgba(4,18,36,0.95)', border: '1px solid rgba(16,185,129,0.25)' }}>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-white font-bold text-lg" style={{ fontFamily: 'Poppins, sans-serif' }}>
            {mode === 'create' ? '🎣 Ajukan Proyek Baru' : '✏️ Edit Kampanye'}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <IconX />
          </button>
        </div>

        {error && (
          <div className="mb-4 px-4 py-3 rounded-xl text-sm" style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', color: '#fca5a5' }}>
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Nama Proyek</label>
            <input
              id="input-campaign-title"
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
              placeholder="contoh: Pengadaan Kapal Motor 40PK"
              className="w-full px-4 py-2.5 rounded-xl text-sm text-white placeholder-slate-500 outline-none transition-all"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
              onFocus={e => (e.currentTarget.style.borderColor = '#10b981')}
              onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Deskripsi Proyek</label>
            <textarea
              id="input-campaign-description"
              value={description}
              onChange={e => setDescription(e.target.value)}
              required
              rows={3}
              placeholder="Jelaskan tujuan penggunaan dana..."
              className="w-full px-4 py-2.5 rounded-xl text-sm text-white placeholder-slate-500 outline-none transition-all resize-none"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
              onFocus={e => (e.currentTarget.style.borderColor = '#10b981')}
              onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')}
            />
          </div>

          {/* Target Amount */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Target Dana (IDR)</label>
            <input
              id="input-campaign-target"
              type="number"
              value={targetAmount}
              onChange={e => setTargetAmount(e.target.value)}
              required
              min={1}
              placeholder="contoh: 50000000"
              className="w-full px-4 py-2.5 rounded-xl text-sm text-white placeholder-slate-500 outline-none transition-all"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
              onFocus={e => (e.currentTarget.style.borderColor = '#10b981')}
              onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')}
            />
            {targetAmount && !isNaN(Number(targetAmount)) && (
              <p className="mt-1 text-xs" style={{ color: '#10b981' }}>{formatRupiah(targetAmount)}</p>
            )}
          </div>

          {/* Status (edit only) */}
          {mode === 'edit' && (
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Status</label>
              <select
                id="select-campaign-status"
                value={status}
                onChange={e => setStatus(e.target.value as any)}
                className="w-full px-4 py-2.5 rounded-xl text-sm text-white outline-none transition-all"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
              >
                <option value="ACTIVE" style={{ background: '#0a0e1a' }}>Aktif</option>
                <option value="FUNDED" style={{ background: '#0a0e1a' }}>Terpenuhi</option>
                <option value="CLOSED" style={{ background: '#0a0e1a' }}>Ditutup</option>
              </select>
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl text-sm font-medium text-slate-400 transition-all"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
            >
              Batal
            </button>
            <button
              id="btn-submit-campaign"
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-60"
              style={{ background: 'linear-gradient(135deg, #059669, #10b981)', boxShadow: '0 4px 15px rgba(16,185,129,0.3)' }}
            >
              {loading ? 'Menyimpan...' : mode === 'create' ? 'Ajukan Proyek' : 'Simpan Perubahan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* ─── Delete Confirm Modal ─────────────────────────────── */
const DeleteModal = ({
  campaign,
  onClose,
  onSuccess,
}: {
  campaign: Campaign;
  onClose: () => void;
  onSuccess: () => void;
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleDelete = async () => {
    setLoading(true);
    setError('');
    try {
      await api.delete(`/campaigns/${campaign.id}`);
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal menghapus kampanye.');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)' }}>
      <div className="w-full max-w-sm rounded-2xl p-6 animate-fadeInUp" style={{ background: 'rgba(4,18,36,0.95)', border: '1px solid rgba(239,68,68,0.25)' }}>
        <div className="text-center mb-5">
          <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: 'rgba(239,68,68,0.15)' }}>
            <IconTrash />
          </div>
          <h3 className="text-white font-bold text-lg mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>Hapus Kampanye?</h3>
          <p className="text-slate-400 text-sm">
            Kampanye <span className="text-white font-medium">"{campaign.title}"</span> akan dihapus permanen. Tindakan ini tidak dapat dibatalkan.
          </p>
        </div>

        {error && (
          <div className="mb-4 px-4 py-3 rounded-xl text-sm text-center" style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', color: '#fca5a5' }}>
            ⚠️ {error}
          </div>
        )}

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl text-sm font-medium text-slate-400 transition-all"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
          >
            Batal
          </button>
          <button
            id="btn-confirm-delete-campaign"
            onClick={handleDelete}
            disabled={loading}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-60"
            style={{ background: 'linear-gradient(135deg, #dc2626, #ef4444)', boxShadow: '0 4px 15px rgba(239,68,68,0.3)' }}
          >
            {loading ? 'Menghapus...' : 'Ya, Hapus'}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ─── Nelayan Dashboard ────────────────────────────────── */
export default function NelayanDashboard() {
  const navigate = useNavigate();
  const email = localStorage.getItem('email') || 'nelayan@lautanuang.id';
  const userId = parseInt(localStorage.getItem('userId') || '0', 10);
  const firstName = email.split('@')[0].split('.')[0];
  const displayName = firstName.charAt(0).toUpperCase() + firstName.slice(1);

  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');

  // Modal state
  const [showCreate, setShowCreate] = useState(false);
  const [editTarget, setEditTarget] = useState<Campaign | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Campaign | null>(null);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/auth');
  };

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Selamat pagi' : hour < 17 ? 'Selamat siang' : 'Selamat malam';

  /* Fetch kampanye milik nelayan ini */
  const fetchCampaigns = async () => {
    setLoading(true);
    setFetchError('');
    try {
      const res = await api.get<Campaign[]>('/campaigns');
      // Filter hanya kampanye milik user ini
      const mine = res.data.filter(c => c.userId === userId);
      setCampaigns(mine);
    } catch (err: any) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        handleLogout();
      } else {
        setFetchError('Gagal memuat kampanye. Pastikan server berjalan.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  /* Derived stats */
  const activeCount = campaigns.filter(c => c.status === 'ACTIVE').length;
  const fundedCount = campaigns.filter(c => c.status === 'FUNDED').length;
  const totalReceived = campaigns.reduce((sum, c) => sum + parseInt(c.currentAmount, 10), 0);
  const pendingInstallment = campaigns
    .filter(c => c.status === 'ACTIVE')
    .reduce((sum, c) => sum + parseInt(c.currentAmount, 10) * 0.03, 0); // estimasi 3%

  const navItems = [
    { icon: <IconHome />, label: 'Dashboard', active: true },
    { icon: <IconFish />, label: 'Proyek Saya' },
    { icon: <IconChart />, label: 'Laporan Keuangan' },
    { icon: <IconWave />, label: 'Perikanan' },
    { icon: <IconBriefcase />, label: 'Pengajuan Modal' },
    { icon: <IconStar />, label: 'Reputasi & Rating' },
  ];

  const delays = ['delay-200', 'delay-300', 'delay-400', 'delay-100', 'delay-200', 'delay-300'];

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
              {activeCount > 0 && <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full" style={{ background: '#10b981' }}/>}
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
              <StatCard icon={<span className="text-xl">💰</span>} label="Total Modal Diterima" value={formatRupiah(totalReceived)} sub={`${campaigns.length} kampanye`} color="#10b981" delay="delay-100" />
              <StatCard icon={<span className="text-xl">🎣</span>} label="Proyek Aktif" value={`${activeCount} Proyek`} sub={`${fundedCount} terpenuhi`} color="#06b6d4" delay="delay-200" />
              <StatCard icon={<span className="text-xl">📅</span>} label="Est. Cicilan Berjalan" value={formatRupiah(Math.round(pendingInstallment))} sub="Estimasi 3%" color="#f59e0b" delay="delay-300" />
              <StatCard icon={<span className="text-xl">⭐</span>} label="Rating Nelayan" value="4.8 / 5.0" sub="42 ulasan" color="#a78bfa" delay="delay-400" />
            </div>
          </section>

          {/* Projects */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white font-semibold text-lg" style={{ fontFamily: 'Poppins, sans-serif' }}>Proyek Saya</h2>
              <button
                id="btn-open-create-campaign"
                onClick={() => setShowCreate(true)}
                className="flex items-center gap-2 text-sm px-4 py-2 rounded-xl font-medium btn-emerald"
              >
                <IconPlus />
                Ajukan Proyek Baru
              </button>
            </div>

            {/* Loading */}
            {loading && (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="glass rounded-2xl p-5 animate-pulse" style={{ border: '1px solid rgba(255,255,255,0.08)', height: '120px' }}>
                    <div className="h-4 rounded w-3/4 mb-3" style={{ background: 'rgba(255,255,255,0.06)' }}/>
                    <div className="h-3 rounded w-full mb-2" style={{ background: 'rgba(255,255,255,0.04)' }}/>
                    <div className="h-1.5 rounded-full w-full mt-4" style={{ background: 'rgba(255,255,255,0.06)' }}/>
                  </div>
                ))}
              </div>
            )}

            {/* Error */}
            {!loading && fetchError && (
              <div className="rounded-2xl p-6 text-center" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
                <p className="text-red-400 text-sm mb-3">⚠️ {fetchError}</p>
                <button onClick={fetchCampaigns} className="text-xs px-4 py-2 rounded-xl font-medium" style={{ background: 'rgba(239,68,68,0.15)', color: '#f87171' }}>
                  Coba Lagi
                </button>
              </div>
            )}

            {/* Empty state */}
            {!loading && !fetchError && campaigns.length === 0 && (
              <div className="glass rounded-2xl p-10 text-center" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
                <div className="text-5xl mb-4">🎣</div>
                <p className="text-white font-semibold mb-2">Belum ada proyek</p>
                <p className="text-slate-400 text-sm mb-5">Mulai ajukan proyek pertama Anda untuk mendapatkan modal dari investor.</p>
                <button onClick={() => setShowCreate(true)} className="text-sm px-6 py-2.5 rounded-xl font-medium btn-emerald">
                  + Ajukan Proyek Sekarang
                </button>
              </div>
            )}

            {/* Campaign cards */}
            {!loading && campaigns.length > 0 && (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {campaigns.map((c, i) => (
                  <ProjectCard
                    key={c.id}
                    campaign={c}
                    onEdit={setEditTarget}
                    onDelete={setDeleteTarget}
                    delay={delays[i % delays.length]}
                  />
                ))}
              </div>
            )}
          </section>

          {/* Activity Feed */}
          <section>
            <h2 className="text-white font-semibold mb-4 text-lg" style={{ fontFamily: 'Poppins, sans-serif' }}>Aktivitas Terbaru</h2>
            <div className="glass rounded-2xl divide-y" style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
              {campaigns.length === 0 ? (
                <div className="px-5 py-8 text-center text-slate-500 text-sm">Belum ada aktivitas.</div>
              ) : (
                campaigns.slice(0, 4).map((c) => (
                  <div key={c.id} className="flex items-center gap-4 px-5 py-4">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${statusColor[c.status]}15` }}>
                      <span>{c.status === 'FUNDED' ? '✅' : c.status === 'CLOSED' ? '🔒' : '💸'}</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-white text-sm truncate">{c.title}</p>
                      <p className="text-slate-500 text-xs mt-0.5">{statusLabel[c.status]} · {formatRupiah(c.currentAmount)} terkumpul</p>
                    </div>
                    <div className="w-2 h-2 rounded-full" style={{ background: statusColor[c.status] }}/>
                  </div>
                ))
              )}
            </div>
          </section>

        </div>
      </main>

      {/* ── Modals ── */}
      {showCreate && (
        <CampaignModal
          mode="create"
          onClose={() => setShowCreate(false)}
          onSuccess={() => { setShowCreate(false); fetchCampaigns(); }}
        />
      )}
      {editTarget && (
        <CampaignModal
          mode="edit"
          initial={editTarget}
          onClose={() => setEditTarget(null)}
          onSuccess={() => { setEditTarget(null); fetchCampaigns(); }}
        />
      )}
      {deleteTarget && (
        <DeleteModal
          campaign={deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onSuccess={() => { setDeleteTarget(null); fetchCampaigns(); }}
        />
      )}
    </div>
  );
}