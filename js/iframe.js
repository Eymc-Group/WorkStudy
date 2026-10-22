function loadWebsite() {

    let url =
        document.getElementById("urlInput").value.trim();

    if (url === "") {
        alert("Enter a website URL.");
        return;
    }

    if (
        !url.startsWith("https://") &&
        !url.startsWith("http://")
    ) {
        url = "https://" + url;
    }

    document.getElementById("websiteFrame").src = url;
}

window.onload = function () {

    const urlInput =
        document.getElementById("urlInput");

    if (urlInput) {

        urlInput.addEventListener("keydown", function(event) {

            if (event.key === "Enter") {
                loadWebsite();
            }

        });

    }

};
