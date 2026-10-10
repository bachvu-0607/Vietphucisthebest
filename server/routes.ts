import { monitor, recordFailure } from './monitor.ts';
import { systemStatus } from './status.ts';
import express from 'express';
import type { Request, Response } from 'express';
import { sqliteDb } from './sqlite.ts';
import { processJobInBackground } from './ai.ts';
import { askGemini, chatConfigured, parseChatRequest, ChatUnavailableError } from './chat.ts';
import { positiveLimit } from './storage.ts';
import {
  setSessionCookie,
  clearSessionCookie,
  extractToken,
  hashPassword,
  verifyPassword,
  issueUserToken,
  revokeUserToken,
  createPasswordResetToken,
  requireAuth,
  optionalAuth,
  type AuthenticatedRequest
} from './auth.ts';

export const apiRouter = express.Router({ caseSensitive: true, strict: true });

apiRouter.use((req, res, next) => {
  if (!['GET', 'HEAD', 'OPTIONS'].includes(req.method) && req.headers.cookie && !req.headers.authorization?.startsWith('Bearer ')) {
    // Vercel proxies requests while preserving the browser's Origin.
    // Trust only this project's exact frontend domain, never arbitrary *.vercel.app.
    const allowed = [
      process.env.APP_URL || `${req.protocol}://${req.get('host')}`,
      process.env.FRONTEND_ORIGIN || 'https://vietphucisthebest.vercel.app',
    ].map(origin => origin.replace(/\/$/, ''));
    if (!req.get('origin') || !allowed.includes(req.get('origin')!)) {
      return res.status(403).json({ success: false, error: 'Yêu cầu không cùng nguồn với website.' });
    }
  }
  if (req.method === 'POST' && req.path.startsWith('/auth/')) {
    const limits: Record<string, number> = { '/auth/register': 15, '/auth/login': 30, '/auth/forgot-password': 5, '/auth/reset-password': 10, '/auth/change-password': 10, '/auth/recovery-code': 5 };
    const limit = limits[req.path];
    const ip = req.socket.remoteAddress || 'unknown';
    if (limit && !sqliteDb.allowAuthAttempt(`${req.path}:${ip}`, limit)) {
      return res.status(429).json({ success: false, error: 'Bạn đã thử quá nhiều lần. Vui lòng đợi 15 phút.' });
    }
  }
  next();
});

// ========================================================
// 1. AUTHENTICATION ROUTES (Register, Login, Logout, Forgot)
// ========================================================

// POST /api/auth/register
apiRouter.post('/auth/register', async (req: Request, res: Response) => {
  try {
    const { email, name, password } = req.body;

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return res.status(400).json({
        success: false,
        error: 'Địa chỉ email không hợp lệ.'
      });
    }

    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return res.status(400).json({
        success: false,
        error: 'Họ tên phải có ít nhất 2 ký tự.'
      });
    }

    if (!password || typeof password !== 'string' || password.length < 8 || Buffer.byteLength(password) > 72) {
      return res.status(400).json({
        success: false,
        error: 'Mật khẩu phải có độ dài từ 8 ký tự (tối đa 72 byte).'
      });
    }

    const existing = sqliteDb.getUserByEmail(email);
    if (existing) {
      return res.status(409).json({
        success: false,
        error: 'Email này đã được đăng ký. Vui lòng đăng nhập hoặc sử dụng tính năng quên mật khẩu.'
      });
    }

    const passwordHash = await hashPassword(password);
    const newUser = sqliteDb.createUser(email, name, passwordHash);
    const { token, expiresAt } = issueUserToken(newUser);
    setSessionCookie(res, token);

    res.status(201).json({
      success: true,
      message: 'Đăng ký tài khoản thành công.',
      data: {
        token,
        expiresAt,
        user: {
          id: newUser.id,
          email: newUser.email,
          name: newUser.name,
          role: newUser.role,
          recoveryCode: newUser.recoveryCode
        }
      }
    });
  } catch (err: any) {
    recordFailure('api', err);
    res.status(500).json({ success: false, error: 'Lỗi máy chủ khi đăng ký tài khoản.' });
  }
});

// POST /api/auth/login
apiRouter.post('/auth/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (typeof email !== 'string' || typeof password !== 'string' || Buffer.byteLength(password) > 72) {
      return res.status(400).json({
        success: false,
        error: 'Vui lòng nhập đầy đủ email và mật khẩu.'
      });
    }

    const user = sqliteDb.getUserByEmail(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Email hoặc mật khẩu không chính xác.'
      });
    }

    const isMatch = await verifyPassword(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Email hoặc mật khẩu không chính xác.'
      });
    }

    const { token, expiresAt } = issueUserToken(user);
    setSessionCookie(res, token);

    res.json({
      success: true,
      message: 'Đăng nhập thành công.',
      data: {
        token,
        expiresAt,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        }
      }
    });
  } catch (err: any) {
    recordFailure('api', err);
    res.status(500).json({ success: false, error: 'Lỗi máy chủ khi đăng nhập.' });
  }
});

// POST /api/auth/logout
apiRouter.post('/auth/logout', optionalAuth, (req: AuthenticatedRequest, res: Response) => {
  try {
    const token = extractToken(req);
    if (token) revokeUserToken(token);
    clearSessionCookie(res);
    res.json({ success: true, message: 'Đăng xuất thành công, phiên làm việc đã bị thu hồi.' });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/auth/me
apiRouter.get('/auth/me', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  res.json({
    success: true,
    data: {
      user: req.user
    }
  });
});

apiRouter.post('/auth/change-password', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
  const { oldPassword, newPassword } = req.body || {};
  if (typeof oldPassword !== 'string' || typeof newPassword !== 'string' || newPassword.length < 8 || Buffer.byteLength(newPassword) > 72) {
    return res.status(400).json({ success: false, error: 'Mật khẩu mới cần ít nhất 8 ký tự, tối đa 72 byte.' });
  }
  const user = sqliteDb.getUserById(req.user!.id)!;
  if (!await verifyPassword(oldPassword, user.passwordHash)) return res.status(401).json({ success: false, error: 'Mật khẩu hiện tại không đúng.' });
  sqliteDb.updateUserPassword(user.id, await hashPassword(newPassword));
  clearSessionCookie(res);
  res.json({ success: true, message: 'Đã đổi mật khẩu. Vui lòng đăng nhập lại.' });
  } catch (err) { recordFailure('api', err); res.status(500).json({ success: false, error: 'Không thể cập nhật tài khoản. Vui lòng thử lại.' }); }
});
apiRouter.post('/auth/recovery-code', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
  const user = sqliteDb.getUserById(req.user!.id)!;
  if (typeof req.body?.password !== 'string' || !await verifyPassword(req.body.password, user.passwordHash)) {
    return res.status(401).json({ success: false, error: 'Mật khẩu hiện tại không đúng.' });
  }
  res.json({ success: true, data: { recoveryCode: sqliteDb.rotateRecoveryCode(user.id) } });
  } catch (err) { recordFailure('api', err); res.status(500).json({ success: false, error: 'Không thể cập nhật tài khoản. Vui lòng thử lại.' }); }
});

// POST /api/auth/forgot-password (Strictly requires recovery code; NO reset allowed by email alone)
apiRouter.post('/auth/forgot-password', async (req: Request, res: Response) => {
  try {
    const { email, recoveryCode } = req.body;
    if (!email || typeof email !== 'string') {
      return res.status(400).json({ success: false, error: 'Vui lòng cung cấp địa chỉ email.' });
    }

    if (!recoveryCode || typeof recoveryCode !== 'string' || recoveryCode.trim() === '') {
      return res.status(400).json({
        success: false,
        error: 'Vui lòng cung cấp mã xác minh khôi phục (Recovery Code). Hệ thống bảo mật không cho phép đặt lại mật khẩu chỉ bằng email.'
      });
    }

    const user = sqliteDb.getUserByEmail(email);
    if (!user || user.id === 'usr-legacy-archive' || !sqliteDb.verifyRecoveryCode(user.id, recoveryCode)) {
      return res.status(401).json({
        success: false,
        error: 'Email hoặc mã xác minh khôi phục không chính xác. Vì lý do bảo mật, bạn không thể đặt lại mật khẩu nếu thiếu mã xác minh hợp lệ.'
      });
    }

    const { rawToken, expiresAt } = createPasswordResetToken(user);

    res.json({
      success: true,
      message: 'Xác minh thành công. Mã khôi phục mật khẩu hợp lệ trong 60 phút.',
      resetToken: rawToken,
      expiresAt
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/auth/reset-password
apiRouter.post('/auth/reset-password', async (req: Request, res: Response) => {
  try {
    const { resetToken, newPassword } = req.body;

    if (typeof resetToken !== 'string' || typeof newPassword !== 'string' || newPassword.length < 8 || Buffer.byteLength(newPassword) > 72) {
      return res.status(400).json({ success: false, error: 'Mật khẩu cần ít nhất 8 ký tự, tối đa 72 byte.' });
    }
    const tokenHash = (await import('./auth.ts')).hashToken(resetToken);
    const passwordHash = await hashPassword(newPassword);
    if (!sqliteDb.resetPasswordWithToken(tokenHash, passwordHash)) {
      return res.status(400).json({ success: false, error: 'Mã khôi phục không hợp lệ hoặc đã hết hạn.' });
    }
    clearSessionCookie(res);

    res.json({
      success: true,
      message: 'Đặt lại mật khẩu thành công. Vui lòng đăng nhập bằng mật khẩu mới.'
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ========================================================
// 2. PUBLIC CULTURAL REFERENCE DATA (Guests Allowed)
// ========================================================

// GET /api/events
apiRouter.get('/events', (_req: Request, res: Response) => {
  try {
    const events = sqliteDb.getEvents();
    res.json({ success: true, data: events });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/costumes
apiRouter.get('/costumes', (req: Request, res: Response) => {
  try {
    const eventId = req.query.eventId as string | undefined;
    const gender = req.query.gender as string | undefined;
    const era = req.query.era as string | undefined;

    const costumes = sqliteDb.getCostumes(eventId, gender, era);
    res.json({ success: true, data: costumes });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/costumes/:id
apiRouter.get('/costumes/:id', (req: Request, res: Response) => {
  try {
    const costume = sqliteDb.getCostumeById(req.params.id);
    if (!costume) {
      return res.status(404).json({ success: false, error: 'Không tìm thấy bộ Việt phục yêu cầu.' });
    }
    res.json({ success: true, data: costume });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/backgrounds
apiRouter.get('/backgrounds', (_req: Request, res: Response) => {
  try {
    const backgrounds = sqliteDb.getBackgrounds();
    res.json({ success: true, data: backgrounds });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ========================================================
// 3. FITTING DRAFTS (STRICT AUTHENTICATION & USER OWNERSHIP)
// ========================================================

// GET /api/drafts
apiRouter.get('/drafts', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  try {
    const drafts = sqliteDb.getUserDrafts(req.user!.id);
    res.json({ success: true, data: drafts });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/drafts/:id
apiRouter.get('/drafts/:id', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  try {
    const draft = sqliteDb.getDraftById(req.params.id, req.user!.id);
    if (!draft) {
      return res.status(404).json({
        success: false,
        error: 'Không tìm thấy bản phác thảo hoặc bạn không có quyền truy cập.'
      });
    }
    res.json({ success: true, data: draft });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/drafts
apiRouter.post('/drafts', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  try {
    const draftData = req.body;
    if (!draftData.costumeId) {
      return res.status(400).json({
        success: false,
        error: 'Dữ liệu thiếu mã bộ trang phục (costumeId).'
      });
    }

    if (draftData.id && !sqliteDb.getDraftById(draftData.id, req.user!.id)) {
      return res.status(404).json({ success: false, error: 'Không tìm thấy bản phối của bạn.' });
    }
    const saved = sqliteDb.saveUserDraft(req.user!.id, draftData);
    res.json({
      success: true,
      data: saved,
      message: 'Đã lưu bản phác thảo vào tủ đồ cá nhân thành công.'
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE /api/drafts/:id
apiRouter.delete('/drafts/:id', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  try {
    const deleted = sqliteDb.deleteUserDraft(req.params.id, req.user!.id);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: 'Bản phác thảo không tồn tại hoặc bạn không phải là chủ sở hữu.'
      });
    }
    res.json({ success: true, message: 'Đã xóa bản phác thảo khỏi tủ đồ.' });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ========================================================
// 3b. CHAT ASSISTANT (GUESTS ALLOWED, DAILY QUOTA PER ACCOUNT OR IP)
// ========================================================

// Vercel overwrites X-Forwarded-For with the visitor IP before proxying to Railway.
function clientIp(req: Request): string {
  const forwarded = req.get('x-forwarded-for')?.split(',')[0]?.trim();
  return forwarded || req.socket.remoteAddress || 'unknown';
}
function chatQuotaKey(req: AuthenticatedRequest): { key: string; limit: number } {
  return req.user
    ? { key: `user:${req.user.id}`, limit: positiveLimit('CHAT_USER_DAILY_LIMIT', 30) }
    : { key: `ip:${clientIp(req)}`, limit: positiveLimit('CHAT_GUEST_DAILY_LIMIT', 10) };
}

// GET /api/chat/usage
apiRouter.get('/chat/usage', optionalAuth, (req: AuthenticatedRequest, res: Response) => {
  const { key, limit } = chatQuotaKey(req);
  res.json({ success: true, data: { enabled: chatConfigured(), limit, ...sqliteDb.getChatUsage(key, limit) } });
});

// POST /api/chat
apiRouter.post('/chat', optionalAuth, async (req: AuthenticatedRequest, res: Response) => {
  const parsed = parseChatRequest(req.body);
  if (typeof parsed === 'string') return res.status(400).json({ success: false, error: parsed });
  if (!chatConfigured()) {
    res.locals.expectedLimit = true;
    return res.status(503).json({ success: false, error: 'Trợ lý chưa được bật trên máy chủ.' });
  }
  const { key, limit } = chatQuotaKey(req);
  const quota = sqliteDb.consumeChatQuota(key, limit, positiveLimit('CHAT_GLOBAL_DAILY_LIMIT', 1000));
  if (!quota) {
    res.locals.expectedLimit = true;
    return res.status(429).json({ success: false, error: req.user
      ? 'Bạn đã dùng hết lượt hỏi trợ lý hôm nay. Hãy quay lại vào ngày mai.'
      : 'Bạn đã dùng hết lượt hỏi trợ lý hôm nay. Đăng nhập để có thêm lượt hỏi.' });
  }
  try {
    const reply = await askGemini(parsed.messages, parsed.costumeId);
    monitor.event('chat_completed');
    res.json({ success: true, data: { reply, remaining: quota.remaining } });
  } catch (err: any) {
    sqliteDb.refundChatQuota(key);
    if (!(err instanceof ChatUnavailableError)) recordFailure('chat', err);
    res.locals.expectedLimit = err?.status === 429;
    res.status(503).json({ success: false, error: err?.status === 429 || err?.status === 503
      ? 'Trợ lý đang quá tải. Vui lòng thử lại sau ít phút.'
      : 'Trợ lý chưa trả lời được. Vui lòng thử lại.' });
  }
});

// ========================================================
// 4. AI JOBS (STRICT AUTH, RATE LIMIT 5/DAY, 1 CONCURRENT)
// ========================================================

// GET /api/ai/jobs/usage (Daily & Total Quota indicator)
apiRouter.get('/ai/jobs/usage', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  try {
    const usage = sqliteDb.getUserAIUsage(req.user!.id);
    res.json({ success: true, data: usage });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/ai/jobs
apiRouter.get('/ai/jobs', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  try {
    const jobs = sqliteDb.getUserAIJobs(req.user!.id);
    res.json({ success: true, data: jobs });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/ai/jobs/:id
apiRouter.get('/ai/jobs/:id', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  try {
    const job = sqliteDb.getDetailedAIJobById(req.params.id, req.user!.id);
    if (!job) {
      return res.status(404).json({
        success: false,
        error: 'Không tìm thấy yêu cầu AI hoặc bạn không có quyền truy cập.'
      });
    }
    res.json({ success: true, data: job });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE /api/ai/jobs/:id (Allow cleaning up completed/failed AI jobs, prevents deleting active jobs)
apiRouter.delete('/ai/jobs/:id', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  try {
    const result = sqliteDb.deleteUserAIJob(req.params.id, req.user!.id);
    if (!result.success) {
      return res.status(result.statusCode || 400).json({
        success: false,
        error: result.error || 'Không thể xóa tác vụ AI.'
      });
    }
    res.json({ success: true, message: 'Đã xóa tác vụ AI khỏi tủ đồ.' });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/ai/jobs (Enforces max 5/day and max 1 concurrent job)
apiRouter.post('/ai/jobs', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const {
      draftId,
      costumeId,
      costumeName,
      eventName,
      modelGender,
      remixStyle,
      colorName,
      materialName,
      accessories,
      backgroundName,
      customPrompt,
      referenceImageUrl,
      sketchDataUrl
    } = req.body;

    if (!costumeId || !costumeName) {
      return res.status(400).json({
        success: false,
        error: 'Vui lòng chọn bộ Việt phục hợp lệ trước khi hoàn thiện bằng AI.'
      });
    }

    if (!sketchDataUrl) {
      return res.status(400).json({
        success: false,
        error: 'Không tìm thấy dữ liệu ảnh phác thảo đã kết xuất.'
      });
    }

    // ATOMIC RESERVATION & CREATION (Guarantees no race conditions across tabs/clicks)
    const promptUsed = `Vietnamese Costume: ${costumeName}, Style: ${remixStyle}`;
    const result = sqliteDb.atomicCreateAIJob(userId, {
      draftId,
      costumeId,
      costumeName,
      eventName: eventName || 'Sự kiện văn hóa',
      remixStyle: remixStyle || 'traditional',
      modelGender,
      colorName,
      materialName,
      accessories,
      backgroundName,
      customPrompt,
      referenceImageUrl,
      sketchDataUrl,
      promptUsed
    });

    if (!result.success) {
      res.locals.expectedLimit = result.statusCode === 503 || result.statusCode === 429;
      return res.status(result.statusCode).json({
        success: false,
        error: result.reason
      });
    }

    const job = result.job;

    // Launch background AI worker
    processJobInBackground(job.id, {
      costumeId,
      costumeName,
      eventName: eventName || 'Sự kiện văn hóa',
      remixStyle: remixStyle || 'traditional',
      modelGender,
      colorName,
      materialName,
      accessories,
      backgroundName,
      customPrompt,
      referenceImageUrl,
      sketchDataUrl
    });

    res.status(201).json({
      success: true,
      data: job,
      message: 'Yêu cầu hoàn thiện AI đã được tiếp nhận và đưa vào hàng đợi.'
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/ai/jobs/:id/retry (Enforces rate limit and preserves ALL parameters atomically)
apiRouter.post('/ai/jobs/:id/retry', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const result = sqliteDb.atomicRetryAIJob(req.params.id, userId);

    if (!result.success) {
      res.locals.expectedLimit = result.statusCode === 503 || result.statusCode === 429;
      return res.status(result.statusCode).json({
        success: false,
        error: result.reason
      });
    }

    const updatedJob = result.job;

    // Launch worker with ALL original parameters preserved!
    processJobInBackground(updatedJob.id, {
      costumeId: updatedJob.costumeId,
      costumeName: updatedJob.costumeName,
      eventName: updatedJob.eventName,
      remixStyle: updatedJob.remixStyle,
      modelGender: updatedJob.modelGender,
      colorName: updatedJob.colorName,
      materialName: updatedJob.materialName,
      accessories: updatedJob.accessories,
      backgroundName: updatedJob.backgroundName,
      customPrompt: updatedJob.customPrompt,
      referenceImageUrl: updatedJob.referenceImageUrl,
      sketchDataUrl: updatedJob.sketchDataUrl
    });

    res.json({
      success: true,
      data: updatedJob,
      message: 'Đã đưa yêu cầu AI vào hàng đợi thử lại.'
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

apiRouter.get('/system/durability-status', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  if (req.user?.role !== 'admin') return res.status(403).json({ success: false, error: 'Chỉ quản trị viên được truy cập.' });
  res.json({ success: true, data: { databaseEngine: 'SQLite', persistenceMechanism: 'Persistent local disk required; see DEPLOYMENT.md', totalBackups: sqliteDb.getBackups().length } });
});
apiRouter.get('/system/backups', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  if (req.user?.role !== 'admin') return res.status(403).json({ success: false, error: 'Chỉ quản trị viên được truy cập.' });
  res.json({ success: true, data: sqliteDb.getBackups().map(({ filename, size, createdAt }) => ({ filename, size, createdAt })) });
});
apiRouter.post('/system/restore', requireAuth, (_req: Request, res: Response) => {
  res.status(403).json({ success: false, error: 'Khôi phục phải thực hiện ngoại tuyến khi máy chủ đã dừng. Xem DEPLOYMENT.md.' });
});

apiRouter.get('/system/monitor', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  if (req.user?.role !== 'admin') return res.status(403).json({ success: false, error: 'Chỉ quản trị viên được truy cập.' });
  try {res.json({success:true,data:systemStatus()});} catch {res.status(503).json({success:false,error:'Chưa đọc được thống kê hệ thống.'});}
});
