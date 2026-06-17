'use client';

import { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

interface LiveClient {
  id: string;
  name: string;
  score: number;
  currentPose: string;
  mistakes: string[];
  lastUpdate: number;
  jointAngles: Record<string, number>;
}

const MOCK_LIVE_CLIENTS: LiveClient[] = [
  { id: '1', name: 'Sarah Chen', score: 84, currentPose: 'Warrior II', mistakes: [], lastUpdate: Date.now(), jointAngles: { 'front_knee_flexion': 95, 'trunk_inclination': 3, 'front_shoulder_abduction': 88 } },
  { id: '2', name: 'Mike Rodriguez', score: 67, currentPose: 'Tree Pose', mistakes: ['hip_hiking'], lastUpdate: Date.now(), jointAngles: { 'standing_knee_extension': 178, 'trunk_inclination': 8, 'bent_hip_abduction': 35 } },
  { id: '3', name: 'Emma Williams', score: 72, currentPose: 'Downward Dog', mistakes: ['rounded_back'], lastUpdate: Date.now(), jointAngles: { 'shoulder_flexion': 110, 'hip_flexion': 85, 'knee_extension': 175 } },
];

export default function LiveMonitorPage() {
  const [clients, setClients] = useState<LiveClient[]>(MOCK_LIVE_CLIENTS);
  const [expandedClient, setExpandedClient] = useState<string | null>(null);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    socketRef.current = io(process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3000', {
      transports: ['websocket'],
    });

    socketRef.current.on('pose_update', (data: { clientId: string; overallScore: number; currentPoseId?: string; mistakes: Array<{ code: string }> }) => {
      setClients((prev) =>
        prev.map((c) =>
          c.id === data.clientId
            ? { ...c, score: data.overallScore, mistakes: data.mistakes.map((m) => m.code), lastUpdate: Date.now() }
            : c,
        ),
      );
    });

    return () => { socketRef.current?.disconnect(); };
  }, []);

  const expanded = clients.find((c) => c.id === expandedClient);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Live Monitor</h1>
          <p className="text-sm text-gray-400">
            {clients.length} client{clients.length !== 1 && 's'} active
          </p>
        </div>
        <span className="flex items-center gap-2 text-sm text-green-400">
          <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
          Live
        </span>
      </div>

      {expandedClient && expanded ? (
        <div>
          <button
            onClick={() => setExpandedClient(null)}
            className="mb-4 text-sm text-primary-400 hover:text-primary-300"
          >
            &larr; Back to grid
          </button>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="aspect-video rounded-xl border border-gray-800 bg-gray-900">
              <div className="flex h-full items-center justify-center">
                <p className="text-gray-500">Reconstructed skeleton for {expanded.name}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-xl border border-gray-800 bg-gray-900 p-4">
                <h3 className="mb-3 font-semibold">Joint Angles</h3>
                <div className="space-y-2">
                  {Object.entries(expanded.jointAngles).map(([joint, angle]) => (
                    <div key={joint} className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">{joint.replace(/_/g, ' ')}</span>
                      <span className="font-mono text-white">{angle.toFixed(1)}°</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border border-gray-800 bg-gray-900 p-4">
                <h3 className="mb-3 font-semibold">Alerts</h3>
                {expanded.mistakes.length > 0 ? (
                  <ul className="space-y-2">
                    {expanded.mistakes.map((m, i) => (
                      <li key={i} className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-400">
                        {m.replace(/_/g, ' ')}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500">No active alerts</p>
                )}
              </div>

              <div className="rounded-xl border border-gray-800 bg-gray-900 p-4">
                <h3 className="mb-3 font-semibold">Send Message</h3>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Type a message..."
                    className="flex-1 rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white outline-none focus:border-primary-500"
                  />
                  <button className="rounded-lg bg-primary-600 px-4 py-2 text-sm transition-colors hover:bg-primary-700">
                    Send
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {clients.map((client) => (
            <button
              key={client.id}
              onClick={() => setExpandedClient(client.id)}
              className="group rounded-xl border border-gray-800 bg-gray-900 p-4 text-left transition-all hover:border-primary-500/50"
            >
              <div className="mb-3 aspect-video rounded-lg bg-gray-800">
                <div className="flex h-full items-center justify-center">
                  <span className="text-xs text-gray-600">Skeleton</span>
                </div>
              </div>

              <div className="mb-2 flex items-center justify-between">
                <h3 className="font-medium">{client.name}</h3>
                <span
                  className={`text-lg font-bold ${
                    client.score >= 85 ? 'text-green-400' : client.score >= 70 ? 'text-yellow-400' : 'text-red-400'
                  }`}
                >
                  {client.score}
                </span>
              </div>

              <div className="text-sm text-gray-400">{client.currentPose}</div>

              {client.mistakes.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {client.mistakes.map((m, i) => (
                    <span key={i} className="rounded bg-red-500/10 px-2 py-0.5 text-xs text-red-400">
                      {m.replace(/_/g, ' ')}
                    </span>
                  ))}
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
