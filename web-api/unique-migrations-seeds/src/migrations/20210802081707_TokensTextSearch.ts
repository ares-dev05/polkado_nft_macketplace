import { MarketplaceMigration } from "./marketplace-migration";

const tokensTextSearch: MarketplaceMigration = {
  name: '20210802081707_TokensTextSearch',
  script: `START TRANSACTION;


  DO $$
  BEGIN
      IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20210802081707_TokensTextSearch') THEN
      CREATE TABLE "TokenTextSearch" (
          "Id" uuid NOT NULL,
          "CollectionId" numeric(20,0) NOT NULL,
          "TokenId" numeric(20,0) NOT NULL,
          "Text" text NOT NULL,
          "Locale" text NULL,
          CONSTRAINT "PK_TokenTextSearch" PRIMARY KEY ("Id")
      );
      END IF;
  END $$;

  DO $$
  BEGIN
      IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20210802081707_TokensTextSearch') THEN
      CREATE INDEX "IX_TokenTextSearch_CollectionId_TokenId_Locale" ON "TokenTextSearch" ("CollectionId", "TokenId", "Locale");
      END IF;
  END $$;

  DO $$
  BEGIN
      IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20210802081707_TokensTextSearch') THEN
      INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
      VALUES ('20210802081707_TokensTextSearch', '5.0.2');
      END IF;
  END $$;
  COMMIT;`
};

export {tokensTextSearch};