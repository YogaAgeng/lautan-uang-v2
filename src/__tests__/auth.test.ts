import request from 'supertest';
import app from '../app';
import prisma from '../db';

// Membersihkan data user sebelum tes berjalan
beforeAll(async () => {
  await prisma.user.deleteMany();
});

// Menutup koneksi database setelah semua tes selesai
afterAll(async () => {
  await prisma.$disconnect();
});

describe('Auth API (Register & Login)', () => {
  // ─── Happy Path ────────────────────────────────────────────────────────────

  it('seharusnya berhasil mendaftarkan user baru (Investor)', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'investor@test.com',
        password: 'password123',
        role: 'INVESTOR'
      });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('token');
    expect(res.body).toHaveProperty('user');
    expect(res.body.user.email).toBe('investor@test.com');
  });

  it('seharusnya berhasil login dan mengembalikan JWT token', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'investor@test.com',
        password: 'password123'
      });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
  });

  // ─── Edge Cases (Kesalahan #5) ─────────────────────────────────────────────

  it('seharusnya menolak registrasi dengan email yang sudah terdaftar (409)', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'investor@test.com', // email sudah ada dari tes pertama
        password: 'password_lain',
        role: 'INVESTOR'
      });
    expect(res.status).toBe(409);
    expect(res.body).toHaveProperty('message');
  });

  it('seharusnya menolak login dengan password yang salah (401)', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'investor@test.com',
        password: 'password_salah'
      });
    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('message');
  });

  it('seharusnya menolak registrasi jika field tidak lengkap (400)', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'tanpa_password@test.com'
        // password & role tidak dikirim
      });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('message');
  });
});