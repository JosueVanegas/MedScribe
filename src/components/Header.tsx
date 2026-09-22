"use client";

import { Settings, Stethoscope } from "lucide-react";
import type { ConsultationStatus } from "@/types/consultation";
import { cn } from "@/lib/utils";

type HeaderProps = {
  status: ConsultationStatus;
  onOpenSettings: () => void;
};

const statusLabels: Record<ConsultationStatus, string> = {
  idle: "Listo",
  recording: "Grabando",
  transcribing: "Transcribiendo",
  summarizing: "Resumiendo",
  done: "Resumen listo",
};

export function Header({ status, onOpenSettings }: HeaderProps) {
  const isBusy = status === "transcribing" || status === "summarizing";

  return (
    <header className="animate-fade px-4 pt-4 pb-2">
      <div className="mx-auto flex max-w-2xl items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="neu-raised-sm flex size-10 shrink-0 items-center justify-center rounded-xl text-primary-600">
            <Stethoscope className="size-5" />
          </div>
          <div className="min-w-0">
            <h1 className="text-base font-semibold tracking-tight text-text">
              MedScribe
            </h1>
            <p className="hidden truncate text-[11px] text-text-muted min-[420px]:block">
              Resumen de consultas con IA
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <span
            role="status"
            className="neu-inset-sm flex items-center whitespace-nowrap gap-2 rounded-full px-3 py-1.5 text-[11px] font-medium text-text-muted"
          >
            <span
              className={cn(
                "size-2 rounded-full transition-colors duration-500",
                status === "recording" && "animate-pulse bg-red-500",
                isBusy && "animate-pulse bg-primary-500",
                status === "done" && "bg-primary-500",
                status === "idle" && "bg-slate-400"
              )}
            />
            <span key={status} className="animate-fade">
              {statusLabels[status]}
            </span>
          </span>
          <button
            onClick={onOpenSettings}
            disabled={status !== "idle" && status !== "done"}
            aria-label="Configuración de IA"
            title="Configuración de IA"
            className="neu-button flex size-10 items-center justify-center rounded-full text-text-muted hover:text-primary-700"
          >
            <Settings className="size-[18px]" />
          </button>
        </div>
      </div>
    </header>
  );
}
