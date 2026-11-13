// Shared building blocks for Roni's Hebrew RTL lesson documents.
// House style: hebrew-exam-designer (Assistant body / Rubik headings, A4,
// generous spacing, bordered formula boxes, white background, print-safe).
const fs = require("fs");
const {
  Paragraph, TextRun, Table, TableRow, TableCell, WidthType, ShadingType,
  BorderStyle, AlignmentType, ImageRun, HeadingLevel, LineRuleType,
} = require("docx");

const C = {
  navy: "2F4858",
  teal: "1F5C52",
  red: "C0392B",
  gold: "D9A400",
  grey: "595959",
  line: "C9D6D2",
  tintHead: "E8EFED",   // table header tint
  tintBox: "F4F8F7",    // soft callout
  tintWarn: "FDF3E7",   // misconception callout
  white: "FFFFFF",
};

const BODY = "Assistant";
const HEAD = "Rubik";

const PAGE_W = 11906;          // A4 portrait, DXA
const MARGIN = 1247;           // 2.2 cm
const USABLE = PAGE_W - MARGIN * 2;   // 9412

// ---------------------------------------------------------------- text runs
function run(text, o = {}) {
  return new TextRun({
    text,
    rightToLeft: true,
    font: o.font || BODY,
    size: o.size || 24,          // 12pt
    bold: !!o.bold,
    italics: !!o.italics,
    color: o.color || "1A1A1A",
    break: o.break || undefined,
  });
}

// Latin/math fragments (x, y, (2,4)) must NOT be flagged RTL or Word
// reverses the parentheses.
function ltr(text, o = {}) {
  return new TextRun({
    text,
    rightToLeft: false,
    font: o.font || BODY,
    size: o.size || 24,
    bold: !!o.bold,
    color: o.color || "1A1A1A",
  });
}

// ---------------------------------------------------------------- BIDI
// THE RTL FIX — do not remove.
// A single TextRun holding mixed Hebrew + Latin ("הרביע מוגדר x>0 וגם y>0")
// is re-ordered by Word's bidi algorithm and comes out scrambled: the Latin
// token, the digits and the punctuation around them get flipped relative to
// the Hebrew. Splitting into separate runs — Hebrew flagged rightToLeft:true,
// Latin/maths flagged rightToLeft:false — is NECESSARY but NOT SUFFICIENT:
// Word/LibreOffice's own Unicode Bidi Algorithm still re-shuffles weak/
// neutral characters (digits, + - = ( ) ×) against the surrounding RTL
// paragraph unless the LTR runs are ALSO wrapped in real Unicode embedding
// characters — LRE = U+202A (start left-to-right embedding), PDF = U+202C
// (pop directional formatting). Belt and suspenders: some renderers honour
// the run flag, others need the override characters, always provide both.
// Fixed 24.08.2026 while building lesson 2 (כפל מקוצר) — see journal §4.
// mx() does all of this automatically: split into runs, flag each one,
// AND wrap the LTR ones. Every mixed string goes through it.
const HEB = /[֐-׿]/;
const LAT = /[A-Za-z0-9]/;
const LRE = "‪";
const PDF = "‬";

// Classify every character as "r" (Hebrew), "l" (Latin/digit) or
// "n" (neutral — space, punctuation, math operators, brackets, ·, etc.),
// then resolve every "n":
//   1. Bracket-pair homogeneity — if everything strictly between a matching
//      ( ) or [ ] pair is one direction, the brackets take that direction
//      too. Without this, "(x+5)" can end up with mismatched paren
//      directions and the whole expression turns inside out.
//   2. Sequential resolution — each remaining neutral run takes the
//      direction of its neighbours if they agree, falling back to "r"
//      (the paragraph's own base direction) if they disagree.
function classify(str) {
  const chars = [...String(str)];
  const cls = chars.map((c) => (HEB.test(c) ? "r" : LAT.test(c) ? "l" : "n"));

  const OPEN = { "(": ")", "[": "]" };
  const CLOSE = { ")": "(", "]": "[" };
  const stack = [];
  for (let i = 0; i < chars.length; i++) {
    if (OPEN[chars[i]]) {
      stack.push(i);
    } else if (CLOSE[chars[i]] && stack.length) {
      const open = stack.pop();
      let hasR = false, hasL = false;
      for (let k = open + 1; k < i; k++) {
        if (cls[k] === "r") hasR = true;
        else if (cls[k] === "l") hasL = true;
      }
      if (hasL && !hasR) { cls[open] = "l"; cls[i] = "l"; }
      else if (hasR && !hasL) { cls[open] = "r"; cls[i] = "r"; }
    }
  }

  let last = "r";
  for (let i = 0; i < cls.length; i++) {
    if (cls[i] === "n") {
      let nxt = "r";
      for (let j = i + 1; j < cls.length; j++) {
        if (cls[j] !== "n") { nxt = cls[j]; break; }
      }
      cls[i] = last === nxt ? last : "r";     // mixed boundary -> RTL context
    } else { last = cls[i]; }
  }
  return { chars, cls };
}

function mx(str, o = {}) {
  const { chars, cls } = classify(str);
  const runs = [];
  let buf = "", cur = cls[0] || "r";
  const flush = () => {
    if (!buf) return;
    const isL = cur === "l";
    runs.push(new TextRun({
      text: isL ? LRE + buf + PDF : buf,
      rightToLeft: !isL,
      font: o.font || BODY,
      size: o.size || 22,
      bold: !!o.bold,
      italics: !!o.italics,
      color: o.color || "1A1A1A",
    }));
    buf = "";
  };
  chars.forEach((c, i) => {
    if (cls[i] !== cur) { flush(); cur = cls[i]; }
    buf += c;
  });
  flush();
  return runs;
}

// Paragraph from a mixed Hebrew/Latin string — the safe default.
function MP(str, o = {}) { return P(mx(str, o), o); }

function P(children, o = {}) {
  return new Paragraph({
    bidirectional: true,
    alignment: o.align || AlignmentType.RIGHT,
    // NOTE: lineRule MUST be set explicitly alongside `line`. Without it,
    // LibreOffice (and Word, in some cases) treats the line height as EXACT
    // rather than a minimum/auto multiple — any content taller than that
    // (e.g. a stacked-fraction ImageRun ~40px inside an 11.5pt text line)
    // gets silently CLIPPED rather than growing the line to fit. Confirmed
    // 25.08.2026 while building the ז' start-of-year exam (fraction f_3/8
    // disappeared, leaving only the "8"). See journal.
    spacing: { before: o.before === undefined ? 60 : o.before,
               after: o.after === undefined ? 100 : o.after,
               line: o.line || 300,
               lineRule: LineRuleType.AUTO },
    indent: o.indent,
    keepNext: o.keepNext,
    pageBreakBefore: o.pageBreakBefore,
    border: o.border,
    shading: o.shading,
    children: Array.isArray(children) ? children : [children],
  });
}

function text(t, o = {}) { return P([run(t, o)], o); }

// ------------------------------------------------------------------ titles
function title(t, sub) {
  const out = [
    P([run(t, { font: HEAD, size: 44, bold: true, color: C.navy })],
      { before: 0, after: 60, line: 340 }),
  ];
  if (sub) {
    out.push(P([run(sub, { size: 21, color: C.grey })],
      { before: 0, after: 200 }));
  }
  out.push(rule());
  return out;
}

function h2(t, o = {}) {
  return new Paragraph({
    bidirectional: true,
    alignment: AlignmentType.RIGHT,
    keepNext: true,
    spacing: { before: o.before === undefined ? 360 : o.before, after: 140 },
    border: {
      bottom: { style: BorderStyle.SINGLE, size: 10, color: C.navy, space: 6 },
    },
    children: [run(t, { font: HEAD, size: 30, bold: true, color: C.navy })],
  });
}

function h3(t) {
  return new Paragraph({
    bidirectional: true,
    alignment: AlignmentType.RIGHT,
    keepNext: true,
    spacing: { before: 260, after: 100 },
    children: [run(t, { font: HEAD, size: 25, bold: true, color: C.teal })],
  });
}

function rule() {
  return new Paragraph({
    bidirectional: true,
    spacing: { before: 0, after: 160 },
    border: {
      bottom: { style: BorderStyle.SINGLE, size: 6, color: C.line, space: 2 },
    },
    children: [run("", { size: 2 })],
  });
}

function spacer(h = 160) {
  return new Paragraph({ spacing: { before: 0, after: h },
                         children: [run("", { size: 2 })] });
}

// ------------------------------------------------------------------ tables
const noBorder = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
const thinB = { style: BorderStyle.SINGLE, size: 4, color: C.line };

function cell(children, o = {}) {
  return new TableCell({
    width: { size: o.w, type: WidthType.DXA },
    shading: o.shade
      ? { type: ShadingType.CLEAR, fill: o.shade, color: "auto" }
      : undefined,
    margins: { top: 90, bottom: 90, left: 130, right: 130 },
    verticalAlign: o.valign || undefined,
    borders: o.borders || { top: thinB, bottom: thinB, left: thinB, right: thinB },
    children: Array.isArray(children) ? children : [children],
  });
}

/**
 * RTL table. `rows` = array of arrays of cell-content (string | Paragraph[]).
 * First row is treated as the header. Column widths are given LOGICALLY
 * (rightmost first) and the cells are reversed for correct RTL rendering.
 */
function table(widths, rows, o = {}) {
  const total = widths.reduce((a, b) => a + b, 0);
  const trs = rows.map((cells, ri) => {
    const head = ri === 0 && o.header !== false;
    const built = cells.map((c, ci) => {
      const content = typeof c === "string"
        ? c.split("\n").map((ln, li) => P(
            mx(ln, { bold: head, size: o.size || 21,
                     font: head ? HEAD : BODY,
                     color: head ? C.navy : "1A1A1A" }),
            { before: li === 0 ? 20 : 60, after: 20, line: 280 }))
        : (Array.isArray(c) ? c : [c]);
      return cell(content, {
        w: widths[ci],
        shade: head ? C.tintHead : (o.zebra && ri % 2 === 0 ? C.tintBox : undefined),
      });
    });
    return new TableRow({
      tableHeader: head,
      cantSplit: true,
      children: built.reverse(),          // RTL mirror
    });
  });
  return new Table({
    width: { size: total, type: WidthType.DXA },
    columnWidths: [...widths].reverse(),
    visuallyRightToLeft: true,
    rows: trs,
  });
}

// -------------------------------------------------------------- callout box
function box(lines, o = {}) {
  const fill = o.fill || C.tintBox;
  const edge = o.edge || C.teal;
  const inner = [];
  if (o.label) {
    inner.push(P([run(o.label, { font: HEAD, size: 22, bold: true, color: edge })],
                 { before: 20, after: 60 }));
  }
  lines.forEach((l) => {
    inner.push(typeof l === "string"
      ? P([run(l, { size: 23 })], { before: 20, after: 20, line: 300 })
      : l);
  });
  return new Table({
    width: { size: USABLE, type: WidthType.DXA },
    columnWidths: [USABLE],
    visuallyRightToLeft: true,
    rows: [new TableRow({
      cantSplit: !o.split,
      children: [new TableCell({
        width: { size: USABLE, type: WidthType.DXA },
        shading: { type: ShadingType.CLEAR, fill, color: "auto" },
        margins: { top: 160, bottom: 160, left: 200, right: 200 },
        borders: {
          top: { style: BorderStyle.SINGLE, size: 6, color: edge },
          bottom: { style: BorderStyle.SINGLE, size: 6, color: edge },
          left: { style: BorderStyle.SINGLE, size: 6, color: edge },
          right: { style: BorderStyle.SINGLE, size: 18, color: edge },
        },
        children: inner,
      })],
    })],
  });
}

// ---------------------------------------------------------------- images
function img(file, widthPx, heightPx, o = {}) {
  return new Paragraph({
    alignment: o.align || AlignmentType.CENTER,
    spacing: { before: o.before === undefined ? 120 : o.before,
               after: o.after === undefined ? 120 : o.after },
    children: [new ImageRun({
      type: "png",
      data: fs.readFileSync(file),
      transformation: { width: widthPx, height: heightPx },
    })],
  });
}

// --------------------------------------------------------- answer lines
// Ruled writing space.
// IMPLEMENTATION NOTE — do not "simplify" this back into bordered paragraphs:
// Word and LibreOffice MERGE adjacent paragraphs that carry identical borders
// into a single bordered block, so N ruled paragraphs render as ONE rule with
// a large gap above it. A one-column table with a bottom border per row is the
// only construction that reliably draws N evenly spaced writing lines.
function lines(n, o = {}) {
  const h = o.height || 460;                 // ~0.32" per line
  const rows = [];
  for (let i = 0; i < n; i++) {
    rows.push(new TableRow({
      height: { value: h, rule: "atLeast" },
      cantSplit: true,
      children: [new TableCell({
        width: { size: USABLE, type: WidthType.DXA },
        margins: { top: 0, bottom: 0, left: 0, right: 0 },
        borders: {
          top: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
          left: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
          right: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
          bottom: { style: BorderStyle.DOTTED, size: 6,
                    color: o.color || "A9B5B2" },
        },
        children: [new Paragraph({ bidirectional: true,
                                   spacing: { before: 0, after: 0 },
                                   children: [run("", { size: 22 })] })],
      })],
    }));
  }
  return [
    new Table({
      width: { size: USABLE, type: WidthType.DXA },
      columnWidths: [USABLE],
      visuallyRightToLeft: true,
      rows,
    }),
    new Paragraph({ spacing: { before: 0, after: 200 },
                    children: [run("", { size: 2 })] }),
  ];
}

module.exports = {
  C, BODY, HEAD, PAGE_W, MARGIN, USABLE,
  run, ltr, mx, MP, P, text, title, h2, h3, rule, spacer,
  table, cell, box, img, lines,
  Paragraph, TextRun, AlignmentType, BorderStyle, WidthType, ShadingType,
};
