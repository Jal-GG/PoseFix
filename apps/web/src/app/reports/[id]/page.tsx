import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { analyzeSession, generateExecutiveSummary, generateRecommendations } from '@/lib/analytics/session-analytics';

const MOCK_ATTEMPTS = Array.from({ length: 120 }, (_, i) => ({
  poseId: i < 40 ? 'yoga_warrior_ii' : i < 80 ? 'yoga_tree' : 'yoga_downward_dog',
  timestamp: new Date(2026, 5, 17, 10, 0, 0, i * 500),
  overallScore: Math.floor(Math.random() * 30 + 65),
  detectedMistakes: Math.random() > 0.7
    ? [{ code: 'knee_over_toe', severity: 'high' as const, count: 1 }]
    : [],
}));

export default async function ReportPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) redirect('/login');

  const { id } = await params;
  const analytics = analyzeSession(MOCK_ATTEMPTS);
  const summary = generateExecutiveSummary(analytics);
  const recommendations = generateRecommendations(analytics);

  return (
    <div className="mx-auto max-w-4xl p-6">
      <Link href="/sessions" className="mb-4 inline-block text-sm text-primary-400 hover:text-primary-300">
        &larr; Back
      </Link>

      <div className="mb-8 border-b border-gray-800 pb-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold">Session Report</h1>
            <p className="text-gray-400">June 17, 2026 · {session.user.name}</p>
          </div>
          <button className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium transition-colors hover:bg-primary-700">
            Download PDF
          </button>
        </div>
      </div>

      <div className="mb-8 rounded-xl border border-gray-800 bg-gray-900 p-6">
        <h2 className="mb-3 font-semibold">Executive Summary</h2>
        <p className="text-sm leading-relaxed text-gray-300">{summary}</p>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-4">
        {[
          { label: 'Average Score', value: analytics.sessionStats.averageScore.toString() },
          { label: 'Total Mistakes', value: analytics.sessionStats.totalMistakes.toString() },
          { label: 'Form Accuracy', value: `${analytics.sessionStats.mistakeFreePercentage}%` },
          { label: 'Peak Score', value: analytics.sessionStats.peakScore.toString() },
        ].map((stat) => (
          <div key={stat.label} className="rounded-lg border border-gray-800 bg-gray-900 p-4 text-center">
            <div className="text-lg font-bold">{stat.value}</div>
            <div className="text-xs text-gray-400">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="mb-8">
        <h2 className="mb-4 font-semibold">Pose-by-Pose Breakdown</h2>
        <div className="space-y-3">
          {analytics.perPoseStats.map((pose) => (
            <div key={pose.poseId} className="rounded-lg border border-gray-800 bg-gray-900 p-4">
              <div className="mb-2 flex items-center justify-between">
                <h3 className="font-medium">{pose.poseName}</h3>
                <span className={`font-bold ${pose.meanScore >= 85 ? 'text-green-400' : pose.meanScore >= 70 ? 'text-yellow-400' : 'text-red-400'}`}>
                  {pose.meanScore}
                </span>
              </div>
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span>Scores: {pose.meanScore} ± {pose.stdDevScore}</span>
                <span>Form: {pose.timeInFormPercentage}%</span>
                {pose.topMistakes.map((m) => (
                  <span key={m.code} className="text-red-400">{m.code.replace(/_/g, ' ')} ({m.count})</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {analytics.mistakeAnalysis.length > 0 && (
        <div className="mb-8 rounded-xl border border-gray-800 bg-gray-900 p-6">
          <h2 className="mb-4 font-semibold">Mistake Patterns</h2>
          <div className="space-y-4">
            {analytics.mistakeAnalysis.map((m) => (
              <div key={m.code}>
                <div className="mb-1 flex items-center justify-between">
                  <span className="font-medium capitalize">{m.code.replace(/_/g, ' ')}</span>
                  <span className="text-sm text-gray-400">{m.totalIntervals} occurrences</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-800">
                    <div
                      className="h-full rounded-full bg-red-500"
                      style={{ width: `${Math.min(100, m.percentageOfSession * 3)}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-500">{m.percentageOfSession}% of session</span>
                </div>
                {m.fatiguePattern && (
                  <p className="mt-1 text-xs text-orange-400">
                    Appears more in the second half — possible fatigue pattern
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="rounded-xl border border-primary-500/20 bg-primary-500/5 p-6">
        <h2 className="mb-3 font-semibold text-primary-400">Recommendations</h2>
        <ul className="space-y-2">
          {recommendations.map((rec, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
              <span className="mt-0.5 text-primary-400">{i + 1}.</span>
              {rec}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
