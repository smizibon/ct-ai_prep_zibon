/* views/glossary.js — #/glossary (D3 §4.5) */
(function () {
  "use strict";
  window.CTAI_VIEWS = window.CTAI_VIEWS || {};
  var V = window.UI;

  window.CTAI_VIEWS.glossary = {
    render: function (params) {
      var page = V.el("div", { class: "page" });
      var g = window.CTAI_DATA.glossary;
      var kwTerms = {};
      for (var n = 1; n <= 7; n++) {
        var ch = window.CTAI_DATA.chapters[n];
        ch.keywords.general.concat(ch.keywords.aiSpecific).forEach(function (k) { kwTerms[k.toLowerCase()] = n; });
      }
      var state = { tab: "terms", filter: params.q || "", azOnly: null };

      page.appendChild(V.el("div", { class: "page-head" },
        V.el("div", { class: "section-marker t-caption", style: "color:var(--ink-3)" }, "Reference"),
        V.el("h1", { class: "t-h1", text: "Glossary" }),
        V.el("p", { class: "t-lead" }, g.terms.length + " AI-specific terms and " + Object.keys(g.abbreviations).length +
          " abbreviations. For Specialist exams every syllabus keyword is examinable at K2 definition level.")));

      var input = V.el("input", { type: "text", class: "search__input", value: state.filter, "data-testid": "glossary-search",
        placeholder: "Filter terms, definitions, synonyms…", "aria-label": "Filter glossary", style: "max-width:420px;width:100%;border:1px solid var(--line-2);border-radius:var(--r-md);padding:var(--sp-2) var(--sp-3);background:var(--bg-1);color:var(--ink-1)" });
      var tabs = V.el("div", { class: "tabs", role: "tablist" },
        V.el("button", { class: "tab", role: "tab", "aria-selected": "true", "data-testid": "gloss-tab-terms", text: "Terms (" + g.terms.length + ")" }),
        V.el("button", { class: "tab", role: "tab", "aria-selected": "false", "data-testid": "gloss-tab-abbr", text: "Abbreviations (" + Object.keys(g.abbreviations).length + ")" }));
      var listHost = V.el("div", { "aria-live": "polite" });

      function letterAvail() {
        var avail = {};
        g.terms.forEach(function (t) { avail[t.term[0].toUpperCase()] = true; });
        return avail;
      }
      function renderAz() {
        var rail = V.el("div", { class: "az-rail", role: "navigation", "aria-label": "Alphabetical index" });
        var avail = letterAvail();
        "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").forEach(function (L) {
          rail.appendChild(V.el("button", { class: avail[L] ? "" : "is-empty", text: L, "data-testid": "az-" + L,
            onclick: function () {
              state.filter = "";
              input.value = "";
              var first = document.querySelector('.gloss-row[data-letter="' + L + '"]');
              if (first) first.scrollIntoView({ block: "start" });
            } }));
        });
        return rail;
      }

      function renderTerms() {
        listHost.innerHTML = "";
        var f = state.filter.trim().toLowerCase();
        var rows = g.terms.filter(function (t) {
          if (!f) return true;
          return (t.term + " " + t.def + " " + t.synonyms.join(" ") + " " + t.abbr.join(" ")).toLowerCase().indexOf(f) >= 0;
        });
        if (!rows.length) {
          listHost.appendChild(V.emptyState("No matching terms", "Try a different filter.",
            V.el("button", { class: "btn btn--primary btn--sm", "data-testid": "gloss-clear", onclick: function () { state.filter = ""; input.value = ""; renderTerms(); } }, "Clear filter")));
          return;
        }
        rows.forEach(function (t) {
          var must = kwTerms[t.term.toLowerCase()] != null;
          var m = t.term.match(/^(\w+)/);
          listHost.appendChild(V.el("div", { class: "gloss-row", dataset: { letter: (m ? m[1] : t.term)[0].toUpperCase() } },
            V.el("h4", { class: "t-h4" }, t.term,
              must ? V.chip("must-know", { variant: "accent", tip: "Chapter keyword — examinable at K2 per the exam rules" }) : null),
            V.el("p", { text: t.def }),
            V.el("div", { class: "gloss-meta" },
              t.synonyms.length ? V.chip("syn: " + t.synonyms.join(", ")) : null,
              t.abbr.length ? V.chip(t.abbr.join(", "), { mono: true }) : null,
              t.refs.length ? V.chip(t.refs.join("; "), { mono: true }) : null,
              t.appearsIn.length ? V.el("span", { class: "t-caption", style: "color:var(--ink-3)" },
                "appears in ",
                t.appearsIn.map(function (sid, i) {
                  var chN = Number(sid.split(".")[0]);
                  return [i ? ", " : null, V.el("a", { href: "#/study/ch" + chN + "/" + sid, "data-testid": "gloss-appear-" + sid, text: sid })];
                })) : null)));
        });
      }
      function renderAbbr() {
        listHost.innerHTML = "";
        var keys = Object.keys(g.abbreviations).sort();
        listHost.appendChild(V.el("table", { class: "tbl" },
          V.el("thead", {}, V.el("tr", {}, V.el("th", { text: "Abbreviation" }), V.el("th", { text: "Expansion" }))),
          V.el("tbody", {}, keys.map(function (k) {
            return V.el("tr", {}, V.el("td", { style: "font-family:var(--font-mono)", text: k }),
              V.el("td", { class: "t-small", text: g.abbreviations[k] }));
          }))));
      }
      function renderList() { state.tab === "terms" ? renderTerms() : renderAbbr(); }

      input.addEventListener("input", function () { state.filter = input.value; if (state.tab !== "terms") { state.tab = "terms"; syncTabs(); } renderTerms(); });
      tabs.children[0].addEventListener("click", function () { state.tab = "terms"; syncTabs(); renderList(); });
      tabs.children[1].addEventListener("click", function () { state.tab = "abbr"; syncTabs(); renderList(); });
      function syncTabs() {
        tabs.children[0].setAttribute("aria-selected", state.tab === "terms" ? "true" : "false");
        tabs.children[1].setAttribute("aria-selected", state.tab === "abbr" ? "true" : "false");
      }
      page.appendChild(V.el("div", { style: "display:flex;gap:var(--sp-4);align-items:center;flex-wrap:wrap" }, input));
      page.appendChild(renderAz());
      page.appendChild(tabs);
      page.appendChild(listHost);
      renderList();
      return page;
    }
  };
})();
