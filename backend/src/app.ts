import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes';
import { errorHandler } from './middleware/errorHandler';

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

// API routes
app.use('/api/auth', authRoutes);

// Centralized error handler — MUST be registered after all routes.
// Express identifies it by the 4-parameter (err, req, res, next) signature.
app.use(errorHandler);

export default app;
