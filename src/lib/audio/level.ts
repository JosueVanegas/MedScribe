/**
 * Input loudness for the level meter, normalised to 0..1 on a decibel scale
 * (a linear scale makes normal speech look almost silent).
 */

const FLOOR_DB = -55;
const RANGE_DB = 50;

export function decibelsToLevel(db: number): number {
  if (!Number.isFinite(db)) return 0;
  return Math.min(1, Math.max(0, (db - FLOOR_DB) / RANGE_DB));
}

/** `ratio` is amplitude relative to full scale (0..1). */
export function amplitudeToLevel(ratio: number): number {
  return ratio > 0 ? decibelsToLevel(20 * Math.log10(ratio)) : 0;
}

export type StreamLevelReader = {
  read(): number;
  close(): void;
};

const NO_READER: StreamLevelReader = { read: () => 0, close: () => {} };

/**
 * One AudioContext for the whole app, kept alive between recordings.
 * Browsers only allow a handful per page and closing one doesn't always free
 * its slot right away, so creating a new context per recording eventually
 * yields a dead (permanently suspended) one — the mic test would then show a
 * flat line after a couple of recordings.
 */
let shared: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  const AudioCtx =
    window.AudioContext ??
    (window as unknown as { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext;
  if (!AudioCtx) return null;
  if (!shared || shared.state === "closed") {
    try {
      shared = new AudioCtx();
    } catch {
      return null;
    }
  }
  return shared;
}

/** Reads the loudness of a live MediaStream without recording it. */
export function createStreamLevelReader(stream: MediaStream): StreamLevelReader {
  const context = getAudioContext();
  if (!context) return NO_READER;

  // Suspended when created outside a user gesture, or after the OS took the
  // audio focus away (a phone call, another app recording).
  const wake = () => {
    if (context.state === "suspended") void context.resume().catch(() => {});
  };
  wake();

  const analyser = context.createAnalyser();
  analyser.fftSize = 1024;
  const source = context.createMediaStreamSource(stream);
  source.connect(analyser);
  const samples = new Float32Array(analyser.fftSize);
  let closed = false;

  return {
    read() {
      if (closed) return 0;
      wake();
      analyser.getFloatTimeDomainData(samples);
      let sum = 0;
      for (const s of samples) sum += s * s;
      return amplitudeToLevel(Math.sqrt(sum / samples.length));
    },
    close() {
      if (closed) return;
      closed = true;
      // Only this stream's nodes: the shared context stays available.
      source.disconnect();
      analyser.disconnect();
    },
  };
}
