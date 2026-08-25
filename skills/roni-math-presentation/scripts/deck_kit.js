/**
 * deck_kit.js — the build engine for roni-math-presentation decks.
 *
 * One declarative spec → three artifacts that stay in sync:
 *   anim  → ONE slide per teaching moment, with real PowerPoint click
 *           animations injected by scripts/add_animations.py  (the .pptx Roni edits)
 *   build → progressive-build slides (one slide per reveal step)
 *           → source for the .pdf backup and the .mp4 (scripts/build_video.py)
 *
 * The point: the reveal sequence is written ONCE, in the spec. Nothing can
 * drift between the animated deck and the video.
 *
 *   const { buildDeck } = require("<skill>/scripts/deck_kit.js");
 *   buildDeck({ file: "ז_שיעור_03_מערכת_צירים", outDir: "out", slides: [ ... ] });
 *
 * Slide spec:
 *   {
 *     role:    "שאלה פותחת",              // shows in the teacher notes
 *     teacher: "מה שמתם לב?",             // Teacher Action  (required)
 *     student: "משווים בין שני הריבועים", // Student Thinking (required)
 *     seconds: 4,                          // video dwell on the base state
 *     base(s, k) { ... },                  // drawn immediately
 *     layers: [                            // each = one click / one build slide
 *       { effect: "fade", seconds: 4, draw(s, k) { ... } },
 *     ],
 *   }
 *
 * Effects: appear | fade | wipeUp | wipeDown | wipeLeft | wipeRight | zoom
 *          (+ ":withPrev" suffix to run together with the previous layer)
 */

const fs = require("fs");
const path = require("path");
const pptxgen = loadPptxgen();

/**
 * pptxgenjs lives in the *project's* node_modules (or globally), not in this
 * skill directory, so plain require() from here would fail. Resolve it from
 * the caller's cwd and the global roots instead.
 */
function loadPptxgen() {
  const roots = [process.cwd(), path.join(process.cwd(), "node_modules"), __dirname];
  try {
    const { execSync } = require("child_process");
    roots.push(execSync("npm root -g", { encoding: "utf8" }).trim());
  } catch (_) {}
  for (const r of roots) {
    try { return require(require.resolve("pptxgenjs", { paths: [r] })); } catch (_) {}
  }
  throw new Error(
    "pptxgenjs not found. Run `npm install pptxgenjs` in the deck's working directory."
  );
}
const { pmx, ltr } = require("./bidi.js");

/* ShapeType lives on the *instance* in pptxgenjs v4 and on both in v3 —
   these preset-geometry strings are what both versions accept. */
const S = { rect: "rect", roundRect: "roundRect", line: "line", ellipse: "ellipse", triangle: "triangle" };

/* ------------------------------------------------------------------ theme */
/* Apple-inspired: one accent, lots of whitespace, safe fonts only.        */
const T = {
  font: "Arial",                 // safe everywhere — never a rare font
  W: 13.333, H: 7.5,             // LAYOUT_WIDE
  M: 0.7,                        // page margin
  color: {
    ink: "1D1D1F",
    sub: "6E6E73",
    line: "D2D2D7",
    bg: "FFFFFF",
    surface: "F5F5F7",
    accent: "0071E3",            // THE accent — one, and only one
    accentSoft: "D9EAFB",
    mistake: "D0342C",           // used only for "טעות נפוצה"
    fix: "1D8A4E",               // used only for "תיקון"
    /* concept colors — assign a concept once, keep it for the whole deck */
    c1: "0071E3", c2: "C77700", c3: "1D8A4E", c4: "6E6E73",
  },
  size: { kicker: 15, title: 34, sub: 24, body: 22, small: 16, math: 44, mathSm: 30 },
};

/* ------------------------------------------------- objectName tagging proxy */
let tagCounter = 0;
const ADDERS = ["addText", "addShape", "addImage", "addTable", "addChart", "addNotes"];

function tagged(slide, step, effect) {
  const handler = {
    get(target, prop) {
      const v = target[prop];
      if (typeof v !== "function" || !ADDERS.includes(prop)) {
        return typeof v === "function" ? v.bind(target) : v;
      }
      return (...args) => {
        if (prop !== "addNotes" && args.length) {
          const last = args[args.length - 1];
          if (last && typeof last === "object" && !Array.isArray(last)) {
            last.objectName = `anim:${step}:${effect}:${++tagCounter}`;
          }
        }
        return v.apply(target, args);
      };
    },
  };
  return new Proxy(slide, handler);
}

/* ------------------------------------------------------------- primitives */
function makeKit(pres) {
  const k = {
    pres, T, pmx, ltr, S,

    /** small grey eyebrow above the title */
    kicker(s, text, o = {}) {
      s.addText(pmx(text), {
        x: T.M, y: 0.42, w: T.W - 2 * T.M, h: 0.32, align: "right", rtlMode: true,
        fontFace: T.font, fontSize: T.size.kicker, color: T.color.sub,
        charSpacing: 1, margin: 0, lang: "he-IL", ...o,
      });
    },

    /** slide title — short. If it needs two lines, it is two slides. */
    title(s, text, o = {}) {
      s.addText(pmx(text), {
        x: T.M, y: 0.78, w: T.W - 2 * T.M, h: 0.85, align: "right", rtlMode: true,
        fontFace: T.font, fontSize: T.size.title, bold: true, color: T.color.ink,
        margin: 0, lang: "he-IL", ...o,
      });
    },

    /** one short line of body text (never a paragraph) */
    body(s, text, o = {}) {
      s.addText(pmx(text), {
        x: T.M, y: 1.85, w: T.W - 2 * T.M, h: 0.6, align: "right", rtlMode: true,
        fontFace: T.font, fontSize: T.size.body, color: T.color.ink,
        margin: 0, lang: "he-IL", ...o,
      });
    },

    /** RTL bullet list — max 4 items, one line each */
    list(s, items, o = {}) {
      const arr = items.map((t, i) => ({
        text: pmx(t),
        options: { bullet: true, breakLine: i < items.length - 1 },
      }));
      s.addText(arr, {
        x: T.M, y: 1.9, w: T.W - 2 * T.M, h: 3, align: "right", rtlMode: true,
        fontFace: T.font, fontSize: T.size.body, color: T.color.ink,
        paraSpaceAfter: 12, margin: 0, lang: "he-IL", ...o,
      });
    },

    /** a big LTR mathematical expression — never reordered by RTL */
    math(s, expr, o = {}) {
      s.addText(ltr(expr), {
        x: T.M, y: 2.6, w: T.W - 2 * T.M, h: 1.1, align: "center", rtlMode: false,
        fontFace: T.font, fontSize: T.size.math, bold: true, color: T.color.ink,
        margin: 0, ...o,
      });
    },

    /** boxed message. tone: think | rule | mistake | fix | quiet */
    callout(s, text, o = {}) {
      const tone = o.tone || "think";
      const map = {
        think:   { bar: T.color.accent,  fill: T.color.surface, label: "לחשוב" },
        rule:    { bar: T.color.ink,     fill: T.color.surface, label: "הכלל" },
        mistake: { bar: T.color.mistake, fill: "FBEBEA",        label: "טעות נפוצה" },
        fix:     { bar: T.color.fix,     fill: "E9F5EE",        label: "התיקון" },
        quiet:   { bar: T.color.line,    fill: T.color.surface, label: null },
      };
      const c = map[tone] || map.think;
      const x = o.x ?? T.M, y = o.y ?? 4.9, w = o.w ?? T.W - 2 * T.M, h = o.h ?? 1.15;
      s.addShape(S.roundRect, {
        x, y, w, h, fill: { color: c.fill }, line: { color: c.fill }, rectRadius: 0.12,
      });
      /* the accent bar sits on the RIGHT — this is an RTL layout */
      s.addShape(S.rect, { x: x + w - 0.07, y, w: 0.07, h, fill: { color: c.bar }, line: { color: c.bar } });
      const label = o.label === null ? null : (o.label || c.label);
      if (label) {
        s.addText(pmx(label), {
          x: x + 0.2, y: y + 0.1, w: w - 0.45, h: 0.3, align: "right", rtlMode: true,
          fontFace: T.font, fontSize: 14, bold: true, color: c.bar, margin: 0, lang: "he-IL",
        });
      }
      s.addText(pmx(text), {
        x: x + 0.2, y: y + (label ? 0.42 : 0.18), w: w - 0.45, h: h - (label ? 0.55 : 0.36),
        align: "right", rtlMode: true, valign: "middle",
        fontFace: T.font, fontSize: o.fontSize || 22, color: T.color.ink, margin: 0, lang: "he-IL",
      });
    },

    /** translucent wash over the part of the slide being talked about now */
    highlight(s, o = {}) {
      s.addShape(S.roundRect, {
        x: o.x, y: o.y, w: o.w, h: o.h, rectRadius: 0.08,
        fill: { color: o.color || T.color.accent, transparency: o.transparency ?? 82 },
        line: { color: o.color || T.color.accent, width: 1.5, transparency: 40 },
      });
    },

    arrow(s, o = {}) {
      const x = Math.min(o.x1, o.x2), y = Math.min(o.y1, o.y2);
      s.addShape(S.line, {
        x, y, w: Math.abs(o.x2 - o.x1), h: Math.abs(o.y2 - o.y1),
        flipH: o.x2 < o.x1, flipV: o.y2 < o.y1,
        line: { color: o.color || T.color.accent, width: o.width || 2.5, endArrowType: "triangle" },
      });
    },

    /** step of a worked solution: number badge + LTR expression + reason */
    step(s, o = {}) {
      const y = o.y ?? 2.4;
      const right = T.W - T.M;
      s.addShape(S.ellipse, {
        x: right - 0.46, y, w: 0.46, h: 0.46,
        fill: { color: T.color.accent }, line: { color: T.color.accent },
      });
      s.addText(String(o.n), {
        x: right - 0.46, y, w: 0.46, h: 0.46, align: "center", valign: "middle",
        fontFace: T.font, fontSize: 18, bold: true, color: "FFFFFF", margin: 0,
      });
      s.addText(ltr(o.expr), {
        x: T.M + 3.2, y: y - 0.03, w: right - 0.7 - (T.M + 3.2), h: 0.55, align: "right",
        rtlMode: false, fontFace: T.font, fontSize: o.fontSize || T.size.mathSm,
        bold: true, color: T.color.ink, margin: 0, valign: "middle",
      });
      if (o.why) {
        s.addText(pmx(o.why), {
          x: T.M, y: y - 0.03, w: 3.0, h: 0.55, align: "right", rtlMode: true, valign: "middle",
          fontFace: T.font, fontSize: 16, color: T.color.sub, margin: 0, lang: "he-IL",
        });
      }
    },

    /* ------------------------------------------------------- math figures */

    /** coordinate plane with real grid, ticks, points and straight lines */
    axes(s, o = {}) {
      const x = o.x ?? 4.6, y = o.y ?? 1.9, w = o.w ?? 4.2, h = o.h ?? 4.2;
      const xMin = o.xMin ?? -5, xMax = o.xMax ?? 5, yMin = o.yMin ?? -5, yMax = o.yMax ?? 5;
      const step = o.step ?? 1;
      const px = (vx) => x + ((vx - xMin) / (xMax - xMin)) * w;
      const py = (vy) => y + h - ((vy - yMin) / (yMax - yMin)) * h;

      if (o.grid !== false) {
        for (let v = xMin; v <= xMax + 1e-9; v += step)
          s.addShape(S.line, { x: px(v), y, w: 0, h, line: { color: T.color.line, width: 0.75 } });
        for (let v = yMin; v <= yMax + 1e-9; v += step)
          s.addShape(S.line, { x, y: py(v), w, h: 0, line: { color: T.color.line, width: 0.75 } });
      }
      /* axes drawn full-width with arrowheads — mathematically correct direction */
      s.addShape(S.line, { x, y: py(0), w, h: 0, line: { color: T.color.ink, width: 2, endArrowType: "triangle" } });
      s.addShape(S.line, { x: px(0), y, w: 0, h, flipV: true, line: { color: T.color.ink, width: 2, endArrowType: "triangle" } });
      s.addText("x", { x: x + w - 0.05, y: py(0) + 0.06, w: 0.4, h: 0.3, fontFace: T.font, fontSize: 16, italic: true, color: T.color.ink, margin: 0, rtlMode: false });
      s.addText("y", { x: px(0) + 0.1, y: y - 0.32, w: 0.4, h: 0.3, fontFace: T.font, fontSize: 16, italic: true, color: T.color.ink, margin: 0, rtlMode: false });

      if (o.numbers !== false) {
        for (let v = xMin; v <= xMax + 1e-9; v += step) {
          if (Math.abs(v) < 1e-9) continue;
          s.addText(String(+v.toFixed(2)), {
            x: px(v) - 0.28, y: py(0) + 0.05, w: 0.56, h: 0.28, align: "center",
            fontFace: T.font, fontSize: 13, color: T.color.sub, margin: 0, rtlMode: false,
          });
        }
        for (let v = yMin; v <= yMax + 1e-9; v += step) {
          if (Math.abs(v) < 1e-9) continue;
          s.addText(String(+v.toFixed(2)), {
            x: px(0) - 0.62, y: py(v) - 0.14, w: 0.54, h: 0.28, align: "right",
            fontFace: T.font, fontSize: 13, color: T.color.sub, margin: 0, rtlMode: false,
          });
        }
      }

      (o.lines || []).forEach((L) => {
        const col = L.color || T.color.accent;
        const f = (vx) => L.m * vx + L.b;
        let x1 = xMin, x2 = xMax;
        s.addShape(S.line, {
          x: px(x1), y: py(f(x1)), w: px(x2) - px(x1), h: Math.abs(py(f(x2)) - py(f(x1))),
          flipV: py(f(x2)) < py(f(x1)),
          line: { color: col, width: L.width || 2.5, dashType: L.dash || "solid" },
        });
        if (L.label) {
          s.addText(ltr(L.label), {
            x: px(x2) - 1.5, y: py(f(x2)) - 0.42, w: 1.4, h: 0.3, align: "right",
            fontFace: T.font, fontSize: 14, bold: true, color: col, margin: 0, rtlMode: false,
          });
        }
      });

      (o.points || []).forEach((P) => {
        const col = P.color || T.color.accent, r = 0.11;
        s.addShape(S.ellipse, { x: px(P.x) - r, y: py(P.y) - r, w: 2 * r, h: 2 * r, fill: { color: col }, line: { color: "FFFFFF", width: 1 } });
        if (P.label) {
          s.addText(ltr(P.label), {
            x: px(P.x) + 0.1, y: py(P.y) - 0.42, w: 1.3, h: 0.3, align: "left",
            fontFace: T.font, fontSize: 14, bold: true, color: col, margin: 0, rtlMode: false,
          });
        }
        if (P.dashed) {
          s.addShape(S.line, { x: px(P.x), y: Math.min(py(P.y), py(0)), w: 0, h: Math.abs(py(P.y) - py(0)), line: { color: col, width: 1.25, dashType: "dash" } });
          s.addShape(S.line, { x: Math.min(px(P.x), px(0)), y: py(P.y), w: Math.abs(px(P.x) - px(0)), h: 0, line: { color: col, width: 1.25, dashType: "dash" } });
        }
      });
      return { px, py, x, y, w, h };
    },

    /** number line with ticks and marked values */
    numberLine(s, o = {}) {
      const x = o.x ?? 1.4, y = o.y ?? 3.4, w = o.w ?? T.W - 2.8;
      const min = o.min ?? -5, max = o.max ?? 5, step = o.step ?? 1;
      const px = (v) => x + ((v - min) / (max - min)) * w;
      s.addShape(S.line, { x, y, w, h: 0, line: { color: T.color.ink, width: 2.5, beginArrowType: "triangle", endArrowType: "triangle" } });
      for (let v = min; v <= max + 1e-9; v += step) {
        s.addShape(S.line, { x: px(v), y: y - 0.1, w: 0, h: 0.2, line: { color: T.color.ink, width: 1.5 } });
        s.addText(String(+v.toFixed(2)), {
          x: px(v) - 0.3, y: y + 0.16, w: 0.6, h: 0.28, align: "center",
          fontFace: T.font, fontSize: 14, color: T.color.sub, margin: 0, rtlMode: false,
        });
      }
      (o.marks || []).forEach((m) => {
        const col = m.color || T.color.accent;
        s.addShape(S.ellipse, { x: px(m.v) - 0.11, y: y - 0.11, w: 0.22, h: 0.22, fill: { color: col }, line: { color: "FFFFFF", width: 1 } });
        if (m.label) s.addText(ltr(m.label), {
          x: px(m.v) - 0.7, y: y - 0.66, w: 1.4, h: 0.3, align: "center",
          fontFace: T.font, fontSize: 15, bold: true, color: col, margin: 0, rtlMode: false,
        });
      });
      return { px, y };
    },

    /**
     * area model for (a+b)² — the square, split, with each piece revealable.
     * show: any of "frame","aa","ab1","ab2","bb","labels","dims"
     */
    areaModel(s, o = {}) {
      const a = o.a ?? 3, b = o.b ?? 2;
      const size = o.size ?? 3.6, x = o.x ?? 1.2, y = o.y ?? 2.1;
      const sa = (a / (a + b)) * size, sb = size - sa;
      const show = new Set(o.show || ["frame", "aa", "ab1", "ab2", "bb", "labels", "dims"]);
      const C = T.color;
      const box = (bx, by, bw, bh, col, label) => {
        s.addShape(S.rect, { x: bx, y: by, w: bw, h: bh, fill: { color: col, transparency: 78 }, line: { color: col, width: 1.5 } });
        if (label && show.has("labels")) s.addText(ltr(label), {
          x: bx, y: by + bh / 2 - 0.22, w: bw, h: 0.44, align: "center", valign: "middle",
          fontFace: T.font, fontSize: 22, bold: true, color: col, margin: 0, rtlMode: false,
        });
      };
      if (show.has("frame")) s.addShape(S.rect, { x, y, w: size, h: size, fill: { color: "FFFFFF" }, line: { color: C.ink, width: 2.5 } });
      if (show.has("aa"))  box(x, y, sa, sa, C.c1, o.labelAA ?? "a²");
      if (show.has("ab1")) box(x + sa, y, sb, sa, C.c2, o.labelAB ?? "ab");
      if (show.has("ab2")) box(x, y + sa, sa, sb, C.c2, o.labelAB ?? "ab");
      if (show.has("bb"))  box(x + sa, y + sa, sb, sb, C.c3, o.labelBB ?? "b²");
      if (show.has("dims")) {
        const dim = (dx, dy, dw, txt) => {
          s.addShape(S.line, { x: dx, y: dy, w: dw, h: 0, line: { color: C.sub, width: 1.25, beginArrowType: "triangle", endArrowType: "triangle" } });
          s.addText(ltr(txt), { x: dx, y: dy - 0.36, w: dw, h: 0.3, align: "center", fontFace: T.font, fontSize: 16, bold: true, color: C.sub, margin: 0, rtlMode: false });
        };
        dim(x, y - 0.28, sa, o.aName ?? "a");
        dim(x + sa, y - 0.28, sb, o.bName ?? "b");
      }
      return { x, y, size, sa, sb };
    },

    /** simple RTL table (headers right-aligned, math cells centred LTR) */
    table(s, rows, o = {}) {
      const body = rows.map((r, ri) =>
        r.map((c) => ({
          text: typeof c === "string" && /[֐-׿]/.test(c) ? pmx(c) : ltr(String(c)),
          options: {
            align: ri === 0 ? "center" : "center", rtlMode: false,
            bold: ri === 0, color: ri === 0 ? "FFFFFF" : T.color.ink,
            fill: ri === 0 ? { color: T.color.ink } : { color: "FFFFFF" },
          },
        })).reverse()   /* RTL: first logical column sits on the right */
      );
      s.addTable(body, {
        x: o.x ?? 2.4, y: o.y ?? 2.3, w: o.w ?? 8.5, rowH: o.rowH ?? 0.55,
        fontFace: T.font, fontSize: o.fontSize ?? 20, border: { type: "solid", color: T.color.line, pt: 1 },
        valign: "middle", ...o,
      });
    },

    /** page furniture: hairline + slide number (kept whisper-quiet) */
    chrome(s, n, total) {
      s.addShape(S.line, { x: T.M, y: T.H - 0.55, w: T.W - 2 * T.M, h: 0, line: { color: T.color.line, width: 0.75 },
        objectName: "chromeRule" });
      if (n != null) s.addText(`${n}/${total}`, {
        x: T.M, y: T.H - 0.5, w: 1.2, h: 0.28, align: "left",
        fontFace: T.font, fontSize: 11, color: T.color.sub, margin: 0, rtlMode: false,
        objectName: "chromeNum",
      });
    },
  };
  return k;
}

/* ------------------------------------------------------------------ build */

function newPres() {
  const pres = new pptxgen();
  pres.layout = "LAYOUT_WIDE";
  pres.rtlMode = true;
  pres.theme = { headFontFace: T.font, bodyFontFace: T.font };
  return pres;
}

function notesFor(spec) {
  const L = [];
  if (spec.role) L.push(`תפקיד השקופית: ${spec.role}`);
  L.push(`Teacher Action — מה המורה עושה/שואלת:\n${spec.teacher}`);
  L.push(`Student Thinking — מה התלמידים חושבים/עושים:\n${spec.student}`);
  if (spec.misconception) L.push(`טעות צפויה: ${spec.misconception}`);
  if (spec.support) L.push(`הוראה מתקנת: ${spec.support}`);
  if (spec.layers && spec.layers.length) L.push(`רצף חשיפה: ${spec.layers.length} לחיצות`);
  return L.join("\n\n");
}

function assertSpec(spec, i) {
  const where = `slide #${i + 1}${spec.role ? ` (${spec.role})` : ""}`;
  if (typeof spec.base !== "function") throw new Error(`${where}: missing base(s, k)`);
  if (!spec.teacher || !spec.student)
    throw new Error(`${where}: every slide needs teacher + student. A slide with no pedagogical role is deleted, not shipped.`);
  (spec.layers || []).forEach((L, j) => {
    if (typeof L.draw !== "function") throw new Error(`${where} layer ${j + 1}: missing draw(s, k)`);
  });
}

/**
 * buildDeck(spec) → { pptx, buildPptx, timing }
 *   spec.file    base filename, no extension (Hebrew is fine)
 *   spec.outDir  default "."
 *   spec.modes   default ["anim","build"]
 */
async function buildDeck(spec) {
  const outDir = spec.outDir || ".";
  fs.mkdirSync(outDir, { recursive: true });
  const modes = spec.modes || ["anim", "build"];
  spec.slides.forEach(assertSpec);
  const out = {};

  if (modes.includes("anim")) {
    const pres = newPres();
    const k = makeKit(pres);
    const total = spec.slides.length;
    spec.slides.forEach((sp, i) => {
      const s = pres.addSlide();
      s.background = { color: sp.bg || T.color.bg };
      sp.base(s, k);
      (sp.layers || []).forEach((L, j) => {
        const eff = L.effect || "fade";
        L.draw(tagged(s, j + 1, eff), k);
      });
      if (spec.chrome !== false) k.chrome(s, i + 1, total);
      s.addNotes(notesFor(sp));
    });
    out.pptx = path.join(outDir, `${spec.file}.pptx`);
    await pres.writeFile({ fileName: out.pptx });
  }

  if (modes.includes("build")) {
    const pres = newPres();
    const k = makeKit(pres);
    const timing = [];
    spec.slides.forEach((sp, i) => {
      const layers = sp.layers || [];
      for (let stop = 0; stop <= layers.length; stop++) {
        const s = pres.addSlide();
        s.background = { color: sp.bg || T.color.bg };
        sp.base(s, k);
        for (let j = 0; j < stop; j++) layers[j].draw(s, k);
        if (spec.chrome !== false) k.chrome(s, i + 1, spec.slides.length);
        s.addNotes(notesFor(sp));
        const sec = stop === 0 ? (sp.seconds ?? 4) : (layers[stop - 1].seconds ?? sp.seconds ?? 4);
        timing.push({ slide: i + 1, step: stop, seconds: sec });
      }
    });
    out.buildPptx = path.join(outDir, `${spec.file}__build.pptx`);
    await pres.writeFile({ fileName: out.buildPptx });
    out.timing = path.join(outDir, `${spec.file}__timing.json`);
    fs.writeFileSync(out.timing, JSON.stringify({ file: spec.file, steps: timing }, null, 2));
  }

  return out;
}

module.exports = { buildDeck, makeKit, newPres, T, pmx, ltr, S };
