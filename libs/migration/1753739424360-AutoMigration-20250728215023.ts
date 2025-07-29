import {MigrationInterface, QueryRunner} from "typeorm";

export class AutoMigration202507282150231753739424360 implements MigrationInterface {
    name = 'AutoMigration202507282150231753739424360'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "Voucher" ("id" text NOT NULL, "code" character varying NOT NULL, "amount" integer NOT NULL, "dateCreated" TIMESTAMP NOT NULL, "buyerId" text, "dateExpires" TIMESTAMP, "dateRefunded" TIMESTAMP, "dateArchived" TIMESTAMP, "dateRedeemed" TIMESTAMP, "sellerId" text NOT NULL, "changeMakerReceiverId" text, "servePartnerReceiverId" text, "exchangePartnerReceiverId" text, CONSTRAINT "PK_27e642ace1848e154866e807c58" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "LinkedVoucherOffer" ("id" text NOT NULL, "quantity" integer NOT NULL, "voucherId" text, "offerId" text, CONSTRAINT "PK_63426b3b971945e3e38295768c0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "Offer" ("id" text NOT NULL, "listingStatus" text NOT NULL DEFAULT 'private', "name" character varying NOT NULL, "description" character varying NOT NULL, "price" integer NOT NULL, "imagesFilePaths" text array NOT NULL DEFAULT '{}', "dateUpdated" TIMESTAMP NOT NULL DEFAULT now(), "dateCreated" TIMESTAMP NOT NULL DEFAULT now(), "changeMakerId" text, "exchangePartnerId" text, "servePartnerId" text, CONSTRAINT "PK_0ef6b03361b2e15ea4c60e1e536" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "PassportDocuments" ("id" text NOT NULL, "filePath" character varying NOT NULL, "name" character varying NOT NULL, "uploadedDate" TIMESTAMP NOT NULL, "changeMakerId" text, CONSTRAINT "PK_52e7d563be4b4a52dfa1d2d2523" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "ProjectDocument" ("id" text NOT NULL, "title" character varying NOT NULL, "description" character varying NOT NULL, "infoUrl" character varying NOT NULL, "projectId" text, CONSTRAINT "PK_9d9f4eb4d3bfcdefeb02b308d38" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "EnrollmentDocument" ("id" text NOT NULL, "passportDocumentId" text, "projectDocumentId" text, "enrollmentId" text, CONSTRAINT "PK_18d49217fb2c43edb2d66bd0124" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "Question" ("id" text NOT NULL, "text" character varying NOT NULL, "projectId" text, CONSTRAINT "PK_1a855c8b4f527c9633c4b054675" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "QuestionAnswer" ("id" text NOT NULL, "answer" character varying NOT NULL, "dateAnswered" TIMESTAMP NOT NULL DEFAULT now(), "questionId" text, "poiId" text, CONSTRAINT "PK_e047c446cfc221e3b516a5fe69b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "Task" ("id" text NOT NULL, "poiId" text NOT NULL, CONSTRAINT "REL_b2eb962320e895df918d2e824a" UNIQUE ("poiId"), CONSTRAINT "PK_95d9364b8115119ba8b15a43592" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "Poi" ("id" text NOT NULL, "dateCreated" TIMESTAMP NOT NULL DEFAULT now(), "dateStarted" TIMESTAMP, "dateStopped" TIMESTAMP, "dateSubmitted" TIMESTAMP, "dateApproved" TIMESTAMP, "dateDenied" TIMESTAMP, "imagesFilePaths" text array DEFAULT '{}', "pausedTimes" text array, "resumedTimes" text array, "longitude" double precision, "latitude" double precision, "enrollmentId" text, CONSTRAINT "PK_101b759c3c5200a5e040a6874a0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "Enrollment" ("id" text NOT NULL, "dateApplied" TIMESTAMP NOT NULL, "dateSubmitted" TIMESTAMP, "dateApproved" TIMESTAMP, "dateDenied" TIMESTAMP, "dateRetired" TIMESTAMP, "acceptedWaiver" boolean NOT NULL DEFAULT false, "changeMakerId" text, "projectId" text, CONSTRAINT "PK_ac7f1af7e63bbfc10e7dd9d588a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "Project" ("id" text NOT NULL, "description" character varying NOT NULL, "listingStatus" text NOT NULL DEFAULT 'private', "title" character varying NOT NULL, "city" character varying NOT NULL DEFAULT '', "state" character varying NOT NULL DEFAULT '', "imagesFilePaths" text array NOT NULL DEFAULT '{}', "creditsEarned" integer NOT NULL DEFAULT '12000', "preferredScheduleOfWork" character varying NOT NULL DEFAULT '', "startDate" TIMESTAMP, "endDate" TIMESTAMP, "requireLocation" boolean NOT NULL DEFAULT true, "requireImages" boolean NOT NULL DEFAULT true, "maxChangeMakers" integer NOT NULL DEFAULT '5', "dateCreated" TIMESTAMP NOT NULL DEFAULT now(), "dateUpdated" TIMESTAMP NOT NULL DEFAULT now(), "requireCustomWaiver" boolean NOT NULL DEFAULT false, "customWaiverFilePath" character varying, "addressId" text NOT NULL, "servePartnerId" text, CONSTRAINT "REL_6bb3e01a58f76f83c428906562" UNIQUE ("addressId"), CONSTRAINT "PK_2725f461500317f74b0c8f11859" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "Request" ("id" text NOT NULL, "listingStatus" text NOT NULL DEFAULT 'private', "name" character varying NOT NULL, "description" character varying NOT NULL, "priceStatus" boolean NOT NULL, "price" integer NOT NULL, "imagesFilePaths" text array NOT NULL DEFAULT '{}', "dateUpdated" TIMESTAMP NOT NULL DEFAULT now(), "dateCreated" TIMESTAMP NOT NULL DEFAULT now(), "changeMakerId" text, "exchangePartnerId" text, "servePartnerId" text, CONSTRAINT "PK_23de24dc477765bcc099feae8e5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "ServeAdmin" ("id" text NOT NULL, "datePermitted" TIMESTAMP NOT NULL, "superAdmin" boolean NOT NULL, "userId" text, "servePartnerId" text, CONSTRAINT "PK_b8b5bf8fccbdc89a33b255c7dc8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "Transaction" ("id" text NOT NULL, "dateTransacted" TIMESTAMP NOT NULL, "amount" integer NOT NULL, "memo" character varying NOT NULL, "epAudibleCode" character varying, "senderChangeMakerId" text, "senderServePartnerId" text, "senderExchangePartnerId" text, "receiverChangeMakerId" text, "receiverServePartnerId" text, "receiverExchangePartnerId" text, CONSTRAINT "PK_21eda4daffd2c60f76b81a270e9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "ServePartner" ("id" text NOT NULL, "email" character varying NOT NULL, "name" character varying NOT NULL, "phone" character varying NOT NULL, "website" character varying NOT NULL, "logoFilePath" character varying, "imagesFilePaths" text array NOT NULL DEFAULT '{}', "description" character varying, "latitude" double precision, "longitude" double precision, "dateCreated" TIMESTAMP NOT NULL DEFAULT now(), "handleId" text, "addressId" text, CONSTRAINT "REL_68484a7c54b51eb8b56790d974" UNIQUE ("handleId"), CONSTRAINT "REL_954cbae03d9ebe2eacae0718c7" UNIQUE ("addressId"), CONSTRAINT "PK_408709dd0d946b4620112a13bf1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "SpApplication" ("id" text NOT NULL, "email" character varying NOT NULL, "name" character varying NOT NULL, "phone" character varying NOT NULL, "website" character varying NOT NULL, "dateCreated" TIMESTAMP NOT NULL DEFAULT now(), "userId" text, "handleId" text, "addressId" text, CONSTRAINT "REL_67cccab339c825f0bf6e30879f" UNIQUE ("handleId"), CONSTRAINT "REL_35cf008fac5b3ff7ac83576301" UNIQUE ("addressId"), CONSTRAINT "PK_5976f8bbda37090d553adc57057" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "Handle" ("id" text NOT NULL, CONSTRAINT "PK_c2c7ff10dbdb9c50b2afb5e091c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "EpApplication" ("id" text NOT NULL, "email" character varying NOT NULL, "name" character varying NOT NULL, "phone" character varying NOT NULL, "website" character varying NOT NULL, "ein" character varying NOT NULL, "dateCreated" TIMESTAMP NOT NULL DEFAULT now(), "userId" text, "handleId" text, "addressId" text, CONSTRAINT "REL_973dfa7a23628937821ffd328f" UNIQUE ("handleId"), CONSTRAINT "REL_07d604ec0d32e5334fa26c0292" UNIQUE ("addressId"), CONSTRAINT "PK_51c44f8c0ce4f998d38fa67783d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "User" ("id" text NOT NULL, "passwordHash" character varying NOT NULL, "salt" character varying NOT NULL, "dateCreated" TIMESTAMP NOT NULL DEFAULT now(), "dateLastLoggedIn" TIMESTAMP, "active" boolean NOT NULL DEFAULT false, "activationHash" character varying, "forgotPasswordHash" character varying, "joyride" boolean NOT NULL DEFAULT true, "baAdmin" boolean NOT NULL DEFAULT false, "changeMakerId" text, CONSTRAINT "REL_f5e0492fcd672c2c91746acdc0" UNIQUE ("changeMakerId"), CONSTRAINT "PK_9862f679340fb2388436a5ab3e4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "ExchangeAdmin" ("id" text NOT NULL, "datePermitted" TIMESTAMP NOT NULL, "superAdmin" boolean NOT NULL, "userId" text, "exchangePartnerId" text, CONSTRAINT "PK_2d72d983502d7dd36e8842d1eca" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "ExchangePartner" ("id" text NOT NULL, "name" character varying NOT NULL, "description" character varying, "logoFilePath" character varying, "website" character varying NOT NULL, "phone" character varying NOT NULL, "email" character varying NOT NULL, "ein" character varying NOT NULL, "imagesFilePaths" text array NOT NULL DEFAULT '{}', "listStoreFront" text NOT NULL DEFAULT 'public', "budgetEndDate" TIMESTAMP NOT NULL, "budget" integer NOT NULL, "latitude" double precision, "longitude" double precision, "dateCreated" TIMESTAMP NOT NULL DEFAULT now(), "onboardingState" text NOT NULL DEFAULT 'profile', "handleId" text, "addressId" text, CONSTRAINT "REL_b7a0006cfb175082edfc0d2f4c" UNIQUE ("handleId"), CONSTRAINT "REL_0c9b4192c0445335081172ac00" UNIQUE ("addressId"), CONSTRAINT "PK_58ad6f1ff19eb957da86a8bc214" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "Credit" ("id" text NOT NULL, "amount" integer NOT NULL, "dateMinted" TIMESTAMP NOT NULL, "escrow" boolean NOT NULL DEFAULT false, "poiId" text, "changeMakerId" text, "servePartnerId" text, "exchangePartnerId" text, CONSTRAINT "PK_0259fe923620fe8d5b83efdfab7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "ChangeMaker" ("id" text NOT NULL, "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "profilePicFilePath" character varying, "bio" character varying, "phone" character varying NOT NULL, "onboardingState" text NOT NULL, "dateCreated" TIMESTAMP NOT NULL DEFAULT now(), "handleId" text, "addressId" text, CONSTRAINT "REL_32866fe4806ac169a973e00e84" UNIQUE ("handleId"), CONSTRAINT "REL_44e1d983a01fb525502a0b2f25" UNIQUE ("addressId"), CONSTRAINT "PK_54fe68c67625fe50c172604ed37" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "Address" ("id" text NOT NULL, "address1" character varying NOT NULL, "address2" character varying, "address3" character varying, "city" character varying NOT NULL, "state" character varying NOT NULL, "zip" character varying NOT NULL, "country" character varying NOT NULL DEFAULT 'Unites States', CONSTRAINT "PK_9034683839599c80ebe9ebb0891" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "Voucher" ADD CONSTRAINT "FK_9b54ceb7cbea4a6e390ab945dba" FOREIGN KEY ("sellerId") REFERENCES "ExchangePartner"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Voucher" ADD CONSTRAINT "FK_98503350ec4fe8d403db4bd6ce7" FOREIGN KEY ("changeMakerReceiverId") REFERENCES "ChangeMaker"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Voucher" ADD CONSTRAINT "FK_f2de97c8d5c6c94727ef39e2ac9" FOREIGN KEY ("servePartnerReceiverId") REFERENCES "ServePartner"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Voucher" ADD CONSTRAINT "FK_a34735f1e38bdb1022a92fa9605" FOREIGN KEY ("exchangePartnerReceiverId") REFERENCES "ExchangePartner"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "LinkedVoucherOffer" ADD CONSTRAINT "FK_334750ebb72c65fd023035b8c87" FOREIGN KEY ("voucherId") REFERENCES "Voucher"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "LinkedVoucherOffer" ADD CONSTRAINT "FK_3afdd1c234688b1627106472c02" FOREIGN KEY ("offerId") REFERENCES "Offer"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Offer" ADD CONSTRAINT "FK_7b0364c2bb2da607082abff555c" FOREIGN KEY ("changeMakerId") REFERENCES "ChangeMaker"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Offer" ADD CONSTRAINT "FK_783dc3120239cbd1e3d21b7a959" FOREIGN KEY ("exchangePartnerId") REFERENCES "ExchangePartner"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Offer" ADD CONSTRAINT "FK_e596de68b330fc1e0fc3590d34e" FOREIGN KEY ("servePartnerId") REFERENCES "ServePartner"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "PassportDocuments" ADD CONSTRAINT "FK_4a6a391b2f4398736bbc6e23580" FOREIGN KEY ("changeMakerId") REFERENCES "ChangeMaker"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "ProjectDocument" ADD CONSTRAINT "FK_d7222e49b0dcd50d094f805f757" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "EnrollmentDocument" ADD CONSTRAINT "FK_b970304063ad41f1355a283cb88" FOREIGN KEY ("passportDocumentId") REFERENCES "PassportDocuments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "EnrollmentDocument" ADD CONSTRAINT "FK_93558630be3db34763157714db5" FOREIGN KEY ("projectDocumentId") REFERENCES "ProjectDocument"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "EnrollmentDocument" ADD CONSTRAINT "FK_8dee704155365614ba0d87e649d" FOREIGN KEY ("enrollmentId") REFERENCES "Enrollment"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Question" ADD CONSTRAINT "FK_0d1ec0cf0da31f4a4dd3fddeefc" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "QuestionAnswer" ADD CONSTRAINT "FK_86369bace6607752e523da65219" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "QuestionAnswer" ADD CONSTRAINT "FK_b694cdcf11ff9e48444b850fee2" FOREIGN KEY ("poiId") REFERENCES "Poi"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Task" ADD CONSTRAINT "FK_b2eb962320e895df918d2e824a8" FOREIGN KEY ("poiId") REFERENCES "Poi"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Poi" ADD CONSTRAINT "FK_d117c772f2c1738ca70de6af519" FOREIGN KEY ("enrollmentId") REFERENCES "Enrollment"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Enrollment" ADD CONSTRAINT "FK_5b1cc4336c417c1de24379237cd" FOREIGN KEY ("changeMakerId") REFERENCES "ChangeMaker"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Enrollment" ADD CONSTRAINT "FK_dbb6dbcb6b97c0bdd3fd599c902" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Project" ADD CONSTRAINT "FK_6bb3e01a58f76f83c4289065624" FOREIGN KEY ("addressId") REFERENCES "Address"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Project" ADD CONSTRAINT "FK_7de99bc82da27e9b97a872560ea" FOREIGN KEY ("servePartnerId") REFERENCES "ServePartner"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Request" ADD CONSTRAINT "FK_4b541ca3ec79da6ce8bb635926d" FOREIGN KEY ("changeMakerId") REFERENCES "ChangeMaker"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Request" ADD CONSTRAINT "FK_93d1f16c8cb52783f6671b79802" FOREIGN KEY ("exchangePartnerId") REFERENCES "ExchangePartner"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Request" ADD CONSTRAINT "FK_4bef1f1ae8af599ffd81f84a53a" FOREIGN KEY ("servePartnerId") REFERENCES "ServePartner"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "ServeAdmin" ADD CONSTRAINT "FK_372aa1b184ea6abb2de21ffad3f" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "ServeAdmin" ADD CONSTRAINT "FK_0873fb86f776db4d4cb4e52be10" FOREIGN KEY ("servePartnerId") REFERENCES "ServePartner"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Transaction" ADD CONSTRAINT "FK_37c7a8d288563c57049fc65e04e" FOREIGN KEY ("senderChangeMakerId") REFERENCES "ChangeMaker"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Transaction" ADD CONSTRAINT "FK_0127b6ce74ed613c8b24fd091eb" FOREIGN KEY ("senderServePartnerId") REFERENCES "ServePartner"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Transaction" ADD CONSTRAINT "FK_e002d35ba0e8f7fb84a92e06378" FOREIGN KEY ("senderExchangePartnerId") REFERENCES "ExchangePartner"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Transaction" ADD CONSTRAINT "FK_eeed95b6fb3599920208cbe3bb0" FOREIGN KEY ("receiverChangeMakerId") REFERENCES "ChangeMaker"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Transaction" ADD CONSTRAINT "FK_8167c92a213ac25cc8504506945" FOREIGN KEY ("receiverServePartnerId") REFERENCES "ServePartner"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Transaction" ADD CONSTRAINT "FK_3b9da05f598e977ccf4798c0608" FOREIGN KEY ("receiverExchangePartnerId") REFERENCES "ExchangePartner"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "ServePartner" ADD CONSTRAINT "FK_68484a7c54b51eb8b56790d9741" FOREIGN KEY ("handleId") REFERENCES "Handle"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "ServePartner" ADD CONSTRAINT "FK_954cbae03d9ebe2eacae0718c7a" FOREIGN KEY ("addressId") REFERENCES "Address"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "SpApplication" ADD CONSTRAINT "FK_61b3e44801ad43168649908465c" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "SpApplication" ADD CONSTRAINT "FK_67cccab339c825f0bf6e30879f4" FOREIGN KEY ("handleId") REFERENCES "Handle"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "SpApplication" ADD CONSTRAINT "FK_35cf008fac5b3ff7ac83576301c" FOREIGN KEY ("addressId") REFERENCES "Address"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "EpApplication" ADD CONSTRAINT "FK_2ad85c630c703c98e8c66717261" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "EpApplication" ADD CONSTRAINT "FK_973dfa7a23628937821ffd328f9" FOREIGN KEY ("handleId") REFERENCES "Handle"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "EpApplication" ADD CONSTRAINT "FK_07d604ec0d32e5334fa26c02922" FOREIGN KEY ("addressId") REFERENCES "Address"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "User" ADD CONSTRAINT "FK_f5e0492fcd672c2c91746acdc08" FOREIGN KEY ("changeMakerId") REFERENCES "ChangeMaker"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "ExchangeAdmin" ADD CONSTRAINT "FK_81ba13e134d98c00a754f4779c1" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "ExchangeAdmin" ADD CONSTRAINT "FK_a91d2e737b71cbc0badbe71a91c" FOREIGN KEY ("exchangePartnerId") REFERENCES "ExchangePartner"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "ExchangePartner" ADD CONSTRAINT "FK_b7a0006cfb175082edfc0d2f4c9" FOREIGN KEY ("handleId") REFERENCES "Handle"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "ExchangePartner" ADD CONSTRAINT "FK_0c9b4192c0445335081172ac001" FOREIGN KEY ("addressId") REFERENCES "Address"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Credit" ADD CONSTRAINT "FK_bbbb01036aad7f2835ed698a35f" FOREIGN KEY ("poiId") REFERENCES "Poi"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Credit" ADD CONSTRAINT "FK_ad55557a6bf2e6390acc5221e8b" FOREIGN KEY ("changeMakerId") REFERENCES "ChangeMaker"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Credit" ADD CONSTRAINT "FK_09f6cf1cabed200ae7d2c543148" FOREIGN KEY ("servePartnerId") REFERENCES "ServePartner"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Credit" ADD CONSTRAINT "FK_ef7add62d8be3df7a9c2eb3e1cf" FOREIGN KEY ("exchangePartnerId") REFERENCES "ExchangePartner"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "ChangeMaker" ADD CONSTRAINT "FK_32866fe4806ac169a973e00e840" FOREIGN KEY ("handleId") REFERENCES "Handle"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "ChangeMaker" ADD CONSTRAINT "FK_44e1d983a01fb525502a0b2f257" FOREIGN KEY ("addressId") REFERENCES "Address"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`CREATE VIEW "exchange_partner_view_entity" AS 
    WITH "t" AS (
      SELECT
        "ExchangePartner"."id" AS "id",
        SUM("Transaction"."amount")::int AS "receivedThisMonth"
      FROM
        "ExchangePartner" "ExchangePartner",
        "Transaction" "Transaction"
      WHERE
        "ExchangePartner"."id" = "Transaction"."receiverExchangePartnerId"
      AND
        "Transaction"."dateTransacted" > ("ExchangePartner"."budgetEndDate" - '1 month'::interval)
      GROUP BY
        "ExchangePartner"."id"

      UNION ALL

      SELECT
        "ExchangePartner"."id" AS "id",
        0::int AS "receivedThisMonth"
      FROM
        "ExchangePartner" "ExchangePartner"

    ), "v" AS (
      SELECT
        "ExchangePartner"."id" AS "id",
        SUM("Voucher"."amount")::int AS "receivedThisMonth"
      FROM
        "ExchangePartner" "ExchangePartner",
        "Voucher" "Voucher"
      WHERE
        "Voucher"."sellerId" = "ExchangePartner"."id"
      AND
        "Voucher"."dateCreated" > ("ExchangePartner"."budgetEndDate" - '1 month'::interval)
      AND
        "Voucher"."dateRedeemed" IS NULL
      AND
        "Voucher"."dateRefunded" IS NULL
      GROUP BY
        "ExchangePartner"."id"

      UNION ALL

      SELECT
        "ExchangePartner"."id" AS "id",
        0::int AS "receivedThisMonth"
      FROM
        "ExchangePartner" "ExchangePartner"
      )

    SELECT
    "ExchangePartner"."id" AS "id",
    SUM(DISTINCT "t"."receivedThisMonth")::int + SUM(DISTINCT "v"."receivedThisMonth")::int AS "receivedThisMonth"
    FROM
      "ExchangePartner" "ExchangePartner",
      "t" "t",
      "v" "v"
    WHERE
      "ExchangePartner"."id" = "t"."id"
    AND
      "ExchangePartner"."id" = "v"."id"
    GROUP BY
      "ExchangePartner"."id"
  `);
        await queryRunner.query(`INSERT INTO "typeorm_metadata"("type", "schema", "name", "value") VALUES ($1, $2, $3, $4)`, ["VIEW","public","exchange_partner_view_entity","WITH \"t\" AS (\n      SELECT\n        \"ExchangePartner\".\"id\" AS \"id\",\n        SUM(\"Transaction\".\"amount\")::int AS \"receivedThisMonth\"\n      FROM\n        \"ExchangePartner\" \"ExchangePartner\",\n        \"Transaction\" \"Transaction\"\n      WHERE\n        \"ExchangePartner\".\"id\" = \"Transaction\".\"receiverExchangePartnerId\"\n      AND\n        \"Transaction\".\"dateTransacted\" > (\"ExchangePartner\".\"budgetEndDate\" - '1 month'::interval)\n      GROUP BY\n        \"ExchangePartner\".\"id\"\n\n      UNION ALL\n\n      SELECT\n        \"ExchangePartner\".\"id\" AS \"id\",\n        0::int AS \"receivedThisMonth\"\n      FROM\n        \"ExchangePartner\" \"ExchangePartner\"\n\n    ), \"v\" AS (\n      SELECT\n        \"ExchangePartner\".\"id\" AS \"id\",\n        SUM(\"Voucher\".\"amount\")::int AS \"receivedThisMonth\"\n      FROM\n        \"ExchangePartner\" \"ExchangePartner\",\n        \"Voucher\" \"Voucher\"\n      WHERE\n        \"Voucher\".\"sellerId\" = \"ExchangePartner\".\"id\"\n      AND\n        \"Voucher\".\"dateCreated\" > (\"ExchangePartner\".\"budgetEndDate\" - '1 month'::interval)\n      AND\n        \"Voucher\".\"dateRedeemed\" IS NULL\n      AND\n        \"Voucher\".\"dateRefunded\" IS NULL\n      GROUP BY\n        \"ExchangePartner\".\"id\"\n\n      UNION ALL\n\n      SELECT\n        \"ExchangePartner\".\"id\" AS \"id\",\n        0::int AS \"receivedThisMonth\"\n      FROM\n        \"ExchangePartner\" \"ExchangePartner\"\n      )\n\n    SELECT\n    \"ExchangePartner\".\"id\" AS \"id\",\n    SUM(DISTINCT \"t\".\"receivedThisMonth\")::int + SUM(DISTINCT \"v\".\"receivedThisMonth\")::int AS \"receivedThisMonth\"\n    FROM\n      \"ExchangePartner\" \"ExchangePartner\",\n      \"t\" \"t\",\n      \"v\" \"v\"\n    WHERE\n      \"ExchangePartner\".\"id\" = \"t\".\"id\"\n    AND\n      \"ExchangePartner\".\"id\" = \"v\".\"id\"\n    GROUP BY\n      \"ExchangePartner\".\"id\""]);
        await queryRunner.query(`CREATE VIEW "change_maker_view_entity" AS 
    WITH "poi_q" as (
      SELECT
        DISTINCT "ChangeMaker"."id" AS "id",
        COUNT(*)::int AS "poiApproved",
        EXTRACT(SECOND FROM SUM(DISTINCT "Poi"."dateStopped" - "Poi"."dateStarted"))::int AS "secondsCompleted"
      FROM
        "ChangeMaker" "ChangeMaker",
        "Enrollment" "Enrollment",
        "Poi" "Poi"
      WHERE
        "Poi"."enrollmentId" = "Enrollment"."id"
      AND
        "Enrollment"."changeMakerId" = "ChangeMaker"."id"
      GROUP BY
        "ChangeMaker"."id"

      UNION ALL

      SELECT
        "ChangeMaker"."id" AS "id",
        0::int AS "poiApproved",
        0::int AS "secondsCompleted"
      FROM
        "ChangeMaker" "ChangeMaker"
      GROUP BY
        "ChangeMaker"."id"
    ),
    "spentCredits_q" AS (
      SELECT
        DISTINCT "ChangeMaker"."id" AS "id",
        SUM(DISTINCT "Transaction"."amount")::int AS "spentCredits"
      FROM
        "ChangeMaker" "ChangeMaker",
        "Transaction" "Transaction"
      WHERE
        "Transaction"."senderChangeMakerId" = "ChangeMaker"."id"
      GROUP BY
        "ChangeMaker"."id"

      UNION ALL

      SELECT
        "ChangeMaker"."id" AS "id",
        0::int AS "spentCredits"
      FROM
        "ChangeMaker" "ChangeMaker"
    ),
    "earnedCredits_q" AS (
      SELECT
        "ChangeMaker"."id" AS "id",
        SUM(DISTINCT "Credit"."amount")::int AS "earnedCredits"
      FROM
        "ChangeMaker" "ChangeMaker",
        "Credit" "Credit",
        "Poi" "Poi",
        "Enrollment" "Enrollment"
      WHERE
        "Credit"."poiId" = "Poi"."id"
      AND
        "Poi"."enrollmentId" = "Enrollment"."id"
      AND
        "Enrollment"."changeMakerId" = "ChangeMaker"."id"
      GROUP BY
        "ChangeMaker"."id"

      UNION ALL

      SELECT
      "ChangeMaker"."id" AS "id",
        0::int AS "earnedCredits"
      FROM
        "ChangeMaker" "ChangeMaker"
    )

    SELECT
      "ChangeMaker"."id" as "id",
      SUM(DISTINCT "poi_q"."poiApproved")::int as "poiApproved",
      SUM(DISTINCT "poi_q"."secondsCompleted")::int as "secondsCompleted",
      SUM(DISTINCT "spentCredits_q"."spentCredits") AS "spentCredits",
      SUM(DISTINCT "earnedCredits_q"."earnedCredits") AS "earnedCredits"
    FROM
      "ChangeMaker" "ChangeMaker",
      "poi_q" "poi_q",
      "spentCredits_q" "spentCredits_q",
      "earnedCredits_q" "earnedCredits_q"
    WHERE
      "ChangeMaker"."id" = "poi_q"."id"
    AND
      "ChangeMaker"."id" = "spentCredits_q"."id"
    AND
      "ChangeMaker"."id" = "earnedCredits_q"."id"
    GROUP BY
      "ChangeMaker"."id"
  `);
        await queryRunner.query(`INSERT INTO "typeorm_metadata"("type", "schema", "name", "value") VALUES ($1, $2, $3, $4)`, ["VIEW","public","change_maker_view_entity","WITH \"poi_q\" as (\n      SELECT\n        DISTINCT \"ChangeMaker\".\"id\" AS \"id\",\n        COUNT(*)::int AS \"poiApproved\",\n        EXTRACT(SECOND FROM SUM(DISTINCT \"Poi\".\"dateStopped\" - \"Poi\".\"dateStarted\"))::int AS \"secondsCompleted\"\n      FROM\n        \"ChangeMaker\" \"ChangeMaker\",\n        \"Enrollment\" \"Enrollment\",\n        \"Poi\" \"Poi\"\n      WHERE\n        \"Poi\".\"enrollmentId\" = \"Enrollment\".\"id\"\n      AND\n        \"Enrollment\".\"changeMakerId\" = \"ChangeMaker\".\"id\"\n      GROUP BY\n        \"ChangeMaker\".\"id\"\n\n      UNION ALL\n\n      SELECT\n        \"ChangeMaker\".\"id\" AS \"id\",\n        0::int AS \"poiApproved\",\n        0::int AS \"secondsCompleted\"\n      FROM\n        \"ChangeMaker\" \"ChangeMaker\"\n      GROUP BY\n        \"ChangeMaker\".\"id\"\n    ),\n    \"spentCredits_q\" AS (\n      SELECT\n        DISTINCT \"ChangeMaker\".\"id\" AS \"id\",\n        SUM(DISTINCT \"Transaction\".\"amount\")::int AS \"spentCredits\"\n      FROM\n        \"ChangeMaker\" \"ChangeMaker\",\n        \"Transaction\" \"Transaction\"\n      WHERE\n        \"Transaction\".\"senderChangeMakerId\" = \"ChangeMaker\".\"id\"\n      GROUP BY\n        \"ChangeMaker\".\"id\"\n\n      UNION ALL\n\n      SELECT\n        \"ChangeMaker\".\"id\" AS \"id\",\n        0::int AS \"spentCredits\"\n      FROM\n        \"ChangeMaker\" \"ChangeMaker\"\n    ),\n    \"earnedCredits_q\" AS (\n      SELECT\n        \"ChangeMaker\".\"id\" AS \"id\",\n        SUM(DISTINCT \"Credit\".\"amount\")::int AS \"earnedCredits\"\n      FROM\n        \"ChangeMaker\" \"ChangeMaker\",\n        \"Credit\" \"Credit\",\n        \"Poi\" \"Poi\",\n        \"Enrollment\" \"Enrollment\"\n      WHERE\n        \"Credit\".\"poiId\" = \"Poi\".\"id\"\n      AND\n        \"Poi\".\"enrollmentId\" = \"Enrollment\".\"id\"\n      AND\n        \"Enrollment\".\"changeMakerId\" = \"ChangeMaker\".\"id\"\n      GROUP BY\n        \"ChangeMaker\".\"id\"\n\n      UNION ALL\n\n      SELECT\n      \"ChangeMaker\".\"id\" AS \"id\",\n        0::int AS \"earnedCredits\"\n      FROM\n        \"ChangeMaker\" \"ChangeMaker\"\n    )\n\n    SELECT\n      \"ChangeMaker\".\"id\" as \"id\",\n      SUM(DISTINCT \"poi_q\".\"poiApproved\")::int as \"poiApproved\",\n      SUM(DISTINCT \"poi_q\".\"secondsCompleted\")::int as \"secondsCompleted\",\n      SUM(DISTINCT \"spentCredits_q\".\"spentCredits\") AS \"spentCredits\",\n      SUM(DISTINCT \"earnedCredits_q\".\"earnedCredits\") AS \"earnedCredits\"\n    FROM\n      \"ChangeMaker\" \"ChangeMaker\",\n      \"poi_q\" \"poi_q\",\n      \"spentCredits_q\" \"spentCredits_q\",\n      \"earnedCredits_q\" \"earnedCredits_q\"\n    WHERE\n      \"ChangeMaker\".\"id\" = \"poi_q\".\"id\"\n    AND\n      \"ChangeMaker\".\"id\" = \"spentCredits_q\".\"id\"\n    AND\n      \"ChangeMaker\".\"id\" = \"earnedCredits_q\".\"id\"\n    GROUP BY\n      \"ChangeMaker\".\"id\""]);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DELETE FROM "typeorm_metadata" WHERE "type" = $1 AND "schema" = $2 AND "name" = $3`, ["VIEW","public","change_maker_view_entity"]);
        await queryRunner.query(`DROP VIEW "change_maker_view_entity"`);
        await queryRunner.query(`DELETE FROM "typeorm_metadata" WHERE "type" = $1 AND "schema" = $2 AND "name" = $3`, ["VIEW","public","exchange_partner_view_entity"]);
        await queryRunner.query(`DROP VIEW "exchange_partner_view_entity"`);
        await queryRunner.query(`ALTER TABLE "ChangeMaker" DROP CONSTRAINT "FK_44e1d983a01fb525502a0b2f257"`);
        await queryRunner.query(`ALTER TABLE "ChangeMaker" DROP CONSTRAINT "FK_32866fe4806ac169a973e00e840"`);
        await queryRunner.query(`ALTER TABLE "Credit" DROP CONSTRAINT "FK_ef7add62d8be3df7a9c2eb3e1cf"`);
        await queryRunner.query(`ALTER TABLE "Credit" DROP CONSTRAINT "FK_09f6cf1cabed200ae7d2c543148"`);
        await queryRunner.query(`ALTER TABLE "Credit" DROP CONSTRAINT "FK_ad55557a6bf2e6390acc5221e8b"`);
        await queryRunner.query(`ALTER TABLE "Credit" DROP CONSTRAINT "FK_bbbb01036aad7f2835ed698a35f"`);
        await queryRunner.query(`ALTER TABLE "ExchangePartner" DROP CONSTRAINT "FK_0c9b4192c0445335081172ac001"`);
        await queryRunner.query(`ALTER TABLE "ExchangePartner" DROP CONSTRAINT "FK_b7a0006cfb175082edfc0d2f4c9"`);
        await queryRunner.query(`ALTER TABLE "ExchangeAdmin" DROP CONSTRAINT "FK_a91d2e737b71cbc0badbe71a91c"`);
        await queryRunner.query(`ALTER TABLE "ExchangeAdmin" DROP CONSTRAINT "FK_81ba13e134d98c00a754f4779c1"`);
        await queryRunner.query(`ALTER TABLE "User" DROP CONSTRAINT "FK_f5e0492fcd672c2c91746acdc08"`);
        await queryRunner.query(`ALTER TABLE "EpApplication" DROP CONSTRAINT "FK_07d604ec0d32e5334fa26c02922"`);
        await queryRunner.query(`ALTER TABLE "EpApplication" DROP CONSTRAINT "FK_973dfa7a23628937821ffd328f9"`);
        await queryRunner.query(`ALTER TABLE "EpApplication" DROP CONSTRAINT "FK_2ad85c630c703c98e8c66717261"`);
        await queryRunner.query(`ALTER TABLE "SpApplication" DROP CONSTRAINT "FK_35cf008fac5b3ff7ac83576301c"`);
        await queryRunner.query(`ALTER TABLE "SpApplication" DROP CONSTRAINT "FK_67cccab339c825f0bf6e30879f4"`);
        await queryRunner.query(`ALTER TABLE "SpApplication" DROP CONSTRAINT "FK_61b3e44801ad43168649908465c"`);
        await queryRunner.query(`ALTER TABLE "ServePartner" DROP CONSTRAINT "FK_954cbae03d9ebe2eacae0718c7a"`);
        await queryRunner.query(`ALTER TABLE "ServePartner" DROP CONSTRAINT "FK_68484a7c54b51eb8b56790d9741"`);
        await queryRunner.query(`ALTER TABLE "Transaction" DROP CONSTRAINT "FK_3b9da05f598e977ccf4798c0608"`);
        await queryRunner.query(`ALTER TABLE "Transaction" DROP CONSTRAINT "FK_8167c92a213ac25cc8504506945"`);
        await queryRunner.query(`ALTER TABLE "Transaction" DROP CONSTRAINT "FK_eeed95b6fb3599920208cbe3bb0"`);
        await queryRunner.query(`ALTER TABLE "Transaction" DROP CONSTRAINT "FK_e002d35ba0e8f7fb84a92e06378"`);
        await queryRunner.query(`ALTER TABLE "Transaction" DROP CONSTRAINT "FK_0127b6ce74ed613c8b24fd091eb"`);
        await queryRunner.query(`ALTER TABLE "Transaction" DROP CONSTRAINT "FK_37c7a8d288563c57049fc65e04e"`);
        await queryRunner.query(`ALTER TABLE "ServeAdmin" DROP CONSTRAINT "FK_0873fb86f776db4d4cb4e52be10"`);
        await queryRunner.query(`ALTER TABLE "ServeAdmin" DROP CONSTRAINT "FK_372aa1b184ea6abb2de21ffad3f"`);
        await queryRunner.query(`ALTER TABLE "Request" DROP CONSTRAINT "FK_4bef1f1ae8af599ffd81f84a53a"`);
        await queryRunner.query(`ALTER TABLE "Request" DROP CONSTRAINT "FK_93d1f16c8cb52783f6671b79802"`);
        await queryRunner.query(`ALTER TABLE "Request" DROP CONSTRAINT "FK_4b541ca3ec79da6ce8bb635926d"`);
        await queryRunner.query(`ALTER TABLE "Project" DROP CONSTRAINT "FK_7de99bc82da27e9b97a872560ea"`);
        await queryRunner.query(`ALTER TABLE "Project" DROP CONSTRAINT "FK_6bb3e01a58f76f83c4289065624"`);
        await queryRunner.query(`ALTER TABLE "Enrollment" DROP CONSTRAINT "FK_dbb6dbcb6b97c0bdd3fd599c902"`);
        await queryRunner.query(`ALTER TABLE "Enrollment" DROP CONSTRAINT "FK_5b1cc4336c417c1de24379237cd"`);
        await queryRunner.query(`ALTER TABLE "Poi" DROP CONSTRAINT "FK_d117c772f2c1738ca70de6af519"`);
        await queryRunner.query(`ALTER TABLE "Task" DROP CONSTRAINT "FK_b2eb962320e895df918d2e824a8"`);
        await queryRunner.query(`ALTER TABLE "QuestionAnswer" DROP CONSTRAINT "FK_b694cdcf11ff9e48444b850fee2"`);
        await queryRunner.query(`ALTER TABLE "QuestionAnswer" DROP CONSTRAINT "FK_86369bace6607752e523da65219"`);
        await queryRunner.query(`ALTER TABLE "Question" DROP CONSTRAINT "FK_0d1ec0cf0da31f4a4dd3fddeefc"`);
        await queryRunner.query(`ALTER TABLE "EnrollmentDocument" DROP CONSTRAINT "FK_8dee704155365614ba0d87e649d"`);
        await queryRunner.query(`ALTER TABLE "EnrollmentDocument" DROP CONSTRAINT "FK_93558630be3db34763157714db5"`);
        await queryRunner.query(`ALTER TABLE "EnrollmentDocument" DROP CONSTRAINT "FK_b970304063ad41f1355a283cb88"`);
        await queryRunner.query(`ALTER TABLE "ProjectDocument" DROP CONSTRAINT "FK_d7222e49b0dcd50d094f805f757"`);
        await queryRunner.query(`ALTER TABLE "PassportDocuments" DROP CONSTRAINT "FK_4a6a391b2f4398736bbc6e23580"`);
        await queryRunner.query(`ALTER TABLE "Offer" DROP CONSTRAINT "FK_e596de68b330fc1e0fc3590d34e"`);
        await queryRunner.query(`ALTER TABLE "Offer" DROP CONSTRAINT "FK_783dc3120239cbd1e3d21b7a959"`);
        await queryRunner.query(`ALTER TABLE "Offer" DROP CONSTRAINT "FK_7b0364c2bb2da607082abff555c"`);
        await queryRunner.query(`ALTER TABLE "LinkedVoucherOffer" DROP CONSTRAINT "FK_3afdd1c234688b1627106472c02"`);
        await queryRunner.query(`ALTER TABLE "LinkedVoucherOffer" DROP CONSTRAINT "FK_334750ebb72c65fd023035b8c87"`);
        await queryRunner.query(`ALTER TABLE "Voucher" DROP CONSTRAINT "FK_a34735f1e38bdb1022a92fa9605"`);
        await queryRunner.query(`ALTER TABLE "Voucher" DROP CONSTRAINT "FK_f2de97c8d5c6c94727ef39e2ac9"`);
        await queryRunner.query(`ALTER TABLE "Voucher" DROP CONSTRAINT "FK_98503350ec4fe8d403db4bd6ce7"`);
        await queryRunner.query(`ALTER TABLE "Voucher" DROP CONSTRAINT "FK_9b54ceb7cbea4a6e390ab945dba"`);
        await queryRunner.query(`DROP TABLE "Address"`);
        await queryRunner.query(`DROP TABLE "ChangeMaker"`);
        await queryRunner.query(`DROP TABLE "Credit"`);
        await queryRunner.query(`DROP TABLE "ExchangePartner"`);
        await queryRunner.query(`DROP TABLE "ExchangeAdmin"`);
        await queryRunner.query(`DROP TABLE "User"`);
        await queryRunner.query(`DROP TABLE "EpApplication"`);
        await queryRunner.query(`DROP TABLE "Handle"`);
        await queryRunner.query(`DROP TABLE "SpApplication"`);
        await queryRunner.query(`DROP TABLE "ServePartner"`);
        await queryRunner.query(`DROP TABLE "Transaction"`);
        await queryRunner.query(`DROP TABLE "ServeAdmin"`);
        await queryRunner.query(`DROP TABLE "Request"`);
        await queryRunner.query(`DROP TABLE "Project"`);
        await queryRunner.query(`DROP TABLE "Enrollment"`);
        await queryRunner.query(`DROP TABLE "Poi"`);
        await queryRunner.query(`DROP TABLE "Task"`);
        await queryRunner.query(`DROP TABLE "QuestionAnswer"`);
        await queryRunner.query(`DROP TABLE "Question"`);
        await queryRunner.query(`DROP TABLE "EnrollmentDocument"`);
        await queryRunner.query(`DROP TABLE "ProjectDocument"`);
        await queryRunner.query(`DROP TABLE "PassportDocuments"`);
        await queryRunner.query(`DROP TABLE "Offer"`);
        await queryRunner.query(`DROP TABLE "LinkedVoucherOffer"`);
        await queryRunner.query(`DROP TABLE "Voucher"`);
    }

}
