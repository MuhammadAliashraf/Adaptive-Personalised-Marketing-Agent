import { NextFunction, Request, Response } from 'express';
import { UnauthorizedError } from '@common/errors';
import { verifyAccessToken } from '@common/utils/jwt';

/**
 * Verifies the `Authorization: Bearer <token>` header and attaches the decoded
 * marketer to `req.user`. Use on any route that requires authentication.
 */
export function authenticate(req: Request, _res: Response, next: NextFunction): void {
  const header = req.headers.authorization;

  if (!header || !header.startsWith('Bearer ')) {
    throw new UnauthorizedError('Missing or malformed Authorization header');
  }

  const token = header.slice('Bearer '.length).trim();

  try {
    req.user = verifyAccessToken(token);
    next();
  } catch {
    throw new UnauthorizedError('Invalid or expired access token');
  }
}
