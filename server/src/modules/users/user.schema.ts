import { z } from 'zod';
import { Channel, LoyaltyTier } from '@common/enums';

/** Query filters for `GET /api/users` — mirrors the dashboard segmentation UI. */
export const listUsersSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().positive().optional(),
    limit: z.coerce.number().int().positive().max(100).optional(),
    search: z.string().trim().optional(),
    city: z.string().trim().optional(),
    country: z.string().trim().optional(),
    language: z.string().trim().optional(),
    ageMin: z.coerce.number().int().optional(),
    ageMax: z.coerce.number().int().optional(),
    tier: z.nativeEnum(LoyaltyTier).optional(),
    preferredChannel: z.nativeEnum(Channel).optional(),
    pushOptIn: z
      .enum(['true', 'false'])
      .transform((v) => v === 'true')
      .optional(),
    inactiveSinceDays: z.coerce.number().int().positive().optional(),
    hasAbandonedCarts: z
      .enum(['true', 'false'])
      .transform((v) => v === 'true')
      .optional(),
    sortBy: z.enum(['createdAt', 'totalSpend', 'lastActiveAt', 'name']).optional(),
    sortOrder: z.enum(['ASC', 'DESC']).optional(),
  }),
});

export const userIdParamSchema = z.object({
  params: z.object({ id: z.string().uuid() }),
});

export type ListUsersQuery = z.infer<typeof listUsersSchema>['query'];
