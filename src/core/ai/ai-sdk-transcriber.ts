import { transcribe, type TranscriptionModel } from "ai";
import type { AudioInput, AudioTranscriber } from "@/core/consultation/ports";
import type { ConsultationLanguage } from "@/types/consultation";
import type { ProviderOptions } from "./providers/types";

type ProviderOptionsFactory = (
  language: ConsultationLanguage
) => ProviderOptions;

/** Works with any AI SDK transcription model (Gemini, Whisper, ...). */
export class AiSdkAudioTranscriber implements AudioTranscriber {
  private readonly model: TranscriptionModel;
  private readonly providerOptions?: ProviderOptionsFactory;

  constructor(
    model: TranscriptionModel,
    providerOptions?: ProviderOptionsFactory
  ) {
    this.model = model;
    this.providerOptions = providerOptions;
  }

  async transcribe(
    audio: AudioInput,
    language: ConsultationLanguage
  ): Promise<string> {
    const result = await transcribe({
      model: this.model,
      audio: audio.data,
      providerOptions: this.providerOptions?.(language),
    });
    return result.text.trim();
  }
}
