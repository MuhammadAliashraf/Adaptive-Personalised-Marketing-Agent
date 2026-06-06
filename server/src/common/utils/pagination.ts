export interface PaginationParams {
  page: number;
  limit: number;
  skip: number;
}

/** Normalises raw query values into safe pagination params. */
export function getPagination(rawPage?: unknown, rawLimit?: unknown): PaginationParams {
  const page = Math.max(1, Number(rawPage) || 1);
  const limit = Math.min(100, Math.max(1, Number(rawLimit) || 20));
  return { page, limit, skip: (page - 1) * limit };
}
