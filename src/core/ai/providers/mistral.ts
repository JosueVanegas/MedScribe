import { createMistral } from "@ai-sdk/mistral";
import type { ProviderDefinition } from "./types";
import { verifyWithRequest } from "./verify";

/** European provider (Paris), relevant for clinics bound by the GDPR. */
export const mistralProvider: ProviderDefinition = {
  id: "mistral",
  name: "Mistral AI",
  apiKeyUrl: "https://console.mistral.ai/api-keys",
  apiKeyPlaceholder: "Tu API key de Mistral",
  apiOrigin: "https://api.mistral.ai",

  summaryModels: [
    { id: "mistral-medium-latest", label: "Mistral Medium", tag: "recommended" },
    { id: "mistral-small-latest", label: "Mistral Small", tag: "budget" },
    { id: "mistral-large-latest", label: "Mistral Large", tag: "accurate" },
  ],
  transcriptionModels: [
    { id: "voxtral-mini-latest", label: "Voxtral Mini Transcribe" },
  ],

  createLanguageModel: (apiKey, modelId) => createMistral({ apiKey })(modelId),

  createTranscriptionModel: (apiKey, modelId) =>
    createMistral({ apiKey }).transcription(modelId),

  transcriptionOptions: (language) => ({ mistral: { language } }),

  verifyApiKey: (apiKey) =>
    verifyWithRequest("Mistral AI", "https://api.mistral.ai/v1/models", {
      Authorization: `Bearer ${apiKey}`,
    }),
};
