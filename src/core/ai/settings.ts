import { getProvider, providers, transcriptionProviders } from "./providers";

export type ModelChoice = {
  provider: string;
  model: string;
};

/** Chosen by each clinic and stored only on its own device. */
export type AiSettings = {
  transcription: ModelChoice;
  summary: ModelChoice;
  apiKeys: Record<string, string>;
};

export const defaultAiSettings: AiSettings = {
  transcription: { provider: "google", model: "gemini-3.5-transcribe" },
  summary: { provider: "google", model: "gemini-3.6-flash" },
  apiKeys: {},
};

/** Providers whose key is needed with the current choices. */
export function requiredProviders(settings: AiSettings): string[] {
  return [...new Set([settings.transcription.provider, settings.summary.provider])];
}

export function isConfigured(settings: AiSettings): boolean {
  return requiredProviders(settings).every(
    (id) => !!settings.apiKeys[id]?.trim()
  );
}

function sanitizeChoice(
  value: unknown,
  fallback: ModelChoice,
  allowed: { id: string }[]
): ModelChoice {
  const choice = value as Partial<ModelChoice> | undefined;
  if (
    typeof choice?.provider === "string" &&
    typeof choice.model === "string" &&
    choice.model.trim() &&
    allowed.some((p) => p.id === choice.provider)
  ) {
    return { provider: choice.provider, model: choice.model.trim() };
  }
  return fallback;
}

/** Accepts anything read from storage and returns valid settings. */
export function sanitizeAiSettings(raw: unknown): AiSettings {
  const value = (raw ?? {}) as Partial<AiSettings>;
  const apiKeys: Record<string, string> = {};
  for (const [id, key] of Object.entries(value.apiKeys ?? {})) {
    if (typeof key === "string" && key.trim()) apiKeys[id] = key.trim();
  }
  return {
    transcription: sanitizeChoice(
      value.transcription,
      defaultAiSettings.transcription,
      transcriptionProviders
    ),
    summary: sanitizeChoice(value.summary, defaultAiSettings.summary, providers),
    apiKeys,
  };
}

export function describeChoice(choice: ModelChoice): string {
  const provider = getProvider(choice.provider);
  const known = [...provider.summaryModels, ...provider.transcriptionModels].find(
    (m) => m.id === choice.model
  );
  return `${provider.name} · ${known?.label.replace(/ \(.*\)$/, "") ?? choice.model}`;
}
