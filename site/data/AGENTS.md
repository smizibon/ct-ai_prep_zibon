# data/AGENTS.md — GENERATED data globals (never hand-edit; every file is emitted by tools/)

If this disagrees with ../AGENTS.md, ../AGENTS.md wins.

## Globals (file → window.X → builder → curated source)
| chapter-1..7.js | `CTAI_DATA.chapters[n]` (study tree + cheatsheet) | tools/build_chapters.py | ../markdown syllabus + tools/cheatsheets/N.json + tools/qbank |
| glossary.js | `CTAI_DATA.glossary` + `.abbreviations` | tools/build_chapters.py | ../markdown syllabus ch.9 |
| coverage.js | `CTAI_DATA.coverage` (chapter→section→LO cross-ref) | tools/build_chapters.py | derived |
| questions.js | `CTAI_QUESTIONS` (46 UI-facing question objects) | tools/build_questions.py | ../markdown sample exam + tools/qbank records |
| intel.js | `CTAI_INTEL` (advice + patterns) | tools/build_intel.py | docs/plans/research-advice/patterns |
| videos.js | `CTAI_VIDEOS` (87 videos, 62 channels, coverageNotes) | tools/build_videos.py | tools/videos.json (oEmbed-verified) |

## Regenerate (run from site/) + verify
- content change → edit the CURATED SOURCE (markdown/ or tools/*.json), then the matching
  build_*.py; then `python3 tools/verify_content.py` (Gate A) must exit 0
- videos change → tools/videos.json → `python3 tools/build_videos.py` (validates schema +
  section mappings + coverage completeness; `--check` = validate only; note: verify_content.py
  does NOT validate videos — build_videos.py is that gate)
- after ANY regeneration: `python3 tools/check_context.py --update` (line counts change)

## Invariants
- GENERATED — hand-edits are wiped by the next build. The emitted files set globals via plain
  `<script>` tags (no fetch — file:// constraint), loaded BEFORE js/ in index.html.
- intel/videos items carry source URLs + version labels; every videos id was live-verified via
  youtube.com/oembed at curation time (D5 in docs/plans/plan-videos.md).

## Pointers (not copies)
gate ladder + rebuild block → ../AGENTS.md · content rules (verbatim slices, src-cites) → ../AGENTS.md
<!-- ctx:v1 chapter-1.js=467;chapter-2.js=302;chapter-3.js=687;chapter-4.js=482;chapter-5.js=465;chapter-6.js=586;chapter-7.js=219;coverage.js=1017;glossary.js=1135;intel.js=895;questions.js=3703;videos.js=2765 -->