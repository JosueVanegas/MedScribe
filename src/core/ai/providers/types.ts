import type { LanguageModel, TranscriptionModel, transcribe } from "ai";
import type { ConsultationLanguage } from "@/types/consultation";

export type ProviderOptions = NonNullable<
  Parameters<typeof transcribe>[0]["providerOptions"]
>;

export type ModelOption = {
  id: string;
  label: string;
};

/**
 * Everything the app needs to know about an AI vendor. Adding a vendor means
 * writing one of these and listing it in `providers/index.ts` — nothing else.
 */
export interface ProviderDefinition {
  id: string;
  name: string;
  /** Where the clinic creates its API key. */
  apiKeyUrl: string;
  apiKeyPlaceholder: string;
  /** API origin the browser talks to (used for the Content-Security-Policy). */
  apiOrigin: string;

  summaryModels: ModelOption[];
  /** Empty when the vendor has no speech-to-text models. */
  transcriptionModels: ModelOption[];

  createLanguageModel(apiKey: string, modelId: string): LanguageModel;
  createTranscriptionModel?(apiKey: string, modelId: string): TranscriptionModel;
  transcriptionOptions?(language: ConsultationLanguage): ProviderOptions;

  /** Throws if the key is rejected by the vendor. */
  verifyApiKey(apiKey: string): Promise<void>;
}
