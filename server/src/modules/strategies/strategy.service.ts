import { NotFoundError } from '@common/errors';
import { Strategy } from './strategy.entity';
import { strategyRepository } from './strategy.repository';

class StrategyService {
  list(activeOnly = false): Promise<Strategy[]> {
    return strategyRepository.findAll(activeOnly);
  }

  async getById(id: string): Promise<Strategy> {
    const strategy = await strategyRepository.findById(id);
    if (!strategy) {
      throw new NotFoundError('Strategy not found');
    }
    return strategy;
  }
}

export const strategyService = new StrategyService();
