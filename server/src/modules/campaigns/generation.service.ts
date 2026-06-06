import { env } from '@config/env';
import { logger } from '@common/utils/logger';
import { LoyaltyTier } from '@common/enums';
import { Brand } from '@modules/brand/brand.entity';
import { Strategy } from '@modules/strategies/strategy.entity';
import { User } from '@modules/users/user.entity';
import { GeneratedContent } from '@modules/campaign-items/campaign-item.entity';

export interface StrategyMatch {
  strategyId: string;
  rationale: string;
}

/**
 * AI generation boundary. Today it ships a deterministic rules-based matcher and
 * a templated content generator so the whole flow runs without external calls.
 * Swap the bodies of `callGeminiMatch` / `callGeminiContent` to wire Gemini —
 * the rest of the app depends only on this interface.
 */
class GenerationService {
  private get geminiEnabled(): boolean {
    return Boolean(env.GEMINI_API_KEY);
  }

  /** Picks the best strategy for a user from the available library. */
  async matchStrategy(user: User, strategies: Strategy[]): Promise<StrategyMatch> {
    if (this.geminiEnabled) {
      // TODO: replace with a real Gemini structured-output call.
      logger.debug('Gemini matching not yet wired; using rules-based matcher');
    }
    return this.rulesBasedMatch(user, strategies);
  }

  /** Generates email + notification + modal content for a matched strategy. */
  async generateContent(
    user: User,
    strategy: Strategy,
    brand: Brand,
    feedback?: string | null,
  ): Promise<GeneratedContent> {
    if (this.geminiEnabled) {
      // TODO: replace with a real Gemini structured-output call honouring
      // brand.tone, brand.approvedThemes and brand.restrictedKeywords.
      logger.debug('Gemini content generation not yet wired; using templated generator');
    }
    return this.templatedContent(user, strategy, brand, feedback);
  }

  // ── Deterministic fallbacks ───────────────────────────────

  private rulesBasedMatch(user: User, strategies: Strategy[]): StrategyMatch {
    const byName = (needle: string): Strategy | undefined =>
      strategies.find((s) => s.name.toLowerCase().includes(needle));

    const now = Date.now();
    const daysSinceActive = user.lastActiveAt
      ? (now - new Date(user.lastActiveAt).getTime()) / 86_400_000
      : Infinity;
    const daysSinceSignup = user.signupDate
      ? (now - new Date(user.signupDate).getTime()) / 86_400_000
      : Infinity;

    let chosen: Strategy | undefined;
    let rationale = '';

    if (user.loyaltyTier === LoyaltyTier.VIP) {
      chosen = byName('vip') ?? byName('loyalty');
      rationale = 'User is a VIP — reward loyalty with exclusive access.';
    } else if (daysSinceActive > 30) {
      chosen = byName('win-back') ?? byName('re-engage');
      rationale = `Inactive for ${Math.round(daysSinceActive)} days — win-back offer.`;
    } else if (user.abandonedCarts > 0) {
      chosen = byName('cart') ?? byName('abandon');
      rationale = `${user.abandonedCarts} abandoned cart(s) — recover with urgency.`;
    } else if (daysSinceSignup < 14 && user.totalOrders === 0) {
      chosen = byName('welcome') ?? byName('onboard');
      rationale = 'New user with no orders — welcome onboarding offer.';
    } else if (Number(user.avgOrderValue) >= 150) {
      chosen = byName('premium') ?? byName('full-price');
      rationale = 'High average order value — premium, no-discount messaging.';
    } else if (Number(user.avgOrderValue) > 0 && Number(user.avgOrderValue) < 40) {
      chosen = byName('discount') ?? byName('price-sensitive');
      rationale = 'Low average order value — coupon-led, price-sensitive angle.';
    }

    const fallback = byName('seasonal') ?? byName('trend') ?? strategies[0];
    const strategy = chosen ?? fallback;
    if (!chosen) {
      rationale = 'No strong signal — default to a seasonal / trend push.';
    }

    return { strategyId: strategy.id, rationale };
  }

  private templatedContent(
    user: User,
    strategy: Strategy,
    brand: Brand,
    feedback?: string | null,
  ): GeneratedContent {
    const firstName = user.name.split(' ')[0];
    const cta = strategy.exampleCTA ?? 'Shop now';
    const ctaUrl = 'https://storefront.example.com';
    const tone = strategy.tone ?? brand.tone ?? 'friendly';
    const adjusted = feedback ? ` (revised per feedback: ${feedback})` : '';

    return {
      email: {
        subject: `${firstName}, ${strategy.name} just for you`,
        preheader: `${brand.name} — ${strategy.offerType ?? 'a little something'} picked for you`,
        body:
          `Hi ${firstName},\n\n${strategy.description}\n\n` +
          `As a ${user.loyaltyTier} member of ${brand.name}, we thought you'd love this. ` +
          `${brand.tagline ?? ''}${adjusted}`,
        ctaText: cta,
        ctaUrl,
      },
      notification: {
        title: `${brand.name}: ${strategy.name}`,
        message: `${firstName}, ${cta.toLowerCase()} — ${tone} picks waiting for you.`,
        icon: brand.logoUrl ?? undefined,
      },
      modal: {
        headline: `${firstName}, this one's for you`,
        body: `${strategy.description}${adjusted}`,
        imageUrl: brand.logoUrl ?? undefined,
        ctaText: cta,
        ctaUrl,
        dismissText: 'Maybe later',
      },
    };
  }
}

export const generationService = new GenerationService();
