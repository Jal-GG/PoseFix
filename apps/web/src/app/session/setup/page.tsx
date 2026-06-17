'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

type SetupStep = 'welcome' | 'camera-guide' | 'audio-check' | 'ready';

const CAMERA_GUIDES = {
  yoga: {
    title: 'Camera Placement for Yoga',
    instructions: [
      'Place your phone at waist height, 6–8 feet away',
      'Ensure your full body is visible from head to toe',
      'Stand in the center of the frame with good lighting',
      'Avoid backlight — face your light source',
    ],
    icon: '🧘',
  },
  physiotherapy: {
    title: 'Camera Placement for Physiotherapy',
    instructions: [
      'For mat exercises: elevate the camera looking down at 45°',
      'For standing exercises: camera at waist height, 6–8 feet away',
      'Ensure the full movement range is visible',
      'Good lighting is essential for accurate tracking',
    ],
    icon: '🩺',
  },
  stretching: {
    title: 'Camera Placement for Stretching',
    instructions: [
      'Place your phone at waist height, 6–8 feet away',
      'You should be visible from head to toe',
      'Side-on view works best for most stretches',
      'Ensure no objects block your body from the camera',
    ],
    icon: '🤸',
  },
};

export default function SessionSetupPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const templateId = searchParams.get('template') || 'quick_start';

  const category = (searchParams.get('type') || 'yoga') as keyof typeof CAMERA_GUIDES;
  const guide = CAMERA_GUIDES[category] || CAMERA_GUIDES.yoga;

  const [step, setStep] = useState<SetupStep>('welcome');
  const [voiceCues, setVoiceCues] = useState(true);

  return (
    <div className="mx-auto flex min-h-screen max-w-lg flex-col p-6">
      {step === 'welcome' && (
        <div className="flex flex-1 flex-col justify-center">
          <div className="mb-8 text-center">
            <div className="mb-4 text-5xl">{guide.icon}</div>
            <h1 className="mb-2 text-2xl font-bold">{guide.title}</h1>
            <p className="text-gray-400">
              Let us set up your camera for the best pose tracking experience.
            </p>
          </div>

          <div className="mb-6 rounded-xl border border-gray-800 bg-gray-900 p-4">
            <div className="mb-2 flex items-center gap-2">
              <input
                type="checkbox"
                id="voiceCues"
                checked={voiceCues}
                onChange={(e) => setVoiceCues(e.target.checked)}
                className="h-4 w-4 rounded border-gray-700 bg-gray-800 text-primary-500"
              />
              <label htmlFor="voiceCues" className="text-sm text-gray-300">
                Enable voice cues
              </label>
            </div>
            <p className="ml-6 text-xs text-gray-500">
              Audio feedback for pose corrections during your session
            </p>
          </div>

          <button
            onClick={() => setStep('camera-guide')}
            className="w-full rounded-lg bg-primary-600 py-3 font-medium transition-colors hover:bg-primary-700"
          >
            Continue
          </button>
        </div>
      )}

      {step === 'camera-guide' && (
        <div className="flex flex-1 flex-col justify-center">
          <h2 className="mb-4 text-xl font-bold">Camera Guide</h2>

          <div className="mb-6 aspect-[3/4] rounded-xl border-2 border-dashed border-gray-700 bg-gray-900/50">
            <div className="flex h-full items-center justify-center">
              <div className="text-center">
                <div className="mb-2 text-4xl">📷</div>
                <p className="text-sm text-gray-500">Silhouette guide placeholder</p>
                <p className="text-xs text-gray-600">Shows optimal body position</p>
              </div>
            </div>
          </div>

          <ul className="mb-6 space-y-3">
            {guide.instructions.map((instruction, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-gray-300">
                <span className="mt-0.5 text-primary-400">{i + 1}.</span>
                {instruction}
              </li>
            ))}
          </ul>

          <div className="flex gap-3">
            <button
              onClick={() => setStep('welcome')}
              className="flex-1 rounded-lg border border-gray-700 py-3 text-sm font-medium transition-colors hover:bg-gray-800"
            >
              Back
            </button>
            <button
              onClick={() => setStep('ready')}
              className="flex-[2] rounded-lg bg-primary-600 py-3 text-sm font-medium transition-colors hover:bg-primary-700"
            >
              Camera Positioned
            </button>
          </div>
        </div>
      )}

      {step === 'ready' && (
        <div className="flex flex-1 flex-col justify-center text-center">
          <div className="mb-6 text-6xl">✅</div>
          <h2 className="mb-2 text-xl font-bold">Ready to Start!</h2>
          <p className="mb-8 text-gray-400">
            Your session will begin as soon as you grant camera access.
          </p>
          <Link
            href={`/session/live?template=${templateId}`}
            className="w-full rounded-lg bg-green-600 py-3 font-medium transition-colors hover:bg-green-700"
          >
            Start Session
          </Link>
        </div>
      )}
    </div>
  );
}
