import express from 'express';

const app = express();
app.use(express.json());

// Implementasi rute untuk memuaskan tes
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'success' });
});

export default app;