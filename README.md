# Gym

Personal workout tracker. One Node server (`server.js`) + a phone-friendly web app (`public/`).
All data lives in `data/` (`db.json` + `uploads/`) — back that folder up.

## What's in it

Bottom bar: **Home · Workouts · ＋ (quick actions) · Stats · More**. Theme: System / Light / Dark (header button or More → Appearance).

- **Gyms** (More → Gyms): add every gym you use, mark one ★ main, tick the equipment it has (plus custom items).
  Busyness is tracked per gym (each gym page has its own heatmap; Stats → Insights has a gym picker).
  Workouts remember which gym they were at. Exercises list the equipment they need, so the AI plan, swap,
  "add exercise" in live mode and the Exercises filter only offer what's actually at that gym.
- **＋ quick actions**: resume/start next workout, empty workout, AI plan, plan for later, log a measurement, plate calculator, progress photo.
- **Home**: next workout, weekly streak, kg lifted this month, this week's training days, busyness forecast for
  your main gym, **muscle recovery** (ready / recovering / trained in the last day), goals.
- **Workouts**: plan, repeat a past one ("Do again"), or log after the fact. Picking an exercise pre-fills last time's sets/reps/weight.
- **Live mode** (Start): tap each set as you finish it, workout clock, rest timer with a beep (+15s / skip, length is remembered per device).
  Screen stays awake. Per exercise: plate calculator, **swap** (machine taken → exercises hitting the same muscles), how-to.
  Add exercises mid-workout. Finish asks how busy the gym was and how it felt, pre-fills the duration,
  and celebrates any new personal records.
- **Plate calculator**: plates per side + warm-up sets for any weight (bar size remembered). Also on Home.
- Exercises in a workout can be reordered with the up/down arrows.
- **Exercises**: muscles, notes, photos/videos, **YouTube links played inline**, heaviest weight, estimated 1-rep max,
  weight-over-time chart and history. Filter by push/pull/legs/core/cardio. One tap adds ~40 common starter exercises.
- **AI plan**: suggestion from time, target muscles, recent workouts and goals. Save it or start it straight away.
- **Body weight**: card on Home (latest, change over 30 days, 7-day average, chart) and at the top of Stats → Progress
  with 30-day / 3-month / year / all ranges. Log it from the card or ＋ → Log weight (kg or lb). Apple Health weigh-ins appear here too.
- **Progress photos**: ＋ → Progress photo opens the camera/photo picker directly. Compare any two photos side by side,
  with the days between them and your weight on each date.
- **Measurements** (waist, chest, arms…) with charts, under Stats → Progress.
- **Insights**: training calendar, workouts per week, quietest gym times, sets per muscle, muscles not trained this week.
- The AI planner also sees how your recent workouts felt and eases off or pushes harder, and only uses the chosen gym's equipment.
- **Backup**: More → Download backup (JSON of all data; photos/videos stay in `data/uploads/`).

## Run locally (no sign-in)

```
npm install
DEV_NO_AUTH=1 npm start        # PowerShell: $env:DEV_NO_AUTH=1; npm start
```
Open http://localhost:3000. Never set `DEV_NO_AUTH` on a public server.

## Settings (environment variables)

| Variable | What it is |
|---|---|
| `GOOGLE_CLIENT_ID` | OAuth client ID (see below). Required unless `DEV_NO_AUTH=1`. |
| `ALLOWED_EMAIL` | Your Google email — the only account allowed in. |
| `ANTHROPIC_API_KEY` | From console.anthropic.com, for the AI planner. |
| `HEALTH_TOKEN` | Any long random string; your iPhone Shortcut sends it to push Apple Health data. |
| `PORT` | Default 3000. |
| `DATA_DIR` | Where data is stored. Default `./data`. |

## Google sign-in setup

1. https://console.cloud.google.com → APIs & Services → Credentials → Create credentials → OAuth client ID → **Web application**.
2. Authorised JavaScript origins: `http://localhost:3000` and your real site, e.g. `https://gym.example.com`.
3. Copy the client ID into `GOOGLE_CLIENT_ID`.

## Hosting

Needs a host that runs a long-lived Node 20+ process **with a persistent disk** (photos, videos and `db.json` are files):
a small VPS, Railway/Render/Fly with a volume mounted at `DATA_DIR`, or a home server/NAS. Serverless hosts
(Vercel, Netlify) won't work. Put it behind HTTPS (required for Google sign-in on a real domain).

## Phone

Open the site in Safari → Share → **Add to Home Screen**. It then opens full-screen like an app.

## Apple Health

Websites can't read Apple Health directly, so an iPhone Shortcut pushes data to the app:

1. Shortcuts → new shortcut → **Find Health Samples** (Type: Weight, Sort: latest first, Limit: 1).
2. **Get Contents of URL**: `https://your-site/api/health`, Method POST,
   Header `Authorization` = `Bearer <your HEALTH_TOKEN>`,
   Request body JSON: `type` = `Weight`, `value` = the Health sample's value, `unit` = `kg`.
3. Repeat steps 1–2 for body fat etc. Automate it: Shortcuts → Automation → Time of day → run daily.

The endpoint also accepts an array: `[{"type":"Weight","value":80.2,"unit":"kg","date":"2026-11-16"}]`.
One value per type per day is kept (re-sending replaces it). Shows up under Progress.

## AI planner

Uses Claude (`claude-opus-5-5`) with your recent 8 completed workouts, your activity library and open goals.
Refusal fallback (`fallbacks: "default"`) is on, so if the model declines a request it is retried on a fallback model.
Each suggestion costs roughly a few cents.

## Tests

```
npm test
```
