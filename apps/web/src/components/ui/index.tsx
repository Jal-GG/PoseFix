import { cn } from '@/lib/utils';

export function ScoreBadge({
  score,
  size = 'md',
  animate = false,
}: {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  animate?: boolean;
}) {
  let band: string;
  let colorClass: string;

  if (score >= 85) { band = 'Good Form'; colorClass = 'text-green-400'; }
  else if (score >= 70) { band = 'Acceptable'; colorClass = 'text-yellow-400'; }
  else if (score >= 50) { band = 'Needs Correction'; colorClass = 'text-orange-400'; }
  else { band = 'Priority'; colorClass = 'text-red-400'; }

  const sizeClasses = {
    sm: 'text-lg px-2 py-0.5',
    md: 'text-2xl px-3 py-1',
    lg: 'text-4xl px-4 py-2',
  };

  return (
    <div
      className={cn(
        'inline-flex items-center gap-2 rounded-lg bg-gray-900/80 backdrop-blur-sm',
        sizeClasses[size],
        animate && 'animate-score-pop',
      )}
    >
      <span className={cn('font-bold tabular-nums', colorClass)}>
        {score}
      </span>
      <span className="text-xs text-gray-400">{band}</span>
    </div>
  );
}

export function CategoryBadge({
  category,
}: {
  category: 'yoga' | 'physiotherapy' | 'stretching';
}) {
  const colors = {
    yoga: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    physiotherapy: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    stretching: 'bg-green-500/10 text-green-400 border-green-500/20',
  };

  const labels = {
    yoga: 'Yoga',
    physiotherapy: 'Physio',
    stretching: 'Stretch',
  };

  return (
    <span
      className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-medium ${colors[category]}`}
    >
      {labels[category]}
    </span>
  );
}

export function DifficultyDots({
  level,
}: {
  level: 'beginner' | 'intermediate' | 'advanced';
}) {
  const count = level === 'beginner' ? 1 : level === 'intermediate' ? 2 : 3;
  return (
    <span className="inline-flex items-center gap-1">
      {[1, 2, 3].map((i) => (
        <span
          key={i}
          className={`h-1.5 w-1.5 rounded-full ${
            i <= count ? 'bg-primary-400' : 'bg-gray-700'
          }`}
        />
      ))}
    </span>
  );
}
