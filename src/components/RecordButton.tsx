"use client";

import { Mic, Square, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ConsultationStatus } from "@/types/consultation";

type RecordButtonProps = {
  status: ConsultationStatus;
  onStart: () => void;
  onStop: () => void;
};

export function RecordButton({ status, onStart, onStop }: RecordButtonProps) {
  const isRecording = status === "recording";
  const isBusy = status === "transcribing" || status === "summarizing";
  const visual = isBusy ? "busy" : isRecording ? "recording" : "idle";

  return (
    // Raised ring with a convex core, like a physical control.
    <div className="neu-raised relative flex size-24 items-center justify-center rounded-full">
      {isRecording && (
        <>
          <span className="pointer-events-none absolute inset-0 animate-ripple rounded-full border-2 border-red-400/60" />
          <span className="pointer-events-none absolute inset-0 animate-ripple rounded-full border-2 border-red-400/60 [animation-delay:1.1s]" />
        </>
      )}
      <button
        onClick={isRecording ? onStop : onStart}
        disabled={isBusy}
        aria-label={isRecording ? "Detener grabación" : "Comenzar grabación"}
        className={cn(
          "relative flex size-[4.25rem] items-center justify-center rounded-full",
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
