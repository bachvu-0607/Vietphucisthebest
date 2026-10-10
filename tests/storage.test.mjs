import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import net from 'node:net';
import { spawn, spawnSync } from 'node:child_process';

const storageUrl = new URL('../server/storage.ts', import.meta.url).href;
const lockUrl = new URL('../server/instance-lock.mjs', import.meta.url).href;
const readStorage = `const s = await import(${JSON.stringify(storageUrl)}); const l = await import(${JSON.stringify(lockUrl)}); console.log(JSON.stringify({data:s.DATA_DIR, results:s.RESULTS_DIR, backups:s.BACKUPS_DIR, lock:l.storageDir}));`;

test('disposable Cloud Run preview never relaxes production storage or reuses configured data', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'vietphuc-storage-'));
  const realData = path.join(dir, 'production-data');
  const realBackups = path.join(dir, 'production-backups');
  const env = {
    ...process.env, K_SERVICE: 'preview-test', SQLITE_PERSISTENT_STORAGE: '',
    NODE_ENV: 'development', TMPDIR: dir, DATA_DIR: realData, BACKUPS_DIR: realBackups,
  };
  function read(overrides = {}, preview = false) {
    return spawnSync(process.execPath, ['--input-type=module', '-e', readStorage,
      ...(preview ? ['--', '--ephemeral-preview'] : [])], {
      env: { ...env, ...overrides }, encoding: 'utf8', timeout: 10000,
    });
  }
  function paths(result) {
    assert.equal(result.status, 0, result.stderr);
    return JSON.parse(result.stdout.trim().split('\n').at(-1));
  }
  try {
    const refused = read();
    assert.notEqual(refused.status, 0);
    assert.match(refused.stderr, /configure persistent SQLite storage/);

    const preview = read({}, true);
    const previewDir = path.join(dir, 'vietphuc-preview');
    assert.deepEqual(paths(preview), {
      data: previewDir, results: path.join(previewDir, 'results'), backups: path.join(previewDir, 'backups'), lock: previewDir,
    });
    assert.match(preview.stderr, /temporary test data/);
    assert.deepEqual(paths(read({ NODE_ENV: '' }, true)), paths(preview));

    for (const flag of [false, true]) {
      const production = read({ NODE_ENV: 'production' }, flag);
      assert.notEqual(production.status, 0);
      assert.match(production.stderr, /configure persistent SQLite storage/);
    }
    const expected = { data: realData, results: path.join(realData, 'results'), backups: realBackups, lock: realData };
    assert.deepEqual(paths(read({ SQLITE_PERSISTENT_STORAGE: 'true', NODE_ENV: 'production' })), expected);
    assert.deepEqual(paths(read({ SQLITE_PERSISTENT_STORAGE: 'true' }, true)), expected);
    assert.deepEqual(paths(read({ K_SERVICE: '', NODE_ENV: 'production' })), expected);
    assert.deepEqual(paths(read({ K_SERVICE: '' }, true)), expected);
    assert.equal(fs.existsSync(realData), false);
    assert.equal(fs.existsSync(realBackups), false);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test('npm run dev starts Cloud Run preview with working UI, login and isolated SQLite', { timeout: 30000 }, async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'vietphuc-preview-boot-'));
  const realData = path.join(dir, 'production-data');
  const realBackups = path.join(dir, 'production-backups');
  fs.mkdirSync(realData);
  fs.mkdirSync(realBackups);
  fs.writeFileSync(path.join(realData, 'vietphucremix.sqlite'), 'must not open or modify');
  fs.writeFileSync(path.join(realBackups, 'sentinel'), 'keep');

  const reservation = net.createServer();
  await new Promise((resolve, reject) => {
    reservation.once('error', reject);
    reservation.listen(0, '127.0.0.1', resolve);
  });
  const port = reservation.address().port;
  await new Promise(resolve => reservation.close(resolve));
  const base = `http://127.0.0.1:${port}`;
  const env = {
    ...process.env, K_SERVICE: 'aistudio-preview-test', SQLITE_PERSISTENT_STORAGE: '',
    NODE_ENV: 'development', TMPDIR: dir, DATA_DIR: realData, BACKUPS_DIR: realBackups,
    JWT_SECRET: 'test-only-preview-secret-'.repeat(3), APP_URL: base,
    HOST: '127.0.0.1', PORT: String(port), AI_ENABLED: 'false',
  };
  for (const key of ['OPENAI_API_KEY', 'OPENAI_KEY', 'CHATGPT_API_KEY', 'VITE_OPENAI_API_KEY', 'GEMINI_API_KEY', 'VITE_GEMINI_API_KEY']) env[key] = '';
  const child = spawn('npm', ['run', 'dev', '--', '--port', String(port), '--host', '127.0.0.1'], {
    cwd: new URL('..', import.meta.url), env, detached: true, stdio: 'pipe',
  });
  let output = '';
  child.stdout.on('data', bytes => output += bytes);
  child.stderr.on('data', bytes => output += bytes);
  const closed = new Promise(resolve => child.once('close', resolve));
  try {
    let ready = false;
    for (let i = 0; i < 100; i++) {
      if (child.exitCode !== null || child.signalCode !== null) break;
      await new Promise(resolve => setTimeout(resolve, 100));
      try { ready = (await fetch(base + '/healthz', { signal: AbortSignal.timeout(500) })).ok; } catch {}
      if (ready) break;
    }
    assert.ok(ready, output);
    assert.match(output, /temporary test data/);
    const ui = await fetch(base + '/');
    assert.equal(ui.status, 200);
    assert.match(await ui.text(), /src\/main\.tsx/);
    const costumes = await (await fetch(base + '/api/costumes')).json();
    assert.ok(costumes.data.some(costume => costume.id === 'cos-nhat-binh'));

    const registered = await fetch(base + '/api/auth/register', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'preview@example.invalid', name: 'Preview test', password: 'Preview-password-123!' }),
    });
    assert.equal(registered.status, 201);
    const { data: account } = await registered.json();
    const headers = { 'Content-Type': 'application/json', Authorization: 'Bearer ' + account.token };
    assert.equal((await fetch(base + '/api/auth/me', { headers })).status, 200);
    assert.equal((await fetch(base + '/api/drafts', {
      method: 'POST', headers, body: JSON.stringify({ costumeId: 'cos-nhat-binh' }),
    })).status, 200);

    const previewDir = path.join(dir, 'vietphuc-preview');
    assert.ok(fs.existsSync(path.join(previewDir, 'vietphucremix.sqlite')));
    assert.ok(fs.existsSync(path.join(previewDir, '.server.lock')));
    assert.ok(fs.existsSync(path.join(previewDir, 'backups')));
    assert.equal(fs.readFileSync(path.join(realData, 'vietphucremix.sqlite'), 'utf8'), 'must not open or modify');
    assert.deepEqual(fs.readdirSync(realData), ['vietphucremix.sqlite']);
    assert.deepEqual(fs.readdirSync(realBackups), ['sentinel']);
  } finally {
    try { process.kill(-child.pid, 'SIGTERM'); } catch {}
    await Promise.race([closed, new Promise(resolve => setTimeout(resolve, 2000))]);
    try { process.kill(-child.pid, 'SIGKILL'); } catch {}
    await closed;
    fs.rmSync(dir, { recursive: true, force: true });
  }
});
