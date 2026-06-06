import { Router } from 'express';
import { validate } from '@common/middlewares/validate.middleware';
import { eventController } from './event.controller';
import { createEventSchema } from './event.schema';

const router = Router();

/**
 * @openapi
 * tags:
 *   - name: Events
 *     description: Performance events & learning metrics (stretch)
 *
 * /events:
 *   post:
 *     tags: [Events]
 *     summary: Record a performance event
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [campaignItemId, userId, event]
 *             properties:
 *               campaignItemId: { type: string, format: uuid }
 *               userId: { type: string, format: uuid }
 *               strategyId: { type: string, format: uuid }
 *               event: { type: string, enum: [delivered, opened, clicked, converted, dismissed] }
 *     responses:
 *       201: { description: Event recorded }
 *   get:
 *     tags: [Events]
 *     summary: List recorded events
 *     responses:
 *       200: { description: Events }
 */
router
  .route('/')
  .post(validate(createEventSchema), eventController.create)
  .get(eventController.list);

/**
 * @openapi
 * /events/performance:
 *   get:
 *     tags: [Events]
 *     summary: Per-strategy CTR / conversion metrics
 *     responses:
 *       200: { description: Strategy performance }
 */
router.get('/performance', eventController.performance);

export const eventRoutes = router;
