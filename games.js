window.onload = function () {
    const games = [
        { name: "Slope", url: "slope.html" },
        { name: "Retro Bowl", url: "retrobowl.html" }
    ];

    const searchBar = document.getElementById("search");
    const results = document.getElementById("results");

    function displayGames(gameList) {
        results.innerHTML = "";

        gameList.forEach(game => {
            const div = document.createElement("div");
            div.className = "result";
            div.textContent = game.name;

            div.onclick = () => {
                window.location.href = game.url;
            };

            results.appendChild(div);
        });
    }

    displayGames(games);

    searchBar.addEventListener("input", function () {
        const search = this.value.toLowerCase();

        const filteredGames = games.filter(game =>
            game.name.toLowerCase().includes(search)
        );

        displayGames(filteredGames);
    });
};