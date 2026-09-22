import { createOpenAI } from "@ai-sdk/openai";
import type { ProviderDefinition } from "./types";
import { verifyWithRequest } from "./verify";

export const openaiProvider: ProviderDefinition = {
  id: "openai",
  name: "OpenAI",
  apiKeyUrl: "https://platform.openai.com/api-keys",
  apiKeyPlaceholder: "sk-...",
  apiOrigin: "https://api.openai.com",

  summaryModels: [
    { id: "gpt-5.4-mini", label: "GPT-5.4 mini (económico)" },
    { id: "gpt-5.5", label: "GPT-5.5" },
  ],
  transcriptionModels: [
    { id: "gpt-4o-transcribe", label: "GPT-4o Transcribe (recomendado)" },
    { id: "gpt-4o-mini-transcribe", label: "GPT-4o mini Transcribe (económico)" },
    { id: "whisper-1", label: "Whisper" },
  ],

  createLanguageModel: (apiKey, modelId) => createOpenAI({ apiKey })(modelId),

  createTranscriptionModel: (apiKey, modelId) =>
    createOpenAI({ apiKey }).transcription(modelId),

  transcriptionOptions: (language) => ({ openai: { language } }),

  verifyApiKey: (apiKey) =>
    verifyWithRequest("OpenAI", "https://api.openai.com/v1/models", {
      Authorization: `Bearer ${apiKey}`,
    }),
};
