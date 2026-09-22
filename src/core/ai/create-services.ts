import type {
  AudioTranscriber,
  ConsultationSummarizer,
} from "@/core/consultation/ports";
import { AiSdkConsultationSummarizer } from "./ai-sdk-summarizer";
import { AiSdkAudioTranscriber } from "./ai-sdk-transcriber";
import { getProvider } from "./providers";
import type { AiSettings } from "./settings";

export class MissingApiKeyError extends Error {
  constructor(providerName: string) {
    super(`Falta la API key de ${providerName}. Añádela en Configuración.`);
  }
}

function requireKey(settings: AiSettings, providerId: string): string {
  const key = settings.apiKeys[providerId]?.trim();
  if (!key) throw new MissingApiKeyError(getProvider(providerId).name);
  return key;
}

/** Builds the services from the clinic's own settings (its vendor, its key). */
export function createTranscriber(settings: AiSettings): AudioTranscriber {
  const { provider: id, model } = settings.transcription;
  const provider = getProvider(id);
  if (!provider.createTranscriptionModel) {
    throw new Error(`${provider.name} no puede transcribir audio.`);
  }
  return new AiSdkAudioTranscriber(
    provider.createTranscriptionModel(requireKey(settings, id), model),
    provider.transcriptionOptions
  );
}

export function createSummarizer(settings: AiSettings): ConsultationSummarizer {
  const { provider: id, model } = settings.summary;
  return new AiSdkConsultationSummarizer(
    getProvider(id).createLanguageModel(requireKey(settings, id), model)
  );
}
