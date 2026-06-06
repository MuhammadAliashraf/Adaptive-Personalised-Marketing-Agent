import 'reflect-metadata';
import { createApp } from './app';
import { AppDataSource } from '@config/data-source';
import { env } from '@config/env';
import { logger } from '@common/utils/logger';

async function bootstrap(): Promise<void> {
  // Initialise the database connection before serving traffic.
  await AppDataSource.initialize();
  logger.info('📦 Database connection established');

  const app = createApp();
  const server = app.listen(env.PORT, () => {
    logger.info(`🚀 Server listening on http://localhost:${env.PORT}`);
    logger.info(`📚 API docs at        http://localhost:${env.PORT}/docs`);
    logger.info(`🔌 API base           http://localhost:${env.PORT}${env.API_PREFIX}`);
  });

  // Graceful shutdown
  const shutdown = async (signal: string): Promise<void> => {
    logger.warn(`${signal} received — shutting down`);
    server.close();
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
    process.exit(0);
  };
  process.on('SIGINT', () => void shutdown('SIGINT'));
  process.on('SIGTERM', () => void shutdown('SIGTERM'));
}

bootstrap().catch((err) => {
  logger.error('Fatal error during bootstrap', { error: err instanceof Error ? err.message : err });
  process.exit(1);
});
