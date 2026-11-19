# styles/AGENTS.md — 15 stylesheets, token-driven (values fixed in tokens.css per design-D3 §1)

If this disagrees with ../AGENTS.md, ../AGENTS.md wins. Counts live only in the ctx block
(refresh: `python3 tools/check_context.py --update` from site/).

## Task → reading list
- change color/spacing/radius/shadow: `tokens.css` FIRST — sticky offsets, `.reading-progress`
  negative margin and grid column floors DERIVE from tokens (`--topbar-h`, `--content-pad-top`,
  `--ch-card-min`); hard-coded px against `.content` padding elsewhere is a bug
- audit layout after changes: `../tools/probe_layout.mjs` (geometry + testid report + shots)
- add page styles: match the nearest existing file (page-specific → pages.css; video cards →
  videos.css; exam cockpit → exam.css)

## Files — one line each
| file | owns |
| tokens.css | ALL design tokens (colors, spacing, type scale, radii, shadows, z, motion) |
| base.css | reset, typography classes (t-h1…t-caption), svg[hidden] guard, kbd |
| shell.css | app frame: topbar/sidebar/content shells, main vs exam data-shell |
| nav.css | sidebar nav items + drawer |
| cards.css | .card family, chapter cards, advice cards, buttons (.btn variants), empty state |
| chips.css | meta-chip variants, k-chips, [data-tip] tooltips (pseudo-element — beware scrollWidth) |
| pages.css | dashboard hero/grid, study layout+TOC, lo-accordion, glossary az-rail |
| widgets.css | exam option rows, assign/pair/order widgets, palette |
| exam.css | exam shell: cockpit, exam-bar, palette sheet, question frame |
| feedback.css | modals (sizes: base 448 / wide 560 / fig 720 / player 1024), toasts, verdict states |
| progress.css | rings, progress bars, reading-progress |
| charts.css | dash charts |
| search.css | ⌘K overlay |
| videos.css | #/videos toolbar, card anatomy, coverage rows, player embed |
| print.css | print overrides (cheatsheet/study/videos hide chrome) |

## Local invariants & traps
- `[data-tip]::after` tooltips are position:absolute but still inflate ancestor `scrollWidth`
  while invisible — never hang long text on chips inside width-constrained cards (vid-card bug,
  archived history); prefer native `title` attributes in cards.
- WCAG-verified theme pairs live in tokens.css — change pairs there, not per-rule colors.

## Pointers (not copies)
design tokens spec → ../docs/plans/design-D3-uiux.md §1+§7 · gates/rebuild → ../AGENTS.md
<!-- ctx:v1 base.css=65;cards.css=70;charts.css=37;chips.css=38;exam.css=125;feedback.css=33;nav.css=29;pages.css=123;print.css=22;progress.css=22;search.css=24;shell.css=84;tokens.css=70;videos.css=69;widgets.css=47 -->