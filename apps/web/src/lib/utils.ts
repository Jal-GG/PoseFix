import { twMerge } from 'tailwind-merge';

export function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(inputs.filter(Boolean).join(' '));
}

export function getScoreBand(score: number): { label: string; color: string } {
  if (score >= 85) return { label: 'Good Form', color: 'text-green-400' };
  if (score >= 70) return { label: 'Acceptable', color: 'text-yellow-400' };
  if (score >= 50) return { label: 'Needs Correction', color: 'text-orange-400' };
  return { label: 'Priority Correction', color: 'text-red-400' };
}
