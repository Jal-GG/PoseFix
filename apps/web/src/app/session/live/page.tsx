'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { PoseLandmarker, FilesetResolver } from '@mediapipe/tasks-vision';
import type { PoseLandmarkerResult } from '@mediapipe/tasks-vision';
import type { LandmarkData, PoseSnapshotPayload } from '@posefix/shared/types';
import { LANDMARK_INDICES } from '@posefix/shared/constants';

type ConnectionState = 'loading-model' | 'loading-camera' | 'ready' | 'error';

const POSE_CONNECTIONS: Array<[number, number]> = [
  [LANDMARK_INDICES.LEFT_EAR, LANDMARK_INDICES.LEFT_SHOULDER],
  [LANDMARK_INDICES.RIGHT_EAR, LANDMARK_INDICES.RIGHT_SHOULDER],
  [LANDMARK_INDICES.LEFT_SHOULDER, LANDMARK_INDICES.RIGHT_SHOULDER],
  [LANDMARK_INDICES.LEFT_SHOULDER, LANDMARK_INDICES.LEFT_ELBOW],
  [LANDMARK_INDICES.RIGHT_SHOULDER, LANDMARK_INDICES.RIGHT_ELBOW],
  [LANDMARK_INDICES.LEFT_ELBOW, LANDMARK_INDICES.LEFT_WRIST],
  [LANDMARK_INDICES.RIGHT_ELBOW, LANDMARK_INDICES.RIGHT_WRIST],
  [LANDMARK_INDICES.LEFT_SHOULDER, LANDMARK_INDICES.LEFT_HIP],
  [LANDMARK_INDICES.RIGHT_SHOULDER, LANDMARK_INDICES.RIGHT_HIP],
  [LANDMARK_INDICES.LEFT_HIP, LANDMARK_INDICES.RIGHT_HIP],
  [LANDMARK_INDICES.LEFT_HIP, LANDMARK_INDICES.LEFT_KNEE],
  [LANDMARK_INDICES.RIGHT_HIP, LANDMARK_INDICES.RIGHT_KNEE],
  [LANDMARK_INDICES.LEFT_KNEE, LANDMARK_INDICES.LEFT_ANKLE],
  [LANDMARK_INDICES.RIGHT_KNEE, LANDMARK_INDICES.RIGHT_ANKLE],
];

export default function LiveSessionPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const socketRef = useRef<Socket | null>(null);
  const poseLandmarkerRef = useRef<PoseLandmarker | null>(null);
  const animFrameRef = useRef<number>(0);
  const streamRef = useRef<MediaStream | null>(null);
  const lastSentRef = useRef<number>(0);

  const [state, setState] = useState<ConnectionState>('loading-model');
  const [score, setScore] = useState(0);
  const [currentPose] = useState('Free Practice');
  const [mistake, setMistake] = useState<string | null>(null);
  const [audioMuted, setAudioMuted] = useState(false);

  useEffect(() => {
    socketRef.current = io(process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3000', {
      transports: ['websocket'],
      reconnection: true,
      reconnectionDelay: 1000,
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  const drawSkeleton = useCallback((result: PoseLandmarkerResult) => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video || !result.landmarks || result.landmarks.length === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const landmarks = result.landmarks[0];

    ctx.strokeStyle = '#22c55e';
    ctx.lineWidth = 3;

    for (const [i, j] of POSE_CONNECTIONS) {
      const p1 = landmarks[i];
      const p2 = landmarks[j];
      if (!p1 || !p2) continue;
      ctx.beginPath();
      ctx.moveTo(p1.x * canvas.width, p1.y * canvas.height);
      ctx.lineTo(p2.x * canvas.width, p2.y * canvas.height);
      ctx.stroke();
    }

    for (const lm of landmarks) {
      if ((lm as any).visibility !== undefined && (lm as any).visibility < 0.5) continue;
      ctx.beginPath();
      ctx.arc(lm.x * canvas.width, lm.y * canvas.height, 4, 0, 2 * Math.PI);
      ctx.fillStyle = '#3b82f6';
      ctx.fill();
    }
  }, []);

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setState('ready');
      animFrameRef.current = requestAnimationFrame(function detect() {
        if (!videoRef.current || !poseLandmarkerRef.current) {
          animFrameRef.current = requestAnimationFrame(detect);
          return;
        }
        const now = performance.now();
        poseLandmarkerRef.current.detectForVideo(videoRef.current, now, (result) => {
          drawSkeleton(result);
          const nowMs = Date.now();
          if (nowMs - lastSentRef.current > 500) {
            lastSentRef.current = nowMs;
            sendPoseData(result);
          }
        });
        animFrameRef.current = requestAnimationFrame(detect);
      });
    } catch (e) {
      console.error('Camera access denied:', e);
      setState('error');
    }
  }, [drawSkeleton]);

  function sendPoseData(result: PoseLandmarkerResult) {
    if (!socketRef.current?.connected || !result.landmarks || result.landmarks.length === 0) return;

    const landmarks = result.landmarks[0];
    const landmarkData: LandmarkData = {};
    for (let i = 0; i < landmarks.length; i++) {
      const lm = landmarks[i];
      landmarkData[i] = { x: lm.x, y: lm.y, z: lm.z, visibility: (lm as any).visibility ?? 1.0 };
    }

    const snapshot: PoseSnapshotPayload = {
      currentPoseId: 'free_practice',
      overallScore: 0,
      jointScores: {},
      mistakes: [],
      phase: 'hold',
      confidence: 1.0,
      bestLandmarkFrame: landmarkData,
    };

    socketRef.current.emit('pose_snapshot', {
      type: 'pose_snapshot',
      sessionId: crypto.randomUUID(),
      timestamp: Date.now(),
      payload: snapshot,
    });
  }

  const initialize = useCallback(async () => {
    try {
      const vision = await FilesetResolver.forVisionTasks(
        'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm',
      );
      const landmarker = await PoseLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath:
            'https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/latest/pose_landmarker_lite.task',
          delegate: 'GPU',
        },
        runningMode: 'VIDEO',
        numPoses: 1,
        minPoseDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5,
      });
      poseLandmarkerRef.current = landmarker;
      setState('loading-camera');
    } catch (e) {
      console.error('Failed to load pose landmarker:', e);
      setState('error');
    }
  }, []);

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (state === 'loading-camera') {
      startCamera();
    }
    return () => {
      cancelAnimationFrame(animFrameRef.current);
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, [state, startCamera]);

  return (
    <div className="relative h-screen w-full overflow-hidden bg-black">
      <video ref={videoRef} className="absolute inset-0 h-full w-full object-cover" playsInline muted />

      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full object-cover" />

      {state !== 'ready' && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-950/80">
          <div className="text-center">
            {state === 'loading-model' && (
              <>
                <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-primary-500 border-t-transparent" />
                <p className="text-gray-400">Preparing pose analysis...</p>
              </>
            )}
            {state === 'loading-camera' && (
              <>
                <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-primary-500 border-t-transparent" />
                <p className="text-gray-400">Accessing camera...</p>
              </>
            )}
            {state === 'error' && (
              <div>
                <p className="mb-2 text-red-400">Failed to initialize</p>
                <p className="text-sm text-gray-400">
                  Please ensure camera access is granted and try again
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {state === 'ready' && (
        <>
          <div className="absolute left-4 right-4 top-4 flex items-start justify-between">
            <div className="rounded-lg bg-gray-900/80 px-3 py-1.5 text-sm backdrop-blur-sm">
              {currentPose}
            </div>
            <div className="rounded-lg bg-gray-900/80 px-4 py-2 text-center backdrop-blur-sm">
              <div className="text-2xl font-bold text-green-400">{score}</div>
              <div className="text-xs text-gray-400">Score</div>
            </div>
          </div>

          {mistake && (
            <div className="absolute bottom-24 left-4 right-4">
              <div className="rounded-lg bg-red-500/20 px-4 py-3 text-sm text-red-300 backdrop-blur-sm">
                {mistake}
              </div>
            </div>
          )}

          <div className="absolute bottom-6 left-4 right-4 flex items-center justify-center gap-4">
            <button
              onClick={() => setAudioMuted(!audioMuted)}
              className="rounded-full bg-gray-900/80 p-3 backdrop-blur-sm transition-colors hover:bg-gray-800"
            >
              {audioMuted ? '🔇' : '🔊'}
            </button>
            <button className="rounded-full bg-red-500/80 px-6 py-2 text-sm font-medium backdrop-blur-sm transition-colors hover:bg-red-500">
              End Session
            </button>
          </div>
        </>
      )}
    </div>
  );
}
