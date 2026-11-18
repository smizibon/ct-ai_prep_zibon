/* views/study.js — #/study and #/study/ch{n}[/sub] (D3 §4.2–4.3) */
(function () {
  "use strict";
  window.CTAI_VIEWS = window.CTAI_VIEWS || {};
  var V = window.UI;

  function chapterCardLink(n) { return "#/study/ch" + n; }

  function loAccordion(u, chN) {
    var prog = Store.getProgress();
    var done = prog[u.id] && prog[u.id].understood;
    var acc = V.el("article", { class: "lo-acc" + (done ? " is-done" : ""), id: "lo-" + u.id, dataset: { sub: u.id } });
    var chev = V.icon("chev-d");
    var underBtn = V.el("button", { class: "understood-btn", "aria-pressed": done ? "true" : "false", title: "Mark as understood", "data-testid": "understood-" + u.id },
      V.icon("check", true), "Understood");
    underBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      var now = !(underBtn.getAttribute("aria-pressed") === "true");
      underBtn.setAttribute("aria-pressed", now ? "true" : "false");
      Store.setUnderstood(u.id, now);
      acc.classList.toggle("is-done", now);
      Router.render();
    });
    var head = V.el("div", { class: "lo-acc__head", role: "button", tabindex: "0", "aria-expanded": "false", "data-testid": "lo-head-" + u.id },
      V.el("span", { class: "lo-acc__chev" }, chev),
      V.el("span", { class: "lo-acc__id", text: u.id }),
      V.el("span", { class: "lo-acc__title", text: u.title }),
      V.el("span", { class: "lo-acc__meta" },
        V.kchip(u.kLevel),
        V.el("span", { class: "t-caption", style: "color:var(--ink-3)", text: "~" + u.minutes + "′" }),
        u.questions.length ? V.chip(u.questions.length + " Q", { variant: "accent", mono: true }) : null,
        underBtn));
    head.addEventListener("click", function (ev) {
      if (ev.target.closest(".understood-btn")) return;
      var open = acc.classList.toggle("is-open");
      head.setAttribute("aria-expanded", open ? "true" : "false");
    });
    head.addEventListener("keydown", function (ev) {
      if (ev.key !== "Enter" && ev.key !== " ") return;
      if (ev.target.closest(".understood-btn")) return;
      ev.preventDefault();
      var open = acc.classList.toggle("is-open");
      head.setAttribute("aria-expanded", open ? "true" : "false");
    });
    var qs = u.questions.map(function (q) {
      return V.el("a", { class: "meta-chip", href: "#/exam?learn=" + q.q, title: "Practice " + q.q, "data-testid": "lo-q-" + q.q },
        q.q + " · " + q.k + " · " + q.pts + "pt" + (q.answer.startsWith("New") ? " · figure key" : ""));
    });
    var body = V.el("div", { class: "lo-acc__body" },
      V.el("div", { class: "lo-acc__inner" },
        V.el("div", { class: "lo-acc__pad" },
          V.el("div", { class: "lo-banner" },
            V.el("span", { class: "t-caption", style: "flex:none" }, (u.lo || u.ho)),
            V.el("span", { text: u.loStatement })),
          u.handsOn ? V.el("div", { class: "ho-ribbon" }, V.icon("info", true), "Hands-on unit — not directly examinable") : null,
          V.el("div", { class: "md t-prose lo-body", html: window.md(u.body) }),
          u.figures.length ? V.el("div", {}, u.figures.map(function (f) { return V.figure(f); })) : null,
          u.questions.length ? V.el("div", { class: "lo-questions" },
            V.el("div", { class: "t-caption", style: "color:var(--ink-3);margin-bottom:var(--sp-2)" }, "Related sample questions"),
            V.el("div", { class: "chiprow" }, qs)) : null,
          V.el("div", { class: "lo-src t-caption", style: "color:var(--ink-3)" },
            "Verbatim from syllabus L" + u.srcLines[0] + "–" + u.srcLines[1] + " · id " + u.id))));
    acc.appendChild(head); acc.appendChild(body);
    return acc;
  }

  window.CTAI_VIEWS.study = {
    render: function (params) {
      var page = V.el("div", { class: "page" });
      if (!params.ch) {
        /* index */
        page.appendChild(V.el("div", { class: "page-head" },
          V.el("div", { class: "section-marker t-caption", style: "color:var(--ink-3)" }, "Study"),
          V.el("h1", { class: "t-h1", text: "Study by chapter" }),
          V.el("p", { class: "t-lead" }, "The full ISTQB CT-AI v2.0 syllabus, verbatim, organized by learning objective.")));
        var total = V.overallStudy();
        page.appendChild(V.el("div", { style: "margin-bottom:var(--sp-5)" },
          V.pbar(total.frac),
          V.el("div", { class: "t-small", style: "color:var(--ink-3);margin-top:var(--sp-2)" },
            Math.round(total.frac * 100) + "% of ~19.5h studied (" + total.mins + " of " + total.minsTotal + " est. minutes)")));
        var grid = V.el("div", { class: "ch-grid" });
        for (var n = 1; n <= 7; n++) {
          var cp = V.chapterProgress(n);
          var ch = window.CTAI_DATA.chapters[n];
          var nq = ch.sections.reduce(function (a, s) { return a + s.subsections.reduce(function (b, u) { return b + u.questions.length; }, 0); }, 0);
          grid.appendChild(V.el("a", { class: "card card--interactive ch-card", href: chapterCardLink(n), "data-testid": "study-ch" + n },
            V.el("div", { class: "ch-card__top" },
              V.ring({ size: "sm", frac: cp.frac, variant: cp.frac >= 1 ? "success" : "", label: "chapter " + n + " progress" }),
              V.el("div", {},
                V.el("span", { class: "t-caption", style: "color:var(--ink-3)", text: "Ch " + n }),
                V.el("div", { class: "t-h3 ch-card__title", text: ch.title }))),
            V.el("div", { class: "ch-card__meta" },
              V.el("span", {}, "⏱ " + ch.minutes + " min"), V.el("span", {}, cp.total + " examinable LOs"), V.el("span", {}, nq + " questions")),
            V.el("div", { class: "ch-card__bar" }, V.pbar(cp.frac)),
            V.el("div", { class: "ch-card__meta", style: "margin-top:var(--sp-2)" },
              V.el("a", { href: "#/cheatsheets/ch" + n, class: "t-small", "data-testid": "study-ch" + n + "-sheet", onclick: function (e) { e.stopPropagation(); } }, "Cheatsheet →"))));
        }
        page.appendChild(grid);
        return page;
      }

      /* chapter page */
      var n = params.ch, ch = window.CTAI_DATA.chapters[n];
      if (!ch) return V.el("div", { class: "page" }, V.emptyState("No such chapter", "Chapters 1–7 exist.", V.el("a", { class: "btn btn--primary btn--sm", href: "#/study", "data-testid": "study-back" }, "Back to Study")));
      var cp = V.chapterProgress(n);
      var layout = V.el("div", { class: "study-layout" });

      /* TOC */
      var toc = V.el("nav", { class: "study-toc", "aria-label": "Chapter contents" });
      var prevSec = null;
      ch.sections.forEach(function (sec) {
        toc.appendChild(V.el("div", { class: "study-toc__sec", text: sec.id + " " + sec.title }));
        sec.subsections.forEach(function (u) {
          var p = Store.getProgress();
          var done = p[u.id] && p[u.id].understood;
          /* route-format href, NOT "#lo-…": a bare anchor hash would be parsed as a
             route by the router and land on the 404 view instead of scrolling */
          toc.appendChild(V.el("a", { class: "study-toc__lo", href: "#/study/ch" + n + "/" + u.id, dataset: { sub: u.id }, "data-testid": "study-toc-" + u.id },
            done ? V.icon("check", true) : null, u.id));
        });
      });
      layout.appendChild(toc);

      var main = V.el("div", {});
      main.appendChild(V.el("div", { class: "reading-progress" }, V.el("div", { class: "reading-progress__fill", id: "readFill" })));
      main.appendChild(V.el("div", { class: "page-head", style: "margin-bottom:var(--sp-6)" },
        V.el("div", { class: "section-marker t-caption", style: "color:var(--ink-3)" }, "Chapter " + n),
        V.el("h1", { class: "t-h1", text: ch.title }),
        V.el("div", { class: "chiprow", style: "margin-top:var(--sp-2)" },
          V.chip("⏱ " + ch.minutes + " min"),
          V.chip(cp.done + "/" + cp.total + " LOs understood", { variant: cp.frac >= 1 ? "success" : "" }),
          V.chip("~" + cp.mins + "/" + cp.minsTotal + " min studied", { mono: true }),
          V.el("a", { class: "meta-chip meta-chip--accent", href: "#/cheatsheets/ch" + n, style: "text-decoration:none", "data-testid": "study-ch" + n + "-sheet" }, "Cheatsheet →"))));
      /* keywords */
      main.appendChild(V.el("div", { class: "chiprow", style: "margin-bottom:var(--sp-5)" },
        ch.keywords.general.length ? V.el("span", { class: "t-caption", style: "color:var(--ink-3)" }, "Keywords:") : null,
        ch.keywords.general.map(function (k) { return V.chip(k); }),
        ch.keywords.aiSpecific.length ? V.el("span", { class: "t-caption", style: "color:var(--ink-3);margin-left:var(--sp-2)" }, "AI-specific:") : null,
        ch.keywords.aiSpecific.map(function (k) { return V.chip(k, { variant: "accent" }); })));

      ch.sections.forEach(function (sec) {
        main.appendChild(V.el("section", { id: "sec-" + sec.id.replace(/\./g, "-") },
          V.el("h2", { class: "t-h2", style: "margin:var(--sp-8) 0 var(--sp-2)" }, sec.id + " " + sec.title),
          sec.intro.map(function (p) { return V.el("p", { class: "t-prose md", html: window.md(p) }); }),
          sec.subsections.map(function (u) { return loAccordion(u, n); })));
      });

      main.appendChild(V.el("div", { class: "chiprow", style: "margin-top:var(--sp-8);justify-content:space-between" },
        n > 1 ? V.el("a", { class: "btn btn--ghost btn--sm", href: chapterCardLink(n - 1), "data-testid": "study-prev-ch" }, V.icon("arrow-l", true), "Ch " + (n - 1)) : V.el("span"),
        n < 7 ? V.el("a", { class: "btn btn--ghost btn--sm", href: chapterCardLink(n + 1), "data-testid": "study-next-ch" }, "Ch " + (n + 1), V.icon("arrow-r", true)) : V.el("span")));
      layout.appendChild(main);
      page.appendChild(layout);

      /* scrollspy + reading progress + deep link */
      requestAnimationFrame(function () {
        if (params.sub) {
          var target = document.querySelector('.lo-acc[data-sub="' + params.sub + '"]');
          if (target) {
            target.classList.add("is-open");
            target.querySelector(".lo-acc__head").setAttribute("aria-expanded", "true");
            setTimeout(function () { target.scrollIntoView({ behavior: "smooth", block: "start" }); }, 60);
          }
        }
        var spy = new IntersectionObserver(function (entries) {
          entries.forEach(function (en) {
            if (en.isIntersecting) {
              document.querySelectorAll(".study-toc__lo").forEach(function (a) {
                a.classList.toggle("is-active", a.dataset.sub === en.target.dataset.sub);
              });
            }
          });
        }, { rootMargin: "-30% 0px -60% 0px" });
        document.querySelectorAll(".lo-acc").forEach(function (a) { spy.observe(a); });
        var fill = document.getElementById("readFill");
        var onScroll = function () {
          if (!document.body.contains(fill)) { window.removeEventListener("scroll", onScroll); return; }
          var rect = fill.parentElement.getBoundingClientRect();
          var total = document.documentElement.scrollHeight - window.innerHeight;
          fill.style.width = Math.min(100, Math.max(0, (window.scrollY / total) * 100)) + "%";
        };
        window.addEventListener("scroll", onScroll, { passive: true });
      });
      return page;
    }
  };
})();
