import { MarketplaceMigration } from "./marketplace-migration";

const jsonMetadata: MarketplaceMigration = {
  name: '20210722091927_JsonMetadata',
  script: `START TRANSACTION;


  DO $$
  BEGIN
      IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20210722091927_JsonMetadata') THEN
      ALTER TABLE "Offer" DROP COLUMN "Metadata";
      END IF;
  END $$;

  DO $$
  BEGIN
      IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20210722091927_JsonMetadata') THEN
      ALTER TABLE "Offer" ADD "Metadata" jsonb NULL;
      END IF;
  END $$;

  DO $$
  BEGIN
      IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20210722091927_JsonMetadata') THEN
      CREATE INDEX "IX_Offer_Metadata" ON "Offer" ("Metadata");
      END IF;
  END $$;

  DO $$
  BEGIN
      IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20210722091927_JsonMetadata') THEN
      INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
      VALUES ('20210722091927_JsonMetadata', '5.0.2');
      END IF;
  END $$;
  COMMIT;`
};

export {jsonMetadata};
