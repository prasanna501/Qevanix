import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { ENV } from './config/env';
import { checkDatabaseConnection } from './config/prisma';
import { apiRouter } from './routes';
import { errorHandler } from './middleware/errorHandler';

const app = express();

// Security & Parsing Middleware
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(
  cors({
    origin: [ENV.CLIENT_URL, 'http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:3000'],
    credentials: true,
  })
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

if (ENV.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Serve public static folder (for sample resume PDF, badges, etc.)
const publicDir = path.resolve(__dirname, '../../public');
app.use('/public', express.static(publicDir));

// System Health Check Endpoint
app.get('/api/health', async (_req, res) => {
  const dbStatus = await checkDatabaseConnection();
  res.status(dbStatus.connected ? 200 : 503).json({
    status: dbStatus.connected ? 'healthy' : 'degraded',
    service: 'Qevanix Portfolio API',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    database: {
      provider: 'PostgreSQL',
      status: dbStatus.connected ? 'connected' : 'disconnected',
      details: dbStatus.message,
    },
    version: '1.0.0',
  });
});

// Mount Main API Routes
app.use('/api', apiRouter);

// Centralized Error Handling Middleware
app.use(errorHandler);

// Start Server
if (process.env.NODE_ENV !== 'test') {
  app.listen(ENV.PORT, async () => {
    console.log(`\n======================================================`);
    console.log(`🚀 QEVANIX BACKEND SERVER RUNNING ON PORT: ${ENV.PORT}`);
    console.log(`🌐 Health check: http://localhost:${ENV.PORT}/api/health`);
    console.log(`📡 API Base:     http://localhost:${ENV.PORT}/api`);
    console.log(`======================================================\n`);

    const db = await checkDatabaseConnection();
    if (db.connected) {
      console.log('✅ PostgreSQL database connection verified.');
    } else {
      console.warn('⚠️ Warning: Database connection failed on startup. Verify PostgreSQL credentials.');
    }
  });
}

export default app;
