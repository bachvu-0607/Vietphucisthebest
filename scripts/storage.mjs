import { lockStorageForRestore } from '../server/instance-lock.mjs';
import 'dotenv/config';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { DatabaseSync } from 'node:sqlite';

const dir = path.resolve(process.env.DATA_DIR || 'data');
const dbPath = path.join(dir, 'vietphucremix.sqlite');
const backupDir = path.resolve(process.env.BACKUPS_DIR || path.join(dir, 'backups'));
if (!fs.existsSync(dbPath)) throw new Error('Database does not exist.');
const [command, input] = process.argv.slice(2);
if (command === 'backup') {
  fs.mkdirSync(backupDir, { recursive: true });
  const filename = path.join(backupDir, `vietphucremix-${Date.now()}-${crypto.randomUUID()}.sqlite`);
  const db = new DatabaseSync(dbPath);
  try { db.prepare('VACUUM INTO ?').run(filename); } finally { db.close(); }
  console.log(filename);
} else if (command === 'restore') {
  if (!input) throw new Error('Usage: npm run restore -- /absolute/path/to/backup.sqlite');
  const release = lockStorageForRestore();
  try {
  // Validate BEFORE touching the current database.
  const snapshot = new DatabaseSync(path.resolve(input), { readOnly: true });
  try {
    if (snapshot.prepare('PRAGMA integrity_check').get().integrity_check !== 'ok') throw new Error('Invalid backup.');
    for (const table of ['users', 'sessions', 'drafts', 'ai_jobs', 'ai_usage_log']) snapshot.prepare(`SELECT COUNT(*) FROM ${table}`).get();
  } finally { snapshot.close(); }
  fs.mkdirSync(backupDir, { recursive: true });
  const current = new DatabaseSync(dbPath);
  try { current.prepare('VACUUM INTO ?').run(path.join(backupDir, `vietphucremix-before-restore-${Date.now()}.sqlite`)); }
  finally { current.close(); }
  const temp = dbPath + '.restore-' + crypto.randomUUID();
  fs.copyFileSync(path.resolve(input), temp);
  for (const suffix of ['-wal', '-shm']) if (fs.existsSync(dbPath + suffix)) fs.unlinkSync(dbPath + suffix);
  fs.renameSync(temp, dbPath);
  const restored = new DatabaseSync(dbPath);
  try { restored.exec('UPDATE sessions SET is_revoked = 1; DELETE FROM password_resets;'); } finally { restored.close(); }
  console.log('Restored database; all previous sessions revoked. Restore matching result images separately.');
  } finally { release(); }
} else throw new Error('Use backup or restore.');
