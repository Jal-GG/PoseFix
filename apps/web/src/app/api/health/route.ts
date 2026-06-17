import { NextRequest, NextResponse } from 'next/server';
import { createLogger } from '@/lib/logging';

const logger = createLogger('health');

interface HealthStatus {
  status: 'ok' | 'degraded' | 'down';
  timestamp: string;
  uptime: number;
  version: string;
  checks: {
    memory: { status: string; usagePercent: number };
    cpu: { status: string; loadAvg: number[] };
  };
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  const memUsage = process.memoryUsage();
  const memoryPercent = Math.round((memUsage.heapUsed / memUsage.heapTotal) * 100);

  const checks: HealthStatus['checks'] = {
    memory: {
      status: memoryPercent > 90 ? 'degraded' : 'ok',
      usagePercent: memoryPercent,
    },
    cpu: {
      status: 'ok',
      loadAvg: [0, 0, 0],
    },
  };

  const status: HealthStatus = {
    status: checks.memory.status === 'degraded' ? 'degraded' : 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: '1.0.0',
    checks,
  };

  logger.info('Health check requested', { status: status.status });

  const statusCode = status.status === 'ok' ? 200 : 503;
  return NextResponse.json(status, { status: statusCode });
}
