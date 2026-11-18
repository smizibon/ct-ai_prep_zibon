/* views/review.js — #/results/:id/review (D3 §4.9): read-only question traversal with rationale */
(function () {
  "use strict";
  window.CTAI_VIEWS = window.CTAI_VIEWS || {};
  var V = window.UI, E = window.Engine, S = window.Store;
  var QS = window.CTAI_QUESTIONS;
  var byId = {}; QS.forEach(function (q) { byId[q.id] = q; });

  window.CTAI_VIEWS.review = {
    render: function (params) {
      var a = S.findAttempt(params.sessionId);
      var page = V.el("div", { class: "page" });
      if (!a) return page.appendChild(V.emptyState("Attempt not found", "", V.el("a", { class: "btn btn--primary btn--sm", href: "#/results" }, "History"))) || page;

      var filter = params.filter || "all";
      var list = a.perQuestion.filter(function (pq) {
        return filter === "all" || filter === pq.verdict || (filter === "flagged" && pq.flagged);
      });
      var idx = 0;

      page.appendChild(V.el("div", { class: "page-head", style: "margin-bottom:20px" },
        V.el("div", { class: "section-marker t-caption", style: "color:var(--ink-3)" }, "Review"),
        V.el("h1", { class: "t-h1", text: "Review — " + a.points + " / " + a.maxPoints + " pts" })));

      var tabs = V.el("div", { class: "tabs", role: "tablist" });
      [["all", "All " + a.perQuestion.length], ["incorrect", "Incorrect " + a.perQuestion.filter(function (q) { return q.verdict === "incorrect"; }).length],
       ["unanswered", "Unanswered " + a.perQuestion.filter(function (q) { return q.verdict === "unanswered"; }).length],
       ["flagged", "Flagged " + a.perQuestion.filter(function (q) { return q.flagged; }).length]].forEach(function (t) {
        tabs.appendChild(V.el("a", { class: "tab", role: "tab", "aria-selected": filter === t[0] ? "true" : "false",
          href: "#/results/" + a.sessionId + "/review?filter=" + t[0], text: t[1], "data-testid": "filter-" + t[0] }));
      });
      page.appendChild(tabs);

      var host = V.el("div", { class: "measure", style: "margin:0 auto" });
      page.appendChild(host);
      page.appendChild(V.el("p", { class: "t-small", style: "margin-top:var(--sp-5)" },
        V.el("a", { href: "#/results/" + a.sessionId, "data-testid": "review-back" }, "← Back to report"), " · ",
        V.el("span", { style: "color:var(--ink-3)" }, "j/k or ←/→ to move · 1–4 switch filters")));

      function renderCard() {
        host.innerHTML = "";
        if (!list.length) { host.appendChild(V.emptyState("Nothing in this filter", "Try another tab.")); return; }
        idx = Math.max(0, Math.min(list.length - 1, idx));
        var pq = list[idx];
        var q = byId[pq.id];
        var resp = pq.selected;
        var res = E.scoreQuestion(q, resp);

        var card = V.el("section", { class: "card", role: "group" });
        card.appendChild(V.el("div", { class: "q-card__head" },
          V.el("span", { class: "q-card__title", text: q.label + "  (" + (idx + 1) + " of " + list.length + " in filter)" }),
          V.el("span", { class: "chiprow" },
            V.el("span", { class: "meta-chip " + (pq.verdict === "correct" ? "meta-chip--success" : "meta-chip--danger"), text: pq.verdict }),
            pq.flagged ? V.chip("flagged", { variant: "warn" }) : null,
            V.chip(pq.points + "/" + q.points + " pt", { mono: true }),
            V.kchip(q.k_level),
            V.el("a", { class: "meta-chip", href: "#/study/ch" + q.chapter + "/" + (q.lo.replace("AI-", "")), style: "text-decoration:none" }, q.lo))));
        card.appendChild(V.el("div", { class: "q-card__stem md", html: window.md(q.stem_md) }));
        q.figures.forEach(function (f) { card.appendChild(V.figure(f, { title: q.label })); });
        if (q.select_instruction) card.appendChild(V.el("div", { class: "q-card__select" },
          V.el("span", { class: "meta-chip meta-chip--accent", html: window.md(q.select_instruction).replace(/<\/?p>/g, "") })));

        if (q.options) {
          q.options.forEach(function (o) {
            var chosen = resp && (q.type === "multi_two" ? (resp.selected || []).includes(o.key) : resp && resp.selected === o.key);
            var isKey = q.correct_keys.includes(o.key);
            var cls = "opt is-disabled";
            if (isKey) cls += " is-correct" + (chosen ? "" : " is-missed");
            else if (chosen) cls += " is-incorrect";
            card.appendChild(V.el("div", { class: cls, role: "radio", "aria-checked": chosen ? "true" : "false" },
              V.el("span", { class: "opt__ctrl" }),
              V.el("span", { class: "opt__key", text: o.key }),
              V.el("span", { class: "opt__text md", html: window.md(o.text_md) }),
              V.el("span", { class: "opt__verdict" }, isKey ? V.icon("check") : chosen ? V.icon("x") : null)));
          });
        } else {
          var widgetHost = V.el("div", {});
          card.appendChild(widgetHost);
          var reveal = { assign: Widgets.assign, pair: Widgets.pair, order: Widgets.order }[q.type];
          var initial = q.type === "assign" ? (resp && resp.assignment) : q.type === "pair" ? (resp && resp.pairs) : (resp && resp.sequence ? { sequence: resp.sequence } : {});
          var w = reveal(q.interaction, { initial: initial || {}, reviewMode: true, locked: true });
          widgetHost.appendChild(w.root);
          if (w.reveal) w.reveal();
        }

        /* rationale — same block as learning reveal */
        var box = V.el("div", { class: "rationale" });
        box.appendChild(V.el("div", { class: "rationale__ans" },
          q.correct_keys.length ? "Correct answer: " + q.correct_keys.join(", ") : "Correct arrangement — shown above and in the answer figure."));
        if (q.rationale.preamble_md) box.appendChild(V.el("div", { class: "md t-small", style: "margin:var(--sp-2) 0", html: window.md(q.rationale.preamble_md) }));
        var ul = V.el("ul", {});
        q.rationale.units.forEach(function (u) {
          if (!u.key) return;
          ul.appendChild(V.el("li", { class: "t-small" },
            V.el("span", { class: "meta-chip" + (u.verdict === "correct" ? " meta-chip--success" : " meta-chip--danger"), style: "margin-right:6px", text: u.key + " " + (u.verdict === "correct" ? "✓" : "✗") }),
            V.el("span", { class: "md", html: window.md(u.text_md) })));
        });
        if (ul.children.length) box.appendChild(ul);
        q.why_not_derived.filter(function (d) { return !q.rationale.units.some(function (u) { return u.key === d.key; }); })
          .forEach(function (d) {
            box.appendChild(V.el("div", { class: "t-small md", style: "margin-top:var(--sp-2)" },
              V.el("span", { class: "meta-chip meta-chip--accent derived-chip", text: "derived" }),
              V.el("span", { html: window.md(d.text_md) })));
          });
        if (q.rationale.conclusion_md) box.appendChild(V.el("div", { class: "md t-small", style: "margin-top:var(--sp-2)", html: window.md(q.rationale.conclusion_md) }));
        q.rationale.answer_figures.forEach(function (f) { box.appendChild(V.figure(f, { title: "Official answer figure" })); });
        if (q.interaction && q.interaction.derivation_note) {
          box.appendChild(V.el("div", { class: "t-small", style: "margin-top:var(--sp-2);color:var(--ink-3)" }, "Note: " + q.interaction.derivation_note));
        }
        if (q.lo_note) box.appendChild(V.el("div", { class: "t-small", style: "margin-top:var(--sp-2);color:var(--ink-3)", text: q.lo_note }));
        box.appendChild(V.el("div", { class: "t-small", style: "margin-top:var(--sp-2);color:var(--ink-3)" },
          V.el("span", { class: "src-chip", text: q.source_refs.answers_md })));
        card.appendChild(box);

        card.appendChild(V.el("div", { class: "exam-foot" },
          V.el("button", { class: "btn btn--ghost", "data-testid": "review-prev", onclick: function () { idx--; renderCard(); window.scrollTo(0, 0); } }, V.icon("arrow-l", true), "Previous (k)"),
          V.el("span", { class: "spacer" }),
          V.el("button", { class: "btn btn--outline", "data-testid": "review-next", onclick: function () { idx++; renderCard(); window.scrollTo(0, 0); } }, "Next (j)", V.icon("arrow-r", true))));
        host.appendChild(card);

        card._navHandler = function (e) {
          if (!document.body.contains(card)) { document.removeEventListener("keydown", card._navHandler); return; }
          if (e.target.tagName === "INPUT") return;
          if (e.key === "j" || e.key === "ArrowRight") { idx++; renderCard(); window.scrollTo(0, 0); }
          else if (e.key === "k" || e.key === "ArrowLeft") { idx--; renderCard(); window.scrollTo(0, 0); }
          else if (["1", "2", "3", "4"].includes(e.key)) {
            var f = ["all", "incorrect", "unanswered", "flagged"][Number(e.key) - 1];
            location.hash = "#/results/" + a.sessionId + "/review?filter=" + f;
          }
        };
        document.addEventListener("keydown", card._navHandler);
      }
      renderCard();
      return page;
    }
  };
})();
