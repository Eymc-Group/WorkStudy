(function () {
    "use strict";

    const AUTH_KEYS = Object.freeze({
        user: "workstudy-user",
        theme: "workstudy-theme"
    });

    const AUTH_EVENT_NAME = "workstudy:authchange";

    function safeGetItem(key) {
        try {
            return window.localStorage.getItem(key);
        } catch (error) {
            return null;
        }
    }

    function safeSetItem(key, value) {
        try {
            window.localStorage.setItem(key, value);
            return true;
        } catch (error) {
            return false;
        }
    }

    function safeRemoveItem(key) {
        try {
            window.localStorage.removeItem(key);
            return true;
        } catch (error) {
            return false;
        }
    }

    function normalizeUsername(value) {
        if (typeof value !== "string") {
            return "";
        }

        return value.trim();
    }

    function dispatchAuthChange() {
        const event = new CustomEvent(AUTH_EVENT_NAME, {
            detail: {
                user: getCurrentUser()
            }
        });

        window.dispatchEvent(event);
    }

    function getCurrentUser() {
        const username = normalizeUsername(safeGetItem(AUTH_KEYS.user));
        return username || null;
    }

    function setCurrentUser(username) {
        const normalized = normalizeUsername(username);

        if (!normalized) {
            clearCurrentUser();
            return false;
        }

        const saved = safeSetItem(AUTH_KEYS.user, normalized);

        if (saved) {
            dispatchAuthChange();
            return true;
        }

        return false;
    }

    function clearCurrentUser() {
        const removed = safeRemoveItem(AUTH_KEYS.user);

        if (removed) {
            dispatchAuthChange();
        }
    }

    function updateAccountUI() {
        const loggedOutView = document.getElementById("loggedOutView");
        const loggedInView = document.getElementById("loggedInView");
        const accountName = document.getElementById("accountName");

        if (!loggedOutView || !loggedInView) {
            return false;
        }

        const user = getCurrentUser();
        const isLoggedIn = Boolean(user);

        loggedOutView.style.display = isLoggedIn ? "none" : "block";
        loggedInView.style.display = isLoggedIn ? "block" : "none";

        if (accountName) {
            accountName.textContent = isLoggedIn ? user : "";
        }

        return isLoggedIn;
    }

    function subscribeAuthChange(callback) {
        window.addEventListener(AUTH_EVENT_NAME, callback);

        return function unsubscribe() {
            window.removeEventListener(AUTH_EVENT_NAME, callback);
        };
    }

    window.WorkStudyAuth = Object.freeze({
        AUTH_KEYS,
        getCurrentUser,
        setCurrentUser,
        clearCurrentUser,
        updateAccountUI,
        subscribeAuthChange,
        dispatchAuthChange
    });
})();
