import { monitor, recordFailure } from './server/monitor.ts';
import { systemStatus } from './server/status.ts';
import 'dotenv/config';
import { sendPreview } from './server/images.ts';
import express from 'express';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { apiRouter } from './server/routes.ts';
import { sqliteDb } from './server/sqlite.ts';
import { requireAuth, type AuthenticatedRequest } from './server/auth.ts';
import { RESULTS_DIR } from './server/storage.ts';

const root = path.dirname(fileURLToPath(import.meta.url));
export async function createApp() {
  const app = express();
  sqliteDb.recoverInterruptedJobs();
  app.disable('x-powered-by');
  app.use((_req, res, next) => { res.setHeader('Referrer-Policy', 'no-referrer'); next(); });
  app.use(express.json({ limit: '12mb' }));
  app.use('/api', (_req, res, next) => { res.setHeader('Cache-Control', 'private, no-store'); next(); });
  app.use('/api', (_req, res, next) => {
    res.once('finish', () => {
      monitor.count('requests');
      if (res.statusCode === 429 || res.locals.expectedLimit) monitor.count('limited');
      else if (res.statusCode >= 500) { monitor.count('errors'); monitor.event('http_server_error','error'); }
    }); next();
  });
  app.use('/api', apiRouter);
  app.use('/api', (_req, res) => { res.status(404).json({ success: false, error: 'Không tìm thấy API.' }); });
  app.get('/healthz', (_req, res) => { res.json({ ok: true }); });

  app.get('/assets/results/:filename', requireAuth, (req: AuthenticatedRequest, res) => {
    const filename = req.params.filename;
    if (!/^[a-zA-Z0-9_-]+\.(png|jpe?g|webp)$/.test(filename)) return res.sendStatus(404);
    const job = sqliteDb.getAIJobByResultFilename(filename);
    if (!job || job.userId !== req.user!.id) return res.sendStatus(404);
    // Legacy results are allowed only with a matching owned database record.
    const candidates = [path.join(RESULTS_DIR, filename), path.join(root, 'public/assets/results', filename)];
    const file = candidates.find(f => fs.existsSync(f));
    if (!file) return res.sendStatus(404);
    res.setHeader('Cache-Control', 'private, no-store');
    if (req.query.preview === '1') { void sendPreview(file, res, req.query.size === 'thumb' ? 640 : 1600); }
    else res.sendFile(file);
  });
  // Never allow fallback static handlers (including Vite) to expose private files.
  app.use((req, res, next) => {
    let decoded: string;
    try { decoded = decodeURIComponent(req.path); } catch { return res.sendStatus(400); }
    if (/(?:^|\/)results(?:\/|$)/i.test(decoded) || decoded.startsWith('/@fs/')) return res.sendStatus(404);
    next();
  });
  app.get('/assets/:category/:filename', (req, res, next) => {
    if (!['costumes', 'events'].includes(req.params.category) || !/^[a-zA-Z0-9_-]+\.(png|jpe?g|webp)$/i.test(req.params.filename)) return next();
    const file = path.join(root, 'public/assets', req.params.category, req.params.filename);
    if (!fs.existsSync(file)) return next();
    if (req.query.original === '1') return res.sendFile(file);
    res.setHeader('Cache-Control', 'public, max-age=3600');
    void sendPreview(file, res, req.query.size === 'thumb' ? 640 : 1600);
  });
  app.use('/assets', express.static(path.join(root, 'public/assets')));
  if (process.env.NODE_ENV === 'production') {
    if (!fs.existsSync(path.join(root, 'dist/index.html'))) throw new Error('Run npm run build before npm start.');
    app.use(express.static(path.join(root, 'dist')));
    app.get('*', (_req, res) => { res.sendFile(path.join(root, 'dist/index.html')); });
  } else {
    const { createServer } = await import('vite');
    const vite = await createServer({ server: { middlewareMode: true, hmr: false }, publicDir: false, appType: 'spa' });
    app.use(vite.middlewares);
  }
  app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    if (!err.status || err.status >= 500) recordFailure('http', err);
    res.status(err.status || 500).json({ success: false, error: 'Yêu cầu không hợp lệ hoặc máy chủ không xử lý được.' });
  });
  return app;
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  createApp().then(app => {
    const server = app.listen(Number(process.env.PORT || 3000), process.env.HOST || '0.0.0.0', () => console.log('Việt Phục Discovery server started.'));
    monitor.event('server_started');
    const monitorTimer=setInterval(()=>{try{systemStatus();}catch{monitor.event('monitor_sample_failed','error');}},60000);
    monitorTimer.unref();
    const backupTimer = setInterval(() => {
      try { sqliteDb.performBackup(); } catch (err) { monitor.event('backup_failed','error'); }
    }, 60 * 60 * 1000);
    backupTimer.unref();

    for (const signal of ['SIGINT', 'SIGTERM'] as const) process.once(signal, () => {
      clearInterval(backupTimer); clearInterval(monitorTimer); monitor.flush(); server.close(() => { sqliteDb.close(); process.exit(0); });
    });
  }).catch(err => { console.error(err); process.exit(1); });
}
