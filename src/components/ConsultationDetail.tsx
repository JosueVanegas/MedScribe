"use client";

import { useState } from "react";
import { ChevronDown, Download, Mic, Trash2, Upload, UserRound } from "lucide-react";
import { Sheet, type CloseSheet } from "./ui/Sheet";
import { SummarySections } from "./Summary";
import { createSummaryFile } from "@/lib/export/summary-export";
import { usePlatform } from "@/platform/PlatformProvider";
import { formatPatientLine, getPatient } from "@/lib/format";
import { useI18n } from "@/i18n/useI18n";
import { cn } from "@/lib/utils";
import type { SavedConsultation } from "@/types/consultation";

type ConsultationDetailProps = {
  consultation: SavedConsultation;
  onClose: () => void;
  onDelete: (id: string) => void;
};

function DetailActions({
  consultation,
  close,
  onDelete,
}: {
  consultation: SavedConsultation;
  close: CloseSheet;
  onDelete: (id: string) => void;
}) {
  const { files } = usePlatform();
  const { t } = useI18n();
  // Two-step delete: a stray tap never removes a clinical record.
  const [confirming, setConfirming] = useState(false);

  const exportConsultation = () => {
    const { file, fileName } = createSummaryFile(
      consultation.summary,
      consultation.transcript,
      new Date(consultation.date)
    );
    void files.save(file, fileName);
  };

  return (
    <>
      <button
        onClick={() =>
          confirming ? close(() => onDelete(consultation.id)) : setConfirming(true)
        }
        onBlur={() => setConfirming(false)}
        className={cn(
          "neu-button mr-auto flex items-center gap-2 rounded-full px-4 py-2.5 text-xs font-medium whitespace-nowrap",
          confirming ? "text-red-600" : "text-text-muted hover:text-red-600"
        )}
      >
        <Trash2 className="size-3.5" />
        <span key={String(confirming)} className="animate-fade">
          {confirming ? t.history.confirmDelete : t.common.delete}
        </span>
      </button>
      <button
        onClick={exportConsultation}
        className="neu-primary flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-semibold"
      >
        <Download className="size-3.5" />
        {t.common.export}
      </button>
    </>
  );
}

export function ConsultationDetail({
  consultation,
  onClose,
  onDelete,
}: ConsultationDetailProps) {
  const { t, formatDateTime } = useI18n();
  const { summary, transcript } = consultation;
  const isUpload = consultation.source === "upload";
  const patient = getPatient(summary);
  const patientLine = patient && formatPatientLine(patient);

  return (
    <Sheet
      title={summary.diagnosis || summary.reasonForVisit}
      subtitle={
        <span className="flex flex-col gap-1">
          {patientLine && (
            <span className="flex min-w-0 items-center gap-1.5 font-semibold text-primary-700">
              <UserRound className="size-3 shrink-0" />
              <span className="truncate">{patientLine}</span>
            </span>
          )}
          <span className="flex min-w-0 items-center gap-1.5">
            <span className="shrink-0">{formatDateTime(consultation.date)}</span>
            <span>·</span>
            {isUpload ? (
              <Upload className="size-3 shrink-0" />
            ) : (
              <Mic className="size-3 shrink-0" />
            )}
            <span className="truncate">
              {isUpload ? (consultation.fileName ?? t.history.uploaded) : t.history.recordedInApp}
            </span>
          </span>
        </span>
      }
      onClose={onClose}
      footer={(close) => (
        <DetailActions consultation={consultation} close={close} onDelete={onDelete} />
      )}
    >
      <SummarySections summary={summary} />

      <details className="group mt-5">
        <summary className="neu-button flex cursor-pointer list-none items-center justify-between rounded-2xl px-5 py-3.5 text-sm font-medium text-text [&::-webkit-details-marker]:hidden">
          {t.history.fullTranscript}
          <ChevronDown className="size-4 text-text-muted transition-transform duration-300 group-open:rotate-180" />
        </summary>
        <div className="neu-inset mt-4 animate-enter rounded-3xl px-5 py-4 text-sm leading-relaxed whitespace-pre-wrap text-text">
          {transcript}
        </div>
      </details>
    </Sheet>
  );
}
