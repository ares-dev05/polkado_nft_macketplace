import { MarketplaceMigration } from "./marketplace-migration";

const renamesAndMissingFields: MarketplaceMigration = {
  name: '20210311090819_RenamesAndMissingFields',
  script: `START TRANSACTION;


  DO $$
  BEGIN
      IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20210311090819_RenamesAndMissingFields') THEN
      DROP TABLE "KusamaIncomeTransactions";
      END IF;
  END $$;

  DO $$
  BEGIN
      IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20210311090819_RenamesAndMissingFields') THEN
      DROP INDEX "IX_Offers_CollectionId";
      END IF;
  END $$;

  DO $$
  BEGIN
      IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20210311090819_RenamesAndMissingFields') THEN
      ALTER TABLE "Offers" ADD "QuoteId" numeric(20,0) NOT NULL DEFAULT 2.0;
      END IF;
  END $$;

  DO $$
  BEGIN
      IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20210311090819_RenamesAndMissingFields') THEN
      CREATE TABLE "NftOutgoingTransactions" (
          "Id" uuid NOT NULL,
          "CollectionId" numeric(20,0) NOT NULL,
          "TokenId" numeric(20,0) NOT NULL,
          "Value" text NOT NULL,
          "RecipientPublicKey" text NOT NULL,
          "Status" integer NOT NULL,
          "LockTime" timestamp without time zone NULL,
          "ErrorMessage" text NULL,
          CONSTRAINT "PK_NftOutgoingTransactions" PRIMARY KEY ("Id")
      );
      END IF;
  END $$;

  DO $$
  BEGIN
      IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20210311090819_RenamesAndMissingFields') THEN
      CREATE TABLE "QuoteIncomeTransactions" (
          "Id" uuid NOT NULL,
          "Amount" text NOT NULL,
          "QuoteId" numeric(20,0) NOT NULL,
          "Description" text NOT NULL,
          "AccountPublicKey" text NOT NULL,
          "BlockId" numeric(20,0) NULL,
          "Status" integer NOT NULL,
          "LockTime" timestamp without time zone NULL,
          "ErrorMessage" text NULL,
          CONSTRAINT "PK_QuoteIncomeTransactions" PRIMARY KEY ("Id")
      );
      END IF;
  END $$;

  DO $$
  BEGIN
      IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20210311090819_RenamesAndMissingFields') THEN
      CREATE INDEX "IX_Offers_OfferStatus_CollectionId_TokenId" ON "Offers" ("OfferStatus", "CollectionId", "TokenId");
      END IF;
  END $$;

  DO $$
  BEGIN
      IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20210311090819_RenamesAndMissingFields') THEN
      CREATE INDEX "IX_NftOutgoingTransactions_Status_LockTime" ON "NftOutgoingTransactions" ("Status", "LockTime") WHERE "Status" = 0;
      END IF;
  END $$;

  DO $$
  BEGIN
      IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20210311090819_RenamesAndMissingFields') THEN
      CREATE INDEX "IX_QuoteIncomeTransactions_AccountPublicKey" ON "QuoteIncomeTransactions" ("AccountPublicKey");
      END IF;
  END $$;

  DO $$
  BEGIN
      IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20210311090819_RenamesAndMissingFields') THEN
      CREATE INDEX "IX_QuoteIncomeTransactions_Status_LockTime" ON "QuoteIncomeTransactions" ("Status", "LockTime") WHERE "Status" = 0;
      END IF;
  END $$;

  DO $$
  BEGIN
      IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20210311090819_RenamesAndMissingFields') THEN
      INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
      VALUES ('20210311090819_RenamesAndMissingFields', '5.0.2');
      END IF;
  END $$;
  COMMIT;`
};

export {renamesAndMissingFields};