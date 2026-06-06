import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CampaignStatus } from '@common/enums';
import { Marketer } from '@modules/auth/auth.entity';
import { CampaignItem } from '@modules/campaign-items/campaign-item.entity';

/** A batch of generated marketing items created by a marketer for selected users. */
@Entity({ name: 'campaigns' })
export class Campaign {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 160 })
  name: string;

  @Index()
  @Column({ type: 'uuid', nullable: true })
  marketerId: string | null;

  @ManyToOne(() => Marketer, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'marketerId' })
  marketer: Marketer;

  @Index()
  @Column({ type: 'enum', enum: CampaignStatus, default: CampaignStatus.DRAFT })
  status: CampaignStatus;

  @OneToMany(() => CampaignItem, (item) => item.campaign, { cascade: true })
  items: CampaignItem[];

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
