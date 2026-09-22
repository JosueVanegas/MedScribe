"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

type LevelMeterProps = {
  /** Current loudness 0..1, polled while mounted. */
  read: () => number;
  tone?: "primary" | "danger";
  /** Bar width + gap in CSS px. */
  barStep?: number;
  className?: string;
};

const SAMPLE_MS = 60;
const COLORS = { primary: "0 0 0", danger: "226 85 85" } as const;

/**
 * Scrolling waveform of the microphone input: newest bar on the right,
 * mirrored around the centre line. Draws straight to a canvas so the
 * animation never re-renders React.
 */
export function LevelMeter({
  read,
  tone = "primary",
  barStep = 5,
  className,
}: LevelMeterProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const readRef = useRef(read);

  useEffect(() => {
    readRef.current = read;
  }, [read]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    let levels: number[] = [];
    let smoothed = 0;
    let lastSample = 0;
    let frame = 0;
    const rgb = COLORS[tone];

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.round(canvas.clientWidth * dpr);
      canvas.height = Math.round(canvas.clientHeight * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);

    const draw = (now: number) => {
      frame = requestAnimationFrame(draw);
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      const capacity = Math.max(1, Math.floor(width / barStep));

      if (now - lastSample >= SAMPLE_MS) {
        lastSample = now;
        const level = readRef.current();
        // Fast attack, slow release: speech reads as a wave, not flicker.
        smoothed = level > smoothed ? level : smoothed * 0.7 + level * 0.3;
        levels.push(smoothed);
        if (levels.length > capacity) levels = levels.slice(-capacity);
      }

      ctx.clearRect(0, 0, width, height);
      const barWidth = Math.max(2, barStep * 0.55);
      const mid = height / 2;
      levels.forEach((level, i) => {
        const age = levels.length - 1 - i;
        const x = width - (age + 1) * barStep + (barStep - barWidth) / 2;
        const h = Math.max(barWidth, level * height * 0.95);
        // Older bars fade towards the left edge.
        const alpha = 0.25 + 0.75 * (1 - age / capacity);
        ctx.fillStyle = `rgb(${rgb} / ${alpha.toFixed(2)})`;
        ctx.beginPath();
        ctx.roundRect(x, mid - h / 2, barWidth, h, barWidth / 2);
        ctx.fill();
      });
    };
    frame = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [tone, barStep]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={cn("block h-10 w-full", className)}
    />
  );
}
