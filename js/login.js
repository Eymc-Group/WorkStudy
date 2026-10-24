(function () {
    "use strict";

    const API_URL =
        "https://workstudy-api.354271744.workers.dev/login";

    function initializeLogin() {
        const loginInput =
            document.getElementById("login");

        const passwordInput =
            document.getElementById("password");

        const loginButton =
            document.getElementById("loginBtn");

        const statusElement =
            document.getElementById("status");

        if (
            !loginInput ||
            !passwordInput ||
            !loginButton ||
            !statusElement
        ) {
            console.error(
                "Login page elements could not be found."
            );

            return;
        }

        function setStatus(message) {
            statusElement.textContent = message;
        }

        async function loginUser() {
            const login =
                loginInput.value.trim();

            const password =
                passwordInput.value;

            if (!login) {
                setStatus(
                    "Enter a username or email."
                );

                loginInput.focus();
                return;
            }

            if (!password) {
                setStatus(
                    "Enter a password."
                );

                passwordInput.focus();
                return;
            }

            loginButton.disabled = true;
            setStatus("Logging in...");

            try {
                const response = await fetch(
                    API_URL,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({
                            username: login,
                            password: password
                        })
                    }
                );

                const responseText =
                    await response.text();

                let data;

                try {
                    data =
                        JSON.parse(responseText);
                } catch {
                    console.error(
                        "Invalid API response:",
                        responseText
                    );

                    throw new Error(
                        "The API returned invalid data."
                    );
                }

                if (
                    !response.ok ||
                    !data.success
                ) {
                    setStatus(
                        data.message ||
                        "Login failed."
                    );

                    return;
                }

                if (!data.token) {
                    throw new Error(
                        "The API did not return a login token."
                    );
                }

                const account = {
                    username:
                        data.username || login,

                    email:
                        data.email || null
                };

                let saved = false;

                if (
                    window.WorkStudyAuth &&
                    typeof window.WorkStudyAuth
                        .setCurrentUser ===
                        "function"
                ) {
                    saved =
                        window.WorkStudyAuth
                            .setCurrentUser(
                                account
                            );
                }

                if (!saved) {
                    localStorage.setItem(
                        "workstudy-user",
                        JSON.stringify(account)
                    );
                }

                localStorage.setItem(
                    "workstudy-account",
                    JSON.stringify(account)
                );

                localStorage.setItem(
                    "workstudy-token",
                    data.token
                );

                setStatus(
                    "Login successful!"
                );

                window.setTimeout(
                    function () {
                        window.location.href =
                            "../index.html";
                    },
                    1000
                );

            } catch (error) {
                console.error(
                    "Login request failed:",
                    error
                );

                setStatus(
                    error.message ||
                    "Connection failed."
                );

            } finally {
                loginButton.disabled = false;
            }
        }

        loginButton.addEventListener(
            "click",
            loginUser
        );

        passwordInput.addEventListener(
            "keydown",
            function (event) {
                if (event.key === "Enter") {
                    event.preventDefault();
                    loginUser();
                }
            }
        );

        setStatus("");
    }

    if (
        document.readyState === "loading"
    ) {
        document.addEventListener(
            "DOMContentLoaded",
            initializeLogin
        );
    } else {
        initializeLogin();
    }
})();
