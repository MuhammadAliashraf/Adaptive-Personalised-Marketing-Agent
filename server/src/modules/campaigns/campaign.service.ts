import { NotFoundError } from '@common/errors';
import { CampaignItemStatus, CampaignStatus } from '@common/enums';
import { brandService } from '@modules/brand/brand.service';
import { strategyRepository } from '@modules/strategies/strategy.repository';
import { userService } from '@modules/users/user.service';
import { CampaignItem } from '@modules/campaign-items/campaign-item.entity';
import { Campaign } from './campaign.entity';
import { campaignRepository } from './campaign.repository';
import { generationService } from './generation.service';
import { CreateCampaignInput } from './campaign.schema';

class CampaignService {
  /**
   * Creates a campaign for the selected users and generates one item per user:
   * match a strategy, then generate brand-safe content. Items start as `pending`
   * (ready for marketer review).
   */
  async create(input: CreateCampaignInput): Promise<Campaign> {
    const [users, strategies, brand] = await Promise.all([
      userService.getManyOrFail(input.userIds),
      strategyRepository.findAll(true),
      brandService.getDefault(),
    ]);

    if (strategies.length === 0) {
      throw new NotFoundError('No active strategies configured. Run the seeders.');
    }

    const campaign = campaignRepository.create({
      name: input.name,
      marketerId: null,
      status: CampaignStatus.ACTIVE,
      items: [],
    });

    const strategyById = new Map(strategies.map((s) => [s.id, s]));

    for (const user of users) {
      const match = await generationService.matchStrategy(user, strategies);
      const strategy = strategyById.get(match.strategyId) ?? strategies[0];
      const content = await generationService.generateContent(user, strategy, brand);

      const item = new CampaignItem();
      item.userId = user.id;
      item.matchedStrategyId = strategy.id;
      item.rationale = match.rationale;
      item.content = content;
      item.status = CampaignItemStatus.PENDING;
      campaign.items.push(item);
    }

    return campaignRepository.save(campaign);
  }

  list(): Promise<Campaign[]> {
    return campaignRepository.findAll();
  }

  async getById(id: string): Promise<Campaign> {
    const campaign = await campaignRepository.findByIdWithItems(id);
    if (!campaign) {
      throw new NotFoundError('Campaign not found');
    }
    return campaign;
  }
}

export const campaignService = new CampaignService();
