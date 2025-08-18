import {MigrationInterface, QueryRunner} from "typeorm";

export class AutoMigration202508182246111755557172047 implements MigrationInterface {
    name = 'AutoMigration202508182246111755557172047'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "Like" ("id" text NOT NULL, "dateCreated" TIMESTAMP NOT NULL, "activityPostId" text, "userId" text, CONSTRAINT "PK_20ede1755cb694ecf15674c8ba1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "Comment" ("id" text NOT NULL, "text" character varying NOT NULL, "dateCreated" TIMESTAMP NOT NULL, "hidden" boolean NOT NULL, "flagCount" integer NOT NULL, "handleId" character varying NOT NULL, "profilePicFilePath" character varying NOT NULL, "name" character varying NOT NULL, "activityPostId" text, "userId" text, CONSTRAINT "PK_fe8d6bf0fcb531dfa75f3fd5bdb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "Flag" ("id" text NOT NULL, "dateCreated" TIMESTAMP NOT NULL, "commentId" text, "userId" text, CONSTRAINT "PK_ca0da55ac1aec5f42f197afc39e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "ActivityPost" ("id" text NOT NULL, "likeCount" integer NOT NULL, "dateCreated" TIMESTAMP NOT NULL, "enabled" boolean NOT NULL, "poiId" text NOT NULL, "userId" text, CONSTRAINT "REL_9f7812fc2503e58e70796546b2" UNIQUE ("poiId"), CONSTRAINT "PK_937ebf4d1d42860c4ee7326ca90" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "public"."User" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "Like" ADD CONSTRAINT "FK_6a0d3a77576feab655a1e6b03e2" FOREIGN KEY ("activityPostId") REFERENCES "ActivityPost"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Like" ADD CONSTRAINT "FK_e1ac421f1e6a1da63df580c62e4" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Comment" ADD CONSTRAINT "FK_a7011d5a4934de29db98c92b95d" FOREIGN KEY ("activityPostId") REFERENCES "ActivityPost"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Comment" ADD CONSTRAINT "FK_4c827119c9554affb8018d4da82" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Flag" ADD CONSTRAINT "FK_a315308e8fedf2c24e2f1777d7b" FOREIGN KEY ("commentId") REFERENCES "Comment"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Flag" ADD CONSTRAINT "FK_a9c159365c294d259d00fb262a4" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "ActivityPost" ADD CONSTRAINT "FK_9f7812fc2503e58e70796546b2d" FOREIGN KEY ("poiId") REFERENCES "Poi"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "ActivityPost" ADD CONSTRAINT "FK_1181652eb17c046ad011c4be5d8" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ActivityPost" DROP CONSTRAINT "FK_1181652eb17c046ad011c4be5d8"`);
        await queryRunner.query(`ALTER TABLE "ActivityPost" DROP CONSTRAINT "FK_9f7812fc2503e58e70796546b2d"`);
        await queryRunner.query(`ALTER TABLE "Flag" DROP CONSTRAINT "FK_a9c159365c294d259d00fb262a4"`);
        await queryRunner.query(`ALTER TABLE "Flag" DROP CONSTRAINT "FK_a315308e8fedf2c24e2f1777d7b"`);
        await queryRunner.query(`ALTER TABLE "Comment" DROP CONSTRAINT "FK_4c827119c9554affb8018d4da82"`);
        await queryRunner.query(`ALTER TABLE "Comment" DROP CONSTRAINT "FK_a7011d5a4934de29db98c92b95d"`);
        await queryRunner.query(`ALTER TABLE "Like" DROP CONSTRAINT "FK_e1ac421f1e6a1da63df580c62e4"`);
        await queryRunner.query(`ALTER TABLE "Like" DROP CONSTRAINT "FK_6a0d3a77576feab655a1e6b03e2"`);
        await queryRunner.query(`ALTER TABLE "public"."User" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`DROP TABLE "ActivityPost"`);
        await queryRunner.query(`DROP TABLE "Flag"`);
        await queryRunner.query(`DROP TABLE "Comment"`);
        await queryRunner.query(`DROP TABLE "Like"`);
    }

}
