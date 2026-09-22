import { createGoogleGenerativeAI } from "@ai-sdk/google";
import type { ProviderDefinition } from "./types";
import { verifyWithRequest } from "./verify";
import { localeInfo } from "@/i18n/locales";

const BASE_URL = "https://generativelanguage.googleapis.com/v1beta";

export const googleProvider: ProviderDefinition = {
  id: "google",
  name: "Google Gemini",
  apiKeyUrl: "https://aistudio.google.com/app/apikey",
  apiKeyPlaceholder: "AIza...",
  apiOrigin: "https://generativelanguage.googleapis.com",

  summaryModels: [
    { id: "gemini-3.6-flash", label: "Gemini 3.6 Flash", tag: "recommended" },
    { id: "gemini-3.5-flash-lite", label: "Gemini 3.5 Flash Lite", tag: "budget" },
    { id: "gemini-pro-latest", label: "Gemini Pro", tag: "accurate" },
  ],
  transcriptionModels: [
    { id: "gemini-3.5-transcribe", label: "Gemini 3.5 Transcribe" },
  ],

  createLanguageModel: (apiKey, modelId) =>
    createGoogleGenerativeAI({ apiKey })(modelId),

  createTranscriptionModel: (apiKey, modelId) =>
    createGoogleGenerativeAI({ apiKey }).transcription(modelId),

  transcriptionOptions: (language) => ({
    google: { languageCodes: [localeInfo[language].bcp47], mode: "SMART" },
  }),

  verifyApiKey: (apiKey) =>
    verifyWithRequest("Google Gemini", `${BASE_URL}/models?pageSize=1`, {
      "x-goog-api-key": apiKey,
    }),
};
