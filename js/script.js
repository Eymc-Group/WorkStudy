(function () {
    "use strict";

    const app = window.WorkStudyApp || {};

    function getDropdownById(dropdownId) {
        if (!dropdownId || typeof dropdownId !== "string") {
            return null;
        }

        return document.getElementById(dropdownId);
    }

    function openPanel() {
        const panel = document.getElementById("customizePanel");

        if (!panel) {
            return false;
        }

        panel.classList.add("open");
        document.body.classList.add("panelOpen");
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

    function toggleDropdown(dropdownId, arrowElement) {
        const dropdown = getDropdownById(dropdownId);

        if (!dropdown) {
            return false;
        }

        const isOpen = dropdown.classList.toggle("open");

        if (arrowElement) {
            arrowElement.classList.toggle("rotated", isOpen);
            arrowElement.setAttribute("aria-expanded", String(isOpen));
        }

        return isOpen;
    }

    function refreshAccountState() {
        if (window.WorkStudyAuth && typeof window.WorkStudyAuth.updateAccountUI === "function") {
            return window.WorkStudyAuth.updateAccountUI();
        }

        return false;
    }

    function logout() {
        if (window.WorkStudyAuth && typeof window.WorkStudyAuth.clearCurrentUser === "function") {
            window.WorkStudyAuth.clearCurrentUser();
        }

        refreshAccountState();
        closePanel();
        return true;
    }

    function login(username) {
        const user = typeof username === "string" ? username.trim() : "";

        if (!user) {
            return false;
        }

        if (window.WorkStudyAuth && typeof window.WorkStudyAuth.setCurrentUser === "function") {
            const result = window.WorkStudyAuth.setCurrentUser(user);
            refreshAccountState();
            return result;
        }

        return false;
    }

    function initializeUI() {
        const settingsButton = document.getElementById("settingsBtn");

        if (settingsButton) {
            settingsButton.addEventListener("click", function () {
                openPanel();
                refreshAccountState();
            });
        }

        const closeButton = document.querySelector(".closeBtn");
        if (closeButton) {
            closeButton.addEventListener("click", closePanel);
        }

        const dropdownArrows = document.querySelectorAll(".dropdownArrow");
        dropdownArrows.forEach(function (arrow) {
            const dropdownId = arrow.getAttribute("data-dropdown");
            if (dropdownId) {
                arrow.addEventListener("click", function () {
                    toggleDropdown(dropdownId, arrow);
                });
            }
        });

        const accountPanel = document.getElementById("accountDropdown");
        if (accountPanel) {
            accountPanel.addEventListener("click", function (event) {
                if (event.target && event.target.closest("button")) {
                    refreshAccountState();
                }
            });
        }

        refreshAccountState();
    }

    document.addEventListener("DOMContentLoaded", function () {
        initializeUI();
    });

    window.WorkStudyApp = Object.assign({}, app, {
        openPanel,
        closePanel,
        toggleDropdown,
        refreshAccountState,
        logout,
        login,
        initializeUI
    });

    window.openPanel = openPanel;
    window.closePanel = closePanel;
    window.toggleDropdown = toggleDropdown;
    window.refreshAccountState = refreshAccountState;
    window.logout = logout;
    window.login = login;
})();
