import { Router } from 'express';
import { authenticate } from '@common/middlewares/auth.middleware';
import { validate } from '@common/middlewares/validate.middleware';
import { campaignController } from './campaign.controller';
import { campaignIdParamSchema, createCampaignSchema } from './campaign.schema';

const router = Router();

/**
 * @openapi
 * tags:
 *   - name: Campaigns
 *     description: Campaign creation & retrieval
 *
 * components:
 *   schemas:
 *     CreateCampaignInput:
 *       type: object
 *       required: [name, userIds]
 *       properties:
 *         name: { type: string, example: June Win-back Push }
 *         userIds:
 *           type: array
 *           items: { type: string, format: uuid }
 */

/**
 * @openapi
 * /campaigns:
 *   post:
 *     tags: [Campaigns]
 *     summary: Create a campaign for selected users and generate items
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/CreateCampaignInput' }
 *     responses:
 *       201: { description: Campaign created with generated items }
 *   get:
 *     tags: [Campaigns]
 *     summary: List campaigns
 *     responses:
 *       200: { description: Campaigns }
 */
router
  .route('/')
  .post(authenticate, validate(createCampaignSchema), campaignController.create)
  .get(authenticate, campaignController.list);

/**
 * @openapi
 * /campaigns/{id}:
 *   get:
 *     tags: [Campaigns]
 *     summary: Get a campaign and its items
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: string, format: uuid } }
 *     responses:
 *       200: { description: Campaign with items }
 *       404: { description: Not found }
 */
router.get('/:id', authenticate, validate(campaignIdParamSchema), campaignController.getById);

export const campaignRoutes = router;
