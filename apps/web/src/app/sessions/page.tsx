import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { SessionCard } from '@/components/sessions/SessionCard';
import { Badge, Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui';

const MOCK_TEMPLATES = [
  { id: 'quick_start', name: 'Free Practice', description: 'Start an open-ended session with real-time pose analysis. No structured plan — just practice.', type: 'yoga' as const, difficulty: 'beginner' as const, durationMinutes: 15, poseCount: 0 },
  { id: 'morning_yoga', name: 'Morning Yoga Flow', description: 'A gentle sequence to wake up the body. Includes Mountain, Warrior I, Tree Pose, and seated stretches.', type: 'yoga' as const, difficulty: 'beginner' as const, durationMinutes: 20, poseCount: 8 },
  { id: 'physio_hip', name: 'Hip Mobility', description: 'Physiotherapy exercises to improve hip range of motion. Clamshells, hip abduction, and pigeon prep.', type: 'physiotherapy' as const, difficulty: 'beginner' as const, durationMinutes: 15, poseCount: 6 },
  { id: 'full_body_stretch', name: 'Full Body Stretch', description: 'Comprehensive stretching routine covering neck, shoulders, hips, hamstrings, and calves.', type: 'stretching' as const, difficulty: 'beginner' as const, durationMinutes: 25, poseCount: 10 },
  { id: 'warrior_flow', name: 'Warrior Sequence', description: 'Build lower body strength and balance with Warrior I, II, Triangle, and standing balances.', type: 'yoga' as const, difficulty: 'intermediate' as const, durationMinutes: 30, poseCount: 6 },
  { id: 'back_rehab', name: 'Lower Back Rehab', description: 'Spine-sparing exercises for lower back recovery. Bird-dog, dead bug, wall slides, and gentle twists.', type: 'physiotherapy' as const, difficulty: 'intermediate' as const, durationMinutes: 20, poseCount: 8 },
  { id: 'shoulder_care', name: 'Shoulder Care', description: 'Preventative maintenance for shoulders. Wall slides, cross-body stretches, chest openers, and thoracic extension.', type: 'physiotherapy' as const, difficulty: 'beginner' as const, durationMinutes: 15, poseCount: 6 },
  { id: 'flexibility_routine', name: 'Deep Flexibility', description: 'Extended hold stretches to improve overall flexibility. Pigeon, seated forward fold, and spinal twists.', type: 'stretching' as const, difficulty: 'intermediate' as const, durationMinutes: 30, poseCount: 8 },
];

const CATEGORIES = [
  { key: 'all', label: 'All' },
  { key: 'yoga', label: 'Yoga' },
  { key: 'physiotherapy', label: 'Physiotherapy' },
  { key: 'stretching', label: 'Stretching' },
] as const;

export default async function SessionsPage() {
  const session = await auth();
  if (!session?.user) redirect('/login');

  return (
    <div className="mx-auto max-w-7xl space-y-8 pb-24">
      <div className="space-y-2">
        <Badge className="bg-primary/10 text-primary hover:bg-primary/10">Sessions</Badge>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Welcome back, {session.user.name}</h1>
        <p className="max-w-2xl text-muted-foreground">Choose a session template to get started.</p>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {CATEGORIES.map((cat) => (
          <Button
            key={cat.key}
            variant={cat.key === 'all' ? 'default' : 'outline'}
            size="sm"
            className={`shrink-0 ${
              cat.key === 'all'
                ? ''
                : 'bg-background'
            }`}
          >
            {cat.label}
          </Button>
        ))}
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {MOCK_TEMPLATES.map((t) => (
          <SessionCard key={t.id} session={t} />
        ))}
      </div>

      <Card className="border-border/70 bg-card/80 backdrop-blur">
        <CardHeader className="flex flex-row items-center gap-4 space-y-0">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div className="flex-1">
            <CardTitle className="text-lg">Need help choosing?</CardTitle>
            <CardDescription>Start with &quot;Free Practice&quot; for an open session.</CardDescription>
          </div>
          <Button asChild>
            <Link href="/session/setup?template=quick_start&type=yoga">Start now</Link>
          </Button>
        </CardHeader>
      </Card>
    </div>
  );
}
