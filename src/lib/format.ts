import type { ConsultationSummary, PatientInfo } from "@/types/consultation";

/** Short narrative of a consultation, with a fallback for older records. */
export function getOverview(summary: ConsultationSummary): string {
  const overview = summary.overview?.trim();
  if (overview) return overview;
  return [summary.reasonForVisit, summary.diagnosis]
    .map((part) => part.trim().replace(/\.$/, ""))
    .filter(Boolean)
    .join(". ")
    .concat(".");
}

// Some models still write a placeholder instead of leaving the field empty
// (in any of the consultation languages).
const PLACEHOLDER_PATTERNS = [
  /n\/?a|-+|—/,
  /no (se )?(menciona|mencion|especific|indic)\w*.*/, // es
  /not (mentioned|specified|stated).*/, // en
  /não (mencionad|informad|especificad)\w*.*/, // pt
  /non (menzionat|specificat|indicat)\w*.*/, // it
  /non (mentionn|précis|indiqu)\w*.*/, // fr
  /desconhecid[oa]|desconocid[oa]|sconosciut[oa]|inconnue?|unknown/,
  /ningun[oa]|nenhum|nessun[oa]|aucune?|none/,
];
const PLACEHOLDER = new RegExp(
  `^(?:${PLACEHOLDER_PATTERNS.map((p) => `(?:${p.source})`).join("|")})[.]?$`,
  "i"
);

function clean(value: string | undefined): string {
  const v = value?.trim() ?? "";
  return PLACEHOLDER.test(v) ? "" : v;
}

/** The patient data that was actually mentioned, or null if none was. */
export function getPatient(summary: ConsultationSummary): PatientInfo | null {
  const p = summary.patient;
  if (!p) return null;
  const patient = {
    name: clean(p.name),
    age: clean(p.age),
    sex: clean(p.sex),
    details: clean(p.details),
  };
  return Object.values(patient).some(Boolean) ? patient : null;
}

/** "Ana López · 45 años · Femenino" — name, age and sex that are known. */
export function formatPatientLine(patient: PatientInfo): string {
  return [patient.name, patient.age, patient.sex].filter(Boolean).join(" · ");
}
