import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import { env, isDevelopment } from '@config/env';
import { swaggerSpec } from '@config/swagger';
import { errorHandler, notFoundHandler } from '@common/middlewares';
import { registerRoutes } from '@modules/index';

/** Builds and configures the Express application (no side effects / no listen). */
export function createApp(): Application {
  const app = express();

  // Security & parsing
  app.use(helmet());
  app.use(
    cors({
      origin: env.CORS_ORIGIN === '*' ? true : env.CORS_ORIGIN.split(',').map((o) => o.trim()),
      credentials: true,
    }),
  );
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true }));
  if (isDevelopment) {
    app.use(morgan('dev'));
  }

  // Health check
  app.get('/health', (_req: Request, res: Response) => {
    res.json({ status: 'ok', uptime: process.uptime(), timestamp: new Date().toISOString() });
  });

  // API docs
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, { explorer: true }));
  app.get('/docs.json', (_req, res) => res.json(swaggerSpec));

  // API routes
  app.use(env.API_PREFIX, registerRoutes());

  // Fallbacks
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
