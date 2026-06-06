import { NextFunction, Request, Response } from 'express';
import { Role } from '@common/enums';
import { ForbiddenError, UnauthorizedError } from '@common/errors';

/**
 * Restricts a route to the given roles. Must run after `authenticate`.
 *
 * @example router.post('/', authenticate, authorize(Role.ADMIN), handler)
 */
export function authorize(...roles: Role[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw new UnauthorizedError();
    }
    if (roles.length && !roles.includes(req.user.role)) {
      throw new ForbiddenError('You do not have permission to perform this action');
    }
    next();
  };
}
