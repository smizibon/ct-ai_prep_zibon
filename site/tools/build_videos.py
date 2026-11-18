#!/usr/bin/env python3
"""Emit site/data/videos.js (window.CTAI_VIDEOS) from the curated tools/videos.json.
Pipeline per docs/plans/plan-videos.md (D5/D6): every video id must already be
oEmbed-verified during curation; this script re-validates schema + syllabus section
mapping against ../markdown/ISTQB_CT-AI_Syllabus_v2.0.md (source of truth) and fails
the build on any violation. The emitted file is generated — never hand-edit it.

Usage: python3 tools/build_videos.py [--check]   (--check = validate only, no emit)
"""
import json, pathlib, re, sys

SITE = pathlib.Path(__file__).resolve().parent.parent
SRC = SITE / "tools" / "videos.json"
OUT = SITE / "data" / "videos.js"
SYLLABUS = SITE.parent / "markdown" / "ISTQB_CT-AI_Syllabus_v2.0.md"

TIERS = ["official", "educator", "trainer", "community"]
PSEUDO_SECTIONS = {"EXAM", "FULL", "SAMPLE"}  # cross-cutting exam-prep mappings (chapter 0)
VIDEO_ID_RE = re.compile(r"^[A-Za-z0-9_-]{11}$")
DURATION_RE = re.compile(r"^~?\d{1,2}(:\d{2}){1,2}$")
PUBLISHED_RE = re.compile(r"^\d{4}(-\d{2})?$")
SECTION_RE = re.compile(r"^\d\.\d+(\.\d+)?$")

def syllabus_sections():
    """({x.y.z section id: title}, {x.y.z only}) from the syllabus markdown.
    Coverage completeness (plan D3) tracks the 51 numbered units x.y.z; x.y-level
    mappings stay valid on cards but don't count toward the denominator."""
    secs = {}
    for m in re.finditer(r"^#{2,3} (\d+\.\d+(?:\.\d+)?) (.+)$", SYLLABUS.read_text(encoding="utf-8"), re.M):
        sid, title = m.group(1), m.group(2).strip()
        ch = int(sid.split(".")[0])
        if 1 <= ch <= 7:
            secs[sid] = title
    units = {s: t for s, t in secs.items() if s.count(".") == 2}
    return secs, units

def validate(data, sections, units):
    errs = []
    def check(cond, msg):
        if not cond:
            errs.append(msg)

    check(isinstance(data.get("compiled"), str) and data["compiled"], "missing compiled")
    check(isinstance(data.get("verifiedHow"), str) and data["verifiedHow"], "missing verifiedHow")
    channels = data.get("channels")
    check(isinstance(channels, dict), "channels must be an object")
    for key, ch in (channels or {}).items():
        check(bool(ch.get("name")), f"channel {key}: missing name")
        check(ch.get("tier") in TIERS, f"channel {key}: bad tier {ch.get('tier')!r}")
        check(bool(ch.get("url")), f"channel {key}: missing url")

    videos = data.get("videos")
    check(isinstance(videos, list), "videos must be a list")
    seen_ids, seen_vids = set(), set()
    for v in videos or []:
        vid = v.get("id", "?")
        check(bool(v.get("id")), "video missing id")
        check(v.get("id") not in seen_ids, f"{vid}: duplicate id"); seen_ids.add(v.get("id"))
        yid = v.get("videoId", "")
        check(bool(VIDEO_ID_RE.match(yid)), f"{vid}: bad YouTube id {yid!r}")
        check(v.get("videoId") not in seen_vids, f"{vid}: duplicate videoId {yid}"); seen_vids.add(v.get("videoId"))
        check(v.get("url") == f"https://www.youtube.com/watch?v={yid}", f"{vid}: url/videoId mismatch")
        check(bool(v.get("title")), f"{vid}: missing title")
        ck = v.get("channel")
        check(ck in (channels or {}), f"{vid}: unknown channel key {ck!r}")
        dur = v.get("duration", "")
        check(dur == "" or bool(DURATION_RE.match(dur)), f"{vid}: bad duration {dur!r}")
        pub = v.get("published", "")
        check(pub == "" or bool(PUBLISHED_RE.match(pub)), f"{vid}: bad published {pub!r}")
        chs = v.get("chapters")
        check(isinstance(chs, list) and chs, f"{vid}: chapters must be a non-empty list")
        for c in chs or []:
            check(isinstance(c, int) and 0 <= c <= 7, f"{vid}: chapter {c!r} out of 0-7")
        secs = v.get("sections")
        check(isinstance(secs, list) and secs, f"{vid}: sections must be a non-empty list")
        for s in secs or []:
            if s in PSEUDO_SECTIONS:
                check(0 in (chs or []), f"{vid}: pseudo-section {s} requires chapter 0")
            else:
                check(bool(SECTION_RE.match(s)) and s in sections, f"{vid}: unknown section {s!r}")
                if s in sections:
                    check(int(s.split(".")[0]) in (chs or []), f"{vid}: section {s} not in its chapter list")
        check(bool(v.get("why")), f"{vid}: missing why")
        check(isinstance(v.get("tags"), list) and v.get("tags"), f"{vid}: missing tags")
        check(bool(v.get("lang")), f"{vid}: missing lang")
        va = v.get("versionApplicability", "")
        check(va in ("", "v2.0", "v1.0", "both"), f"{vid}: bad versionApplicability {va!r}")

    covered = set()
    for v in videos or []:
        covered.update(s for s in v.get("sections", []) if s not in PSEUDO_SECTIONS)
    # coverage notes: honest partial/thin/terminology admissions per unit (+EXAM)
    cnotes = data.get("coverageNotes")
    check(isinstance(cnotes, list), "coverageNotes must be a list")
    ids_by_video = {v.get("id") for v in videos or []}
    for n in cnotes or []:
        s = n.get("section", "?")
        if s == "EXAM":
            pass
        else:
            check(s in units, f"coverageNote: section {s!r} is not a numbered unit (x.y.z)")
        check(n.get("level") in ("partial", "thin", "terminology"), f"coverageNote {s}: bad level {n.get('level')!r}")
        check(bool(n.get("note")), f"coverageNote {s}: missing note")
        near = n.get("nearest")
        check(near in ids_by_video, f"coverageNote {s}: nearest {near!r} is not a shipped video id")
        if near in ids_by_video and s != "EXAM":
            nv = next(v for v in videos if v["id"] == near)
            check(s in nv.get("sections", []), f"coverageNote {s}: nearest {near} does not cover {s}")
    unc = data.get("uncovered")
    check(isinstance(unc, list), "uncovered must be a list")
    for u in unc or []:
        s = u.get("section", "?")
        check(s in units, f"uncovered: section {s!r} is not a numbered unit (x.y.z)")
        check(s not in covered, f"uncovered: section {s} IS covered — remove the gap entry")
        check(bool(u.get("note")), f"uncovered {s}: missing note")
    # coverage completeness is only enforceable once curation has shipped real videos
    if videos:
        missing = sorted(s for s in units if s not in covered and s not in {u.get("section") for u in (unc or [])})
        check(not missing, f"units neither covered nor listed in uncovered: {missing}")
    return errs, covered

def main():
    check_only = "--check" in sys.argv
    data = json.loads(SRC.read_text(encoding="utf-8"))
    sections, units = syllabus_sections()
    errs, covered = validate(data, sections, units)
    if errs:
        print(f"build_videos: {len(errs)} error(s):")
        for e in errs:
            print("  -", e)
        sys.exit(1)
    n = len(data["videos"])
    chs = len(data["channels"])
    print(f"build_videos: OK — {n} videos, {chs} channels, {len([s for s in units if s in covered])}/{len(units)} units covered, "
          f"{len(data.get('uncovered', []))} honest gap(s)")
    if check_only:
        return
    tier_rank = {t: i for i, t in enumerate(TIERS)}
    data["videos"].sort(key=lambda v: (min(v["chapters"]), tier_rank.get((data["channels"].get(v["channel"]) or {}).get("tier", "community"), 3), v["id"]))
    OUT.write_text("window.CTAI_VIDEOS = " + json.dumps(data, indent=1, ensure_ascii=False) + ";\n", encoding="utf-8")
    print(f"build_videos: wrote {OUT.relative_to(SITE)}")

if __name__ == "__main__":
    main()
