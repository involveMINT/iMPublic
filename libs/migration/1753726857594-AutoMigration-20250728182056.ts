import {MigrationInterface, QueryRunner} from "typeorm";

export class AutoMigration202507281820561753726857594 implements MigrationInterface {
    name = 'AutoMigration202507281820561753726857594'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."Offer" ALTER COLUMN "dateUpdated" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "public"."Offer" ALTER COLUMN "dateCreated" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "public"."QuestionAnswer" ALTER COLUMN "dateAnswered" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "public"."Poi" ALTER COLUMN "dateCreated" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "public"."Project" ALTER COLUMN "dateCreated" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "public"."Project" ALTER COLUMN "dateUpdated" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "public"."Request" ALTER COLUMN "dateUpdated" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "public"."Request" ALTER COLUMN "dateCreated" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "public"."ServePartner" ALTER COLUMN "dateCreated" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "public"."SpApplication" ALTER COLUMN "dateCreated" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "public"."EpApplication" ALTER COLUMN "dateCreated" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "public"."User" ALTER COLUMN "dateCreated" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "public"."ExchangePartner" ALTER COLUMN "dateCreated" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "public"."ChangeMaker" ALTER COLUMN "dateCreated" SET DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."ChangeMaker" ALTER COLUMN "dateCreated" SET DEFAULT '2025-07-28 18:14:40.856965'`);
        await queryRunner.query(`ALTER TABLE "public"."ExchangePartner" ALTER COLUMN "dateCreated" SET DEFAULT '2025-07-28 18:14:40.856965'`);
        await queryRunner.query(`ALTER TABLE "public"."User" ALTER COLUMN "dateCreated" SET DEFAULT '2025-07-28 18:14:40.856965'`);
        await queryRunner.query(`ALTER TABLE "public"."EpApplication" ALTER COLUMN "dateCreated" SET DEFAULT '2025-07-28 18:14:40.856965'`);
        await queryRunner.query(`ALTER TABLE "public"."SpApplication" ALTER COLUMN "dateCreated" SET DEFAULT '2025-07-28 18:14:40.856965'`);
        await queryRunner.query(`ALTER TABLE "public"."ServePartner" ALTER COLUMN "dateCreated" SET DEFAULT '2025-07-28 18:14:40.856965'`);
        await queryRunner.query(`ALTER TABLE "public"."Request" ALTER COLUMN "dateCreated" SET DEFAULT '2025-07-28 18:14:40.856965'`);
        await queryRunner.query(`ALTER TABLE "public"."Request" ALTER COLUMN "dateUpdated" SET DEFAULT '2025-07-28 18:14:40.856965'`);
        await queryRunner.query(`ALTER TABLE "public"."Project" ALTER COLUMN "dateUpdated" SET DEFAULT '2025-07-28 18:14:40.856965'`);
        await queryRunner.query(`ALTER TABLE "public"."Project" ALTER COLUMN "dateCreated" SET DEFAULT '2025-07-28 18:14:40.856965'`);
        await queryRunner.query(`ALTER TABLE "public"."Poi" ALTER COLUMN "dateCreated" SET DEFAULT '2025-07-28 18:14:40.856965'`);
        await queryRunner.query(`ALTER TABLE "public"."QuestionAnswer" ALTER COLUMN "dateAnswered" SET DEFAULT '2025-07-28 18:14:40.856965'`);
        await queryRunner.query(`ALTER TABLE "public"."Offer" ALTER COLUMN "dateCreated" SET DEFAULT '2025-07-28 18:14:40.856965'`);
        await queryRunner.query(`ALTER TABLE "public"."Offer" ALTER COLUMN "dateUpdated" SET DEFAULT '2025-07-28 18:14:40.856965'`);
    }

}
