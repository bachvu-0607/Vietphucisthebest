import { Router, Request, Response } from 'express';
import { db } from './db.js';
import { processJobInBackground } from './ai.js';

export const apiRouter = Router();

// Events API
apiRouter.get('/events', (_req: Request, res: Response) => {
  try {
    const events = db.getEvents();
    res.json({ success: true, data: events });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Costumes API with filters
apiRouter.get('/costumes', (req: Request, res: Response) => {
  try {
    const eventId = req.query.eventId as string | undefined;
    const gender = req.query.gender as string | undefined;
    const era = req.query.era as string | undefined;

    const costumes = db.getCostumes(eventId, gender, era);
    res.json({ success: true, data: costumes });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Costume detail
apiRouter.get('/costumes/:id', (req: Request, res: Response) => {
  try {
    const costume = db.getCostumeById(req.params.id);
    if (!costume) {
      return res.status(404).json({ success: false, error: 'Không tìm thấy bộ Việt phục yêu cầu.' });
    }
    res.json({ success: true, data: costume });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Backgrounds API
apiRouter.get('/backgrounds', (_req: Request, res: Response) => {
  try {
    const backgrounds = db.getBackgrounds();
    res.json({ success: true, data: backgrounds });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Drafts API
apiRouter.get('/drafts', (_req: Request, res: Response) => {
  try {
    const drafts = db.getDrafts();
    res.json({ success: true, data: drafts });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

apiRouter.get('/drafts/:id', (req: Request, res: Response) => {
  try {
    const draft = db.getDraftById(req.params.id);
    if (!draft) {
      return res.status(404).json({ success: false, error: 'Không tìm thấy bản phác thảo.' });
    }
    res.json({ success: true, data: draft });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

apiRouter.post('/drafts', (req: Request, res: Response) => {
  try {
    const draftData = req.body;
    if (!draftData.costumeId) {
      return res.status(400).json({ success: false, error: 'Dữ liệu thiếu mã bộ trang phục (costumeId).' });
    }

    const saved = db.saveDraft(draftData);
    res.json({ success: true, data: saved, message: 'Đã lưu bản phác thảo thành công.' });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

apiRouter.delete('/drafts/:id', (req: Request, res: Response) => {
  try {
    const deleted = db.deleteDraft(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Bản phác thảo không tồn tại.' });
    }
    res.json({ success: true, message: 'Đã xóa bản phác thảo.' });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// AI Jobs API
apiRouter.get('/ai/jobs', (_req: Request, res: Response) => {
  try {
    const jobs = db.getAIJobs();
    res.json({ success: true, data: jobs });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

apiRouter.get('/ai/jobs/:id', (req: Request, res: Response) => {
  try {
    const job = db.getAIJobById(req.params.id);
    if (!job) {
      return res.status(404).json({ success: false, error: 'Không tìm thấy yêu cầu AI.' });
    }
    res.json({ success: true, data: job });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

apiRouter.post('/ai/jobs', (req: Request, res: Response) => {
  try {
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

    // Minimum data validation
    if (!costumeId || !costumeName) {
      return res.status(400).json({
        success: false,
        error: 'Vui lòng chọn bộ Việt phục hợp lệ trước khi hoàn thiện bằng AI.'
      });
    }

    if (!sketchDataUrl) {
      return res.status(400).json({
        success: false,
        error: 'Không tìm thấy dữ liệu ảnh phác thảo đã kết xuất từ các layer.'
      });
    }

    // Create job in database
    const job = db.createAIJob({
      draftId,
      costumeId,
      costumeName,
      eventName: eventName || 'Sự kiện văn hóa',
      remixStyle: remixStyle || 'traditional',
      sketchDataUrl,
      promptUsed: `Vietnamese Costume: ${costumeName}, Style: ${remixStyle}`
    });

    // Fire asynchronous background worker
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

    res.json({
      success: true,
      data: job,
      message: 'Yêu cầu hoàn thiện AI đã được tiếp nhận và đưa vào hàng đợi.'
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

apiRouter.post('/ai/jobs/:id/retry', (req: Request, res: Response) => {
  try {
    const job = db.getAIJobById(req.params.id);
    if (!job) {
      return res.status(404).json({ success: false, error: 'Không tìm thấy công việc AI.' });
    }

    db.updateAIJob(job.id, {
      status: 'queued',
      progress: 5,
      errorMessage: undefined
    });

    processJobInBackground(job.id, {
      costumeName: job.costumeName,
      eventName: job.eventName,
      remixStyle: job.remixStyle,
      sketchDataUrl: job.sketchDataUrl
    });

    res.json({ success: true, data: job, message: 'Đã đưa yêu cầu AI vào hàng đợi thử lại.' });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});
