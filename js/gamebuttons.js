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
        "unblock me":   "https://play-lh.googleusercontent.com/TrO6e_nAHHLlFW2K5gWpVMuqNKAyJ1vYSEGIRV7qKZPK2rh2MR5x4VfElUNiEjHVrg=s256",

        // ── Additional game icons ─────────────────────────────────────────
        "doom":         "https://cdn.akamai.steamstatic.com/steam/apps/2280/header.jpg",
        "asteroids":    "https://upload.wikimedia.org/wikipedia/en/1/13/Asteroi1.png",
        "breakout":     "https://upload.wikimedia.org/wikipedia/en/8/80/Breakout_-_arcade_-_01.jpg",
        "pong":         "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Pong.png/280px-Pong.png",
        "centipede":    "https://upload.wikimedia.org/wikipedia/en/8/83/Centipede_arcade_game_flyer.png",
        "galaga":       "https://upload.wikimedia.org/wikipedia/en/1/14/Galaga.png",
        "frogger":      "https://upload.wikimedia.org/wikipedia/en/0/09/Frogger_game_arcade.png",
        "q*bert":       "https://upload.wikimedia.org/wikipedia/en/1/1e/Qbert.png",
        "defender":     "https://upload.wikimedia.org/wikipedia/en/5/5f/Defender_arcadeflyer.png",
        "dig dug":      "https://upload.wikimedia.org/wikipedia/en/1/14/Dig_Dug_flyer.png",
        "zaxxon":       "https://upload.wikimedia.org/wikipedia/en/8/88/Zaxxon_arcadeflyer.png",
        "burger time":  "https://upload.wikimedia.org/wikipedia/en/4/4d/BurgerTime_arcadeflyer.png",
        "space invaders":"https://upload.wikimedia.org/wikipedia/en/0/0f/Space_Invaders_flyer%2C_1978.jpg",
        "sudoku":       "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Sudoku_Puzzle_by_L2G-20050714_standardized_layout.svg/250px-Sudoku_Puzzle_by_L2G-20050714_standardized_layout.svg.png",
        "mahjong":      "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/MahjongTiles.jpg/320px-MahjongTiles.jpg",
        "battleship":   "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f4/Battleship_game_board.svg/320px-Battleship_game_board.svg.png",
        "checkers":     "https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Board_Game_Checkers.jpg/320px-Board_Game_Checkers.jpg",
        "backgammon":   "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Backgammon_lg.png/320px-Backgammon_lg.png",
        "tic tac toe":  "https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/Tic_tac_toe.svg/206px-Tic_tac_toe.svg.png",
        "connect four": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/Connect_Four.gif/220px-Connect_Four.gif",
        "doodle jump":  "https://play-lh.googleusercontent.com/0wFkQNPCXMqbTRqeVGSBGWMlSoUZb3CRrQZyB0vEMQiDh3Zp9AUjT7Q_gzrF7iAtHpc=s256",
        "crossy road":  "https://play-lh.googleusercontent.com/jX11nAJPv8dz8OQrEaYQ2wWMmj2HkyaOz5sLHfr36ZuKCz-Vz2Kh8SflOj-lIKd3Qkk=s256",
        "subway surfers":"https://play-lh.googleusercontent.com/g0BqeaKg6ZJqLOqwh9VBpZzpGQzWTkFbPK7ekFSiSyBKJOhbHdMGfT3JMrNdoNjIlS4=s256",
        "fruit ninja":  "https://play-lh.googleusercontent.com/bIdKfkBezSEMWJNnqj0lX_GxqfHaO2GxdPiYmq4c3LN5aR7E_i1gxGqo41weTz4D5Rg=s256",
        "slither.io":   "https://play-lh.googleusercontent.com/L5bM5nwMH8DWxjqL-tHJNgp3uBpPYCDqtK7u1Xm5H7oIaH_xf-Q5FqJqXIBqJD0KA=s256",
        "paper.io":     "https://play-lh.googleusercontent.com/aV3Pf_x0PVPCqmEzPIBqSGTr-mB7lmHiSdqL_v4qjjQ8V-zBw3v1hWvNGjJv2wPjCE=s256",
        "cut the rope": "https://cdn.akamai.steamstatic.com/steam/apps/386870/header.jpg",
        "moto x3m":     "https://img.gamedistribution.com/motox3m-thumb.jpg",
        "drift hunters": "https://img.gamedistribution.com/drifthunters-thumb.jpg",
        "drive mad":    "https://img.gamedistribution.com/drivemad.jpg",
        "earn to die":  "https://img.gamedistribution.com/earntodie.jpg",
        "cluster rush": "https://img.gamedistribution.com/clusterrush.jpg",
        "getaway shootout":"https://img.gamedistribution.com/getawayshootout.jpg",
        "rooftop snipers":"https://img.gamedistribution.com/rooftopsnipers.jpg",
        "basketball legends":"https://img.gamedistribution.com/basketballlegends.jpg",
        "basketball stars":"https://img.gamedistribution.com/basketballstars.jpg",
        "stickman hook":"https://play-lh.googleusercontent.com/MBYTl6NMRXRxC8d2m5cGVKPpXMfTtJk3H08u1KCYktPnpEZ1GYrZmhxE5i2KjYxFlE=s256",
        "tomb of the mask":"https://play-lh.googleusercontent.com/0q4Mn5mPYF7EvvALv3-WzjwG5eQg0mIRTF7q1QIRcNqjv2yOXJqCJk7zPKLQ8T_VFw=s256",
        "tiny fishing": "https://www.coolmathgames.com/sites/default/files/tiny-fishing.jpg",
        "tunnel rush":  "https://www.coolmathgames.com/sites/default/files/tunnelrush.jpg",
        "vex 3":        "https://img.gamedistribution.com/vex3.jpg",
        "vex 4":        "https://img.gamedistribution.com/vex4.jpg",
        "vex 5":        "https://img.gamedistribution.com/vex5.jpg",
        "vex 6":        "https://img.gamedistribution.com/vex6.jpg",
        "ovo":          "https://img.gamedistribution.com/ovo.jpg",
        "red ball":     "https://img.gamedistribution.com/redball4.jpg",
        "time shooter": "https://img.gamedistribution.com/timeshooter.jpg",
        "eggy car":     "https://img.gamedistribution.com/eggycar.jpg",
        "monkey mart":  "https://img.gamedistribution.com/monkeymart.jpg",
        "soccer random":"https://img.gamedistribution.com/soccerrandom.jpg",
        "boxing random":"https://img.gamedistribution.com/boxingrandom.jpg",
        "basket random":"https://img.gamedistribution.com/basketrandom.jpg",
        "snow battle":  "https://img.gamedistribution.com/snowbattle.jpg",
        "gladihoppers": "https://img.gamedistribution.com/gladihoppers.jpg",
        "little alchemy":"https://www.coolmathgames.com/sites/default/files/littlealchemy.jpg",
        "trimps":       "https://img.itch.zone/aW1nLzIyMDI1NzkucG5n/315x250%23c/MaW2YG.png",
        "particle clicker":"https://img.itch.zone/aW1nLzUxODExMi5wbmc=/315x250%23c/0N7G2l.png",
        "space company":"https://img.itch.zone/aW1nLzIzNDc0ODYucG5n/315x250%23c/5Lk3J9.png",
        "a dark room":  "https://img.itch.zone/aW1nLzUxOTIwMS5wbmc=/315x250%23c/NkWfXB.png",
        "madalin stunt cars":"https://img.gamedistribution.com/madalinstuntcars2.jpg",
        "highway traffic":"https://img.gamedistribution.com/highwaytraffic.jpg",
        "traffic racer":"https://play-lh.googleusercontent.com/f4N8LX7nB0E7RNlJJz8QVwvBqH3nqOYbJn_lPpjvQ0mG5AKqNjECCpw2XqR8FAlJL1Q=s256",
        "drift boss":   "https://img.gamedistribution.com/driftboss.jpg",
        "tanuki sunset":"https://img.itch.zone/aW1nLzUxODI0NDcucG5n/315x250%23c/YFb0m2.png",
        "flappy plane": "https://img.gamedistribution.com/flappyplane.jpg",
        "zombs royale": "https://play-lh.googleusercontent.com/YHqjJJEZ-TvvmMD3hJmR_MzKkgQpOUzb_jHFvWpfXwqIhqKH3bJgj-BtEFwlkEH3Bc0=s256",
        "stack":        "https://play-lh.googleusercontent.com/X8R-5bxFbXCt8lD8RlxUdJg_pL5GBiOxJHtQ9hKRDv8mfE_eGCkPfzq1-9Y5CuBHHKE=s256",
        "stack ball":   "https://play-lh.googleusercontent.com/d8_mFY4j-H7f9M5Hb5XoxN9DKaQ7fJOFZDFgW4eDL9MrRBJiMQr5VaFmhc1WFEF8GQ=s256",
        "draw the hill":"https://img.gamedistribution.com/drawthehill.jpg",
        "bridge race":  "https://play-lh.googleusercontent.com/fFmKLq9kAvVYJJZ7Qn_9yN2RNFK7UrGY-WMF7W6t6pf_kePJzFGHLPFT93fqf7T1O0=s256",
        "bubble shooter":"https://img.gamedistribution.com/bubbleshooter.jpg",
        "hexgl":        "https://img.itch.zone/aW1nLzU1NDcwMjMucG5n/315x250%23c/KDVL4k.png",
        "flight simulator":"https://cdn.akamai.steamstatic.com/steam/apps/1250410/header.jpg",
        "bowmasters":   "https://play-lh.googleusercontent.com/Pl53gEGbKlumWQAHlL8IVfGtc5D-6ZGFuCBV4a2OLrBWq2kM7Q5h7VRXxVJg_dW0_A=s256",
        "count masters":"https://play-lh.googleusercontent.com/wQDBw3n-AXVjT1gWOKMZ3Hm6C1VK5RlGoBpF1qJiW1PBPpkGPRWb3aNWMsI3MLUA9LA=s256",
        "twerk race":   "https://play-lh.googleusercontent.com/5KPfB7JnmHFYEHfgBpw8YxDFjcLu0GRJM8kLy3r9e6hYhY0F0Qi4KbJmN3cJhBLu4A=s256",
        "makeover run": "https://play-lh.googleusercontent.com/JD-JJlh3IQZvl72nBr1gHTr5fFBrSFrZVfGgVCe3uV0wJGpamMuqXsJFaFaEtZmfNvI=s256",
        "cool cars run":"https://play-lh.googleusercontent.com/sQEtSXLvQUxBSgmUoKnzHTSX6kTqhW_vKD7wDRzZlwgGHHisBBJRfMUxbgLvLJk-Jg=s256",
        "crush cars":   "https://play-lh.googleusercontent.com/VUDqDfaJW4HB6gQRaJo1hbkB7E5-oDUVH5jlFXKx8KQPR5ixXHCe9jGQH9sL6hqJqg=s256",
        "moto road rash":"https://play-lh.googleusercontent.com/jJqHzRQhqo-C4P4pAYbLK7pFVSwnO_nJHsnjJKlFwl1a1KhsGAuPeX7dQlVbwExVB0M=s256",
        "top speed racing":"https://play-lh.googleusercontent.com/d6p0D6AFNDXoZJGvbAuWJbSqQlR75FKQHVaKWQ1LXYQ9WNhiAqMH0Yf1yW0t6mV9NA=s256",
        "riddle school": "https://img.newgrounds.com/portal/entries/59b/59b1bb17c3a23.gif",
        "we become what we behold": "https://img.itch.zone/aW1nLzMwMDkxMy5wbmc=/315x250%23c/jT8X7h.png",
        "xx142":        "https://img.itch.zone/aW1nLzU3MDQxMzIucG5n/315x250%23c/ZVqv4b.png",
        "webfishing":   "https://cdn.akamai.steamstatic.com/steam/apps/3146520/header.jpg",
        "sprunki":      "https://img.itch.zone/aW1nLzE4NzU0MzgucG5n/315x250%23c/Nk4L1X.png",
        "steal a brainrot":"https://img.itch.zone/aW1nLzIwODkxNTYucG5n/315x250%23c/LDQr3m.png",
        "five nights at epstein": "https://img.itch.zone/aW1nLzMwMTQ1MC5wbmc=/315x250%23c/vCRQ7E.png",
        "caseoh":       "https://img.itch.zone/aW1nLzMwMTQ1MC5wbmc=/315x250%23c/vCRQ7E.png",
        "stickman boost":"https://img.gamedistribution.com/stickmanboost.jpg",
        "stickman golf":"https://play-lh.googleusercontent.com/JvFGv7GNBjK_qh8e1lQWn-mELuDFn-KgY7Z6PdJTN4z7MG45XYIZ9Oq3PMuFjhGz-Q=s256",
        "stickman climb":"https://img.gamedistribution.com/stickmanclimb.jpg",
        "stickman survival":"https://img.gamedistribution.com/stickmansurvivor.jpg",
        "ninja":        "https://img.gamedistribution.com/ninja.jpg",
        "tower master": "https://play-lh.googleusercontent.com/sKaFiEpFkzGtAKFopXB-0GGfIxGM0xh-J7i5jTqkHZ-GqIVB7K4c-ZoQfVX_4N2d-g=s256",
        "toy rider":    "https://img.gamedistribution.com/toyrider.jpg",
        "make a superboat":"https://img.gamedistribution.com/superboat.jpg",
        "merge round":  "https://play-lh.googleusercontent.com/5FRnpmrCqQjrxAn7DsR6BqFpG8DL1VGpVS3kFJGYZ5t4OwJ9Z0dK8oX-vBJDU8K7YQ=s256",
        "pack a bunchas":"https://img.itch.zone/aW1nLzU4NDM4OTAucG5n/315x250%23c/NvxK%2Bc.png",
        "factory balls":"https://img.gamedistribution.com/factoryballs.jpg",
        "memory match": "https://img.gamedistribution.com/memorymatch.jpg",
        "connect 3":    "https://img.gamedistribution.com/connect3.jpg",
        "hextris":      "https://img.itch.zone/aW1nLzUxODI0NDcucG5n/315x250%23c/YFb0m2.png",
        "cubefield":    "https://www.coolmathgames.com/sites/default/files/cubefield.jpg",
        "black hole":   "https://img.gamedistribution.com/blackholesquare.jpg",
        "gopher kart":  "https://img.gamedistribution.com/gopherkart.jpg",
        "bounce back":  "https://img.gamedistribution.com/bounceback.jpg",
        "break lock":   "https://play-lh.googleusercontent.com/jkLPJvW0BZ3GqQJ3n9FRf4BPW9Z5D3g4jJBqkBSqEhTr3jRe4v2SZlHEqNHmHlxKoA=s256",
        "om nom bounce":"https://play-lh.googleusercontent.com/Rxx3GUAk-cSdLR5aGj_cBIiXIYt6B4LBYXZoJw3s3XC9jrW_CRm5HG5_yRPbJMp9=s256",
        "layers roll":  "https://img.gamedistribution.com/layersroll.jpg",
        "konnekt":      "https://img.gamedistribution.com/konnekt.jpg",
        "push back":    "https://img.gamedistribution.com/pushback.jpg",
        "bad piggies":  "https://cdn.akamai.steamstatic.com/steam/apps/907380/header.jpg",
        "scrap metal":  "https://img.gamedistribution.com/scrapmetal3.jpg",
        "roadblocks":   "https://img.gamedistribution.com/roadblocks.jpg",
        "space huggers":"https://img.itch.zone/aW1nLzUxODExMi5wbmc=/315x250%23c/0N7G2l.png",
        "radius raid":  "https://img.itch.zone/aW1nLzUxODI0NDcucG5n/315x250%23c/YFb0m2.png",
        "q1k3":         "https://img.itch.zone/aW1nLzUxODI0NDcucG5n/315x250%23c/YFb0m2.png",
        "r3":           "https://img.itch.zone/aW1nLzUxODI0NDcucG5n/315x250%23c/YFb0m2.png",
        "sleep":        "https://img.gamedistribution.com/sleepingbeauty.jpg",
        "evil glitch":  "https://img.itch.zone/aW1nLzUxOTIwMS5wbmc=/315x250%23c/NkWfXB.png",
        "chroma incident":"https://img.itch.zone/aW1nLzUxOTIwMS5wbmc=/315x250%23c/NkWfXB.png",
        "astray":       "https://img.itch.zone/aW1nLzUxOTIwMS5wbmc=/315x250%23c/NkWfXB.png",
        "friendly fire":"https://img.itch.zone/aW1nLzUxODI0NDcucG5n/315x250%23c/YFb0m2.png",
        "captain callisto":"https://img.itch.zone/aW1nLzUxODExMi5wbmc=/315x250%23c/0N7G2l.png",
        "world's hardest game":"https://www.coolmathgames.com/sites/default/files/worldshardestgame.jpg",
        "flappy 2048":  "https://img.gamedistribution.com/flappy2048.jpg",
        "google snake":  "https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Nokia_6110_Snake_Game.png/320px-Nokia_6110_Snake_Game.png",
        "space garden":  "https://img.itch.zone/aW1nLzUxODExMi5wbmc=/315x250%23c/0N7G2l.png",
        "hex":           "https://img.itch.zone/aW1nLzUxODI0NDcucG5n/315x250%23c/YFb0m2.png",
        "let's surf":    "https://img.gamedistribution.com/letssurf.jpg",
        "shuttle deck":  "https://img.itch.zone/aW1nLzUxODExMi5wbmc=/315x250%23c/0N7G2l.png",
        "stone grass":   "https://play-lh.googleusercontent.com/0q4Mn5mPYF7EvvALv3-WzjwG5eQg0mIRTF7q1QIRcNqjv2yOXJqCJk7zPKLQ8T_VFw=s256",
        "sketchbook":    "https://img.itch.zone/aW1nLzUxOTIwMS5wbmc=/315x250%23c/NkWfXB.png",
        "maze of space": "https://img.itch.zone/aW1nLzUxODExMi5wbmc=/315x250%23c/0N7G2l.png",
        "2040":          "https://img.gamedistribution.com/2048.jpg",
        "back country":  "https://img.itch.zone/aW1nLzUxODI0NDcucG5n/315x250%23c/YFb0m2.png",
        "ascii space":   "https://img.itch.zone/aW1nLzUxODExMi5wbmc=/315x250%23c/0N7G2l.png",
        "ritz":          "https://img.itch.zone/aW1nLzUxODI0NDcucG5n/315x250%23c/YFb0m2.png",
        "cubito mayhem": "https://img.itch.zone/aW1nLzUxODExMi5wbmc=/315x250%23c/0N7G2l.png",
        "edge not found":"https://img.gamedistribution.com/edgenotfound.jpg",
        "deepest sword": "https://img.itch.zone/aW1nLzU4NDM4OTAucG5n/315x250%23c/NvxK%2Bc.png",
        "sketchbook 04": "https://img.itch.zone/aW1nLzUxOTIwMS5wbmc=/315x250%23c/NkWfXB.png",
        "retro haunt":   "https://img.itch.zone/aW1nLzU4NDM4OTAucG5n/315x250%23c/NvxK%2Bc.png",

        // ── Extra/Legacy/Variant entries ──────────────────────────────────
        "csgo clicker":  "https://cdn.akamai.steamstatic.com/steam/apps/730/header.jpg",
        "grindcraft":    "https://img.gamedistribution.com/grindcraft.jpg",
        "bottle jump 3d":"https://play-lh.googleusercontent.com/8dNdNLZx9EJvdJdHQELCkxK91DRgNm1JYMXnq5tXjYU1z2YBKqvUxJPvJ3V8Wk5EJg=s256",
        "bad parenting 1":"https://img.newgrounds.com/portal/entries/59b/59b1bb17c3a23.gif",
        "bad parenting":  "https://img.newgrounds.com/portal/entries/59b/59b1bb17c3a23.gif",
        "assessment examination": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/Tic_tac_toe.svg/206px-Tic_tac_toe.svg.png",
        "five nights at epstein's": "https://img.itch.zone/aW1nLzMwMTQ1MC5wbmc=/315x250%23c/vCRQ7E.png",
        "caseoh's basics in eating and fast food": "https://img.itch.zone/aW1nLzMwMTQ1MC5wbmc=/315x250%23c/vCRQ7E.png",
        "steal a brainrot online": "https://img.itch.zone/aW1nLzIwODkxNTYucG5n/315x250%23c/LDQr3m.png",
        "xx142b2.exe":   "https://img.itch.zone/aW1nLzU3MDQxMzIucG5n/315x250%23c/ZVqv4b.png",
        "flappy 2048":   "https://img.gamedistribution.com/2048.jpg",
        "ninja vs evil corp": "https://img.gamedistribution.com/ninja.jpg",
        "ovo 2":         "https://img.gamedistribution.com/ovo.jpg",
        "slope 2":       "https://img.itch.zone/aW1nLzU4NDM4OTAucG5n/315x250%23c/NvxK%2Bc.png",
        "death run 3d":  "https://img.gamedistribution.com/deathrun3d.jpg",
        "drift":         "https://img.gamedistribution.com/driftboss.jpg",
        "red ball 4":    "https://img.gamedistribution.com/redball4.jpg",
        "racer":         "https://img.gamedistribution.com/drifthunters-thumb.jpg",
        "time shooter 2":"https://img.gamedistribution.com/timeshooter.jpg",
        "time shooter 3":"https://img.gamedistribution.com/timeshooter.jpg",
        "sleeping beauty":"https://img.itch.zone/aW1nLzUxODI0NDcucG5n/315x250%23c/YFb0m2.png",
        "stickman hook (alt)": "https://play-lh.googleusercontent.com/MBYTl6NMRXRxC8d2m5cGVKPpXMfTtJk3H08u1KCYktPnpEZ1GYrZmhxE5i2KjYxFlE=s256",
        "subway surfers ny": "https://play-lh.googleusercontent.com/g0BqeaKg6ZJqLOqwh9VBpZzpGQzWTkFbPK7ekFSiSyBKJOhbHdMGfT3JMrNdoNjIlS4=s256",
        "subway surfers singapore": "https://play-lh.googleusercontent.com/g0BqeaKg6ZJqLOqwh9VBpZzpGQzWTkFbPK7ekFSiSyBKJOhbHdMGfT3JMrNdoNjIlS4=s256",
        "crossy road (bennett)": "https://play-lh.googleusercontent.com/jX11nAJPv8dz8OQrEaYQ2wWMmj2HkyaOz5sLHfr36ZuKCz-Vz2Kh8SflOj-lIKd3Qkk=s256",
        "flappy bird (bennett)": "https://upload.wikimedia.org/wikipedia/en/0/0a/Flappy_bird_nes.jpg",
        "drift hunters (bennett)": "https://img.gamedistribution.com/drifthunters-thumb.jpg",
        "scrap metal 3": "https://img.gamedistribution.com/scrapmetal3.jpg",
        "moto road rash 3d": "https://play-lh.googleusercontent.com/jJqHzRQhqo-C4P4pAYbLK7pFVSwnO_nJHsnjJKlFwl1a1KhsGAuPeX7dQlVbwExVB0M=s256",
        "cool cars run 3d": "https://play-lh.googleusercontent.com/sQEtSXLvQUxBSgmUoKnzHTSX6kTqhW_vKD7wDRzZlwgGHHisBBJRfMUxbgLvLJk-Jg=s256",
        "count masters stickman games": "https://play-lh.googleusercontent.com/wQDBw3n-AXVjT1gWOKMZ3Hm6C1VK5RlGoBpF1qJiW1PBPpkGPRWb3aNWMsI3MLUA9LA=s256",
        "crush cars 3d": "https://play-lh.googleusercontent.com/VUDqDfaJW4HB6gQRaJo1hbkB7E5-oDUVH5jlFXKx8KQPR5ixXHCe9jGQH9sL6hqJqg=s256",
        "twerk race 3d": "https://play-lh.googleusercontent.com/5KPfB7JnmHFYEHfgBpw8YxDFjcLu0GRJM8kLy3r9e6hYhY0F0Qi4KbJmN3cJhBLu4A=s256",
        "top speed racing 3d": "https://play-lh.googleusercontent.com/d6p0D6AFNDXoZJGvbAuWJbSqQlR75FKQHVaKWQ1LXYQ9WNhiAqMH0Yf1yW0t6mV9NA=s256",
        "riddle school 2": "https://img.newgrounds.com/portal/entries/59b/59b1bb17c3a23.gif",
        "merge round racers": "https://play-lh.googleusercontent.com/5FRnpmrCqQjrxAn7DsR6BqFpG8DL1VGpVS3kFJGYZ5t4OwJ9Z0dK8oX-vBJDU8K7YQ=s256",
        "the simpsons: hit & run": "https://upload.wikimedia.org/wikipedia/en/2/26/Simpsons_Hit_and_Run.jpg",
        "friday night funkin'": "https://img.itch.zone/aW1nLzUxOTEzOTkucG5n/315x250%23c/YwVSTG.png",
        "bendy and the ink machine": "https://cdn.akamai.steamstatic.com/steam/apps/622650/header.jpg",
        "cut the rope holiday": "https://cdn.akamai.steamstatic.com/steam/apps/386870/header.jpg",
        "cut the rope time travel": "https://cdn.akamai.steamstatic.com/steam/apps/386870/header.jpg",
        "fireboy & watergirl": "https://img.gamedistribution.com/dba38b31ce8a4cd7b9e5a516e72c68e5.jpg",
        "stickman stickman stickman": "https://img.gamedistribution.com/stickmanboost.jpg",
        "stone grass mowing simulator": "https://play-lh.googleusercontent.com/0q4Mn5mPYF7EvvALv3-WzjwG5eQg0mIRTF7q1QIRcNqjv2yOXJqCJk7zPKLQ8T_VFw=s256",
        "the maze of space goblins": "https://img.itch.zone/aW1nLzUxODExMi5wbmc=/315x250%23c/0N7G2l.png",
        "madalin stunt cars 2": "https://img.gamedistribution.com/madalinstuntcars2.jpg"
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
            wsTrackRecentlyPlayed(game);
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

    // ── Recently Played ───────────────────────────────────────────────────
    var WS_RP_KEY  = "ws-recently-played";
    var WS_RP_MAX  = 10;
    var WS_CACHE   = "workstudy-v3.2.9.52";

    function wsGetRecent() {
        try { return JSON.parse(localStorage.getItem(WS_RP_KEY) || "[]"); } catch(e) { return []; }
    }

    function wsTrackRecentlyPlayed(game) {
        try {
            var list = wsGetRecent();
            // Remove existing entry for this game
            list = list.filter(function(g) { return g.name !== game.name; });
            // Prepend
            list.unshift({ name: game.name, author: game.author || "", path: game.path });
            // Keep only last MAX
            if (list.length > WS_RP_MAX) list = list.slice(0, WS_RP_MAX);
            localStorage.setItem(WS_RP_KEY, JSON.stringify(list));
            // Cache the game HTML for offline play (only relative paths / same origin)
            wsCacheGamePath(game.path);
            // Refresh the recently played row
            wsRenderRecentlyPlayed();
        } catch(e) {}
    }

    function wsCacheGamePath(path) {
        // Only cache paths that are on the same origin (relative or eymc-group.github.io)
        if (!path) return;
        var isSameOrigin = path.startsWith("../") ||
                           path.startsWith("/") ||
                           path.indexOf("eymc-group.github.io") !== -1;
        if (!isSameOrigin) return;
        // Resolve relative path to absolute URL
        var url = path;
        if (path.startsWith("../")) {
            url = location.origin + "/WorkStudy/games/" + path.replace(/^\.\.\//,"");
        }
        try {
            if ("caches" in window) {
                caches.open(WS_CACHE).then(function(cache) {
                    cache.add(url).catch(function() {});
                }).catch(function() {});
            }
        } catch(e) {}
    }

    function wsRenderRecentlyPlayed() {
        var list = wsGetRecent();
        var container = document.getElementById("ws-recently-played");
        if (!container) return;

        if (!list.length) {
            container.style.display = "none";
            return;
        }
        container.style.display = "";

        // Header
        var header = container.querySelector(".ws-rp-header");
        if (!header) {
            header = document.createElement("div");
            header.className = "ws-rp-header";
            header.style.cssText = "display:flex;align-items:center;justify-content:space-between;padding:4px 12px 8px;";
            header.innerHTML = '<span style="font-size:14px;font-weight:600;opacity:.85;">🕹️ Recently Played</span>' +
                '<button onclick="wsRecentlyClear()" style="background:none;border:none;color:rgba(255,255,255,.35);cursor:pointer;font-size:11px;font-family:inherit;">Clear</button>';
            container.insertBefore(header, container.firstChild);
        }

        // Grid row
        var row = container.querySelector(".ws-rp-row");
        if (!row) {
            row = document.createElement("div");
            row.className = "ws-rp-row ws-ios-grid";
            row.style.cssText = "display:flex;flex-wrap:nowrap;overflow-x:auto;gap:16px 8px;padding:4px 12px 12px;scrollbar-width:none;-ms-overflow-style:none;";
            row.innerHTML = "<style>.ws-rp-row::-webkit-scrollbar{display:none}</style>";
            container.appendChild(row);
        }
        // Re-render cards
        var cards = row.querySelectorAll(".ws-game-icon");
        // Simple re-render: clear and rebuild
        while (row.lastChild && row.lastChild.classList && row.lastChild.classList.contains("ws-game-icon")) {
            row.removeChild(row.lastChild);
        }
        // Remove all ws-game-icon children
        Array.from(row.querySelectorAll(".ws-game-icon")).forEach(function(c) { row.removeChild(c); });

        list.forEach(function(g) {
            var card = buildCard(g);
            row.appendChild(card);
        });
    }

    window.wsRecentlyClear = function() {
        try { localStorage.removeItem(WS_RP_KEY); } catch(e) {}
        wsRenderRecentlyPlayed();
    };

    // ── Render ────────────────────────────────────────────────────────────
    window.addEventListener("load", function () {
        var grid = document.getElementById("gamesGrid");
        if (!grid || typeof games === "undefined") return;
        injectStyles();
        grid.classList.add("ws-ios-grid");
        games.forEach(function(game) { grid.appendChild(buildCard(game)); });
        // Render recently played row (if container exists in HTML)
        wsRenderRecentlyPlayed();
        // Re-apply any active search/category filter after grid is populated
        if (typeof window.wsRefilter === "function") window.wsRefilter();
    });

    // Expose track function globally
    window.wsTrackRecentlyPlayed = wsTrackRecentlyPlayed;
})();
