import { PerformanceEvent } from './event.entity';
import { eventRepository } from './event.repository';
import { CreateEventInput } from './event.schema';

class EventService {
  record(input: CreateEventInput): Promise<PerformanceEvent> {
    return eventRepository.save(input);
  }

  list(): Promise<PerformanceEvent[]> {
    return eventRepository.findAll();
  }

  /** Per-strategy CTR / conversion rates for the learning loop (stretch). */
  async strategyPerformance() {
    const rows = await eventRepository.aggregateByStrategy();
    return rows.map((r) => ({
      ...r,
      openRate: r.delivered ? r.opened / r.delivered : 0,
      clickThroughRate: r.opened ? r.clicked / r.opened : 0,
      conversionRate: r.delivered ? r.converted / r.delivered : 0,
    }));
  }
}

export const eventService = new EventService();
