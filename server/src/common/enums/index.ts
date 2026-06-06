/** Shared domain enums used across modules and entities. */

export enum Role {
  ADMIN = 'admin',
  MARKETER = 'marketer',
}

export enum LoyaltyTier {
  NEW = 'new',
  REGULAR = 'regular',
  VIP = 'vip',
}

export enum Channel {
  EMAIL = 'email',
  PUSH = 'push',
}

export enum CampaignStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  COMPLETED = 'completed',
}

export enum CampaignItemStatus {
  DRAFT = 'draft',
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  SENT = 'sent',
}

export enum PerformanceEventType {
  DELIVERED = 'delivered',
  OPENED = 'opened',
  CLICKED = 'clicked',
  CONVERTED = 'converted',
  DISMISSED = 'dismissed',
}
