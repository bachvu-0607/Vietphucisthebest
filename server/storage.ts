import 'dotenv/config';
import path from 'node:path';
import os from 'node:os';

// SQLite requires a persistent local filesystem with working file locks.
// npm run dev explicitly permits disposable preview data, never production data.
const ephemeralPreview = Boolean(process.env.K_SERVICE)
  && process.env.SQLITE_PERSISTENT_STORAGE !== 'true'
  && process.env.NODE_ENV !== 'production'
  && process.argv.includes('--ephemeral-preview');
if (process.env.K_SERVICE && process.env.SQLITE_PERSISTENT_STORAGE !== 'true' && !ephemeralPreview) {
  throw new Error('Cloud Run: configure persistent SQLite storage or move to a persistent server before starting. See DEPLOYMENT.md.');
}
if (ephemeralPreview) {
  console.warn('AI Studio preview uses temporary test data. Accounts, saved outfits and images may disappear when the container is replaced.');
}
export const DATA_DIR = path.resolve(ephemeralPreview
  ? path.join(os.tmpdir(), 'vietphuc-preview')
  : process.env.DATA_DIR || path.join(process.cwd(), 'data'));
export const RESULTS_DIR = path.join(DATA_DIR, 'results');
export const BACKUPS_DIR = path.resolve(ephemeralPreview
  ? path.join(DATA_DIR, 'backups')
  : process.env.BACKUPS_DIR || path.join(DATA_DIR, 'backups'));


export function positiveLimit(name: string, fallback: number): number {
  const value = Number(process.env[name] ?? fallback);
  if (!Number.isSafeInteger(value) || value < 1) throw new Error(`${name} must be a positive integer.`);
  return value;
}
