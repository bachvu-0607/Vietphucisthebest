import 'dotenv/config';
import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';
import fs from 'node:fs';
const email=process.argv[2]?.trim().toLowerCase();
if(!email) throw new Error('Usage: npm run admin -- existing-account-email');
const file=path.resolve(process.env.DATA_DIR||'data','vietphucremix.sqlite');
if(!fs.existsSync(file)) throw new Error('Database does not exist. Run on the server with the mounted data volume.');
const db=new DatabaseSync(file);db.exec('PRAGMA busy_timeout=5000');
try {
  const result=db.prepare("UPDATE users SET role='admin' WHERE lower(email)=?").run(email);
  if(!result.changes) throw new Error('Account not found. Register the intended account first.');
  console.log('Existing account granted admin access. Reload the website.');
} finally {db.close();}
