import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'node:fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { apiRouter } from './server/routes.ts';
import { sqliteDb } from './server/sqlite.ts';
import { JWT_SECRET, hashToken } from './server/auth.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  // Increase payload limit for base64 canvas export
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

  // API router
  app.use('/api', apiRouter);

  // 1. PUBLIC CULTURAL ASSETS: Open to all visitors
  app.use('/assets/costumes', express.static(path.resolve(__dirname, 'public/assets/costumes')));
  app.use('/assets/events', express.static(path.resolve(__dirname, 'public/assets/events')));
  app.use('/assets/backgrounds', express.static(path.resolve(__dirname, 'public/assets/backgrounds')));

  // 2. PRIVATE USER AI CREATIONS: Strictly protected by token authentication & ownership
  app.get('/assets/results/:filename', (req, res) => {
    const filename = req.params.filename;
    if (!filename || filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
      return res.status(400).json({ success: false, error: 'Tên tệp không hợp lệ.' });
    }

    // Extract auth token from Authorization header or query param
    let token: string | null = null;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7).trim();
    } else if (typeof req.query.token === 'string' && req.query.token.trim()) {
      token = req.query.token.trim();
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Ảnh này thuộc tủ đồ riêng tư. Vui lòng đăng nhập để xem ảnh.'
      });
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      const tokenHash = hashToken(token);
      if (!sqliteDb.isSessionActive(tokenHash)) {
        return res.status(401).json({
          success: false,
          error: 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.'
        });
      }

      // Verify ownership: Is this image owned by the user?
      const job = sqliteDb.getAIJobByResultFilename(filename);
      if (job && job.userId !== decoded.userId && decoded.role !== 'admin') {
        return res.status(403).json({
          success: false,
          error: 'Quyền truy cập bị từ chối: Ảnh thuộc tủ đồ riêng của người dùng khác.'
        });
      }

      const filePath = path.resolve(__dirname, 'public/assets/results', filename);
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ success: false, error: 'Không tìm thấy tệp ảnh.' });
      }

      res.sendFile(filePath);
    } catch {
      return res.status(401).json({
        success: false,
        error: 'Mã xác thực không hợp lệ để xem ảnh riêng tư.'
      });
    }
  });

  // Default fallback for any other general public assets (excluding results)
  app.use('/assets', (req, res, next) => {
    if (req.path.startsWith('/results')) {
      return res.status(401).json({ success: false, error: 'Ảnh riêng tư yêu cầu xác thực.' });
    }
    express.static(path.resolve(__dirname, 'public/assets'))(req, res, next);
  });

  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: false,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get('*', (_req, res) => {
        res.sendFile(path.resolve(distPath, 'index.html'));
      });
    } else {
      const vite = await createViteServer({
        server: { middlewareMode: true, hmr: false },
        appType: 'spa',
      });
      app.use(vite.middlewares);
    }
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Việt Phục Remix server running on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Fatal error starting server:', err);
  process.exit(1);
});
