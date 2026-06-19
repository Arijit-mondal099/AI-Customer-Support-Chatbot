import { normalizeProvider, type Provider } from "./ai";

/**
 * Resolve the AI provider + API key for a bot. Each agent carries its own
 * provider and key — there is no account-level fallback.
 */
export const resolveProviderKey = (bot: {
  provider?: string;
  apiKeyOverride?: string;
}): { provider: Provider; apiKey: string } => ({
  provider: normalizeProvider(bot.provider),
  apiKey: bot.apiKeyOverride?.trim() || "",
});
