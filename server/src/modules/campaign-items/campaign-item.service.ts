import { BadRequestError, NotFoundError } from '@common/errors';
import { CampaignItemStatus } from '@common/enums';
import { logger } from '@common/utils/logger';
import { brandService } from '@modules/brand/brand.service';
import { strategyService } from '@modules/strategies/strategy.service';
import { userService } from '@modules/users/user.service';
import { generationService } from '@modules/campaigns/generation.service';
import { sendCampaignEmail } from '@/services/email.service';
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

  /** Marketer approves an item → queued for delivery to the storefront + email sent. */
  async approve(id: string): Promise<CampaignItem> {
    const item = await this.getById(id);
    if (item.status === CampaignItemStatus.APPROVED) {
      return item;
    }
    if (item.status !== CampaignItemStatus.PENDING) {
      throw new BadRequestError(`Cannot approve an item in '${item.status}' state`);
    }
    item.status = CampaignItemStatus.APPROVED;
    const saved = await campaignItemRepository.save(item);

    if (item.content?.email) {
      const user = await userService.getById(item.userId);
      const { subject, preheader, body, ctaText, ctaUrl } = item.content.email;
      const htmlBody = buildEmailHtml({ preheader, body, ctaText, ctaUrl });
      sendCampaignEmail(user.email, subject, htmlBody).catch((err: Error) =>
        logger.warn('Campaign email delivery failed', { itemId: item.id, error: err.message }),
      );
    }

    return saved;
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

function buildEmailHtml(opts: {
  preheader?: string;
  body: string;
  ctaText: string;
  ctaUrl: string;
}): string {
  const bodyHtml = opts.body
    .split('\n')
    .map((line) => (line.trim() ? `<p>${line}</p>` : ''))
    .join('');

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /></head>
<body style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;color:#222">
  ${opts.preheader ? `<p style="color:#888;font-size:13px">${opts.preheader}</p>` : ''}
  ${bodyHtml}
  <p style="margin-top:32px">
    <a href="${opts.ctaUrl}"
       style="background:#111;color:#fff;padding:12px 24px;border-radius:4px;text-decoration:none;font-weight:600">
      ${opts.ctaText}
    </a>
  </p>
</body>
</html>`;
}
