---
name: board-teacher-slides
description: >-
  Build a leveled, step-by-step presentation that teaches ONE middle-school (חטיבת ביניים, grades 7-9) math topic like a teacher explaining live at the whiteboard — one idea or question per slide, slow pacing, ADHD/קשב-וריכוז-friendly (minimal clutter, high contrast, generous whitespace), a fresh diagram matched to each specific question, never generic art. Always spans multiple difficulty levels (basic to advanced), matched to Ministry of Education (מפמ״ר) curriculum for the grade. Trigger ONLY when Roni explicitly asks for a step-by-step / לאט לאט / על הלוח presentation, a leveled/graduated (מדורג) deck, or content adapted for attention/focus difficulties (קשב וריכוז). A plain "מצגת על X" without these words goes to roni-math-presentation, not here. Different from the narrative הקובלים episodes and from a one-shot Gamma deck: always native pptxgenjs, never Gamma, for exact per-slide control.
---

# Board-Teacher Slides

A leveled, whiteboard-style teaching deck for one math topic. The teacher advances one slide at a time; each slide is small enough to explain out loud in under a minute.

## Before building

1. **Confirm/verify curriculum scope.** Don't guess what's "grade 9" or "grade 8" content — web-search the current מפמ"ר topic list for that grade + topic (site:pop.education.gov.il is the authoritative source) if not already confirmed earlier in the conversation. Note anything that's actually a higher-grade or higher-track extension and leave it out or flag it as clearly-labeled enrichment.
2. **Pick the level ladder.** Default to Roni's established 4-level pattern (בסיסי / בינוני / מתקדם / העשרה) unless the topic naturally suggests a different number of stages. Each level = a genuinely different skill, not just bigger numbers — e.g. for probability: single simple event → complementary event → two-stage experiment (tree/table) → conditional probability. Say the ladder out loud in your plan before building so a mismatch is caught early.
3. **One skill escalation per slide, never two at once.** If a slide introduces a new diagram type AND a new formula, split it into two slides.

## Slide rhythm (repeat per level)

1. **Level title slide** — level name + one-sentence description of what's new versus the last level. Nothing else.
2. **Worked example slide(s)** — one concrete example, solved slowly: state the question, show the diagram/model, then the solution steps as a short numbered sequence. Never more than ~5 short lines of text on a slide.
3. **Practice slide(s)** — ONE question per slide, in the same visual pattern as the worked example at that level, with the diagram built to match that question's actual numbers (not reused art). Put the answer on the *next* slide, never on the same one.
4. Close each level with a one-line bridge to the next ("עכשיו כשיודעים X, מה קורה כש...?") — this is what makes it feel like a teacher talking, not a slide deck.

## ADHD / קשב-וריכוז visual rules (non-negotiable)

- One new idea per slide. If you're tempted to add a second bullet that introduces a new concept, it's a new slide.
- Big, sparse: title (28-34pt) + at most 3-4 short lines of body text (18-20pt) + one diagram. No dense paragraphs.
- Every content slide has a visual — the diagram/graph/table for *that specific question*, generated fresh (native pptxgenjs shapes/charts, matched numbers), never a decorative stock icon standing in for real content.
- Consistent layout per slide type (all "worked example" slides share one template, all "practice" slides share another) — the predictability is the accessibility feature, not a design shortcut.
- Color-code by level (one accent color per level, reused consistently for that level's badge/diagrams) so both teacher and student always know which level they're in.
- Generous margins (0.6"+), high text/background contrast, no low-contrast pastel-on-pastel.

## Build mechanics

- **Always native pptxgenjs**, per the `pptx` skill's gotchas (RTL: `pres.rtlMode = true` + `align:"right"`/`rtlMode:true` on every text run, `LAYOUT_WIDE`, hex colors without `#`, native `addChart` for any graph — never a screenshot). Do not route this through Gamma: the whole point is exact one-idea-per-slide control, which an AI-generated deck won't reliably hold to.
- Safe fonts only (Arial for everything — this deck lives or dies on precise line counts per slide, so don't risk a QA-unreliable font).
- Reuse a small set of layout functions (title slide, level-badge slide, worked-example slide, practice-question slide, answer slide) across the whole deck rather than one-off positioning per slide — this is what makes the next topic fast to build.
- QA per the pptx skill: render every slide, check for text overflow first (most common failure with the tight per-slide text budget here), verify each diagram actually matches the numbers in that slide's question.

## Relationship to other skills

- Curriculum content and grade-appropriate difficulty come from `math-pedagogy-expert` and `hebrew-mathematical-pedagogy`.
- Diagram/graph correctness (axes, scale, geometric accuracy) follows the same standards as `math-diagram-generator`, just rendered as native pptx shapes/charts instead of matplotlib.
- If Roni later asks to reuse this same leveled content as a printable worksheet, hand off to `hebrew-exam-designer` rather than rebuilding the pedagogy from scratch.
