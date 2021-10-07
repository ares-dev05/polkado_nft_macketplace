import { MarketplaceMigration } from "./marketplace-migration";

const renamesKusamaToQuote: MarketplaceMigration = {
  name: '20210311094419_RenamesKusamaToQuote',
  script: `START TRANSACTION;


  DO $$
  BEGIN
      IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20210311094419_RenamesKusamaToQuote') THEN
      ALTER TABLE "KusamaOutgoingTransactions" DROP CONSTRAINT "PK_KusamaOutgoingTransactions";
      END IF;
  END $$;

  DO $$
  BEGIN
      IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20210311094419_RenamesKusamaToQuote') THEN
      ALTER TABLE "KusamaOutgoingTransactions" RENAME TO "QuoteOutgoingTransactions";
      END IF;
  END $$;

  DO $$
  BEGIN
      IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20210311094419_RenamesKusamaToQuote') THEN
      ALTER INDEX "IX_KusamaOutgoingTransactions_Status" RENAME TO "IX_QuoteOutgoingTransactions_Status";
      END IF;
  END $$;

  DO $$
  BEGIN
      IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20210311094419_RenamesKusamaToQuote') THEN
      ALTER TABLE "QuoteOutgoingTransactions" ADD CONSTRAINT "PK_QuoteOutgoingTransactions" PRIMARY KEY ("Id");
      END IF;
  END $$;

  DO $$
  BEGIN
      IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20210311094419_RenamesKusamaToQuote') THEN
      INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
      VALUES ('20210311094419_RenamesKusamaToQuote', '5.0.2');
      END IF;
  END $$;
  COMMIT;
  `
};

export {renamesKusamaToQuote};