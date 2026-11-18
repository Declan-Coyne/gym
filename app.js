const $ = s => document.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const BUSY = ['', 'Quiet', 'Medium', 'Busy', 'Packed'];
const FEEL = [null, ['😫', 'Rough'], ['😕', 'Meh'], ['🙂', 'Good'], ['💪', 'Strong'], ['🔥', 'Great']];
const MTYPES = ['Weight', 'Body fat %', 'Waist', 'Chest', 'Hips', 'Arms', 'Thighs', 'Neck'];
const GROUP = { Chest: 'push', Shoulders: 'push', Triceps: 'push', 'Upper back': 'pull', Lats: 'pull', Traps: 'pull', Biceps: 'pull',
  Forearms: 'pull', Abs: 'core', Obliques: 'core', 'Lower back': 'core', Glutes: 'legs', Quads: 'legs', Hamstrings: 'legs',
  Calves: 'legs', 'Hip flexors': 'legs', Adductors: 'legs', Abductors: 'legs', Cardio: 'cardio' };
const GROUPS = ['push', 'pull', 'legs', 'core', 'cardio'];
const EQUIPMENT = ['Barbell', 'Squat rack', 'Bench', 'Dumbbells', 'Kettlebells', 'EZ bar', 'Smith machine', 'Cable machine',
  'Lat pulldown', 'Seated row', 'Chest press machine', 'Pec deck', 'Shoulder press machine', 'Leg press', 'Leg extension', 'Leg curl',
  'Hip thrust machine', 'Hip adductor/abductor', 'Calf raise machine', 'Back extension bench', 'Pull-up bar', 'Dip station',
  'Resistance bands', 'Treadmill', 'Rowing machine', 'Exercise bike', 'Stair climber'];
const STARTER = [ // name | muscles | equipment
  ['Bench press', 'Chest,Triceps,Shoulders', 'Barbell,Bench'], ['Incline dumbbell press', 'Chest,Shoulders,Triceps', 'Dumbbells,Bench'],
  ['Push-up', 'Chest,Triceps,Shoulders,Abs', 'Bodyweight'], ['Cable fly', 'Chest', 'Cable machine'], ['Overhead press', 'Shoulders,Triceps', 'Barbell'],
  ['Lateral raise', 'Shoulders', 'Dumbbells'], ['Rear delt fly', 'Shoulders,Upper back', 'Dumbbells'], ['Tricep pushdown', 'Triceps', 'Cable machine'],
  ['Skull crusher', 'Triceps', 'EZ bar,Bench'], ['Dips', 'Chest,Triceps', 'Dip station'], ['Pull-up', 'Lats,Biceps,Upper back', 'Pull-up bar'],
  ['Lat pulldown', 'Lats,Biceps', 'Lat pulldown'], ['Barbell row', 'Upper back,Lats,Biceps,Lower back', 'Barbell'],
  ['Seated cable row', 'Upper back,Lats,Biceps', 'Seated row'], ['Face pull', 'Shoulders,Upper back,Traps', 'Cable machine'],
  ['Shrug', 'Traps', 'Dumbbells'], ['Bicep curl', 'Biceps,Forearms', 'Dumbbells'], ['Hammer curl', 'Biceps,Forearms', 'Dumbbells'],
  ['Back squat', 'Quads,Glutes,Hamstrings,Lower back', 'Barbell,Squat rack'], ['Front squat', 'Quads,Glutes,Abs', 'Barbell,Squat rack'],
  ['Deadlift', 'Hamstrings,Glutes,Lower back,Traps,Forearms', 'Barbell'], ['Romanian deadlift', 'Hamstrings,Glutes,Lower back', 'Barbell'],
  ['Leg press', 'Quads,Glutes', 'Leg press'], ['Bulgarian split squat', 'Quads,Glutes', 'Dumbbells,Bench'],
  ['Walking lunge', 'Quads,Glutes,Hamstrings', 'Dumbbells'], ['Leg extension', 'Quads', 'Leg extension'], ['Leg curl', 'Hamstrings', 'Leg curl'],
  ['Hip thrust', 'Glutes,Hamstrings', 'Barbell,Bench'], ['Calf raise', 'Calves', 'Calf raise machine'],
  ['Hip adduction machine', 'Adductors', 'Hip adductor/abductor'], ['Hip abduction machine', 'Abductors', 'Hip adductor/abductor'],
  ['Plank', 'Abs,Obliques', 'Bodyweight'], ['Hanging leg raise', 'Abs,Hip flexors', 'Pull-up bar'], ['Cable crunch', 'Abs', 'Cable machine'],
  ['Russian twist', 'Obliques,Abs', 'Bodyweight'], ['Back extension', 'Lower back,Glutes,Hamstrings', 'Back extension bench'],
  ['Kettlebell swing', 'Glutes,Hamstrings,Lower back', 'Kettlebells'], ['Goblet squat', 'Quads,Glutes', 'Kettlebells'],
  ['Treadmill', 'Cardio', 'Treadmill'], ['Rowing machine', 'Cardio,Upper back,Quads', 'Rowing machine'],
  ['Stationary bike', 'Cardio,Quads', 'Exercise bike'], ['Stair climber', 'Cardio,Glutes,Quads', 'Stair climber'],
];
const ICONS = {
  home: '<path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/>',
  dumbbell: '<path d="M6 6v12M18 6v12M3 9v6M21 9v6M6 12h12"/>',
  list: '<path d="M9 6h12M9 12h12M9 18h12"/><path d="M4 6h.01M4 12h.01M4 18h.01"/>',
  sparkles: '<path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z"/><path d="M19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8z"/>',
  trend: '<path d="M3 17l6-6 4 4 8-8"/><path d="M15 7h6v6"/>',
  bars: '<path d="M5 20V11M12 20V4M19 20v-6"/>',
  play: '<path d="M7 4l13 8-13 8z"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  trophy: '<path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 01-10 0z"/><path d="M17 5h3v2a3 3 0 01-3 3M7 5H4v2a3 3 0 003 3"/>',
  repeat: '<path d="M17 2l4 4-4 4"/><path d="M3 11V9a3 3 0 013-3h15M7 22l-4-4 4-4"/><path d="M21 13v2a3 3 0 01-3 3H3"/>',
  target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
  download: '<path d="M12 3v12M7 10l5 5 5-5M4 21h16"/>',
  check: '<path d="M5 12l5 5L20 7"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7h.01"/>',
  x: '<path d="M6 6l12 12M18 6L6 18"/>',
  disc: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="2.5"/>',
  swap: '<path d="M7 4L3 8l4 4"/><path d="M3 8h14"/><path d="M17 20l4-4-4-4"/><path d="M21 16H7"/>',
  up: '<path d="M6 15l6-6 6 6"/>', down: '<path d="M6 9l6 6 6-6"/>',
  left: '<path d="M15 6l-6 6 6 6"/>', right: '<path d="M9 6l6 6-6 6"/>',
  menu: '<circle cx="5" cy="12" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="19" cy="12" r="1.5"/>',
  pin: '<path d="M12 22s7-6.5 7-12a7 7 0 10-14 0c0 5.5 7 12 7 12z"/><circle cx="12" cy="10" r="2.5"/>',
  star: '<path d="M12 3l2.8 5.8 6.2.9-4.5 4.4 1 6.3L12 17.5 6.5 20.4l1-6.3L3 9.7l6.2-.9z"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  moon: '<path d="M21 12.8A9 9 0 1111.2 3a7 7 0 009.8 9.8z"/>',
  auto: '<rect x="3" y="4" width="18" height="13" rx="2"/><path d="M8 21h8M12 17v4"/>',
  scale: '<path d="M4 20h16l-2-12H6z"/><circle cx="12" cy="5" r="2"/>',
  camera: '<path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/>',
  logout: '<path d="M15 4h4v16h-4M10 17l5-5-5-5M15 12H3"/>',
  heart: '<path d="M12 20s-8-4.5-8-11a4.5 4.5 0 018-2.8A4.5 4.5 0 0120 9c0 6.5-8 11-8 11z"/>',
};
const icon = n => `<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${ICONS[n]}</svg>`;
const PLATES = [25, 20, 15, 10, 5, 2.5, 1.25];
function platesFor(total, bar) { // greedy per-side plate list; `left` = kg that can't be made with these plates
  let side = (total - bar) / 2;
  const out = [];
  for (const p of PLATES) while (side >= p - 1e-9) { out.push(p); side -= p; }
  return { out, left: +(side * 2).toFixed(2) };
}
console.assert(platesFor(100, 20).out.join() === '25,15' && platesFor(61, 20).left === 1 && !platesFor(20, 20).out.length, 'platesFor');

const MUSCLES = ['Chest', 'Upper back', 'Lats', 'Traps', 'Shoulders', 'Biceps', 'Triceps', 'Forearms', 'Abs', 'Obliques',
  'Lower back', 'Glutes', 'Quads', 'Hamstrings', 'Calves', 'Hip flexors', 'Adductors', 'Abductors', 'Cardio'];
const COLLECTIONS = ['activities', 'workouts', 'measurements', 'goals', 'gyms', 'media'];
let S = {}, lastSuggestion = null, actFilter = '', calOffset = 0, insightGym = '', audio;

const store = { // per-device conveniences only; storage may be unavailable (private mode)
  get(k, d) { try { return localStorage.getItem(k) ?? d; } catch { return d; } },
  set(k, v) { try { localStorage.setItem(k, v); } catch {} },
};
window.addEventListener('unhandledrejection', e => toast(e.reason?.message || String(e.reason), true));

// ---------- on-device storage (IndexedDB): 'data' = all records, 'file:<id>' = photo/video blobs ----------
const idb = new Promise((ok, fail) => {
  const r = indexedDB.open('gym', 1);
  r.onupgradeneeded = () => r.result.createObjectStore('kv');
  r.onsuccess = () => ok(r.result);
  r.onerror = () => fail(r.error);
});
async function idbDo(mode, fn) {
  const db = await idb;
  return new Promise((ok, fail) => {
    const tx = db.transaction('kv', mode), req = fn(tx.objectStore('kv'));
    tx.oncomplete = () => ok(req.result);
    tx.onerror = tx.onabort = () => fail(tx.error || new Error('Could not save on this device'));
  });
}
const dbGet = k => idbDo('readonly', s => s.get(k));
const dbPut = (k, v) => idbDo('readwrite', s => s.put(v, k));
const dbDel = k => idbDo('readwrite', s => s.delete(k));
const persist = () => dbPut('data', S);
const URLS = {}; // media id -> object URL of its blob
const fileUrl = m => URLS[m.id] || '';

async function saveItem(col, item) {
  const i = S[col].findIndex(x => x.id === item.id);
  const saved = i < 0 ? { ...item, id: crypto.randomUUID(), createdAt: new Date().toISOString() }
    : { ...S[col][i], ...item, id: S[col][i].id, updatedAt: new Date().toISOString() };
  i < 0 ? S[col].push(saved) : (S[col][i] = saved);
  await persist();
  return saved;
}
async function removeMedia(keep) {
  const gone = S.media.filter(m => !keep(m));
  S.media = S.media.filter(keep);
  for (const m of gone) { await dbDel('file:' + m.id); URL.revokeObjectURL(URLS[m.id]); delete URLS[m.id]; }
}
async function delItem(col, id) {
  if (!confirm('Delete this? This can\'t be undone.')) return false;
  S[col] = S[col].filter(x => x.id !== id);
  if (col === 'activities') await removeMedia(m => m.activityId !== id);
  await persist();
  toast('Deleted');
  return true;
}

// ---------- helpers ----------
const localIso = (d = new Date()) => new Date(d - d.getTimezoneOffset() * 6e4).toISOString();
const today = () => localIso().slice(0, 10);
const asDate = d => new Date(d.length === 10 ? d + 'T00:00' : d);
const fmtDate = d => d ? asDate(d).toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short' }) : '';
const fmtDateTime = d => new Date(d).toLocaleString(undefined, { weekday: 'short', day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' });
const ago = d => { const h = (Date.now() - new Date(d)) / 36e5; return h < 1 ? 'just now' : h < 24 ? Math.round(h) + 'h ago' : Math.round(h / 24) + 'd ago'; };
const mmss = s => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
const num = v => parseFloat(v) || 0;
const kg = v => v >= 10000 ? (v / 1000).toFixed(1) + '<small> t</small>' : Math.round(v).toLocaleString() + '<small> kg</small>';
const byName = (a, b) => a.name.localeCompare(b.name);
const act = id => S.activities.find(a => a.id === id);
const getW = id => S.workouts.find(w => w.id === id);
const completed = () => S.workouts.filter(w => w.completedAt).sort((a, b) => b.completedAt.localeCompare(a.completedAt));
const workoutMuscles = w => [...new Set((w.items || []).flatMap(i => act(i.activityId)?.muscles || []))];
const setsOf = i => i.setsDone ?? num(i.sets);
const volume = w => (w.items || []).reduce((t, i) => t + setsOf(i) * num(i.reps) * num(i.weight), 0);
const e1rm = (w, r) => (w > 0 && r > 0 ? w * (1 + r / 30) : 0); // Epley estimate
const weekStart = d => { const x = new Date(d); x.setHours(0, 0, 0, 0); x.setDate(x.getDate() - (x.getDay() + 6) % 7); return x; };
const addDays = (d, n) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
const chips = list => list.length ? `<div class="chips">${list.map(m => `<span class="chip g-${GROUP[m] || 'other'}">${esc(m)}</span>`).join('')}</div>` : '';
const checked = (f, name) => [...f.querySelectorAll(`[name="${name}"]:checked`)].map(x => x.value);
const tiles = (name, options, sel = [], cls = () => '') => `<div class="checks">${options.map(o => `<label><input type="checkbox" name="${name}"
  value="${esc(o)}" ${sel.includes(o) ? 'checked' : ''}><span class="${cls(o)}">${esc(o)}</span></label>`).join('')}</div>`;
const muscleChecks = (sel = []) => tiles('muscles', MUSCLES, sel, m => 'g-' + (GROUP[m] || 'other'));
const empty = (ic, text, extra = '') => `<div class="empty">${icon(ic)}<div>${text}</div>${extra}</div>`;
const head = (title, sub = '', right = '') => `<div class="page-head"><div><h1>${title}</h1>${sub ? `<p class="sub">${sub}</p>` : ''}</div>${right}</div>`;

// gyms & equipment
const mainGym = () => S.gyms.find(g => g.main) || S.gyms[0];
const gymById = id => S.gyms.find(g => g.id === id);
const gymOfWorkout = w => gymById(w.gymId) || mainGym(); // older workouts without a gym count as the main gym
const gymOptions = sel => S.gyms.map(g => `<option value="${g.id}" ${g.id === sel ? 'selected' : ''}>${esc(g.name)}${g.main ? ' ★' : ''}</option>`).join('');
const availableAt = (a, gym) => !gym || (a.equipment || []).every(e => e === 'Bodyweight' || (gym.equipment || []).includes(e));

function historyFor(aid) { // newest first
  return completed().flatMap(w => (w.items || []).filter(i => i.activityId === aid)
    .map(i => ({ date: w.completedAt, wid: w.id, sets: setsOf(i), reps: i.reps, weight: num(i.weight), e1rm: e1rm(num(i.weight), num(i.reps)) })));
}
function lastHint(aid) {
  const h = aid && historyFor(aid)[0];
  return h ? `Last: <b>${h.sets}×${esc(h.reps)}${h.weight ? ' @ ' + h.weight + ' kg' : ''}</b> · ${fmtDate(h.date)}` : '';
}

// ---------- dialog, toast, theme ----------
function openDialog(html, cls = '') {
  const d = $('#dialog');
  if (d.open) d.close();
  d.onclose = null;
  d.className = cls;
  d.returnValue = '';
  d.innerHTML = `<div class="dlg">${html}</div>`;
  d.showModal();
  return d;
}
const closeDialog = () => $('#dialog').open && $('#dialog').close();
let toastTimer;
function toast(msg, err) {
  const t = $('#toast');
  t.textContent = msg;
  t.className = 'show' + (err ? ' err' : '');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { t.className = err ? 'err' : ''; }, err ? 3500 : 1800);
}
const THEMES = { system: ['auto', 'System'], light: ['sun', 'Light'], dark: ['moon', 'Dark'] };
function setTheme(t) {
  store.set('theme', t);
  if (t === 'system') delete document.documentElement.dataset.theme;
  else document.documentElement.dataset.theme = t;
  $('#themeBtn').innerHTML = icon(THEMES[t][0]);
  $('#themeBtn').title = 'Theme: ' + THEMES[t][1];
}
$('#themeBtn').onclick = () => {
  const order = Object.keys(THEMES), next = order[(order.indexOf(store.get('theme', 'system')) + 1) % order.length];
  setTheme(next);
  toast(THEMES[next][1] + ' theme');
  if (location.hash === '#/more') render();
};
setTheme(store.get('theme', 'system'));

// ---------- media & youtube ----------
const uploader = (q, label = 'Photo / video', accept = 'image/*,video/*') => `<label class="btn small">${icon('plus')} ${label}<input type="file" accept="${accept}" multiple hidden
  onchange="uploadFiles(this, '${q}')"></label>`;
const gallery = (list, canDelete = true) => list.length ? `<div class="gallery" style="margin-top:10px">${[...list].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).map(m => `<figure>
  ${m.type.startsWith('video') ? `<video src="${fileUrl(m)}" controls playsinline preload="metadata"></video>`
    : `<img src="${fileUrl(m)}" loading="lazy" alt="" onclick="viewPhoto('${m.id}')">`}
  <figcaption><span>${fmtDate(m.date)}</span>${canDelete ? `<button class="ghost small" onclick="deleteMedia('${m.id}')">Delete</button>` : ''}</figcaption></figure>`).join('')}</div>` : '';
const viewPhoto = id => openDialog(`<img src="${fileUrl({ id })}" alt="" style="width:100%;border-radius:12px;display:block">
  <div class="actions"><button class="block" onclick="closeDialog()">Close</button></div>`);
async function uploadFiles(input, q, goTo) {
  const files = [...input.files].filter(f => /^(image|video)\//.test(f.type)), p = new URLSearchParams(q);
  for (const [n, f] of files.entries()) {
    toast(`Saving ${n + 1} of ${files.length}…`);
    const m = { id: crypto.randomUUID(), kind: p.get('kind'), activityId: p.get('activityId') || null, date: p.get('date') || today(),
      type: f.type, name: f.name || '', createdAt: new Date().toISOString() };
    await dbPut('file:' + m.id, f);
    URLS[m.id] = URL.createObjectURL(f);
    S.media.push(m);
    await persist();
  }
  toast(files.length ? 'Saved' : 'Only photos and videos can be added', !files.length);
  closeDialog();
  if (goTo && location.hash !== goTo) location.hash = goTo; else render();
}
async function deleteMedia(id) {
  if (!confirm('Delete this file?')) return;
  await removeMedia(m => m.id !== id);
  await persist();
  render();
}
const ytId = u => /(?:youtu\.be\/|[?&]v=|\/shorts\/|\/embed\/|\/live\/)([\w-]{11})/.exec(u || '')?.[1];
const ytStart = u => { const m = /[?&](?:t|start)=(?:(\d+)m)?(\d+)s?/.exec(u || ''); return m ? (+(m[1] || 0)) * 60 + +m[2] : 0; };
const ytEmbed = u => `<div class="yt"><iframe loading="lazy" title="YouTube video" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"
  allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
  src="https://www.youtube-nocookie.com/embed/${ytId(u)}?rel=0&playsinline=1${ytStart(u) ? '&start=' + ytStart(u) : ''}"></iframe></div>`;
const ytList = (a, canDelete) => (a.youtube || []).filter(ytId).length ? `<div class="yt-list">${a.youtube.filter(ytId).map(u => `<div>${ytEmbed(u)}
  ${canDelete ? `<div class="yt-row"><a href="${esc(u)}" target="_blank" rel="noopener">Open in YouTube</a>
  <button class="ghost small danger" onclick="removeYoutube('${a.id}', '${esc(u)}')">Remove</button></div>` : ''}</div>`).join('')}</div>` : '';
async function addYoutube(e, id) {
  e.preventDefault();
  const url = e.target.elements.url.value.trim();
  if (!ytId(url)) return toast("That doesn't look like a YouTube link", true);
  const a = act(id);
  await saveItem('activities', { ...a, youtube: [...(a.youtube || []), url] });
  toast('Video added');
  render();
}
async function removeYoutube(id, url) {
  const a = act(id);
  await saveItem('activities', { ...a, youtube: (a.youtube || []).filter(u => u !== url) });
  render();
}

// ---------- quick actions (the + button) ----------
function quickSheet() {
  const next = S.workouts.filter(w => !w.completedAt).sort((a, b) => (b.startedAt || '').localeCompare(a.startedAt || '') || (a.date || '').localeCompare(b.date || ''))[0];
  openDialog(`<h3 style="margin-bottom:14px">What do you want to do?</h3><div class="sheet-grid">
    ${next ? `<button class="wide primary" onclick="closeDialog(); startWorkout('${next.id}')">${icon('play')}<span>${next.startedAt ? 'Resume' : 'Start'} ${esc(next.name)}
      <br><small style="color:inherit;opacity:.8">${(next.items || []).length} exercises${gymOfWorkout(next) ? ' · ' + esc(gymOfWorkout(next).name) : ''}</small></span></button>` : ''}
    <button onclick="closeDialog(); quickStart()">${icon('dumbbell')}<span>Empty workout<br><small>Add exercises as you go</small></span></button>
    <a href="#/ai" onclick="closeDialog()">${icon('sparkles')}<span>AI plan<br><small>Built for your gym</small></span></a>
    <a href="#/workout/new" onclick="closeDialog()">${icon('plus')}<span>Plan workout<br><small>For later</small></span></a>
    <button onclick="logWeightDialog()">${icon('scale')}<span>Log weight<br><small>${weights().at(-1) ? 'Last: ' + weights().at(-1).value + ' ' + esc(weights().at(-1).unit || 'kg') : 'Start tracking'}</small></span></button>
    <label>${icon('camera')}<span>Progress photo<br><small>Take or choose one</small></span>
      <input type="file" accept="image/*" hidden onchange="uploadFiles(this, 'kind=progress&date=${today()}', '#/progress')"></label>
    <button onclick="closeDialog(); plateDialog()">${icon('disc')}<span>Plate calculator<br><small>Plates + warm-ups</small></span></button>
    <a href="#/progress" onclick="closeDialog()">${icon('trend')}<span>Measurements<br><small>Waist, arms…</small></span></a></div>`, 'sheet');
}
async function quickStart() {
  const w = await saveItem('workouts', { name: 'Workout', date: today(), items: [], gymId: mainGym()?.id || null });
  startWorkout(w.id);
}

// ---------- home ----------
function home() {
  const done = completed();
  const ws = weekStart(new Date());
  const inRange = (from, to) => done.filter(w => { const t = new Date(w.completedAt); return t >= from && t < to; });
  let streak = 0;
  for (let s = inRange(ws, addDays(ws, 7)).length ? ws : addDays(ws, -7); inRange(s, addDays(s, 7)).length; s = addDays(s, -7)) streak++;
  const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  const monthVol = inRange(monthStart, addDays(new Date(), 1)).reduce((t, w) => t + volume(w), 0);
  const planned = S.workouts.filter(w => !w.completedAt).sort((a, b) => (a.date || '').localeCompare(b.date || ''));
  const next = planned.find(w => w.startedAt) || planned[0];
  const hour = new Date().getHours();
  const hi = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  const days = [...Array(7)].map((_, i) => addDays(ws, i));
  const goals = S.goals.filter(g => !g.done).slice(0, 3);
  const todayMid = addDays(new Date(), 0).getTime();
  return `<div class="hero"><h1>${hi} 👋</h1>
    <p>${next ? `Up next: <b>${esc(next.name)}</b>${next.date ? ' · ' + fmtDate(next.date) : ''}` : 'Nothing planned yet. Tap ＋ to get going.'}</p>
    <div class="actions">${next ? `<button class="btn solid" onclick="startWorkout('${next.id}')">${icon('play')} ${next.startedAt ? 'Resume' : 'Start'}</button>`
      : `<button class="btn solid" onclick="quickStart()">${icon('play')} Quick start</button>`}
    <a class="btn" href="#/ai">${icon('sparkles')} AI plan</a></div></div>
  <div class="stats">
    <div class="stat"><b>${inRange(ws, addDays(ws, 7)).length}</b><span>This week</span></div>
    <div class="stat"><b>${streak}${streak ? ' 🔥' : ''}</b><span>Week streak</span></div>
    <div class="stat"><b>${kg(monthVol)}</b><span>Lifted this month</span></div></div>
  <div class="card"><div class="week">${days.map(d => {
    const n = done.filter(w => asDate(localIso(new Date(w.completedAt)).slice(0, 10)).getTime() === d.getTime()).length;
    return `<div>${d.toLocaleDateString(undefined, { weekday: 'narrow' })}<i class="${n ? 'done' : ''} ${d.getTime() === todayMid ? 'today' : ''}">${n ? '✓' : d.getDate()}</i></div>`;
  }).join('')}</div></div>
  ${weightCard(90, true)}${gymNow()}${recovery()}
  <div class="spread"><h2>Goals</h2><a class="btn ghost small" href="#/goals">Manage</a></div>
  ${goals.length ? goals.map(g => `<a class="card spread" href="#/goals"><span>${icon('target')} ${esc(g.text)}</span><span class="muted small">${fmtDate(g.targetDate)}</span></a>`).join('')
    : empty('target', 'Set a goal and the AI planner will build around it.', '<a class="btn small" style="margin-top:10px" href="#/goals">Add a goal</a>')}
  <div class="spread"><h2>Recent</h2><a class="btn ghost small" href="#/workouts">All workouts</a></div>
  ${done.slice(0, 3).map(workoutCard).join('') || empty('dumbbell', 'Your finished workouts will show up here.')}`;
}
function gymNow() { // forecast from your own busyness ratings at the main gym for this weekday
  const gym = mainGym();
  const cells = busynessGrid(S.workouts, gym?.id), now = new Date(), day = (now.getDay() + 6) % 7;
  const slot = SLOTS.findLastIndex(([h]) => now.getHours() >= h);
  const avg = i => { const c = cells[day + '-' + i]; return c && c[0] / c[1]; };
  const quietest = SLOTS.map((_, i) => i).filter(i => i >= slot && avg(i)).sort((a, b) => avg(a) - avg(b))[0];
  if (!gym && !avg(slot) && quietest === undefined) return '';
  const body = !avg(slot) && quietest === undefined
    ? `<span class="muted">Rate how busy it is when you finish workouts and you'll see a forecast here.</span>`
    : `${avg(slot) ? `Usually <b>${BUSY[Math.round(avg(slot))].toLowerCase()}</b> around now.` : ''}
       ${quietest !== undefined && quietest !== slot ? ` Quietest later today: <b>${SLOTS[quietest][1]}</b>.` : ''}`;
  return `<a class="card info-card" href="${gym ? '#/gym/' + gym.id : '#/gyms'}"><span class="ic-wrap">${icon('pin')}</span>
    <div><b>${gym ? esc(gym.name) : 'Your gym'}</b><div class="small">${body}</div></div></a>`;
}
function recovery() { // hours since each muscle was last trained
  const last = {};
  for (const w of completed()) for (const i of w.items || []) for (const m of act(i.activityId)?.muscles || []) last[m] ??= w.completedAt;
  if (!Object.keys(last).length) return '';
  const status = m => { const h = last[m] ? (Date.now() - new Date(last[m])) / 36e5 : Infinity; return h < 24 ? 'sore' : h < 60 ? 'recovering' : 'ready'; };
  const list = MUSCLES.filter(m => m !== 'Cardio');
  const ready = list.filter(m => status(m) === 'ready');
  return `<div class="card"><div class="spread"><b>${icon('heart')} Recovery</b><span class="muted small">${ready.length} of ${list.length} ready</span></div>
    <div class="dots">${list.map(m => `<span class="dot ${status(m)}" title="${last[m] ? 'Trained ' + ago(last[m]) : 'Not trained yet'}">${esc(m)}</span>`).join('')}</div>
    <div class="hint">Green = ready · amber = recovering (1–2.5 days) · red = trained in the last day</div></div>`;
}
const toDataUrl = blob => new Promise((ok, fail) => { const r = new FileReader(); r.onload = () => ok(r.result); r.onerror = () => fail(r.error); r.readAsDataURL(blob); });
// shortcut: videos are left out of the backup (too big for one JSON file); include them if a zip backup is ever added
async function exportData() {
  toast('Preparing backup…');
  const files = {};
  for (const m of S.media) if (m.type.startsWith('image')) { const b = await dbGet('file:' + m.id); if (b) files[m.id] = await toDataUrl(b); }
  const file = new File([JSON.stringify({ ...S, files })], `gym-backup-${today()}.json`, { type: 'application/json' });
  if (navigator.canShare?.({ files: [file] })) return navigator.share({ files: [file] }).catch(() => {}); // iPhone: Save to Files / iCloud
  const a = document.createElement('a');
  a.href = URL.createObjectURL(file);
  a.download = file.name;
  a.click();
}
async function importData(input) {
  const f = input.files[0];
  input.value = '';
  if (!f) return;
  let data;
  try { data = JSON.parse(await f.text()); } catch { return toast('That file is not a Gym backup', true); }
  if (!Array.isArray(data.workouts) || !Array.isArray(data.activities)) return toast('That file is not a Gym backup', true);
  if (!confirm('Replace everything on this phone with this backup?')) return;
  const { files = {}, ...rest } = data;
  await removeMedia(() => false);
  for (const [id, url] of Object.entries(files)) {
    const blob = await (await fetch(url)).blob();
    await dbPut('file:' + id, blob);
    URLS[id] = URL.createObjectURL(blob);
  }
  S = rest;
  for (const c of COLLECTIONS) S[c] ||= [];
  S.media = S.media.filter(m => URLS[m.id]); // drop entries whose file wasn't in the backup (videos)
  await persist();
  toast('Backup restored');
  location.hash = '#/home';
  render();
}

// ---------- workouts ----------
function workoutCard(w) {
  const dur = w.durationMin ? `<span>${icon('clock')} ${w.durationMin} min</span>` : '';
  const vol = volume(w) ? `<span>${icon('dumbbell')} ${kg(volume(w))}</span>` : '';
  const gym = S.gyms.length > 1 && gymOfWorkout(w) ? `<span>${icon('pin')} ${esc(gymOfWorkout(w).name)}</span>` : '';
  const badge = w.completedAt ? `<span>${w.feel ? FEEL[w.feel][0] + ' ' : ''}${w.busyness ? `<span class="badge b${w.busyness}">${BUSY[w.busyness]}</span>` : ''}</span>`
    : `<span class="badge plan">${w.startedAt ? 'In progress' : 'Planned'}</span>`;
  return `<a class="card" href="#/${w.startedAt && !w.completedAt ? 'live' : 'workout'}/${w.id}"><div class="spread"><h3>${esc(w.name || 'Workout')}</h3>${badge}</div>
    <div class="w-meta"><span>${fmtDate(w.completedAt || w.date)}</span><span>${(w.items || []).length} exercises</span>${dur}${vol}${gym}</div>
    ${chips(workoutMuscles(w))}</a>`;
}
function workouts() {
  const planned = S.workouts.filter(w => !w.completedAt).sort((a, b) => (a.date || '').localeCompare(b.date || ''));
  return `${head('Workouts', `${completed().length} done · ${planned.length} planned`, `<a class="btn primary" href="#/workout/new">${icon('plus')} New</a>`)}
    <h2>Planned</h2>${planned.map(workoutCard).join('') || empty('dumbbell', 'Nothing planned.', '<a class="btn small" style="margin-top:10px" href="#/ai">Plan one with AI</a>')}
    <h2>History</h2>${completed().map(workoutCard).join('') || empty('clock', 'No completed workouts yet.')}`;
}
const itemRow = (i = {}, n = '') => `<div class="item" data-i="${n}"><div class="row" style="flex-wrap:nowrap">
  <select class="grow" name="activityId" required onchange="pickActivity(this)"><option value="">Choose exercise…</option>
  ${[...S.activities].sort(byName).map(a => `<option value="${a.id}" ${a.id === i.activityId ? 'selected' : ''}>${esc(a.name)}</option>`).join('')}</select>
  <div class="item-tools"><button type="button" class="ghost" title="Move up" onclick="moveItem(this, -1)">${icon('up')}</button>
  <button type="button" class="ghost" title="Move down" onclick="moveItem(this, 1)">${icon('down')}</button>
  <button type="button" class="ghost" title="How-to" onclick="showHowTo(this.closest('.item').querySelector('select').value)">${icon('info')}</button>
  <button type="button" class="ghost" title="Remove" onclick="this.closest('.item').remove(); updateMuscles()">${icon('x')}</button></div></div>
  <div class="nums"><div><label>Sets</label><input name="sets" inputmode="numeric" value="${esc(i.sets)}"></div>
  <div><label>Reps</label><input name="reps" value="${esc(i.reps)}"></div>
  <div><label>Weight (kg)</label><input name="weight" inputmode="decimal" value="${esc(i.weight)}"></div></div>
  <input type="hidden" name="inotes" value="${esc(i.notes)}">
  <div class="hint" data-hint>${lastHint(i.activityId)}</div>${i.notes ? `<div class="hint">${esc(i.notes)}</div>` : ''}</div>`;
function workout(id) {
  if (id === 'new') id = '';
  const w = getW(id) || { name: '', date: today(), items: [], gymId: mainGym()?.id };
  const wid = w.id || '';
  return `${head(w.id ? esc(w.name) : 'New workout', w.completedAt ? 'Completed ' + fmtDateTime(w.completedAt) : w.startedAt ? 'In progress' : 'Planned')}
  ${w.completedAt ? `<div class="card"><div class="w-meta" style="margin:0">
    ${w.durationMin ? `<span>${icon('clock')} ${w.durationMin} min</span>` : ''}<span>${icon('dumbbell')} ${kg(volume(w))}</span>
    ${gymOfWorkout(w) ? `<span>${icon('pin')} ${esc(gymOfWorkout(w).name)}</span>` : ''}
    ${w.busyness ? `<span class="badge b${w.busyness}">Gym ${BUSY[w.busyness].toLowerCase()}</span>` : ''}
    ${w.feel ? `<span>${FEEL[w.feel].join(' ')}</span>` : ''}</div></div>` : ''}
  <form id="wf" onsubmit="saveWorkout(event, '${wid}')" onchange="updateMuscles()">
    <label>Name</label><input name="name" value="${esc(w.name)}" placeholder="Push day" required>
    <div class="row"><div class="grow"><label>Date</label><input type="date" name="date" value="${esc(w.date)}"></div>
    ${S.gyms.length ? `<div class="grow"><label>Gym</label><select name="gymId">${gymOptions(w.gymId || mainGym()?.id)}</select></div>` : ''}</div>
    <h2>Exercises</h2><div id="items">${(w.items || []).map(itemRow).join('')}</div>
    <button type="button" class="block" onclick="addItem()">${icon('plus')} Add exercise</button>
    <h2>Muscles worked</h2><div id="muscles"></div>
    <label>Notes</label><textarea name="notes">${esc(w.notes)}</textarea>
    <div class="actions"><button class="primary">Save</button>
      ${w.completedAt ? `<button type="button" onclick="repeatWorkout('${wid}')">${icon('repeat')} Do again</button>
        <button type="button" onclick="uncomplete('${wid}')">Undo complete</button>`
        : `<button type="button" onclick="saveWorkout(null, '${wid}', 'live')">${icon('play')} ${w.startedAt ? 'Resume' : 'Start'}</button>
        <button type="button" onclick="saveWorkout(null, '${wid}', 'complete')">${icon('check')} Log as done</button>`}
      ${w.id ? `<button type="button" class="danger" onclick="deleteWorkout('${wid}')">Delete</button>` : ''}</div>
  </form>`;
}
function addItem() {
  if (!S.activities.length) return toast('Add some exercises first (More → Exercises)', true);
  $('#items').insertAdjacentHTML('beforeend', itemRow());
}
function moveItem(btn, dir) {
  const el = btn.closest('.item'), other = dir < 0 ? el.previousElementSibling : el.nextElementSibling;
  if (other) dir < 0 ? other.before(el) : other.after(el);
}
function pickActivity(sel) {
  const el = sel.closest('.item'), last = historyFor(sel.value)[0];
  el.querySelector('[data-hint]').innerHTML = lastHint(sel.value);
  if (!last) return;
  for (const [k, v] of [['sets', last.sets], ['reps', last.reps], ['weight', last.weight || '']]) {
    const input = el.querySelector(`[name="${k}"]`);
    if (!input.value) input.value = v;
  }
}
function updateMuscles() {
  const items = [...document.querySelectorAll('#items select')].map(s => ({ activityId: s.value }));
  $('#muscles').innerHTML = chips(workoutMuscles({ items })) || '<p class="muted">Add exercises to see muscles.</p>';
}
async function saveWorkout(e, id, then) {
  e?.preventDefault();
  const f = $('#wf');
  if (!f.reportValidity()) return;
  const v = (el, n) => el.querySelector(`[name="${n}"]`).value;
  const old = getW(id)?.items || [];
  const items = [...f.querySelectorAll('.item')].map(el => ({ ...old[el.dataset.i], // keeps setsDone when rows are reordered
    activityId: v(el, 'activityId'), sets: v(el, 'sets'), reps: v(el, 'reps'), weight: v(el, 'weight'), notes: v(el, 'inotes') }));
  const w = await saveItem('workouts', { ...getW(id), name: f.elements.name.value.trim(), date: f.elements.date.value,
    gymId: f.elements.gymId?.value || null, notes: f.elements.notes.value, items });
  if (then === 'live') return startWorkout(w.id);
  if (then !== 'complete') { toast('Workout saved'); return void (location.hash = '#/workouts'); }
  history.replaceState(null, '', '#/workout/' + w.id);
  completeDialog(w.id);
}
function completeDialog(id) {
  const w = getW(id);
  const mins = w.startedAt ? Math.max(1, Math.round((Date.now() - new Date(w.startedAt)) / 6e4)) : '';
  const d = openDialog(`<form method="dialog" id="cf"><h1 style="margin-top:0">Nice work 💪</h1>
    <div class="row"><div class="grow"><label>Finished at</label><input type="datetime-local" name="at" value="${localIso().slice(0, 16)}" required></div>
    <div style="width:110px"><label>Minutes</label><input type="number" name="dur" inputmode="numeric" min="1" value="${mins}"></div></div>
    ${S.gyms.length ? `<label>Gym</label><select name="gymId">${gymOptions(gymOfWorkout(w)?.id)}</select>` : ''}
    <label>How busy was the gym?</label><div class="busy-pick">${[1, 2, 3, 4].map(n =>
      `<label><input type="radio" name="busy" value="${n}" required><span>${BUSY[n]}</span></label>`).join('')}</div>
    <label>How did it feel?</label><div class="busy-pick feel">${FEEL.slice(1).map(([e, t], n) =>
      `<label><input type="radio" name="feel" value="${n + 1}"><span>${e}<br><small>${t}</small></span></label>`).join('')}</div>
    <div class="actions"><button class="primary" value="ok">Save</button><button value="cancel" formnovalidate>Cancel</button></div></form>`);
  d.onclose = async () => {
    if (d.returnValue !== 'ok') return render();
    const f = $('#cf').elements;
    stopRest();
    const prs = newRecords(getW(id));
    await saveItem('workouts', { ...getW(id), completedAt: new Date(f.at.value).toISOString(), durationMin: +f.dur.value || null,
      busyness: +f.busy.value, feel: +f.feel.value || null, gymId: f.gymId?.value || getW(id).gymId || null });
    location.hash = '#/workout/' + id;
    render();
    prs.length ? celebrate(prs) : toast('Workout complete 🎉');
  };
}
function newRecords(w) { // heavier than any previous completed session of the same exercise
  const best = {};
  for (const i of w.items || []) {
    if (!num(i.weight) || !setsOf(i)) continue;
    const prev = Math.max(0, ...historyFor(i.activityId).filter(h => h.wid !== w.id).map(h => h.weight));
    if (prev && num(i.weight) > prev && num(i.weight) > (best[i.activityId]?.now || 0))
      best[i.activityId] = { name: act(i.activityId)?.name, now: num(i.weight), prev };
  }
  return Object.values(best);
}
function celebrate(prs) {
  openDialog(`<div style="text-align:center"><div style="font-size:56px">🏆</div><h1>New personal record${prs.length > 1 ? 's' : ''}!</h1></div>
    ${prs.map(p => `<div class="card spread"><b>${esc(p.name)}</b><span><b>${p.now} kg</b> <span class="muted small">was ${p.prev}</span></span></div>`).join('')}
    <form method="dialog" class="actions" style="justify-content:center"><button class="primary">Let's go</button></form>`);
}
async function uncomplete(id) {
  await saveItem('workouts', { ...getW(id), completedAt: null, busyness: null, durationMin: null, feel: null });
  render();
}
async function repeatWorkout(id) {
  const w = getW(id);
  const copy = await saveItem('workouts', { name: w.name, date: today(), notes: w.notes, gymId: w.gymId || null,
    items: w.items.map(({ setsDone, ...i }) => ({ ...i, sets: i.sets || String(setsDone ?? '') })) });
  toast('Copied as a new plan');
  location.hash = '#/workout/' + copy.id;
}
async function deleteWorkout(id) { if (await delItem('workouts', id)) location.hash = '#/workouts'; }
function showHowTo(id) {
  const a = act(id);
  if (!a) return toast('Choose an exercise first', true);
  openDialog(`<h1 style="margin-top:0">${esc(a.name)}</h1>${chips(a.muscles || [])}
    ${(a.equipment || []).length ? `<div class="hint">Needs: ${esc(a.equipment.join(', '))}</div>` : ''}
    ${a.notes ? `<p style="white-space:pre-wrap">${esc(a.notes)}</p>` : ''}<div style="margin-top:12px">${ytList(a, false)}</div>
    ${gallery(S.media.filter(m => m.activityId === id), false)}
    ${!a.notes && !(a.youtube || []).length && !S.media.some(m => m.activityId === id) ? '<p class="muted">No how-to saved yet. Add notes, photos or a YouTube link on the exercise page.</p>' : ''}
    <form method="dialog" class="actions"><button>Close</button><a class="btn" href="#/activity/${a.id}" onclick="closeDialog()">Edit exercise</a></form>`);
}

// ---------- plate calculator ----------
function plateDialog(weight = 0) {
  openDialog(`<h1 style="margin-top:0">Plate calculator</h1>
    <div class="row"><div class="grow"><label>Target weight (kg)</label><input id="pw" type="number" step="any" inputmode="decimal" value="${weight || ''}" oninput="plateCalc()"></div>
    <div class="grow"><label>Bar (kg)</label><select id="pb" onchange="store.set('bar', this.value); plateCalc()">
    ${[20, 15, 10, 7].map(b => `<option ${+store.get('bar', '20') === b ? 'selected' : ''}>${b}</option>`).join('')}</select></div></div>
    <div id="pout"></div><form method="dialog" class="actions"><button>Close</button></form>`);
  plateCalc();
}
function plateCalc() {
  const w = num($('#pw').value), bar = num($('#pb').value);
  if (w < bar) return void ($('#pout').innerHTML = `<p class="muted">Enter at least the bar weight (${bar} kg).</p>`);
  const show = t => {
    const { out, left } = platesFor(t, bar);
    return (out.length ? out.map(p => `<span class="plate p${String(p).replace('.', '_')}">${p}</span>`).join('') : '<span class="muted small">Empty bar</span>')
      + (left ? `<span class="muted small">+${left} kg can't be made</span>` : '');
  };
  const round = x => Math.max(bar, Math.round(x / 2.5) * 2.5);
  const warm = [[bar, 10], [round(w * .4), 5], [round(w * .6), 3], [round(w * .8), 2]]
    .filter(([x], i, all) => x < w && (i === 0 || x > all[i - 1][0]));
  $('#pout').innerHTML = `<h2>Each side</h2><div class="plates">${show(w)}</div>
    ${warm.length ? `<h2>Warm-up sets</h2><table class="hist">${warm.map(([x, r]) => `<tr><td style="white-space:nowrap"><b>${x} kg</b> × ${r}</td>
    <td><div class="plates small">${show(x)}</div></td></tr>`).join('')}</table>` : ''}`;
}

// ---------- live mode ----------
async function startWorkout(id) {
  const w = getW(id);
  if (!w.startedAt) await saveItem('workouts', { ...w, startedAt: new Date().toISOString() });
  location.hash = '#/live/' + id;
}
function live(id) {
  const w = getW(id);
  if (!w) return empty('dumbbell', 'Workout not found.');
  const rest = store.get('rest', '90'), gym = gymOfWorkout(w);
  const total = (w.items || []).reduce((t, i) => t + Math.max(1, num(i.sets)), 0);
  const doneSets = (w.items || []).reduce((t, i) => t + Math.min(i.setsDone || 0, Math.max(1, num(i.sets))), 0);
  const avail = [...S.activities].sort(byName).filter(a => availableAt(a, gym));
  return `<div class="live-bar"><div><div class="muted small">${esc(w.name)}${gym ? ' · ' + esc(gym.name) : ''}</div>
    <div class="clock" id="elapsed" data-start="${esc(w.startedAt)}">0:00</div></div>
    <button class="primary" onclick="completeDialog('${id}')">${icon('check')} Finish</button></div>
  ${total ? `<div class="progress-track" title="${doneSets} of ${total} sets"><i style="width:${doneSets / total * 100}%"></i></div>` : ''}
  ${(w.items || []).map((i, n) => {
    const a = act(i.activityId), sets = Math.max(1, num(i.sets)), done = i.setsDone || 0;
    return `<div class="item ${done >= sets ? 'complete' : ''}"><div class="spread"><h3>${esc(a?.name || 'Deleted exercise')}</h3>
      <div class="item-tools"><button class="ghost" title="Plate calculator" onclick="plateDialog(${num(i.weight)})">${icon('disc')}</button>
      <button class="ghost" title="Swap exercise" onclick="swapDialog('${id}', ${n})">${icon('swap')}</button>
      <button class="ghost" title="How-to" onclick="showHowTo('${i.activityId}')">${icon('info')}</button></div></div>
      ${i.notes ? `<div class="hint">${esc(i.notes)}</div>` : ''}<div class="hint">${lastHint(i.activityId)}</div>
      <div class="nums"><div><label>Reps</label><input value="${esc(i.reps)}" onchange="liveEdit(${n}, 'reps', this.value)"></div>
      <div><label>Weight (kg)</label><input inputmode="decimal" value="${esc(i.weight)}" onchange="liveEdit(${n}, 'weight', this.value)"></div>
      <div><label>Sets</label><input inputmode="numeric" value="${esc(i.sets)}" onchange="liveEdit(${n}, 'sets', this.value)"></div></div>
      <div class="sets">${[...Array(sets)].map((_, s) => `<button class="set ${s < done ? 'done' : ''}" onclick="tapSet('${id}', ${n}, ${s})">${s < done ? '✓' : s + 1}</button>`).join('')}</div></div>`;
  }).join('') || empty('dumbbell', 'No exercises yet. Add one below.')}
  <select onchange="liveAdd('${id}', this.value)" style="margin-bottom:12px"><option value="">＋ Add an exercise${gym ? ' (available at ' + esc(gym.name) + ')' : ''}…</option>
    ${avail.map(a => `<option value="${a.id}">${esc(a.name)}</option>`).join('')}</select>
  <div class="row"><span class="muted">Rest timer</span><select style="width:auto" onchange="store.set('rest', this.value); toast('Rest timer ' + mmss(this.value))">
    ${[45, 60, 90, 120, 180, 240].map(s => `<option value="${s}" ${+rest === s ? 'selected' : ''}>${mmss(s)}</option>`).join('')}</select>
    <a class="btn small" href="#/workout/${id}">Edit workout</a></div>`;
}
async function liveAdd(id, aid) {
  if (!aid) return;
  const w = getW(id), last = historyFor(aid)[0];
  w.items = [...(w.items || []), { activityId: aid, sets: String(last?.sets || 3), reps: String(last?.reps || 10), weight: String(last?.weight || '') }];
  await saveItem('workouts', w);
  render();
}
function swapDialog(id, n) { // e.g. machine taken: offer exercises at this gym with the most muscle overlap
  const w = getW(id), cur = act(w.items[n].activityId), mine = new Set(cur?.muscles || []), gym = gymOfWorkout(w);
  const inWorkout = new Set(w.items.map(i => i.activityId));
  const score = a => (a.muscles || []).filter(m => mine.has(m)).length / (new Set([...(a.muscles || []), ...mine]).size || 1);
  const opts = S.activities.filter(a => !inWorkout.has(a.id) && score(a) > 0 && availableAt(a, gym)).sort((a, b) => score(b) - score(a)).slice(0, 8);
  openDialog(`<h1 style="margin-top:0">Swap ${esc(cur?.name || 'exercise')}</h1>
    <p class="sub">Same muscles${gym ? `, available at ${esc(gym.name)}` : ''}:</p>
    ${opts.map(a => `<button class="card swap-opt" onclick="doSwap('${id}', ${n}, '${a.id}')"><b>${esc(a.name)}</b>${chips(a.muscles || [])}</button>`).join('')
      || '<p class="muted">No similar exercises in your library yet.</p>'}
    <form method="dialog" class="actions"><button>Cancel</button></form>`, 'sheet');
}
async function doSwap(id, n, aid) {
  const w = getW(id), last = historyFor(aid)[0];
  w.items[n] = { ...w.items[n], activityId: aid, weight: String(last?.weight || ''), notes: '' };
  closeDialog();
  await saveItem('workouts', w);
  toast('Swapped to ' + act(aid).name);
  render();
}
let wakeLock = null;
async function keepAwake(on) { // keep the phone screen on during live mode (no-op where unsupported)
  try {
    if (on && !wakeLock && navigator.wakeLock) {
      wakeLock = await navigator.wakeLock.request('screen');
      wakeLock.addEventListener('release', () => { wakeLock = null; });
    } else if (!on && wakeLock) await wakeLock.release();
  } catch {}
}
document.addEventListener('visibilitychange', () => { if (!document.hidden) keepAwake(location.hash.startsWith('#/live/')); });
async function liveEdit(n, key, value) {
  const w = getW(location.hash.split('/')[2]);
  w.items[n][key] = value;
  await saveItem('workouts', w);
  render();
}
async function tapSet(id, n, s) {
  audio ||= new (window.AudioContext || window.webkitAudioContext)(); // must be created in a tap for iOS
  const w = getW(id), item = w.items[n];
  const was = item.setsDone || 0;
  item.setsDone = s < was ? s : s + 1;
  if (item.setsDone > was) startRest();
  await saveItem('workouts', w);
  render();
}
let restEnd = 0;
function startRest() { restEnd = Date.now() + +store.get('rest', '90') * 1000; tick(); }
function addRest(s) { restEnd += s * 1000; tick(); }
function stopRest() { restEnd = 0; tick(); }
function beep() {
  if (!audio) return;
  for (const t of [0, 0.25, 0.5]) {
    const o = audio.createOscillator(), g = audio.createGain();
    o.frequency.value = 880; o.connect(g); g.connect(audio.destination);
    g.gain.setValueAtTime(0.25, audio.currentTime + t); g.gain.exponentialRampToValueAtTime(0.001, audio.currentTime + t + 0.2);
    o.start(audio.currentTime + t); o.stop(audio.currentTime + t + 0.2);
  }
}
function tick() {
  const el = $('#elapsed');
  if (el?.dataset.start) el.textContent = mmss((Date.now() - new Date(el.dataset.start)) / 1000);
  const left = Math.ceil((restEnd - Date.now()) / 1000);
  if (restEnd && left <= 0) { restEnd = 0; beep(); navigator.vibrate?.([200, 100, 200]); }
  $('#rest').hidden = !restEnd;
  if (restEnd) $('#rest b').textContent = mmss(left);
}
setInterval(tick, 500);

// ---------- exercises ----------
function activities() {
  const gym = mainGym(), onlyGym = gym && store.get('onlyGym', '0') === '1';
  const list = [...S.activities].sort(byName).filter(a => (!actFilter || (a.muscles || []).some(m => GROUP[m] === actFilter)) && (!onlyGym || availableAt(a, gym)));
  return `${head('Exercises', `${S.activities.length} in your library`, `<a class="btn primary" href="#/activity/new">${icon('plus')} New</a>`)}
  <input placeholder="Search name, muscle or equipment…" oninput="filterCards(this.value)" style="margin-bottom:10px">
  <div class="seg">${gym ? `<button class="${onlyGym ? 'on' : ''}" onclick="store.set('onlyGym', '${onlyGym ? 0 : 1}'); render()">${icon('pin')} ${esc(gym.name)}</button>` : ''}
  ${['', ...GROUPS].map(g => `<button class="${g === actFilter ? 'on' : ''}" onclick="actFilter='${g}'; render()">${g ? g[0].toUpperCase() + g.slice(1) : 'All'}</button>`).join('')}</div>
  ${list.map(a => {
    const n = S.media.filter(m => m.activityId === a.id).length, yt = (a.youtube || []).length;
    const pr = Math.max(0, ...historyFor(a.id).map(h => h.weight));
    return `<a class="card" data-q="${esc((a.name + ' ' + (a.muscles || []).join(' ') + ' ' + (a.equipment || []).join(' ')).toLowerCase())}" href="#/activity/${a.id}">
      <div class="spread"><h3>${esc(a.name)}</h3><span class="w-meta" style="margin:0">${pr ? `<span>${icon('trophy')} ${pr} kg</span>` : ''}
      ${yt ? `<span>${icon('play')} ${yt}</span>` : ''}${n ? `<span>${icon('camera')} ${n}</span>` : ''}</span></div>
      ${(a.equipment || []).length ? `<div class="hint">${esc(a.equipment.join(' · '))}</div>` : ''}${chips(a.muscles || [])}</a>`;
  }).join('') || empty('list', onlyGym ? `Nothing matches at ${esc(gym.name)}. Add its equipment on the gym page.` : 'No exercises yet.')}
  <div class="actions" style="justify-content:center"><button class="ghost small" onclick="addStarter()">${icon('plus')} Add / update starter exercises</button></div>`;
}
const filterCards = q => document.querySelectorAll('.card[data-q]').forEach(c => { c.hidden = !c.dataset.q.includes(q.toLowerCase()); });
async function addStarter() {
  const byLower = Object.fromEntries(S.activities.map(a => [a.name.toLowerCase(), a]));
  const missing = STARTER.filter(([n]) => !byLower[n.toLowerCase()]);
  const noEquip = STARTER.filter(([n]) => byLower[n.toLowerCase()] && !(byLower[n.toLowerCase()].equipment || []).length);
  if (!missing.length && !noEquip.length) return toast('Starter exercises are all up to date');
  if (!confirm(`Add ${missing.length} common exercises${noEquip.length ? ` and fill in equipment for ${noEquip.length} existing ones` : ''}?`)) return;
  for (const [name, m, e] of missing) await saveItem('activities', { name, muscles: m.split(','), equipment: e.split(','), notes: '' });
  for (const [name, , e] of noEquip) await saveItem('activities', { ...byLower[name.toLowerCase()], equipment: e.split(',') });
  toast('Exercises updated');
  render();
}
function activity(id) {
  if (id === 'new') id = '';
  const a = act(id) || { name: '', muscles: [], equipment: [], notes: '' };
  const hist = a.id ? historyFor(a.id) : [];
  const pr = Math.max(0, ...hist.map(h => h.weight)), best = Math.max(0, ...hist.map(h => h.e1rm));
  const perSession = [...hist].reverse().filter(h => h.weight);
  const equipOptions = [...new Set(['Bodyweight', ...EQUIPMENT, ...S.gyms.flatMap(g => g.equipment || []), ...(a.equipment || [])])];
  const notAt = a.id ? S.gyms.filter(g => !availableAt(a, g)) : [];
  return `${head(a.id ? esc(a.name) : 'New exercise', a.id ? '' : 'Name it, tick the muscles and the equipment it needs.')}
  ${hist.length ? `<div class="pr"><div class="stat"><b>${pr || '–'}${pr ? '<small> kg</small>' : ''}</b><span>Heaviest</span></div>
    <div class="stat"><b>${best ? Math.round(best) : '–'}${best ? '<small> kg</small>' : ''}</b><span>Est. 1-rep max</span></div>
    <div class="stat"><b>${hist.length}</b><span>Times done</span></div></div>
    ${perSession.length > 1 ? `<div class="card" style="margin-top:10px"><div class="muted small">Weight over time</div>${lineChart(perSession.map(h => ({ x: h.date, y: h.weight })), 'kg')}</div>` : ''}` : ''}
  ${notAt.length ? `<div class="card info-card"><span class="ic-wrap">${icon('pin')}</span><div class="small">Not available at <b>${notAt.map(g => esc(g.name)).join(', ')}</b> (missing equipment).</div></div>` : ''}
  ${a.id ? `<h2>YouTube</h2>${ytList(a, true)}
    <form class="row" style="margin-top:10px" onsubmit="addYoutube(event, '${a.id}')"><input class="grow" name="url" type="url" placeholder="Paste a YouTube link" required>
    <button>${icon('plus')} Add</button></form>
    <div class="spread"><h2>Photos &amp; videos</h2>${uploader('kind=activity&activityId=' + a.id)}</div>${gallery(S.media.filter(m => m.activityId === a.id))}` : ''}
  <h2>Details</h2>
  <form onsubmit="saveActivity(event, '${a.id || ''}')">
    <label style="margin-top:0">Name</label><input name="name" value="${esc(a.name)}" required placeholder="Bench press">
    <label>Muscles worked</label>${muscleChecks(a.muscles)}
    <label>Equipment needed</label>${tiles('equipment', equipOptions, a.equipment || [])}
    <label>How-to notes</label><textarea name="notes" placeholder="Grip, setup, cues…">${esc(a.notes)}</textarea>
    <div class="actions"><button class="primary">Save</button>
      ${a.id ? `<button type="button" class="danger" onclick="deleteActivity('${a.id}')">Delete</button>` : ''}</div></form>
  ${a.id ? '' : '<p class="muted">Save first, then add YouTube links, photos and videos.</p>'}
  ${hist.length ? `<h2>History</h2><table class="hist">${hist.slice(0, 15).map(h => `<tr><td><a href="#/workout/${h.wid}">${fmtDate(h.date)}</a></td>
    <td>${h.sets} × ${esc(h.reps)}</td><td>${h.weight ? h.weight + ' kg' : ''}</td></tr>`).join('')}</table>` : ''}`;
}
async function saveActivity(e, id) {
  e.preventDefault();
  const f = e.target;
  const a = await saveItem('activities', { ...act(id), name: f.elements.name.value.trim(), muscles: checked(f, 'muscles'),
    equipment: checked(f, 'equipment'), notes: f.elements.notes.value });
  toast('Exercise saved');
  location.hash = id ? '#/activities' : '#/activity/' + a.id;
}
async function deleteActivity(id) { if (await delItem('activities', id)) location.hash = '#/activities'; }

// ---------- gyms ----------
function gyms() {
  return `${head('Gyms', 'Equipment and busyness are tracked per gym.', `<a class="btn primary" href="#/gym/new">${icon('plus')} Add</a>`)}
  ${[...S.gyms].sort((a, b) => (b.main ? 1 : 0) - (a.main ? 1 : 0) || byName(a, b)).map(g => {
    const visits = completed().filter(w => gymOfWorkout(w)?.id === g.id).length;
    const canDo = S.activities.filter(a => availableAt(a, g)).length;
    return `<a class="card" href="#/gym/${g.id}"><div class="spread"><h3>${esc(g.name)}</h3>${g === mainGym() ? `<span class="badge main">★ Main</span>` : ''}</div>
      <div class="w-meta"><span>${(g.equipment || []).length} equipment</span><span>${canDo} exercises available</span><span>${visits} workouts</span></div>
      ${g.notes ? `<div class="hint">${esc(g.notes)}</div>` : ''}</a>`;
  }).join('') || empty('pin', 'Add the gyms you go to. Tick the equipment each one has so the AI and swaps only suggest what you can actually do there.')}`;
}
function gym(id) {
  if (id === 'new') id = '';
  const g = gymById(id) || { name: '', notes: '', equipment: [] };
  const opts = [...new Set([...EQUIPMENT, ...(g.equipment || [])])];
  const cells = g.id ? busynessGrid(S.workouts, g.id) : {};
  return `${head(g.id ? esc(g.name) : 'Add a gym', g.id && g === mainGym() ? '★ Your main gym' : '')}
  ${g.id && g !== mainGym() ? `<button class="block" style="margin-bottom:12px" onclick="setMainGym('${g.id}')">${icon('star')} Make this my main gym</button>` : ''}
  <form id="gf" onsubmit="saveGym(event, '${g.id || ''}')">
    <label style="margin-top:0">Name</label><input name="name" value="${esc(g.name)}" required placeholder="Anytime Fitness Southbank">
    <label>Notes <span style="font-weight:400">(address, hours, door code…)</span></label><textarea name="notes" style="min-height:60px">${esc(g.notes)}</textarea>
    <div class="spread"><h2>Equipment</h2><span class="row"><button type="button" class="ghost small" onclick="tickAll(true)">All</button>
      <button type="button" class="ghost small" onclick="tickAll(false)">None</button></span></div>
    <div id="equip">${tiles('equipment', opts, g.equipment || [])}</div>
    <div class="row" style="margin-top:10px"><input class="grow" id="newEquip" placeholder="Something else (e.g. Sled, Hack squat)">
      <button type="button" onclick="addEquip()">${icon('plus')} Add</button></div>
    <div class="actions"><button class="primary">Save gym</button>
      ${g.id ? `<button type="button" class="danger" onclick="deleteGym('${g.id}')">Delete</button>` : ''}</div></form>
  ${g.id ? `<h2>Busyness here</h2>${Object.keys(cells).length ? `<div class="card">${heatTable(cells)}</div>`
    : empty('clock', 'Finish workouts at this gym and rate how busy it was to build this up.')}` : ''}`;
}
const tickAll = on => document.querySelectorAll('#equip input').forEach(i => { i.checked = on; });
function addEquip() {
  const name = $('#newEquip').value.trim();
  if (!name) return;
  $('#equip .checks').insertAdjacentHTML('beforeend', `<label><input type="checkbox" name="equipment" value="${esc(name)}" checked><span>${esc(name)}</span></label>`);
  $('#newEquip').value = '';
}
async function saveGym(e, id) {
  e.preventDefault();
  const f = e.target;
  const g = await saveItem('gyms', { ...gymById(id), name: f.elements.name.value.trim(), notes: f.elements.notes.value,
    equipment: checked(f, 'equipment'), main: gymById(id)?.main ?? !S.gyms.length });
  toast('Gym saved');
  location.hash = id ? '#/gyms' : '#/gym/' + g.id;
}
async function setMainGym(id) {
  for (const g of S.gyms) if (!!g.main !== (g.id === id)) await saveItem('gyms', { ...g, main: g.id === id });
  toast(gymById(id).name + ' is now your main gym');
  render();
}
async function deleteGym(id) { if (await delItem('gyms', id)) location.hash = '#/gyms'; }

// ---------- AI ----------
function ai() {
  const gym = mainGym();
  return `${head('AI workout plan', 'Built from your recent workouts, goals, recovery and gym equipment.')}
  ${store.get('apiKey') ? '' : `<div class="card info-card"><span class="ic-wrap">${icon('sparkles')}</span><div style="flex:1"><b>Add your Claude API key</b>
    <div class="hint">The AI planner needs a key from console.anthropic.com. It stays on this phone.</div></div>
    <button class="primary small" onclick="keyDialog()">Add</button></div>`}
  <form class="card" onsubmit="runSuggest(event)">
    <label style="margin-top:0">Time available</label>
    <div class="busy-pick">${[30, 45, 60, 90].map(m => `<label><input type="radio" name="minutes" value="${m}" ${m === 60 ? 'checked' : ''}><span>${m} min</span></label>`).join('')}</div>
    ${S.gyms.length ? `<label>Gym</label><select name="gymId">${gymOptions(gym?.id)}</select>` : `<p class="hint"><a href="#/gym/new">Add your gym</a> so the AI only picks equipment it has.</p>`}
    <label>Target muscles <span style="font-weight:400">(leave empty to let the AI choose)</span></label>${muscleChecks()}
    <label>Anything else?</label><textarea name="notes" placeholder="Sore lower back, want a finisher, short on time…"></textarea>
    <div class="actions"><button class="primary block" id="aibtn">${icon('sparkles')} Suggest workout</button></div></form>
  <div id="aiout">${lastSuggestion ? suggestionHtml(lastSuggestion) : ''}</div>`;
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
const SDK_URL = 'https://cdn.jsdelivr.net/npm/@anthropic-ai/sdk@1.8.0/+esm';
async function suggest({ minutes, muscles, notes, gymId }) {
  const apiKey = store.get('apiKey');
  if (!apiKey) { keyDialog(); throw new Error('Add your Claude API key first (More → Claude API key).'); }
  let Anthropic;
  try { ({ default: Anthropic } = await import(SDK_URL)); } catch { throw new Error('Could not load the AI library. Are you online?'); }
  const gym = gymById(gymId);
  const context = {
    today: today(),
    gym: gym ? { name: gym.name, equipmentAvailable: ['Bodyweight', ...(gym.equipment || [])] } : null,
    minutesAvailable: minutes || 60,
    targetMuscles: muscles,
    extraNotes: notes.slice(0, 2000),
    goals: S.goals.filter(g => !g.done).map(g => ({ goal: g.text, targetDate: g.targetDate })),
    recentWorkouts: [...completed()].sort((a, b) => b.completedAt.localeCompare(a.completedAt)).slice(0, 8)
      .map(w => ({ completed: w.completedAt, name: w.name, feel: w.feel || null, items: (w.items || []).map(i => ({
        name: act(i.activityId)?.name, muscles: act(i.activityId)?.muscles, sets: i.sets, reps: i.reps, weight: i.weight })) })),
    library: S.activities.map(a => ({ id: a.id, name: a.name, muscles: a.muscles, equipment: a.equipment || [] })),
  };
  const client = new Anthropic({ apiKey, dangerouslyAllowBrowser: true }); // key is the user's own, stored only on their phone
  let msg;
  try {
    msg = await client.beta.messages.create({
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
  } catch (e) {
    if (e instanceof Anthropic.AuthenticationError) throw new Error('Your Claude API key was rejected. Check it under More → Claude API key.');
    if (e instanceof Anthropic.PermissionDeniedError) throw new Error('This API key is not allowed to use the model. Check your Anthropic Console.');
    if (e instanceof Anthropic.RateLimitError) throw new Error('Too many requests, or your credit has run out. Try again shortly.');
    if (e instanceof Anthropic.APIConnectionError) throw new Error('Could not reach Claude. Are you online?');
    throw e;
  }
  if (msg.stop_reason === 'refusal') throw new Error('The AI declined this request.');
  return JSON.parse(msg.content.find(b => b.type === 'text').text);
}
function keyDialog() {
  openDialog(`<h2 style="margin-top:0">Claude API key</h2>
  <form onsubmit="saveKey(event)">
    <p class="hint">Create one at console.anthropic.com → API Keys. It is saved only on this phone and sent only to Anthropic.</p>
    <label>API key</label><input name="key" type="password" autocomplete="off" placeholder="sk-ant-…" value="${esc(store.get('apiKey', ''))}">
    <div class="actions"><button class="primary">Save</button>
    ${store.get('apiKey') ? '<button type="button" class="danger" onclick="saveKey(null)">Remove</button>' : ''}
    <button type="button" onclick="closeDialog()">Cancel</button></div></form>`);
}
function saveKey(e) {
  e?.preventDefault();
  const key = e ? e.target.elements.key.value.trim() : '';
  if (key) store.set('apiKey', key); else { try { localStorage.removeItem('apiKey'); } catch {} }
  closeDialog();
  toast(key ? 'API key saved' : 'API key removed');
  render();
}
async function runSuggest(e) {
  e.preventDefault();
  const f = e.target, btn = $('#aibtn');
  btn.disabled = true; btn.textContent = 'Thinking… (can take a minute)';
  try {
    lastSuggestion = await suggest({ minutes: +checked(f, 'minutes')[0], muscles: checked(f, 'muscles'),
      notes: f.elements.notes.value, gymId: f.elements.gymId?.value });
    lastSuggestion.gymId = f.elements.gymId?.value || null;
    $('#aiout').innerHTML = suggestionHtml(lastSuggestion);
    $('#aiout').scrollIntoView({ behavior: 'smooth' });
  } catch (err) {
    $('#aiout').innerHTML = `<p class="error">${esc(err.message)}</p>`;
  } finally { btn.disabled = false; btn.innerHTML = `${icon('sparkles')} Suggest workout`; }
}
const suggestionHtml = s => `<h2>Suggestion</h2><div class="card"><h3>${esc(s.name)}</h3><p class="muted">${esc(s.rationale)}</p>
  ${s.items.map(i => `<div class="item"><div class="spread"><b>${esc(i.name)}</b><span class="badge">${i.sets} × ${esc(i.reps)}</span></div>
    ${act(i.activityId) ? '' : '<span class="badge plan">New exercise</span>'}<div class="hint">${esc(i.notes)}</div>${chips(i.muscles)}</div>`).join('')}
  <div class="actions"><button class="primary" onclick="saveSuggestion(true)">${icon('play')} Start now</button>
  <button onclick="saveSuggestion(false)">Save for later</button></div></div>`;
async function saveSuggestion(start) {
  const s = lastSuggestion, items = [];
  for (const i of s.items) {
    let a = act(i.activityId) || S.activities.find(x => x.name.toLowerCase() === i.name.toLowerCase());
    a ||= await saveItem('activities', { name: i.name, muscles: i.muscles, equipment: i.equipment || [], notes: '' });
    items.push({ activityId: a.id, sets: String(i.sets), reps: i.reps, weight: String(historyFor(a.id)[0]?.weight || ''), notes: i.notes });
  }
  const w = await saveItem('workouts', { name: s.name, date: today(), items, notes: s.rationale, gymId: s.gymId || mainGym()?.id || null });
  lastSuggestion = null;
  start ? startWorkout(w.id) : (toast('Saved to planned workouts'), location.hash = '#/workout/' + w.id);
}

// ---------- stats: progress ----------
const statsTabs = cur => `<div class="tabs"><a href="#/progress" class="${cur === 'progress' ? 'on' : ''}">Progress</a>
  <a href="#/insights" class="${cur === 'insights' ? 'on' : ''}">Insights</a></div>`;
function lineChart(points, unit = '') {
  if (points.length < 2) return '';
  const ys = points.map(p => p.y), min = Math.min(...ys), max = Math.max(...ys), span = max - min || 1;
  const xy = points.map((p, i) => [i / (points.length - 1) * 300, 100 - (p.y - min) / span * 84]);
  const line = xy.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
  return `<svg class="chart" viewBox="0 -8 300 120" preserveAspectRatio="none">
    <defs><linearGradient id="fill" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="var(--accent)" stop-opacity=".3"/><stop offset="1" stop-color="var(--accent)" stop-opacity="0"/></linearGradient></defs>
    <polygon points="0,112 ${line} 300,112" fill="url(#fill)"/>
    <polyline points="${line}" fill="none" stroke="var(--accent)" stroke-width="2.5" stroke-linejoin="round" vector-effect="non-scaling-stroke"/>
  </svg><div class="spread muted small"><span>${fmtDate(points[0].x)}</span><span>${min}–${max} ${unit}</span><span>${fmtDate(points.at(-1).x)}</span></div>`;
}
// ---------- body weight ----------
const isWeight = m => m.type.trim().toLowerCase() === 'weight';
const weights = () => S.measurements.filter(isWeight).sort((a, b) => a.date.localeCompare(b.date));
const weightOn = date => weights().filter(m => m.date <= date).at(-1); // latest weigh-in on or before a date
let weightRange = 90;
function weightCard(days, compact) {
  const list = weights(), last = list.at(-1);
  if (!last) return `<div class="card info-card"><span class="ic-wrap">${icon('scale')}</span><div style="flex:1"><b>Body weight</b>
    <div class="small muted">Log your weight to see your trend.</div></div><button class="small primary" onclick="logWeightDialog()">${icon('plus')} Log</button></div>`;
  const unit = esc(last.unit || 'kg');
  const shown = list.filter(m => !days || asDate(m.date) >= addDays(new Date(), -days));
  const ref = list.filter(m => asDate(m.date) <= addDays(new Date(), -30)).at(-1);
  const diff = ref ? +(last.value - ref.value).toFixed(1) : null;
  const avg7 = list.filter(m => asDate(m.date) > addDays(new Date(), -7));
  return `<div class="card"><div class="spread"><b>${icon('scale')} Body weight</b><button class="small" onclick="logWeightDialog()">${icon('plus')} Log</button></div>
    <div class="row" style="align-items:baseline;margin-top:6px;gap:10px"><span style="font-size:32px;font-weight:800;letter-spacing:-.03em">${last.value}</span>
    <span class="muted">${unit} · ${fmtDate(last.date)}</span>${diff !== null ? `<span class="badge plan">${diff > 0 ? '+' : ''}${diff} ${unit} in 30 days</span>` : ''}</div>
    ${avg7.length > 1 ? `<div class="hint">7-day average: <b>${+(avg7.reduce((t, m) => t + m.value, 0) / avg7.length).toFixed(1)} ${unit}</b></div>` : ''}
    ${compact ? '' : `<div class="seg" style="margin:12px 0 0">${[[30, '30 days'], [90, '3 months'], [365, 'Year'], [0, 'All']].map(([d, l]) =>
      `<button class="small ${weightRange === d ? 'on' : ''}" onclick="weightRange=${d}; render()">${l}</button>`).join('')}</div>`}
    ${shown.length > 1 ? lineChart(shown.map(m => ({ x: m.date, y: m.value })), unit) : '<p class="hint">Log a few more weigh-ins to see the chart.</p>'}
    ${compact ? '' : `<details style="margin-top:6px"><summary class="muted small">All weigh-ins (${list.length})</summary><table class="hist">
      ${[...list].reverse().map(m => `<tr><td>${fmtDate(m.date)}${m.source === 'apple-health' ? ' <span class="badge">Apple Health</span>' : ''}</td>
      <td>${m.value} ${esc(m.unit)}</td><td style="text-align:right"><button class="ghost small danger" onclick="delMeasurement('${m.id}')">${icon('x')}</button></td></tr>`).join('')}</table></details>`}</div>`;
}
function logWeightDialog() {
  const last = weights().at(-1);
  openDialog(`<form onsubmit="saveWeight(event)"><h1 style="margin-top:0">Log weight</h1>
    <div class="row"><div class="grow"><label>Weight</label><input name="val" type="number" step="0.1" min="1" inputmode="decimal" value="${last?.value ?? ''}" required autofocus></div>
    <div style="width:96px"><label>Unit</label><select name="unit">${['kg', 'lb'].map(u => `<option ${(last?.unit || 'kg') === u ? 'selected' : ''}>${u}</option>`).join('')}</select></div></div>
    <label>Date</label><input type="date" name="date" value="${today()}" required>
    <div class="actions"><button class="primary">Save</button><button type="button" onclick="closeDialog()">Cancel</button></div></form>`);
}
async function saveWeight(e) {
  e.preventDefault();
  const f = e.target.elements;
  await saveItem('measurements', { date: f.date.value, type: 'Weight', value: +f.val.value, unit: f.unit.value, source: 'manual' });
  closeDialog();
  toast('Weight logged');
  render();
}

// ---------- progress photos ----------
let photoPick = [];
function photoCompare(photos) {
  if (photos.length < 2) return '';
  const [a, b] = [photos.find(p => p.id === photoPick[0]) || photos[0], photos.find(p => p.id === photoPick[1]) || photos.at(-1)];
  const days = Math.round((asDate(b.date) - asDate(a.date)) / 864e5);
  const side = (p, i) => {
    const w = weightOn(p.date);
    return `<figure><select style="margin-bottom:6px;padding:7px 9px;font-size:13px" onchange="photoPick[${i}]=this.value; render()">
      ${photos.map(x => `<option value="${x.id}" ${x.id === p.id ? 'selected' : ''}>${fmtDate(x.date)}</option>`).join('')}</select>
      <img src="${fileUrl(p)}" alt=""><figcaption>${w ? `${w.value} ${esc(w.unit || 'kg')}` : ''}</figcaption></figure>`;
  };
  const wa = weightOn(a.date), wb = weightOn(b.date);
  return `<div class="card"><div class="spread" style="margin-bottom:8px"><b>Compare</b><span class="muted small">${Math.abs(days)} days apart
    ${wa && wb && wa !== wb ? ` · ${+(wb.value - wa.value).toFixed(1) > 0 ? '+' : ''}${+(wb.value - wa.value).toFixed(1)} ${esc(wb.unit || 'kg')}` : ''}</span></div>
    <div class="gallery" style="grid-template-columns:1fr 1fr">${side(a, 0)}${side(b, 1)}</div></div>`;
}

function progress() {
  const types = [...new Set([...MTYPES.filter(t => t !== 'Weight'), ...S.measurements.filter(m => !isWeight(m)).map(m => m.type)])];
  const byType = {};
  for (const m of S.measurements) if (!isWeight(m)) (byType[m.type] ||= []).push(m);
  const photos = S.media.filter(m => m.kind === 'progress').sort((a, b) => a.date.localeCompare(b.date) || a.createdAt.localeCompare(b.createdAt));
  if (photoPick.some(id => id && !photos.some(p => p.id === id))) photoPick = [];
  return `${head('Stats')}${statsTabs('progress')}
  ${weightCard(weightRange)}
  <div class="spread"><h2>Progress photos</h2>${uploader('kind=progress&date=' + today(), 'Add photo', 'image/*')}</div>
  ${photoCompare(photos)}
  ${gallery(photos) || empty('camera', 'Take a photo every few weeks in the same spot and lighting. You can compare any two side by side.')}
  <h2>Measurements</h2>
  <form class="card" onsubmit="addMeasurement(event)"><div class="row">
    <input class="grow" name="mtype" list="mtypes" placeholder="Measurement (e.g. Weight)" required oninput="fillUnit(this)">
    <input class="grow" name="val" type="number" step="any" inputmode="decimal" placeholder="Value" required></div>
    <div class="row" style="margin-top:8px"><input class="grow" name="unit" placeholder="Unit (kg, cm…)">
    <input class="grow" type="date" name="date" value="${today()}" required>
    <button class="primary">${icon('plus')} Log</button></div>
    <datalist id="mtypes">${types.map(t => `<option value="${esc(t)}">`).join('')}</datalist></form>
  ${Object.entries(byType).map(([t, list]) => measureCard(t, list.sort((a, b) => a.date.localeCompare(b.date)))).join('') || empty('trend', 'Waist, chest, arms… log them here to track changes.')}`;
}
function fillUnit(input) {
  const prev = [...S.measurements].reverse().find(m => m.type.toLowerCase() === input.value.trim().toLowerCase());
  const unit = input.form.elements.unit;
  if (prev && !unit.value) unit.value = prev.unit;
}
function measureCard(type, list) {
  const first = list[0], last = list.at(-1), diff = +(last.value - first.value).toFixed(2);
  return `<details class="card"><summary class="spread"><h3>${esc(type)}</h3><span><b>${last.value}</b> ${esc(last.unit)}
    <span class="muted small">${list.length > 1 ? (diff >= 0 ? '+' : '') + diff : ''}</span></span></summary>
    ${lineChart(list.map(m => ({ x: m.date, y: m.value })), last.unit)}
    <table class="hist">${[...list].reverse().map(m => `<tr><td>${fmtDate(m.date)}${m.source === 'apple-health' ? ' <span class="badge">Apple Health</span>' : ''}</td>
      <td>${m.value} ${esc(m.unit)}</td><td style="text-align:right"><button class="ghost small danger" onclick="delMeasurement('${m.id}')">${icon('x')}</button></td></tr>`).join('')}</table></details>`;
}
async function addMeasurement(e) {
  e.preventDefault();
  const f = e.target.elements;
  await saveItem('measurements', { date: f.date.value, type: f.mtype.value.trim(), value: +f.val.value, unit: f.unit.value.trim(), source: 'manual' });
  toast('Logged');
  render();
}
async function delMeasurement(id) { if (await delItem('measurements', id)) render(); }

// ---------- stats: insights ----------
const SLOTS = [[0, '<8'], [8, '8–11'], [11, '11–2'], [14, '2–5'], [17, '5–8'], [20, '8+']];
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
function busynessGrid(list, gymId) { // { "day-slot": [sum, count] }, keyed by each workout's midpoint in local time
  const cells = {};
  for (const w of list) {
    if (!w.completedAt || !w.busyness || (gymId && gymOfWorkout(w)?.id !== gymId)) continue;
    const t = new Date(new Date(w.completedAt) - (w.durationMin || 60) * 30e3);
    const key = (t.getDay() + 6) % 7 + '-' + SLOTS.findLastIndex(([h]) => t.getHours() >= h);
    const c = cells[key] ||= [0, 0];
    c[0] += w.busyness; c[1]++;
  }
  return cells;
}
function heatTable(cells) {
  const color = avg => `hsl(${130 - (avg - 1) / 3 * 130} 75% 70%)`;
  const best = Object.entries(cells).map(([k, [s, n]]) => ({ k, avg: s / n, n })).sort((a, b) => a.avg - b.avg || b.n - a.n).slice(0, 3);
  const slotName = k => { const [d, s] = k.split('-'); return `${DAYS[d]} ${SLOTS[s][1]}`; };
  return `<p style="margin-top:0">Quietest: <b>${best.map(b => slotName(b.k)).join(' · ')}</b></p>
    <table class="heat"><tr><th></th>${SLOTS.map(s => `<th>${s[1]}</th>`).join('')}</tr>
    ${DAYS.map((d, di) => `<tr><th>${d}</th>${SLOTS.map((_, si) => {
      const c = cells[di + '-' + si];
      return c ? `<td style="background:${color(c[0] / c[1])}" title="${c[1]} visits">${BUSY[Math.round(c[0] / c[1])]}</td>` : '<td></td>';
    }).join('')}</tr>`).join('')}</table>`;
}
function insights() {
  const done = completed();
  if (insightGym && !gymById(insightGym)) insightGym = '';
  const gymSel = insightGym || mainGym()?.id || '';
  const cells = busynessGrid(S.workouts, gymSel);
  const sets = days => {
    const cutoff = Date.now() - days * 864e5, out = {};
    for (const w of done) if (new Date(w.completedAt) >= cutoff)
      for (const i of w.items || []) for (const m of act(i.activityId)?.muscles || []) out[m] = (out[m] || 0) + (setsOf(i) || 1);
    return out;
  };
  const s7 = sets(7), s30 = sets(30), maxSets = Math.max(1, ...Object.values(s30));
  const ws = weekStart(new Date());
  const weeks = [...Array(12)].map((_, i) => {
    const from = addDays(ws, (i - 11) * 7), to = addDays(from, 7);
    return { from, n: done.filter(w => { const t = new Date(w.completedAt); return t >= from && t < to; }).length };
  });
  const maxN = Math.max(1, ...weeks.map(w => w.n));
  const neglected = MUSCLES.filter(m => m !== 'Cardio' && !s7[m]);
  const feelAvg = done.filter(w => w.feel).slice(0, 10);
  return `${head('Stats')}${statsTabs('insights')}
  <div class="stats"><div class="stat"><b>${done.length}</b><span>Workouts</span></div>
    <div class="stat"><b>${kg(done.reduce((t, w) => t + volume(w), 0))}</b><span>Total lifted</span></div>
    <div class="stat"><b>${Math.round(done.reduce((t, w) => t + (w.durationMin || 0), 0) / 60)}h</b><span>Time trained</span></div></div>
  ${feelAvg.length ? `<div class="card spread"><span>Recent sessions felt</span><b>${FEEL[Math.round(feelAvg.reduce((t, w) => t + w.feel, 0) / feelAvg.length)].join(' ')}</b></div>` : ''}
  <h2>Training calendar</h2><div class="card">${calendar()}</div>
  <h2>Workouts per week</h2>
  <div class="card"><div class="bars">${weeks.map(w => `<div><i class="${w.n ? '' : 'zero'}" style="height:${w.n / maxN * 100}%"></i>
    ${w.from.getDate()}/${w.from.getMonth() + 1}</div>`).join('')}</div></div>
  <div class="spread"><h2>Best time to go</h2>${S.gyms.length > 1 ? `<select style="width:auto;padding:6px 10px" onchange="insightGym=this.value; render()">${gymOptions(gymSel)}</select>` : ''}</div>
  ${Object.keys(cells).length ? `<div class="card">${heatTable(cells)}</div>`
    : empty('clock', 'When you finish a workout, rate how busy the gym was. Your quietest times will show up here.')}
  <h2>Sets per muscle · last 30 days</h2>
  <div class="card">${MUSCLES.map(m => `<div class="mbar"><span>${esc(m)}</span><div class="track"><i style="--c:var(--${GROUP[m]});width:${(s30[m] || 0) / maxSets * 100}%"></i></div>
    <span class="muted">${s30[m] || 0}</span></div>`).join('')}</div>
  ${done.length && neglected.length ? `<div class="card"><b>Not trained this week:</b> <span class="muted">${neglected.join(', ')}</span></div>` : ''}`;
}
function calendar() {
  const now = new Date(), first = new Date(now.getFullYear(), now.getMonth() + calOffset, 1);
  const lead = (first.getDay() + 6) % 7, daysIn = new Date(first.getFullYear(), first.getMonth() + 1, 0).getDate();
  const byDay = {};
  for (const w of completed()) (byDay[localIso(new Date(w.completedAt)).slice(0, 10)] ||= []).push(w);
  const cells = [...Array(Math.ceil((lead + daysIn) / 7) * 7)].map((_, i) => {
    const d = addDays(first, i - lead), key = localIso(d).slice(0, 10), ws = byDay[key];
    const cls = `cal-d ${d.getMonth() === first.getMonth() ? '' : 'out'} ${ws ? 'has' : ''} ${key === today() ? 'today' : ''}`;
    return ws ? `<a class="${cls}" href="#/workout/${ws[0].id}" title="${esc(ws.map(w => w.name).join(', '))}">${d.getDate()}</a>` : `<div class="${cls}">${d.getDate()}</div>`;
  });
  const n = Object.keys(byDay).filter(k => k.startsWith(localIso(first).slice(0, 7))).length;
  return `<div class="spread" style="margin-bottom:8px"><button class="ghost" onclick="calOffset--; render()">${icon('left')}</button>
    <b>${first.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })} <span class="muted small">· ${n} day${n === 1 ? '' : 's'}</span></b>
    <button class="ghost" onclick="calOffset++; render()" ${calOffset >= 0 ? 'disabled' : ''}>${icon('right')}</button></div>
    <div class="cal">${DAYS.map(d => `<b>${d[0]}</b>`).join('')}${cells.join('')}</div>`;
}

// ---------- goals ----------
function goals() {
  const list = [...S.goals].sort((a, b) => (a.done - b.done) || (a.targetDate || '9').localeCompare(b.targetDate || '9'));
  return `${head('Goals', 'The AI planner builds workouts around your open goals.')}
  <form class="card" onsubmit="addGoal(event)"><label style="margin-top:0">Goal</label><input name="text" required placeholder="Bench 100kg, lose 5kg, run 5k…">
    <label>Target date (optional)</label><input type="date" name="targetDate">
    <div class="actions"><button class="primary">${icon('plus')} Add goal</button></div></form>
  ${list.map(g => {
    const daysLeft = g.targetDate && !g.done ? Math.ceil((asDate(g.targetDate) - new Date()) / 864e5) : null;
    return `<div class="card spread"><label class="row" style="margin:0;color:var(--text);font-weight:500;font-size:15px">
    <input type="checkbox" ${g.done ? 'checked' : ''} onchange="toggleGoal('${g.id}', this.checked)">
    <span style="${g.done ? 'text-decoration:line-through;opacity:.6' : ''}">${esc(g.text)}</span></label>
    <span class="row">${daysLeft !== null ? `<span class="badge ${daysLeft < 0 ? 'b4' : 'plan'}">${daysLeft < 0 ? 'overdue' : daysLeft + ' days'}</span>` : ''}
    <button class="ghost small danger" onclick="delGoal('${g.id}')">${icon('x')}</button></span></div>`;
  }).join('')}`;
}
async function addGoal(e) {
  e.preventDefault();
  const f = e.target.elements;
  await saveItem('goals', { text: f.text.value.trim(), targetDate: f.targetDate.value, done: false });
  toast('Goal added');
  render();
}
async function toggleGoal(id, done) { await saveItem('goals', { ...S.goals.find(g => g.id === id), done }); if (done) toast('Goal smashed 🎉'); render(); }
async function delGoal(id) { if (await delItem('goals', id)) render(); }

// ---------- more ----------
function more() {
  const theme = store.get('theme', 'system'), gym = mainGym();
  const row = (href, ic, label, trail = '') => `<a href="${href}"><span class="lead">${icon(ic)}</span>${label}<span class="trail">${trail}${icon('right')}</span></a>`;
  return `${head('More')}
  <div class="list">
    ${row('#/activities', 'list', 'Exercises', S.activities.length)}
    ${row('#/gyms', 'pin', 'Gyms', gym ? esc(gym.name) : 'Add one')}
    ${row('#/goals', 'target', 'Goals', S.goals.filter(g => !g.done).length + ' open')}
    ${row('#/ai', 'sparkles', 'AI workout plan')}
    <button onclick="keyDialog()"><span class="lead">${icon('sparkles')}</span>Claude API key<span class="trail">${store.get('apiKey') ? 'Saved' : 'Not set'}${icon('right')}</span></button></div>
  <h2>Tools</h2><div class="list">
    <button onclick="plateDialog()"><span class="lead">${icon('disc')}</span>Plate calculator<span class="trail">${icon('right')}</span></button>
    <button onclick="exportData()"><span class="lead">${icon('download')}</span>Back up data<span class="trail">JSON</span></button>
    <label><span class="lead">${icon('plus')}</span>Restore backup<input type="file" accept="application/json,.json" hidden onchange="importData(this)"><span class="trail">${icon('right')}</span></label></div>
  <p class="hint">Everything is stored only on this phone. Back up now and then (photos included, videos not).</p>
  <h2>Appearance</h2>
  <div class="tabs">${Object.entries(THEMES).map(([k, [ic, label]]) => `<a href="javascript:void 0" class="${theme === k ? 'on' : ''}" onclick="setTheme('${k}'); render()">${icon(ic)} ${label}</a>`).join('')}</div>
`;
}

// ---------- shell ----------
const routes = { home, workouts, workout, live, activities, activity, gyms, gym, ai, progress, insights, goals, more, stats: progress };
const TAB_OF = { workout: 'workouts', live: 'workouts', progress: 'stats', insights: 'stats', activities: 'more', activity: 'more',
  gyms: 'more', gym: 'more', goals: 'more', ai: 'more' };
function render() {
  const [, name = 'home', id] = location.hash.split('/');
  const tab = TAB_OF[name] || name;
  const link = (h, label, ic) => `<a href="#/${h}" class="${h === tab ? 'on' : ''}">${icon(ic)}${label}</a>`;
  $('#nav').hidden = false;
  $('#nav').innerHTML = link('home', 'Home', 'home') + link('workouts', 'Workouts', 'dumbbell')
    + `<button class="fab" onclick="quickSheet()" aria-label="Quick actions">${icon('plus')}</button>`
    + link('stats', 'Stats', 'bars') + link('more', 'More', 'menu');
  const page = location.hash;
  $('#main').innerHTML = (routes[name] || home)(id);
  if (render.page !== page) { scrollTo(0, 0); $('#main').style.animation = 'none'; void $('#main').offsetWidth; $('#main').style.animation = ''; }
  render.page = page;
  if ($('#muscles')) updateMuscles();
  keepAwake(name === 'live');
  tick();
}
async function boot() {
  S = await dbGet('data') || {};
  for (const c of COLLECTIONS) S[c] ||= [];
  for (const m of S.media) { const b = await dbGet('file:' + m.id); if (b) URLS[m.id] = URL.createObjectURL(b); }
  navigator.storage?.persist?.(); // ask the browser not to evict our data
  if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(() => {});
  render();
}
$('#dialog').addEventListener('click', e => { if (e.target === $('#dialog')) closeDialog(); }); // tap backdrop to close
window.onhashchange = render;
boot();
