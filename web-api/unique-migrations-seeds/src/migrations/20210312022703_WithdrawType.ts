import { MarketplaceMigration } from "./marketplace-migration";

const withdrawType: MarketplaceMigration = {
  name: '20210312022703_WithdrawType',
  script: `START TRANSACTION;


  DO $$
  BEGIN
      IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20210312022703_WithdrawType') THEN
      ALTER TABLE "QuoteOutgoingTransaction" ADD "WithdrawType" integer NOT NULL DEFAULT 0;
      END IF;
  END $$;

  DO $$
  BEGIN
      IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20210312022703_WithdrawType') THEN
      INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
      VALUES ('20210312022703_WithdrawType', '5.0.2');
      END IF;
  END $$;
  COMMIT;`
};

export {withdrawType};