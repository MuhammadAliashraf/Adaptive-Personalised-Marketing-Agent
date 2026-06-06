import { Response } from 'express';

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface SuccessBody<T> {
  success: true;
  message: string;
  data: T;
  meta?: PaginationMeta;
}

/** Standard, consistent success envelope used by every controller. */
export const ApiResponse = {
  ok<T>(res: Response, data: T, message = 'OK', meta?: PaginationMeta): Response {
    const body: SuccessBody<T> = { success: true, message, data, ...(meta ? { meta } : {}) };
    return res.status(200).json(body);
  },

  created<T>(res: Response, data: T, message = 'Created'): Response {
    const body: SuccessBody<T> = { success: true, message, data };
    return res.status(201).json(body);
  },

  noContent(res: Response): Response {
    return res.status(204).send();
  },
};

export function buildPaginationMeta(total: number, page: number, limit: number): PaginationMeta {
  return { page, limit, total, totalPages: Math.max(1, Math.ceil(total / limit)) };
}
