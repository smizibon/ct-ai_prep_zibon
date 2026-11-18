#!/usr/bin/env python3
"""Build site/data/chapter-N.js, glossary.js, coverage.js from the syllabus + merged.json.
Mechanical generator per /tmp/site/SPEC.md (+ D1 §1/§4/§5, amendments §6E/§6F/§6J).
Verbatim policy: bodies are exact line slices; only whitelisted edit is figures/ -> assets/fig/.
"""
import json, re, sys, pathlib

MD = pathlib.Path("/Users/zibon-mac/Desktop/Certifications/CT-AI/markdown")
SITE = pathlib.Path("/Users/zibon-mac/Desktop/Certifications/CT-AI/site")
SYL = MD / "ISTQB_CT-AI_Syllabus_v2.0.md"
MERGED = (pathlib.Path(__file__).resolve().parent / "qbank" / "merged.json")
MERGED = MERGED if MERGED.exists() else pathlib.Path("/tmp/qbank/merged.json")

lines = SYL.read_text(encoding="utf-8").split("\n")          # lines[i] = line i+1
N = len(lines)

CH_RE = re.compile(r"^# (\d) (.+) – (\d+) minutes$")
SEC_RE = re.compile(r"^## (\d+\.\d+) (.+)$")
SUB_RE = re.compile(r"^### (\d+\.\d+\.\d{1,2}) (.+)$")
LO_RE = re.compile(r"^- ((?:AI|HO)-\d+\.\d+\.\d{1,2}) \((K\d|H\d)\) (.+)$")
IMG_RE = re.compile(r"!\[([^\]]*)\]\(figures/([^)]+)\)")

# ---- chapter spans --------------------------------------------------------
ch_starts = []
for i, ln in enumerate(lines):
    m = CH_RE.match(ln)
    if m:
        ch_starts.append((i + 1, int(m.group(1)), m.group(2), int(m.group(3))))
# end of chapter 7 = first "# " heading after it (chapter 8 back-matter)
def next_top_heading(after_line):
    for i in range(after_line, N):          # 0-based from line after_line+1
        if lines[i].startswith("# "):
            return i                        # 0-based index of that line
    return N
chapters_span = {}
for idx, (line, n, title, minutes) in enumerate(ch_starts):
    if n < 1 or n > 7:
        continue
    if idx + 1 < len(ch_starts):
        end = ch_starts[idx + 1][0] - 1      # last line (1-based) of this chapter
    else:
        end = next_top_heading(line)         # 0-based == 1-based next line - 1... careful
        end = end                           # next_top_heading returns 0-based idx of next '# ' line; last chapter line = that idx (1-based = idx+1, so last line = idx)
    chapters_span[n] = (line, end, title, minutes)
assert sorted(chapters_span) == [1, 2, 3, 4, 5, 6, 7], ch_starts

merged = json.loads(MERGED.read_text())
rows_by_lo = {}
for ch in merged["chapters"]:
    for row in ch["rows"]:
        rows_by_lo.setdefault(row["lo"], []).append(row)

def words(s):
    return len(re.findall(r"\w+", s))

def emit(path, js):
    path.write_text(js, encoding="utf-8")

# ---- per-chapter parse ----------------------------------------------------
out = {}
coverage_chapters = []
for n, (start, end, title, minutes) in sorted(chapters_span.items()):
    seg = lines[start - 1:end]              # 0-based slice of chapter lines
    # keywords
    def kw_after(label):
        try:
            j = seg.index(f"**{label}**")
        except ValueError:
            return []
        k = j + 1
        while k < len(seg) and not seg[k].strip():
            k += 1
        val = seg[k].strip()
        return [] if val.lower() == "none" else [x.strip() for x in val.split(",")]
    keywords = {"general": kw_after("Keywords"), "aiSpecific": kw_after("AI-Specific Keywords")}
    # LO bullets in preamble (before first ## heading)
    los = {}
    for ln in seg:
        if SEC_RE.match(ln):
            break
        m = LO_RE.match(ln)
        if m:
            los[m.group(1)] = {"k": m.group(2), "text": m.group(3).strip()}
    # headings walk
    heads = []                               # (line_no_1based, kind, id, htitle)
    for off, ln in enumerate(seg):
        absolute = start + off
        m3 = SUB_RE.match(ln)
        if m3:
            heads.append((absolute, "sub", m3.group(1), m3.group(2)))
            continue
        m2 = SEC_RE.match(ln)
        if m2:
            heads.append((absolute, "sec", m2.group(1), m2.group(2)))
    # next heading line after each: search whole file (chapter end may cut)
    def next_heading_line(after_abs):
        for i in range(after_abs, N):        # lines[i] is line i+1; start after 'after_abs' line
            if lines[i].startswith("#"):
                return i + 1                 # 1-based line number of that heading
        return N
    sections = []
    sub_units = []
    cur_sec = None
    for h in heads:
        if h[1] == "sec":
            cur_sec = {"id": h[2], "title": h[3], "intro": [], "subsections": []}
            sections.append(cur_sec)
            nxt = next_heading_line(h[0])
            # intro = lines after heading until next heading, but only if next heading is NOT a subsection of a later walk... simplest: take lines to next heading; if next is '###', those lines are the intro
            body = [x for x in lines[h[0]:nxt - 1]]
            intro_md = "\n".join(body).strip()
            cur_sec["_intro_raw"] = intro_md
        else:
            assert cur_sec is not None, f"subsection {h[2]} before any section"
            nxt = next_heading_line(h[0])
            body_md = "\n".join(lines[h[0]:nxt - 1]).strip("\n")
            sid = h[2]
            lo_id = "AI-" + sid if ("AI-" + sid) in los else ("HO-" + sid if ("HO-" + sid) in los else None)
            assert lo_id, f"no LO bullet for subsection {sid}"
            meta = los[lo_id]
            figs = []
            for m in IMG_RE.finditer(body_md):
                figs.append({"caption": m.group(1).split("—")[0].strip(), "src": "assets/fig/" + m.group(2), "alt": m.group(1)})
            body_rewritten = body_md.replace("](figures/", "](assets/fig/")
            qs = [{"q": r["q"], "pts": r["pts"], "k": r["k"], "answer": r["answer"]} for r in rows_by_lo.get(lo_id, [])]
            if meta["k"].startswith("H"):
                assert qs == [], f"hands-on {sid} has questions {qs}"
            unit = {
                "id": sid, "title": h[3], "lo": lo_id if lo_id.startswith("AI") else None,
                "ho": lo_id if lo_id.startswith("HO") else None,
                "kLevel": meta["k"], "loStatement": meta["text"],
                "examinable": lo_id.startswith("AI"), "handsOn": lo_id.startswith("HO"),
                "body": body_rewritten, "figures": figs, "questions": qs,
                "srcLines": [h[0], nxt],
            }
            cur_sec["subsections"].append(unit)
            sub_units.append(unit)
    # minutes derivation: word share, round to 5, min 5, residual to largest
    total_words = sum(words(u["body"]) for u in sub_units) or 1
    raw = [max(5.0, minutes * words(u["body"]) / total_words) for u in sub_units]
    rounded = [int(round(x / 5.0) * 5) for x in raw]
    diff = minutes - sum(rounded)
    if diff != 0:
        big = rounded.index(max(rounded))
        rounded[big] += diff - (diff % 5)
        # if still off (diff not multiple of 5) adjust by exact remainder
        rem = minutes - sum(rounded)
        if rem != 0:
            rounded[big] += rem
    for u, mm in zip(sub_units, rounded):
        u["minutes"] = mm
        u["minutesIsEstimate"] = True
    for s in sections:
        s["intro"] = [p.strip() for p in s.pop("_intro_raw").split("\n\n") if p.strip()]
    ch_obj = {"n": n, "title": title, "minutes": minutes, "keywords": keywords,
              "sections": sections, "cheatsheet": None}
    out[n] = ch_obj

    rows = next(c for c in merged["chapters"] if c["n"] == n)
    cov_secs = []
    for s in sections:
        cov_lo = []
        for u in s["subsections"]:
            cov_lo.append({
                "id": u["lo"] or u["ho"], "subsection": u["id"], "k": u["kLevel"],
                "examinable": u["examinable"], "title": u["title"], "loText": u["loStatement"],
                "minutes": u["minutes"],
                "questions": [{"q": q["q"], "pts": q["pts"], "k": q["k"]} for q in u["questions"]],
                "points": sum(q["pts"] for q in u["questions"]),
            })
        cov_secs.append({"id": s["id"], "title": s["title"], "los": cov_lo})
    coverage_chapters.append({
        "n": n, "title": title, "minutes": minutes,
        "stats": {"los": sum(len(x["los"]) for x in cov_secs),
                  "examinable": sum(1 for x in cov_secs for l in x["los"] if l["examinable"]),
                  "questions": rows["count"], "points": rows["points"]},
        "sections": cov_secs,
    })

# ---- cheatsheet injection (hand blocks + auto meta/examPointers) ----------
def auto_cheatsheet_blocks(n):
    ch = out[n]
    rows = next(c for c in merged["chapters"] if c["n"] == n)
    meta = {"type": "meta", "minutes": ch["minutes"], "questionCount": rows["count"], "points": rows["points"]}
    pointers = {"type": "examPointers", "items": []}
    for sec in ch["sections"]:
        for u in sec["subsections"]:
            if not u["examinable"]:
                continue
            pointers["items"].append({
                "lo": u["lo"], "kLevel": u["kLevel"], "loText": u["loStatement"],
                "questions": [{"q": q["q"], "pts": q["pts"]} for q in u["questions"]],
            })
    return meta, pointers

for n in range(1, 8):
    sheet_path = SITE / "tools" / "cheatsheets" / f"{n}.json"
    meta, pointers = auto_cheatsheet_blocks(n)
    if sheet_path.exists():
        hand = json.loads(sheet_path.read_text(encoding="utf-8"))
        assert hand["chapter"] == n
        blocks = [meta] + [b for b in hand["blocks"] if b["type"] not in ("meta", "examPointers")] + [pointers]
        out[n]["cheatsheet"] = {"chapter": n, "blocks": blocks}
    else:
        out[n]["cheatsheet"] = {"chapter": n, "blocks": [meta, pointers], "draft": True}

# ---- glossary -------------------------------------------------------------
def parse_table_rows(start_line, end_line):
    rows = []
    for i in range(start_line - 1, end_line):
        ln = lines[i]
        if ln.startswith("|") and not re.match(r"^\|\s*-{2,}", ln):
            cells = [c.strip() for c in ln.strip().strip("|").split("|")]
            if len(cells) >= 2 and not (cells[0] == "Term Name" or cells[0] == "Abbreviation"):
                rows.append((cells[0], cells[1]))
    return rows

# section 9: find "# 9 AI-Specific Terms" .. "# 10"
g9 = next(i + 1 for i, ln in enumerate(lines) if ln.startswith("# 9 "))
g10 = next(i + 1 for i, ln in enumerate(lines) if ln.startswith("# 10 "))
g8 = next(i + 1 for i, ln in enumerate(lines) if ln.startswith("# 8 "))
term_rows = parse_table_rows(g9, g10)
abbr_rows = parse_table_rows(g8, g9)

REF_RE = re.compile(r"\s*\((After\s+)?(ISO[^)]*|IEEE[^)]*)\)\s*$")
SYN_RE = re.compile(r"Synonym:\s*([^.;]+)")
terms = []
for term, defraw in term_rows:
    d = defraw
    refs = []
    m = REF_RE.search(d)
    if m:
        refs.append(m.group(2).strip())
        d = d[:m.start()].rstrip()
    syns = []
    sm = SYN_RE.search(d)
    if sm:
        raw_syn = sm.group(1).strip().rstrip(";")
        rm = REF_RE.search(raw_syn)
        if rm:
            raw_syn = raw_syn[:rm.start()].rstrip()
        syns = [s.strip() for s in raw_syn.split(",") if s.strip()]
        d = (d[:sm.start()] + d[sm.end():]).strip()
    terms.append({"term": term, "def": d.strip(), "synonyms": syns, "refs": refs, "abbr": []})

abbr_map = {a: e for a, e in abbr_rows}
for t in terms:
    for a, e in abbr_rows:
        if e.lower().rstrip("s") == t["term"].lower().rstrip("s") or e.lower() == t["term"].lower():
            t["abbr"].append(a)

# appearsIn: word-boundary match over subsection bodies
bodies = []
for n in range(1, 8):
    for s in out[n]["sections"]:
        for u in s["subsections"]:
            bodies.append((u["id"], u["body"]))
def appears(term, syns, abbrs):
    ids = []
    pats = []
    if len(term) >= 3:
        pats.append(re.escape(term))
    for s_ in syns:
        if len(s_) >= 3:
            pats.append(re.escape(s_))
    rx = re.compile(r"(?i)\b(" + "|".join(pats) + r")\b") if pats else None
    for a in abbrs:
        arx = re.compile(r"\b" + re.escape(a) + r"\b")
        for bid, body in bodies:
            if (rx and rx.search(body)) or arx.search(body):
                if bid not in ids:
                    ids.append(bid)
    return sorted(ids)
for t in terms:
    t["appearsIn"] = appears(t["term"], t["synonyms"], t["abbr"])

glossary = {"terms": terms, "abbreviations": abbr_map}

# ---- coverage totals ------------------------------------------------------
all_units = [u for n in range(1, 8) for s in out[n]["sections"] for u in s["subsections"]]
coverage = {
    "source": "merged.json (46 questions / 50 points)",
    "totals": {"examinableLos": sum(1 for u in all_units if u["examinable"]),
               "handsOnLos": sum(1 for u in all_units if u["handsOn"]),
               "subsections": len(all_units),
               "questions": sum(len(u["questions"]) for u in all_units),
               "points": sum(q["pts"] for u in all_units for q in u["questions"])},
    "chapters": coverage_chapters,
}

# ---- emit -----------------------------------------------------------------
for n in range(1, 8):
    js = ("window.CTAI_DATA = window.CTAI_DATA || {};\n"
          "window.CTAI_DATA.chapters = window.CTAI_DATA.chapters || {};\n"
          f"window.CTAI_DATA.chapters[{n}] = "
          + json.dumps(out[n], ensure_ascii=False, indent=1) + ";\n")
    emit(SITE / "data" / f"chapter-{n}.js", js)
emit(SITE / "data" / "glossary.js",
     "window.CTAI_DATA = window.CTAI_DATA || {};\nwindow.CTAI_DATA.glossary = "
     + json.dumps(glossary, ensure_ascii=False, indent=1) + ";\n")
emit(SITE / "data" / "coverage.js",
     "window.CTAI_DATA = window.CTAI_DATA || {};\nwindow.CTAI_DATA.coverage = "
     + json.dumps(coverage, ensure_ascii=False, indent=1) + ";\n")

# ---- self-report ----------------------------------------------------------
print("chapters:", {n: (len(out[n]["sections"]), sum(len(s['subsections']) for s in out[n]['sections'])) for n in range(1, 8)})
print("totals:", coverage["totals"])
print("glossary:", len(terms), "terms,", len(abbr_map), "abbrs")
lo_ids = {("AI-" + u["id"] if u["examinable"] else u["ho"]) for u in all_units}
assert "AI-6.1.10" in lo_ids
print("AI-6.1.10 present:", "AI-6.1.10" in lo_ids)
drafts = [n for n in range(1, 8) if out[n]["cheatsheet"].get("draft")]
print("cheatsheet drafts pending:", drafts)
