/**
 * Multi-Provider AI Configuration
 * @internal
 */

export const AI_PROVIDERS = {
  openai: { model: "gpt-4o", key: process.env.OPENAI_API_KEY! },
  anthropic: { model: "claude-sonnet-4-20250514", key: process.env.ANTHROPIC_API_KEY! },
  groq: { model: "llama-4-maverick-17b-128e-instruct", key: process.env.GROQ_API_KEY! },
  gemini: { model: "gemini-2.5-pro", key: process.env.GEMINI_API_KEY! },
  deepseek: { model: "deepseek-v3", key: process.env.DEEPSEEK_API_KEY! },
  openrouter: { model: "openai/gpt-4o", key: process.env.OPENROUTER_API_KEY! },
} as const;

export type ProviderName = keyof typeof AI_PROVIDERS;
