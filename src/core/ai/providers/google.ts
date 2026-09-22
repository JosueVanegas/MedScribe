import { createGoogleGenerativeAI } from "@ai-sdk/google";
import type { ProviderDefinition } from "./types";
import { verifyWithRequest } from "./verify";

const BASE_URL = "https://generativelanguage.googleapis.com/v1beta";

const bcp47 = { es: "es-ES", en: "en-US" } as const;

export const googleProvider: ProviderDefinition = {
  id: "google",
  name: "Google Gemini",
  apiKeyUrl: "https://aistudio.google.com/app/apikey",
  apiKeyPlaceholder: "AIza...",
  apiOrigin: "https://generativelanguage.googleapis.com",

  summaryModels: [
    { id: "gemini-3.6-flash", label: "Gemini 3.6 Flash (recomendado)" },
    { id: "gemini-3.5-flash-lite", label: "Gemini 3.5 Flash Lite (económico)" },
    { id: "gemini-pro-latest", label: "Gemini Pro (más preciso)" },
  ],
  transcriptionModels: [
    { id: "gemini-3.5-transcribe", label: "Gemini 3.5 Transcribe" },
  ],

  createLanguageModel: (apiKey, modelId) =>
    createGoogleGenerativeAI({ apiKey })(modelId),

  createTranscriptionModel: (apiKey, modelId) =>
    createGoogleGenerativeAI({ apiKey }).transcription(modelId),

  transcriptionOptions: (language) => ({
    google: { languageCodes: [bcp47[language]], mode: "SMART" },
  }),

  verifyApiKey: (apiKey) =>
    verifyWithRequest("Google Gemini", `${BASE_URL}/models?pageSize=1`, {
      "x-goog-api-key": apiKey,
    }),
};
