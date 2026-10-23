<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Website Iframe</title>
    <link rel="icon" href="../img/website.png">
    <script src="../js/color.js" defer></script>
    <script src="../js/iframe.js" defer></script>
    <script src="../js/website.js" defer></script>
    <link rel="stylesheet" href="../css/style.css">
</head>
<body>
    <div class="welcome">
        <h1>Website Iframe</h1>
        <p>Enter a website URL below to view it inside an iframe.</p>
    </div>

    <div class="topbar">
        <input type="text" id="urlInput" placeholder="https://example.com">
        <button type="button" onclick="loadWebsite()">🌐 Open</button>
        <button type="button" onclick="location.href='../index.html'">🏠 Home</button>
    </div>

    <iframe id="websiteFrame" title="Website preview"></iframe>
</body>
</html>
