document.body.innerHTML = `
<a class="home-btn" href="index.html">🏠 Back to Homepage</a>

<div id="mod-access">
    <input type="text" id="codeInput" placeholder="Code">
    <button id="goBtn">Go</button>
    <p id="error"></p>
    <a href="index.html" id="mod-btn">Mod</a>
</div>

<div class="container">
    <h1>Proxies</h1>
    <p class="subtitle">Sorry no sites rn</p>

    <div class="button-container">
        https://forms.gle/SD4h3Re8ku51aLJU7
            Know a Proxy(ies)? Tell us here!
        </a>
    </div>
</div>
`;

const style = document.createElement("style");
style.textContent = `
*{
    margin:0;
    padding:0;
    box-sizing:border-box;
}

body{
    background:#1b1525;
    color:white;
    font-family:Arial,sans-serif;
    min-height:100vh;
    display:flex;
    justify-content:center;
    align-items:center;
    padding:100px 20px 40px;
}

.home-btn{
    position:absolute;
    top:20px;
    left:20px;
    background:#7d56c2;
    color:white;
    text-decoration:none;
    padding:12px 20px;
    border-radius:12px;
    font-weight:bold;
}

.container{
    width:100%;
    text-align:center;
}

h1{
    color:#b68cff;
    font-size:4rem;
    margin-bottom:10px;
}

.subtitle{
    color:#d0c4ff;
    margin-bottom:50px;
    font-size:1.2rem;
}

.button-container{
    display:flex;
    justify-content:center;
}

.btn{
    background:#7d56c2;
    color:white;
    text-decoration:none;
    padding:18px 30px;
    border-radius:12px;
    font-size:1.2rem;
    font-weight:bold;
}

#mod-access{
    position:fixed;
    top:10px;
    right:10px;
    text-align:right;
    z-index:9999;
}

#codeInput{
    width:70px;
    padding:4px;
}

#goBtn{
    padding:4px 8px;
}

#error{
    color:red;
    font-size:10px;
    max-width:120px;
}

#mod-btn{
    display:block;
    font-size:10px;
    color:white;
    text-decoration:none;
    margin-top:3px;
}
`;

document.head.appendChild(style);

document.getElementById("goBtn").addEventListener("click", () => {
    const code = document.getElementById("codeInput").value.trim();

    if (
        code === "4455" ||
        code === "7728" ||
        code === "8389"
    ) {
        window.location.href = "index.html";
    } else {
        document.getElementById("error").textContent =
            "Error: Code is invalid.";
    }
});document.body.innerHTML = `
<a class="home-btn" href="index.html">🏠 Back to Homepage</a>

<div id="mod-access">
    <input type="text" id="codeInput" placeholder="Code">
    <button id="goBtn">Go</button>
    <p id="error"></p>
    <a href="index.html" id="mod-btn">Mod</a>
</div>

<div class="container">
    <h1>Proxies</h1>
    <p class="subtitle">Sorry no sites rn</p>

    <div class="button-container">
        https://forms.gle/SD4h3Re8ku51aLJU7
            Know a Proxy(ies)? Tell us here!
        </a>
    </div>
</div>
`;

const style = document.createElement("style");
style.textContent = `
*{
    margin:0;
    padding:0;
    box-sizing:border-box;
}

body{
    background:#1b1525;
    color:white;
    font-family:Arial,sans-serif;
    min-height:100vh;
    display:flex;
    justify-content:center;
    align-items:center;
    padding:100px 20px 40px;
}

.home-btn{
    position:absolute;
    top:20px;
    left:20px;
    background:#7d56c2;
    color:white;
    text-decoration:none;
    padding:12px 20px;
    border-radius:12px;
    font-weight:bold;
}

.container{
    width:100%;
    text-align:center;
}

h1{
    color:#b68cff;
    font-size:4rem;
    margin-bottom:10px;
}

.subtitle{
    color:#d0c4ff;
    margin-bottom:50px;
    font-size:1.2rem;
}

.button-container{
    display:flex;
    justify-content:center;
}

.btn{
    background:#7d56c2;
    color:white;
    text-decoration:none;
    padding:18px 30px;
    border-radius:12px;
    font-size:1.2rem;
    font-weight:bold;
}

#mod-access{
    position:fixed;
    top:10px;
    right:10px;
    text-align:right;
    z-index:9999;
}

#codeInput{
    width:70px;
    padding:4px;
}

#goBtn{
    padding:4px 8px;
}

#error{
    color:red;
    font-size:10px;
    max-width:120px;
}

#mod-btn{
    display:block;
    font-size:10px;
    color:white;
    text-decoration:none;
    margin-top:3px;
}
`;

document.head.appendChild(style);

document.getElementById("goBtn").addEventListener("click", () => {
    const code = document.getElementById("codeInput").value.trim();

    if (
        code === "4455" ||
        code === "7728" ||
        code === "8389"
    ) {
        window.location.href = "index.html";
    } else {
        document.getElementById("error").textContent =
            "Error: Code is invalid.";
    }
});
