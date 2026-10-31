# 🚀 WorkStudy

WorkStudy is a customizable web hub featuring games, search tools, a soundboard, website viewing, themes, user accounts, cloud saves, device information, and multiple hosting mirrors.

## Features

- 🎮 Large collection of browser games
- 💬 Chat page
- 🎵 Soundboard
- 🌐 Website viewer
- 🎨 Custom themes
- 👤 User accounts
- 🔐 Username or email login
- 🛡️ Cloudflare Turnstile protection
- 🔒 Secure password hashing
- 💾 Authenticated cloud saves
- 📥 Progress restoration
- 🗑️ Save and account deletion
- 🎨 Coloring board
- 📱 Mobile-friendly layout
- 💻 Device and battery information
- 🏛️ Legacy WorkStudy access
- 📦 Downloadable offline version
- 🪞 Multiple hosting mirrors

## Main Website

[Open WorkStudy on GitHub Pages](https://eymc-group.github.io/WorkStudy/)

## Mirrors

If one mirror is unavailable, try another.

- [GitHub Pages](https://eymc-group.github.io/WorkStudy/)
- [Cloudflare Pages](https://workstudy-ahc.pages.dev/)
- [Netlify](https://workingstudys.netlify.app/)
- [Render](https://workstudy-u2mi.onrender.com/)
- [Vercel](https://work-study-kappa.vercel.app/)
- [Neocities](https://workingstudy.neocities.org/)

### Mirror Information

🚀 **Recommended:** Vercel generally receives new WorkStudy deployments quickly.

✅ GitHub Pages, Vercel, Render, and Neocities may be accessible on networks where other hosting providers are unavailable.

🔒 Cloudflare Pages and Netlify may be blocked by some school filtering systems even when the mirrors are online and functioning.

## Account System

WorkStudy accounts support:

- Unique usernames
- Unique email addresses
- Username or email login
- Case-insensitive username protection
- Hashed passwords
- Signed authentication tokens
- Cloudflare Turnstile verification
- Secure account deletion
- Automatic migration of older account records

Passwords are not stored in local storage and should never be displayed or shared.

## Cloud Saves

Logged-in users can:

- Save local WorkStudy progress to the cloud
- Load saved progress on another mirror or device
- Delete cloud-save data
- Keep account credentials separate from saved preferences

The cloud-save system excludes authentication information, passwords, and account tokens from uploaded save data.

## Themes

WorkStudy includes many themes, including:

- Blue
- Green
- Red
- Orange
- Yellow
- Pink
- Cyan
- Teal
- Purple
- Indigo
- Lime
- Minecraft
- Discord
- Void
- Rose
- Amber
- Sky
- Slate
- Emerald
- Violet
- Fuchsia
- Stone
- Zinc
- Vibrant Orange
- Aqua
- Crimson
- Sunset
- Ocean

Theme preferences are saved locally.

## Project Structure

```text
WorkStudy/
├── .github/
│   └── workflows/
│       └── neocities.yml       — auto-deploy to Neocities
├── css/
│   └── style.css               — global styles and themes
├── fonts/                      — local font files
├── games/
│   ├── bennett/                — games added by Bennett (embedded via GitHub Pages)
│   ├── legacy-games/           — legacy embedded game pages
│   │   ├── 2040.html
│   │   ├── badparenting.html
│   │   ├── cookieclicker.html
│   │   ├── fnae.html
│   │   ├── gd.html
│   │   ├── hollowknight.html
│   │   ├── minecraft.html
│   │   ├── retrobowl.html
│   │   ├── run3.html
│   │   └── slope.html
│   └── index.html              — games browser with search
├── img/                        — icons and images
├── js/
│   ├── auth.js                 — user session read/write helpers
│   ├── cloudSave.js            — cloud save and load logic
│   ├── color.js                — theme loading and switching
│   ├── customTab.js            — custom tab name and favicon
│   ├── gameFrameSave.js        — in-game save and restore via postMessage
│   ├── gamebuttons.js          — builds game cards from gamelist
│   ├── gamelist.js             — list of all games and their paths
│   ├── iframe.js               — website viewer iframe logic
│   ├── legacyconfirm.js        — confirm dialog before opening legacy site
│   ├── login.js                — login form submission and API call
│   ├── script.js               — main settings, account UI, and init
│   ├── searchbar.js            — game search filter
│   ├── status.js               — device info (battery, browser, platform, time)
│   ├── sw.js                   — service worker for offline caching
│   ├── users.js                — online user counter via Cloudflare Worker
│   ├── visits.js               — visit counter via Cloudflare Worker
│   └── website.js              — saved websites list for the website viewer
├── legacy/                     — old WorkStudy site (preserved as-is)
│   ├── index.html
│   ├── games.html
│   ├── chat.html
│   ├── proxys.html
│   ├── proxys.js
│   └── *.html                  — individual legacy game embeds
├── pages/
│   ├── chat/
│   │   └── index.html          — chat page
│   ├── boardofcolor.html       — coloring board launcher with fullscreen
│   ├── coloringboard.html      — full coloring board app (canvas drawing)
│   ├── deviceinfo.html         — live device and battery info
│   ├── game.html               — game player with save/restore support
│   ├── iframe.html             — website viewer with saved sites
│   ├── login.html              — login page
│   ├── proxy.html              — proxy page
│   ├── signup.html             — account registration with Turnstile
│   └── soundboard.html         — soundboard (embedded from eymc-group.github.io)
├── index.html                  — homepage
├── test.json                   — health check endpoint ({ "status": "ok" })
├── users.js                    — (root-level legacy copy, superseded by js/users.js)
└── README.md
```

## Cloudflare Workers

WorkStudy uses Cloudflare Workers for the account system, cloud saves, visit counting, and online user tracking.

### WorkStudy API

Handles account registration, login, session verification, and deletion.

```text
POST   /register
POST   /login
GET    /me
DELETE /delete-account
```

Required configuration:

```text
KV binding:   USERS
Secrets:      AUTH_SECRET
              TURNSTILE_SECRET
```

### WorkStudy Saves

Handles saving, loading, and deleting cloud save data.

```text
POST   /api/save-progress
GET    /api/load-progress
DELETE /api/delete-save
```

Required configuration:

```text
KV binding:   SAVES
Secret:       AUTH_SECRET
```

### WorkStudy Visits

Records total site visits and returns the current count.

```text
POST   /visit    — record a visit and return total
```

### Online Counter

Tracks how many users are currently online using a unique per-browser ID.

```text
GET    /?id=<userId>    — ping presence and return online count
```

The `AUTH_SECRET` value must be identical across both the API and Saves Workers.

> [!IMPORTANT]
> Never commit `AUTH_SECRET`, `TURNSTILE_SECRET`, API keys, passwords, or other private credentials to the repository.

## Offline Version

The offline branch allows WorkStudy, the soundboard, and games to run entirely from downloaded files without an internet connection.

### Downloads

1. [Download WorkStudy Offline](https://github.com/Eymc-Group/WorkStudy/archive/refs/heads/offline.zip)
2. [Download the Soundboard](https://github.com/Eymc-Group/soundboard/archive/refs/heads/main.zip)
3. [Download the Games Collection](https://github.com/Eymc-Group/gfiles/archive/refs/heads/master.zip)

> [!WARNING]
> The games package may be large and may take additional time to download and extract.

### Offline Setup

1. Download all three ZIP files.
2. Extract each ZIP file completely.
3. Keep all three extracted folders together in the same parent folder.
4. Do not rename the extracted folders.
5. Open `WorkStudy-offline/index.html` to start.

The extracted folders should look like this:

```text
Downloads/
├── WorkStudy-offline/
├── soundboard-main/
└── gfiles-master/
```

### Offline Paths

Game files are loaded relative to `pages/game.html` inside `WorkStudy-offline/`:

```text
../../gfiles-master/gfiles-master/games/<game>/
```

Soundboard is loaded relative to `pages/soundboard.html`:

```text
../../soundboard-main/soundboard-main/index.html
```

The offline branch does not support accounts, Turnstile, cloud saves, visit counting, or the online counter, as these require an internet connection to reach the Cloudflare Workers.

## Local Development

WorkStudy is built with:

```text
HTML
CSS
JavaScript
Cloudflare Workers
Cloudflare Workers KV
```

To test the static pages locally, serve the repository through a local web server (e.g. `npx serve` or VS Code Live Server). Opening `index.html` directly as a `file://` URL may cause issues with service workers and some scripts.

When changing authentication or cloud-save code, update all related files together:

```text
pages/login.html
pages/signup.html
js/auth.js
js/login.js
js/script.js
js/cloudSave.js
workstudy-api Worker
workstudy-saves Worker
```

## Backup Checklist

Before making major changes:

1. Commit the current working version to `root`.
2. Open a pull request into `backup` and merge it.
3. Download a ZIP backup of the repository if needed.
4. Save backup copies of both Worker scripts.
5. Verify that Worker secrets and KV bindings are configured.
6. Never include secret values in backups stored publicly.
7. Test login, signup, saving, loading, logout, and account deletion after any auth changes.

## Credits

### WorkStudy

Created and maintained by Eymc-Group.

Development assistance and code organization were supported by tools from Microsoft, Anthropic, and GitHub.

### Soundboard

Forked from:

[genizymath/soundboard](https://github.com/genizymath/soundboard)

Original project credit belongs to GenizyMath.

### Games Collection

Forked from:

[HTML5GameArchive/gfiles](https://github.com/HTML5GameArchive/gfiles)

Original project credit belongs to HTML5GameArchive and the respective game creators.

### Bennett Games

Additional games contributed by Bennett, hosted under `games/bennett/`.

### Hosting

Thanks to the following services for hosting WorkStudy mirrors:

- GitHub Pages
- Cloudflare Pages
- Netlify
- Render
- Vercel
- Neocities

## Disclaimer

WorkStudy is an independent personal project.

Third-party games, soundboard content, names, logos, and other assets belong to their respective owners. WorkStudy does not claim ownership of third-party content.

Users should follow applicable school, workplace, network, and device policies.

## License

Check the licenses of the original soundboard and games repositories before redistributing their content.

Code written specifically for WorkStudy may be licensed separately by the repository owner.

---

## WorkStudy Development Status

```text
Website               ✅
Multiple mirrors       ✅
Offline branch         ✅
Account registration   ✅
Username/email login   ✅
Turnstile              ✅
Password hashing       ✅
Authentication token   ✅
Cloud saves            ✅
Account deletion       ✅
Visit counter          ✅
Online counter         ✅
Coloring board         ✅
Game save/restore      ✅
Custom tab/icon        ✅
```
