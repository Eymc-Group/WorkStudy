(function () {
    "use strict";

    const TAB_NAME_KEY =
        "workstudy-custom-tab-name";

    const ICON_KEY =
        "workstudy-custom-icon";

    function updateFavicon(iconUrl) {
        let favicon =
            document.querySelector(
                'link[rel~="icon"]'
            );

        if (!favicon) {
            favicon =
                document.createElement("link");

            favicon.rel = "icon";
            document.head.appendChild(favicon);
        }

        favicon.href = iconUrl;
    }

    function applySavedTabSettings() {
        const savedName =
            localStorage.getItem(TAB_NAME_KEY);

        const savedIcon =
            localStorage.getItem(ICON_KEY);

        if (savedName) {
            document.title = savedName;
        }

        if (savedIcon) {
            updateFavicon(savedIcon);
        }
    }

    function saveCustomTabName() {
        const input =
            document.getElementById(
                "customTabName"
            );

        const status =
            document.getElementById(
                "customTabStatus"
            );

        if (!input) {
            return;
        }

        const tabName =
            input.value.trim();

        if (!tabName) {
            if (status) {
                status.textContent =
                    "Enter a tab name.";
            }

            return;
        }

        document.title = tabName;

        localStorage.setItem(
            TAB_NAME_KEY,
            tabName
        );

        if (status) {
            status.textContent =
                "✅ Tab name saved!";
        }
    }

    function saveCustomIcon() {
        const input =
            document.getElementById(
                "customIconUrl"
            );

        const status =
            document.getElementById(
                "customTabStatus"
            );

        if (!input) {
            return;
        }

        const value =
            input.value.trim();

        let iconUrl;

        try {
            iconUrl = new URL(value);

            if (
                iconUrl.protocol !== "https:" &&
                iconUrl.protocol !== "http:"
            ) {
                throw new Error();
            }
        } catch {
            if (status) {
                status.textContent =
                    "Enter a valid icon URL.";
            }

            return;
        }

        updateFavicon(iconUrl.href);

        localStorage.setItem(
            ICON_KEY,
            iconUrl.href
        );

        if (status) {
            status.textContent =
                "✅ Icon saved!";
        }
    }

    function initializeCustomTab() {
        applySavedTabSettings();

        const nameInput =
            document.getElementById(
                "customTabName"
            );

        const iconInput =
            document.getElementById(
                "customIconUrl"
            );

        const nameButton =
            document.getElementById(
                "saveCustomTabNameBtn"
            );

        const iconButton =
            document.getElementById(
                "saveCustomIconBtn"
            );

        const savedName =
            localStorage.getItem(
                TAB_NAME_KEY
            );

        const savedIcon =
            localStorage.getItem(
                ICON_KEY
            );

        if (nameInput && savedName) {
            nameInput.value = savedName;
        }

        if (iconInput && savedIcon) {
            iconInput.value = savedIcon;
        }

        if (nameButton) {
            nameButton.addEventListener(
                "click",
                saveCustomTabName
            );
        }

        if (iconButton) {
            iconButton.addEventListener(
                "click",
                saveCustomIcon
            );
        }
    }

    if (document.readyState === "loading") {
        document.addEventListener(
            "DOMContentLoaded",
            initializeCustomTab
        );
    } else {
        initializeCustomTab();
    }
    function resetCustomTab() {
    localStorage.removeItem(
        "workstudy-custom-tab-name"
    );

    localStorage.removeItem(
        "workstudy-custom-icon"
    );

    window.location.reload();
}
})();
