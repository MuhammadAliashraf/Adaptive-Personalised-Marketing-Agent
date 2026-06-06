import 'reflect-metadata';
import path from 'path';
import { DataSource } from 'typeorm';
import { env, isProduction } from './env';

/**
 * Single TypeORM DataSource shared by the app runtime, the seeders, and the
 * TypeORM CLI (migrations). Entities and migrations are resolved by glob so new
 * modules are picked up automatically.
 *
 * Note: we glob both `.ts` (dev / tsx) and `.js` (compiled / dist) so the same
 * config works in development and after `npm run build`.
 */
export const AppDataSource = new DataSource({
  type: 'postgres',
  host: env.DB_HOST,
  port: env.DB_PORT,
  username: env.DB_USERNAME,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,
  synchronize: false,
  logging: env.DB_LOGGING,
  entities: [path.join(__dirname, '..', 'modules', '**', '*.entity.{ts,js}')],
  migrations: [path.join(__dirname, '..', 'database', 'migrations', '*.{ts,js}')],
  migrationsTableName: 'typeorm_migrations',
  ssl: isProduction ? { rejectUnauthorized: false } : false,
});
