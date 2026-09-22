"use client";

import { useState } from "react";
import { ChevronDown, Download, Mic, Trash2, Upload } from "lucide-react";
import { Sheet, type CloseSheet } from "./ui/Sheet";
import { SummarySections } from "./Summary";
import { createSummaryFile } from "@/lib/export/summary-export";
import { usePlatform } from "@/platform/PlatformProvider";
import { formatDateTime } from "@/lib/format";
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
          "neu-button mr-auto flex items-center gap-2 rounded-full px-4 py-2.5 text-xs font-medium",
          confirming ? "text-red-600" : "text-text-muted hover:text-red-600"
        )}
      >
        <Trash2 className="size-3.5" />
        <span key={String(confirming)} className="animate-fade">
          {confirming ? "¿Eliminar? Pulsa otra vez" : "Eliminar"}
        </span>
      </button>
      <button
        onClick={exportConsultation}
        className="neu-primary flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-semibold"
      >
        <Download className="size-3.5" />
        Exportar
      </button>
    </>
  );
}

export function ConsultationDetail({
  consultation,
  onClose,
  onDelete,
}: ConsultationDetailProps) {
  const { summary, transcript } = consultation;
  const isUpload = consultation.source === "upload";

  return (
    <Sheet
      title={summary.diagnosis || summary.reasonForVisit}
      subtitle={
        <span className="flex flex-wrap items-center gap-1.5">
          {formatDateTime(consultation.date)}
          <span>·</span>
          {isUpload ? (
            <Upload className="size-3 shrink-0" />
          ) : (
            <Mic className="size-3 shrink-0" />
          )}
          <span className="truncate">
            {isUpload ? (consultation.fileName ?? "Audio subido") : "Grabada en la app"}
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
          Transcripción completa
          <ChevronDown className="size-4 text-text-muted transition-transform duration-300 group-open:rotate-180" />
        </summary>
        <div className="neu-inset mt-4 animate-enter rounded-3xl px-5 py-4 text-sm leading-relaxed whitespace-pre-wrap text-text">
          {transcript}
        </div>
      </details>
    </Sheet>
  );
}
