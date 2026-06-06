import { Router } from 'express';
import { authenticate } from '@common/middlewares/auth.middleware';
import { validate } from '@common/middlewares/validate.middleware';
import { userController } from './user.controller';
import { listUsersSchema, userIdParamSchema } from './user.schema';

const router = Router();

/**
 * @openapi
 * tags:
 *   - name: Users
 *     description: Customer profiles (marketing targets)
 */

/**
 * @openapi
 * /users:
 *   get:
 *     tags: [Users]
 *     summary: List & filter customer profiles
 *     parameters:
 *       - { in: query, name: page, schema: { type: integer, default: 1 } }
 *       - { in: query, name: limit, schema: { type: integer, default: 20 } }
 *       - { in: query, name: search, schema: { type: string } }
 *       - { in: query, name: city, schema: { type: string } }
 *       - { in: query, name: country, schema: { type: string } }
 *       - { in: query, name: ageMin, schema: { type: integer } }
 *       - { in: query, name: ageMax, schema: { type: integer } }
 *       - { in: query, name: tier, schema: { type: string, enum: [new, regular, vip] } }
 *       - { in: query, name: preferredChannel, schema: { type: string, enum: [email, push] } }
 *       - { in: query, name: inactiveSinceDays, schema: { type: integer } }
 *       - { in: query, name: hasAbandonedCarts, schema: { type: boolean } }
 *     responses:
 *       200: { description: Paginated list of users }
 */
router.get('/', authenticate, validate(listUsersSchema), userController.list);

/**
 * @openapi
 * /users/{id}:
 *   get:
 *     tags: [Users]
 *     summary: Get a single customer profile
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: string, format: uuid } }
 *     responses:
 *       200: { description: User }
 *       404: { description: Not found }
 */
router.get('/:id', authenticate, validate(userIdParamSchema), userController.getById);

export const userRoutes = router;
