(function () {
    "use strict";

    const websiteBtn =
        document.getElementById("websiteBtn");

    const websitePanel =
        document.getElementById("websitePanel");

    const websiteList =
        document.getElementById("websiteList");

    const addWebsiteBtn =
        document.getElementById("addWebsiteBtn");

    const websiteFrame =
        document.getElementById("websiteFrame");

    if (
        !websiteBtn ||
        !websitePanel ||
        !websiteList ||
        !addWebsiteBtn ||
        !websiteFrame
    ) {
        return;
    }

    websiteBtn.addEventListener(
        "click",
        function () {
            websitePanel.classList.toggle("open");
        }
    );

    function getWebsites() {
        try {
            const saved =
                localStorage.getItem("savedWebsites");

            return saved
                ? JSON.parse(saved)
                : [];
        } catch (error) {
            console.error(
                "Could not load saved websites:",
                error
            );

            return [];
        }
    }

    function saveWebsites(websites) {
        localStorage.setItem(
            "savedWebsites",
            JSON.stringify(websites)
        );
    }

    function renderWebsites() {
        websiteList.replaceChildren();

        const websites =
            getWebsites();

        websites.forEach(
            function (site, index) {
                const button =
                    document.createElement("button");

                button.type = "button";
                button.className = "website-item";
                button.textContent = site.name;

                button.addEventListener(
                    "click",
                    function () {
                        websiteFrame.src = site.url;
                    }
                );

                button.addEventListener(
                    "contextmenu",
                    function (event) {
                        event.preventDefault();

                        const confirmed =
                            window.confirm(
                                `Delete "${site.name}"?`
                            );

                        if (!confirmed) {
                            return;
                        }

                        const updatedWebsites =
                            getWebsites();

                        updatedWebsites.splice(
                            index,
                            1
                        );

                        saveWebsites(
                            updatedWebsites
                        );

                        renderWebsites();
                    }
                );

                websiteList.appendChild(
                    button
                );
            }
        );
    }

    addWebsiteBtn.addEventListener(
        "click",
        function () {
            let url =
                window.prompt("Website URL:");

            if (!url) {
                return;
            }

            url = url.trim();

            if (
                !url.startsWith("http://") &&
                !url.startsWith("https://")
            ) {
                url = "https://" + url;
            }

            let parsedUrl;

            try {
                parsedUrl = new URL(url);

                if (
                    parsedUrl.protocol !== "http:" &&
                    parsedUrl.protocol !== "https:"
                ) {
                    throw new Error(
                        "Unsupported protocol"
                    );
                }
            } catch (error) {
                window.alert(
                    "Enter a valid website URL."
                );

                return;
            }

            let name =
                window.prompt("Website Name:");

            if (
                !name ||
                !name.trim()
            ) {
                name = parsedUrl.hostname;
            } else {
                name = name.trim();
            }

            const websites =
                getWebsites();

            websites.push({
                name,
                url: parsedUrl.href
            });

            saveWebsites(websites);
            renderWebsites();
        }
    );

    renderWebsites();
})();
