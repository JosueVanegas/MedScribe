"use client";

import { useEffect, useRef } from "react";
import type { TranscriptEntry } from "@/types/consultation";
import { cn, staggerIndex } from "@/lib/utils";

type TranscriptProps = {
  entries: TranscriptEntry[];
  interimText?: string;
  emptyMessage: string;
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
}: TranscriptProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [entries, interimText]);

  const isEmpty = entries.length === 0 && !interimText;

  return (
    <div className="neu-inset flex min-h-0 flex-1 flex-col overflow-hidden rounded-3xl">
      {isEmpty ? (
        <div className="flex flex-1 items-center justify-center px-6 text-center">
          <p
            key={emptyMessage}
            className="max-w-sm animate-fade text-sm leading-relaxed text-text-muted"
          >
            {emptyMessage}
          </p>
        </div>
      ) : (
        <div className="flex flex-1 flex-col gap-3 overflow-y-auto px-5 py-5">
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
              <p className="text-sm leading-relaxed whitespace-pre-wrap text-text">
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
