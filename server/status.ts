import fs from 'node:fs';
import { DATA_DIR, BACKUPS_DIR } from './storage.ts';
import { sqliteDb } from './sqlite.ts';
import { monitor } from './monitor.ts';
let cached: any = null;
let updatedAt = 0;
export function systemStatus() {
  if (cached && Date.now()-updatedAt<60000) return cached;
  const ai=sqliteDb.operationalStats();
  let disk: null | {total:number;free:number;usedPercent:number}=null;
  let lastBackup: number|null=null;
  try { const s=fs.statfsSync(DATA_DIR);disk={total:s.blocks*s.bsize,free:s.bavail*s.bsize,usedPercent:Math.round(100*(1-s.bavail/s.blocks))}; } catch {monitor.event('disk_check_failed','warn');}
  try { for(const f of fs.readdirSync(BACKUPS_DIR).filter(f=>f.endsWith('.sqlite'))) {const t=fs.statSync(`${BACKUPS_DIR}/${f}`).mtimeMs;lastBackup=Math.max(lastBackup||0,t);} } catch {monitor.event('backup_check_failed','warn');}
  const snapshot=monitor.snapshot();
  const outcomes=snapshot.last15m.completed+snapshot.last15m.failed;
  monitor.alert('disk_low','Ổ đĩa đã dùng từ 80%.',!!disk && disk.usedPercent>=80);
  monitor.alert('backup_stale','Không có backup database trong 2 giờ qua.',!lastBackup || Date.now()-lastBackup>2*3600000);
  monitor.alert('ai_failures','AI lỗi ít nhất 3 lượt và từ 50% số lượt kết thúc trong 15 phút.',snapshot.last15m.failed>=3 && snapshot.last15m.failed/outcomes>=0.5);
  monitor.alert('http_errors','Có ít nhất 5 lỗi máy chủ trong 15 phút.',snapshot.last15m.errors>=5);
  monitor.alert('ai_quota_near','Đã dùng từ 80% hạn mức AI toàn hệ thống trong ngày.',ai.dailyUsage>=ai.dailyLimit*0.8);
  monitor.alert('monitor_unavailable','Không lưu/đọc được thống kê giám sát.',!snapshot.available);
  cached={...monitor.snapshot(),ai,disk,lastBackup,checkedAt:new Date().toISOString(),uptimeSeconds:Math.floor(process.uptime())};
  updatedAt=Date.now();return cached;
}
