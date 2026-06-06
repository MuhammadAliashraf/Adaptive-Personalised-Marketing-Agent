import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';
import { PerformanceEventType } from '@common/enums';

/** A simulated performance event feeding the self-evolving loop (stretch). */
@Entity({ name: 'performance_events' })
export class PerformanceEvent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ type: 'uuid' })
  campaignItemId: string;

  @Index()
  @Column({ type: 'uuid' })
  userId: string;

  @Index()
  @Column({ type: 'uuid', nullable: true })
  strategyId: string | null;

  @Column({ type: 'enum', enum: PerformanceEventType })
  event: PerformanceEventType;

  @CreateDateColumn({ type: 'timestamptz' })
  timestamp: Date;
}
