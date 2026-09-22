"use client";

import type { ReactNode } from "react";
import { Download, RefreshCw, RotateCcw, Settings } from "lucide-react";
import { RecordButton } from "./RecordButton";
import { LevelMeter } from "./LevelMeter";
import { cn } from "@/lib/utils";
import { AudioUploadButton } from "./AudioUpload";
import type { ConsultationStatus } from "@/types/consultation";
import { useI18n } from "@/i18n/useI18n";

type ControlBarProps = {
  status: ConsultationStatus;
  elapsedSeconds: number;
  /** Live microphone loudness (0..1) while recording. */
  readLevel: () => number;
  /** False when the transcript already shows the big waveform (draw it once). */
  showMeter?: boolean;
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
  footer?: ReactNode;
};

function formatElapsed(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

const pillButton =
  "neu-button flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium text-text-muted hover:text-primary-700";

const roundButton =
  "neu-button flex size-12 items-center justify-center rounded-full text-text-muted hover:text-primary-700";

export function ControlBar({
  status,
  elapsedSeconds,
  readLevel,
  showMeter = true,
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
  footer,
}: ControlBarProps) {
  const { t } = useI18n();
  const hints = t.control.hints;
  const canUpload = status === "idle" || status === "done";
  const isRecording = status === "recording";

  return (
    <div className="px-4 pt-2 pb-[max(1rem,env(safe-area-inset-bottom))] sm:pt-3 sm:pb-[max(1.25rem,env(safe-area-inset-bottom))]">
      <div className="mx-auto flex max-w-2xl flex-col items-center gap-3 sm:gap-4">
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
                {t.common.retry}
              </button>
            )}
            {canDownloadAudio && (
              <button onClick={onDownloadAudio} className={pillButton}>
                <Download className="size-3.5" />
                {t.control.saveAudio}
              </button>
            )}
            <button onClick={onOpenSettings} className={pillButton}>
              <Settings className="size-3.5" />
              {t.common.settings}
            </button>
          </div>
        )}

        {/* Fixed side slots keep the record button centred in every state. */}
        <div className="grid grid-cols-[3rem_auto_3rem] items-center gap-6 sm:gap-8">
          <div>
            {canReset && (
              <div className="animate-enter-scale">
                <button
                  onClick={onReset}
                  className={roundButton}
                  title={t.control.newConsultation}
                  aria-label={t.control.newConsultation}
                >
                  <RotateCcw className="size-[18px]" />
                </button>
              </div>
            )}
          </div>
          <RecordButton
            status={status}
            onStart={onStart}
            onStop={onStop}
            readLevel={readLevel}
          />
          <div>
            {canUpload && (
              <div className="animate-enter-scale">
                <AudioUploadButton onFile={onUpload} />
              </div>
            )}
          </div>
        </div>

        {isRecording ? (
          <div className="flex w-full max-w-xs animate-fade flex-col items-center gap-1.5">
            <div
              className={cn(
                "neu-inset-sm flex items-center gap-3 rounded-full py-1.5 pr-4 pl-3",
                showMeter ? "w-full" : "px-4"
              )}
            >
              <span className="flex shrink-0 items-center gap-1.5 font-mono text-xs font-semibold text-red-600 tabular-nums">
                <span className="size-2 animate-pulse rounded-full bg-red-500" />
                {formatElapsed(elapsedSeconds)}
              </span>
              {showMeter && (
                <LevelMeter read={readLevel} tone="danger" className="h-7 min-w-0 flex-1" />
              )}
            </div>
            <p className="text-[11px] font-medium text-text-muted">{hints.recording}</p>
          </div>
        ) : (
          <p
            key={status}
            className="animate-fade text-center text-[11px] font-medium text-text-muted"
          >
            {hints[status]}
          </p>
        )}

        {footer}
      </div>
    </div>
  );
}
