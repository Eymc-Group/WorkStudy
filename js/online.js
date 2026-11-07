(function () {
    "use strict";

    const API = "https://workstudy-api.354271744.workers.dev";

    function getSessionId() {
        try {
            let sid = sessionStorage.getItem("ws-sid");
            if (!sid) {
                const bytes = new Uint8Array(8);
                crypto.getRandomValues(bytes);
                sid = Array.from(bytes).map(b => b.toString(16).padStart(2, "0")).join("");
                sessionStorage.setItem("ws-sid", sid);
            }
            return sid;
        } catch { return "fallback" + Math.random().toString(36).slice(2, 10); }
    }

    function getToken() {
        try { return localStorage.getItem("workstudy-token"); } catch { return null; }
    }

    function getGamesPlayed() {
        try { return parseInt(localStorage.getItem("ws-games-played"), 10) || 0; } catch { return 0; }
    }

    function setOnlineCount(count) {
        const el = document.getElementById("onlineUsers");
        if (el) el.textContent = "🟢 " + count + " online";
    }

    const sessionId = getSessionId();
    let minutesOnSite = 0;
    let firstPing = true;

    async function ping() {
        minutesOnSite++;
        const token = getToken();
        const headers = { "Content-Type": "application/json" };
        if (token) headers["Authorization"] = "Bearer " + token;
        try {
            const res = await fetch(API + "/stats/ping", {
                method: "POST",
                headers,
                body: JSON.stringify({ sessionId, minutesOnSite, gamesPlayed: getGamesPlayed() })
            });
            if (res.ok) {
                const data = await res.json();
                if (firstPing && typeof data.count === "number") {
                    setOnlineCount(data.count);
                    firstPing = false;
                }
            }
        } catch {}
    }

    async function pollCount() {
        try {
            const res = await fetch(API + "/online/count");
            if (res.ok) {
                const data = await res.json();
                if (typeof data.count === "number") setOnlineCount(data.count);
            }
        } catch {}
    }

    async function recordVisit() {
        const token = getToken();
        const headers = { "Content-Type": "application/json" };
        if (token) headers["Authorization"] = "Bearer " + token;
        try {
            await fetch(API + "/stats/visit", {
                method: "POST",
                headers,
                body: JSON.stringify({ sessionId })
            });
        } catch {}
    }

    // Initial ping immediately, then every 60s
    ping();
    setInterval(ping, 60000);

    // Poll count every 30s
    pollCount();
    setInterval(pollCount, 30000);

    // Record visit after 2s delay (not a bounce)
    setTimeout(recordVisit, 2000);
})();
