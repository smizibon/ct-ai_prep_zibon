/* ui.js — DOM helpers + shared components (rings, chips, toasts, modals, figures) */
(function () {
  "use strict";
  var SVG_NS = "http://www.w3.org/2000/svg";
  var SVG_TAGS = { svg: 1, use: 1, circle: 1, line: 1, path: 1, rect: 1, g: 1, text: 1, polyline: 1, polygon: 1 };
  function el(tag, attrs, ...kids) {
    var node = SVG_TAGS[tag.toLowerCase()] ? document.createElementNS(SVG_NS, tag) : document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) {
      var v = attrs[k];
      if (v == null) return;
      if (k === "class") node.setAttribute("class", v); /* setAttribute: SVG className is read-only */
      else if (k === "html") node.innerHTML = v;
      else if (k === "text") node.textContent = v;
      else if (k.startsWith("on") && typeof v === "function") node.addEventListener(k.slice(2), v);
      else if (k === "dataset") Object.assign(node.dataset, v);
      else node.setAttribute(k, v);
    });
    kids.flat(Infinity).forEach(function (kid) {
      if (kid == null || kid === false) return;
      node.appendChild(typeof kid === "string" ? document.createTextNode(kid) : kid);
    });
    return node;
  }
  function icon(name, sm) {
    return el("svg", { class: "icon" + (sm ? " icon--sm" : ""), "aria-hidden": "true" },
      el("use", { href: "#" + name }));
  }
  var UI = { el, icon };

  UI.chip = function (text, opts) {
    opts = opts || {};
    return el("span", { class: "meta-chip" + (opts.variant ? "--" + opts.variant : "") + (opts.mono ? " meta-chip--mono" : ""),
      "data-tip": opts.tip || null }, opts.icon ? icon(opts.icon, true) : null, text);
  };
  UI.kchip = function (k) {
    var cls = k[0] === "H" ? "k-chip--h" : "k-chip--" + k.toLowerCase();
    return el("span", { class: "k-chip " + cls,
      "data-tip": k === "K3" ? "K3 = Apply — you must apply this, not just recall it" :
        k === "K2" ? "K2 = Understand" : k[0] === "H" ? "Hands-on objective (not directly examinable)" : "K1 = Remember" }, k);
  };

  UI.ring = function (opts) {
    var size = opts.size === "hero" ? 168 : opts.size === "std" ? 96 : opts.size === "sm" ? 64 : 40;
    var stroke = opts.size === "hero" ? 12 : opts.size === "std" ? 8 : opts.size === "sm" ? 6 : 4;
    var r = (size - stroke) / 2, c = 2 * Math.PI * r;
    var frac = Math.max(0, Math.min(1, opts.frac || 0));
    var svg = el("svg", { width: size, height: size, viewBox: "0 0 " + size + " " + size, role: "progressbar" == opts.role ? "progressbar" : null,
      "aria-valuemin": "0", "aria-valuemax": "100", "aria-valuenow": Math.round(frac * 100), "aria-label": opts.label || "progress" });
    var ns = "http://www.w3.org/2000/svg";
    svg.innerHTML = '<circle class="ring__track" cx="' + size / 2 + '" cy="' + size / 2 + '" r="' + r + '" fill="none" stroke-width="' + stroke + '"></circle>' +
      '<circle class="ring__val" cx="' + size / 2 + '" cy="' + size / 2 + '" r="' + r + '" fill="none" stroke-width="' + stroke + '" stroke-linecap="round" stroke-dasharray="' + c + '" stroke-dashoffset="' + (c * (1 - frac)) + '"></circle>' +
      (opts.tick != null ? '<line class="ring__tick" x1="' + size / 2 + '" y1="' + (stroke / 2 + 1) + '" x2="' + size / 2 + '" y2="' + (stroke / 2 + 7) + '" transform="rotate(' + (opts.tick * 360 - 0) + ' ' + size / 2 + ' ' + size / 2 + ')"></line>' : "");
    var wrap = el("span", { class: "ring ring--" + (opts.size || "mini") + (opts.variant ? " ring--" + opts.variant : "") }, svg,
      el("span", { class: "ring__center" },
        el("span", { class: "ring__num", text: opts.num != null ? String(opts.num) : Math.round(frac * 100) + "%" }),
        opts.cap ? el("span", { class: "ring__cap", text: opts.cap }) : null));
    requestAnimationFrame(function () { requestAnimationFrame(function () {
      svg.querySelector(".ring__val").style.strokeDashoffset = c * (1 - frac);
    }); });
    return wrap;
  };
  UI.pbar = function (frac, thin) {
    return el("div", { class: "pbar" + (thin ? " pbar--thin" : "") },
      el("div", { class: "pbar__fill", style: "width:" + Math.round(Math.max(0, Math.min(1, frac)) * 100) + "%" }));
  };

  /* toasts */
  var toastWrap = null;
  UI.toast = function (msg, ms) {
    if (!toastWrap) { toastWrap = el("div", { class: "toast-wrap" }); document.body.appendChild(toastWrap); }
    var t = el("div", { class: "toast", role: "status", "data-testid": "toast" }, icon("info", true), el("span", { text: msg }));
    toastWrap.appendChild(t);
    setTimeout(function () { t.remove(); }, ms || 4200);
  };

  /* modal — returns {close, root}; body may be node/string */
  UI.modal = function (opts) {
    var scrim = el("div", { class: "modal-scrim", "data-testid": "modal" });
    var m = el("div", { class: "modal" + (opts.wide ? " modal--wide" : opts.fig ? " modal--fig" : "") + (opts.cls ? " " + opts.cls : ""), role: "dialog", "aria-modal": "true", "aria-labelledby": opts.titleId || null, "data-testid": opts.testid || null },
      el("h3", { class: "t-h3", id: opts.titleId || null, text: opts.title || "" }),
      el("div", { class: "modal__body" }, opts.body || ""),
      opts.footer ? el("div", { class: "modal__foot" }, opts.footer) : null);
    scrim.appendChild(m);
    function close() { scrim.remove(); document.removeEventListener("keydown", onKey); if (opts.onClose) opts.onClose(); }
    function onKey(e) { if (e.key === "Escape" && !opts.noEsc) close(); }
    document.addEventListener("keydown", onKey);
    if (!opts.noScrimClose) scrim.addEventListener("click", function (e) { if (e.target === scrim) close(); });
    document.body.appendChild(scrim);
    var f = m.querySelector("button,input,[tabindex]");
    if (f) f.focus();
    return { close: close, root: m };
  };
  UI.confirm = function (title, body, okLabel, onOk, danger) {
    UI.modal({ title: title, body: body, footer: [
      el("button", { class: "btn btn--ghost", "data-testid": "modal-cancel", onclick: function (e) { e.target.closest(".modal-scrim").remove(); } }, "Cancel"),
      el("button", { class: "btn " + (danger ? "btn--danger" : "btn--primary"), "data-testid": "modal-ok", onclick: function (e) { var sc = e.target.closest(".modal-scrim"); if (sc) sc.remove(); onOk && onOk(); } }, okLabel)
    ] });
  };

  UI.figure = function (fig, opts) {
    opts = opts || {};
    var frame = el("figure", { class: "fig-frame" },
      el("img", { src: fig.src, alt: fig.alt || "", loading: "lazy" }),
      el("button", { class: "icon-btn fig-zoom", "aria-label": "Zoom figure", "data-testid": "fig-zoom", onclick: function () {
        UI.modal({ title: opts.title || "Figure", fig: true, testid: "fig-modal", body: el("div", {},
          el("img", { src: fig.src, alt: fig.alt || "", style: "width:100%" }),
          el("figcaption", { class: "t-small", style: "font-style:italic;margin-top:var(--sp-2)", text: fig.alt || "" })) });
      } }, icon("search")),
      fig.transcription && !opts.noTranscription ? el("figcaption", { class: "t-small" },
        el("div", { class: "md", html: window.md(fig.transcription) })) : null,
      fig.caption ? el("figcaption", { class: "t-small", style: "font-style:italic", text: fig.caption }) : null);
    return frame;
  };

  UI.sectionLabel = function (text, right) {
    return el("div", { class: "panel-label t-caption" }, text, right ? el("span", { class: "meta-chip", text: right }) : null);
  };

  UI.emptyState = function (title, sub, action) {
    return el("div", { class: "empty" },
      el("svg", { class: "empty__art", viewBox: "0 0 96 96", "aria-hidden": "true" },
        '<g fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="20" cy="66" r="6"/><circle cx="44" cy="24" r="6"/><circle cx="74" cy="48" r="6"/><path d="M20 66 44 24l30 24"/><path d="M20 66l54-18" stroke-dasharray="3 4"/></g><circle class="node-hot" cx="74" cy="48" r="4" fill="currentColor"/>'),
      el("div", { class: "t-h3", text: title }),
      el("p", { class: "t-small", style: "color:var(--ink-2);margin-top:var(--sp-2)", text: sub }),
      action || null);
  };

  UI.fmtTime = function (sec) {
    sec = Math.max(0, Math.round(sec));
    var m = Math.floor(sec / 60), s = sec % 60;
    return m + ":" + (s < 10 ? "0" : "") + s;
  };
  UI.plural = function (n, word, plural) { return n + " " + (n === 1 ? word : (plural || word + "s")); };

  UI.chapterProgress = function (n) {
    var ch = window.CTAI_DATA.chapters[n];
    if (!ch) return { frac: 0, done: 0, total: 0, mins: 0, minsTotal: ch ? ch.minutes : 0 };
    var p = Store.getProgress();
    var units = ch.sections.reduce(function (a, s) { return a.concat(s.subsections); }, []);
    var exam = units.filter(function (u) { return u.examinable; });
    var done = exam.filter(function (u) { return p[u.id] && p[u.id].understood; });
    var mins = exam.reduce(function (a, u) { return a + (done.includes(u) ? u.minutes : 0); }, 0);
    return { frac: exam.length ? done.length / exam.length : 0, done: done.length, total: exam.length, mins: mins, minsTotal: ch.minutes };
  };
  UI.overallStudy = function () {
    var tot = { frac: 0, mins: 0, minsTotal: 0 };
    for (var n = 1; n <= 7; n++) {
      var cp = UI.chapterProgress(n);
      tot.mins += cp.mins; tot.minsTotal += cp.minsTotal;
    }
    tot.frac = tot.minsTotal ? tot.mins / tot.minsTotal : 0;
    return tot;
  };
  UI.readiness = function () {
    var study = UI.overallStudy().frac;
    var best = (Store.getAttempts().filter(function (a) { return a.mode === "sim"; })
      .reduce(function (m, a) { return Math.max(m, a.points / a.maxPoints); }, 0));
    var has = Store.getAttempts().some(function (a) { return a.mode === "sim"; });
    return { study: study, bestSim: best, hasSim: has, combined: has ? 0.5 * study + 0.5 * best : study };
  };

  window.UI = UI;
})();
