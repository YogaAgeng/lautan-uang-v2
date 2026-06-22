import request from 'supertest';
import app from '../app';
import prisma from '../db';

let nelayantToken: string;
let investorToken: string;
let investor2Token: string;
let campaignId: number;

const TARGET_AMOUNT = 1_000_000; // 1 juta IDR

beforeAll(async () => {
  // Bersihkan semua data
  await prisma.transaction.deleteMany();
  await prisma.campaign.deleteMany();
  await prisma.user.deleteMany();

  // 1. Injeksi User Langsung via Prisma
  const nelayan = await prisma.user.create({ data: { email: 'nelayan@inv-test.com', password: 'hash', role: 'NELAYAN' } });
  const inv1 = await prisma.user.create({ data: { email: 'investor1@inv-test.com', password: 'hash', role: 'INVESTOR' } });
  const inv2 = await prisma.user.create({ data: { email: 'investor2@inv-test.com', password: 'hash', role: 'INVESTOR' } });

  // 2. Generate Token Manual
  const jwt = require('jsonwebtoken');
  nelayantToken = jwt.sign({ id: nelayan.id, role: nelayan.role }, process.env.JWT_SECRET as string);
  investorToken = jwt.sign({ id: inv1.id, role: inv1.role }, process.env.JWT_SECRET as string);
  investor2Token = jwt.sign({ id: inv2.id, role: inv2.role }, process.env.JWT_SECRET as string);

  // 3. Injeksi Kampanye Utama Langsung via Prisma
  const campaign = await prisma.campaign.create({
    data: {
      title: 'Kampanye Uji Race Condition',
      description: 'Untuk menguji Optimistic Locking.',
      targetAmount: 1000000n, // Wajib menggunakan akhiran 'n' untuk tipe BigInt
      userId: nelayan.id,
    }
  });
  campaignId = campaign.id;
});

afterAll(async () => {
  await prisma.transaction.deleteMany();
  await prisma.campaign.deleteMany();
  await prisma.user.deleteMany();
  await prisma.$disconnect();
});

describe('Investment API (Optimistic Locking & Race Condition)', () => {
  // ─── Kontrol Akses ─────────────────────────────────────────────────────────

  it('seharusnya menolak investasi tanpa token (401)', async () => {
    const res = await request(app).post(`/api/campaigns/${campaignId}/invest`).send({ amount: 100000 });
    expect(res.status).toBe(401);
  });

  it('seharusnya menolak investasi oleh NELAYAN (403)', async () => {
    const res = await request(app)
      .post(`/api/campaigns/${campaignId}/invest`)
      .set('Authorization', `Bearer ${nelayantToken}`)
      .send({ amount: 100000 });
    expect(res.status).toBe(403);
  });

  it('seharusnya menolak investasi dengan amount tidak valid (400)', async () => {
    const res = await request(app)
      .post(`/api/campaigns/${campaignId}/invest`)
      .set('Authorization', `Bearer ${investorToken}`)
      .send({ amount: -5000 });
    expect(res.status).toBe(400);
  });

  it('seharusnya menolak investasi ke kampanye yang tidak ada (404)', async () => {
    const res = await request(app)
      .post('/api/campaigns/99999/invest')
      .set('Authorization', `Bearer ${investorToken}`)
      .send({ amount: 100000 });
    expect(res.status).toBe(404);
  });

  // ─── Happy Path ────────────────────────────────────────────────────────────

  it('seharusnya berhasil melakukan investasi dan mencatat transaksi (200)', async () => {
    const res = await request(app)
      .post(`/api/campaigns/${campaignId}/invest`)
      .set('Authorization', `Bearer ${investorToken}`)
      .send({ amount: 300000 });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('transaction');
    expect(res.body).toHaveProperty('campaign');
    expect(res.body.transaction.amount).toBe('300000');
    expect(res.body.campaign.currentAmount).toBe('300000');
    expect(res.body.campaign.version).toBe(1); // version meningkat dari 0 ke 1
    expect(res.body.campaign.status).toBe('ACTIVE');
  });

  it('seharusnya menolak investasi yang melebihi targetAmount (400)', async () => {
    // currentAmount sekarang 300000, target 1000000, sisa 700000
    const res = await request(app)
      .post(`/api/campaigns/${campaignId}/invest`)
      .set('Authorization', `Bearer ${investorToken}`)
      .send({ amount: 800000 }); // 300000 + 800000 = 1100000 > 1000000
    expect(res.status).toBe(400);
    expect(res.body.message).toContain('melebihi target');
  });

  it('seharusnya mengubah status kampanye menjadi FUNDED saat fully funded', async () => {
    // currentAmount = 300000, perlu 700000 lagi untuk mencapai target
    const res = await request(app)
      .post(`/api/campaigns/${campaignId}/invest`)
      .set('Authorization', `Bearer ${investor2Token}`)
      .send({ amount: 700000 });

    expect(res.status).toBe(200);
    expect(res.body.campaign.status).toBe('FUNDED');
    expect(res.body.campaign.currentAmount).toBe('1000000');
  });

  it('seharusnya menolak investasi ke kampanye yang sudah FUNDED (400)', async () => {
    const res = await request(app)
      .post(`/api/campaigns/${campaignId}/invest`)
      .set('Authorization', `Bearer ${investorToken}`)
      .send({ amount: 1 });
    expect(res.status).toBe(400);
    expect(res.body.message).toContain('Kampanye sudah tidak aktif');
  });

  // ─── Uji Riwayat Transaksi ─────────────────────────────────────────────────

  it('seharusnya mengembalikan riwayat transaksi kampanye', async () => {
    const res = await request(app)
      .get(`/api/campaigns/${campaignId}/transactions`)
      .set('Authorization', `Bearer ${investorToken}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(2); // 2 transaksi berhasil (300000 + 700000)
  });

  // ─── Uji Race Condition (INTI) ─────────────────────────────────────────────
  //
  // Skenario: Buat kampanye baru target 1 juta, kirim 5 investasi concurrent
  // sebesar 500.000 masing-masing (total 2,5 juta jika tidak ada perlindungan).
  // Tanpa Optimistic Locking, database bisa menerima semua → OVERFUND.
  // Dengan Optimistic Locking, hanya 2 yang bisa sukses (= 1 juta persis).
  //
  it('seharusnya mencegah overfunding saat 5 investasi bersamaan (Race Condition)', async () => {
    // Setup: buat kampanye baru target 1 juta
    const nelayan = await prisma.user.findFirst({ where: { role: 'NELAYAN' } });
    const raceCampaign = await prisma.campaign.create({
      data: {
        title: 'Kampanye Race Condition Test',
        description: 'Target 1 juta, 5 investor concurrent.',
        targetAmount: 1000000n,
        userId: nelayan!.id,
      }
    });
    const raceCampaignId = raceCampaign.id;

    // Fire 5 request concurrent — masing-masing 500.000
    const concurrentRequests = Array.from({ length: 5 }, () =>
      request(app)
        .post(`/api/campaigns/${raceCampaignId}/invest`)
        .set('Authorization', `Bearer ${investorToken}`)
        .send({ amount: 500_000 })
    );

    const results = await Promise.all(concurrentRequests);

    const succeeded = results.filter((r) => r.status === 200);
    const conflicted = results.filter((r) => r.status === 409); // Optimistic Lock konflik
    const overfunded = results.filter((r) => r.status === 400);

    console.log(`Race result: ${succeeded.length} sukses, ${conflicted.length} konflik, ${overfunded.length} ditolak`);

    // Invariant 1: Total investasi tidak melebihi target
    const finalCampaign = await prisma.campaign.findUnique({ where: { id: raceCampaignId } });
    const finalAmount = Number(finalCampaign!.currentAmount);

    expect(finalAmount).toBeLessThanOrEqual(1_000_000);
    expect(finalAmount).toBeGreaterThan(0);

    // Invariant 2: Tidak mungkin > 2 investasi 500rb berhasil (karena target 1 juta)
    expect(succeeded.length).toBeLessThanOrEqual(2);

    // Invariant 3: Semua request harus mendapat response yang terdefinisi
    expect(succeeded.length + conflicted.length + overfunded.length).toBe(5);

    // Invariant 4: Tidak ada state FUNDED palsu — jika funded, amount harus = target
    if (finalCampaign!.status === 'FUNDED') {
      expect(finalAmount).toBe(1_000_000);
    }
  }, 30000); // timeout 30 detik untuk concurrent test
});
