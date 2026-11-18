/* views/runner.js — #/exam/run/:sessionId (D3 §4.7) — the critical screen */
(function () {
  "use strict";
  window.CTAI_VIEWS = window.CTAI_VIEWS || {};
  var V = window.UI, E = window.Engine, S = window.Store;
  var QS = window.CTAI_QUESTIONS;
  var byId = {}; QS.forEach(function (q) { byId[q.id] = q; });

  var rt = null; // active runtime

  function optionsFor(q, session) {
    var opts = q.options.slice();
    if (session.orderMap && session.orderMap[q.id]) {
      var order = session.orderMap[q.id];
      opts.sort(function (a, b) { return order.indexOf(a.key) - order.indexOf(b.key); });
    }
    return opts;
  }
  function displayLetter(key, q, session) {
    if (session.orderMap && session.orderMap[q.id]) {
      return session.orderMap[q.id].indexOf(key) >= 0 ? "abcde"[session.orderMap[q.id].indexOf(key)] : key;
    }
    return key;
  }
  function originalLetter(key, q) { return key; }

  window.CTAI_VIEWS.runner = {
    render: function (params) {
      var session = S.getSession();
      var attempt = null;
      if (!session || session.sessionId !== params.sessionId) {
        attempt = S.findAttempt(params.sessionId);
      }
      if (!session && !attempt) {
        return V.el("div", { class: "page" }, V.emptyState("Session not found", "It may have been discarded or reset.",
          V.el("a", { class: "btn btn--primary btn--sm", href: "#/exam", "data-testid": "runner-back" }, "Back to exam hub")));
      }
      if (attempt) { location.hash = "#/results/" + attempt.sessionId + "/review"; return V.el("div", { class: "page" }); }
      if (session.finished) { location.hash = "#/results/" + session.sessionId; return V.el("div", { class: "page" }); }

      /* resume: drift clamp + expiry auto-submit */
      E.applyDriftClamp(session);
      if (session.endsAt && Date.now() >= session.endsAt) {
        return finish(session, { autoSubmitted: true });
      }
      S.saveSession(session);

      /* runtime state */
      rt = { session: session, announced: {}, jump: "", checkedLocals: {} };
      var shell = V.el("div", { class: "exam-shell" });

      /* ---- top bar ---- */
      var timerEl = V.el("span", { class: "timer", role: "timer" });
      var countEl = V.el("span", { class: "exam-count" });
      var fill = V.el("div", { class: "exam-progress__fill" });
      var progress = V.el("div", { class: "exam-progress" }, fill);
      var flagBtn = V.el("button", { class: "btn btn--ghost btn--sm", "aria-pressed": "false", "data-testid": "btn-flag" }, V.icon("flag", true), "Flag");
      var sheetBtn = V.el("button", { class: "btn btn--ghost btn--sm palette-sheet-btn", "data-testid": "btn-sheet" }, V.icon("grid", true), "Questions");
      var submitBtn = V.el("button", { class: "btn btn--primary btn--sm", "data-testid": "btn-submit", onclick: function () { submitGate(); } }, "Submit exam");
      var finishBtn = V.el("button", { class: "btn btn--primary btn--sm", "data-testid": "btn-finish", onclick: function () { finish(session, {}); } }, "Finish");
      var isSim = session.mode === "sim";
      var bar = V.el("header", { class: "exam-bar" },
        V.el("span", { class: "exam-bar__brand" },
          V.icon(isSim ? "timer" : "book"),
          isSim ? "Simulation · Sample A v2.2" : session.mode === "appendix" ? "Appendix set" : session.mode === "quick" ? "Quick quiz" : "Learning mode"),
        V.el("span", { class: "exam-bar__spacer" }),
        countEl, timerEl, flagBtn, sheetBtn, isSim ? submitBtn : finishBtn);

      /* ---- palette ---- */
      function makeJumpInput(tid) {
        var inp = V.el("input", { class: "palette__jump", type: "text", inputmode: "numeric", "aria-label": "Jump to question number", placeholder: "#", maxlength: "2", "data-testid": tid });
        inp.addEventListener("keydown", function (e) {
          if (e.key === "Enter") {
            var n = parseInt(inp.value, 10);
            if (n >= 1 && n <= session.questionIds.length) goto(n - 1);
            inp.value = "";
            e.stopPropagation();
          }
        });
        return inp;
      }
      var jumpInput = makeJumpInput("jump-input");
      var sheetJumpInput = makeJumpInput("sheet-jump-input");
      var palGrid = V.el("div", { class: "palette__grid", role: "group", "aria-label": "Question navigator", "data-testid": "pal-grid" });
      var sheetGrid = V.el("div", { class: "palette__grid", role: "group", "aria-label": "Question navigator", "data-testid": "sheet-grid" });
      var legend = V.el("div", { class: "palette__legend" },
        V.el("span", {}, V.el("span", { class: "legend-dot", style: "background:var(--primary)" }), "answered"),
        V.el("span", {}, V.el("span", { class: "legend-dot", style: "background:var(--bg-2);border:1px solid var(--line-2)" }), "open"),
        V.el("span", {}, V.el("span", { class: "legend-dot", style: "background:var(--warn-soft);border:1px solid var(--warn)" }), "incomplete"),
        V.el("span", {}, V.el("span", { class: "legend-dot", style: "background:var(--warn);border-radius:50%;width:6px;height:6px;vertical-align:2px" }), "flagged"));
      function chipFor(id, i, tid) {
        var q = byId[id];
        var resp = session.responses[id];
        var answered = resp && E.isAnswered(q, resp);
        var incomplete = resp && !E.isAnswered(q, resp) && (q.type === "multi_two" ? Array.isArray(resp.selected) && resp.selected.length === 1 : false);
        var chip = V.el("button", {
          class: "pal-chip" + (answered ? " is-answered" : "") + (incomplete ? " is-incomplete" : "") +
            (session.flags[id] ? " is-flagged" : "") + (i === session.uiState.currentIndex ? " is-current" : ""),
          "data-testid": (tid || "pal-") + i,
          "aria-label": "Question " + id.replace(/[QA]/, "") + (answered ? ", answered" : ", unanswered") + (session.flags[id] ? ", flagged" : ""),
          "aria-current": i === session.uiState.currentIndex ? "true" : null,
          text: id.replace(/[QA]/, "")
        });
        if (session.mode !== "sim" && rt.checkedLocals[id] != null) {
          chip.classList.add(rt.checkedLocals[id] ? "is-correct" : "is-incorrect");
        }
        chip.addEventListener("click", function () { goto(i); });
        return chip;
      }
      function buildPalette() {
        [palGrid, sheetGrid].forEach(function (grid, gi) {
          grid.innerHTML = "";
          session.questionIds.forEach(function (id, i) { grid.appendChild(chipFor(id, i, gi ? "spal-" : "pal-")); });
        });
        countEl.textContent = session.questionIds.filter(function (id) {
          return E.isAnswered(byId[id], session.responses[id]);
        }).length + "/" + session.questionIds.length + " answered";
        fill.style.width = (session.questionIds.filter(function (id) { return E.isAnswered(byId[id], session.responses[id]); }).length / session.questionIds.length * 100) + "%";
      }
      var rail = V.el("aside", { class: "exam-rail" },
        V.el("div", { class: "palette__head t-caption", style: "color:var(--ink-3)" }, "Jump to", jumpInput),
        palGrid, legend);
      var sheet = V.el("div", { class: "palette-sheet", "data-testid": "palette-sheet" },
        V.el("div", { class: "palette-sheet__handle" }),
        V.el("div", { class: "palette__head t-caption", style: "color:var(--ink-3)" }, "Jump to", sheetJumpInput),
        sheetGrid, legend.cloneNode(true));
      sheetBtn.addEventListener("click", function () { sheet.classList.add("is-open"); });

      /* ---- question area ---- */
      var main = V.el("div", { class: "exam-main" });
      var body = V.el("div", { class: "exam-body" }, main, rail);

      function persist() {
        session.lastHeartbeatAt = Date.now();
        S.saveSession(session);
      }

      function goto(i) {
        session.uiState.currentIndex = Math.max(0, Math.min(session.questionIds.length - 1, i));
        persist(); renderQuestion(); buildPalette();
        main.parentElement.scrollTop = 0; window.scrollTo(0, 0);
      }
      function current() { return byId[session.questionIds[session.uiState.currentIndex]]; }

      function renderQuestion() {
        var q = current();
        var idx = session.uiState.currentIndex;
        main.innerHTML = "";
        var resp = session.responses[q.id] || null;

        var head = V.el("div", { class: "q-card__head" },
          V.el("span", { class: "q-card__title", text: (q.set === "appendix" ? "Appendix " : "Question ") + q.number + "  (" + (idx + 1) + " of " + session.questionIds.length + " in this session)" }),
          !isSim ? V.el("span", { class: "chiprow" },
            V.el("a", { class: "meta-chip", href: "#/study/ch" + q.chapter, style: "text-decoration:none" }, q.lo),
            V.kchip(q.k_level), V.chip(q.points + " pt", { mono: true }),
            q.lo_note ? V.chip("LO note", { variant: "warn", tip: q.lo_note }) : null) : null);

        var card = V.el("section", { class: "q-card", role: "group", "aria-labelledby": "qhead" });
        card.appendChild(head);
        card.appendChild(V.el("div", { class: "q-card__stem md", html: window.md(q.stem_md) }));
        q.figures.forEach(function (f) { card.appendChild(V.figure(f, { title: q.label })); });
        if (q.select_instruction) {
          card.appendChild(V.el("div", { class: "q-card__select" },
            V.el("span", { class: "meta-chip meta-chip--accent", html: window.md(q.select_instruction).replace(/<\/?p>/g, "") })));
        }

        var checked = !isSim && rt.checkedLocals[q.id] != null; // learning reveal state
        var noteEl = V.el("div", { class: "sel-note", role: "status" });

        if (q.options) {
          var opts = optionsFor(q, session);
          var optEls = {};
          opts.forEach(function (o) {
            var dl = displayLetter(o.key, q, session);
            var selected = resp && (q.type === "multi_two" ? (resp.selected || []).includes(o.key) : resp && resp.selected === o.key);
            var verdict = null;
            if (checked && q.correct_keys && q.correct_keys.length) {
              var isKey = q.correct_keys.indexOf(o.key) >= 0;
              if (isKey && selected) verdict = { cls: "is-correct", icon: "i-check", word: "correct answer" };
              else if (isKey) verdict = { cls: "is-correct is-missed", icon: "i-check", word: "correct answer, not chosen" };
              else if (selected) verdict = { cls: "is-incorrect", icon: "i-x", word: "incorrect answer" };
            }
            var row = V.el("button", {
              class: "opt" + (q.type === "multi_two" ? " opt--multi" : "") + (selected ? " is-selected" : "") +
                (verdict ? " " + verdict.cls : "") + (checked ? " is-disabled" : ""),
              role: q.type === "multi_two" ? "checkbox" : "radio", "aria-checked": selected ? "true" : "false",
              disabled: checked ? "" : null,
              "data-testid": "opt-" + q.id + "-" + o.key,
              onclick: function () { selectOption(o.key); }
            },
              V.el("span", { class: "opt__ctrl" }),
              V.el("span", { class: "opt__key", text: dl }),
              V.el("span", { class: "opt__text md", html: window.md(o.text_md) }),
              V.el("span", { class: "opt__verdict" },
                verdict ? [V.icon(verdict.icon, true), V.el("span", { class: "vh" }, verdict.word)] : null));
            optEls[o.key] = row;
            card.appendChild(row);
          });
          card.appendChild(noteEl);
          card._optEls = optEls;
        } else {
          /* appendix widget */
          var w = buildWidget(q, resp, checked);
          card.appendChild(w);
          card._widget = w;
        }

        /* rationale (learning, after check) */
        if (checked) card.appendChild(rationalePanel(q, resp, card));

        /* footer nav */
        var checkBtn = (!isSim && !checked) ? V.el("button", { class: "btn btn--primary", "data-testid": "btn-check", onclick: function () { checkAnswer(card); } }, "Check answer") : null;
        var againBtn = (!isSim && checked) ? V.el("button", { class: "btn btn--outline", "data-testid": "btn-again", onclick: function () {
          delete rt.checkedLocals[q.id]; persist(); renderQuestion(); buildPalette();
        } }, "Try again") : null;
        card.appendChild(V.el("div", { class: "exam-foot" },
          V.el("button", { class: "btn btn--ghost", "data-testid": "btn-prev", onclick: function () { goto(idx - 1); } }, V.icon("arrow-l", true), "Previous"),
          V.el("span", { class: "spacer" }),
          againBtn, checkBtn,
          V.el("button", { class: "btn btn--outline", "data-testid": "btn-next", onclick: function () { goto(idx + 1); } }, "Next", V.icon("arrow-r", true))));
        main.appendChild(card);
        updateFlagBtn();
      }

      function selectOption(key) {
        var q = current();
        if (!isSim && rt.checkedLocals[q.id] != null) return; // locked until "Try again"
        var resp = session.responses[q.id] = session.responses[q.id] || {};
        if (q.type === "multi_two") {
          resp.selected = resp.selected || [];
          var i = resp.selected.indexOf(key);
          if (i >= 0) resp.selected.splice(i, 1);
          else if (resp.selected.length >= 2) {
            var note = main.querySelector(".sel-note");
            if (note) { note.textContent = "This question requires exactly TWO answers. Deselect one to choose another."; note.classList.add("is-on");
              setTimeout(function () { note.classList.remove("is-on"); }, 2600); }
            return;
          } else resp.selected.push(key);
        } else {
          resp.selected = key;
        }
        persist(); renderQuestion(); buildPalette();
        var chip = palGrid.children[session.uiState.currentIndex];
        if (chip) chip.classList.add("is-answered");
      }

      function buildWidget(q, resp, checked) {
        var it = q.interaction;
        var host = V.el("div", { class: "q-widget" });
        var w;
        var onChange = function (r) { session.responses[q.id] = r; persist(); buildPalette(); };
        var common = { onChange: onChange, locked: checked, reviewMode: checked };
        if (q.type === "assign") {
          w = Widgets.assign(it, Object.assign({ initial: resp && resp.assignment ? resp.assignment : {} }, common));
        } else if (q.type === "pair") {
          w = Widgets.pair(it, Object.assign({ initial: resp && resp.pairs ? resp.pairs : {} }, common));
        } else {
          w = Widgets.order(it, Object.assign({ initial: resp && resp.sequence ? { sequence: resp.sequence } : {} }, common));
        }
        session.responses[q.id] = session.responses[q.id] || w.getResp();
        host.appendChild(w.root);
        host._w = w;
        return host;
      }

      function reducedMotion() {
        var rm = S.settings && S.settings.reduceMotion;
        return rm === true || (rm !== false && window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
      }
      function checkAnswer(card) {
        var q = current();
        var resp = session.responses[q.id];
        var res = E.scoreQuestion(q, resp);
        rt.checkedLocals[q.id] = res.verdict === "correct";
        buildPalette();
        renderQuestion();
        var bad = main.querySelector(".opt.is-incorrect");
        if (bad && !reducedMotion()) {
          bad.classList.add("shake");
          setTimeout(function () { bad.classList.remove("shake"); }, 320);
        }
      }

      function rationalePanel(q, resp, card) {
        var res = E.scoreQuestion(q, resp);
        var box = V.el("div", { class: "rationale" });
        var ansText = q.correct_keys.length ?
          "Correct answer: " + q.correct_keys.join(", ") :
          "Correct arrangement — shown below and in the official answer figure.";
        box.appendChild(V.el("div", { class: "rationale__ans" },
          V.el("span", { class: res.verdict === "correct" ? "is-ok" : "", style: res.verdict === "correct" ? "color:var(--success)" : "color:var(--danger)" },
            res.verdict === "correct" ? "✓ Correct. " : res.verdict === "incorrect" ? "✗ Incorrect. " : "○ Not fully answered. "),
          ansText));
        var ul = V.el("ul", {});
        if (q.rationale.preamble_md) {
          box.appendChild(V.el("div", { class: "md t-small", style: "margin:var(--sp-2) 0", html: window.md(q.rationale.preamble_md) }));
        }
        q.rationale.units.forEach(function (u) {
          if (!u.key) return;
          ul.appendChild(V.el("li", { class: "t-small" },
            V.el("span", { class: "meta-chip" + (u.verdict === "correct" ? " meta-chip--success" : " meta-chip--danger"), style: "margin-right:6px", text: u.key + " " + (u.verdict === "correct" ? "✓" : "✗") }),
            V.el("span", { class: "md", html: window.md(u.text_md) })));
        });
        if (ul.children.length) box.appendChild(ul);
        var derived = q.why_not_derived.filter(function (d) {
          return !q.rationale.units.some(function (u) { return u.key === d.key; });
        });
        derived.forEach(function (d) {
          box.appendChild(V.el("div", { class: "t-small md", style: "margin-top:8px" },
            V.el("span", { class: "meta-chip meta-chip--accent derived-chip", text: "derived" }),
            V.el("span", { html: window.md(d.text_md) })));
        });
        if (q.rationale.conclusion_md) box.appendChild(V.el("div", { class: "md t-small", style: "margin-top:8px", html: window.md(q.rationale.conclusion_md) }));
        q.rationale.answer_figures.forEach(function (f) {
          box.appendChild(V.el("div", { style: "margin-top:12px" }, V.figure(f, { title: "Official answer figure" })));
        });
        if (q.interaction && q.interaction.derivation_note) {
          box.appendChild(V.el("div", { class: "t-small", style: "margin-top:10px;color:var(--ink-3)" }, "Note: " + q.interaction.derivation_note));
        }
        box.appendChild(V.el("div", { class: "t-small", style: "margin-top:10px;color:var(--ink-3)" },
          V.el("span", { class: "src-chip", text: q.source_refs.answers_md }), " · ",
          q.lo_note ? V.el("span", {}, q.lo_note) : V.el("span", {}, "LO " + q.lo)));
        return box;
      }

      function updateFlagBtn() {
        var q = current();
        var on = !!session.flags[q.id];
        flagBtn.setAttribute("aria-pressed", on ? "true" : "false");
        flagBtn.style.color = on ? "var(--warn)" : "";
      }
      flagBtn.addEventListener("click", function () {
        var q = current();
        session.flags[q.id] = !session.flags[q.id];
        if (!session.flags[q.id]) delete session.flags[q.id];
        persist(); updateFlagBtn(); buildPalette();
      });

      /* ---- submit flow ---- */
      function submitGate() {
        var unanswered = 0, incomplete = [], flagged = 0;
        session.questionIds.forEach(function (id) {
          var q = byId[id], r = session.responses[id];
          if (!E.isAnswered(q, r)) { unanswered++; if (r && q.type === "multi_two") incomplete.push(id); }
          if (session.flags[id]) flagged++;
        });
        UI.modal({ title: "Submit exam?", wide: true, body: V.el("div", {},
          V.el("ul", {},
            V.el("li", {}, V.plural(unanswered, "question") + " unanswered" + (unanswered ? " (scores 0 — no penalty)" : "")),
            incomplete.length ? V.el("li", {}, incomplete.join(", ") + " do not have exactly two answers selected") : null,
            V.el("li", {}, V.plural(flagged, "question") + " flagged for review")),
          V.el("p", { style: "margin-top:10px;color:var(--ink-3)", text: "You cannot change answers after submitting." })),
          footer: [
            V.el("button", { class: "btn btn--ghost", "data-testid": "modal-keep-working", onclick: function (e) { e.target.closest(".modal-scrim").remove(); } }, "Keep working"),
            V.el("button", { class: "btn btn--danger", "data-testid": "modal-submit", onclick: function (e) { e.target.closest(".modal-scrim").remove(); finish(session, {}); } }, "Submit exam")] });
      }
      function finish(sess, opts) {
        if (rt) { clearInterval(rt.tick); }
        var result = E.scoreSession(sess, byId);
        var firstIds = Object.keys(rt ? rt.checkedLocals : {});
        var attempt = E.toAttempt(sess, result, opts);
        sess.finished = true;
        S.clearSession();
        S.pushAttempt(attempt);
        S.foldQStats(result.perQuestion, sess.mode !== "sim" ? firstIds : null);
        location.hash = "#/results/" + attempt.sessionId + (opts && opts.autoSubmitted ? "" : "");
        if (opts && opts.autoSubmitted) sessionStorage.setItem("ctai.autosubmitted", attempt.sessionId);
      }

      /* ---- timer ---- */
      function tickTimer() {
        if (!document.body.contains(bar)) { clearInterval(rt.tick); return; }
        var now = Date.now();
        if (session.timerStyle === "countdown" && session.endsAt) {
          var remMs = E.remainingMs(session, now);
          var sec = Math.ceil(remMs / 1000);
          timerEl.textContent = V.fmtTime(sec);
          timerEl.classList.toggle("is-warn", sec <= 600 && sec > 120);
          timerEl.classList.toggle("is-crit", sec <= 120);
          progress.classList.toggle("is-warn", sec <= 600 && sec > 120);
          progress.classList.toggle("is-crit", sec <= 120);
          [[600, "Ten minutes remaining."], [120, "Two minutes remaining."], [30, "Thirty seconds remaining."]].forEach(function (m) {
            if (sec <= m[0] && !rt.announced[m[0]] && sec > m[0] - 5) {
              rt.announced[m[0]] = true;
              var live = document.getElementById("examLive");
              if (live) live.textContent = m[1];
            }
          });
          document.title = V.fmtTime(sec) + " · CT-AI Exam";
          if (remMs <= 0) {
            clearInterval(rt.tick);
            finish(session, { autoSubmitted: true });
          }
        } else if (session.timerStyle === "countup") {
          timerEl.textContent = "⏱ " + V.fmtTime((now - session.startedAt) / 1000);
        } else {
          timerEl.textContent = "";
          timerEl.style.display = "none";
        }
      }
      rt.tick = setInterval(function () {
        tickTimer();
        if (rt.tickCount == null) rt.tickCount = 0;
        if (++rt.tickCount % 30 === 0) persist(); // heartbeat
      }, 1000);

      /* ---- keyboard ---- */
      rt.keyHandler = function (e) {
        if (!document.body.contains(shell)) { document.removeEventListener("keydown", rt.keyHandler); return; }
        var t = e.target;
        if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
        var q = current(), idx = session.uiState.currentIndex;
        if (/^[a-e]$/.test(e.key) && q.options) {
          var dl = e.key;
          var opts = optionsFor(q, session);
          var target = opts.find(function (o) { return displayLetter(o.key, q, session) === dl; });
          if (target) { selectOption(target.key); e.preventDefault(); }
        } else if (e.key === "f") { flagBtn.click(); }
        else if (e.key === "ArrowRight" || e.key === "n") { goto(idx + 1); e.preventDefault(); }
        else if (e.key === "ArrowLeft" || e.key === "p") { goto(idx - 1); e.preventDefault(); }
        else if (/^[0-9]$/.test(e.key)) { rt.jump += e.key; if (rt.jump.length > 2) rt.jump = e.key; jumpInput.value = rt.jump; }
        else if (e.key === "Enter" && rt.jump) {
          var n = parseInt(rt.jump, 10);
          if (n >= 1 && n <= session.questionIds.length) goto(n - 1);
          rt.jump = ""; jumpInput.value = "";
        } else if (e.key === "Escape") { rt.jump = ""; jumpInput.value = ""; sheet.classList.remove("is-open"); }
        else if (e.key === "s") { isSim ? submitGate() : finish(session, {}); }
      };
      document.addEventListener("keydown", rt.keyHandler);

      /* beforeunload guard (sim) */
      rt.unload = function (e) {
        if (S.getSession() && !S.getSession().finished && S.getSession().mode === "sim") {
          e.preventDefault(); e.returnValue = "";
        }
      };
      window.addEventListener("beforeunload", rt.unload);

      var live = V.el("span", { class: "vh", id: "examLive", "aria-live": "polite" });
      shell.appendChild(bar); shell.appendChild(progress); shell.appendChild(body); shell.appendChild(sheet); shell.appendChild(live);
      buildPalette(); renderQuestion();
      setTimeout(tickTimer, 0); /* shell attaches after render() returns; ticking now would self-clear */
      return shell;
    }
  };

  window.ExamRuntime = {
    onRouteChange: function () { /* cleanup handled by contains() checks */ }
  };
})();
