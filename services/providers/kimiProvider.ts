import { AIProvider, ProviderUnavailableError } from './types';

const DEFAULT_MODEL = 'kimi-k2-0711-preview';

const getApiKey = (): string | undefined => process.env.MOONSHOT_API_KEY || undefined;
const getModel = (): string => process.env.KIMI_MODEL || DEFAULT_MODEL;
const getBaseUrl = (): string => process.env.MOONSHOT_BASE_URL || 'https://api.moonshot.ai/v1';

export const kimiProvider: AIProvider = {
  id: 'kimi-k2',
  label: 'Kimi K2 (Moonshot)',
  isConfigured: () => Boolean(getApiKey()),

  generateJSON: async (prompt: string) => {
    const apiKey = getApiKey();
    if (!apiKey) {
      throw new ProviderUnavailableError('kimi-k2', 'MOONSHOT_API_KEY לא מוגדר');
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
          temperature: 0.6,
          response_format: { type: 'json_object' },
        }),
      });
    } catch (err) {
      throw new ProviderUnavailableError('kimi-k2', `שגיאת רשת בפנייה ל-Kimi K2: ${(err as Error).message}`);
    }

    if (response.status === 401 || response.status === 403) {
      throw new ProviderUnavailableError('kimi-k2', 'מפתח ה-API ל-Kimi K2 לא תקף');
    }
    if (response.status === 429) {
      throw new ProviderUnavailableError('kimi-k2', 'המכסה של Kimi K2 הסתיימה (429)');
    }
    if (!response.ok) {
      throw new ProviderUnavailableError('kimi-k2', `Kimi K2 החזיר שגיאה: ${response.status}`);
    }

    const data = await response.json();
    const text = data?.choices?.[0]?.message?.content;
    if (!text) {
      throw new ProviderUnavailableError('kimi-k2', 'לא התקבלה תשובה מ-Kimi K2');
    }
    return { text };
  },
};
