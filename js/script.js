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
function clearWebsiteData() {
    const confirmed = confirm(
        "⚠️ This will delete:\n\n" +
        "• Saved websites\n" +
        "• Settings\n" +
        "• Cached preferences\n\n" +
        "Continue?"
    );

    if (!confirmed) return;

    const theme = localStorage.getItem("workstudy-theme");

    localStorage.clear();

    if (theme) {
        localStorage.setItem("workstudy-theme", theme);
    }

    alert("✅ Website data cleared.");

    location.reload();
}
}
