#!/usr/bin/env python3
"""
render.py — turn the progressive-build deck into the two companion artifacts:
the PDF backup and the MP4 that preserves the reveal rhythm.

    python3 render.py ז_שיעור_03__build.pptx \
        --pdf  ז_שיעור_03.pdf \
        --mp4  ז_שיעור_03.mp4 \
        --timing ז_שיעור_03__timing.json

Pipeline:  pptx --(LibreOffice)--> pdf --(PyMuPDF)--> png frames --(ffmpeg)--> mp4

The MP4 is built from the *build* deck, not the animated one: a PDF/video export
of a click-animated slide would show every layer at once and destroy the whole
point of the reveal. Each build slide is held for its own duration, taken from
the timing.json that deck_kit.js writes (default 4s per step).

Dependencies (each degrades with a clear message, none is exotic):
  LibreOffice  — pptx → pdf
  PyMuPDF      — pdf → png            (pip install pymupdf)
  ffmpeg       — png → mp4            (system ffmpeg, or pip install imageio-ffmpeg)
"""

import argparse
import json
import os
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path


# ----------------------------------------------------------------- soffice
def _soffice_runner():
    """Prefer the pptx skill's sandbox-safe wrapper; fall back to plain soffice."""
    for root in (
        Path.home() / ".claude/skills/synced/pptx/scripts",
        Path.home() / ".claude/skills/pptx/scripts",
        Path(__file__).resolve().parents[2] / "pptx/scripts",
        Path(__file__).resolve().parents[2] / "synced/pptx/scripts",
    ):
        if (root / "office" / "soffice.py").exists():
            sys.path.insert(0, str(root))
            try:
                from office.soffice import run_soffice  # type: ignore
                return run_soffice
            except Exception:
                sys.path.pop(0)

    def run_soffice(args, **kw):
        with tempfile.TemporaryDirectory() as profile:
            env = os.environ.copy()
            env["SAL_USE_VCLPLUGIN"] = "svp"
            return subprocess.run(
                ["soffice", f"-env:UserInstallation=file://{profile}", *args],
                env=env, capture_output=True, timeout=600, **kw
            )

    return run_soffice


def pptx_to_pdf(pptx: Path, out_pdf: Path) -> Path:
    run_soffice = _soffice_runner()
    with tempfile.TemporaryDirectory() as td:
        res = run_soffice(["--headless", "--convert-to", "pdf", "--outdir", td, str(pptx)])
        produced = Path(td) / (pptx.stem + ".pdf")
        if not produced.exists():
            err = getattr(res, "stderr", b"") or b""
            raise SystemExit(f"LibreOffice produced no PDF.\n{err.decode(errors='replace')[:800]}")
        out_pdf.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy(produced, out_pdf)
    return out_pdf


# -------------------------------------------------------------------- pngs
def pdf_to_pngs(pdf: Path, outdir: Path, width: int = 1920):
    try:
        import pymupdf  # noqa
        doc = pymupdf.open(pdf)
    except ImportError:
        try:
            import fitz as pymupdf  # noqa
            doc = pymupdf.open(pdf)
        except ImportError:
            raise SystemExit("PyMuPDF missing — pip install pymupdf")
    outdir.mkdir(parents=True, exist_ok=True)
    frames = []
    for i, page in enumerate(doc):
        zoom = width / page.rect.width
        pix = page.get_pixmap(matrix=pymupdf.Matrix(zoom, zoom))
        p = outdir / f"frame{i:04d}.png"
        pix.save(p)
        frames.append(p)
    doc.close()
    return frames


# --------------------------------------------------------------------- mp4
def ffmpeg_bin():
    exe = shutil.which("ffmpeg")
    if exe:
        return exe
    try:
        import imageio_ffmpeg
        return imageio_ffmpeg.get_ffmpeg_exe()
    except Exception:
        raise SystemExit(
            "ffmpeg missing — install it, or `pip install imageio-ffmpeg`.\n"
            "The PNG frames were kept, so you can encode them elsewhere."
        )


def pngs_to_mp4(frames, durations, out_mp4: Path, fps: int = 25):
    """Concat demuxer: each frame held for its own number of seconds."""
    listing = out_mp4.parent / "_frames.txt"
    lines = []
    for f, d in zip(frames, durations):
        lines.append(f"file '{f.as_posix()}'")
        lines.append(f"duration {d}")
    lines.append(f"file '{frames[-1].as_posix()}'")   # concat demuxer quirk: repeat last
    listing.write_text("\n".join(lines), encoding="utf-8")

    cmd = [
        ffmpeg_bin(), "-y", "-f", "concat", "-safe", "0", "-i", str(listing),
        "-vf", "scale=1920:-2:flags=lanczos,format=yuv420p",
        "-c:v", "libx264", "-preset", "medium", "-crf", "24", "-r", str(fps),
        "-movflags", "+faststart", str(out_mp4),
    ]
    res = subprocess.run(cmd, capture_output=True)
    listing.unlink(missing_ok=True)
    if res.returncode != 0 or not out_mp4.exists():
        raise SystemExit(res.stderr.decode(errors="replace")[-1500:])
    return out_mp4


def load_durations(timing: Path, n_frames: int, default: float):
    if timing and timing.exists():
        steps = json.loads(timing.read_text(encoding="utf-8"))["steps"]
        d = [float(s.get("seconds", default)) for s in steps]
        if len(d) == n_frames:
            return d
        print(f"warning: timing has {len(d)} steps but the PDF has {n_frames} pages — "
              f"using {default}s per frame", file=sys.stderr)
    return [default] * n_frames


def main():
    ap = argparse.ArgumentParser(description=__doc__,
                                 formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("pptx", help="the __build.pptx deck")
    ap.add_argument("--pdf", help="write the PDF backup here")
    ap.add_argument("--mp4", help="write the MP4 here")
    ap.add_argument("--timing", help="timing.json from deck_kit.js")
    ap.add_argument("--seconds", type=float, default=4.0, help="fallback seconds per step")
    ap.add_argument("--width", type=int, default=1920)
    ap.add_argument("--keep-frames", metavar="DIR", help="keep the PNG frames here")
    args = ap.parse_args()

    pptx = Path(args.pptx).resolve()
    if not pptx.exists():
        raise SystemExit(f"no such file: {pptx}")
    if not args.pdf and not args.mp4:
        raise SystemExit("nothing to do — pass --pdf and/or --mp4")

    tmp = Path(tempfile.mkdtemp(prefix="deckrender_"))
    try:
        pdf_path = Path(args.pdf).resolve() if args.pdf else tmp / "deck.pdf"
        pptx_to_pdf(pptx, pdf_path)
        print(f"pdf  → {pdf_path}")

        if args.mp4:
            frames_dir = Path(args.keep_frames).resolve() if args.keep_frames else tmp / "frames"
            frames = pdf_to_pngs(pdf_path, frames_dir, width=args.width)
            durations = load_durations(
                Path(args.timing).resolve() if args.timing else None, len(frames), args.seconds
            )
            mp4 = Path(args.mp4).resolve()
            mp4.parent.mkdir(parents=True, exist_ok=True)
            pngs_to_mp4(frames, durations, mp4)
            size_mb = mp4.stat().st_size / 1e6
            print(f"mp4  → {mp4}  ({size_mb:.1f} MB, {sum(durations):.0f}s)")
            if size_mb > 16:
                print("warning: over 16 MB — WhatsApp will re-compress it. "
                      "Shorten dwell times or split the deck.", file=sys.stderr)
    finally:
        if not args.keep_frames:
            shutil.rmtree(tmp, ignore_errors=True)


if __name__ == "__main__":
    main()
