import { Router } from 'express';
import { authRoutes } from './auth';
import { userRoutes } from './users';
import { brandRoutes } from './brand';
import { strategyRoutes } from './strategies';
import { campaignRoutes } from './campaigns';
import { campaignItemRoutes, storefrontRoutes } from './campaign-items';
import { eventRoutes } from './events';

/**
 * Aggregates every module router under the API prefix. Add a new module here and
 * it is wired into the app — nothing else to touch.
 */
export function registerRoutes(): Router {
  const router = Router();

  router.use('/auth', authRoutes);
  router.use('/users', userRoutes);
  router.use('/users', storefrontRoutes); // public GET /users/:userId/pending-campaigns
  router.use('/brand', brandRoutes);
  router.use('/strategies', strategyRoutes);
  router.use('/campaigns', campaignRoutes);
  router.use('/campaign-items', campaignItemRoutes);
  router.use('/events', eventRoutes);

  return router;
}
