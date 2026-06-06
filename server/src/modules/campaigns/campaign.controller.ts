import { Request, Response } from 'express';
import { ApiResponse } from '@common/utils/ApiResponse';
import { asyncHandler } from '@common/utils/asyncHandler';
import { campaignService } from './campaign.service';

export const campaignController = {
  create: asyncHandler(async (req: Request, res: Response) => {
    const campaign = await campaignService.create(req.user!.sub, req.body);
    return ApiResponse.created(res, campaign, 'Campaign created & items generated');
  }),

  list: asyncHandler(async (_req: Request, res: Response) => {
    const campaigns = await campaignService.list();
    return ApiResponse.ok(res, campaigns, 'Campaigns fetched');
  }),

  getById: asyncHandler(async (req: Request, res: Response) => {
    const campaign = await campaignService.getById(req.params.id);
    return ApiResponse.ok(res, campaign, 'Campaign fetched');
  }),
};
