// Smoke test: boots the real server against a temp data dir and exercises the API.
import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

// relative DATA_DIR on purpose: uploads must still be served (regression test)
const dir = path.relative(process.cwd(), fs.mkdtempSync(path.join(os.tmpdir(), 'gym-test-')));
const servers = [];
async function start(env) {
  const port = 4000 + Math.floor(Math.random() * 1000);
  const p = spawn(process.execPath, ['server.js'], { env: { ...process.env, PORT: port, DATA_DIR: dir, ...env } });
  servers.push(p);
  await new Promise((ok, fail) => { p.stdout.once('data', ok); p.once('exit', fail); });
  return `http://localhost:${port}`;
}
after(() => { servers.forEach(p => p.kill()); fs.rmSync(dir, { recursive: true, force: true }); });

test('api', async () => {
  const base = await start({ DEV_NO_AUTH: '1', HEALTH_TOKEN: 'secret' });
  const j = (method, url, body) => fetch(base + url, { method, headers: { 'content-type': 'application/json' }, body: body && JSON.stringify(body) });

  const a = await (await j('POST', '/api/activities', { name: 'Squat', muscles: ['Quads'] })).json();
  assert.ok(a.id);
  const upd = await (await j('PUT', `/api/activities/${a.id}`, { name: 'Back squat', id: 'hijack' })).json();
  assert.equal(upd.id, a.id);
  assert.equal(upd.name, 'Back squat');
  assert.equal((await j('POST', '/api/nope', {})).status, 404);
  const g = await (await j('POST', '/api/gyms', { name: 'Main', equipment: ['Barbell'], main: true })).json();
  assert.deepEqual(g.equipment, ['Barbell']);
  assert.equal((await j('POST', '/api/goals', 'str')).status, 400);

  // upload + range request (needed for iOS video playback)
  const up = await (await fetch(`${base}/api/media?kind=activity&activityId=${a.id}&name=x.mp4`, { method: 'POST', body: 'abcdefghij' })).json();
  assert.equal(up.type, 'video/mp4');
  const r = await fetch(`${base}/media/${up.file}`, { headers: { range: 'bytes=2-4' } });
  assert.equal(r.status, 206);
  assert.equal(await r.text(), 'cde');
  assert.equal((await fetch(`${base}/api/media?kind=progress&name=x.exe`, { method: 'POST', body: 'x' })).status, 415);
  assert.equal((await fetch(`${base}/media/..%2Fdb.json`)).status, 404);

  // deleting an activity removes its media file
  await j('DELETE', `/api/activities/${a.id}`);
  assert.equal(fs.existsSync(path.join(dir, 'uploads', up.file)), false);

  // Apple Health ingest: token required, same type+day replaced
  const h = (body, token = 'secret') => fetch(base + '/api/health', { method: 'POST', headers: { authorization: 'Bearer ' + token }, body: JSON.stringify(body) });
  assert.equal((await h({ type: 'Weight', value: 80 }, 'wrong')).status, 401);
  assert.deepEqual(await (await h([{ type: 'Weight', value: '80.5', date: '2026-01-01' }, { type: 'Weight', value: 'x' }])).json(), { added: 1 });
  await h({ type: 'Weight', value: 81, date: '2026-01-01' });
  const data = await (await j('GET', '/api/data')).json();
  assert.deepEqual(data.measurements.map(m => m.value), [81]);
  assert.equal(data.sessions, undefined);
});

test('auth required without dev flag', async () => {
  const base = await start({ GOOGLE_CLIENT_ID: 'cid', ALLOWED_EMAIL: 'me@example.com', DEV_NO_AUTH: '' });
  assert.equal((await fetch(base + '/api/data')).status, 401);
  assert.equal((await fetch(base + '/media/anything.jpg')).status, 401);
  assert.equal((await fetch(base + '/')).status, 200);
});
