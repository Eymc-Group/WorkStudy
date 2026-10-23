# WorkStudy Offline Branch

This branch allows WorkStudy to run with offline games and an offline soundboard.

## Requirements

Download all 3 ZIP files:

### 1. WorkStudy Offline

[Download WorkStudy Offline](https://github.com/schoolwork04/WorkStudy/archive/refs/heads/offline.zip)

### 2. Soundboard

[Download Soundboard](https://github.com/schoolwork04/soundboard/archive/refs/heads/main.zip)

### 3. Games (gfiles)

[Download Games](https://github.com/schoolwork04/gfiles/archive/refs/heads/master.zip)

---

# WARNING

⚠️ The games package may be large.

The gfiles repository contains a large collection of games and may take some time to download and extract depending on your device and internet connection.

---

# Setup

## Step 1

Download all three ZIP files.

## Step 2

Extract all three ZIP files.

After extraction, you should have folders similar to:

```text
offline/
soundboard-main/
gfiles-main/
```

## Step 3

Keep the extracted folders together in the same parent directory.

Example:

```text
Projects/
├── offline/
├── soundboard-main/
└── gfiles-main/
```

Do not rename the extracted folders.

## Step 4

Open:

```text
offline/index.html
```

---

# Features

✅ Offline Games

✅ Offline Soundboard

✅ Offline Themes

✅ Offline Settings

✅ Offline Device Info

✅ Local Assets

✅ No GitHub Pages Required After Setup

---

# Troubleshooting

### Soundboard Not Loading

Verify the following exists:

```text
soundboard-main/
└── soundboard-main/
    └── index.html
```

### Games Not Loading

Verify the following exists:

```text
gfiles-main/
└── gfiles-main/
    └── games/
```

### White Screen / Missing Pages

Make sure:

- All ZIP files were extracted.
- Folder names were not changed.
- All folders remain in the same parent directory.

---

# Offline Paths Used

Soundboard:

```text
../../../soundboard-main/soundboard-main/index.html
```

Games:

```text
../../../gfiles-main/gfiles-main/games/<game>/
```

---

# Credits

## WorkStudy

Created and maintained by schoolwork04.

## Soundboard

Forked from:

https://github.com/genizymath/soundboard

Original credit belongs to GenizyMath.

## Games (gfiles)

Forked from:

https://github.com/HTML5GameArchive/gfiles

Original credit belongs to HTML5GameArchive.

## Offline Branch

Offline integration, setup instructions, and WorkStudy compatibility maintained by schoolwork04.

---

Enjoy WorkStudy Offline! 🎮🎵🚀
