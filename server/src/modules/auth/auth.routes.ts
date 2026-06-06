import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { authenticate } from '@common/middlewares/auth.middleware';
import { validate } from '@common/middlewares/validate.middleware';
import { authController } from './auth.controller';
import { loginSchema, refreshSchema, registerSchema } from './auth.schema';

const router = Router();

// Throttle credential endpoints to slow brute-force attempts.
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 20, standardHeaders: true });

/**
 * @openapi
 * tags:
 *   - name: Auth
 *     description: Marketer authentication
 *
 * components:
 *   schemas:
 *     RegisterInput:
 *       type: object
 *       required: [name, email, password]
 *       properties:
 *         name: { type: string, example: Jane Marketer }
 *         email: { type: string, format: email, example: jane@brand.com }
 *         password: { type: string, format: password, example: super-secret-1 }
 *         role: { type: string, enum: [admin, marketer] }
 *     LoginInput:
 *       type: object
 *       required: [email, password]
 *       properties:
 *         email: { type: string, format: email, example: jane@brand.com }
 *         password: { type: string, format: password, example: super-secret-1 }
 */

/**
 * @openapi
 * /auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Register a new marketer
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/RegisterInput' }
 *     responses:
 *       201: { description: Marketer registered }
 *       409: { description: Email already in use }
 */
router.post('/register', authLimiter, validate(registerSchema), authController.register);

/**
 * @openapi
 * /auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Log in and receive access + refresh tokens
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/LoginInput' }
 *     responses:
 *       200: { description: Logged in }
 *       401: { description: Invalid credentials }
 */
router.post('/login', authLimiter, validate(loginSchema), authController.login);

/**
 * @openapi
 * /auth/refresh:
 *   post:
 *     tags: [Auth]
 *     summary: Exchange a refresh token for a new token pair
 *     security: []
 *     responses:
 *       200: { description: Token refreshed }
 *       401: { description: Invalid refresh token }
 */
router.post('/refresh', validate(refreshSchema), authController.refresh);

/**
 * @openapi
 * /auth/me:
 *   get:
 *     tags: [Auth]
 *     summary: Get the currently authenticated marketer
 *     responses:
 *       200: { description: Current marketer }
 *       401: { description: Unauthorized }
 */
router.get('/me', authenticate, authController.me);

export const authRoutes = router;
