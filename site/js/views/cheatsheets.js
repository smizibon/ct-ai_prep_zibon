/* views/cheatsheets.js — #/cheatsheets[/ch{n}] (D3 §4.4) */
(function () {
  "use strict";
  window.CTAI_VIEWS = window.CTAI_VIEWS || {};
  var V = window.UI;

  function blockNode(b, chN) {
    var wrap = V.el("section", { class: "sheet-block" });
    var title = { keyTerms: "Key terms", mustKnow: b.title, formula: "Formulas", table: b.title, steps: b.title, traps: "Traps & confusions", meta: "", examPointers: "Exam pointers" }[b.type];
    if (title) wrap.appendChild(V.el("h3", { class: "t-h3 sheet-block__title" }, b.type === "traps" ? V.icon("alert", true) : null, title));

    if (b.type === "keyTerms") {
      var dl = V.el("dl", { class: "term-grid" });
      b.items.forEach(function (it) {
        dl.appendChild(V.el("div", { class: "term-item" },
          V.el("dt", { class: "t-small" }, it.term,
            " ", V.el("a", { class: "src-chip", href: it.src === "glossary" || it.src.includes("glossary") ? "#/glossary?q=" + encodeURIComponent(it.term) : "#/study/ch" + chN, title: "source: " + it.src, "data-testid-ignore": "", onclick: function (e) { if (!it.src.includes("glossary")) { e.preventDefault(); location.hash = "#/study/ch" + chN; } } }, it.src)),
          V.el("dd", { text: it.def })));
      });
      wrap.appendChild(dl);
    } else if (b.type === "mustKnow") {
      wrap.appendChild(V.el("ul", { class: "checklist" }, b.items.map(function (it) {
        return V.el("li", {}, V.icon("check", true), V.el("div", { class: "t-small" }, it.text, " ",
          V.el("a", { class: "src-chip", href: "#/study/ch" + chN, title: "source: " + it.src, "data-testid-ignore": "", text: it.src })));
      })));
    } else if (b.type === "formula") {
      b.items.forEach(function (it) {
        wrap.appendChild(V.el("div", { class: "formula-well" },
          V.el("div", { class: "f-name t-caption", style: "color:var(--ink-3)" }, it.name,
            " ", V.el("span", { class: "src-chip", text: it.src })),
          V.el("div", { class: "f-exp", text: it.formula }),
          it.note ? V.el("div", { class: "f-note", text: it.note }) : null));
      });
    } else if (b.type === "table") {
      wrap.appendChild(V.el("table", { class: "tbl" },
        V.el("thead", {}, V.el("tr", {}, b.columns.map(function (c) { return V.el("th", { scope: "col", text: c }); }))),
        V.el("tbody", {}, b.rows.map(function (r) {
          return V.el("tr", {}, r.map(function (c, i) {
            var td = V.el("td", { text: c });
            if (i === 0) td.style.fontWeight = "600";
            return td;
          }));
        }))));
      wrap.appendChild(V.el("div", { style: "margin-top:var(--sp-2)" }, V.el("span", { class: "src-chip", text: b.src })));
    } else if (b.type === "steps") {
      wrap.appendChild(V.el("ol", { class: "md", style: "padding-left:var(--sp-5);list-style:decimal;display:grid;gap:var(--sp-2)" },
        b.items.map(function (it) {
          return V.el("li", { class: "t-small" }, it.text, " ", V.el("span", { class: "src-chip", text: it.src }));
        })));
    } else if (b.type === "traps") {
      b.items.forEach(function (it) {
        wrap.appendChild(V.el("div", { class: "trap-card" }, V.icon("alert", true),
          V.el("div", { class: "t-small" }, V.el("b", {}, "Confusion: " + it.confusion + ". "), it.text, " ",
            V.el("span", { class: "src-chip", text: it.src }))));
      });
    } else if (b.type === "meta") {
      wrap.appendChild(V.el("div", { class: "chiprow" },
        V.chip("⏱ " + b.minutes + " min"), V.chip(b.questionCount + " questions"), V.chip(b.points + " pts")));
    } else if (b.type === "examPointers") {
      var tbl = V.el("table", { class: "tbl" },
        V.el("thead", {}, V.el("tr", {}, ["LO", "Objective", "K", "Sample questions"].map(function (c) { return V.el("th", { text: c }); }))),
        V.el("tbody", {}, b.items.map(function (it) {
          return V.el("tr", {},
            V.el("td", { style: "font-family:var(--font-mono);font-size:0.75rem", text: it.lo }),
            V.el("td", { class: "t-small", text: it.loText }),
            V.el("td", {}, V.kchip(it.kLevel)),
            V.el("td", {}, V.el("div", { class: "chiprow" }, it.questions.map(function (q) {
              return V.el("a", { class: "meta-chip", href: "#/exam?learn=" + q.q, "data-testid": "sheet-q-" + q.q, style: "text-decoration:none", text: q.q + " ·" + q.pts + "pt" });
            }))));
        })));
      wrap.appendChild(tbl);
    }
    return wrap;
  }

  window.CTAI_VIEWS.cheatsheets = {
    render: function (params) {
      var page = V.el("div", { class: "page" });
      if (!params.ch) {
        page.appendChild(V.el("div", { class: "page-head" },
          V.el("div", { class: "section-marker t-caption", style: "color:var(--ink-3)" }, "Revise"),
          V.el("h1", { class: "t-h1", text: "Cheatsheets" }),
          V.el("p", { class: "t-lead" }, "One condensed sheet per chapter — every claim traceable to the syllabus (src chips link to the source).")));
        var grid = V.el("div", { class: "ch-grid" });
        for (var n = 1; n <= 7; n++) {
          var ch = window.CTAI_DATA.chapters[n];
          var hasFormula = ch.cheatsheet.blocks.some(function (b) { return b.type === "formula"; });
          grid.appendChild(V.el("a", { class: "card card--interactive ch-card", href: "#/cheatsheets/ch" + n, "data-testid": "sheet-ch" + n },
            V.el("span", { class: "t-caption", style: "color:var(--ink-3)", text: "Ch " + n }),
            V.el("div", { class: "t-h3", text: ch.title }),
            V.el("div", { class: "ch-card__meta" },
              V.el("span", {}, "⏱ " + ch.minutes + " min"),
              hasFormula ? V.el("span", { class: "meta-chip meta-chip--accent" }, "formula block") : null)));
        }
        page.appendChild(grid);
        return page;
      }
      var n = params.ch, ch = window.CTAI_DATA.chapters[n];
      if (!ch) return V.el("div", { class: "page" }, V.emptyState("No such sheet", "", V.el("a", { class: "btn btn--primary btn--sm", href: "#/cheatsheets", "data-testid": "sheet-back" }, "All cheatsheets")));
      var sheet = V.el("div", { class: "measure" });
      sheet.appendChild(V.el("div", { class: "page-head" },
        V.el("div", { class: "section-marker t-caption", style: "color:var(--ink-3)" }, "Cheatsheet · Chapter " + n),
        V.el("h1", { class: "t-h1", text: ch.title })));
      var tabs = V.el("div", { class: "tabs", role: "tablist" });
      for (var t = 1; t <= 7; t++) {
        tabs.appendChild(V.el("a", { class: "tab", role: "tab", "aria-selected": t === n ? "true" : "false", href: "#/cheatsheets/ch" + t, "data-testid": "sheet-tab-ch" + t, text: "Ch " + t }));
      }
      sheet.appendChild(tabs);
      ch.cheatsheet.blocks.forEach(function (b) { sheet.appendChild(blockNode(b, n)); });
      sheet.appendChild(V.el("p", { class: "t-caption", style: "color:var(--ink-3);margin-top:var(--sp-6)" },
        "Synthesized from the syllabus — src chips cite subsections and line ranges. Definitions are verbatim."));
      page.appendChild(sheet);
      return page;
    }
  };
})();
