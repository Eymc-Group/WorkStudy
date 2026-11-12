// gamebuttons.js — iOS app-icon style game cards
// v6.0.0 — IndexedDB image cache, canvas placeholders, robust offline

(function () {

    // ── IndexedDB image cache (much larger than localStorage) ────────────
    var IDB_DB_NAME = "ws_gameimgs_v6";
    var IDB_STORE   = "imgs";
    var idb = null;

    function openIDB() {
        return new Promise(function(resolve) {
            if (idb) return resolve(idb);
            try {
                var req = indexedDB.open(IDB_DB_NAME, 1);
                req.onupgradeneeded = function(e) {
                    e.target.result.createObjectStore(IDB_STORE);
                };
                req.onsuccess = function(e) { idb = e.target.result; resolve(idb); };
                req.onerror   = function()   { resolve(null); };
            } catch(e) { resolve(null); }
        });
    }

    function idbGet(key) {
        return openIDB().then(function(db) {
            if (!db) return null;
            return new Promise(function(resolve) {
                try {
                    var tx = db.transaction(IDB_STORE, "readonly");
                    var req = tx.objectStore(IDB_STORE).get(key);
                    req.onsuccess = function() { resolve(req.result || null); };
                    req.onerror   = function() { resolve(null); };
                } catch(e) { resolve(null); }
            });
        });
    }

    function idbSet(key, value) {
        return openIDB().then(function(db) {
            if (!db) return;
            try {
                var tx = db.transaction(IDB_STORE, "readwrite");
                tx.objectStore(IDB_STORE).put(value, key);
            } catch(e) {}
        });
    }

    // ── Static poster map ─────────────────────────────────────────────────
    var STATIC_POSTERS = {
        "slope":        "https://img.itch.zone/aW1nLzU4NDM4OTAucG5n/315x250%23c/NvxK%2Bc.png",
        "run 3":        "https://www.coolmathgames.com/sites/default/files/Run3_OGimage.jpg",
        "1v1.lol":      "https://1v1.lol/assets/img/icon.png",
        "btd4":         "https://cdn.akamai.steamstatic.com/steam/apps/444900/header.jpg",
        "bloons tower defense 4": "https://cdn.akamai.steamstatic.com/steam/apps/444900/header.jpg",
        "cookie clicker":"https://orteil.dashnet.org/cookieclicker/img/favicon.ico",
        "geometry dash":"https://cdn.akamai.steamstatic.com/steam/apps/322170/header.jpg",
        "retro bowl":   "https://cdn.akamai.steamstatic.com/steam/apps/1631580/header.jpg",
        "minecraft classic": "https://cdn.akamai.steamstatic.com/steam/apps/1672970/header.jpg",
        "2048":         "https://play2048.co/images/meta-image.png",
        "chess":        "https://upload.wikimedia.org/wikipedia/commons/6/6f/ChessSet.jpg",
        "among us":     "https://cdn.akamai.steamstatic.com/steam/apps/945360/header.jpg",
        "snake":        "https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Nokia_6110_Snake_Game.png/320px-Nokia_6110_Snake_Game.png",
        "tetris":       "https://cdn.akamai.steamstatic.com/steam/apps/1118140/header.jpg",
        "pac-man":      "https://www.arcade1up.com/cdn/shop/products/Pac-Man_Header.jpg",
        "flappy bird":  "https://upload.wikimedia.org/wikipedia/en/0/0a/Flappy_bird_nes.jpg",
        "getting over it": "https://cdn.akamai.steamstatic.com/steam/apps/240720/header.jpg",
        "cuphead":      "https://cdn.akamai.steamstatic.com/steam/apps/268910/header.jpg",
        "undertale":    "https://cdn.akamai.steamstatic.com/steam/apps/391540/header.jpg",
        "undertale yellow": "https://cdn.akamai.steamstatic.com/steam/apps/391540/header.jpg",
        "ultrakill":    "https://cdn.akamai.steamstatic.com/steam/apps/1229490/header.jpg",
        "pizza tower":  "https://cdn.akamai.steamstatic.com/steam/apps/2231450/header.jpg",
        "kindergarten": "https://cdn.akamai.steamstatic.com/steam/apps/589590/header.jpg",
        "kindergarten 2":"https://cdn.akamai.steamstatic.com/steam/apps/1067890/header.jpg",
        "omori":        "https://cdn.akamai.steamstatic.com/steam/apps/1150690/header.jpg",
        "hotline miami":"https://cdn.akamai.steamstatic.com/steam/apps/219150/header.jpg",
        "people playground":"https://cdn.akamai.steamstatic.com/steam/apps/1118240/header.jpg",
        "raft":         "https://cdn.akamai.steamstatic.com/steam/apps/648800/header.jpg",
        "bitlife":      "https://play-lh.googleusercontent.com/0wCKvFvFNhvl6CdPJmkXvgwHJO_iqWHZ5KJx9q4-p3D_7YFvGmF5Rl0RHIpSk0vN=s256",
        "clicker heroes":"https://cdn.akamai.steamstatic.com/steam/apps/363970/header.jpg",
        "buckshot roulette":"https://cdn.akamai.steamstatic.com/steam/apps/2835570/header.jpg",
        "dead plate":   "https://img.itch.zone/aW1nLzEzNzU2NzIzLnBuZw==/315x250%23c/j4s2wh.png",
        "tattletail":   "https://cdn.akamai.steamstatic.com/steam/apps/557600/header.jpg",
        "bendy":        "https://cdn.akamai.steamstatic.com/steam/apps/622650/header.jpg",
        "bendy and the ink machine": "https://cdn.akamai.steamstatic.com/steam/apps/622650/header.jpg",
        "amanda the adventurer": "https://cdn.akamai.steamstatic.com/steam/apps/2008350/header.jpg",
        "fnf":          "https://img.itch.zone/aW1nLzUxOTEzOTkucG5n/315x250%23c/YwVSTG.png",
        "friday night funkin": "https://img.itch.zone/aW1nLzUxOTEzOTkucG5n/315x250%23c/YwVSTG.png",
        "suika game":   "https://cdn.akamai.steamstatic.com/steam/apps/2448510/header.jpg",
        "vampire survivors":"https://cdn.akamai.steamstatic.com/steam/apps/1794680/header.jpg",
        "baldi's basics":"https://img.itch.zone/aW1nLzMwMTQ1MC5wbmc=/315x250%23c/vCRQ7E.png",
        "five nights at freddy's":"https://cdn.akamai.steamstatic.com/steam/apps/319510/header.jpg",
        "fnaf":         "https://cdn.akamai.steamstatic.com/steam/apps/319510/header.jpg",
        "minecraft":    "https://cdn.akamai.steamstatic.com/steam/apps/1672970/header.jpg",
        "the henry stickmin collection":"https://cdn.akamai.steamstatic.com/steam/apps/1089980/header.jpg",
        "henry stickmin":"https://cdn.akamai.steamstatic.com/steam/apps/1089980/header.jpg",
        "solar smash":  "https://play-lh.googleusercontent.com/wU2lgPD-mWAf7bEFoGLBpUmF1-JCxeM0XobN37RqPBwkuSjYTXJ7bKBQnFxuNk7QWg=s256",
        "line rider":   "https://upload.wikimedia.org/wikipedia/en/5/55/Line_Rider_logo.png",
        "wordle":       "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Wordle_196_example.svg/320px-Wordle_196_example.svg.png",
        "heardle":      "https://upload.wikimedia.org/wikipedia/en/8/83/Heardle_logo.webp",
        "quordle":      "https://quordle.com/icons/favicon.ico",
        "globle":       "https://globle-game.com/logo512.png",
        "worldle":      "https://worldle.teuteuf.fr/icons/icon-512x512.png",
        "dino":         "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/Chromasaur.png/320px-Chromasaur.png",
        "chrome dino":  "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/Chromasaur.png/320px-Chromasaur.png",
        "minesweeper":  "https://upload.wikimedia.org/wikipedia/en/e/e7/Minesweeper_on_Vista.png",
        "solitaire":    "https://upload.wikimedia.org/wikipedia/commons/9/90/Solitaire-Microsoft-Windows-98.png",
        "happy wheels": "https://upload.wikimedia.org/wikipedia/en/5/50/Happy_Wheels_cover.png",
        "age of war":   "https://img.gamedistribution.com/aeaa0f04b7e44f6481d059764c47eeee/-1024x1024.jpeg",
        "bloxd.io":     "https://bloxd.io/icon.png",
        "krunker":      "https://krunker.io/img/krunker_icon.png",
        "smash karts":  "https://smashkarts.io/assets/images/icon-512x512.png",
        "bullet force": "https://play-lh.googleusercontent.com/xJjxX4X0q_SApYnDfRnIq4f8XFDSj_2Ey8zGSx7GrXeGBEbSK0lFHASmvJ8yFI8DmRk=s256",
        "bonk.io":      "https://bonk.io/images/icon-512.png",
        "skribbl.io":   "https://skribbl.io/res/img/logo.gif",
        "fall guys":    "https://cdn.akamai.steamstatic.com/steam/apps/1097150/header.jpg",
        "rocket league":"https://cdn.akamai.steamstatic.com/steam/apps/252950/header.jpg",
        "fortnite":     "https://cdn2.epicgames.com/fortnite/offer/FNCH-BattleRoyale-Pack-Thumbnail-1200x1600-b7e4536f19e06c76ed1ff43416a35082.jpg",
        "apex legends": "https://cdn.akamai.steamstatic.com/steam/apps/1172470/header.jpg",
        "valorant":     "https://cdn.akamai.steamstatic.com/steam/apps/1547890/header.jpg",
        "stardew valley":"https://cdn.akamai.steamstatic.com/steam/apps/413150/header.jpg",
        "terraria":     "https://cdn.akamai.steamstatic.com/steam/apps/105600/header.jpg",
        "celeste":      "https://cdn.akamai.steamstatic.com/steam/apps/504230/header.jpg",
        "hollow knight":"https://cdn.akamai.steamstatic.com/steam/apps/367520/header.jpg",
        "super mario":  "https://upload.wikimedia.org/wikipedia/en/0/03/NewSuperMarioBros2boxart.jpg",
        "mario":        "https://upload.wikimedia.org/wikipedia/en/0/03/NewSuperMarioBros2boxart.jpg",
        "zelda":        "https://upload.wikimedia.org/wikipedia/en/4/4e/The_Legend_of_Zelda_BOTW.jpg",
        "pokemon":      "https://upload.wikimedia.org/wikipedia/en/c/ce/Pok%C3%A9mon_Scarlet_and_Violet.jpg",
        "sonic":        "https://cdn.akamai.steamstatic.com/steam/apps/1794960/header.jpg",
        "kirby":        "https://upload.wikimedia.org/wikipedia/en/d/d1/Kirby_Star_Allies_cover.jpg",
        "donkey kong":  "https://upload.wikimedia.org/wikipedia/en/8/83/Donkey_Kong_Country_Returns_cover.jpg",
        "duck life":    "https://img.itch.zone/aW1nLzI3NTQ4MDgucG5n/315x250%23c/xMZ4Jf.png",
        "bloxorz":      "https://img.gamedistribution.com/5b22cbbe77794b0581d99e51e56e7609.jpg",
        "papa's burgeria":"https://www.coolmathgames.com/sites/default/files/papasburgeria.jpg",
        "papa's":       "https://www.coolmathgames.com/sites/default/files/papasburgeria.jpg",
        "run":          "https://www.coolmathgames.com/sites/default/files/Run3_OGimage.jpg",
        "fireboy and watergirl":"https://img.gamedistribution.com/dba38b31ce8a4cd7b9e5a516e72c68e5.jpg",
        "fireboy":      "https://img.gamedistribution.com/dba38b31ce8a4cd7b9e5a516e72c68e5.jpg",
        "jacksmith":    "https://www.coolmathgames.com/sites/default/files/jacksmith.jpg",
        "strike force heroes":"https://img.gamedistribution.com/ea59c20d8f964ff4b8b35c4c2c3e2cce.jpg",
        "learn to fly": "https://img.gamedistribution.com/44f74c2cd0fb405c9e97a2f4f0d7a9c4.jpg",
        "ragdoll":      "https://img.gamedistribution.com/thumbnail_ragdoll.jpg",
        "tank trouble": "https://img.gamedistribution.com/8f06cb68b16444da8ca5e9e96a09d04e.jpg",
        "gold miner":   "https://img.gamedistribution.com/gold_miner.jpg",
        "sugar sugar":  "https://img.gamedistribution.com/sugar_sugar.jpg",
        "b-cubed":      "https://www.coolmathgames.com/sites/default/files/bcubed.jpg",
        "unblock me":   "https://play-lh.googleusercontent.com/TrO6e_nAHHLlFW2K5gWpVMuqNKAyJ1vYSEGIRV7qKZPK2rh2MR5x4VfElUNiEjHVrg=s256"
    };

    // ── Deterministic gradient + canvas placeholder ───────────────────────
    function getGradient(name) {
        var h = 0;
        for (var i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) & 0xffff;
        var hue = h % 360;
        return "linear-gradient(145deg, hsl(" + hue + ",65%,30%), hsl(" + ((hue+50)%360) + ",75%,15%))";
    }

    // Generate a canvas-based data URL for offline placeholder
    function makeCanvasPlaceholder(name) {
        try {
            var c = document.createElement("canvas");
            c.width = 72; c.height = 72;
            var ctx = c.getContext("2d");
            var h = 0;
            for (var i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) & 0xffff;
            var hue = h % 360;
            var g = ctx.createLinearGradient(0, 0, 72, 72);
            g.addColorStop(0, "hsl(" + hue + ",65%,30%)");
            g.addColorStop(1, "hsl(" + ((hue+50)%360) + ",75%,15%)");
            ctx.fillStyle = g;
            ctx.roundRect ? ctx.roundRect(0, 0, 72, 72, 18) : ctx.rect(0, 0, 72, 72);
            ctx.fill();
            // Letter
            ctx.fillStyle = "rgba(255,255,255,0.9)";
            ctx.font = "bold 28px system-ui, sans-serif";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(name[0].toUpperCase(), 36, 36);
            return c.toDataURL("image/png");
        } catch(e) { return null; }
    }

    // ── Probe image: returns src if loadable, else null ───────────────────
    function probeImage(src) {
        return new Promise(function(resolve) {
            if (!src) return resolve(null);
            var img = new Image();
            img.crossOrigin = "anonymous";
            var timer = setTimeout(function() { img.src = ""; resolve(null); }, 5000);
            img.onload  = function() { clearTimeout(timer); resolve(src); };
            img.onerror = function() { clearTimeout(timer); resolve(null); };
            img.src = src;
        });
    }

    // ── Multi-source image fetch with IDB cache ───────────────────────────
    async function fetchGameImage(name) {
        var key = name.toLowerCase().trim();

        // 1. IDB cache
        var cached = await idbGet(key);
        if (cached) return cached;

        // 2. Static poster map (exact)
        if (STATIC_POSTERS[key]) {
            var url = await probeImage(STATIC_POSTERS[key]);
            if (url) { await idbSet(key, url); return url; }
        }

        // 3. Partial match in static map
        for (var k in STATIC_POSTERS) {
            if (key.includes(k) || k.includes(key)) {
                var url2 = await probeImage(STATIC_POSTERS[k]);
                if (url2) { await idbSet(key, url2); return url2; }
            }
        }

        // 4. RAWG API (free, no key)
        try {
            var q = key.replace(/[^a-z0-9 ]/gi, "").trim();
            var res = await fetch(
                "https://api.rawg.io/api/games?search=" + encodeURIComponent(q) + "&page_size=1",
                { signal: AbortSignal.timeout(6000) }
            );
            if (res.ok) {
                var data = await res.json();
                var img = data && data.results && data.results[0] && data.results[0].background_image;
                if (img) {
                    var probed = await probeImage(img);
                    if (probed) { await idbSet(key, probed); return probed; }
                }
            }
        } catch(e) {}

        // 5. Wikipedia thumbnail
        try {
            var title = encodeURIComponent(name.replace(/[^a-z0-9 ]/gi, "") + " video game");
            var wres = await fetch(
                "https://en.wikipedia.org/api/rest_v1/page/summary/" + title,
                { signal: AbortSignal.timeout(4000) }
            );
            if (wres.ok) {
                var wdata = await wres.json();
                var wimg = wdata && wdata.thumbnail && wdata.thumbnail.source;
                if (wimg) {
                    var wprobed = await probeImage(wimg);
                    if (wprobed) { await idbSet(key, wprobed); return wprobed; }
                }
            }
        } catch(e) {}

        // 6. Canvas placeholder (always works, even offline)
        var placeholder = makeCanvasPlaceholder(name);
        if (placeholder) {
            // Don't cache canvas placeholder — retry next time online
            return placeholder;
        }

        return null;
    }

    // ── Download helper ───────────────────────────────────────────────────
    function downloadGame(e, game) {
        e.stopPropagation();
        if (game.external) { window.open(game.path, "_blank"); return; }
        var a = document.createElement("a");
        a.href = game.path;
        a.download = (game.name || "game").replace(/[^a-z0-9 _-]/gi, "_");
        document.body.appendChild(a); a.click(); a.remove();
    }

    // ── Inject card styles once ───────────────────────────────────────────
    function injectStyles() {
        if (document.getElementById("ws-gamecard-styles")) return;
        var style = document.createElement("style");
        style.id = "ws-gamecard-styles";
        style.textContent = "\n            .ws-game-icon {\n                display: flex;\n                flex-direction: column;\n                align-items: center;\n                gap: 6px;\n                width: 90px;\n                cursor: pointer;\n                background: none;\n                border: none;\n                padding: 4px 2px;\n                border-radius: 4px;\n                transition: transform 0.12s, opacity 0.12s;\n                font-family: system-ui, sans-serif;\n                -webkit-tap-highlight-color: transparent;\n            }\n            .ws-game-icon:hover { transform: scale(1.06); }\n            .ws-game-icon:active { transform: scale(0.93); opacity: 0.75; }\n\n            .ws-icon-img {\n                width: 72px;\n                height: 72px;\n                border-radius: 18px;\n                overflow: hidden;\n                position: relative;\n                flex-shrink: 0;\n                box-shadow: 0 4px 12px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(255,255,255,0.08);\n            }\n\n            .ws-icon-bg {\n                width: 100%; height: 100%;\n                display: flex; align-items: center; justify-content: center;\n                font-size: 32px;\n                transition: opacity 0.3s;\n            }\n\n            .ws-icon-cover {\n                position: absolute; inset: 0;\n                background-size: cover;\n                background-position: center;\n                border-radius: 18px;\n                opacity: 0;\n                transition: opacity 0.4s;\n            }\n            .ws-icon-cover.loaded { opacity: 1; }\n\n            /* shine gloss overlay */\n            .ws-icon-img::after {\n                content: '';\n                position: absolute; inset: 0;\n                border-radius: 18px;\n                background: linear-gradient(160deg, rgba(255,255,255,0.18) 0%, transparent 55%);\n                pointer-events: none;\n                z-index: 2;\n            }\n\n            .ws-icon-dl {\n                position: absolute;\n                bottom: 4px; right: 4px;\n                width: 22px; height: 22px;\n                border-radius: 50%;\n                border: none;\n                background: rgba(0,0,0,0.65);\n                color: #fff;\n                font-size: 10px;\n                cursor: pointer;\n                display: flex; align-items: center; justify-content: center;\n                z-index: 3;\n                transition: background 0.15s, transform 0.1s;\n            }\n            .ws-icon-dl:hover { background: rgba(124,58,237,0.9); transform: scale(1.15); }\n\n            .ws-icon-name {\n                font-size: 11px;\n                font-weight: 500;\n                color: var(--text, #e2e8f0);\n                text-align: center;\n                line-height: 1.2;\n                max-width: 80px;\n                overflow: hidden;\n                display: -webkit-box;\n                -webkit-line-clamp: 2;\n                -webkit-box-orient: vertical;\n                word-break: break-word;\n            }\n\n            /* grid override when ios mode is active */\n            #gamesGrid.ws-ios-grid {\n                display: flex;\n                flex-wrap: wrap;\n                gap: 16px 8px;\n                padding: 16px 12px;\n                justify-content: flex-start;\n            }\n        ";
        document.head.appendChild(style);
    }

    // ── Build a card ──────────────────────────────────────────────────────
    function buildCard(game) {
        var btn = document.createElement("button");
        btn.className = "ws-game-icon";
        btn.setAttribute("aria-label", game.name);

        // Icon box
        var iconBox = document.createElement("div");
        iconBox.className = "ws-icon-img";

        // Background (gradient)
        var bg = document.createElement("div");
        bg.className = "ws-icon-bg";
        bg.style.background = getGradient(game.name);
        bg.textContent = game.name[0].toUpperCase();

        // Cover image layer (lazy loaded)
        var cover = document.createElement("div");
        cover.className = "ws-icon-cover";

        // Download button
        var dl = document.createElement("button");
        dl.className = "ws-icon-dl";
        dl.innerHTML = "⬇";
        dl.title = "Open / Download " + game.name;
        dl.addEventListener("click", function(e) { downloadGame(e, game); });

        iconBox.appendChild(bg);
        iconBox.appendChild(cover);
        iconBox.appendChild(dl);

        // Label
        var label = document.createElement("div");
        label.className = "ws-icon-name";
        label.textContent = game.name;

        btn.appendChild(iconBox);
        btn.appendChild(label);

        // Click to play
        btn.addEventListener("click", function () {
            localStorage.setItem("gameUrl",    game.path);
            localStorage.setItem("gameName",   game.name);
            localStorage.setItem("gameAuthor", game.author || "");
            if (game.external) window.open(game.path, "_blank");
            else location.href = "../pages/game.html";
        });

        // Lazy-load cover image via IntersectionObserver
        var obs = new IntersectionObserver(function(entries) {
            if (!entries[0].isIntersecting) return;
            obs.disconnect();
            fetchGameImage(game.name).then(function(src) {
                if (!src) return;
                if (src.startsWith("data:")) {
                    // Canvas placeholder — apply directly
                    cover.style.backgroundImage = "url('" + src + "')";
                    cover.classList.add("loaded");
                } else {
                    var img = new Image();
                    img.onload = function() {
                        cover.style.backgroundImage = "url('" + src + "')";
                        cover.classList.add("loaded");
                    };
                    img.onerror = function() {};
                    img.src = src;
                }
            });
        }, { rootMargin: "400px" });
        obs.observe(btn);

        return btn;
    }

    // ── Render ────────────────────────────────────────────────────────────
    window.addEventListener("load", function () {
        var grid = document.getElementById("gamesGrid");
        if (!grid || typeof games === "undefined") return;
        injectStyles();
        grid.classList.add("ws-ios-grid");
        games.forEach(function(game) { grid.appendChild(buildCard(game)); });
    });
})();
