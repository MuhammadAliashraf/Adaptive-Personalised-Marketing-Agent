import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CampaignItemStatus } from '@common/enums';
import { User } from '@modules/users/user.entity';
import { Strategy } from '@modules/strategies/strategy.entity';
import { Campaign } from '@modules/campaigns/campaign.entity';

export interface EmailContent {
  subject: string;
  preheader: string;
  body: string;
  ctaText: string;
  ctaUrl: string;
}

export interface NotificationContent {
  title: string;
  message: string;
  icon?: string;
}

export interface ModalContent {
  headline: string;
  body: string;
  imageUrl?: string;
  ctaText: string;
  ctaUrl: string;
  dismissText: string;
}

export interface GeneratedContent {
  email: EmailContent;
  notification: NotificationContent;
  modal: ModalContent;
}

/** One AI-generated marketing item per targeted user within a campaign. */
@Entity({ name: 'campaign_items' })
export class CampaignItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ type: 'uuid' })
  campaignId: string;

  @ManyToOne(() => Campaign, (campaign) => campaign.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'campaignId' })
  campaign: Campaign;

  @Index()
  @Column({ type: 'uuid' })
  userId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE', eager: true })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'uuid', nullable: true })
  matchedStrategyId: string | null;

  @ManyToOne(() => Strategy, { nullable: true, onDelete: 'SET NULL', eager: true })
  @JoinColumn({ name: 'matchedStrategyId' })
  matchedStrategy: Strategy | null;

  /** Why the AI chose this strategy for this user. */
  @Column({ type: 'text', nullable: true })
  rationale: string | null;

  @Index()
  @Column({ type: 'enum', enum: CampaignItemStatus, default: CampaignItemStatus.DRAFT })
  status: CampaignItemStatus;

  /** Marketer's rejection note — drives regeneration. */
  @Column({ type: 'text', nullable: true })
  feedback: string | null;

  /** Links a regenerated item back to the rejected predecessor it replaces. */
  @Column({ type: 'uuid', nullable: true })
  regeneratedFromId: string | null;

  @Column({ type: 'jsonb', nullable: true })
  content: GeneratedContent | null;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
