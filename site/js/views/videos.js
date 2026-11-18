/* views/videos.js — #/videos[/ch{n}] curated YouTube companion library (docs/plans/plan-videos.md) */
(function () {
  "use strict";
  window.CTAI_VIEWS = window.CTAI_VIEWS || {};
  var V = window.UI;

  var TIERS = ["official", "educator", "trainer", "community"];
  var TIER_LABEL = { official: "official", educator: "educator", trainer: "trainer", community: "community" };
  var TIER_CHIP = { official: { variant: "accent" }, educator: { variant: "success" }, trainer: { variant: "" }, community: { variant: "mono" } };
  var state = { tier: "all", q: "" }; /* tier + text filters are view-local; chapter comes from the route */
  var NOTE_BY_SECTION = {};           /* refreshed from data on every render (plan §9 D7) */
  var played = {};                    /* view-local played markers (debate verdict §10 — never persisted) */

  /* debate verdict §10: modal click-to-play — lazy nocookie iframe, src derived from v.url */
  function openPlayer(v) {
    var opener = document.activeElement;
    if (navigator.onLine === false) UI.toast("Offline? Playback streams from youtube-nocookie.com — needs internet.");
    var src = v.url.replace("www.youtube.com/watch?v=", "www.youtube-nocookie.com/embed/") + "?autoplay=1&rel=0&playsinline=1";
    var frame = V.el("iframe", { class: "vid-embed", src: src, title: v.title + " — YouTube player",
      allow: "autoplay; fullscreen; picture-in-picture; encrypted-media", allowfullscreen: "true",
      loading: "lazy", scrolling: "no" });
    var wrap = V.el("div", { class: "vid-embed-wrap", tabindex: "-1" }, frame); /* focus lands here, not the iframe — Esc works at open (ui.js focuses first [tabindex]) */
    var ctl;
    var closeBtn = V.el("button", { class: "btn btn--ghost btn--sm", "data-testid": "vid-modal-close",
      onclick: function () { ctl.close(); } }, "Close");
    var openYt = V.el("a", { class: "btn btn--primary btn--sm", href: v.url, target: "_blank", rel: "noopener",
      "data-testid": "vid-open-yt-" + v.id }, V.icon("external", true), "Open on YouTube");
    ctl = UI.modal({ title: v.title, cls: "modal--player", testid: "vid-modal",
      body: V.el("div", {}, wrap,
        V.el("p", { class: "t-caption vid-embed__cap" }, "Streams from youtube-nocookie.com — needs internet. Playback stops when this dialog closes.")),
      footer: [closeBtn, openYt],
      onClose: function () {
        played[v.id] = 1;
        var b = document.querySelector('[data-testid="vid-play-' + v.id + '"]');
        if (b && document.contains(b)) {
          b.classList.add("is-played");
          var label = b.querySelector(".vid-play-label");
          if (label) label.textContent = "Replay";
          b.setAttribute("aria-label", "Replay " + v.title + " in-app (loads YouTube — needs internet)");
        }
        if (opener && document.contains(opener)) opener.focus();
      } });
  }

  function data() { return window.CTAI_VIDEOS || { compiled: "", verifiedHow: "", channels: {}, videos: [], uncovered: [] }; }

  function sectionChip(s) {
    var n = intCh(s);
    var note = NOTE_BY_SECTION[s];
    if (!n) {
      var pchip = V.chip(s, { mono: true });
      pchip.setAttribute("title", "exam-prep mapping (not a syllabus section)");
      return pchip;
    }
    var chip = V.el("a", { class: "meta-chip meta-chip--mono" + (note ? " meta-chip--warn" : ""),
      href: "#/study/ch" + n + "/" + s, title: note ? "coverage note (" + note.level + "): " + note.note : "open section " + s + " in Study",
      "data-testid": "vid-sec-" + s, text: s });
    if (note) chip.appendChild(V.el("span", { class: "vid-sec-dot", "aria-hidden": "true", text: "!" }));
    return chip;
  }
  function intCh(s) { var m = /^(\d)\./.exec(s); return m ? Number(m[1]) : 0; }
  function noteBySection() {
    var map = {};
    (data().coverageNotes || []).forEach(function (n) { if (n.section !== "EXAM") map[n.section] = n; });
    return map;
  }
  NOTE_BY_SECTION = noteBySection();

  function videoCard(v, ch) {
    var D = data();
    var c = D.channels[v.channel] || { name: v.channel, tier: "community" };
    var tier = c.tier || "community";
    var playBtn = V.el("button", { class: "btn btn--primary btn--sm" + (played[v.id] ? " is-played" : ""),
      "data-testid": "vid-play-" + v.id,
      "aria-label": (played[v.id] ? "Replay " : "Play ") + v.title + " in-app (loads YouTube — needs internet)",
      onclick: function () { openPlayer(v); } },
      V.el("span", { class: "vid-play-label", text: played[v.id] ? "Replay" : "Play" }));
    var watch = V.el("a", { class: "btn btn--ghost btn--sm", href: v.url, target: "_blank", rel: "noopener",
      "data-testid": "vid-watch-" + v.id, "aria-label": "Watch " + v.title + " on YouTube (opens a new tab)", title: "Open on YouTube (new tab)" },
      V.icon("external", true), "YouTube");
    var tierChip = V.chip(TIER_LABEL[tier], TIER_CHIP[tier]);
    tierChip.setAttribute("title", TIER_LABEL[tier] + " channel");
    return V.el("article", { class: "card vid-card", "data-testid": "vid-card-" + v.id },
      /* head — one quiet meta line: channel (credential in native tooltip), tier, duration */
      V.el("div", { class: "vid-card__head" },
        V.el("span", { class: "vid-card__channel", title: c.note || c.name, text: c.name }),
        V.el("span", { class: "vid-card__tier" }, tierChip),
        v.duration ? V.el("span", { class: "vid-card__dur" },
          V.chip((v.approxDuration ? "≈" : "") + v.duration, { mono: true })) : null),
      /* body: title dominates, why supports, clamped for cross-card rhythm */
      V.el("a", { class: "vid-card__title t-h4", href: v.url, target: "_blank", rel: "noopener",
        "data-testid": "vid-title-" + v.id }, v.title),
      v.why ? V.el("p", { class: "vid-card__why", text: v.why }) : null,
      v.topicsText ? V.el("p", { class: "vid-card__topics", text: v.topicsText }) : null,
      V.el("div", { class: "chiprow" },
        v.sections.map(function (s) { return sectionChip(s); }),
        v.published ? V.chip(v.published, { mono: true }) : null,
        (function () {
          if (v.versionApplicability === "v1.0") {
            var chp = V.chip("v1.0-era", { variant: "warn" });
            chp.setAttribute("title", "made for CT-AI v1.0 — verify details against the v2.0 syllabus");
            return chp;
          }
          return v.versionApplicability === "v2.0" ? V.chip("v2.0", { variant: "success" }) : null;
        })()),
      /* action bar — isolated by a divider, content-sized buttons, right-aligned (site idiom) */
      V.el("div", { class: "vid-card__foot" }, playBtn, watch));
  }

  function matches(v, q) {
    if (!q) return true;
    var D = data(); var c = (D.channels[v.channel] || {}).name || "";
    return (v.title + " " + c + " " + (v.topicsText || "") + " " + (v.why || "")).toLowerCase().includes(q);
  }

  function filtered(D, ch) {
    return D.videos.filter(function (v) {
      if (ch !== null && !v.chapters.includes(ch)) return false;
      if (state.tier !== "all") {
        var tier = (D.channels[v.channel] || {}).tier;
        if (tier !== state.tier) return false;
      }
      return matches(v, state.q);
    });
  }

  function renderList(D, ch, host, countEl) {
    if (!host) return null;
    host.innerHTML = "";
    var vids = filtered(D, ch);
    if (countEl) countEl.textContent = V.plural(vids.length, "video");
    if (!D.videos.length) {
      host.appendChild(V.emptyState("Library under curation",
        "The video research wave is still running — curated, oEmbed-verified picks will land here.",
        V.el("a", { class: "btn btn--primary btn--sm", href: "#/study", "data-testid": "vid-fallback-study" }, "Back to Study")));
      return host;
    }
    if (!vids.length) {
      host.appendChild(V.emptyState("No videos match", "Try another chapter tab, tier, or search term.", null));
      return host;
    }
    var groups = [];
    if (ch === null) { /* grouped by chapter, syllabus order 1..7 then exam-prep */
      for (var n = 1; n <= 7; n++) groups.push(n);
      if (D.videos.some(function (v) { return v.chapters.includes(0); })) groups.push(0);
    } else groups.push(ch);
    groups.forEach(function (g) {
      var gv = vids.filter(function (v) { return v.chapters.includes(g); });
      if (!gv.length) return;
      var label = g === 0 ? "CT-AI exam prep" : "Chapter " + g + " — " + (window.CTAI_DATA.chapters[g] ? window.CTAI_DATA.chapters[g].title : "");
      host.appendChild(V.sectionLabel(label, V.plural(gv.length, "video")));
      var grid = V.el("div", { class: "vid-grid" });
      gv.forEach(function (v) { grid.appendChild(videoCard(v, g)); });
      host.appendChild(grid);
    });
    return host;
  }

  window.CTAI_VIEWS.videos = {
    render: function (params) {
      var D = data();
      var ch = params.ch == null ? null : params.ch;
      state.q = params.q || state.q; /* ?q= deep-link pre-fills the search box */
      var page = V.el("div", { class: "page" });

      var total = D.videos.length;
      var covered = {};
      D.videos.forEach(function (v) { v.sections.forEach(function (s) { if (intCh(s)) covered[s] = 1; }); });
      var allSections = [];
      for (var n = 1; n <= 7; n++) {
        var chd = window.CTAI_DATA.chapters[n];
        if (!chd) continue;
        chd.sections.forEach(function (s) { s.subsections.forEach(function (u) { allSections.push(u.id); }); });
      }
      var ncov = allSections.filter(function (s) { return covered[s]; }).length;
      var unc = D.uncovered || [];
      var cnotesAll = D.coverageNotes || [];

      page.appendChild(V.el("div", { class: "page-head" },
        V.el("div", { class: "section-marker t-caption", style: "color:var(--ink-3)" }, "Watch"),
        V.el("h1", { class: "t-h1", text: "YouTube companion library" }),
        V.el("p", { class: "t-lead" },
          total + " curated videos from reputed channels covering the whole syllabus — every id live-verified (oEmbed) before shipping. ",
          ncov < allSections.length || unc.length ?
            V.el("span", { class: "t-small", style: "color:var(--ink-3)" },
              ncov + "/" + allSections.length + " sections covered; " + unc.length + " honest gap" + (unc.length === 1 ? "" : "s") + " listed below.") :
            V.el("span", { class: "t-small", style: "color:var(--success)" }, "all " + allSections.length + " syllabus sections covered"),
          cnotesAll.length ? V.el("span", { class: "t-small", style: "color:var(--ink-3)" },
            " · " + cnotesAll.length + " coverage note" + (cnotesAll.length === 1 ? "" : "s") +
            " flag thin/partial topics — the syllabus text is the backstop for those.") : null)));

      /* tier filter + search */
      var toolbar = V.el("div", { class: "vid-toolbar" });
      var countEl = V.el("span", { class: "meta-chip", "data-testid": "vid-count", text: "" });
      var tiers = V.el("div", { class: "chiprow", role: "group", "aria-label": "Filter by channel tier" },
        ["all"].concat(TIERS).map(function (t) {
          var n = t === "all" ? total : D.videos.filter(function (v) { return ((D.channels[v.channel] || {}).tier) === t; }).length;
          return V.el("button", { class: "chip-btn" + (state.tier === t ? " is-active" : ""),
            "aria-pressed": state.tier === t ? "true" : "false", "data-testid": "vid-tier-" + t,
            onclick: function () { state.tier = t; syncToolbar(); renderList(D, ch, listHost, countEl); } },
            (t === "all" ? "All tiers" : TIER_LABEL[t]) + " · " + n);
        }));
      var search = V.el("input", { type: "text", class: "search__input", value: state.q,
        placeholder: "Search title, channel, topic…", "data-testid": "vid-search",
        "aria-label": "Search videos", oninput: function (e) { state.q = e.target.value.toLowerCase().trim(); renderList(D, ch, listHost, countEl); } });
      toolbar.appendChild(search);
      toolbar.appendChild(countEl);
      toolbar.appendChild(tiers);
      page.appendChild(toolbar);

      /* chapter tabs */
      var tabs = V.el("div", { class: "tabs", role: "tablist" });
      var tabAll = V.el("a", { class: "tab", role: "tab", "aria-selected": ch === null ? "true" : "false",
        href: "#/videos", "data-testid": "vid-tab-all", text: "All (" + total + ")" });
      tabs.appendChild(tabAll);
      for (var t = 1; t <= 7; t++) {
        (function (t) {
          var cnt = D.videos.filter(function (v) { return v.chapters.includes(t); }).length;
          tabs.appendChild(V.el("a", { class: "tab", role: "tab", "aria-selected": ch === t ? "true" : "false",
            href: "#/videos/ch" + t, "data-testid": "vid-tab-ch" + t, text: "Ch " + t + " (" + cnt + ")" }));
        })(t);
      }
      if (D.videos.some(function (v) { return v.chapters.includes(0); })) {
        var cnt0 = D.videos.filter(function (v) { return v.chapters.includes(0); }).length;
        tabs.appendChild(V.el("a", { class: "tab", role: "tab", "aria-selected": ch === 0 ? "true" : "false",
          href: "#/videos/ch0", "data-testid": "vid-tab-exam", text: "Exam prep (" + cnt0 + ")" }));
      }
      page.appendChild(tabs);

      var listHost = V.el("div", { id: "vidList" });
      page.appendChild(listHost);
      renderList(D, ch, listHost, countEl);

      /* coverage notes & honest gaps — scoped to the active chapter tab (plan §9 D7) */
      var inScope = function (n) {
        return ch === null ? true : (ch === 0 ? n.section === "EXAM" : n.section.indexOf(ch + ".") === 0);
      };
      var cnotes = cnotesAll.filter(inScope);
      var uncScoped = unc.filter(inScope);
      if (cnotes.length || uncScoped.length) {
        page.appendChild(V.sectionLabel("Coverage notes & gaps",
          V.plural(cnotes.length + uncScoped.length, "item") + " — self-study backstops"));
        var byVid = {};
        D.videos.forEach(function (v) { byVid[v.id] = v; });
        page.appendChild(V.el("div", { class: "card card--flat", "data-testid": "cov-panel" },
          V.el("ul", { class: "checklist" },
            cnotes.map(function (u, i) {
              var near = byVid[u.nearest];
              var rowId = u.section === "EXAM" ? "cov-note-EXAM-" + i : "cov-note-" + u.section;
              return V.el("li", { class: "cov-row t-small", "data-testid": rowId },
                V.icon("alert", true),
                V.chip(u.level, { variant: "warn" }),
                u.section === "EXAM" ? V.chip("EXAM", { mono: true }) :
                  V.el("a", { class: "meta-chip meta-chip--mono", href: "#/study/ch" + intCh(u.section) + "/" + u.section,
                    "data-testid": "cov-sec-" + u.section, text: u.section }),
                " ", u.note,
                near ? V.el("a", { class: "src-chip", href: near.url, target: "_blank", rel: "noopener",
                  "data-testid": "cov-near-" + u.section + (u.section === "EXAM" ? "-" + i : ""), title: "best available pick (opens YouTube)", text: "best pick: " + near.id }) : null);
            }),
            uncScoped.map(function (u) {
              return V.el("li", { class: "cov-row t-small", "data-testid": "cov-gap-" + u.section },
                V.icon("x", true),
                V.chip("no video", { variant: "warn" }),
                V.el("b", { class: "meta-chip meta-chip--mono", text: u.section }), " ", u.note);
            }))));
      }

      page.appendChild(V.el("p", { class: "t-caption", style: "color:var(--ink-3);margin-top:var(--sp-6)" },
        "Curated " + (D.compiled || "") + " — " + (D.verifiedHow || "") + ". Links open on YouTube and need internet; this page itself is fully offline. ",
        "Priority: official/accredited channels, then recognized educators, then reputed testing trainers."));
      return page;
    }
  };

  function syncToolbar() {
    document.querySelectorAll(".chip-btn").forEach(function (b) {
      var t = b.getAttribute("data-testid").replace("vid-tier-", "");
      b.classList.toggle("is-active", state.tier === t);
      b.setAttribute("aria-pressed", state.tier === t ? "true" : "false");
    });
  }
})();
