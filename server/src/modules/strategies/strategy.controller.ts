import { Request, Response } from 'express';
import { ApiResponse } from '@common/utils/ApiResponse';
import { asyncHandler } from '@common/utils/asyncHandler';
import { strategyService } from './strategy.service';

export const strategyController = {
  list: asyncHandler(async (req: Request, res: Response) => {
    const activeOnly = req.query.activeOnly === 'true';
    const strategies = await strategyService.list(activeOnly);
    return ApiResponse.ok(res, strategies, 'Strategies fetched');
  }),

  getById: asyncHandler(async (req: Request, res: Response) => {
    const strategy = await strategyService.getById(req.params.id);
    return ApiResponse.ok(res, strategy, 'Strategy fetched');
  }),
};
