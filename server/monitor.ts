import { DatabaseSync } from 'node:sqlite';
import fs from 'node:fs';
import path from 'node:path';
import { DATA_DIR } from './storage.ts';

type Metric = 'requests' | 'errors' | 'limited' | 'completed' | 'failed' | 'interrupted' | 'durationMs' | 'openaiCalls' | 'googleCalls';
const keys: Metric[] = ['requests','errors','limited','completed','failed','interrupted','durationMs','openaiCalls','googleCalls'];
const empty = () => Object.fromEntries(keys.map(k => [k, 0])) as Record<Metric, number>;
export class Monitor {
  private db: DatabaseSync | null = null;
  private pending = new Map<number, Record<Metric, number>>();
  private muted = new Map<string, number>();
  private lastWarning = 0;
  private alerts = new Map<string, string>();
  constructor(directory: string) {
    try {
      fs.mkdirSync(directory, {recursive:true});
      this.db = new DatabaseSync(path.join(directory, 'monitor.sqlite'));
      this.db.exec(`PRAGMA busy_timeout=100; PRAGMA journal_mode=DELETE; PRAGMA max_page_count=4096;
        CREATE TABLE IF NOT EXISTS minutes (time INTEGER PRIMARY KEY, requests INTEGER, errors INTEGER, limited INTEGER, completed INTEGER, failed INTEGER, interrupted INTEGER, durationMs INTEGER, openaiCalls INTEGER, googleCalls INTEGER);
        CREATE TABLE IF NOT EXISTS events (id INTEGER PRIMARY KEY, time INTEGER, level TEXT, code TEXT, count INTEGER);
        CREATE INDEX IF NOT EXISTS events_time ON events(time);`);
    } catch { this.storageError(); }
  }
  private storageError() {
    if (Date.now()-this.lastWarning > 60000) {
      console.error(JSON.stringify({time:new Date().toISOString(),level:'error',code:'monitor_storage_unavailable'}));
      this.lastWarning=Date.now();
    }
  }
  count(key: Metric, value=1) {
    const time=Math.floor(Date.now()/60000)*60000;
    if (!this.pending.has(time)) this.pending.set(time,empty());
    this.pending.get(time)![key]+=value;
    // Bound memory even when the disk is unavailable.
    while(this.pending.size>60) this.pending.delete(this.pending.keys().next().value!);
  }
  event(code: string, level='info', count=1) {
    // Callers supply fixed event codes only. Never accept exception text/request data.
    if (!/^[a-z_]{1,64}$/.test(code)) return;
    const now=Date.now();
    if(now-(this.muted.get(code)||0)<60000) return;
    this.muted.set(code,now);
    if(this.muted.size>64) this.muted.delete(this.muted.keys().next().value!);
    console.log(JSON.stringify({time:new Date(now).toISOString(),level,code,count}));
    try {
      this.db?.prepare('INSERT INTO events(time,level,code,count) VALUES(?,?,?,?)').run(now,level,code,count);
      this.db?.exec('DELETE FROM events WHERE id NOT IN (SELECT id FROM events ORDER BY id DESC LIMIT 1000)');
    } catch { this.storageError(); }
  }
  flush() {
    if(!this.db) return;
    try {
      this.db.exec('BEGIN');
      for(const [time,c] of this.pending) this.db.prepare(`INSERT INTO minutes VALUES(?,?,?,?,?,?,?,?,?,?) ON CONFLICT(time) DO UPDATE SET ${keys.map(k=>`${k}=${k}+excluded.${k}`).join(',')}`).run(time,...keys.map(k=>c[k]));
      this.db.prepare('DELETE FROM minutes WHERE time < ?').run(Date.now()-7*86400000);
      this.db.prepare('DELETE FROM events WHERE time < ?').run(Date.now()-7*86400000);
      this.db.exec('COMMIT'); this.pending.clear();
    } catch { try {this.db.exec('ROLLBACK');} catch {} this.storageError(); }
  }
  snapshot() {
    this.flush();
    try {
    const rows=this.db?.prepare('SELECT * FROM minutes ORDER BY time').all() as any[] || [];
    const sum=(since:number)=>rows.filter(r=>r.time>=since).reduce((a,r)=>{for(const k of keys)a[k]+=r[k];return a;},empty());
    return {available:!!this.db && Date.now()-this.lastWarning>60000, since:rows[0]?.time??null,
      last15m:sum(Date.now()-15*60000),last24h:sum(Date.now()-86400000),
      events:this.db?.prepare('SELECT time,level,code,count FROM events ORDER BY id DESC LIMIT 50').all()||[],
      alerts:[...this.alerts].map(([code,message])=>({code,message}))};
    } catch { this.storageError(); return {available:false,since:null,last15m:empty(),last24h:empty(),events:[],alerts:[...this.alerts].map(([code,message])=>({code,message}))}; }
  }
  alert(code:string, message:string, active:boolean) {
    if(active && !this.alerts.has(code)) {this.alerts.set(code,message);this.event(code,'warn');}
    if(!active && this.alerts.delete(code)) this.event(code+'_resolved');
  }
  close(){this.flush();this.db?.close();this.db=null;}
}
export const monitor = new Monitor(DATA_DIR);

export function recordFailure(source: 'api' | 'ai_provider' | 'chat' | 'backup' | 'http', error: any) {
  const status=Number(error?.status);
  const code=error?.code;
  const category = status===429 ? 'rate_limited'
    : status===401 || status===403 ? 'credentials'
    : code==='ENOSPC' || error?.errcode===13 ? 'disk_full'
    : code==='EACCES' || code==='EPERM' ? 'permission'
    : code==='ETIMEDOUT' || error?.name==='AbortError' || error?.name==='APIConnectionTimeoutError' ? 'timeout'
    : status===400 || status===404 ? 'bad_request'
    : code==='ECONNRESET' || code==='ENOTFOUND' || code==='ECONNREFUSED' ? 'network'
    : code==='ERR_SQLITE_ERROR' ? 'database'
    : status>=500 ? 'upstream' : 'unknown';
  monitor.event(`${source}_${category}`, 'error');
}
