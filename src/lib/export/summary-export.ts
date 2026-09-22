import type { ConsultationSummary } from "@/types/consultation";
import { getOverview } from "@/lib/format";

const RULE = "═══════════════════════════════════════";

export function formatSummaryAsText(
  summary: ConsultationSummary,
  transcript: string,
  date = new Date()
): string {
  return [
    RULE,
    "  RESUMEN DE CONSULTA MEDICA",
    "  Generado por MedScribe",
    `  Fecha: ${date.toLocaleDateString("es-ES")}`,
    RULE,
    "",
    "EN RESUMEN",
    getOverview(summary),
    "",
    "MOTIVO DE CONSULTA",
    summary.reasonForVisit,
    "",
    "SINTOMAS",
    ...summary.symptoms.map((s) => `  - ${s}`),
    "",
    "HALLAZGOS",
    summary.findings,
    "",
    "DIAGNOSTICO",
    summary.diagnosis,
    "",
    "PLAN DE TRATAMIENTO",
    summary.treatmentPlan,
    "",
    "MEDICACION",
    ...summary.medications.map((m) => `  - ${m}`),
    "",
    "SEGUIMIENTO",
    summary.followUp,
    "",
    summary.additionalNotes
      ? `NOTAS ADICIONALES\n${summary.additionalNotes}\n`
      : "",
    RULE,
    "TRANSCRIPCION COMPLETA",
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
    fileName: `consulta-${date.toISOString().split("T")[0]}.txt`,
  };
}
