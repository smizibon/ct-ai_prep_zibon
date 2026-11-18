/* search.js — global ⌘K search overlay (glossary, LOs, cheatsheets, intel) */
(function () {
  "use strict";
  var open = false, active = 0, results = [], scrim = null, input = null, listBox = null;

  function index() {
    var items = [];
    (window.CTAI_DATA.glossary.terms || []).forEach(function (t) {
      items.push({ group: "Glossary", label: t.term, sub: t.def.slice(0, 80), hash: "#/glossary?q=" + encodeURIComponent(t.term), hay: (t.term + " " + t.def + " " + t.synonyms.join(" ") + " " + t.abbr.join(" ")).toLowerCase() });
    });
    (window.CTAI_DATA.coverage.chapters || []).forEach(function (ch) {
      ch.sections.forEach(function (sec) {
        sec.los.forEach(function (lo) {
          items.push({ group: "Chapters & LOs", label: lo.subsection + " " + lo.title, sub: "Ch " + ch.n + " · " + lo.k + " · " + lo.loText.slice(0, 60), hash: "#/study/ch" + ch.n + "/" + lo.subsection, hay: (lo.id + " " + lo.subsection + " " + lo.title + " " + lo.loText + " ch" + ch.n).toLowerCase() });
        });
      });
    });
    for (var n = 1; n <= 7; n++) {
      var chd = window.CTAI_DATA.chapters[n];
      (chd.cheatsheet.blocks || []).forEach(function (b) {
        if (b.type === "traps") b.items.forEach(function (it) {
          items.push({ group: "Cheatsheets", label: "Ch " + n + " · " + it.confusion, sub: it.text.slice(0, 80), hash: "#/cheatsheets/ch" + n, hay: ("ch" + n + " " + it.confusion + " " + it.text).toLowerCase() });
        });
        if (b.type === "formula") b.items.forEach(function (it) {
          items.push({ group: "Cheatsheets", label: "Ch " + n + " · " + it.name, sub: it.formula, hash: "#/cheatsheets/ch" + n, hay: ("ch" + n + " " + it.name + " " + it.formula).toLowerCase() });
        });
      });
    }
    (window.CTAI_INTEL.advice.synthesis || []).forEach(function (s) {
      items.push({ group: "Exam Intel", label: "Advice #" + s.rank, sub: s.text.slice(0, 90), hash: "#/intel", hay: s.text.toLowerCase() });
    });
    return items;
  }
  var IDX = null;

  function search(q) {
    if (!IDX) IDX = index();
    q = q.trim().toLowerCase();
    if (!q) return [];
    var groups = {};
    IDX.forEach(function (it) {
      if (it.hay.indexOf(q) >= 0) {
        var g = groups[it.group] = groups[it.group] || [];
        if (g.length < 5) g.push(it);
      }
    });
    var out = [];
    Object.keys(groups).forEach(function (g) { out.push({ group: g, items: groups[g] }); });
    return out;
  }

  function renderResults() {
    listBox.innerHTML = "";
    var flat = [];
    results.forEach(function (g) {
      listBox.appendChild(UI.el("div", { class: "search__group-label t-caption", text: g.group }));
      g.items.forEach(function (it) {
        flat.push(it);
        var item = UI.el("button", { class: "search__item", "data-testid": "search-result-" + (flat.length - 1), onclick: function () { close(); location.hash = it.hash; } },
          UI.el("span", { style: "font-weight:550;white-space:nowrap", text: it.label }),
          UI.el("small", { text: it.sub }));
        item.dataset.idx = flat.length - 1;
        listBox.appendChild(item);
      });
    });
    if (!results.length) listBox.appendChild(UI.el("div", { class: "search__group-label", text: "No matches" }));
    listBox._flat = flat;
    setActive(0);
  }
  function setActive(i) {
    var flat = listBox._flat || [];
    active = Math.max(0, Math.min(flat.length - 1, i));
    listBox.querySelectorAll(".search__item").forEach(function (n) {
      n.classList.toggle("is-active", Number(n.dataset.idx) === active);
      if (Number(n.dataset.idx) === active) n.scrollIntoView({ block: "nearest" });
    });
  }
  function openOverlay() {
    if (open) return;
    open = true;
    input = UI.el("input", { class: "search__input", type: "text", placeholder: "Search glossary, chapters, LOs, cheatsheets…", "aria-label": "Search", role: "searchbox", "data-testid": "search-input" });
    listBox = UI.el("div", { class: "search__results", role: "listbox" });
    scrim = UI.el("div", { class: "search-scrim", "data-testid": "search-modal", onclick: function (e) { if (e.target === scrim) close(); } },
      UI.el("div", { class: "search", role: "dialog", "aria-label": "Search" },
        UI.el("div", { class: "search__row" }, UI.icon("search"), input),
        listBox,
        UI.el("div", { class: "search__foot" },
          UI.el("span", {}, UI.el("kbd", { text: "↑↓" }), " navigate"), UI.el("span", {}, UI.el("kbd", { text: "⏎" }), " open"),
          UI.el("span", {}, UI.el("kbd", { text: "esc" }), " close"))));
    document.body.appendChild(scrim);
    input.addEventListener("input", function () { results = search(input.value); renderResults(); });
    input.addEventListener("keydown", function (e) {
      var flat = listBox._flat || [];
      if (e.key === "ArrowDown") { setActive(active + 1); e.preventDefault(); }
      else if (e.key === "ArrowUp") { setActive(active - 1); e.preventDefault(); }
      else if (e.key === "Enter" && flat[active]) { close(); location.hash = flat[active].hash; }
    });
    results = search("");
    renderResults();
    input.focus();
  }
  function close() {
    if (!open) return false;
    open = false;
    if (scrim) scrim.remove();
    return true;
  }
  window.SearchOverlay = { open: openOverlay, close: close };
})();
