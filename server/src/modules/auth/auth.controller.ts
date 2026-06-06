import { Request, Response } from 'express';
import { ApiResponse } from '@common/utils/ApiResponse';
import { asyncHandler } from '@common/utils/asyncHandler';
import { authService } from './auth.service';

export const authController = {
  register: asyncHandler(async (req: Request, res: Response) => {
    const result = await authService.register(req.body);
    return ApiResponse.created(res, result, 'Marketer registered');
  }),

  login: asyncHandler(async (req: Request, res: Response) => {
    const result = await authService.login(req.body);
    return ApiResponse.ok(res, result, 'Logged in');
  }),

  refresh: asyncHandler(async (req: Request, res: Response) => {
    const result = await authService.refresh(req.body);
    return ApiResponse.ok(res, result, 'Token refreshed');
  }),

  me: asyncHandler(async (req: Request, res: Response) => {
    const profile = await authService.getProfile(req.user!.sub);
    return ApiResponse.ok(res, profile, 'Current marketer');
  }),
};
