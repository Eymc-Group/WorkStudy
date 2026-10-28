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

    function openWorkStudyEmbed() {
    const siteUrl =
        window.location.href;

    const siteWindow =
        window.open(
            "about:blank",
            "_blank"
        );

    if (!siteWindow) {
        window.alert(
            "The new tab was blocked. Allow popups and try again."
        );

        return;
    }

    siteWindow.document.title =
        "WorkStudy";

    siteWindow.document.documentElement.style.width =
        "100%";

    siteWindow.document.documentElement.style.height =
        "100%";

    siteWindow.document.body.style.margin =
        "0";

    siteWindow.document.body.style.width =
        "100%";

    siteWindow.document.body.style.height =
        "100%";

    siteWindow.document.body.style.overflow =
        "hidden";

    siteWindow.document.body.style.background =
        "#000";

    const siteFrame =
        siteWindow.document.createElement(
            "iframe"
        );

    siteFrame.src =
        siteUrl;

    siteFrame.title =
        "WorkStudy";

    siteFrame.style.display =
        "block";

    siteFrame.style.width =
        "100%";

    siteFrame.style.height =
        "100%";

    siteFrame.style.border =
        "0";

    siteFrame.setAttribute(
        "allow",
        "fullscreen; autoplay"
    );

    siteFrame.setAttribute(
        "allowfullscreen",
        ""
    );

    siteWindow.document.body.appendChild(
        siteFrame
    );
}

window.openWorkStudyEmbed =
    openWorkStudyEmbed;
    (function () {
    "use strict";

    const TAB_TITLE_KEY =
        "workstudy-tab-title";

    const TAB_ICON_KEY =
        "workstudy-tab-icon";

    const TITLE_OPTIONS = new Set([
        "WorkStudy",
        "WorkStudy Hub",
        "WorkStudy Games",
        "WorkStudy - Game • Search • Explore"
    ]);

    const ICON_FILES = {
        default: "favicon.png",
        game: "game.png"
    };

    function getImageUrl(filename) {
        const currentScript =
            document.currentScript;

        if (
            currentScript &&
            currentScript.src
        ) {
            return new URL(
                "../img/" + filename,
                currentScript.src
            ).href;
        }

        const scriptElement =
            Array.from(
                document.scripts
            ).find(function (script) {
                return (
                    script.src &&
                    script.src.includes(
                        "/js/script.js"
                    )
                );
            });

        if (scriptElement) {
            return new URL(
                "../img/" + filename,
                scriptElement.src
            ).href;
        }

        return new URL(
            "img/" + filename,
            window.location.href
        ).href;
    }

    function getIconUrl(iconName) {
        const filename =
            ICON_FILES[iconName] ||
            ICON_FILES.default;

        return getImageUrl(filename);
    }

    function updateFavicon(iconName) {
        const iconUrl =
            getIconUrl(iconName);

        let favicon =
            document.querySelector(
                'link[rel~="icon"]'
            );

        if (!favicon) {
            favicon =
                document.createElement(
                    "link"
                );

            favicon.rel =
                "icon";

            document.head.appendChild(
                favicon
            );
        }

        favicon.href =
            iconUrl;
    }

    function setTabStatus(
        message,
        type
    ) {
        const status =
            document.getElementById(
                "tabAppearanceStatus"
            );

        if (!status) {
            return;
        }

        status.textContent =
            message;

        if (type === "success") {
            status.style.color =
                "#22c55e";
        } else if (type === "error") {
            status.style.color =
                "#ef4444";
        } else {
            status.style.color =
                "var(--text)";
        }
    }

    function applySavedTabAppearance() {
        try {
            const savedTitle =
                localStorage.getItem(
                    TAB_TITLE_KEY
                );

            const savedIcon =
                localStorage.getItem(
                    TAB_ICON_KEY
                );

            if (
                savedTitle &&
                TITLE_OPTIONS.has(
                    savedTitle
                )
            ) {
                document.title =
                    savedTitle;
            }

            if (
                savedIcon &&
                ICON_FILES[savedIcon]
            ) {
                updateFavicon(
                    savedIcon
                );
            }
        } catch (error) {
            console.error(
                "Could not load tab appearance:",
                error
            );
        }
    }

    function applyTabAppearance() {
        const titleSelect =
            document.getElementById(
                "tabTitleSelect"
            );

        const iconSelect =
            document.getElementById(
                "tabIconSelect"
            );

        if (
            !titleSelect ||
            !iconSelect
        ) {
            return;
        }

        const selectedTitle =
            titleSelect.value;

        const selectedIcon =
            iconSelect.value;

        if (
            !TITLE_OPTIONS.has(
                selectedTitle
            )
        ) {
            setTabStatus(
                "❌ Invalid tab title.",
                "error"
            );

            return;
        }

        if (
            !ICON_FILES[selectedIcon]
        ) {
            setTabStatus(
                "❌ Invalid tab icon.",
                "error"
            );

            return;
        }

        try {
            document.title =
                selectedTitle;

            updateFavicon(
                selectedIcon
            );

            localStorage.setItem(
                TAB_TITLE_KEY,
                selectedTitle
            );

            localStorage.setItem(
                TAB_ICON_KEY,
                selectedIcon
            );

            setTabStatus(
                "✅ Tab appearance saved.",
                "success"
            );
        } catch (error) {
            console.error(
                "Could not save tab appearance:",
                error
            );

            setTabStatus(
                "❌ Could not save tab appearance.",
                "error"
            );
        }
    }

    function resetTabAppearance() {
        try {
            localStorage.removeItem(
                TAB_TITLE_KEY
            );

            localStorage.removeItem(
                TAB_ICON_KEY
            );

            document.title =
                "WorkStudy";

            updateFavicon(
                "default"
            );

            const titleSelect =
                document.getElementById(
                    "tabTitleSelect"
                );

            const iconSelect =
                document.getElementById(
                    "tabIconSelect"
                );

            if (titleSelect) {
                titleSelect.value =
                    "WorkStudy";
            }

            if (iconSelect) {
                iconSelect.value =
                    "default";
            }

            setTabStatus(
                "✅ Tab appearance reset.",
                "success"
            );
        } catch (error) {
            console.error(
                "Could not reset tab appearance:",
                error
            );

            setTabStatus(
                "❌ Could not reset tab appearance.",
                "error"
            );
        }
    }

    function initializeTabAppearance() {
        applySavedTabAppearance();

        const titleSelect =
            document.getElementById(
                "tabTitleSelect"
            );

        const iconSelect =
            document.getElementById(
                "tabIconSelect"
            );

        const applyButton =
            document.getElementById(
                "applyTabAppearanceBtn"
            );

        const resetButton =
            document.getElementById(
                "resetTabAppearanceBtn"
            );

        try {
            const savedTitle =
                localStorage.getItem(
                    TAB_TITLE_KEY
                );

            const savedIcon =
                localStorage.getItem(
                    TAB_ICON_KEY
                );

            if (
                titleSelect &&
                savedTitle &&
                TITLE_OPTIONS.has(
                    savedTitle
                )
            ) {
                titleSelect.value =
                    savedTitle;
            }

            if (
                iconSelect &&
                savedIcon &&
                ICON_FILES[savedIcon]
            ) {
                iconSelect.value =
                    savedIcon;
            }
        } catch (error) {
            console.error(
                "Could not prepare tab controls:",
                error
            );
        }

        if (applyButton) {
            applyButton.addEventListener(
                "click",
                applyTabAppearance
            );
        }

        if (resetButton) {
            resetButton.addEventListener(
                "click",
                resetTabAppearance
            );
        }
    }

    if (
        document.readyState ===
        "loading"
    ) {
        document.addEventListener(
            "DOMContentLoaded",
            initializeTabAppearance
        );
    } else {
        initializeTabAppearance();
    }

    window.applyTabAppearance =
        applyTabAppearance;

    window.resetTabAppearance =
        resetTabAppearance;
async function clearWebsiteData() {
    const warningOne =
        window.confirm(
            "\n\nDelete all WorkStudy website data stored on this mirror?"
        );

    if (!warningOne) {
        return;
    }

    const warningTwo =
        window.confirm(
            "\n\nThis will delete your local login, themes, settings, progress, custom tab settings, IndexedDB databases, caches, cookies, and service workers."
        );

    if (!warningTwo) {
        return;
    }

    const warningThree =
        window.confirm(
            "\n\nThis cannot be undone unless your progress was saved to the cloud.\n\nDelete everything?"
        );

    if (!warningThree) {
        return;
    }

    try {
        localStorage.clear();
        sessionStorage.clear();

        if (
            window.indexedDB &&
            typeof indexedDB.databases === "function"
        ) {
            const databases =
                await indexedDB.databases();

            await Promise.all(
                databases.map(
                    function (database) {
                        if (!database.name) {
                            return Promise.resolve();
                        }

                        return new Promise(
                            function (resolve) {
                                const request =
                                    indexedDB.deleteDatabase(
                                        database.name
                                    );

                                request.onsuccess =
                                    resolve;

                                request.onerror =
                                    resolve;

                                request.onblocked =
                                    resolve;
                            }
                        );
                    }
                )
            );
        }

        if ("caches" in window) {
            const cacheNames =
                await caches.keys();

            await Promise.all(
                cacheNames.map(
                    function (cacheName) {
                        return caches.delete(
                            cacheName
                        );
                    }
                )
            );
        }

        if (
            "serviceWorker" in navigator
        ) {
            const registrations =
                await navigator.serviceWorker
                    .getRegistrations();

            await Promise.all(
                registrations.map(
                    function (registration) {
                        return registration.unregister();
                    }
                )
            );
        }

        document.cookie
            .split(";")
            .forEach(
                function (cookie) {
                    const cookieName =
                        cookie
                            .split("=")[0]
                            .trim();

                    if (!cookieName) {
                        return;
                    }

                    document.cookie =
                        `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; Max-Age=0; path=/`;

                    document.cookie =
                        `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; Max-Age=0; path=${window.location.pathname}`;
                }
            );

        window.alert(
            "All local WorkStudy website data was deleted."
        );

        window.location.replace(
            window.location.origin +
            window.location.pathname
        );

    } catch (error) {
        console.error(
            "Could not delete all website data:",
            error
        );

        window.alert(
            "Some website data could not be deleted."
        );
    }
}

window.clearWebsiteData =
    clearWebsiteData;
})();
