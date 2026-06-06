import 'dotenv/config';
import { z } from 'zod';

/**
 * Centralised, validated environment configuration.
 * The app fails fast at boot if required variables are missing or malformed.
 */
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(4000),
  API_PREFIX: z.string().default('/api'),
  CORS_ORIGIN: z.string().default('*'),

  // Database
  DB_HOST: z.string().default('localhost'),
  DB_PORT: z.coerce.number().int().positive().default(5432),
  DB_USERNAME: z.string().default('postgres'),
  DB_PASSWORD: z.string().default('postgres'),
  DB_NAME: z.string().default('apma_dev'),
  DB_LOGGING: z
    .enum(['true', 'false'])
    .default('false')
    .transform((v) => v === 'true'),

  // Auth
  JWT_ACCESS_SECRET: z.string().min(8, 'JWT_ACCESS_SECRET must be set'),
  JWT_REFRESH_SECRET: z.string().min(8, 'JWT_REFRESH_SECRET must be set'),
  JWT_ACCESS_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),
  BCRYPT_SALT_ROUNDS: z.coerce.number().int().min(4).max(15).default(10),

  // AI
  GEMINI_API_KEY: z.string().optional().default(''),
  GEMINI_MODEL: z.string().default('gemini-2.5-flash'),
  GEMINI_TIMEOUT_MS: z.coerce.number().int().positive().default(15000),
  // Postmark
  POSTMARK_SERVER_TOKEN: z
    .string()
    .min(1, 'POSTMARK_SERVER_TOKEN must be set'),

  POSTMARK_FROM_EMAIL: z
    .string()
    .email('POSTMARK_FROM_EMAIL must be a valid email'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  // eslint-disable-next-line no-console
  console.error('❌ Invalid environment variables:\n', parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = parsed.data;

export const isProduction = env.NODE_ENV === 'production';
export const isDevelopment = env.NODE_ENV === 'development';
export const isTest = env.NODE_ENV === 'test';
