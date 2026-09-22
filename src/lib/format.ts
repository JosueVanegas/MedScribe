import type { ConsultationSummary } from "@/types/consultation";

export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleDateString("es-ES", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

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
