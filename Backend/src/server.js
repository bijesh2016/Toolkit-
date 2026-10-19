import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './swagger/swagger.js';

import nepalRoutes from './routes/nepal.js';
import toolsRoutes from './routes/tools.js';
import inspectRoutes from './routes/inspect.js';
import aiRoutes from './routes/ai.js';
import authRoutes from './routes/auth.js';
import tempMailRoutes from './routes/tempMail.js';
import mediaDownloaderRoutes from './routes/mediaDownloader.js';
import playlistDownloaderRoutes from './routes/playlistDownloader.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security & Headers
app.use(helmet({
  contentSecurityPolicy: false, // Disabled for inline Swagger UI assets
  crossOriginEmbedderPolicy: false
}));

// CORS Configuration
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key']
}));

// Request parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging
app.use(morgan('dev'));

// General Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // Limit each IP to 300 requests per 15 min
  message: { success: false, error: 'Too many requests from this IP, please try again later.' }
});
app.use('/api/', limiter);

// Swagger Documentation UI
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customSiteTitle: 'Bijesh Tools Hub - Swagger API Docs',
  customCss: '.swagger-ui .topbar { display: none } body { background-color: #0f172a; color: #f8fafc; } .swagger-ui { filter: invert(88%) hue-rotate(180deg); }'
}));

// Raw Swagger JSON endpoint
app.get('/api/docs/json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: System Health & Status check
 *     tags: [System]
 *     responses:
 *       200:
 *         description: API is operational
 */
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    platform: 'Bijesh Tools Hub (bijeshsharam.com.np)',
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0',
    services: {
      nepalSuite: 'active',
      ssrfProtectedInspector: 'active',
      developerUtilities: 'active',
      aiMiniAssistant: 'active',
      swaggerDocs: 'active at /api/docs'
    }
  });
});

// Mount Routes
app.use('/api/nepal', nepalRoutes);
app.use('/api/tools', toolsRoutes);
app.use('/api/tools', inspectRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/tools/temp-mail', tempMailRoutes);
app.use('/api/tools/media-downloader', mediaDownloaderRoutes);
app.use('/api/tools/playlist-downloader', playlistDownloaderRoutes);

// Root Index
app.get('/', (req, res) => {
  res.json({
    name: 'Bijesh Tools Hub API Engine',
    website: 'https://bijeshsharam.com.np',
    documentation: `http://localhost:${PORT}/api/docs`,
    message: 'Welcome to the backend API services for Free Online Tools Hub.'
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: `Endpoint not found: ${req.method} ${req.originalUrl}`,
    docs: '/api/docs'
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Error Handler]', err);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal Server Error'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Bijesh Tools Hub Backend running at http://localhost:${PORT}`);
  console.log(`📖 Swagger API Docs available at http://localhost:${PORT}/api/docs`);
});
