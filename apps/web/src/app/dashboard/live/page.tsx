'use client';

import { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { Badge, Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Input } from '@/components/ui';

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
      <div className="mb-6 flex items-center justify-between gap-4">
        <div className="space-y-1">
          <Badge className="bg-primary/10 text-primary hover:bg-primary/10">Live Monitor</Badge>
          <h1 className="text-3xl font-bold tracking-tight">Live Monitor</h1>
          <p className="text-sm text-muted-foreground">
            {clients.length} client{clients.length !== 1 && 's'} active
          </p>
        </div>
        <span className="flex items-center gap-2 text-sm text-green-500">
          <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
          Live
        </span>
      </div>

      {expandedClient && expanded ? (
        <div>
          <Button
            onClick={() => setExpandedClient(null)}
            variant="ghost"
            className="mb-4 px-0 text-sm text-primary hover:bg-transparent hover:text-primary"
          >
            &larr; Back to grid
          </Button>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="aspect-video border-border/70 bg-card/80 backdrop-blur">
              <CardContent className="flex h-full items-center justify-center p-0">
                <p className="text-muted-foreground">Reconstructed skeleton for {expanded.name}</p>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <Card className="border-border/70 bg-card/80 backdrop-blur">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Joint Angles</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                <div className="space-y-2">
                  {Object.entries(expanded.jointAngles).map(([joint, angle]) => (
                    <div key={joint} className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{joint.replace(/_/g, ' ')}</span>
                      <span className="font-mono text-foreground">{angle.toFixed(1)}°</span>
                    </div>
                  ))}
                </div>
                </CardContent>
              </Card>

              <Card className="border-border/70 bg-card/80 backdrop-blur">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Alerts</CardTitle>
                </CardHeader>
                <CardContent>
                {expanded.mistakes.length > 0 ? (
                  <ul className="space-y-2">
                    {expanded.mistakes.map((m, i) => (
                      <li key={i} className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
                        {m.replace(/_/g, ' ')}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">No active alerts</p>
                )}
                </CardContent>
              </Card>

              <Card className="border-border/70 bg-card/80 backdrop-blur">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Send Message</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="Type a message..."
                  />
                  <Button>
                    Send
                  </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {clients.map((client) => (
            <Button
              key={client.id}
              onClick={() => setExpandedClient(client.id)}
              variant="outline"
              className="group h-auto justify-start p-0 text-left"
            >
              <Card className="w-full border-0 bg-transparent shadow-none">
                <CardContent className="space-y-3 p-4 text-left">
                  <div className="aspect-video rounded-lg bg-muted/50">
                    <div className="flex h-full items-center justify-center">
                      <span className="text-xs text-muted-foreground">Skeleton</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">{client.name}</h3>
                    <span className={`text-lg font-bold ${client.score >= 85 ? 'text-green-500' : client.score >= 70 ? 'text-yellow-500' : 'text-red-500'}`}>
                      {client.score}
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground">{client.currentPose}</div>
                  {client.mistakes.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {client.mistakes.map((m, i) => (
                        <Badge key={i} variant="destructive" className="rounded-md bg-destructive/10 text-destructive">
                          {m.replace(/_/g, ' ')}
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}
