import { Request, Response } from 'express';
import { ApiResponse } from '@common/utils/ApiResponse';
import { asyncHandler } from '@common/utils/asyncHandler';
import { userService } from './user.service';

export const userController = {
  list: asyncHandler(async (req: Request, res: Response) => {
    const { items, meta } = await userService.list(req.query as never);
    return ApiResponse.ok(res, items, 'Users fetched', meta);
  }),

  getById: asyncHandler(async (req: Request, res: Response) => {
    const user = await userService.getById(req.params.id);
    return ApiResponse.ok(res, user, 'User fetched');
  }),
};
