import { GoogleGenAI } from '@google/genai';
import type { ComparisonResult, Platform, Source } from '../types';
import { PLATFORM_INFO } from '../constants';

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

חפש/י מידע עדכני באינטרנט (מחירים, דירוגים, ביקורות, תלונות נפוצות, מבצעים) על המוצר הזה בשלוש הפלטפורמות: AliExpress, Shein, Temu.
בהתבסס על החיפוש, נתח/י עבור כל פלטפורמה: טווח מחירים משוער בשקלים חדשים (₪), דירוג ממוצע משוער (0-5), הערכת מספר ביקורות, איכות המוצר (מבד/חומר, עמידות, התאמה למידה), יתרונות וחסרונות.
קבע/י איזו פלטפורמה הכי משתלמת עבור המוצר הספציפי הזה, ותן/י המלצה מתי כדאי לקנות (עכשיו, או לחכות למבצע קרוב כמו 11.11, בלאק פריידי, וכו').
אם המוצר הוא פריט לבוש, נעליים או אביזר עם מידות - הוסף/הוסיפי המלצה קצרה לגבי המרת מידות (מידות סיניות נוטות להיות קטנות).

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
      "qualityNotes": "string",
      "pros": ["string", "string"],
      "cons": ["string", "string"],
      "recommended": boolean
    }
  ]
}
חשוב: יש לכלול בדיוק שלושה אובייקטים במערך platforms, אחד לכל פלטפורמה (aliexpress, shein, temu).
`;

const extractJson = (text: string): unknown => {
  const cleaned = text.trim()
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/```\s*$/i, '');
  const start = cleaned.indexOf('{');
  const end = cleaned.lastIndexOf('}');
  if (start === -1 || end === -1) {
    throw new Error('לא נמצא JSON בתשובת המודל');
  }
  return JSON.parse(cleaned.slice(start, end + 1));
};

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
    model: 'gemini-2.5-flash',
    contents: buildPrompt(query),
    config: {
      tools: [{ googleSearch: {} }],
    },
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
