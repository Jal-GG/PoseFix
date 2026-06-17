import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { SessionCard } from '@/components/sessions/SessionCard';

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
    <div className="mx-auto max-w-5xl p-4 pb-24 sm:p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Hi, {session.user.name}</h1>
        <p className="text-gray-400">Ready for your session?</p>
      </div>

      <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.key}
            className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              cat.key === 'all'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {MOCK_TEMPLATES.map((t) => (
          <SessionCard key={t.id} session={t} />
        ))}
      </div>
    </div>
  );
}
