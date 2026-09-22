"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePlatform } from "@/platform/PlatformProvider";
import type { AudioCapture } from "@/platform/types";

export function useAudioRecorder() {
  const { createAudioCapture, wakeLock } = usePlatform();
  const captureRef = useRef<AudioCapture | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const stopTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
  }, []);

  /** Throws MicrophoneError with a user-facing message when the mic is unavailable. */
  const start = useCallback(async () => {
    captureRef.current ??= createAudioCapture();
    await captureRef.current.start();
    // Keep the screen on: a locked phone can suspend the recording.
    void wakeLock.acquire();

    const startedAt = Date.now();
    setElapsedSeconds(0);
    stopTimer();
    timerRef.current = setInterval(() => {
      setElapsedSeconds(Math.floor((Date.now() - startedAt) / 1000));
    }, 500);
  }, [createAudioCapture, wakeLock, stopTimer]);

  const stop = useCallback(async () => {
    stopTimer();
    void wakeLock.release();
    return (await captureRef.current?.stop()) ?? null;
  }, [wakeLock, stopTimer]);

  /** Live loudness (0..1); cheap enough to call every animation frame. */
  const readLevel = useCallback(() => captureRef.current?.level() ?? 0, []);

  useEffect(
    () => () => {
      stopTimer();
      void wakeLock.release();
      captureRef.current?.release();
    },
    [wakeLock, stopTimer]
  );

  return { start, stop, elapsedSeconds, readLevel };
}
