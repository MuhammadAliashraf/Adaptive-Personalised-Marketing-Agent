import { MigrationInterface, QueryRunner } from 'typeorm';
import { seedAll } from '../seeds/seed-all';

/**
 * Seeds reference + demo data (marketer, brand, strategies, users, and a demo
 * campaign with items and performance events). Reuses the idempotent seeders in
 * `src/database/seeds`, run inside the migration's transaction.
 */
export class Seed1780739941607 implements MigrationInterface {
  name = 'Seed1780739941607';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await seedAll(queryRunner.manager);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remove in reverse FK order. TRUNCATE ... CASCADE resets all seeded tables.
    await queryRunner.query(
      `TRUNCATE TABLE
        "performance_events",
        "campaign_items",
        "campaigns",
        "users",
        "strategies",
        "brands",
        "marketers"
      RESTART IDENTITY CASCADE`,
    );
  }
}
