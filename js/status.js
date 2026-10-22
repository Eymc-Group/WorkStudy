window.addEventListener(
    "load",
    async function () {

        function updateTime() {

            const timeCard =
                document.getElementById(
                    "timeCard"
                );

            const time =
                document.getElementById(
                    "time"
                );

            const currentTime =
                new Date()
                .toLocaleTimeString();

            if (timeCard) {

                timeCard.textContent =
                    "🕒 " +
                    currentTime;

            }

            if (time) {

                time.textContent =
                    "🕒 " +
                    currentTime;

            }

        }

        updateTime();

        setInterval(
            updateTime,
            1000
        );

        let browser =
            "Unknown";

        if (
            navigator.userAgent
                .includes(
                    "Edg"
                )
        ) {

            browser =
                "Microsoft Edge";

        }
        else if (
            navigator.userAgent
                .includes(
                    "Chrome"
                )
        ) {

            browser =
                "Google Chrome";

        }
        else if (
            navigator.userAgent
                .includes(
                    "Firefox"
                )
        ) {

            browser =
                "Firefox";

        }
        else if (
            navigator.userAgent
                .includes(
                    "Safari"
                )
        ) {

            browser =
                "Safari";

        }

        const browserCard =
            document.getElementById(
                "browserCard"
            );

        if (
            browserCard
        ) {

            browserCard.textContent =
                "🌐 " +
                browser;

        }

        const platformCard =
            document.getElementById(
                "platformCard"
            );

        if (
            platformCard
        ) {

            platformCard.textContent =
                "💻 " +
                navigator.platform;

        }

        if (
            "getBattery"
            in navigator
        ) {

            const battery =
                await navigator
                    .getBattery();

            function updateBattery() {

                const percent =
                    Math.round(
                        battery.level *
                        100
                    );

                const batteryCard =
                    document.getElementById(
                        "batteryCard"
                    );

                const batteryText =
                    document.getElementById(
                        "battery"
                    );

                if (
                    batteryCard
                ) {

                    batteryCard.textContent =
                        "🔋 " +
                        percent +
                        "%";

                }

                if (
                    batteryText
                ) {

                    batteryText.textContent =
                        "🔋 " +
                        percent +
                        "%";

                }

            }

            updateBattery();

            battery.addEventListener(
                "levelchange",
                updateBattery
            );

        }

    }
);