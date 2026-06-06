import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Channel } from '@common/enums';

/** A marketing strategy from the seeded library (~8 rows). */
@Entity({ name: 'strategies' })
export class Strategy {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 140 })
  name: string;

  @Column({ type: 'text' })
  description: string;

  /** Human-readable targeting rule, e.g. "lastActiveAt > 30 days". */
  @Column({ type: 'text', nullable: true })
  targetCriteria: string | null;

  @Column({ type: 'varchar', length: 120, nullable: true })
  tone: string | null;

  @Column({ type: 'enum', enum: Channel, nullable: true })
  recommendedChannel: Channel | null;

  @Column({ type: 'varchar', length: 200, nullable: true })
  exampleCTA: string | null;

  @Column({ type: 'varchar', length: 80, nullable: true })
  offerType: string | null;

  /** Selection weight for the self-evolving loop (stretch). */
  @Column({ type: 'float', default: 1 })
  weight: number;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
