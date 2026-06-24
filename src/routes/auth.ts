import { Router, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../db';

const router = Router();

// ─── Helpers Validasi ──────────────────────────────────────────────────────────
// Regex email standar RFC 5322 (simplified — menangkap 99.9% kasus nyata)
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 8;

// POST /api/auth/register
router.post('/register', async (req: Request, res: Response): Promise<void> => {
  const { email, password, role } = req.body;

  // Validasi field wajib
  if (!email || !password || !role) {
    res.status(400).json({ message: 'Email, password, dan role wajib diisi.' });
    return;
  }

  // Validasi format email (BUG-04)
  if (!EMAIL_REGEX.test(email)) {
    res.status(400).json({ message: 'Format email tidak valid.' });
    return;
  }

  // Validasi panjang password minimum (BUG-03)
  if (password.length < MIN_PASSWORD_LENGTH) {
    res.status(400).json({ message: `Password minimal ${MIN_PASSWORD_LENGTH} karakter.` });
    return;
  }

  // Validasi nilai role
  if (role !== 'INVESTOR' && role !== 'NELAYAN') {
    res.status(400).json({ message: 'Role harus INVESTOR atau NELAYAN.' });
    return;
  }

  try {
    // Cek duplikasi email (Kesalahan #5 — edge case: email duplikat → 409)
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      res.status(409).json({ message: 'Email sudah terdaftar.' });
      return;
    }

    // Hash password sebelum disimpan ke DB
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: { email, password: hashedPassword, role },
    });

    // Langsung issue token agar frontend bisa auto-login setelah registrasi
    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, role: newUser.role },
      process.env.JWT_SECRET as string,
      { expiresIn: '1d' }
    );

    res.status(201).json({ token, user: { id: newUser.id, email: newUser.email, role: newUser.role } });
  } catch (error) {
    res.status(500).json({ message: 'Terjadi kesalahan server.' });
  }
});

// POST /api/auth/login
router.post('/login', async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  // Validasi field wajib
  if (!email || !password) {
    res.status(400).json({ message: 'Email dan password wajib diisi.' });
    return;
  }

  // Validasi format email (BUG-04) — tolak sebelum hit database
  if (!EMAIL_REGEX.test(email)) {
    res.status(400).json({ message: 'Format email tidak valid.' });
    return;
  }

  // Validasi panjang password (BUG-03) — early reject sebelum bcrypt compare
  if (password.length < MIN_PASSWORD_LENGTH) {
    res.status(400).json({ message: `Password minimal ${MIN_PASSWORD_LENGTH} karakter.` });
    return;
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    // User tidak ditemukan atau password salah → respon sama untuk keamanan
    // (Kesalahan #5 — edge case: password salah → 401)
    if (!user || !(await bcrypt.compare(password, user.password))) {
      res.status(401).json({ message: 'Email atau password salah.' });
      return;
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: '1d' }
    );

    res.status(200).json({ token, user: { id: user.id, email: user.email, role: user.role } });
  } catch (error) {
    res.status(500).json({ message: 'Terjadi kesalahan server.' });
  }
});

export default router;
