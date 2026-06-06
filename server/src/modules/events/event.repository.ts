import { Repository } from 'typeorm';
import { AppDataSource } from '@config/data-source';
import { PerformanceEvent } from './event.entity';

interface StrategyAggregate {
  strategyId: string | null;
  delivered: number;
  opened: number;
  clicked: number;
  converted: number;
}

class EventRepository {
  private get repo(): Repository<PerformanceEvent> {
    return AppDataSource.getRepository(PerformanceEvent);
  }

  save(data: Partial<PerformanceEvent>): Promise<PerformanceEvent> {
    return this.repo.save(this.repo.create(data));
  }

  findAll(): Promise<PerformanceEvent[]> {
    return this.repo.find({ order: { timestamp: 'DESC' } });
  }

  /** Aggregated counts per strategy — the basis of CTR / conversion metrics. */
  async aggregateByStrategy(): Promise<StrategyAggregate[]> {
    const rows = await this.repo
      .createQueryBuilder('e')
      .select('e.strategyId', 'strategyId')
      .addSelect(`COUNT(*) FILTER (WHERE e.event = 'delivered')`, 'delivered')
      .addSelect(`COUNT(*) FILTER (WHERE e.event = 'opened')`, 'opened')
      .addSelect(`COUNT(*) FILTER (WHERE e.event = 'clicked')`, 'clicked')
      .addSelect(`COUNT(*) FILTER (WHERE e.event = 'converted')`, 'converted')
      .groupBy('e.strategyId')
      .getRawMany<Record<string, string>>();

    return rows.map((r) => ({
      strategyId: r.strategyId ?? null,
      delivered: Number(r.delivered),
      opened: Number(r.opened),
      clicked: Number(r.clicked),
      converted: Number(r.converted),
    }));
  }
}

export const eventRepository = new EventRepository();
