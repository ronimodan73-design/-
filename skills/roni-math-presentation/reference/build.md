# בנייה — API וצינור התוצרים

## התקנה בתיקיית העבודה

```bash
npm install pptxgenjs      # פעם אחת לתיקייה. הקיט מוצא אותה גם אם היא גלובלית
```

`deck_kit.js` יושב בתיקיית הסקיל ומאתר את `pptxgenjs` מה-cwd — אין צורך להתקין
בתוך תיקיית הסקיל.

## ספק הדק

```js
buildDeck({
  file:   "ז_שיעור_03_מערכת_צירים",   // שם קצר, ללא סיומת. עברית תקינה
  outDir: "out",
  modes:  ["anim", "build"],           // ברירת מחדל — שתי הגרסאות
  chrome: true,                        // קו תחתון + מספור. false לשער בלבד
  slides: [ /* ... */ ],
})
```

### שקופית

| שדה | חובה | תפקיד |
|---|---|---|
| `role` | מומלץ | שם התפקיד מהמבנה (`reference/pedagogy.md`) |
| `teacher` | **כן** | Teacher Action — מה המורה עושה/שואלת |
| `student` | **כן** | Student Thinking — מה התלמידים חושבים/עושים |
| `misconception` | לא | טעות צפויה → להערות המורה |
| `support` | לא | הוראה מתקנת → להערות המורה |
| `seconds` | לא | כמה זמן להחזיק את המצב הבסיסי ב-MP4 (ברירת מחדל 4) |
| `bg` | לא | רקע חלופי לשקופית |
| `base(s, k)` | **כן** | מה שמצויר מיד |
| `layers[]` | לא | `{ effect, seconds, draw(s, k) }` — כל אחת = לחיצה אחת |

`buildDeck` זורק שגיאה על שקופית בלי `teacher`/`student`. זו לא בירוקרטיה:
שקופית שאי אפשר לנסח לה תפקיד — נמחקת.

## שתי הגרסאות, ספק אחד

| מצב | מה נוצר | למי |
|---|---|---|
| `anim` | `<שם>.pptx` — שקופית אחת לכל רגע הוראה, כל השכבות עליה | המצגת שרוני עורכת ומקרינה |
| `build` | `<שם>__build.pptx` + `<שם>__timing.json` — שקופית לכל שלב חשיפה | מקור ה-PDF וה-MP4 |

הרצף נכתב פעם אחת. שתי הגרסאות לא יכולות להתפצל.

## ה-helpers של הקיט

### טקסט
`k.kicker(s, text)` · `k.title(s, text)` · `k.body(s, text, o)` ·
`k.list(s, items, o)` — כולם RTL + `pmx()` אוטומטי.
`k.math(s, expr, o)` — ביטוי גדול, LTR, ממורכז.
`k.step(s, {n, expr, why, y})` — שלב פתרון: עיגול ממוספר מימין, ביטוי במרכז, נימוק משמאל.
`k.callout(s, text, {tone, label, x, y, w, h})` — `tone`: `think` | `rule` | `mistake` | `fix` | `quiet`.

### הדגשה
`k.highlight(s, {x, y, w, h})` — שכבת אקסנט שקופה על מה שמדברים עליו עכשיו.
`k.arrow(s, {x1, y1, x2, y2})`.

### איורים מתמטיים
```js
k.axes(s, { x, y, w, h, xMin, xMax, yMin, yMax, step, grid, numbers,
            points: [{ x, y, label, color, dashed }],
            lines:  [{ m, b, label, color, dash }] })    // → { px, py }
k.numberLine(s, { x, y, w, min, max, step, marks: [{ v, label, color }] })
k.areaModel(s, { a, b, x, y, size, show, labelAA, labelAB, labelBB })
k.table(s, rows, { x, y, w })                            // שורה 0 = כותרות
```

`areaModel.show` מקבל תת-קבוצה של
`["frame","aa","ab1","ab2","bb","labels","dims"]` — כך כל חלק נחשף בשכבה משלו.
זה הדפוס לכל איור מתפרק: מציירים אותו שוב עם `show` גדול יותר בכל שכבה.

`axes` ו-`numberLine` מחזירים `px`/`py` להמשך ציור מדויק על אותה מערכת.

## אפקטים

| שם | מה קורה | הערה |
|---|---|---|
| `appear` | מופיע מיידית | הכי בטוח בכל התוכנות |
| `fade` | דהייה פנימה | ברירת המחדל לטקסט ולמסקנות |
| `wipeRight` | נחשף משמאל לימין | לצמיחה של קטע, עמודה, שטח |
| `wipeLeft` | נחשף מימין לשמאל | הכיוון הטבעי לטקסט עברי |
| `wipeUp` | נחשף מלמטה למעלה | לגובה, לעמודה שגדלה |
| `wipeDown` | נחשף מלמעלה למטה | לנפילה, לזרימה כלפי מטה |
| `zoom` | התקרבות | מתדרדר ל-appear ב-LibreOffice — לקישוט בלבד |

`"fade:withPrev"` — השכבה יוצאת יחד עם הקודמת, בלי לחיצה נוספת.

תאימות שנבדקה: הקובץ עובר ולידציה סכמתית, ו-LibreOffice מייבא את הצעדים
כ-`on-click` עם אותם אפקטים. כיוון ה-wipe עשוי להשתנות מעט בין תוכנות;
עצם החשיפה — לא. לכן **אף רעיון לא נשען על כיוון האפקט בלבד**.

## הפעלה

```bash
SKILL=$HOME/.claude/skills/roni-math-presentation

node deck.js                                                   # שתי הגרסאות
python3 $SKILL/scripts/add_animations.py out/<שם>.pptx --report
python3 $SKILL/scripts/render.py out/<שם>__build.pptx \
    --pdf out/<שם>.pdf --mp4 out/<שם>.mp4 --timing out/<שם>__timing.json
python3 $SKILL/scripts/qa.py out/<שם>.pptx --anim
```

`add_animations.py` קורא את שמות האובייקטים (`anim:<step>:<effect>`) שהקיט
מדביק, ומזריק `<p:timing>` תקני. אפשר להריץ שוב אחרי בנייה מחדש — הוא מחליף
טיימינג קיים ולא מכפיל אותו.

`render.py` תלוי ב-LibreOffice (pptx→pdf), PyMuPDF (pdf→png) ו-ffmpeg (png→mp4).
חסר משהו — הוא אומר מה בדיוק. `pip install pymupdf imageio-ffmpeg` מכסה את השניים
האחרונים בלי הרשאות מערכת.

## משקל הקובץ

Arial בלבד · בלי תמונות מיותרות · בלי וידאו מוטמע · בלי assets שלא בשימוש.
דק טיפוסי: PPTX ~250KB, PDF ~170KB, MP4 ~1MB לשלוש דקות — כולם נשלחים
בוואטסאפ בלי דחיסה מחדש. MP4 מעל 16MB — `render.py` מזהיר.

## שמות קבצים

`<שכבה>_שיעור_<מספר>_<נושא>` — קצר, ברור, זהה בשלושת התוצרים:
`ז_שיעור_03_מערכת_צירים.pptx` · `.mp4` · `.pdf`
