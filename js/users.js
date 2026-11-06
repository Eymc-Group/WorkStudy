(() => {
    "use strict";

    const WORKER_URL =
        "https://online-counter.354271744.workers.dev/";

    let userId =
        localStorage.getItem("userId");

    if (!userId) {
        userId = crypto.randomUUID();

        localStorage.setItem(
            "userId",
            userId
        );
    }

    async function updateOnlineUsers() {
        const element =
            document.getElementById(
                "onlineUsers"
            );

        if (!element) return;

        try {
            const response =
                await fetch(
                    `${WORKER_URL}?id=${userId}`
                );

            const data =
                await response.json();

            element.innerHTML =
                `🟢 ${data.online} Online`;
        } catch (error) {
            console.error(error);

            element.innerHTML =
                "🔴 Offline";
        }
    }

    updateOnlineUsers();

    setInterval(
        updateOnlineUsers,
        30000
    );
})();
