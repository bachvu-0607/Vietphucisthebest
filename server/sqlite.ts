import { DatabaseSync } from 'node:sqlite';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import type {
  EventItem,
  Costume,
  BackgroundSetting,
  FittingDraft,
  AIJob
} from './db.ts';
import {
  INITIAL_EVENTS,
  INITIAL_COSTUMES,
  INITIAL_BACKGROUNDS
} from './db.ts';

const DATA_DIR = path.resolve(process.cwd(), 'data');
const BACKUPS_DIR = path.resolve(DATA_DIR, 'backups');
const DB_FILE = path.resolve(DATA_DIR, 'vietphucremix.sqlite');
const LEGACY_JSON_FILE = path.resolve(DATA_DIR, 'vietphucremix.json');

// Ensure storage directories exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(BACKUPS_DIR)) {
  fs.mkdirSync(BACKUPS_DIR, { recursive: true });
}

export interface UserRecord {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  role: 'user' | 'admin';
  recoveryCode: string;
  createdAt: string;
  updatedAt: string;
}

export interface SessionRecord {
  id: string;
  userId: string;
  tokenHash: string;
  isRevoked: boolean;
  expiresAt: string;
  createdAt: string;
}

export interface PasswordResetRecord {
  id: string;
  userId: string;
  tokenHash: string;
  used: boolean;
  expiresAt: string;
  createdAt: string;
}

export interface DetailedAIJob extends AIJob {
  userId: string;
  modelGender?: 'male' | 'female';
  colorName?: string;
  materialName?: string;
  accessories?: string[];
  backgroundName?: string;
  customPrompt?: string;
  referenceImageUrl?: string;
}

class SQLiteDatabase {
  private db: DatabaseSync;

  constructor() {
    this.db = new DatabaseSync(DB_FILE);
    this.initSchema();
    this.migrateLegacyJson();
    this.performBackup();
  }

  private initSchema() {
    // Enable WAL mode for better concurrency and data durability
    this.db.exec(`PRAGMA journal_mode = WAL;`);
    this.db.exec(`PRAGMA foreign_keys = ON;`);

    // 1. Users table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        password_hash TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'user',
        recovery_code TEXT NOT NULL DEFAULT '',
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
    `);

    // Ensure recovery_code column exists for existing SQLite databases
    try {
      this.db.exec(`ALTER TABLE users ADD COLUMN recovery_code TEXT NOT NULL DEFAULT '';`);
    } catch {}

    // 2. Active Sessions / Token revocation table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS sessions (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        token_hash TEXT NOT NULL,
        is_revoked INTEGER NOT NULL DEFAULT 0,
        expires_at TEXT NOT NULL,
        created_at TEXT NOT NULL,
        FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
      );
      CREATE INDEX IF NOT EXISTS idx_sessions_token_hash ON sessions(token_hash);
      CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);
    `);

    // 3. Password reset tokens table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS password_resets (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        token_hash TEXT NOT NULL,
        used INTEGER NOT NULL DEFAULT 0,
        expires_at TEXT NOT NULL,
        created_at TEXT NOT NULL,
        FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
      );
      CREATE INDEX IF NOT EXISTS idx_resets_token_hash ON password_resets(token_hash);
    `);

    // 4. Drafts table with user ownership
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS drafts (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        title TEXT NOT NULL,
        event_id TEXT NOT NULL,
        costume_id TEXT NOT NULL,
        model_gender TEXT NOT NULL,
        model_pose TEXT NOT NULL,
        selected_color_id TEXT NOT NULL,
        selected_material_id TEXT NOT NULL,
        selected_accessories_json TEXT NOT NULL,
        selected_background_id TEXT NOT NULL,
        remix_style TEXT NOT NULL,
        custom_prompt TEXT NOT NULL DEFAULT '',
        visible_layers_json TEXT NOT NULL,
        sketch_data_url TEXT NOT NULL DEFAULT '',
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
      );
      CREATE INDEX IF NOT EXISTS idx_drafts_user ON drafts(user_id);
      CREATE INDEX IF NOT EXISTS idx_drafts_updated ON drafts(updated_at DESC);
    `);

    // 5. AI Jobs table with user ownership and full parameter retention
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS ai_jobs (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        draft_id TEXT,
        status TEXT NOT NULL,
        costume_id TEXT NOT NULL,
        costume_name TEXT NOT NULL,
        event_name TEXT NOT NULL,
        remix_style TEXT NOT NULL,
        model_gender TEXT,
        color_name TEXT,
        material_name TEXT,
        accessories_json TEXT,
        background_name TEXT,
        custom_prompt TEXT,
        reference_image_url TEXT,
        sketch_data_url TEXT NOT NULL,
        result_image_url TEXT,
        prompt_used TEXT,
        error_message TEXT,
        progress INTEGER NOT NULL DEFAULT 0,
        created_at TEXT NOT NULL,
        completed_at TEXT,
        FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
      );
      CREATE INDEX IF NOT EXISTS idx_ai_jobs_user ON ai_jobs(user_id);
      CREATE INDEX IF NOT EXISTS idx_ai_jobs_created ON ai_jobs(created_at DESC);
      CREATE INDEX IF NOT EXISTS idx_ai_jobs_status ON ai_jobs(status);
    `);

    // 6. AI Usage Log table (Strict 5/day enforcement including retries, immune to deletion bypass)
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS ai_usage_log (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        job_id TEXT NOT NULL,
        action_type TEXT NOT NULL DEFAULT 'create',
        created_at TEXT NOT NULL,
        FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
      );
      CREATE INDEX IF NOT EXISTS idx_ai_usage_user_time ON ai_usage_log(user_id, created_at);
    `);
  }

  /**
   * Safe migration of legacy JSON data without losing existing user work
   */
  private migrateLegacyJson() {
    if (!fs.existsSync(LEGACY_JSON_FILE)) return;

    try {
      const content = fs.readFileSync(LEGACY_JSON_FILE, 'utf-8');
      const legacyData = JSON.parse(content);
      const now = new Date().toISOString();

      // Ensure a default system migration user exists if needed
      let legacyUserId = 'usr-legacy-archive';
      const checkUser = this.db.prepare('SELECT id FROM users WHERE id = ?').get(legacyUserId);
      if (!checkUser) {
        this.db.prepare(`
          INSERT INTO users (id, email, name, password_hash, role, created_at, updated_at)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `).run(
          legacyUserId,
          'archive@vietphuc.remix',
          'Lưu trữ Di sản Việt',
          'LOCKED_ACCOUNT_HASH',
          'user',
          now,
          now
        );
      }

      // Migrate drafts
      if (Array.isArray(legacyData.drafts)) {
        const insertDraft = this.db.prepare(`
          INSERT OR IGNORE INTO drafts (
            id, user_id, title, event_id, costume_id, model_gender, model_pose,
            selected_color_id, selected_material_id, selected_accessories_json,
            selected_background_id, remix_style, custom_prompt, visible_layers_json,
            sketch_data_url, created_at, updated_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

        for (const d of legacyData.drafts) {
          if (!d.id) continue;
          insertDraft.run(
            d.id,
            d.userId || legacyUserId,
            d.title || 'Phác thảo Việt phục lưu trữ',
            d.eventId || 'evt-tet',
            d.costumeId || 'cos-nhat-binh',
            d.modelGender || 'female',
            d.modelPose || 'standing_formal',
            d.selectedColorId || 'col-nb-red',
            d.selectedMaterialId || 'mat-gam-hue',
            JSON.stringify(d.selectedAccessories || []),
            d.selectedBackgroundId || 'bg-hoang-thanh',
            d.remixStyle || 'traditional',
            d.customPrompt || '',
            JSON.stringify(d.visibleLayers || {}),
            d.sketchDataUrl || '',
            d.createdAt || now,
            d.updatedAt || now
          );
        }
      }

      // Migrate AI Jobs
      if (Array.isArray(legacyData.aiJobs)) {
        const insertJob = this.db.prepare(`
          INSERT OR IGNORE INTO ai_jobs (
            id, user_id, draft_id, status, costume_id, costume_name, event_name,
            remix_style, model_gender, color_name, material_name, accessories_json,
            background_name, custom_prompt, reference_image_url, sketch_data_url,
            result_image_url, prompt_used, error_message, progress, created_at, completed_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

        for (const j of legacyData.aiJobs) {
          if (!j.id) continue;
          insertJob.run(
            j.id,
            j.userId || legacyUserId,
            j.draftId || null,
            j.status || 'completed',
            j.costumeId || 'cos-nhat-binh',
            j.costumeName || 'Áo Nhật Bình',
            j.eventName || 'Sự kiện văn hóa',
            j.remixStyle || 'traditional',
            'female',
            'Đỏ son',
            'Gấm tơ tằm',
            JSON.stringify([]),
            'Hoàng thành Thăng Long',
            '',
            '',
            j.sketchDataUrl || '',
            j.resultImageUrl || null,
            j.promptUsed || '',
            j.errorMessage || null,
            j.progress || 100,
            j.createdAt || now,
            j.completedAt || now
          );
        }
      }
    } catch (err) {
      console.error('Error during legacy JSON migration to SQLite:', err);
    }
  }

  /**
   * Backup database snapshot to backups directory
   */
  public performBackup(): string | null {
    try {
      // Flush WAL to main database file before copying
      try {
        this.db.exec(`PRAGMA wal_checkpoint(TRUNCATE);`);
      } catch (e) {
        console.warn('Checkpoint warning before backup:', e);
      }

      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupPath = path.resolve(BACKUPS_DIR, `vietphucremix-${timestamp}.sqlite`);
      fs.copyFileSync(DB_FILE, backupPath);

      // Keep only last 10 backups to preserve disk space
      const files = fs.readdirSync(BACKUPS_DIR)
        .filter(f => f.startsWith('vietphucremix-') && f.endsWith('.sqlite'))
        .sort();
      if (files.length > 10) {
        for (const oldFile of files.slice(0, files.length - 10)) {
          fs.unlinkSync(path.resolve(BACKUPS_DIR, oldFile));
        }
      }
      return backupPath;
    } catch (err) {
      console.error('Failed to perform SQLite backup:', err);
      return null;
    }
  }

  /**
   * List all available database backup snapshots
   */
  public getBackups(): Array<{ filename: string; path: string; size: number; createdAt: string }> {
    if (!fs.existsSync(BACKUPS_DIR)) return [];
    return fs.readdirSync(BACKUPS_DIR)
      .filter(f => f.startsWith('vietphucremix-') && f.endsWith('.sqlite'))
      .map(f => {
        const fullPath = path.resolve(BACKUPS_DIR, f);
        const stat = fs.statSync(fullPath);
        return {
          filename: f,
          path: fullPath,
          size: stat.size,
          createdAt: stat.birthtime.toISOString()
        };
      })
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  /**
   * Restore database from a snapshot with genuine SQLite data verification
   */
  public restoreBackup(backupFilename?: string): {
    success: boolean;
    message: string;
    details?: any;
    error?: string;
  } {
    try {
      let targetFile: string;
      if (backupFilename) {
        targetFile = path.resolve(BACKUPS_DIR, path.basename(backupFilename));
      } else {
        const backups = this.getBackups();
        if (backups.length === 0) {
          return { success: false, message: 'Không tìm thấy bản sao lưu nào để khôi phục.' };
        }
        targetFile = backups[0].path;
      }

      if (!fs.existsSync(targetFile)) {
        return { success: false, message: `Tập tin sao lưu không tồn tại: ${path.basename(targetFile)}` };
      }

      // Checkpoint and safely close current connection
      try {
        this.db.exec(`PRAGMA wal_checkpoint(TRUNCATE);`);
        this.db.close();
      } catch (e) {
        console.warn('Closing db before restore:', e);
      }

      // Remove stale WAL and SHM files to prevent corruption
      const walFile = DB_FILE + '-wal';
      const shmFile = DB_FILE + '-shm';
      if (fs.existsSync(walFile)) fs.unlinkSync(walFile);
      if (fs.existsSync(shmFile)) fs.unlinkSync(shmFile);

      // Overwrite primary DB file with snapshot
      fs.copyFileSync(targetFile, DB_FILE);

      // Re-initialize connection
      this.db = new DatabaseSync(DB_FILE);
      this.db.exec(`PRAGMA journal_mode = WAL;`);
      this.db.exec(`PRAGMA foreign_keys = ON;`);

      // Verify row counts in restored DB
      const userCount = (this.db.prepare('SELECT COUNT(*) as count FROM users').get() as any)?.count || 0;
      const draftCount = (this.db.prepare('SELECT COUNT(*) as count FROM drafts').get() as any)?.count || 0;
      const jobCount = (this.db.prepare('SELECT COUNT(*) as count FROM ai_jobs').get() as any)?.count || 0;

      return {
        success: true,
        message: 'Khôi phục bản sao lưu thành công.',
        details: {
          restoredFrom: path.basename(targetFile),
          userCount,
          draftCount,
          jobCount,
          timestamp: new Date().toISOString()
        }
      };
    } catch (err: any) {
      console.error('Failed to restore SQLite backup:', err);
      try {
        this.db = new DatabaseSync(DB_FILE);
      } catch {}
      return {
        success: false,
        message: 'Khôi phục bản sao lưu thất bại.',
        error: err.message
      };
    }
  }

  // ==========================================
  // USER METHODS
  // ==========================================
  public createUser(email: string, name: string, passwordHash: string): UserRecord {
    const id = 'usr-' + crypto.randomUUID().slice(0, 8);
    const now = new Date().toISOString();
    const recoveryCode = 'REC-' + crypto.randomInt(100000, 999999);
    const stmt = this.db.prepare(`
      INSERT INTO users (id, email, name, password_hash, role, recovery_code, created_at, updated_at)
      VALUES (?, ?, ?, ?, 'user', ?, ?, ?)
    `);
    stmt.run(id, email.toLowerCase().trim(), name.trim(), passwordHash, recoveryCode, now, now);
    return {
      id,
      email: email.toLowerCase().trim(),
      name: name.trim(),
      passwordHash,
      role: 'user',
      recoveryCode,
      createdAt: now,
      updatedAt: now
    };
  }

  public getUserByEmail(email: string): UserRecord | null {
    const row = this.db.prepare(`SELECT * FROM users WHERE email = ?`).get(email.toLowerCase().trim()) as any;
    if (!row) return null;
    return {
      id: row.id,
      email: row.email,
      name: row.name,
      passwordHash: row.password_hash,
      role: row.role as 'user' | 'admin',
      recoveryCode: row.recovery_code || 'REC-123456',
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
  }

  public getUserById(id: string): UserRecord | null {
    const row = this.db.prepare(`SELECT * FROM users WHERE id = ?`).get(id) as any;
    if (!row) return null;
    return {
      id: row.id,
      email: row.email,
      name: row.name,
      passwordHash: row.password_hash,
      role: row.role as 'user' | 'admin',
      recoveryCode: row.recovery_code || 'REC-123456',
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
  }

  public updateUserPassword(userId: string, newPasswordHash: string): void {
    const now = new Date().toISOString();
    this.db.prepare(`
      UPDATE users SET password_hash = ?, updated_at = ? WHERE id = ?
    `).run(newPasswordHash, now, userId);

    // Invalidate all existing sessions on password change
    this.db.prepare(`UPDATE sessions SET is_revoked = 1 WHERE user_id = ?`).run(userId);
  }

  // ==========================================
  // SESSION & TOKEN METHODS
  // ==========================================
  public createSession(userId: string, tokenHash: string, expiresAt: string): SessionRecord {
    const id = 'ses-' + crypto.randomUUID().slice(0, 8);
    const now = new Date().toISOString();
    this.db.prepare(`
      INSERT INTO sessions (id, user_id, token_hash, is_revoked, expires_at, created_at)
      VALUES (?, ?, ?, 0, ?, ?)
    `).run(id, userId, tokenHash, expiresAt, now);
    return {
      id,
      userId,
      tokenHash,
      isRevoked: false,
      expiresAt,
      createdAt: now
    };
  }

  public isSessionActive(tokenHash: string): boolean {
    const now = new Date().toISOString();
    const row = this.db.prepare(`
      SELECT id FROM sessions
      WHERE token_hash = ? AND is_revoked = 0 AND expires_at > ?
    `).get(tokenHash, now);
    return !!row;
  }

  public revokeSession(tokenHash: string): void {
    this.db.prepare(`
      UPDATE sessions SET is_revoked = 1 WHERE token_hash = ?
    `).run(tokenHash);
  }

  // ==========================================
  // PASSWORD RESET METHODS
  // ==========================================
  public createPasswordReset(userId: string, tokenHash: string, expiresAt: string): PasswordResetRecord {
    const id = 'rst-' + crypto.randomUUID().slice(0, 8);
    const now = new Date().toISOString();
    this.db.prepare(`
      INSERT INTO password_resets (id, user_id, token_hash, used, expires_at, created_at)
      VALUES (?, ?, ?, 0, ?, ?)
    `).run(id, userId, tokenHash, expiresAt, now);
    return {
      id,
      userId,
      tokenHash,
      used: false,
      expiresAt,
      createdAt: now
    };
  }

  public verifyAndConsumeResetToken(tokenHash: string): string | null {
    const now = new Date().toISOString();
    const row = this.db.prepare(`
      SELECT id, user_id FROM password_resets
      WHERE token_hash = ? AND used = 0 AND expires_at > ?
    `).get(tokenHash, now) as any;

    if (!row) return null;
    this.db.prepare(`UPDATE password_resets SET used = 1 WHERE id = ?`).run(row.id);
    return row.user_id;
  }

  // ==========================================
  // DRAFTS METHODS (STRICT USER OWNERSHIP)
  // ==========================================
  public getUserDrafts(userId: string): FittingDraft[] {
    const rows = this.db.prepare(`
      SELECT * FROM drafts WHERE user_id = ? ORDER BY updated_at DESC
    `).all(userId) as any[];

    return rows.map(r => ({
      id: r.id,
      title: r.title,
      eventId: r.event_id,
      costumeId: r.costume_id,
      modelGender: r.model_gender,
      modelPose: r.model_pose,
      selectedColorId: r.selected_color_id,
      selectedMaterialId: r.selected_material_id,
      selectedAccessories: JSON.parse(r.selected_accessories_json || '[]'),
      selectedHairstyle: r.selected_hairstyle || 'Búi tóc đội khăn',
      selectedFootwear: r.selected_footwear || 'Guốc mộc truyền thống',
      selectedDetails: {},
      selectedBackgroundId: r.selected_background_id,
      remixStyle: r.remix_style,
      customPrompt: r.custom_prompt,
      visibleLayers: JSON.parse(r.visible_layers_json || '{}'),
      sketchDataUrl: r.sketch_data_url,
      createdAt: r.created_at,
      updatedAt: r.updated_at
    }));
  }

  public getDraftById(id: string, userId: string): FittingDraft | null {
    const r = this.db.prepare(`
      SELECT * FROM drafts WHERE id = ? AND user_id = ?
    `).get(id, userId) as any;

    if (!r) return null;
    return {
      id: r.id,
      title: r.title,
      eventId: r.event_id,
      costumeId: r.costume_id,
      modelGender: r.model_gender,
      modelPose: r.model_pose,
      selectedColorId: r.selected_color_id,
      selectedMaterialId: r.selected_material_id,
      selectedAccessories: JSON.parse(r.selected_accessories_json || '[]'),
      selectedHairstyle: r.selected_hairstyle || 'Búi tóc đội khăn',
      selectedFootwear: r.selected_footwear || 'Guốc mộc truyền thống',
      selectedDetails: {},
      selectedBackgroundId: r.selected_background_id,
      remixStyle: r.remix_style,
      customPrompt: r.custom_prompt,
      visibleLayers: JSON.parse(r.visible_layers_json || '{}'),
      sketchDataUrl: r.sketch_data_url,
      createdAt: r.created_at,
      updatedAt: r.updated_at
    };
  }

  public saveUserDraft(userId: string, input: Partial<FittingDraft>): FittingDraft {
    const now = new Date().toISOString();
    const id = input.id || ('draft-' + crypto.randomUUID().slice(0, 8));

    const existing = this.db.prepare(`SELECT id, user_id FROM drafts WHERE id = ?`).get(id) as any;
    if (existing && existing.user_id !== userId) {
      throw new Error('Bạn không có quyền sửa bản phác thảo của người khác.');
    }

    if (existing) {
      this.db.prepare(`
        UPDATE drafts SET
          title = ?,
          event_id = ?,
          costume_id = ?,
          model_gender = ?,
          model_pose = ?,
          selected_color_id = ?,
          selected_material_id = ?,
          selected_accessories_json = ?,
          selected_background_id = ?,
          remix_style = ?,
          custom_prompt = ?,
          visible_layers_json = ?,
          sketch_data_url = ?,
          updated_at = ?
        WHERE id = ? AND user_id = ?
      `).run(
        input.title || 'Bản phác thảo Việt phục',
        input.eventId || 'evt-tet',
        input.costumeId || 'cos-nhat-binh',
        input.modelGender || 'female',
        input.modelPose || 'standing_formal',
        input.selectedColorId || 'col-nb-red',
        input.selectedMaterialId || 'mat-gam-hue',
        JSON.stringify(input.selectedAccessories || []),
        input.selectedBackgroundId || 'bg-hoang-thanh',
        input.remixStyle || 'traditional',
        input.customPrompt || '',
        JSON.stringify(input.visibleLayers || {}),
        input.sketchDataUrl || '',
        now,
        id,
        userId
      );
    } else {
      this.db.prepare(`
        INSERT INTO drafts (
          id, user_id, title, event_id, costume_id, model_gender, model_pose,
          selected_color_id, selected_material_id, selected_accessories_json,
          selected_background_id, remix_style, custom_prompt, visible_layers_json,
          sketch_data_url, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        id,
        userId,
        input.title || 'Bản phác thảo Việt phục mới',
        input.eventId || 'evt-tet',
        input.costumeId || 'cos-nhat-binh',
        input.modelGender || 'female',
        input.modelPose || 'standing_formal',
        input.selectedColorId || 'col-nb-red',
        input.selectedMaterialId || 'mat-gam-hue',
        JSON.stringify(input.selectedAccessories || []),
        input.selectedBackgroundId || 'bg-hoang-thanh',
        input.remixStyle || 'traditional',
        input.customPrompt || '',
        JSON.stringify(input.visibleLayers || {}),
        input.sketchDataUrl || '',
        now,
        now
      );
    }

    return this.getDraftById(id, userId)!;
  }

  public deleteUserDraft(id: string, userId: string): boolean {
    const result = this.db.prepare(`DELETE FROM drafts WHERE id = ? AND user_id = ?`).run(id, userId);
    return (result as any).changes > 0;
  }

  // ==========================================
  // AI JOBS METHODS (STRICT LIMITS & ATOMIC LOCK)
  // ==========================================
  /**
   * Returns ISO string for the start of the current day in Vietnam Timezone (UTC+7)
   */
  public getStartOfTodayIso(): string {
    const now = new Date();
    const vnOffsetMs = 7 * 60 * 60 * 1000;
    const vnTime = new Date(now.getTime() + vnOffsetMs);
    vnTime.setUTCHours(0, 0, 0, 0);
    return new Date(vnTime.getTime() - vnOffsetMs).toISOString();
  }

  /**
   * Get total and daily AI usage for a user
   */
  public getUserAIUsage(userId: string): {
    usage: number;
    max: number;
    totalUsage: number;
    totalMax: number;
  } {
    const startOfTodayIso = this.getStartOfTodayIso();
    const dailyRow = this.db.prepare(`
      SELECT COUNT(*) as count FROM ai_usage_log
      WHERE user_id = ? AND created_at >= ?
    `).get(userId, startOfTodayIso) as any;

    const totalRow = this.db.prepare(`
      SELECT COUNT(*) as count FROM ai_usage_log
      WHERE user_id = ?
    `).get(userId) as any;

    return {
      usage: dailyRow?.count || 0,
      max: 5,
      totalUsage: totalRow?.count || 0,
      totalMax: 20
    };
  }

  /**
   * Backwards-compatible daily AI usage
   */
  public getUserDailyAIUsage(userId: string): { usage: number; max: number; totalUsage: number; totalMax: number } {
    return this.getUserAIUsage(userId);
  }

  /**
   * Atomic check & creation of AI Job within an IMMEDIATE transaction.
   * Eliminates race conditions from concurrent tabs or repeated clicks.
   */
  public atomicCreateAIJob(userId: string, input: {
    draftId?: string;
    costumeId: string;
    costumeName: string;
    eventName: string;
    remixStyle: string;
    modelGender?: 'male' | 'female';
    colorName?: string;
    materialName?: string;
    accessories?: string[];
    backgroundName?: string;
    customPrompt?: string;
    referenceImageUrl?: string;
    sketchDataUrl: string;
    promptUsed: string;
  }): { success: true; job: DetailedAIJob } | { success: false; statusCode: number; reason: string } {
    const maxDaily = 5;
    const maxTotal = 20;
    const startOfTodayIso = this.getStartOfTodayIso();

    try {
      this.db.exec('BEGIN IMMEDIATE;');

      // 1. Concurrency limit: Exactly 1 active job per user
      const activeRow = this.db.prepare(`
        SELECT COUNT(*) as count FROM ai_jobs
        WHERE user_id = ? AND status IN ('queued', 'processing')
      `).get(userId) as any;
      if ((activeRow?.count || 0) >= 1) {
        this.db.exec('ROLLBACK;');
        return {
          success: false,
          statusCode: 409,
          reason: 'Tài khoản của bạn đang có 1 tác vụ AI đang thực hiện. Vui lòng chờ tác vụ hoàn thành trước khi tạo tiếp.'
        };
      }

      // 2. Total lifetime limit: Maximum 20 jobs total per account
      const totalRow = this.db.prepare(`
        SELECT COUNT(*) as count FROM ai_usage_log
        WHERE user_id = ?
      `).get(userId) as any;
      const totalUsage = totalRow?.count || 0;
      if (totalUsage >= maxTotal) {
        this.db.exec('ROLLBACK;');
        return {
          success: false,
          statusCode: 429,
          reason: `Bạn đã đạt giới hạn tổng cộng tối đa ${maxTotal} lượt tạo ảnh AI cho tài khoản này. Vui lòng liên hệ quản trị viên để mở rộng hạn mức.`
        };
      }

      // 3. Daily limit: Maximum 5 jobs per day
      const usageRow = this.db.prepare(`
        SELECT COUNT(*) as count FROM ai_usage_log
        WHERE user_id = ? AND created_at >= ?
      `).get(userId, startOfTodayIso) as any;
      const todayUsage = usageRow?.count || 0;
      if (todayUsage >= maxDaily) {
        this.db.exec('ROLLBACK;');
        return {
          success: false,
          statusCode: 429,
          reason: `Bạn đã đạt giới hạn tối đa ${maxDaily} lượt tạo ảnh AI trong ngày hôm nay. Vui lòng quay lại vào ngày mai để tiếp tục sáng tạo.`
        };
      }

      // 4. Global system safety cap: Max 5 concurrent jobs system-wide
      const globalActive = this.db.prepare(`
        SELECT COUNT(*) as count FROM ai_jobs
        WHERE status IN ('queued', 'processing')
      `).get() as any;
      if ((globalActive?.count || 0) >= 5) {
        this.db.exec('ROLLBACK;');
        return {
          success: false,
          statusCode: 503,
          reason: 'Hệ thống đang phục vụ tối đa lượt tạo ảnh đồng thời. Vui lòng đợi trong giây lát và thử lại.'
        };
      }

      // 4. Insert AI job
      const jobId = 'job-' + crypto.randomUUID().slice(0, 8);
      const now = new Date().toISOString();

      this.db.prepare(`
        INSERT INTO ai_jobs (
          id, user_id, draft_id, status, costume_id, costume_name, event_name,
          remix_style, model_gender, color_name, material_name, accessories_json,
          background_name, custom_prompt, reference_image_url, sketch_data_url,
          prompt_used, progress, created_at
        ) VALUES (?, ?, ?, 'queued', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 5, ?)
      `).run(
        jobId,
        userId,
        input.draftId || null,
        input.costumeId,
        input.costumeName,
        input.eventName,
        input.remixStyle,
        input.modelGender || 'female',
        input.colorName || '',
        input.materialName || '',
        JSON.stringify(input.accessories || []),
        input.backgroundName || '',
        input.customPrompt || '',
        input.referenceImageUrl || '',
        input.sketchDataUrl,
        input.promptUsed,
        now
      );

      // 5. Insert usage log
      const usageId = 'usg-' + crypto.randomUUID().slice(0, 8);
      this.db.prepare(`
        INSERT INTO ai_usage_log (id, user_id, job_id, action_type, created_at)
        VALUES (?, ?, ?, 'create', ?)
      `).run(usageId, userId, jobId, now);

      this.db.exec('COMMIT;');

      const job = this.getDetailedAIJobById(jobId, userId)!;
      return { success: true, job };
    } catch (err: any) {
      try { this.db.exec('ROLLBACK;'); } catch {}
      console.error('Failed to create AI job in atomic transaction:', err);
      return {
        success: false,
        statusCode: 500,
        reason: 'Lỗi ghi cơ sở dữ liệu khi tạo tác vụ AI: ' + (err.message || 'Lỗi không xác định')
      };
    }
  }

  /**
   * Atomic check & retry of AI Job within an IMMEDIATE transaction.
   * Strictly enforces concurrency (1 job) and counts toward daily quota (5/day).
   */
  public atomicRetryAIJob(jobId: string, userId: string):
    { success: true; job: DetailedAIJob } | { success: false; statusCode: number; reason: string } {
    const maxDaily = 5;
    const maxTotal = 20;
    const startOfTodayIso = this.getStartOfTodayIso();

    try {
      this.db.exec('BEGIN IMMEDIATE;');

      // 1. Verify job exists and belongs to this user
      const existing = this.db.prepare(`
        SELECT * FROM ai_jobs WHERE id = ? AND user_id = ?
      `).get(jobId, userId) as any;
      if (!existing) {
        this.db.exec('ROLLBACK;');
        return {
          success: false,
          statusCode: 404,
          reason: 'Không tìm thấy tác vụ AI hoặc bạn không có quyền thử lại tác vụ này.'
        };
      }

      // 2. Concurrency limit: Exactly 1 active job per user
      const activeRow = this.db.prepare(`
        SELECT COUNT(*) as count FROM ai_jobs
        WHERE user_id = ? AND status IN ('queued', 'processing')
      `).get(userId) as any;
      if ((activeRow?.count || 0) >= 1) {
        this.db.exec('ROLLBACK;');
        return {
          success: false,
          statusCode: 409,
          reason: 'Tài khoản của bạn đang có 1 tác vụ AI đang thực hiện. Vui lòng chờ tác vụ hoàn thành trước khi thử lại.'
        };
      }

      // 3. Total lifetime limit: Maximum 20 jobs
      const totalRow = this.db.prepare(`
        SELECT COUNT(*) as count FROM ai_usage_log
        WHERE user_id = ?
      `).get(userId) as any;
      const totalUsage = totalRow?.count || 0;
      if (totalUsage >= maxTotal) {
        this.db.exec('ROLLBACK;');
        return {
          success: false,
          statusCode: 429,
          reason: `Bạn đã đạt giới hạn tổng cộng tối đa ${maxTotal} lượt tạo ảnh AI cho tài khoản này.`
        };
      }

      // 4. Daily limit: Maximum 5 jobs per day (applies to retries)
      const usageRow = this.db.prepare(`
        SELECT COUNT(*) as count FROM ai_usage_log
        WHERE user_id = ? AND created_at >= ?
      `).get(userId, startOfTodayIso) as any;
      const todayUsage = usageRow?.count || 0;
      if (todayUsage >= maxDaily) {
        this.db.exec('ROLLBACK;');
        return {
          success: false,
          statusCode: 429,
          reason: `Bạn đã đạt giới hạn tối đa ${maxDaily} lượt tạo ảnh AI trong ngày hôm nay (áp dụng cả khi thử lại).`
        };
      }

      // 4. Global system safety cap
      const globalActive = this.db.prepare(`
        SELECT COUNT(*) as count FROM ai_jobs
        WHERE status IN ('queued', 'processing')
      `).get() as any;
      if ((globalActive?.count || 0) >= 5) {
        this.db.exec('ROLLBACK;');
        return {
          success: false,
          statusCode: 503,
          reason: 'Hệ thống đang phục vụ tối đa lượt tạo ảnh đồng thời. Vui lòng đợi trong giây lát và thử lại.'
        };
      }

      // 5. Update job status to queued
      this.db.prepare(`
        UPDATE ai_jobs
        SET status = 'queued', progress = 5, error_message = NULL, completed_at = NULL
        WHERE id = ? AND user_id = ?
      `).run(jobId, userId);

      // 6. Log retry in ai_usage_log
      const usageId = 'usg-' + crypto.randomUUID().slice(0, 8);
      const now = new Date().toISOString();
      this.db.prepare(`
        INSERT INTO ai_usage_log (id, user_id, job_id, action_type, created_at)
        VALUES (?, ?, ?, 'retry', ?)
      `).run(usageId, userId, jobId, now);

      this.db.exec('COMMIT;');

      const job = this.getDetailedAIJobById(jobId, userId)!;
      return { success: true, job };
    } catch (err: any) {
      try { this.db.exec('ROLLBACK;'); } catch {}
      console.error('Failed to retry AI job in atomic transaction:', err);
      return {
        success: false,
        statusCode: 500,
        reason: 'Lỗi ghi cơ sở dữ liệu khi thử lại tác vụ AI: ' + (err.message || 'Lỗi không xác định')
      };
    }
  }

  public checkAndReserveAIJobSlot(userId: string): {
    allowed: boolean;
    reason?: string;
    todayUsage: number;
    maxDaily: number;
    activeCount: number;
  } {
    const maxDaily = 5;
    const startOfTodayIso = this.getStartOfTodayIso();

    const activeRow = this.db.prepare(`
      SELECT COUNT(*) as count FROM ai_jobs
      WHERE user_id = ? AND status IN ('queued', 'processing')
    `).get(userId) as any;

    const activeCount = activeRow?.count || 0;
    if (activeCount >= 1) {
      return {
        allowed: false,
        reason: 'Tài khoản của bạn đang có 1 tác vụ AI đang thực hiện. Vui lòng chờ tác vụ hoàn thành trước khi tạo tiếp.',
        todayUsage: 0,
        maxDaily,
        activeCount
      };
    }

    const todayRow = this.db.prepare(`
      SELECT COUNT(*) as count FROM ai_usage_log
      WHERE user_id = ? AND created_at >= ?
    `).get(userId, startOfTodayIso) as any;

    const todayUsage = todayRow?.count || 0;
    if (todayUsage >= maxDaily) {
      return {
        allowed: false,
        reason: `Bạn đã đạt giới hạn tối đa ${maxDaily} lượt tạo ảnh AI trong ngày hôm nay. Vui lòng quay lại vào ngày mai để tiếp tục sáng tạo.`,
        todayUsage,
        maxDaily,
        activeCount
      };
    }

    return {
      allowed: true,
      todayUsage,
      maxDaily,
      activeCount
    };
  }

  public createDetailedAIJob(userId: string, input: {
    draftId?: string;
    costumeId: string;
    costumeName: string;
    eventName: string;
    remixStyle: string;
    modelGender?: 'male' | 'female';
    colorName?: string;
    materialName?: string;
    accessories?: string[];
    backgroundName?: string;
    customPrompt?: string;
    referenceImageUrl?: string;
    sketchDataUrl: string;
    promptUsed: string;
  }): DetailedAIJob {
    const res = this.atomicCreateAIJob(userId, input);
    if (!res.success) {
      throw new Error(res.reason);
    }
    return res.job;
  }

  public getUserAIJobs(userId: string): DetailedAIJob[] {
    const rows = this.db.prepare(`
      SELECT * FROM ai_jobs WHERE user_id = ? ORDER BY created_at DESC
    `).all(userId) as any[];

    return rows.map(r => this.mapRowToDetailedJob(r));
  }

  public getDetailedAIJobById(id: string, userId?: string): DetailedAIJob | null {
    let row: any;
    if (userId) {
      row = this.db.prepare(`SELECT * FROM ai_jobs WHERE id = ? AND user_id = ?`).get(id, userId);
    } else {
      row = this.db.prepare(`SELECT * FROM ai_jobs WHERE id = ?`).get(id);
    }
    if (!row) return null;
    return this.mapRowToDetailedJob(row);
  }

  public updateDetailedAIJob(id: string, updates: Partial<DetailedAIJob>): DetailedAIJob | null {
    const fields: string[] = [];
    const values: any[] = [];

    if (updates.status !== undefined) {
      fields.push('status = ?');
      values.push(updates.status);
    }
    if (updates.progress !== undefined) {
      fields.push('progress = ?');
      values.push(updates.progress);
    }
    if (updates.resultImageUrl !== undefined) {
      fields.push('result_image_url = ?');
      values.push(updates.resultImageUrl);
    }
    if (updates.errorMessage !== undefined) {
      fields.push('error_message = ?');
      values.push(updates.errorMessage);
    }
    if (updates.completedAt !== undefined) {
      fields.push('completed_at = ?');
      values.push(updates.completedAt);
    }

    if (fields.length === 0) return this.getDetailedAIJobById(id);

    values.push(id);
    this.db.prepare(`UPDATE ai_jobs SET ${fields.join(', ')} WHERE id = ?`).run(...values);
    return this.getDetailedAIJobById(id);
  }

  public deleteUserAIJob(id: string, userId: string): {
    success: boolean;
    statusCode?: number;
    error?: string;
  } {
    const job = this.db.prepare(`
      SELECT id, status, user_id FROM ai_jobs WHERE id = ? AND user_id = ?
    `).get(id, userId) as any;

    if (!job) {
      return {
        success: false,
        statusCode: 404,
        error: 'Tác vụ AI không tồn tại hoặc bạn không có quyền xóa.'
      };
    }

    // STRICT CHECK: Cannot delete running or queued job to bypass concurrency limit
    if (job.status === 'queued' || job.status === 'processing') {
      return {
        success: false,
        statusCode: 409,
        error: 'Không thể xóa tác vụ AI đang thực hiện (đang chờ hoặc đang xử lý). Vui lòng đợi tác vụ hoàn tất trước khi xóa khỏi tủ đồ.'
      };
    }

    const res = this.db.prepare(`DELETE FROM ai_jobs WHERE id = ? AND user_id = ?`).run(id, userId);
    return { success: (res as any).changes > 0 };
  }

  public getAIJobByResultFilename(filename: string): DetailedAIJob | null {
    const row = this.db.prepare(`
      SELECT * FROM ai_jobs WHERE result_image_url LIKE ? OR id = ?
    `).get(`%${filename}%`, filename.replace(/^ai-|^remix-|\.png$|\.jpg$/g, '')) as any;
    if (!row) return null;
    return this.mapRowToDetailedJob(row);
  }

  private mapRowToDetailedJob(r: any): DetailedAIJob {
    return {
      id: r.id,
      userId: r.user_id,
      draftId: r.draft_id || undefined,
      status: r.status,
      costumeId: r.costume_id,
      costumeName: r.costume_name,
      eventName: r.event_name,
      remixStyle: r.remix_style,
      modelGender: r.model_gender || 'female',
      colorName: r.color_name || '',
      materialName: r.material_name || '',
      accessories: JSON.parse(r.accessories_json || '[]'),
      backgroundName: r.background_name || '',
      customPrompt: r.custom_prompt || '',
      referenceImageUrl: r.reference_image_url || '',
      sketchDataUrl: r.sketch_data_url,
      resultImageUrl: r.result_image_url || undefined,
      promptUsed: r.prompt_used || '',
      errorMessage: r.error_message || undefined,
      progress: r.progress,
      createdAt: r.created_at,
      completedAt: r.completed_at || undefined
    };
  }

  // Cultural static references (Read-Only)
  public getEvents(): EventItem[] {
    return INITIAL_EVENTS;
  }
  public getCostumes(eventId?: string, gender?: string, era?: string): Costume[] {
    let list = INITIAL_COSTUMES;
    if (eventId) {
      list = list.filter(c => c.suitability.some(s => s.eventId === eventId));
    }
    if (gender && gender !== 'all') {
      list = list.filter(c => c.gender === gender || c.gender === 'unisex');
    }
    if (era && era !== 'all') {
      list = list.filter(c => c.era.toLowerCase().includes(era.toLowerCase()));
    }
    return list;
  }
  public getCostumeById(id: string): Costume | undefined {
    return INITIAL_COSTUMES.find(c => c.id === id || c.slug === id);
  }
  public getBackgrounds(): BackgroundSetting[] {
    return INITIAL_BACKGROUNDS;
  }
}

// Singleton database instance
export const sqliteDb = new SQLiteDatabase();
