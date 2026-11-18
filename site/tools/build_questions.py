#!/usr/bin/env python3
"""Build site/data/questions.js from /tmp/qbank records per SPEC §2/§6A and D2 §5.
Also copies exam figures into site/assets/fig/. Fails loudly on any gate violation.
"""
import json, re, shutil, pathlib

QB = pathlib.Path(__file__).resolve().parent / "qbank"
QB = QB if (QB / "merged.json").exists() else pathlib.Path("/tmp/qbank")
SITE = pathlib.Path("/Users/zibon-mac/Desktop/Certifications/CT-AI/site")
FIGSRC = pathlib.Path("/Users/zibon-mac/Desktop/Certifications/CT-AI/markdown/figures")
FIGDST = SITE / "assets" / "fig"
FIGDST.mkdir(parents=True, exist_ok=True)

merged = json.loads((QB / "merged.json").read_text())
derived = json.loads((QB / "derived.json").read_text())

ch_of, title_of = {}, {}
for ch in merged["chapters"]:
    title_of[ch["n"]] = ch["title"]
    for q in ch["order"]:
        ch_of[q] = ch["n"]

ids = [f"Q{i}" for i in range(1, 41)] + [f"A{i}" for i in range(1, 7)]
OPT_LINE = re.compile(r"^- ([a-e])\) ")
SELECT_LINE = re.compile(r"^\*Select (ONE|TWO) answers?\.*\*$")

out = []
copied = set()
for qid in ids:
    r = json.loads((QB / "records" / f"{qid}.json").read_text())
    a = r["answer"]
    lettered = r["options"] is not None
    stem = r["stem_markdown"]
    sel = r["select_instruction_verbatim"]

    if lettered:
        # strip trailing select-instruction paragraph
        lines = stem.rstrip("\n").split("\n")
        while lines and not lines[-1].strip():
            lines.pop()
        assert lines and SELECT_LINE.match(lines[-1].strip()), f"{qid}: no trailing select line"
        assert lines[-1].strip() == sel, f"{qid}: select line mismatch {lines[-1]!r} vs {sel!r}"
        lines.pop()
        while lines and not lines[-1].strip():
            lines.pop()
        # strip trailing lettered options block (first OPT_LINE match must be inside the tail)
        idxs = [i for i, ln in enumerate(lines) if OPT_LINE.match(ln)]
        assert idxs, f"{qid}: no option lines found in stem"
        first = idxs[0]
        block = lines[first:]
        starts = [i for i, ln in enumerate(block) if OPT_LINE.match(ln)]
        assert len(starts) == len(r["options"]), f"{qid}: {len(starts)} option lines vs {len(r['options'])} options"
        # every non-empty non-start line in block is a continuation (indented, not a new structural line)
        for i, ln in enumerate(block):
            if i in starts or not ln.strip():
                continue
            assert not re.match(r"^([-#*|]|\d+\.)", ln), f"{qid}: structural line inside options block: {ln!r}"
        stem_md = "\n".join(lines[:first]).rstrip()
        # no option text may remain in stem
        for o in r["options"]:
            assert o["text"][:60] not in stem_md, f"{qid}: option {o['key']} text leaked into stem"
        assert not SELECT_LINE.match(stem_md.split("\n")[-1].strip()) if stem_md else True
    else:
        stem_md = stem.rstrip("\n")
        if sel:
            # strip one trailing select-instruction paragraph if present
            sl = stem_md.split("\n")
            while sl and not sl[-1].strip():
                sl.pop()
            if sl and sl[-1].strip() == sel:
                sl.pop()
                stem_md = "\n".join(sl).rstrip()
    # figure path rewrite inside stems (whitelisted)
    stem_md = stem_md.replace("](figures/", "](assets/fig/")

    def fig_obj(f):
        src = "assets/fig/" + pathlib.Path(f["path"]).name
        dst = FIGDST / pathlib.Path(f["path"]).name
        if dst.exists() or (FIGSRC / pathlib.Path(f["path"]).name).exists():
            shutil.copyfile(FIGSRC / pathlib.Path(f["path"]).name, dst)
            copied.add(pathlib.Path(f["path"]).name)
        return {"src": src, "alt": f.get("alt", ""), "note": f.get("note"),
                "transcription": f.get("transcription")}

    figures = [fig_obj(f) for f in r.get("figures", [])]
    answer_figures = [fig_obj(f) for f in a.get("answer_figures", [])]

    # type
    if lettered:
        qtype = "multi_two" if len(a["correct_keys"]) == 2 else "single"
    else:
        qtype = {"assign_categories": "assign", "drag_pair": "pair",
                 "order_sequence": "order"}[r["selection_mode"]]

    lo = a["lo_key"]
    lo_note = None
    if a.get("lo_conflict"):
        lo_note = ("Answer-key table: " + a["lo_key"] + "; section metadata: " + a["lo_section"] +
                   " (5.1.7 exists in the syllabus only as the hands-on objective HO-5.1.7)")

    interaction = None
    if qtype == "assign":
        cats = [i["text"] for s in r["item_sets"] if s["role"] == "category_list" for i in s["items"]]
        stmts = [i["text"] for s in r["item_sets"] if s["role"] == "statements" for i in s["items"]]
        assign = {}
        for grp in a["new_type_answer"]["assignments"]:
            for item in grp["items"]:
                hits = [k for k, s in enumerate(stmts) if item[:40] == s[:40]]
                assert len(hits) == 1, f"A1: ambiguous statement match for {item[:40]!r}"
                assign[str(hits[0])] = grp["category"]
        assert sorted(assign) == ["0", "1", "2", "3", "4"] and set(assign.values()) <= set(cats)
        interaction = {"statements": stmts, "categories": cats,
                       "correct_assignment": assign, "derived_from_answer_figure": True,
                       "answer_figure": "assets/fig/answers_p32.png"}
    elif qtype == "pair":
        left = [i["text"] for s in r["item_sets"] if s["role"] == "match_left" for i in s["items"]]
        right = [i["text"] for s in r["item_sets"] if s["role"] == "match_right" for i in s["items"]]
        # Derivation (documented in the transcription Note): the answer figure uses different
        # wording/examples for 3 of 4 forms. Regression matches verbatim; the Note states
        # "Association → fault logs …, Classification → bank transactions …"; RL's example is the
        # same robotic-arm trial-and-error scenario rephrased. Resolve by distinctive keyword,
        # asserting a unique bijection.
        correct = {}
        used_right = set()
        for p in a["new_type_answer"]["pairs"]:
            hits = [k for k, s in enumerate(right) if p["example"][:40] == s[:40]]
            if hits:
                correct[p["form"]] = hits[0]
                used_right.add(hits[0])
        remaining = [k for k in range(len(right)) if k not in used_right]
        KEY = {"Association": "fault", "Classification": "bank", "Reinforcement Learning": "robotic arm"}
        for form, frag in KEY.items():
            if form in correct:
                continue
            hits = [k for k in remaining if frag in right[k]]
            assert len(hits) == 1, f"A4: cannot resolve {form} via {frag!r}; remaining={remaining}"
            correct[form] = hits[0]
            remaining.remove(hits[0])
        assert sorted(correct) == sorted(left) and set(correct.values()) == set(range(len(right)))
        note_txt = ""
        for f in answer_figures:
            m = re.search(r"Note:.*$", f.get("transcription") or "", re.S)
            if m:
                note_txt = m.group(0).rstrip(")*").strip()
                break
        assert note_txt, "A4: derivation note not found in transcription"
        interaction = {"left": left, "right": right, "correct_pairs": correct,
                       "derivation_note": note_txt, "derived_from_answer_figure": True,
                       "answer_figure": "assets/fig/answers_p35.png"}
    elif qtype == "order":
        items = re.findall(r"^- (.+)$", stem_md.split("*(from figure")[0], re.M)
        # items live after the figure embed; parse bullets from the stem body
        items = re.findall(r"^- (.+)$", stem_md, re.M)
        seq = a["new_type_answer"]["ordered"]
        assert sorted(items) == sorted(seq), f"A5: stem bullets {items} != key {seq}"
        interaction = {"items": items, "axis": {"start": "EARLIER", "end": "LATER"},
                       "correct_sequence": seq, "derived_from_answer_figure": True,
                       "answer_figure": "assets/fig/answers_p36.png",
                       "explanation_figure": "assets/fig/answers_p37.png"}

    qobj = {
        "id": qid,
        "set": "main" if qid.startswith("Q") else "appendix",
        "number": int(qid[1:]), "label": ("Question " if qid[0] == "Q" else "Appendix Question ") + qid[1:],
        "chapter": ch_of[qid], "chapter_title": title_of[ch_of[qid]],
        "lo": lo, "lo_note": lo_note, "k_level": a["k_level"], "points": r["points"],
        "type": qtype,
        "stem_md": stem_md,
        "options": [{"key": o["key"], "text_md": o["text"]} for o in r["options"]] if lettered else None,
        "select_instruction": sel,
        "figures": figures,
        "correct_keys": a["correct_keys"],
        "rationale": {
            "preamble_md": a.get("preamble_markdown"),
            "units": [{"key": u["key"], "verdict": u["verdict"],
                       "verdict_phrase": u.get("verdict_phrase"), "text_md": u["text"]}
                      for u in a.get("rationale_units", [])],
            "conclusion_md": a.get("conclusion_markdown"),
            "answer_figures": answer_figures,
        },
        "why_not_derived": [{"key": k, "text_md": v} for k, v in (derived.get(qid) or {}).items()],
        "interaction": interaction,
        "source_refs": {
            "questions_md": "ISTQB_CTAI_v2.0_SampleExam-Questions-v2.2.md#question-" + qid[1:].lower(),
            "answers_md": "ISTQB_CTAI_v2.0_SampleExam-Answers-v2.2.md#question-" + qid[1:].lower(),
            "record": f"/tmp/qbank/records/{qid}.json",
        },
        "quirks": r.get("quirks", []) + a.get("quirks", []),
    }
    if lettered:
        okeys = [o["key"] for o in qobj["options"]]
        assert set(qobj["correct_keys"]) <= set(okeys), f"{qid}: correct key not in options"
        assert (len(qobj["correct_keys"]) == 2) == (qtype == "multi_two")
        for o in r["options"]:
            assert o["text"] in r["raw_question_markdown"], f"{qid}: option text not from source"
    out.append(qobj)

# ---- global gates ---------------------------------------------------------
assert len(out) == 46
assert [q["id"] for q in out] == ids
assert sum(q["points"] for q in out if q["set"] == "main") == 44
assert sum(q["points"] for q in out if q["set"] == "appendix") == 6
assert [q["id"] for q in out if q["k_level"] == "K3"] == ["Q15", "Q21", "Q28", "Q34"]
assert {q["id"] for q in out if q["interaction"]} == {"A1", "A4", "A5"}
assert set(derived) == {"Q6", "Q7", "Q10", "Q11", "Q17", "Q30"}
for q in out:
    for d in q["why_not_derived"]:
        assert d["key"] in [o["key"] for o in q["options"]] if q["options"] else False, \
            f"{q['id']}: derived key {d['key']} has no option"
        assert "*[derived]*" in d["text_md"]
# figure files all exist
need = {"questions_p14_Q15.png", "questions_p26_A1.png", "questions_p27_A4.png",
        "questions_p28_A5.png", "answers_p32.png", "answers_p35.png", "answers_p36.png", "answers_p37.png"}
assert need <= copied, f"missing figure copies: {need - copied}"
for f in need:
    assert (FIGDST / f).exists(), f

js = ("window.CTAI_QUESTIONS = " + json.dumps(out, ensure_ascii=False, indent=1) + ";\n")
(SITE / "data" / "questions.js").write_text(js, encoding="utf-8")
print("questions.js:", len(out), "objects |", sum(q['points'] for q in out), "points |",
      "figures copied:", sorted(copied))
print("K3:", [q["id"] for q in out if q["k_level"] == "K3"])
print("multi_two:", [q["id"] for q in out if q["type"] == "multi_two"])
print("interactions:", {q["id"]: q["type"] for q in out if q["interaction"]})
