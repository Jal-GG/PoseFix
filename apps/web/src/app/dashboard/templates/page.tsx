'use client';

import { useState } from 'react';
import { CategoryBadge, DifficultyDots } from '@/components/ui/index';

interface PoseItem {
  id: string;
  name: string;
  category: string;
  duration: number;
}

const POSE_LIBRARY: Array<{
  id: string;
  name: string;
  category: 'yoga' | 'physiotherapy' | 'stretching';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}> = [
  { id: 'yoga_mountain', name: 'Mountain Pose', category: 'yoga', difficulty: 'beginner' },
  { id: 'yoga_warrior_i', name: 'Warrior I', category: 'yoga', difficulty: 'intermediate' },
  { id: 'yoga_warrior_ii', name: 'Warrior II', category: 'yoga', difficulty: 'intermediate' },
  { id: 'yoga_tree', name: 'Tree Pose', category: 'yoga', difficulty: 'intermediate' },
  { id: 'yoga_downward_dog', name: 'Downward Dog', category: 'yoga', difficulty: 'intermediate' },
  { id: 'yoga_childs_pose', name: "Child's Pose", category: 'yoga', difficulty: 'beginner' },
  { id: 'yoga_bridge', name: 'Bridge Pose', category: 'yoga', difficulty: 'beginner' },
  { id: 'physio_clamshell', name: 'Clamshell', category: 'physiotherapy', difficulty: 'beginner' },
  { id: 'physio_bird_dog', name: 'Bird-Dog', category: 'physiotherapy', difficulty: 'intermediate' },
  { id: 'physio_dead_bug', name: 'Dead Bug', category: 'physiotherapy', difficulty: 'intermediate' },
  { id: 'stretch_chest_opener', name: 'Chest Opener', category: 'stretching', difficulty: 'beginner' },
  { id: 'stretch_pigeon_prep', name: 'Pigeon Prep', category: 'stretching', difficulty: 'intermediate' },
];

export default function TemplateBuilderPage() {
  const [sequence, setSequence] = useState<PoseItem[]>([]);
  const [templateName, setTemplateName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPoses = POSE_LIBRARY.filter(
    (p) => p.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  function addToSequence(pose: (typeof POSE_LIBRARY)[number]) {
    setSequence([...sequence, { id: pose.id, name: pose.name, category: pose.category, duration: 30 }]);
  }

  function removeFromSequence(index: number) {
    setSequence(sequence.filter((_, i) => i !== index));
  }

  function updateDuration(index: number, duration: number) {
    setSequence(
      sequence.map((item, i) => (i === index ? { ...item, duration } : item)),
    );
  }

  const totalDuration = sequence.reduce((sum, item) => sum + item.duration, 0);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div>
        <div className="mb-4">
          <h1 className="text-2xl font-bold">Session Template Builder</h1>
          <p className="text-sm text-gray-400">Drag poses to build your session</p>
        </div>

        <div className="mb-4">
          <input
            type="text"
            placeholder="Template name..."
            value={templateName}
            onChange={(e) => setTemplateName(e.target.value)}
            className="w-full rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-white outline-none focus:border-primary-500"
          />
        </div>

        <div className="mb-4">
          <input
            type="text"
            placeholder="Search poses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white outline-none focus:border-primary-500"
          />
        </div>

        <div className="space-y-2">
          {filteredPoses.map((pose) => (
            <button
              key={pose.id}
              onClick={() => addToSequence(pose)}
              className="flex w-full items-center justify-between rounded-lg border border-gray-800 bg-gray-900 px-4 py-3 text-left transition-colors hover:border-primary-500/50"
            >
              <div>
                <div className="text-sm font-medium">{pose.name}</div>
                <div className="flex items-center gap-2 mt-1">
                  <CategoryBadge category={pose.category} />
                  <DifficultyDots level={pose.difficulty} />
                </div>
              </div>
              <span className="text-primary-400">+</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="sticky top-20">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold">Sequence ({sequence.length} poses)</h2>
            <span className="text-sm text-gray-400">{Math.round(totalDuration / 60)} min total</span>
          </div>

          {sequence.length === 0 ? (
            <div className="rounded-xl border-2 border-dashed border-gray-800 p-8 text-center">
              <p className="text-sm text-gray-500">Add poses from the library to build your session</p>
            </div>
          ) : (
            <div className="space-y-2">
              {sequence.map((item, index) => (
                <div
                  key={`${item.id}-${index}`}
                  className="flex items-center gap-3 rounded-lg border border-gray-800 bg-gray-900 px-4 py-3"
                >
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-800 text-xs text-gray-400">
                    {index + 1}
                  </span>
                  <div className="flex-1">
                    <div className="text-sm font-medium">{item.name}</div>
                    <CategoryBadge category={item.category as 'yoga' | 'physiotherapy' | 'stretching'} key={item.id} />
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={item.duration}
                      onChange={(e) => updateDuration(index, parseInt(e.target.value) || 30)}
                      className="w-16 rounded border border-gray-700 bg-gray-800 px-2 py-1 text-center text-xs text-white outline-none focus:border-primary-500"
                      min={5}
                      max={120}
                    />
                    <span className="text-xs text-gray-500">s</span>
                    <button
                      onClick={() => removeFromSequence(index)}
                      className="text-red-400 hover:text-red-300"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {sequence.length > 0 && (
            <button className="mt-4 w-full rounded-lg bg-primary-600 py-3 font-medium transition-colors hover:bg-primary-700">
              Save Template
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
