window.onload = function () {

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

        button.onclick =
            function () {

                location.href =
                    game.path;

            };

        gamesGrid.appendChild(
            button
        );

    });

};