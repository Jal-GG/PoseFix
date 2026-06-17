'use client';

import { useState } from 'react';

interface CoachingSuggestion {
  focus: string;
  reason: string;
  suggestedExercises: string[];
  priority: 'high' | 'medium' | 'low';
}

interface ClientMistakeProfile {
  clientName: string;
  topMistakes: Array<{ code: string; count: number; commonPoses: string[] }>;
  decliningPoses: string[];
  sessionFrequency: number;
  averageScore: number;
}

const EXERCISE_LIBRARY: Record<string, string[]> = {
  knee_valgus: ['Clamshell Exercise', 'Glute Bridge', 'Side-Lying Hip Abduction', 'Monster Walks'],
  forward_head: ['Chin Tuck', 'Thoracic Extension', 'Doorway Chest Stretch', 'Scapular Retraction'],
  rounded_back: ['Cat-Cow', 'Thoracic Spine Mobilization', 'Child\'s Pose', 'Wall Angels'],
  hip_weakness: ['Bird-Dog', 'Dead Bug', 'Standing Hip Abduction', 'Fire Hydrants'],
  shoulder_impingement: ['Wall Slide', 'External Rotation', 'Prone Y-T-W-L', 'Band Pull-Apart'],
  poor_balance: ['Tree Pose (Wall)', 'Single-Leg Stance', 'Tandem Walk', 'BOSU Ball Squats'],
};

function analyzeMistakeProfile(profile: ClientMistakeProfile): CoachingSuggestion[] {
  const suggestions: CoachingSuggestion[] = [];

  for (const mistake of profile.topMistakes) {
    let key = 'knee_valgus';
    if (mistake.code.includes('knee') || mistake.code.includes('valgus')) key = 'knee_valgus';
    else if (mistake.code.includes('neck') || mistake.code.includes('head') || mistake.code.includes('cervical')) key = 'forward_head';
    else if (mistake.code.includes('back') || mistake.code.includes('spine') || mistake.code.includes('round')) key = 'rounded_back';
    else if (mistake.code.includes('hip')) key = 'hip_weakness';
    else if (mistake.code.includes('shoulder')) key = 'shoulder_impingement';
    else if (mistake.code.includes('balance')) key = 'poor_balance';

    const exercises = EXERCISE_LIBRARY[key] || EXERCISE_LIBRARY.knee_valgus;

    suggestions.push({
      focus: `Address ${mistake.code.replace(/_/g, ' ')} pattern`,
      reason: `Detected ${mistake.count} times across ${mistake.commonPoses.length} different poses`,
      suggestedExercises: exercises.slice(0, 3),
      priority: mistake.count > 10 ? 'high' : mistake.count > 5 ? 'medium' : 'low',
    });
  }

  if (profile.decliningPoses.length > 0) {
    suggestions.push({
      focus: `Regress and rebuild: ${profile.decliningPoses.slice(0, 2).join(', ')}`,
      reason: 'These poses show a declining score trend over the last 3 sessions',
      suggestedExercises: ['Reduce range of motion', 'Increase rest between attempts', 'Add assistive props'],
      priority: 'high',
    });
  }

  if (profile.sessionFrequency < 3) {
    suggestions.push({
      focus: 'Increase session frequency',
      reason: `Only ${profile.sessionFrequency} sessions per week — minimum 3 recommended for progress`,
      suggestedExercises: ['Short evening stretch (10 min)', 'Morning mobility routine (5 min)'],
      priority: 'medium',
    });
  }

  return suggestions.slice(0, 3);
}

function generateAICoachingNote(suggestions: CoachingSuggestion[]): string {
  if (suggestions.length === 0) return 'No specific adjustments needed — continue the current program.';

  const highPriority = suggestions.filter((s) => s.priority === 'high');
  const parts: string[] = [];

  if (highPriority.length > 0) {
    parts.push(`Priority: ${highPriority[0].focus}. ${highPriority[0].reason}.`);
    parts.push(`Recommended: ${highPriority[0].suggestedExercises.join(', ')}.`);
  }

  const rest = suggestions.filter((s) => s.priority !== 'high');
  if (rest.length > 0) {
    parts.push(`Also consider: ${rest.map((s) => s.focus).join('; ')}.`);
  }

  return parts.join(' ');
}

export function AICoachingPanel({ profile }: { profile: ClientMistakeProfile }) {
  const [suggestions] = useState(() => analyzeMistakeProfile(profile));
  const [aiNote] = useState(() => generateAICoachingNote(suggestions));

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-primary-500/20 bg-primary-500/5 p-4">
        <h3 className="mb-2 flex items-center gap-2 font-semibold text-primary-400">
          <span>🤖</span> AI Coaching Suggestion
        </h3>
        <p className="text-sm leading-relaxed text-gray-300">{aiNote}</p>
      </div>

      <div className="space-y-3">
        {suggestions.map((s, i) => (
          <div key={i} className="rounded-lg border border-gray-800 bg-gray-900 p-4">
            <div className="mb-2 flex items-center justify-between">
              <h4 className="text-sm font-medium">{s.focus}</h4>
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                  s.priority === 'high'
                    ? 'bg-red-500/10 text-red-400'
                    : s.priority === 'medium'
                      ? 'bg-yellow-500/10 text-yellow-400'
                      : 'bg-blue-500/10 text-blue-400'
                }`}
              >
                {s.priority}
              </span>
            </div>
            <p className="mb-2 text-xs text-gray-500">{s.reason}</p>
            <div className="flex flex-wrap gap-1.5">
              {s.suggestedExercises.map((ex) => (
                <span key={ex} className="rounded bg-primary-500/10 px-2 py-0.5 text-xs text-primary-400">
                  {ex}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
