import { In, Repository, SelectQueryBuilder } from 'typeorm';
import { AppDataSource } from '@config/data-source';
import { User } from './user.entity';
import { ListUsersQuery } from './user.schema';

class UserRepository {
  private get repo(): Repository<User> {
    return AppDataSource.getRepository(User);
  }

  findById(id: string): Promise<User | null> {
    return this.repo.findOne({ where: { id } });
  }

  findByIds(ids: string[]): Promise<User[]> {
    return this.repo.find({ where: { id: In(ids) } });
  }

  save(user: Partial<User>): Promise<User> {
    return this.repo.save(this.repo.create(user));
  }

  saveMany(users: Partial<User>[]): Promise<User[]> {
    return this.repo.save(this.repo.create(users));
  }

  count(): Promise<number> {
    return this.repo.count();
  }

  /** Paginated, filtered list backed by a query builder. */
  async findAndFilter(query: ListUsersQuery): Promise<{ items: User[]; total: number }> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const qb = this.repo.createQueryBuilder('u');
    this.applyFilters(qb, query);

    const sortBy = query.sortBy ?? 'createdAt';
    const sortOrder = query.sortOrder ?? 'DESC';
    qb.orderBy(`u.${sortBy}`, sortOrder)
      .skip((page - 1) * limit)
      .take(limit);

    const [items, total] = await qb.getManyAndCount();
    return { items, total };
  }

  private applyFilters(qb: SelectQueryBuilder<User>, q: ListUsersQuery): void {
    if (q.search) {
      qb.andWhere('(u.name ILIKE :search OR u.email ILIKE :search)', { search: `%${q.search}%` });
    }
    if (q.city) qb.andWhere('u.city ILIKE :city', { city: q.city });
    if (q.country) qb.andWhere('u.country ILIKE :country', { country: q.country });
    if (q.language) qb.andWhere('u.language = :language', { language: q.language });
    if (q.tier) qb.andWhere('u.loyaltyTier = :tier', { tier: q.tier });
    if (q.preferredChannel) {
      qb.andWhere('u.preferredChannel = :channel', { channel: q.preferredChannel });
    }
    if (q.ageMin !== undefined) qb.andWhere('u.age >= :ageMin', { ageMin: q.ageMin });
    if (q.ageMax !== undefined) qb.andWhere('u.age <= :ageMax', { ageMax: q.ageMax });
    if (q.pushOptIn !== undefined) qb.andWhere('u.pushOptIn = :pushOptIn', { pushOptIn: q.pushOptIn });
    if (q.hasAbandonedCarts !== undefined) {
      qb.andWhere(q.hasAbandonedCarts ? 'u.abandonedCarts > 0' : 'u.abandonedCarts = 0');
    }
    if (q.inactiveSinceDays !== undefined) {
      const cutoff = new Date(Date.now() - q.inactiveSinceDays * 24 * 60 * 60 * 1000);
      qb.andWhere('u.lastActiveAt < :cutoff', { cutoff });
    }
  }
}

export const userRepository = new UserRepository();
