'use client';

import { useRef, useCallback } from 'react';

interface AdaptiveFrameConfig {
  minFps: number;
  maxFps: number;
  targetLatencyMs: number;
  maxConsecutiveSlowFrames: number;
}

const DEFAULT_CONFIG: AdaptiveFrameConfig = {
  minFps: 8,
  maxFps: 30,
  targetLatencyMs: 50,
  maxConsecutiveSlowFrames: 5,
};

export function useAdaptiveFrameRate(config: Partial<AdaptiveFrameConfig> = {}) {
  const cfg = { ...DEFAULT_CONFIG, ...config };
  const stateRef = useRef({
    currentFps: cfg.maxFps,
    frameCount: 0,
    lastTimestamp: 0,
    consecutiveSlow: 0,
    measureStart: 0,
    measureFrames: 0,
  });

  const computeInterval = useCallback(() => Math.round(1000 / stateRef.current.currentFps), []);

  function recordFrameDuration(durationMs: number) {
    const s = stateRef.current;
    s.measureFrames++;

    if (durationMs > cfg.targetLatencyMs) {
      s.consecutiveSlow++;
      if (s.consecutiveSlow >= cfg.maxConsecutiveSlowFrames) {
        s.currentFps = Math.max(cfg.minFps, s.currentFps - 5);
        s.consecutiveSlow = 0;
      }
    } else {
      s.consecutiveSlow = Math.max(0, s.consecutiveSlow - 1);
      if (s.consecutiveSlow === 0 && s.measureFrames >= 30) {
        s.currentFps = Math.min(cfg.maxFps, s.currentFps + 2);
        s.measureFrames = 0;
      }
    }
  }

  function getFps() { return stateRef.current.currentFps; }
  function getInterval() { return computeInterval(); }

  return { recordFrameDuration, getFps, getInterval };
}
