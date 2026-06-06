import { DataSource } from 'typeorm';
import { Role } from '@common/enums';
import { hashPassword } from '@common/utils/password';
import { Marketer } from '@modules/auth/auth.entity';

/** Seeds a default admin marketer so the dashboard can be logged into immediately. */
export async function seedMarketer(ds: DataSource): Promise<void> {
  const repo = ds.getRepository(Marketer);
  const email = 'admin@lumen.co';
  if (await repo.existsBy({ email })) return;

  await repo.save(
    repo.create({
      name: 'Demo Admin',
      email,
      passwordHash: await hashPassword('password123'),
      role: Role.ADMIN,
    }),
  );
}
