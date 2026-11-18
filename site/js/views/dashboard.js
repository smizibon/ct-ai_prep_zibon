/* views/dashboard.js — #/ (D3 §4.1) */
(function () {
  "window.CTAI_VIEWS in browser";
  "use strict";
  window.CTAI_VIEWS = window.CTAI_VIEWS || {};

  window.CTAI_VIEWS.dashboard = {
    render: function () {
      var V = window.UI, E = window.Engine, S = window.Store;
      var page = V.el("div", { class: "page" });

      /* hero */
      var hour = new Date().getHours();
      var greet = hour < 12 ? "Good morning." : hour < 18 ? "Good afternoon." : "Good evening.";
      var sess = S.getSession();
      var resumeBtn = null;
      if (sess && !sess.finished) {
        var rem = sess.endsAt ? E.remainingMs(sess) : null;
        resumeBtn = V.el("a", { class: "btn btn--primary", href: "#/exam/run/" + sess.sessionId, "data-testid": "dash-resume" },
          V.icon("play", true), rem != null ? "Resume simulation · " + V.fmtTime(rem / 1000) + " left" :
            "Resume " + (sess.mode === "practice" ? "practice" : sess.mode === "appendix" ? "appendix set" : "session"));
      }
      var hero = V.el("section", { class: "dash-hero tensor-grid" },
        V.el("div", { class: "dash-hero__row" },
          V.el("div", {},
            V.el("h1", { class: "t-h1", text: greet }),
            V.el("p", { class: "dash-hero__meta t-small" },
              "19.5h curriculum · 7 chapters · 51 learning objectives · 46 official sample questions")),
          resumeBtn ? V.el("div", {}, resumeBtn) : V.el("div", {},
            V.el("a", { class: "btn btn--primary", href: "#/study", "data-testid": "dash-start-study" }, V.icon("book", true), "Start studying"))));
      page.appendChild(hero);

      /* readiness + continue */
      var r = V.readiness();
      var lastStudied = null;
      var prog = S.getProgress();
      var cov = window.CTAI_DATA.coverage;
      outer: for (var ci = cov.chapters.length - 1; ci >= 0; ci--) {
        var chpts = cov.chapters[ci];
        for (var si = chpts.sections.length - 1; si >= 0; si--) {
          var los = chpts.sections[si].los;
          for (var li = los.length - 1; li >= 0; li--) {
            if (prog[los[li].subsection]) { lastStudied = los[li]; break outer; }
          }
        }
      }
      var nextLo = null;
      outer2: for (var c2 = 0; c2 < cov.chapters.length; c2++)
        for (var s2 = 0; s2 < cov.chapters[c2].sections.length; s2++)
          for (var l2 = 0; l2 < cov.chapters[c2].sections[s2].los.length; l2++) {
            var lo2 = cov.chapters[c2].sections[s2].los[l2];
            if (lo2.examinable && !prog[lo2.subsection]) { nextLo = lo2; break outer2; }
          }
      var cont = nextLo || lastStudied;
      var grid = V.el("div", { class: "dash-grid" },
        V.el("div", { class: "card" },
          V.el("div", { class: "chiprow", style: "margin-bottom:var(--sp-3)" }, V.el("span", { class: "t-caption", style: "color:var(--ink-3)", text: "Exam readiness" })),
          V.el("div", { style: "display:flex;align-items:center;gap:var(--sp-5)" },
            V.ring({ size: "sm", frac: r.combined, cap: "ready", label: "exam readiness" }),
            V.el("div", { class: "t-small", style: "color:var(--ink-2)" },
              V.el("div", {}, "Study progress"),
              V.pbar(r.study),
              V.el("div", { style: "margin:var(--sp-2) 0 var(--sp-1)" }, "Best simulation"),
              V.pbar(r.hasSim ? r.bestSim : 0),
              V.el("div", { style: "margin-top:var(--sp-2);color:var(--ink-3)" },
                "readiness = ½ study + ½ best sim" + (r.hasSim ? "" : " (no sim yet — study only)"))))),
        V.el("div", { class: "card card--accent-left" },
          V.el("span", { class: "t-caption", style: "color:var(--ink-3)", text: "Continue studying" }),
          cont ? V.el("div", { style: "margin-top:var(--sp-2)" },
            V.el("div", { class: "t-h3", text: (nextLo ? "Next: " : "Last: ") + cont.subsection + " — " + cont.title }),
            V.el("div", { class: "t-small", style: "color:var(--ink-3);margin:var(--sp-1) 0 var(--sp-3)" },
              "Chapter " + cont.id.split(".")[0].split("-")[1] + " · ~" + cont.minutes + " min (est.)"),
            V.el("a", { class: "btn btn--primary btn--sm", href: "#/study/ch" + cont.id.split(".")[0].split("-")[1] + "/" + cont.subsection, "data-testid": "dash-continue" }, "Open ", cont.subsection))
            : V.el("p", { class: "t-small", style: "color:var(--ink-2);margin-top:var(--sp-2)" }, "All objectives understood. Time for a simulation.")));
      page.appendChild(grid);

      /* study plan chapter cards */
      page.appendChild(V.sectionLabel("Study plan", Math.round(V.overallStudy().frac * 100) + "%"));
      var chGrid = V.el("div", { class: "ch-grid" });
      for (var n = 1; n <= 7; n++) {
        var cp = V.chapterProgress(n);
        var ch = window.CTAI_DATA.chapters[n];
        var kws = (ch.keywords.aiSpecific.length ? ch.keywords.aiSpecific : ch.keywords.general).slice(0, 3);
        chGrid.appendChild(V.el("a", { class: "card card--interactive ch-card", href: "#/study/ch" + n, "data-testid": "dash-ch" + n },
          V.el("div", { class: "ch-card__top" },
            V.ring({ size: "sm", frac: cp.frac, variant: cp.frac >= 1 ? "success" : "", label: "chapter " + n + " progress" }),
            V.el("div", {},
              V.el("span", { class: "t-caption", style: "color:var(--ink-3)", text: "Ch " + n }),
              V.el("div", { class: "t-h3 ch-card__title", text: ch.title }))),
          V.el("div", { class: "ch-card__meta" },
            V.el("span", {}, "⏱ " + ch.minutes + " min"),
            V.el("span", {}, cp.total + " LOs"),
            V.el("span", {}, ch.sections.reduce(function (a, s) { return a + s.subsections.reduce(function (b, u) { return b + u.questions.length; }, 0); }, 0) + " questions")),
          V.el("div", { class: "ch-card__chips" }, kws.map(function (k) { return V.chip(k); })),
          V.el("div", { class: "ch-card__bar" }, V.pbar(cp.frac))));
      }
      page.appendChild(chGrid);

      /* weak areas */
      var weak = S.weakAreas();
      if (weak.length) {
        page.appendChild(V.sectionLabel("Weak areas"));
        var wrap = V.el("div", { class: "chiprow" });
        weak.slice(0, 6).forEach(function (w) {
          wrap.appendChild(V.el("a", { class: "meta-chip meta-chip--warn", href: "#/exam?weak=" + (w.type === "chapter" ? "ch" + w.n : w.id), style: "text-decoration:none", "data-testid": w.type === "chapter" ? "dash-weak-ch" + w.n : "dash-weak-" + w.id },
            w.type === "chapter" ? "Ch " + w.n + " — " + w.correct + "/" + w.seen : w.id + " missed " + w.incorrect + "×"));
        });
        wrap.appendChild(V.el("a", { href: "#/exam", class: "t-small", "data-testid": "dash-weak-practice" }, "Practice these →"));
        page.appendChild(wrap);
      }

      /* recent attempts */
      var attempts = S.getAttempts();
      page.appendChild(V.sectionLabel("Recent attempts", attempts.length ? undefined : "none yet"));
      if (attempts.length) {
        var list = V.el("div", {});
        attempts.slice(0, 4).forEach(function (a, i) {
          list.appendChild(V.el("a", { href: "#/results/" + a.sessionId, class: "card card--interactive card--flat row-link", "data-testid": "dash-attempt-" + i },
            V.el("span", { class: "meta-chip" + (a.mode === "sim" ? " meta-chip--accent" : ""), text: a.mode }),
            V.el("span", { class: "t-small", style: "color:var(--ink-3)", text: new Date(a.submittedAt).toLocaleDateString() }),
            V.el("span", { class: "t-num", text: a.points + "/" + a.maxPoints }),
            a.mode === "sim" ? V.el("span", { class: "meta-chip " + (a.passed ? "meta-chip--success" : "meta-chip--danger"), text: a.passed ? "PASS" : "FAIL" }) : null,
            V.el("span", { class: "t-small", style: "margin-left:auto;color:var(--ink-3)", text: V.fmtTime(a.timeUsedMs / 1000) + " used" })));
        });
        page.appendChild(list);
      } else {
        page.appendChild(V.el("div", { class: "dash-empty" },
          V.emptyState("No attempts yet", "Your simulation and practice results will appear here.",
            V.el("a", { class: "btn btn--primary btn--sm", href: "#/exam", "data-testid": "dash-empty-exam" }, "Take the mock exam"))));
      }

      /* community teaser */
      page.appendChild(V.sectionLabel("From the community"));
      var syn = window.CTAI_INTEL.advice.synthesis.slice(0, 2);
      var teaser = V.el("div", { class: "masonry" });
      syn.forEach(function (s) {
        teaser.appendChild(V.el("div", { class: "advice" },
          V.el("div", { class: "advice__icon" }, V.icon("quote")),
          V.el("div", { class: "advice__body", text: s.text })));
      });
      page.appendChild(teaser);
      page.appendChild(V.el("a", { href: "#/intel", class: "t-small", "data-testid": "dash-intel-link" }, "All examinee advice & exam patterns →"));

      return page;
    }
  };
})();
