window.addEventListener("load", function () {
    var searchBar = document.getElementById("searchBar");
    if (!searchBar) return;

    // Clear button
    var clearBtn = document.createElement("button");
    clearBtn.id = "searchClearBtn";
    clearBtn.textContent = "✕";
    clearBtn.style.cssText = "display:none;position:absolute;right:14px;top:50%;transform:translateY(-50%);background:none;border:none;color:rgba(255,255,255,0.4);cursor:pointer;font-size:16px;padding:0;line-height:1;";
    var wrap = searchBar.parentNode;
    if (wrap) {
        var oldPos = wrap.style.position;
        wrap.style.position = "relative";
        wrap.appendChild(clearBtn);
    }

    // No-results label
    var noResults = document.createElement("p");
    noResults.id = "searchNoResults";
    noResults.style.cssText = "display:none;text-align:center;opacity:0.5;font-size:13px;padding:20px;";
    noResults.textContent = "No games found";
    var grid = document.getElementById("gamesGrid");
    if (grid && grid.parentNode) grid.parentNode.insertBefore(noResults, grid.nextSibling);

    function doSearch() {
        var q = searchBar.value.trim().toLowerCase();
        clearBtn.style.display = q ? "block" : "none";

        // Target both old .gameCard and new .ws-game-icon
        var cards = Array.from(document.querySelectorAll(".ws-game-icon, .gameCard"));
        var shown = 0;
        cards.forEach(function(card) {
            // Try aria-label first (new cards), then textContent (old cards)
            var name = (card.getAttribute("aria-label") || card.textContent || "").toLowerCase();
            var visible = !q || name.includes(q);
            card.style.display = visible ? "" : "none";
            if (visible) shown++;
        });

        if (noResults) noResults.style.display = (q && shown === 0) ? "block" : "none";
    }

    searchBar.addEventListener("input", doSearch);
    clearBtn.addEventListener("click", function() {
        searchBar.value = "";
        doSearch();
        searchBar.focus();
    });
});