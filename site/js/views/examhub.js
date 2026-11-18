/* views/examhub.js — #/exam (D3 §4.6): mode picker, resume banner, settings, attempts */
(function () {
  "use strict";
  window.CTAI_VIEWS = window.CTAI_VIEWS || {};
  var V = window.UI, E = window.Engine, S = window.Store;
  var QS = window.CTAI_QUESTIONS;
  var byId = {}; QS.forEach(function (q) { byId[q.id] = q; });

  function switchRow(label, checked, tip, onToggle, testid) {
    var sw = V.el("button", { class: "switch", role: "switch", "aria-checked": checked ? "true" : "false", "aria-label": label, "data-tip": tip || null, "data-testid": testid || null });
    sw.addEventListener("click", function () {
      var v = sw.getAttribute("aria-checked") !== "true";
      sw.setAttribute("aria-checked", v ? "true" : "false");
      onToggle(v);
    });
    return V.el("label", { class: "toggle-row" }, sw, label);
  }

  function needDiscard(onGo) {
    var sess = S.getSession();
    if (!sess || sess.finished) { onGo(); return; }
    var answered = Object.keys(sess.responses).length;
    if (sess.mode !== "sim") { onGo(); return; }   // practice/appendix/quick silently replaced? — no: confirm too
    UI.confirm("Start a new session?",
      V.el("div", {}, V.el("p", {}, "A " + (sess.mode === "sim" ? "simulation" : sess.mode + " session") + " is in progress (" + answered + " answered). Starting a new session discards it — there is no archive."),
        V.el("p", { style: "margin-top:8px;color:var(--ink-3)" }, "Tip: resume it instead from the banner above.")),
      "Discard & start", onGo, true);
  }

  function startSession(opts, replace) {
    var go = function () {
      var s = E.createSession(opts);
      S.saveSession(s);
      location.hash = "#/exam/run/" + s.sessionId;
    };
    if (S.getSession() && !S.getSession().finished) needDiscard(go); else go();
  }

  window.CTAI_VIEWS.examhub = {
    render: function (params, route) {
      var page = V.el("div", { class: "page" });
      page.appendChild(V.el("div", { class: "page-head" },
        V.el("div", { class: "section-marker t-caption", style: "color:var(--ink-3)" }, "Mock exam"),
        V.el("h1", { class: "t-h1", text: "Official Sample Exam — set A v2.2" }),
        V.el("p", { class: "t-lead" }, "The same 46 questions ISTQB publishes, delivered with the real exam's parameters.")));

      /* resume banner */
      var sess = S.getSession();
      if (sess && !sess.finished) {
        var rem = sess.endsAt ? E.remainingMs(sess) : null;
        page.appendChild(V.el("div", { class: "banner banner--info" },
          V.icon("info", true),
          V.el("span", {}, (sess.mode === "sim" ? "Simulation" : sess.mode === "appendix" ? "Appendix set" : sess.mode + " session") +
            " in progress · " + Object.keys(sess.responses).length + "/" + sess.questionIds.length + " answered" +
            (rem != null ? " · " + V.fmtTime(rem / 1000) + " remaining" : "")),
          V.el("a", { class: "banner__act", href: "#/exam/run/" + sess.sessionId, "data-testid": "resume-link" }, "Resume"),
          V.el("span", { class: "banner__act", "data-testid": "discard-link", onclick: function () { S.clearSession(); Router.render(); UI.toast("Session discarded"); } }, "Discard")));
      }

      /* mode cards */
      var mainQs = QS.filter(function (q) { return q.set === "main"; });
      var grid = V.el("div", { class: "mode-grid" });

      /* full simulation */
      var extTgl = switchRow("75-min extended time (+25%, official accommodation)", S.settings.extendedTime,
        "Official rule: +25% time when the exam language is not your first language", function (v) { S.settings.extendedTime = v; S.saveSettings(); }, "switch-ext");
      var shufTgl = switchRow("Exam-like shuffle (default off — “as it is”)", S.settings.shuffleDefault,
        "Randomizes question and option order per attempt; review shows original letters", function (v) { S.settings.shuffleDefault = v; S.saveSettings(); }, "switch-shuffle");
      grid.appendChild(V.el("div", { class: "card card--accent-left mode-card mode-card--primary" },
        V.el("div", { class: "t-h3" }, V.icon("timer", true), "Full Simulation"),
        V.el("div", { class: "mode-card__facts" },
          V.el("b", {}, "40 questions · 60:00 · 44 points"),
          " — pass at 29/44 (65%). Q1–Q40 in document order. No feedback until submit; auto-submit at 0:00. K-levels hidden, like the real exam. Official real-exam parameters (the sample docs define none)."),
        extTgl, shufTgl,
        V.el("button", { class: "btn btn--primary", "data-testid": "start-sim", onclick: function () {
          startSession({ mode: "sim", questions: mainQs, shuffle: S.settings.shuffleDefault, extendedTime: S.settings.extendedTime });
        } }, V.icon("play", true), "Start simulation")));

      /* learning mode */
      var chSel = V.el("select", { "aria-label": "Chapter filter", "data-testid": "sel-chapter", style: "border:1px solid var(--line-2);background:var(--bg-1);color:var(--ink-1);border-radius:var(--r-sm);padding:var(--sp-1) var(--sp-2)" },
        V.el("option", { value: "all", text: "All 46 (main + appendix)" }),
        [1, 2, 3, 4, 5, 6, 7].map(function (n) {
          return V.el("option", { value: "ch" + n, text: "Chapter " + n });
        }));
      var wrongOnly = switchRow("Only questions I got wrong before", false, "Uses your lifetime question statistics", function () {}, "switch-wrong");
      grid.appendChild(V.el("div", { class: "card mode-card" },
        V.el("div", { class: "t-h3" }, V.icon("book", true), "Learning Mode"),
        V.el("div", { class: "mode-card__facts" },
          "Untimed, instant verdict per question with the full official rationale, per-option verdicts, and derived why-not bullets. LO/K-level visible before answering."),
        V.el("div", { class: "toggle-row" }, V.el("span", { class: "t-caption", style: "color:var(--ink-3)" }, "FILTER"), chSel),
        wrongOnly,
        V.el("button", { class: "btn btn--outline", onclick: function () {
          var qs = QS.slice();
          if (chSel.value !== "all") {
            var n = Number(chSel.value.replace("ch", ""));
            qs = QS.filter(function (q) { return q.chapter === n; });
          }
          if (wrongOnly.querySelector(".switch").getAttribute("aria-checked") === "true") {
            var stats = S.getQStats();
            qs = qs.filter(function (q) { return stats[q.id] && stats[q.id].incorrect > 0; });
            if (!qs.length) { UI.toast("No previously-wrong questions in this filter"); return; }
          }
          startSession({ mode: "practice", questions: qs, shuffle: false, timerStyle: "countup", checkMode: "instant" });
        }, "data-testid": "start-practice" }, "Start learning")));

      /* appendix */
      grid.appendChild(V.el("div", { class: "card mode-card" },
        V.el("div", { class: "t-h3" }, V.icon("grid", true), "Appendix — New Types"),
        V.el("div", { class: "mode-card__facts" },
          "A1–A6, 6 points, untimed. Interactive figure questions: category assignment (A1), click-pair matching (A4), sequencing (A5). Answer keys given as figures, exactly as ISTQB prints them."),
        V.el("button", { class: "btn btn--outline", onclick: function () {
          startSession({ mode: "appendix", questions: QS.filter(function (q) { return q.set === "appendix"; }), shuffle: false, timerStyle: "none", checkMode: "instant" });
        }, "data-testid": "start-appendix" }, "Open appendix set")));

      /* quick quiz */
      var sizeSel = V.el("select", { "aria-label": "Quiz size", "data-testid": "sel-size", style: "border:1px solid var(--line-2);background:var(--bg-1);color:var(--ink-1);border-radius:var(--r-sm);padding:var(--sp-1) var(--sp-2)" },
        [5, 10, 20].map(function (n) { return V.el("option", { value: String(n), text: n + " questions" }); }));
      var paceTgl = switchRow("Official pacing timer (1′/K2 + 3′/K3)", false, "Countdown computed from the official per-K-level time budget", function () {}, "switch-pacing");
      grid.appendChild(V.el("div", { class: "card mode-card" },
        V.el("div", { class: "t-h3" }, V.icon("target", true), "Quick Quiz"),
        V.el("div", { class: "mode-card__facts" }, "Random sample from all 46. Equivalent 65% threshold computed from the selected questions."),
        V.el("div", { class: "toggle-row" }, V.el("span", { class: "t-caption", style: "color:var(--ink-3)" }, "SIZE"), sizeSel),
        paceTgl,
        V.el("button", { class: "btn btn--outline", onclick: function () {
          var n = Number(sizeSel.value);
          var pool = QS.slice();
          var rand = E.rng(Date.now() >>> 0);
          var picked = [];
          while (picked.length < n && pool.length) picked.push(pool.splice(Math.floor(rand() * pool.length), 1)[0]);
          picked.sort(function (a, b) { return a.id.localeCompare(b.id, undefined, { numeric: true }); });
          startSession({ mode: "quick", questions: picked, shuffle: false,
            timerStyle: paceTgl.querySelector(".switch").getAttribute("aria-checked") === "true" ? "countdown" : "countup",
            checkMode: "instant", durationMin: E.pacingMinutes(picked) });
        }, "data-testid": "start-quick" }, "Build quiz")));
      page.appendChild(grid);

      /* weak areas pre-filters (from ?weak=) */
      var weak = S.weakAreas();
      if (weak.length) {
        page.appendChild(V.sectionLabel("Weak areas", "click to pre-filter"));
        var wrap = V.el("div", { class: "chiprow" });
        weak.slice(0, 6).forEach(function (w) {
          wrap.appendChild(V.el("button", { class: "meta-chip meta-chip--warn", "data-testid": w.type === "chapter" ? "exam-weak-ch" + w.n : "exam-weak-" + w.id, onclick: function () {
            var qs;
            if (w.type === "chapter") qs = QS.filter(function (q) { return q.chapter === w.n; });
            else qs = [byId[w.id]];
            startSession({ mode: "practice", questions: qs, shuffle: false, timerStyle: "countup", checkMode: "instant" });
          } }, w.type === "chapter" ? "Practice Ch " + w.n + " (" + w.correct + "/" + w.seen + ")" : "Retry " + w.id + " (" + w.incorrect + "× missed)"));
        });
        page.appendChild(wrap);
      }

      /* single-question deep link (?learn=Qn) */
      if (route && route.query.learn && byId[route.query.learn.toUpperCase()]) {
        var qid = route.query.learn.toUpperCase();
        page.appendChild(V.el("div", { class: "banner banner--success" }, V.icon("info", true),
          V.el("span", {}, "Deep link: practice " + qid + " (Ch " + byId[qid].chapter + " · " + byId[qid].k_level + " · " + byId[qid].points + " pt)"),
          V.el("button", { class: "banner__act", "data-testid": "exam-learn-start", onclick: function () {
            startSession({ mode: "practice", questions: [byId[qid]], shuffle: false, timerStyle: "countup", checkMode: "instant" });
          } }, "Practice it →")));
      }

      /* attempts */
      var attempts = S.getAttempts();
      page.appendChild(V.sectionLabel("Attempts", attempts.length || "none yet"));
      if (attempts.length) {
        page.appendChild(V.el("table", { class: "tbl" },
          V.el("thead", {}, V.el("tr", {}, ["When", "Mode", "Score", "Result", "Time", ""].map(function (h) { return V.el("th", { text: h }); }))),
          V.el("tbody", {}, attempts.slice(0, 12).map(function (a, ai) {
            return V.el("tr", {},
              V.el("td", { class: "t-small", text: new Date(a.submittedAt).toLocaleString() }),
              V.el("td", {}, V.el("span", { class: "meta-chip" + (a.mode === "sim" ? " meta-chip--accent" : ""), text: a.mode })),
              V.el("td", { class: "t-num", text: a.points + "/" + a.maxPoints }),
              V.el("td", {}, a.mode === "sim" ? V.el("span", { class: "meta-chip " + (a.passed ? "meta-chip--success" : "meta-chip--danger"), text: a.passed ? "PASS" : "FAIL" })
                : V.el("span", { class: "t-small", style: "color:var(--ink-3)", text: "≥" + a.threshold + " to pass" })),
              V.el("td", { class: "t-small", text: V.fmtTime(a.timeUsedMs / 1000) }),
              V.el("td", {}, V.el("a", { class: "t-small", href: "#/results/" + a.sessionId, "data-testid": "exam-attempt-" + ai }, "report · review")));
          }))));
      }
      return page;
    }
  };
})();
