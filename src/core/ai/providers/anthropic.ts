import { createAnthropic } from "@ai-sdk/anthropic";
import type { ProviderDefinition } from "./types";
import { verifyWithRequest } from "./verify";

// Anthropic requires an explicit opt-in for calls made from a browser.
const browserHeaders = { "anthropic-dangerous-direct-browser-access": "true" };

export const anthropicProvider: ProviderDefinition = {
  id: "anthropic",
  name: "Anthropic Claude",
  apiKeyUrl: "https://console.anthropic.com/settings/keys",
  apiKeyPlaceholder: "sk-ant-...",
  apiOrigin: "https://api.anthropic.com",

  summaryModels: [
    { id: "claude-sonnet-5", label: "Claude Sonnet 5", tag: "recommended" },
    { id: "claude-haiku-4-5", label: "Claude Haiku 4.5", tag: "budget" },
    { id: "claude-opus-5", label: "Claude Opus 5", tag: "accurate" },
  ],
  // Claude does not transcribe audio.
  transcriptionModels: [],

  createLanguageModel: (apiKey, modelId) =>
    createAnthropic({ apiKey, headers: browserHeaders })(modelId),

  verifyApiKey: (apiKey) =>
    verifyWithRequest("Anthropic", "https://api.anthropic.com/v1/models?limit=1", {
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      ...browserHeaders,
    }),
};
