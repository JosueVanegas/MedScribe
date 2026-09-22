"use client";

import { useState, type TransitionEvent } from "react";
import { ChevronRight, Clock, Mic, Upload } from "lucide-react";
import { ConsultationDetail } from "./ConsultationDetail";
import type { SavedConsultation } from "@/types/consultation";
import { formatDateTime, getOverview } from "@/lib/format";
import { staggerIndex } from "@/lib/utils";

// Collapse transition is 320ms (see `collapsible` in globals.css).
const COLLAPSE_FALLBACK_MS = 450;

type HistoryProps = {
  consultations: SavedConsultation[];
  onDelete: (id: string) => void;
};

export function History({ consultations, onDelete }: HistoryProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  // Items collapse first, then are removed once the animation finishes.
  const [removing, setRemoving] = useState<ReadonlySet<string>>(new Set());

  const selected = consultations.find((c) => c.id === selectedId) ?? null;

  // Idempotent: runs on transitionend or, if rendering is paused, on a timer.
  const finishRemove = (id: string) => {
    onDelete(id);
    setRemoving((prev) => {
      if (!prev.has(id)) return prev;
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  const startRemove = (id: string) => {
    setRemoving((prev) => new Set(prev).add(id));
    setTimeout(() => finishRemove(id), COLLAPSE_FALLBACK_MS);
  };

  const handleCollapsed = (id: string) => (e: TransitionEvent) => {
    if (e.target !== e.currentTarget || e.propertyName !== "grid-template-rows") return;
    finishRemove(id);
  };

  if (consultations.length === 0) {
    return (
      <div className="neu-inset flex flex-1 animate-fade items-center justify-center rounded-3xl px-6 text-center">
        <div className="flex flex-col items-center gap-3">
          <Clock className="size-9 text-text-muted/50" />
          <p className="text-sm text-text-muted">
            No hay consultas guardadas todavía.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="-mx-4 flex min-h-0 flex-1 flex-col overflow-y-auto px-4 py-3">
      {consultations.map((c, i) => {
        const isUpload = c.source === "upload";
        return (
          <div
            key={c.id}
            className="collapsible"
            data-collapsed={removing.has(c.id)}
            onTransitionEnd={handleCollapsed(c.id)}
          >
            {/* Bottom padding lives inside so the gap collapses too. */}
            <div className="pb-4">
              <button
                onClick={() => setSelectedId(c.id)}
                style={staggerIndex(i)}
                className="neu-button stagger flex w-full animate-enter items-center gap-4 rounded-3xl p-4 text-left"
              >
                <span className="flex min-w-0 flex-1 flex-col gap-1.5">
                  <span className="line-clamp-1 text-sm font-semibold text-text">
                    {c.summary.diagnosis || c.summary.reasonForVisit}
                  </span>
                  <span className="line-clamp-2 text-xs leading-relaxed text-text-muted">
                    {getOverview(c.summary)}
                  </span>
                  <span className="flex min-w-0 items-center gap-1.5 text-[11px] text-text-muted/80">
                    <span className="shrink-0">{formatDateTime(c.date)}</span>
                    <span>·</span>
                    {isUpload ? (
                      <Upload className="size-3 shrink-0" />
                    ) : (
                      <Mic className="size-3 shrink-0" />
                    )}
                    <span className="truncate">
                      {isUpload ? (c.fileName ?? "Audio subido") : "Grabada"}
                    </span>
                  </span>
                </span>
                <span className="neu-inset-sm flex size-8 shrink-0 items-center justify-center rounded-full text-text-muted">
                  <ChevronRight className="size-4" />
                </span>
              </button>
            </div>
          </div>
        );
      })}

      {selected && (
        <ConsultationDetail
          consultation={selected}
          onClose={() => setSelectedId(null)}
          onDelete={startRemove}
        />
      )}
    </div>
  );
}
