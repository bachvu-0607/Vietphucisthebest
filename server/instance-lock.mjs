import 'dotenv/config';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import lockfile from 'proper-lockfile';

export const storageDir = path.resolve(process.env.DATA_DIR || 'data');
const options = { stale: 30000, update: 5000, lockfilePath: path.join(storageDir, '.server.lock') };

export function lockStorageForRestore() {
  // Acquire the same exclusive lock as the server, before replacing the database.
  return lockfile.lockSync(storageDir, options);
}

// Imported by sqlite.ts: acquire BEFORE database initialization or job recovery.
const entry = fileURLToPath(new URL('../server.ts', import.meta.url));
if (process.argv[1] && path.resolve(process.argv[1]) === entry) {
  fs.mkdirSync(storageDir, { recursive: true });
  await lockfile.lock(storageDir, {
    ...options,
    retries: { retries: 10, factor: 1, minTimeout: 4000, maxTimeout: 4000 },
  });
  // proper-lockfile refreshes the lease and releases on process exit.
  // After SIGKILL, the lease expires; PID reuse across containers is irrelevant.
}
