class CloudSaveManager {

    constructor(apiUrl) {

        this.apiUrl =
            apiUrl ||
            "https://workstudy-saves.354271744.workers.dev";

        this.saveStatus =
            document.getElementById(
                "saveStatus"
            );
    }

    getCurrentUser() {

        try {

            if (
                window.WorkStudyAuth &&
                typeof window.WorkStudyAuth.getCurrentUser === "function"
            ) {

                return window.WorkStudyAuth.getCurrentUser();
            }

        } catch (error) {

            console.error(error);
        }

        return null;
    }

    async saveProgress() {

        try {

            const user =
                this.getCurrentUser();

            if (!user) {

                this.updateStatus(
                    "❌ Not logged in",
                    "error"
                );

                return;
            }

            this.updateStatus(
                "💾 Saving...",
                "loading"
            );

            const allData = {};

            for (
                let i = 0;
                i < localStorage.length;
                i++
            ) {

                const key =
                    localStorage.key(i);

                allData[key] =
                    localStorage.getItem(key);
            }

            const response =
                await fetch(
                    `${this.apiUrl}/api/save-progress`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type":
                                "application/json"
                        },
                        body: JSON.stringify({
                            username:
                                user.username,
                            saveData:
                                allData
                        })
                    }
                );

            if (!response.ok) {

                throw new Error(
                    "Failed to save"
                );
            }

            this.updateStatus(
                "✅ Saved!",
                "success"
            );

        } catch (error) {

            this.updateStatus(
                `❌ ${error.message}`,
                "error"
            );
        }
    }

    async loadProgress() {

        try {

            const user =
                this.getCurrentUser();

            if (!user) {

                this.updateStatus(
                    "❌ Not logged in",
                    "error"
                );

                return;
            }

            this.updateStatus(
                "📥 Loading...",
                "loading"
            );

            const response =
                await fetch(
                    `${this.apiUrl}/api/load-progress?username=${encodeURIComponent(user.username)}`
                );

            if (!response.ok) {

                throw new Error(
                    "Failed to load"
                );
            }

            const result =
                await response.json();

            if (
                confirm(
                    "⚠️ Overwrite current progress?"
                )
            ) {

                const currentUser =
                    this.getCurrentUser();

                localStorage.clear();

                if (
                    currentUser &&
                    window.WorkStudyAuth
                ) {

                    window.WorkStudyAuth.setCurrentUser(
                        currentUser
                    );
                }

                Object.entries(
                    result.saveData || {}
                ).forEach(
                    ([key, value]) => {

                        localStorage.setItem(
                            key,
                            value
                        );
                    }
                );

                this.updateStatus(
                    "✅ Loaded! Reloading...",
                    "success"
                );

                setTimeout(
                    () => location.reload(),
                    1500
                );
            }

        } catch (error) {

            this.updateStatus(
                `❌ ${error.message}`,
                "error"
            );
        }
    }

    async deleteSave() {

        try {

            const user =
                this.getCurrentUser();

            if (!user) {

                this.updateStatus(
                    "❌ Not logged in",
                    "error"
                );

                return;
            }

            if (
                !confirm(
                    "🗑️ Delete cloud save? Cannot undo!"
                )
            ) {
                return;
            }

            this.updateStatus(
                "🗑️ Deleting...",
                "loading"
            );

            const response =
                await fetch(
                    `${this.apiUrl}/api/delete-save`,
                    {
                        method: "DELETE",
                        headers: {
                            "Content-Type":
                                "application/json"
                        },
                        body: JSON.stringify({
                            username:
                                user.username
                        })
                    }
                );

            if (!response.ok) {

                throw new Error(
                    "Delete failed"
                );
            }

            this.updateStatus(
                "✅ Deleted!",
                "success"
            );

        } catch (error) {

            this.updateStatus(
                `❌ ${error.message}`,
                "error"
            );
        }
    }

    updateStatus(
        message,
        type
    ) {

        if (!this.saveStatus) {
            return;
        }

        this.saveStatus.textContent =
            message;

        this.saveStatus.style.color =
            type === "error"
                ? "#ef4444"
                : type === "success"
                ? "#22c55e"
                : "var(--text)";
    }
}

document.addEventListener(
    "DOMContentLoaded",
    () => {

        const cloudSave =
            new CloudSaveManager();

        document
            .getElementById(
                "saveProgressBtn"
            )
            ?.addEventListener(
                "click",
                () =>
                    cloudSave.saveProgress()
            );

        document
            .getElementById(
                "loadProgressBtn"
            )
            ?.addEventListener(
                "click",
                () =>
                    cloudSave.loadProgress()
            );

        document
            .getElementById(
                "deleteProgressBtn"
            )
            ?.addEventListener(
                "click",
                () =>
                    cloudSave.deleteSave()
            );
    }
);
