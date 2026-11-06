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
    },
    rose: {
        bg: "radial-gradient(circle at top left,#f43f5e40 0%,transparent 35%), radial-gradient(circle at bottom right,#fb718540 0%,transparent 35%), #2b0714",
        c1: "#e11d48", c2: "#fb7185", text: "#ffe4e6", input: "#e11d48",
        glow: "0 0 20px rgba(244,63,94,.5), 0 0 40px rgba(244,63,94,.3)",
        panel: "#3d0d1f"
    },
    amber: {
        bg: "radial-gradient(circle at top left,#fbbf2440 0%,transparent 35%), radial-gradient(circle at bottom right,#fcd34d40 0%,transparent 35%), #332200",
        c1: "#d97706", c2: "#fcd34d", text: "#fffbeb", input: "#d97706",
        glow: "0 0 20px rgba(251,191,36,.5), 0 0 40px rgba(251,191,36,.3)",
        panel: "#451a03"
    },
    sky: {
        bg: "radial-gradient(circle at top left,#0ea5e940 0%,transparent 35%), radial-gradient(circle at bottom right,#38bdf840 0%,transparent 35%), #0c2540",
        c1: "#0284c7", c2: "#38bdf8", text: "#e0f2fe", input: "#0284c7",
        glow: "0 0 20px rgba(56,189,248,.5), 0 0 40px rgba(56,189,248,.3)",
        panel: "#0c3a52"
    },
    slate: {
        bg: "radial-gradient(circle at top left,#64748b40 0%,transparent 35%), radial-gradient(circle at bottom right,#94a3b840 0%,transparent 35%), #0f172a",
        c1: "#475569", c2: "#94a3b8", text: "#f1f5f9", input: "#475569",
        glow: "0 0 20px rgba(148,163,184,.5), 0 0 40px rgba(148,163,184,.3)",
        panel: "#1a1f35"
    },
    emerald: {
        bg: "radial-gradient(circle at top left,#10b98140 0%,transparent 35%), radial-gradient(circle at bottom right,#34d39940 0%,transparent 35%), #031f1e",
        c1: "#059669", c2: "#34d399", text: "#d1fae5", input: "#059669",
        glow: "0 0 20px rgba(52,211,153,.5), 0 0 40px rgba(52,211,153,.3)",
        panel: "#0f4d3f"
    },
    violet: {
        bg: "radial-gradient(circle at top left,#7c3aed40 0%,transparent 35%), radial-gradient(circle at bottom right,#a78bfa40 0%,transparent 35%), #1f0f40",
        c1: "#6d28d9", c2: "#a78bfa", text: "#ede9fe", input: "#6d28d9",
        glow: "0 0 20px rgba(167,139,250,.5), 0 0 40px rgba(167,139,250,.3)",
        panel: "#2a1654"
    },
    fuchsia: {
        bg: "radial-gradient(circle at top left,#d946ef40 0%,transparent 35%), radial-gradient(circle at bottom right,#f0abfc40 0%,transparent 35%), #280d38",
        c1: "#c2185b", c2: "#f0abfc", text: "#fdf2f8", input: "#c2185b",
        glow: "0 0 20px rgba(240,171,252,.5), 0 0 40px rgba(240,171,252,.3)",
        panel: "#3d1c47"
    },
    stone: {
        bg: "radial-gradient(circle at top left,#a8a29e40 0%,transparent 35%), radial-gradient(circle at bottom right,#d6d3d140 0%,transparent 35%), #1c1917",
        c1: "#78716c", c2: "#d6d3d1", text: "#fafaf9", input: "#78716c",
        glow: "0 0 20px rgba(214,211,209,.5), 0 0 40px rgba(214,211,209,.3)",
        panel: "#27251f"
    },
    zinc: {
        bg: "radial-gradient(circle at top left,#71717a40 0%,transparent 35%), radial-gradient(circle at bottom right,#d4d4d840 0%,transparent 35%), #09090b",
        c1: "#52525b", c2: "#d4d4d8", text: "#fafafa", input: "#52525b",
        glow: "0 0 20px rgba(212,212,216,.5), 0 0 40px rgba(212,212,216,.3)",
        panel: "#18181b"
    },
    orange_vibrant: {
        bg: "radial-gradient(circle at top left,#ff6b3540 0%,transparent 35%), radial-gradient(circle at bottom right,#ff8c4240 0%,transparent 35%), #330600",
        c1: "#ff4500", c2: "#ff8c42", text: "#ffe5cc", input: "#ff4500",
        glow: "0 0 20px rgba(255,140,66,.5), 0 0 40px rgba(255,140,66,.3)",
        panel: "#661100"
    },
    aqua: {
        bg: "radial-gradient(circle at top left,#00ced140 0%,transparent 35%), radial-gradient(circle at bottom right,#40e0d040 0%,transparent 35%), #001f1f",
        c1: "#00a8a8", c2: "#40e0d0", text: "#d0ffff", input: "#00a8a8",
        glow: "0 0 20px rgba(64,224,208,.5), 0 0 40px rgba(64,224,208,.3)",
        panel: "#003333"
    },
    crimson: {
        bg: "radial-gradient(circle at top left,#dc143c40 0%,transparent 35%), radial-gradient(circle at bottom right,#ff1744440 0%,transparent 35%), #1a0005",
        c1: "#c41e3a", c2: "#ff1744", text: "#ffe6e6", input: "#c41e3a",
        glow: "0 0 20px rgba(255,23,68,.5), 0 0 40px rgba(255,23,68,.3)",
        panel: "#330011"
    },
    gradient_sunset: {
        bg: "radial-gradient(circle at top left,#ff634740 0%,transparent 35%), radial-gradient(circle at bottom right,#ff9c0040 0%,transparent 35%), #2c1a00",
        c1: "#ff6b35", c2: "#ffa500", text: "#fff5eb", input: "#ff6b35",
        glow: "0 0 20px rgba(255,165,0,.5), 0 0 40px rgba(255,165,0,.3)",
        panel: "#4d2200"
    },
    gradient_ocean: {
        bg: "radial-gradient(circle at top left,#004e8940 0%,transparent 35%), radial-gradient(circle at bottom right,#006ab340 0%,transparent 35%), #000a14",
        c1: "#003d82", c2: "#00a8e8", text: "#c5e1ff", input: "#003d82",
        glow: "0 0 20px rgba(0,168,232,.5), 0 0 40px rgba(0,168,232,.3)",
        panel: "#001a33"
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
