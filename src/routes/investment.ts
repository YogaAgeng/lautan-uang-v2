import { Router, Response } from 'express';
import prisma from '../db';
import { authenticateToken, AuthRequest } from '../middleware/authMiddleware';

const router = Router();

// Helper serialisasi BigInt
function serializeData(data: any) {
  return JSON.parse(
    JSON.stringify(data, (_, value) => (typeof value === 'bigint' ? value.toString() : value))
  );
}

router.post('/:id/invest', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  const { role, id: userId } = req.user;
  const campaignId = parseInt(String(req.params.id));
  
  // Validasi format angka untuk mencegah crash BigInt parsing
  if (isNaN(Number(req.body.amount)) || Number(req.body.amount) <= 0) {
    res.status(400).json({ message: 'Amount tidak valid.' });
    return;
  }
  const amount = BigInt(req.body.amount);

  if (role !== 'INVESTOR') {
    res.status(403).json({ message: 'Hanya Investor yang dapat mendanai kampanye.' });
    return;
  }

  if (isNaN(campaignId)) {
    res.status(400).json({ message: 'ID kampanye tidak valid.' });
    return;
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      // 1. Baca state kampanye saat ini (Target: Version N)
      const campaign = await tx.campaign.findUnique({ where: { id: campaignId } });

      if (!campaign) throw new Error('NOT_FOUND');
      if (campaign.status !== 'ACTIVE') throw new Error('NOT_ACTIVE');
      if (campaign.currentAmount + amount > campaign.targetAmount) throw new Error('OVERFUNDING');

      // 2. Eksekusi Optimistic Lock menggunakan updateMany
      const updateResult = await tx.campaign.updateMany({
        where: {
          id: campaignId,
          version: campaign.version, // MUTLAK: Versi harus sama persis dengan saat dibaca
        },
        data: {
          currentAmount: campaign.currentAmount + amount,
          version: campaign.version + 1, // Inkremen versi
          status: (campaign.currentAmount + amount) === campaign.targetAmount ? 'FUNDED' : 'ACTIVE'
        },
      });

      // 3. Validasi Kekalahan Race Condition
      if (updateResult.count === 0) {
        throw new Error('CONFLICT'); // Transaksi digagalkan karena kalah cepat dengan request lain
      }

      // 4. Catat Audit Trail Transaksi
      const transaction = await tx.transaction.create({
        data: { campaignId, userId, amount },
      });

      return {
        transaction,
        campaign: {
          currentAmount: campaign.currentAmount + amount,
          version: campaign.version + 1,
          status: (campaign.currentAmount + amount) === campaign.targetAmount ? 'FUNDED' : 'ACTIVE'
        }
      };
    });

    res.status(200).json(serializeData(result));
  } catch (error: any) {
    if (error.message === 'NOT_FOUND') res.status(404).json({ message: 'Kampanye tidak ditemukan.' });
    else if (error.message === 'NOT_ACTIVE') res.status(400).json({ message: 'Kampanye sudah tidak aktif atau terpenuhi.' });
    else if (error.message === 'OVERFUNDING') res.status(400).json({ message: 'Dana melebihi target kampanye.' });
    else if (error.message === 'CONFLICT') res.status(409).json({ message: 'Tabrakan transaksi (Race Condition). Silakan coba lagi.' });
    else res.status(500).json({ message: 'Terjadi kesalahan server internal.' });
  }
});

router.get('/:id/transactions', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  const campaignId = parseInt(String(req.params.id));
  
  if (isNaN(campaignId)) {
    res.status(400).json({ message: 'ID kampanye tidak valid.' });
    return;
  }

  try {
    const transactions = await prisma.transaction.findMany({
      where: { campaignId },
      include: { user: { select: { email: true, role: true } } },
      orderBy: { createdAt: 'desc' }
    });
    res.status(200).json(serializeData(transactions));
  } catch (error) {
    res.status(500).json({ message: 'Terjadi kesalahan server internal.' });
  }
});

export default router;