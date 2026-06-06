import { Router } from 'express';
import { authenticate } from '@common/middlewares/auth.middleware';
import { brandController } from './brand.controller';

const router = Router();

/**
 * @openapi
 * tags:
 *   - name: Brand
 *     description: Brand guidelines & guardrails
 *
 * /brand:
 *   get:
 *     tags: [Brand]
 *     summary: Get the default brand guidelines
 *     responses:
 *       200: { description: Brand }
 */
router.get('/', authenticate, brandController.getDefault);

/**
 * @openapi
 * /brand/all:
 *   get:
 *     tags: [Brand]
 *     summary: List all brands
 *     responses:
 *       200: { description: Brands }
 */
router.get('/all', authenticate, brandController.list);

/**
 * @openapi
 * /brand/{id}:
 *   get:
 *     tags: [Brand]
 *     summary: Get a brand by id
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: string, format: uuid } }
 *     responses:
 *       200: { description: Brand }
 *       404: { description: Not found }
 */
router.get('/:id', authenticate, brandController.getById);

export const brandRoutes = router;
