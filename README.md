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
├── css/
│   └── style.css
├── fonts/
├── games/
│   └── index.html
├── img/
├── js/
│   ├── auth.js
│   ├── cloudSave.js
│   ├── color.js
│   ├── legacyconfirm.js
│   ├── login.js
│   ├── script.js
│   └── status.js
├── pages/
│   ├── chat/
│   ├── deviceinfo.html
│   ├── iframe.html
│   ├── login.html
│   ├── signup.html
│   └── soundboard.html
├── index.html
└── README.md
```

## Cloudflare Workers

WorkStudy uses two separate Cloudflare Workers.

### WorkStudy API

The account API handles:

```text
POST   /register
POST   /login
GET    /me
DELETE /delete-account
```

Required configuration:

```text
KV binding:
USERS

Secrets:
AUTH_SECRET
TURNSTILE_SECRET
```

### WorkStudy Saves

The cloud-save API handles:

```text
POST   /api/save-progress
GET    /api/load-progress
DELETE /api/delete-save
```

Required configuration:

```text
KV binding:
SAVES

Secret:
AUTH_SECRET
```

The `AUTH_SECRET` value must be identical on both Workers.

> [!IMPORTANT]
> Never commit `AUTH_SECRET`, `TURNSTILE_SECRET`, API keys, passwords, or other private credentials to the repository.

## Offline Version

The offline branch allows WorkStudy, the soundboard, and games to run from downloaded files.

### Downloads

1. [Download WorkStudy Offline](https://github.com/schoolwork04/WorkStudy/archive/refs/heads/offline.zip)
2. [Download the Soundboard](https://github.com/schoolwork04/soundboard/archive/refs/heads/main.zip)
3. [Download the Games Collection](https://github.com/schoolwork04/gfiles/archive/refs/heads/master.zip)

> [!WARNING]
> The games package may be large and may take additional time to download and extract.

### Offline Setup

1. Download all three ZIP files.
2. Extract each ZIP file completely.
3. Keep the extracted folders together in the same parent folder.
4. Do not rename the extracted folders.
5. Open the WorkStudy offline `index.html` file.

Example:

```text
Downloads/
├── WorkStudy-offline/
├── soundboard-main/
└── gfiles-master/
```

The offline branch may not support server-based features such as accounts, Turnstile, or cloud saves without an internet connection.

## Local Development

WorkStudy is primarily built with:

```text
HTML
CSS
JavaScript
Cloudflare Workers
Cloudflare Workers KV
```

To test the static pages, open `index.html` through a local web server or deploy the repository to a static hosting provider.

When changing authentication or cloud-save code, update related files together:

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

Before making major account-system changes:

1. Commit the current working version.
2. Download a ZIP backup of the repository.
3. Save backup copies of both Worker scripts.
4. Verify that Worker secrets and KV bindings are configured.
5. Never include secret values in backups stored publicly.
6. Test login, signup, saving, loading, logout, and account deletion.

Suggested commit message:

```text
Fix authentication, cloud saves, and account deletion
```

## Credits

### WorkStudy

Created and maintained by `schoolwork04`.

Development assistance and code organization were supported by tools from Microsoft, Anthropic, and GitHub.

### Soundboard

Forked from:

[genizymath/soundboard](https://github.com/genizymath/soundboard)

Original project credit belongs to GenizyMath.

### Games Collection

Forked from:

[HTML5GameArchive/gfiles](https://github.com/HTML5GameArchive/gfiles)

Original project credit belongs to HTML5GameArchive and the respective game creators.

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
Website              ✅
Multiple mirrors      ✅
Offline branch        ✅
Account registration  ✅
Username/email login  ✅
Turnstile             ✅
Password hashing      ✅
Authentication token  ✅
Cloud saves           ✅
Account deletion      ✅
Missing comma         Still dangerous 💀
```

**WorkStudy: powerful enough to run on multiple hosts, fragile enough to fear one missing comma.**
