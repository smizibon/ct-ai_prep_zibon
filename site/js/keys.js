/* keys.js — global keyboard shortcuts (D3 §6) */
(function () {
  "use strict";
  var chord = null, chordTimer = null;
  function inInput(e) {
    var t = e.target;
    return t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.tagName === "SELECT" || t.isContentEditable);
  }
  function go(hash) { location.hash = hash; }
  function showHelp() {
    var rows = [
      ["/ or ⌘K", "Search"], ["g then d/s/c/v/g/e/i/r", "Go: Dashboard/Study/Cheatsheets/Videos/Glossary/Exam/Intel/Results"],
      ["t", "Toggle theme"], ["?", "This help"], ["Esc", "Close overlay/drawer"],
      ["— in exam —", ""], ["a b c d e", "Select option"], ["f", "Flag question"],
      ["→/n · ←/p", "Next / previous question"], ["0–9 then ⏎", "Jump to question"], ["s", "Submit / finish"],
      ["— in review —", ""], ["j / k", "Next / previous"]
    ];
    UI.modal({ title: "Keyboard shortcuts", testid: "kbd-modal", body: UI.el("div", {},
      rows.map(function (r) { return UI.el("div", { style: "display:flex;gap:var(--sp-3);margin:var(--sp-2) 0" },
        UI.el("kbd", { text: r[0] }), UI.el("span", { text: r[1] })); })) });
  }
  document.addEventListener("keydown", function (e) {
    if (inInput(e)) return;
    var running = location.hash.startsWith("#/exam/run");
    if (e.key === "Escape") {
      document.getElementById("app").classList.remove("drawer-open");
      var sheet = document.querySelector(".palette-sheet.is-open");
      if (sheet) sheet.classList.remove("is-open");
      if (window.SearchOverlay && window.SearchOverlay.close()) return;
      var scrim = document.querySelector(".modal-scrim");
      if (scrim) scrim.remove();
      return;
    }
    if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || (e.key === "/" && !running)) {
      e.preventDefault();
      if (window.SearchOverlay) SearchOverlay.open();
      return;
    }
    if (e.key === "?" || (e.key === "/" && e.shiftKey)) { showHelp(); return; }
    if (e.key === "t") { document.getElementById("themeBtn").click(); return; }
    if (!running && !e.metaKey && !e.ctrlKey && !e.altKey) {
      var map = { d: "#/", s: "#/study", c: "#/cheatsheets", v: "#/videos", g: "#/glossary", e: "#/exam", i: "#/intel", r: "#/results" };
      if (chord === "g" && map[e.key]) {
        clearTimeout(chordTimer); chord = null; go(map[e.key]); e.preventDefault(); return;
      }
      if (e.key === "g") { chord = "g"; chordTimer = setTimeout(function () { chord = null; }, 900); return; }
      chord = null;
    }
  });
  window.Keys = { showHelp: showHelp };
})();
