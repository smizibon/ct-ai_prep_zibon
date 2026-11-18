/* views/results.js — #/results and #/results/:sessionId (D3 §4.8) */
(function () {
  "use strict";
  window.CTAI_VIEWS = window.CTAI_VIEWS || {};
  var V = window.UI, S = window.Store;
  var QS = window.CTAI_QUESTIONS;

  function confetti() {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    var colors = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-6)"];
    for (var i = 0; i < 48; i++) {
      var bit = document.createElement("span");
      bit.className = "confetti-bit";
      var size = 6 + Math.random() * 4;
      bit.style.cssText = "left:50%;top:38%;width:" + size + "px;height:" + (size * 0.6) + "px;background:" +
        colors[i % colors.length] + ";--cx:" + (Math.random() * 440 - 220) + "px;--cy:" + (Math.random() * 420 + 120) +
        "px;--cr:" + (Math.random() * 720 - 360) + "deg";
      document.body.appendChild(bit);
      setTimeout(function (b) { return function () { b.remove(); }; }(bit), 1500);
    }
  }

  window.CTAI_VIEWS.results = {
    render: function (params) {
      var page = V.el("div", { class: "page" });
      if (!params.sessionId) {
        /* history */
        var attempts = S.getAttempts();
        page.appendChild(V.el("div", { class: "page-head" },
          V.el("h1", { class: "t-h1", text: "Results history" })));
        if (!attempts.length) return page.appendChild(V.emptyState("No attempts yet", "Sit the simulation or a practice run first.",
          V.el("a", { class: "btn btn--primary btn--sm", href: "#/exam", "data-testid": "results-empty-exam" }, "Go to mock exam"))) || page;
        var tbl = V.el("table", { class: "tbl" },
          V.el("thead", {}, V.el("tr", {}, ["When", "Mode", "Score", "Result", "Time", "Actions"].map(function (h) { return V.el("th", { text: h }); }))),
          V.el("tbody", {}, attempts.map(function (a, ai) {
            return V.el("tr", {},
              V.el("td", { class: "t-small", text: new Date(a.submittedAt).toLocaleString() }),
              V.el("td", {}, V.el("span", { class: "meta-chip" + (a.mode === "sim" ? " meta-chip--accent" : ""), text: a.mode })),
              V.el("td", { class: "t-num", text: a.points + "/" + a.maxPoints }),
              V.el("td", {}, a.mode === "sim"
                ? V.el("span", { class: "meta-chip " + (a.passed ? "meta-chip--success" : "meta-chip--danger"), text: a.passed ? "PASS" : "FAIL" })
                : V.el("span", { class: "t-small", style: "color:var(--ink-3)", text: "≥" + a.threshold })),
              V.el("td", { class: "t-small", text: V.fmtTime(a.timeUsedMs / 1000) }),
              V.el("td", {}, V.el("a", { class: "t-small", href: "#/results/" + a.sessionId, "data-testid": "results-attempt-" + ai }, "report")));
          })));
        page.appendChild(tbl);
        return page;
      }

      var a = S.findAttempt(params.sessionId);
      if (!a) return page.appendChild(V.emptyState("Result not found", "", V.el("a", { class: "btn btn--primary btn--sm", href: "#/results", "data-testid": "results-back" }, "History"))) || page;
      var isSim = a.mode === "sim";
      var frac = a.points / a.maxPoints;

      page.appendChild(V.el("p", { class: "t-small", style: "color:var(--ink-3)" },
        (isSim ? "Simulation" : a.mode === "appendix" ? "Appendix set" : a.mode === "quick" ? "Quick quiz" : "Learning session") +
        " · " + new Date(a.submittedAt).toLocaleString() + " · used " + V.fmtTime(a.timeUsedMs / 1000) +
        (a.autoSubmitted ? " · auto-submitted at the time limit" : "")));

      /* hero */
      var heroSide = V.el("div", {},
        isSim ? V.el("div", { class: "t-display", style: "color:" + (a.passed ? "var(--success)" : "var(--danger)"), text: a.passed ? "PASS" : "FAIL" })
              : V.el("div", { class: "t-h2", text: "Score" }),
        V.el("p", { class: "t-small", style: "color:var(--ink-2);margin-top:8px" },
          "Pass mark: " + (a.maxPoints === 44 ? "28.60 → " : "") + a.threshold + " of " + a.maxPoints + " (65%)" +
          (isSim ? " — official real-exam standard" : " — equivalent threshold (65% of " + a.maxPoints + ")")));
      var hero = V.el("div", { class: "results-hero" },
        V.ring({ size: "hero", frac: frac, num: a.points, cap: "of " + a.maxPoints, variant: isSim ? (a.passed ? "success" : "danger") : "", tick: a.threshold / a.maxPoints }),
        heroSide);
      page.appendChild(hero);
      if (isSim && a.passed && !S.settings.celebratedPass) {
        S.settings.celebratedPass = true; S.saveSettings(); confetti();
      }

      /* chapters + K-levels */
      var cov = window.CTAI_DATA.coverage;
      var bars = V.el("div", {});
      cov.chapters.forEach(function (ch) {
        var c = a.byChapter[ch.n];
        var f = c ? c.points / c.max : 0;
        bars.appendChild(V.el("div", { class: "rbar" },
          V.el("div", { class: "rbar__label" },
            V.el("span", { class: "t-caption", text: "Ch " + ch.n }),
            V.el("div", { class: "t-small", text: ch.title })),
          V.el("div", { class: "rbar__track" }, V.el("div", { class: "rbar__fill" + (c && f < 0.65 ? " is-low" : "") + (c ? "" : " is-empty"), style: "width:" + (c ? Math.max(f * 100, 2) : 0) + "%" })),
          V.el("div", { class: "rbar__val", text: c ? c.points + "/" + c.max + " pts" : "—" })));
      });
      var kRows = V.el("div", {});
      ["K2", "K3"].forEach(function (k) {
        var c = a.byKLevel[k];
        if (!c) return;
        kRows.appendChild(V.el("div", { class: "rbar" },
          V.el("div", { class: "rbar__label" }, V.el("span", { class: "t-caption", text: k }), V.el("div", { class: "t-small", text: c.correct + " of " + c.total + " correct" })),
          V.el("div", { class: "rbar__track" }, V.el("div", { class: "rbar__fill" + (c.correct / c.total < 0.65 ? " is-low" : ""), style: "width:" + (c.correct / c.total * 100) + "%" })),
          V.el("div", { class: "rbar__val", text: c.points + "/" + c.max + " pts" })));
      });
      page.appendChild(V.el("div", { class: "results-cols" },
        V.el("section", {}, V.sectionLabel("By chapter"), bars),
        V.el("section", {}, V.sectionLabel("By K-level"), kRows)));

      /* verdict grid */
      page.appendChild(V.sectionLabel("Questions"));
      var grid = V.el("div", { class: "verdict-grid", "data-testid": "vgrid" });
      a.perQuestion.forEach(function (pq) {
        grid.appendChild(V.el("a", {
          class: "vchip" + (pq.verdict === "correct" ? " is-correct" : pq.verdict === "incorrect" ? " is-incorrect" : " is-unanswered") + (pq.flagged ? " is-flagged" : ""),
          href: "#/results/" + a.sessionId + "/review?filter=all",
          text: pq.id.replace(/[QA]/, ""), title: pq.id + " — " + pq.verdict + (pq.flagged ? " · flagged" : "")
        }));
      });
      page.appendChild(grid);

      var wrong = a.perQuestion.filter(function (q) { return q.verdict === "incorrect"; }).length;
      var unans = a.perQuestion.filter(function (q) { return q.verdict === "unanswered"; }).length;
      var flagged = a.perQuestion.filter(function (q) { return q.flagged; }).length;
      page.appendChild(V.el("div", { class: "chiprow", style: "margin-top:var(--sp-5)" },
        V.el("a", { class: "btn btn--primary btn--sm", href: "#/results/" + a.sessionId + "/review?filter=all", "data-testid": "results-review-all" }, "Review all"),
        wrong ? V.el("a", { class: "btn btn--outline btn--sm", href: "#/results/" + a.sessionId + "/review?filter=incorrect", "data-testid": "results-review-incorrect" }, "Review incorrect (" + wrong + ")") : null,
        unans ? V.el("a", { class: "btn btn--outline btn--sm", href: "#/results/" + a.sessionId + "/review?filter=unanswered", "data-testid": "results-review-unanswered" }, "Unanswered (" + unans + ")") : null,
        flagged ? V.el("a", { class: "btn btn--outline btn--sm", href: "#/results/" + a.sessionId + "/review?filter=flagged", "data-testid": "results-review-flagged" }, "Flagged (" + flagged + ")") : null,
        isSim ? V.el("button", { class: "btn btn--ghost btn--sm", "data-testid": "results-retake", onclick: function () { location.hash = "#/exam"; } }, "Retake") : null));
      return page;
    }
  };
})();
