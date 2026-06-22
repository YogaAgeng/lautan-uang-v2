import request from 'supertest';
import app from '../app';
import prisma from '../db';

let nelayantToken: string;
let investorToken: string;
let campaignId: number;

// Setup: bersihkan DB, registrasi dua user, login untuk dapatkan token
beforeAll(async () => {
  await prisma.campaign.deleteMany();
  await prisma.user.deleteMany();

  // Registrasi NELAYAN
  await request(app).post('/api/auth/register').send({
    email: 'nelayan@test.com',
    password: 'password123',
    role: 'NELAYAN',
  });

  // Registrasi INVESTOR
  await request(app).post('/api/auth/register').send({
    email: 'investor@test.com',
    password: 'password123',
    role: 'INVESTOR',
  });

  // Login untuk dapatkan token
  const nelayantRes = await request(app).post('/api/auth/login').send({
    email: 'nelayan@test.com',
    password: 'password123',
  });
  nelayantToken = nelayantRes.body.token;

  const investorRes = await request(app).post('/api/auth/login').send({
    email: 'investor@test.com',
    password: 'password123',
  });
  investorToken = investorRes.body.token;
});

afterAll(async () => {
  await prisma.campaign.deleteMany();
  await prisma.user.deleteMany();
  await prisma.$disconnect();
});

describe('Campaign API (CRUD)', () => {
  // ─── Proteksi JWT ──────────────────────────────────────────────────────────

  it('seharusnya menolak akses tanpa token (401)', async () => {
    const res = await request(app).get('/api/campaigns');
    expect(res.status).toBe(401);
  });

  // ─── POST /api/campaigns ───────────────────────────────────────────────────

  it('seharusnya berhasil membuat kampanye oleh NELAYAN (201)', async () => {
    const res = await request(app)
      .post('/api/campaigns')
      .set('Authorization', `Bearer ${nelayantToken}`)
      .send({
        title: 'Pengadaan Kapal Motor 40PK',
        description: 'Dana untuk membeli kapal motor baru.',
        targetAmount: 50000000,
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.title).toBe('Pengadaan Kapal Motor 40PK');
    expect(res.body.status).toBe('ACTIVE');
    campaignId = res.body.id;
  });

  it('seharusnya menolak pembuatan kampanye oleh INVESTOR (403)', async () => {
    const res = await request(app)
      .post('/api/campaigns')
      .set('Authorization', `Bearer ${investorToken}`)
      .send({
        title: 'Kampanye Investor',
        description: 'Tidak boleh dibuat investor.',
        targetAmount: 10000000,
      });
    expect(res.status).toBe(403);
  });

  it('seharusnya menolak kampanye dengan field tidak lengkap (400)', async () => {
    const res = await request(app)
      .post('/api/campaigns')
      .set('Authorization', `Bearer ${nelayantToken}`)
      .send({ title: 'Tanpa target amount' });
    expect(res.status).toBe(400);
  });

  // ─── GET /api/campaigns ────────────────────────────────────────────────────

  it('seharusnya mengembalikan daftar kampanye aktif (200)', async () => {
    const res = await request(app)
      .get('/api/campaigns')
      .set('Authorization', `Bearer ${investorToken}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  // ─── GET /api/campaigns/:id ────────────────────────────────────────────────

  it('seharusnya mengembalikan detail kampanye berdasarkan ID (200)', async () => {
    const res = await request(app)
      .get(`/api/campaigns/${campaignId}`)
      .set('Authorization', `Bearer ${investorToken}`);

    expect(res.status).toBe(200);
    expect(res.body.id).toBe(campaignId);
  });

  it('seharusnya mengembalikan 404 jika kampanye tidak ditemukan', async () => {
    const res = await request(app)
      .get('/api/campaigns/99999')
      .set('Authorization', `Bearer ${investorToken}`);

    expect(res.status).toBe(404);
  });

  // ─── PUT /api/campaigns/:id ────────────────────────────────────────────────

  it('seharusnya berhasil mengupdate kampanye oleh pemiliknya (200)', async () => {
    const res = await request(app)
      .put(`/api/campaigns/${campaignId}`)
      .set('Authorization', `Bearer ${nelayantToken}`)
      .send({ title: 'Kapal Motor Diperbarui', status: 'FUNDED' });

    expect(res.status).toBe(200);
    expect(res.body.title).toBe('Kapal Motor Diperbarui');
    expect(res.body.status).toBe('FUNDED');
  });

  it('seharusnya menolak update kampanye oleh user lain (403)', async () => {
    const res = await request(app)
      .put(`/api/campaigns/${campaignId}`)
      .set('Authorization', `Bearer ${investorToken}`)
      .send({ title: 'Diubah Investor' });

    expect(res.status).toBe(403);
  });

  // ─── DELETE /api/campaigns/:id ─────────────────────────────────────────────

  it('seharusnya berhasil menghapus kampanye oleh pemiliknya (200)', async () => {
    const res = await request(app)
      .delete(`/api/campaigns/${campaignId}`)
      .set('Authorization', `Bearer ${nelayantToken}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('message');
  });

  it('seharusnya mengembalikan 404 setelah kampanye dihapus', async () => {
    const res = await request(app)
      .get(`/api/campaigns/${campaignId}`)
      .set('Authorization', `Bearer ${investorToken}`);

    expect(res.status).toBe(404);
  });
});
