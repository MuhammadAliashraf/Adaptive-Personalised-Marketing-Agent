import { z } from 'zod';
import { CampaignItemStatus } from '@common/enums';

export const listItemsSchema = z.object({
  query: z.object({
    status: z.nativeEnum(CampaignItemStatus).optional(),
    campaignId: z.string().uuid().optional(),
    userId: z.string().uuid().optional(),
  }),
});

export const itemIdParamSchema = z.object({
  params: z.object({ id: z.string().uuid() }),
});

export const rejectItemSchema = z.object({
  params: z.object({ id: z.string().uuid() }),
  body: z.object({
    feedback: z.string().min(3, 'Feedback is required to regenerate').max(1000),
  }),
});

export const pendingCampaignsParamSchema = z.object({
  params: z.object({ userId: z.string().uuid() }),
});

export type RejectItemInput = z.infer<typeof rejectItemSchema>['body'];
