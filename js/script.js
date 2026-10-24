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

        let user = null;

        try {

            if (
                window.WorkStudyAuth &&
                typeof window.WorkStudyAuth.getCurrentUser === "function"
            ) {
                user =
                    window.WorkStudyAuth.getCurrentUser();
            }

        } catch (error) {

            console.error(error);
        }

        const loggedOutView =
            document.getElementById(
                "loggedOutView"
            );

        const loggedInView =
            document.getElementById(
                "loggedInView"
            );

        const accountName =
            document.getElementById(
                "accountName"
            );

        const accountEmail =
            document.getElementById(
                "accountEmail"
            );

        if (
            !loggedOutView ||
            !loggedInView
        ) {
            return false;
        }

        const isLoggedIn =
            Boolean(user);

        loggedOutView.style.display =
            isLoggedIn
                ? "none"
                : "block";

        loggedInView.style.display =
            isLoggedIn
                ? "block"
                : "none";

        if (accountName) {
            accountName.textContent =
                isLoggedIn
                    ? user.username
                    : "Guest";
        }

        if (accountEmail) {
            accountEmail.textContent =
                isLoggedIn
                    ? (user.email || "")
                    : "";
        }

        return isLoggedIn;
    }

    function openPanel() {

        const panel =
            document.getElementById(
                "customizePanel"
            );

        if (!panel) {
            return false;
        }

        panel.classList.add("open");

        document.body.classList.add(
            "panelOpen"
        );

        updateAccountUI();

        return true;
    }

    function closePanel() {

        const panel =
            document.getElementById(
                "customizePanel"
            );

        if (panel) {
            panel.classList.remove(
                "open"
            );
        }

        document.body.classList.remove(
            "panelOpen"
        );

        return true;
    }

    function toggleDropdown(
        id,
        arrow
    ) {

        const dropdown =
            document.getElementById(id);

        if (!dropdown) {
            return false;
        }

        const isOpen =
            dropdown.classList.toggle(
                "open"
            );

        if (arrow) {

            arrow.classList.toggle(
                "rotated",
                isOpen
            );

            arrow.setAttribute(
                "aria-expanded",
                String(isOpen)
            );
        }

        return isOpen;
    }

    function login(userData) {

        if (
            !window.WorkStudyAuth ||
            typeof window.WorkStudyAuth.setCurrentUser !== "function"
        ) {
            return false;
        }

        const success =
            window.WorkStudyAuth.setCurrentUser(
                userData
            );

        updateAccountUI();

        return success;
    }

    function logout() {

        if (
            window.WorkStudyAuth &&
            typeof window.WorkStudyAuth.clearCurrentUser === "function"
        ) {

            window.WorkStudyAuth.clearCurrentUser();
        }

        localStorage.removeItem(
            "workstudy-account"
        );

        updateAccountUI();

        closePanel();

        return true;
    }

    function setupSettingsPanel() {

        const settingsButton =
            document.getElementById(
                "settingsBtn"
            );

        const closeButton =
            document.querySelector(
                ".closeBtn"
            );

        const dropdownArrows =
            document.querySelectorAll(
                ".dropdownArrow"
            );

        if (settingsButton) {

            settingsButton.addEventListener(
                "click",
                function () {
                    openPanel();
                }
            );
        }

        if (closeButton) {

            closeButton.addEventListener(
                "click",
                closePanel
            );
        }

        dropdownArrows.forEach(
            function (arrow) {

                const dropdownId =
                    arrow.getAttribute(
                        "data-dropdown"
                    );

                if (!dropdownId) {
                    return;
                }

                arrow.addEventListener(
                    "click",
                    function () {
                        toggleDropdown(
                            dropdownId,
                            arrow
                        );
                    }
                );
            }
        );

        const logoutBtn =
            document.getElementById(
                "logoutBtn"
            );

        if (logoutBtn) {

            logoutBtn.addEventListener(
                "click",
                logout
            );
        }

        const deleteAccountBtn =
            document.getElementById(
                "deleteAccountBtn"
            );

        if (deleteAccountBtn) {

            deleteAccountBtn.addEventListener(
                "click",
                async function () {

                    const user =
                        window.WorkStudyAuth &&
                        typeof window.WorkStudyAuth.getCurrentUser === "function"
                            ? window.WorkStudyAuth.getCurrentUser()
                            : null;

                    if (!user) {
                        return;
                    }

                    const confirmed =
                        confirm(
                            "Are you sure you want to delete your account? This cannot be undone."
                        );

                    if (!confirmed) {
                        return;
                    }

                    alert(
                        "Delete account API has not been added yet."
                    );
                }
            );
        }
    }

    function initialize() {

        if (
            !ensureAppReady()
        ) {
            return;
        }

        setupSettingsPanel();

        updateAccountUI();
    }

    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            initialize
        );

    } else {

        initialize();
    }

    window.addEventListener(
        "workstudy:authchange",
        function () {
            updateAccountUI();
        }
    );

    window.WorkStudyApp =
        Object.assign(
            {},
            app,
            {
                updateAccountUI,
                openPanel,
                closePanel,
                toggleDropdown,
                login,
                logout,
                initialize
            }
        );

    window.updateAccountUI =
        updateAccountUI;

    window.openPanel =
        openPanel;

    window.closePanel =
        closePanel;

    window.toggleDropdown =
        toggleDropdown;

    window.login =
        login;

    window.logout =
        logout;

})();
