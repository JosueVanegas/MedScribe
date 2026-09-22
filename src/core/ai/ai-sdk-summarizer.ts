import { generateText, Output, type LanguageModel } from "ai";
import type { ConsultationSummarizer } from "@/core/consultation/ports";
import { consultationSummarySchema } from "@/core/consultation/summary-schema";
import { buildSummaryPrompt } from "@/core/consultation/summary-prompt";
import type {
  ConsultationLanguage,
  ConsultationSummary,
} from "@/types/consultation";

/** Works with any AI SDK language model (Gemini, GPT, Claude, ...). */
export class AiSdkConsultationSummarizer implements ConsultationSummarizer {
  private readonly model: LanguageModel;

  constructor(model: LanguageModel) {
    this.model = model;
  }

  async summarize(
    transcript: string,
    language: ConsultationLanguage
  ): Promise<ConsultationSummary> {
    const { output } = await generateText({
      model: this.model,
      output: Output.object({ schema: consultationSummarySchema }),
      prompt: buildSummaryPrompt(transcript, language),
    });
    return output;
  }
}
