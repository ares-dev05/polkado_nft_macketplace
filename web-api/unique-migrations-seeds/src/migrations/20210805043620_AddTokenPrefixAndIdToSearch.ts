import { MarketplaceMigration } from "./marketplace-migration";

const addTokenPrefixAndIdToSearch: MarketplaceMigration = {
  name: '20210805043620_AddTokenPrefixAndIdToSearch',
  script: `START TRANSACTION;


  DO $$
  BEGIN
      IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20210805043620_AddTokenPrefixAndIdToSearch') THEN
      INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
      VALUES ('20210805043620_AddTokenPrefixAndIdToSearch', '5.0.2');
      END IF;
  END $$;
  COMMIT;
  `
};

export {addTokenPrefixAndIdToSearch};