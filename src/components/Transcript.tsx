"use client";

import { useEffect, useRef, type ReactNode } from "react";
import type { TranscriptEntry } from "@/types/consultation";
import { cn, staggerIndex } from "@/lib/utils";

type TranscriptProps = {
  entries: TranscriptEntry[];
  interimText?: string;
  emptyMessage: string;
  /** Shown above the empty message (e.g. the live waveform while recording). */
  emptyVisual?: ReactNode;
};

function formatTime(timestamp: number): string {
  return new Date(timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

export function Transcript({
  entries,
  interimText = "",
  emptyMessage,
  emptyVisual,
}: TranscriptProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Instant, not smooth: live captions update several times per second and
    // a running smooth scroll competes with taps on slower phones.
    bottomRef.current?.scrollIntoView({ block: "end" });
  }, [entries, interimText]);

  const isEmpty = entries.length === 0 && !interimText;

  return (
    <div className="neu-inset flex min-h-0 flex-1 flex-col overflow-hidden rounded-3xl">
      {isEmpty ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-5 px-6 text-center">
          {emptyVisual}
          <p
            key={emptyMessage}
            className="max-w-sm animate-fade text-sm leading-relaxed text-text-muted"
          >
            {emptyMessage}
          </p>
        </div>
      ) : (
        <div className="flex flex-1 flex-col gap-3 overflow-y-auto overscroll-contain px-4 py-4 sm:px-5 sm:py-5">
          {entries.map((entry, i) => (
            // Live captions fade in as they arrive; a finished transcript
            // cascades in paragraph by paragraph.
            <div
              key={entry.id}
              style={entry.timestamp > 0 ? undefined : staggerIndex(i)}
              className={cn(
                "flex gap-3",
                entry.timestamp > 0 ? "animate-fade" : "stagger animate-enter"
              )}
            >
              {entry.timestamp > 0 && (
                <span className="shrink-0 pt-0.5 font-mono text-[10px] text-text-muted tabular-nums">
                  {formatTime(entry.timestamp)}
                </span>
              )}
              <p className="min-w-0 text-sm leading-relaxed break-words whitespace-pre-wrap text-text">
                {entry.text}
              </p>
            </div>
          ))}
          {interimText && (
            <div className="flex gap-3">
              <span className="shrink-0 pt-0.5 text-[10px] text-text-muted">···</span>
              <p className="text-sm leading-relaxed text-text-muted italic">
                {interimText}
              </p>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      )}
    </div>
  );
}
