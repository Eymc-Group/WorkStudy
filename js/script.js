(function () {
    "use strict";

    const app = window.WorkStudyApp || {};

    const API_URL =
        "https://workstudy-api.354271744.workers.dev";

    function ensureAppReady() {
        return Boolean(
            document.body &&
            document.readyState !== "loading"
        );
    }

    function getCurrentUser() {
        try {
            if (
                window.WorkStudyAuth &&
                typeof window.WorkStudyAuth.getCurrentUser === "function"
            ) {
                return window.WorkStudyAuth.getCurrentUser();
            }

            const storedUser =
                localStorage.getItem("workstudy-user");

            if (!storedUser) {
                return null;
            }

            try {
                const parsedUser =
                    JSON.parse(storedUser);

                if (
                    parsedUser &&
                    typeof parsedUser === "object"
                ) {
                    return parsedUser;
                }
            } catch {
                return {
                    username: storedUser,
                    email: null
                };
            }
        } catch (error) {
            console.error(
                "Could not read the current user:",
                error
            );
        }

        return null;
    }

    function updateAccountUI() {
        const user = getCurrentUser();

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

        const isLoggedIn = Boolean(
            user &&
            user.username
        );

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
                    ? user.email || ""
                    : "";
        }

        return isLoggedIn;
    }

    function openPanel() {
        const panel =
            document.getElementById(
                "customizePanel"
            );

        const settingsButton =
            document.getElementById(
                "settingsBtn"
            );

        if (!panel) {
            return false;
        }

        panel.classList.add("open");

        document.body.classList.add(
            "panelOpen"
        );

        if (settingsButton) {
            settingsButton.setAttribute(
                "aria-expanded",
                "true"
            );
        }

        updateAccountUI();

        return true;
    }

    function closePanel() {
        const panel =
            document.getElementById(
                "customizePanel"
            );

        const settingsButton =
            document.getElementById(
                "settingsBtn"
            );

        if (panel) {
            panel.classList.remove("open");
        }

        document.body.classList.remove(
            "panelOpen"
        );

        if (settingsButton) {
            settingsButton.setAttribute(
                "aria-expanded",
                "false"
            );
        }

        return true;
    }

    function toggleDropdown(id, arrow) {
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
            !userData ||
            typeof userData !== "object" ||
            typeof userData.username !== "string" ||
            !userData.username.trim()
        ) {
            return false;
        }

        let success = false;

        if (
            window.WorkStudyAuth &&
            typeof window.WorkStudyAuth.setCurrentUser === "function"
        ) {
            success =
                window.WorkStudyAuth.setCurrentUser(
                    userData
                );
        }

        if (!success) {
            try {
                localStorage.setItem(
                    "workstudy-user",
                    JSON.stringify({
                        username:
                            userData.username.trim(),

                        email:
                            userData.email || null
                    })
                );

                success = true;
            } catch (error) {
                console.error(
                    "Could not save the login:",
                    error
                );
            }
        }

        updateAccountUI();

        return success;
    }

    function clearLocalAccountData() {
        if (
            window.WorkStudyAuth &&
            typeof window.WorkStudyAuth.clearCurrentUser === "function"
        ) {
            window.WorkStudyAuth.clearCurrentUser();
        }

        localStorage.removeItem(
            "workstudy-user"
        );

        localStorage.removeItem(
            "workstudy-account"
        );

        localStorage.removeItem(
            "workstudy-token"
        );

        localStorage.removeItem(
            "user"
        );
    }

    function logout() {
        clearLocalAccountData();

        updateAccountUI();
        closePanel();

        return true;
    }

    function setAccountStatus(
        message,
        type
    ) {
        const statusElement =
            document.getElementById(
                "accountStatus"
            ) ||
            document.getElementById(
                "saveStatus"
            );

        if (!statusElement) {
            return;
        }

        statusElement.textContent =
            message;

        if (type === "error") {
            statusElement.style.color =
                "#ef4444";
        } else if (type === "success") {
            statusElement.style.color =
                "#22c55e";
        } else {
            statusElement.style.color =
                "var(--text)";
        }
    }

    async function deleteAccount() {
        const user = getCurrentUser();

        const token =
            localStorage.getItem(
                "workstudy-token"
            );

        if (!user || !user.username) {
            setAccountStatus(
                "❌ You must be logged in.",
                "error"
            );

            return;
        }

        if (!token) {
            setAccountStatus(
                "❌ Your login session is missing. Log out and log in again.",
                "error"
            );

            return;
        }

        const confirmed =
            window.confirm(
                "Delete your WorkStudy account permanently? This cannot be undone."
            );

        if (!confirmed) {
            return;
        }

        const password =
            window.prompt(
                "Enter your password to confirm account deletion:"
            );

        if (
            typeof password !== "string" ||
            !password
        ) {
            setAccountStatus(
                "Account deletion cancelled.",
                "normal"
            );

            return;
        }

        const finalConfirmation =
            window.confirm(
                "Final warning: your account will be permanently deleted. Continue?"
            );

        if (!finalConfirmation) {
            return;
        }

        const deleteButton =
            document.getElementById(
                "deleteAccountBtn"
            );

        if (deleteButton) {
            deleteButton.disabled = true;
        }

        setAccountStatus(
            "🗑️ Deleting account...",
            "normal"
        );

        try {
            const response = await fetch(
                `${API_URL}/delete-account`,
                {
                    method: "DELETE",

                    headers: {
                        "Content-Type":
                            "application/json",

                        "Authorization":
                            `Bearer ${token}`
                    },

                    body: JSON.stringify({
                        password
                    })
                }
            );

            const responseText =
                await response.text();

            let data;

            try {
                data =
                    JSON.parse(responseText);
            } catch {
                throw new Error(
                    "The server returned an invalid response."
                );
            }

            if (
                !response.ok ||
                !data.success
            ) {
                throw new Error(
                    data.message ||
                    "Unable to delete the account."
                );
            }

            clearLocalAccountData();

            setAccountStatus(
                "✅ Account deleted.",
                "success"
            );

            updateAccountUI();
            closePanel();

            window.alert(
                "Your WorkStudy account was deleted."
            );

            window.location.href =
                "index.html";

        } catch (error) {
            console.error(
                "Account deletion failed:",
                error
            );

            setAccountStatus(
                `❌ ${
                    error.message ||
                    "Account deletion failed."
                }`,
                "error"
            );

        } finally {
            if (deleteButton) {
                deleteButton.disabled = false;
            }
        }
    }

    function setupDropdowns() {
        const dropdownArrows =
            document.querySelectorAll(
                ".dropdownArrow"
            );

        dropdownArrows.forEach(
            function (arrow) {
                const dropdownId =
                    arrow.getAttribute(
                        "data-dropdown"
                    );

                if (!dropdownId) {
                    return;
                }

                function activateDropdown() {
                    toggleDropdown(
                        dropdownId,
                        arrow
                    );
                }

                arrow.addEventListener(
                    "click",
                    activateDropdown
                );

                arrow.addEventListener(
                    "keydown",
                    function (event) {
                        if (
                            event.key === "Enter" ||
                            event.key === " "
                        ) {
                            event.preventDefault();
                            activateDropdown();
                        }
                    }
                );
            }
        );
    }

    function setupSettingsPanel() {
        const settingsButton =
            document.getElementById(
                "settingsBtn"
            );

        const closeButton =
            document.getElementById(
                "closeBtn"
            ) ||
            document.querySelector(
                ".closeBtn"
            );

        const logoutButton =
            document.getElementById(
                "logoutBtn"
            );

        const deleteAccountButton =
            document.getElementById(
                "deleteAccountBtn"
            );

        if (settingsButton) {
            settingsButton.addEventListener(
                "click",
                openPanel
            );
        }

        if (closeButton) {
            closeButton.addEventListener(
                "click",
                closePanel
            );
        }

        if (logoutButton) {
            logoutButton.addEventListener(
                "click",
                logout
            );
        }

        if (deleteAccountButton) {
            deleteAccountButton.addEventListener(
                "click",
                deleteAccount
            );
        }

        setupDropdowns();
    }

    function initialize() {
        if (!ensureAppReady()) {
            return;
        }

        setupSettingsPanel();
        updateAccountUI();
    }

    if (
        document.readyState === "loading"
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
        updateAccountUI
    );

    window.addEventListener(
        "storage",
        function (event) {
            if (
                event.key ===
                    "workstudy-user" ||
                event.key ===
                    "workstudy-account" ||
                event.key ===
                    "workstudy-token"
            ) {
                updateAccountUI();
            }
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
                deleteAccount,
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

    window.deleteAccount =
        deleteAccount;
})();
