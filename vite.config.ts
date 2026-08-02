import path from 'path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      define: {
        // Model Router: Codex (OpenAI) -> Kimi K2 (Moonshot) -> Gemini, בסדר הזה.
        // כל ספק פועל רק אם המפתח שלו מוגדר; אם ספק לא זמין/נגמרה המכסה שלו,
        // הראוטר עובר אוטומטית לספק הבא.
        'process.env.API_KEY': JSON.stringify(env.GEMINIAPIKEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINIAPIKEY),
        'process.env.GEMINI_MODEL': JSON.stringify(env.GEMINI_MODEL),
        'process.env.OPENAI_API_KEY': JSON.stringify(env.OPENAI_API_KEY),
        'process.env.OPENAI_BASE_URL': JSON.stringify(env.OPENAI_BASE_URL),
        'process.env.CODEX_MODEL': JSON.stringify(env.CODEX_MODEL),
        'process.env.MOONSHOT_API_KEY': JSON.stringify(env.MOONSHOT_API_KEY),
        'process.env.MOONSHOT_BASE_URL': JSON.stringify(env.MOONSHOT_BASE_URL),
        'process.env.KIMI_MODEL': JSON.stringify(env.KIMI_MODEL)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
