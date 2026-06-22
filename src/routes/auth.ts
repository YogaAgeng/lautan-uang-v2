import { Router, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../db';

const router = Router();

// POST /api/auth/register
router.post('/register', async (req: Request, res: Response): Promise<void> => {
  const { email, password, role } = req.body;

  // Validasi field wajib (Kesalahan #5 — edge case: field kosong)
  if (!email || !password || !role) {
    res.status(400).json({ message: 'Email, password, dan role wajib diisi.' });
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

    res.status(201).json({ id: newUser.id, email: newUser.email, role: newUser.role });
  } catch (error) {
    res.status(500).json({ message: 'Terjadi kesalahan server.' });
  }
});

// POST /api/auth/login
router.post('/login', async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  // Validasi field wajib (Kesalahan #5 — edge case: field kosong)
  if (!email || !password) {
    res.status(400).json({ message: 'Email dan password wajib diisi.' });
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

    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Terjadi kesalahan server.' });
  }
});

export default router;
