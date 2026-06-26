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
      className="group relative flex flex-col overflow-hidden rounded-lg border border-border bg-card shadow-sm transition-all hover:shadow-md hover:border-primary/50"
    >
      <div className="flex flex-1 flex-col p-6">
        {/* Header with badges */}
        <div className="mb-4 flex items-start justify-between gap-2">
          <CategoryBadge category={session.type} />
          <DifficultyDots level={session.difficulty} />
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col">
          <h3 className="mb-2 text-lg font-semibold leading-tight transition-colors group-hover:text-primary">
            {session.name}
          </h3>
          <p className="mb-4 line-clamp-2 flex-1 text-sm leading-relaxed text-muted-foreground">
            {session.description}
          </p>

          {/* Footer */}
          <div className="flex items-center gap-4 border-t border-border pt-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{session.durationMinutes} min</span>
            </div>
            <div className="flex items-center gap-1.5">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span>{session.poseCount} poses</span>
            </div>
            {session.isScheduled && session.scheduledTime && (
              <div className="flex items-center gap-1.5 text-primary">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>{session.scheduledTime}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Hover effect overlay */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
    </Link>
  );
}
