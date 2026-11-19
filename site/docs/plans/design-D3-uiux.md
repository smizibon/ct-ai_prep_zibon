# D3 — UI/UX Design System & Page Architecture ("CT-AI Studio")

Build spec for the presentation layer of the CT-AI v2.0 study site.
Consumes: D1 data contracts (`window.CTAI_DATA.chapters[n]`, `.glossary`, `.coverage`) and D2 exam
contracts (`window.CTAI_QUESTIONS`, localStorage `ctai.session.v1 / attempts.v1 / qstats.v1 / settings.v1`,
modes `sim | practice | appendix | quick`, scoring 29/44 pass for the 40-question simulation).
Hard constraints honored: single-page app, hash routing, vanilla HTML/CSS/JS, zero external
requests (works from `file://`), inline SVG icons, system fonts, desktop-first + mobile-usable.

---

## Table of contents

1. Design language (brand, color tokens + contrast math, type, space, radius, shadow, motion, icons)
2. Layout architecture (app shell, grids, breakpoints, sticky elements, exam shell, mobile)
3. Component inventory (25 components, all states, exact values)
4. Page-by-page UX (ASCII wireframes + interaction notes, incl. the exam runner)
5. Navigation & routing plan (route map, guards, browser-back mid-exam)
6. Micro-interactions & delight (transitions, feedback, confetti policy, keyboard map)
7. Accessibility (WCAG 2.1 AA checklist, contrast table, ARIA for exam widgets)
8. CSS architecture (file split, naming, theming, print)
9. Handoff checklist + decision log

---

## 1. Design language

### 1.1 Brand concept — "Neural Precision"

The product lives at the intersection of two ideas: **neural graphs** (nodes and edges — AI systems)
and **verification precision** (the tester's check, the hairline grid, the exact number). The visual
language expresses both, and deliberately switches register between the product's two modes of use:

- **Study register** — calm, paper-like, bookish. Generous whitespace, 72ch measure, serif-free but
  soft surfaces. The content is the hero.
- **Exam register** — a focused cockpit. Chrome compresses, metrics become monospace instrument
  readouts, the only saturated color is the countdown when it starts warning.

Brand name shown in UI: **CT-AI Studio**, caption `ISTQB Certified Tester — AI Testing v2.0`.

Logo mark (inline SVG, exact): 28×28 rounded square (`rx="7"`, fill `var(--primary)`), inside a white
node-check — three 2.25px-radius circles at (7,18), (13,10), (21,15) joined by 2px white lines
(7,18)→(13,10)→(21,15), the second segment reading as a checkmark stroke. Favicon: same SVG as a
data-URI, no external file.

Signature motif — **"tensor grid + node tick"**: a 24×24 dot grid used at low opacity on the
dashboard hero, empty states, and the sidebar footer
(`radial-gradient(circle at 1px 1px, var(--grid-dot) 1px, transparent 0)` / `background-size: 24px 24px`);
and the **section marker** — a 20×3px primary bar with a 6px primary dot 4px to its right — used
above every page H1 and card group label. Two elements, reused everywhere; nothing else decorative.

### 1.2 Color system

All colors are CSS custom properties on `:root` (light default) and `html[data-theme="dark"]`.
Every text-bearing pair listed in §7 passes WCAG AA (≥ 4.5:1) — math shown there.

#### Light theme (default)

```css
:root {
  color-scheme: light;

  /* surfaces — 4 neutral steps, cool paper */
  --bg-0: #F6F7FB;            /* app canvas */
  --bg-1: #FFFFFF;            /* cards, panels, sidebar */
  --bg-2: #F1F3F9;            /* hover fills, sunken headers, code wells' parent */
  --bg-3: #E9ECF4;            /* inset wells: mono formulas, table headers, progress tracks */
  --bg-inverse: #0F172A;      /* tooltips, scrim-adjacent surfaces */

  /* text */
  --ink-1: #1E293B;           /* body & headings — 14.62:1 on bg-1 */
  --ink-2: #475569;           /* secondary text — 7.58:1 on bg-1 */
  --ink-3: #5D6B84;           /* captions, meta — 5.03:1 on bg-0, 5.38:1 on bg-1 */
  --ink-inverse: #FFFFFF;

  /* hairlines & borders — decorative (non-text) */
  --line-1: #E5E8F0;          /* card hairline */
  --line-2: #D3D8E4;          /* dividers, input borders */
  --line-3: #B9C0D2;          /* strong borders, table rules */

  /* primary — "verification indigo" */
  --primary: #4F46E5;         /* 6.29:1 on bg-1 as text; white text on it 6.29:1 */
  --primary-strong: #4338CA;  /* pressed states, active nav text on soft bg */
  --primary-soft: #EEF2FF;    /* selected option fill, active nav fill */
  --primary-soft-ink: #3730A3;/* text on primary-soft — 8.88:1 */
  --ink-on-primary: #FFFFFF;

  /* accent — "signal cyan" (secondary data, links to intel, chart secondary) */
  --accent: #0E7490;          /* 5.36:1 on bg-1 */
  --accent-soft: #E0F5F9;

  /* semantic */
  --success: #15803D;         /* 5.02:1 on bg-1 */
  --success-soft: #EAF7EF;    /* success text on it: 4.55:1 — use ≥600 weight */
  --danger: #B91C1C;          /* 6.47:1 on bg-1 */
  --danger-soft: #FDECEC;     /* danger text on it: 5.66:1 */
  --warn: #B45309;            /* 5.02:1 on bg-1 */
  --warn-soft: #FCF3E3;       /* warn text on it: 4.56:1 — use ≥600 weight */

  /* focus & effects */
  --focus-ring: #4F46E5;
  --grid-dot: rgba(211, 216, 228, 0.55);
  --scrim: rgba(15, 23, 42, 0.50);

  /* charts (categorical, decorative; labels always use --ink-*) */
  --chart-1: #6366F1; --chart-2: #0891B2; --chart-3: #059669;
  --chart-4: #D97706; --chart-5: #E11D48; --chart-6: #7C3AED; --chart-7: #64748B;
}
```

#### Dark theme

```css
html[data-theme="dark"] {
  color-scheme: dark;

  --bg-0: #0B1220;            /* app canvas */
  --bg-1: #111A2E;            /* cards, sidebar */
  --bg-2: #1A2540;            /* hovers, sunken headers */
  --bg-3: #223052;            /* wells, tracks */
  --bg-inverse: #F6F7FB;

  --ink-1: #E6EAF2;           /* 14.38:1 on bg-1 */
  --ink-2: #A9B4C7;           /* 8.29:1 on bg-1 */
  --ink-3: #7E8BA5;           /* 5.06:1 on bg-1 */
  --ink-inverse: #0B1220;

  --line-1: #243050;
  --line-2: #33415F;
  --line-3: #46557A;

  --primary: #818CF8;         /* 5.81:1 on bg-1, 6.28:1 on bg-0 */
  --primary-strong: #A5B4FC;
  --primary-soft: rgba(129, 140, 248, 0.14);   /* ≈ solid #212B4B over bg-1 */
  --primary-soft-ink: #C7D2FE; /* 9.40:1 on primary-soft composite */
  --ink-on-primary: #0B1220;  /* 7.17:1 on --primary fill */

  --accent: #22D3EE;          /* 10.36:1 on bg-0 */
  --accent-soft: rgba(34, 211, 238, 0.12);

  --success: #4ADE80;         /* 9.95:1 on bg-1 */
  --success-soft: rgba(74, 222, 128, 0.12);    /* ≈ #183238; success ink on it 7.85:1 */
  --danger: #F87171;          /* 6.27:1 on bg-1 */
  --danger-soft: rgba(248, 113, 113, 0.12);    /* ≈ #2B2337; danger ink on it 5.43:1 */
  --warn: #FBBF24;            /* 10.39:1 on bg-1 */
  --warn-soft: rgba(251, 191, 36, 0.12);       /* ≈ #2D2B2D; warn ink on it 8.41:1 */

  --focus-ring: #818CF8;
  --grid-dot: rgba(36, 48, 80, 0.90);
  --scrim: rgba(3, 7, 18, 0.62);

  --chart-1: #818CF8; --chart-2: #22D3EE; --chart-3: #34D399;
  --chart-4: #FBBF24; --chart-5: #FB7185; --chart-6: #A78BFA; --chart-7: #94A3B8;
}
```

Rules of use:
- Never place `--primary` text on `--primary-soft`; use `--primary-soft-ink` / `--primary-strong`.
- `--ink-3` never below 0.75rem and never on translucent fills other than the listed soft tokens.
- Verdict colors always travel with an icon + word ("Correct", "Incorrect") — color is never the
  only carrier (§7).
- Body text on soft semantic fills: minimum 600 weight at small sizes (ratios above are ≥ 4.5:1
  but close to the line in light mode; weight compensates for glyph thinness).

### 1.3 Typography

System font stack (final, nothing loaded):

```css
:root {
  --font-sans: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI",
               Roboto, "Helvetica Neue", Arial, sans-serif;
  --font-mono: ui-monospace, "SF Mono", "Cascadia Code", "Segoe UI Mono",
               Menlo, Consolas, "Liberation Mono", monospace;
}
```

On macOS Chrome/Safari this resolves to SF Pro / SF Mono — the native, offline-safe choice.
All numerals that tick (timer, counters, points, line refs) get
`font-family: var(--font-mono); font-variant-numeric: tabular-nums;`.

Type scale (exact; classes `.t-display` … `.t-caption` in `base.css`):

| Token | Size / line-height | Weight | Tracking | Usage |
|---|---|---|---|---|
| `--t-display` | `clamp(2.25rem, 1.4rem + 2.4vw, 2.75rem)` / 1.12 | 700 | −0.02em | Dashboard greeting, results verdict |
| `--t-h1` | 2rem / 1.2 | 700 | −0.015em | Page titles |
| `--t-h2` | 1.5rem / 1.3 | 600 | −0.01em | Section titles |
| `--t-h3` | 1.1875rem / 1.45 | 600 | 0 | Card titles, LO titles |
| `--t-h4` | 1rem / 1.5 | 600 | 0 | Sub-blocks, accordion labels |
| `--t-lead` | 1.125rem / 1.7 | 400 | 0 | Page intros (1 paragraph max) |
| `--t-body` | 1rem / 1.65 | 400 | 0 | UI body |
| `--t-prose` | 1.0625rem / 1.75 | 400 | 0.001em | **Syllabus prose** (D1 verbatim bodies) |
| `--t-small` | 0.875rem / 1.55 | 400 | 0 | Secondary text, table cells |
| `--t-caption` | 0.75rem / 1.4 | 600 | 0.06em, uppercase | Labels, chips, overlines |
| `--t-num` | 0.8125rem / 1.4 | 500 | 0 | Timer, metrics (mono + tabular) |

Prose rhythm (study pages): `p + p` margin-top `--sp-4`; `h2` margin `--sp-10` 0 `--sp-4`;
`h3` margin `--sp-8` 0 `--sp-3`; lists padding-left `--sp-6`, item gap `--sp-2`;
lone-`<em>` paragraphs (D1 figure captions) render as `--t-small --ink-2 italic` with 24px left rule.

### 1.4 Spacing, radius, z-index

```css
:root {
  /* 4px-base scale */
  --sp-0: 0; --sp-1: .25rem; --sp-2: .5rem;  --sp-3: .75rem; --sp-4: 1rem;
  --sp-5: 1.25rem; --sp-6: 1.5rem; --sp-8: 2rem; --sp-10: 2.5rem; --sp-12: 3rem;
  --sp-16: 4rem; --sp-20: 5rem; --sp-24: 6rem;

  --r-xs: 4px; --r-sm: 6px; --r-md: 8px; --r-lg: 12px;
  --r-xl: 16px; --r-2xl: 24px; --r-full: 999px;

  --z-raised: 10; --z-sticky: 100; --z-drawer: 300;
  --z-modal: 400; --z-toast: 500; --z-tooltip: 600;
}
```

Card padding standard: `--sp-5` mobile, `--sp-6` ≥ 768px. Component gaps: `--sp-4` inside cards,
`--sp-6` between cards. Page gutter: `clamp(--sp-4, 4vw, --sp-12)`.

### 1.5 Shadows / elevation

Four levels; dark theme uses pure-black shadows (indigo-tinted shadows go muddy on dark).

```css
:root {
  --shadow-1: 0 1px 2px rgba(21,27,39,.05), 0 1px 3px rgba(21,27,39,.07);   /* resting cards */
  --shadow-2: 0 2px 6px rgba(21,27,39,.06), 0 4px 12px rgba(21,27,39,.07);  /* hover, sticky bar */
  --shadow-3: 0 8px 20px rgba(21,27,39,.09), 0 16px 40px rgba(21,27,39,.11);/* dropdown, drawer */
  --shadow-4: 0 16px 40px rgba(21,27,39,.16), 0 32px 80px rgba(21,27,39,.20);/* modal */
}
html[data-theme="dark"] {
  --shadow-1: 0 1px 2px rgba(0,0,0,.40);
  --shadow-2: 0 2px 6px rgba(0,0,0,.45), 0 4px 12px rgba(0,0,0,.35);
  --shadow-3: 0 8px 20px rgba(0,0,0,.50), 0 16px 40px rgba(0,0,0,.45);
  --shadow-4: 0 16px 40px rgba(0,0,0,.60), 0 32px 80px rgba(0,0,0,.55);
}
```

Elevation mapping: page bg `--bg-0` (z-0) → cards `--bg-1` + shadow-1 → sticky bars `--bg-1` +
shadow-2 + 1px `--line-1` bottom border → drawers/dropdowns shadow-3 → modals shadow-4 + `--scrim`
backdrop with `backdrop-filter: blur(4px)` (progressive enhancement; omit if unsupported).

### 1.6 Motion

```css
:root {
  --dur-1: 120ms;   /* hovers, focus, chips */
  --dur-2: 200ms;   /* accordions, tabs, toasts */
  --dur-3: 280ms;   /* drawers, panels, route transitions */
  --dur-4: 480ms;   /* score ring, banner reveals */
  --ease-out: cubic-bezier(.16, 1, .3, 1);
  --ease-in-out: cubic-bezier(.65, 0, .35, 1);
  --ease-spring: cubic-bezier(.34, 1.56, .64, 1);  /* feedback pop only, never travel */
}
@media (prefers-reduced-motion: reduce) {
  :root { --dur-1: 1ms; --dur-2: 1ms; --dur-3: 1ms; --dur-4: 1ms; --ease-spring: linear; }
}
```

Principles: nothing moves more than 16px (except drawer/palette sheets); nothing animates longer
than 280ms except the two earned moments (score ring 480ms, first-pass confetti 1400ms); motion
never blocks input (all animations run on `opacity`/`transform` only). Global kill switch above
plus a per-feature check: confetti and shake are additionally gated on
`matchMedia('(prefers-reduced-motion: reduce)')` in JS and on `ctai.settings.v1.reduceMotion !== "off"`.

### 1.7 Iconography

One inline SVG sprite (`<svg hidden><symbol id="i-…">…</symbol>…</svg>`) at the top of `<body>` in
`index.html`. Usage: `<svg class="icon" aria-hidden="true"><use href="#i-home"/></svg>`.
All symbols: 24×24 viewBox, `fill="none" stroke="currentColor" stroke-width="1.75"
stroke-linecap="round" stroke-linejoin="round"`. Rendered size 20px (`.icon`), 16px in chips
(`.icon--sm`). Stroke width stays 1.75 — scales cleanly at both sizes.

Inventory (46 symbols): `home, book, book-open, layers, grid, timer, stopwatch, compass, search,
sun, moon, flag, check, x, chevron-up/down/left/right, arrow-left/right, menu, close, keyboard,
info, alert-triangle, star, printer, refresh, play, pause, filter, external, dot, node-check
(logo), chart-bar, chart-pie, target, lightbulb, list-ordered, link, zoom-in, calendar, user,
quote, award, edit, trash, eye, download`.

---

## 2. Layout architecture

### 2.1 Breakpoints

| Name | Range | Behavior |
|---|---|---|
| phone | ≤ 639px | drawer nav, single column, exam palette = bottom sheet |
| tablet | 640–1023px | drawer nav, 2-col grids, exam palette = bottom sheet |
| desktop | ≥ 1024px | persistent sidebar 264px, exam palette = right rail 240px |
| wide | ≥ 1440px | same shell; content gutters grow to `--sp-12` |

### 2.2 App shell (all routes except active exam)

```
┌──────────────┬───────────────────────────────────────────────────────────────┐
│ ◆ CT-AI      │  breadcrumb · page actions            (sticky 48px, z-sticky) │
│   Studio     │ ┌───────────────────────────────────────────────────────────┐ │
│ ──────────── │ │                                                           │ │
│ ⌂ Dashboard  │ │                                                           │ │
│ ▤ Study      │ │                    CONTENT                                │ │
│ ≡ Cheatsheets│ │        .page  max-width 1120px                             │ │
│ ◈ Glossary   │ │        center-aligned within available width               │ │
│ ──────────── │ │                                                           │ │
│ ⏱ Mock Exam  │ │   prose blocks inside content: .measure = 72ch max        │ │
│ ★ Results    │ │                                                           │ │
│ ◇ Exam Intel │ │                                                           │ │
│ ──────────── │ │                                                           │ │
│ ◔ 62% ready  │ └───────────────────────────────────────────────────────────┘ │
│ ──────────── │                                                                 │
│ [☀][⌨][↻]    │                                                                 │
└──────────────┴───────────────────────────────────────────────────────────────┘
  264px fixed           flex:1, min-width:0, --bg-0, overflow-y:auto
```

- Sidebar (`<aside>`): `--bg-1`, right border `--line-1`, sticky full height. Logo block 72px;
  nav groups with `--t-caption --ink-3` group labels; nav item height 40px, radius `--r-md`;
  readiness mini-ring (40px) + "62% ready" caption above the footer controls
  (theme toggle, `?` shortcuts, "Reset progress" behind a confirm modal).
- Content sticky bar (48px): breadcrumb (`Study / Ch 3 / 3.3`), right-aligned contextual actions
  (e.g. Print on cheatsheets). Transparent `--bg-0`/95% blur, bottom hairline appears on scroll.
- Reading measure: syllabus prose, rationales, question stems sit in `.measure { max-width: 72ch }`
  (≈ 660–700px at `--t-prose`) centered in the content column. Wider blocks (chapter card grids,
  results charts) use the full 1120px.

### 2.3 Why drawer, not bottom tab bar (mobile)

Chosen: **hamburger → slide-over drawer** (left, 304px, shadow-3, `--bg-1`, scrim, 280ms
`--ease-out`; main content gets `inert` while open).
Rejected: bottom tab bar. Reasons: (1) this is a reading product — vertical space is the scarcest
resource and a 56px bar plus safe-area insets eats ~12% of a phone viewport; (2) 8 destinations
exceeds the 5-item thumb-zone limit; (3) the exam runner already owns the bottom edge (palette
sheet), and two competing bottom surfaces is a classic mobile failure. The drawer also carries the
readiness ring and grouped nav, which a tab bar cannot.

Mobile top bar (sticky 56px, `--bg-1`, hairline): `[☰] ◆ CT-AI Studio … [⌕] [☀/☾]`.

### 2.4 Exam shell (route `#/exam/run/*`)

Sidebar and page chrome are removed entirely — the runner is the whole viewport:

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ ⏱ 43:12   ▓▓▓▓▓▓▓░░░░░   17/40 answered          [⚑ Flag] [Submit exam]      │ 56px sticky
├───────────────────────────────────────────────────────────────┬──────────────┤
│                                                               │  PALETTE     │
│                    question card, 56rem max                   │  (see §4.6)  │
│                    centered, scrolls under bar                │              │
│                                                               │  right rail  │
│  [← Previous]                              [Next →]           │  240px,      │
│  (sticky bottom row on phone, above safe-area)                │  ≥1024px only │
└───────────────────────────────────────────────────────────────┴──────────────┘
```

Sticky timer bar is never scrolled away — it is the single most information-dense element in the
product: countdown (mono `--t-num` scaled to 1rem), thin 3px progress strip underneath mapping
answered/40, answered count, flag toggle, submit. Below 1024px the palette collapses into the bar
as a `[☰ 17/40]` button opening a bottom sheet (§4.6).

### 2.5 Long-content reading architecture (study pages)

Two-pane inside the content column at ≥ 1024px: sticky left mini-TOC (200px, own scroll,
scrollspy-active highlight) + prose column (`.measure`). Below 1024px the TOC becomes a collapsed
`On this page ▾` disclosure pinned under the sticky breadcrumb bar. A 3px reading-progress bar
(primary fill on `--bg-3` track) is pinned to the top of the content pane, driven by scroll
position within the chapter, rAF-throttled.

---

## 3. Component inventory

Conventions: state classes are JS-owned and orthogonal to BEM (`.is-selected`, `.is-flagged`,
`.is-current`, `.is-open`, `.is-disabled`). Focus ring everywhere:
`outline: 2px solid var(--focus-ring); outline-offset: 2px;` on `:focus-visible` only.
Minimum hit target 44×44px (visual size may be smaller; padding extends the hit area).

### 3.1 Nav item (`.nav-item`)

Anatomy: 20px icon + label (`--t-small`, 500) + optional right meta (count / mini progress).
Height 40px, padding-inline `--sp-3`, radius `--r-md`.
States — default: transparent, `--ink-2`; hover: `--bg-2`, `--ink-1`; active (`aria-current="page"`):
`--primary-soft` fill, `--primary-soft-ink` text + icon, 2px `--primary` inset bar on the left
radius-clipped; focus-visible: ring. Sub-item (LO-level in drawer): indent `--sp-6`, 36px, `--t-small`.

### 3.2 Card (`.card`)

`--bg-1`, radius `--r-xl`, border 1px `--line-1`, shadow-1, padding `--sp-5`→`--sp-6` ≥ 768px.
Variants: `--flat` (border only, no shadow — inside other cards), `--interactive` (hover:
translateY(−1px), shadow-2, border `--line-2`, 150ms `--ease-out`; cursor pointer; whole card is
the `<a>`), `--accent-left` (4px left bar `--primary`, used on mode cards).

### 3.3 Progress bar (`.pbar`)

Height 8px, radius full, track `--bg-3`, fill `--primary`, width transition 400ms `--ease-out`.
`role="progressbar"` `aria-valuemin/max/now` + visually-hidden label. Variant `--thin` (3px,
reading progress, no aria — decorative duplicate of numeric info).

### 3.4 Progress ring (`.ring`)

SVG, stroke-linecap round. Sizes/params: **mini 40px** (stroke 4, sidebar), **std 96px** (stroke 8,
dashboard cards), **hero 168px** (stroke 12, dashboard + results). Track `--bg-3`, value
`--primary` (study) or `--success`/`--danger` (pass/fail contexts). Center: number `--t-num` scaled
(std: 1.25rem/700; hero: 2.5rem/700, mono) + caption `--t-caption --ink-3`. Animate
`stroke-dashoffset` 480ms `--ease-out` on mount/change; count-up number in sync via rAF.
Hero variant (results) draws a threshold tick: 2px `--ink-1` radial line at
`threshold / maxPoints` fraction (D2: 29/44 = 65.9%).

### 3.5 Chapter card (`.ch-card`, dashboard + study index)

Anatomy: ring (std, % LOs understood) · "Ch 3" overline (`--t-caption --ink-3`) · title `--t-h3`
· meta row: `⏱ 375 min · 12 LOs · 9 questions` (`--t-small --ink-3`) · keyword chips (max 3 +
"+4") · thin pbar. Interactive card → `#/study/ch3`. States: `--locked` never used (all open);
complete (ring turns `--success`, check swaps into center at 100%).

### 3.6 LO accordion (`.lo-acc`) — the study workhorse

Anatomy per D1 subsection (progress unit): header button — drag-free handle chevron · LO id chip
(`3.3.1`, mono `--t-num`, `--bg-2`) · title `--t-h4` · K-chip (§3.11) · `~40 min (est.)` meta ·
**"✓ Understood" toggle** (right, 24px checkbox-button, persists to `ctai.progress.v1`; fills the
LO row's id chip `--success-soft`/`--success`) · related-questions count badge.
Body (expanded): LO statement banner (`--primary-soft` panel, `--primary-soft-ink` text, left 3px
`--primary` bar — the verbatim `loStatement`), then verbatim prose (`--t-prose`, `.measure`),
figures (§3.19), hands-on ribbon for `ho` units (`--accent-soft`, "Hands-on — not directly
examinable" caption per D1), "Related sample questions" chips (`Q10 · K2 · 1pt` → opens that
question in learning-mode review), and source footer chip `Syllabus L565–636` (`--t-num --ink-3`)
with tooltip "Verbatim slice · view source range".
States: collapsed (chevron-down, 200ms rotate on toggle; height animated via
`grid-template-rows: 0fr → 1fr`, 200ms `--ease-out`); expanded; understood (id chip green);
active-TOC (left 2px `--primary` bar when scrollspy targets it). `aria-expanded` on header,
`role="region"` on body.

### 3.7 Question card (`.q-card`)

Header row: `Question 17 of 40` (`--t-h4`) + meta chips — **sim mode: no K-level, no points, no LO
(D2: hidden, mirrors real exam); learning/appendix/review: `LO AI-3.3.1 · K3 · 2 pts · Ch 3` chips
visible before answering**. Verbatim select-instruction (`*Select TWO answers.*`) rendered as a
`--accent-soft` chip line when present. Stem: `stem_html` in `.measure`, `--t-prose`; item sets
(display-only lists) as indented `--t-small` blocks with left 2px `--line-3` rule; figures per
§3.19. Footer: Prev/Next + flag (runner) or verdict actions (learning/review).
`role="group"` `aria-labelledby` the header id.

### 3.8 Option row (`.opt`) — radio & checkbox

```
┌──────────────────────────────────────────────────────────────┐
│ (a)  Metamorphic testing …                        [key hint] │  44px min-height
└──────────────────────────────────────────────────────────────┘
```

Anatomy: control (20px radio circle / checkbox square, 2px stroke `--ink-2` — passes 3:1 non-text
on `--bg-1`), letter chip (24px, mono, `--bg-2`, shows the keyboard hint `a`), option text
(`--t-body`, verbatim `text_html`, multi-line preserved), trailing verdict icon slot.
Base: `--bg-1`, border 1px `--line-2`, radius `--r-md`, padding `--sp-3 --sp-4`, margin-bottom
`--sp-3`, full width, cursor pointer.

| State | Class | Visual |
|---|---|---|
| default | — | as base |
| hover | `:hover` (pointer only) | `--bg-2`, border `--line-3` |
| focus-visible | — | ring, offset 2px |
| selected | `.is-selected` | border 2px `--primary` (compensated −1px padding), `--primary-soft` fill, control fills `--primary`, letter chip `--primary` + white/dark ink |
| correct (revealed) | `.is-correct` | border `--success`, `--success-soft` fill, trailing check icon `--success`, control fills `--success` |
| incorrect (revealed) | `.is-incorrect` | border `--danger`, `--danger-soft` fill, trailing x icon, control fills `--danger` |
| correct-not-chosen | `.is-correct.is-missed` | dashed `--success` border, `--success-soft` fill at 60%, check icon — "the one you missed" |
| disabled | `.is-disabled` | opacity .92, `pointer-events:none`, cursor default |

Multi-select (`type: multi_two`): square control, `role="checkbox"`; **max-2 enforcement** — a third
click checks nothing, the row shakes once (240ms), and a `--warn-soft` notice appears below the
options: "This question requires exactly TWO answers. Deselect one to choose another." + polite
`aria-live` announcement (verbatim from D2 §2.2). Selection counter chip in card header:
`2 of exactly 2` (turns `--success` when satisfied, `--warn` at 1).
State never relies on color alone: selected/correct/incorrect always change the control glyph and
add a trailing icon + visually-hidden status word.

### 3.9 Question palette (`.palette`) + chip (`.pal-chip`)

Rail (desktop) / bottom sheet (mobile, 60vh, drag-handle, slides 280ms). Header: `Jump to #`
numeric buffer input (mono). Body: chip grid — desktop rail 4 columns; sheet 8 columns. Chip:
40×36px, radius `--r-sm`, mono `--t-num`.

| State | Class | Visual |
|---|---|---|
| unanswered | — | `--bg-2`, border `--line-2`, `--ink-2` |
| answered | `.is-answered` | fill `--primary`, ink `--ink-on-primary` |
| incomplete (multi ≠ 2 selected) | `.is-incomplete` | fill `--warn-soft`, border+ink `--warn`, small "2" subscript dot |
| flagged | `.is-flagged` | top-right 6px `--warn` dot (composes with answered/incomplete) |
| current | `.is-current` | 2px `--focus-ring` outline, offset 2px, `aria-current="true"` |
| correct/incorrect (learning, post-check) | `.is-correct/.is-incorrect` | fill `--success`/`--danger` soft, border solid, icon too small — instead letter turns `--success`/`--danger` bold |

Each chip: `<button aria-label="Question 17, answered, flagged">`. Legend row under the grid
(icons + words). Keyboard: `Tab` into grid, arrows move, `Enter` jumps; number keys anywhere in the
runner feed the jump buffer ("1" "7" `Enter` → Q17).

### 3.10 Timer display (`.timer`)

Mono, tabular, `--t-num` at 1rem in the bar. Countdown (sim): from 60:00 (or 75:00 accommodation,
chosen at session creation per D2). States: normal `--ink-2` on `--bg-1`; **warning < 10:00** —
`--warn` text + 6px pulsing dot (opacity 1↔0.35, 1.5s infinite) + bar strip turns `--warn`;
**critical < 2:00** — `--danger` text, dot pulse 0.75s, bar strip `--danger`, timer text gains a
subtle `--danger-soft` pill background. Announcements at 10:00, 2:00, 0:30 via visually-hidden
polite live region ("Ten minutes remaining."). Count-up (practice, optional): `--ink-3`, no pulse,
prefixed `Elapsed`. `role="timer"`.

### 3.11 Badges & chips

- **K-chip** (`.k-chip`): pill, mono `--t-caption`. K1 `--bg-2/--ink-2`; K2 `--accent-soft/--accent`;
  K3 `--primary-soft/--primary-soft-ink`; K4 `--primary` fill/`--ink-on-primary`; H1/H2 (hands-on,
  D1) `--accent-soft` with wrench glyph. Tooltip: "K3 = Analysis — you must apply this, not just
  recall it."
- **Points chip**: `2 pts` mono, `--bg-2`.
- **LO chip**: `AI-3.3.1` mono, links to `#/study/ch3/3.3.1`, `--primary-soft` on hover.
- **Meta chip** (generic): `--bg-2`, `--ink-2`, `--r-full`, `--t-caption`, height 24px.

### 3.12 Tab (`.tabs`)

Underline tabs: label `--t-small` 600; active: `--ink-1` + 2px `--primary` underline
 animated 200ms; inactive `--ink-3`, hover `--ink-1`. `role="tablist"`, arrow-key roving,
 `aria-selected`, panels `role="tabpanel"` + labelled. Used: results/review filters, glossary
 (Terms / Abbreviations), intel (Advice / Patterns).

### 3.13 Tooltip (`.tip`)

Hover/focus, 400ms show delay, 100ms hide, 160ms fade. Bubble: `--bg-inverse` bg, `--ink-inverse`
text, `--t-small`, radius `--r-md`, padding `--sp-2 --sp-3`, max-width 280px, shadow-3, 6px arrow.
Trigger `aria-describedby`; Esc dismisses; never the only carrier of critical info.

### 3.14 Toast (`.toast`)

Bottom-right stack (mobile: bottom-center above safe-area), max 3, `--bg-1`, border `--line-2`,
shadow-3, radius `--r-lg`, icon + `--t-small` text + optional action link; 4px `--primary`
lifetime bar (4s linear width); slide+fade in 200ms `--ease-out`. `role="status"` (assertive
variant `role="alert"` reserved for exam integrity errors, e.g. multi-tab sim block).

### 3.15 Modal (`.modal`)

Centered 448px (confirm) / 560px (submit summary) / 720px (figure zoom); `--bg-1`, radius
`--r-2xl`, shadow-4, `--scrim` backdrop + blur(4px). Header `--t-h3`, body `--t-body`, footer
right-aligned buttons (secondary = ghost). Open: scale .96→1 + fade 200ms `--ease-out`. Focus
trap, `role="dialog"` `aria-modal="true"` `aria-labelledby`, Esc closes (except auto-submit notice),
focus returns to trigger.

### 3.16 Empty state (`.empty`)

Centered, tensor-grid bg, 96px line-art node-graph illustration (inline SVG, `--line-3` strokes,
one `--primary` node), `--t-h3` title, `--t-small --ink-2` line, one primary action. Copy set:
no attempts yet / no search results / glossary filter miss / chapter not started.

### 3.17 Table (`.tbl`)

Full-width, header row `--t-caption --ink-3` uppercase on `--bg-2`, rows 44px, hairline
`--line-1` separators, cells `--t-small`, numeric columns right-aligned mono. Row hover `--bg-2`
(interactive rows only). `<caption>` visually hidden; `<th scope="col">`. Used: attempts history,
K-level distribution, timing plan, glossary abbreviations.

### 3.18 Results bar chart (`.rbar`)

Horizontal bars (7 chapters, long titles — vertical bars would truncate). Per row: `Ch n` overline
+ title (`--t-small`, 600) left, fixed 220px label column; track `--bg-3` (flex:1, 12px, radius
full); fill = `pointsEarned/pointsMax` × track width; fill color `--success` when earned ≥ 65% of
that chapter's points else `--danger`; value right: `8/9 pts · 3/3 Q` mono `--t-small`. No-data
chapters: track at 0 with `—`. Tooltip: per-question verdicts on hover. Animated width 480ms
`--ease-out`, staggered 40ms per row.

### 3.19 Figure viewer (`.fig`)

Frame: `--bg-0` well, border `--line-1`, radius `--r-lg`, padding `--sp-4`; image `max-width:
100%`, height auto; caption below (`--t-small --ink-2` italic, the verbatim caption/transcription);
zoom button top-right (44px, ghost) opening modal 720px with the image at 2× (native scaling, no
blur filter), same caption repeated. Always includes the verbatim `alt`; exam figures (D2 §2.3)
show **both** the PNG and the machine-readable transcription table beneath, per D2 — transcription
first, image second.

### 3.20 Matching widget — A4 click-pair (`.pair`, per D2 §2.5)

Two columns (min 220px each, gap `--sp-16` for the connector zone). Item: chip-card, `--bg-1`,
border `--line-2`, radius `--r-md`, padding `--sp-3 --sp-4`, min-height 48px.
States: default; **armed** (clicked left item awaiting partner): `--primary` border 2px +
`--primary-soft` fill + left-edge 4px `--primary` bar; **paired**: both items show a mono index
badge (`1`,`2`…) and a colored connector; connectors drawn as absolutely-positioned SVG lines
(`--primary` 2px, bezier) updated on layout; wrong connectors in review render `--danger` dashed,
correct `--success`. Re-pairing steals a paired right item (bijection, D2). Drag-and-drop = pointer
shortcut over the same model. Keyboard: Tab to left item → Enter (arms, announces "Armed:
Association. Choose a match") → Tab to right → Enter pairs; Esc disarms. `role="listbox"` pairs;
each item `role="option"` `aria-selected`.

### 3.21 Assign widget — A1 row-segmented (`.assign`, per D2 §2.4)

One bordered row per statement: statement text (`.measure`) + 3-button segmented control (radio
semantics, `fieldset` + `legend` = statement text). Segment: height 36px, radius shared `--r-md`,
border `--line-2`; selected segment: `--primary` fill, `--ink-on-primary` text; hover `--bg-2`.
Pointer alternative: three category **drop-zone cards** above the list; click statement → click
card = chip "flies" (transform 200ms `--ease-out`) into the card; both paths write the same
`assignment` map. Unassigned rows show a `--warn` left bar. Constraint sentence from the stem
("No form of AI can be left empty") echoed under the widget when any row is unassigned.

### 3.22 Ordering widget — A5 click-to-sequence (`.order`, per D2 §2.6)

Top: pool of 5 chips (shuffled exam order, `--bg-1`, border `--line-2`). Click/Enter → appends to
the **sequence lane**: horizontal EARLIER→LATER track ≥ 768px (with axis labels `--t-caption
--ink-3` at both ends), vertical top→bottom below. Sequenced chips: numbered badges (1–5), ↑/↓
buttons (36px), native drag reorder; click a sequenced chip → returns to pool. Keyboard: arrows
move focused chip within lane; Enter toggles pool↔lane. Live region announces "Prepare & Test
Data moved to position 2." Answer model `sequence[]` per D2.

### 3.23 Score ring (results hero) — see §3.4 hero variant

Center: `points / max` as `29 / 44` (mono 2.5rem/700 + caption "of 44 points"); threshold tick at
65.9%; caption below: `PASS` in `--success` / `FAIL` in `--danger` (Simulation only — other modes
show "Score" neutrally, D2) + exact D2 wording line in `--t-small --ink-3`.

### 3.24 Advice card (`.advice`)

On the intel page, CSS-columns masonry (2 cols ≥ 768, 3 ≥ 1200). Anatomy: quote icon (`--line-3`),
body `--t-small`/1.6 `--ink-1`, footer: author `--t-small` 600 + date chip (`--t-num`, `--bg-2`)
+ source host (`--t-caption --ink-3`, e.g. "reddit.com/r/ISTQB"), topic chips. Hover:
translateY(−2px), shadow-2→3, 200ms. Discreet "unverified — community reported" caption class
for non-official sources.

### 3.25 Banner (`.banner`) — resume/storage/integrity notices

Full-width strip under the sticky bar: icon + `--t-small` text + action. Variants: info
(`--accent-soft/--accent`), warn (`--warn-soft/--warn`, e.g. "storage unavailable — session-only
mode" per D2 §4), success. Height 44px, radius `--r-md` when floating in content.

### 3.26 Buttons (`.btn`)

Heights 44 (default) / 36 (`--sm`, in-card) / 52 (`--lg`, exam submit & mode-card CTAs).
Variants: `--primary` (`--primary` fill, `--ink-on-primary`, hover `--primary-strong`, shadow-1→2);
`--ghost` (transparent, `--ink-2`, hover `--bg-2`); `--outline` (border `--line-3`, `--ink-1`);
`--danger` (`--danger` fill, white/dark ink — submit-exam confirm only). Active: scale .98.
Focus ring per §3 conventions. Icons 20px inline-start, gap `--sp-2`.

---

## 4. Page-by-page UX

### 4.1 Dashboard (`#/`)

```
┌──────────────┬────────────────────────────────────────────────────────────────┐
│ (sidebar)    │  ┌ tensor-grid hero ────────────────────────────────────────┐  │
│              │  │  Good afternoon.                    [▶ Resume simulation] │  │
│              │  │  19.5h curriculum · 7 chapters · 46 sample questions     │  │
│              │  └─────────────────────────────────────────────────────────┘  │
│              │  ┌ ◔ EXAM READINESS ─────┐  ┌ ▸ CONTINUE STUDING ──────────┐  │
│              │  │      hero ring 62%    │  │ Ch 3 · §3.3 Neural Networks  │  │
│              │  │  study ▓▓▓▓▓▓░░ 71%   │  │ [Resume § 3.3.1 →]  est.40m  │  │
│              │  │  best sim ▓▓▓░░░ 52%  │  │ [Switch chapter ▾]           │  │
│              │  └───────────────────────┘  └───────────────────────────────┘  │
│              │  ── STUDY PLAN ─────────────────────────────────── 43% ──    │
│              │  ┌────┐ ┌────┐ ┌────┐ ┌────┐                                 │
│              │  │Ch1 ✓│ │Ch2 │ │Ch3◗│ │Ch4 │   (7 chapter cards, §3.5)     │
│              │  └────┘ └────┘ └────┘ └────┘                                 │
│              │  ── WEAK AREAS ──────────────────────────────────────────    │
│              │  (Ch 5 — 2/5)  (Q28 missed twice)      → Practice these      │
│              │  ── RECENT ATTEMPTS ────────────────────── Results history → │
│              │  Sim · 12 Nov · 31/44 · PASS   |  Learning · 10 Nov · 82%   │
│              │  ── FROM THE COMMUNITY ────────────────────── Exam Intel →   │
│              │  (2 advice cards, teaser)                                     │
└──────────────┴────────────────────────────────────────────────────────────────┘
```

Notes:
- **Readiness formula (shown in tooltip):** `readiness = 0.5 × studyFraction + 0.5 × bestSimFraction`
  where `studyFraction` = understood-LO minutes ÷ 1170 (D1 budgets) and `bestSimFraction` = best
  simulation points ÷ 44. Honest, computable, no invented signals. If no sim exists, the ring shows
  study-only and the caption says so.
- Resume card appears when `ctai.session.v1` exists (per D2: sim resume shows remaining time;
  practice auto-resumes). Otherwise the slot shows "Start studying Ch 1".
- Weak areas chips are D2 `qstats` output (< 0.60 with seen ≥ 2 / missed ≥ 2×); clicking one
  pre-filters learning mode with that chapter/question.
- Hero greeting is time-of-day ("Good morning/afternoon/evening"); never personalized name (offline).

### 4.2 Study index (`#/study`)

Intro line + total progress pbar (1170 min), then the 7 chapter cards in
`repeat(auto-fill, minmax(320px, 1fr))` grid (§3.5), each with understood-LO ring, minutes budget,
question count, keyword chips. Sticky breadcrumb shows global study %. Card footer link
"Cheatsheet →" per chapter.

### 4.3 Chapter study page (`#/study/ch3`)

```
┌──────────────┬──────────────────────────────────────────────────────────────┐
│ (sidebar,    │  Study / Ch 3                    [◔ 41% understood] [Cheats] │
│  Ch3 items   │  ── ● Section marker                                            │
│  highlighted)│  Chapter 3 — Machine Learning                    375 min      │
│              │  lead: section intro (verbatim)                                │
│ ┌ TOC ─────┐ │  ┌ LO accordion 3.1.1 ───────────────── [✓] ~15 min ─────┐   │
│ │ 3.1 ·····│ │  │ (AI-3.1.1 · K2) Introduction to AI …                  │   │
│ │ ▸3.1.1 ✓ │ │  └───────────────────────────────────────────────────────┘   │
│ │  3.1.2   │ │  ┌ LO accordion 3.1.2 (open) ─────────── [✓] ~40 min ────┐   │
│ │  3.1.3 ✓ │ │  │ LO banner: "Summarize the workflow…"  [AI-3.1.2 K2]  │   │
│ │ 3.2 ···· │ │  │ verbatim prose, 72ch … figures … hands-on ribbon     │   │
│ │ (scroll- │ │  │ Related: [Q10·K2] [Q17·K2]      Syllabus L565–636 ⓘ  │   │
│ │  spy)    │ │  └───────────────────────────────────────────────────────┘   │
│ └──────────┘ │  ‹ Ch 2                                          Ch 4 ›        │
└──────────────┴──────────────────────────────────────────────────────────────┘
```

Interaction notes:
- Sticky mini-TOC (left, ≥ 1024px): section groups `3.1`, `3.2`…, LO items with ✓ state; active
  item highlighted via scrollspy (IntersectionObserver, rootMargin −40%); click scrolls with
  12px scroll-margin-top. Phone: `On this page ▾` disclosure under the breadcrumb bar.
- Reading progress: 3px `--primary` bar across the content top (§2.5).
- **Understood toggle** per LO writes `ctai.progress.v1 = { "3.1.2": true, … }`; drives chapter
  rings, dashboard readiness, and the "est. minutes studied" figure (understood fraction × budget).
- Deep link `#/study/ch3/3.3.1` scrolls to and auto-expands that LO accordion.
- Prev/next chapter footer with titles; keyword strip from D1 `keywords` (general vs AI-specific
  visually separated by chips in `--bg-2` vs `--accent-soft`).
- `handsOn` LOs render the accent ribbon and a caption "Hands-on unit — not directly examinable"
  (D1); their K-chip shows H1/H2.

### 4.4 Cheatsheets (`#/cheatsheets`, `#/cheatsheets/ch3`)

Index: 7 compact cards ("Ch 3 · 375 min · formula block") → chapter sheet.
Sheet: single `.measure` column, chapter picker as underline tabs, `[⌘ Print]` and `[Expand all]`
in the sticky bar. D1 block types get fixed visual treatments:

| Block | Treatment |
|---|---|
| `meta` | caption strip: `45 min · 3 questions · 3 pts` mono, `--bg-2` pill row |
| `keyTerms` | definition grid: term (600) + verbatim def + src chip `2.1.1` |
| `mustKnow` | checklist bullets, 2-col ≥ 768px, primary check glyphs |
| `formula` | mono block, `--bg-3` well, radius `--r-md`, 1px `--line-2`, name caption above |
| `table` | `.tbl` component as-is |
| `traps` | `--warn-soft` cards with alert icon + "Confusion:" label |
| `examPointers` | LO rows: K-chip + verbatim LO text + question chips |

Every bullet shows its `src` chip (D1 traceability) at `--t-caption --ink-3`; tapping it jumps to
the study page section. Print stylesheet in §8.4.

### 4.5 Glossary (`#/glossary`)

```
│ Glossary                                     [118 terms · 31 abbreviations] │
│ [⌕ Filter terms, definitions, synonyms…]  [A][B][C]…[Z] jump rail (sticky)  │
│ Tabs: (Terms) (Abbreviations)                                          ▾ A–Z │
│ ┌ recall  ⚑must-know ───────────────────────────────────────────────┐     │
│ │ "An ML functional performance metric used to evaluate a            │     │
│ │  classifier, …"                                                    │     │
│ │ Synonym: sensitivity · ISO/IEC TR 29119-11 · appears in 3.3.1, 2.2.1│     │
│ └────────────────────────────────────────────────────────────────────┘     │
```

Filter runs over term + def + synonyms + abbr (D1), debounced 120ms, result count announced
politely; "must-know" badge (`--accent-soft`/`--accent`, from D1 keywords join) filter toggle;
`appearsIn` links navigate to study sections; abbreviations tab is a two-column `.tbl`. Empty
filter → `.empty` state with "Clear filter" action.

### 4.6 Exam hub (`#/exam`)

```
│ Mock exam                                                       [⚙ Settings] │
│ ⚠ Resume banner: Simulation in progress · 41:12 remaining  [Resume][Abandon]│
│ ┌ FULL SIMULATION ────accent────┐ ┌ LEARNING MODE ─────────────┐            │
│ │ 40 Q · 60 min · 44 pts        │ │ Filters: chapter/K/type/    │            │
│ │ Pass 29/44 · official standard│ │ wrong-before · instant      │            │
│ │ [▶ Start simulation]          │ │ rationale · untimed         │            │
│ │ ☐ Exam-like shuffle  ☐ 75 min │ │ [Start learning]            │            │
│ └───────────────────────────────┘ └────────────────────────────┘            │
│ ┌ QUICK QUIZ ───────────────────┐ ┌ APPENDIX — NEW TYPES ──────┐            │
│ │ 5/10/20/custom · weak areas   │ │ A1–A6 · matching, ordering │            │
│ │ ☐ official pacing timer       │ │ untimed · 6 pts            │            │
│ └───────────────────────────────┘ └────────────────────────────┘            │
│ Weak areas: (Ch 5 — 2/5) (Q28 missed twice) → pre-filters learning/quiz     │
│ ── ATTEMPTS ─────────────────────────────────────────── Results history →  │
```

Mode cards use `.card--interactive--accent-left`; the simulation card is visually primary (1px
`--primary` border, slightly larger). Toggles per D2: shuffle (default off), 75-min accommodation,
quiz pacing timer, feedback style (instant/at end), appendix inclusion — each with a one-line
tooltip citing why. Resume banner (`.banner--info`) appears when a session exists (D2 §4.2).
First visit shows a one-time toast: "The simulation hides K-levels and points — like the real
exam."

### 4.7 Exam runner (`#/exam/run/:sessionId`) — the critical screen

One runner, four session modes (`sim | practice | appendix | quick` from D2). Mode controls chrome
and feedback; layout is constant.

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ ◆ Simulation          17/40 answered  ▓▓▓▓▓░░░░  ⏱ 43:12    [⚑][☰ 17/40][Submit]│ sticky 56px
├───────────────────────────────────────────────────────────────┬──────────────┤
│ QUESTION CARD                                                  │ PALETTE      │
│ Question 17 of 40                                    [⚑ flag] │ [jump: 1 7⏎] │
│ (sim: no K/pts/LO — learning shows: AI-3.3.1 · K3 · 2 pts)    │ ┌──┬──┬──┬──┐│
│                                                                │ │1●│2●│3○│4⚑││
│ Stem (verbatim, 72ch)                                          │ ├──┼──┼──┼──┤│
│ ┌ item-set display list (verbatim) ┐                           │ │5●│6•│7○│8●││
│ └──────────────────────────────────┘                           │ │ …40 cells  ││
│ ┌ FIGURE: transcription table + PNG [⌕] ┐  (Q15 only)          │ └────────────┘│
│ └────────────────────────────────────────┘                     │ ●ans ○open    │
│ (a) option text                                    [hint: a]   │ ⚑flag •current │
│ (b) option text  ✓ selected                                     │ legend        │
│ (c) …     (d) …     (e) …          "2 of exactly 2" chip       │               │
│                                                                │               │
│ ┌ rationale panel (learning, after Check) ───────────────────┐ │               │
│ │ Correct answer: c — per-option verdict bullets…            │ │               │
│ │ preamble/conclusion verbatim · [derived] markers · LO link │ │               │
│ └────────────────────────────────────────────────────────────┘ │               │
│ [← Previous]                                    [Check answer]│ [Next →]      │
│ (sim: no Check; submit gate is in the top bar)                 │               │
└───────────────────────────────────────────────────────────────┴──────────────┘
```

**Mode matrix — exactly what differs:**

| Element | Sim | Learning | Appendix | Quick (instant) | Quick (at end) |
|---|---|---|---|---|---|
| Countdown timer | 60:00 (or 75:00) + warnings | count-up (optional) | none | optional pacing countdown | optional |
| Question header meta | **hidden** (no K/pts/LO) | LO · K · pts · chapter, before answering | same | same as learning | hidden |
| Option feedback | none until submit | instant verdict + rationale | instant + answer-figure reveal | instant | at end |
| Check-answer button | — | ✓ (then "Try again" per D2 §1.b) | ✓ | ✓ | — |
| Palette | yes | yes (colors fill as checked) | yes (6 chips) | yes | yes |
| Flag | yes | yes | yes | yes | yes |
| Submit | top bar → confirm modal | "Finish" (no pressure wording) | "Finish" | "Finish" | top bar → confirm |
| Pause | **never** (D2: real-exam integrity) | allowed → `pausedRemainingMs` | allowed | allowed | allowed |
| Auto-submit at 0:00 | yes + notice modal | n/a | n/a | yes if timer on | yes if timer on |
| Widgets (assign/pair/order) | never (D2 §2.7) | if appendix included | yes | if included | if included |

**Element-by-element state logic:**

- **Timer bar** — countdown from `endsAt` (absolute, D2 §4.2; reload cannot extend). Warn < 10:00,
  critical < 2:00 (§3.10). Progress strip = answered count / total, `--primary`; switches `--warn`/
  `--danger` in lockstep with the timer. At 0:00: options lock, modal "Time expired — your exam was
  submitted automatically" → results.
- **Answering** — keys `a`–`e` toggle options (chips show the letter as the hint); radio replaces
  selection; checkbox enforces max-2 (§3.8). No auto-advance (explicit Next keeps review control and
  prevents mis-key losses; palette gives fast travel for confident users).
- **Flag** — `f` or the flag button; icon fills `--warn`, palette chip gains the dot; never affects
  scoring; submit modal lists flagged questions.
- **Palette** — states per §3.9 including `incomplete` for multi-select ≠ 2 (D2). Current question
  has `aria-current`. Jump buffer: number keys type, `Enter` jumps, `Esc` clears.
- **Learning rationale panel** — slides open 200ms after verdict: correct-answer line (600 weight),
  per-option verdict bullets verbatim (D2 `[AE]`), preamble/conclusion where present, `*[derived]*`
  why-not bullets rendered with a `derived` chip (accent), LO chip link to `#/study/ch…`, source
  notes drawer (D2 `quirks`) collapsed by default. Wrong answer: user selection turns `.is-incorrect`
  with one shake (240ms, reduced-motion: none); the missed correct option gets `.is-correct.is-missed`.
- **Appendix reveals** — after Check, the widget re-renders with correct overlays green / user's
  wrong red (§3.20–3.22) plus the answers PNG (`answers_p32/35/36.png`) and verbatim transcription;
  A5 adds the explanation figure `answers_p37.png` (D2 §2.4–2.6).
- **Submit gate (sim)** — modal lists: unanswered count, flagged count, questions without exactly
  two answers; buttons `Keep working` (default) / `Submit exam` (`--danger` primary). On submit:
  session scored (D2 §3.3), archived to `ctai.attempts.v1`, route → `#/results/:sessionId`.
- **Route guard** — any navigation that would leave `#/exam/run/*` while a sim is running (browser
  back, sidebar click, `g`-chords) opens the modal: "Leave the simulation? A real exam cannot be
  paused — leaving now **abandons** this attempt." `Stay` (default) / `Abandon` (abandon = fresh
  start, archives nothing, per D2 §4.2). Practice/appendix/quick instead pause silently
  (`pausedRemainingMs`) and show a resume banner. Reload mid-sim is **not** leaving: the runner
  resumes from `endsAt` (wall clock, D2) with no dialog.

### 4.8 Results (`#/results/:sessionId`)

```
│ Simulation · 17 Nov 2026 · used 52:41 of 60:00 · [auto-submitted]            │
│        ┌──────────────┐                                                       │
│        │   ◔ 31 / 44  │   PASS  (−− threshold tick at 29)                     │
│        │  hero ring   │   "Pass mark: 28.60 → 29 of 44 (65%) — official       │
│        └──────────────┘    real-exam standard" (D2 wording)                   │
│ ── BY CHAPTER ──────────────────  ── BY K-LEVEL ──────────  ── TIMING ──     │
│ Ch 1 ▓▓▓▓▓▓▓▓▓░ 6/7 pts …       K2 33/36 correct · 33 pts    52:41 used      │
│ (7 horizontal .rbar rows)       K3 2/4 correct · 4 pts       90s/Q average   │
│ ── QUESTIONS ────────────────────────────────────────────────────────────    │
│ ✓1 ✓2 ✗3 ○4 ⚑5 ✓6 … (compact verdict grid → click = review at that Q)       │
│ [Review all] [Review incorrect (5)] [Review flagged (3)] [Retake] [Done]     │
```

Notes: hero ring + count-up; verdict grid = 40 mini chips (correct/incorrect/unanswered/flag dot)
mirroring palette vocabulary; PASS/FAIL banner only in sim mode (D2 §3.2 — other modes show neutral
"Score" + equivalent-threshold line). Per-question rows carry "2 pts" chips on K3s. Confetti policy
in §6. Actions per D2 §3.4 (Review incorrect only / flagged, Retake, back to picker).

### 4.9 Review (`#/results/:sessionId/review`)

Same question-card component in read-only mode with filters as underline tabs:
`(All · Incorrect 5 · Unanswered 1 · Flagged 3)`, carried from results. Per question: user answer
highlighted, correct answer green (multi: per-letter ✓/✗), widgets show green/red overlays, then
verbatim rationale stack (same layout as learning reveal), metadata line `LO AI-x.y.z · K · pts ·
Ch n` with Q29's `lo_conflict` footnote (D2 §3.5). Keyboard: `j`/`k` or `←`/`→` prev/next within
the filtered subset; `1`–`4` switch filters; `Esc` → results.

### 4.10 Exam intelligence (`#/intel`, `#/intel/patterns`)

Advice tab: intro line + source-policy note ("community-reported; official facts are marked"),
filter chips by topic (difficulty, timing, question style, K3 traps…), then `.advice` cards in CSS
columns. Each card carries source + date (e.g. "reddit.com · Oct 2026"); official-sourced facts
get an accent "official" chip.
Patterns tab:
- **K-level distribution donut** (SVG): question counts K2 36 / K3 4 as the two segments, with a
  points callout beside it (36 × 1pt + 4 × 2pt = 44 max); labels outside the ring, segments
  `--chart-2` / `--chart-1`.
- **Chapter weighting bars**: 7 `.rbar` rows scaled to question counts per chapter (from D1
  coverage data), annotated with pts.
- **Timing strategy card**: the arithmetic laid out — 60:00 ÷ 44 pts ≈ 82s/pt; practical rule
  "90s per K2 question, bank the rest for the four K3 questions" (aligned with D2's official pacing
  1min/K2, 3min/K3); a mini table: first pass target 35 min, flag-and-return buffer 15 min,
  review 10 min.
- **What's on the exam** summary from D1 coverage + D2 [EST]; all numeric claims chip-tagged
  `official` or `derived`.

### 4.11 Search overlay (global, `⌘K` / `/`)

```
┌───────────────────────────────────────────────┐  centered 640px, top 15vh
│ ⌕  Search glossary, chapters, LOs, cheats…    │
├───────────────────────────────────────────────┤
│ GLOSSARY                                      │
│   recall — "An ML functional performance…"    │
│ CHAPTERS & LOs                                │
│   3.3.1 Neural networks · Ch 3 · K2 · 71%     │
│ CHEATSHEETS                                   │
│   Ch 5 · Traps — "self-learning vs drift"     │
├───────────────────────────────────────────────┤
│ ↑↓ navigate   ⏎ open   esc close              │
└───────────────────────────────────────────────┘
```

Lazily built index (glossary terms/defs/synonyms, LO ids+titles+keywords, cheatsheet block titles,
exam-intel card titles). Grouped results, max 5/group, highlight matched substring
(`mark` with `--warn-soft` bg). `role="dialog"` + combobox pattern; empty state inline. Not a route
— an overlay above any page.

---

## 5. Navigation & routing plan

### 5.1 Route map

| Hash | Page | Notes |
|---|---|---|
| `#/` | Dashboard | |
| `#/study` | Study index | |
| `#/study/ch{n}` | Chapter study | n = 1…7 |
| `#/study/ch{n}/{sub}` | Deep link | sub = `3.3.1` — expands + scrolls to LO |
| `#/cheatsheets` | Cheatsheet index | |
| `#/cheatsheets/ch{n}` | Chapter sheet | |
| `#/glossary` | Glossary | optional `?q=` and `#term-slug` scroll |
| `#/exam` | Exam hub | resume banner, mode cards, settings |
| `#/exam/run/{sessionId}` | Exam runner | mode from stored session (D2) |
| `#/results` | Attempt history | table of `ctai.attempts.v1` |
| `#/results/{sessionId}` | Results report | |
| `#/results/{sessionId}/review` | Review | optional `?filter=incorrect\|unanswered\|flagged\|all` |
| `#/intel` | Advice cards | tab 1 |
| `#/intel/patterns` | Pattern analysis | tab 2 |
| anything else | `#/404` | `.empty` state + home link |

Router: `hashchange` listener; parse `location.hash.slice(2)` by `/`; query via `?` after the path.
Scroll: each route stores its scroll offset in memory (`scrollMap[route]`); restoring on back gives
natural browser-like behavior; new forward navigation scrolls to top (or deep-link target).

### 5.2 Browser back, mid-exam, and reload

- **Back/forward leaving an active sim:** router intercepts the `hashchange` before rendering,
  restores the hash (`location.hash = '#/exam/run/<id>'`, guarded against re-entry with a
  `suppressGuard` flag), and shows the abandon modal (§4.7). Confirm → attempt discarded per D2
  (sim is never pausable), history entry for the denied route is re-popped.
- **Back/forward leaving practice/appendix/quick:** session pauses silently (D2 `pausedRemainingMs`);
  exam hub and dashboard show the resume banner. No blocking modal — nothing is at risk.
- **Reload during any runner:** session state (responses, flags, `endsAt`, `uiState.currentIndex`)
  is persisted per answer/flag/heartbeat (D2 §4.1); the runner remounts from storage; sim time
  recomputes from absolute `endsAt`; if `now > endsAt` the sim auto-submits immediately (D2 §4.2).
- **Post-submit:** runner redirects to `#/results/{id}`; back from results re-enters the dead
  session route → router shows review instead (attempt exists in history) rather than a blank runner.

---

## 6. Micro-interactions & delight

Inventory (all values final; all `prefers-reduced-motion`-gated per §1.6):

1. **Route transition** — outgoing view: opacity → 0, 100ms; incoming: opacity 0→1 +
   translateY 8px→0, 180ms `--ease-out`. Views are re-created per route; no layout animation.
2. **Answer feedback (learning)** — verdict colors fade in 200ms; check icon scales 0.6→1 with
   `--ease-spring`; wrong answers shake once ±3px, 240ms; rationale panel opens 200ms.
3. **Palette chip pop** — on answer, the chip scales 0.92→1, 150ms spring.
4. **Score ring** — 480ms `--ease-out` dashoffset + synced count-up; threshold tick draws last
   (delay 360ms).
5. **Confetti — yes, but earned and rare.** Fires only on a **PASS in simulation mode, first time
   ever** (`ctai.settings.v1.celebratedPass` flag). 48 small rectangles (6–10px) in
   `--chart-1/2/3/4/6`, launched from the ring's center, gravity via CSS transform keyframes,
   1400ms, then fully removed from the DOM. Skipped under reduced-motion and in print. Every later
   pass gets a 2× ring pulse only. Justification: one unforgeable moment beats a slot machine.
6. **Hovers** — cards lift 1px/150ms; nav items fade 120ms; option rows tint 120ms; nothing scales
   on hover except buttons' active state (.98).
7. **Progress mutations** — pbar width 400ms; rings re-animate on change; dashboard readiness
   number ticks with count-up.
8. **Toast** — slide-up + fade 200ms; 4px lifetime bar; hover pauses dismissal.
9. **Accordion** — chevron rotates 180° (200ms); body animates via `grid-template-rows 0fr→1fr`
   (200ms), no height measurement.
10. **Flag** — icon fill + 1px bounce (`--ease-spring`, 150ms); palette dot pops.
11. **Theme switch** — 150ms transition on `background-color`/`color` at token consumers; the
    toggle icon cross-fades sun↔moon.
12. **Empty states** — node-graph illustration floats ±4px on a 6s ease-in-out loop (static under
    reduced motion).
13. **Understood toggle** — checkbox fills with spring pop; the chapter ring in the sidebar ticks
    forward 5%.

### Keyboard shortcut map (final)

Global (suppressed while typing in an input):

| Keys | Action |
|---|---|
| `/` or `⌘K`/`Ctrl-K` | Open search overlay |
| `g` then `d / s / c / g / e / i / r` | Go Dashboard / Study / Cheatsheets / Glossary / Exam / Intel / Results |
| `t` | Toggle theme |
| `?` (shift-`/`) | Shortcuts modal (first-run toast points here) |
| `Esc` | Close overlay/drawer/modal |

Exam runner (global chords disabled):

| Keys | Action |
|---|---|
| `a` `b` `c` `d` `e` | Select/toggle option (chips display these hints) |
| `f` | Toggle flag |
| `→`/`n` · `←`/`p` | Next / previous question |
| `0`–`9` + `Enter` | Jump-buffer → palette jump |
| `s` | Open submit gate (sim) / finish (others) |
| `Esc` | Close palette sheet / clear jump buffer |

Review: `j`/`k` next/prev; `1`–`4` filters. Search overlay: `↑↓` move, `⏎` open, `Esc` close.
All shortcuts listed in the `?` modal with kbd-styled chips (`--bg-3`, mono, radius `--r-sm`).

---

## 7. Accessibility (WCAG 2.1 AA)

### 7.1 Contrast verification

Method — WCAG relative luminance: for each sRGB channel c ∈ [0,1]:
`c ≤ 0.03928 ? c/12.92 : ((c+0.055)/1.055)^2.4`; `L = 0.2126R + 0.7152G + 0.0722B`;
ratio `= (L_light + 0.05) / (L_dark + 0.05)`.

Worked example (light primary on card): `#4F46E5` → R 0x4F=79→0.0782, G 0x46=70→0.0612,
B 0xE5=229→0.7834 (post-gamma); `L = 0.2126(0.0782)+0.7152(0.0612)+0.0722(0.7834) = 0.1170`;
on `#FFFFFF` (L=1): `(1+0.05)/(0.1170+0.05) = 6.29:1` ✓.
Worked example (dark primary on card): `#818CF8` → R 129→0.2195, G 140→0.2622, B 248→0.9385;
`L = 0.3020`; on `#111A2E` (L=0.0106): `(0.3020+0.05)/(0.0106+0.05) = 5.81:1` ✓.

| # | Foreground | Background | L(fg) | L(bg) | Ratio | Result |
|---|---|---|---|---|---|---|
| Light theme |
| 1 | `--ink-1` #1E293B | `--bg-1` #FFFFFF | 0.0218 | 1.0000 | **14.62:1** | AAA |
| 2 | `--ink-2` #475569 | `--bg-1` #FFFFFF | 0.0886 | 1.0000 | **7.58:1** | AAA |
| 3 | `--ink-3` #5D6B84 | `--bg-0` #F6F7FB | 0.1451 | 0.9307 | **5.03:1** | AA |
| 4 | `--primary` #4F46E5 | `--bg-1` #FFFFFF | 0.1170 | 1.0000 | **6.29:1** | AA |
| 5 | #FFFFFF (label) | `--primary` #4F46E5 | 1.0000 | 0.1170 | **6.29:1** | AA |
| 6 | `--success` #15803D | `--bg-1` #FFFFFF | 0.1594 | 1.0000 | **5.02:1** | AA |
| 7 | `--danger` #B91C1C | `--bg-1` #FFFFFF | 0.1123 | 1.0000 | **6.47:1** | AA |
| 8 | `--warn` #B45309 | `--bg-1` #FFFFFF | 0.1591 | 1.0000 | **5.02:1** | AA |
| 9 | `--primary-soft-ink` #3730A3 | `--primary-soft` #EEF2FF | 0.0557 | 0.8890 | **8.88:1** | AAA |
| 10 | `--ink-1` #1E293B | `--primary-soft` #EEF2FF | 0.0218 | 0.8890 | **13.08:1** | AAA |
| Dark theme |
| 11 | `--ink-1` #E6EAF2 | `--bg-1` #111A2E | 0.8209 | 0.0106 | **14.38:1** | AAA |
| 12 | `--ink-2` #A9B4C7 | `--bg-1` #111A2E | 0.4520 | 0.0106 | **8.29:1** | AAA |
| 13 | `--ink-3` #7E8BA5 | `--bg-1` #111A2E | 0.2562 | 0.0106 | **5.06:1** | AA |
| 14 | `--primary` #818CF8 | `--bg-1` #111A2E | 0.3020 | 0.0106 | **5.81:1** | AA |
| 15 | `--ink-on-primary` #0B1220 | `--primary` #818CF8 | 0.0061 | 0.3020 | **7.17:1** | AAA |
| 16 | `--success` #4ADE80 | `--bg-1` #111A2E | 0.5526 | 0.0106 | **9.95:1** | AAA |
| 17 | `--danger` #F87171 | `--bg-1` #111A2E | 0.3295 | 0.0106 | **6.27:1** | AA |
| 18 | `--warn` #FBBF24 | `--bg-1` #111A2E | 0.5790 | 0.0106 | **10.39:1** | AAA |
| 19 | `--primary-soft-ink` #C7D2FE | soft composite ≈ #222A4A | 0.6539 | 0.0249 | **9.40:1** | AAA |
| 20 | `--success` #4ADE80 | soft composite ≈ #183238 | 0.5526 | 0.0268 | **7.85:1** | AAA |

Soft composites = 12–14% alpha fills flattened over `--bg-1` (the actual rendering).
Non-text (≥ 3:1): focus rings 6.29/6.28 ✓; option control strokes use `--ink-2` (7.58/8.29) ✓;
palette current-chip ring = `--focus-ring` ✓. Decorative hairlines are exempt.

### 7.2 Checklist applied

- **Structure:** `<html lang="en">`; landmarks — `<nav>` (sidebar), `<main>`, sticky bars as
  `<header>`; skip link ("Skip to content", first focusable, visible on focus); one `<h1>` per
  view; heading levels never skip.
- **Focus:** all interactive elements reachable and visible; `:focus-visible` ring per §3; modals
  trap and restore focus; drawer sets `inert` on main; no positive `tabindex`.
- **Exam widgets ARIA:** option rows `role="radio"/"checkbox"` + `aria-checked` inside
  `role="radiogroup/group"` labelled by the stem id; palette = `role="group"` labelled "Question
  navigator", chips are buttons with status-bearing `aria-label`s and `aria-current="true"` on the
  current one; timer `role="timer"` with threshold announcements via a visually-hidden polite
  region; verdicts announced politely ("Correct" / "Incorrect"); flag button `aria-pressed`;
  accordion headers `aria-expanded` + `role="region"`; widgets per §3.20–3.22 (listbox/option,
  radiogroup segments, live-region move announcements).
- **Color independence:** every verdict pairs color + icon + text; flagged = dot + tooltip +
  aria-label; charts have visible value labels, color never sole channel.
- **Motion:** §1.6 global kill; confetti/shake/float additionally JS-gated; nothing flashes > 3Hz.
- **Targets & zoom:** 44×44 minimum hit targets; layout reflows to 320px; all sizes in rem —
  200% text zoom keeps every screen operable; no horizontal scroll except data tables (scrollable
  region with keyboard access).
- **Forms:** search input has a visually-hidden label + `role="searchbox"`; filters are checkbox/
  radio semantics, never div-clicks.
- **Dialogs:** `role="dialog"`, `aria-modal`, labelled, Esc-handled, scrim click = cancel except
  the sim submit gate (deliberate friction).
- **Print:** §8.4 — no motion, no interactivity required.

---

## 8. CSS architecture

### 8.1 File split

```
site/
  index.html            # shell + SVG sprite + inline theme bootstrap script
  styles/
    tokens.css          # all custom properties, both themes, color-scheme
    base.css            # reset, element defaults, .t-* type classes, focus, kbd, mark
    shell.css           # app grid, sidebar, drawer, topbar, sticky bars, .page/.measure
    nav.css             # .nav-item, breadcrumbs, tabs
    cards.css           # .card, .ch-card, .advice, .empty, .banner
    chips.css           # .k-chip, .meta-chip, .lo-chip, badges, tooltip
    progress.css        # .pbar, .ring (+ tick), counters
    exam.css            # .q-card, .opt, .palette/.pal-chip, .timer, submit gate
    widgets.css         # .pair, .assign, .order, connectors
    feedback.css        # .modal, .toast, .tip
    charts.css          # .rbar, donut, verdict grid
    search.css          # search overlay
    pages.css           # page-level compositions (dashboard grid, results, glossary)
    print.css           # print stylesheet (cheatsheets + study)
  js/                   # router.js, views/*.js, exam.js, store.js, search.js, keys.js
  data/                 # D1/D2 global scripts (chapter-*.js, glossary.js, questions.js …)
  assets/fig/           # PNG figures referenced by data
```

### 8.2 Naming & method — BEM-lite + state classes (decision)

Blocks in kebab-case, elements `__`, modifiers `--`, all under a flat namespace:
`.q-card__stem`, `.opt--selected`, `.pal-chip--flagged`. JS-owned states are orthogonal classes
(`.is-selected`, `.is-correct`, `.is-current`, `.is-open`, `.is-disabled`) toggled at runtime —
CSS never styles `[data-state]` chains. Only three layout primitives exist (`.stack`,
`.cluster`, `.measure`); no utility classes beyond them. Rationale: components here are few and
long-lived, theming is token-driven, and BEM gives the implementer unambiguous selectors without
a utility framework or specificity wars.

### 8.3 Theming strategy

- Tokens only (§1.2) on `:root` / `html[data-theme="dark"]`; components never hard-code colors —
  an implementer writing a new component uses only `var(--…)` values from this document.
- `color-scheme: light/dark` declared so scrollbars/inputs follow the theme.
- Pre-paint bootstrap in `<head>` (inline, ~10 lines, prevents theme flash on `file://`):
  read `ctai.settings.v1.theme` → `"light"|"dark"|"auto"` (`auto` = `matchMedia`), set
  `document.documentElement.dataset.theme` before `styles.css` paints.
- Theme transition: a `.theming` class on `<html>` for 150ms enabling background/color
  transitions, removed after — avoids transition waterfalls on route changes.

### 8.4 Print stylesheet (cheatsheets + study pages)

`@media print`: hide sidebar, drawer, sticky bars, buttons, toasts, palette, search; content flows
single-column, `--measure` removed; force light tokens (`:root` values) regardless of screen theme;
`color-adjust: exact` only for chips/badges; body 11pt/1.5, `--ink-1` on white; cheatsheet blocks:
`break-inside: avoid`, `formula` wells keep their border; `.tbl` header repeats via `thead`
display; section H2s start a new page (`break-before: page`) for chapter sheets; print header line
("CT-AI Studio — Cheatsheet Ch 3 · syllabus v2.0") via `::before` on `.page`; figures print at
max 100% width with captions. Everything else on screen is irrelevant to print success.

---

## 9. Handoff checklist & decision log

Implementer's definition of done (UI layer):
tokens.css matches §1.2 verbatim; every component in §3 exists with the listed states; every page
in §4 matches its wireframe and mode matrix; router honors §5 including the sim guard; shortcut map
§6 wired; contrast pairs §7.1 re-verified with a linter at 0 tolerance; reduced-motion and print
audited; no network requests anywhere (`grep -r "http" index.html styles/ js/` returns nothing
except comments).

Key decisions (with reasons, for the record):
1. Two-register brand (calm study / cockpit exam) — one mood cannot serve both reading and testing.
2. Indigo primary + cyan accent — "verification" trust + data-forward clarity; both mathematically
   AA-safe in both themes without ugly darkening.
3. Drawer over bottom tab bar on mobile — vertical space, 8 destinations, exam owns the bottom edge.
4. No auto-advance in the runner — protects against mis-keys; palette + shortcuts give speed.
5. K-levels/points hidden in sim, shown in learning (D2) — the header literally changes per mode.
6. Confetti once, ever, on first sim pass — delight that stays earned.
7. BEM-lite + token-only theming — implementable from this document without inventing values.
8. Sim guard = abandon (not pause) — integrity parity with D2's "not pausable" ruling.

— End of D3. —



— End of D3. —

### D3 Addendum (2026-11-18) — layout/density amendments after user testing
Amends specific values above; everything not mentioned stands unchanged (see SPEC Amendment L).

- **§1.3 type scale usage:** the Dashboard greeting uses `t-h1` (32px), not `t-display` — in-app
  headings are not marketing-scale (Geist/Primer product-typography norms). `t-display` remains
  reserved for the results PASS/FAIL moment.
- **§1.4 card padding:** the sp-5/sp-6 standard stands for cards generally; chapter-grid cards
  (`.ch-grid .card`) are deliberately denser at sp-5 on ≥768px as compact navigation tiles.
- **§3.4 ring sizes:** a fourth size `sm` = 64px / stroke 6 / 0.875rem number (no cap label) joins
  mini/std/hero — used in dashboard readiness + chapter cards.
- **§3.5 chips:** chapter cards keep max 3 keyword chips; the "+N more" overflow chip is dropped
  on the dashboard (kept nowhere else either — the study index shows no chips).
- **§4.1 dashboard sketch:** the hero band is compact (t-h1 greeting, meta line, CTA right,
  padding sp-5); readiness and continue-studying remain two cards (no merge — the formula note
  and long LO titles need the width); chapter grid is 4-across at 1080px content (min 250px),
  bars bottom-aligned, second row cut off at the fold as the scroll signifier (NN/g pattern).
  Target density: ~1.5–2 viewports for the full dashboard, one viewport for study/cheatsheets/
  exam hub indexes. Achieved: 2.03 / 1.04 / 1.0 / 1.06 at 1440×900.
- **New layout tokens (§1.2 extension):** `--topbar-h`, `--content-pad-top` (sp-6),
  `--ch-card-min` (250px). Sticky offsets and the reading-progress negative margin MUST derive
  from these — hard-coded px against `.content` padding is what broke the reading bar once.
- **Sprite rule:** `<svg hidden>` MUST be paired with `svg[hidden] { display: none }` — SVG
  elements ignore the HTML hidden attribute and otherwise render a 300×150 inline box above the
  app (the "gap" bug).
- **Theme picker (2026-11-18):** the sidebar footer gains a three-way segmented radio (System /
  Light / Dark, icons: monitor / sun / moon) under a THEME caption — pill track (bg-2, r-full,
  2px inset), active segment bg-1 + primary icon + shadow-1. It writes `settings.theme`
  ("auto"|"light"|"dark"); `applyTheme()` resolves auto via `prefers-color-scheme` and re-resolves
  live on OS change. The existing sun/moon icon button remains the light↔dark quick flip.
- **Selection-accent split (2026-11-19, user request):** user-driven "on/selected" states now
  use `--accent`, not `--primary`: exam option rows (`.opt.is-selected` border, ctrl fill, key
  badge, row tint) and exam-hub toggle switches (`.switch[aria-checked="true"]`). New token
  `--ink-on-accent` (light #FFFFFF on #0E7490; dark #0B1220 on #22D3EE). Rationale: user pick
  (accent) ≠ app chrome (primary/indigo); correct = success, wrong = danger — the three
  Learning-mode states become visually unambiguous. Verified WCAG-strong in both themes;
  recorded in styles/AGENTS.md (exam.css + pages.css rows).
