(function () {
    "use strict";

    const app = window.WorkStudyApp || {};

    function ensureAppReady() {
        if (!document.body) {
            return false;
        }

        if (document.readyState === "loading") {
            return false;
        }

        return true;
    }

    function updateAccountUI() {
        if (window.WorkStudyAuth && typeof window.WorkStudyAuth.updateAccountUI === "function") {
            return window.WorkStudyAuth.updateAccountUI();
        }

        const user = localStorage.getItem("workstudy-user");
        const loggedOutView = document.getElementById("loggedOutView");
        const loggedInView = document.getElementById("loggedInView");
        const accountName = document.getElementById("accountName");

        if (!loggedOutView || !loggedInView) {
            return false;
        }

        const isLoggedIn = Boolean(user);
        loggedOutView.style.display = isLoggedIn ? "none" : "block";
        loggedInView.style.display = isLoggedIn ? "block" : "none";

        if (accountName) {
            accountName.textContent = isLoggedIn ? user : "";
        }

        return isLoggedIn;
    }

    function openPanel() {
        const panel = document.getElementById("customizePanel");

        if (!panel) {
            return false;
        }

        panel.classList.add("open");
        document.body.classList.add("panelOpen");
        updateAccountUI();
        return true;
    }

    function closePanel() {
        const panel = document.getElementById("customizePanel");

        if (panel) {
            panel.classList.remove("open");
        }

        document.body.classList.remove("panelOpen");
        return true;
    }

    function toggleDropdown(id, arrow) {
        const dropdown = document.getElementById(id);

        if (!dropdown) {
            return false;
        }

        const isOpen = dropdown.classList.toggle("open");

        if (arrow) {
            arrow.classList.toggle("rotated", isOpen);
            arrow.setAttribute("aria-expanded", String(isOpen));
        }

        return isOpen;
    }

    function login(username) {
        const value = typeof username === "string" ? username.trim() : "";

        if (!value) {
            return false;
        }

        localStorage.setItem("workstudy-user", value);
        updateAccountUI();
        return true;
    }

    function logout() {
        localStorage.removeItem("workstudy-user");
        updateAccountUI();
        closePanel();
        return true;
    }

    function setupSettingsPanel() {
        const settingsButton = document.getElementById("settingsBtn");
        const closeButton = document.querySelector(".closeBtn");
        const dropdownArrows = document.querySelectorAll(".dropdownArrow");

        if (settingsButton) {
            settingsButton.addEventListener("click", function () {
                openPanel();
            });
        }

        if (closeButton) {
            closeButton.addEventListener("click", closePanel);
        }

        dropdownArrows.forEach(function (arrow) {
            const dropdownId = arrow.getAttribute("data-dropdown");
            if (!dropdownId) {
                return;
            }

            arrow.addEventListener("click", function () {
                toggleDropdown(dropdownId, arrow);
            });
        });
    }

    function initialize() {
        if (!ensureAppReady()) {
            return;
        }

        setupSettingsPanel();
        updateAccountUI();
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initialize);
    } else {
        initialize();
    }

    window.addEventListener("workstudy:authchange", function () {
        updateAccountUI();
    });

    window.WorkStudyApp = Object.assign({}, app, {
        updateAccountUI,
        openPanel,
        closePanel,
        toggleDropdown,
        login,
        logout,
        initialize
    });

    window.updateAccountUI = updateAccountUI;
    window.openPanel = openPanel;
    window.closePanel = closePanel;
    window.toggleDropdown = toggleDropdown;
    window.login = login;
    window.logout = logout;
})();
