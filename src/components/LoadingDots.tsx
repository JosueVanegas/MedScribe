"use client";

export function LoadingDots() {
  return (
    <div className="flex items-center gap-1.5">
      <div className="size-2 animate-wave rounded-full bg-primary-500" />
      <div className="size-2 animate-wave rounded-full bg-primary-500 [animation-delay:150ms]" />
      <div className="size-2 animate-wave rounded-full bg-primary-500 [animation-delay:300ms]" />
    </div>
  );
}
