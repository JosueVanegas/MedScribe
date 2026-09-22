export type ConsultationLanguage = "es" | "en";

export type ConsultationStatus =
  | "idle"
  | "recording"
  | "transcribing"
  | "summarizing"
  | "done";

export type ConsultationSummary = {
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
