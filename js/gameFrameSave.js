(function () {
    "use strict";

    const gameTitle =
        document.getElementById("gameTitle");

    const gameAuthor =
        document.getElementById("gameAuthor");

    const gameFrame =
        document.getElementById("websiteFrame");

    const saveGameButton =
        document.getElementById("saveGameBtn");

    const restoreGameButton =
        document.getElementById("restoreGameBtn");

    const backButton =
        document.getElementById("backToGamesBtn");

    const homeButton =
        document.getElementById("homeBtn");

    const statusElement =
        document.getElementById("gameSaveStatus");

    const gameName =
        localStorage.getItem("gameName") ||
        "Unknown Game";

    const author =
        localStorage.getItem("gameAuthor") ||
        "";

    const gameUrl =
        localStorage.getItem("gameUrl") ||
        "";

    let gameOrigin = null;
    let requestNumber = 0;
    const pendingRequests = new Map();

    function setStatus(message, type = "normal") {
        if (!statusElement) {
            return;
        }

        statusElement.textContent = message;

        if (type === "error") {
            statusElement.style.color = "#ef4444";
        } else if (type === "success") {
            statusElement.style.color = "#22c55e";
        } else {
            statusElement.style.color = "var(--text)";
        }
    }

    function createSaveKey() {
        return (
            "workstudy-game-save:" +
            encodeURIComponent(gameUrl)
        );
    }

    function createRequestId() {
        requestNumber += 1;

        return (
            "game-save-" +
            Date.now() +
            "-" +
            requestNumber
        );
    }

    function sendMessage(message) {
        if (
            !gameFrame ||
            !gameFrame.contentWindow ||
            !gameOrigin
        ) {
            throw new Error(
                "The game iframe is not ready."
            );
        }

        gameFrame.contentWindow.postMessage(
            message,
            gameOrigin
        );
    }

    function requestFromGame(type, payload = {}) {
        return new Promise(
            function (resolve, reject) {
                const requestId =
                    createRequestId();

                const timeout =
                    window.setTimeout(
                        function () {
                            pendingRequests.delete(
                                requestId
                            );

                            reject(
                                new Error(
                                    "The game did not respond. The game-save bridge may be missing."
                                )
                            );
                        },
                        10000
                    );

                pendingRequests.set(
                    requestId,
                    {
                        resolve,
                        reject,
                        timeout
                    }
                );

                try {
                    sendMessage({
                        source: "workstudy-parent",
                        type,
                        requestId,
                        payload
                    });
                } catch (error) {
                    window.clearTimeout(timeout);

                    pendingRequests.delete(
                        requestId
                    );

                    reject(error);
                }
            }
        );
    }

    async function captureGameProgress(
        showMessage = true
    ) {
        if (showMessage) {
            setStatus(
                "🎮 Saving game progress..."
            );
        }

        const response =
            await requestFromGame(
                "WORKSTUDY_EXPORT_SAVE"
            );

        const record = {
            gameName,
            gameUrl,
            savedAt:
                new Date().toISOString(),
            saveData:
                response.saveData
        };

        localStorage.setItem(
            createSaveKey(),
            JSON.stringify(record)
        );

        if (showMessage) {
            setStatus(
                "✅ Game progress saved locally. Use Save Progress to upload it to your account.",
                "success"
            );
        }

        return record;
    }

    async function restoreGameProgress() {
        const storedSave =
            localStorage.getItem(
                createSaveKey()
            );

        if (!storedSave) {
            setStatus(
                "❌ No saved progress was found for this game.",
                "error"
            );

            return;
        }

        let record;

        try {
            record =
                JSON.parse(storedSave);
        } catch {
            setStatus(
                "❌ The stored game save is damaged.",
                "error"
            );

            return;
        }

        const confirmed =
            window.confirm(
                "Restore the saved progress for this game? Current game progress may be replaced."
            );

        if (!confirmed) {
            return;
        }

        setStatus(
            "📥 Restoring game progress..."
        );

        await requestFromGame(
            "WORKSTUDY_IMPORT_SAVE",
            {
                saveData:
                    record.saveData
            }
        );

        setStatus(
            "✅ Game progress restored! Reloading the game...",
            "success"
        );

        window.setTimeout(
            function () {
                gameFrame.src = gameUrl;
            },
            800
        );
    }

    async function saveThenNavigate(destination) {
        try {
            await captureGameProgress(
                false
            );
        } catch (error) {
            console.warn(
                "Game progress could not be captured:",
                error
            );
        }

        window.location.href =
            destination;
    }

    window.addEventListener(
        "message",
        function (event) {
            if (
                !gameOrigin ||
                event.origin !== gameOrigin ||
                event.source !==
                    gameFrame.contentWindow
            ) {
                return;
            }

            const message = event.data;

            if (
                !message ||
                message.source !==
                    "workstudy-game" ||
                typeof message.requestId !==
                    "string"
            ) {
                return;
            }

            const pending =
                pendingRequests.get(
                    message.requestId
                );

            if (!pending) {
                return;
            }

            window.clearTimeout(
                pending.timeout
            );

            pendingRequests.delete(
                message.requestId
            );

            if (message.success) {
                pending.resolve(message);
            } else {
                pending.reject(
                    new Error(
                        message.error ||
                        "The game-save request failed."
                    )
                );
            }
        }
    );

    if (!gameUrl) {
        gameTitle.textContent =
            "Game Not Found";

        setStatus(
            "❌ No game URL was provided.",
            "error"
        );

        return;
    }

    try {
        gameOrigin =
            new URL(
                gameUrl,
                window.location.href
            ).origin;
    } catch {
        gameTitle.textContent =
            "Invalid Game";

        setStatus(
            "❌ The game URL is invalid.",
            "error"
        );

        return;
    }

    document.title =
        `${gameName} - WorkStudy`;

    gameTitle.textContent =
        gameName;

    if (author) {
        gameAuthor.textContent =
            `by ${author}`;
    } else {
        gameAuthor.hidden = true;
    }

    gameFrame.src =
        gameUrl;

    saveGameButton.addEventListener(
        "click",
        function () {
            captureGameProgress().catch(
                function (error) {
                    console.error(error);

                    setStatus(
                        `❌ ${error.message}`,
                        "error"
                    );
                }
            );
        }
    );

    restoreGameButton.addEventListener(
        "click",
        function () {
            restoreGameProgress().catch(
                function (error) {
                    console.error(error);

                    setStatus(
                        `❌ ${error.message}`,
                        "error"
                    );
                }
            );
        }
    );

    backButton.addEventListener(
        "click",
        function () {
            saveThenNavigate(
                "../games/index.html"
            );
        }
    );

    homeButton.addEventListener(
        "click",
        function () {
            saveThenNavigate(
                "../index.html"
            );
        }
    );

    window.setInterval(
        function () {
            captureGameProgress(
                false
            ).catch(function () {
                // The bridge may not exist yet.
            });
        },
        30000
    );
})();
