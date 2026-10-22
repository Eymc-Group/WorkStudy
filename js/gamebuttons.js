window.addEventListener(
    "load",
    function () {


    const gamesGrid =
        document.getElementById(
            "gamesGrid"
        );

    if (!gamesGrid) return;

    games.forEach(game => {

        const button =
            document.createElement(
                "button"
            );

        button.className =
            "gameCard";

        button.innerHTML =
            `<span>${game.name}</span>`;

        button.onclick = function () {

    localStorage.setItem(
        "gameUrl",
        game.path
    );

    localStorage.setItem(
        "gameName",
        game.name
    );

    location.href =
        "../pages/game.html";

};

        gamesGrid.appendChild(
            button
        );

    });

}
);