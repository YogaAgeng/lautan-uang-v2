import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import Auth from './pages/Auth';
import NelayanDashboard from './pages/NelayanDashboard';
import InvestorDashboard from './pages/InvestorDashboard';

// ─── ProtectedRoute ────────────────────────────────────────────────────────────
// Menjaga rute terproteksi dari akses tanpa autentikasi.
// Jika token tidak ada di localStorage → redirect ke /auth.
// Jika requiredRole diisi → pastikan role user cocok, jika tidak → redirect ke /auth.
function ProtectedRoute({
  children,
  requiredRole,
}: {
  children: ReactNode;
  requiredRole?: 'NELAYAN' | 'INVESTOR';
}) {
  const token = localStorage.getItem('token');
  const role  = localStorage.getItem('role');

  // Tidak ada token → belum login
  if (!token) {
    return <Navigate to="/auth" replace />;
  }

  // Role tidak sesuai (misalnya investor coba akses /nelayan)
  if (requiredRole && role !== requiredRole) {
    // Arahkan ke dashboard yang sesuai dengan role-nya
    const correctPath = role === 'NELAYAN' ? '/nelayan' : '/investor';
    return <Navigate to={correctPath} replace />;
  }

  return <>{children}</>;
}

// ─── App ───────────────────────────────────────────────────────────────────────
function App() {
  return (
    <Router>
      <Routes>
        {/* Redirect root ke auth */}
        <Route path="/" element={<Navigate to="/auth" replace />} />

        {/* Halaman publik — hanya bisa diakses jika BELUM login */}
        <Route path="/auth" element={<Auth />} />

        {/* Halaman terproteksi — wajib login + role sesuai */}
        <Route
          path="/nelayan"
          element={
            <ProtectedRoute requiredRole="NELAYAN">
              <NelayanDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/investor"
          element={
            <ProtectedRoute requiredRole="INVESTOR">
              <InvestorDashboard />
            </ProtectedRoute>
          }
        />

        {/* Fallback: semua route tidak dikenal → auth */}
        <Route path="*" element={<Navigate to="/auth" replace />} />
      </Routes>
    </Router>
  );
}

export default App;