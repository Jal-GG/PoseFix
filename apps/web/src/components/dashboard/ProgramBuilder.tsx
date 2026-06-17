'use client';

import { useState } from 'react';

interface WeeklyPlan {
  week: number;
  sessions: Array<{
    templateId: string;
    templateName: string;
    dayOfWeek: number;
  }>;
}

interface Program {
  id: string;
  clientId: string;
  name: string;
  startDate: string;
  weeks: WeeklyPlan[];
  status: 'active' | 'completed' | 'paused';
}

const SESSION_TEMPLATES = [
  { id: 'morning_yoga', name: 'Morning Yoga Flow' },
  { id: 'physio_hip', name: 'Hip Mobility' },
  { id: 'full_body_stretch', name: 'Full Body Stretch' },
  { id: 'warrior_flow', name: 'Warrior Sequence' },
  { id: 'back_rehab', name: 'Lower Back Rehab' },
  { id: 'shoulder_care', name: 'Shoulder Care' },
  { id: 'flexibility_routine', name: 'Deep Flexibility' },
];

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export function ProgramBuilder() {
  const [name, setName] = useState('');
  const [weeks, setWeeks] = useState<number>(4);
  const [sessionsPerWeek, setSessionsPerWeek] = useState<number>(3);
  const [program, setProgram] = useState<Program | null>(null);

  function generateProgram() {
    const weekPlans: WeeklyPlan[] = [];
    for (let w = 0; w < weeks; w++) {
      const sessions = [];
      const usedDays = new Set<number>();
      for (let s = 0; s < sessionsPerWeek; s++) {
        let day: number;
        do {
          day = Math.floor(Math.random() * 7);
        } while (usedDays.has(day));
        usedDays.add(day);

        const template = SESSION_TEMPLATES[s % SESSION_TEMPLATES.length];
        sessions.push({ templateId: template.id, templateName: template.name, dayOfWeek: day });
      }
      sessions.sort((a, b) => a.dayOfWeek - b.dayOfWeek);
      weekPlans.push({ week: w + 1, sessions });
    }

    setProgram({
      id: crypto.randomUUID(),
      clientId: '',
      name: name || 'Untitled Program',
      startDate: new Date().toISOString().split('T')[0],
      weeks: weekPlans,
      status: 'active',
    });
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Exercise Program Builder</h2>
        <p className="text-sm text-gray-400">Create a week-by-week curriculum for your client</p>
      </div>

      {!program ? (
        <div className="space-y-4 rounded-xl border border-gray-800 bg-gray-900 p-5">
          <div>
            <label className="mb-1 block text-sm text-gray-400">Program Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. 4-Week Hip Rehab"
              className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white outline-none focus:border-primary-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm text-gray-400">Duration (weeks)</label>
              <select
                value={weeks}
                onChange={(e) => setWeeks(parseInt(e.target.value))}
                className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white outline-none focus:border-primary-500"
              >
                {[2, 3, 4, 6, 8, 12].map((w) => (
                  <option key={w} value={w}>{w} weeks</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm text-gray-400">Sessions/Week</label>
              <select
                value={sessionsPerWeek}
                onChange={(e) => setSessionsPerWeek(parseInt(e.target.value))}
                className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white outline-none focus:border-primary-500"
              >
                {[2, 3, 4, 5, 6, 7].map((s) => (
                  <option key={s} value={s}>{s} sessions</option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={generateProgram}
            className="w-full rounded-lg bg-primary-600 py-2.5 text-sm font-medium transition-colors hover:bg-primary-700"
          >
            Generate Program
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">{program.name}</h3>
              <p className="text-xs text-gray-500">Starts {program.startDate} · {program.weeks.length} weeks</p>
            </div>
            <span className="rounded-full bg-green-500/10 px-3 py-1 text-xs text-green-400">
              {program.status}
            </span>
          </div>

          {program.weeks.map((week) => (
            <div key={week.week} className="rounded-lg border border-gray-800 bg-gray-900 p-4">
              <h4 className="mb-3 text-sm font-medium text-primary-400">Week {week.week}</h4>
              <div className="space-y-2">
                {week.sessions.map((session, i) => (
                  <div key={i} className="flex items-center justify-between rounded bg-gray-800/50 px-3 py-2">
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-gray-500 w-8">{DAYS[session.dayOfWeek]}</span>
                      <span className="text-sm">{session.templateName}</span>
                    </div>
                    <button className="text-xs text-gray-500 hover:text-gray-300">Change</button>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div className="flex gap-3">
            <button className="flex-1 rounded-lg border border-gray-700 py-2 text-sm transition-colors hover:bg-gray-800">
              Assign to Client
            </button>
            <button className="flex-1 rounded-lg bg-primary-600 py-2 text-sm transition-colors hover:bg-primary-700">
              Save Program
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
