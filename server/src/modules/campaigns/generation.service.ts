import { Type, type Schema } from '@google/genai';
import { logger } from '@common/utils/logger';
import { LoyaltyTier } from '@common/enums';
import { Brand } from '@modules/brand/brand.entity';
import { Strategy } from '@modules/strategies/strategy.entity';
import { User } from '@modules/users/user.entity';
import { GeneratedContent } from '@modules/campaign-items/campaign-item.entity';
import { geminiEnabled, generateJson } from './gemini.client';

export interface StrategyMatch {
  strategyId: string;
  rationale: string;
}

/**
 * AI generation boundary. When a Gemini API key is configured it picks the best
 * strategy per user and generates brand-safe content via the model; otherwise
 * (or on any error/timeout) it falls back to a deterministic rules-based matcher
 * and a templated generator so the whole flow always runs. The rest of the app
 * depends only on this interface.
 */
class GenerationService {
  /** Picks the best strategy for a user from the available library. */
  async matchStrategy(user: User, strategies: Strategy[]): Promise<StrategyMatch> {
    if (geminiEnabled()) {
      try {
        return await this.geminiMatch(user, strategies);
      } catch (error) {
        logger.warn('Gemini strategy match failed; falling back to rules', {
          error: (error as Error).message,
        });
      }
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
    if (geminiEnabled()) {
      try {
        return await this.geminiContent(user, strategy, brand, feedback);
      } catch (error) {
        logger.warn('Gemini content generation failed; falling back to template', {
          error: (error as Error).message,
        });
      }
    }
    return this.templatedContent(user, strategy, brand, feedback);
  }

  // ── Gemini-backed implementations ─────────────────────────

  private async geminiMatch(user: User, strategies: Strategy[]): Promise<StrategyMatch> {
    const ids = strategies.map((s) => s.id);
    const schema: Schema = {
      type: Type.OBJECT,
      properties: {
        strategyId: { type: Type.STRING, enum: ids },
        rationale: { type: Type.STRING },
      },
      required: ['strategyId', 'rationale'],
    };

    const system =
      'You are a marketing strategist. Given one customer profile and a library of ' +
      'marketing strategies, choose the single strategy most likely to convert this ' +
      'customer. Respond ONLY with JSON matching the schema. The strategyId MUST be ' +
      'one of the provided ids. The rationale is one or two sentences explaining the ' +
      'choice in terms of this customer’s data.';

    const prompt =
      `Customer profile:\n${JSON.stringify(this.userSummary(user), null, 2)}\n\n` +
      `Available strategies:\n${JSON.stringify(
        strategies.map((s) => ({
          id: s.id,
          name: s.name,
          description: s.description,
          targetCriteria: s.targetCriteria,
          offerType: s.offerType,
        })),
        null,
        2,
      )}`;

    const result = await generateJson<StrategyMatch>({ system, prompt, schema });

    if (!result.strategyId || !ids.includes(result.strategyId)) {
      throw new Error(`Gemini returned an unknown strategyId: ${result.strategyId}`);
    }
    return { strategyId: result.strategyId, rationale: result.rationale ?? '' };
  }

  private async geminiContent(
    user: User,
    strategy: Strategy,
    brand: Brand,
    feedback?: string | null,
  ): Promise<GeneratedContent> {
    const schema: Schema = {
      type: Type.OBJECT,
      properties: {
        email: {
          type: Type.OBJECT,
          properties: {
            subject: { type: Type.STRING },
            preheader: { type: Type.STRING },
            body: { type: Type.STRING },
            ctaText: { type: Type.STRING },
            ctaUrl: { type: Type.STRING },
          },
          required: ['subject', 'preheader', 'body', 'ctaText', 'ctaUrl'],
        },
        notification: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            message: { type: Type.STRING },
            icon: { type: Type.STRING },
          },
          required: ['title', 'message'],
        },
        modal: {
          type: Type.OBJECT,
          properties: {
            headline: { type: Type.STRING },
            body: { type: Type.STRING },
            imageUrl: { type: Type.STRING },
            ctaText: { type: Type.STRING },
            ctaUrl: { type: Type.STRING },
            dismissText: { type: Type.STRING },
          },
          required: ['headline', 'body', 'ctaText', 'ctaUrl', 'dismissText'],
        },
      },
      required: ['email', 'notification', 'modal'],
    };

    const restricted = brand.restrictedKeywords?.length
      ? brand.restrictedKeywords.join(', ')
      : '(none)';
    const themes = brand.approvedThemes?.length ? brand.approvedThemes.join(', ') : '(any)';
    const valueProps = brand.valueProps?.length ? brand.valueProps.join('; ') : '(none)';

    const system =
      `You are a senior copywriter for the brand "${brand.name}". Write personalised, ` +
      'on-brand marketing content as three channels (email, in-app notification, modal ' +
      'popup). Hard rules:\n' +
      `- Brand voice: ${brand.voice ?? 'n/a'}. Tone: ${strategy.tone ?? brand.tone ?? 'friendly'}.\n` +
      `- Stay within these approved themes: ${themes}.\n` +
      `- NEVER use any of these restricted words/claims: ${restricted}.\n` +
      `- Brand value props to draw on: ${valueProps}.\n` +
      `- Target audience: ${brand.targetAudience ?? 'general'}.\n` +
      '- Keep the email body concise (a few short paragraphs), the notification under ~120 ' +
      'characters, and the modal punchy. Respond ONLY with JSON matching the schema.';

    const ctaUrl = 'https://storefront.example.com';
    const revision = feedback
      ? `\n\nIMPORTANT — the previous version was REJECTED by a human reviewer. Revise the ` +
        `content to address this feedback: "${feedback}"`
      : '';

    const prompt =
      `Generate content for this customer using the matched strategy.\n\n` +
      `Matched strategy:\n${JSON.stringify(
        {
          name: strategy.name,
          description: strategy.description,
          tone: strategy.tone,
          offerType: strategy.offerType,
          exampleCTA: strategy.exampleCTA,
          recommendedChannel: strategy.recommendedChannel,
        },
        null,
        2,
      )}\n\n` +
      `Customer profile:\n${JSON.stringify(this.userSummary(user), null, 2)}\n\n` +
      `Use this URL for every ctaUrl: ${ctaUrl}.${revision}`;

    const content = await generateJson<GeneratedContent>({ system, prompt, schema });

    if (!content.email?.subject || !content.notification?.title || !content.modal?.headline) {
      throw new Error('Gemini returned content missing required fields');
    }
    return content;
  }

  /** Compact, prompt-friendly view of the fields that drive marketing decisions. */
  private userSummary(user: User): Record<string, unknown> {
    const now = Date.now();
    const daysSinceActive = user.lastActiveAt
      ? Math.round((now - new Date(user.lastActiveAt).getTime()) / 86_400_000)
      : null;
    return {
      firstName: user.name.split(' ')[0],
      age: user.age,
      city: user.city,
      country: user.country,
      language: user.language,
      loyaltyTier: user.loyaltyTier,
      totalOrders: user.totalOrders,
      totalSpend: Number(user.totalSpend),
      avgOrderValue: Number(user.avgOrderValue),
      abandonedCarts: user.abandonedCarts,
      daysSinceActive,
      favoriteCategories: user.favoriteCategories,
      preferredChannel: user.preferredChannel,
      emailOpenRate: user.emailOpenRate,
      clickThroughRate: user.clickThroughRate,
    };
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
