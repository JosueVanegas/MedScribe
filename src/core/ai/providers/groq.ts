import { createGroq } from "@ai-sdk/groq";
import type { ProviderDefinition } from "./types";
import { verifyWithRequest } from "./verify";
import type { ConsultationLanguage } from "@/types/consultation";

// Whisper uses the prompt as context: steering it toward clinical vocabulary
// improves drug names, dosages and anatomical terms.
const clinicalPrompt: Record<ConsultationLanguage, string> = {
  es: "Consulta médica entre doctor y paciente: síntomas, diagnóstico, medicamentos y dosis.",
  en: "Medical consultation between doctor and patient: symptoms, diagnosis, medications and dosages.",
  pt: "Consulta médica entre médico e paciente: sintomas, diagnóstico, medicamentos e doses.",
  it: "Visita medica tra medico e paziente: sintomi, diagnosi, farmaci e dosaggi.",
  fr: "Consultation médicale entre médecin et patient : symptômes, diagnostic, médicaments et posologies.",
};

export const groqProvider: ProviderDefinition = {
  id: "groq",
  name: "Groq",
  apiKeyUrl: "https://console.groq.com/keys",
  apiKeyPlaceholder: "gsk_...",
  apiOrigin: "https://api.groq.com",

  summaryModels: [
    { id: "openai/gpt-oss-120b", label: "GPT-OSS 120B", tag: "recommended" },
    { id: "llama-3.3-70b-versatile", label: "Llama 3.3 70B" },
  ],
  transcriptionModels: [
    { id: "whisper-large-v3-turbo", label: "Whisper Large v3 Turbo", tag: "fastBudget" },
    { id: "whisper-large-v3", label: "Whisper Large v3", tag: "accurate" },
  ],

  createLanguageModel: (apiKey, modelId) => createGroq({ apiKey })(modelId),

  createTranscriptionModel: (apiKey, modelId) =>
    createGroq({ apiKey }).transcription(modelId),

  transcriptionOptions: (language) => ({
    groq: { language, prompt: clinicalPrompt[language] },
  }),

  verifyApiKey: (apiKey) =>
    verifyWithRequest("Groq", "https://api.groq.com/openai/v1/models", {
      Authorization: `Bearer ${apiKey}`,
    }),
};
