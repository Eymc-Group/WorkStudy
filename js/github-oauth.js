(function () {
    "use strict";

    const API = "https://workstudy-api.354271744.workers.dev";

    function getToken() {
        return localStorage.getItem("workstudy-token") || null;
    }

    function startLink() {
        const token = getToken();
        if (token) sessionStorage.setItem("gh-link-token", token);
        sessionStorage.setItem("gh-oauth-intent", "link");
        window.location.href = API + "/auth/github?intent=link";
    }

    async function unlink() {
        const token = getToken();
        if (!token) { console.warn("WorkStudyGitHub.unlink: not logged in"); return; }

        const res  = await fetch(API + "/auth/github/unlink", {
            method: "POST",
            headers: { "Content-Type": "application/json", "Authorization": "Bearer " + token }
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok || !data.success) throw new Error(data.message || "Unlink failed.");
        return data;
    }

    async function checkStatus() {
        const token = getToken();
        if (!token) return null;
        try {
            const res  = await fetch(API + "/auth/github/status", {
                headers: { "Authorization": "Bearer " + token }
            });
            const data = await res.json().catch(() => ({}));
            return res.ok ? data : null;
        } catch { return null; }
    }

    function applyStatus(linked) {
        const linkBtn   = document.getElementById("githubLinkBtn");
        const unlinkBtn = document.getElementById("githubUnlinkBtn");
        const statusEl  = document.getElementById("githubStatus");

        if (linkBtn)   linkBtn.style.display   = linked ? "none" : "";
        if (unlinkBtn) unlinkBtn.style.display = linked ? ""     : "none";
        if (statusEl)  statusEl.textContent    = linked ? "✅ GitHub linked" : "";
    }

    function refresh() {
        checkStatus().then(function (status) {
            applyStatus(status && status.githubLinked);
        });
    }

    function wireButtons() {
        const linkBtn   = document.getElementById("githubLinkBtn");
        const unlinkBtn = document.getElementById("githubUnlinkBtn");

        if (linkBtn) {
            linkBtn.addEventListener("click", startLink);
        }

        if (unlinkBtn) {
            unlinkBtn.addEventListener("click", async function () {
                unlinkBtn.disabled = true;
                try {
                    await unlink();
                    applyStatus(false);
                } catch (err) {
                    alert(err.message || "Failed to unlink GitHub.");
                } finally {
                    unlinkBtn.disabled = false;
                }
            });
        }

        // Run status check now; also watch for auth.js showing the logged-in view
        // by observing the loggedInView element becoming visible.
        refresh();

        const loggedInView = document.getElementById("loggedInView");
        if (loggedInView && window.MutationObserver) {
            const observer = new MutationObserver(function () {
                if (loggedInView.style.display !== "none") {
                    refresh();
                }
            });
            observer.observe(loggedInView, { attributes: true, attributeFilter: ["style"] });
        }
    }

    window.WorkStudyGitHub = { startLink, unlink, checkStatus, refresh };

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", wireButtons);
    } else {
        wireButtons();
    }

})();
