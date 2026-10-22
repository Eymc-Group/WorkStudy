/*
 * WorkStudy themes
 * One shared theme table. Every page that loads this file gets the saved theme
 * applied immediately (no flash), and index.html's settings panel calls
 * setTheme(name) to change it.
 *
 * To add a theme: add one entry to THEMES, then add a button for it in index.html.
 */

const THEMES = {
    blue: {
        bg: "radial-gradient(circle at top left,#3b82f640 0%,transparent 35%), radial-gradient(circle at bottom right,#2563eb40 0%,transparent 35%), #0f172a",
        c1: "#2563eb", c2: "#60a5fa", text: "#dbeafe", input: "#2563eb",
        glow: "0 0 20px rgba(59,130,246,.5), 0 0 40px rgba(59,130,246,.3)",
        panel: "#0a1b4d"
    },
    green: {
        bg: "radial-gradient(circle at top left,#22c55e40 0%,transparent 35%), radial-gradient(circle at bottom right,#16a34a40 0%,transparent 35%), #052e16",
        c1: "#16a34a", c2: "#4ade80", text: "#dcfce7", input: "#16a34a",
        glow: "0 0 20px rgba(34,197,94,.5), 0 0 40px rgba(34,197,94,.3)",
        panel: "#08381d"
    },
    red: {
        bg: "radial-gradient(circle at top left,#ef444440 0%,transparent 35%), radial-gradient(circle at bottom right,#dc262640 0%,transparent 35%), #2b0a0a",
        c1: "#dc2626", c2: "#f87171", text: "#fee2e2", input: "#dc2626",
        glow: "0 0 20px rgba(239,68,68,.5), 0 0 40px rgba(239,68,68,.3)",
        panel: "#4a1010"
    },
    orange: {
        bg: "radial-gradient(circle at top left,#f9731640 0%,transparent 35%), radial-gradient(circle at bottom right,#fb923c40 0%,transparent 35%), #2c1204",
        c1: "#ea580c", c2: "#fb923c", text: "#ffedd5", input: "#ea580c",
        glow: "0 0 20px rgba(249,115,22,.5), 0 0 40px rgba(249,115,22,.3)",
        panel: "#3d1a08"
    },
    yellow: {
        bg: "radial-gradient(circle at top left,#eab30840 0%,transparent 35%), radial-gradient(circle at bottom right,#facc1540 0%,transparent 35%), #302100",
        c1: "#ca8a04", c2: "#facc15", text: "#fef9c3", input: "#ca8a04",
        glow: "0 0 20px rgba(250,204,21,.5), 0 0 40px rgba(250,204,21,.3)",
        panel: "#3f2d00"
    },
    pink: {
        bg: "radial-gradient(circle at top left,#ec489940 0%,transparent 35%), radial-gradient(circle at bottom right,#f472b640 0%,transparent 35%), #2b0d1b",
        c1: "#db2777", c2: "#f472b6", text: "#fce7f3", input: "#db2777",
        glow: "0 0 20px rgba(236,72,153,.5), 0 0 40px rgba(236,72,153,.3)",
        panel: "#3d1328"
    },
    cyan: {
        bg: "radial-gradient(circle at top left,#06b6d440 0%,transparent 35%), radial-gradient(circle at bottom right,#22d3ee40 0%,transparent 35%), #082f49",
        c1: "#0891b2", c2: "#22d3ee", text: "#cffafe", input: "#0891b2",
        glow: "0 0 20px rgba(34,211,238,.5), 0 0 40px rgba(34,211,238,.3)",
        panel: "#0b3a5a"
    },
    teal: {
        bg: "radial-gradient(circle at top left,#14b8a640 0%,transparent 35%), radial-gradient(circle at bottom right,#2dd4bf40 0%,transparent 35%), #042f2e",
        c1: "#0f766e", c2: "#2dd4bf", text: "#ccfbf1", input: "#0f766e",
        glow: "0 0 20px rgba(45,212,191,.5), 0 0 40px rgba(45,212,191,.3)",
        panel: "#063f3c"
    },
    purple: {
        bg: "radial-gradient(circle at top left,#8b5cf640 0%,transparent 35%), radial-gradient(circle at bottom right,#a855f740 0%,transparent 35%), #1a0d24",
        c1: "#6b21a8", c2: "#a855f7", text: "#ead5ff", input: "#2b1f3d",
        glow: "0 0 20px rgba(168,85,247,.5), 0 0 40px rgba(168,85,247,.3)",
        panel: "#1c1328"
    },
    indigo: {
        bg: "radial-gradient(circle at top left,#6366f140 0%,transparent 35%), radial-gradient(circle at bottom right,#818cf840 0%,transparent 35%), #15172f",
        c1: "#4f46e5", c2: "#818cf8", text: "#e0e7ff", input: "#4f46e5",
        glow: "0 0 20px rgba(99,102,241,.5), 0 0 40px rgba(99,102,241,.3)",
        panel: "#1e2142"
    },
    lime: {
        bg: "radial-gradient(circle at top left,#84cc1640 0%,transparent 35%), radial-gradient(circle at bottom right,#a3e63540 0%,transparent 35%), #1c2b04",
        c1: "#65a30d", c2: "#a3e635", text: "#ecfccb", input: "#65a30d",
        glow: "0 0 20px rgba(163,230,53,.5), 0 0 40px rgba(163,230,53,.3)",
        panel: "#263d07"
    },
    minecraft: {
        bg: "radial-gradient(circle at top left,#65a30d40 0%,transparent 35%), radial-gradient(circle at bottom right,#16a34a40 0%,transparent 35%), #1a1a1a",
        c1: "#5E7C16", c2: "#22c55e", text: "#eaffea", input: "#5E7C16",
        glow: "0 0 20px rgba(34,197,94,.6), 0 0 40px rgba(34,197,94,.4)",
        panel: "#232323"
    },
    discord: {
        bg: "radial-gradient(circle at top left,#5865f240 0%,transparent 35%), radial-gradient(circle at bottom right,#7289da40 0%,transparent 35%), #111827",
        c1: "#5865F2", c2: "#7289DA", text: "#e0e7ff", input: "#5865F2",
        glow: "0 0 20px rgba(88,101,242,.5), 0 0 40px rgba(88,101,242,.3)",
        panel: "#1a2233"
    },
    void: {
        bg: "#000000",
        c1: "#111111", c2: "#333333", text: "#ffffff", input: "#111111",
        glow: "0 0 20px rgba(255,255,255,.2), 0 0 40px rgba(255,255,255,.1)",
        panel: "#0a0a0a"
    }
};

const DEFAULT_THEME = "purple";

/* Sets the theme colors as CSS variables; style.css does the rest. */
function applyTheme(name) {

    const t = THEMES[name] || THEMES[DEFAULT_THEME];
    const root = document.documentElement.style;

    root.setProperty("--bg", t.bg);
    root.setProperty("--c1", t.c1);
    root.setProperty("--c2", t.c2);
    root.setProperty("--text", t.text);
    root.setProperty("--glow", t.glow);
    root.setProperty("--input", t.input);
    root.setProperty("--panel", t.panel);
}

/* Called by the theme buttons in index.html. */
function setTheme(name) {

    if (!THEMES[name]) name = DEFAULT_THEME;

    applyTheme(name);

    try {
        localStorage.setItem("workstudy-theme", name);
    } catch (e) {}
}

/* Apply the saved theme right away so there is no color flash on page load. */
(function () {

    let saved = null;

    try {
        saved = localStorage.getItem("workstudy-theme");
    } catch (e) {}

    applyTheme(saved);
})();
