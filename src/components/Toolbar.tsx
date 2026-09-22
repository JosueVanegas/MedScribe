"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";
import { Clock, Download, FileText, Mic } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ConsultationLanguage } from "@/types/consultation";

export type ViewTab = "transcript" | "summary" | "history";

type ToolbarProps = {
  activeTab: ViewTab;
  onTabChange: (tab: ViewTab) => void;
  hasSummary: boolean;
  hasHistory: boolean;
  language: ConsultationLanguage;
  onToggleLanguage: () => void;
  onExport: () => void;
  locked: boolean;
};

function TabButton({
  tab,
  active,
  disabled,
  onClick,
  icon,
  children,
}: {
  tab: ViewTab;
  active: boolean;
  disabled?: boolean;
  onClick: () => void;
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <button
      role="tab"
      data-tab={tab}
      aria-selected={active}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "relative z-10 flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors duration-300",
        active ? "text-primary-700" : "text-text-muted hover:text-text",
        disabled && "cursor-not-allowed opacity-40"
      )}
    >
      <span className="hidden sm:inline">{icon}</span>
      {children}
    </button>
  );
}

const iconButton =
  "neu-button flex h-9 min-w-9 items-center justify-center gap-1 rounded-full px-2.5 text-xs font-semibold text-text-muted hover:text-primary-700";

/**
 * Moves the raised "pill" under the active tab. Writes styles directly to the
 * DOM (no React state) so the slide is a single compositor transition.
 */
function useTabIndicator(activeTab: ViewTab, tabCountKey: unknown) {
  const listRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const list = listRef.current;
    const indicator = indicatorRef.current;
    if (!list || !indicator) return;

    const place = () => {
      const tab = list.querySelector<HTMLElement>(`[data-tab="${activeTab}"]`);
      if (!tab) return;
      indicator.style.width = `${tab.offsetWidth}px`;
      indicator.style.transform = `translateX(${tab.offsetLeft}px)`;
      // Enable the transition only after the first placement (no slide-in from 0).
      requestAnimationFrame(() => (indicator.dataset.ready = "true"));
    };

    place();
    const observer = new ResizeObserver(place);
    observer.observe(list);
    return () => observer.disconnect();
  }, [activeTab, tabCountKey]);

  return { listRef, indicatorRef };
}

export function Toolbar({
  activeTab,
  onTabChange,
  hasSummary,
  hasHistory,
  language,
  onToggleLanguage,
  onExport,
  locked,
}: ToolbarProps) {
  const { listRef, indicatorRef } = useTabIndicator(activeTab, hasHistory);

  return (
    <div className="animate-enter px-4 py-2">
      <div className="mx-auto flex max-w-2xl items-center justify-between gap-2">
        <div
          ref={listRef}
          role="tablist"
          className="neu-inset relative flex gap-1 rounded-full p-1"
        >
          <span
            ref={indicatorRef}
            aria-hidden
            className="neu-raised-sm absolute top-1 bottom-1 left-0 rounded-full data-[ready=true]:transition-[transform,width] data-[ready=true]:duration-500 data-[ready=true]:ease-[var(--ease-out-soft)]"
          />
          <TabButton
            tab="transcript"
            active={activeTab === "transcript"}
            onClick={() => onTabChange("transcript")}
            icon={<Mic className="size-3.5" />}
          >
            Transcripción
          </TabButton>
          <TabButton
            tab="summary"
            active={activeTab === "summary"}
            disabled={!hasSummary}
            onClick={() => onTabChange("summary")}
            icon={<FileText className="size-3.5" />}
          >
            Resumen
          </TabButton>
          {hasHistory && (
            <TabButton
              tab="history"
              active={activeTab === "history"}
              onClick={() => onTabChange("history")}
              icon={<Clock className="size-3.5" />}
            >
              Historial
            </TabButton>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={onToggleLanguage}
            disabled={locked}
            className={iconButton}
            title="Idioma de la consulta"
            aria-label={`Idioma: ${language === "es" ? "español" : "inglés"}`}
          >
            <span key={language} className="animate-enter-scale">
              {language.toUpperCase()}
            </span>
          </button>
          {hasSummary && (
            <button
              onClick={onExport}
              className={cn(iconButton, "animate-enter-scale")}
              title="Exportar resumen"
              aria-label="Exportar resumen"
            >
              <Download className="size-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
