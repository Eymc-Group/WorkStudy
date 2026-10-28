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
    function showTestResult(name, passed, details) {
    const symbol =
        passed ? "✅" : "❌";

    const message =
        `${symbol} ${name}\n\n${details}`;

    console.log(message);
    window.alert(message);
}

async function testFetch() {
    try {
        const response =
            await fetch(
                window.location.href,
                {
                    method: "GET",
                    cache: "no-store"
                }
            );

        showTestResult(
            "Fetch",
            response.ok,
            `Status: ${response.status}`
        );
    } catch (error) {
        showTestResult(
            "Fetch",
            false,
            error.message
        );
    }
}

function testXHR() {
    const request =
        new XMLHttpRequest();

    request.open(
        "GET",
        window.location.href,
        true
    );

    request.onload =
        function () {
            showTestResult(
                "XMLHttpRequest",
                request.status >= 200 &&
                    request.status < 400,
                `Status: ${request.status}`
            );
        };

    request.onerror =
        function () {
            showTestResult(
                "XMLHttpRequest",
                false,
                "The request failed."
            );
        };

    request.send();
}

function testWebSocket() {
    const supported =
        "WebSocket" in window;

    showTestResult(
        "WebSocket",
        supported,
        supported
            ? "WebSocket is supported by this browser."
            : "WebSocket is not supported."
    );
}

function testSSE() {
    const supported =
        "EventSource" in window;

    showTestResult(
        "Server-Sent Events",
        supported,
        supported
            ? "EventSource is supported by this browser."
            : "EventSource is not supported."
    );
}

function testImage() {
    const image =
        new Image();

    image.onload =
        function () {
            showTestResult(
                "Image Loading",
                true,
                "The WorkStudy favicon loaded successfully."
            );
        };

    image.onerror =
        function () {
            showTestResult(
                "Image Loading",
                false,
                "The WorkStudy favicon could not be loaded."
            );
        };

    image.src =
        new URL(
            "img/favicon.png",
            window.location.href
        ).href +
        `?test=${Date.now()}`;
}

function testScript() {
    const script =
        document.createElement(
            "script"
        );

    script.onload =
        function () {
            showTestResult(
                "Script Loading",
                true,
                "The test script loaded successfully."
            );

            script.remove();
        };

    script.onerror =
        function () {
            showTestResult(
                "Script Loading",
                false,
                "The test script could not be loaded."
            );

            script.remove();
        };

    script.src =
        new URL(
            "js/status.js",
            window.location.href
        ).href +
        `?test=${Date.now()}`;

    document.head.appendChild(
        script
    );
}

function testIframe() {
    const iframe =
        document.createElement(
            "iframe"
        );

    iframe.hidden = true;
    iframe.title = "Iframe Test";
    iframe.src = "about:blank";

    iframe.onload =
        function () {
            showTestResult(
                "Iframe",
                true,
                "The test iframe loaded successfully."
            );

            iframe.remove();
        };

    iframe.onerror =
        function () {
            showTestResult(
                "Iframe",
                false,
                "The test iframe failed to load."
            );

            iframe.remove();
        };

    document.body.appendChild(
        iframe
    );
}

async function testCORS() {
    try {
        const response =
            await fetch(
                "https://workstudy-api.354271744.workers.dev/",
                {
                    method: "GET",
                    cache: "no-store"
                }
            );

        showTestResult(
            "CORS",
            response.ok,
            `API status: ${response.status}`
        );
    } catch (error) {
        showTestResult(
            "CORS",
            false,
            error.message
        );
    }
}

function testSameOrigin() {
    try {
        const testUrl =
            new URL(
                window.location.href
            );

        const passed =
            testUrl.origin ===
            window.location.origin;

        showTestResult(
            "Same-Origin",
            passed,
            `Current origin: ${window.location.origin}`
        );
    } catch (error) {
        showTestResult(
            "Same-Origin",
            false,
            error.message
        );
    }
}

function testWorker() {
    const supported =
        "Worker" in window;

    showTestResult(
        "Web Worker",
        supported,
        supported
            ? "Web Workers are supported by this browser."
            : "Web Workers are not supported."
    );
}

function testWorkerImage() {
    const supported =
        "Worker" in window &&
        "ImageBitmap" in window;

    showTestResult(
        "Worker Image",
        supported,
        supported
            ? "Workers and ImageBitmap are supported."
            : "Worker image processing is not fully supported."
    );
}

function testPWA() {
    const hasManifest =
        Boolean(
            document.querySelector(
                'link[rel="manifest"]'
            )
        );

    const hasServiceWorker =
        "serviceWorker" in navigator;

    showTestResult(
        "PWA",
        hasManifest &&
            hasServiceWorker,
        [
            `Manifest: ${
                hasManifest
                    ? "Found"
                    : "Missing"
            }`,
            `Service Worker support: ${
                hasServiceWorker
                    ? "Yes"
                    : "No"
            }`
        ].join("\n")
    );
}

async function testServiceWorker() {
    if (
        !("serviceWorker" in navigator)
    ) {
        showTestResult(
            "Service Worker",
            false,
            "Service workers are not supported."
        );

        return;
    }

    try {
        const registrations =
            await navigator
                .serviceWorker
                .getRegistrations();

        showTestResult(
            "Service Worker",
            true,
            registrations.length > 0
                ? `${registrations.length} registration(s) found.`
                : "Supported, but no service worker is registered."
        );
    } catch (error) {
        showTestResult(
            "Service Worker",
            false,
            error.message
        );
    }
}

window.testFetch =
    testFetch;

window.testXHR =
    testXHR;

window.testWebSocket =
    testWebSocket;

window.testSSE =
    testSSE;

window.testImage =
    testImage;

window.testScript =
    testScript;

window.testIframe =
    testIframe;

window.testCORS =
    testCORS;

window.testSameOrigin =
    testSameOrigin;

window.testWorker =
    testWorker;

window.testWorkerImage =
    testWorkerImage;

window.testPWA =
    testPWA;

window.testServiceWorker =
    testServiceWorker;
})();
