import { Repository } from 'typeorm';
import { AppDataSource } from '@config/data-source';
import { Campaign } from './campaign.entity';

class CampaignRepository {
  private get repo(): Repository<Campaign> {
    return AppDataSource.getRepository(Campaign);
  }

  create(data: Partial<Campaign>): Campaign {
    return this.repo.create(data);
  }

  save(campaign: Campaign): Promise<Campaign> {
    return this.repo.save(campaign);
  }

  findAll(): Promise<Campaign[]> {
    return this.repo.find({ order: { createdAt: 'DESC' } });
  }

  findById(id: string): Promise<Campaign | null> {
    return this.repo.findOne({ where: { id } });
  }

  /** Campaign with its items (and the items' eager user/strategy relations). */
  findByIdWithItems(id: string): Promise<Campaign | null> {
    return this.repo.findOne({ where: { id }, relations: { items: true } });
  }
}

export const campaignRepository = new CampaignRepository();
