import { Repository } from 'typeorm';
import { AppDataSource } from '@config/data-source';
import { CampaignItemStatus } from '@common/enums';
import { CampaignItem } from './campaign-item.entity';

interface ListFilters {
  status?: CampaignItemStatus;
  campaignId?: string;
  userId?: string;
}

class CampaignItemRepository {
  private get repo(): Repository<CampaignItem> {
    return AppDataSource.getRepository(CampaignItem);
  }

  create(data: Partial<CampaignItem>): CampaignItem {
    return this.repo.create(data);
  }

  save(item: CampaignItem): Promise<CampaignItem> {
    return this.repo.save(item);
  }

  findById(id: string): Promise<CampaignItem | null> {
    return this.repo.findOne({ where: { id } });
  }

  findMany(filters: ListFilters): Promise<CampaignItem[]> {
    return this.repo.find({
      where: {
        ...(filters.status ? { status: filters.status } : {}),
        ...(filters.campaignId ? { campaignId: filters.campaignId } : {}),
        ...(filters.userId ? { userId: filters.userId } : {}),
      },
      order: { createdAt: 'DESC' },
    });
  }

  /** Approved-but-not-yet-sent items for a user (storefront polling). */
  findApprovedForUser(userId: string): Promise<CampaignItem[]> {
    return this.repo.find({
      where: { userId, status: CampaignItemStatus.APPROVED },
      order: { updatedAt: 'DESC' },
    });
  }
}

export const campaignItemRepository = new CampaignItemRepository();
