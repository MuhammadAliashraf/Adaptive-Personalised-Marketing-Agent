import { Router } from 'express';
import { authenticate } from '@common/middlewares/auth.middleware';
import { validate } from '@common/middlewares/validate.middleware';
import { campaignItemController } from './campaign-item.controller';
import {
  itemIdParamSchema,
  listItemsSchema,
  pendingCampaignsParamSchema,
  rejectItemSchema,
} from './campaign-item.schema';

const router = Router();

/**
 * @openapi
 * tags:
 *   - name: Campaign Items
 *     description: Review queue — approve / reject / regenerate
 *
 * /campaign-items:
 *   get:
 *     tags: [Campaign Items]
 *     summary: List campaign items (review queue)
 *     parameters:
 *       - { in: query, name: status, schema: { type: string, enum: [draft, pending, approved, rejected, sent] } }
 *       - { in: query, name: campaignId, schema: { type: string, format: uuid } }
 *       - { in: query, name: userId, schema: { type: string, format: uuid } }
 *     responses:
 *       200: { description: Campaign items }
 */
router.get('/', authenticate, validate(listItemsSchema), campaignItemController.list);

/**
 * @openapi
 * /campaign-items/{id}:
 *   get:
 *     tags: [Campaign Items]
 *     summary: Get a single campaign item
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: string, format: uuid } }
 *     responses:
 *       200: { description: Campaign item }
 */
router.get('/:id', authenticate, validate(itemIdParamSchema), campaignItemController.getById);

/**
 * @openapi
 * /campaign-items/{id}/approve:
 *   post:
 *     tags: [Campaign Items]
 *     summary: Approve an item
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: string, format: uuid } }
 *     responses:
 *       200: { description: Item approved }
 */
router.post(
  '/:id/approve',
  authenticate,
  validate(itemIdParamSchema),
  campaignItemController.approve,
);

/**
 * @openapi
 * /campaign-items/{id}/reject:
 *   post:
 *     tags: [Campaign Items]
 *     summary: Reject an item with feedback and regenerate
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: string, format: uuid } }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [feedback]
 *             properties:
 *               feedback: { type: string, example: Too pushy — soften the tone. }
 *     responses:
 *       200: { description: Item rejected and a regenerated item returned }
 */
router.post('/:id/reject', authenticate, validate(rejectItemSchema), campaignItemController.reject);

export const campaignItemRoutes = router;

/**
 * Public storefront polling router (no auth). Mounted under `/users` so the
 * final path is `GET /api/users/:userId/pending-campaigns`.
 *
 * @openapi
 * /users/{userId}/pending-campaigns:
 *   get:
 *     tags: [Campaign Items]
 *     summary: Storefront polling — approved items for a user
 *     security: []
 *     parameters:
 *       - { in: path, name: userId, required: true, schema: { type: string, format: uuid } }
 *     responses:
 *       200: { description: Approved campaign items (marked sent on delivery) }
 */
const storefront = Router();
storefront.get(
  '/:userId/pending-campaigns',
  validate(pendingCampaignsParamSchema),
  campaignItemController.pendingForUser,
);

export const storefrontRoutes = storefront;
