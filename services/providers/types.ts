export class ProviderUnavailableError extends Error {
  constructor(public providerId: string, message: string) {
    super(message);
    this.name = 'ProviderUnavailableError';
  }
}

export interface ProviderSource {
  title: string;
  uri: string;
}

export interface ProviderResult {
  text: string;
  sources?: ProviderSource[];
}

export interface AIProvider {
  id: string;
  label: string;
  isConfigured: () => boolean;
  generateJSON: (prompt: string) => Promise<ProviderResult>;
}
