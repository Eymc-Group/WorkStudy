/**
 * version-check.js — Offline update banner
 *
 * If the page is being served from a local file (file://) or a non-GitHub
 * domain, fetch the live version.json from GitHub Pages and compare it to
 * the bundled WORKSTUDY_VERSION constant below.  If they differ, show a
 * banner telling the user to download the latest zip.
 *
 * To update the offline version number after each release, bump
 * BUNDLED_VERSION here and also update version.json at the repo root.
 */
(function () {
    "use strict";

    // ── Bundled version (update this when packaging a new offline zip) ──────
    const BUNDLED_VERSION = "2.7.41";

    // Only run when offline (file://) or on a custom non-GitHub domain
    const host = location.hostname;
    const isOffline = location.protocol === "file:" ||
        (host && host !== "eymc-group.github.io" && !host.endsWith(".github.io"));

    if (!isOffline) return; // Live GitHub Pages users get updates automatically

    const LIVE_VERSION_URL =
        "https://eymc-group.github.io/WorkStudy/version.json";

    function semverGreater(a, b) {
        // Returns true if b > a  (new version available)
        const pa = a.split(".").map(Number);
        const pb = b.split(".").map(Number);
        for (let i = 0; i < 3; i++) {
            const na = pa[i] || 0, nb = pb[i] || 0;
            if (nb > na) return true;
            if (nb < na) return false;
        }
        return false;
    }

    function showBanner(liveVersion, downloadUrl) {
        const banner = document.getElementById("updateBanner");
        if (!banner) return;
        banner.style.display = "";
        banner.innerHTML =
            "⚠️ You are using an older offline version (<strong>" + BUNDLED_VERSION + "</strong>). " +
            "A newer version <strong>" + liveVersion + "</strong> is available! " +
            "<a href=\"" + downloadUrl + "\" target=\"_blank\" rel=\"noopener\">Download the latest zip →</a>";
    }

    async function checkVersion() {
        try {
            const res = await fetch(LIVE_VERSION_URL, { cache: "no-store" });
            if (!res.ok) return;
            const data = await res.json();
            if (data && data.version && semverGreater(BUNDLED_VERSION, data.version)) {
                showBanner(data.version, data.downloadUrl || LIVE_VERSION_URL.replace("version.json", ""));
            }
        } catch {
            // Silently fail — user might be truly offline
        }
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", checkVersion);
    } else {
        checkVersion();
    }
})();
