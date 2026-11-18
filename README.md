# myGym

Personal workout tracker for iPhone, installed with Sideloadly. No server and no account:
all data (workouts, photos, videos) is stored on the phone.

## Install

1. On GitHub, open **Releases → myGym for iPhone** and download `myGym.ipa`.
   (Built automatically by GitHub Actions on a Mac. If it's missing: **Actions → Build iOS app → Run workflow**.)
2. Open Sideloadly on your computer, plug in the iPhone, drop in `myGym.ipa`, sign in with your Apple ID, and click Start.
3. On the iPhone, trust your developer profile: **Settings → General → VPN & Device Management**.

With a free Apple ID, apps expire after 7 days. Turn on Sideloadly's auto-refresh, or re-sideload the same `.ipa`
over the top. Reinstalling over the top keeps your data; **deleting the app deletes your data**.

## Updates (no reinstalling)

Every push to `main` that changes `www/` is published by GitHub Actions to the `updates` branch.
When you open myGym with internet, it checks that branch, downloads any newer version in the background,
and switches to it the next time you open the app. With no internet it runs the last version it downloaded.

You only need a new `.ipa` from Sideloadly when the native shell changes (`package.json`, `capacitor.config.json`,
the app icon). That's rare, and GitHub Actions rebuilds the `.ipa` for you when it happens.

## AI planner (Claude API key)

More → **Claude API key**. Paste a key from console.anthropic.com → API Keys.
The key is saved only on the phone and sent only to Anthropic. Each suggestion costs a few cents.
Set a monthly spend limit in the Console. When the key expires, paste a new one in the same place.

## Backups

More → **Back up data** opens the share sheet. Save the file to Files or iCloud. It includes your records and photos, but not videos.
More → **Restore backup** loads a backup and replaces everything on the phone.

## What's in it

Bottom bar: **Home · Workouts · ＋ (quick actions) · Stats · More**. Theme: System / Light / Dark.

- **Gyms**: several gyms, one ★ main, equipment per gym, busyness heatmap per gym.
- **Workouts**: plan, repeat, or log after the fact. Last time's sets, reps and weight are filled in for you.
- **Live mode**: tap off sets as you go, rest timer with a beep, screen stays awake, plate calculator, swap an exercise, how-to.
- **Exercises**: muscles, equipment, notes, photos/videos, YouTube how-to, PRs, estimated 1-rep max, history.
- **Body weight, progress photos (side-by-side compare), measurements**, under Stats → Progress.
- **Insights**: calendar, workouts per week, quietest gym times, sets per muscle, neglected muscles.
- **AI plan**: built from time available, target muscles, recent workouts, goals and the gym's equipment.

## Layout

- `www/`: the app itself (HTML/CSS/JS). This is what in-app updates replace.
- `capacitor.config.json`, `package.json`: the native iOS shell (Capacitor). The Xcode project is generated in CI.
- `resources/icon-1024.png`: app icon.
- `.github/workflows/`: `ios-build.yml` builds the `.ipa`; `publish-update.yml` publishes in-app updates.

To try the app on a computer: `python -m http.server 3000 -d www` and open http://localhost:3000.
