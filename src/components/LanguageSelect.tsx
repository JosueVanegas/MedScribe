"use client";

import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { createPortal } from "react-dom";
import { Check, ChevronDown } from "lucide-react";
import { Flag } from "./Flag";
import { localeInfo, locales, type Locale } from "@/i18n/locales";
import { cn } from "@/lib/utils";

type LanguageSelectProps = {
  value: Locale;
  onChange: (locale: Locale) => void;
  /** Accessible name, e.g. "Idioma de la consulta". */
  label: string;
  /** `pill` shows flag + language name; `compact` flag + code (toolbar). */
  variant?: "pill" | "compact";
  disabled?: boolean;
  className?: string;
};

type Position = { top: number; left: number; origin: "top" | "bottom" };

const MENU_WIDTH = 176;
const GAP = 8;

/** Where the menu fits: below the button if there's room, otherwise above. */
function placeMenu(button: HTMLElement, menuHeight: number): Position {
  const rect = button.getBoundingClientRect();
  const left = Math.min(
    Math.max(GAP, rect.right - MENU_WIDTH),
    window.innerWidth - MENU_WIDTH - GAP
  );
  const fitsBelow = rect.bottom + GAP + menuHeight <= window.innerHeight - GAP;
  return fitsBelow
    ? { top: rect.bottom + GAP, left, origin: "top" }
    : { top: Math.max(GAP, rect.top - GAP - menuHeight), left, origin: "bottom" };
}

/**
 * Language picker with flags. A custom listbox (not a native <select>) because
 * options can't contain images and emoji flags don't render on Windows.
 * Rendered in a portal so scrolling panels (Settings) never clip it.
 */
export function LanguageSelect({
  value,
  onChange,
  label,
  variant = "pill",
  disabled,
  className,
}: LanguageSelectProps) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [position, setPosition] = useState<Position | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLUListElement>(null);
  const listId = useId();

  const close = useCallback((restoreFocus = true) => {
    setOpen(false);
    setPosition(null);
    if (restoreFocus) buttonRef.current?.focus();
  }, []);

  const openMenu = () => {
    setActive(Math.max(0, locales.indexOf(value)));
    setOpen(true);
  };

  const choose = (locale: Locale) => {
    onChange(locale);
    close();
  };

  // Measure the rendered menu, then place it (before paint: no jump).
  useLayoutEffect(() => {
    if (!open || !buttonRef.current || !menuRef.current) return;
    setPosition(placeMenu(buttonRef.current, menuRef.current.offsetHeight));
    // Keyboard control moves into the menu (arrows, Enter, Escape).
    menuRef.current.focus({ preventScroll: true });
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Node;
      if (!menuRef.current?.contains(target) && !buttonRef.current?.contains(target)) {
        close(false);
      }
    };
    // Any scroll or resize would detach the menu from its button.
    const onMove = (e: Event) => {
      if (e.target instanceof Node && menuRef.current?.contains(e.target)) return;
      close(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("scroll", onMove, true);
    window.addEventListener("resize", onMove);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("scroll", onMove, true);
      window.removeEventListener("resize", onMove);
    };
  }, [open, close]);

  const onMenuKeyDown = (e: KeyboardEvent) => {
    const last = locales.length - 1;
    const moves: Record<string, () => number> = {
      ArrowDown: () => (active >= last ? 0 : active + 1),
      ArrowUp: () => (active <= 0 ? last : active - 1),
      Home: () => 0,
      End: () => last,
    };
    if (moves[e.key]) {
      e.preventDefault();
      setActive(moves[e.key]());
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      choose(locales[active]);
    } else if (e.key === "Escape") {
      // Don't let the Settings sheet close too.
      e.preventDefault();
      e.stopPropagation();
      close();
    } else if (e.key === "Tab") {
      close(false);
    }
  };

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        title={label}
        aria-label={`${label}: ${localeInfo[value].nativeName}`}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        disabled={disabled}
        onClick={() => (open ? close() : openMenu())}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown" || e.key === "ArrowUp") {
            e.preventDefault();
            openMenu();
          }
        }}
        className={cn(
          "neu-button flex items-center justify-center rounded-full text-xs font-medium text-text-muted hover:text-primary-700",
          variant === "pill" ? "gap-2 px-4 py-2" : "h-9 min-w-9 gap-1.5 px-2.5 font-semibold",
          className
        )}
      >
        <span key={value} className="flex animate-enter-scale items-center gap-2">
          <Flag locale={value} />
          {variant === "pill" ? localeInfo[value].nativeName : value.toUpperCase()}
        </span>
        {variant === "pill" && (
          <ChevronDown
            className={cn("size-3 opacity-60 transition-transform duration-300", open && "rotate-180")}
          />
        )}
      </button>

      {open &&
        createPortal(
          <ul
            ref={menuRef}
            id={listId}
            role="listbox"
            aria-label={label}
            aria-activedescendant={`${listId}-${locales[active]}`}
            tabIndex={-1}
            onKeyDown={onMenuKeyDown}
            style={{
              top: position?.top ?? 0,
              left: position?.left ?? 0,
              width: MENU_WIDTH,
              // Transparent until measured and placed (still focusable, unlike
              // visibility: hidden).
              opacity: position ? undefined : 0,
            }}
            className={cn(
              "neu-raised fixed z-[60] flex animate-enter-scale flex-col gap-0.5 rounded-2xl p-1.5 outline-none",
              position?.origin === "bottom" ? "origin-bottom-right" : "origin-top-right"
            )}
          >
            {locales.map((locale, i) => {
              const selected = locale === value;
              return (
                <li
                  key={locale}
                  id={`${listId}-${locale}`}
                  role="option"
                  aria-selected={selected}
                  onPointerEnter={() => setActive(i)}
                  onClick={() => choose(locale)}
                  className={cn(
                    "flex cursor-pointer items-center gap-2.5 rounded-xl px-3 py-2 text-sm transition-colors",
                    selected ? "font-semibold text-text" : "text-text-muted",
                    i === active && "neu-inset-sm text-text"
                  )}
                >
                  <Flag locale={locale} className="size-5" />
                  <span className="flex-1">{localeInfo[locale].nativeName}</span>
                  {selected && <Check className="size-4 text-primary-700" />}
                </li>
              );
            })}
          </ul>,
          document.body
        )}
    </>
  );
}
