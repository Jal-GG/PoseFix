export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

const levelName: Record<LogLevel, string> = {
  [LogLevel.DEBUG]: 'debug',
  [LogLevel.INFO]: 'info',
  [LogLevel.WARN]: 'warn',
  [LogLevel.ERROR]: 'error',
};

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  module: string;
  requestId?: string;
  userId?: string;
  [key: string]: unknown;
}

let minLevel = LogLevel.DEBUG;

export function setLogLevel(level: LogLevel) {
  minLevel = level;
}

export function createLogger(module: string) {
  function log(level: LogLevel, message: string, meta?: Record<string, unknown>) {
    if (level < minLevel) return;
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      module,
      ...meta,
    };
    const output = JSON.stringify(entry);
    switch (level) {
      case LogLevel.ERROR:
        console.error(output);
        break;
      case LogLevel.WARN:
        console.warn(output);
        break;
      default:
        console.log(output);
    }
  }

  return {
    debug: (msg: string, meta?: Record<string, unknown>) => log(LogLevel.DEBUG, msg, meta),
    info: (msg: string, meta?: Record<string, unknown>) => log(LogLevel.INFO, msg, meta),
    warn: (msg: string, meta?: Record<string, unknown>) => log(LogLevel.WARN, msg, meta),
    error: (msg: string, meta?: Record<string, unknown>) => log(LogLevel.ERROR, msg, meta),
  };
}

export type Logger = ReturnType<typeof createLogger>;
