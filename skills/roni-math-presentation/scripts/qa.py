#!/usr/bin/env python3
"""
qa.py — the mechanical half of the delivery checklist, run against the .pptx
itself. It cannot judge pedagogy; it catches the failures that are invisible
until a teacher opens the file in front of a class.

    python3 qa.py deck.pptx
    python3 qa.py deck.pptx --anim        # also require animations on content slides
    python3 qa.py deck.pptx --strict      # warnings become failures

Checks:
  bidi      Hebrew mixed with Latin/digits and NOT wrapped in LRE…PDF
            (this is the bug that silently prints 24:6+5×3 backwards)
  bounds    anything drawn off the slide, or bleeding past the edge
  density   too much text or too many objects on one slide
  legible   font sizes too small to read from the back row
  fonts     anything that is not a font every school laptop has
  notes     a slide with no Teacher Action / Student Thinking
  anim      slides with no reveal steps (with --anim)
  weight    file size, image resolution, unused media
"""

import argparse
import html
import re
import sys
import zipfile
from collections import Counter, defaultdict

EMU_IN = 914400
SLIDE_W, SLIDE_H = 13.333, 7.5          # LAYOUT_WIDE
SAFE_FONTS = {"Arial", "Calibri", "Tahoma", "Times New Roman", "Verdana",
              "Segoe UI", "David", "Courier New", "+mn-lt", "+mj-lt"}

HEB = re.compile(r"[֐-׿]")
LAT = re.compile(r"[A-Za-z0-9]")
LRE = "‪"
SLIDE_RE = re.compile(r"ppt/slides/slide(\d+)\.xml$")

T_RE = re.compile(r"<a:t>(.*?)</a:t>", re.S)
SZ_RE = re.compile(r'sz="(\d+)"')
FONT_RE = re.compile(r'typeface="([^"]+)"')
OFF_RE = re.compile(r'<a:off x="(-?\d+)" y="(-?\d+)"/><a:ext cx="(\d+)" cy="(\d+)"/>')
SP_RE = re.compile(r"<p:sp>|<p:pic>|<p:graphicFrame>")
CHROME_RE = re.compile(r'<p:sp>(?:(?!</p:sp>).)*?name="chrome[^"]*"(?:(?!</p:sp>).)*?</p:sp>', re.S)


class Report:
    def __init__(self):
        self.fail, self.warn = [], []

    def f(self, slide, msg): self.fail.append((slide, msg))
    def w(self, slide, msg): self.warn.append((slide, msg))


def slide_no(name):
    m = SLIDE_RE.search(name)
    return int(m.group(1)) if m else 0


def check_slide(n, xml, rep, require_anim):
    """Page furniture (objectName "chrome…") is deliberately small — skip it."""
    xml_body = CHROME_RE.sub("", xml)
    texts = [html.unescape(re.sub(r"<[^>]+>", "", t)) for t in T_RE.findall(xml_body)]
    joined = " ".join(texts)

    # --- bidi ------------------------------------------------------------
    for t in texts:
        if HEB.search(t) and LAT.search(t) and LRE not in t:
            rep.f(n, f'bidi: "{t.strip()[:60]}" mixes Hebrew and Latin/digits '
                     f"without LRE…PDF — run it through pmx()")

    # --- density ---------------------------------------------------------
    chars = len(joined)
    if chars > 320:
        rep.f(n, f"density: {chars} characters on one slide — split it "
                 f"(3 simple slides beat 1 crowded one)")
    elif chars > 220:
        rep.w(n, f"density: {chars} characters — is every word earning its place?")

    objs = len(SP_RE.findall(xml_body))
    if objs > 45:
        rep.w(n, f"density: {objs} objects — check there is one visual focus")

    # --- legibility ------------------------------------------------------
    sizes = [int(s) / 100 for s in SZ_RE.findall(xml_body)]
    tiny = [s for s in sizes if s < 12]
    if tiny:
        rep.f(n, f"legibility: text at {min(tiny):g}pt — unreadable from the back row")
    small = [s for s in sizes if 12 <= s < 14]
    if small:
        rep.w(n, f"legibility: text at {min(small):g}pt — fine for axis numbers, "
                 f"too small for anything a student must read")

    # --- fonts -----------------------------------------------------------
    for f in set(FONT_RE.findall(xml_body)):
        if f not in SAFE_FONTS:
            rep.f(n, f'font: "{f}" is not a font every school laptop has')

    # --- bounds ----------------------------------------------------------
    for x, y, cx, cy in OFF_RE.findall(xml_body):
        x, y, cx, cy = (int(v) / EMU_IN for v in (x, y, cx, cy))
        if x < -0.02 or y < -0.02:
            rep.f(n, f"bounds: object starts off-slide at ({x:.2f}\", {y:.2f}\")")
        elif x + cx > SLIDE_W + 0.02 or y + cy > SLIDE_H + 0.02:
            rep.f(n, f"bounds: object ends at ({x+cx:.2f}\", {y+cy:.2f}\") — "
                     f"past the {SLIDE_W}×{SLIDE_H} slide edge")

    # --- animation -------------------------------------------------------
    has_timing = "<p:timing>" in xml and "mainSeq" in xml
    if require_anim and not has_timing and chars > 40:
        rep.w(n, "no reveal steps — is this slide really meant to appear all at once?")
    return has_timing


def main():
    ap = argparse.ArgumentParser(description=__doc__,
                                 formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("pptx")
    ap.add_argument("--anim", action="store_true", help="expect reveal steps on content slides")
    ap.add_argument("--strict", action="store_true", help="treat warnings as failures")
    args = ap.parse_args()

    rep = Report()
    animated = []
    with zipfile.ZipFile(args.pptx) as z:
        names = z.namelist()
        slides = sorted((f for f in names if SLIDE_RE.search(f)), key=slide_no)
        if not slides:
            raise SystemExit("no slides found — is this a .pptx?")

        rels = {}
        for f in names:
            if f.startswith("ppt/slides/_rels/"):
                rels[f] = z.read(f).decode("utf-8", "replace")

        for f in slides:
            n = slide_no(f)
            if check_slide(n, z.read(f).decode("utf-8", "replace"), rep, args.anim):
                animated.append(n)

            notes_rel = f"ppt/slides/_rels/slide{n}.xml.rels"
            note_part = f"ppt/notesSlides/notesSlide{n}.xml"
            has_notes = note_part in names and "notesSlide" in rels.get(notes_rel, "")
            if has_notes:
                body = z.read(note_part).decode("utf-8", "replace")
                if "Teacher Action" not in body or "Student Thinking" not in body:
                    rep.w(n, "notes: missing Teacher Action / Student Thinking")
            else:
                rep.w(n, "notes: no speaker notes — every slide needs a stated role")

        # --- weight ------------------------------------------------------
        total = sum(i.file_size for i in z.infolist())
        packed = sum(i.compress_size for i in z.infolist())
        media = [i for i in z.infolist() if i.filename.startswith("ppt/media/")]
        for m in media:
            if m.file_size > 1_500_000:
                rep.w(0, f"weight: {m.filename} is {m.file_size/1e6:.1f} MB — compress it")
        used = " ".join(rels.values())
        for m in media:
            base = m.filename.split("/")[-1]
            if base not in used:
                rep.w(0, f"weight: {base} looks unreferenced — remove unused assets")
        if packed > 15_000_000:
            rep.w(0, f"weight: {packed/1e6:.1f} MB — awkward to send on WhatsApp")

    print(f"{args.pptx}: {len(slides)} slides, "
          f"{len(animated)} with reveal steps, {packed/1e6:.1f} MB")
    for kind, items in (("FAIL", rep.fail), ("warn", rep.warn)):
        for n, msg in sorted(items):
            where = f"slide {n}" if n else "deck"
            print(f"  {kind}  {where}: {msg}")

    bad = len(rep.fail) + (len(rep.warn) if args.strict else 0)
    if bad:
        print(f"\n{len(rep.fail)} failure(s), {len(rep.warn)} warning(s) — "
              f"fix before delivery.")
        sys.exit(1)
    print(f"\nmechanical checks passed ({len(rep.warn)} warning(s)). "
          f"The pedagogical half of the checklist is still yours to run.")


if __name__ == "__main__":
    main()
