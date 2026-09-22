"use client";

import { Download, RefreshCw, RotateCcw, Settings } from "lucide-react";
import { RecordButton } from "./RecordButton";
import { AudioUploadButton } from "./AudioUpload";
import type { ConsultationStatus } from "@/types/consultation";

type ControlBarProps = {
  status: ConsultationStatus;
  elapsedSeconds: number;
  error: string | null;
  canRetry: boolean;
  canReset: boolean;
  canDownloadAudio: boolean;
  onStart: () => void;
  onStop: () => void;
  onUpload: (file: File) => void;
  onRetry: () => void;
  onDownloadAudio: () => void;
  onReset: () => void;
  onOpenSettings: () => void;
};

function formatElapsed(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

const hints: Record<ConsultationStatus, string> = {
  idle: "Pulsa para grabar o sube un audio",
  recording: "Pulsa para detener y generar el resumen",
  transcribing: "Transcribiendo audio…",
  summarizing: "Generando resumen…",
  done: "Resumen generado",
};

const pillButton =
  "neu-button flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium text-text-muted hover:text-primary-700";

const roundButton =
  "neu-button flex size-12 items-center justify-center rounded-full text-text-muted hover:text-primary-700";

export function ControlBar({
  status,
  elapsedSeconds,
  error,
  canRetry,
  canReset,
  canDownloadAudio,
  onStart,
  onStop,
  onUpload,
  onRetry,
  onDownloadAudio,
  onReset,
  onOpenSettings,
}: ControlBarProps) {
  const canUpload = status === "idle" || status === "done";
  const isRecording = status === "recording";

  return (
    <div className="px-4 pt-3 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
      <div className="mx-auto flex max-w-2xl flex-col items-center gap-4">
        {error && (
          <p
            key={error}
            role="alert"
            className="neu-inset-sm max-w-md animate-shake rounded-2xl px-4 py-2.5 text-center text-xs leading-relaxed text-red-600"
          >
            {error}
          </p>
        )}

        {(canRetry || canDownloadAudio) && (
          <div className="flex animate-enter flex-wrap items-center justify-center gap-3">
            {canRetry && (
              <button onClick={onRetry} className={pillButton}>
                <RefreshCw className="size-3.5" />
                Reintentar
              </button>
            )}
            {canDownloadAudio && (
              <button onClick={onDownloadAudio} className={pillButton}>
                <Download className="size-3.5" />
                Guardar audio
              </button>
            )}
            <button onClick={onOpenSettings} className={pillButton}>
              <Settings className="size-3.5" />
              Configuración
            </button>
          </div>
        )}

        {/* Fixed side slots keep the record button centred in every state. */}
        <div className="grid grid-cols-[3rem_auto_3rem] items-center gap-8">
          <div>
            {canReset && (
              <div className="animate-enter-scale">
                <button
                  onClick={onReset}
                  className={roundButton}
                  title="Nueva consulta"
                  aria-label="Nueva consulta"
                >
                  <RotateCcw className="size-[18px]" />
                </button>
              </div>
            )}
          </div>
          <RecordButton status={status} onStart={onStart} onStop={onStop} />
          <div>
            {canUpload && (
              <div className="animate-enter-scale">
                <AudioUploadButton onFile={onUpload} />
              </div>
            )}
          </div>
        </div>

        <p
          key={status}
          className="animate-fade text-[11px] font-medium text-text-muted"
        >
          {isRecording ? (
            <>
              <span className="mr-1.5 font-mono text-red-600 tabular-nums">
                {formatElapsed(elapsedSeconds)}
              </span>
              {hints.recording}
            </>
          ) : (
            hints[status]
          )}
        </p>
      </div>
    </div>
  );
}
