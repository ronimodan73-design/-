#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
בדיקת תקינות של TEST BLUEPRINT (מפרט מבחן).

שימוש:
    python3 blueprint_check.py blueprint.json
    python3 blueprint_check.py blueprint.json --mapping      # + טבלת מיפוי
    python3 blueprint_check.py blueprint.json --quiet        # רק שגיאות ואזהרות

קוד יציאה 0 = PASS (אפשר לעבור לכתיבת השאלות). 1 = יש שגיאות שחייבים לתקן.
מבנה ה-JSON מתועד ב-references/blueprint.md.
"""

import argparse
import json
import sys
from collections import Counter, defaultdict

LEVELS = [
    "ידע וזיהוי",
    "ביצוע ויישום",
    "חשיבה אלגוריתמית",
    "חשיבה תהליכית",
    "נימוק והסבר",
    "השוואה והסקת מסקנות",
    "פתרון בעיה",
    "אוריינות מתמטית",
    "משימה מורכבת",
]

# רמות "גבוהות" — מבחן מלא חייב לפחות אחת מהן
HIGHER_LEVELS = {"פתרון בעיה", "אוריינות מתמטית", "משימה מורכבת"}

TYPES = [
    "השלמה", "נכון/לא נכון", "גדול/קטן/שווה", "התאמה", "בחירה מרובה",
    "מציאת טעות", "הסבר ונימוק", "האם תמיד נכון", "השוואת דרכים",
    "פתרון משוואה", "בניית ביטוי", "השלמת משוואה", "משוואה מסיפור",
    "גאומטריה עם שרטוט", "גרף/מערכת צירים", "טבלה", "שאלה מילולית",
    "אוריינות", "משימה מורכבת",
]

errors, warnings, notes = [], [], []


def err(msg):
    errors.append(msg)


def warn(msg):
    warnings.append(msg)


def note(msg):
    notes.append(msg)


def load(path):
    try:
        with open(path, encoding="utf-8") as fh:
            return json.load(fh)
    except FileNotFoundError:
        sys.exit("קובץ לא נמצא: %s" % path)
    except json.JSONDecodeError as exc:
        sys.exit("JSON לא תקין (%s): %s" % (path, exc))


def check_structure(bp):
    if not isinstance(bp.get("meta"), dict):
        err("חסר בלוק meta")
    if not isinstance(bp.get("topics"), list) or not bp["topics"]:
        err("חסרה רשימת topics")
    if not isinstance(bp.get("items"), list) or not bp["items"]:
        err("חסרה רשימת items")
    if errors:
        report()
        sys.exit(1)

    meta = bp["meta"]
    for field in ("grade", "purpose", "total_points", "minutes"):
        if not meta.get(field):
            err("חסר שדה חובה ב-meta: %s" % field)
    if not meta.get("source_of_truth"):
        warn("meta.source_of_truth ריק — ציין על סמך איזה חומר נבנה המבחן, "
             "או הצהר שזו הצעה שלך")

    for idx, item in enumerate(bp["items"], 1):
        for field in ("id", "topic", "subtopic", "level", "type", "points"):
            if item.get(field) in (None, ""):
                err("פריט מס׳ %d ברשימה: חסר שדה %s" % (idx, field))
        if not item.get("idea"):
            warn("פריט %s: חסר שדה idea — מהו הרעיון המתמטי שהפריט מודד? "
                 "פריט בלי תשובה ברורה לשאלה הזו לא נכנס למבחן"
                 % item.get("id", "?"))
        if not item.get("skill"):
            warn("פריט %s: חסר שדה skill (המיומנות הנבדקת) — הוא נדרש לטבלת המיפוי"
                 % item.get("id", "?"))
        if item.get("minutes") in (None, ""):
            warn("פריט %s: חסר אומדן זמן (minutes)" % item.get("id", "?"))


def check_ids(items):
    dupes = [i for i, c in Counter(str(it.get("id")) for it in items).items() if c > 1]
    for d in dupes:
        err("מזהה פריט כפול: %s" % d)


def check_points(bp):
    meta, items = bp["meta"], bp["items"]
    total = 0
    for it in items:
        pts = it.get("points")
        if not isinstance(pts, (int, float)):
            err("פריט %s: ניקוד אינו מספר" % it.get("id"))
            continue
        if pts <= 0:
            err("פריט %s: ניקוד חייב להיות חיובי" % it.get("id"))
        total += pts
    declared = meta.get("total_points")
    if isinstance(declared, (int, float)) and total != declared:
        err("סכום הניקוד %g אינו שווה ל-total_points שהוצהר (%g). הפרש: %g"
            % (total, declared, total - declared))
    else:
        note("סכום הניקוד מדויק: %g נקודות" % total)
    return total


def check_topics(bp, total):
    topics = bp["topics"]
    items = bp["items"]
    declared = {t["name"]: t for t in topics if isinstance(t, dict) and t.get("name")}

    by_topic = defaultdict(float)
    by_subtopic = Counter()
    for it in items:
        by_topic[it.get("topic")] += it.get("points", 0) or 0
        by_subtopic[(it.get("topic"), it.get("subtopic"))] += 1

    for name in by_topic:
        if name not in declared:
            err("פריטים משויכים לנושא שאינו ברשימת הנושאים שנלמדו: '%s'. "
                "או שזה נושא שלא נלמד — והוא יוצא מהמבחן — או שהוא חסר ב-topics"
                % name)

    for name, t in declared.items():
        if name not in by_topic:
            err("נושא '%s' מופיע במפרט אבל אין לו אף פריט במבחן" % name)
            continue
        for sub in t.get("subtopics", []):
            cnt = by_subtopic.get((name, sub), 0)
            if cnt == 0:
                err("תת-נושא '%s' (בנושא '%s') מופיע במפרט אבל אין לו אף פריט"
                    % (sub, name))
            elif cnt == 1:
                msg = ("תת-נושא '%s' נבדק בפריט אחד בלבד — פריט יחיד לא מבדיל "
                       "בין פער אמיתי לטעות אקראית" % sub)
                if "מיפוי" in bp["meta"].get("purpose", "") or "פתיחת שנה" in bp["meta"].get("purpose", ""):
                    err(msg + " (במבחן מיפוי זה כלל מחייב)")
                else:
                    warn(msg)

        target = t.get("target_pct")
        if isinstance(target, (int, float)) and total:
            actual = 100.0 * by_topic[name] / total
            gap = actual - target
            if abs(gap) > 7:
                err("נושא '%s': %.1f%% מהניקוד מול יעד %g%% (סטייה %.1f נק׳ אחוז). "
                    "תקן את הפריטים או תקן את היעד והצהר על השינוי"
                    % (name, actual, target, gap))
            elif abs(gap) > 5:
                warn("נושא '%s': %.1f%% מול יעד %g%% — על הגבול"
                     % (name, actual, target))
    return by_topic


def check_levels(bp, total):
    items = bp["items"]
    full_exam = (bp["meta"].get("total_points") or 0) >= 80

    by_level = defaultdict(float)
    for it in items:
        lvl = it.get("level")
        if lvl not in LEVELS:
            err("פריט %s: רמת חשיבה לא מוכרת '%s'. הרמות החוקיות: %s"
                % (it.get("id"), lvl, " · ".join(LEVELS)))
        by_level[lvl] += it.get("points", 0) or 0

    distinct = len([l for l in by_level if l in LEVELS])
    if full_exam and distinct < 5:
        err("רק %d רמות חשיבה שונות במבחן מלא — נדרשות לפחות 5. "
            "מבחן ברמה אחת מודד מי תרגל, לא מי מבין" % distinct)
    elif distinct < 3:
        warn("רק %d רמות חשיבה שונות — גם בבוחן קצר כדאי לפחות 3" % distinct)

    for lvl, pts in by_level.items():
        if total and 100.0 * pts / total > 40:
            err("רמת החשיבה '%s' מהווה %.1f%% מהניקוד — מעל התקרה של 40%%"
                % (lvl, 100.0 * pts / total))

    if full_exam:
        if by_level.get("נימוק והסבר", 0) == 0:
            err("אין אף פריט ברמת 'נימוק והסבר' — חובה לפחות שניים במבחן מלא")
        elif sum(1 for it in items if it.get("level") == "נימוק והסבר") < 2:
            warn("רק פריט אחד ברמת 'נימוק והסבר' — התקן דורש שניים לפחות")
        if not (HIGHER_LEVELS & set(by_level)):
            err("אין אף פריט ברמה גבוהה (%s) — מבחן מלא חייב לפחות אחד"
                % " / ".join(sorted(HIGHER_LEVELS)))
    return by_level


def check_types(bp):
    items = bp["items"]
    full_exam = (bp["meta"].get("total_points") or 0) >= 80
    counts = Counter(it.get("type") for it in items)

    for t in counts:
        if t not in TYPES:
            warn("סוג פריט לא מוכר '%s' — אם זה פורמט חדש, הוסף אותו ל-item-types.md"
                 % t)

    n = len(items)
    for t, c in counts.items():
        if n and 100.0 * c / n > 40:
            err("הפורמט '%s' מופיע ב-%d מתוך %d הפריטים (%.0f%%) — מעל התקרה של 40%%. "
                "גוון" % (t, c, n, 100.0 * c / n))

    if full_exam and len(counts) < 6:
        warn("מגוון הפורמטים: %d בלבד במבחן מלא — כדאי לפחות 6 (ראה item-types.md)"
             % len(counts))
    return counts


def check_ramp(bp):
    items = bp["items"]
    first = items[0]
    if first.get("level") in HIGHER_LEVELS:
        err("הפריט הראשון (%s) הוא ברמת '%s' — אסור לפתוח בשאלה קשה. "
            "תלמיד ששולט ביסודות חייב להצליח בפריט הראשון"
            % (first.get("id"), first.get("level")))
    elif (first.get("points") or 0) > 6:
        warn("הפריט הראשון (%s) שווה %g נק׳ — פתיחה נגישה היא בדרך כלל 2–5"
             % (first.get("id"), first.get("points")))

    for it in items:
        pts, lvl = it.get("points") or 0, it.get("level")
        if lvl in ("ידע וזיהוי",) and pts > 5:
            warn("פריט %s: רמת 'ידע וזיהוי' ב-%g נק׳ — ניקוד גבוה לפריט של זיהוי"
                 % (it.get("id"), pts))
        if lvl == "משימה מורכבת" and pts < 10:
            warn("פריט %s: 'משימה מורכבת' ב-%g נק׳ בלבד — משימה מורכבת היא 10–15"
                 % (it.get("id"), pts))
        if lvl == "פתרון בעיה" and pts < 5:
            warn("פריט %s: רמת 'פתרון בעיה' ב-%g נק׳ — נמוך ביחס לעבודה הנדרשת"
                 % (it.get("id"), pts))
        if lvl == "אוריינות מתמטית" and pts < 3:
            warn("פריט %s: רמת 'אוריינות מתמטית' ב-%g נק׳ — נמוך ביחס לעבודה הנדרשת"
                 % (it.get("id"), pts))


def check_time(bp):
    meta = bp["meta"]
    total_min = meta.get("minutes")
    est = sum(it.get("minutes") or 0 for it in bp["items"])
    if not isinstance(total_min, (int, float)) or not est:
        return
    ceiling = 0.85 * total_min
    if est > total_min:
        err("אומדן הזמן %g דק׳ עולה על זמן המבחן (%g דק׳)" % (est, total_min))
    elif est > ceiling:
        err("אומדן הזמן %g דק׳ עובר 85%% מזמן המבחן (%g דק׳). "
            "יש להשאיר 15%% לקריאה, מעבר בין שאלות ובדיקה חוזרת"
            % (est, total_min))
    else:
        note("אומדן זמן: %g דק׳ מתוך %g (%.0f%%)"
             % (est, total_min, 100.0 * est / total_min))


def table(title, rows, headers):
    widths = [max(len(str(r[i])) for r in ([headers] + rows)) for i in range(len(headers))]
    line = "  ".join(h.ljust(widths[i]) for i, h in enumerate(headers))
    out = ["", title, "-" * len(line), line, "-" * len(line)]
    for r in rows:
        out.append("  ".join(str(r[i]).ljust(widths[i]) for i in range(len(headers))))
    return "\n".join(out)


def summaries(bp, by_topic, by_level, by_type, total):
    print(table("ניקוד לפי נושא",
                [[k, "%g" % v, "%.1f%%" % (100.0 * v / total if total else 0)]
                 for k, v in sorted(by_topic.items(), key=lambda x: -x[1])],
                ["נושא", "ניקוד", "אחוז"]))
    print(table("ניקוד לפי רמת חשיבה",
                [[k, "%g" % by_level[k], "%.1f%%" % (100.0 * by_level[k] / total if total else 0)]
                 for k in LEVELS if k in by_level],
                ["רמת חשיבה", "ניקוד", "אחוז"]))
    print(table("פורמטים",
                [[k, str(v)] for k, v in by_type.most_common()],
                ["פורמט", "מספר פריטים"]))


def mapping(bp):
    print("\n\n## טבלת מיפוי\n")
    print("| שאלה | נושא | תת-נושא | מיומנות | רמת חשיבה | ניקוד |")
    print("|---|---|---|---|---|---|")
    for it in bp["items"]:
        print("| %s | %s | %s | %s | %s | %g |" % (
            it.get("id", ""), it.get("topic", ""), it.get("subtopic", ""),
            it.get("skill", ""), it.get("level", ""), it.get("points", 0)))
    print("\n> השלם ידנית שלוש עמודות אבחון לכל פריט מהותי: "
          "מה התלמיד יודע אם הצליח · מה הטעות מעידה אם נכשל · המלצה לחיזוק "
          "(ראה rubric-and-mapping.md).")


def report():
    if errors:
        print("\n=== שגיאות — חובה לתקן לפני כתיבת השאלות (%d) ===" % len(errors))
        for e in errors:
            print("  ✗ " + e)
    if warnings:
        print("\n=== אזהרות — בדוק והכרע (%d) ===" % len(warnings))
        for w in warnings:
            print("  ! " + w)
    if notes:
        print("\n=== מידע ===")
        for n in notes:
            print("  · " + n)


def main():
    ap = argparse.ArgumentParser(description="בדיקת מפרט מבחן")
    ap.add_argument("blueprint", help="נתיב לקובץ blueprint.json")
    ap.add_argument("--mapping", action="store_true", help="הדפס גם את טבלת המיפוי")
    ap.add_argument("--quiet", action="store_true", help="בלי טבלאות סיכום")
    args = ap.parse_args()

    bp = load(args.blueprint)
    check_structure(bp)
    check_ids(bp["items"])
    total = check_points(bp)
    by_topic = check_topics(bp, total)
    by_level = check_levels(bp, total)
    by_type = check_types(bp)
    check_ramp(bp)
    check_time(bp)

    meta = bp["meta"]
    print("מפרט: כיתה %s · %s · %g נק׳ · %g דק׳ · %d פריטים"
          % (meta.get("grade", "?"), meta.get("purpose", "?"),
             meta.get("total_points", 0), meta.get("minutes", 0), len(bp["items"])))
    for a in meta.get("assumptions", []) or []:
        print("  הנחה: " + a)

    if not args.quiet:
        summaries(bp, by_topic, by_level, by_type, total)
    if args.mapping:
        mapping(bp)
    report()

    if errors:
        print("\nFAIL — %d שגיאות. תקן את המפרט לפני כתיבת השאלות." % len(errors))
        return 1
    print("\nPASS — המפרט תקין%s. אפשר לעבור לשלב 2 (כתיבת פריטים)."
          % (" (יש %d אזהרות לבדיקה)" % len(warnings) if warnings else ""))
    return 0


if __name__ == "__main__":
    sys.exit(main())
