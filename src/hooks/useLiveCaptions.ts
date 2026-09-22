"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  LiveCaptionSession,
  areLiveCaptionsSupported,
} from "@/lib/speech/live-captions";
import type { TranscriptEntry } from "@/types/consultation";
import { usePlatform } from "@/platform/PlatformProvider";

export function useLiveCaptions() {
  const { supportsLiveCaptions } = usePlatform();
  const sessionRef = useRef<LiveCaptionSession | null>(null);
  const counterRef = useRef(0);
  const [entries, setEntries] = useState<TranscriptEntry[]>([]);
  const [interimText, setInterimText] = useState("");
  const [isAvailable, setIsAvailable] = useState(true);

  const stop = useCallback(() => {
    sessionRef.current?.stop();
    sessionRef.current = null;
  }, []);

  const start = useCallback(
    (lang: string) => {
      stop();
      setEntries([]);
      setInterimText("");
      counterRef.current = 0;

      if (!supportsLiveCaptions || !areLiveCaptionsSupported()) {
        setIsAvailable(false);
        return;
      }
      setIsAvailable(true);

      const session = new LiveCaptionSession(lang, {
        onFinal: (text) => {
          const id = `caption-${counterRef.current++}`;
          setEntries((prev) => [
            ...prev,
            { id, text, timestamp: Date.now(), isFinal: true },
          ]);
        },
        onInterim: setInterimText,
        onUnavailable: () => setIsAvailable(false),
      });
      sessionRef.current = session;
      session.start();
    },
    [stop, supportsLiveCaptions]
  );

  useEffect(() => stop, [stop]);

  return { entries, interimText, isAvailable, start, stop };
}
