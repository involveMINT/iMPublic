import {MigrationInterface, QueryRunner} from "typeorm";

export class AutoMigration202601060242461767667367145 implements MigrationInterface {
    name = 'AutoMigration202601060242461767667367145'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."User" DROP COLUMN "updatedAt"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."User" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
    }

}
