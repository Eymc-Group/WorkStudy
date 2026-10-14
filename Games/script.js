window.onload = function () {
    const container = document.getElementById("games");

    // Request Games button first
    const requestBtn = document.createElement("button");
    requestBtn.className = "btn";
    requestBtn.textContent = "🎮 Request Games";

    requestBtn.onclick = () => {
        window.open(
            "https://forms.gle/h2HKsMQeQgC4qC3b9",
            "_blank"
        );
    };

    container.appendChild(requestBtn);

    // Load games from games.js
    games.forEach(game => {
        const btn = document.createElement("button");

        btn.className = "btn";
        btn.textContent = game.name;

        btn.onclick = () => {
            window.location.href = game.url;
        };

        container.appendChild(btn);
    });
};