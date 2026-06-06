import { DataSource } from 'typeorm';
import { Channel } from '@common/enums';
import { Strategy } from '@modules/strategies/strategy.entity';

const STRATEGIES: Partial<Strategy>[] = [
  {
    name: 'Win-back / Re-engagement',
    description: 'Bring inactive users back with a comeback discount.',
    targetCriteria: 'lastActiveAt > 30 days',
    tone: 'warm, inviting',
    recommendedChannel: Channel.EMAIL,
    exampleCTA: 'Come back & save 20%',
    offerType: 'discount',
  },
  {
    name: 'VIP / Loyalty Reward',
    description: 'Reward top customers with exclusive early access — no discount needed.',
    targetCriteria: 'loyaltyTier = vip OR high totalSpend',
    tone: 'exclusive, premium',
    recommendedChannel: Channel.EMAIL,
    exampleCTA: 'Shop early access',
    offerType: 'early-access',
  },
  {
    name: 'Cart Abandonment Recovery',
    description: 'Remind users of items left behind with gentle urgency.',
    targetCriteria: 'abandonedCarts > 0',
    tone: 'urgent, helpful',
    recommendedChannel: Channel.PUSH,
    exampleCTA: 'Complete your order',
    offerType: 'reminder',
  },
  {
    name: 'New User Welcome / Onboarding',
    description: 'Welcome new sign-ups with a first-purchase offer.',
    targetCriteria: 'signupDate < 14d AND totalOrders = 0',
    tone: 'friendly, encouraging',
    recommendedChannel: Channel.EMAIL,
    exampleCTA: 'Claim your welcome offer',
    offerType: 'welcome-offer',
  },
  {
    name: 'Cross-sell / Upsell',
    description: 'Suggest complementary products to frequent buyers.',
    targetCriteria: 'frequent buyers with strong favoriteCategories',
    tone: 'helpful, curated',
    recommendedChannel: Channel.EMAIL,
    exampleCTA: 'Complete the look',
    offerType: 'recommendation',
  },
  {
    name: 'Seasonal / Trend Push',
    description: 'Promote trending picks — the default fallback strategy.',
    targetCriteria: 'broad / category-based',
    tone: 'energetic, trendy',
    recommendedChannel: Channel.PUSH,
    exampleCTA: 'Shop the trend',
    offerType: 'trend',
  },
  {
    name: 'Price-sensitive / Discount Seeker',
    description: 'Coupon-led messaging for deal-driven shoppers.',
    targetCriteria: 'low avgOrderValue, opens on discounts',
    tone: 'value-focused',
    recommendedChannel: Channel.EMAIL,
    exampleCTA: 'Grab your coupon',
    offerType: 'coupon',
  },
  {
    name: 'Premium / Full-price Affinity',
    description: 'Highlight new arrivals to full-price shoppers — no discount.',
    targetCriteria: 'high avgOrderValue, low discount usage',
    tone: 'sophisticated',
    recommendedChannel: Channel.EMAIL,
    exampleCTA: 'Discover new arrivals',
    offerType: 'new-arrivals',
  },
];

export async function seedStrategies(ds: DataSource): Promise<void> {
  const repo = ds.getRepository(Strategy);
  if ((await repo.count()) > 0) return;
  await repo.save(repo.create(STRATEGIES));
}
