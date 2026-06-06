import { isProduction } from '@config/env';

/**
 * Tiny structured logger. Swap for pino/winston if richer logging is needed —
 * the rest of the app only depends on this interface.
 */
type Level = 'info' | 'warn' | 'error' | 'debug';

function log(level: Level, message: string, meta?: unknown): void {
  const entry = {
    level,
    time: new Date().toISOString(),
    message,
    ...(meta ? { meta } : {}),
  };
  const line = isProduction ? JSON.stringify(entry) : formatPretty(level, message, meta);
  // eslint-disable-next-line no-console
  (level === 'error' ? console.error : console.log)(line);
}

function formatPretty(level: Level, message: string, meta?: unknown): string {
  const icon = { info: 'ℹ️', warn: '⚠️', error: '❌', debug: '🐛' }[level];
  const metaStr = meta ? ` ${JSON.stringify(meta)}` : '';
  return `${icon}  [${level.toUpperCase()}] ${message}${metaStr}`;
}

export const logger = {
  info: (message: string, meta?: unknown) => log('info', message, meta),
  warn: (message: string, meta?: unknown) => log('warn', message, meta),
  error: (message: string, meta?: unknown) => log('error', message, meta),
  debug: (message: string, meta?: unknown) => log('debug', message, meta),
};
