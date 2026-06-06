import { Request, Response } from 'express';
import { ApiResponse } from '@common/utils/ApiResponse';
import { asyncHandler } from '@common/utils/asyncHandler';
import { campaignItemService } from './campaign-item.service';

export const campaignItemController = {
  list: asyncHandler(async (req: Request, res: Response) => {
    const items = await campaignItemService.list(req.query as never);
    return ApiResponse.ok(res, items, 'Campaign items fetched');
  }),

  getById: asyncHandler(async (req: Request, res: Response) => {
    const item = await campaignItemService.getById(req.params.id);
    return ApiResponse.ok(res, item, 'Campaign item fetched');
  }),

  approve: asyncHandler(async (req: Request, res: Response) => {
    const item = await campaignItemService.approve(req.params.id);
    return ApiResponse.ok(res, item, 'Item approved');
  }),

  reject: asyncHandler(async (req: Request, res: Response) => {
    const item = await campaignItemService.rejectAndRegenerate(req.params.id, req.body);
    return ApiResponse.ok(res, item, 'Item rejected & regenerated');
  }),

  // Public storefront polling endpoint.
  pendingForUser: asyncHandler(async (req: Request, res: Response) => {
    const items = await campaignItemService.getPendingForUser(req.params.userId);
    return ApiResponse.ok(res, items, 'Pending campaigns fetched');
  }),
};
