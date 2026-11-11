# WorkStudy — Claude Session Notes

This folder contains notes, unfinished work, and session context for Claude AI sessions working on this project.

---

## 🏗️ Current State (Session Nov 2026)

### ✅ Completed This Session
- iOS app-icon style game cards (gamebuttons.js v4)
- iOS app-icon style apps.html
- Shorts: real YT video IDs, wide/vertical format support
- Leaderboard: time on site + time on games columns, 🕹️ Game Time tab
- Offline mode toggle on homepage (disables online-only features)
- game.html: session time tracking (ws-game-start, ws-minutes-on-games)
- online.js: getMinutesOnGames() + minutesOnGames in ping body
- movies.html: removed sandbox, 7 providers
- website.html (renamed from iframe.html): removed sandbox from fetchFrame
- apps.html: new Apps hub page

### 🔧 Unfinished / Backlog

#### 1. Coloring Board improvements (`pages/coloringboard.html`)
- Needs: fill bucket tool, undo/redo stack, brush size slider, color palette grid, save as PNG button
- Status: NOT started this session — file exists but is old

#### 2. Custom Theme Background Picker
- Google Slides-style background color picker in Settings panel
- Should set `--bg` CSS variable site-wide, saved to localStorage
- Status: NOT started — needs color.js update + settings panel addition

#### 3. Google Sign-In / Sign-Up Integration
- From claudemessage.txt: OAuth flow, signup.html / login.html fullscreen iframe mode
- Status: NOT started

#### 4. Cloudflare Worker Improvements
- Malicious activity warning system + IP banning
- Status: NOT started

#### 5. GameIcons directory (`img/GameIcons/`)
- Icons for every game — currently using RAWG API for covers
- Status: NOT started

#### 6. Safety/Connection Option in Settings
- None / Proxy / VPN toggle
- Status: NOT started

#### 7. Hidden Offline Code Runner
- PWA file handler — no UI button, works via "Open with" on installed PWA
- From claudemessage.txt

#### 8. Cloudflare Worker — ping endpoint update
- Worker `workstudy-api` at `https://workstudy-api.354271744.workers.dev`
- Needs to persist `minutesOnGames` from ping body to KV store and leaderboard score
- Status: NOT updated (online.js sends it, but Worker doesn't store/use it yet)

---

## 📁 Key Files

| File | Purpose |
|------|---------|
| `js/gamelist.js` | All game definitions (150+) |
| `js/gamebuttons.js` | iOS-style game card renderer |
| `js/online.js` | Ping system, online counter, stats |
| `js/color.js` | Theme system (setTheme) |
| `pages/movies.html` | Movie/TV streaming with 7 providers |
| `pages/shorts.html` | YouTube Shorts emulator |
| `pages/apps.html` | Apps hub |
| `pages/website.html` | Chrome-like browser viewer |
| `pages/leaderboard.html` | Player rankings |
| `pages/coloringboard.html` | Drawing canvas (needs improvement) |

---

## 🔑 Important Rules
- **NEVER overwrite `js/gamelist.js` on offline branch**
- Default branch = `root` (live site)
- Offline branch DELETED (replaced by offline toggle on homepage)
- Backup branch DELETED (replaced by offline toggle)
- Always push after each file change

---

## 🌐 External APIs Used
- RAWG.io: game cover images (no API key, public endpoint)
- TMDB: movie search (via movies.html)
- 2embed.cc, vidsrc.to, etc: streaming providers
- Cloudflare Worker: `https://workstudy-api.354271744.workers.dev`
  - `/stats/ping` — POST: `{ sessionId, minutesOnSite, gamesPlayed, minutesOnGames }`
  - `/stats/visit` — POST visit record
  - `/leaderboard` — GET leaderboard data
  - `/online/count` — GET online user count
