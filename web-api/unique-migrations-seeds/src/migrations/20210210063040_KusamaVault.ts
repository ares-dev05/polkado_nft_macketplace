import { MarketplaceMigration } from "./marketplace-migration";

const kusamaVault: MarketplaceMigration = {
  name: '20210210063040_KusamaVault',
  script: `START TRANSACTION;


  DO $$
  BEGIN
      IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20210210063040_KusamaVault') THEN
      CREATE TABLE "KusamaProcessedBlocks" (
          "BlockNumber" numeric(20,0) NOT NULL,
          "ProcessDate" timestamp without time zone NOT NULL,
          CONSTRAINT "PK_KusamaProcessedBlocks" PRIMARY KEY ("BlockNumber")
      );
      END IF;
  END $$;

  DO $$
  BEGIN
      IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20210210063040_KusamaVault') THEN
      CREATE TABLE "KusamaTransactions" (
          "Id" uuid NOT NULL,
          "Amount" text NOT NULL,
          "Description" text NOT NULL,
          "AccountPublicKey" text NOT NULL,
          "BlockId" numeric(20,0) NOT NULL,
          CONSTRAINT "PK_KusamaTransactions" PRIMARY KEY ("Id"),
          CONSTRAINT "FK_KusamaTransactions_KusamaProcessedBlocks_BlockId" FOREIGN KEY ("BlockId") REFERENCES "KusamaProcessedBlocks" ("BlockNumber") ON DELETE CASCADE
      );
      END IF;
  END $$;

  DO $$
  BEGIN
      IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20210210063040_KusamaVault') THEN
      CREATE INDEX "IX_KusamaTransactions_AccountPublicKey" ON "KusamaTransactions" ("AccountPublicKey");
      END IF;
  END $$;

  DO $$
  BEGIN
      IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20210210063040_KusamaVault') THEN
      CREATE INDEX "IX_KusamaTransactions_BlockId" ON "KusamaTransactions" ("BlockId");
      END IF;
  END $$;

  DO $$
  BEGIN
      IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20210210063040_KusamaVault') THEN
      INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
      VALUES ('20210210063040_KusamaVault', '5.0.2');
      END IF;
  END $$;
  COMMIT;
  `
}

export {kusamaVault};