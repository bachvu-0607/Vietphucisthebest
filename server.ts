import 'dotenv/config';
import express from 'express';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { apiRouter } from './server/routes.ts';
import { sqliteDb } from './server/sqlite.ts';
import { requireAuth, type AuthenticatedRequest } from './server/auth.ts';
import { RESULTS_DIR, DATA_DIR } from './server/storage.ts';

const root = path.dirname(fileURLToPath(import.meta.url));
export async function createApp() {
  const app = express();
  sqliteDb.recoverInterruptedJobs();
  app.disable('x-powered-by');
  app.use((_req, res, next) => { res.setHeader('Referrer-Policy', 'no-referrer'); next(); });
  app.use(express.json({ limit: '12mb' }));
  app.use('/api', (_req, res, next) => { res.setHeader('Cache-Control', 'private, no-store'); next(); });
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
    res.sendFile(file);
  });
  // Never allow fallback static handlers (including Vite) to expose private files.
  app.use((req, res, next) => {
    let decoded: string;
    try { decoded = decodeURIComponent(req.path); } catch { return res.sendStatus(400); }
    if (/(?:^|\/)results(?:\/|$)/i.test(decoded) || decoded.startsWith('/@fs/')) return res.sendStatus(404);
    next();
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
    console.error('Request failed:', err.message);
    res.status(err.status || 500).json({ success: false, error: 'Yêu cầu không hợp lệ hoặc máy chủ không xử lý được.' });
  });
  return app;
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
    const pidFile = path.join(DATA_DIR, 'server.pid');
    if (fs.existsSync(pidFile)) {
      const pid = Number(fs.readFileSync(pidFile, 'utf8'));
      try { process.kill(pid, 0); throw new Error('Only one server may use this SQLite database.'); }
      catch (err: any) { if (err.code !== 'ESRCH') throw err; fs.unlinkSync(pidFile); }
    }
    fs.writeFileSync(pidFile, String(process.pid), { flag: 'wx' });
  process.once('exit', () => { if (fs.existsSync(pidFile)) fs.unlinkSync(pidFile); });
  createApp().then(app => {
    const server = app.listen(Number(process.env.PORT || 3000), process.env.HOST || '0.0.0.0', () => console.log('Việt Phục Remix server started.'));
    const backupTimer = setInterval(() => {
      try { sqliteDb.performBackup(); } catch (err) { console.error('Periodic backup failed:', err); }
    }, 60 * 60 * 1000);
    backupTimer.unref();

    for (const signal of ['SIGINT', 'SIGTERM'] as const) process.once(signal, () => {
      clearInterval(backupTimer); server.close(() => { sqliteDb.close(); process.exit(0); });
    });
  }).catch(err => { console.error(err); process.exit(1); });
}
