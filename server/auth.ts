import 'dotenv/config';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'node:crypto';
import type { Request, Response, NextFunction } from 'express';
import { sqliteDb, type UserRecord } from './sqlite.ts';

if (process.env.NODE_ENV === 'production' && (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32)) {
  throw new Error('JWT_SECRET must contain at least 32 characters in production.');
}
export const JWT_SECRET = process.env.JWT_SECRET || crypto.randomBytes(32).toString('hex');
export const SESSION_COOKIE = 'vietphuc_session';
export function setSessionCookie(res: Response, token: string): void {
  res.cookie(SESSION_COOKIE, token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict', path: '/', maxAge: 7 * 86400000 });
}
export function clearSessionCookie(res: Response): void {
  res.clearCookie(SESSION_COOKIE, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict', path: '/' });
}
const TOKEN_EXPIRY_DAYS = 7;

export interface TokenPayload {
  userId: string;
  email: string;
  role: 'user' | 'admin';
  sessionId?: string;
}

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    name: string;
    role: 'user' | 'admin';
    recoveryCode?: string;
  };
  tokenHash?: string;
}

/**
 * Hash password securely with bcrypt salt rounds = 10
 */
export async function hashPassword(plainText: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(plainText, salt);
}

/**
 * Verify password against bcrypt hash
 */
export async function verifyPassword(plainText: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plainText, hash);
}

/**
 * Hash raw token for secure database storage / revocation lookup
 */
export function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

/**
 * Issue a signed JWT and persist session record in SQLite
 */
export function issueUserToken(user: UserRecord): { token: string; expiresAt: string } {
  const expiresDate = new Date();
  expiresDate.setDate(expiresDate.getDate() + TOKEN_EXPIRY_DAYS);
  const expiresAt = expiresDate.toISOString();

  const payload: TokenPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
    sessionId: crypto.randomUUID()
  };

  const token = jwt.sign(payload, JWT_SECRET, {
    expiresIn: `${TOKEN_EXPIRY_DAYS}d`
  });

  const tokenHash = hashToken(token);
  sqliteDb.createSession(user.id, tokenHash, expiresAt);

  return { token, expiresAt };
}

/**
 * Revoke an active token
 */
export function revokeUserToken(token: string): void {
  const tokenHash = hashToken(token);
  sqliteDb.revokeSession(tokenHash);
}

/**
 * Generate password reset token
 */
export function createPasswordResetToken(user: UserRecord): { rawToken: string; expiresAt: string } {
  const rawToken = crypto.randomBytes(32).toString('hex');
  const tokenHash = hashToken(rawToken);
  const expiresDate = new Date();
  expiresDate.setHours(expiresDate.getHours() + 1); // 1 hour validity
  const expiresAt = expiresDate.toISOString();

  sqliteDb.createPasswordReset(user.id, tokenHash, expiresAt);
  return { rawToken, expiresAt };
}

/**
 * Extract token from Authorization header or HttpOnly cookie
 */
export function extractToken(req: Request): string | null {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7).trim();
  }
  const cookie = req.headers.cookie?.split(';').map(v => v.trim()).find(v => v.startsWith(SESSION_COOKIE + '='));
  if (cookie) {
    try { return decodeURIComponent(cookie.slice(SESSION_COOKIE.length + 1)); } catch { return null; }
  }
  return null;
}

/**
 * Express Middleware: Enforce Authentication
 */
export function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  const token = extractToken(req);
  if (!token) {
    res.status(401).json({
      success: false,
      error: 'Vui lòng đăng nhập để thực hiện chức năng này.'
    });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
    const tokenHash = hashToken(token);

    // Verify session is not revoked in SQLite
    if (!sqliteDb.isSessionActive(tokenHash)) {
      res.status(401).json({
        success: false,
        error: 'Phiên đăng nhập đã hết hạn hoặc bị thu hồi. Vui lòng đăng nhập lại.'
      });
      return;
    }

    const user = sqliteDb.getUserById(decoded.userId);
    if (!user) {
      res.status(401).json({
        success: false,
        error: 'Tài khoản không tồn tại trên hệ thống.'
      });
      return;
    }

    req.user = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    };
    req.tokenHash = tokenHash;
    next();
  } catch (err: any) {
    res.status(401).json({
      success: false,
      error: 'Phiên đăng nhập không hợp lệ hoặc đã hết hạn.'
    });
  }
}

/**
 * Express Middleware: Optional Authentication (guest allowed, attaches user if present)
 */
export function optionalAuth(req: AuthenticatedRequest, _res: Response, next: NextFunction): void {
  const token = extractToken(req);
  if (!token) {
    return next();
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
    const tokenHash = hashToken(token);
    if (sqliteDb.isSessionActive(tokenHash)) {
      const user = sqliteDb.getUserById(decoded.userId);
      if (user) {
        req.user = {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        };
        req.tokenHash = tokenHash;
      }
    }
  } catch {
    // Ignore invalid token in optional auth
  }
  next();
}
