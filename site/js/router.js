/* router.js — hash router + shell chrome (sidebar, topbar, theme, drawer) */
(function () {
  "use strict";
  var scrollMap = {}, lastRoute = null, suppressGuard = false;

  function parse() {
    var h = location.hash.replace(/^#/, "");
    if (!h.startsWith("/")) h = "/";
    var qIdx = h.indexOf("?");
    var path = qIdx >= 0 ? h.slice(0, qIdx) : h;
    var query = {};
    if (qIdx >= 0) h.slice(qIdx + 1).split("&").forEach(function (kv) {
      var p = kv.split("="); query[decodeURIComponent(p[0])] = decodeURIComponent(p[1] || "");
    });
    return { seg: path.split("/").filter(Boolean), query: query, path: path };
  }

  var NAV = [
    { href: "#/", label: "Dashboard", icon: "home", key: "d" },
    { href: "#/study", label: "Study", icon: "book", key: "s" },
    { href: "#/cheatsheets", label: "Cheatsheets", icon: "layers", key: "c" },
    { href: "#/videos", label: "Videos", icon: "play", key: "v" },
    { href: "#/glossary", label: "Glossary", icon: "grid", key: "g" },
    { href: "#/exam", label: "Mock Exam", icon: "timer", key: "e" },
    { href: "#/results", label: "Results", icon: "star", key: "r" },
    { href: "#/intel", label: "Exam Intel", icon: "compass", key: "i" }
  ];

  function buildNav() {
    var nav = document.getElementById("nav");
    nav.innerHTML = "";
    var g = UI.el("div", { class: "nav__group" });
    NAV.forEach(function (item) {
      g.appendChild(UI.el("a", { class: "nav-item", href: item.href, "data-nav": item.href,
        "data-testid": "nav-" + (item.href === "#/" ? "home" : item.href.slice(2)) },
        UI.icon(item.icon), item.label,
        item.href === "#/results" ? UI.el("span", { class: "nav-item__meta", id: "navAttemptCount" }) : null));
    });
    nav.appendChild(g);
  }

  function setActiveNav(path) {
    document.querySelectorAll(".nav-item").forEach(function (a) {
      var target = (a.getAttribute("data-nav") || "").replace(/^#/, ""); /* "#/study" → "/study" to match route.path */
      var hit = target === "/" ? path === "/" : path === target || path.startsWith(target + "/");
      if (hit) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current");
    });
  }

  function setBreadcrumb(crumbs, actions) {
    var bc = document.getElementById("breadcrumb");
    bc.innerHTML = "";
    crumbs.forEach(function (c, i) {
      if (i) bc.appendChild(document.createTextNode(" / "));
      if (i === crumbs.length - 1 || !c.href) bc.appendChild(UI.el("span", { class: "crumb-cur", text: c.label }));
      else bc.appendChild(UI.el("a", { href: c.href, text: c.label }));
    });
    var ta = document.getElementById("topActions");
    ta.innerHTML = "";
    (actions || []).forEach(function (a) { ta.appendChild(a); });
  }

  function updateReadiness() {
    var host = document.getElementById("readiness");
    if (!host) return;
    var r = UI.readiness();
    host.innerHTML = "";
    host.appendChild(UI.ring({ size: "mini", frac: r.combined }));
    host.appendChild(UI.el("div", { class: "readiness__cap" },
      Math.round(r.combined * 100) + "% exam ready",
      UI.el("span", { style: "display:block", text: r.hasSim ? "study " + Math.round(r.study * 100) + "% · best sim " + Math.round(r.bestSim * 100) + "%" : "study " + Math.round(r.study * 100) + "% · no sim yet" })));
    var n = Store.getAttempts().length;
    var mc = document.getElementById("navAttemptCount");
    if (mc) mc.textContent = n ? String(n) : "";
  }

  function applyTheme() {
    var s = Store.settings;
    var mode = s.theme === "light" || s.theme === "dark" ? s.theme : "auto";
    var t = mode === "auto" ? (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light") : mode;
    document.documentElement.dataset.theme = t;
    var btn = document.getElementById("themeBtn");
    btn.innerHTML = "";
    btn.appendChild(UI.icon(t === "dark" ? "sun" : "moon"));
    document.querySelectorAll(".theme-seg__btn").forEach(function (b) {
      b.setAttribute("aria-checked", b.dataset.mode === mode ? "true" : "false");
    });
  }

  function viewFor(route) {
    var V = window.CTAI_VIEWS;
    var s = route.seg;
    if (!s.length) return { view: V.dashboard, params: {}, crumbs: [{ label: "Dashboard" }] };
    if (s[0] === "study") {
      if (s.length === 1) return { view: V.study, params: {}, crumbs: [{ label: "Study" }] };
      return { view: V.study, params: { ch: Number(s[1].replace("ch", "")), sub: s[2] || null },
        crumbs: [{ label: "Study", href: "#/study" }, { label: "Chapter " + s[1].replace("ch", "") }] };
    }
    if (s[0] === "cheatsheets") {
      if (s.length === 1) return { view: V.cheatsheets, params: {}, crumbs: [{ label: "Cheatsheets" }] };
      return { view: V.cheatsheets, params: { ch: Number(s[1].replace("ch", "")) },
        crumbs: [{ label: "Cheatsheets", href: "#/cheatsheets" }, { label: "Chapter " + s[1].replace("ch", "") }] };
    }
    if (s[0] === "videos") {
      var vch = s[1] ? Number(s[1].replace("ch", "")) : null;
      return { view: V.videos, params: { ch: isNaN(vch) ? null : vch, q: route.query.q || "" },
        crumbs: [{ label: "Videos", href: "#/videos" }].concat(vch !== null && !isNaN(vch)
          ? [{ label: vch === 0 ? "Exam prep" : "Chapter " + vch }] : []) };
    }
    if (s[0] === "glossary") return { view: V.glossary, params: { q: route.query.q || "" }, crumbs: [{ label: "Glossary" }] };
    if (s[0] === "exam") {
      if (s[1] === "run") return { view: V.runner, params: { sessionId: s[2] }, exam: true, crumbs: [{ label: "Exam" }] };
      return { view: V.examhub, params: {}, crumbs: [{ label: "Mock Exam" }] };
    }
    if (s[0] === "results") {
      if (s.length === 1) return { view: V.results, params: {}, crumbs: [{ label: "Results" }] };
      if (s[2] === "review") return { view: V.review, params: { sessionId: s[1], filter: route.query.filter || "all" },
        crumbs: [{ label: "Results", href: "#/results" }, { label: "Review" }] };
      return { view: V.results, params: { sessionId: s[1] }, crumbs: [{ label: "Results", href: "#/results" }, { label: "Report" }] };
    }
    if (s[0] === "selftest") return { view: V.selftest, params: {}, crumbs: [{ label: "Selftest" }] };
    if (s[0] === "intel") return { view: V.intel, params: { tab: s[1] || "advice" },
      crumbs: [{ label: "Exam Intel" }, { label: s[1] === "patterns" ? "Patterns" : "Advice" }] };
    return { view: V.notfound, params: {}, crumbs: [{ label: "Not found" }] };
  }

  function render() {
    var route = parse();
    var target = viewFor(route);
    // sim guard: leaving an active running sim (not by reload) requires abandon
    var app = document.getElementById("app");
    if (!target.exam) {
      app.dataset.shell = "main";
      var sess = Store.getSession();
      if (lastRoute && lastRoute.startsWith("#/exam/run") && sess && !sess.finished && sess.mode === "sim" && !suppressGuard) {
        location.hash = lastRoute;
        UI.confirm("Leave the simulation?",
          UI.el("div", {}, UI.el("p", {}, "A real exam cannot be paused — leaving now abandons this attempt. Your answers will be discarded."),
            UI.el("p", { style: "margin-top:8px;color:var(--ink-3)", text: "Practice modes pause silently instead." })),
          "Abandon exam", function () {
            suppressGuard = true;
            Store.clearSession();
            UI.toast("Simulation abandoned");
            location.hash = route.path === "/" ? "#/" : "#" + route.path;
            setTimeout(function () { suppressGuard = false; }, 200);
          }, true);
        return;
      }
    } else {
      app.dataset.shell = "exam";
    }
    /* normal route change closes any open modal — a playing video must never become orphaned
       audio (plan-videos §10). UI.confirm dialogs (e.g. the sim leave-guard, which re-renders
       onto the exam route after its hash revert) carry no modal testid and are mid-decision —
       those are spared. Runs AFTER the sim leave-guard block for the same reason. */
    document.querySelectorAll(".modal-scrim").forEach(function (s) {
      var m = s.querySelector(".modal");
      if (!m || m.getAttribute("data-testid")) s.remove();
    });
    if (lastRoute && scrollMap[lastRoute] != null) {
      try { scrollMap[lastRoute] = window.scrollY; } catch (e) {}
    }
    var content = document.getElementById("content");
    content.innerHTML = "";
    document.title = "CT-AI Studio";
    setActiveNav(route.path);
    if (!target.exam) setBreadcrumb(target.crumbs, target.actions);
    var node = target.view.render(target.params, route);
    node.classList.add("view-enter");
    content.appendChild(node);
    if (!target.exam) updateReadiness();
    // scroll restore
    var key = "#" + route.path;
    if (scrollMap[key] != null && history.scrollRestoration !== "manual") {
      window.scrollTo(0, scrollMap[key]);
    } else {
      window.scrollTo(0, 0);
    }
    lastRoute = key;
    if (window.ExamRuntime && window.ExamRuntime.onRouteChange) window.ExamRuntime.onRouteChange(route);
  }

  function init() {
    buildNav();
    applyTheme();
    document.getElementById("themeBtn").addEventListener("click", function () {
      var cur = document.documentElement.dataset.theme;
      Store.settings.theme = cur === "dark" ? "light" : "dark";
      Store.saveSettings();
      applyTheme();
    });
    document.querySelectorAll(".theme-seg__btn").forEach(function (b) {
      b.addEventListener("click", function () {
        Store.settings.theme = b.dataset.mode;
        Store.saveSettings();
        applyTheme();
      });
    });
    try { /* auto mode should track the OS while the tab is open */
      matchMedia("(prefers-color-scheme: dark)").addEventListener("change", function () {
        if (Store.settings.theme !== "light" && Store.settings.theme !== "dark") applyTheme();
      });
    } catch (e) {}
    document.getElementById("drawerBtn").addEventListener("click", function () {
      document.getElementById("app").classList.add("drawer-open");
    });
    document.getElementById("scrim").addEventListener("click", function () {
      document.getElementById("app").classList.remove("drawer-open");
    });
    document.querySelectorAll(".nav-item").forEach(function (a) {
      a.addEventListener("click", function () { document.getElementById("app").classList.remove("drawer-open"); });
    });
    document.getElementById("kbdBtn").addEventListener("click", window.Keys ? window.Keys.showHelp : function () {});
    document.getElementById("resetBtn").addEventListener("click", function () {
      UI.confirm("Reset all progress?", "This clears study progress, the in-progress session, attempt history, and question statistics. This cannot be undone.", "Reset everything", function () {
        Store.resetAll();
        Store.settings.theme = "auto"; Store.saveSettings();
        applyTheme();
        UI.toast("All progress reset");
        render();
        var scrim = document.querySelector(".modal-scrim"); if (scrim) scrim.remove();
      }, true);
    });
    window.addEventListener("hashchange", render);
    window.addEventListener("scroll", UI.throttle ? UI.throttle(function () {
      document.getElementById("topbar").classList.toggle("is-scrolled", window.scrollY > 4);
    }, 100) : function () {
      document.getElementById("topbar").classList.toggle("is-scrolled", window.scrollY > 4);
    }, { passive: true });
    if (!Store.available) {
      setTimeout(function () { UI.toast("Storage unavailable — running session-only (no persistence)"); }, 600);
    }
    render();
  }
  window.Router = { render: render, NAV: NAV };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
