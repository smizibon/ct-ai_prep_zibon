/* md.js — tiny markdown renderer for the syllabus subset (D1 §1.3).
 * Constructs: paragraphs, bullets (3 levels), ordered lists w/ nested bullets,
 * pipe tables (cells may contain <br>), **bold**, *italic*, ![images], \* escapes.
 * Deterministic; usable in browser and under node (--selftest). */
(function () {
  "use strict";
  function esc(s) {
    return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
  function inline(s) {
    s = s.replace(/&lt;br&gt;/g, "<br>");
    s = s.replace(/\\\*/g, "\u0000");           // protect escaped asterisks
    s = s.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
    s = s.replace(/(^|[^*])\*([^*\n]+)\*/g, "$1<em>$2</em>");
    s = s.replace(/\u0000/g, "*");
    s = s.replace(/!\[([^\]]*)\]\(([^)\s]+)\)/g, function (_, alt, src) {
      return '</p><figure><img src="' + src + '" alt="' + alt + '"><figcaption>' + alt + "</figcaption></figure><p>";
    });
    return s;
  }
  function rowCells(line) {
    return line.replace(/^\s*\|/, "").replace(/\|\s*$/, "").split("|").map(function (c) { return c.trim(); });
  }
  function render(src) {
    var lines = String(src).split("\n");
    var out = [], i = 0;
    var para = [];
    function flush() {
      if (para.length) { out.push("<p>" + inline(esc(para.join(" "))) + "</p>"); para = []; }
    }
    while (i < lines.length) {
      var line = lines[i];
      if (!line.trim()) { flush(); i++; continue; }
      var m;
      if (/^\s*\|/.test(line) && i + 1 < lines.length && /^\s*\|[\s:|-]+\|?\s*$/.test(lines[i + 1])) {
        flush();
        var head = rowCells(line);
        i += 2;
        var body = [];
        while (i < lines.length && /^\s*\|/.test(lines[i])) { body.push(rowCells(lines[i])); i++; }
        var h = "<table><thead><tr>" + head.map(function (c) { return "<th scope=\"col\">" + inline(esc(c)) + "</th>"; }).join("") + "</tr></thead><tbody>";
        h += body.map(function (r) {
          return "<tr>" + r.map(function (c) { return "<td>" + inline(esc(c)) + "</td>"; }).join("") + "</tr>";
        }).join("") + "</tbody></table>";
        out.push(h);
        continue;
      }
      if ((m = line.match(/^(\s*)- (.*)$/))) {
        flush();
        var items = [];
        while (i < lines.length && (m = lines[i].match(/^(\s*)- (.*)$/))) {
          items.push({ depth: Math.floor(m[1].length / 2), text: m[2], i: i });
          i++;
          // continuation lines (indented, not structural) belong to the item
          while (i < lines.length && /^\s{2,}\S/.test(lines[i]) && !/^\s*[-#\d|]/.test(lines[i])) {
            items[items.length - 1].text += " " + lines[i].trim(); i++;
          }
        }
        out.push(list(items, false));
        continue;
      }
      if ((m = line.match(/^(\s*)(\d+)\. (.*)$/))) {
        flush();
        var oitems = [];
        while (i < lines.length && (m = lines[i].match(/^(\s*)(\d+)[.)] (.*)$/))) {
          oitems.push({ depth: Math.floor(m[1].length / 2), text: m[3], ord: m[2], i: i });
          i++;
          while (i < lines.length && /^\s{2,}\S/.test(lines[i]) && !/^\s*[-#\d|]/.test(lines[i])) {
            oitems[oitems.length - 1].text += " " + lines[i].trim(); i++;
          }
        }
        out.push(list(oitems, true));
        continue;
      }
      para.push(line.trim());
      i++;
    }
    flush();
    return out.join("\n");
  }
  function list(items, ordered) {
    var html = ordered ? "<ol>" : "<ul>", stack = 0;
    items.forEach(function (it) {
      while (stack < it.depth) { html += ordered ? "<ol>" : "<ul>"; stack++; }
      while (stack > it.depth) { html += ordered ? "</ol>" : "</ul>"; stack--; }
      // nested bullet inside ordered item: item text starting with "- "
      html += "<li>" + inline(esc(it.text)) + "</li>";
    });
    while (stack-- > 0) html += ordered ? "</ol>" : "</ul>";
    return html + (ordered ? "</ol>" : "</ul>");
  }
  var api = { render: render };
  if (typeof window !== "undefined") window.md = render;
  if (typeof module !== "undefined") module.exports = api;
  if (typeof process !== "undefined" && process.argv && process.argv.includes("--selftest")) {
    var cases = [
      ["a **b** c", "<p>a <strong>b</strong> c</p>"],
      ["Accuracy = (TP + TN) \\* 100%", /<p>Accuracy = \(TP \+ TN\) \* 100%<\/p>/],
      ["- a\n- b", "<ul><li>a</li><li>b</li></ul>"],
      ["- a\n  - b\n    - c", /<ul><li>a<\/li>[\s\S]*<ul><li>b<\/li>[\s\S]*<ul><li>c/],
      ["1. one\n2. two\n   - sub", /<ol><li>one<\/li>[\s\S]*<li>two[\s\S]*<ul><li>sub/],
      ["| A | B |\n|---|---|\n| 1 | 2 |", /<table><thead><tr><th scope="col">A<\/th>/],
      ["| A | B |\n|---|---|\n| x<br>y | z |", /<td>x<br>y<\/td>/],
      ["*Figure 3: thing*", /<p><em>Figure 3: thing<\/em><\/p>/],
    ];
    var fails = 0;
    cases.forEach(function (c, n) {
      var got = render(c[0]);
      var ok = c[1] instanceof RegExp ? c[1].test(got) : got === c[1];
      if (!ok) { fails++; console.error("case " + n + " FAIL: " + JSON.stringify(got)); }
    });
    console.log(fails ? "md selftest: " + fails + " FAILURES" : "md selftest: OK");
    process.exit(fails ? 1 : 0);
  }
})();
