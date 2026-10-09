import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
const dir=fs.mkdtempSync(path.join(os.tmpdir(),'vietphuc-monitor-'));
process.env.DATA_DIR=dir;
const {Monitor,monitor}=await import('../server/monitor.ts');
test('bounded monitoring aggregates, prunes and deduplicates alerts',()=>{
  const m=new Monitor(path.join(dir,'isolated'));
  const original=console.log;const printed=[];console.log=(...x)=>printed.push(x);
  try {
    for(let i=0;i<20000;i++)m.count('requests');
    m.count('failed',3);m.count('completed',2);m.flush();
    assert.equal(m.db.prepare('SELECT COUNT(*) AS n FROM minutes').get().n,1);
    assert.equal(m.snapshot().last24h.requests,20000);
    m.alert('ai_failures','AI lỗi',true);m.alert('ai_failures','AI lỗi',true);
    assert.equal(printed.length,1);assert.equal(m.snapshot().alerts.length,1);
    m.alert('ai_failures','AI lỗi',false);assert.equal(printed.length,2);
    m.event('key=secret-token');assert.equal(printed.length,2);
    const insert=m.db.prepare('INSERT INTO events(time,level,code,count) VALUES(?,?,?,?)');
    for(let i=0;i<1100;i++)insert.run(Date.now(),'info','test',1);
    m.event('retention_check');assert.equal(m.db.prepare('SELECT COUNT(*) AS n FROM events').get().n,1000);
    insert.run(Date.now()-8*86400000,'info','old',1);m.flush();
    assert.equal(m.db.prepare("SELECT COUNT(*) AS n FROM events WHERE code='old'").get().n,0);
    // A telemetry write failure must not break application requests.
    m.db.exec('PRAGMA query_only=ON');m.count('requests');m.flush();
    assert.equal(m.snapshot().available,false);
    m.db.exec('PRAGMA query_only=OFF');
  } finally {console.log=original;m.close();monitor.close();fs.rmSync(dir,{recursive:true,force:true});}
});
