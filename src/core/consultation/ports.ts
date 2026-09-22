import type {
  ConsultationLanguage,
  ConsultationSummary,
} from "@/types/consultation";

/**
 * Contracts the API routes depend on. Routes never know which AI vendor is
 * behind them — adapters in `src/server/ai` implement these interfaces.
 */

export type AudioInput = {
  data: Uint8Array;
  mediaType?: string;
};

export interface AudioTranscriber {
  transcribe(
    audio: AudioInput,
    language: ConsultationLanguage
  ): Promise<string>;
}

export interface ConsultationSummarizer {
  summarize(
    transcript: string,
    language: ConsultationLanguage
  ): Promise<ConsultationSummary>;
}
