# Skills

מקור קבוע לסקילים אישיים שנבנו עבור רוני. הקבצים כאן הם ה"אמת" — הסביבה שבה
קלוד רץ נמחקת בין שיחות, ולכן סקיל שנכתב רק ל-`~/.claude/skills/` נעלם.

## roni-math-assessment-expert

מומחה בניית מבחני מתמטיקה לחטיבת ביניים ברמת משרד החינוך / ראמ״ה:
מפרט מבחן (Blueprint) לפני שאלה ראשונה, רמות חשיבה, ניקוד מדורג, מחוון,
טבלת מיפוי ובקרת QA כפולה.

### התקנה קבועה (פעם אחת)

**דרך א׳ — סקיל אישי ב-claude.ai (מומלץ; זמין בכל שיחה, גם בנייד):**

1. Settings → Capabilities → Skills → Create skill → Upload
2. העלי את `roni-math-assessment-expert.zip`
3. מרגע זה הסקיל נטען אוטומטית בכל בקשה שמזכירה מבחן / מבדק / בוחן / מחוון /
   מיפוי / assessment — בדיוק כמו שאר הסקילים האישיים

**דרך ב׳ — מקומית, בשיחה בודדת:**

```bash
cp -r skills/roni-math-assessment-expert ~/.claude/skills/
```

### מבנה

```
roni-math-assessment-expert/
├── SKILL.md                          חמשת השלבים, חלוקת אחריות, האיסורים
├── references/
│   ├── blueprint.md                  מבנה המפרט, איזון נושאים, חישוב זמן
│   ├── example-blueprint.json        מפרט מלא שעובר PASS — נקודת פתיחה
│   ├── thinking-levels.md            תשע רמות חשיבה + בנק ניסוחים
│   ├── item-types.md                 בנק פורמטים עם תבניות בעברית
│   ├── rubric-and-mapping.md         ניקוד חלקי, מחוון, טבלת מיפוי
│   └── qa-checklist.md               16 בדיקות + QA של תלמיד
└── scripts/
    └── blueprint_check.py            אימות מפרט + הפקת טבלת מיפוי
```

### בדיקת המפרט

```bash
python3 skills/roni-math-assessment-expert/scripts/blueprint_check.py blueprint.json --mapping
```

מחזיר `PASS` / `FAIL` (קוד יציאה 1 בשגיאות). בודק סכום ניקוד, כיסוי נושאים,
נושא שלא נלמד, פיזור רמות חשיבה, מגוון פורמטים, מדרג קושי וסכום זמן.
