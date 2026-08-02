import { GoogleGenAI } from '@google/genai';
import { AIProvider, ProviderSource, ProviderUnavailableError } from './types';

const DEFAULT_MODEL = 'gemini-flash-latest';

const getApiKey = (): string | undefined => process.env.GEMINI_API_KEY || process.env.API_KEY || undefined;
const getModel = (): string => process.env.GEMINI_MODEL || DEFAULT_MODEL;

let client: GoogleGenAI | null = null;

const getClient = (): GoogleGenAI => {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new ProviderUnavailableError('gemini', 'GEMINI_API_KEY לא מוגדר');
  }
  if (!client) {
    client = new GoogleGenAI({ apiKey });
  }
  return client;
};

const extractSources = (response: any): ProviderSource[] => {
  const chunks = response?.candidates?.[0]?.groundingMetadata?.groundingChunks ?? [];
  const seen = new Set<string>();
  const sources: ProviderSource[] = [];
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

export const geminiProvider: AIProvider = {
  id: 'gemini',
  label: 'Gemini (Google)',
  isConfigured: () => Boolean(getApiKey()),

  generateJSON: async (prompt: string) => {
    const ai = getClient();

    let response;
    try {
      response = await ai.models.generateContent({
        model: getModel(),
        contents: prompt,
      });
    } catch (err) {
      throw new ProviderUnavailableError('gemini', `שגיאה בפנייה ל-Gemini: ${(err as Error).message}`);
    }

    const text = response.text;
    if (!text) {
      throw new ProviderUnavailableError('gemini', 'לא התקבלה תשובה מ-Gemini');
    }

    return { text, sources: extractSources(response) };
  },
};
