'use client';

import { useState } from 'react';
import { CategoryBadge, DifficultyDots } from '@/components/ui/index';
import { Badge, Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Input, Separator } from '@/components/ui';

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
        <div className="mb-4 space-y-2">
          <Badge className="bg-primary/10 text-primary hover:bg-primary/10">Templates</Badge>
          <h1 className="text-3xl font-bold tracking-tight">Session Template Builder</h1>
          <p className="text-sm text-muted-foreground">Drag poses to build your session.</p>
        </div>

        <div className="mb-4">
          <Input
            type="text"
            placeholder="Template name..."
            value={templateName}
            onChange={(e) => setTemplateName(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <Input
            type="text"
            placeholder="Search poses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          {filteredPoses.map((pose) => (
            <Button
              key={pose.id}
              onClick={() => addToSequence(pose)}
              variant="outline"
              className="h-auto w-full items-start justify-between px-4 py-4 text-left"
            >
              <div>
                <div className="text-sm font-medium">{pose.name}</div>
                <div className="mt-2 flex items-center gap-2">
                  <CategoryBadge category={pose.category} />
                  <DifficultyDots level={pose.difficulty} />
                </div>
              </div>
              <span className="text-primary-400">+</span>
            </Button>
          ))}
        </div>
      </div>

      <div>
        <div className="sticky top-20">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold">Sequence ({sequence.length} poses)</h2>
            <span className="text-sm text-muted-foreground">{Math.round(totalDuration / 60)} min total</span>
          </div>

          {sequence.length === 0 ? (
            <Card className="border-dashed border-border bg-background/60">
              <CardContent className="p-8 text-center text-sm text-muted-foreground">
                Add poses from the library to build your session.
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-2">
              {sequence.map((item, index) => (
                <div
                  key={`${item.id}-${index}`}
                  className="flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-3 shadow-sm"
                >
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-xs text-muted-foreground">
                    {index + 1}
                  </span>
                  <div className="flex-1">
                    <div className="text-sm font-medium">{item.name}</div>
                    <CategoryBadge category={item.category as 'yoga' | 'physiotherapy' | 'stretching'} key={item.id} />
                  </div>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      value={item.duration}
                      onChange={(e) => updateDuration(index, parseInt(e.target.value) || 30)}
                      className="h-8 w-16 text-center"
                      min={5}
                      max={120}
                    />
                    <span className="text-xs text-muted-foreground">s</span>
                    <Button
                      onClick={() => removeFromSequence(index)}
                      variant="ghost"
                      size="sm"
                      className="h-8 px-2 text-destructive hover:text-destructive"
                    >
                      ✕
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {sequence.length > 0 && (
            <Button className="mt-4 w-full">
              Save Template
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
