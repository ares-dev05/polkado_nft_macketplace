import { MarketplaceMigration } from "./marketplace-migration";

const initial: MarketplaceMigration = {
  name: '20210121093304_Initial',
  script: `CREATE TABLE IF NOT EXISTS "__EFMigrationsHistory" (
    "MigrationId" character varying(150) NOT NULL,
    "ProductVersion" character varying(32) NOT NULL,
    CONSTRAINT "PK___EFMigrationsHistory" PRIMARY KEY ("MigrationId")
);

START TRANSACTION;


DO $$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20210121093304_Initial') THEN
    CREATE TABLE "Offers" (
        "Id" uuid NOT NULL,
        "CreationDate" timestamp without time zone NOT NULL,
        "CollectionId" numeric(20,0) NOT NULL,
        "TokenId" numeric(20,0) NOT NULL,
        "Price" text NOT NULL,
        "Seller" text NOT NULL,
        "Metadata" text NOT NULL,
        "OfferStatus" integer NOT NULL,
        CONSTRAINT "PK_Offers" PRIMARY KEY ("Id")
    );
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20210121093304_Initial') THEN
    CREATE TABLE "Trades" (
        "Id" uuid NOT NULL,
        "TradeDate" timestamp without time zone NOT NULL,
        "Buyer" text NOT NULL,
        "OfferId" uuid NOT NULL,
        CONSTRAINT "PK_Trades" PRIMARY KEY ("Id"),
        CONSTRAINT "FK_Trades_Offers_OfferId" FOREIGN KEY ("OfferId") REFERENCES "Offers" ("Id") ON DELETE CASCADE
    );
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20210121093304_Initial') THEN
    CREATE INDEX "IX_Offers_CollectionId" ON "Offers" ("CollectionId");
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20210121093304_Initial') THEN
    CREATE INDEX "IX_Offers_CreationDate" ON "Offers" ("CreationDate");
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20210121093304_Initial') THEN
    CREATE INDEX "IX_Trades_OfferId" ON "Trades" ("OfferId");
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20210121093304_Initial') THEN
    INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
    VALUES ('20210121093304_Initial', '5.0.2');
    END IF;
END $$;
COMMIT;`
};

export {initial};