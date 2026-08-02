import { openaiProvider } from './providers/openaiProvider';
import { kimiProvider } from './providers/kimiProvider';
import { geminiProvider } from './providers/geminiProvider';
import { AIProvider, ProviderResult, ProviderUnavailableError } from './providers/types';

/**
 * סדר העדיפויות של ה-Model Router: Codex ראשון, אחריו Kimi K2, ולבסוף Gemini
 * כרשת ביטחון. אם ספק לא מוגדר (אין מפתח API), לא תקף, או שהמכסה שלו נגמרה -
 * הראוטר עובר אוטומטית לספק הבא ברשימה, כדי שהאפליקציה לא תהיה תלויה במודל יחיד.
 */
const PROVIDERS: AIProvider[] = [openaiProvider, kimiProvider, geminiProvider];

export class NoProviderAvailableError extends Error {
  constructor(public attempts: { providerId: string; reason: string }[]) {
    super('אף אחד מספקי ה-AI לא זמין כרגע (בדקו מפתחות API ומכסות שימוש)');
    this.name = 'NoProviderAvailableError';
  }
}

export const hasAnyProvider = (): boolean => PROVIDERS.some((p) => p.isConfigured());

export const listProviders = (): { id: string; label: string; configured: boolean }[] =>
  PROVIDERS.map((p) => ({ id: p.id, label: p.label, configured: p.isConfigured() }));

export interface RouterResult extends ProviderResult {
  providerId: string;
  providerLabel: string;
}

export const generateWithFallback = async (prompt: string): Promise<RouterResult> => {
  const attempts: { providerId: string; reason: string }[] = [];

  for (const provider of PROVIDERS) {
    if (!provider.isConfigured()) {
      attempts.push({ providerId: provider.id, reason: 'לא מוגדר (חסר מפתח API)' });
      continue;
    }

    try {
      const result = await provider.generateJSON(prompt);
      return { ...result, providerId: provider.id, providerLabel: provider.label };
    } catch (err) {
      const reason = err instanceof ProviderUnavailableError ? err.message : (err as Error).message;
      attempts.push({ providerId: provider.id, reason });
      console.warn(`[model-router] ${provider.label} נכשל, עובר לספק הבא: ${reason}`);
    }
  }

  throw new NoProviderAvailableError(attempts);
};
