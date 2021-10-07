import { MarketplaceMigration } from "./marketplace-migration";

const renamedIncomeToIncoming: MarketplaceMigration = {
  name: '20210311100100_RenamedIncomeToIncoming',
  script: `START TRANSACTION;


  DO $$
  BEGIN
      IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20210311100100_RenamedIncomeToIncoming') THEN
      DROP TABLE "NftIncomeTransaction";
      END IF;
  END $$;

  DO $$
  BEGIN
      IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20210311100100_RenamedIncomeToIncoming') THEN
      DROP TABLE "QuoteIncomeTransactions";
      END IF;
  END $$;

  DO $$
  BEGIN
      IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20210311100100_RenamedIncomeToIncoming') THEN
      CREATE TABLE "NftIncomingTransaction" (
          "Id" uuid NOT NULL,
          "CollectionId" bigint NOT NULL,
          "TokenId" bigint NOT NULL,
          "Value" text NOT NULL,
          "OwnerPublicKey" text NOT NULL,
          "Status" integer NOT NULL,
          "LockTime" timestamp without time zone NULL,
          "ErrorMessage" text NULL,
          "UniqueProcessedBlockId" numeric(20,0) NOT NULL,
          CONSTRAINT "PK_NftIncomingTransaction" PRIMARY KEY ("Id"),
          CONSTRAINT "FK_NftIncomingTransaction_UniqueProcessedBlock_UniqueProcessed~" FOREIGN KEY ("UniqueProcessedBlockId") REFERENCES "UniqueProcessedBlock" ("BlockNumber") ON DELETE CASCADE
      );
      END IF;
  END $$;

  DO $$
  BEGIN
      IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20210311100100_RenamedIncomeToIncoming') THEN
      CREATE TABLE "QuoteIncomingTransaction" (
          "Id" uuid NOT NULL,
          "Amount" text NOT NULL,
          "QuoteId" numeric(20,0) NOT NULL,
          "Description" text NOT NULL,
          "AccountPublicKey" text NOT NULL,
          "BlockId" numeric(20,0) NULL,
          "Status" integer NOT NULL,
          "LockTime" timestamp without time zone NULL,
          "ErrorMessage" text NULL,
          CONSTRAINT "PK_QuoteIncomingTransaction" PRIMARY KEY ("Id")
      );
      END IF;
  END $$;

  DO $$
  BEGIN
      IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20210311100100_RenamedIncomeToIncoming') THEN
      CREATE INDEX "IX_NftIncomingTransaction_Status_LockTime" ON "NftIncomingTransaction" ("Status", "LockTime") WHERE "Status" = 0;
      END IF;
  END $$;

  DO $$
  BEGIN
      IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20210311100100_RenamedIncomeToIncoming') THEN
      CREATE INDEX "IX_NftIncomingTransaction_UniqueProcessedBlockId" ON "NftIncomingTransaction" ("UniqueProcessedBlockId");
      END IF;
  END $$;

  DO $$
  BEGIN
      IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20210311100100_RenamedIncomeToIncoming') THEN
      CREATE INDEX "IX_QuoteIncomingTransaction_AccountPublicKey" ON "QuoteIncomingTransaction" ("AccountPublicKey");
      END IF;
  END $$;

  DO $$
  BEGIN
      IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20210311100100_RenamedIncomeToIncoming') THEN
      CREATE INDEX "IX_QuoteIncomingTransaction_Status_LockTime" ON "QuoteIncomingTransaction" ("Status", "LockTime") WHERE "Status" = 0;
      END IF;
  END $$;

  DO $$
  BEGIN
      IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20210311100100_RenamedIncomeToIncoming') THEN
      INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
      VALUES ('20210311100100_RenamedIncomeToIncoming', '5.0.2');
      END IF;
  END $$;
  COMMIT;`
};

export {renamedIncomeToIncoming};