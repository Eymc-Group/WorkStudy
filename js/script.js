window.onload = function () {

    const customizeBtn =
    document.getElementById("settingsBtn");

    const customizePanel =
        document.getElementById("customizePanel");

    if (customizeBtn && customizePanel) {

        customizeBtn.onclick = function () {
            customizePanel.classList.add(
    "open"
);

document.body.classList.add(
    "panelOpen"
);
        };

    }

    const savedTheme =
        localStorage.getItem("workstudy-theme");

    if (savedTheme) {
        setTheme(savedTheme);
    }

};

function closePanel() {
    document
    .getElementById(
        "customizePanel"
    )
    .classList.remove(
        "open"
    );

document.body.classList.remove(
    "panelOpen"
);
}

function setTheme(theme) {

    let background;
    let color1;
    let color2;
    let text;
    let glow;
    let panelColor;

    switch(theme) {

        case "blue":
            background =
                "radial-gradient(circle at top left,#3b82f640 0%,transparent 35%), radial-gradient(circle at bottom right,#2563eb40 0%,transparent 35%), #0f172a";

            color1 = "#2563eb";
            color2 = "#60a5fa";
            text = "#dbeafe";

            glow =
                "0 0 20px rgba(59,130,246,.5), 0 0 40px rgba(59,130,246,.3)";

            panelColor = "#0a1b4d";
            break;

        case "green":
            background =
                "radial-gradient(circle at top left,#22c55e40 0%,transparent 35%), radial-gradient(circle at bottom right,#16a34a40 0%,transparent 35%), #052e16";

            color1 = "#16a34a";
            color2 = "#4ade80";
            text = "#dcfce7";

            glow =
                "0 0 20px rgba(34,197,94,.5), 0 0 40px rgba(34,197,94,.3)";

            panelColor = "#08381d";
            break;

        case "red":
            background =
                "radial-gradient(circle at top left,#ef444440 0%,transparent 35%), radial-gradient(circle at bottom right,#dc262640 0%,transparent 35%), #2b0a0a";

            color1 = "#dc2626";
            color2 = "#f87171";
            text = "#fee2e2";

            glow =
                "0 0 20px rgba(239,68,68,.5), 0 0 40px rgba(239,68,68,.3)";

            panelColor = "#4a1010";
            break;

        default:
            background =
                "radial-gradient(circle at top left,#8b5cf640 0%,transparent 35%), radial-gradient(circle at bottom right,#a855f740 0%,transparent 35%), #1a0d24";

            color1 = "#6b21a8";
            color2 = "#a855f7";
            text = "#ead5ff";

            glow =
                "0 0 20px rgba(168,85,247,.5), 0 0 40px rgba(168,85,247,.3)";

            panelColor = "#1c1328";
    }

    document.body.style.background = background;

    const panel =
        document.getElementById("customizePanel");

    if (panel) {
        panel.style.background = panelColor;
    }

    const title =
        document.querySelector(".welcome h1");

    const subtitle =
        document.querySelector(".welcome p");

    if (title) {
        title.style.color = text;
        title.style.textShadow = glow;
    }

    if (subtitle) {
        subtitle.style.color = text;
    }

    document.querySelectorAll(
    ".sidebar button, .topbar button, #settingsBtn, #customizePanel button"
    ).forEach(btn => {

        btn.style.background =
            `linear-gradient(135deg, ${color1}, ${color2})`;

    });

    localStorage.setItem(
        "workstudy-theme",
        theme
    );
}
function testXHR() {

    const xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function () {

        if (xhr.readyState === 4) {

            if (xhr.status === 200) {
                alert("XMLHttpRequest works!");
            } else {
                alert("XMLHttpRequest failed.");
            }

        }

    };

    xhr.open(
        "GET",
        "https://example.com",
        true
    );

    xhr.send();

}
function testWebSocket() {

    const socket =
        new WebSocket("wss://echo.websocket.events");

    socket.onopen = function () {

        alert("WebSocket works!");

        socket.send("Hello");

    };

    socket.onerror = function () {

        alert("WebSocket blocked.");

    };

    socket.onmessage = function (event) {

        alert(
            "Received: " +
            event.data
        );

        socket.close();

    };

}
function testSSE() {

    try {

        const source =
            new EventSource(
                "https://example.com/events"
            );

        source.onopen = function () {
            alert("SSE works!");
            source.close();
        };

        source.onerror = function () {
            alert("SSE blocked.");
            source.close();
        };

    } catch {

        alert("SSE blocked.");

    }

}
function testImage() {

    const img = new Image();

    img.onload = function () {
        alert("Image requests work!");
    };

    img.onerror = function () {
        alert("Image requests blocked.");
    };

    img.src =
        "https://via.placeholder.com/1?" +
        Date.now();

}
function testScript() {

    const script =
        document.createElement("script");

    script.onload = function () {
        alert("External scripts work!");
    };

    script.onerror = function () {
        alert("External scripts blocked.");
    };

    script.src =
        "https://example.com/test.js";

    document.body.appendChild(script);

}
function testIframe() {

    const iframe =
        document.createElement("iframe");

    iframe.src =
        "https://example.com";

    iframe.onload = function () {
        alert("Iframe works!");
    };

    iframe.onerror = function () {
        alert("Iframe blocked.");
    };

    document.body.appendChild(iframe);

}
function testFetch() {

    fetch("https://example.com")

        .then(function(response) {

            if (response.ok) {

                alert("Fetch works!");

            } else {

                alert(
                    "Fetch responded with status " +
                    response.status
                );

            }

        })

        .catch(function(error) {

            alert(
                "Fetch blocked or failed: " +
                error
            );

        });

}
function testCORS() {

    fetch("https://example.com", {
        mode: "cors"
    })

    .then(function(response) {

        alert(
            "CORS allowed!\nStatus: " +
            response.status
        );

    })

    .catch(function(error) {

        alert(
            "CORS blocked:\n" +
            error.message
        );

    });

}
function testSameOrigin() {

    fetch(window.location.href)

        .then(function() {

            alert("Same-origin fetch works!");

        })

        .catch(function(error) {

            alert(
                "Same-origin failed: " +
                error
            );

        });

}
function testWorker() {

    fetch(
        "https://account-auth.354271744.workers.dev/"
    )

    .then(response => response.json())

    .then(data => {

        alert(
            JSON.stringify(data)
        );

    })

    .catch(error => {

        alert(
            "FAILED\n\n" +
            error
        );

    });

}
function testWorkerImage() {

    const img = new Image();

    img.onload = function() {
        alert("Worker reachable!");
    };

    img.onerror = function() {
        alert("Worker blocked by network/filter.");
    };

    img.src =
        "https://account-auth.354271744.workers.dev/?t=" +
        Date.now();

}
function toggleDropdown(
    id,
    arrow
) {

    const dropdown =
        document.getElementById(id);

    dropdown.classList.toggle(
        "open"
    );

    if (arrow) {

        arrow.classList.toggle(
            "rotated"
        );

    }

}
function testPWA() {

    if ("serviceWorker" in navigator) {

        alert(
            "Service Workers supported ✅"
        );

    } else {

        alert(
            "Service Workers blocked ❌"
        );

    }

}
function testServiceWorker() {

    navigator.serviceWorker
        .register("js/sw.js")

        .then(() => {

            alert(
                "Service Worker Installed ✅"
            );

        })

        .catch(error => {

            alert(
                "Service Worker Failed ❌\n\n" +
                error
            );

        });

}
