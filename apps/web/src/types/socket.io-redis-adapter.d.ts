declare module '@socket.io/redis-adapter' {
  import { Redis } from 'ioredis';
  import type { Adapter } from 'socket.io-adapter';

  export interface RedisAdapterOptions {
    pubClient: Redis;
    subClient: Redis;
    key?: string;
  }

  export function createAdapter(
    pubClient: Redis,
    subClient: Redis,
    opts?: Record<string, unknown>,
  ): (nsp: import('socket.io').Namespace) => Adapter;
}
