/**
 * example_deck.js — a complete, working reference deck.
 * Topic: (a+b)² — the formula is BUILT, never announced.
 *
 * Copy this file next to your work, change the slides, run:
 *   npm install pptxgenjs          # once per working directory
 *   node example_deck.js
 *   python3 <skill>/scripts/add_animations.py out/ח_שיעור_01_ריבוע_של_סכום.pptx --report
 *   python3 <skill>/scripts/render.py out/ח_שיעור_01_ריבוע_של_סכום__build.pptx \
 *       --pdf out/ח_שיעור_01_ריבוע_של_סכום.pdf \
 *       --mp4 out/ח_שיעור_01_ריבוע_של_סכום.mp4 \
 *       --timing out/ח_שיעור_01_ריבוע_של_סכום__timing.json
 */

const path = require("path");
const SKILL = path.join(process.env.HOME, ".claude/skills/roni-math-presentation");
const { buildDeck, T } = require(path.join(SKILL, "scripts/deck_kit.js"));

const FILE = "ח_שיעור_01_ריבוע_של_סכום";

buildDeck({
  file: FILE,
  outDir: "out",
  slides: [
    /* 1 — פתיחה */
    {
      role: "פתיחה",
      teacher: "פותחת: היום נגלה נוסחה שאתם כבר יודעים לצייר, רק עוד לא יודעים לכתוב.",
      student: "מתיישבים, קוראים את הכותרת.",
      seconds: 3,
      base(s, k) {
        k.kicker(s, "כיתה ח׳ · שיעור 1");
        s.addText(k.pmx("ריבוע של סכום"), {
          x: T.M, y: 2.6, w: T.W - 2 * T.M, h: 1.2, align: "right", rtlMode: true,
          fontFace: T.font, fontSize: 54, bold: true, color: T.color.ink, margin: 0, lang: "he-IL",
        });
        s.addShape(k.S.rect, { x: T.W - T.M - 2.2, y: 4.0, w: 2.2, h: 0.06,
          fill: { color: T.color.accent }, line: { color: T.color.accent } });
      },
    },

    /* 2 — מטרת השיעור */
    {
      role: "מטרת השיעור",
      teacher: "מקריאה את המטרה ומצביעה עליה: בסוף השיעור כל אחד יידע להסביר, לא רק לכתוב.",
      student: "יודעים לאן הולכים.",
      seconds: 5,
      base(s, k) {
        k.kicker(s, "מטרת השיעור");
        k.title(s, "בסוף השיעור אדע…");
        k.list(s, [
          "לחשב שטח של ריבוע שצלעו סכום",
          "להסביר מאיפה מגיע האיבר האמצעי",
          "לזהות את הטעות הנפוצה ולתקן אותה",
        ]);
      },
    },

    /* 3 — כרטיס כניסה: ידע קודם */
    {
      role: "כרטיס כניסה — ידע קודם",
      teacher: "30 שניות במחברת. עוברת ובודקת מי לא זוכר שטח מלבן.",
      student: "מחשבים שטח מלבן פשוט — הידע שעליו נבנה כל השיעור.",
      misconception: "בלבול בין שטח להיקף.",
      support: "מי שמתקשה — לצייר את המלבן ולספור ריבועי יחידה.",
      seconds: 8,
      base(s, k) {
        k.kicker(s, "כרטיס כניסה");
        k.title(s, "מה שטח המלבן?");
        s.addShape(k.S.rect, { x: 4.6, y: 2.3, w: 3.6, h: 2.2,
          fill: { color: T.color.surface }, line: { color: T.color.ink, width: 2 } });
        s.addText(k.ltr("5"), { x: 4.6, y: 1.95, w: 3.6, h: 0.32, align: "center",
          fontFace: T.font, fontSize: 20, bold: true, color: T.color.sub, margin: 0, rtlMode: false });
        s.addText(k.ltr("3"), { x: 8.3, y: 3.2, w: 0.5, h: 0.32, align: "left",
          fontFace: T.font, fontSize: 20, bold: true, color: T.color.sub, margin: 0, rtlMode: false });
      },
      layers: [
        { effect: "fade", seconds: 5,
          draw(s, k) { k.callout(s, "כתבו במחברת את התרגיל, לא רק את התשובה.", { tone: "think", label: null }); } },
      ],
    },

    /* 4 — התבוננות + ניחוש (הטעות מוזמנת לכאן בכוונה) */
    {
      role: "התבוננות → ניחוש",
      teacher: "מצביעה על הצלע: הצלע היא a ועוד b. אל תחשבו — נחשו. אספי 2–3 ניחושים בעל פה.",
      student: "מנחשים. חלק ינחשו a²+b² — וזה בדיוק מה שאנחנו רוצים שיקרה עכשיו.",
      misconception: "a²+b² — 'מעלים כל איבר בריבוע'.",
      seconds: 6,
      base(s, k) {
        k.kicker(s, "התבוננות");
        k.title(s, "מה שטח הריבוע הזה?");
        k.areaModel(s, { a: 3, b: 2, x: 1.4, y: 2.2, size: 3.4, show: ["frame", "dims"] });
      },
      layers: [
        { effect: "fade", seconds: 8,
          draw(s, k) { k.callout(s, "נחשו לפני שמחשבים. מה התשובה שלכם?", { tone: "think", x: 5.6, y: 2.6, w: 6.9, h: 1.0 }); } },
      ],
    },

    /* 5 — בניית הרעיון: חלק אחרי חלק */
    {
      role: "בניית הרעיון — חשיפה מדורגת",
      teacher: "כל לחיצה = חלק אחד. אחרי כל חלק לשאול: מה השטח שלו? למה?",
      student: "רואים שהריבוע מתחלק לארבעה חלקים, ושניים מהם זהים.",
      seconds: 4,
      base(s, k) {
        k.kicker(s, "בואו נחלק");
        k.title(s, "כמה חלקים יש כאן?");
        k.areaModel(s, { a: 3, b: 2, x: 1.4, y: 2.2, size: 3.4, show: ["frame", "dims"] });
      },
      layers: [
        { effect: "wipeRight", seconds: 5,
          draw(s, k) { k.areaModel(s, { a: 3, b: 2, x: 1.4, y: 2.2, size: 3.4, show: ["aa", "labels"] }); } },
        { effect: "wipeRight", seconds: 6,
          draw(s, k) { k.areaModel(s, { a: 3, b: 2, x: 1.4, y: 2.2, size: 3.4, show: ["ab1", "labels"] }); } },
        { effect: "wipeUp", seconds: 6,
          draw(s, k) { k.areaModel(s, { a: 3, b: 2, x: 1.4, y: 2.2, size: 3.4, show: ["ab2", "labels"] }); } },
        { effect: "zoom", seconds: 5,
          draw(s, k) { k.areaModel(s, { a: 3, b: 2, x: 1.4, y: 2.2, size: 3.4, show: ["bb", "labels"] }); } },
        { effect: "fade", seconds: 8,
          draw(s, k) { k.callout(s, "שני חלקים יצאו זהים. מי יכול להסביר למה?", { tone: "think", x: 5.6, y: 2.6, w: 6.9, h: 1.0 }); } },
      ],
    },

    /* 6 — ניסוח מתמטי: רק עכשיו */
    {
      role: "ניסוח מתמטי",
      teacher: "עכשיו — ורק עכשיו — כותבים. מצביעה על כל איבר ומחזירה אותו לחלק בציור.",
      student: "מחברים בין הצורה לשפה המתמטית.",
      seconds: 4,
      base(s, k) {
        k.kicker(s, "מהצורה אל הכתיב");
        k.title(s, "אותו שטח — בשתי שפות");
        k.areaModel(s, { a: 3, b: 2, x: 1.0, y: 2.3, size: 3.0, show: ["frame", "aa", "ab1", "ab2", "bb", "labels"] });
      },
      layers: [
        { effect: "fade", seconds: 4,
          draw(s, k) { k.math(s, "a² + ab + ab + b²", { x: 4.8, y: 2.7, w: 7.7, fontSize: 36 }); } },
        { effect: "wipeLeft", seconds: 6,
          draw(s, k) { k.math(s, "(a+b)² = a² + 2ab + b²", { x: 4.8, y: 3.8, w: 7.7, fontSize: 40, color: T.color.accent }); } },
        { effect: "fade", seconds: 6,
          draw(s, k) { k.callout(s, "האיבר האמצעי הוא שני המלבנים — לא נעלם ולא הומצא.", { tone: "rule", x: 4.8, y: 5.0, w: 7.7, h: 1.05 }); } },
      ],
    },

    /* 7 — דוגמה מודרכת, שלב-שלב */
    {
      role: "דוגמה מודרכת",
      teacher: "אני עושה שלב, אתם אומרים את הבא. לא ממשיכה לפני שמישהו נימק.",
      student: "מזהים מי a ומי b, ואז מציבים.",
      seconds: 6,
      base(s, k) {
        k.kicker(s, "דוגמה מודרכת");
        k.title(s, "נפתח יחד");
        k.math(s, "(2x + 3)² = ?", { y: 1.85, fontSize: 40 });
      },
      layers: [
        { effect: "fade", seconds: 6, draw(s, k) { k.step(s, { n: 1, y: 2.75, expr: "a = 2x ,  b = 3", why: "מזהים מי מי" }); } },
        { effect: "fade", seconds: 7, draw(s, k) { k.step(s, { n: 2, y: 3.45, expr: "(2x)² + 2·(2x)·3 + 3²", why: "מציבים בנוסחה" }); } },
        { effect: "fade", seconds: 7, draw(s, k) { k.step(s, { n: 3, y: 4.15, expr: "4x² + 12x + 9", why: "מפשטים" }); } },
        { effect: "fade", seconds: 7,
          draw(s, k) { k.callout(s, "הצבנו x=1 בשני האגפים וקיבלנו 25 = 25.", { tone: "fix", label: "בדיקה", y: 5.15, h: 1.0 }); } },
      ],
    },

    /* 8 — טעות נפוצה ותיקונה */
    {
      role: "טעות נפוצה → תיקון",
      teacher: "מציגה את הפתרון השגוי בלי לומר שהוא שגוי. שואלת: מסכימים?",
      student: "מאתרים את הטעות בעצמם ומנמקים.",
      misconception: "(a+b)² = a² + b² — 'ריבוע מתחלק על כל איבר'.",
      support: "לחזור לציור: אם מוחקים את שני המלבנים, נשאר חור בריבוע.",
      seconds: 8,
      base(s, k) {
        k.kicker(s, "מצאו את הטעות");
        k.title(s, "תלמיד כתב כך. מסכימים?");
        k.math(s, "(x + 5)² = x² + 25", { y: 2.3, fontSize: 42, color: T.color.mistake });
      },
      layers: [
        { effect: "fade", seconds: 8,
          draw(s, k) { k.callout(s, "היכן הטעות? הראו אותה על הציור, לא רק במילים.", { tone: "mistake", y: 3.5, h: 1.0 }); } },
        { effect: "wipeLeft", seconds: 8,
          draw(s, k) { k.callout(s, "(x+5)² = x² + 10x + 25 — חסרו שני המלבנים ששטחם 5x כל אחד.", { tone: "fix", y: 4.75, h: 1.1 }); } },
      ],
    },

    /* 9 — אוריינות מתמטית */
    {
      role: "אוריינות מתמטית",
      teacher: "קוראים יחד. שואלת: מה השאלה מבקשת — מספר או הסבר?",
      student: "מתרגמים סיפור לביטוי אלגברי ומנמקים.",
      seconds: 12,
      base(s, k) {
        k.kicker(s, "אוריינות");
        k.title(s, "מגרש בצורת ריבוע");
        k.body(s, "צלע המגרש הייתה x מטר, והרחיבו אותה ב-4 מטר.", { y: 1.9 });
        k.body(s, "בכמה גדל שטח המגרש?", { y: 2.5, bold: true });
        /* only the empty square at first — the decomposition is the answer,
           and the answer never shares a slide with the question */
        k.areaModel(s, { a: 4, b: 1.4, x: 8.4, y: 3.2, size: 2.9, show: ["frame"] });
      },
      layers: [
        { effect: "fade", seconds: 12,
          draw(s, k) { k.callout(s, "ציירו את המגרש לפני ואחרי ההרחבה. מה נוסף?", { tone: "think", x: T.M, y: 3.6, w: 7.3, h: 1.0 }); } },
        { effect: "wipeLeft", seconds: 10,
          draw(s, k) { k.areaModel(s, { a: 4, b: 1.4, x: 8.4, y: 3.2, size: 2.9,
            show: ["aa", "ab1", "ab2", "bb", "labels"], labelAA: "x²", labelAB: "4x", labelBB: "16" }); } },
        { effect: "fade", seconds: 10,
          draw(s, k) { k.callout(s, "כתבו תשובה במשפט שלם, עם המילה 'כי'.", { tone: "think", x: T.M, y: 4.8, w: 7.3, h: 1.0 }); } },
      ],
    },

    /* 10 — סיכום חזותי */
    {
      role: "סיכום חזותי",
      teacher: "מכסה את הנוסחה ומבקשת מתלמיד לשחזר אותה מהציור.",
      student: "משחזרים את הנוסחה מהתמונה — לא מהזיכרון.",
      seconds: 8,
      base(s, k) {
        k.kicker(s, "סיכום");
        k.title(s, "תמונה אחת, נוסחה אחת");
        k.areaModel(s, { a: 3, b: 2, x: 1.2, y: 2.4, size: 3.0, show: ["frame", "aa", "ab1", "ab2", "bb", "labels"] });
        k.math(s, "(a+b)² = a² + 2ab + b²", { x: 4.8, y: 3.4, w: 7.7, fontSize: 38, color: T.color.accent });
      },
    },

    /* 11 — Exit Ticket */
    {
      role: "Exit Ticket",
      teacher: "שתי דקות, על פתק. אוספת בדלת — זה מה שקובע את פתיחת השיעור הבא.",
      student: "כותבים לבד, בלי עזרה.",
      seconds: 15,
      base(s, k) {
        k.kicker(s, "כרטיס יציאה");
        k.title(s, "לפני שיוצאים");
        k.list(s, [
          "פתחו: ‎(y + 6)²",
          "הסבירו במשפט אחד מאיפה מגיע האיבר האמצעי",
        ], { y: 2.2, fontSize: 26 });
      },
      layers: [
        { effect: "fade", seconds: 10,
          draw(s, k) { k.callout(s, "אם נשאר זמן: האם ‎(a−b)²‎ יתנהג אותו דבר?", { tone: "think", label: "שאלת חשיבה", y: 4.6, h: 1.05 }); } },
      ],
    },
  ],
}).then((out) => console.log(out));
