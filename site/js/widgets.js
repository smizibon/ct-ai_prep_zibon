/* widgets.js — appendix interactive widgets: A1 assign, A4 pair, A5 order (D2 §2.4–2.6, D3 §3.20–3.22) */
(function () {
  "use strict";
  var W = {};

  /* A1: row-segmented assignment. getResp() -> {assignment:{idx:category}} */
  W.assign = function (interaction, opts) {
    opts = opts || {};
    var state = Object.assign({}, opts.initial || {});
    var root = UI.el("div", { class: "assign", role: "group", "aria-label": "Assign each system to a form of AI" });
    interaction.statements.forEach(function (stmt, i) {
      var seg = UI.el("div", { class: "assign-seg", role: "radiogroup", "aria-label": "Category for statement " + (i + 1) });
      interaction.categories.forEach(function (cat, ci) {
        var b = UI.el("button", { role: "radio", "aria-checked": state[i] === cat ? "true" : "false",
          "data-testid": "assign-cell", "data-row": String(i), "data-cat": String(ci), text: cat });
        b.addEventListener("click", function () {
          if (opts.locked) return;
          state[i] = cat;
          row.classList.add("is-assigned"); row.classList.remove("is-warn");
          seg.querySelectorAll("button").forEach(function (x) { x.setAttribute("aria-checked", "false"); });
          b.setAttribute("aria-checked", "true");
          if (opts.onChange) opts.onChange(getResp());
        });
        seg.appendChild(b);
      });
      var row = UI.el("div", { class: "assign-row" + (state[i] ? " is-assigned" : " is-warn"), "data-testid": "assign-row-" + i },
        UI.el("div", { class: "assign-row__text", text: stmt }), seg);
      if (opts.reviewMode) row.classList.add(String(state[i]) === String(interaction.correct_assignment[i]) ? "is-ok" : "is-bad");
      root.appendChild(row);
    });
    var note = UI.el("div", { class: "assign-note", hidden: true, text: "No form of AI can be left empty." });
    root.appendChild(note);
    function refreshNote() { note.hidden = Object.keys(state).length === interaction.statements.length; }
    refreshNote();
    var origOnChange = opts.onChange;
    opts.onChange = function (r) { refreshNote(); if (origOnChange) origOnChange(r); };
    function getResp() { return { assignment: Object.assign({}, state) }; }
    return { root: root, getResp: getResp, isComplete: function () { return Object.keys(state).length === interaction.statements.length; } };
  };

  /* A4: click-pair matching with SVG connectors. getResp() -> {pairs:{leftText: rightIdx}} */
  W.pair = function (interaction, opts) {
    opts = opts || {};
    var pairs = Object.assign({}, opts.initial || {});
    var armed = null;
    var wrap = UI.el("div", { class: "pair-wrap" });
    var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("class", "pair-svg");
    var leftCol = UI.el("div", { class: "pair-col", role: "listbox", "aria-label": "Forms of machine learning" });
    var rightCol = UI.el("div", { class: "pair-col", role: "listbox", "aria-label": "Example systems" });
    var leftEls = {}, rightEls = {};
    function badge(n) { return UI.el("span", { class: "pair-item__badge", text: String(n) }); }
    function redraw() {
      Object.keys(leftEls).forEach(function (l) {
        var elL = leftEls[l];
        elL.classList.toggle("is-armed", armed === l);
        var old = elL.querySelector(".pair-item__badge"); if (old) old.remove();
        if (pairs[l] != null) { elL.classList.add("is-paired"); elL.appendChild(badge(Object.keys(pairs).indexOf(l) + 1)); }
        else elL.classList.remove("is-paired");
      });
      rightEls && Object.keys(rightEls).forEach(function (r) {
        var elR = rightEls[r];
        var used = Object.values(pairs).includes(Number(r));
        var old = elR.querySelector(".pair-item__badge"); if (old) old.remove();
        if (used) { elR.classList.add("is-paired"); elR.appendChild(badge(Object.keys(pairs).indexOf(String(r)) + 1)); }
        else elR.classList.remove("is-paired");
      });
      drawLines();
      if (opts.onChange) opts.onChange(getResp());
    }
    function drawLines() {
      svg.innerHTML = "";
      Object.keys(pairs).forEach(function (l) {
        var a = leftEls[l], b = rightEls[pairs[l]];
        if (!a || !b) return;
        var ra = a.getBoundingClientRect(), rb = b.getBoundingClientRect(), rs = svg.getBoundingClientRect();
        var ln = document.createElementNS("http://www.w3.org/2000/svg", "line");
        ln.setAttribute("x1", ra.right - rs.left); ln.setAttribute("y1", ra.top + ra.height / 2 - rs.top);
        ln.setAttribute("x2", rb.left - rs.left); ln.setAttribute("y2", rb.top + rb.height / 2 - rs.top);
        if (opts.reviewMode) {
          var correctIdx = interaction.correct_pairs[l];
          ln.setAttribute("class", String(correctIdx) === String(pairs[l]) ? "is-right" : "is-wrong");
        }
        svg.appendChild(ln);
      });
    }
    interaction.left.forEach(function (l, li) {
      var b = UI.el("button", { class: "pair-item", role: "option", "aria-selected": armed === l ? "true" : "false",
        "data-testid": "pair-left-" + li, text: l });
      b.addEventListener("click", function () {
        if (opts.locked) return;
        if (armed === l) { armed = null; }
        else if (pairs[l] != null && armed == null) { delete pairs[l]; }
        else { armed = l; }
        redraw();
      });
      leftEls[l] = b; leftCol.appendChild(b);
    });
    interaction.right.forEach(function (r, idx) {
      var b = UI.el("button", { class: "pair-item", role: "option", "aria-selected": "false",
        "data-testid": "pair-right-" + idx, text: r });
      b.dataset.idx = String(idx);
      b.addEventListener("click", function () {
        if (opts.locked) return;
        if (armed != null) {
          // bijection: steal right item from any left currently holding it
          Object.keys(pairs).forEach(function (l) { if (String(pairs[l]) === String(idx)) delete pairs[l]; });
          pairs[armed] = idx; armed = null;
        } else {
          Object.keys(pairs).forEach(function (l) { if (String(pairs[l]) === String(idx)) delete pairs[l]; });
        }
        redraw();
      });
      rightEls[String(idx)] = b; rightCol.appendChild(b);
    });
    wrap.appendChild(svg); wrap.appendChild(leftCol); wrap.appendChild(rightCol);
    function getResp() { return { pairs: Object.assign({}, pairs) }; }
    redraw();
    requestAnimationFrame(function () { drawLines(); });
    window.addEventListener("resize", function () { if (document.body.contains(wrap)) drawLines(); }, { passive: true });
    return { root: wrap, getResp: getResp, isComplete: function () { return Object.keys(pairs).length === interaction.left.length; },
      reveal: function () {
        // overlay correct pairs in green; user's (wrong, if any) in red already handled by reviewMode
        opts.reviewMode = true; opts.locked = true;
        pairs = Object.assign({}, interaction.correct_pairs);
        redraw();
      } };
  };

  /* A5: click-to-sequence. getResp() -> {sequence:[texts]} */
  W.order = function (interaction, opts) {
    opts = opts || {};
    var seq = (opts.initial && opts.initial.sequence) ? opts.initial.sequence.slice() : [];
    var pool = interaction.items.filter(function (it) { return !seq.includes(it); });
    var root = UI.el("div", { class: "order" });
    var poolEl = UI.el("div", { class: "order-pool", role: "group", "aria-label": "Unordered activities", "data-testid": "order-pool" });
    var lane = UI.el("div", { class: "order-lane", role: "group", "aria-label": "Ordered sequence", "data-testid": "order-lane" });
    function chip(text, inLane, idx) {
      var moves = UI.el("span", { class: "order-chip__mv" },
        UI.el("button", { class: "icon-btn", style: "width:20px;height:16px", "aria-label": "Move up", onclick: function (e) { e.stopPropagation(); mv(-1); } }, UI.icon("chev-d", true)),
        UI.el("button", { class: "icon-btn", style: "width:20px;height:16px;transform:rotate(180deg)", "aria-label": "Move down", onclick: function (e) { e.stopPropagation(); mv(1); } }, UI.icon("chev-d", true)));
      var c = UI.el("button", { class: "order-chip", "data-testid": "order-chip", "data-text": text },
        inLane ? UI.el("span", { class: "order-chip__n", text: String(idx + 1) }) : null,
        UI.el("span", { text: text }),
        inLane && !opts.locked ? moves : null);
      function mv(d) {
        if (opts.locked) return;
        var i = seq.indexOf(text), j = i + d;
        if (j < 0 || j >= seq.length) return;
        seq.splice(i, 1); seq.splice(j, 0, text);
        redraw();
      }
      c.addEventListener("click", function () {
        if (opts.locked) return;
        if (inLane) { seq.splice(seq.indexOf(text), 1); }
        else { seq.push(text); }
        redraw();
      });
      if (opts.reviewMode && inLane) {
        c.classList.add(interaction.correct_sequence[idx] === text ? "is-ok" : "is-bad");
      }
      return c;
    }
    function redraw() {
      poolEl.innerHTML = ""; lane.innerHTML = "";
      interaction.items.forEach(function (it) { if (!seq.includes(it)) poolEl.appendChild(chip(it, false)); });
      seq.forEach(function (it, i) { lane.appendChild(chip(it, true, i)); });
      if (opts.onChange) opts.onChange(getResp());
    }
    root.appendChild(UI.el("div", { class: "order-hint t-small", style: "color:var(--ink-3)", text: "Click activities in order (earliest → latest). Click a sequenced chip to remove it; arrows reorder." }));
    root.appendChild(poolEl);
    root.appendChild(lane);
    root.appendChild(UI.el("div", { class: "order-axis" },
      UI.el("span", { text: interaction.axis.start }), UI.el("span", { text: interaction.axis.end })));
    redraw();
    function getResp() { return { sequence: seq.slice() }; }
    return { root: root, getResp: getResp, isComplete: function () { return seq.length === interaction.items.length; },
      reveal: function () { opts.reviewMode = true; opts.locked = true; seq = interaction.correct_sequence.slice(); redraw(); } };
  };

  window.Widgets = W;
})();
