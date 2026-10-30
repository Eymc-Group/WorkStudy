(() => {
    "use strict";

    const STORAGE_KEY = "savedWebsites";

    function getWebsites() {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            return saved ? JSON.parse(saved) : [];
        } catch (error) {
            console.error("Failed to load websites:", error);
            return [];
        }
    }

    function saveWebsites(websites) {
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(websites)
        );
    }

    function renderWebsites() {
        const container =
            document.getElementById("savedSites");

        if (!container) return;

        container.innerHTML = "";

        const websites = getWebsites();

        websites.forEach((site, index) => {
            const button =
                document.createElement("button");

            button.className =
                "website-item";

            button.textContent =
                site.name;

            button.title =
                site.url;

            button.addEventListener(
                "click",
                () => {
                    const urlInput =
                        document.getElementById(
                            "urlInput"
                        );

                    const frame =
                        document.getElementById(
                            "websiteFrame"
                        );

                    if (urlInput) {
                        urlInput.value =
                            site.url;
                    }

                    if (
                        typeof loadWebsite ===
                        "function"
                    ) {
                        loadWebsite();
                    } else if (frame) {
                        frame.src = site.url;
                    }
                }
            );

            button.addEventListener(
                "contextmenu",
                event => {
                    event.preventDefault();

                    if (
                        confirm(
                            `Delete "${site.name}"?`
                        )
                    ) {
                        const websites =
                            getWebsites();

                        websites.splice(
                            index,
                            1
                        );

                        saveWebsites(
                            websites
                        );

                        renderWebsites();
                    }
                }
            );

            container.appendChild(
                button
            );
        });
    }

    window.saveCurrentWebsite =
        function () {
            const input =
                document.getElementById(
                    "urlInput"
                );

            if (!input) return;

            let url =
                input.value.trim();

            if (!url) {
                alert(
                    "Enter a website URL first."
                );
                return;
            }

            if (
                !url.startsWith(
                    "http://"
                ) &&
                !url.startsWith(
                    "https://"
                )
            ) {
                url =
                    "https://" +
                    url;
            }

            let parsedUrl;

            try {
                parsedUrl =
                    new URL(url);
            } catch {
                alert(
                    "Invalid website URL."
                );
                return;
            }

            let name = prompt(
                "Website Name:",
                parsedUrl.hostname
            );

            if (
                !name ||
                !name.trim()
            ) {
                name =
                    parsedUrl.hostname;
            }

            const websites =
                getWebsites();

            const duplicate =
                websites.some(
                    site =>
                        site.url ===
                        parsedUrl.href
                );

            if (duplicate) {
                alert(
                    "Website already saved."
                );
                return;
            }

            websites.push({
                name: name.trim(),
                url: parsedUrl.href
            });

            saveWebsites(
                websites
            );

            renderWebsites();

            alert(
                "Website saved successfully!"
            );
        };

    document.addEventListener(
        "DOMContentLoaded",
        renderWebsites
    );
})();
