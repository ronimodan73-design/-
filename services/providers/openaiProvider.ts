import { AIProvider, ProviderUnavailableError } from './types';

const DEFAULT_MODEL = 'gpt-5-codex';

const getApiKey = (): string | undefined => process.env.OPENAI_API_KEY || undefined;
const getModel = (): string => process.env.CODEX_MODEL || DEFAULT_MODEL;
const getBaseUrl = (): string => process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1';

export const openaiProvider: AIProvider = {
  id: 'codex',
  label: 'Codex (OpenAI)',
  isConfigured: () => Boolean(getApiKey()),

  generateJSON: async (prompt: string) => {
    const apiKey = getApiKey();
    if (!apiKey) {
      throw new ProviderUnavailableError('codex', 'OPENAI_API_KEY לא מוגדר');
    }

    let response: Response;
    try {
      response = await fetch(`${getBaseUrl()}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: getModel(),
          messages: [{ role: 'user', content: prompt }],
          response_format: { type: 'json_object' },
        }),
      });
    } catch (err) {
      throw new ProviderUnavailableError('codex', `שגיאת רשת בפנייה ל-Codex: ${(err as Error).message}`);
    }

    if (response.status === 401 || response.status === 403) {
      throw new ProviderUnavailableError('codex', 'מפתח ה-API ל-Codex לא תקף');
    }
    if (response.status === 429) {
      throw new ProviderUnavailableError('codex', 'המכסה של Codex הסתיימה (429)');
    }
    if (!response.ok) {
      throw new ProviderUnavailableError('codex', `Codex החזיר שגיאה: ${response.status}`);
    }

    const data = await response.json();
    const text = data?.choices?.[0]?.message?.content;
    if (!text) {
      throw new ProviderUnavailableError('codex', 'לא התקבלה תשובה מ-Codex');
    }
    return { text };
  },
};
