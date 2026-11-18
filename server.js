import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import Anthropic from '@anthropic-ai/sdk';

const here = path.dirname(fileURLToPath(import.meta.url));
const { PORT = 3000, GOOGLE_CLIENT_ID, ALLOWED_EMAIL, HEALTH_TOKEN, DEV_NO_AUTH } = process.env;
const DATA = path.resolve(process.env.DATA_DIR || path.join(here, 'data')); // absolute, so sendFile's path-traversal check works
const UPLOADS = path.join(DATA, 'uploads');
const DB_FILE = path.join(DATA, 'db.json');
const PUBLIC = path.join(here, 'public');
const MAX_UPLOAD = 500 * 1024 * 1024;
const SESSION_MS = 30 * 24 * 3600 * 1000;
const COLLECTIONS = ['activities', 'workouts', 'measurements', 'goals', 'gyms'];
const MUSCLES = ['Chest', 'Upper back', 'Lats', 'Traps', 'Shoulders', 'Biceps', 'Triceps', 'Forearms', 'Abs', 'Obliques',
  'Lower back', 'Glutes', 'Quads', 'Hamstrings', 'Calves', 'Hip flexors', 'Adductors', 'Abductors', 'Cardio'];
const MIME = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json',
  '.webmanifest': 'application/manifest+json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.gif': 'image/gif', '.heic': 'image/heic',
  '.mp4': 'video/mp4', '.mov': 'video/quicktime', '.webm': 'video/webm', '.m4v': 'video/mp4',
};

if (DEV_NO_AUTH !== '1' && !(GOOGLE_CLIENT_ID && ALLOWED_EMAIL)) {
  console.error('Set GOOGLE_CLIENT_ID and ALLOWED_EMAIL (or DEV_NO_AUTH=1 for local testing only).');
  process.exit(1);
}

fs.mkdirSync(UPLOADS, { recursive: true });
// shortcut: whole DB is one JSON file rewritten on every change; fine for one person, move to SQLite if it passes a few MB.
const db = fs.existsSync(DB_FILE) ? JSON.parse(fs.readFileSync(DB_FILE, 'utf8')) : {};
for (const k of [...COLLECTIONS, 'media']) db[k] ??= [];
db.sessions ??= {};
function save() { // write-then-rename so a crash mid-write can't corrupt the DB
  fs.writeFileSync(DB_FILE + '.tmp', JSON.stringify(db));
  for (let tries = 0; ; tries++) {
    try { return fs.renameSync(DB_FILE + '.tmp', DB_FILE); } catch (e) {
      // Windows: antivirus/indexers briefly lock the target and rename fails with EPERM/EBUSY.
      if (!['EPERM', 'EBUSY', 'EACCES'].includes(e.code)) throw e;
      if (tries === 20) return fs.copyFileSync(DB_FILE + '.tmp', DB_FILE);
      Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 10);
    }
  }
}

function send(res, status, body, headers = {}) {
  res.writeHead(status, { 'content-type': 'application/json', ...headers });
  res.end(JSON.stringify(body));
}

async function readJson(req) {
  let size = 0; const chunks = [];
  for await (const c of req) {
    if ((size += c.length) > 1e6) throw Object.assign(new Error('body too large'), { status: 413 });
    chunks.push(c);
  }
  const v = JSON.parse(Buffer.concat(chunks).toString() || '{}');
  if (typeof v !== 'object' || v === null) throw Object.assign(new Error('expected JSON'), { status: 400 });
  return v;
}

function sendFile(req, res, root, rel) {
  const file = path.resolve(root, '.' + path.posix.normalize('/' + rel));
  if (!file.startsWith(root + path.sep)) return send(res, 404, { error: 'not found' });
  fs.stat(file, (err, st) => {
    if (err || !st.isFile()) return send(res, 404, { error: 'not found' });
    const headers = { 'content-type': MIME[path.extname(file).toLowerCase()] || 'application/octet-stream', 'accept-ranges': 'bytes' };
    // Range support is required for iOS Safari to play videos.
    const m = /^bytes=(\d*)-(\d*)$/.exec(req.headers.range || '');
    if (m && (m[1] || m[2])) {
      const start = m[1] ? +m[1] : Math.max(0, st.size - +m[2]);
      const end = m[1] && m[2] ? Math.min(+m[2], st.size - 1) : st.size - 1;
      if (start > end) return send(res, 416, { error: 'bad range' }, { 'content-range': `bytes */${st.size}` });
      res.writeHead(206, { ...headers, 'content-range': `bytes ${start}-${end}/${st.size}`, 'content-length': end - start + 1 });
      return fs.createReadStream(file, { start, end }).pipe(res);
    }
    res.writeHead(200, { ...headers, 'content-length': st.size });
    fs.createReadStream(file).pipe(res);
  });
}

const cookieToken = req => /(?:^|;\s*)sid=([^;]+)/.exec(req.headers.cookie || '')?.[1];
function authed(req) {
  if (DEV_NO_AUTH === '1') return true;
  const t = cookieToken(req);
  return !!t && db.sessions[t] > Date.now();
}
const sameSecret = (a, b) => crypto.timingSafeEqual(
  crypto.createHash('sha256').update(String(a)).digest(), crypto.createHash('sha256').update(String(b)).digest());

async function login(req, res) {
  const { credential } = await readJson(req);
  if (typeof credential !== 'string') return send(res, 400, { error: 'missing credential' });
  // Google's tokeninfo endpoint verifies the ID token's signature and expiry for us.
  const r = await fetch('https://oauth2.googleapis.com/tokeninfo?id_token=' + encodeURIComponent(credential));
  const info = await r.json();
  if (!r.ok || info.aud !== GOOGLE_CLIENT_ID || String(info.email_verified) !== 'true'
    || String(info.email).toLowerCase() !== ALLOWED_EMAIL.toLowerCase()) {
    return send(res, 403, { error: 'This account is not allowed.' });
  }
  const now = Date.now();
  for (const [t, exp] of Object.entries(db.sessions)) if (exp < now) delete db.sessions[t];
  const token = crypto.randomBytes(32).toString('hex');
  db.sessions[token] = now + SESSION_MS;
  save();
  const secure = req.socket.encrypted || req.headers['x-forwarded-proto'] === 'https' ? '; Secure' : '';
  send(res, 200, { ok: true }, { 'set-cookie': `sid=${token}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${SESSION_MS / 1000}${secure}` });
}

// Apple Health has no web API: an iOS Shortcut reads Health samples and POSTs them here.
async function healthIngest(req, res) {
  const auth = (req.headers.authorization || '').replace(/^Bearer\s+/i, '');
  if (!HEALTH_TOKEN || !sameSecret(auth, HEALTH_TOKEN)) return send(res, 401, { error: 'bad token' });
  const body = await readJson(req);
  let added = 0;
  for (const s of Array.isArray(body) ? body : body.samples || [body]) {
    const value = Number(s?.value);
    const type = String(s?.type || '').trim().slice(0, 40);
    if (!type || !Number.isFinite(value)) continue;
    const date = (s.date ? new Date(s.date) : new Date()).toISOString().slice(0, 10);
    db.measurements = db.measurements.filter(m => !(m.source === 'apple-health' && m.type === type && m.date === date));
    db.measurements.push({ id: crypto.randomUUID(), date, type, value, unit: String(s.unit || ''), source: 'apple-health' });
    added++;
  }
  save();
  send(res, 200, { added });
}

async function upload(req, res, url) {
  const kind = url.searchParams.get('kind') === 'progress' ? 'progress' : 'activity';
  const activityId = url.searchParams.get('activityId') || null;
  if (kind === 'activity' && !db.activities.some(a => a.id === activityId)) return send(res, 400, { error: 'unknown activity' });
  const ext = path.extname(url.searchParams.get('name') || '').toLowerCase();
  if (!/^(image|video)\//.test(MIME[ext] || '')) return send(res, 415, { error: 'only photos and videos' });
  if (+req.headers['content-length'] > MAX_UPLOAD) return send(res, 413, { error: 'file too large' });
  const id = crypto.randomUUID();
  const file = id + ext;
  const out = fs.createWriteStream(path.join(UPLOADS, file));
  let size = 0;
  try {
    for await (const c of req) {
      if ((size += c.length) > MAX_UPLOAD) throw Object.assign(new Error('file too large'), { status: 413 });
      if (!out.write(c)) await new Promise(r => out.once('drain', r));
    }
    await new Promise((ok, fail) => out.end(e => (e ? fail(e) : ok())));
  } catch (e) {
    out.destroy(); fs.rm(path.join(UPLOADS, file), { force: true }, () => {});
    throw e;
  }
  const item = { id, kind, activityId: kind === 'activity' ? activityId : null, file, type: MIME[ext],
    date: url.searchParams.get('date') || new Date().toISOString().slice(0, 10), createdAt: new Date().toISOString() };
  db.media.push(item);
  save();
  send(res, 201, item);
}

function removeMedia(pred) {
  for (const m of db.media.filter(pred)) fs.rm(path.join(UPLOADS, m.file), { force: true }, () => {});
  db.media = db.media.filter(m => !pred(m));
}

const SUGGESTION_SCHEMA = {
  type: 'object', additionalProperties: false, required: ['name', 'rationale', 'items'],
  properties: {
    name: { type: 'string' },
    rationale: { type: 'string' },
    items: {
      type: 'array',
      items: {
        type: 'object', additionalProperties: false, required: ['activityId', 'name', 'muscles', 'equipment', 'sets', 'reps', 'notes'],
        properties: {
          activityId: { type: 'string', description: 'id from the library, or "" for a new activity' },
          name: { type: 'string' },
          muscles: { type: 'array', items: { type: 'string', enum: MUSCLES } },
          equipment: { type: 'array', items: { type: 'string' }, description: 'equipment the exercise needs, e.g. ["Dumbbells","Bench"] or ["Bodyweight"]' },
          sets: { type: 'integer' },
          reps: { type: 'string', description: 'e.g. "8-10", "12", "45s"' },
          notes: { type: 'string', description: 'short coaching cue, weight suggestion or rest time' },
        },
      },
    },
  },
};

let anthropic;
async function suggest(req, res) {
  const { minutes, muscles = [], notes = '', gymId } = await readJson(req);
  const byId = Object.fromEntries(db.activities.map(a => [a.id, a]));
  const gym = db.gyms.find(g => g.id === gymId);
  const context = {
    today: new Date().toISOString().slice(0, 10),
    gym: gym ? { name: gym.name, equipmentAvailable: ['Bodyweight', ...(gym.equipment || [])] } : null,
    minutesAvailable: Number(minutes) || 60,
    targetMuscles: Array.isArray(muscles) ? muscles : [],
    extraNotes: String(notes).slice(0, 2000),
    goals: db.goals.filter(g => !g.done).map(g => ({ goal: g.text, targetDate: g.targetDate })),
    recentWorkouts: db.workouts.filter(w => w.completedAt).sort((a, b) => b.completedAt.localeCompare(a.completedAt)).slice(0, 8)
      .map(w => ({ completed: w.completedAt, name: w.name, feel: w.feel || null, items: (w.items || []).map(i => ({
        name: byId[i.activityId]?.name, muscles: byId[i.activityId]?.muscles, sets: i.sets, reps: i.reps, weight: i.weight })) })),
    library: db.activities.map(a => ({ id: a.id, name: a.name, muscles: a.muscles, equipment: a.equipment || [] })),
  };
  anthropic ??= new Anthropic();
  const msg = await anthropic.beta.messages.create({
    model: 'claude-opus-5-5',
    max_tokens: 16000,
    betas: ['server-side-fallback-2026-07-01'],
    fallbacks: 'default',
    output_config: { effort: 'medium', format: { type: 'json_schema', schema: SUGGESTION_SCHEMA } },
    system: 'You are an experienced strength and conditioning coach planning one gym session for your client. '
      + 'Fit the session inside minutesAvailable including warm-up and rest. Prioritise targetMuscles if given; otherwise '
      + 'pick muscles that recent workouts have not trained in the last ~48 hours. Serve the client\'s goals. '
      + 'Prefer activities from their library (use its id); add a new activity with activityId "" only when needed. '
      + 'Base weight suggestions on their recent weights. Each recent workout has feel from 1 (rough) to 5 (great): '
      + 'if recent sessions felt rough, ease off volume; if they felt great, progress. '
      + 'If gym.equipmentAvailable is given, only pick exercises whose equipment is all in that list (an empty equipment list '
      + 'means unknown, treat as available); new exercises must also only need that equipment, using the same equipment names. '
      + 'Keep rationale to 2-3 sentences.',
    messages: [{ role: 'user', content: JSON.stringify(context) }],
  });
  if (msg.stop_reason === 'refusal') return send(res, 502, { error: 'The AI declined this request.' });
  const text = msg.content.find(b => b.type === 'text')?.text;
  send(res, 200, JSON.parse(text));
}

async function route(req, res) {
  const url = new URL(req.url, 'http://x');
  const p = url.pathname;
  const m = req.method;

  if (p === '/api/config') return send(res, 200, { googleClientId: GOOGLE_CLIENT_ID || null, authed: authed(req), muscles: MUSCLES });
  if (p === '/api/login' && m === 'POST') return login(req, res);
  if (p === '/api/health' && m === 'POST') return healthIngest(req, res);
  if (!p.startsWith('/api/') && !p.startsWith('/media/')) return sendFile(req, res, PUBLIC, p === '/' ? 'index.html' : p);

  if (!authed(req)) return send(res, 401, { error: 'sign in required' });
  if (p.startsWith('/media/')) return sendFile(req, res, UPLOADS, p.slice(7));
  if (p === '/api/logout' && m === 'POST') {
    delete db.sessions[cookieToken(req)]; save();
    return send(res, 200, { ok: true }, { 'set-cookie': 'sid=; Path=/; Max-Age=0' });
  }
  if (p === '/api/data' && m === 'GET') { const { sessions, ...data } = db; return send(res, 200, data); }
  if (p === '/api/suggest' && m === 'POST') return suggest(req, res);
  if (p === '/api/media' && m === 'POST') return upload(req, res, url);

  const [, , col, id] = p.split('/');
  if (col === 'media' && id && m === 'DELETE') { removeMedia(x => x.id === id); save(); return send(res, 200, { ok: true }); }
  if (!COLLECTIONS.includes(col)) return send(res, 404, { error: 'not found' });
  const list = db[col];
  if (m === 'POST' && !id) {
    const item = { ...(await readJson(req)), id: crypto.randomUUID(), createdAt: new Date().toISOString() };
    list.push(item); save();
    return send(res, 201, item);
  }
  const i = list.findIndex(x => x.id === id);
  if (i < 0) return send(res, 404, { error: 'not found' });
  if (m === 'PUT') { list[i] = { ...list[i], ...(await readJson(req)), id }; save(); return send(res, 200, list[i]); }
  if (m === 'DELETE') {
    list.splice(i, 1);
    if (col === 'activities') removeMedia(x => x.activityId === id);
    save();
    return send(res, 200, { ok: true });
  }
  send(res, 405, { error: 'method not allowed' });
}

http.createServer((req, res) => {
  route(req, res).catch(e => {
    console.error(e);
    if (!res.headersSent) send(res, e.status || (e instanceof SyntaxError ? 400 : 500), { error: e.message });
    else res.end();
  });
}).listen(PORT, () => console.log(`Gym running on http://localhost:${PORT}`));
