import test from 'node:test';
import sharp from 'sharp';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import { spawnSync } from 'node:child_process';

const dir=fs.mkdtempSync(path.join(os.tmpdir(),'vietphuc-security-'));
process.env.DATA_DIR=dir;
process.env.BACKUPS_DIR=path.join(dir,'backups');
process.env.JWT_SECRET='test-only-secret-'.repeat(4);
process.env.NODE_ENV='production';
for(const key of ['OPENAI_API_KEY','OPENAI_KEY','CHATGPT_API_KEY','VITE_OPENAI_API_KEY','GEMINI_API_KEY','VITE_GEMINI_API_KEY']) process.env[key]='';
const legacy=JSON.stringify({drafts:[{id:'legacy-test',costumeId:'cos-nhat-binh',selectedHairstyle:'legacy hair',selectedFootwear:'legacy shoes',selectedDetails:{old:'kept'}}],aiJobs:[]});
fs.writeFileSync(path.join(dir,'vietphucremix.json'),legacy);
const {sqliteDb}=await import('../server/sqlite.ts');
const {issueUserToken,revokeUserToken,hashToken}=await import('../server/auth.ts');
const {createApp}=await import('../server.ts');
const app=await createApp();
const server=app.listen(0,'127.0.0.1');
await new Promise(r=>server.once('listening',r));
const base=`http://127.0.0.1:${server.address().port}`;
process.env.APP_URL=base;
async function req(url,method='GET',body,token,extra={}) {
 const res=await fetch(base+url,{method,headers:{'Content-Type':'application/json',...(token?{Authorization:'Bearer '+token}:{}),...extra},body:body?JSON.stringify(body):undefined});
 return {status:res.status,json:await res.json().catch(()=>null),cookie:res.headers.get('set-cookie')?.split(';')[0]};
}
async function reg(name){const r=await req('/api/auth/register','POST',{email:`${name}@example.invalid`,name:'Audit '+name,password:'Audit-password-123!'});assert.equal(r.status,201);return {...r.json.data,cookie:r.cookie};}
const input={costumeId:'cos-nhat-binh',costumeName:'Áo Nhật Bình',eventName:'Test',remixStyle:'traditional',sketchDataUrl:'data:image/png;base64,mock',promptUsed:'test'};

test('security, ownership, quota and recoverability',async t=>{
 try {
 const a=await reg('a'),b=await reg('b');
 await t.test('public image preview is smaller while original stays intact',async()=>{
  const image='/assets/costumes/ao-nhat-binh-nam-phuong.jpg';
  const result=await fetch(base+image+'?size=thumb');
  assert.equal(result.status,200);
  const bytes=Buffer.from(await result.arrayBuffer());
  const meta=await sharp(bytes).metadata();assert.equal(meta.format,'webp');assert.ok(meta.height<=640);
  const source=fs.readFileSync(new URL('../public'+image,import.meta.url));
  assert.ok(bytes.length<source.length);
  const original=Buffer.from(await (await fetch(base+image+'?original=1')).arrayBuffer());
  assert.deepEqual(original,source);
 });
 await t.test('legacy data preserved in locked archive, never assigned to first account',()=>{
  assert.equal(fs.readFileSync(path.join(dir,'vietphucremix.json'),'utf8'),legacy);
  const old=sqliteDb.getDraftById('legacy-test','usr-legacy-archive');assert.equal(old.selectedHairstyle,'legacy hair');assert.deepEqual(old.selectedDetails,{old:'kept'});
  assert.equal(sqliteDb.getDraftById('legacy-test',a.user.id),null);
  assert.equal(sqliteDb.verifyRecoveryCode('usr-legacy-archive','REC-123456'),false);
 });
 await t.test('cookie sessions; deny query tokens and cross-origin mutation',async()=>{
  assert.equal((await req('/api/auth/me','GET',undefined,undefined,{Cookie:a.cookie})).status,200);
  assert.equal((await req('/api/auth/me?token='+a.token)).status,401);
  assert.equal((await req('/api/auth/logout','POST',undefined,undefined,{Cookie:a.cookie,Origin:'https://evil.invalid'})).status,403);
 });
 await t.test('Vercel proxy cookie session accepts exact frontend origin only',async()=>{
  const headers={Cookie:a.cookie,Origin:'https://vietphucisthebest.vercel.app'};
  const saved=await req('/api/drafts','POST',{costumeId:'cos-nhat-binh'},undefined,headers);
  assert.equal(saved.status,200);
  assert.equal((await req('/api/drafts/'+saved.json.data.id,'DELETE',undefined,undefined,headers)).status,200);
  for(const origin of ['https://attacker.vercel.app','https://vietphucisthebest.vercel.app.evil.invalid','null']) {
    assert.equal((await req('/api/drafts','POST',{costumeId:'cos-nhat-binh'},undefined,{Cookie:a.cookie,Origin:origin})).status,403);
  }
  const me=await fetch(base+'/api/auth/me',{headers:{Cookie:a.cookie}});
  assert.equal(me.status,200);
  assert.equal(me.headers.get('cache-control'),'private, no-store');
 });
 await t.test('isolated wardrobe and full draft fields',async()=>{
  assert.equal((await req('/api/drafts')).status,401);
  const r=await req('/api/drafts','POST',{costumeId:'cos-nhat-binh',selectedHairstyle:'hair',selectedFootwear:'shoes',selectedDetails:{test:'yes'}},a.token);
  assert.equal(r.status,200);const d=r.json.data;
  assert.equal(d.selectedHairstyle,'hair');assert.equal(d.selectedFootwear,'shoes');assert.deepEqual(d.selectedDetails,{test:'yes'});
  assert.equal((await req('/api/drafts/'+d.id,'GET',undefined,b.token)).status,404);
  assert.equal((await req('/api/drafts/'+d.id,'DELETE',undefined,b.token)).status,404);
  assert.equal((await req('/api/drafts','POST',{id:d.id,costumeId:'cos-nhat-binh'},b.token)).status,404);
 });
 await t.test('email/default code cannot reset; valid recovery works once and revokes sessions',async()=>{
  assert.equal((await req('/api/auth/forgot-password','POST',{email:a.user.email})).status,400);
  assert.equal((await req('/api/auth/forgot-password','POST',{email:a.user.email,recoveryCode:'REC-123456'})).status,401);
  assert.ok(a.user.recoveryCode.length>40);
  const db=new DatabaseSync(path.join(dir,'vietphucremix.sqlite'));
  assert.notEqual(db.prepare('SELECT recovery_code FROM users WHERE id = ?').get(a.user.id).recovery_code,a.user.recoveryCode);db.close();
  const r=await req('/api/auth/forgot-password','POST',{email:a.user.email,recoveryCode:a.user.recoveryCode});assert.equal(r.status,200);
  assert.equal((await req('/api/auth/reset-password','POST',{resetToken:r.json.resetToken,newPassword:'New-password-123!'})).status,200);
  assert.equal((await req('/api/auth/reset-password','POST',{resetToken:r.json.resetToken,newPassword:'New-password-123!'})).status,400);
  assert.equal((await req('/api/auth/me','GET',undefined,a.token)).status,401);
 });
 await t.test('JWT never resurrects a revoked identical-second session',()=>{
  const user=sqliteDb.getUserById(b.user.id);const one=issueUserToken(user);revokeUserToken(one.token);const two=issueUserToken(user);
  assert.notEqual(one.token,two.token);assert.equal(sqliteDb.isSessionActive(hashToken(one.token)),false);
 });
 await t.test('images require exact ownership; orphan files and encoded paths denied',async()=>{
  fs.mkdirSync(path.join(dir,'results'),{recursive:true});fs.writeFileSync(path.join(dir,'results','ai-test.png'), await sharp({create:{width:1800,height:2400,channels:3,background:'#cc8899'}}).png().toBuffer());
  const created=sqliteDb.atomicCreateAIJob(b.user.id,input);assert.ok(created.success);
  sqliteDb.updateDetailedAIJob(created.job.id,{status:'completed',resultImageUrl:'/assets/results/ai-test.png'});
  assert.equal((await req('/assets/results/ai-test.png')).status,401);
  assert.equal((await req('/assets/results/ai-test.png','GET',undefined,b.token)).status,200);
  const c=await reg('c');assert.equal((await req('/assets/results/ai-test.png','GET',undefined,c.token)).status,404);
  assert.equal((await req('/assets/results/orphan.png','GET',undefined,b.token)).status,404);
  assert.equal((await req('/assets/%72esults/remix-job-08751cc3.jpg')).status,404);
  assert.equal((await req('/assets/results/ai-test.png','GET',undefined,undefined,{Cookie:b.cookie})).status,200);
  assert.equal((await req('/assets/results/ai-test.png?token='+b.token)).status,401);
  const imageUrl=base+'/assets/results/ai-test.png?preview=1&size=thumb';
  const preview=await fetch(imageUrl,{headers:{Cookie:b.cookie}});
  assert.equal(preview.status,200);assert.equal(preview.headers.get('cache-control'),'private, no-store');
  const data=Buffer.from(await preview.arrayBuffer());
  const meta=await sharp(data).metadata();assert.equal(meta.format,'webp');assert.ok(meta.height<=640);
  assert.equal((await fetch(imageUrl)).status,401);
  assert.equal((await fetch(imageUrl,{headers:{Cookie:c.cookie}})).status,404);
  const original=Buffer.from(await (await fetch(base+'/assets/results/ai-test.png',{headers:{Cookie:b.cookie}})).arrayBuffer());
  assert.deepEqual(original,fs.readFileSync(path.join(dir,'results','ai-test.png')));

 });
 await t.test('maintenance cannot be invoked by guests or ordinary users',async()=>{
  assert.equal((await req('/api/system/restore','POST',{})).status,401);
  assert.equal((await req('/api/system/restore','POST',{},b.token)).status,403);
  assert.equal((await req('/api/system/backups')).status,401);
 });
 await t.test('active deletion denied; quotas count retry/deleted work; global cap and switch',()=>{
  const u=sqliteDb.createUser('quota@example.invalid','Quota','not-real-hash');
  const first=sqliteDb.atomicCreateAIJob(u.id,input);assert.ok(first.success);
  assert.equal(sqliteDb.atomicCreateAIJob(u.id,input).statusCode,409);
  assert.equal(sqliteDb.deleteUserAIJob(first.job.id,u.id).statusCode,409);
  sqliteDb.updateDetailedAIJob(first.job.id,{status:'failed'});
  assert.ok(sqliteDb.atomicRetryAIJob(first.job.id,u.id).success);
  sqliteDb.updateDetailedAIJob(first.job.id,{status:'failed'});
  sqliteDb.deleteUserAIJob(first.job.id,u.id);
  for(let i=0;i<3;i++){const r=sqliteDb.atomicCreateAIJob(u.id,input);assert.ok(r.success);sqliteDb.updateDetailedAIJob(r.job.id,{status:'failed'});}
  assert.equal(sqliteDb.atomicCreateAIJob(u.id,input).statusCode,429);
  process.env.AI_GLOBAL_DAILY_LIMIT='1';assert.equal(sqliteDb.atomicCreateAIJob(b.user.id,input).statusCode,503);delete process.env.AI_GLOBAL_DAILY_LIMIT;
  process.env.AI_ENABLED='false';assert.equal(sqliteDb.atomicRetryAIJob(sqliteDb.getUserAIJobs(b.user.id)[0].id,b.user.id).statusCode,503);delete process.env.AI_ENABLED;
 });
 await t.test('real backup readable; tampered snapshot refused before overwrite',()=>{
  const backup=sqliteDb.performBackup();const db=new DatabaseSync(backup,{readOnly:true});assert.ok(db.prepare('SELECT COUNT(*) AS n FROM users').get().n>=3);db.close();
  fs.writeFileSync(path.join(dir,'bad.sqlite'),'broken');
  const r=spawnSync(process.execPath,['scripts/storage.mjs','restore',path.join(dir,'bad.sqlite')],{env:process.env,encoding:'utf8'});assert.notEqual(r.status,0);assert.ok(sqliteDb.getUserById(b.user.id));
 });
 await t.test('no AI key returns failure honestly, not a pretend generated image',async()=>{
  const u=await reg('nokey');const r=await req('/api/ai/jobs','POST',input,u.token);assert.equal(r.status,201);
  await new Promise(r=>setTimeout(r,1200));const j=(await req('/api/ai/jobs/'+r.json.data.id,'GET',undefined,u.token)).json.data;assert.equal(j.status,'failed');assert.equal(j.resultImageUrl,undefined);
 });
 await t.test('change password revokes sessions; recovery code rotation rejects old code',async()=>{
  const u=await reg('change');
  const rotate=await req('/api/auth/recovery-code','POST',{password:'Audit-password-123!'},u.token);assert.equal(rotate.status,200);
  assert.equal(sqliteDb.verifyRecoveryCode(u.user.id,u.user.recoveryCode),false);
  assert.equal(sqliteDb.verifyRecoveryCode(u.user.id,rotate.json.data.recoveryCode),true);
  assert.equal((await req('/api/auth/change-password','POST',{oldPassword:'Audit-password-123!',newPassword:'Changed-password-123!'},u.token)).status,200);
  assert.equal((await req('/api/auth/me','GET',undefined,u.token)).status,401);
 });
 await t.test('failed database write never returns successful save',async()=>{
  const count=sqliteDb.db.prepare('SELECT COUNT(*) AS n FROM drafts').get().n;
  sqliteDb.db.exec('PRAGMA query_only = ON');
  try {assert.equal((await req('/api/drafts','POST',{costumeId:'cos-nhat-binh'},b.token)).status,500);}
  finally {sqliteDb.db.exec('PRAGMA query_only = OFF');}
  assert.equal(sqliteDb.db.prepare('SELECT COUNT(*) AS n FROM drafts').get().n,count);
 });
 await t.test('auth attempt rate limiting',async()=>{
  let last;for(let i=0;i<6;i++)last=await req('/api/auth/forgot-password','POST',{email:'missing@example.invalid',recoveryCode:'bad'});
  assert.equal(last.status,429);
  assert.equal((await req('/api/auth/forgot-password/','POST',{})).status,404);
  assert.equal((await req('/api/AUTH/forgot-password','POST',{})).status,404);
 });
 // Stop app before offline restore; validate actual restoration, not its status text.
 await new Promise(r=>server.close(r));
 const backup=sqliteDb.performBackup();
 sqliteDb.createUser('after-backup@example.invalid','After','not-real');sqliteDb.close();
 const restored=spawnSync(process.execPath,['scripts/storage.mjs','restore',backup],{env:process.env,encoding:'utf8'});assert.equal(restored.status,0,restored.stderr);
 const db=new DatabaseSync(path.join(dir,'vietphucremix.sqlite'));assert.equal(db.prepare('SELECT COUNT(*) AS n FROM users WHERE email = ?').get('after-backup@example.invalid').n,0);assert.equal(db.prepare('SELECT COUNT(*) AS n FROM sessions WHERE is_revoked=0').get().n,0);db.close();
 // Verify the actual npm start entry point and interrupted-job reconciliation.
 const pendingDb=new DatabaseSync(path.join(dir,'vietphucremix.sqlite'));
 pendingDb.prepare("UPDATE ai_jobs SET status='processing' WHERE id=(SELECT id FROM ai_jobs LIMIT 1)").run();pendingDb.close();
 const {spawn}=await import('node:child_process');
 // Railway restart regression: old PID matches a living, unrelated process.
 fs.writeFileSync(path.join(dir,'server.pid'),String(process.pid));
 // Simulate a lease left by a killed container, expired before restart.
 const staleLock=path.join(dir,'.server.lock');fs.mkdirSync(staleLock);
 const old=new Date(Date.now()-60000);fs.utimesSync(staleLock,old,old);
 const child=spawn(process.execPath,['server.ts'],{env:{...process.env,HOST:'127.0.0.1',PORT:new URL(base).port},stdio:'pipe'});
 let log='';child.stderr.on('data',b=>log+=b);child.stdout.on('data',b=>log+=b);
 try {
  let ready=false;
  for(let i=0;i<50;i++){await new Promise(r=>setTimeout(r,100));try{ready=(await fetch(base+'/healthz')).ok;if(ready)break;}catch{}}
  assert.ok(ready,log);
  assert.equal((await fetch(base+'/api/not-real')).status,404);
  const live=new DatabaseSync(path.join(dir,'vietphucremix.sqlite'));assert.equal(live.prepare("SELECT COUNT(*) AS n FROM ai_jobs WHERE status IN ('queued','processing')").get().n,0);live.close();
  // Restoring while the server is running must be refused.
  const refused=spawnSync(process.execPath,['scripts/storage.mjs','restore',backup],{env:process.env,encoding:'utf8'});assert.notEqual(refused.status,0);
 } finally {child.kill('SIGTERM');await new Promise(r=>child.once('exit',r));}
 } finally {server.close();fs.rmSync(dir,{recursive:true,force:true});}
});
