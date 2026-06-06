import { Repository } from 'typeorm';
import { AppDataSource } from '@config/data-source';
import { Marketer } from './auth.entity';

/**
 * Data-access layer for marketers. Wraps the TypeORM repository so the service
 * never touches the ORM directly.
 */
class AuthRepository {
  private get repo(): Repository<Marketer> {
    return AppDataSource.getRepository(Marketer);
  }

  create(data: Partial<Marketer>): Marketer {
    return this.repo.create(data);
  }

  save(marketer: Marketer): Promise<Marketer> {
    return this.repo.save(marketer);
  }

  findById(id: string): Promise<Marketer | null> {
    return this.repo.findOne({ where: { id } });
  }

  findByEmail(email: string): Promise<Marketer | null> {
    return this.repo.findOne({ where: { email } });
  }

  /** Includes the normally-hidden passwordHash for credential verification. */
  findByEmailWithPassword(email: string): Promise<Marketer | null> {
    return this.repo
      .createQueryBuilder('m')
      .addSelect('m.passwordHash')
      .where('m.email = :email', { email })
      .getOne();
  }

  existsByEmail(email: string): Promise<boolean> {
    return this.repo.existsBy({ email });
  }
}

export const authRepository = new AuthRepository();
