import { EntityManager } from 'typeorm';
import { CampaignItemStatus, CampaignStatus, PerformanceEventType } from '@common/enums';
import { Marketer } from '@modules/auth/auth.entity';
import { User } from '@modules/users/user.entity';
import { Strategy } from '@modules/strategies/strategy.entity';
import { Campaign } from '@modules/campaigns/campaign.entity';
import { CampaignItem, GeneratedContent } from '@modules/campaign-items/campaign-item.entity';
import { PerformanceEvent } from '@modules/events/event.entity';

const rand = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

/** Builds plausible multi-channel content for a campaign item. */
function buildContent(user: User, strategy: Strategy): GeneratedContent {
  const firstName = user.name.split(' ')[0];
  const cta = strategy.exampleCTA ?? 'Shop now';
  return {
    email: {
      subject: `${firstName}, ${strategy.name.toLowerCase()} just for you`,
      preheader: strategy.description,
      body: `Hi ${firstName},\n\n${strategy.description} As a ${user.loyaltyTier} member, we picked something we think you'll love.`,
      ctaText: cta,
      ctaUrl: 'https://lumen.co/shop',
    },
    notification: {
      title: `${firstName}, a little something for you ✨`,
      message: cta,
      icon: 'https://placehold.co/64x64?text=L',
    },
    modal: {
      headline: strategy.name,
      body: strategy.description,
      imageUrl: 'https://placehold.co/600x300?text=Lumen',
      ctaText: cta,
      ctaUrl: 'https://lumen.co/shop',
      dismissText: 'Maybe later',
    },
  };
}

/**
 * Seeds a demo campaign with one item per sampled user and a few simulated
 * performance events, so the dashboard has end-to-end data on first run.
 */
export async function seedCampaigns(manager: EntityManager, itemCount = 12): Promise<void> {
  const campaignRepo = manager.getRepository(Campaign);
  if ((await campaignRepo.count()) > 0) return;

  const marketer = await manager.getRepository(Marketer).findOne({ where: {} });
  const strategies = await manager.getRepository(Strategy).find();
  const users = await manager.getRepository(User).find({ take: itemCount });
  if (!marketer || strategies.length === 0 || users.length === 0) return;

  const campaign = await campaignRepo.save(
    campaignRepo.create({
      name: 'Spring Re-engagement — Demo',
      marketerId: marketer.id,
      status: CampaignStatus.ACTIVE,
    }),
  );

  const itemRepo = manager.getRepository(CampaignItem);
  const eventRepo = manager.getRepository(PerformanceEvent);
  const itemStatuses = [
    CampaignItemStatus.APPROVED,
    CampaignItemStatus.SENT,
    CampaignItemStatus.PENDING,
    CampaignItemStatus.DRAFT,
  ];

  for (const user of users) {
    const strategy = rand(strategies);
    const status = rand(itemStatuses);
    const item = await itemRepo.save(
      itemRepo.create({
        campaignId: campaign.id,
        userId: user.id,
        matchedStrategyId: strategy.id,
        rationale: `Matched "${strategy.name}" based on ${user.loyaltyTier} tier and recent activity.`,
        status,
        content: buildContent(user, strategy),
      }),
    );

    // Only sent items produce a delivery funnel of performance events.
    if (status !== CampaignItemStatus.SENT) continue;

    const events: PerformanceEventType[] = [PerformanceEventType.DELIVERED];
    if (Math.random() > 0.3) events.push(PerformanceEventType.OPENED);
    if (events.includes(PerformanceEventType.OPENED) && Math.random() > 0.5) {
      events.push(PerformanceEventType.CLICKED);
    }
    if (events.includes(PerformanceEventType.CLICKED) && Math.random() > 0.6) {
      events.push(PerformanceEventType.CONVERTED);
    }

    await eventRepo.save(
      events.map((event) =>
        eventRepo.create({
          campaignItemId: item.id,
          userId: user.id,
          strategyId: strategy.id,
          event,
        }),
      ),
    );
  }
}
