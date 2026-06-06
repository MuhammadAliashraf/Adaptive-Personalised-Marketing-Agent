import { JwtPayload } from '@common/utils/jwt';

/**
 * Augments Express' Request with the authenticated marketer set by the auth
 * middleware. Imported globally via tsconfig `include`.
 */
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export {};
