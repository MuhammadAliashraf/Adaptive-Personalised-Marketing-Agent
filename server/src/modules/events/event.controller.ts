import { Request, Response } from 'express';
import { ApiResponse } from '@common/utils/ApiResponse';
import { asyncHandler } from '@common/utils/asyncHandler';
import { eventService } from './event.service';

export const eventController = {
  create: asyncHandler(async (req: Request, res: Response) => {
    const event = await eventService.record(req.body);
    return ApiResponse.created(res, event, 'Event recorded');
  }),

  list: asyncHandler(async (_req: Request, res: Response) => {
    const events = await eventService.list();
    return ApiResponse.ok(res, events, 'Events fetched');
  }),

  performance: asyncHandler(async (_req: Request, res: Response) => {
    const stats = await eventService.strategyPerformance();
    return ApiResponse.ok(res, stats, 'Strategy performance fetched');
  }),
};
