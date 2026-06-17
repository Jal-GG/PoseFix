'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ScoreBadge } from '@/components/ui/index';

export default function SessionSummaryPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const totalTime = searchParams.get('time') || '15:32';
  const avgScore = parseInt(searchParams.get('score') || '82');
  const bestScore = parseInt(searchParams.get('best') || '94');
  const mistakes = parseInt(searchParams.get('mistakes') || '3');
  const poses = parseInt(searchParams.get('poses') || '6');

  const perPoseScores = [
    { name: 'Mountain Pose', score: 90 },
    { name: 'Warrior I', score: 85 },
    { name: 'Warrior II', score: 78 },
    { name: 'Tree Pose', score: 72 },
    { name: 'Downward Dog', score: 88 },
    { name: 'Child\'s Pose', score: 92 },
  ];

  return (
    <div className="mx-auto max-w-lg p-6">
      <div className="mb-8 text-center">
        <div className="mb-2 text-4xl">🎉</div>
        <h1 className="mb-1 text-2xl font-bold">Session Complete!</h1>
        <p className="text-gray-400">Great work — here is how you did</p>
      </div>

      <div className="mb-6 grid grid-cols-3 gap-3">
        <div className="rounded-xl border border-gray-800 bg-gray-900 p-3 text-center">
          <div className="text-lg font-medium text-gray-400">Time</div>
          <div className="text-xl font-bold">{totalTime}</div>
        </div>
        <div className="rounded-xl border border-gray-800 bg-gray-900 p-3 text-center">
          <div className="text-lg font-medium text-gray-400">Avg Score</div>
          <ScoreBadge score={avgScore} size="sm" />
        </div>
        <div className="rounded-xl border border-gray-800 bg-gray-900 p-3 text-center">
          <div className="text-lg font-medium text-gray-400">Mistakes</div>
          <div className="text-xl font-bold text-orange-400">{mistakes}</div>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="mb-3 font-semibold">Pose Breakdown</h2>
        <div className="space-y-2">
          {perPoseScores.map((pose) => (
            <div
              key={pose.name}
              className="flex items-center justify-between rounded-lg border border-gray-800 bg-gray-900/50 px-4 py-2.5"
            >
              <span className="text-sm text-gray-300">{pose.name}</span>
              <ScoreBadge score={pose.score} size="sm" />
            </div>
          ))}
        </div>
      </div>

      <div className="mb-8 rounded-xl border border-gray-800 bg-gray-900 p-4">
        <h3 className="mb-2 font-semibold">💪 Personal Best</h3>
        <p className="text-sm text-gray-400">
          Your Mountain Pose score improved 15% over last session!
        </p>
      </div>

      <div className="flex gap-3">
        <Link
          href="/sessions"
          className="flex-1 rounded-lg border border-gray-700 py-3 text-center text-sm font-medium transition-colors hover:bg-gray-800"
        >
          Back to Sessions
        </Link>
        <button
          onClick={() => router.push(`/reports/session-${Date.now()}`)}
          className="flex-[2] rounded-lg bg-primary-600 py-3 text-sm font-medium transition-colors hover:bg-primary-700"
        >
          View Full Report
        </button>
      </div>
    </div>
  );
}
