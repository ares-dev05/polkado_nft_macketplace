import { MarketplaceMigration } from "./marketplace-migration";

const onHold: MarketplaceMigration = {
  name: '20210705034532_OnHold',
  script: `  START TRANSACTION;


  DO $$
  BEGIN
      IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20210705034532_OnHold') THEN
      ALTER TABLE "NftIncomingTransaction" ADD "OfferId" uuid NULL;
      END IF;
  END $$;

  DO $$
  BEGIN
      IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20210705034532_OnHold') THEN
      CREATE INDEX "IX_NftIncomingTransaction_OfferId" ON "NftIncomingTransaction" ("OfferId");
      END IF;
  END $$;

  DO $$
  BEGIN
      IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20210705034532_OnHold') THEN
      ALTER TABLE "NftIncomingTransaction" ADD CONSTRAINT "FK_NftIncomingTransaction_Offer_OfferId" FOREIGN KEY ("OfferId") REFERENCES "Offer" ("Id") ON DELETE RESTRICT;
      END IF;
  END $$;

  DO $$
  BEGIN
      IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20210705034532_OnHold') THEN
      INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
      VALUES ('20210705034532_OnHold', '5.0.2');
      END IF;
  END $$;
  COMMIT;`
}

export {onHold};