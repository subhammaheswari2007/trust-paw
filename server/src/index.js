import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import { getDB, closeDB } from './config/db.js';
import { initTables } from './models/schema.js';

import authRoutes from './routes/auth.js';
import providerRoutes from './routes/providers.js';
import bookingRoutes, { petsRouter } from './routes/bookings.js';

// ─── App setup ──────────────────────────────────────────────────────────────

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Global middleware ──────────────────────────────────────────────────────

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", 'data:', 'https:'],
        connectSrc: ["'self'"],
        fontSrc: ["'self'"],
        objectSrc: ["'none'"],
        frameAncestors: ["'none'"],
      },
    },
  })
);

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json({ limit: '10kb' }));

// ─── Routes ─────────────────────────────────────────────────────────────────

app.get('/api/v1/health', (_req, res) => {
  res.json({ success: true, message: 'TrustPaw API is running 🐾' });
});

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/providers', providerRoutes);
app.use('/api/v1/bookings', bookingRoutes);
app.use('/api/v1/pets', petsRouter);

// ─── 404 handler ────────────────────────────────────────────────────────────

app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// ─── Global error handler ───────────────────────────────────────────────────

// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error('❌ Unhandled error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
  });
});

// ─── Start server ───────────────────────────────────────────────────────────

function start() {
  // Initialise database
  getDB();
  initTables();

  app.listen(PORT, () => {
    console.log(`\n🐾 TrustPaw server running on http://localhost:${PORT}`);
    console.log(`   Environment : ${process.env.NODE_ENV || 'development'}`);
    console.log(`   CORS origin : ${process.env.CORS_ORIGIN || 'http://localhost:5173'}\n`);
  });
}

// ─── Graceful shutdown ──────────────────────────────────────────────────────

process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down gracefully…');
  closeDB();
  process.exit(0);
});

process.on('SIGTERM', () => {
  closeDB();
  process.exit(0);
});

start();
