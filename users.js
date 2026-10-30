let userId = localStorage.getItem("userId");

if (!userId) {
    userId = crypto.randomUUID();
    localStorage.setItem("userId", userId);
}

async function updateOnlineCount() {
    try {
        const res = await fetch(
            `https://online-counter.354271744.workers.dev/?id=${userId}`
        );

        const data = await res.json();

        document.getElementById("onlineUsers").innerHTML =
            `🟢 <strong>${data.online}</strong> Online`;
    } catch {
        document.getElementById("onlineUsers").textContent =
            "🔴 Offline";
    }
}

updateOnlineCount();
setInterval(updateOnlineCount, 30000);
