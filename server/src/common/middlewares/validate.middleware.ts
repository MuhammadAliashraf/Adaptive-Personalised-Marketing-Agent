import { NextFunction, Request, Response } from 'express';
import { AnyZodObject, ZodError } from 'zod';
import { BadRequestError } from '@common/errors';

/**
 * Validates and coerces `body`, `query` and `params` against a Zod schema.
 * The parsed (typed) values replace the raw request values.
 *
 * Schema shape: `z.object({ body, query, params })` — all keys optional.
 */
export const validate =
  (schema: AnyZodObject) =>
  (req: Request, _res: Response, next: NextFunction): void => {
    try {
      const parsed = schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      if (parsed.body !== undefined) req.body = parsed.body;
      if (parsed.query !== undefined) Object.assign(req.query, parsed.query);
      if (parsed.params !== undefined) Object.assign(req.params, parsed.params);
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        throw new BadRequestError('Validation failed', err.flatten().fieldErrors);
      }
      throw err;
    }
  };
