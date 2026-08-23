# -*- coding: utf-8 -*-
"""בונה את דף העבודה בוורד: הרביע הראשון במערכת הצירים, כיתה ז'.
מפיק: הרביע-הראשון-דף-עבודה.docx  (כולל מפתח תשובות עם הסברים)"""
import os
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from docx import Document
from docx.shared import Pt, Cm, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml.ns import qn
from docx.oxml import OxmlElement

HERE = os.path.dirname(os.path.abspath(__file__))
IMG  = os.path.join(HERE, 'build')
os.makedirs(IMG, exist_ok=True)

# ---------------------------------------------------------------- שרטוטים
BLUE='#3b3fb6'; TEAL='#0e7490'; RED='#c81e4a'; GREEN='#0f7a52'; GREY='#334155'

def _axes(ax, xmax, ymax, unit_x=1, unit_y=1, step_x=1, step_y=1):
    for i in range(0, int(xmax/unit_x)+1):
        ax.axvline(i*unit_x, color='#dfe6f2', lw=.8, zorder=0)
    for j in range(0, int(ymax/unit_y)+1):
        ax.axhline(j*unit_y, color='#dfe6f2', lw=.8, zorder=0)
    ax.annotate('', xy=(xmax+unit_x*.75, 0), xytext=(0, 0),
                arrowprops=dict(arrowstyle='-|>', color=GREY, lw=1.6))
    ax.annotate('', xy=(0, ymax+unit_y*.75), xytext=(0, 0),
                arrowprops=dict(arrowstyle='-|>', color=GREY, lw=1.6))
    ax.text(xmax+unit_x*.95, -ymax*.055, 'x', color=GREY, fontsize=11, style='italic',
            ha='center', va='top', fontweight='bold')
    ax.text(-xmax*.05, ymax+unit_y*.95, 'y', color=GREY, fontsize=11, style='italic',
            ha='right', va='center', fontweight='bold')
    xt=[i*unit_x*step_x for i in range(0, int(xmax/(unit_x*step_x))+1)]
    yt=[j*unit_y*step_y for j in range(0, int(ymax/(unit_y*step_y))+1)]
    ax.set_xticks(xt); ax.set_yticks(yt)
    ax.tick_params(colors='#5b6b86', labelsize=8.5, length=0, pad=3)
    for s in ax.spines.values(): s.set_visible(False)
    ax.set_xlim(-xmax*.09, xmax+unit_x*1.15)
    ax.set_ylim(-ymax*.09, ymax+unit_y*1.15)

def grid_png(name, xmax=10, ymax=10, unit=1, points=(), polyline=None,
             segments=(), size=3.5, step=1, aspect=True):
    fig, ax = plt.subplots(figsize=(size, size*(ymax/unit)/(xmax/unit)))
    _axes(ax, xmax, ymax, unit, unit, step, step)
    for s in segments:
        ax.plot([s[0][0], s[1][0]], [s[0][1], s[1][1]], color=TEAL, lw=1.8, zorder=2)
    if polyline:
        ax.plot([p[0] for p in polyline], [p[1] for p in polyline], color=TEAL, lw=2.2, zorder=2)
    for p in points:
        x, y, lab = p[0], p[1], (p[2] if len(p) > 2 else '')
        col = p[3] if len(p) > 3 else BLUE
        dashed = p[4] if len(p) > 4 else False
        if dashed:
            ax.plot([x, x], [0, y], ls=(0, (3, 3)), color=col, lw=1, zorder=1)
            ax.plot([0, x], [y, y], ls=(0, (3, 3)), color=col, lw=1, zorder=1)
        ax.plot([x], [y], 'o', ms=7, color=col, mec='white', mew=1.4, zorder=3)
        if lab:
            ax.annotate(lab, (x, y), textcoords='offset points', xytext=(7, 7),
                        fontsize=11, fontweight='bold', color=col)
    if aspect: ax.set_aspect('equal')
    fig.tight_layout(pad=.2)
    path = os.path.join(IMG, name + '.png')
    fig.savefig(path, dpi=220, transparent=False, facecolor='white')
    plt.close(fig)
    return path

def pool_png(name):
    fig, ax = plt.subplots(figsize=(4.5, 3.4))
    _axes(ax, 10, 80, 1, 10, 1, 1)
    pl = [(0,0),(4,40),(6,40),(10,80)]
    ax.plot([p[0] for p in pl], [p[1] for p in pl], color=TEAL, lw=2.4, zorder=2)
    for x,y in pl:
        ax.plot([x],[y],'o',ms=6,color=TEAL,mec='white',mew=1.3,zorder=3)
    fig.tight_layout(pad=.2)
    path=os.path.join(IMG,name+'.png'); fig.savefig(path,dpi=220,facecolor='white'); plt.close(fig)
    return path

def paper_png(name, cols=18, rows=6):
    fig, ax = plt.subplots(figsize=(6.4, 6.4*rows/cols))
    for i in range(cols+1): ax.axvline(i, color='#e3e9f4', lw=.8)
    for j in range(rows+1): ax.axhline(j, color='#e3e9f4', lw=.8)
    ax.set_xlim(0, cols); ax.set_ylim(0, rows); ax.set_xticks([]); ax.set_yticks([])
    for s in ax.spines.values(): s.set_color('#cfd8e8')
    fig.tight_layout(pad=.05)
    path=os.path.join(IMG,name+'.png'); fig.savefig(path,dpi=200,facecolor='white'); plt.close(fig)
    return path

# ---------------------------------------------------------------- עזרי Word
FONT='Assistant'
LRM='‎'
LRE='\u202a'   # פתיחת בידוד LTR מפורש
PDFM='\u202c'  # סגירת הבידוד
def pair(x,y): return LRM+'('+str(x)+' , '+str(y)+')'+LRM
def lt(t):     return LRM+str(t)+LRM

RPR_ORDER=['w:rStyle','w:rFonts','w:b','w:bCs','w:i','w:iCs','w:caps','w:smallCaps','w:strike',
 'w:dstrike','w:outline','w:shadow','w:emboss','w:imprint','w:noProof','w:snapToGrid','w:vanish','w:webHidden',
 'w:color','w:spacing','w:w','w:kern','w:position','w:sz','w:szCs','w:highlight','w:u','w:effect','w:bdr','w:shd',
 'w:fitText','w:vertAlign','w:rtl','w:cs','w:em','w:lang','w:eastAsianLayout','w:specVanish','w:oMath']
PPR_ORDER=['w:pStyle','w:keepNext','w:keepLines','w:pageBreakBefore','w:framePr','w:widowControl','w:numPr',
 'w:suppressLineNumbers','w:pBdr','w:shd','w:tabs','w:suppressAutoHyphens','w:kinsoku','w:wordWrap',
 'w:overflowPunct','w:topLinePunct','w:autoSpaceDE','w:autoSpaceDN','w:bidi','w:adjustRightInd','w:snapToGrid',
 'w:spacing','w:ind','w:contextualSpacing','w:mirrorIndents','w:suppressOverlap','w:jc','w:textDirection',
 'w:textAlignment','w:textboxTightWrap','w:outlineLvl','w:divId','w:cnfStyle','w:rPr','w:sectPr','w:pPrChange']
SPR_ORDER=['w:footnotePr','w:endnotePr','w:type','w:pgSz','w:pgMar','w:paperSrc','w:pgBorders','w:lnNumType',
 'w:pgNumType','w:cols','w:formProt','w:vAlign','w:noEndnote','w:titlePg','w:textDirection','w:bidi',
 'w:rtlGutter','w:docGrid','w:printerSettings','w:sectPrChange']

def _ins(parent, tag, order):
    """מוסיף אלמנט XML במקום הנכון לפי סדר הסכימה של Word."""
    e=parent.find(qn(tag))
    if e is not None: return e
    e=OxmlElement(tag); idx=order.index(tag)
    for child in parent:
        ctag='w:'+child.tag.split('}')[-1]
        if ctag in order and order.index(ctag)>idx:
            child.addprevious(e); return e
    parent.append(e); return e

def _rtl_par(p, align=WD_ALIGN_PARAGRAPH.RIGHT):
    pPr=p._p.get_or_add_pPr(); _ins(pPr,'w:bidi',PPR_ORDER)
    p.alignment=align
    return p

def _style_run(r, size=12, bold=False, color=None, italic=False, rtl=True):
    r.font.name=FONT; r.font.size=Pt(size); r.bold=bold; r.italic=italic
    if color: r.font.color.rgb=RGBColor.from_string(color)
    rPr=r._element.get_or_add_rPr()
    rf=_ins(rPr,'w:rFonts',RPR_ORDER)
    rf.set(qn('w:cs'),FONT); rf.set(qn('w:ascii'),FONT); rf.set(qn('w:hAnsi'),FONT)
    _ins(rPr,'w:szCs',RPR_ORDER).set(qn('w:val'),str(int(size*2)))
    if bold: _ins(rPr,'w:bCs',RPR_ORDER).set(qn('w:val'),'1')
    _ins(rPr,'w:rtl',RPR_ORDER).set(qn('w:val'),'1' if rtl else '0')
    return r

def rich(p, text, size=12, bold=False, color=None):
    """מפצל טקסט מעורב: קטעים שסומנו ב-LRM נכתבים כריצה בכיוון LTR,
    כדי שזוגות סדורים ומשתנים לא יתהפכו בתוך משפט בעברית."""
    for i,seg in enumerate(text.split(LRM)):
        if seg=='': continue
        if i%2:  _style_run(p.add_run(LRE+seg+PDFM), size, bold, color, rtl=False)
        else:    _style_run(p.add_run(seg), size, bold, color)
    return p

def para(doc, text='', size=12, bold=False, color=None, space_after=6,
         align=WD_ALIGN_PARAGRAPH.RIGHT, space_before=0, indent=None):
    p=doc.add_paragraph(); _rtl_par(p, align)
    p.paragraph_format.space_after=Pt(space_after)
    p.paragraph_format.space_before=Pt(space_before)
    p.paragraph_format.line_spacing=1.25
    if indent is not None: p.paragraph_format.right_indent=Cm(indent)
    if text: rich(p, text, size, bold, color)
    return p

def shade(cell, hexcolor):
    tcPr=cell._tc.get_or_add_tcPr(); sh=OxmlElement('w:shd')
    sh.set(qn('w:val'),'clear'); sh.set(qn('w:fill'),hexcolor); tcPr.append(sh)

def no_borders(tbl):
    tblPr=tbl._tbl.tblPr; b=OxmlElement('w:tblBorders')
    for e in ('top','left','bottom','right','insideH','insideV'):
        x=OxmlElement('w:'+e); x.set(qn('w:val'),'none'); b.append(x)
    tblPr.append(b)

def banner(doc, title, subtitle, color):
    t=doc.add_table(rows=1, cols=1); t.alignment=WD_TABLE_ALIGNMENT.CENTER
    t.autofit=True; no_borders(t)
    c=t.cell(0,0); shade(c,color)
    c.width=Cm(17)
    p=c.paragraphs[0]; _rtl_par(p)
    p.paragraph_format.space_before=Pt(4); p.paragraph_format.space_after=Pt(4)
    _style_run(p.add_run(title), 13.5, True, 'FFFFFF')
    _style_run(p.add_run('   ·   '), 12, False, 'FFFFFF')
    _style_run(p.add_run(subtitle), 11, False, 'FFFFFF')
    doc.add_paragraph().paragraph_format.space_after=Pt(0)
    return t

def qnum(doc, label, text, size=12):
    p=doc.add_paragraph(); _rtl_par(p)
    p.paragraph_format.space_before=Pt(8); p.paragraph_format.space_after=Pt(4)
    p.paragraph_format.line_spacing=1.3
    _style_run(p.add_run(LRM+label+LRM+'  '), size, True, '1F3A93', rtl=False)
    rich(p, text, size)
    return p

def sub(doc, text, size=11.5, indent=.8):
    return para(doc, text, size=size, indent=indent, space_after=3)

def lines(doc, n=2, width_cm=16.5):
    for _ in range(n):
        p=doc.add_paragraph(); _rtl_par(p)
        p.paragraph_format.space_after=Pt(14)
        pPr=p._p.get_or_add_pPr(); bd=_ins(pPr,'w:pBdr',PPR_ORDER); bt=OxmlElement('w:bottom')
        bt.set(qn('w:val'),'dotted'); bt.set(qn('w:sz'),'6'); bt.set(qn('w:space'),'1')
        bt.set(qn('w:color'),'A9B6CC'); bd.append(bt)

def picture(doc, path, width_cm=8.4, align=WD_ALIGN_PARAGRAPH.CENTER):
    p=doc.add_paragraph(); p.alignment=align
    p.paragraph_format.space_before=Pt(4); p.paragraph_format.space_after=Pt(6)
    p.add_run().add_picture(path, width=Cm(width_cm))
    return p

def answer_box(doc, text='התשובה:'):
    p=para(doc, text, size=11.5, bold=True, color='5B6B86', space_after=2, indent=.8)
    lines(doc,1)

# ---------------------------------------------------------------- בניית המסמך
def build(out_path):
    doc=Document()
    sec=doc.sections[0]
    sec.page_height=Cm(29.7); sec.page_width=Cm(21)
    sec.top_margin=Cm(1.6); sec.bottom_margin=Cm(1.5)
    sec.left_margin=Cm(1.9); sec.right_margin=Cm(1.9)
    _ins(sec._sectPr,'w:bidi',SPR_ORDER)
    st=doc.styles['Normal']; st.font.name=FONT; st.font.size=Pt(12)
    st.element.rPr.rFonts.set(qn('w:cs'),FONT)

    # ---------- כותרת ----------
    t=doc.add_table(rows=1,cols=1); no_borders(t); c=t.cell(0,0); shade(c,'1F3A93')
    p=c.paragraphs[0]; _rtl_par(p); p.paragraph_format.space_before=Pt(6); p.paragraph_format.space_after=Pt(6)
    _style_run(p.add_run('הרביע הראשון במערכת הצירים'),19,True,'FFFFFF')
    p2=c.add_paragraph(); _rtl_par(p2); p2.paragraph_format.space_after=Pt(6)
    _style_run(p2.add_run('דף עבודה · כיתה ז׳ · שש רמות חשיבה'),11.5,False,'D6DCF7')

    p=para(doc,'',space_after=2)
    rich(p, 'שם התלמיד/ה: ______________________     כיתה: _______     תאריך: ____________', 12)
    para(doc,'מטרת הדף: לקרוא ולסמן נקודות ברביע הראשון, להסביר את משמעות כל שיעור, לזהות טעויות נפוצות ולקרוא מידע מגרף.',
         size=11,color='4A5B7A',space_after=4)

    # ---------- דוגמה פתורה ----------
    banner(doc,'דוגמה פתורה','לפני שמתחילים — כך עובדים','0E7490')
    tb=doc.add_table(rows=1,cols=2); no_borders(tb)
    left,right=tb.cell(0,0),tb.cell(0,1)
    right.width=Cm(9.5); left.width=Cm(7.0)
    pp=right.paragraphs[0]; _rtl_par(pp)
    rich(pp,'סמנו את הנקודה '+pair(4,3)+' והסבירו כל שלב.',12,True)
    for i,txt in enumerate([
        'מתחילים תמיד מראשית הצירים — הנקודה '+pair(0,0)+'.',
        'המספר הראשון בזוג הוא שיעור '+lt('x')+': הולכים 4 יחידות ימינה על הציר האופקי (השוכב).',
        'המספר השני הוא שיעור '+lt('y')+': משם עולים 3 יחידות למעלה, במקביל לציר האנכי (העומד).',
        'מסמנים נקודה וכותבים לידה את השם: '+lt('A')+'.']):
        q=right.add_paragraph(); _rtl_par(q); q.paragraph_format.space_after=Pt(3); q.paragraph_format.line_spacing=1.25
        _style_run(q.add_run('שלב '+str(i+1)+': '),11.5,True,'0E7490'); rich(q, txt, 11.5)
    q=right.add_paragraph(); _rtl_par(q); q.paragraph_format.space_before=Pt(4)
    _style_run(q.add_run('מסקנה: '),11.5,True,'0E7490')
    rich(q,'שיעור '+lt('x')+' מודד כמה ימינה, שיעור '+lt('y')+' מודד כמה למעלה. הסדר קובע — '+
         pair(4,3)+' אינה '+pair(3,4)+'.',11.5)
    img=grid_png('ex',10,10,points=[(4,3,'A',BLUE,True)],size=3.2)
    lp=left.paragraphs[0]; lp.alignment=WD_ALIGN_PARAGRAPH.CENTER
    lp.add_run().add_picture(img,width=Cm(6.6))

    # ---------- חלק א ----------
    banner(doc,'חלק א · זיהוי וידע','מכירים את השמות ואת השיעורים','2563EB')
    qnum(doc,'1.','השלימו את שיעורי הנקודות שבשרטוט.')
    picture(doc,grid_png('a1',10,10,points=[(3,4,'A',BLUE,True),(6,1,'B',BLUE,True),
                                            (0,5,'C',TEAL,True),(4,0,'D',TEAL,True)],size=3.6),9.0)
    p=para(doc,'',space_after=10,indent=.8)
    rich(p, lt('A ( ____ , ____ )')+'      '+lt('B ( ____ , ____ )')+'      '+lt('C ( ____ , ____ )')+'      '+lt('D ( ____ , ____ )'), 12.5)
    sub(doc,'שימו לב: שתיים מהנקודות יושבות על ציר. איזה שיעור שלהן שווה 0?')
    lines(doc,1)

    qnum(doc,'2.','רשמו ליד כל מספר בשרטוט מה הוא מסמן: ציר ה‑'+lt('x')+', ציר ה‑'+lt('y')+', ראשית הצירים.')
    picture(doc,grid_png('a2',8,8,points=[(0,0,'1',RED),(6,0,'2',RED),(0,6,'3',RED)],size=3.2),7.6)
    p=para(doc,'',space_after=8,indent=.8)
    rich(p, '1 — ________________        2 — ________________        3 — ________________', 12.5)

    qnum(doc,'3.','הקיפו את הזוג הסדור שמתאר נקודה היושבת על ציר ה‑'+lt('y')+':')
    p=para(doc,'',space_after=8,indent=.8)
    _style_run(p.add_run(pair(3,0)+'          '+pair(0,3)+'          '+pair(3,3)+'          '+pair(1,1)),13)
    answer_box(doc,'נמקו:')

    # ---------- חלק ב ----------
    doc.add_page_break()
    banner(doc,'חלק ב · הבנה והסבר','מסבירים במילים שלכם למה זה עובד','0891B2')
    qnum(doc,'4.','סמנו בשרטוט את שתי הנקודות '+pair(3,5)+' ו'+pair(5,3)+', וכתבו האם הן אותה נקודה. הסבירו.')
    picture(doc,grid_png('b1',10,10,size=3.6),8.6)
    lines(doc,2)

    qnum(doc,'5.','השלימו את המשפטים:')
    sub(doc,'א. שיעור ה‑'+lt('x')+' של נקודה מודד ____________________________________________ .')
    sub(doc,'ב. שיעור ה‑'+lt('y')+' של נקודה מודד ____________________________________________ .')
    sub(doc,'ג. אם שיעור ה‑'+lt('x')+' של נקודה הוא 0, הנקודה נמצאת תמיד על ____________________ .')
    sub(doc,'ד. אם שיעור ה‑'+lt('y')+' של נקודה הוא 0, הנקודה נמצאת תמיד על ____________________ .')

    qnum(doc,'6.','נועה אומרת: "בזוג סדור לא משנה איזה מספר כותבים ראשון, כי בסוף מגיעים לאותו מקום". האם היא צודקת? הסבירו והדגימו בעזרת שרטוט מס\' 4.')
    lines(doc,2)

    # ---------- חלק ג ----------
    banner(doc,'חלק ג · יישום','מסמנים בעצמכם, בדיוק','7C3AED')
    qnum(doc,'7.','סמנו את הנקודות שהזוגות הסדורים שלהן נתונים, וכתבו ליד כל נקודה את שמה.')
    p=para(doc,'',space_after=4,indent=.8)
    rich(p, 'E '+pair(5,2)+'        F '+pair(0,4)+'        G '+pair(6,0)+'        H '+pair(3,3), 12.5)
    picture(doc,grid_png('c1',10,10,size=3.6),8.6)

    doc.add_page_break()
    qnum(doc,'8.','במערכת הצירים שלפניכם כל משבצת שווה 2 יחידות. שימו לב למספרים שעל הצירים.')
    sub(doc,'א. סמנו את הנקודה '+pair(6,4)+'.')
    sub(doc,'ב. סמנו את הנקודה '+pair(10,2)+'.')
    sub(doc,'ג. השלימו את שיעורי הנקודה '+lt('K')+' המסומנת בשרטוט:   '+lt('K ( ____ , ____ )'))
    picture(doc,grid_png('c2',20,20,unit=2,points=[(14,8,'K',BLUE,True)],size=3.6),9.0)
    sub(doc,'ד. כמה משבצות צריך ללכת ימינה כדי לעבור 6 יחידות? הסבירו כיצד חישבתם.')
    lines(doc,1)

    # ---------- חלק ד ----------
    banner(doc,'חלק ד · הסקה ובעיה הפוכה','חושבים אחורה — מהתשובה אל הנקודה','DB2777')
    qnum(doc,'9.','שלושה קודקודים של מלבן מסומנים בשרטוט. סמנו את הקודקוד הרביעי '+lt('D')+' והשלימו את שיעוריו.')
    picture(doc,grid_png('d1',10,10,points=[(2,1,'A',BLUE),(7,1,'B',BLUE),(7,5,'C',BLUE)],
                         segments=[((2,1),(7,1)),((7,1),(7,5))],size=3.6),8.6)
    p=para(doc,'',space_after=4,indent=.8); rich(p, lt('D ( ____ , ____ )'), 12.5)
    sub(doc,'הסבירו כיצד ידעתם היכן לסמן, בלי למדוד:')
    lines(doc,1)

    qnum(doc,'10.','נקודה יושבת על ציר ה‑'+lt('x')+', ומרחקה מראשית הצירים 6 יחידות. רשמו את שיעוריה ונמקו.')
    p=para(doc,'',space_after=4,indent=.8); rich(p, lt('(  ____ , ____ )'), 12.5)
    lines(doc,1)

    qnum(doc,'11.','שיעור ה‑'+lt('x')+' של נקודה הוא 4, ושיעור ה‑'+lt('y')+' שלה גדול ממנו ב-3. רשמו את הזוג הסדור וסמנו את הנקודה.')
    p=para(doc,'',space_after=4,indent=.8); rich(p, lt('(  ____ , ____ )'), 12.5)
    picture(doc,grid_png('d3',10,10,size=3.2),7.6)

    qnum(doc,'12.','הנקודה '+lt('K')+' נמצאת 3 יחידות מימין לנקודה '+lt('A')+' ו-2 יחידות מתחתיה. סמנו את '+lt('K')+' והשלימו את שיעוריה.')
    picture(doc,grid_png('d4',10,10,points=[(2,5,'A',BLUE,True)],size=3.2),7.6)
    p=para(doc,'',space_after=8,indent=.8); rich(p, lt('K ( ____ , ____ )'), 12.5)

    # ---------- חלק ה ----------
    doc.add_page_break()
    banner(doc,'חלק ה · ניתוח טעות','תופסים את הטעות ומסבירים אותה','EA580C')
    qnum(doc,'13.','יובל התבקש לסמן את הנקודה '+pair(2,6)+'. בשרטוט מסומן מה שיובל סימן.')
    picture(doc,grid_png('e1',8,8,points=[(6,2,'',RED,True)],size=3.0),7.2)
    sub(doc,'א. מהם שיעורי הנקודה שיובל סימן?   '+lt('(  ____ , ____ )'))
    sub(doc,'ב. במה בדיוק הוא טעה? כתבו לו הסבר קצר בשתי שורות:')
    lines(doc,2)

    qnum(doc,'14.','מאיה קראה את הנקודה שבשרטוט וכתבה '+pair(5,4)+'.')
    picture(doc,grid_png('e2',8,8,points=[(4,3,'',BLUE,True)],size=3.0),7.2)
    sub(doc,'א. מהם השיעורים הנכונים?   '+lt('(  ____ , ____ )'))
    sub(doc,'ב. מה כנראה עשתה מאיה כשספרה? הסבירו:')
    lines(doc,2)

    qnum(doc,'15.','עומר סימן את '+pair(6,4)+' במערכת צירים שבה כל משבצת שווה 2 יחידות. הוא ספר 6 משבצות ימינה ו-4 משבצות למעלה. במה טעה, ואיפה הוא נחת בפועל?')
    lines(doc,2)

    qnum(doc,'16.','רן טוען: "הנקודה '+pair(0,7)+' נמצאת על ציר ה‑'+lt('x')+'". הקיפו: '+lt('נכון / לא נכון')+' — ונמקו.')
    lines(doc,2)

    # ---------- חלק ו ----------
    doc.add_page_break()
    banner(doc,'חלק ו · אוריינות והעברה','קוראים מידע מגרף בסיטואציה אמיתית','059669')
    para(doc,'דנה ממלאת בריכה מתנפחת בחצר. הגרף מתאר כמה ליטרים של מים היו בבריכה בכל דקה מתחילת המילוי.',
         size=12,space_after=2)
    para(doc,'הציר האופקי ('+lt('x')+') — הזמן בדקות.      הציר האנכי ('+lt('y')+') — כמות המים בליטרים.',
         size=11,color='4A5B7A',space_after=4)
    picture(doc,pool_png('f1'),11.5)
    qnum(doc,'17.','כמה ליטרים היו בבריכה אחרי 4 דקות?  ____________ ליטרים.')
    qnum(doc,'18.','מה מייצגת הנקודה '+pair(6,40)+' בסיפור? כתבו במשפט שלם.')
    lines(doc,1)
    qnum(doc,'19.','מתי לראשונה היו בבריכה 80 ליטרים? רשמו את הזוג הסדור של הנקודה:  '+lt('(  ____ , ____ )'))
    qnum(doc,'20.','בין דקה 4 לדקה 6 הגרף שוכב אופקית. מה זה מספר לנו על הבריכה? הסבירו:')
    lines(doc,2)
    qnum(doc,'21.','מה מייצגת הנקודה '+pair(0,0)+' בסיפור?')
    lines(doc,1)
    qnum(doc,'22.','דנה פתחה שוב את הברז בקצב של 10 ליטרים לדקה. השלימו בגרף את הנקודה שמתארת את דקה 11, ורשמו את שיעוריה:  '+lt('(  ____ , ____ )'))

    para(doc,'מקום לחישובים',size=11.5,bold=True,color='4A5B7A',space_before=8,space_after=2)
    picture(doc,paper_png('paper'),16.5)

    # ---------- מפתח תשובות ----------
    doc.add_page_break()
    t=doc.add_table(rows=1,cols=1); no_borders(t); c=t.cell(0,0); shade(c,'12855B')
    p=c.paragraphs[0]; _rtl_par(p); p.paragraph_format.space_before=Pt(5); p.paragraph_format.space_after=Pt(5)
    _style_run(p.add_run('מפתח תשובות למורה'),17,True,'FFFFFF')
    p2=c.add_paragraph(); _rtl_par(p2); p2.paragraph_format.space_after=Pt(5)
    _style_run(p2.add_run('לכל שאלה: התשובה, ההסבר שכדאי לשמוע מהתלמיד, והטעות הנפוצה שכדאי לצפות לה'),10.5,False,'D8F2E6')
    para(doc,'',space_after=2)

    KEY=[
     ('1','A '+pair(3,4)+' · B '+pair(6,1)+' · C '+pair(0,5)+' · D '+pair(4,0),
      'סופרים מהראשית: קודם ימינה על הציר האופקי, אחר כך למעלה. C יושבת על ציר ה‑'+lt('y')+' ולכן שיעור ה‑'+lt('x')+' שלה 0; D יושבת על ציר ה‑'+lt('x')+' ולכן שיעור ה‑'+lt('y')+' שלה 0.',
      'החלפה בין השיעורים ב-A ו-B, ורישום '+pair(5,5)+' במקום '+pair(0,5)+' ב-C.'),
     ('2','1 — ראשית הצירים · 2 — ציר ה‑'+lt('x')+' · 3 — ציר ה‑'+lt('y'),
      'הראשית היא נקודת המפגש ושיעוריה '+pair(0,0)+'. הציר השוכב הוא '+lt('x')+', העומד הוא '+lt('y')+'.',
      'בלבול בין שני הצירים, או קריאה לראשית "ציר".'),
     ('3',pair(0,3),
      'שיעור '+lt('x')+' שווה 0 פירושו שלא זזים ימינה כלל, ולכן הנקודה נשארת על הציר העומד.',
      'בחירה ב-'+pair(3,0)+' מתוך מחשבה ש-0 "שייך" לציר ה‑'+lt('x')+'.'),
     ('4','לא, אלו שתי נקודות שונות.',
      'ב-'+pair(3,5)+' הולכים 3 ימינה ו-5 למעלה; ב-'+pair(5,3)+' הולכים 5 ימינה ו-3 למעלה. בזוג סדור הסדר קובע את תפקיד כל מספר.',
      'טענה ש"אלו אותם מספרים ולכן אותה נקודה" — כדאי לבקש לסמן את שתיהן ולראות בעיניים.'),
     ('5','א. כמה יחידות ימינה מציר ה‑'+lt('y')+' · ב. כמה יחידות למעלה מציר ה‑'+lt('x')+' · ג. ציר ה‑'+lt('y')+' · ד. ציר ה‑'+lt('x'),
      'כל שיעור מודד תזוזה בכיוון אחד בלבד, ותמיד מהראשית.',
      'החלפה בין ג ל-ד — זו הטעות שחוזרת הכי הרבה במבחנים.'),
     ('6','נועה אינה צודקת.',
      'הסדר בזוג הסדור הוא חלק מהמשמעות: המספר הראשון תמיד מודד ימינה. שינוי הסדר מזיז את הנקודה למקום אחר.',
      'תלמיד שמסכים עם נועה — לבקש ממנו לסמן ולהראות את שתי הנקודות.'),
     ('7','E '+pair(5,2)+' · F '+pair(0,4)+' (על ציר ה‑'+lt('y')+') · G '+pair(6,0)+' (על ציר ה‑'+lt('x')+') · H '+pair(3,3),
      'לכל נקודה: 1) מהראשית ימינה לפי השיעור הראשון, 2) משם למעלה לפי השני.',
      'סימון F ו-G בתוך הרביע במקום על הצירים.'),
     ('8','ג. K '+pair(14,8)+' · ד. 3 משבצות (כי 6 : 2 = 3)',
      'קודם בודקים כמה שווה משבצת אחת, ורק אז סופרים. אפשר גם לקרוא ישירות את המספרים הכתובים על הצירים.',
      'ספירת משבצות במקום יחידות — נחיתה על '+pair(12,8)+' במקום '+pair(6,4)+'.'),
     ('9','D '+pair(2,5),
      'במלבן, D נמצאת בדיוק מעל A ולכן שיעור ה‑'+lt('x')+' שלה זהה ל-A, ובאותו גובה של C ולכן שיעור ה‑'+lt('y')+' שלה זהה ל-C.',
      'רישום '+pair(5,2)+' (החלפה) או ניחוש לפי "צורה יפה" בלי נימוק.'),
     ('10',pair(6,0),
      'הנקודה יושבת על הציר השוכב, ולכן אינה עולה כלל: שיעור ה‑'+lt('y')+' הוא 0. המרחק 6 הוא התזוזה ימינה.',
      'רישום '+pair(0,6)+' — בלבול בין הצירים.'),
     ('11',pair(4,7),
      '"גדול ב-3" פירושו 4 ועוד 3, כלומר 7.',
      'רישום '+pair(4,1)+' (חיסור במקום חיבור) או '+pair(4,3)+' (רישום ההפרש כשיעור).'),
     ('12','K '+pair(5,3),
      'מ-A '+pair(2,5)+': ימינה 3 מגדיל את '+lt('x')+' ל-5, ומתחת ל-2 מקטין את '+lt('y')+' ל-3.',
      'רישום '+pair(5,7)+' — עלייה במקום ירידה.'),
     ('13','א. '+pair(6,2)+' · ב. החלפה בין השיעורים.',
      'יובל הלך 6 ימינה ו-2 למעלה, במקום 2 ימינה ו-6 למעלה. המספר הראשון תמיד מודד ימינה.',
      'תלמיד שכותב רק "הוא טעה" בלי לזהות את סוג הטעות — לבקש לנסח מה בדיוק הוחלף.'),
     ('14','א. '+pair(4,3)+' · ב. ספירה שהתחילה מ-1 במקום מ-0.',
      'שני המספרים של מאיה גדולים בדיוק ב-1. הראשית היא 0, ורק אחרי משבצת שלמה מגיעים ל-1.',
      'זיהוי שגוי של הטעות כ"החלפה בין שיעורים" — כדאי להשוות מספר מול מספר.'),
     ('15','עומר נחת על '+pair(12,8)+'.',
      'הוא ספר משבצות במקום יחידות. 6 משבצות = 12 יחידות. הפתרון: 6 : 2 = 3 משבצות ימינה, 4 : 2 = 2 משבצות למעלה.',
      'התעלמות מהסולם. כדאי להרגיל: "לפני שסופרים — בודקים כמה שווה משבצת".'),
     ('16','לא נכון.',
      'שיעור ה‑'+lt('x')+' הוא 0, ולכן הנקודה יושבת על ציר ה‑'+lt('y')+', בגובה 7. כלל: '+lt('x')+'=0 → ציר ה‑'+lt('y')+'; '+lt('y')+'=0 → ציר ה‑'+lt('x')+'.',
      'הסכמה עם רן בגלל נוכחות הספרה 0.'),
     ('17','40 ליטרים.',
      'מוצאים 4 על ציר הזמן, עולים עד הגרף, ומשם קוראים שמאלה על ציר הכמות.',
      'תשובה "4" — קריאה מהציר הלא נכון.'),
     ('18','אחרי 6 דקות היו בבריכה 40 ליטרים.',
      'קוראים את הזוג הסדור לפי שמות הצירים: (זמן , כמות מים).',
      'היפוך: "אחרי 40 דקות היו 6 ליטרים".'),
     ('19',pair(10,80),
      'מאתרים 80 על ציר הכמות, נעים ימינה עד הגרף ויורדים לציר הזמן.',
      'רישום '+pair(80,10)+' — היפוך סדר השיעורים.'),
     ('20','כמות המים לא השתנתה — נשארה 40 ליטרים (כנראה הברז נסגר לרגע).',
      'גובה קבוע של הגרף פירושו ערך קבוע. הזמן ממשיך לזוז, הכמות לא.',
      'פירוש של קו אופקי כ"הבריכה התרוקנה" או "הזמן עצר".'),
     ('21','בתחילת המדידה, בזמן 0, הבריכה הייתה ריקה.',
      'שני השיעורים 0: 0 דקות ו-0 ליטרים.',
      'טענה ש"אין בריכה" — כדאי להבחין בין כמות 0 לבין היעדר עצם.'),
     ('22',pair(11,90),
      'בדקה 10 היו 80 ליטרים; תוספת של 10 ליטרים בדקה מביאה ל-90 ליטרים בדקה 11.',
      'הוספת 10 לזמן במקום לכמות, או המשך הקו האופקי.')]

    for n,ans,expl,err in KEY:
        p=doc.add_paragraph(); _rtl_par(p)
        p.paragraph_format.space_before=Pt(7); p.paragraph_format.space_after=Pt(1)
        _style_run(p.add_run('שאלה '),11.5,True,'12855B')
        _style_run(p.add_run(LRM+n+LRM+'   '),11.5,True,'12855B',rtl=False)
        rich(p, ans, 11.5, True)
        p=doc.add_paragraph(); _rtl_par(p); p.paragraph_format.space_after=Pt(1)
        p.paragraph_format.right_indent=Cm(.8); p.paragraph_format.line_spacing=1.2
        _style_run(p.add_run('ההסבר שכדאי לשמוע: '),10.5,True,'4A5B7A'); rich(p, expl, 10.5)
        p=doc.add_paragraph(); _rtl_par(p); p.paragraph_format.space_after=Pt(1)
        p.paragraph_format.right_indent=Cm(.8); p.paragraph_format.line_spacing=1.2
        _style_run(p.add_run('טעות נפוצה: '),10.5,True,'B45309'); rich(p, err, 10.5)

    doc.save(out_path)
    return out_path

if __name__=='__main__':
    out=os.path.join(HERE,'הרביע-הראשון-דף-עבודה.docx')
    print(build(out))
