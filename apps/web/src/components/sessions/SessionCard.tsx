import Link from 'next/link';
import { CategoryBadge, DifficultyDots } from '@/components/ui/index';

interface SessionCardData {
  id: string;
  name: string;
  description: string;
  type: 'yoga' | 'physiotherapy' | 'stretching';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  durationMinutes: number;
  poseCount: number;
  isScheduled?: boolean;
  scheduledTime?: string;
}

export function SessionCard({ session }: { session: SessionCardData }) {
  return (
    <Link
      href={`/session/setup?template=${session.id}`}
      className="group block rounded-xl border border-gray-800 bg-gray-900 p-5 transition-all hover:border-primary-500/50 hover:bg-gray-800/50"
    >
      <div className="mb-3 flex items-start justify-between">
        <CategoryBadge category={session.type} />
        <DifficultyDots level={session.difficulty} />
      </div>

      <h3 className="mb-1 font-semibold text-white group-hover:text-primary-400 transition-colors">
        {session.name}
      </h3>
      <p className="mb-4 text-sm leading-relaxed text-gray-400 line-clamp-2">
        {session.description}
      </p>

      <div className="flex items-center gap-4 text-xs text-gray-500">
        <span>{session.durationMinutes} min</span>
        <span>{session.poseCount} poses</span>
        {session.isScheduled && session.scheduledTime && (
          <span className="text-primary-400">{session.scheduledTime}</span>
        )}
      </div>
    </Link>
  );
}
