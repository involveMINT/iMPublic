import {MigrationInterface, QueryRunner} from "typeorm";

export class AddCreditDebt1780666911854 implements MigrationInterface {
    name = 'AddCreditDebt1780666911854'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."ChangeMaker" ADD "creditDebt" integer NOT NULL DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE "public"."ExchangePartner" ADD "creditDebt" integer NOT NULL DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE "public"."ServePartner" ADD "creditDebt" integer NOT NULL DEFAULT 0`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."ServePartner" DROP COLUMN "creditDebt"`);
        await queryRunner.query(`ALTER TABLE "public"."ExchangePartner" DROP COLUMN "creditDebt"`);
        await queryRunner.query(`ALTER TABLE "public"."ChangeMaker" DROP COLUMN "creditDebt"`);
    }

}
