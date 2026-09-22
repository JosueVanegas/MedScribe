import type { CSSProperties } from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Index for the `stagger` utility (delays each list item's enter animation). */
export function staggerIndex(i: number): CSSProperties {
  return { "--i": i } as CSSProperties;
}
