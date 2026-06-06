import { Router } from 'express';
import { strategyController } from './strategy.controller';

const router = Router();

/**
 * @openapi
 * tags:
 *   - name: Strategies
 *     description: Marketing strategy library
 *
 * /strategies:
 *   get:
 *     tags: [Strategies]
 *     summary: List marketing strategies
 *     parameters:
 *       - { in: query, name: activeOnly, schema: { type: boolean } }
 *     responses:
 *       200: { description: Strategies }
 */
router.get('/', strategyController.list);

/**
 * @openapi
 * /strategies/{id}:
 *   get:
 *     tags: [Strategies]
 *     summary: Get a strategy by id
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: string, format: uuid } }
 *     responses:
 *       200: { description: Strategy }
 *       404: { description: Not found }
 */
router.get('/:id', strategyController.getById);

export const strategyRoutes = router;
