import type { ConsultationSummary } from "@/types/consultation";
import { getOverview, getPatient } from "@/lib/format";
import { localeInfo } from "@/i18n/locales";
import { getLocale, getMessages } from "@/i18n/store";

const RULE = "═══════════════════════════════════════";

/** Headings follow the app's language; the content is in the consultation's. */
export function formatSummaryAsText(
  summary: ConsultationSummary,
  transcript: string,
  date = new Date()
): string {
  const t = getMessages().export;
  const patient = getPatient(summary);
  const patientRows: [string, string][] = patient
    ? [
        [t.name, patient.name],
        [t.age, patient.age],
        [t.sex, patient.sex],
        [t.otherData, patient.details],
      ]
    : [];

  return [
    RULE,
    `  ${t.heading}`,
    `  ${t.generatedBy}`,
    `  ${t.date}: ${date.toLocaleDateString(localeInfo[getLocale()].bcp47)}`,
    RULE,
    "",
    ...(patient
      ? [
          t.patient,
          ...patientRows
            .filter(([, value]) => value)
            .map(([label, value]) => `  ${label}: ${value}`),
          "",
        ]
      : []),
    t.overview,
    getOverview(summary),
    "",
    t.reason,
    summary.reasonForVisit,
    "",
    t.symptoms,
    ...summary.symptoms.map((s) => `  - ${s}`),
    "",
    t.findings,
    summary.findings,
    "",
    t.diagnosis,
    summary.diagnosis,
    "",
    t.treatment,
    summary.treatmentPlan,
    "",
    t.medications,
    ...summary.medications.map((m) => `  - ${m}`),
    "",
    t.followUp,
    summary.followUp,
    "",
    summary.additionalNotes ? `${t.notes}\n${summary.additionalNotes}\n` : "",
    RULE,
    t.transcript,
    RULE,
    transcript,
  ].join("\n");
}

/** The exportable text file for a consultation (saved via the platform's FileSaver). */
export function createSummaryFile(
  summary: ConsultationSummary,
  transcript: string,
  date = new Date()
): { file: Blob; fileName: string } {
  return {
    file: new Blob([formatSummaryAsText(summary, transcript, date)], {
      type: "text/plain;charset=utf-8",
    }),
    fileName: `${getMessages().export.fileName}-${date.toISOString().split("T")[0]}.txt`,
  };
}
