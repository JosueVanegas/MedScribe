import { createSummarizer, createTranscriber } from "@/core/ai/create-services";
import { describeAiError } from "@/core/ai/errors";
import type { AiSettings } from "@/core/ai/settings";
import type {
  ConsultationLanguage,
  ConsultationSummary,
} from "@/types/consultation";

/** What the UI needs from the AI layer. Swap the implementation for tests or mocks. */
export interface ConsultationApi {
  transcribe(audio: Blob, language: ConsultationLanguage): Promise<string>;
  summarize(
    transcript: string,
    language: ConsultationLanguage
  ): Promise<ConsultationSummary>;
}

/**
 * Talks straight from this device to the clinic's own AI provider with the
 * clinic's own key. No MedScribe server is involved.
 */
export function createDirectConsultationApi(settings: AiSettings): ConsultationApi {
  return {
    async transcribe(audio, language) {
      try {
        const data = new Uint8Array(await audio.arrayBuffer());
        return await createTranscriber(settings).transcribe(
          { data, mediaType: audio.type },
          language
        );
      } catch (err) {
        throw new Error(describeAiError(err, "No se pudo transcribir el audio."));
      }
    },

    async summarize(transcript, language) {
      try {
        return await createSummarizer(settings).summarize(transcript, language);
      } catch (err) {
        throw new Error(describeAiError(err, "No se pudo generar el resumen."));
      }
    },
  };
}
