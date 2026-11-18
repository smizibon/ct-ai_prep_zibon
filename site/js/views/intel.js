/* views/intel.js — #/intel (advice) and #/intel/patterns (D3 §4.10, SPEC §6G timing card) */
(function () {
  "use strict";
  window.CTAI_VIEWS = window.CTAI_VIEWS || {};
  var V = window.UI;

  function srcLabel(it) {
    return V.el("span", {}, it.url ? V.el("a", { class: "advice__src t-small", href: it.url, target: "_blank", rel: "noopener", "data-testid-ignore": "" }, it.host) : V.el("span", { class: "advice__src" }, it.host || ""));
  }

  function adviceCard(it) {
    var versionChip = it.version === "v2.0" ? V.chip("v2.0", { variant: "success" }) :
      it.version === "v1.0" ? V.chip("v1.0-era", { variant: "warn" }) : V.chip(it.version || "", {});
    return V.el("article", { class: "advice" },
      V.el("div", { class: "advice__icon" }, V.icon("quote")),
      V.el("div", { class: "t-h4", style: "margin-bottom:var(--sp-2)", text: it.title }),
      V.el("p", { class: "advice__body", text: it.text }),
      V.el("div", { class: "advice__foot" },
        srcLabel(it),
        V.el("span", { class: "meta-chip meta-chip--mono", text: it.date || "" }),
        versionChip,
        V.chip(it.confidence || "", { variant: it.confidence === "high" ? "success" : "" }),
        it.sourceType === "official" ? V.chip("official", { variant: "accent" }) : null),
      it.applicability ? V.el("div", { class: "advice__note", text: "v2.0 applicability: " + it.applicability }) : null);
  }

  window.CTAI_VIEWS.intel = {
    render: function (params) {
      var page = V.el("div", { class: "page" });
      var intel = window.CTAI_INTEL;
      page.appendChild(V.el("div", { class: "page-head" },
        V.el("div", { class: "section-marker t-caption", style: "color:var(--ink-3)" }, "Exam intelligence"),
        V.el("h1", { class: "t-h1", text: "Past examinees & exam patterns" }),
        V.el("p", { class: "t-lead" }, "Community-reported advice and pattern analysis — every item labeled official, provider, or community, and version-tagged.")));

      var tabs = V.el("div", { class: "tabs", role: "tablist" },
        V.el("a", { class: "tab", role: "tab", "aria-selected": params.tab !== "patterns" ? "true" : "false", href: "#/intel", "data-testid": "intel-tab-advice", text: "Advice (" + intel.advice.items.length + ")" }),
        V.el("a", { class: "tab", role: "tab", "aria-selected": params.tab === "patterns" ? "true" : "false", href: "#/intel/patterns", "data-testid": "intel-tab-patterns", text: "Patterns" }));
      page.appendChild(tabs);

      if (params.tab !== "patterns") {
        /* ---------- advice tab ---------- */
        page.appendChild(V.el("div", { class: "banner banner--warn" }, V.icon("alert", true),
          V.el("span", {}, intel.advice.gapNote)));
        page.appendChild(V.sectionLabel("What recurs across independent sources"));
        var syn = V.el("ol", { class: "imp-list", style: "margin-bottom:var(--sp-8)" });
        intel.advice.synthesis.forEach(function (s) {
          syn.appendChild(V.el("li", {}, V.el("div", { class: "t-small" }, s.text,
            V.el("span", { class: "imp-src", text: "items " + s.itemIds.join(", ") }))));
        });
        page.appendChild(syn);
        page.appendChild(V.sectionLabel("All advice items", "source-labeled"));
        var masonry = V.el("div", { class: "masonry" });
        intel.advice.items.forEach(function (it) { masonry.appendChild(adviceCard(it)); });
        page.appendChild(masonry);
        page.appendChild(V.sectionLabel("Where sources disagree"));
        intel.advice.conflicts.forEach(function (c) {
          page.appendChild(V.el("div", { class: "conflict-card" },
            V.el("h4", { class: "t-h4" }, "⚠ " + c.topic),
            V.el("p", { class: "t-small", style: "margin-top:var(--sp-2);color:var(--ink-2)", text: c.text })));
        });
        return page;
      }

      /* ---------- patterns tab ---------- */
      var p = intel.patterns;
      page.appendChild(V.sectionLabel("Official exam mechanics", "confirmed-official"));
      var off = V.el("div", { class: "card card--flat", style: "padding:var(--sp-1) var(--sp-5)" });
      off.appendChild(V.el("table", { class: "tbl" },
        V.el("tbody", {}, p.official.map(function (o) {
          return V.el("tr", {},
            V.el("td", { style: "width:220px;font-weight:600", text: o.title }),
            V.el("td", { class: "t-small" }, o.text, " ", V.el("a", { class: "t-small", href: o.url, target: "_blank", rel: "noopener", "data-testid-ignore": "" }, "source ↗")));
        }))));
      page.appendChild(off);

      page.appendChild(V.sectionLabel("K-level & chapter weighting"));
      var donut = V.el("div", { class: "card", style: "display:flex;gap:var(--sp-6);align-items:center;flex-wrap:wrap" });
      donut.appendChild((function () {
        var size = 150, r = 55, c = 2 * Math.PI * r;
        var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("width", size); svg.setAttribute("height", size); svg.setAttribute("viewBox", "0 0 " + size + " " + size);
        svg.innerHTML = '<circle cx="75" cy="75" r="' + r + '" fill="none" stroke="var(--chart-1)" stroke-width="22" stroke-dasharray="' + (c * 0.9) + ' ' + c + '" transform="rotate(-90 75 75)"></circle>' +
          '<circle cx="75" cy="75" r="' + r + '" fill="none" stroke="var(--chart-2)" stroke-width="22" stroke-dasharray="' + (c * 0.1) + ' ' + c + '" stroke-dashoffset="' + (-c * 0.9) + '" transform="rotate(-90 75 75)"></circle>' +
          '<text x="75" y="71" text-anchor="middle" fill="var(--ink-1)" font-size="18" font-weight="700" font-family="var(--font-mono)">40</text>' +
          '<text x="75" y="88" text-anchor="middle" fill="var(--ink-3)" font-size="9">questions</text>';
        return svg;
      })());
      donut.appendChild(V.el("div", { class: "donut-legend t-small" },
        V.el("div", {}, V.el("span", { class: "legend-dot", style: "background:var(--chart-1)" }), "K2 × 36 questions · 1 pt each"),
        V.el("div", { style: "margin-top:var(--sp-2)" }, V.el("span", { class: "legend-dot", style: "background:var(--chart-2)" }), "K3 × 4 questions · 2 pts each"),
        V.el("div", { style: "margin-top:var(--sp-2);color:var(--ink-3)" }, "36 × 1 + 4 × 2 = 44 points · pass 29")));
      page.appendChild(donut);

      var cov = window.CTAI_DATA.coverage;
      var bars = V.el("div", { class: "card", style: "margin-top:var(--sp-5)" });
      cov.chapters.forEach(function (ch) {
        var realN = ch.stats.questions > 0 ? ch.stats.questions : 0;
        var pts = ch.stats.points;
        bars.appendChild(V.el("div", { class: "rbar" },
          V.el("div", { class: "rbar__label" }, V.el("span", { class: "t-caption", text: "Ch " + ch.n }), V.el("div", { class: "t-small", text: ch.title })),
          V.el("div", { class: "rbar__track" }, V.el("div", { class: "rbar__fill", style: "width:" + (realN / 9 * 100) + "%" })),
          V.el("div", { class: "rbar__val", text: realN + " Q · " + pts + " pts" })));
      });
      bars.appendChild(V.el("p", { class: "t-caption", style: "color:var(--ink-3);margin-top:var(--sp-2)" }, "Bars scaled to question count (max = Ch 6's 9). Ch 3+6 = 16 of 40 questions ≈ 41% of points."));
      page.appendChild(bars);

      /* timing card — official arithmetic only (SPEC §6G) */
      page.appendChild(V.sectionLabel("Timing strategy", "official arithmetic"));
      page.appendChild(V.el("div", { class: "card" },
        V.el("table", { class: "tbl" },
          V.el("tbody", {},
            V.el("tr", {}, V.el("td", { style: "font-weight:600" }, "Official budget"), V.el("td", { class: "t-small", text: "36 × 1 min (K2) + 4 × 3 min (K3) ≈ 48 minutes of the 60 available — about 12 minutes of slack." })),
            V.el("tr", {}, V.el("td", { style: "font-weight:600" }, "K3 slots"), V.el("td", { class: "t-small", text: "Give each 2-point question a deliberate 3-minute slot: metrics calc (AI-3.3.1), red teaming (AI-4.2.2), dataset constraints (AI-5.1.5), metamorphic relations (AI-6.1.5)." })),
            V.el("tr", {}, V.el("td", { style: "font-weight:600" }, "Tactic"), V.el("td", { class: "t-small", text: "First pass on K2 items, flag the K3s and anything slow, then return with the slack. Never leave blanks — no negative marking." })))),
        V.el("p", { class: "t-caption", style: "color:var(--ink-3);margin-top:var(--sp-2)" }, "Derived from ISTQB's official per-K-level timing guideline (K2 = 1 min, K3 = 3 min) and the v2.0 K-mix.")));

      page.appendChild(V.sectionLabel("v1.0 → v2.0 — what changed"));
      page.appendChild(V.el("div", { class: "card card--flat", style: "padding:var(--sp-1) var(--sp-5)" },
        V.el("table", { class: "tbl delta-tbl" },
          V.el("thead", {}, V.el("tr", {}, V.el("th", { text: "Dimension" }), V.el("th", { text: "v1.0 (2021)" }), V.el("th", { text: "v2.0 (Apr 2026)" }))),
          V.el("tbody", {}, p.delta.rows.map(function (r) {
            return V.el("tr", {}, r.map(function (c, i) {
              var td = V.el("td", { class: "t-small", text: c });
              if (i === 0) td.style.fontWeight = "600";
              if (i === 2) td.style.color = "var(--success)";
              return td;
            }));
          }))),
        V.el("p", { class: "t-small", style: "color:var(--ink-2);padding:var(--sp-3) var(--sp-1)", text: p.delta.addedTopics })));

      page.appendChild(V.sectionLabel("Community-reported patterns", "anecdotes · version-tagged"));
      var cm = V.el("div", { class: "masonry" });
      p.community.forEach(function (it) {
        cm.appendChild(V.el("article", { class: "advice" },
          V.el("div", { class: "t-h4", style: "margin-bottom:var(--sp-2)" }, V.icon("compass", true), " " + it.title),
          V.el("p", { class: "advice__body", text: it.text }),
          V.el("div", { class: "advice__foot" },
            V.el("a", { class: "advice__src t-small", href: it.url, target: "_blank", rel: "noopener", "data-testid-ignore": "" }, "source ↗"),
            V.el("span", { class: "meta-chip meta-chip--mono", text: it.date || "" }),
            V.chip(it.version || "", { variant: it.version.includes("v1.0") ? "warn" : "" })),
          it.note ? V.el("div", { class: "advice__note", text: it.note }) : null));
      });
      page.appendChild(cm);

      page.appendChild(V.sectionLabel("Third-party sites with wrong facts", "beware"));
      var oe = V.el("div", { class: "card card--flat", style: "padding:var(--sp-1) var(--sp-5)" });
      oe.appendChild(V.el("table", { class: "tbl" },
        V.el("tbody", {}, p.thirdPartyErrors.map(function (e) {
          return V.el("tr", {},
            V.el("td", { style: "font-weight:600;width:140px", text: e.source }),
            V.el("td", { class: "t-small", style: "color:var(--danger)" }, "✗ " + e.error),
            V.el("td", { class: "t-small", style: "color:var(--success)" }, "✓ " + e.correct));
        }))));
      page.appendChild(oe);

      page.appendChild(V.sectionLabel("Implications for studying"));
      var imp = V.el("ol", { class: "imp-list" });
      p.implications.forEach(function (i) {
        imp.appendChild(V.el("li", {}, V.el("div", { class: "t-small" }, i.text,
          V.el("span", { class: "imp-src", text: "derives from " + i.derivedFrom }))));
      });
      page.appendChild(imp);

      page.appendChild(V.sectionLabel("Sources", intel.sources.length + " links"));
      var src = V.el("div", { class: "chiprow" });
      intel.sources.forEach(function (s) {
        src.appendChild(V.el("a", { class: "meta-chip" + (s.type === "official" ? " meta-chip--accent" : s.type === "dump-evidence" ? " meta-chip--danger" : ""),
          href: s.url, target: "_blank", rel: "noopener", style: "text-decoration:none", title: s.label, "data-testid-ignore": "" }, s.label.slice(0, 42)));
      });
      page.appendChild(src);
      return page;
    }
  };
})();
