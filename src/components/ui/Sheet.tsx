"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

/** Closes with the exit animation, then runs `after` (e.g. delete, save). */
export type CloseSheet = (after?: () => void) => void;

// Exit animation is 260ms; if the platform pauses rendering (backgrounded
// tab, suspended WebView) animationend never fires, so finish anyway.
const EXIT_FALLBACK_MS = 400;

type SheetProps = {
  title: ReactNode;
  subtitle?: ReactNode;
  onClose: () => void;
  children: ReactNode;
  footer?: (close: CloseSheet) => ReactNode;
};

/**
 * Modal panel: bottom sheet on phones, centred card on larger screens.
 * Handles backdrop, Escape, click-outside, focus and enter/exit animations.
 */
export function Sheet({ title, subtitle, onClose, children, footer }: SheetProps) {
  // null while open; while closing, holds what to run after the exit animation.
  const [closing, setClosing] = useState<{ after?: () => void } | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const finishedRef = useRef(false);
  const titleId = useId();

  const close = useCallback<CloseSheet>((after) => setClosing({ after }), []);

  const finish = useCallback(() => {
    if (!closing || finishedRef.current) return;
    finishedRef.current = true;
    onClose();
    closing.after?.();
  }, [closing, onClose]);

  useEffect(() => {
    if (!closing) return;
    const timer = setTimeout(finish, EXIT_FALLBACK_MS);
    return () => clearTimeout(timer);
  }, [closing, finish]);

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    panelRef.current?.focus();
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      previouslyFocused?.focus?.();
    };
  }, [close]);

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-end justify-center bg-[rgb(236_240_244/0.7)] backdrop-blur-sm sm:items-center sm:p-6",
        closing ? "animate-fade-out" : "animate-fade"
      )}
      onClick={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className={cn(
          "neu-raised flex max-h-[92dvh] w-full max-w-2xl flex-col rounded-t-[2rem] outline-none sm:max-h-[88dvh] sm:rounded-[2rem]",
          closing ? "animate-sheet-out" : "animate-sheet-in"
        )}
        onAnimationEnd={(e) => {
          if (e.target === e.currentTarget) finish();
        }}
      >
        <div className="flex items-start justify-between gap-4 px-5 pt-5 pb-3 sm:px-6">
          <div className="min-w-0">
            <h2
              id={titleId}
              className="text-base font-semibold tracking-tight text-text"
            >
              {title}
            </h2>
            {subtitle && (
              <div className="mt-1 text-xs text-text-muted">{subtitle}</div>
            )}
          </div>
          <button
            onClick={() => close()}
            aria-label="Cerrar"
            className="neu-button flex size-10 shrink-0 items-center justify-center rounded-full text-text-muted hover:text-text"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4 sm:px-6">
          {children}
        </div>

        {footer && (
          <div className="flex flex-wrap items-center justify-end gap-3 px-5 pt-3 pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:px-6">
            {footer(close)}
          </div>
        )}
      </div>
    </div>
  );
}
