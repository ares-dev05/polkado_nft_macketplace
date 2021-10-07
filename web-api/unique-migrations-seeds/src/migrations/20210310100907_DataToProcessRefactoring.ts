import { MarketplaceMigration } from "./marketplace-migration";

const dataToProcessRefactoring: MarketplaceMigration = {
  name: '20210310100907_DataToProcessRefactoring',
  script: `START TRANSACTION;


  DO $$
  BEGIN
      IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20210310100907_DataToProcessRefactoring') THEN
      DROP INDEX "IX_NftIncomeTransactions_Deposited_LockTime";
      END IF;
  END $$;

  DO $$
  BEGIN
      IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20210310100907_DataToProcessRefactoring') THEN
      ALTER TABLE "NftIncomeTransactions" DROP COLUMN "Deposited";
      END IF;
  END $$;

  DO $$
  BEGIN
      IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20210310100907_DataToProcessRefactoring') THEN
      ALTER TABLE "NftIncomeTransactions" ADD "ErrorMessage" text NULL;
      END IF;
  END $$;

  DO $$
  BEGIN
      IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20210310100907_DataToProcessRefactoring') THEN
      ALTER TABLE "NftIncomeTransactions" ADD "Status" integer NOT NULL DEFAULT 0;
      END IF;
  END $$;

  DO $$
  BEGIN
      IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20210310100907_DataToProcessRefactoring') THEN
      ALTER TABLE "KusamaTransactions" ADD "ErrorMessage" text NULL;
      END IF;
  END $$;

  DO $$
  BEGIN
      IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20210310100907_DataToProcessRefactoring') THEN
      ALTER TABLE "KusamaTransactions" ADD "LockTime" timestamp without time zone NULL;
      END IF;
  END $$;

  DO $$
  BEGIN
      IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20210310100907_DataToProcessRefactoring') THEN
      ALTER TABLE "KusamaTransactions" ADD "Status" integer NOT NULL DEFAULT 0;
      END IF;
  END $$;

  DO $$
  BEGIN
      IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20210310100907_DataToProcessRefactoring') THEN
      CREATE INDEX "IX_NftIncomeTransactions_Status_LockTime" ON "NftIncomeTransactions" ("Status", "LockTime") WHERE "Status" = 0;
      END IF;
  END $$;

  DO $$
  BEGIN
      IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20210310100907_DataToProcessRefactoring') THEN
      CREATE INDEX "IX_KusamaTransactions_Status_LockTime" ON "KusamaTransactions" ("Status", "LockTime") WHERE "Status" = 0;
      END IF;
  END $$;

  DO $$
  BEGIN
      IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20210310100907_DataToProcessRefactoring') THEN
      INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
      VALUES ('20210310100907_DataToProcessRefactoring', '5.0.2');
      END IF;
  END $$;
  COMMIT;`
}

export {dataToProcessRefactoring};