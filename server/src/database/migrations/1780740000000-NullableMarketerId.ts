import { MigrationInterface, QueryRunner } from "typeorm";

export class NullableMarketerId1780740000000 implements MigrationInterface {
    name = 'NullableMarketerId1780740000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "campaigns" ALTER COLUMN "marketerId" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "campaigns" ALTER COLUMN "marketerId" SET NOT NULL`);
    }
}
