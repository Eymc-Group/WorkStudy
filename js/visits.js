(function () {
    "use strict";

    const VISITS_API =
        "https://workstudy-visits.354271744.workers.dev";

    async function recordVisit() {
        const counter =
            document.getElementById(
                "visitCount"
            );

        if (!counter) {
            return;
        }

        counter.textContent =
            "Loading total visits...";

        try {
            const response = await fetch(
                `${VISITS_API}/visit`,
                {
                    method: "POST"
                }
            );

            const data =
                await response.json();

            if (
                !response.ok ||
                !data.success
            ) {
                throw new Error(
                    data.message ||
                    "Counter request failed."
                );
            }

            const formattedCount =
                Number(
                    data.visits
                ).toLocaleString();

            counter.textContent =
                `👥 Total Visits: ${formattedCount}`;

        } catch (error) {
            console.error(
                "Visit counter failed:",
                error
            );

            counter.textContent =
                "👥 Total Visits: unavailable";
        }
    }

    if (
        document.readyState === "loading"
    ) {
        document.addEventListener(
            "DOMContentLoaded",
            recordVisit
        );
    } else {
        recordVisit();
    }
})();
