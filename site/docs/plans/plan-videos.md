# Plan — Videos Page (`#/videos`): curated YouTube coverage of the CT-AI v2.0 syllabus

Date: 2026-11-18 · Status: approved in-session (user: "show me the staged plan file … then continue")
Owner: session agent · Parent rules: `../../AGENTS.md` (fan-out ceiling ~10–12, verify before editing, docs-refresh rule)

## 1. Goal

A new page on the CT-AI Studio site listing **curated, verified YouTube videos** that cover the
ISTQB CT-AI v2.0 syllabus — ideally **every chapter and every numbered section (x.y.z)** of
chapters 1–7 — with **authentic/reputed channels getting priority**. The page itself stays fully
offline (link-out cards, zero remote fetches); only clicking a video needs internet.

## 2. Binding decisions

- **D1 — Link-out, no iframes.** The site's core invariants are offline-first + zero external
  resource loading (Gate B). Embedded YouTube players would break both. Cards open
  `youtube.com/watch?v=…` in a new tab (`target=_blank rel=noopener`, same pattern as intel.js
  advice sources).
- **D2 — No remote thumbnails.** No `i.ytimg.com` images (offline + privacy + repo bloat).
  Cards get a channel-avatar chip (initials, CSS) + play icon instead.
- **D3 — Coverage definition.** "All topics covered" = every numbered section **x.y.z of
  chapters 1–7** (51 sections) has ≥ 1 mapped video. Where no dedicated video exists for a
  micro-topic (e.g. label-correctness testing), a broader video that genuinely includes it may
  carry the mapping, and any still-uncovered section is listed explicitly on the page with the
  nearest-fit videos — no silent gaps.
- **D4 — Channel priority tiers** (labeled on every card):
  `official` (ISTQB / accredited providers), `educator` (recognized educators: 3Blue1Brown,
  StatQuest, Andrew Ng / deeplearning.ai, IBM Technology, Two Minute Papers, freeCodeCamp, …),
  `trainer` (reputed software-testing trainers), `community` (everything else — only if clearly
  better than nothing). Same-tier tiebreak: recency for v2.0-relevant topics, then duration fit.
- **D5 — Every shipped video is machine-verified.** Each YouTube ID is checked live via
  `youtube.com/oembed` (404 ⇒ rejected); canonical title + channel name are taken from the
  oEmbed response, not from search snippets. Duration extracted from the watch page when
  reachable, else agent-reported and marked approximate.
- **D6 — Pipeline mirrors intel.js**: curated source data in `tools/videos.json` →
  `tools/build_videos.py` validates + emits `data/videos.js` (`window.CTAI_VIDEOS`). Build is
  deterministic and re-runnable; the emitted file is generated, never hand-edited.

## 3. Data schema (`window.CTAI_VIDEOS`)

```jsonc
{
  "compiled": "2026-11-18",
  "verifiedHow": "youtube.com/oembed live check per video, 2026-11-18",
  "channels": {                       // keyed registry, one entry per channel
    "istqb": { "name": "ISTQB Foundation", "url": "https://…", "tier": "official", "note": "…" }
  },
  "videos": [
    {
      "id": "V1-01",                  // stable id: chapter group + sequence
      "videoId": "abcdefghijk",       // 11-char YouTube id
      "url": "https://www.youtube.com/watch?v=abcdefghijk",
      "title": "…",                   // canonical title from oEmbed
      "channel": "istqb",             // key into channels
      "duration": "12:34",            // mm:ss / h:mm:ss; "≈" prefix if approximate
      "published": "2024-06",         // YYYY-MM if known, else ""
      "chapters": [1, 2],             // syllabus chapters it serves
      "sections": ["1.1.3", "2.1.1"], // syllabus section ids (validated against syllabus TOC)
      "topicsText": "narrow vs general AI, symbolic AI …",
      "why": "one line: why this video / what it nails for the exam",
      "tags": ["foundation", "hands-on", "exam-prep"],
      "lang": "en"
    }
  ],
  "uncovered": [                      // honest gaps, rendered on the page (D3)
    { "section": "5.1.6", "note": "no dedicated video found; nearest: V5-02 (bias testing)" }
  ]
}
```

## 4. UI (`js/views/videos.js`, route `#/videos`, nav "Videos", `i-play` icon, `g v` shortcut)

- Page head + **coverage strip**: "N videos · M channels · 40/40 sections covered" (or gap list).
- **Chapter filter tabs** (All / 1–7 with counts) + **text search** (title/channel/topics) +
  **tier filter chips** (official / educator / trainer / community).
- Cards grouped by chapter: avatar chip, tier badge, title, channel, duration, `why` line,
  **section chips that deep-link into `#/study/chN/<sub>`**, and a "Watch on YouTube ↗" button.
- Offline note in the page (cards work as a reading list offline; playback needs internet).
- Every interactive element carries a `data-testid` (testid-walk gate is enforced build-wide).
- Print-friendly (existing print CSS patterns).

## 5. Stages

| Stage | What | Done when |
|---|---|---|
| **0. Plan** | This file | written + shown to user |
| **1. Scaffold** | `tools/videos.json` (empty), `tools/build_videos.py` (schema validation), `data/videos.js`, view + route + nav + shortcut + script tags, selftest route registration | site still green (suite passes) with empty data |
| **2. Research fan-out** | Pre-extract per-chapter topic dumps to `/tmp/ctai-videos/` once; launch **8 background agents** (ch1…ch7 + cross-cutting CT-AI exam-prep/ISTQB-specific). Each returns JSON candidates with evidence + oEmbed self-check | 8 candidate files in `/tmp/ctai-videos/cand-*.json` |
| **3. Curation + verification** | Merge, dedupe, resolve channel keys/tiers; curl-oEmbed-verify **every** ID myself; extract durations; map sections against syllabus TOC; fill `tools/videos.json`; record honest `uncovered` entries | `videos.json` complete, every ID oEmbed-verified |
| **4. Build + polish** | Run build script; filters/search/coverage strip live; card styling per D3 tokens | `#/videos` fully functional |
| **5. Gates** | `build_videos.py` validation (unique ids, valid 11-char ids, sections exist in TOC, chapters 1–7, tier keys valid); selftest scenarios +2–3 (render, filter, search, external-link shape) → suite 24→26+; `node tools/tests/ui.test.mjs` green on **http:// and file://**; layout probe includes `#/videos` | all gates green |
| **6. Docs refresh** | This file's stage log; `site/AGENTS.md` (status, map, suite count); `USERGUIDE.md` (page + `g v`); `ARCHITECTURE.md` (view/data/pipe); `site/README.md`; `markdown/README.md` site registration if it enumerates pages | five-artifact rule satisfied |

## 6. Agent fan-out shape (Stage 2)

- 8 agents = 7 chapter agents + 1 cross-cutting (CT-AI-specific playlists, ISTQB-ecosystem
  channels, sample-exam walkthroughs). **Well under the ~10–12 ceiling** — single wave.
- Each agent prompt is self-contained: the chapter's topic list (from the /tmp dump), target
  count (6–12 candidates), tier priority order (D4), v2.0-vs-v1.0 warning, output JSON format,
  and the instruction to verify each candidate via oEmbed/WebFetch before including it, plus
  capture channel credentials (why reputed).
- Agents' findings are **proposals**: nothing ships without my own oEmbed re-verification (D5)
  and a section-mapping sanity pass — per the parent rule "verify any claimed defect/finding
  against the actual source before editing".
- Failure handling: a rate-limited/failed agent's share regroups into a second small wave.

## 7. Acceptance

1. `#/videos` renders offline from `file://`, all interactions testid'd, suite green http+file.
2. Every shipped video: oEmbed-verified id, canonical title/channel, tier-labeled, ≥ 1 section
   mapping that exists in the syllabus; every x.y.z section covered or explicitly listed in
   `uncovered` with nearest-fit.
3. Reputed/official channels visibly prioritized (tier badges; official/educator first within a
   chapter when relevance ties).
4. Docs refreshed (five artifacts + this plan's stage log).

## 8. Stage log

- 2026-11-18 — Stage 0 complete: plan written and shown; proceeding to Stages 1–6 in-session.
- 2026-11-18 — Stage 1 complete: scaffold (build script + view + route + nav + `g v` + CSS +
  selftest route registration); suite 24/24 green with empty scaffold data.
- 2026-11-18 — Stage 2 complete: 8/8 waves delivered (ch1 on second attempt after a [1302]
  rate-limit failure — regrouped per parent rules, not retried into the same loaded wave).
  103 candidates total.
- 2026-11-18 — Stage 3 complete: **103/103 ids re-verified via oEmbed by the main agent**
  (0 rejections — but the ch3 agent independently caught a hallucinated StatQuest id during its
  own pass, vindicating D5). Merged + deduped + per-section capped: **87 videos, 62 channels,
  51/51 units covered, 0 honest gaps**. Tiers: 15 official / 27 educator / 12 trainer /
  8 community channels (each community pick uniquely covers a v2.0 walkthrough, the sample-exam
  solutions, an exam report, or the neuron-coverage niche).
- 2026-11-18 — Stage 4 complete. Build validation caught 2 real defects before ship: a stray
  `FULL` pseudo-section on V4-06, and `SECTION_RE` rejecting two-digit sub-numbers (`6.1.10`).
  UI bug found + fixed via headless probe: `renderList` looked up `#vidList` with
  `document.getElementById` during the initial render, while the page node was still detached —
  first paint always showed an empty list (later interactions masked it). Now the host/count
  nodes are passed in directly. Also fixed a chip-btn class-string typo (`"chip-btntrue"`).
- 2026-11-18 — Stage 5 complete: **Gate C 26/26 on http:// AND file://** (24 prior scenarios +
  "videos: tabs, tier chips and search filter the library" + "videos: every card links out
  canonically"); `build_videos.py` validation green; `probe_layout.mjs` clean on `#/videos`
  (0 missing testids, shell flush, ~15 viewports — fine for a library page).
- 2026-11-18 — Stage 6 complete: docs refreshed (this log, README, ARCHITECTURE, USERGUIDE,
  AGENTS, markdown/README registration).

## 9. Addendum v2 — user requests after first ship (2026-11-18)

Three user requests; binding decisions D7–D9 (D1 amended).

- **R1 — coverage honesty.** The page must say where NO video was found for a topic, or where the
  only coverage is thin/partial/uses industry synonyms instead of the ISTQB term, so the user knows
  what to self-study. The research waves recorded exactly this in their `gaps` arrays.
  **D7 — `coverageNotes` data**: new top-level array
  `{section, level: partial|thin|terminology, note, nearest: <videoId>}` per x.y.z unit
  (+ `EXAM` pseudo-section for exam-prep gaps). Levels: `partial` (topic only inside a broader
  video), `thin` (only very short/undated material), `terminology` (industry synonym, not the
  ISTQB term). Hard `uncovered` stays for zero-video sections (currently none). UI: a
  "Coverage notes & gaps" panel (chapter-filtered), warn-styled section chips on affected cards,
  and the header strip counts notes.
- **R2 — in-site playback.** User wants videos playable on the site AND the open-on-YouTube
  option. This amends D1: embeds are now allowed, but only as **click-to-play lazy iframes**
  (`youtube-nocookie.com/embed/<id>?autoplay=1`) created on user click — the page itself still
  loads zero network resources and stays fully usable offline (offline click → toast + open
  YouTube fallback). **D8 — the exact embed UX was debated between agents** (modal player vs
  inline card expansion vs lazy facade grid); verdict recorded in §10. Keep the secondary
  "Open on YouTube" affordance on every card and in the player.
- **R3 — card text containment.** `vid-card-V1-01` visibly overflowed. Root causes measured:
  (a) the tier chip's `data-tip` tooltip pseudo-element (carrying the long channel note) inflates
  `scrollWidth` past the card; (b) the foot caption's `-webkit-line-clamp` silently hides topics
  text with no affordance. **D9 — fixes**: the channel `note` becomes a visible, clamped caption
  line under the channel name (useful info, no tooltip); tier chip keeps only a `title` attr;
  titles/topics wrap fully with `overflow-wrap`; `min-width:0` on all flex children; a selftest
  asserts no horizontal overflow (`scrollWidth ≤ clientWidth+1`) on every card.

### v2 stages

| Stage | What | Done when |
|---|---|---|
| **v2-0** | This addendum | written + shown |
| **v2-1** | Debate fan-out: 2 advocate agents (modal player / inline expansion) + 1 judge agent ruling against site invariants | verdict in §10 |
| **v2-2** | `coverageNotes`: harvest agent gap notes → tools/videos.json, build validation, UI panel + chip markers | data + UI live, gate green |
| **v2-3** | Card containment fixes (D9) + overflow selftest | probe + suite green |
| **v2-4** | Player per verdict (D8): click-to-play, teardown, offline fallback, testids | playable in-site |
| **v2-5** | Gates: suite 26→28+, http+file, probe, screenshot check | all green |
| **v2-6** | Docs: this file §10, AGENTS, USERGUIDE, ARCHITECTURE (incl. revising the "never embed" decision text), READMEs | five-artifact rule |

### v2 stage log

- 2026-11-18 — v2-0: addendum written (D7–D9) after three user requests.
- 2026-11-18 — v2-1: debate held (2 advocates + judge, memos + verdict in /tmp/ctai-videos/);
  verdict §10: modal player + played markers, no inline iframes.
- 2026-11-18 — v2-2: 26 coverageNotes shipped (23 section-level + 3 EXAM), harvested from the
  research waves' recorded gaps; build_videos.py validates (section exists, level vocabulary,
  nearest covers the section); UI renders a chapter-scoped "Coverage notes & gaps" panel,
  warn-marked section chips on cards, and header counts.
- 2026-11-18 — v2-3: containment fixed. Root cause of the V1-01 overflow: chips.css tooltips
  (`[data-tip]::after`) inflate `scrollWidth` even while invisible — the tier chip carried the
  long channel note. Channel credentials are now a visible clamped caption; pseudo-element tips
  removed from all video-page chips (native `title` attrs remain); foot caption clamp removed;
  `min-width:0` + `overflow-wrap` added. Probe: 20/20 sampled cards overflowed before → 0 after;
  a selftest now walks every card asserting no unclipped overflow.
- 2026-11-18 — v2-4: player shipped per verdict. Detour: the judge-specified router modal-sweep
  broke the sim leave-guard (the guard's hash-revert re-render lands on the exam route and was
  sweeping its own confirm dialog away) — suite caught it; sweep now runs after the guard block
  and spares testid-less `UI.confirm` dialogs. Player: 672×378 nocookie iframe, lazy on click,
  offline toast, Close + Open on YouTube, opener refocus, Play→Replay markers (view-local).
- 2026-11-18 — v2-5: gates green — **29/29 on http:// AND file://**, probe 0 missing testids,
  player screenshot vision-checked (modal + footer buttons + intact cards behind).
- 2026-11-18 — v2-6: docs refreshed (this log, AGENTS, USERGUIDE, ARCHITECTURE embed-decision
  rewrite, READMEs, markdown/README registration).
- 2026-11-19 — v3 card design pass (user feedback on vid-card-V6-03: weak text formatting, odd
  button placement). UI principles applied — **hierarchy**: title dominant (3-line clamp);
  channel demoted to one quiet meta line (avatar + name with credential in a native tooltip +
  tier chip + duration, 20px chips); why clamped to 3 lines; topics one-line ellipsis.
  **proximity**: all metadata consolidated (published date moved into the chips row).
  **isolation + rhythm**: actions in their own divider-topped bar, primary Play flex-dominant,
  secondary YouTube compact — identical 49px bar on every card; clamped body ⇒ uniform card
  heights per grid row (314/336px groups measured). Suite 29/29 http+file, probe clean,
  vision-checked screenshot (tools/shots/videos-card-v3.jpg).
- 2026-11-19 — v4 polish (user feedback): (1) Play no longer stretches (`flex:1` dropped —
  content-sized 85px, actions right-aligned per the site's `.modal__foot` idiom); (2) the
  decorative avatar-initials box removed — channel names get the space and wrap to 2 clamped
  lines instead of truncating ("StatQuest with Josh Starmer" fully visible; credential stays in
  a native tooltip, tier color lives on the tier chip); (3) player modal upgraded to a new
  `modal--player` class (`min(1024px, 96vw)`, tight padding) — embed 672×378 → **992×558**,
  via a generic `opts.cls` hook in `UI.modal`. Suite 29/29 http+file, probe clean.
- 2026-11-19 — v5: Play label was 12px right of button center (the centered icon+gap+label
  group shifts short labels; measured on an 85px button). Dropped the play icon from the
  button — text-only label centers exactly (offset 0px, button tightened to 61px); the watched
  state still reads via the green Replay styling. Suite 29/29 http+file.

## 10. Debate verdict (v2-1, 2026-11-18)

Advocates: A = modal click-to-play (/tmp research memo), B = inline in-card expansion. Judge verified
both against the code and ruled:

**VERDICT: hybrid — modal player (A's chassis) + B's view-local played markers; NO inline iframes.**

1. The page's job is scanning 87 cards; playback is occasional. B's ~170–200px per-card height tax
   (~16,500px of scroll) buys a 169px player — inadequate for slides-heavy content. The modal gives
   ~672×378px at zero resting cost.
2. Teardown is asymmetric: modal = `scrim.remove()` + one precedented router sweep line; inline
   teardown IS the `renderList` innerHTML wipe — one search keystroke kills audio mid-play.
3. Constraint fidelity: the winning spec derives the embed URL from `v.url` (no new URL literal in
   js/), adds no persistence keys, and is the smaller diff.

Accepted weaknesses (non-disqualifying for a desktop-first file:// tool): Esc is swallowed once
focus enters the cross-origin iframe (focus opens on the wrap, so Esc works at open; Close/scrim
remain); no scroll-lock (fig-modal shares this); mobile may two-tap (the card keeps the external
Watch link). Final spec (implemented verbatim): Play/Replay button per card (`vid-play-{id}`,
`is-played` state, view-local `played{}`), `openPlayer()` → `UI.modal` (`vid-modal`) with lazy
`youtube-nocookie.com/embed` iframe (`autoplay=1&rel=0&playsinline=1`, allow fullscreen/PIP),
offline toast on `navigator.onLine === false`, footer Close (`vid-modal-close`) + Open on YouTube
(`vid-open-yt-{id}`), opener-refocus on close, and a router first-line `.modal-scrim` sweep so
route changes can never orphan audio. Suite 28→29 with a play/teardown/sweep scenario.
