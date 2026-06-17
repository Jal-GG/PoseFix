'use client';

import { useState, useRef, useCallback } from 'react';
import type { LandmarkData } from '@posefix/shared/types';
import { LANDMARK_INDICES } from '@posefix/shared/constants';

interface CalibrationResult {
  passed: boolean;
  issues: string[];
  adjustments: string[];
}

interface LandmarkPoint {
  x: number; y: number; z: number; visibility?: number;
}

const CALIBRATION_CHECKS = [
  {
    id: 'full_body_visible',
    check: (landmarks: Record<number, LandmarkPoint>) => {
      const required = [
        LANDMARK_INDICES.NOSE,
        LANDMARK_INDICES.LEFT_SHOULDER,
        LANDMARK_INDICES.RIGHT_SHOULDER,
        LANDMARK_INDICES.LEFT_HIP,
        LANDMARK_INDICES.RIGHT_HIP,
        LANDMARK_INDICES.LEFT_KNEE,
        LANDMARK_INDICES.RIGHT_KNEE,
        LANDMARK_INDICES.LEFT_ANKLE,
        LANDMARK_INDICES.RIGHT_ANKLE,
      ];
      const missing = required.filter((idx) => !landmarks[idx]);
      return {
        passed: missing.length === 0,
        message: missing.length > 0 ? 'Move back — your full body is not visible' : null,
      };
    },
  },
  {
    id: 'not_too_small',
    check: (landmarks: Record<number, LandmarkPoint>) => {
      const nose = landmarks[LANDMARK_INDICES.NOSE];
      const ankle = landmarks[LANDMARK_INDICES.LEFT_ANKLE] || landmarks[LANDMARK_INDICES.RIGHT_ANKLE];
      if (!nose || !ankle) return { passed: true, message: null };
      const height = Math.abs(nose.y - ankle.y);
      return {
        passed: height > 0.3,
        message: height <= 0.3 ? 'Move closer to the camera' : null,
      };
    },
  },
  {
    id: 'not_too_large',
    check: (landmarks: Record<number, LandmarkPoint>) => {
      const nose = landmarks[LANDMARK_INDICES.NOSE];
      const ankle = landmarks[LANDMARK_INDICES.LEFT_ANKLE] || landmarks[LANDMARK_INDICES.RIGHT_ANKLE];
      if (!nose || !ankle) return { passed: true, message: null };
      const height = Math.abs(nose.y - ankle.y);
      return {
        passed: height < 0.85,
        message: height >= 0.85 ? 'Move back — you are too close to the camera' : null,
      };
    },
  },
  {
    id: 'good_lighting',
    check: (landmarks: Record<number, LandmarkPoint>) => {
      const nose = landmarks[LANDMARK_INDICES.NOSE];
      if (!nose) return { passed: true, message: null };
      const vis = nose.visibility ?? 0;
      return {
        passed: vis > 0.7,
        message: vis <= 0.7 ? 'Improve lighting — your face is not clearly visible' : null,
      };
    },
  },
  {
    id: 'centered_in_frame',
    check: (landmarks: Record<number, LandmarkPoint>) => {
      const ls = landmarks[LANDMARK_INDICES.LEFT_SHOULDER];
      const rs = landmarks[LANDMARK_INDICES.RIGHT_SHOULDER];
      if (!ls || !rs) return { passed: true, message: null };
      const midX = (ls.x + rs.x) / 2;
      return {
        passed: midX > 0.2 && midX < 0.8,
        message: midX <= 0.2 ? 'Move right — you are too far left' :
                 midX >= 0.8 ? 'Move left — you are too far right' : null,
      };
    },
  },
];

export function useCameraCalibration() {
  const [calibrating, setCalibrating] = useState(false);
  const [result, setResult] = useState<CalibrationResult | null>(null);
  const framesRef = useRef<Array<Record<number, LandmarkPoint>>>([]);

  const collectFrame = useCallback((landmarks: Record<number, LandmarkPoint>) => {
    if (!calibrating) return;
    framesRef.current.push(landmarks);
    if (framesRef.current.length >= 30) {
      runCalibration();
    }
  }, [calibrating]);

  function runCalibration() {
    const frames = framesRef.current;
    if (frames.length === 0) return;

    const averaged: Record<number, LandmarkPoint> = {};
    const count: Record<number, number> = {};

    for (const frame of frames) {
      for (const [key, pt] of Object.entries(frame)) {
        const idx = parseInt(key);
        if (!averaged[idx]) {
          averaged[idx] = { x: 0, y: 0, z: 0 };
          count[idx] = 0;
        }
        averaged[idx].x += pt.x;
        averaged[idx].y += pt.y;
        averaged[idx].z += pt.z;
        count[idx]++;
      }
    }

    for (const idx of Object.keys(averaged)) {
      const i = parseInt(idx);
      averaged[i].x /= count[i];
      averaged[i].y /= count[i];
      averaged[i].z /= count[i];
    }

    const issues: string[] = [];
    const adjustments: string[] = [];

    for (const check of CALIBRATION_CHECKS) {
      const result = check.check(averaged);
      if (!result.passed && result.message) {
        issues.push(result.message);
        adjustments.push(result.message);
      }
    }

    setResult({
      passed: issues.length === 0,
      issues,
      adjustments,
    });
    setCalibrating(false);
    framesRef.current = [];
  }

  function startCalibration() {
    framesRef.current = [];
    setCalibrating(true);
    setResult(null);
  }

  return { calibrating, result, startCalibration, collectFrame };
}
