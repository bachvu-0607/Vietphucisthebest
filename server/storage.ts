import 'dotenv/config';
import path from 'node:path';

// SQLite requires a persistent local filesystem with working file locks.
if (process.env.K_SERVICE && process.env.SQLITE_PERSISTENT_STORAGE !== 'true') {
  throw new Error('Cloud Run: configure persistent SQLite storage or move to a persistent server before starting. See DEPLOYMENT.md.');
}
export const DATA_DIR = path.resolve(process.env.DATA_DIR || path.join(process.cwd(), 'data'));
export const RESULTS_DIR = path.join(DATA_DIR, 'results');
export const BACKUPS_DIR = path.resolve(process.env.BACKUPS_DIR || path.join(DATA_DIR, 'backups'));


export function positiveLimit(name: string, fallback: number): number {
  const value = Number(process.env[name] ?? fallback);
  if (!Number.isSafeInteger(value) || value < 1) throw new Error(`${name} must be a positive integer.`);
  return value;
}
