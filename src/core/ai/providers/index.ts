import { anthropicProvider } from "./anthropic";
import { googleProvider } from "./google";
import { groqProvider } from "./groq";
import { mistralProvider } from "./mistral";
import { openaiProvider } from "./openai";
import type { ProviderDefinition } from "./types";
import { localeInfo, type Locale } from "@/i18n/locales";
import { getMessages } from "@/i18n/store";

export type { ModelOption, ModelTag, ProviderDefinition } from "./types";

/** Every vendor the clinic can pick in Settings. Order = display order. */
export const providers: ProviderDefinition[] = [
  googleProvider,
  openaiProvider,
  anthropicProvider,
  groqProvider,
  mistralProvider,
];

export function getProvider(id: string): ProviderDefinition {
  const provider = providers.find((p) => p.id === id);
  if (!provider) throw new Error(getMessages().errors.unknownProvider(id));
  return provider;
}

/** "Google Gemini, OpenAI, … o Mistral AI" — for UI copy. */
export function providerNamesList(locale: Locale): string {
  return new Intl.ListFormat(localeInfo[locale].bcp47, { type: "disjunction" }).format(
    providers.map((p) => p.name)
  );
}

export const transcriptionProviders = providers.filter(
  (p) => p.createTranscriptionModel && p.transcriptionModels.length > 0
);
