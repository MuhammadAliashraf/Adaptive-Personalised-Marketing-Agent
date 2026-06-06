import { z } from 'zod';
import { PerformanceEventType } from '@common/enums';

export const createEventSchema = z.object({
  body: z.object({
    campaignItemId: z.string().uuid(),
    userId: z.string().uuid(),
    strategyId: z.string().uuid().optional(),
    event: z.nativeEnum(PerformanceEventType),
  }),
});

export type CreateEventInput = z.infer<typeof createEventSchema>['body'];
