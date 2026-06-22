import express from 'express';
import authRouter from './routes/auth';

const app = express();
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'success' });
});

// Auth routes: /api/auth/register, /api/auth/login
app.use('/api/auth', authRouter);

export default app;