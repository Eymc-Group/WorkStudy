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
        const loggedOutView = document.getElementById("loggedOutView");
        const loggedInView = document.getElementById("loggedInView");
        const accountName = document.getElementById("accountName");

        let user = null;

        if (window.WorkStudyAuth && typeof window.WorkStudyAuth.getCurrentUser === "function") {
            user = window.WorkStudyAuth.getCurrentUser();
        } else {
            try {
                user = localStorage.getItem("workstudy-user");
            } catch (error) {
                user = null;
            }
        }

        if (!loggedOutView || !loggedInView) {
            return Boolean(user);
        }

        const isLoggedIn = Boolean(user);
        loggedOutView.style.display = isLoggedIn ? "none" : "block";
        loggedInView.style.display = isLoggedIn ? "block" : "none";

        if (accountName) {
            accountName.textContent = isLoggedIn ? user : "Guest";
        }

        return isLoggedIn;
    }

    function logout() {
        if (window.WorkStudyAuth && typeof window.WorkStudyAuth.clearCurrentUser === "function") {
            window.WorkStudyAuth.clearCurrentUser();
        } else {
            try {
                localStorage.removeItem("workstudy-user");
            } catch (error) {
                // ignore storage issues
            }
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

        try {
            localStorage.setItem("workstudy-user", user);
        } catch (error) {
            return false;
        }

        refreshAccountState();
        return true;
    }

    function initializeUI() {
        const settingsButton = document.getElementById("settingsBtn");
        const closeButton = document.querySelector(".closeBtn");
        const dropdownArrows = document.querySelectorAll(".dropdownArrow");

        if (settingsButton) {
            settingsButton.addEventListener("click", function () {
                if (document.getElementById("customizePanel") && document.getElementById("customizePanel").classList.contains("open")) {
                    closePanel();
                } else {
                    openPanel();
                }
                refreshAccountState();
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

            const handleToggle = function () {
                toggleDropdown(dropdownId, arrow);
            };

            arrow.addEventListener("click", handleToggle);
            arrow.addEventListener("keydown", function (event) {
                if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    handleToggle();
                }
            });
        });

        document.addEventListener("keydown", function (event) {
            if (event.key === "Escape") {
                closePanel();
            }
        });

        refreshAccountState();
    }

    document.addEventListener("DOMContentLoaded", function () {
        initializeUI();
    });

    window.addEventListener("workstudy:authchange", function () {
        refreshAccountState();
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
