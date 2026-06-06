import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Channel, LoyaltyTier } from '@common/enums';

/**
 * Customer profile — the marketing *target*. Seeded (50–100 rows). These are
 * not login accounts; see `Marketer` for authenticated dashboard users.
 */
@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // ── Identity ──────────────────────────────────────────────
  @Column({ type: 'varchar', length: 120 })
  name: string;

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 180 })
  email: string;

  // ── Demographics ──────────────────────────────────────────
  @Column({ type: 'int', nullable: true })
  age: number | null;

  @Column({ type: 'varchar', length: 30, nullable: true })
  gender: string | null;

  @Index()
  @Column({ type: 'varchar', length: 100, nullable: true })
  city: string | null;

  @Index()
  @Column({ type: 'varchar', length: 100, nullable: true })
  country: string | null;

  @Column({ type: 'varchar', length: 30, nullable: true })
  language: string | null;

  // ── Account ───────────────────────────────────────────────
  @Column({ type: 'timestamptz', nullable: true })
  signupDate: Date | null;

  @Index()
  @Column({ type: 'timestamptz', nullable: true })
  lastActiveAt: Date | null;

  @Index()
  @Column({ type: 'enum', enum: LoyaltyTier, default: LoyaltyTier.NEW })
  loyaltyTier: LoyaltyTier;

  // ── Behaviour ─────────────────────────────────────────────
  @Column({ type: 'int', default: 0 })
  totalOrders: number;

  @Column({ type: 'numeric', precision: 12, scale: 2, default: 0 })
  totalSpend: number;

  @Column({ type: 'numeric', precision: 12, scale: 2, default: 0 })
  avgOrderValue: number;

  @Column({ type: 'int', default: 0 })
  abandonedCarts: number;

  @Column({ type: 'timestamptz', nullable: true })
  lastPurchaseDate: Date | null;

  // ── Browsing ──────────────────────────────────────────────
  @Column({ type: 'simple-array', default: '' })
  favoriteCategories: string[];

  @Column({ type: 'jsonb', default: () => "'[]'" })
  recentlyViewedProducts: string[];

  @Column({ type: 'int', default: 0 })
  sessionsPerWeek: number;

  @Column({ type: 'varchar', length: 30, nullable: true })
  preferredDevice: string | null;

  // ── Engagement ────────────────────────────────────────────
  @Column({ type: 'float', default: 0 })
  emailOpenRate: number;

  @Column({ type: 'float', default: 0 })
  clickThroughRate: number;

  @Column({ type: 'timestamptz', nullable: true })
  lastEmailOpenedAt: Date | null;

  @Column({ type: 'boolean', default: true })
  pushOptIn: boolean;

  @Column({ type: 'enum', enum: Channel, default: Channel.EMAIL })
  preferredChannel: Channel;

  // ── Derived ───────────────────────────────────────────────
  @Column({ type: 'simple-array', default: '' })
  segmentTags: string[];

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
