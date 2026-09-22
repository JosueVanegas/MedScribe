import type { Locale } from "@/i18n/locales";

/** Language spoken in the consultation (independent from the app's UI language). */
export type ConsultationLanguage = Locale;

export type ConsultationStatus =
  | "idle"
  | "recording"
  | "transcribing"
  | "summarizing"
  | "done";

/** Each field is "" when the consultation doesn't mention it. */
export type PatientInfo = {
  name: string;
  age: string;
  sex: string;
  /** Other identifying or background data: ID, occupation, allergies, history… */
  details: string;
};

export type ConsultationSummary = {
  /** Optional: consultations saved before it existed lack it. */
  patient?: PatientInfo;
  reasonForVisit: string;
  symptoms: string[];
  findings: string;
  diagnosis: string;
  treatmentPlan: string;
  medications: string[];
  followUp: string;
  additionalNotes: string;
  /** 1–2 sentence narrative. Optional: consultations saved before it existed lack it. */
  overview?: string;
};

export type TranscriptEntry = {
  id: string;
  text: string;
  timestamp: number;
  isFinal: boolean;
};

export type AudioSource = "recording" | "upload";

export type SavedConsultation = {
  id: string;
  date: string;
  transcript: string;
  summary: ConsultationSummary;
  source?: AudioSource;
  fileName?: string;
};
