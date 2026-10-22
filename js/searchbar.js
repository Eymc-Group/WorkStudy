window.addEventListener(
    "load",
    function () {
    const searchBar =
        document.getElementById("searchBar");

    if (!searchBar) return;

    searchBar.addEventListener("input", function () {

        const search =
            searchBar.value.toLowerCase();

        document
            .querySelectorAll(".gameCard")
            .forEach(card => {

                const name =
                    card.textContent.toLowerCase();

                if (name.includes(search)) {
                    card.style.display = "";
                } else {
                    card.style.display = "none";
                }

            });

    });

}
);