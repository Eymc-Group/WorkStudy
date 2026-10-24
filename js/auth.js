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

    function getCurrentUser() {
        try {
            const stored = safeGetItem(AUTH_KEYS.user);

            if (!stored) {
                return null;
            }

            return JSON.parse(stored);
        } catch (error) {
            return null;
        }
    }

    function setCurrentUser(userData) {

        if (
            !userData ||
            typeof userData.username !== "string" ||
            !userData.username.trim()
        ) {
            clearCurrentUser();
            return false;
        }

        const saved = safeSetItem(
            AUTH_KEYS.user,
            JSON.stringify({
                username: userData.username.trim(),
                email: userData.email || null
            })
        );

        if (saved) {
            dispatchAuthChange();
            return true;
        }

        return false;
    }

    function clearCurrentUser() {
        const removed =
            safeRemoveItem(AUTH_KEYS.user);

        if (removed) {
            dispatchAuthChange();
        }
    }

    function dispatchAuthChange() {
        const event = new CustomEvent(
            AUTH_EVENT_NAME,
            {
                detail: {
                    user: getCurrentUser()
                }
            }
        );

        window.dispatchEvent(event);
    }

    function updateAccountUI() {

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

        if (
            !loggedOutView ||
            !loggedInView
        ) {
            return false;
        }

        const user =
            getCurrentUser();

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

        return isLoggedIn;
    }

    function subscribeAuthChange(
        callback
    ) {
        window.addEventListener(
            AUTH_EVENT_NAME,
            callback
        );

        return function unsubscribe() {
            window.removeEventListener(
                AUTH_EVENT_NAME,
                callback
            );
        };
    }

    window.WorkStudyAuth =
        Object.freeze({
            AUTH_KEYS,
            getCurrentUser,
            setCurrentUser,
            clearCurrentUser,
            updateAccountUI,
            subscribeAuthChange,
            dispatchAuthChange
        });
})();
