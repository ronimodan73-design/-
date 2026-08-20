/**
 * "למה בכלל ללמוד מתמטיקה בעידן הבינה המלאכותית?"
 * מצגת מוטיבציה לכיתה ז' — עברית RTL
 */
const pptxgen = require("pptxgenjs");

// ---------- Design system ----------
const DARK = "0A0E27";
const DARK_SOFT = "141A3A";
const CARD_D = "18204A";
const LIGHT = "F4F6FB";
const WHITE = "FFFFFF";
const VIOLET = "6C5CE7";
const MINT = "00D9A5";
const AMBER = "FFB627";
const CORAL = "FF6B6B";
const INK = "0A0E27";
const MUTED_L = "5A6485"; // muted text on light
const MUTED_D = "9AA3C7"; // muted text on dark
const LINE_L = "DFE4F2";

const F = "Arial";
const M = 0.7;                 // page margin
const RIGHT = 13.333 - M;      // right edge (RTL start)
const CW = 13.333 - M * 2;     // content width

const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE";
pres.rtlMode = true;
pres.author = "רוני";
pres.title = "למה ללמוד מתמטיקה בעידן הבינה המלאכותית";

// ---------- helpers ----------
const rtl = (o = {}) => Object.assign({ fontFace: F, rtlMode: true, align: "right" }, o);

function sh() { return { type: "outer", color: "0A0E27", blur: 14, offset: 4, angle: 90, opacity: 0.14 }; }

/** rounded-square badge motif — repeated on every slide */
function badge(s, x, y, glyph, fill, glyphColor, size) {
  const sz = size || 0.66;
  s.addShape(pres.ShapeType.roundRect, {
    x, y, w: sz, h: sz, rectRadius: 0.16, fill: { color: fill }, line: { color: fill },
  });
  s.addText(glyph, rtl({
    x, y, w: sz, h: sz, align: "center", valign: "middle", margin: 0,
    fontSize: Math.round(sz * 30), bold: true, color: glyphColor || DARK,
  }));
}

/** faint math glyphs scattered on dark backgrounds */
function glyphField(s, items) {
  items.forEach(([g, x, y, sz]) => {
    s.addText(g, {
      x, y, w: 2.2, h: 1.6, align: "center", valign: "middle", margin: 0,
      fontFace: F, fontSize: sz, bold: true, color: DARK_SOFT,
    });
  });
}

function darkSlide() {
  const s = pres.addSlide();
  s.background = { color: DARK };
  return s;
}
function lightSlide() {
  const s = pres.addSlide();
  s.background = { color: LIGHT };
  return s;
}

/** standard title block for light content slides */
function heading(s, eyebrow, title, accent) {
  s.addText(eyebrow, rtl({
    x: M, y: 0.42, w: CW, h: 0.3, margin: 0,
    fontSize: 13, bold: true, color: accent || VIOLET, charSpacing: 1.2,
  }));
  s.addText(title, rtl({
    x: M, y: 0.76, w: CW, h: 0.82, margin: 0,
    fontSize: 34, bold: true, color: INK,
  }));
}

/** white content card */
function card(s, x, y, w, h) {
  s.addShape(pres.ShapeType.roundRect, {
    x, y, w, h, rectRadius: 0.06,
    fill: { color: WHITE }, line: { color: LINE_L, width: 1 }, shadow: sh(),
  });
}

// =====================================================================
// 1 — HERO
// =====================================================================
{
  const s = darkSlide();
  glyphField(s, [["∑", 0.15, 0.2, 130], ["π", 11.3, 5.5, 130]]);

  s.addText("כיתה ז׳  ·  שיעור פתיחה", rtl({
    x: M, y: 0.95, w: CW, h: 0.35, margin: 0, fontSize: 14, bold: true, color: MINT, charSpacing: 2,
  }));

  s.addText("למה שאני בכלל", rtl({ x: M, y: 1.5, w: CW, h: 0.95, margin: 0, fontSize: 54, bold: true, color: WHITE }));
  s.addText("אלמד מתמטיקה?", rtl({ x: M, y: 2.4, w: CW, h: 0.95, margin: 0, fontSize: 54, bold: true, color: WHITE }));
  s.addText("הרי יש בינה מלאכותית.", rtl({ x: M, y: 3.35, w: CW, h: 0.95, margin: 0, fontSize: 54, bold: true, color: MINT }));

  s.addShape(pres.ShapeType.roundRect, {
    x: RIGHT - 7.9, y: 4.72, w: 7.9, h: 0.9, rectRadius: 0.08,
    fill: { color: CARD_D }, line: { color: CARD_D },
  });
  s.addText("שאלה מצוינת. באמת. בואו נבדוק אותה עד הסוף — ותחליטו לבד.", rtl({
    x: RIGHT - 7.6, y: 4.72, w: 7.4, h: 0.9, margin: 0, valign: "middle",
    fontSize: 17, color: WHITE,
  }));

  badge(s, M, 6.05, "?", MINT, DARK, 0.72);
  s.addText("14 שקפים  ·  הוכחות מהחיים האמיתיים  ·  בלי סיסמאות", rtl({
    x: M + 0.95, y: 6.05, w: 8, h: 0.72, margin: 0, valign: "middle", align: "left",
    fontSize: 14, color: MUTED_D,
  }));

  s.addNotes([
    "פתיחה (2 דק׳). אל תתחילו בהטפה — תתחילו בהסכמה.",
    "משפט פתיחה מוצע: \"מי כאן חשב לפחות פעם אחת שמתמטיקה זה בזבוז זמן? תרימו יד. אני לא כועס — אני מסכים שזו שאלה הגיונית.\"",
    "המטרה של השקף: להוריד התנגדות. ברגע שהתלמיד מרגיש שהשאלה שלו לגיטימית, הוא מקשיב לתשובה.",
    "אל תענו עדיין. תגידו: \"אני לא הולך לענות לכם. אני הולך להראות לכם ארבע הוכחות, ואתם תחליטו.\"",
  ].join("\n"));
}

// =====================================================================
// 2 — TIMELINE: כל דור אמר את זה
// =====================================================================
{
  const s = lightSlide();
  heading(s, "רגע לפני שעונים", "אתם לא הראשונים ששואלים את זה");

  const steps = [
    ["1614", "לוגריתמים", "\"עכשיו יש טבלאות — למה לחשב לבד?\"", VIOLET],
    ["1972", "מחשבון כיס", "\"עכשיו יש מחשבון — למה ללמוד כפל?\"", MINT],
    ["1998", "גוגל", "\"הכול בחיפוש — למה לזכור משהו?\"", AMBER],
    ["2022", "בינה מלאכותית", "\"הוא פותר הכול — למה שאלמד?\"", CORAL],
  ];

  const cw = 2.78, gap = 0.27;
  steps.forEach((st, i) => {
    const x = RIGHT - cw - i * (cw + gap); // RTL: first item on the right
    card(s, x, 2.0, cw, 2.95);
    badge(s, x + cw - 0.62 - 0.28, 2.26, String(i + 1), st[3], WHITE, 0.62);
    s.addText(st[0], rtl({ x: x + 0.28, y: 2.26, w: cw - 1.3, h: 0.62, margin: 0, valign: "middle", fontSize: 22, bold: true, color: INK }));
    s.addText(st[1], rtl({ x: x + 0.28, y: 3.0, w: cw - 0.56, h: 0.36, margin: 0, fontSize: 15, bold: true, color: st[3] }));
    s.addText(st[2], rtl({ x: x + 0.28, y: 3.42, w: cw - 0.56, h: 1.35, margin: 0, fontSize: 13, color: MUTED_L, lineSpacingMultiple: 1.15 }));
  });

  s.addShape(pres.ShapeType.roundRect, {
    x: M, y: 5.35, w: CW, h: 1.4, rectRadius: 0.06, fill: { color: DARK }, line: { color: DARK },
  });
  s.addText([
    { text: "עברו 400 שנה. הכלים התחלפו — ובכל דור המשיכו ללמד מתמטיקה. ", options: { color: WHITE } },
    { text: "לא כי הכלי לא עובד. כי הכלי לא יודע מה לבקש ממנו.", options: { color: MINT, bold: true } },
  ], rtl({ x: M + 0.35, y: 5.35, w: CW - 0.7, h: 1.4, margin: 0, valign: "middle", fontSize: 18 }));

  s.addNotes([
    "3 דק׳. זה השקף שמפרק את הטיעון בלי להתווכח.",
    "שאלו: \"מי חושב שההורים שלכם למדו לוח כפל למרות שהיה להם מחשבון? למה בעצם?\"",
    "הנקודה: כל טכנולוגיה חדשה נראית כמו סוף הצורך בידע — ובפועל היא מעלה את הרף למי שכן יודע.",
    "רעיון: תנו לתלמיד להשלים את הכרטיס החמישי — \"מה תהיה הטכנולוגיה של 2040?\"",
  ].join("\n"));
}

// =====================================================================
// 3 — מתמטיקה זה לא מספרים
// =====================================================================
{
  const s = lightSlide();
  heading(s, "האמת שאף אחד לא אומר לכם", "מתמטיקה היא לא מספרים. היא אימון חשיבה.", MINT);

  const rows = [
    ["פירוק", "לקחת בעיה ענקית ומפחידה ולשבור אותה לשלבים קטנים שאפשר לפתור", VIOLET],
    ["דפוסים", "לזהות חוקיות במקום לנחש — בלוח מבחנים, בגרף מכירות או בהתנהגות של אנשים", MINT],
    ["הוכחה", "להבדיל בין \"נראה לי נכון\" לבין \"אני יכול להראות למה זה נכון\"", AMBER],
    ["התמדה", "לשבת מול משהו שלא עובד, ולא לקום — זה שריר, ומאמנים אותו בתרגילים", CORAL],
  ];

  const bw = 6.1;
  rows.forEach((r, i) => {
    const y = 1.95 + i * 1.28;
    s.addShape(pres.ShapeType.roundRect, {
      x: RIGHT - bw, y, w: bw, h: 1.14, rectRadius: 0.06,
      fill: { color: WHITE }, line: { color: LINE_L, width: 1 }, shadow: sh(),
    });
    badge(s, RIGHT - 0.28 - 0.62, y + 0.25, String(i + 1), r[2], WHITE, 0.62);
    s.addText(r[0], rtl({ x: RIGHT - bw + 0.3, y: y + 0.16, w: bw - 1.45, h: 0.35, margin: 0, fontSize: 17, bold: true, color: INK }));
    s.addText(r[1], rtl({ x: RIGHT - bw + 0.3, y: y + 0.53, w: bw - 1.45, h: 0.5, margin: 0, fontSize: 12.5, color: MUTED_L }));
  });

  // left visual: the "so what" panel
  s.addShape(pres.ShapeType.roundRect, {
    x: M, y: 1.95, w: CW - bw - 0.4, h: 4.94, rectRadius: 0.06, fill: { color: DARK }, line: { color: DARK },
  });
  const px = M + 0.42, pw = CW - bw - 0.4 - 0.84;
  s.addText("אז מה בעצם למדתם?", rtl({ x: px, y: 2.3, w: pw, h: 0.4, margin: 0, fontSize: 20, bold: true, color: MINT }));
  s.addText(
    "אתם לא תשתמשו במשוואה ריבועית בסופר.\n\nאבל אתם כן תשתמשו — כל יום, כל החיים — ביכולת לפרק בעיה, לזהות שמישהו מנסה לעבוד עליכם, ולהתעקש עד שמבינים.\n\nאת השרירים האלה אי אפשר להוריד באפליקציה.",
    rtl({ x: px, y: 2.82, w: pw, h: 3.1, margin: 0, fontSize: 15, color: WHITE, lineSpacingMultiple: 1.25 })
  );
  badge(s, px, 6.05, "=", MINT, DARK, 0.6);

  s.addNotes([
    "4 דק׳. זה הרעיון המרכזי של כל המצגת — אל תרוצו.",
    "אנלוגיה מומלצת: \"שחקן כדורסל מרים משקולות. הוא אף פעם לא ירים משקולת במשחק. אז למה? כי המשקולת בונה את הגוף שמשחק.\" תרגילים = משקולות למוח.",
    "פדגוגית: כאן עוברים מ\"מתמטיקה כתוכן\" ל\"מתמטיקה כמיומנות חשיבה\" — זו ההצדקה החזקה ביותר בעידן שבו התוכן זמין לכולם.",
    "שאלת דיון: \"מתי בפעם האחרונה נתקעתם במשהו ולא ויתרתם? איך הרגשתם אחר כך?\"",
  ].join("\n"));
}

// =====================================================================
// 4 — הוכחה 1: כסף (dark punch)
// =====================================================================
{
  const s = darkSlide();
  glyphField(s, [["₪", 0.3, 5.3, 130], ["%", 11.3, 0.25, 110]]);

  s.addText("הוכחה 1  ·  הכסף שלכם", rtl({ x: M, y: 0.5, w: CW, h: 0.32, margin: 0, fontSize: 14, bold: true, color: AMBER, charSpacing: 2 }));
  s.addText("\"רק 250 ₪ לחודש\" — הטריק שעובד על מבוגרים", rtl({ x: M, y: 0.9, w: CW, h: 0.75, margin: 0, fontSize: 34, bold: true, color: WHITE }));

  const boxes = [
    ["3,000 ₪", "מחיר הטלפון במדבקה", MUTED_D],
    ["250 ₪ × 18", "\"בלי ריבית, בנוחות\"", MUTED_D],
    ["4,500 ₪", "מה שבאמת יצא מהכיס", AMBER],
  ];
  const bw2 = 3.75, g2 = 0.32;
  boxes.forEach((b, i) => {
    const x = RIGHT - bw2 - i * (bw2 + g2);
    s.addShape(pres.ShapeType.roundRect, {
      x, y: 1.95, w: bw2, h: 1.95, rectRadius: 0.08,
      fill: { color: CARD_D }, line: { color: i === 2 ? AMBER : CARD_D, width: i === 2 ? 2 : 1 },
    });
    s.addText(b[0], rtl({ x: x + 0.3, y: 2.15, w: bw2 - 0.6, h: 0.85, margin: 0, align: "center", valign: "middle", fontSize: 38, bold: true, color: i === 2 ? AMBER : WHITE }));
    s.addText(b[1], rtl({ x: x + 0.3, y: 3.1, w: bw2 - 0.6, h: 0.55, margin: 0, align: "center", fontSize: 13, color: b[2] }));
  });

  s.addText("1,500 ₪", rtl({ x: RIGHT - 4.6, y: 4.35, w: 4.6, h: 1.15, margin: 0, align: "center", valign: "middle", fontSize: 66, bold: true, color: CORAL }));
  s.addText("שילמת יותר. 50% מהמחיר.\nעל טלפון אחד.", rtl({ x: RIGHT - 4.6, y: 5.55, w: 4.6, h: 0.75, margin: 0, align: "center", fontSize: 15, color: WHITE }));

  s.addShape(pres.ShapeType.roundRect, { x: M, y: 4.35, w: CW - 4.9, h: 2.15, rectRadius: 0.08, fill: { color: CARD_D }, line: { color: CARD_D } });
  s.addText("החישוב שהציל אתכם ארך 4 שניות: 250 × 18.\nזה כפל של כיתה ד׳ — ורוב האנשים לא עושים אותו לפני שהם חותמים.\nלא כי הם טיפשים. כי הם לא רגילים לעצור ולחשב.",
    rtl({ x: M + 0.35, y: 4.35, w: CW - 5.6, h: 2.15, margin: 0, valign: "middle", fontSize: 15, color: WHITE, lineSpacingMultiple: 1.3 }));

  s.addNotes([
    "3 דק׳. תרגילו את זה כמשחק, לא כהרצאה.",
    "בקשו מהכיתה: \"תוציאו טלפון. מי מחשב ראשון 250 כפול 18?\" — תנו לזה להיות תחרות. אחרי שהמספר עולה, שתקו 3 שניות. השקט עושה את העבודה.",
    "שאלו: \"מי בבית שלכם קנה משהו בתשלומים החודש?\" — הופכים את זה למשימת בית אמיתית.",
    "אזהרה: אל תלעגו למבוגרים. המסר הוא \"החישוב הזה זמין לכל אחד, כולל לכם, כבר עכשיו\".",
  ].join("\n"));
}

// =====================================================================
// 5 — הוכחה 2: אחוזים / המבצע המזויף
// =====================================================================
{
  const s = lightSlide();
  heading(s, "הוכחה 2  ·  מי שלא יודע אחוזים, משלם עליהם", "\"20% הנחה!\" — שווה בדיוק 0 ₪", CORAL);

  const steps = [
    ["100 ₪", "המחיר בשבוע שעבר", INK, LINE_L],
    ["125 ₪", "העלאה שקטה של 25%", AMBER, AMBER],
    ["100 ₪", "אחרי \"20% הנחה\"", CORAL, CORAL],
  ];
  const cw3 = 3.35, g3 = 0.55;
  steps.forEach((st, i) => {
    const x = RIGHT - cw3 - i * (cw3 + g3);
    s.addShape(pres.ShapeType.roundRect, {
      x, y: 2.05, w: cw3, h: 2.45, rectRadius: 0.06,
      fill: { color: WHITE }, line: { color: st[3], width: i === 0 ? 1 : 2 }, shadow: sh(),
    });
    s.addText(st[0], rtl({ x: x + 0.2, y: 2.3, w: cw3 - 0.4, h: 0.95, margin: 0, align: "center", valign: "middle", fontSize: 44, bold: true, color: st[2] }));
    s.addText(st[1], rtl({ x: x + 0.2, y: 3.45, w: cw3 - 0.4, h: 0.65, margin: 0, align: "center", fontSize: 14, color: MUTED_L }));
    if (i < 2) {
      s.addText("←", { x: x - g3 - 0.05, y: 2.95, w: g3 + 0.1, h: 0.6, margin: 0, align: "center", valign: "middle", fontFace: F, fontSize: 26, bold: true, color: MUTED_L });
    }
  });

  s.addShape(pres.ShapeType.roundRect, { x: M, y: 4.95, w: CW, h: 1.75, rectRadius: 0.06, fill: { color: DARK }, line: { color: DARK } });
  badge(s, RIGHT - 0.42 - 0.66, 5.5, "!", CORAL, WHITE, 0.66);
  s.addText("שילמתם בדיוק אותו מחיר — והרגשתם שחסכתם.", rtl({ x: M + 0.4, y: 5.15, w: CW - 1.65, h: 0.4, margin: 0, fontSize: 19, bold: true, color: WHITE }));
  s.addText("החנות לא שיקרה באף מילה. היא רק סמכה על זה שלא תחשבו. 125 פחות 20% = 100.", rtl({ x: M + 0.4, y: 5.62, w: CW - 1.65, h: 0.45, margin: 0, fontSize: 16, color: MINT }));

  s.addNotes([
    "3 דק׳. זה השקף שהתלמידים מספרים עליו בבית.",
    "לפני שחושפים את הכרטיס השלישי — שאלו: \"אם מחיר עלה ב-25% ואז ירד ב-20%, לאן חזרנו?\" רובם יגידו \"מעל המחיר המקורי\" או \"מתחת\". תנו להם לחשב.",
    "המשך אפשרי בלוח: מה קורה בכיוון ההפוך — 100, ירידה של 20% (=80), ואז עלייה של 20% (=96). לא חוזרים ל-100! זה מפוצץ את התחושה ש\"אחוזים מתקזזים\".",
    "חיבור לתוכנית הלימודים: אחוזים כיתה ז׳ — עלייה ואחריה ירידה, בסיס משתנה. השקף הזה הוא בדיוק הפתיח לנושא.",
  ].join("\n"));
}

// =====================================================================
// 6 — הוכחה 3: ה-AI עשוי ממתמטיקה (dark)
// =====================================================================
{
  const s = darkSlide();
  glyphField(s, [["∫", 0.12, 5.75, 115], ["Σ", 11.45, 0.1, 115]]);

  s.addText("הוכחה 3  ·  מה יש בתוך הקופסה", rtl({ x: M, y: 0.5, w: CW, h: 0.32, margin: 0, fontSize: 14, bold: true, color: VIOLET, charSpacing: 2 }));
  s.addText("בתוך הבינה המלאכותית אין מילים. יש מספרים.", rtl({ x: M, y: 0.88, w: CW, h: 0.8, margin: 0, fontSize: 34, bold: true, color: WHITE }));

  const inner = [
    ["וקטורים", "כל מילה הופכת לרשימה של מאות מספרים. \"מלך\" ו\"מלכה\" קרובים זה לזה — כמו נקודות על מערכת צירים.", "( x , y )", VIOLET],
    ["הסתברות", "הוא לא \"יודע\" את התשובה. הוא מחשב איזו מילה הכי סבירה להופיע עכשיו — ובוחר אותה.", "P = 0.87", MINT],
    ["פונקציות", "הלמידה שלו היא חיפוש נקודת מינימום של פונקציית שגיאה. בדיוק אותו רעיון של גרף ומינימום.", "f (x)", AMBER],
  ];
  const cw4 = 3.85, g4 = 0.27;
  inner.forEach((it, i) => {
    const x = RIGHT - cw4 - i * (cw4 + g4);
    s.addShape(pres.ShapeType.roundRect, { x, y: 1.95, w: cw4, h: 3.5, rectRadius: 0.08, fill: { color: CARD_D }, line: { color: CARD_D } });
    s.addText(it[2], { x: x + 0.3, y: 2.15, w: cw4 - 0.6, h: 0.55, margin: 0, align: "left", valign: "middle", fontFace: F, fontSize: 22, bold: true, color: it[3] });
    s.addText(it[0], rtl({ x: x + 0.3, y: 2.75, w: cw4 - 0.6, h: 0.42, margin: 0, fontSize: 21, bold: true, color: WHITE }));
    s.addText(it[1], rtl({ x: x + 0.3, y: 3.22, w: cw4 - 0.6, h: 2.0, margin: 0, fontSize: 13.5, color: MUTED_D, lineSpacingMultiple: 1.25 }));
  });

  s.addText([
    { text: "מי שלא יודע מתמטיקה — משתמש בבינה מלאכותית.  ", options: { color: MUTED_D } },
    { text: "מי שיודע — בונה אותה.", options: { color: MINT, bold: true } },
  ], rtl({ x: M, y: 5.8, w: CW, h: 0.8, margin: 0, valign: "middle", fontSize: 22, bold: true }));

  s.addNotes([
    "3 דק׳. זה השקף שהופך את הטיעון של התלמיד נגדו — בעדינות.",
    "משפט מפתח: \"אתם אומרים שה-AI מייתר מתמטיקה. אבל ה-AI *הוא* מתמטיקה. זה כמו לומר שהמאפייה מייתרת את הקמח.\"",
    "אל תיכנסו לעומק טכני. מספיק שהם יבינו: מאחורי הקסם עומדות נקודות על מערכת צירים, אחוזים וסיכויים, וגרפים של פונקציות — כל אלה נלמדים בחטיבה.",
    "חיבור לעתיד: כל המקצועות שיבנו וינהלו AI דורשים 5 יחידות. זו לא סיסמה — זו דרישת סף.",
  ].join("\n"));
}

// =====================================================================
// 7 — הוכחה 4: ה-AI טועה בביטחון
// =====================================================================
{
  const s = lightSlide();
  heading(s, "הוכחה 4  ·  הסכנה האמיתית", "הוא טועה — ובדיוק באותו טון בטוח", AMBER);

  // chat bubbles
  const bw5 = 7.15;
  s.addShape(pres.ShapeType.roundRect, { x: RIGHT - bw5, y: 1.95, w: bw5, h: 0.95, rectRadius: 0.1, fill: { color: VIOLET }, line: { color: VIOLET } });
  s.addText("מוצר עולה 80 ₪ אחרי הנחה של 20%. מה היה המחיר לפני?", rtl({
    x: RIGHT - bw5 + 0.3, y: 1.95, w: bw5 - 0.6, h: 0.95, margin: 0, valign: "middle", fontSize: 15, color: WHITE,
  }));

  s.addShape(pres.ShapeType.roundRect, { x: RIGHT - bw5, y: 3.1, w: bw5, h: 1.7, rectRadius: 0.1, fill: { color: WHITE }, line: { color: CORAL, width: 2 }, shadow: sh() });
  s.addText([
    { text: "מוסיפים 20% ל-80: ", options: { color: INK } },
    { text: "80 × 1.2 = 96 ₪.", options: { color: CORAL, bold: true } },
    { text: "\nהמחיר המקורי היה 96 ₪. בהצלחה בקנייה!", options: { color: INK } },
  ], rtl({ x: RIGHT - bw5 + 0.3, y: 3.1, w: bw5 - 0.6, h: 1.7, margin: 0, valign: "middle", fontSize: 16, lineSpacingMultiple: 1.3 }));
  s.addText("תשובה שגויה", rtl({ x: RIGHT - bw5 + 0.3, y: 4.92, w: 2.2, h: 0.32, margin: 0, fontSize: 12, bold: true, color: CORAL }));

  s.addShape(pres.ShapeType.roundRect, { x: RIGHT - bw5, y: 5.28, w: bw5, h: 1.55, rectRadius: 0.1, fill: { color: DARK }, line: { color: DARK } });
  s.addText([
    { text: "הפתרון הנכון: ", options: { color: MINT, bold: true } },
    { text: "80 היא 80% מהמחיר המקורי, לכן  80 ÷ 0.8 = ", options: { color: WHITE } },
    { text: "100 ₪.", options: { color: MINT, bold: true } },
    { text: "\nההנחה נלקחת מהמחיר הגבוה — לא מהנמוך. פער של 4 ₪ פר מוצר, בכל קנייה, כל החיים.", options: { color: MUTED_D, fontSize: 13 } },
  ], rtl({ x: RIGHT - bw5 + 0.3, y: 5.28, w: bw5 - 0.6, h: 1.55, margin: 0, valign: "middle", fontSize: 15.5, lineSpacingMultiple: 1.25 }));

  // left panel
  const lw = CW - bw5 - 0.4;
  s.addShape(pres.ShapeType.roundRect, { x: M, y: 1.95, w: lw, h: 4.88, rectRadius: 0.06, fill: { color: WHITE }, line: { color: LINE_L, width: 1 }, shadow: sh() });
  badge(s, RIGHT - bw5 - 0.4 - 0.35 - 0.66, 2.3, "!", AMBER, WHITE, 0.66);
  s.addText("למה זה מסוכן?", rtl({ x: M + 0.35, y: 2.3, w: lw - 1.6, h: 0.66, margin: 0, valign: "middle", fontSize: 21, bold: true, color: INK }));
  s.addText(
    "מנוע חיפוש אומר \"לא מצאתי\".\nבינה מלאכותית אף פעם לא אומרת \"לא יודע\" — היא ממציאה תשובה שנשמעת מושלמת.\n\nהיא כתובה בעברית תקינה, בביטחון מלא, עם חישוב שנראה הגיוני.\n\nאין שום דבר בתשובה שמסגיר שהיא שגויה —\nחוץ מהידע שלכם.",
    rtl({ x: M + 0.35, y: 3.15, w: lw - 0.7, h: 3.5, margin: 0, fontSize: 14, color: MUTED_L, lineSpacingMultiple: 1.25 })
  );

  s.addNotes([
    "4 דק׳. זו ההוכחה החזקה ביותר — אל תדלגו עליה.",
    "הפעלה מומלצת: הציגו רק את השאלה ואת תשובת ה-AI. שאלו \"מי מסכים איתו?\" — הרבה ידיים יעלו. רק אז חשפו את הפתרון הנכון.",
    "הטעות כאן אמיתית ונפוצה גם אצל בני אדם: בלבול בין 'להוסיף 20%' לבין 'לחלק ב-0.8'. הבסיס של האחוז השתנה.",
    "מסר הסיום: \"בינה מלאכותית היא כלי מדהים — בידיים של מי שיודע לבדוק אותה. בידיים של מי שלא, היא מגדילה טעויות במקום להקטין.\"",
    "אפשר להראות דוגמה חיה בכיתה — אבל בדקו אותה מראש, מודלים משתנים.",
  ].join("\n"));
}

// =====================================================================
// 8 — כמה זה שווה בכסף (chart)
// =====================================================================
{
  const s = lightSlide();
  heading(s, "ובכל זאת — בואו נדבר תכל׳ס", "מתמטיקה היא המקצוע היקר ביותר בתעודה", MINT);

  s.addChart(pres.ChartType.bar,
    [{
      name: "שכר חודשי ברוטו ממוצע",
      labels: ["ממוצע במשק", "ענף ההייטק"],
      values: [12500, 30000],
    }],
    {
      x: M, y: 2.0, w: 6.3, h: 4.75,
      barDir: "col", barGapWidthPct: 90,
      chartColors: [VIOLET, MINT],
      varyColors: true,
      showTitle: true, title: "שכר חודשי ממוצע בשקלים", titleColor: INK, titleFontSize: 15, titleFontFace: F,
      showValue: true, dataLabelPosition: "outEnd", dataLabelColor: INK,
      dataLabelFontSize: 15, dataLabelFontBold: true, dataLabelFontFace: F,
      dataLabelFormatCode: "#,##0",
      showLegend: false,
      catAxisLabelColor: MUTED_L, catAxisLabelFontSize: 13, catAxisLabelFontFace: F,
      valAxisLabelColor: MUTED_L, valAxisLabelFontSize: 11, valAxisLabelFontFace: F,
      valAxisMaxVal: 34000, valAxisMinVal: 0, valAxisMajorUnit: 5000,
      valGridLine: { color: LINE_L, size: 1 },
      catGridLine: { style: "none" },
      plotArea: { fill: { color: LIGHT } },
      chartArea: { fill: { color: LIGHT } },
    }
  );

  const rw = CW - 6.3 - 0.4;
  const facts = [
    ["פי 2 ומעלה", "כך גדול השכר הממוצע בהייטק לעומת הממוצע במשק. כמעט כל תפקיד שם עובר דרך מתמטיקה.", MINT],
    ["בונוס בשכם", "5 יחידות מתמטיקה מזכות בתוספת ניקוד משמעותית בקבלה לאוניברסיטה — עוד לפני שנגעתם במקצוע עצמו.", VIOLET],
    ["תנאי סף", "רפואה, הנדסה, מדעי המחשב, אדריכלות, כלכלה, קורס טיס — לא ממליצים על מתמטיקה מוגברת. דורשים אותה.", AMBER],
  ];
  facts.forEach((f, i) => {
    const y = 2.0 + i * 1.62;
    s.addShape(pres.ShapeType.roundRect, { x: RIGHT - rw, y, w: rw, h: 1.45, rectRadius: 0.06, fill: { color: WHITE }, line: { color: LINE_L, width: 1 }, shadow: sh() });
    s.addText(f[0], rtl({ x: RIGHT - rw + 0.3, y: y + 0.14, w: rw - 0.6, h: 0.42, margin: 0, fontSize: 19, bold: true, color: f[2] }));
    s.addText(f[1], rtl({ x: RIGHT - rw + 0.3, y: y + 0.58, w: rw - 0.6, h: 0.82, margin: 0, fontSize: 12.5, color: MUTED_L, lineSpacingMultiple: 1.15 }));
  });

  s.addText("סדרי גודל על בסיס נתוני הלשכה המרכזית לסטטיסטיקה. הנתון המדויק משתנה משנה לשנה — היחס לא.", rtl({
    x: M, y: 6.95, w: CW, h: 0.32, margin: 0, fontSize: 10.5, color: MUTED_L, italic: true,
  }));

  s.addNotes([
    "2 דק׳. לכיתה ז׳ זה רחוק — אבל דווקא בגיל הזה נקבעות ההקבצות שיקבעו את היחידות.",
    "אל תמכרו \"תהיו עשירים\". תמכרו \"אל תסגרו לעצמכם דלתות בגיל 13\".",
    "משפט מפתח: \"בכיתה י׳ תבחרו יחידות. אבל את הבחירה הזאת אתם עושים כבר עכשיו, בשיעורי הבית של החודש הזה.\"",
    "אם עולה \"אבל יש עשירים בלי מתמטיקה\" — הסכימו: \"נכון, יש כמה דרכים. מתמטיקה היא זו שמשאירה את *כל* הדרכים פתוחות.\"",
    "עדכנו את המספרים בגרף אם יש נתוני למ״ס עדכניים יותר.",
  ].join("\n"));
}

// =====================================================================
// 9 — מקצועות
// =====================================================================
{
  const s = lightSlide();
  heading(s, "איפה זה מחכה לכם", "שישה מקצועות. כולם עוברים דרך אותה כיתה.", VIOLET);

  const jobs = [
    ["רופא/ה", "מינון תרופה לפי משקל, קריאת בדיקות דם באחוזים, סטטיסטיקה של סיכון", CORAL],
    ["מפתח/ת תוכנה", "אלגוריתמים, לוגיקה, פונקציות — התוכנה היא מתמטיקה שכתובה במילים", VIOLET],
    ["אדריכל/ית", "קנה מידה, שטחים ונפחים, פיתגורס וזוויות בכל שרטוט", MINT],
    ["מנהל/ת כספים", "ריבית, אחוזי רווח, תחזיות — כל החלטה עסקית היא חישוב", AMBER],
    ["טייס/ת", "מהירות, זווית, זמן ודלק — חישוב מהיר בראש תוך כדי טיסה", VIOLET],
    ["פסיכולוג/ית", "מחקר וסטטיסטיקה: להבדיל בין תוצאה אמיתית לבין מקריות", MINT],
  ];
  const cw6 = 3.85, ch6 = 2.15, gx = 0.27, gy = 0.32;
  jobs.forEach((j, i) => {
    const col = i % 3, row = Math.floor(i / 3);
    const x = RIGHT - cw6 - col * (cw6 + gx);
    const y = 2.0 + row * (ch6 + gy);
    s.addShape(pres.ShapeType.roundRect, { x, y, w: cw6, h: ch6, rectRadius: 0.06, fill: { color: WHITE }, line: { color: LINE_L, width: 1 }, shadow: sh() });
    badge(s, x + cw6 - 0.28 - 0.56, y + 0.26, String(i + 1), j[2], WHITE, 0.56);
    s.addText(j[0], rtl({ x: x + 0.28, y: y + 0.26, w: cw6 - 1.3, h: 0.56, margin: 0, valign: "middle", fontSize: 18, bold: true, color: INK }));
    s.addText(j[1], rtl({ x: x + 0.28, y: y + 0.95, w: cw6 - 0.56, h: 1.05, margin: 0, fontSize: 12.5, color: MUTED_L, lineSpacingMultiple: 1.2 }));
  });

  s.addText("ואם תבחרו מקצוע אחר לגמרי — עדיין תנהלו משכורת, תיקח משכנתה ותצביעו על סמך נתונים. אין דרך לצאת מזה.", rtl({
    x: M, y: 6.78, w: CW, h: 0.45, margin: 0, fontSize: 14, bold: true, color: INK,
  }));

  s.addNotes([
    "2 דק׳. הפעילו את הכיתה: \"מי רוצה להיות משהו שאין ברשימה? תגידו לי מה — ואני אמצא לכם את המתמטיקה שבו.\"",
    "כמעט תמיד תמצאו: ספורטאי (סטטיסטיקה וזוויות), שף (יחס ופרופורציה במתכון), יוטיובר (אחוזי צפייה, תמחור פרסום), מעצב (קנה מידה ופרופורציות).",
    "זה רגע ההפתעה של השיעור — אל תוותרו עליו לטובת קריאה מהשקף.",
  ].join("\n"));
}

// =====================================================================
// 10 — במה שאתם אוהבים
// =====================================================================
{
  const s = lightSlide();
  heading(s, "ורגע — זה כבר בכיס שלכם", "כל דבר שאתם אוהבים רץ על מתמטיקה", MINT);

  const fun = [
    ["הפיד שלכם", "האלגוריתם מדרג כל סרטון בציון הסתברות: מה הסיכוי שתישארו לצפות. הפיד שלכם הוא תוצאה של חישוב.", VIOLET],
    ["גיימינג", "כל ירייה היא וקטור, כל קפיצה היא פונקציה, ה-FPS הוא יחס. המנוע של המשחק הוא מחשבון ענק.", MINT],
    ["ספורט", "אחוזי קליעה, ממוצעים, זווית הזריקה המושלמת. מאמנים היום בוחרים הרכב לפי נתונים.", AMBER],
    ["מוזיקה", "אוקטבה = הכפלת התדר פי 2. מקצב הוא שברים. הבינו את זה — ותשמעו אחרת.", CORAL],
  ];
  const cw7 = 2.9, gx7 = 0.29;
  fun.forEach((f, i) => {
    const x = RIGHT - cw7 - i * (cw7 + gx7);
    s.addShape(pres.ShapeType.roundRect, { x, y: 2.05, w: cw7, h: 3.6, rectRadius: 0.06, fill: { color: WHITE }, line: { color: LINE_L, width: 1 }, shadow: sh() });
    badge(s, x + cw7 - 0.28 - 0.6, 2.3, String(i + 1), f[2], WHITE, 0.6);
    s.addText(f[0], rtl({ x: x + 0.28, y: 3.05, w: cw7 - 0.56, h: 0.45, margin: 0, fontSize: 19, bold: true, color: INK }));
    s.addText(f[1], rtl({ x: x + 0.28, y: 3.55, w: cw7 - 0.56, h: 1.85, margin: 0, fontSize: 13, color: MUTED_L, lineSpacingMultiple: 1.25 }));
  });

  s.addShape(pres.ShapeType.roundRect, { x: M, y: 5.92, w: CW, h: 1.08, rectRadius: 0.06, fill: { color: DARK }, line: { color: DARK } });
  s.addText("אתם לא \"נכנסים\" למתמטיקה בשיעור. אתם חיים בתוכה כל היום — השאלה היחידה היא אם אתם מבינים מה קורה סביבכם או רק מרגישים אותו.", rtl({
    x: M + 0.4, y: 5.92, w: CW - 0.8, h: 1.08, margin: 0, valign: "middle", fontSize: 17, color: WHITE,
  }));

  s.addNotes([
    "2 דק׳. שקף אנרגטי — קצב מהיר, בלי להעמיק.",
    "שאלו לפני החשיפה: \"למה הפיד של כל אחד מכם נראה אחרת?\" זה מוביל ישירות להסתברות ולדירוג.",
    "אם יש זמן: חשבו יחד כמה שניות ביום כל אחד מבזבז על הפיד, כפול 365. עוד תרגיל כפל שמשנה תודעה.",
  ].join("\n"));
}

// =====================================================================
// 11 — המיתוס (dark)
// =====================================================================
{
  const s = darkSlide();
  glyphField(s, [["≠", 0.12, 0.2, 130], ["∞", 11.45, 6.0, 110]]);

  s.addText("המשפט שעולה הכי הרבה כסף", rtl({ x: M, y: 0.5, w: CW, h: 0.32, margin: 0, fontSize: 14, bold: true, color: CORAL, charSpacing: 2 }));
  s.addText("\"אני פשוט לא בנאדם של מתמטיקה\"", rtl({ x: M, y: 0.9, w: CW, h: 0.85, margin: 0, fontSize: 40, bold: true, color: WHITE }));
  s.addText("זו לא אבחנה. זו החלטה — ואפשר לבטל אותה.", rtl({ x: M, y: 1.75, w: CW, h: 0.5, margin: 0, fontSize: 20, bold: true, color: MINT }));

  const myths = [
    ["המוח לא נולד גמור", "היכולת המתמטית משתנה עם אימון, בכל גיל. \"ראש מתמטי\" הוא ראש שהתאמן — לא ראש שנולד."],
    ["אתם לא תקועים — פספסתם שלב", "כמעט תמיד הקושי בכיתה ז׳ הוא חור בשברים או בשלמים מכיתה ה׳. סוגרים את החור, והכול נפתח."],
    ["מהירות היא לא חוכמה", "מי שפותר לאט ומבין לעומק יגיע רחוק יותר ממי שפותר מהר ומעתיק שיטה. בבגרות אין פרס על מהירות."],
  ];
  const cw8 = 3.85, gx8 = 0.27;
  myths.forEach((m, i) => {
    const x = RIGHT - cw8 - i * (cw8 + gx8);
    s.addShape(pres.ShapeType.roundRect, { x, y: 2.55, w: cw8, h: 2.95, rectRadius: 0.08, fill: { color: CARD_D }, line: { color: CARD_D } });
    badge(s, x + cw8 - 0.3 - 0.58, 2.78, String(i + 1), MINT, DARK, 0.58);
    s.addText(m[0], rtl({ x: x + 0.3, y: 2.78, w: cw8 - 1.35, h: 0.58, margin: 0, valign: "middle", fontSize: 16, bold: true, color: MINT }));
    s.addText(m[1], rtl({ x: x + 0.3, y: 3.52, w: cw8 - 0.6, h: 1.8, margin: 0, fontSize: 13.5, color: WHITE, lineSpacingMultiple: 1.25 }));
  });

  s.addText("אף אחד לא אומר \"אני פשוט לא בנאדם של ללכת\" אחרי שנפל פעם אחת בגיל שנה. במתמטיקה מותר ליפול בדיוק באותה מידה.", rtl({
    x: M, y: 5.85, w: CW, h: 0.85, margin: 0, valign: "middle", fontSize: 17, color: MUTED_D,
  }));

  s.addNotes([
    "4 דק׳ — ותנו לזה מקום רגשי. בכיתה ז׳ יושבים תלמידים שכבר ויתרו על עצמם.",
    "ספרו סיפור אישי: תלמיד/ה שהיה/הייתה בטוח/ה שאין לו/לה ראש למתמטיקה, ומה קרה. אמיתי עובד יותר מכל מחקר.",
    "המסר המקצועי מאחורי השקף: תפיסת חשיבה מתפתחת (growth mindset) + אבחון פערים כלפי מטה. תלמיד ש\"לא מבין ז׳\" בדרך כלל חסר בסיס מ-ה׳-ו׳.",
    "משפט לסיום: \"מי שמרגיש שהוא לא מבין — בוא אליי בסוף השיעור. לא כדי לקבל תגבור, כדי שנמצא איפה בדיוק נפתח החור.\"",
    "היזהרו מלהבטיח \"כולם יכולים להצליח בקלות\" — הבטיחו שיפור עם עבודה, זה אמין וזה נכון.",
  ].join("\n"));
}

// =====================================================================
// 12 — החוזה
// =====================================================================
{
  const s = lightSlide();
  heading(s, "אז מה אני מבקש מכם בפועל", "לא לאהוב מתמטיקה. ארבעה דברים קטנים.", AMBER);

  const asks = [
    ["20 דקות ביום", "לא שעתיים בערב לפני מבחן. עשרים דקות רצופות, כל יום — זה מנצח כל מרתון."],
    ["לשאול \"למה\", לא רק \"איך\"", "\"איך פותרים\" נשכח עד המבחן הבא. \"למה זה עובד\" נשאר לכם לכל החיים."],
    ["לטעות בקול רם", "טעות על הלוח שווה יותר מעשר תשובות נכונות בשקט. אני לא מוריד נקודות על ניסיון."],
    ["לא לוותר בדקה הראשונה", "התסכול בדקה השנייה הוא לא סימן שאתם לא מסוגלים. הוא בדיוק הרגע שבו מתחילה הלמידה."],
  ];
  const bw9 = 5.85, bh9 = 1.5, gx9 = 0.35, gy9 = 0.35;
  asks.forEach((a, i) => {
    const col = i % 2, row = Math.floor(i / 2);
    const x = RIGHT - bw9 - col * (bw9 + gx9);
    const y = 2.0 + row * (bh9 + gy9);
    s.addShape(pres.ShapeType.roundRect, { x, y, w: bw9, h: bh9, rectRadius: 0.06, fill: { color: WHITE }, line: { color: LINE_L, width: 1 }, shadow: sh() });
    badge(s, x + bw9 - 0.28 - 0.6, y + 0.32, String(i + 1), i % 2 === 0 ? VIOLET : MINT, WHITE, 0.6);
    s.addText(a[0], rtl({ x: x + 0.28, y: y + 0.2, w: bw9 - 1.3, h: 0.4, margin: 0, fontSize: 18, bold: true, color: INK }));
    s.addText(a[1], rtl({ x: x + 0.28, y: y + 0.64, w: bw9 - 1.3, h: 0.75, margin: 0, fontSize: 12.5, color: MUTED_L, lineSpacingMultiple: 1.15 }));
  });

  s.addShape(pres.ShapeType.roundRect, { x: M, y: 5.6, w: CW, h: 1.38, rectRadius: 0.06, fill: { color: DARK }, line: { color: DARK } });
  s.addText([
    { text: "והחלק שלי בעסקה:  ", options: { color: MINT, bold: true, fontSize: 18 } },
    { text: "אני לא אעבור לנושא הבא כל עוד יש כאן מישהו שנשאר מאחור, ואני לא אצחק על אף שאלה. אף פעם.", options: { color: WHITE, fontSize: 17 } },
  ], rtl({ x: M + 0.4, y: 5.6, w: CW - 0.8, h: 1.38, margin: 0, valign: "middle", lineSpacingMultiple: 1.2 }));

  s.addNotes([
    "3 דק׳. כאן הופכים מוטיבציה להתנהגות — בלי זה המצגת מתפוגגת עד מחר.",
    "בקשו התחייבות פיזית: הצבעה, חתימה על פתק, או כתיבת המספר שהם בוחרים לעבוד עליו החודש.",
    "\"החלק שלי בעסקה\" הוא הרגע הכי חשוב — אמרו אותו לאט, ואז עמדו בו. אמינות המורה היא מה שנשאר מהשיעור.",
    "רעיון המשך: תלו את ארבעת הסעיפים על קיר הכיתה והפנו אליהם במהלך השנה.",
  ].join("\n"));
}

// =====================================================================
// 13 — CLOSE (dark)
// =====================================================================
{
  const s = darkSlide();
  glyphField(s, [["=", 0.1, 0.12, 140]]);

  s.addText("שורה תחתונה", rtl({ x: M, y: 1.02, w: CW, h: 0.32, margin: 0, fontSize: 14, bold: true, color: MINT, charSpacing: 2 }));

  s.addText("בינה מלאכותית תיתן לכם", rtl({ x: M, y: 1.55, w: CW, h: 0.85, margin: 0, fontSize: 42, bold: true, color: WHITE }));
  s.addText("תשובות.", rtl({ x: M, y: 2.4, w: CW, h: 0.85, margin: 0, fontSize: 42, bold: true, color: MUTED_D }));
  s.addText("מתמטיקה תיתן לכם לדעת", rtl({ x: M, y: 3.28, w: CW, h: 0.85, margin: 0, fontSize: 42, bold: true, color: WHITE }));
  s.addText("אם התשובה נכונה.", rtl({ x: M, y: 4.13, w: CW, h: 0.85, margin: 0, fontSize: 42, bold: true, color: MINT }));

  s.addShape(pres.ShapeType.roundRect, { x: RIGHT - 8.6, y: 5.6, w: 8.6, h: 1.15, rectRadius: 0.08, fill: { color: CARD_D }, line: { color: CARD_D } });
  s.addText("בעולם שבו לכולם יש את אותן תשובות — מי שיודע לשאול ולבדוק הוא זה שמוביל.", rtl({
    x: RIGHT - 8.3, y: 5.6, w: 8.1, h: 1.15, margin: 0, valign: "middle", fontSize: 17, color: WHITE,
  }));
  badge(s, M, 5.78, "=", MINT, DARK, 0.72);

  s.addNotes([
    "1 דק׳. עצרו. אל תוסיפו מילה אחרי המשפט הזה.",
    "אפשרות חזקה: כבו את המקרן, אמרו את המשפט בעל פה, ותנו לכיתה לצאת עם זה.",
    "משימת סיום מומלצת: \"עד מחר תביאו לי דוגמה אחת אמיתית — מבצע, תשלומים או תשובה של AI — שבה מתמטיקה חסכה או הייתה יכולה לחסוך כסף.\"",
  ].join("\n"));
}

// =====================================================================
// 14 — נספח למורה
// =====================================================================
{
  const s = lightSlide();
  heading(s, "נספח  ·  לא להקרנה בכיתה", "מדריך העברה למורה", VIOLET);

  const guide = [
    ["המבנה הפדגוגי", "הצטרפות להתנגדות (1-2) ← הגדרה מחדש של המקצוע (3) ← ארבע הוכחות אמפיריות (4-7) ← תועלת ארוכת טווח (8-10) ← פירוק חסם רגשי (11) ← התחייבות התנהגותית (12-13).", VIOLET],
    ["למה זה עובד", "הטיעון \"מתמטיקה חשובה\" נכשל כי הוא מופשט. שקפים 4-7 מחליפים אותו בחוויה מדידה: התלמיד מחשב בעצמו ומגלה פער. שכנוע עצמי חזק פי כמה מהטפה.", MINT],
    ["תזמון", "כ-35 דקות למצגת מלאה + 10 דקות דיון. אם יש רק 20 דקות: שקפים 1, 4, 5, 7, 11, 13. אל תוותרו על 5 ועל 11.", AMBER],
    ["חיבור לתוכנית הלימודים", "שקפים 4-5-7 הם פתיח ישיר ליחידת האחוזים בכיתה ז׳; שקף 6 מתחבר למערכת צירים ולפונקציות; שקף 11 מכוון לאבחון פערים מהיסודי לפני תחילת השנה.", CORAL],
  ];
  const bw10 = 5.85, bh10 = 2.3, gx10 = 0.35, gy10 = 0.32;
  guide.forEach((g, i) => {
    const col = i % 2, row = Math.floor(i / 2);
    const x = RIGHT - bw10 - col * (bw10 + gx10);
    const y = 1.95 + row * (bh10 + gy10);
    s.addShape(pres.ShapeType.roundRect, { x, y, w: bw10, h: bh10, rectRadius: 0.06, fill: { color: WHITE }, line: { color: LINE_L, width: 1 }, shadow: sh() });
    badge(s, x + bw10 - 0.3 - 0.6, y + 0.3, String(i + 1), g[2], WHITE, 0.6);
    s.addText(g[0], rtl({ x: x + 0.3, y: y + 0.24, w: bw10 - 1.35, h: 0.45, margin: 0, valign: "middle", fontSize: 18, bold: true, color: INK }));
    s.addText(g[1], rtl({ x: x + 0.3, y: y + 0.85, w: bw10 - 0.6, h: 1.3, margin: 0, fontSize: 13, color: MUTED_L, lineSpacingMultiple: 1.25 }));
  });

  s.addText("בכל שקף יש הערות מרצה מפורטות: מה לומר, מה לשאול, וכמה זמן להקדיש. פתחו בתצוגת מצגת ← הערות.", rtl({
    x: M, y: 6.85, w: CW, h: 0.38, margin: 0, fontSize: 13, bold: true, color: MUTED_L,
  }));

  s.addNotes([
    "שקף זה מיועד למורה בלבד — הסתירו אותו לפני הקרנה בכיתה (לחיצה ימנית על השקף ← הסתר שקף).",
    "עקרון מנחה: אל תקראו מהשקפים. השקפים הם התפאורה — המורה הוא ההצגה.",
  ].join("\n"));
}

pres.writeFile({ fileName: process.argv[2] || "math-motivation.pptx" }).then(f => console.log("WROTE", f));
