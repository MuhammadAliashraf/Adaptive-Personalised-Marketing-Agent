import { Request, Response } from 'express';
import { ApiResponse } from '@common/utils/ApiResponse';
import { asyncHandler } from '@common/utils/asyncHandler';
import { brandService } from './brand.service';

export const brandController = {
  getDefault: asyncHandler(async (_req: Request, res: Response) => {
    const brand = await brandService.getDefault();
    return ApiResponse.ok(res, brand, 'Brand fetched');
  }),

  list: asyncHandler(async (_req: Request, res: Response) => {
    const brands = await brandService.list();
    return ApiResponse.ok(res, brands, 'Brands fetched');
  }),

  getById: asyncHandler(async (req: Request, res: Response) => {
    const brand = await brandService.getById(req.params.id);
    return ApiResponse.ok(res, brand, 'Brand fetched');
  }),
};
