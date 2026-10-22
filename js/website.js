const websiteBtn = document.getElementById("websiteBtn");
const websitePanel = document.getElementById("websitePanel");
const websiteList = document.getElementById("websiteList");
const addWebsiteBtn = document.getElementById("addWebsiteBtn");
const websiteFrame = document.getElementById("websiteFrame");

websiteBtn.addEventListener("click", () => {
    websitePanel.classList.toggle("open");
});

function getWebsites() {
    return JSON.parse(localStorage.getItem("savedWebsites")) || [];
}

function saveWebsites(websites) {
    localStorage.setItem("savedWebsites", JSON.stringify(websites));
}

function renderWebsites() {
    websiteList.innerHTML = "";

    getWebsites().forEach((site, index) => {
        const btn = document.createElement("button");

        btn.className = "website-item";
        btn.textContent = site.name;

        btn.addEventListener("click", () => {
            websiteFrame.src = site.url;
        });

        btn.addEventListener("contextmenu", (e) => {
            e.preventDefault();

            if (confirm(`Delete "${site.name}"?`)) {
                const websites = getWebsites();
                websites.splice(index, 1);
                saveWebsites(websites);
                renderWebsites();
            }
        });

        websiteList.appendChild(btn);
    });
}

addWebsiteBtn.addEventListener("click", () => {
    let url = prompt("Website URL:");

    if (!url) return;

    if (!url.startsWith("http://") && !url.startsWith("https://")) {
        url = "https://" + url;
    }

    let name = prompt("Website Name:");

    if (!name || name.trim() === "") {
        name = new URL(url).hostname;
    }

    const websites = getWebsites();

    websites.push({
        name,
        url
    });

    saveWebsites(websites);
    renderWebsites();
});

renderWebsites();
