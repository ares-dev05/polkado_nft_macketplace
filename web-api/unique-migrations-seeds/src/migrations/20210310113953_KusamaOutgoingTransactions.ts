import { MarketplaceMigration } from "./marketplace-migration";

const kusamaOutgoingTransactions: MarketplaceMigration = {
  name: '20210310113953_KusamaOutgoingTransactions',
  script: `START TRANSACTION;


  DO $$
  BEGIN
      IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20210310113953_KusamaOutgoingTransactions') THEN
      DROP TABLE "KusamaTransactions";
      END IF;
  END $$;

  DO $$
  BEGIN
      IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20210310113953_KusamaOutgoingTransactions') THEN
      CREATE TABLE "KusamaIncomeTransactions" (
          "Id" uuid NOT NULL,
          "Amount" text NOT NULL,
          "Description" text NOT NULL,
          "AccountPublicKey" text NOT NULL,
          "BlockId" numeric(20,0) NULL,
          "Status" integer NOT NULL,
          "LockTime" timestamp without time zone NULL,
          "ErrorMessage" text NULL,
          CONSTRAINT "PK_KusamaIncomeTransactions" PRIMARY KEY ("Id")
      );
      END IF;
  END $$;

  DO $$
  BEGIN
      IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20210310113953_KusamaOutgoingTransactions') THEN
      CREATE TABLE "KusamaOutgoingTransactions" (
          "Id" uuid NOT NULL,
          "Status" integer NOT NULL,
          "ErrorMessage" text NULL,
          "Value" text NOT NULL,
          "QuoteId" numeric(20,0) NOT NULL,
          "RecipientPublicKey" text NOT NULL,
          CONSTRAINT "PK_KusamaOutgoingTransactions" PRIMARY KEY ("Id")
      );
      END IF;
  END $$;

  DO $$
  BEGIN
      IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20210310113953_KusamaOutgoingTransactions') THEN
      CREATE INDEX "IX_KusamaIncomeTransactions_AccountPublicKey" ON "KusamaIncomeTransactions" ("AccountPublicKey");
      END IF;
  END $$;

  DO $$
  BEGIN
      IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20210310113953_KusamaOutgoingTransactions') THEN
      CREATE INDEX "IX_KusamaIncomeTransactions_Status_LockTime" ON "KusamaIncomeTransactions" ("Status", "LockTime") WHERE "Status" = 0;
      END IF;
  END $$;

  DO $$
  BEGIN
      IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20210310113953_KusamaOutgoingTransactions') THEN
      CREATE INDEX "IX_KusamaOutgoingTransactions_Status" ON "KusamaOutgoingTransactions" ("Status") WHERE "Status" = 0;
      END IF;
  END $$;

  DO $$
  BEGIN
      IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20210310113953_KusamaOutgoingTransactions') THEN
      INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
      VALUES ('20210310113953_KusamaOutgoingTransactions', '5.0.2');
      END IF;
  END $$;
  COMMIT;`
}

export {kusamaOutgoingTransactions};
