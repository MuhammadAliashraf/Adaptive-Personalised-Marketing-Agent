import { EntityManager } from 'typeorm';
import { seedMarketer } from './marketer.seed';
import { seedBrand } from './brand.seed';
import { seedStrategies } from './strategy.seed';
import { seedUsers } from './user.seed';
import { seedCampaigns } from './campaign.seed';

/**
 * Runs every seeder in dependency order against the given EntityManager.
 * Each seeder is idempotent (no-ops if its table already has data), so this is
 * safe to call from both `npm run seed` and the Seed migration.
 *
 * Pass a transactional manager (e.g. `queryRunner.manager`) to seed atomically.
 */
export async function seedAll(manager: EntityManager): Promise<void> {
  await seedMarketer(manager);
  await seedBrand(manager);
  await seedStrategies(manager);
  await seedUsers(manager);
  await seedCampaigns(manager);
}
