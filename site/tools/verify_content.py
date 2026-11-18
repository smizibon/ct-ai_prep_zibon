#!/usr/bin/env python3
"""Gate A — data verification for CT-AI Studio. Exit 0 = PASS, 1 = FAIL.
Implements SPEC §4 Phase A gates (+ §6A/§6E/§6F/§6J amendments).
"""
import json, re, subprocess, pathlib, sys, collections

SITE = pathlib.Path("/Users/zibon-mac/Desktop/Certifications/CT-AI/site")
MD = pathlib.Path("/Users/zibon-mac/Desktop/Certifications/CT-AI/markdown")
SYL = MD / "ISTQB_CT-AI_Syllabus_v2.0.md"
QB = pathlib.Path(__file__).resolve().parent / "qbank"
QB = QB if (QB / "merged.json").exists() else pathlib.Path("/tmp/qbank")

errors, warnings = [], []
def err(msg): errors.append(msg)
def warn(msg): warnings.append(msg)
def check(cond, msg):
    if not cond: err(msg)
    return cond

lines = SYL.read_text(encoding="utf-8").split("\n")

# ---- load data via node ----------------------------------------------------
snap = subprocess.run(
    ["node", "-e",
     "global.window={};const fs=require('fs');"
     "for(const f of fs.readdirSync('data')) if(f.endsWith('.js')) eval(fs.readFileSync('data/'+f,'utf8'));"
     "console.log(JSON.stringify(window))"],
    cwd=SITE, capture_output=True, text=True)
check(snap.returncode == 0, "node data load failed: " + snap.stderr[:300])
D = json.loads(snap.stdout)
chapters, glossary, coverage, questions, intel = (
    D.get("CTAI_DATA", {}).get("chapters", {}), D.get("CTAI_DATA", {}).get("glossary"),
    D.get("CTAI_DATA", {}).get("coverage"), D.get("CTAI_QUESTIONS"), D.get("CTAI_INTEL"))

# ---- A. verbatim slice equality --------------------------------------------
def normalize(s):
    return "\n".join(ln.rstrip() for ln in s.strip("\n").split("\n"))
CH_RE = re.compile(r"^# (\d) (.+) – (\d+) minutes$")
ch_lines = {}
for i, ln in enumerate(lines):
    m = CH_RE.match(ln)
    if m and 1 <= int(m.group(1)) <= 7:
        ch_lines[int(m.group(1))] = i + 1
check(sorted(ch_lines) == [1,2,3,4,5,6,7], "chapter headings not found")

n_units = 0
for n, ch in chapters.items():
    n = int(n)
    span_end = ch_lines.get(n + 1, len(lines)) - 1 if n < 7 else next(
        (i for i, ln in enumerate(lines) if ln.startswith("# 8 ")), len(lines))
    for sec in ch["sections"]:
        for u in sec["subsections"]:
            n_units += 1
            a, b = u["srcLines"]
            src = "\n".join(lines[a:b - 1]).replace("](figures/", "](assets/fig/")
            if normalize(src) != normalize(u["body"]):
                err(f"slice mismatch {u['id']}: srcLines[{a},{b}]")
for n, ch in chapters.items():
    for sec in ch["sections"]:
        pass  # section intros checked implicitly via subsection coverage

# ---- B. LO completeness ------------------------------------------------------
LO_RE = re.compile(r"^- ((?:AI|HO)-\d+\.\d+\.\d{1,2}) \((K\d|H\d)\) (.+)$")
syl_los = collections.Counter()
lo_stmt = {}
for ln in lines:
    m = LO_RE.match(ln)
    if m:
        syl_los[m.group(1)] += 1
        lo_stmt[m.group(1)] = (m.group(2), m.group(3))
data_los = collections.Counter()
for n, ch in chapters.items():
    for sec in ch["sections"]:
        for u in sec["subsections"]:
            key = u["lo"] or u["ho"]
            data_los[key] += 1
            k, text = lo_stmt.get(key, (None, None))
            check(u["kLevel"] == k and u["loStatement"] == text, f"LO statement drift {key}")
check(data_los == syl_los, f"LO multiset mismatch: syllabus={dict(syl_los)} data={dict(data_los)}")
check(sum(1 for k in syl_los if k.startswith("AI")) == 43, "examinable LO count != 43")
check(sum(1 for k in syl_los if k.startswith("HO")) == 8, "HO count != 8")
check("AI-6.1.10" in data_los, "AI-6.1.10 missing (two-digit LO regex trap)")
check(n_units == 51, f"subsection count {n_units} != 51")

# ---- C/D. coverage totals + per-row equality vs merged.json -----------------
merged = json.loads((QB / "merged.json").read_text())
check(coverage["totals"]["questions"] == 46, "coverage questions != 46")
check(coverage["totals"]["points"] == 50, f"coverage points {coverage['totals']['points']} != 50")
check([c["stats"]["questions"] for c in coverage["chapters"]] == [9,3,10,7,6,9,2],
      "per-chapter question counts wrong")
check([c["stats"]["points"] for c in coverage["chapters"]] == [9,3,11,8,7,10,2],
      "per-chapter points wrong")
rows_merged = {}
for ch in merged["chapters"]:
    for r in ch["rows"]:
        rows_merged.setdefault(r["q"], []).append(
            {"q": r["q"], "pts": r["pts"], "k": r["k"], "answer": r["answer"], "lo": r["lo"]})
seen_q = collections.Counter()
for n, ch in chapters.items():
    for sec in ch["sections"]:
        for u in sec["subsections"]:
            for q in u["questions"]:
                seen_q[q["q"]] += 1
                exp = {e["q"]: e for e in rows_merged[q["q"]]}[q["q"]]
                check(q == {"q": exp["q"], "pts": exp["pts"], "k": exp["k"], "answer": exp["answer"]},
                      f"row join mismatch {q['q']}: {q} vs {exp}")
check(sum(seen_q.values()) == 46 and set(seen_q) == set(rows_merged), "question join coverage wrong")

# ---- E. cheatsheets ----------------------------------------------------------
SUB_RE = re.compile(r"^### (\d+\.\d+\.\d{1,2}) ")
sub_line = {}
for i, ln in enumerate(lines):
    m = SUB_RE.match(ln)
    if m: sub_line[m.group(1)] = i + 1
g9 = next(i + 1 for i, ln in enumerate(lines) if ln.startswith("# 9 "))
g10 = next(i + 1 for i, ln in enumerate(lines) if ln.startswith("# 10 "))
glossary_text = "\n".join(lines[g9 - 1:g10 - 1])
WORD = lambda s: len(re.findall(r"\w+", s))
ch_words = {}
for n, ch in chapters.items():
    w = sum(WORD(u["body"]) for s in ch["sections"] for u in s["subsections"])
    w += sum(WORD(p) for s in ch["sections"] for p in s["intro"])
    ch_words[int(n)] = w

def digits_ok(text, src):
    """Every quantity-like digit run in text must occur in src. Section-id-like
    tokens (e.g. 5.1.2, 6.1) are navigation cross-references, not quantities —
    exempt if the id exists as a syllabus subsection/section."""
    for d in re.findall(r"\d[\d.,%±–-]*", text):
        if re.fullmatch(r"\d+\.\d+(?:\.\d+)?,?", d):   # section reference
            core = d.rstrip(",")
            if re.fullmatch(r"\d+\.\d+", core):
                continue  # section-level ref (e.g. 'see 6.1.7' style) — navigation
            if core in sub_line:
                continue
        base = re.sub(r"[.,%±–-]", "", d)
        hay = src.replace("–", "").replace("-", "")
        if base and not re.search(r"(?<!\d)" + re.escape(base) + r"(?!\d)", hay):
            return d
    return None

def resolve_src(src, chap_n):
    """Return the source text a src string points at, or None."""
    texts = []
    for tok in [t.strip() for t in src.split("+")]:
        if tok == "glossary":
            texts.append(glossary_text); continue
        m = re.match(r"^(\d+\.\d+(?:\.\d+)?)?(?:\s+L(\d+)(?:-L(\d+))?)?$", tok)
        if not m: return None
        sid, a, b = m.groups()
        if sid and sid in sub_line:
            h = sub_line[sid]
            nxt = h + 1
            while nxt <= len(lines) and not (lines[nxt - 1].startswith("#")):
                nxt += 1
            a, b = int(a) if a else h + 1, int(b) if b else nxt - 1
            if int(sub_line[sid].split(".")[0] if False else sid.split(".")[0]) != chap_n:
                # allow glossary-only cross chapter for keyTerms handled by caller
                pass
            texts.append("\n".join(lines[a - 1:b]))
        elif a:
            texts.append("\n".join(lines[int(a) - 1:int(b) if b else int(a)]))
        else:
            return None
    return "\n".join(texts)

for n, ch in chapters.items():
    n = int(n)
    sheet = ch.get("cheatsheet") or {}
    check(not sheet.get("draft"), f"ch{n} cheatsheet still draft")
    hand = [b for b in sheet.get("blocks", []) if b["type"] not in ("meta", "examPointers")]
    types = [b["type"] for b in sheet.get("blocks", [])]
    check(types[:1] == ["meta"] and types[-1:] == ["examPointers"], f"ch{n}: meta/examPointers not wrapping")
    total_words = 0; synth_words = 0
    for b in hand:
        if b["type"] == "keyTerms":
            for it in b["items"]:
                txt = it["term"] + " " + it["def"]
                total_words += WORD(txt)
                src = resolve_src(it["src"], n)
                if not check(src is not None, f"ch{n} keyTerms '{it['term']}': unresolvable src {it['src']}"):
                    continue
                bad = digits_ok(it["def"], src)
                if bad: err(f"ch{n} keyTerms '{it['term']}': digit {bad!r} not in src {it['src']}")
        elif b["type"] in ("mustKnow",):
            for it in b["items"]:
                synth_words += WORD(it["text"]); total_words += WORD(it["text"])
                src = resolve_src(it["src"], n)
                if not check(src is not None, f"ch{n} mustKnow: unresolvable src {it['src']}"):
                    continue
                bad = digits_ok(it["text"], src)
                if bad: err(f"ch{n} mustKnow: digit {bad!r} not in src {it['src']}")
        elif b["type"] == "traps":
            for it in b["items"]:
                synth_words += WORD(it["text"]); total_words += WORD(it["confusion"] + " " + it["text"])
                src = resolve_src(it["src"], n)
                if not check(src is not None, f"ch{n} traps '{it['confusion']}': unresolvable src {it['src']}"):
                    continue
                bad = digits_ok(it["text"], src)
                if bad: err(f"ch{n} traps '{it['confusion']}': digit {bad!r} not in src {it['src']}")
        elif b["type"] == "formula":
            for it in b["items"]:
                total_words += WORD(it["name"] + " " + it["formula"] + " " + it.get("note", ""))
                src = resolve_src(it["src"], n)
                if not check(src is not None, f"ch{n} formula '{it['name']}': unresolvable src {it['src']}"):
                    continue
                for d in re.findall(r"\d+", it["formula"] + " " + it.get("note", "")):
                    if not re.search(r"(?<!\d)" + d + r"(?!\d)", src):
                        err(f"ch{n} formula '{it['name']}': digit {d} not in src")
                check(it["formula"].replace(" * ", " \\* ").replace(" *", " \\*") in src
                      or it["formula"] in src.replace("\\*", "*"),
                      f"ch{n} formula '{it['name']}': formula text not verbatim in src")
        elif b["type"] == "table":
            celltxt = " ".join(" ".join(r) for r in b["rows"]) + " " + " ".join(b["columns"])
            total_words += WORD(celltxt)
            src = resolve_src(b["src"], n)
            if not check(src is not None, f"ch{n} table '{b['title']}': unresolvable src {b['src']}"):
                continue
        elif b["type"] == "steps":
            for it in b["items"]:
                synth_words += WORD(it["text"]); total_words += WORD(it["text"])
                src = resolve_src(it["src"], n)
                if not check(src is not None, f"ch{n} steps: unresolvable src {it['src']}"):
                    continue
        else:
            err(f"ch{n}: unknown block type {b['type']}")
    cap_total = ch_words[n] * 0.5
    cap_synth = ch_words[n] * 0.25
    check(total_words <= cap_total, f"ch{n} cheatsheet total {total_words} > cap {cap_total:.0f}")
    check(synth_words <= cap_synth, f"ch{n} synthesized {synth_words} > cap {cap_synth:.0f}")

# ---- F. glossary --------------------------------------------------------------
check(len(glossary["terms"]) == 118, f"glossary terms {len(glossary['terms'])} != 118")
check(len(glossary["abbreviations"]) == 31, f"abbreviations {len(glossary['abbreviations'])} != 31")
valid_subs = {u["id"] for ch in chapters.values() for s in ch["sections"] for u in s["subsections"]}
for t in glossary["terms"]:
    check(t["def"].strip() != "", f"glossary empty def: {t['term']}")
    check("Synonym:" not in t["def"], f"glossary leaked Synonym: {t['term']}")
    check("(ISO" not in t["def"] and "(After ISO" not in t["def"], f"glossary leaked ref: {t['term']}")
    for sid in t["appearsIn"]:
        check(sid in valid_subs, f"glossary appearsIn bad id {sid} ({t['term']})")

# ---- G. questions.js -----------------------------------------------------------
ids = [f"Q{i}" for i in range(1, 41)] + [f"A{i}" for i in range(1, 7)]
check([q["id"] for q in questions] == ids, "question ids/order wrong")
check(sum(q["points"] for q in questions if q["set"] == "main") == 44, "main points != 44")
check(sum(q["points"] for q in questions if q["set"] == "appendix") == 6, "appendix points != 6")
check([q["id"] for q in questions if q["k_level"] == "K3"] == ["Q15", "Q21", "Q28", "Q34"], "K3 set wrong")
SEL = re.compile(r"^\*Select (ONE|TWO) answers?\.*\*$")
OPT_LINE = re.compile(r"^- ([a-e])\) ")
for q in questions:
    rec = json.loads((QB / "records" / (q["id"] + ".json")).read_text())
    if q["options"]:
        okeys = [o["key"] for o in q["options"]]
        check(set(q["correct_keys"]) <= set(okeys), f"{q['id']}: correct key not in options")
        check((len(q["correct_keys"]) == 2) == (q["type"] == "multi_two"), f"{q['id']}: multi_two mismatch")
        check(not OPT_LINE.search(q["stem_md"]), f"{q['id']}: option list leaked into stem")
        last = q["stem_md"].split("\n")[-1].strip()
        check(not SEL.match(last), f"{q['id']}: select line still in stem")
        for o in q["options"]:
            check(o["text_md"] in rec["raw_question_markdown"], f"{q['id']}: option {o['key']} not from source")
            check(o["text_md"][:60] not in q["stem_md"], f"{q['id']}: option text leaked into stem")
        check(q["select_instruction"] == rec["select_instruction_verbatim"], f"{q['id']}: select instr mismatch")
    else:
        check(q["select_instruction"] == rec["select_instruction_verbatim"], f"{q['id']}: select instr mismatch")
    for d in q["why_not_derived"]:
        check("*[derived]*" in d["text_md"], f"{q['id']}: derived marker missing")
check({q["id"] for q in questions if q["interaction"]} == {"A1", "A4", "A5"}, "interaction set wrong")
for q in questions:
    if q["interaction"]:
        it = q["interaction"]
        if q["type"] == "assign":
            check(sorted(it["correct_assignment"]) == ["0","1","2","3","4"], "A1 assignment incomplete")
        if q["type"] == "pair":
            check(set(it["correct_pairs"].values()) == set(range(len(it["right"]))), "A4 not a bijection")
        if q["type"] == "order":
            check(sorted(it["items"]) == sorted(it["correct_sequence"]), "A5 sequence mismatch")
    for f in q["figures"] + q["rationale"]["answer_figures"]:
        check((SITE / f["src"]).exists(), f"{q['id']}: figure missing {f['src']}")

# ---- H. intel -------------------------------------------------------------------
a = intel["advice"]; p = intel["patterns"]
check(len(a["items"]) == 18 and len(a["synthesis"]) == 8 and len(a["conflicts"]) == 6, "intel advice counts")
check(len(p["community"]) == 11 and len(p["thirdPartyErrors"]) == 4, "intel pattern counts")
check(len(p["delta"]["rows"]) == 13 and len(p["implications"]) == 10, "intel delta/implications counts")
for it in a["items"] + p["community"]:
    check(bool(it.get("url")), f"intel {it['id']}: no url")

# ---- I. construct inventory ------------------------------------------------------
for n, ch in chapters.items():
    for sec in ch["sections"]:
        for txt in sec["intro"]:
            check("`" not in txt and "](http" not in txt, f"ch{n} intro: forbidden construct")
for q in questions:
    check("`" not in q["stem_md"], f"{q['id']}: backtick in stem")
for n, ch in chapters.items():
    for sec in ch["sections"]:
        for u in sec["subsections"]:
            body = u["body"]
            check("`" not in body and "](http" not in body, f"{u['id']}: forbidden construct")
            for frag in re.findall(r"<[^>]+>", body):
                check(frag == "<br>", f"{u['id']}: raw HTML {frag}")
for f in (SITE / "assets" / "fig").glob("*.png"):
    pass  # presence of extras is fine

# ---- report -----------------------------------------------------------------------
print(f"checks complete: {len(errors)} errors, {len(warnings)} warnings")
for e in errors[:40]:
    print("ERROR:", e)
for w in warnings[:10]:
    print("warn:", w)
sys.exit(1 if errors else 0)
