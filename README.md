# myGym

myGym is a personal workout tracker that runs entirely on your phone. No server and no account:
it's a web app you add to your iPhone home screen, and all data (workouts, photos, videos) is stored on the phone.

## Install on your iPhone

1. In this repo on GitHub: **Settings → Pages → Build and deployment → Source: Deploy from a branch → `main` / `/ (root)` → Save**.
   After a minute the app is live at `https://declan-coyne.github.io/gym/`.
2. Open that link in **Safari** on your iPhone → Share → **Add to Home Screen**.
3. Always open it from the home-screen icon. That copy keeps its own data. Safari tabs and other phones don't see it.

It works offline after the first open (handy with bad gym signal); only the AI planner needs internet.

## Updates

Nothing to reinstall. Push changes to `main`. The next time the app opens with internet, it starts instantly from the
version it already has and downloads the new one in the background. You get the new version the time after that.
With no internet it just runs the last version it downloaded. Your data is never touched by an update.

## AI planner (Claude API key)

More → **Claude API key** → paste a key from console.anthropic.com → API Keys.
The key is saved only on the phone and sent only to Anthropic. Each suggestion costs a few cents on your API account.
Set a monthly spend limit in the Console. When the key expires, make a new one and paste it in the same place.

## Backups

All data lives only on the phone. If you delete the home-screen app or lose the phone, it's gone.
More → **Back up data** saves a JSON file (records + photos; videos are not included) to Files/iCloud.
More → **Restore backup** loads one back, replacing what's on the phone.

## What's in it

Bottom bar: **Home · Workouts · ＋ (quick actions) · Stats · More**. Theme: System / Light / Dark.

- **Gyms**: several gyms, one ★ main, equipment per gym, busyness heatmap per gym.
- **Workouts**: plan, repeat, or log after the fact; last time's sets/reps/weight pre-filled.
- **Live mode**: tap sets as you go, rest timer with beep, screen stays awake, plate calculator, swap exercise, how-to.
  Finishing asks how busy the gym was and how it felt, and celebrates new personal records.
- **Exercises**: muscles, equipment, notes, photos/videos, inline YouTube how-to, PRs, estimated 1-rep max, history.
- **Body weight, progress photos (side-by-side compare), measurements**, under Stats → Progress.
- **Insights**: calendar, workouts per week, quietest gym times, sets per muscle, neglected muscles.
- **AI plan**: from time available, target muscles, recent workouts (and how they felt), goals, and the gym's equipment.

## Develop

Any static file server works, e.g. `python -m http.server 3000`, then open http://localhost:3000.

The earlier Node server version (Google sign-in, Apple Health endpoint) is in the first commit of this repo's history.
