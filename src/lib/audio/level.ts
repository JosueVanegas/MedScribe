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

/** Reads the loudness of a live MediaStream without recording it. */
export function createStreamLevelReader(stream: MediaStream): StreamLevelReader {
  const AudioCtx =
    window.AudioContext ??
    (window as unknown as { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext;
  if (!AudioCtx) return { read: () => 0, close: () => {} };

  const context = new AudioCtx();
  // Created after an `await`, so some browsers start it suspended.
  void context.resume().catch(() => {});
  const analyser = context.createAnalyser();
  analyser.fftSize = 1024;
  context.createMediaStreamSource(stream).connect(analyser);
  const samples = new Float32Array(analyser.fftSize);

  return {
    read() {
      analyser.getFloatTimeDomainData(samples);
      let sum = 0;
      for (const s of samples) sum += s * s;
      return amplitudeToLevel(Math.sqrt(sum / samples.length));
    },
    close() {
      void context.close().catch(() => {});
    },
  };
}
