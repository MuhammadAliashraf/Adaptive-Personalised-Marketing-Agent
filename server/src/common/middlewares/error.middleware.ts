import { NextFunction, Request, Response } from 'express';
import { QueryFailedError } from 'typeorm';
import { ZodError } from 'zod';
import { AppError } from '@common/errors';
import { logger } from '@common/utils/logger';
import { isProduction } from '@config/env';

/**
 * Global error handler. Translates known error types into a consistent JSON
 * envelope and hides internals in production.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(err: unknown, req: Request, res: Response, _next: NextFunction): void {
  let statusCode = 500;
  let message = 'Internal server error';
  let details: unknown;

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    details = err.details;
  } else if (err instanceof ZodError) {
    statusCode = 400;
    message = 'Validation failed';
    details = err.flatten().fieldErrors;
  } else if (err instanceof QueryFailedError) {
    // Unique violation (Postgres code 23505) → 409
    const code = (err as unknown as { code?: string }).code;
    if (code === '23505') {
      statusCode = 409;
      message = 'Resource already exists';
    } else {
      statusCode = 400;
      message = 'Database query failed';
    }
  } else if (err instanceof Error) {
    message = err.message;
  }

  if (statusCode >= 500) {
    logger.error(`${req.method} ${req.originalUrl} → ${message}`, {
      stack: err instanceof Error ? err.stack : undefined,
    });
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(details ? { details } : {}),
    ...(isProduction ? {} : { path: req.originalUrl }),
  });
}
