import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1780737735492 implements MigrationInterface {
    name = 'Migration1780737735492'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."users_loyaltytier_enum" AS ENUM('new', 'regular', 'vip')`);
        await queryRunner.query(`CREATE TYPE "public"."users_preferredchannel_enum" AS ENUM('email', 'push')`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(120) NOT NULL, "email" character varying(180) NOT NULL, "age" integer, "gender" character varying(30), "city" character varying(100), "country" character varying(100), "language" character varying(30), "signupDate" TIMESTAMP WITH TIME ZONE, "lastActiveAt" TIMESTAMP WITH TIME ZONE, "loyaltyTier" "public"."users_loyaltytier_enum" NOT NULL DEFAULT 'new', "totalOrders" integer NOT NULL DEFAULT '0', "totalSpend" numeric(12,2) NOT NULL DEFAULT '0', "avgOrderValue" numeric(12,2) NOT NULL DEFAULT '0', "abandonedCarts" integer NOT NULL DEFAULT '0', "lastPurchaseDate" TIMESTAMP WITH TIME ZONE, "favoriteCategories" text NOT NULL DEFAULT '', "recentlyViewedProducts" jsonb NOT NULL DEFAULT '[]', "sessionsPerWeek" integer NOT NULL DEFAULT '0', "preferredDevice" character varying(30), "emailOpenRate" double precision NOT NULL DEFAULT '0', "clickThroughRate" double precision NOT NULL DEFAULT '0', "lastEmailOpenedAt" TIMESTAMP WITH TIME ZONE, "pushOptIn" boolean NOT NULL DEFAULT true, "preferredChannel" "public"."users_preferredchannel_enum" NOT NULL DEFAULT 'email', "segmentTags" text NOT NULL DEFAULT '', "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_97672ac88f789774dd47f7c8be" ON "users" ("email") `);
        await queryRunner.query(`CREATE INDEX "IDX_c972549fe46c0a5790435d72e6" ON "users" ("city") `);
        await queryRunner.query(`CREATE INDEX "IDX_82d2ea5f3f8a99449e541918b5" ON "users" ("country") `);
        await queryRunner.query(`CREATE INDEX "IDX_bf3621536b5b398309347a53a1" ON "users" ("lastActiveAt") `);
        await queryRunner.query(`CREATE INDEX "IDX_44c8552bad4821e900dbd70914" ON "users" ("loyaltyTier") `);
        await queryRunner.query(`CREATE TYPE "public"."strategies_recommendedchannel_enum" AS ENUM('email', 'push')`);
        await queryRunner.query(`CREATE TABLE "strategies" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(140) NOT NULL, "description" text NOT NULL, "targetCriteria" text, "tone" character varying(120), "recommendedChannel" "public"."strategies_recommendedchannel_enum", "exampleCTA" character varying(200), "offerType" character varying(80), "weight" double precision NOT NULL DEFAULT '1', "isActive" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_9a0d363ddf5b40d080147363238" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."performance_events_event_enum" AS ENUM('delivered', 'opened', 'clicked', 'converted', 'dismissed')`);
        await queryRunner.query(`CREATE TABLE "performance_events" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "campaignItemId" uuid NOT NULL, "userId" uuid NOT NULL, "strategyId" uuid, "event" "public"."performance_events_event_enum" NOT NULL, "timestamp" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_262d932924784379937f3568ce8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_265579f61b7337fc1fd5e9934b" ON "performance_events" ("campaignItemId") `);
        await queryRunner.query(`CREATE INDEX "IDX_4f3b98112f27858bfbf1d1e924" ON "performance_events" ("userId") `);
        await queryRunner.query(`CREATE INDEX "IDX_4854a6610da9dcf7cc0727ef38" ON "performance_events" ("strategyId") `);
        await queryRunner.query(`CREATE TYPE "public"."marketers_role_enum" AS ENUM('admin', 'marketer')`);
        await queryRunner.query(`CREATE TABLE "marketers" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(120) NOT NULL, "email" character varying(180) NOT NULL, "passwordHash" character varying NOT NULL, "role" "public"."marketers_role_enum" NOT NULL DEFAULT 'marketer', "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_1838a00b73955afbb005a496baa" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_3bfa1d4dbfb6259b35ffd7f0fc" ON "marketers" ("email") `);
        await queryRunner.query(`CREATE TYPE "public"."campaign_items_status_enum" AS ENUM('draft', 'pending', 'approved', 'rejected', 'sent')`);
        await queryRunner.query(`CREATE TABLE "campaign_items" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "campaignId" uuid NOT NULL, "userId" uuid NOT NULL, "matchedStrategyId" uuid, "rationale" text, "status" "public"."campaign_items_status_enum" NOT NULL DEFAULT 'draft', "feedback" text, "regeneratedFromId" uuid, "content" jsonb, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_9feb2582332b7118d2508790db8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_cfeb1ba9c5b19a255188446bc8" ON "campaign_items" ("campaignId") `);
        await queryRunner.query(`CREATE INDEX "IDX_e7158e767e0f0e3d5df15e0f3a" ON "campaign_items" ("userId") `);
        await queryRunner.query(`CREATE INDEX "IDX_b554bd78da8d62fcda7e7bd1fe" ON "campaign_items" ("status") `);
        await queryRunner.query(`CREATE TYPE "public"."campaigns_status_enum" AS ENUM('draft', 'active', 'completed')`);
        await queryRunner.query(`CREATE TABLE "campaigns" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(160) NOT NULL, "marketerId" uuid NOT NULL, "status" "public"."campaigns_status_enum" NOT NULL DEFAULT 'draft', "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_831e3fcd4fc45b4e4c3f57a9ee4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_f072d990a72d0096ae833b1fb2" ON "campaigns" ("marketerId") `);
        await queryRunner.query(`CREATE INDEX "IDX_8b6b94352da69af03dbaf87c63" ON "campaigns" ("status") `);
        await queryRunner.query(`CREATE TABLE "brands" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(120) NOT NULL, "tagline" character varying(200), "mission" text, "voice" character varying(120), "tone" character varying(120), "valueProps" jsonb NOT NULL DEFAULT '[]', "colorPalette" jsonb, "typography" jsonb, "approvedThemes" text NOT NULL DEFAULT '', "restrictedKeywords" text NOT NULL DEFAULT '', "targetAudience" text, "productCategories" text NOT NULL DEFAULT '', "logoUrl" character varying(500), "isDefault" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_b0c437120b624da1034a81fc561" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "campaign_items" ADD CONSTRAINT "FK_cfeb1ba9c5b19a255188446bc8a" FOREIGN KEY ("campaignId") REFERENCES "campaigns"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "campaign_items" ADD CONSTRAINT "FK_e7158e767e0f0e3d5df15e0f3ac" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "campaign_items" ADD CONSTRAINT "FK_7f02456f614fe6452fa758bce18" FOREIGN KEY ("matchedStrategyId") REFERENCES "strategies"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "campaigns" ADD CONSTRAINT "FK_f072d990a72d0096ae833b1fb22" FOREIGN KEY ("marketerId") REFERENCES "marketers"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "campaigns" DROP CONSTRAINT "FK_f072d990a72d0096ae833b1fb22"`);
        await queryRunner.query(`ALTER TABLE "campaign_items" DROP CONSTRAINT "FK_7f02456f614fe6452fa758bce18"`);
        await queryRunner.query(`ALTER TABLE "campaign_items" DROP CONSTRAINT "FK_e7158e767e0f0e3d5df15e0f3ac"`);
        await queryRunner.query(`ALTER TABLE "campaign_items" DROP CONSTRAINT "FK_cfeb1ba9c5b19a255188446bc8a"`);
        await queryRunner.query(`DROP TABLE "brands"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_8b6b94352da69af03dbaf87c63"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_f072d990a72d0096ae833b1fb2"`);
        await queryRunner.query(`DROP TABLE "campaigns"`);
        await queryRunner.query(`DROP TYPE "public"."campaigns_status_enum"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b554bd78da8d62fcda7e7bd1fe"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_e7158e767e0f0e3d5df15e0f3a"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_cfeb1ba9c5b19a255188446bc8"`);
        await queryRunner.query(`DROP TABLE "campaign_items"`);
        await queryRunner.query(`DROP TYPE "public"."campaign_items_status_enum"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_3bfa1d4dbfb6259b35ffd7f0fc"`);
        await queryRunner.query(`DROP TABLE "marketers"`);
        await queryRunner.query(`DROP TYPE "public"."marketers_role_enum"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_4854a6610da9dcf7cc0727ef38"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_4f3b98112f27858bfbf1d1e924"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_265579f61b7337fc1fd5e9934b"`);
        await queryRunner.query(`DROP TABLE "performance_events"`);
        await queryRunner.query(`DROP TYPE "public"."performance_events_event_enum"`);
        await queryRunner.query(`DROP TABLE "strategies"`);
        await queryRunner.query(`DROP TYPE "public"."strategies_recommendedchannel_enum"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_44c8552bad4821e900dbd70914"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_bf3621536b5b398309347a53a1"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_82d2ea5f3f8a99449e541918b5"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_c972549fe46c0a5790435d72e6"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_97672ac88f789774dd47f7c8be"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TYPE "public"."users_preferredchannel_enum"`);
        await queryRunner.query(`DROP TYPE "public"."users_loyaltytier_enum"`);
    }

}
