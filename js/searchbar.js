// searchbar.js — search + category tabs + recently played for WorkStudy games

(function () {
    "use strict";

    // ── Category definitions ──────────────────────────────────────────────────
    var CATEGORIES = [
        { id: "all",        label: "🎮 All" },
        { id: "action",     label: "⚔️ Action" },
        { id: "racing",     label: "🏎️ Racing" },
        { id: "platformer", label: "🏃 Platformer" },
        { id: "puzzle",     label: "🧩 Puzzle" },
        { id: "shooter",    label: "🔫 Shooter" },
        { id: "clicker",    label: "👆 Clicker" },
        { id: "sports",     label: "⚽ Sports" },
        { id: "arcade",     label: "👾 Arcade" },
        { id: "survival",   label: "☠️ Survival" },
        { id: "music",      label: "🎵 Music" },
        { id: "strategy",   label: "🧠 Strategy" },
        { id: "legacy",     label: "📦 Offline" },
    ];

    // ── Category map — name (lowercase) → category id(s) ────────────────────
    var CAT_MAP = {
        // Action / Fighting
        "1v1.lol":                      ["action","shooter"],
        "time shooter":                 ["action","shooter"],
        "time shooter 2":               ["action","shooter"],
        "time shooter 3":               ["action","shooter"],
        "getaway shootout":             ["action","shooter"],
        "rooftop snipers":              ["action","shooter"],
        "gladihoppers":                 ["action"],
        "friendly fire":                ["action","shooter"],
        "ninja vs evil corp":           ["action"],
        "doom":                         ["action","shooter"],
        "q1k3":                         ["action","shooter"],
        "radius raid":                  ["action","shooter"],
        "space huggers":                ["action","shooter"],
        "zombs royale":                 ["action","shooter"],
        "stickman survival":            ["action"],
        "stickman boost":               ["platformer","action"],
        "boxing random":                ["action","sports"],
        "gladihoppers":                 ["action"],
        "bowmasters":                   ["action"],
        "count masters stickman games": ["action"],
        "steal a brainrot":             ["action"],
        "steal a brainrot online":      ["action"],
        "bendy and the ink machine":    ["action"],
        "bloodmoney! (inappropriate 16+)": ["action"],

        // Racing / Driving
        "drift hunters":                ["racing"],
        "drift hunters (bennett)":      ["racing"],
        "drift boss":                   ["racing"],
        "moto x3m":                     ["racing"],
        "moto road rash 3d":            ["racing"],
        "top speed racing 3d":          ["racing"],
        "cool cars run 3d":             ["racing"],
        "crush cars 3d":                ["racing"],
        "crazy cars":                   ["racing"],
        "traffic racer":                ["racing"],
        "tanuki sunset":                ["racing"],
        "highway traffic":              ["racing"],
        "drive mad":                    ["racing"],
        "earn to die":                  ["racing","survival"],
        "hexgl":                        ["racing"],
        "racer":                        ["racing"],
        "scrap metal 3":                ["racing"],
        "madalin stunt cars 2":         ["racing"],
        "gopher kart":                  ["racing"],
        "merge round racers":           ["racing","puzzle"],
        "toy rider":                    ["racing"],

        // Platformer / Runner
        "run 3":                        ["platformer"],
        "run 3 (legacy)":               ["platformer","legacy"],
        "slope":                        ["platformer","arcade"],
        "slope 2":                      ["platformer","arcade"],
        "slope (legacy)":               ["platformer","legacy"],
        "vex 3":                        ["platformer"],
        "vex 4":                        ["platformer"],
        "vex 5":                        ["platformer"],
        "vex 6":                        ["platformer"],
        "ovo":                          ["platformer"],
        "ovo 2":                        ["platformer"],
        "geometry dash":                ["platformer","music"],
        "geometry dash (legacy)":       ["platformer","legacy"],
        "geometry dash web port":       ["platformer"],
        "geometry dash wasm":           ["platformer"],
        "stickman hook":                ["platformer"],
        "stickman hook (alt)":          ["platformer"],
        "stickman climb":               ["platformer"],
        "subway surfers":               ["platformer","arcade"],
        "subway surfers ny":            ["platformer","arcade"],
        "subway surfers singapore":     ["platformer","arcade"],
        "red ball 4":                   ["platformer"],
        "doodle jump":                  ["platformer","arcade"],
        "tomb of the mask":             ["platformer","arcade"],
        "cluster rush":                 ["platformer","action"],
        "death run 3d":                 ["platformer","action"],
        "captain callisto":             ["platformer"],
        "astray":                       ["platformer","puzzle"],
        "draw the hill":                ["platformer","puzzle"],
        "bridge race":                  ["platformer","racing"],
        "bottle jump 3d":               ["platformer","arcade"],
        "stack ball":                   ["platformer","arcade"],
        "makeover run":                 ["platformer"],
        "twerk race 3d":                ["platformer","racing"],
        "retro haunt":                  ["platformer"],
        "layers roll":                  ["platformer","arcade"],

        // Puzzle / Strategy
        "2048":                         ["puzzle"],
        "2048 (extra)":                 ["puzzle"],
        "chess":                        ["puzzle","strategy"],
        "chess (extra)":                ["puzzle","strategy"],
        "solitaire":                    ["puzzle","strategy"],
        "solitaire (extra)":            ["puzzle","strategy"],
        "little alchemy":               ["puzzle","strategy"],
        "wordle":                       ["puzzle"],
        "sudoku":                       ["puzzle","strategy"],
        "minesweeper (extra)":          ["puzzle","strategy"],
        "connect 3":                    ["puzzle"],
        "connect four":                 ["puzzle","strategy"],
        "break lock":                   ["puzzle"],
        "konnekt":                      ["puzzle"],
        "sudoku":                       ["puzzle"],
        "bubble shooter":               ["puzzle","arcade"],
        "mahjong":                      ["puzzle","strategy"],
        "checkers":                     ["puzzle","strategy"],
        "backgammon":                   ["puzzle","strategy"],
        "memory match":                 ["puzzle"],
        "factory balls forever":        ["puzzle"],
        "pack a bunchas":               ["puzzle"],
        "push back":                    ["puzzle"],
        "roadblocks":                   ["puzzle"],
        "assessment examination":       ["puzzle"],
        "riddle school 2":              ["puzzle"],
        "a dark room":                  ["puzzle","strategy"],
        "we become what we behold":     ["puzzle"],
        "sketchbook 04":                ["puzzle"],
        "chroma incident":              ["puzzle","platformer"],

        // Shooter / Space
        "space invaders":               ["shooter","arcade"],
        "space invaders (extra)":       ["shooter","arcade"],
        "asteroids":                    ["arcade","shooter"],
        "asteroids (extra)":            ["arcade","shooter"],
        "ascii space":                  ["shooter","arcade"],
        "radius raid":                  ["shooter","action"],
        "galaga":                       ["shooter","arcade"],
        "defender":                     ["shooter","arcade"],

        // Clicker / Idle
        "cookie clicker":               ["clicker"],
        "cookie clicker (legacy)":      ["clicker","legacy"],
        "clicker heroes":               ["clicker"],
        "csgo clicker":                 ["clicker"],
        "particle clicker":             ["clicker"],
        "trimps":                       ["clicker","strategy"],
        "space company":                ["clicker","strategy"],
        "monkey mart":                  ["clicker","strategy"],
        "grindcraft":                   ["clicker","strategy"],
        "caseoh's basics in eating and fast food": ["clicker","action"],

        // Sports
        "basket bros":                  ["sports"],
        "basket random":                ["sports"],
        "basketball legends":           ["sports"],
        "basketball stars":             ["sports"],
        "soccer random":                ["sports"],
        "retro bowl":                   ["sports"],
        "retro bowl (legacy)":          ["sports","legacy"],
        "stickman golf":                ["sports"],
        "tiny fishing":                 ["sports","clicker"],
        "webfishing":                   ["sports","clicker"],
        "badminton kings 3d":           ["sports"],
        "pong":                         ["sports","arcade"],

        // Arcade / Classic
        "flappy bird":                  ["arcade"],
        "flappy bird (bennett)":        ["arcade","legacy"],
        "flappy bird (extra)":          ["arcade"],
        "flappy 2048":                  ["arcade","puzzle"],
        "flappy plane":                 ["arcade"],
        "pac-man":                      ["arcade"],
        "pac-man (extra)":              ["arcade"],
        "snake":                        ["arcade"],
        "snake (extra)":                ["arcade"],
        "google snake":                 ["arcade"],
        "tetris":                       ["arcade","puzzle"],
        "tetris (extra)":               ["arcade","puzzle"],
        "breakout":                     ["arcade"],
        "breakout (extra)":             ["arcade"],
        "edge not found":               ["arcade"],
        "chrome dino":                  ["arcade"],
        "bounce back":                  ["arcade","platformer"],
        "black hole square":            ["arcade"],
        "hextris":                      ["arcade","puzzle"],
        "stack":                        ["arcade"],
        "cubefield":                    ["arcade"],
        "cubito mayhem":                ["arcade","action"],
        "tunnel rush":                  ["arcade"],
        "back country":                 ["arcade","racing"],
        "let's surf":                   ["arcade","sports"],
        "centipede":                    ["arcade","shooter"],
        "frogger":                      ["arcade"],
        "donkey kong":                  ["arcade","platformer"],
        "q*bert":                       ["arcade"],
        "zaxxon":                       ["arcade","shooter"],
        "dig dug":                      ["arcade"],
        "burger time":                  ["arcade"],
        "tom of the mask":              ["arcade","platformer"],
        "bitlife":                      ["strategy","clicker"],

        // Survival
        "minecraft":                    ["survival","legacy"],
        "hollow knight":                ["action","platformer","legacy"],
        "deepest sword":                ["action","survival"],

        // Music / Rhythm
        "friday night funkin'":         ["music","rhythm"],
        "sprunki":                      ["music"],

        // Strategy / Simulation
        "btd4":                         ["strategy"],
        "duck life":                    ["strategy","sports"],
        "duck life 2":                  ["strategy","sports"],
        "duck life 3":                  ["strategy","sports"],
        "duck life 4":                  ["strategy","sports"],
        "duck life 5":                  ["strategy","sports"],
        "learn to fly":                 ["strategy","arcade"],
        "flight simulator":             ["strategy","simulation"],
        "make a superboat":             ["strategy","arcade"],
        "om nom bounce":                ["puzzle","platformer"],

        // Legacy/Offline only extras
        "2040 (legacy)":                ["puzzle","legacy"],
        "bad parenting 1 (legacy)":     ["action","legacy"],
        "bad parenting 1":              ["action","legacy"],
        "bad piggies":                  ["puzzle","legacy"],
        "five nights at epstein's":     ["survival","legacy"],
        "the simpsons: hit & run":      ["action","racing"],
        "snow battle":                  ["action","strategy"],
        "sleeping beauty":              ["puzzle"],
        "paper.io":                     ["arcade","strategy"],
        "slither.io":                   ["arcade"],
        "r3":                           ["arcade"],
        "ritz":                         ["puzzle"],
        "shuttle deck":                 ["strategy"],
        "xx142b2.exe":                  ["arcade","action"],
        "friendly fire":                ["action","shooter"],
        "captain callisto":             ["platformer","action"],
        "stone grass mowing simulator": ["clicker"],
        "tower master":                 ["arcade","strategy"],
        "evil glitch":                  ["arcade","action"],
        "space garden":                 ["arcade","clicker"],
        "eggy car":                     ["arcade","racing"],
        "crossy road":                  ["arcade","platformer"],
        "crossy road (bennett)":        ["arcade","platformer"],
        "tic tac toe":                  ["puzzle","strategy"],
        "fruit ninja":                  ["arcade","action"],
        "cut the rope":                 ["puzzle"],
        "cut the rope holiday":         ["puzzle","legacy"],
        "cut the rope time travel":     ["puzzle","legacy"],
        "the maze of space goblins":    ["puzzle","action"],
        "world's hardest game 2":       ["platformer","puzzle"],
    };

    function getCats(name) {
        return CAT_MAP[name.toLowerCase()] || ["arcade"];
    }

    // ── Active state ──────────────────────────────────────────────────────────
    var activeCategory = "all";

    // ── Inject category tab bar above search container ───────────────────────
    function injectTabs() {
        var searchContainer = document.querySelector(".searchContainer");
        if (!searchContainer || document.getElementById("ws-cat-tabs")) return;

        var tabBar = document.createElement("div");
        tabBar.id = "ws-cat-tabs";
        tabBar.style.cssText = [
            "display:flex;overflow-x:auto;gap:6px;padding:12px 12px 4px;",
            "scrollbar-width:none;-ms-overflow-style:none;",
            "flex-shrink:0;",
        ].join("");
        tabBar.innerHTML = "<style>#ws-cat-tabs::-webkit-scrollbar{display:none}</style>";

        CATEGORIES.forEach(function (cat) {
            var btn = document.createElement("button");
            btn.dataset.cat = cat.id;
            btn.textContent = cat.label;
            btn.style.cssText = [
                "flex-shrink:0;padding:7px 14px;border-radius:20px;border:1px solid rgba(255,255,255,0.12);",
                "background:rgba(255,255,255,0.07);color:var(--text,#e2e8f0);",
                "font-size:12px;font-family:inherit;cursor:pointer;white-space:nowrap;",
                "transition:background .15s,border-color .15s;",
            ].join("");
            if (cat.id === "all") {
                btn.style.background = "var(--c1,#6366f1)";
                btn.style.borderColor = "var(--c1,#6366f1)";
                btn.style.color = "#fff";
            }
            btn.addEventListener("click", function () {
                activeCategory = cat.id;
                // Update button styles
                tabBar.querySelectorAll("button").forEach(function (b) {
                    if (b.dataset.cat === activeCategory) {
                        b.style.background = "var(--c1,#6366f1)";
                        b.style.borderColor = "var(--c1,#6366f1)";
                        b.style.color = "#fff";
                    } else {
                        b.style.background = "rgba(255,255,255,0.07)";
                        b.style.borderColor = "rgba(255,255,255,0.12)";
                        b.style.color = "var(--text,#e2e8f0)";
                    }
                });
                doFilter();
            });
            tabBar.appendChild(btn);
        });

        searchContainer.parentNode.insertBefore(tabBar, searchContainer);
    }

    // ── Filter logic (search + category combined) ────────────────────────────
    function doFilter() {
        var searchBar = document.getElementById("searchBar");
        var q = searchBar ? searchBar.value.trim().toLowerCase() : "";
        var clearBtn = document.getElementById("searchClearBtn");
        if (clearBtn) clearBtn.style.display = q ? "block" : "none";

        var cards = Array.from(document.querySelectorAll("#gamesGrid .ws-game-icon, #gamesGrid .gameCard"));
        var shown = 0;

        cards.forEach(function (card) {
            var name = (card.getAttribute("aria-label") || card.textContent || "").toLowerCase().trim();
            var matchesSearch = !q || name.includes(q);
            var matchesCat = activeCategory === "all";
            if (!matchesCat) {
                var cats = getCats(name);
                matchesCat = cats.indexOf(activeCategory) !== -1;
            }
            var visible = matchesSearch && matchesCat;
            card.style.display = visible ? "" : "none";
            if (visible) shown++;
        });

        var noResults = document.getElementById("searchNoResults");
        if (noResults) {
            noResults.style.display = ((q || activeCategory !== "all") && shown === 0) ? "block" : "none";
        }
    }

    // ── Boot on load ─────────────────────────────────────────────────────────
    window.addEventListener("load", function () {
        var searchBar = document.getElementById("searchBar");
        if (!searchBar) return;

        injectTabs();

        // Clear button
        var clearBtn = document.createElement("button");
        clearBtn.id = "searchClearBtn";
        clearBtn.textContent = "✕";
        clearBtn.style.cssText = "display:none;position:absolute;right:14px;top:50%;transform:translateY(-50%);background:none;border:none;color:rgba(255,255,255,0.4);cursor:pointer;font-size:16px;padding:0;line-height:1;";
        var wrap = searchBar.parentNode;
        if (wrap) {
            wrap.style.position = "relative";
            wrap.appendChild(clearBtn);
        }

        // No-results label
        var noResults = document.createElement("p");
        noResults.id = "searchNoResults";
        noResults.style.cssText = "display:none;text-align:center;opacity:0.5;font-size:13px;padding:20px;";
        noResults.textContent = "No games found";
        var grid = document.getElementById("gamesGrid");
        if (grid && grid.parentNode) grid.parentNode.insertBefore(noResults, grid.nextSibling);

        searchBar.addEventListener("input", doFilter);
        clearBtn.addEventListener("click", function () {
            searchBar.value = "";
            doFilter();
            searchBar.focus();
        });
    });

    // Expose for gamebuttons.js to call after rendering
    window.wsRefilter = doFilter;
})();
