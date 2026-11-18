/* selftest.js — #/selftest: in-page UI test suite (Gate C, scripted).
 * Runs real scenarios through real DOM events (el.click(), dispatched keydowns)
 * against data-testid anchors, then renders a report. Node driver reads
 * [data-testid="test-report"][data-json]. No framework; state is backed up and restored. */
(function () {
  "use strict";
  window.CTAI_VIEWS = window.CTAI_VIEWS || {};
  var S = window.Store;
  var QS = window.CTAI_QUESTIONS;
  var byId = {}; QS.forEach(function (q) { byId[q.id] = q; });

  var lastReport = null;   /* re-renders show the last report instead of re-running */
  var running = false;

  /* ---------- tiny helpers ---------- */
  function tid(id) {
    var el = document.querySelector('[data-testid="' + id + '"]');
    if (!el) throw new Error("missing [data-testid=" + id + "]");
    return el;
  }
  function tryTid(id) { return document.querySelector('[data-testid="' + id + '"]'); }
  function qsa(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function sleep(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }
  function nav(hash) {
    if (location.hash === hash) { Router.render(); return sleep(20); }
    location.hash = hash;
    return sleep(50); /* let render + guard double-hashchange settle */
  }
  function key(k) {
    document.dispatchEvent(new KeyboardEvent("keydown", { key: k, bubbles: true, cancelable: true }));
  }
  function assert(cond, msg) { if (!cond) throw new Error(msg || "assertion failed"); }
  function eq(a, b, msg) { if (a !== b) throw new Error((msg || "eq") + ": expected " + JSON.stringify(b) + ", got " + JSON.stringify(a)); }
  function sess() { return S.getSession(); }
  /* test hygiene: reach a clean exam hub — clear any live session BEFORE navigating
     so the sim leave-guard never fires (the guarded path itself is tested separately) */
  function gotoHub() {
    if (S.getSession()) S.clearSession();
    var m = tryTid("modal"); if (m) m.remove();
    return nav("#/exam");
  }

  /* answer the currently rendered question correctly via test ids */
  function answerCorrect(q) {
    if (q.type === "single") {
      tid("opt-" + q.id + "-" + q.correct_keys[0]).click();
    } else if (q.type === "multi_two") {
      q.correct_keys.forEach(function (k) { tid("opt-" + q.id + "-" + k).click(); });
    } else if (q.type === "assign") {
      Object.keys(q.interaction.correct_assignment).forEach(function (i) {
        var ci = q.interaction.categories.indexOf(q.interaction.correct_assignment[i]);
        var cell = document.querySelector('[data-testid="assign-cell"][data-row="' + i + '"][data-cat="' + ci + '"]');
        if (!cell) throw new Error("assign cell not found row=" + i + " cat=" + ci);
        cell.click();
      });
    } else if (q.type === "pair") {
      q.interaction.left.forEach(function (l, li) {
        tid("pair-left-" + li).click();
        tid("pair-right-" + q.interaction.correct_pairs[l]).click();
      });
    } else if (q.type === "order") {
      q.interaction.correct_sequence.forEach(function (t) {
        var chip = qsa('[data-testid="order-chip"]').filter(function (c) { return c.dataset.text === t && !c.closest(".order-lane"); })[0];
        if (!chip) throw new Error("order pool chip not found: " + t);
        chip.click();
      });
    } else throw new Error("unknown type " + q.type);
  }
  function jumpTo(n) {
    var inp = tid("jump-input");
    inp.value = String(n);
    inp.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true, cancelable: true }));
  }
  function lastAttempt() { return S.getAttempts()[0]; } /* pushAttempt unshifts — newest first */

  /* ---------- the suite ---------- */
  var TESTS = [];
  function test(name, fn) { TESTS.push({ name: name, fn: fn }); }

  test("dashboard renders 7 chapter cards", function () {
    return nav("#/").then(function () {
      for (var n = 1; n <= 7; n++) assert(tryTid("dash-ch" + n), "dash-ch" + n + " missing");
    });
  });

  test("theme: quick-flip button + System/Light/Dark radio persist", function () {
    var before = document.documentElement.dataset.theme;
    tid("theme-btn").click();
    var after = document.documentElement.dataset.theme;
    assert(before !== after, "theme did not flip");
    eq(S.settings.theme, after, "setting persisted");
    tid("theme-btn").click();
    eq(document.documentElement.dataset.theme, before, "theme restored");

    /* three-way radio: explicit light/dark + auto (resolved live) */
    tid("theme-light").click();
    eq(S.settings.theme, "light", "radio light persisted");
    eq(document.documentElement.dataset.theme, "light", "light applied");
    eq(tid("theme-light").getAttribute("aria-checked"), "true", "light radio checked");
    tid("theme-dark").click();
    eq(S.settings.theme, "dark", "radio dark persisted");
    eq(document.documentElement.dataset.theme, "dark", "dark applied");
    tid("theme-auto").click();
    eq(S.settings.theme, "auto", "radio auto persisted");
    var resolved = matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    eq(document.documentElement.dataset.theme, resolved, "auto resolves to system theme");
    eq(tid("theme-auto").getAttribute("aria-checked"), "true", "auto radio checked");
  });

  test("layout: shell flush — no gap above topbar, token paddings", function () {
    return nav("#/").then(function () {
      var topbar = document.querySelector(".topbar").getBoundingClientRect();
      eq(Math.round(topbar.top), 0, "topbar must sit at viewport top (sprite svg[hidden] bug regression)");
      var app = document.querySelector(".app").getBoundingClientRect();
      eq(Math.round(app.top), 0, ".app must start at y=0");
      var padTop = getComputedStyle(document.querySelector(".content")).paddingTop;
      eq(padTop, "24px", ".content padding-top must track --content-pad-top");
      var ratio = document.documentElement.scrollHeight / window.innerHeight;
      assert(ratio < 2.7, "dashboard taller than 2.7 viewports (" + ratio.toFixed(2) + ")");
    });
  });

  test("testids: every interactive element is anchored on main routes", function () {
    var routes = ["#/", "#/study", "#/study/ch2", "#/cheatsheets", "#/cheatsheets/ch1", "#/glossary", "#/exam", "#/intel"];
    var missing = [];
    var chain = Promise.resolve();
    routes.forEach(function (r) {
      chain = chain.then(function () { return nav(r); }).then(function () {
        qsa("#content button, #content a, #content input, #content select").forEach(function (el) {
          if (el.closest("[data-testid-ignore]")) return;
          if (!el.getAttribute("data-testid")) {
            missing.push(r + " → " + el.tagName.toLowerCase() + " " + ((el.textContent || "").trim().slice(0, 30)));
          }
        });
        if (r === "#/") { /* shell chrome lives outside #content — check once */
          ["brand-link", "theme-btn", "kbd-btn", "reset-btn", "drawer-btn", "nav-home", "nav-study", "nav-cheatsheets",
           "nav-glossary", "nav-exam", "nav-results", "nav-intel"].forEach(function (t) {
            if (!tryTid(t)) missing.push("#/ shell → " + t);
          });
        }
      });
    });
    return chain.then(function () {
      assert(!missing.length, "elements without data-testid:\n" + missing.join("\n"));
    });
  });

  test("nav: nav-study click navigates + aria-current", function () {
    return nav("#/").then(function () {
      tid("nav-study").click();
      return sleep(50);
    }).then(function () {
      eq(location.hash, "#/study", "nav-study navigation");
      eq(tid("nav-study").getAttribute("aria-current"), "page", "aria-current on active nav item");
    });
  });

  test("glossary: tabs + A–Z rail are anchored and live", function () {
    return nav("#/glossary").then(function () {
      eq(qsa('[data-testid^="az-"]').length, 26, "A–Z rail buttons");
      tid("gloss-tab-abbr").click();
      assert(document.querySelector(".tbl"), "abbreviations table missing after tab click");
      var abbr = window.CTAI_DATA.glossary.abbreviations;
      var k0 = Object.keys(abbr)[0];
      assert(document.body.textContent.indexOf(abbr[k0]) >= 0, "abbreviation row for " + k0 + " missing");
      eq(tid("gloss-tab-abbr").getAttribute("aria-selected"), "true", "tab aria-selected");
    });
  });

  test("study ch2: understood toggles progress", function () {
    return nav("#/study/ch2").then(function () {
      var btn = document.querySelector('[data-testid^="understood-"]');
      assert(btn, "understood button missing");
      var subId = btn.getAttribute("data-testid").replace("understood-", "");
      btn.click();
      assert(S.getProgress()[subId] && S.getProgress()[subId].understood, "progress key not written");
      assert(btn.getAttribute("aria-pressed") === "true", "aria-pressed not updated");
      btn.click();
      assert(!S.getProgress()[subId], "progress key not removed");
    });
  });

  test("study: TOC link opens its lesson in-place (no 404 hijack)", function () {
    return nav("#/study/ch2").then(function () {
      var link = document.querySelector('[data-testid^="study-toc-"]');
      assert(link, "TOC link missing");
      var sub = link.getAttribute("data-testid").replace("study-toc-", "");
      link.click();
      return sleep(140).then(function () {
        eq(location.hash, "#/study/ch2/" + sub, "TOC must navigate the study deep-link route");
        var acc = document.querySelector('.lo-acc[data-sub="' + sub + '"]');
        assert(acc, "target lesson accordion missing");
        assert(acc.classList.contains("is-open"), "target lesson not opened");
        assert(/Page not found/.test(document.body.textContent) === false, "TOC must not land on the 404 view");
      });
    });
  });

  test("glossary search filters terms", function () {
    return nav("#/glossary").then(function () {
      var all = qsa(".term-card, .gloss-row, .term").length;
      assert(all > 10, "glossary list too small to test (" + all + ")");
      var inp = tid("glossary-search");
      inp.value = "neuron";
      inp.dispatchEvent(new Event("input", { bubbles: true }));
      var filtered = qsa(".term-card, .gloss-row, .term").length;
      assert(filtered > 0 && filtered < all, "filter did not shrink list (" + filtered + " vs " + all + ")");
      inp.value = "";
      inp.dispatchEvent(new Event("input", { bubbles: true }));
      eq(qsa(".term-card, .gloss-row, .term").length, all, "clear filter restores list");
    });
  });

  test("cheatsheet ch1 renders blocks", function () {
    return nav("#/cheatsheets/ch1").then(function () {
      assert(document.querySelector(".sheet-block"), "sheet blocks missing");
    });
  });

  test("exam hub offers 4 modes", function () {
    return nav("#/exam").then(function () {
      ["start-sim", "start-practice", "start-appendix", "start-quick"].forEach(function (t) {
        assert(tryTid(t), t + " missing");
      });
    });
  });

  test("examhub: option switches flip + persist", function () {
    return nav("#/exam").then(function () {
      var sw = tid("switch-ext");
      var before = sw.getAttribute("aria-checked");
      sw.click();
      eq(sw.getAttribute("aria-checked"), before === "true" ? "false" : "true", "aria-checked flips");
      eq(String(S.settings.extendedTime), sw.getAttribute("aria-checked"), "setting persisted");
      sw.click();
      eq(sw.getAttribute("aria-checked"), before, "switch restored");
      ["switch-shuffle", "switch-wrong", "switch-pacing"].forEach(function (t) { assert(tryTid(t), t + " missing"); });
    });
  });

  test("learning: wrong reveal locks + styles; try again; correct reveal", function () {
    return gotoHub().then(function () {
      tid("start-practice").click();
      return sleep(50);
    }).then(function () {
      assert(tryTid("btn-check"), "runner did not start");
      eq(sess().mode, "practice", "session mode");
      eq(sess().questionIds.length, 46, "practice set = 46");

      jumpTo(8);
      var q8 = byId["Q8"];
      var wrongKey = q8.options.map(function (o) { return o.key; }).filter(function (k) { return q8.correct_keys.indexOf(k) < 0; })[0];
      tid("opt-Q8-" + wrongKey).click();
      tid("btn-check").click();
      var wrongRow = tid("opt-Q8-" + wrongKey);
      assert(wrongRow.classList.contains("is-incorrect"), "wrong row not is-incorrect");
      assert(wrongRow.hasAttribute("disabled"), "options not locked after check");
      var missedRow = tid("opt-Q8-" + q8.correct_keys[0]);
      assert(missedRow.classList.contains("is-correct") && missedRow.classList.contains("is-missed"), "missed-correct row not styled");
      assert(wrongRow.querySelector(".opt__verdict .vh"), "vh status word missing");
      assert(document.querySelector(".rationale__ans").textContent.indexOf("✗ Incorrect") === 0, "incorrect verdict line missing");

      tid("btn-again").click();
      assert(!tid("opt-Q8-" + wrongKey).hasAttribute("disabled"), "try again did not unlock");
      assert(tryTid("btn-check"), "check button not restored");

      tid("opt-Q8-" + q8.correct_keys[0]).click();
      tid("btn-check").click();
      assert(tid("opt-Q8-" + q8.correct_keys[0]).classList.contains("is-correct"), "correct row not is-correct");
      assert(document.querySelector(".rationale__ans").textContent.indexOf("✓ Correct") === 0, "correct verdict missing");
    });
  });

  test("learning: flag + palette reflect state", function () {
    var idx = sess().uiState.currentIndex; /* still Q8 */
    assert(tid("pal-" + idx).classList.contains("is-answered"), "palette chip not answered");
    tid("btn-flag").click();
    assert(tid("pal-" + idx).classList.contains("is-flagged"), "palette chip not flagged");
    assert(sess().flags["Q8"], "flag not persisted");
    tid("btn-flag").click();
    assert(!tid("pal-" + idx).classList.contains("is-flagged"), "flag not cleared");
  });

  test("learning: multi_two max-2 + exact-match scoring", function () {
    jumpTo(2);
    var q2 = byId["Q2"];
    eq(q2.type, "multi_two", "Q2 is multi_two");
    var wrong = q2.options.map(function (o) { return o.key; }).filter(function (k) { return q2.correct_keys.indexOf(k) < 0; });
    tid("opt-Q2-" + wrong[0]).click();
    tid("opt-Q2-" + wrong[1]).click();
    tid("opt-Q2-" + wrong[2]).click(); /* must be rejected */
    eq(sess().responses["Q2"].selected.length, 2, "third selection must be rejected");
    var note = document.querySelector(".sel-note");
    assert(note && note.textContent.indexOf("TWO") >= 0, "max-2 note missing");
    tid("opt-Q2-" + wrong[0]).click(); /* deselect both wrong */
    tid("opt-Q2-" + wrong[1]).click();
    q2.correct_keys.forEach(function (k) { tid("opt-Q2-" + k).click(); });
    tid("btn-check").click();
    assert(document.querySelector(".rationale__ans").textContent.indexOf("✓ Correct") === 0, "multi correct verdict missing");
    assert(tid("opt-Q2-" + q2.correct_keys[0]).classList.contains("is-correct"), "multi correct row not styled");
  });

  test("learning: finish → practice results + review filters", function () {
    tid("btn-finish").click();
    return sleep(50).then(function () {
      assert(location.hash.indexOf("#/results/") === 0, "results route");
      var a = lastAttempt();
      eq(a.mode, "practice", "attempt mode");
      eq(a.points, 2, "practice points (Q2+Q8)");
      eq(a.maxPoints, 50, "practice max");
      eq(a.threshold, 33, "practice threshold 33@50");
      assert(document.body.textContent.indexOf("33 of 50") >= 0, "pass-mark line missing");
      var heroNum = document.querySelector("#content .ring--hero .ring__num");
      assert(heroNum && heroNum.textContent.trim() === "2", "hero ring score missing: " + (heroNum ? heroNum.textContent : "no ring"));
      eq(qsa('[data-testid="vgrid"] > *').length, 46, "verdict grid 46 chips");

      tid("results-review-all").click();
      return sleep(50);
    }).then(function () {
      assert(location.hash.indexOf("/review") >= 0, "review route");
      assert(tryTid("filter-incorrect"), "filter tabs missing");
      tid("filter-incorrect").click();
      return sleep(50);
    }).then(function () {
      assert(document.body.textContent.indexOf("Nothing in this filter") >= 0, "incorrect filter should be empty");
      tid("filter-unanswered").click();
      return sleep(50);
    }).then(function () {
      assert(document.body.textContent.indexOf("Nothing in this filter") < 0, "unanswered filter should have cards");
      key("j"); key("j");
      assert(document.querySelector(".rationale"), "review card shows rationale");
    });
  });

  test("appendix: A1 assign / A4 pair / A5 order + reveals", function () {
    return gotoHub().then(function () {
      tid("start-appendix").click();
      return sleep(50);
    }).then(function () {
      assert(tryTid("assign-cell"), "A1 widget missing");
      eq(sess().questionIds.length, 6, "appendix set = 6");

      var a1 = byId["A1"];
      answerCorrect(a1);
      tid("btn-check").click();
      assert(qsa(".assign-row.is-ok").length === a1.interaction.statements.length, "A1 rows not is-ok");
      assert(document.querySelector(".rationale figure, .rationale img"), "A1 answer figure missing");
      var firstCell = document.querySelector('[data-testid="assign-cell"][data-row="0"]');
      var checkedBefore = firstCell.getAttribute("aria-checked");
      firstCell.click();
      eq(firstCell.getAttribute("aria-checked"), checkedBefore, "A1 must be locked after check");

      tid("pal-1").click(); answerCorrect(byId["A2"]); tid("btn-check").click();
      tid("pal-2").click(); answerCorrect(byId["A3"]); tid("btn-check").click();
      tid("pal-5").click(); answerCorrect(byId["A6"]); tid("btn-check").click();

      tid("pal-3").click();
      assert(tryTid("pair-left-0"), "A4 widget missing");
      var a4 = byId["A4"];
      answerCorrect(a4);
      tid("btn-check").click();
      var lines = qsa(".pair-svg line");
      eq(lines.length, a4.interaction.left.length, "A4 connector lines");
      assert(lines.every(function (l) { return l.classList.contains("is-right"); }), "A4 lines not green");

      tid("pal-4").click();
      assert(tryTid("order-pool"), "A5 widget missing");
      var a5 = byId["A5"];
      answerCorrect(a5);
      tid("btn-check").click();
      var laneChips = qsa('[data-testid="order-lane"] [data-testid="order-chip"]');
      eq(laneChips.length, a5.interaction.items.length, "A5 lane chips");
      assert(laneChips.every(function (c) { return c.classList.contains("is-ok"); }), "A5 chips not is-ok");
      assert(document.querySelector(".rationale figure, .rationale img"), "A5 answer figure missing");

      tid("btn-finish").click();
      return sleep(50);
    }).then(function () {
      var a = lastAttempt();
      eq(a.mode, "appendix", "appendix attempt mode");
      eq(a.points + "/" + a.maxPoints, "6/6", "appendix 6/6");
    });
  });

  test("appendix review shows widget overlays", function () {
    var a = lastAttempt();
    location.hash = "#/results/" + a.sessionId + "/review?filter=all";
    return sleep(50).then(function () {
      for (var i = 0; i < a.perQuestion.length; i++) {
        if (tryTid("pair-left-0")) break;
        key("j");
      }
      assert(tryTid("pair-left-0"), "A4 not reached in review");
      var lines = qsa(".pair-svg line");
      assert(lines.length && lines.every(function (l) { return l.classList.contains("is-right"); }), "review A4 reveal lines");
      key("j");
      var lane = qsa('[data-testid="order-lane"] [data-testid="order-chip"]');
      assert(lane.length && lane.every(function (c) { return c.classList.contains("is-ok"); }), "review A5 reveal chips");
    });
  });

  test("sim: keyboard answer, jump buffer, submit gate, full-correct PASS math", function () {
    return gotoHub().then(function () {
      tid("start-sim").click();
      return sleep(50);
    }).then(function () {
      var s0 = sess();
      eq(s0.mode, "sim", "sim mode");
      eq(s0.questionIds.length, 40, "sim 40 questions");
      eq(s0.maxPoints, 44, "sim 44 points");
      eq(s0.threshold, 29, "sim threshold 29");
      assert(/^\d+:\d\d$/.test(document.querySelector('.exam-bar [role="timer"]').textContent), "countdown timer text");

      var q1 = byId["Q1"];
      key(q1.correct_keys[0]);
      if (!sess().responses["Q1"]) {
        throw new Error("keyboard answer failed — diag " + JSON.stringify({
          hash: location.hash, head: (document.querySelector(".q-card__title") || {}).textContent || "none",
          responses: Object.keys(sess().responses), curIdx: sess().uiState.currentIndex
        }));
      }
      eq(sess().responses["Q1"].selected, q1.correct_keys[0], "keyboard answer wrong");
      key("2"); key("Enter");
      eq(sess().uiState.currentIndex, 1, "number-key jump buffer");

      for (var i = 0; i < s0.questionIds.length; i++) {
        tid("pal-" + i).click();
        answerCorrect(byId[s0.questionIds[i]]);
      }

      tid("btn-submit").click();
      assert(tryTid("modal"), "submit modal missing");
      assert(/unanswered/.test(document.body.textContent), "gate lists unanswered count");
      tid("modal-keep-working").click();
      assert(!tryTid("modal"), "modal did not close");
      tid("btn-submit").click();
      tid("modal-submit").click();
      return sleep(80);
    }).then(function () {
      assert(location.hash.indexOf("#/results/") === 0, "results after submit");
      var a = lastAttempt();
      eq(a.mode, "sim", "sim attempt");
      eq(a.points + "/" + a.maxPoints, "44/44", "sim full-correct score");
      assert(a.passed, "sim must PASS at 44/44");
      var chips = qsa('[data-testid="vgrid"] > *');
      eq(chips.length, 40, "sim verdict grid 40");
      assert(chips.every(function (c) { return c.classList.contains("is-correct"); }), "all chips correct");
      assert(S.settings.celebratedPass, "one-time confetti flag set");
      assert(/PASS/.test(document.body.textContent), "PASS verdict shown");
    });
  });

  test("sim leave-guard: cancel keeps, abandon clears", function () {
    return gotoHub().then(function () {
      tid("start-sim").click();
      return sleep(50);
    }).then(function () {
      tid("opt-Q1-" + byId["Q1"].correct_keys[0]).click();
      location.hash = "#/study";
      return sleep(80);
    }).then(function () {
      assert(tryTid("modal"), "leave guard modal missing");
      tid("modal-cancel").click();
      return sleep(50);
    }).then(function () {
      assert(location.hash.indexOf("#/exam/run/") === 0, "cancel must keep sim");
      assert(sess(), "session still alive after cancel");
      location.hash = "#/study";
      return sleep(80);
    }).then(function () {
      assert(tryTid("modal"), "guard modal (2nd) missing");
      tid("modal-ok").click();
      return sleep(50);
    }).then(function () {
      eq(location.hash, "#/study", "abandon navigates");
      assert(!sess(), "session cleared after abandon");
    });
  });

  test("sim resume: re-entering runner route resumes state + timer", function () {
    return gotoHub().then(function () {
      tid("start-sim").click();
      return sleep(50);
    }).then(function () {
      var sid = sess().sessionId;
      tid("opt-Q1-" + byId["Q1"].correct_keys[0]).click();
      var endsAtBefore = sess().endsAt;
      return nav("#/exam/run/" + sid).then(function () { return { sid: sid, endsAtBefore: endsAtBefore }; });
    }).then(function (r) {
      var s2 = sess();
      assert(s2 && s2.sessionId === r.sid, "session persisted across re-render");
      assert(tryTid("btn-submit"), "runner controls re-rendered");
      assert(/^\d+:\d\d$/.test(document.querySelector('.exam-bar [role="timer"]').textContent), "timer resumed");
      eq(Object.keys(s2.responses).length, 1, "answered state resumed");
      assert(s2.endsAt >= r.endsAtBefore - 1000, "endsAt drifted badly");
      tid("btn-submit").click();
      tid("modal-submit").click();
      return sleep(80).then(function () {
        assert(!sess(), "session archived after submit");
      });
    });
  });

  test("mobile palette sheet: chips + jump are live", function () {
    return gotoHub().then(function () {
      tid("start-practice").click();
      return sleep(50);
    }).then(function () {
      tid("btn-sheet").click();
      var sheet = tid("palette-sheet");
      assert(sheet.classList.contains("is-open"), "sheet did not open");
      tid("spal-2").click(); /* sheet chip must navigate (was cloneNode-dead before) */
      eq(sess().uiState.currentIndex, 2, "sheet chip navigation");
      var sj = tid("sheet-jump-input");
      sj.value = "5";
      sj.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true, cancelable: true }));
      eq(sess().uiState.currentIndex, 4, "sheet jump input");
      key("Escape");
      assert(!sheet.classList.contains("is-open"), "Esc did not close sheet");
      tid("btn-finish").click();
      return sleep(50);
    });
  });

  test("layout: exam shell flush — no seam, no double padding", function () {
    return gotoHub().then(function () {
      tid("start-quick").click();
      return sleep(340); /* let the 180ms view-enter transform settle before measuring */
    }).then(function () {
      eq(getComputedStyle(document.querySelector(".content")).paddingTop, "0px",
        "exam shell must not inherit .content padding (background seam bug)");
      var bar = document.querySelector(".exam-bar").getBoundingClientRect();
      eq(Math.round(bar.top), 0, "exam bar must sit at viewport top");
      assert(bar.height > 40, "exam bar height");
      /* palette rail: the is-current outline (2px + 2px offset) must have paint room inside the rail */
      var rail = document.querySelector(".exam-rail");
      var grid = tid("pal-grid");
      var gridL = grid.getBoundingClientRect().left - rail.getBoundingClientRect().left;
      var gridR = rail.getBoundingClientRect().right - grid.getBoundingClientRect().right;
      assert(gridL >= 4 && gridR >= 4, "palette grid needs ≥4px cushion in rail (got " + gridL + "/" + gridR + ")");
      var chips = qsa('[data-testid="pal-grid"] > *');
      assert(chips.length > 0, "palette chips missing");
      var railR = rail.getBoundingClientRect();
      chips.forEach(function (c) {
        var r = c.getBoundingClientRect();
        assert(r.left >= railR.left - 0.5 && r.right <= railR.right + 0.5, "palette chip outside rail bounds");
      });
      tid("btn-finish").click();
      return sleep(60);
    });
  });

  test("review: prev/next buttons navigate the card list", function () {
    var a = lastAttempt();
    location.hash = "#/results/" + a.sessionId + "/review?filter=all";
    return sleep(60).then(function () {
      var title = function () { return (document.querySelector(".q-card__title") || {}).textContent || ""; };
      assert(/1 of /.test(title()), "expected card 1 first: " + title());
      tid("review-next").click();
      assert(/2 of /.test(title()), "review-next: " + title());
      tid("review-prev").click();
      assert(/1 of /.test(title()), "review-prev: " + title());
    });
  });

  /* ---------- runner ---------- */
  function backup() {
    var out = {};
    for (var i = 0; i < localStorage.length; i++) {
      var k = localStorage.key(i);
      if (k.indexOf("ctai.") === 0) out[k] = localStorage.getItem(k);
    }
    return out;
  }
  function restore(bak) {
    var keys = [];
    for (var i = 0; i < localStorage.length; i++) { var k = localStorage.key(i); if (k.indexOf("ctai.") === 0) keys.push(k); }
    keys.forEach(function (k) { localStorage.removeItem(k); });
    Object.keys(bak).forEach(function (k) { localStorage.setItem(k, bak[k]); });
  }

  function renderReport(page, report) {
    page.appendChild(window.UI.el("div", { class: "page-head" },
      window.UI.el("h1", { class: "t-h1" }, "UI selftest — " + report.passed + "/" + report.total + " passed"),
      window.UI.el("p", { class: "t-lead" }, report.failed ? "FAILURES (state was backed up and restored):" : "All green. State was backed up and restored.")));
    var list = window.UI.el("div", { class: "card", style: "padding:16px" });
    report.results.forEach(function (r) {
      list.appendChild(window.UI.el("div", { style: "padding:6px 0;border-bottom:1px solid var(--line-1)" },
        window.UI.el("span", { style: "font-weight:700;color:" + (r.ok ? "var(--success)" : "var(--danger)") }, r.ok ? "✓ " : "✗ "),
        r.name,
        r.err ? window.UI.el("div", { class: "t-small", style: "color:var(--danger);white-space:pre-wrap;margin-left:22px" }, String(r.err)) : null));
    });
    page.appendChild(list);
    var json = window.UI.el("pre", { class: "t-small", "data-testid": "test-report" });
    json.setAttribute("data-json", JSON.stringify(report));
    json.textContent = "data-json: " + JSON.stringify({ total: report.total, passed: report.passed, failed: report.failed,
      failures: report.results.filter(function (r) { return !r.ok; }).map(function (r) { return { name: r.name, error: String(r.err) }; }) });
    page.appendChild(json);
    return page;
  }

  window.CTAI_VIEWS.selftest = {
    render: function () {
      var page = window.UI.el("div", { class: "page" });
      if (lastReport) return renderReport(page, lastReport);
      if (running) { page.appendChild(window.UI.el("p", {}, "selftest already running…")); return page; }

      running = true;
      var bak = backup();
      var keys = []; for (var i = 0; i < localStorage.length; i++) { var k = localStorage.key(i); if (k.indexOf("ctai.") === 0) keys.push(k); }
      keys.forEach(function (k) { localStorage.removeItem(k); });
      S.settings.theme = "auto"; S.saveSettings();

      var report = { total: 0, passed: 0, failed: 0, results: [] };
      var chain = Promise.resolve();
      TESTS.forEach(function (t) {
        chain = chain.then(function () {
          report.total++;
          return Promise.resolve().then(t.fn).then(function () {
            report.passed++; report.results.push({ name: t.name, ok: true });
          }, function (e) {
            report.failed++; report.results.push({ name: t.name, ok: false, err: (e && e.message) ? e.message : String(e) });
          });
        });
      });
      chain.then(function () {
        restore(bak);
        running = false;
        lastReport = report;
        location.hash = "#/selftest?done=1";
        setTimeout(function () { Router.render(); }, 0);
      });
      page.appendChild(window.UI.el("p", { class: "t-lead" }, "Running " + TESTS.length + " UI tests… the page will navigate around; the report lands here."));
      return page;
    }
  };
})();
