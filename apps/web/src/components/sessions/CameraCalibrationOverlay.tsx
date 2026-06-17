'use client';

import { useEffect } from 'react';
import { useCameraCalibration } from '@/lib/camera-calibration';
import type { PoseLandmarkerResult } from '@mediapipe/tasks-vision';
import type { LandmarkData } from '@posefix/shared/types';

export function CameraCalibrationOverlay({
  landmarkerResult,
  onComplete,
}: {
  landmarkerResult: PoseLandmarkerResult | null;
  onComplete: (passed: boolean) => void;
}) {
  const { calibrating, result, startCalibration, collectFrame } = useCameraCalibration();

  useEffect(() => {
    if (!calibrating && !result) {
      startCalibration();
    }
  }, [calibrating, result, startCalibration]);

  useEffect(() => {
    if (!landmarkerResult?.landmarks?.length || !calibrating) return;
    const landmarks = landmarkerResult.landmarks[0];
    const data: Record<number, { x: number; y: number; z: number }> = {};
    for (let i = 0; i < landmarks.length; i++) {
      data[i] = { x: landmarks[i].x, y: landmarks[i].y, z: landmarks[i].z };
    }
    collectFrame(data);
  }, [landmarkerResult, calibrating, collectFrame]);

  useEffect(() => {
    if (result) {
      onComplete(result.passed);
    }
  }, [result, onComplete]);

  if (result) {
    return (
      <div className="absolute inset-0 z-40 flex items-center justify-center bg-gray-950/80 backdrop-blur-sm">
        <div className="max-w-sm rounded-xl border border-gray-800 bg-gray-900 p-6 text-center">
          <div className="mb-3 text-4xl">{result.passed ? '✅' : '⚠️'}</div>
          <h3 className="mb-2 text-lg font-bold">
            {result.passed ? 'Camera Position Looks Good!' : 'Adjust Your Camera'}
          </h3>
          {result.adjustments.length > 0 && (
            <ul className="mb-4 space-y-2 text-left text-sm text-gray-400">
              {result.adjustments.map((adj, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-yellow-400">•</span>
                  {adj}
                </li>
              ))}
            </ul>
          )}
          <button
            onClick={() => {
              if (result.passed) onComplete(true);
              else startCalibration();
            }}
            className="rounded-lg bg-primary-600 px-6 py-2 text-sm font-medium transition-colors hover:bg-primary-700"
          >
            {result.passed ? 'Continue' : 'Try Again'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center bg-gray-950/80 backdrop-blur-sm">
      <div className="text-center">
        <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-primary-500 border-t-transparent" />
        <p className="text-gray-400">Analyzing camera position...</p>
        <p className="mt-1 text-xs text-gray-600">Raise your arms slowly for 3 seconds</p>
      </div>
    </div>
  );
}
