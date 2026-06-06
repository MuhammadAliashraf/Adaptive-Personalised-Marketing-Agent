import { DataSource } from 'typeorm';
import { Channel, LoyaltyTier } from '@common/enums';
import { User } from '@modules/users/user.entity';

const FIRST = ['Aria', 'Noah', 'Mia', 'Liam', 'Zoe', 'Omar', 'Lena', 'Kai', 'Eva', 'Sam'];
const LAST = ['Khan', 'Reyes', 'Sato', 'Patel', 'Nguyen', 'Costa', 'Haddad', 'Singh', 'Lee', 'Roy'];
const CITIES = [
  ['Karachi', 'Pakistan'],
  ['London', 'UK'],
  ['Toronto', 'Canada'],
  ['Berlin', 'Germany'],
  ['Dubai', 'UAE'],
  ['Austin', 'USA'],
];
const CATEGORIES = ['Pendant lights', 'Lamps', 'Smart bulbs', 'Outdoor'];
const TIERS = [LoyaltyTier.NEW, LoyaltyTier.REGULAR, LoyaltyTier.VIP];

const rand = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const num = (min: number, max: number): number => Math.floor(Math.random() * (max - min + 1)) + min;
const daysAgo = (d: number): Date => new Date(Date.now() - d * 86_400_000);

/** Generates 50–100 randomised but realistic customer profiles. */
export async function seedUsers(ds: DataSource, count = 60): Promise<void> {
  const repo = ds.getRepository(User);
  if ((await repo.count()) > 0) return;

  const users: Partial<User>[] = [];
  for (let i = 0; i < count; i++) {
    const first = rand(FIRST);
    const last = rand(LAST);
    const [city, country] = rand(CITIES);
    const tier = rand(TIERS);
    const totalOrders = tier === LoyaltyTier.VIP ? num(10, 40) : num(0, 12);
    const totalSpend = totalOrders * num(30, 220);

    users.push({
      name: `${first} ${last}`,
      email: `${first}.${last}.${i}@example.com`.toLowerCase(),
      age: num(20, 60),
      gender: rand(['female', 'male', 'other']),
      city,
      country,
      language: 'en',
      signupDate: daysAgo(num(1, 720)),
      lastActiveAt: daysAgo(num(0, 90)),
      loyaltyTier: tier,
      totalOrders,
      totalSpend,
      avgOrderValue: totalOrders ? Math.round(totalSpend / totalOrders) : 0,
      abandonedCarts: num(0, 4),
      lastPurchaseDate: totalOrders ? daysAgo(num(1, 120)) : null,
      favoriteCategories: [rand(CATEGORIES), rand(CATEGORIES)],
      recentlyViewedProducts: [`SKU-${num(100, 999)}`, `SKU-${num(100, 999)}`],
      sessionsPerWeek: num(0, 14),
      preferredDevice: rand(['mobile', 'desktop', 'tablet']),
      emailOpenRate: Math.random(),
      clickThroughRate: Math.random() * 0.5,
      lastEmailOpenedAt: daysAgo(num(0, 60)),
      pushOptIn: Math.random() > 0.3,
      preferredChannel: rand([Channel.EMAIL, Channel.PUSH]),
      segmentTags: [],
    });
  }

  await repo.save(repo.create(users));
}
