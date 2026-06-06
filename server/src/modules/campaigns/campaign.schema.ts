import { z } from 'zod';

export const createCampaignSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(160),
    userIds: z.array(z.string().uuid()).min(1, 'Select at least one user').max(200),
  }),
});

export const campaignIdParamSchema = z.object({
  params: z.object({ id: z.string().uuid() }),
});

export type CreateCampaignInput = z.infer<typeof createCampaignSchema>['body'];
