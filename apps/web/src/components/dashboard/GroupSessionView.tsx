'use client';

import { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

interface GroupClient {
  id: string;
  name: string;
  score: number;
  currentPose: string;
  mistakes: string[];
  color: string;
}

const GROUP_COLORS = ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export function GroupSessionView({ sessionId }: { sessionId: string }) {
  const [clients, setClients] = useState<Map<string, GroupClient>>(new Map());
  const [leaderboard, setLeaderboard] = useState<GroupClient[]>([]);
  const socketRef = useRef<Socket | null>(null);
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  useEffect(() => {
    const socket = io(process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3000', {
      transports: ['websocket'],
      auth: { token: '', userId: 'trainer' },
      query: { sessionId },
    });
    socketRef.current = socket;

    socket.on('pose_update', (data: { clientId: string; overallScore: number; currentPoseId?: string; mistakes: Array<{ code: string }> }) => {
      setClients((prev) => {
        const next = new Map(prev);
        const existing = next.get(data.clientId);
        if (existing) {
          next.set(data.clientId, {
            ...existing,
            score: data.overallScore,
            currentPose: data.currentPoseId || existing.currentPose,
            mistakes: data.mistakes.map((m) => m.code),
          });
        }
        return next;
      });
    });

    return () => { socket.disconnect(); };
  }, [sessionId]);

  useEffect(() => {
    const sorted = Array.from(clients.values()).sort((a, b) => b.score - a.score);
    setLeaderboard(sorted);
  }, [clients]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Group Session — {clients.size} participants</h2>
        <button
          onClick={() => setShowLeaderboard(!showLeaderboard)}
          className="rounded-lg border border-gray-700 px-3 py-1.5 text-xs transition-colors hover:bg-gray-800"
        >
          {showLeaderboard ? 'Grid View' : 'Leaderboard'}
        </button>
      </div>

      {showLeaderboard ? (
        <div className="rounded-xl border border-gray-800 bg-gray-900 p-4">
          <h3 className="mb-3 font-semibold">🏆 Leaderboard</h3>
          <div className="space-y-2">
            {leaderboard.map((client, i) => (
              <div
                key={client.id}
                className="flex items-center justify-between rounded-lg bg-gray-800/50 px-4 py-2.5"
              >
                <div className="flex items-center gap-3">
                  <span className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
                    i === 0 ? 'bg-yellow-500 text-black' :
                    i === 1 ? 'bg-gray-300 text-black' :
                    i === 2 ? 'bg-orange-600 text-white' :
                    'bg-gray-700 text-gray-400'
                  }`}>
                    {i + 1}
                  </span>
                  <span className="font-medium">{client.name}</span>
                </div>
                <span className="text-lg font-bold">{client.score}</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from(clients.values()).map((client) => (
            <div
              key={client.id}
              className="rounded-xl border border-gray-800 bg-gray-900 p-4"
              style={{ borderColor: client.color + '40' }}
            >
              <div className="mb-2 flex items-center justify-between">
                <span className="font-medium">{client.name}</span>
                <span
                  className="text-lg font-bold"
                  style={{ color: client.color }}
                >
                  {client.score}
                </span>
              </div>
              <div className="text-xs text-gray-500">{client.currentPose}</div>
              {client.mistakes.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {client.mistakes.map((m, i) => (
                    <span key={i} className="rounded bg-red-500/10 px-1.5 py-0.5 text-xs text-red-400">
                      {m.replace(/_/g, ' ')}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
