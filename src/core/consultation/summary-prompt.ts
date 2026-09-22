import type { ConsultationLanguage } from "@/types/consultation";

const languageInstructions: Record<ConsultationLanguage, string> = {
  es: "Respond entirely in Spanish.",
  en: "Respond entirely in English.",
};

export function buildSummaryPrompt(
  transcript: string,
  language: ConsultationLanguage
): string {
  return `You are a medical assistant that summarizes clinical consultations. ${languageInstructions[language]}

Analyze the following transcript of a medical consultation and extract a structured summary. Be concise but thorough. If a section has no relevant information in the transcript, write "Not mentioned in the consultation" (or the equivalent in the response language). Leave "additionalNotes" as an empty string when there is nothing else worth noting.

TRANSCRIPT:
${transcript}`;
}
