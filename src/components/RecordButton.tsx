"use client";

import { useEffect, useRef } from "react";
import { Mic, Square, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/i18n/useI18n";
import type { ConsultationStatus } from "@/types/consultation";

type RecordButtonProps = {
  status: ConsultationStatus;
  onStart: () => void;
  onStop: () => void;
  /** Live loudness (0..1) that makes the halo follow the voice. */
  readLevel?: () => number;
};

/** Soft red glow behind the button, scaled every frame by the input level. */
function VoiceHalo({ readLevel }: { readLevel: () => number }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let frame = 0;
    let smoothed = 0;
    const tick = () => {
      frame = requestAnimationFrame(tick);
      const level = readLevel();
      smoothed = level > smoothed ? level : smoothed * 0.85 + level * 0.15;
      if (ref.current) {
        ref.current.style.transform = `scale(${(1 + smoothed * 0.45).toFixed(3)})`;
        ref.current.style.opacity = (0.25 + smoothed * 0.6).toFixed(2);
      }
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [readLevel]);

  return (
    <span
      ref={ref}
      aria-hidden
      className="pointer-events-none absolute inset-0 rounded-full bg-red-400/40 blur-[2px]"
    />
  );
}

export function RecordButton({ status, onStart, onStop, readLevel }: RecordButtonProps) {
  const { t } = useI18n();
  const isRecording = status === "recording";
  const isBusy = status === "transcribing" || status === "summarizing";
  const visual = isBusy ? "busy" : isRecording ? "recording" : "idle";

  return (
    // Raised ring with a convex core, like a physical control.
    <div className="neu-raised relative flex size-[5.25rem] items-center justify-center rounded-full sm:size-24">
      {isRecording && (
        <>
          {readLevel && <VoiceHalo readLevel={readLevel} />}
          <span className="pointer-events-none absolute inset-0 animate-ripple rounded-full border-2 border-red-400/60" />
          <span className="pointer-events-none absolute inset-0 animate-ripple rounded-full border-2 border-red-400/60 [animation-delay:1.1s]" />
        </>
      )}
      <button
        onClick={isRecording ? onStop : onStart}
        disabled={isBusy}
        aria-label={isRecording ? t.control.stopRecording : t.control.startRecording}
        className={cn(
          "relative flex size-[3.75rem] items-center justify-center rounded-full sm:size-[4.25rem]",
          visual === "recording" && "neu-danger",
          visual === "busy" && "neu-inset text-primary-600",
          visual === "idle" && "neu-primary"
        )}
      >
        {/* Keyed so each state change re-plays the pop-in. */}
        <span key={visual} className="flex animate-enter-scale">
          {visual === "busy" ? (
            <Loader2 className="size-7 animate-spin" />
          ) : visual === "recording" ? (
            <Square className="size-6 fill-current" />
          ) : (
            <Mic className="size-7" />
          )}
        </span>
      </button>
    </div>
  );
}
