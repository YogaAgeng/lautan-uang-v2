import express from 'express';
import rateLimit from 'express-rate-limit';
import authRouter from './routes/auth';
import campaignRouter from './routes/campaign';
import investmentRouter from './routes/investment';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';
import cors from 'cors';

const app = express();
const swaggerDocument = YAML.load(path.resolve(__dirname, '../swagger.yaml'));

// Rate limiter khusus untuk endpoint autentikasi
// Mencegah brute-force: maks 10 percobaan per 15 menit per IP
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 menit
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Terlalu banyak percobaan. Coba lagi dalam 15 menit.' },
  // Eksekusi pelepasan limitasi khusus untuk Jest
  skip: () => process.env.NODE_ENV === 'test'
});

app.use(cors());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'success' });
});

// Auth routes — dilindungi rate limiter
app.use('/api/auth', authLimiter, authRouter);

// Campaign routes — dilindungi JWT (di dalam router)
app.use('/api/campaigns', campaignRouter);

// Investment routes — nested di bawah campaigns, mergeParams aktif di router
// POST /api/campaigns/:id/invest
// GET  /api/campaigns/:id/transactions
app.use('/api/campaigns', investmentRouter);

export default app;

