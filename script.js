async function checkPin() {
    const enteredPin = prompt("Enter PIN:");

    const response = await fetch(
        "https://workstudy-auth.354271744.workers.dev/?pin=" +
        encodeURIComponent(enteredPin)
    );

    const data = await response.json();

    if (!data.valid) {
        document.body.innerHTML = "<h1>Invalid PIN</h1>";
        return;
    }

    alert("Access Granted");
}

checkPin();

function loadSite(url) {
    document.getElementById("siteFrame").src = url;
}
function loadSite(url) {
    document.getElementById("siteFrame").src = url;
}

function addProxy() {
    const name = prompt("Proxy Name:");

    if (!name) return;

    const url = prompt("Site URL:");

    if (!url) return;

    const button = document.createElement("button");

    button.textContent = name;

    button.onclick = function () {
        loadSite(url);
    };

    document.querySelector(".sidebar").appendChild(button);

    const proxies = JSON.parse(localStorage.getItem("customProxies") || "[]");

    proxies.push({
        name: name,
        url: url
    });

    localStorage.setItem(
        "customProxies",
        JSON.stringify(proxies)
    );
}

window.addEventListener("load", () => {
    const proxies = JSON.parse(localStorage.getItem("customProxies") || "[]");

    proxies.forEach(proxy => {
        const button = document.createElement("button");

        button.textContent = proxy.name;

        button.onclick = function () {
            loadSite(proxy.url);
        };

        document.querySelector(".sidebar").appendChild(button);
    });
});