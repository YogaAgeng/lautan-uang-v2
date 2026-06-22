import { Router, Response } from 'express';
import prisma from '../db';
import { authenticateToken, AuthRequest } from '../middleware/authMiddleware';

const router = Router();

// Semua route kampanye membutuhkan JWT yang valid
router.use(authenticateToken);

// ─── Helper: serialisasi BigInt ke string agar JSON.stringify tidak crash ───
function serializeCampaign(campaign: any) {
  return {
    ...campaign,
    targetAmount:  campaign.targetAmount.toString(),
    currentAmount: campaign.currentAmount.toString(),
  };
}

// ─── POST /api/campaigns ─────────────────────────────────────────────────────
// Membuat kampanye baru. Hanya role NELAYAN yang diizinkan.
router.post('/', async (req: AuthRequest, res: Response): Promise<void> => {
  const { role, id: userId } = req.user;

  if (role !== 'NELAYAN') {
    res.status(403).json({ message: 'Hanya Nelayan yang dapat membuat kampanye.' });
    return;
  }

  const { title, description, targetAmount } = req.body;

  if (!title || !description || !targetAmount) {
    res.status(400).json({ message: 'title, description, dan targetAmount wajib diisi.' });
    return;
  }

  if (isNaN(Number(targetAmount)) || Number(targetAmount) <= 0) {
    res.status(400).json({ message: 'targetAmount harus berupa angka positif.' });
    return;
  }

  try {
    const campaign = await prisma.campaign.create({
      data: {
        title,
        description,
        targetAmount: BigInt(targetAmount),
        userId,
      },
    });
    res.status(201).json(serializeCampaign(campaign));
  } catch (error) {
    res.status(500).json({ message: 'Terjadi kesalahan server.' });
  }
});

// ─── GET /api/campaigns ──────────────────────────────────────────────────────
// Daftar semua kampanye yang ACTIVE. Dapat diakses oleh semua role terautentikasi.
router.get('/', async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const campaigns = await prisma.campaign.findMany({
      where: { status: 'ACTIVE' },
      include: {
        user: { select: { id: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.status(200).json(campaigns.map(serializeCampaign));
  } catch (error) {
    res.status(500).json({ message: 'Terjadi kesalahan server.' });
  }
});

// ─── GET /api/campaigns/:id ──────────────────────────────────────────────────
// Detail satu kampanye berdasarkan ID.
router.get('/:id', async (req: AuthRequest, res: Response): Promise<void> => {
  const id = parseInt(String(req.params.id));

  if (isNaN(id)) {
    res.status(400).json({ message: 'ID kampanye tidak valid.' });
    return;
  }

  try {
    const campaign = await prisma.campaign.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, email: true } },
      },
    });

    if (!campaign) {
      res.status(404).json({ message: 'Kampanye tidak ditemukan.' });
      return;
    }

    res.status(200).json(serializeCampaign(campaign));
  } catch (error) {
    res.status(500).json({ message: 'Terjadi kesalahan server.' });
  }
});

// ─── PUT /api/campaigns/:id ──────────────────────────────────────────────────
// Update kampanye. Hanya pemilik kampanye (NELAYAN) yang bisa mengubah.
router.put('/:id', async (req: AuthRequest, res: Response): Promise<void> => {
  const { role, id: userId } = req.user;
  const campaignId = parseInt(String(req.params.id));

  if (role !== 'NELAYAN') {
    res.status(403).json({ message: 'Hanya Nelayan yang dapat mengubah kampanye.' });
    return;
  }

  if (isNaN(campaignId)) {
    res.status(400).json({ message: 'ID kampanye tidak valid.' });
    return;
  }

  try {
    const existing = await prisma.campaign.findUnique({ where: { id: campaignId } });

    if (!existing) {
      res.status(404).json({ message: 'Kampanye tidak ditemukan.' });
      return;
    }

    if (existing.userId !== userId) {
      res.status(403).json({ message: 'Anda tidak memiliki akses untuk mengubah kampanye ini.' });
      return;
    }

    const { title, description, targetAmount, status } = req.body;

    const validStatuses = ['ACTIVE', 'FUNDED', 'CLOSED'];
    if (status && !validStatuses.includes(status)) {
      res.status(400).json({ message: `Status tidak valid. Pilihan: ${validStatuses.join(', ')}` });
      return;
    }

    const updated = await prisma.campaign.update({
      where: { id: campaignId },
      data: {
        ...(title       && { title }),
        ...(description && { description }),
        ...(targetAmount && { targetAmount: BigInt(targetAmount) }),
        ...(status      && { status }),
      },
    });

    res.status(200).json(serializeCampaign(updated));
  } catch (error) {
    res.status(500).json({ message: 'Terjadi kesalahan server.' });
  }
});

// ─── DELETE /api/campaigns/:id ───────────────────────────────────────────────
// Hapus kampanye. Hanya pemilik yang bisa menghapus dan hanya jika status ACTIVE.
router.delete('/:id', async (req: AuthRequest, res: Response): Promise<void> => {
  const { role, id: userId } = req.user;
  const campaignId = parseInt(String(req.params.id));

  if (role !== 'NELAYAN') {
    res.status(403).json({ message: 'Hanya Nelayan yang dapat menghapus kampanye.' });
    return;
  }

  if (isNaN(campaignId)) {
    res.status(400).json({ message: 'ID kampanye tidak valid.' });
    return;
  }

  try {
    const existing = await prisma.campaign.findUnique({ where: { id: campaignId } });

    if (!existing) {
      res.status(404).json({ message: 'Kampanye tidak ditemukan.' });
      return;
    }

    if (existing.userId !== userId) {
      res.status(403).json({ message: 'Anda tidak memiliki akses untuk menghapus kampanye ini.' });
      return;
    }

    await prisma.campaign.delete({ where: { id: campaignId } });
    res.status(200).json({ message: 'Kampanye berhasil dihapus.' });
  } catch (error) {
    res.status(500).json({ message: 'Terjadi kesalahan server.' });
  }
});

export default router;
