import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'vietphuc-chat-'));
process.env.DATA_DIR = dir;
process.env.BACKUPS_DIR = path.join(dir, 'backups');
process.env.JWT_SECRET = 'test-only-secret-'.repeat(4);
process.env.NODE_ENV = 'production'; // serve dist/ instead of starting a Vite dev server
process.env.GEMINI_API_KEY = '';
process.env.CHAT_GUEST_DAILY_LIMIT = '2';

const { parseChatRequest, relevantCostumes, buildSystemInstruction, chatConfigured } = await import('../server/chat.ts');
const { sqliteDb } = await import('../server/sqlite.ts');
const { createApp } = await import('../server.ts');

test('chat request validation keeps only a short, well-formed history', () => {
  assert.equal(typeof parseChatRequest({}), 'string');
  assert.equal(typeof parseChatRequest({ messages: [{ role: 'system', text: 'x' }] }), 'string');
  assert.equal(typeof parseChatRequest({ messages: [{ role: 'user', text: 'a'.repeat(1501) }] }), 'string');
  assert.equal(typeof parseChatRequest({ messages: [{ role: 'user', text: 'hỏi' }, { role: 'model', text: 'đáp' }] }), 'string');
  const long = Array.from({ length: 30 }, (_, i) => ({ role: i % 2 ? 'model' : 'user', text: `tin ${i}` }));
  long.push({ role: 'user', text: '  câu cuối  ' });
  const parsed = parseChatRequest({ messages: long, costumeId: 'cos-ao-dai' });
  assert.equal(parsed.messages.length, 12);
  assert.equal(parsed.messages.at(-1).text, 'câu cuối');
  assert.equal(parsed.costumeId, 'cos-ao-dai');
});

test('relevant costume profiles come from the question and the open page', () => {
  assert.deepEqual(relevantCostumes('Áo NGŨ THÂN đi Tết phối gì?').map(c => c.id), ['cos-ngu-than-tay-chen']);
  assert.deepEqual(relevantCostumes('phối gì cho đẹp', 'cos-nhat-binh').map(c => c.id), ['cos-nhat-binh']);
  assert.equal(relevantCostumes('so sánh giao lĩnh, đối khâm và viên lĩnh', 'cos-ao-dai').length, 2);
  assert.deepEqual(relevantCostumes('xin chào'), []);
  const prompt = buildSystemInstruction('Áo bà ba mặc dạo phố được không?');
  assert.match(prompt, /HỒ SƠ CHI TIẾT/);
  assert.match(prompt, /cos-ba-ba/);
  assert.doesNotMatch(prompt, /"aiProfile"/);
});

test('chat quota is per key, capped globally, and refundable', () => {
  assert.deepEqual(sqliteDb.consumeChatQuota('ip:q', 2, 100), { remaining: 1 });
  assert.deepEqual(sqliteDb.consumeChatQuota('ip:q', 2, 100), { remaining: 0 });
  assert.equal(sqliteDb.consumeChatQuota('ip:q', 2, 100), null);
  sqliteDb.refundChatQuota('ip:q');
  assert.deepEqual(sqliteDb.getChatUsage('ip:q', 2), { remaining: 1 });
  // The refund also returned the global slot, leaving 1 message counted system-wide.
  assert.equal(sqliteDb.consumeChatQuota('ip:other', 5, 1), null);
  assert.deepEqual(sqliteDb.consumeChatQuota('ip:other', 5, 2), { remaining: 4 });
});

test('chat endpoint rejects bad input and reports when Gemini is not configured', async () => {
  assert.equal(chatConfigured(), false);
  const app = await createApp();
  const server = app.listen(0, '127.0.0.1');
  await new Promise(r => server.once('listening', r));
  const base = `http://127.0.0.1:${server.address().port}`;
  const post = body => fetch(base + '/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Forwarded-For': '203.0.113.9' }, body: JSON.stringify(body) });
  try {
    assert.equal((await post({ messages: [] })).status, 400);
    const res = await post({ messages: [{ role: 'user', text: 'Áo dài là gì?' }] });
    assert.equal(res.status, 503);
    const usage = await (await fetch(base + '/api/chat/usage', { headers: { 'X-Forwarded-For': '203.0.113.9' } })).json();
    assert.deepEqual(usage.data, { enabled: false, limit: 2, remaining: 2 });
  } finally {
    server.close();
    sqliteDb.close();
  }
});
