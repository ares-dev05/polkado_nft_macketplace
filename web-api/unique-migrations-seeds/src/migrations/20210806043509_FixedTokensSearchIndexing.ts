import { MarketplaceMigration } from "./marketplace-migration";

const fixedTokensSearchIndexing: MarketplaceMigration = {
  name: '20210806043509_FixedTokensSearchIndexing',
  script: `START TRANSACTION;


  DO $$
  BEGIN
      IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20210806043509_FixedTokensSearchIndexing') THEN
      INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
      VALUES ('20210806043509_FixedTokensSearchIndexing', '5.0.2');
      END IF;
  END $$;
  COMMIT;`
}

export {fixedTokensSearchIndexing};