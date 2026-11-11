// gamebuttons.js — iOS app-icon style game cards
// v4.0.0

(function () {
    // ── RAWG image cache ──────────────────────────────────────────────────
    const IMG_CACHE_KEY = "ws_game_img_cache";
    let imgCache = {};
    try { imgCache = JSON.parse(sessionStorage.getItem(IMG_CACHE_KEY) || "{}"); } catch(e){}
    function saveImgCache() {
        try { sessionStorage.setItem(IMG_CACHE_KEY, JSON.stringify(imgCache)); } catch(e){}
    }

    // ── RAWG slug overrides ───────────────────────────────────────────────
    const RAWG_SLUGS = {
        "slope":"slope","run 3":"run-3","1v1.lol":"1v1-lol","btd4":"bloons-tower-defense-4",
        "cookie clicker":"cookie-clicker","geometry dash":"geometry-dash","retro bowl":"retro-bowl",
        "minecraft classic":"minecraft","2048":"2048","chess":"chess","among us":"among-us",
        "snake":"snake","tetris":"tetris","pac-man":"pac-man","flappy bird":"flappy-bird",
        "getting over it":"getting-over-it-with-bennett-foddy","cuphead":"cuphead",
        "undertale yellow":"undertale","ultrakill":"ultrakill","pizza tower":"pizza-tower",
        "kindergarten":"kindergarten","omori":"omori","hotline miami":"hotline-miami",
        "karlson":"karlson","people playground":"people-playground","raft":"raft",
        "yandere simulator":"yandere-simulator","bitlife":"bitlife-life-simulator",
        "clicker heroes":"clicker-heroes","buckshot roulette":"buckshot-roulette",
        "that's not my neighbor":"thats-not-my-neighbor","dead plate":"dead-plate",
        "tattletail":"tattletail","bendy":"bendy-and-the-ink-machine",
        "amanda the adventurer":"amanda-the-adventurer","repo":"repo",
        "fears to fathom":"fears-to-fathom","class of 09":"class-of-09",
    };

    // ── Deterministic gradient from name ─────────────────────────────────
    function getGradient(name) {
        let h = 0;
        for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) & 0xffff;
        const hue = h % 360;
        return `linear-gradient(145deg, hsl(${hue},65%,30%), hsl(${(hue+50)%360},75%,15%))`;
    }

    // ── RAWG fetch ────────────────────────────────────────────────────────
    async function fetchGameImage(name) {
        const key = name.toLowerCase();
        if (imgCache[key]) return imgCache[key];
        const slug  = RAWG_SLUGS[key];
        const query = slug || key.replace(/[^a-z0-9 ]/gi,"").trim();
        try {
            const res  = await fetch(`https://api.rawg.io/api/games?search=${encodeURIComponent(query)}&page_size=1&key=`, { signal: AbortSignal.timeout(4000) });
            if (!res.ok) throw 0;
            const data = await res.json();
            const img  = data?.results?.[0]?.background_image;
            if (img) { imgCache[key] = img; saveImgCache(); return img; }
        } catch(e){}
        return null;
    }

    // ── Download helper ───────────────────────────────────────────────────
    function downloadGame(e, game) {
        e.stopPropagation();
        if (game.external) { window.open(game.path, "_blank"); return; }
        const a = document.createElement("a");
        a.href = game.path;
        a.download = (game.name || "game").replace(/[^a-z0-9 _-]/gi,"_");
        document.body.appendChild(a); a.click(); a.remove();
    }

    // ── Inject card styles once ───────────────────────────────────────────
    function injectStyles() {
        if (document.getElementById("ws-gamecard-styles")) return;
        const style = document.createElement("style");
        style.id = "ws-gamecard-styles";
        style.textContent = `
            .ws-game-icon {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 6px;
                width: 90px;
                cursor: pointer;
                background: none;
                border: none;
                padding: 4px 2px;
                border-radius: 4px;
                transition: transform 0.12s, opacity 0.12s;
                font-family: system-ui, sans-serif;
                -webkit-tap-highlight-color: transparent;
            }
            .ws-game-icon:hover { transform: scale(1.06); }
            .ws-game-icon:active { transform: scale(0.93); opacity: 0.75; }

            .ws-icon-img {
                width: 72px;
                height: 72px;
                border-radius: 18px;
                overflow: hidden;
                position: relative;
                flex-shrink: 0;
                box-shadow: 0 4px 12px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(255,255,255,0.08);
            }

            .ws-icon-bg {
                width: 100%; height: 100%;
                display: flex; align-items: center; justify-content: center;
                font-size: 32px;
                transition: opacity 0.3s;
            }

            .ws-icon-cover {
                position: absolute; inset: 0;
                background-size: cover;
                background-position: center;
                border-radius: 18px;
                opacity: 0;
                transition: opacity 0.4s;
            }
            .ws-icon-cover.loaded { opacity: 1; }

            /* shine gloss overlay */
            .ws-icon-img::after {
                content: '';
                position: absolute; inset: 0;
                border-radius: 18px;
                background: linear-gradient(160deg, rgba(255,255,255,0.18) 0%, transparent 55%);
                pointer-events: none;
                z-index: 2;
            }

            .ws-icon-dl {
                position: absolute;
                bottom: 4px; right: 4px;
                width: 22px; height: 22px;
                border-radius: 50%;
                border: none;
                background: rgba(0,0,0,0.65);
                color: #fff;
                font-size: 10px;
                cursor: pointer;
                display: flex; align-items: center; justify-content: center;
                z-index: 3;
                transition: background 0.15s, transform 0.1s;
            }
            .ws-icon-dl:hover { background: rgba(124,58,237,0.9); transform: scale(1.15); }

            .ws-icon-name {
                font-size: 11px;
                font-weight: 500;
                color: var(--text, #e2e8f0);
                text-align: center;
                line-height: 1.2;
                max-width: 80px;
                overflow: hidden;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
                word-break: break-word;
            }

            /* grid override when ios mode is active */
            #gamesGrid.ws-ios-grid {
                display: flex;
                flex-wrap: wrap;
                gap: 16px 8px;
                padding: 16px 12px;
                justify-content: flex-start;
            }
        `;
        document.head.appendChild(style);
    }

    // ── Build a card ──────────────────────────────────────────────────────
    function buildCard(game) {
        const btn = document.createElement("button");
        btn.className = "ws-game-icon";
        btn.setAttribute("aria-label", game.name);

        // Icon box
        const iconBox = document.createElement("div");
        iconBox.className = "ws-icon-img";

        // Background (gradient + emoji letter)
        const bg = document.createElement("div");
        bg.className = "ws-icon-bg";
        bg.style.background = getGradient(game.name);
        bg.textContent = game.name[0].toUpperCase();

        // Cover image (lazy loaded)
        const cover = document.createElement("div");
        cover.className = "ws-icon-cover";

        // Download button
        const dl = document.createElement("button");
        dl.className = "ws-icon-dl";
        dl.innerHTML = "⬇";
        dl.title = "Open / Download " + game.name;
        dl.addEventListener("click", e => downloadGame(e, game));

        iconBox.append(bg, cover, dl);

        // Label
        const label = document.createElement("div");
        label.className = "ws-icon-name";
        label.textContent = game.name;

        btn.append(iconBox, label);

        // Click to play
        btn.addEventListener("click", function () {
            localStorage.setItem("gameUrl",    game.path);
            localStorage.setItem("gameName",   game.name);
            localStorage.setItem("gameAuthor", game.author || "");
            if (game.external) window.open(game.path, "_blank");
            else location.href = "../pages/game.html";
        });

        // Lazy-load RAWG cover
        const obs = new IntersectionObserver(async entries => {
            if (!entries[0].isIntersecting) return;
            obs.disconnect();
            const src = await fetchGameImage(game.name);
            if (src) {
                cover.style.backgroundImage = `url('${src}')`;
                cover.classList.add("loaded");
            }
        }, { rootMargin: "250px" });
        obs.observe(btn);

        return btn;
    }

    // ── Render ────────────────────────────────────────────────────────────
    window.addEventListener("load", function () {
        const grid = document.getElementById("gamesGrid");
        if (!grid || typeof games === "undefined") return;
        injectStyles();
        grid.classList.add("ws-ios-grid");
        games.forEach(game => grid.appendChild(buildCard(game)));
    });
})();
