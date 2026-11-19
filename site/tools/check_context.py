#!/usr/bin/env python3
"""GATE D — folder context-file freshness (docs: ../../PLAN-context-files.md §3).

Every covered folder carries an AGENTS.md whose last line is a generated ctx block:
    <!-- ctx:v1 engine.js=162;router.js=239 -->
This tool re-counts the folder's files and compares against the block:
  - file on disk but unlisted            -> ERROR
  - listed but missing                   -> ERROR
  - missing/corrupt ctx block            -> ERROR (a stale dossier is worse than none)
  - line drift: silent <= max(5, 10%)    warn <= max(20, 20%)    error beyond
Usage: check_context.py [--update]   (--update regenerates ctx blocks from disk)
Exit 0 = pass (warnings allowed), 1 = fail. Stdlib only, mirrors verify_content.py idiom.
"""
import pathlib, re, sys

SITE = pathlib.Path(__file__).resolve().parent.parent

# folder (relative to site/) -> {ignore names, recursive}
COVERED = {
    "js": {"ignore": {"__pycache__", ".DS_Store"}, "recursive": True},  # recursive: views/*.js share this ctx block (one wiring story)
    "styles": {"ignore": set(), "recursive": False},
    "data": {"ignore": set(), "recursive": False},
    "tools": {"ignore": {"shots", "qbank", "cheatsheets", "__pycache__", ".server.pid", ".server.log", ".DS_Store"}, "recursive": True},
    "docs/plans": {"ignore": {"__pycache__", ".DS_Store"}, "recursive": False},
}
CTX_RE = re.compile(r"<!-- ctx:v1 ([^>]+?) -->\s*$")
ROW_RE = re.compile(r"^([^=;\s]+)=([\d]+)$")
EXTS = {".js", ".mjs", ".py", ".css", ".md", ".json", ".html", ".sh"}

def folder_files(cfg):
    root = SITE / cfg_key
    out = {}
    it = root.rglob("*") if cfg["recursive"] else root.iterdir()
    for f in it:
        if not f.is_file() or f.suffix not in EXTS:
            continue
        rel = f.relative_to(root).as_posix()
        if any(part in cfg["ignore"] for part in rel.split("/")[:-1]) or rel in cfg["ignore"]:
            continue
        if f.name == "AGENTS.md" and rel.count("/") == 0:
            continue  # the context file itself is never counted
        out[rel] = f.read_text(errors="replace").count("\n") + 1
    return out

def tolerance(declared):
    return max(5, round(declared * 0.10)), max(20, round(declared * 0.20))

errors, warnings = [], []
def err(msg): errors.append(msg)
def warn(msg): warnings.append(msg)

def parse_ctx(text):
    m = CTX_RE.search(text)
    if not m:
        return None
    rows = {}
    for part in m.group(1).split(";"):
        r = ROW_RE.match(part.strip())
        if not r:
            err(f"{cfg_key}/AGENTS.md: unparseable ctx row {part!r}")
            continue
        rows[r.group(1)] = int(r.group(2))
    return rows

results = {}
for cfg_key, cfg in COVERED.items():
    cfg["cfg"] = cfg_key
    actual = folder_files(cfg)
    results[cfg_key] = actual
    agents_md = SITE / cfg_key / "AGENTS.md"
    if not agents_md.exists():
        err(f"{cfg_key}: covered folder has no AGENTS.md")
        continue
    declared = parse_ctx(agents_md.read_text())
    if declared is None:
        err(f"{cfg_key}/AGENTS.md: missing ctx block (run with --update)")
        continue
    for f in sorted(set(declared) - set(actual)):
        err(f"{cfg_key}: listed but missing: {f}")
    for f in sorted(set(actual) - set(declared)):
        err(f"{cfg_key}: on disk but unlisted in ctx: {f}")
    for f in sorted(set(declared) & set(actual)):
        d, a = declared[f], actual[f]
        s_tol, w_tol = tolerance(d)
        if abs(d - a) > w_tol:
            err(f"{cfg_key}/{f}: drift {d} -> {a} lines (beyond warn tolerance)")
        elif abs(d - a) > s_tol:
            warn(f"{cfg_key}/{f}: drift {d} -> {a} lines")

def update():
    for cfg_key, cfg in COVERED.items():
        cfg["cfg"] = cfg_key
        actual = results.get(cfg_key) or folder_files(cfg)
        agents_md = SITE / cfg_key / "AGENTS.md"
        text = agents_md.read_text()
        block = "<!-- ctx:v1 " + ";".join(f"{f}={n}" for f, n in sorted(actual.items())) + " -->"
        if CTX_RE.search(text):
            text = CTX_RE.sub(lambda _: block, text)
        else:
            text = text.rstrip("\n") + "\n" + block + "\n"
        agents_md.write_text(text)
        print(f"updated {cfg_key}/AGENTS.md ctx ({len(actual)} files)")

if "--update" in sys.argv:
    # recompute fresh (results may be partial if errors occurred)
    for cfg_key, cfg in COVERED.items():
        cfg["cfg"] = cfg_key
        results[cfg_key] = folder_files(cfg)
    update()
    sys.exit(0)

for w in warnings:
    print("warn:", w)
for e in errors:
    print("ERROR:", e)
print(f"check_context: {len(errors)} error(s), {len(warnings)} warning(s) across {len(COVERED)} folders")
sys.exit(1 if errors else 0)
