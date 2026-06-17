import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';

const TREND_DATA = [
  { date: 'May 20', score: 62, pose: 'Warrior II' },
  { date: 'May 24', score: 68, pose: 'Warrior II' },
  { date: 'May 28', score: 71, pose: 'Warrior II' },
  { date: 'Jun 1', score: 75, pose: 'Warrior II' },
  { date: 'Jun 5', score: 78, pose: 'Warrior II' },
  { date: 'Jun 10', score: 80, pose: 'Warrior II' },
  { date: 'Jun 14', score: 84, pose: 'Warrior II' },
];

const COMMON_MISTAKES = [
  { mistake: 'Knee Over Toe', count: 14, severity: 'high' as const },
  { mistake: 'Hip Open', count: 9, severity: 'medium' as const },
  { mistake: 'Front Arm Drooping', count: 7, severity: 'low' as const },
  { mistake: 'Rounded Back', count: 5, severity: 'medium' as const },
];

export default async function ClientProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user || (session.user.role !== 'trainer' && session.user.role !== 'admin')) {
    redirect('/sessions');
  }

  const { id } = await params;

  return (
    <div>
      <Link href="/dashboard" className="mb-4 inline-block text-sm text-primary-400 hover:text-primary-300">
        &larr; Back to Dashboard
      </Link>

      <div className="mb-8">
        <h1 className="text-2xl font-bold">Client Profile</h1>
        <p className="text-gray-400">ID: {id}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-xl border border-gray-800 bg-gray-900 p-5">
          <h2 className="mb-4 font-semibold">Health Profile</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Age</span>
              <span>34</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Fitness Level</span>
              <span>Intermediate</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Primary Goal</span>
              <span>Strength & Flexibility</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Injuries</span>
              <span className="text-orange-400">Knee (R)</span>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-800 bg-gray-900 p-5 lg:col-span-2">
          <h2 className="mb-4 font-semibold">Score Trend — Warrior II</h2>
          <div className="relative h-40">
            <svg className="h-full w-full" viewBox="0 0 320 160" preserveAspectRatio="none">
              <polyline
                points={TREND_DATA.map((d, i) => `${(i / (TREND_DATA.length - 1)) * 300},${160 - (d.score - 50) * 3.5}`).join(' ')}
                fill="none"
                stroke="#3b82f6"
                strokeWidth="2"
              />
              {TREND_DATA.map((d, i) => (
                <circle
                  key={d.date}
                  cx={(i / (TREND_DATA.length - 1)) * 300}
                  cy={160 - (d.score - 50) * 3.5}
                  r="3"
                  fill="#3b82f6"
                />
              ))}
            </svg>
          </div>
          <div className="mt-2 flex justify-between text-xs text-gray-500">
            {TREND_DATA.filter((_, i) => i % 2 === 0).map((d) => (
              <span key={d.date}>{d.date}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-gray-800 bg-gray-900 p-5">
          <h2 className="mb-4 font-semibold">Session History</h2>
          <div className="space-y-2">
            {[
              { date: 'Jun 17', score: 84, duration: '22 min', template: 'Warrior Flow' },
              { date: 'Jun 14', score: 80, duration: '20 min', template: 'Warrior Flow' },
              { date: 'Jun 10', score: 78, duration: '18 min', template: 'Warrior Flow' },
              { date: 'Jun 5', score: 72, duration: '15 min', template: 'Morning Yoga' },
            ].map((s) => (
              <div key={s.date} className="flex items-center justify-between rounded-lg bg-gray-800/50 px-3 py-2">
                <div>
                  <div className="text-sm font-medium">{s.template}</div>
                  <div className="text-xs text-gray-500">{s.date} · {s.duration}</div>
                </div>
                <span className={`font-bold ${s.score >= 85 ? 'text-green-400' : s.score >= 70 ? 'text-yellow-400' : 'text-red-400'}`}>
                  {s.score}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-gray-800 bg-gray-900 p-5">
          <h2 className="mb-4 font-semibold">Most Common Mistakes</h2>
          <div className="space-y-3">
            {COMMON_MISTAKES.map((m) => (
              <div key={m.mistake} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className={`h-2 w-2 rounded-full ${
                      m.severity === 'high' ? 'bg-red-400' : m.severity === 'medium' ? 'bg-yellow-400' : 'bg-green-400'
                    }`}
                  />
                  <span className="text-sm">{m.mistake}</span>
                </div>
                <span className="text-sm text-gray-400">{m.count}x</span>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-lg bg-primary-500/10 p-3">
            <p className="text-sm text-primary-300">
              <strong>Suggestion:</strong> Add clamshells and glute bridges to address knee valgus pattern.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
