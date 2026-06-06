import { In, Repository } from 'typeorm';
import { AppDataSource } from '@config/data-source';
import { Strategy } from './strategy.entity';

class StrategyRepository {
  private get repo(): Repository<Strategy> {
    return AppDataSource.getRepository(Strategy);
  }

  findAll(activeOnly = false): Promise<Strategy[]> {
    return this.repo.find({
      where: activeOnly ? { isActive: true } : {},
      order: { createdAt: 'ASC' },
    });
  }

  findById(id: string): Promise<Strategy | null> {
    return this.repo.findOne({ where: { id } });
  }

  findByIds(ids: string[]): Promise<Strategy[]> {
    return this.repo.find({ where: { id: In(ids) } });
  }

  save(strategy: Partial<Strategy>): Promise<Strategy> {
    return this.repo.save(this.repo.create(strategy));
  }

  count(): Promise<number> {
    return this.repo.count();
  }
}

export const strategyRepository = new StrategyRepository();
