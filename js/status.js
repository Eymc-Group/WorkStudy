(function () {
    "use strict";

    function updateTime() {
        const time = document.getElementById("time");
        const currentTime = new Date().toLocaleTimeString();

        if (time) {
            time.textContent = "🕒 " + currentTime;
        }

        const timeCard = document.getElementById("timeCard");
        if (timeCard) {
            timeCard.textContent = "🕒 " + currentTime;
        }
    }

    function updateBrowserInfo() {
        const browserCard = document.getElementById("browserCard");
        const platformCard = document.getElementById("platformCard");

        let browser = "Unknown";
        const ua = navigator.userAgent || "";

        if (ua.includes("Edg")) {
            browser = "Microsoft Edge";
        } else if (ua.includes("Chrome")) {
            browser = "Google Chrome";
        } else if (ua.includes("Firefox")) {
            browser = "Firefox";
        } else if (ua.includes("Safari")) {
            browser = "Safari";
        }

        if (browserCard) {
            browserCard.textContent = "🌐 " + browser;
        }

        if (platformCard) {
            platformCard.textContent = "💻 " + (navigator.platform || "Unknown");
        }
    }

    async function updateBatteryInfo() {
        if (!("getBattery" in navigator)) {
            return;
        }

        try {
            const battery = await navigator.getBattery();

            function render() {
                const percent = Math.round((battery.level || 0) * 100);
                const batteryText = document.getElementById("battery");
                const batteryCard = document.getElementById("batteryCard");

                if (batteryText) {
                    batteryText.textContent = "🔋 " + percent + "%";
                }

                if (batteryCard) {
                    batteryCard.textContent = "🔋 " + percent + "%";
                }
            }

            render();
            battery.addEventListener("levelchange", render);
        } catch (error) {
            console.warn("Battery API unavailable:", error);
        }
    }

    window.addEventListener("DOMContentLoaded", async function () {
        updateTime();
        updateBrowserInfo();
        await updateBatteryInfo();

        setInterval(updateTime, 1000);
    });
})();
