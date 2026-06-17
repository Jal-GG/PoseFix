import Link from 'next/link';
import { auth } from '@/lib/auth';

const MOCK_CLIENTS = [
  { id: '1', name: 'Sarah Chen', lastSession: '2026-06-17', trend: 'improving' as const, score: 87 },
  { id: '2', name: 'Mike Rodriguez', lastSession: '2026-06-16', trend: 'stable' as const, score: 74 },
  { id: '3', name: 'Emma Williams', lastSession: '2026-06-15', trend: 'declining' as const, score: 62 },
  { id: '4', name: 'James Kim', lastSession: '2026-06-17', trend: 'improving' as const, score: 91 },
  { id: '5', name: 'Lisa Patel', lastSession: '2026-06-14', trend: 'stable' as const, score: 79 },
];

const TREND_COLORS = {
  improving: 'text-green-400',
  stable: 'text-yellow-400',
  declining: 'text-red-400',
};

export default async function DashboardOverviewPage() {
  const session = await auth();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Good morning, {session?.user?.name}</h1>

      <div className="mb-8 grid gap-4 sm:grid-cols-4">
        {[
          { label: 'Active Clients', value: '12', change: '+2 this week' },
          { label: 'Sessions This Week', value: '28', change: '15% vs last week' },
          { label: 'Avg Client Score', value: '78', change: 'Stable' },
          { label: 'Flagged Clients', value: '2', change: 'Needs attention' },
        ].map((stat) => (
          <div key={stat.label} className="rounded-xl border border-gray-800 bg-gray-900 p-4">
            <div className="mb-1 text-sm text-gray-400">{stat.label}</div>
            <div className="mb-0.5 text-2xl font-bold">{stat.value}</div>
            <div className="text-xs text-gray-500">{stat.change}</div>
          </div>
        ))}
      </div>

      <div className="mb-8">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-semibold">Active Clients</h2>
          <Link href="/dashboard/clients" className="text-sm text-primary-400 hover:text-primary-300">
            View all
          </Link>
        </div>
        <div className="overflow-hidden rounded-xl border border-gray-800">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800 bg-gray-900/50">
                <th className="px-4 py-3 text-left font-medium text-gray-400">Client</th>
                <th className="px-4 py-3 text-left font-medium text-gray-400">Last Session</th>
                <th className="px-4 py-3 text-left font-medium text-gray-400">Trend</th>
                <th className="px-4 py-3 text-left font-medium text-gray-400">Latest Score</th>
                <th className="px-4 py-3 text-left font-medium text-gray-400">Action</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_CLIENTS.map((client) => (
                <tr key={client.id} className="border-b border-gray-800/50 transition-colors hover:bg-gray-900/30">
                  <td className="px-4 py-3 font-medium">{client.name}</td>
                  <td className="px-4 py-3 text-gray-400">{client.lastSession}</td>
                  <td className={`px-4 py-3 ${TREND_COLORS[client.trend]}`}>
                    {client.trend.charAt(0).toUpperCase() + client.trend.slice(1)}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`font-medium ${
                        client.score >= 85
                          ? 'text-green-400'
                          : client.score >= 70
                            ? 'text-yellow-400'
                            : 'text-red-400'
                      }`}
                    >
                      {client.score}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/dashboard/clients/${client.id}`}
                      className="text-primary-400 hover:text-primary-300"
                    >
                      View Profile
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
        <h2 className="mb-2 font-semibold">Upcoming Sessions</h2>
        <p className="text-sm text-gray-400">No upcoming sessions scheduled.</p>
      </div>
    </div>
  );
}
