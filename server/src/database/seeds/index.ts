import 'reflect-metadata';
import { AppDataSource } from '@config/data-source';
import { logger } from '@common/utils/logger';
import { seedBrand } from './brand.seed';
import { seedStrategies } from './strategy.seed';
import { seedMarketer } from './marketer.seed';
import { seedUsers } from './user.seed';

/**
 * Idempotent seed runner — each seeder no-ops if its table already has data.
 * Run with `npm run seed`.
 */
async function run(): Promise<void> {
  await AppDataSource.initialize();
  logger.info('🌱 Seeding database…');

  await seedMarketer(AppDataSource);
  await seedBrand(AppDataSource);
  await seedStrategies(AppDataSource);
  await seedUsers(AppDataSource);

  logger.info('✅ Seeding complete');
  await AppDataSource.destroy();
}

run().catch(async (err) => {
  logger.error('Seeding failed', { error: err instanceof Error ? err.message : err });
  if (AppDataSource.isInitialized) await AppDataSource.destroy();
  process.exit(1);
});
