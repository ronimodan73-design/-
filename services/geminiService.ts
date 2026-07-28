import { GoogleGenAI } from '@google/genai';
import type { ComparisonResult, Platform, Source, AdvisorAnswer } from '../types';
import { PLATFORM_INFO } from '../constants';
import { extractJson } from '../utils/json';

export class MissingApiKeyError extends Error {
  constructor() {
    super('GEMINI_API_KEY is not set');
    this.name = 'MissingApiKeyError';
  }
}

let client: GoogleGenAI | null = null;

const getClient = (): GoogleGenAI => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new MissingApiKeyError();
  }
  if (!client) {
    client = new GoogleGenAI({ apiKey });
  }
  return client;
};

export const hasApiKey = (): boolean => Boolean(process.env.API_KEY);

const buildPrompt = (query: string): string => `
את/ה עוזר קניות חכם ואמין, מומחה בקניות אונליין מפלטפורמות סיניות (AliExpress, Shein, Temu).
המשתמש/ת רוצה לקנות: "${query}".

בהתבסס על הידע הכללי שלך על המוצר הזה ועל הפלטפורמות האלה (ללא חיפוש אינטרנט חי), נתח/י עבור כל פלטפורמה: טווח מחירים משוער בשקלים חדשים (₪), דירוג ממוצע משוער (0-5), הערכת מספר ביקורות, איכות המוצר (מבד/חומר, עמידות, התאמה למידה), יתרונות וחסרונות.
חשוב מאוד: שימי דגש מיוחד על **אמינות המוכר/החנות** בכל פלטפורמה - למשל דירוג המוכר, כמה זמן הוא פעיל, האם יש הגנת קונה, סימנים לזהירות (מחיר נמוך מדי, חנות חדשה בלי היסטוריה). זה חלק מרכזי מהניתוח, לא רק המחיר.
קבע/י איזו פלטפורמה הכי משתלמת ואמינה עבור המוצר הספציפי הזה, ותן/י המלצה מתי כדאי לקנות (עכשיו, או לחכות למבצע קרוב כמו 11.11, בלאק פריידי, וכו').
אם המוצר הוא פריט לבוש, נעליים או אביזר עם מידות - הוסף/הוסיפי המלצה קצרה לגבי המרת מידות (מידות סיניות נוטות להיות קטנות).
ציין/י בבירור בתוך "summary" שההערכות מבוססות על ידע כללי ולא על מחירים בזמן אמת, וכדאי לאמת מול העמוד עצמו לפני רכישה.

השב/י אך ורק באובייקט JSON יחיד, בעברית, בפורמט הבא בדיוק (ללא טקסט נוסף, ללא markdown fences):
{
  "productQuery": "string",
  "summary": "string - סיכום כללי והמלצה בשפה ידידותית, 2-3 משפטים",
  "bestPlatform": "aliexpress" | "shein" | "temu",
  "bestTimeToBuy": "string - מתי כדאי לקנות ולמה",
  "buyingTips": ["string", "string", "string"],
  "sizeAdviceNote": "string - עצה לגבי מידות, או מחרוזת ריקה אם לא רלוונטי",
  "platforms": [
    {
      "platform": "aliexpress" | "shein" | "temu",
      "priceRangeILS": "string, לדוגמה '45-70 ₪'",
      "rating": number,
      "reviewCount": "string, לדוגמה '3,000+'",
      "qualityNotes": "string - כולל התייחסות לאיכות המוצר ולאמינות המוכר/החנות",
      "pros": ["string", "string"],
      "cons": ["string", "string"],
      "recommended": boolean
    }
  ]
}
חשוב: יש לכלול בדיוק שלושה אובייקטים במערך platforms, אחד לכל פלטפורמה (aliexpress, shein, temu).
`;

const extractSources = (response: any): Source[] => {
  const chunks = response?.candidates?.[0]?.groundingMetadata?.groundingChunks ?? [];
  const seen = new Set<string>();
  const sources: Source[] = [];
  for (const chunk of chunks) {
    const uri = chunk?.web?.uri;
    const title = chunk?.web?.title ?? uri;
    if (uri && !seen.has(uri)) {
      seen.add(uri);
      sources.push({ title, uri });
    }
  }
  return sources;
};

export const compareProduct = async (query: string): Promise<ComparisonResult> => {
  const ai = getClient();

  const response = await ai.models.generateContent({
    model: 'gemini-flash-latest',
    contents: buildPrompt(query),
  });

  const text = response.text;
  if (!text) {
    throw new Error('לא התקבלה תשובה מהמודל');
  }

  const parsed = extractJson(text) as ComparisonResult;

  const platformsByKey = new Map(parsed.platforms.map((p) => [p.platform, p]));
  const orderedPlatforms: Platform[] = ['aliexpress', 'shein', 'temu'];
  parsed.platforms = orderedPlatforms
    .map((key) => platformsByKey.get(key))
    .filter((p): p is ComparisonResult['platforms'][number] => Boolean(p))
    .map((p) => ({
      ...p,
      searchUrl: PLATFORM_INFO[p.platform].searchUrlTemplate(query),
    }));

  parsed.sources = extractSources(response);
  parsed.productQuery = query;

  return parsed;
};

const buildAdvisorPrompt = (question: string, financeContext: string): string => `
את יועצת כלכלית אישית, סבלנית וידידותית, שמסבירה כל דבר בשפה כל כך פשוטה שילדה בת 12 בלי שום רקע בכלכלה תבין הכל.
אסור להשתמש במונחים כלכליים בלי להסביר אותם. אסור לכתוב תשובות ארוכות או מסובכות. משפטים קצרים וברורים בלבד.

הנתונים הכספיים הידועים על המשתמשת (מוזנים ידנית על ידה, אין חיבור לבנק):
${financeContext}

השאלה של המשתמשת: "${question}"

תני תשובה שמסבירה בבירור: האם זה כדאי או לא, למה (מה הרווח ומה ההפסד/הסיכון), ועצה מעשית קצרה אחת.
חשוב: אם אין מספיק מידע כדי לחשב במדויק (למשל אין נתונים על הכנסה), תני הערכה כללית סבירה ותציין שזו הערכה.

השב/י אך ורק באובייקט JSON יחיד, בעברית, בפורמט הבא בדיוק (ללא טקסט נוסף, ללא markdown fences):
{
  "verdict": "worth_it" | "not_worth_it" | "depends",
  "verdictLabel": "string קצר, לדוגמה 'כדאי!' או 'לא כדאי' או 'תלוי'",
  "simpleExplanation": "string - הסבר פשוט מאוד, 2-3 משפטים קצרים, כמו לילדה בת 12",
  "gain": "string - מה תרוויחי, משפט אחד פשוט",
  "loss": "string - מה תפסידי או הסיכון, משפט אחד פשוט",
  "tip": "string - עצה מעשית קצרה אחת"
}
`;

export const askAdvisor = async (question: string, financeContext: string): Promise<AdvisorAnswer> => {
  const ai = getClient();

  const response = await ai.models.generateContent({
    model: 'gemini-flash-latest',
    contents: buildAdvisorPrompt(question, financeContext),
  });

  const text = response.text;
  if (!text) {
    throw new Error('לא התקבלה תשובה מהמודל');
  }

  return extractJson(text) as AdvisorAnswer;
};
