window.onload = function () {

    const savedTheme =
        localStorage.getItem("workstudy-theme");

    let background;
    let color1;
    let color2;
    let text;
    let glow;

    switch(savedTheme) {

        case "blue":
            background =
                "radial-gradient(circle at top left,#3b82f640 0%,transparent 35%), radial-gradient(circle at bottom right,#2563eb40 0%,transparent 35%), #0f172a";

            color1 = "#2563eb";
            color2 = "#60a5fa";
            text = "#dbeafe";
            glow =
                "0 0 20px rgba(59,130,246,.5), 0 0 40px rgba(59,130,246,.3)";
            break;

        case "green":
            background =
                "radial-gradient(circle at top left,#22c55e40 0%,transparent 35%), radial-gradient(circle at bottom right,#16a34a40 0%,transparent 35%), #052e16";

            color1 = "#16a34a";
            color2 = "#4ade80";
            text = "#dcfce7";
            glow =
                "0 0 20px rgba(34,197,94,.5), 0 0 40px rgba(34,197,94,.3)";
            break;

        case "red":
            background =
                "radial-gradient(circle at top left,#ef444440 0%,transparent 35%), radial-gradient(circle at bottom right,#dc262640 0%,transparent 35%), #2b0a0a";

            color1 = "#dc2626";
            color2 = "#f87171";
            text = "#fee2e2";
            glow =
                "0 0 20px rgba(239,68,68,.5), 0 0 40px rgba(239,68,68,.3)";
            break;

        default:
            background =
                "radial-gradient(circle at top left,#8b5cf640 0%,transparent 35%), radial-gradient(circle at bottom right,#a855f740 0%,transparent 35%), #1a0d24";

            color1 = "#6b21a8";
            color2 = "#a855f7";
            text = "#ead5ff";
            glow =
                "0 0 20px rgba(168,85,247,.5), 0 0 40px rgba(168,85,247,.3)";
    }

    document.body.style.background = background;

    document.querySelectorAll(".gameCard").forEach(card => {
        card.style.background =
            `linear-gradient(135deg, ${color1}, ${color2})`;
    });

    document.querySelectorAll(".sidebar button").forEach(button => {
        button.style.background =
            `linear-gradient(135deg, ${color1}, ${color2})`;
    });

    document.querySelectorAll(".topbar button").forEach(button => {
        button.style.background =
            `linear-gradient(135deg, ${color1}, ${color2})`;
    });

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

    const searchBar =
        document.getElementById("searchBar");

    if (searchBar) {
        searchBar.style.background = color1;
    }

};