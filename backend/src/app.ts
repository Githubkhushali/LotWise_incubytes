import express from 'express';
import cors from 'cors';

const app = express();

// Allow requests from the frontend origin.
// FRONTEND_ORIGIN is set in .env; falls back to the Vite default dev port
// so local development works out of the box without any .env configuration.
app.use(
  cors({
    origin: process.env.FRONTEND_ORIGIN ?? 'http://localhost:5173',
    credentials: true,
  })
);

app.use(express.json());

// Health check endpoint — returns 200 so AWS ALB target-group health checks pass.
app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

export default app;
