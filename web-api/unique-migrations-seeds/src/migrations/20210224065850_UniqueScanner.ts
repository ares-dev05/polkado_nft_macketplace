import { MarketplaceMigration } from "./marketplace-migration";

const uniqueScanner: MarketplaceMigration = {
  name: '20210224065850_UniqueScanner',
  script: `START TRANSACTION;


  DO $$
  BEGIN
      IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20210224065850_UniqueScanner') THEN
      CREATE TABLE "UniqueProcessedBlocks" (
          "BlockNumber" numeric(20,0) NOT NULL,
          "ProcessDate" timestamp without time zone NOT NULL,
          CONSTRAINT "PK_UniqueProcessedBlocks" PRIMARY KEY ("BlockNumber")
      );
      END IF;
  END $$;

  DO $$
  BEGIN
      IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20210224065850_UniqueScanner') THEN
      CREATE TABLE "NftIncomeTransactions" (
          "Id" uuid NOT NULL,
          "CollectionId" bigint NOT NULL,
          "TokenId" bigint NOT NULL,
          "Deposited" boolean NOT NULL,
          "Value" text NOT NULL,
          "OwnerPublicKey" text NOT NULL,
          "UniqueProcessedBlockId" numeric(20,0) NOT NULL,
          CONSTRAINT "PK_NftIncomeTransactions" PRIMARY KEY ("Id"),
          CONSTRAINT "FK_NftIncomeTransactions_UniqueProcessedBlocks_UniqueProcessed~" FOREIGN KEY ("UniqueProcessedBlockId") REFERENCES "UniqueProcessedBlocks" ("BlockNumber") ON DELETE CASCADE
      );
      END IF;
  END $$;

  DO $$
  BEGIN
      IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20210224065850_UniqueScanner') THEN
      CREATE INDEX "IX_NftIncomeTransactions_Deposited" ON "NftIncomeTransactions" ("Deposited") WHERE "Deposited" is not true;
      END IF;
  END $$;

  DO $$
  BEGIN
      IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20210224065850_UniqueScanner') THEN
      CREATE INDEX "IX_NftIncomeTransactions_UniqueProcessedBlockId" ON "NftIncomeTransactions" ("UniqueProcessedBlockId");
      END IF;
  END $$;

  DO $$
  BEGIN
      IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20210224065850_UniqueScanner') THEN
      INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
      VALUES ('20210224065850_UniqueScanner', '5.0.2');
      END IF;
  END $$;
  COMMIT;`
};

export {uniqueScanner};