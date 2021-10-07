import { MarketplaceMigration } from "./marketplace-migration";

const addedQuoteIdToKusamaIncome: MarketplaceMigration = {
  name: '20210311060602_AddedQuoteIdToKusamaIncome',
  script: `START TRANSACTION;


  DO $$
  BEGIN
      IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20210311060602_AddedQuoteIdToKusamaIncome') THEN
      ALTER TABLE "KusamaIncomeTransactions" ADD "QuoteId" numeric(20,0) NOT NULL DEFAULT 2.0;
      END IF;
  END $$;

  DO $$
  BEGIN
      IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20210311060602_AddedQuoteIdToKusamaIncome') THEN
      INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
      VALUES ('20210311060602_AddedQuoteIdToKusamaIncome', '5.0.2');
      END IF;
  END $$;
  COMMIT;`
}

export {addedQuoteIdToKusamaIncome};