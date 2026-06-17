import { createServer } from 'node:http';
import { parse } from 'node:url';
import next from 'next';
import { Server } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { Redis } from 'ioredis';
import type { PoseSnapshotPayload } from '@posefix/shared/types';

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = parseInt(process.env.PORT || '3000', 10);

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

async function main() {
  await app.prepare();

  const httpServer = createServer((req, res) => {
    const parsedUrl = parse(req.url!, true);
    handle(req, res, parsedUrl);
  });

  const io = new Server(httpServer, {
    cors: {
      origin: dev ? 'http://localhost:3000' : process.env.FRONTEND_URL,
      methods: ['GET', 'POST'],
    },
    transports: ['websocket', 'polling'],
  });

  const pubClient = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');
  const subClient = pubClient.duplicate();

  io.adapter(createAdapter(pubClient, subClient));

  io.use((socket, next) => {
    const sessionToken = socket.handshake.auth.token;
    const sessionId = socket.handshake.query.sessionId as string;
    if (!sessionToken || !sessionId) {
      return next(new Error('Authentication required'));
    }
    (socket as any).sessionId = sessionId;
    (socket as any).userId = socket.handshake.auth.userId;
    next();
  });

  io.on('connection', (socket) => {
    const sessionId = (socket as any).sessionId;
    const userId = (socket as any).userId;

    socket.join(`session:${sessionId}`);

    socket.on('pose_snapshot', (data: { type: string; sessionId: string; timestamp: number; payload: PoseSnapshotPayload }) => {
      socket.to(`session:${data.sessionId}`).emit('pose_update', {
        clientId: userId,
        ...data.payload,
      });
    });

    socket.on('trainer_message', (data: { message: string }) => {
      io.to(`session:${sessionId}`).emit('trainer_alert', {
        message: data.message,
        timestamp: Date.now(),
      });
    });

    socket.on('disconnect', () => {
      socket.leave(`session:${sessionId}`);
    });
  });

  httpServer.listen(port, () => {
    console.log(`> PoseFix server ready on http://${hostname}:${port}`);
  });
}

main();
