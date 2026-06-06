import 'reflect-metadata';
import { AppDataSource } from '@config/data-source';
import { logger } from '@common/utils/logger';
import { seedAll } from './seed-all';

/**
 * Idempotent seed runner — each seeder no-ops if its table already has data.
 * Run with `npm run seed`. The seeding logic itself lives in `seedAll` so it
 * can be reused by the Seed migration.
 */
async function run(): Promise<void> {
  await AppDataSource.initialize();
  logger.info('🌱 Seeding database…');

  await seedAll(AppDataSource.manager);

  logger.info('✅ Seeding complete');
  await AppDataSource.destroy();
}

run().catch(async (err) => {
  logger.error('Seeding failed', { error: err instanceof Error ? err.message : err });
  if (AppDataSource.isInitialized) await AppDataSource.destroy();
  process.exit(1);
});
