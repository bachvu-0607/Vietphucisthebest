import express from 'express';
import type { Request, Response } from 'express';
import { sqliteDb } from './sqlite.ts';
import { processJobInBackground } from './ai.ts';
import {
  hashPassword,
  verifyPassword,
  issueUserToken,
  revokeUserToken,
  createPasswordResetToken,
  requireAuth,
  optionalAuth,
  type AuthenticatedRequest
} from './auth.ts';

export const apiRouter = express.Router();

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

    if (!password || typeof password !== 'string' || password.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'Mật khẩu phải có độ dài tối thiểu 6 ký tự.'
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
    console.error('Register error:', err);
    res.status(500).json({ success: false, error: 'Lỗi máy chủ khi đăng ký tài khoản.' });
  }
});

// POST /api/auth/login
apiRouter.post('/auth/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
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
          role: user.role,
          recoveryCode: user.recoveryCode
        }
      }
    });
  } catch (err: any) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, error: 'Lỗi máy chủ khi đăng nhập.' });
  }
});

// POST /api/auth/logout
apiRouter.post('/auth/logout', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const rawToken = authHeader.substring(7).trim();
      revokeUserToken(rawToken);
    }
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
    if (!user || user.recoveryCode.toLowerCase().trim() !== recoveryCode.toLowerCase().trim()) {
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

    if (!resetToken || !newPassword || newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'Mã khôi phục không hợp lệ hoặc mật khẩu mới dưới 6 ký tự.'
      });
    }

    const tokenHash = (await import('./auth.ts')).hashToken(resetToken);
    const userId = sqliteDb.verifyAndConsumeResetToken(tokenHash);

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'Mã khôi phục không hợp lệ hoặc đã hết hạn.'
      });
    }

    const passwordHash = await hashPassword(newPassword);
    sqliteDb.updateUserPassword(userId, passwordHash);

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
      return res.status(result.statusCode).json({
        success: false,
        error: result.reason
      });
    }

    const job = result.job;

    // Launch background AI worker
    processJobInBackground(job.id, {
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
      return res.status(result.statusCode).json({
        success: false,
        error: result.reason
      });
    }

    const updatedJob = result.job;

    // Launch worker with ALL original parameters preserved!
    processJobInBackground(updatedJob.id, {
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

// GET /api/system/durability-status (Checks SQLite WAL mode, database size, and backups)
apiRouter.get('/system/durability-status', (_req: Request, res: Response) => {
  try {
    const backupPath = sqliteDb.performBackup();
    const backups = sqliteDb.getBackups();
    res.json({
      success: true,
      data: {
        databaseEngine: 'SQLite with WAL journal mode',
        persistenceMechanism: 'Local disk SQLite (requires Cloud Storage FUSE on Cloud Run for persistence)',
        latestBackupPath: backupPath ? 'data/backups/' + backupPath.split('/').pop() : null,
        totalBackups: backups.length,
        backups: backups.slice(0, 5),
        timestamp: new Date().toISOString()
      }
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/system/backups (List available backup snapshots)
apiRouter.get('/system/backups', (_req: Request, res: Response) => {
  try {
    const backups = sqliteDb.getBackups();
    res.json({ success: true, data: backups });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/system/restore (Genuine restoration of SQLite database from snapshot)
apiRouter.post('/system/restore', (req: Request, res: Response) => {
  try {
    const { backupFilename } = req.body || {};
    const result = sqliteDb.restoreBackup(backupFilename);
    if (!result.success) {
      return res.status(400).json({ success: false, error: result.message, details: result.error });
    }
    res.json({ success: true, message: result.message, data: result.details });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});
