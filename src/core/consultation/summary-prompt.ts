import type { ConsultationLanguage } from "@/types/consultation";
import { localeInfo } from "@/i18n/locales";

export function buildSummaryPrompt(
  transcript: string,
  language: ConsultationLanguage
): string {
  return `You are a medical assistant that summarizes clinical consultations. Respond entirely in ${localeInfo[language].englishName}.

Analyze the following transcript of a medical consultation and extract a structured summary. Be concise but thorough. If a section has no relevant information in the transcript, write "Not mentioned in the consultation" (or the equivalent in the response language). Leave "additionalNotes" as an empty string when there is nothing else worth noting. For the "patient" fields, only use what is actually said about the patient (name, age, sex, other data); leave any field that isn't mentioned as an empty string, never a placeholder, and never invent or guess a name.

TRANSCRIPT:
${transcript}`;
}
