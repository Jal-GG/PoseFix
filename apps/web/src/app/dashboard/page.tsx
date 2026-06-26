import Link from 'next/link';
import { auth } from '@/lib/auth';
import { Badge, Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui';

const MOCK_CLIENTS = [
  { id: '1', name: 'Sarah Chen', lastSession: '2026-06-17', trend: 'improving' as const, score: 87 },
  { id: '2', name: 'Mike Rodriguez', lastSession: '2026-06-16', trend: 'stable' as const, score: 74 },
  { id: '3', name: 'Emma Williams', lastSession: '2026-06-15', trend: 'declining' as const, score: 62 },
  { id: '4', name: 'James Kim', lastSession: '2026-06-17', trend: 'improving' as const, score: 91 },
  { id: '5', name: 'Lisa Patel', lastSession: '2026-06-14', trend: 'stable' as const, score: 79 },
];

const TREND_ICONS = {
  improving: (
    <svg className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
  ),
  stable: (
    <svg className="h-4 w-4 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14" />
    </svg>
  ),
  declining: (
    <svg className="h-4 w-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
    </svg>
  ),
};

export default async function DashboardOverviewPage() {
  const session = await auth();

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <Badge className="bg-primary/10 text-primary hover:bg-primary/10">Dashboard Overview</Badge>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Good morning, {session?.user?.name}</h1>
        <p className="max-w-2xl text-muted-foreground">Here&apos;s your training overview for today</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[
          { 
            label: 'Active Clients', 
            value: '12', 
            change: '+2 this week',
            icon: (
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            )
          },
          { 
            label: 'Sessions This Week', 
            value: '28', 
            change: '15% vs last week',
            icon: (
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            )
          },
          { 
            label: 'Avg Client Score', 
            value: '78', 
            change: 'Stable',
            icon: (
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            )
          },
          { 
            label: 'Flagged Clients', 
            value: '2', 
            change: 'Needs attention',
            icon: (
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            )
          },
        ].map((stat) => (
          <Card key={stat.label} className="border-border/70 bg-card/80 backdrop-blur">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
              <div className="text-muted-foreground">{stat.icon}</div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Active Clients</h2>
            <p className="text-sm text-muted-foreground">Monitor your clients&apos; progress and performance</p>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link href="/dashboard/clients">View all</Link>
          </Button>
        </div>
        <Card className="border-border/70 bg-card/80 backdrop-blur">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client</TableHead>
                <TableHead>Last Session</TableHead>
                <TableHead>Trend</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {MOCK_CLIENTS.map((client) => (
                <TableRow key={client.id}>
                  <TableCell className="font-medium">{client.name}</TableCell>
                  <TableCell className="text-muted-foreground">{client.lastSession}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {TREND_ICONS[client.trend]}
                      <span className="text-sm capitalize">{client.trend}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <span className="text-xl font-bold">{client.score}</span>
                      <div className="h-2 w-20 overflow-hidden rounded-full bg-secondary">
                        <div
                          className={`h-full ${
                            client.score >= 85 ? 'bg-green-500' :
                            client.score >= 70 ? 'bg-yellow-500' :
                            'bg-red-500'
                          }`}
                          style={{ width: `${client.score}%` }}
                        />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Link href={`/dashboard/clients/${client.id}`} className="text-sm font-medium text-primary hover:underline">
                      View Profile
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>

      <Card className="border-border/70 bg-card/80 backdrop-blur">
        <CardHeader>
          <CardTitle className="text-xl">Upcoming Sessions</CardTitle>
          <CardDescription>Sessions scheduled for today and later this week.</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center gap-2 text-sm text-muted-foreground">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          No upcoming sessions scheduled.
        </CardContent>
      </Card>
    </div>
  );
}
