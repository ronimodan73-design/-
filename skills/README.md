# Skills

Source of truth for personal skills built in this workspace, kept here so they
survive an ephemeral session container and can be reinstalled anywhere.

## Installing a skill

```bash
cp -r skills/<name> ~/.claude/skills/<name>
```

Claude Code picks it up on the next session. To make it available on every
device, add it through the skills UI on claude.ai (the synced skills live in
`~/.claude/skills/synced/`).

## roni-math-presentation

Builds a math lesson presentation that teaches instead of summarising:
graduated reveal, real PowerPoint click animations, accurate native diagrams,
correct Hebrew RTL alongside left-to-right mathematics, and three matching
artifacts (PPTX / MP4 / PDF) light enough to send on WhatsApp.

Runtime dependencies, in the working directory where a deck is built:

```bash
npm install pptxgenjs                    # deck building
pip install pymupdf imageio-ffmpeg       # PDF → frames → MP4 (LibreOffice does pptx → PDF)
```

Quick start:

```bash
SKILL=~/.claude/skills/roni-math-presentation
cp $SKILL/assets/example_deck.js .
node example_deck.js
python3 $SKILL/scripts/add_animations.py out/<name>.pptx --report
python3 $SKILL/scripts/render.py out/<name>__build.pptx \
    --pdf out/<name>.pdf --mp4 out/<name>.mp4 --timing out/<name>__timing.json
python3 $SKILL/scripts/qa.py out/<name>.pptx --anim
```
