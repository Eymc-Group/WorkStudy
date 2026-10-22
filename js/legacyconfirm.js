function legacyConfirm() {

    const result =
        confirm(
            "🏛️ Legacy Site\n\n" +
            "⚠️ You are about to visit the old EYMC Group website.\n\n" +
            "🎮 Old games\n" +
            "💬 Old chat\n" +
            "👴 Ancient WorkStudy lore\n\n" +
            "🚀 Continue?"
        );

    if (result) {

        location.href =
            "legacy/index.html";

    }

}