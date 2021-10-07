import { MarketplaceMigration } from "./marketplace-migration";

const priceFilter: MarketplaceMigration = {
  name: '20210715081147_PriceFilter',
  script: `START TRANSACTION;


  DO $$
  BEGIN
      IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20210715081147_PriceFilter') THEN

      UPDATE public."Offer"
      SET "Price"=LPAD("Price", 40, '0');

      END IF;
  END $$;

  DO $$
  BEGIN
      IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20210715081147_PriceFilter') THEN
      INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
      VALUES ('20210715081147_PriceFilter', '5.0.2');
      END IF;
  END $$;
  COMMIT;`
};

export {priceFilter};