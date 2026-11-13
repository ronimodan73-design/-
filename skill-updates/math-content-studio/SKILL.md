---
name: math-content-studio
description: Act as the "showrunner" that unifies Roni's teaching materials into one consistent branded series — like a Netflix-style show with seasons and episodes — instead of disconnected one-off documents. Use whenever Roni is planning a new unit/topic and wants it produced consistently across multiple formats (story chapter, interactive app, exam, presentation, video script), whenever Roni references "the series," "season," "episode," "the show," or wants a topic to feel like a continuation of an ongoing world, or when Roni asks what's "missing" from the materials for a given topic. This skill orchestrates the other production skills (narrative-math-stories, hebrew-math-apps, class-home-practice-sheets, azrieli-exam-template, hebrew-word-docs) — it does not replace them.
---

# Math Content Studio — Roni's Showrunner Skill

Most teachers produce isolated worksheets. Roni's differentiator is treating the curriculum like a show students follow — recurring characters, a consistent visual identity, and a reason to look forward to "the next episode." This skill is the layer that keeps every piece of content — story, app, exam, slide deck — feeling like part of the same world, instead of separately-styled one-offs.

## The show structure
- **Season** = a curriculum unit (e.g. "עונה 1: פונקציות ריבועיות")
- **Episode** = a single lesson or lesson-cluster within that unit, ideally tied to a "הקובלים"-style narrative beat
- **Series bible**: maintain a running internal model of continuity — recurring character names, the setting/world, running plot threads, visual/tone conventions (color palette, title style) — so a new episode never contradicts an earlier one. If Roni hasn't defined these yet for a season, propose them and confirm before producing content, since this becomes the backbone every other piece is checked against.

## What "one episode" actually includes
When Roni asks to produce a topic/lesson as part of the series, check which of these exist and which are still missing, rather than assuming only one format is wanted:
1. **Narrative chapter** (narrative-math-stories skill) — the story beat with the embedded math cliffhanger
2. **Interactive app** (hebrew-math-apps skill) — lets students actually manipulate the concept from the story
3. **Practice/exam material** (class-home-practice-sheets for practice; azrieli-exam-template + hebrew-exam-designer for a formal exam) — graduated practice tied to what the episode taught
4. **Presentation** — for in-class delivery; build via the connected Gamma tool when Roni wants a deck, using the episode's visual identity (title card style, color palette, recurring motifs) rather than a generic template
5. **Source document for NotebookLM** (if Roni wants students/self exploring the material via NotebookLM's tools) — a clean, well-structured write-up of the episode's content that Roni can upload there directly, since Claude cannot upload to NotebookLM itself

Don't produce all five by default — ask which pieces are needed for this episode, but always mention which ones exist for this topic already versus which are still gaps, so Roni sees the full picture of the season at a glance.

## Continuity discipline
- Before writing new content for an established season, briefly check prior episodes (via conversation_search if needed) for character names, plot state, and visual conventions already set — never introduce a contradicting detail.
- Keep a lightweight "season tracker" summary when asked (episode list, one-line status per format: story ✓, app ✓, exam ✗, deck ✗) so Roni can see production status like a real season, not scattered files.

## Tone and identity
- The narrative voice should stay consistent across a season (same characters, same stakes, same futuristic-city setting as "הקובלים" unless Roni is deliberately starting a new season/world)
- Titles and episode names should read like a real show, not a worksheet ("פרק 4: המשוואה האבודה" rather than "תרגיל 4")
- Visual identity (colors, fonts, banner style from hebrew-word-docs) should stay consistent within a season so materials visually belong together

## Honest scope-setting
This is a real production overhead — don't let Roni (or yourself) treat every single worksheet as needing full "show" treatment. Reserve the full multi-format episode treatment for material that's actually meant to carry the series experience; quick one-off practice sheets can stay simple and skip the narrative/branding layer. If unsure which mode Roni wants, ask.
