#!/usr/bin/env python3
"""
add_animations.py — inject REAL PowerPoint click animations into a deck built
by deck_kit.js.

deck_kit.js tags every shape belonging to a reveal step with an object name:

    anim:<step>:<effect>[:withPrev]:<uid>

This script reads those names, groups the shapes by <step>, and writes a
proper <p:timing> tree into each slide so the deck animates on click in
PowerPoint, Keynote, Google Slides and LibreOffice — no add-in, no macro,
nothing that breaks on another teacher's laptop.

    python3 add_animations.py deck.pptx              # in place
    python3 add_animations.py deck.pptx -o out.pptx
    python3 add_animations.py deck.pptx --report     # list what got animated

Effects: appear | fade | wipeUp | wipeDown | wipeLeft | wipeRight | zoom
(wipeLeft reveals from the right — that is the RTL-natural direction for
Hebrew text; wipeUp is the natural one for a column/bar growing.)

Add ":withPrev" to a step's effect to make it start together with the
previous step instead of waiting for its own click.
"""

import argparse
import re
import shutil
import sys
import zipfile
from collections import OrderedDict

NAME_RE = re.compile(
    r'<p:cNvPr\s+id="(\d+)"\s+name="anim:(\d+):([A-Za-z]+)(:withPrev)?(?::[^"]*)?"'
)
SLIDE_RE = re.compile(r"ppt/slides/slide\d+\.xml$")
TIMING_RE = re.compile(r"<p:timing>.*?</p:timing>", re.S)

# presetID / presetSubtype / animEffect filter, per ECMA-376 preset entrance effects
EFFECTS = {
    "appear":    dict(pid=1,  sub=0,  filt=None,        dur=1),
    "fade":      dict(pid=10, sub=0,  filt="fade",      dur=500),
    # presetSubtype for directional effects is a bitmask of the ORIGIN edge:
    #   1 = from top, 2 = from right, 4 = from bottom, 8 = from left.
    # The effects are named here by the direction the reveal TRAVELS.
    "wipeup":    dict(pid=22, sub=4,  filt="wipe(up)",    dur=500),
    "wiperight": dict(pid=22, sub=8,  filt="wipe(right)", dur=500),
    "wipeleft":  dict(pid=22, sub=2,  filt="wipe(left)",  dur=500),
    "wipedown":  dict(pid=22, sub=1,  filt="wipe(down)",  dur=500),
    "zoom":      dict(pid=23, sub=16, filt="zoom(in)",    dur=500),
}


class Ids:
    """Timing-tree node ids must be unique inside one slide."""

    def __init__(self):
        self.n = 0

    def next(self):
        self.n += 1
        return self.n


def effect_xml(ids, spid, effect, first_in_group):
    e = EFFECTS[effect]
    node = ids.next()
    behaviours = (
        '<p:set>'
        f'<p:cBhvr><p:cTn id="{ids.next()}" dur="1" fill="hold">'
        '<p:stCondLst><p:cond delay="0"/></p:stCondLst></p:cTn>'
        f'<p:tgtEl><p:spTgt spid="{spid}"/></p:tgtEl>'
        '<p:attrNameLst><p:attrName>style.visibility</p:attrName></p:attrNameLst>'
        '</p:cBhvr><p:to><p:strVal val="visible"/></p:to></p:set>'
    )
    if e["filt"]:
        behaviours += (
            f'<p:animEffect transition="in" filter="{e["filt"]}">'
            f'<p:cBhvr><p:cTn id="{ids.next()}" dur="{e["dur"]}"/>'
            f'<p:tgtEl><p:spTgt spid="{spid}"/></p:tgtEl></p:cBhvr></p:animEffect>'
        )
    node_type = "clickEffect" if first_in_group else "withEffect"
    return (
        f'<p:par><p:cTn id="{node}" presetID="{e["pid"]}" presetClass="entr" '
        f'presetSubtype="{e["sub"]}" fill="hold" grpId="0" nodeType="{node_type}">'
        '<p:stCondLst><p:cond delay="0"/></p:stCondLst>'
        f'<p:childTnLst>{behaviours}</p:childTnLst></p:cTn></p:par>'
    )


def group_xml(ids, effects_xml):
    inner = ids.next()
    outer = ids.next()
    return (
        f'<p:par><p:cTn id="{outer}" fill="hold">'
        '<p:stCondLst><p:cond delay="indefinite"/></p:stCondLst><p:childTnLst>'
        f'<p:par><p:cTn id="{inner}" fill="hold">'
        '<p:stCondLst><p:cond delay="0"/></p:stCondLst>'
        f'<p:childTnLst>{"".join(effects_xml)}</p:childTnLst>'
        '</p:cTn></p:par></p:childTnLst></p:cTn></p:par>'
    )


def timing_xml(groups):
    """groups: list of lists of (spid, effect)."""
    ids = Ids()
    root = ids.next()   # tmRoot
    seq = ids.next()    # mainSeq
    body = []
    for g in groups:
        body.append(group_xml(ids, [effect_xml(ids, spid, eff, i == 0)
                                    for i, (spid, eff) in enumerate(g)]))
    return (
        "<p:timing><p:tnLst><p:par>"
        f'<p:cTn id="{root}" dur="indefinite" restart="never" nodeType="tmRoot">'
        "<p:childTnLst>"
        '<p:seq concurrent="1" nextAc="seek">'
        f'<p:cTn id="{seq}" dur="indefinite" nodeType="mainSeq"><p:childTnLst>'
        + "".join(body) +
        "</p:childTnLst></p:cTn>"
        '<p:prevCondLst><p:cond evt="onPrev" delay="0"><p:tgtEl><p:sldTgt/></p:tgtEl></p:cond></p:prevCondLst>'
        '<p:nextCondLst><p:cond evt="onNext" delay="0"><p:tgtEl><p:sldTgt/></p:tgtEl></p:cond></p:nextCondLst>'
        "</p:seq></p:childTnLst></p:cTn></p:par></p:tnLst></p:timing>"
    )


def process_slide(xml):
    """Return (new_xml, [(step, effect, count)]) — or (xml, []) if untagged."""
    steps = OrderedDict()
    for spid, step, effect, with_prev in NAME_RE.findall(xml):
        key = effect.lower()
        if key not in EFFECTS:
            raise SystemExit(
                f"unknown effect '{effect}' — use one of {', '.join(sorted(EFFECTS))}"
            )
        steps.setdefault(int(step), {"effect": key, "withPrev": bool(with_prev), "spids": []})
        steps[int(step)]["spids"].append(spid)

    if not steps:
        return xml, []

    groups, report = [], []
    for step in sorted(steps):
        info = steps[step]
        entries = [(spid, info["effect"]) for spid in info["spids"]]
        if info["withPrev"] and groups:
            groups[-1].extend(entries)
        else:
            groups.append(entries)
        report.append((step, info["effect"], len(entries)))

    xml = TIMING_RE.sub("", xml)
    xml = xml.replace("</p:sld>", timing_xml(groups) + "</p:sld>")
    return xml, report


def main():
    ap = argparse.ArgumentParser(description=__doc__,
                                 formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("pptx")
    ap.add_argument("-o", "--out", help="output file (default: edit in place)")
    ap.add_argument("--report", action="store_true", help="print per-slide reveal steps")
    args = ap.parse_args()

    out = args.out or args.pptx
    tmp = out + ".tmp"

    total_slides = total_steps = 0
    with zipfile.ZipFile(args.pptx) as zin, zipfile.ZipFile(tmp, "w", zipfile.ZIP_DEFLATED) as zout:
        for item in zin.infolist():
            data = zin.read(item.filename)
            if SLIDE_RE.search(item.filename):
                xml, report = process_slide(data.decode("utf-8"))
                data = xml.encode("utf-8")
                if report:
                    total_slides += 1
                    total_steps += len(report)
                    if args.report:
                        print(f"{item.filename}:")
                        for step, effect, n in report:
                            print(f"   step {step}: {effect} × {n} shape(s)")
            zout.writestr(item, data)

    shutil.move(tmp, out)
    print(f"animated {total_slides} slide(s), {total_steps} reveal step(s) → {out}")
    if total_slides == 0:
        print("nothing was tagged — did you build with mode 'anim'?", file=sys.stderr)


if __name__ == "__main__":
    main()
