import { BadRequestError, NotFoundError } from '@common/errors';
import { CampaignItemStatus } from '@common/enums';
import { brandService } from '@modules/brand/brand.service';
import { strategyService } from '@modules/strategies/strategy.service';
import { userService } from '@modules/users/user.service';
import { generationService } from '@modules/campaigns/generation.service';
import { CampaignItem } from './campaign-item.entity';
import { campaignItemRepository } from './campaign-item.repository';
import { RejectItemInput } from './campaign-item.schema';

interface ListFilters {
  status?: CampaignItemStatus;
  campaignId?: string;
  userId?: string;
}

class CampaignItemService {
  list(filters: ListFilters): Promise<CampaignItem[]> {
    return campaignItemRepository.findMany(filters);
  }

  async getById(id: string): Promise<CampaignItem> {
    const item = await campaignItemRepository.findById(id);
    if (!item) {
      throw new NotFoundError('Campaign item not found');
    }
    return item;
  }

  /** Marketer approves an item → queued for delivery to the storefront. */
  async approve(id: string): Promise<CampaignItem> {
    const item = await this.getById(id);
    if (item.status === CampaignItemStatus.APPROVED) {
      return item;
    }
    if (item.status !== CampaignItemStatus.PENDING) {
      throw new BadRequestError(`Cannot approve an item in '${item.status}' state`);
    }
    item.status = CampaignItemStatus.APPROVED;
    return campaignItemRepository.save(item);
  }

  /**
   * Marketer rejects with feedback. The rejected item is marked `rejected` and a
   * new linked item is regenerated from the feedback, returning to the queue.
   */
  async rejectAndRegenerate(id: string, input: RejectItemInput): Promise<CampaignItem> {
    const item = await this.getById(id);
    if (item.status !== CampaignItemStatus.PENDING) {
      throw new BadRequestError(`Cannot reject an item in '${item.status}' state`);
    }

    item.status = CampaignItemStatus.REJECTED;
    item.feedback = input.feedback;
    await campaignItemRepository.save(item);

    if (!item.matchedStrategyId) {
      throw new BadRequestError('Item has no matched strategy to regenerate from');
    }

    const [user, strategy, brand] = await Promise.all([
      userService.getById(item.userId),
      strategyService.getById(item.matchedStrategyId),
      brandService.getDefault(),
    ]);

    const content = await generationService.generateContent(user, strategy, brand, input.feedback);

    const regenerated = campaignItemRepository.create({
      campaignId: item.campaignId,
      userId: item.userId,
      matchedStrategyId: item.matchedStrategyId,
      rationale: item.rationale,
      content,
      status: CampaignItemStatus.PENDING,
      regeneratedFromId: item.id,
    });
    return campaignItemRepository.save(regenerated);
  }

  /** Storefront polling: approved items for a user, marked sent on delivery. */
  async getPendingForUser(userId: string): Promise<CampaignItem[]> {
    const items = await campaignItemRepository.findApprovedForUser(userId);
    for (const item of items) {
      item.status = CampaignItemStatus.SENT;
      await campaignItemRepository.save(item);
    }
    return items;
  }
}

export const campaignItemService = new CampaignItemService();
