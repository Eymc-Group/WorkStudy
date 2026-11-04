(function () {
    "use strict";

    const API = "https://workstudy-api.354271744.workers.dev";

    function getToken() {
        return localStorage.getItem("workstudy-token") || null;
    }

    function startLink() {
        const token = getToken();
        if (token) {
            sessionStorage.setItem("gh-link-token", token);
        }
        sessionStorage.setItem("gh-oauth-intent", "link");
        window.location.href = API + "/auth/github?intent=link";
    }

    async function unlink() {
        const token = getToken();
        if (!token) {
            console.warn("WorkStudyGitHub.unlink: not logged in");
            return;
        }

        try {
            const res = await fetch(API + "/auth/github/unlink", {
                method: "POST",
                headers: {
                    "Content-Type":  "application/json",
                    "Authorization": "Bearer " + token
                }
            });

            const data = await res.json().catch(() => ({}));

            if (!res.ok || !data.success) {
                throw new Error(data.message || "Unlink failed.");
            }

            return data;

        } catch (err) {
            console.error("WorkStudyGitHub.unlink failed:", err);
            throw err;
        }
    }

    async function checkStatus() {
        const token = getToken();
        if (!token) return null;

        try {
            const res = await fetch(API + "/auth/github/status", {
                headers: { "Authorization": "Bearer " + token }
            });

            const data = await res.json().catch(() => ({}));
            return res.ok ? data : null;

        } catch {
            return null;
        }
    }

    function wireButtons() {
        const linkBtn   = document.getElementById("githubLinkBtn");
        const unlinkBtn = document.getElementById("githubUnlinkBtn");

        // Show/hide based on current link status
        checkStatus().then(function (status) {
            const linked = status && status.linked;

            if (linkBtn)   linkBtn.style.display   = linked ? "none"  : "";
            if (unlinkBtn) unlinkBtn.style.display = linked ? ""      : "none";
        });

        if (linkBtn) {
            linkBtn.addEventListener("click", function () {
                startLink();
            });
        }

        if (unlinkBtn) {
            unlinkBtn.addEventListener("click", async function () {
                unlinkBtn.disabled = true;
                try {
                    await unlink();
                    if (linkBtn)   linkBtn.style.display   = "";
                    if (unlinkBtn) unlinkBtn.style.display = "none";
                } catch (err) {
                    alert(err.message || "Failed to unlink GitHub.");
                } finally {
                    unlinkBtn.disabled = false;
                }
            });
        }
    }

    window.WorkStudyGitHub = { startLink, unlink, checkStatus };

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", wireButtons);
    } else {
        wireButtons();
    }

})();
