"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  createStreamLevelReader,
  type StreamLevelReader,
} from "@/lib/audio/level";
import { toMicrophoneError } from "@/platform/web/web-audio-capture";
import { getMessages } from "@/i18n/store";

export type MicTestState =
  | { phase: "starting" }
  | { phase: "listening"; deviceLabel: string; heard: boolean }
  | { phase: "error"; message: string };

/** Level above which we're confident the mic is picking up a voice. */
const HEARD_THRESHOLD = 0.45;

/**
 * Opens the microphone only to measure it: nothing is recorded or sent.
 * getUserMedia works in the browser and inside the Tauri/Capacitor WebViews.
 */
export function useMicTest() {
  const [state, setState] = useState<MicTestState>({ phase: "starting" });
  const streamRef = useRef<MediaStream | null>(null);
  const meterRef = useRef<StreamLevelReader | null>(null);

  const stop = useCallback(() => {
    meterRef.current?.close();
    meterRef.current = null;
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  }, []);

  const start = useCallback(async () => {
    stop();
    setState({ phase: "starting" });
    if (!window.isSecureContext || !navigator.mediaDevices?.getUserMedia) {
      setState({
        phase: "error",
        message: getMessages().micTest.insecure,
      });
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true },
      });
      streamRef.current = stream;
      meterRef.current = createStreamLevelReader(stream);
      setState({
        phase: "listening",
        // Empty label = the UI shows the translated "default microphone".
        deviceLabel: stream.getAudioTracks()[0]?.label ?? "",
        heard: false,
      });
    } catch (err) {
      setState({ phase: "error", message: toMicrophoneError(err).message });
    }
  }, [stop]);

  /** Polled by the level meter; also flags the first clearly-heard sound. */
  const readLevel = useCallback(() => {
    const level = meterRef.current?.read() ?? 0;
    if (level >= HEARD_THRESHOLD) {
      setState((prev) =>
        prev.phase === "listening" && !prev.heard ? { ...prev, heard: true } : prev
      );
    }
    return level;
  }, []);

  useEffect(() => {
    // Mic access must follow a user tap, which opening the test just was.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void start();
    return stop;
  }, [start, stop]);

  return { state, readLevel, retry: start };
}
