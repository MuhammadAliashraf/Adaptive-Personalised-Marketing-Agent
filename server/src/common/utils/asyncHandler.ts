import { NextFunction, Request, Response } from 'express';

type AsyncController = (req: Request, res: Response, next: NextFunction) => Promise<unknown>;

/**
 * Wraps an async controller so rejected promises are forwarded to Express's
 * error middleware instead of crashing the process.
 */
export const asyncHandler =
  (fn: AsyncController) => (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
