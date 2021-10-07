CREATE TABLE IF NOT EXISTS "__EFMigrationsHistory" (
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
COMMIT;

START TRANSACTION;


DO $$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20210210063040_KusamaVault') THEN
    CREATE TABLE "KusamaProcessedBlocks" (
        "BlockNumber" numeric(20,0) NOT NULL,
        "ProcessDate" timestamp without time zone NOT NULL,
        CONSTRAINT "PK_KusamaProcessedBlocks" PRIMARY KEY ("BlockNumber")
    );
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20210210063040_KusamaVault') THEN
    CREATE TABLE "KusamaTransactions" (
        "Id" uuid NOT NULL,
        "Amount" text NOT NULL,
        "Description" text NOT NULL,
        "AccountPublicKey" text NOT NULL,
        "BlockId" numeric(20,0) NOT NULL,
        CONSTRAINT "PK_KusamaTransactions" PRIMARY KEY ("Id"),
        CONSTRAINT "FK_KusamaTransactions_KusamaProcessedBlocks_BlockId" FOREIGN KEY ("BlockId") REFERENCES "KusamaProcessedBlocks" ("BlockNumber") ON DELETE CASCADE
    );
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20210210063040_KusamaVault') THEN
    CREATE INDEX "IX_KusamaTransactions_AccountPublicKey" ON "KusamaTransactions" ("AccountPublicKey");
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20210210063040_KusamaVault') THEN
    CREATE INDEX "IX_KusamaTransactions_BlockId" ON "KusamaTransactions" ("BlockId");
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20210210063040_KusamaVault') THEN
    INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
    VALUES ('20210210063040_KusamaVault', '5.0.2');
    END IF;
END $$;
COMMIT;

START TRANSACTION;


DO $$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20210224065850_UniqueScanner') THEN
    CREATE TABLE "UniqueProcessedBlocks" (
        "BlockNumber" numeric(20,0) NOT NULL,
        "ProcessDate" timestamp without time zone NOT NULL,
        CONSTRAINT "PK_UniqueProcessedBlocks" PRIMARY KEY ("BlockNumber")
    );
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20210224065850_UniqueScanner') THEN
    CREATE TABLE "NftIncomeTransactions" (
        "Id" uuid NOT NULL,
        "CollectionId" bigint NOT NULL,
        "TokenId" bigint NOT NULL,
        "Deposited" boolean NOT NULL,
        "Value" text NOT NULL,
        "OwnerPublicKey" text NOT NULL,
        "UniqueProcessedBlockId" numeric(20,0) NOT NULL,
        CONSTRAINT "PK_NftIncomeTransactions" PRIMARY KEY ("Id"),
        CONSTRAINT "FK_NftIncomeTransactions_UniqueProcessedBlocks_UniqueProcessed~" FOREIGN KEY ("UniqueProcessedBlockId") REFERENCES "UniqueProcessedBlocks" ("BlockNumber") ON DELETE CASCADE
    );
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20210224065850_UniqueScanner') THEN
    CREATE INDEX "IX_NftIncomeTransactions_Deposited" ON "NftIncomeTransactions" ("Deposited") WHERE "Deposited" is not true;
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20210224065850_UniqueScanner') THEN
    CREATE INDEX "IX_NftIncomeTransactions_UniqueProcessedBlockId" ON "NftIncomeTransactions" ("UniqueProcessedBlockId");
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20210224065850_UniqueScanner') THEN
    INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
    VALUES ('20210224065850_UniqueScanner', '5.0.2');
    END IF;
END $$;
COMMIT;

START TRANSACTION;


DO $$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20210303090905_RegisteringNftDeposit') THEN
    DROP INDEX "IX_NftIncomeTransactions_Deposited";
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20210303090905_RegisteringNftDeposit') THEN
    ALTER TABLE "Offers" ADD "SellerPublicKeyBytes" bytea NOT NULL DEFAULT BYTEA E'\\x';
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20210303090905_RegisteringNftDeposit') THEN
    ALTER TABLE "NftIncomeTransactions" ADD "LockTime" timestamp without time zone NULL;
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20210303090905_RegisteringNftDeposit') THEN
    CREATE INDEX "IX_NftIncomeTransactions_Deposited_LockTime" ON "NftIncomeTransactions" ("Deposited", "LockTime") WHERE "Deposited" is not true;
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20210303090905_RegisteringNftDeposit') THEN
    INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
    VALUES ('20210303090905_RegisteringNftDeposit', '5.0.2');
    END IF;
END $$;
COMMIT;

START TRANSACTION;


DO $$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20210310100907_DataToProcessRefactoring') THEN
    DROP INDEX "IX_NftIncomeTransactions_Deposited_LockTime";
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20210310100907_DataToProcessRefactoring') THEN
    ALTER TABLE "NftIncomeTransactions" DROP COLUMN "Deposited";
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20210310100907_DataToProcessRefactoring') THEN
    ALTER TABLE "NftIncomeTransactions" ADD "ErrorMessage" text NULL;
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20210310100907_DataToProcessRefactoring') THEN
    ALTER TABLE "NftIncomeTransactions" ADD "Status" integer NOT NULL DEFAULT 0;
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20210310100907_DataToProcessRefactoring') THEN
    ALTER TABLE "KusamaTransactions" ADD "ErrorMessage" text NULL;
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20210310100907_DataToProcessRefactoring') THEN
    ALTER TABLE "KusamaTransactions" ADD "LockTime" timestamp without time zone NULL;
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20210310100907_DataToProcessRefactoring') THEN
    ALTER TABLE "KusamaTransactions" ADD "Status" integer NOT NULL DEFAULT 0;
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20210310100907_DataToProcessRefactoring') THEN
    CREATE INDEX "IX_NftIncomeTransactions_Status_LockTime" ON "NftIncomeTransactions" ("Status", "LockTime") WHERE "Status" = 0;
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20210310100907_DataToProcessRefactoring') THEN
    CREATE INDEX "IX_KusamaTransactions_Status_LockTime" ON "KusamaTransactions" ("Status", "LockTime") WHERE "Status" = 0;
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20210310100907_DataToProcessRefactoring') THEN
    INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
    VALUES ('20210310100907_DataToProcessRefactoring', '5.0.2');
    END IF;
END $$;
COMMIT;

START TRANSACTION;


DO $$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20210310113953_KusamaOutgoingTransactions') THEN
    DROP TABLE "KusamaTransactions";
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20210310113953_KusamaOutgoingTransactions') THEN
    CREATE TABLE "KusamaIncomeTransactions" (
        "Id" uuid NOT NULL,
        "Amount" text NOT NULL,
        "Description" text NOT NULL,
        "AccountPublicKey" text NOT NULL,
        "BlockId" numeric(20,0) NULL,
        "Status" integer NOT NULL,
        "LockTime" timestamp without time zone NULL,
        "ErrorMessage" text NULL,
        CONSTRAINT "PK_KusamaIncomeTransactions" PRIMARY KEY ("Id")
    );
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20210310113953_KusamaOutgoingTransactions') THEN
    CREATE TABLE "KusamaOutgoingTransactions" (
        "Id" uuid NOT NULL,
        "Status" integer NOT NULL,
        "ErrorMessage" text NULL,
        "Value" text NOT NULL,
        "QuoteId" numeric(20,0) NOT NULL,
        "RecipientPublicKey" text NOT NULL,
        CONSTRAINT "PK_KusamaOutgoingTransactions" PRIMARY KEY ("Id")
    );
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20210310113953_KusamaOutgoingTransactions') THEN
    CREATE INDEX "IX_KusamaIncomeTransactions_AccountPublicKey" ON "KusamaIncomeTransactions" ("AccountPublicKey");
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20210310113953_KusamaOutgoingTransactions') THEN
    CREATE INDEX "IX_KusamaIncomeTransactions_Status_LockTime" ON "KusamaIncomeTransactions" ("Status", "LockTime") WHERE "Status" = 0;
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20210310113953_KusamaOutgoingTransactions') THEN
    CREATE INDEX "IX_KusamaOutgoingTransactions_Status" ON "KusamaOutgoingTransactions" ("Status") WHERE "Status" = 0;
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20210310113953_KusamaOutgoingTransactions') THEN
    INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
    VALUES ('20210310113953_KusamaOutgoingTransactions', '5.0.2');
    END IF;
END $$;
COMMIT;

START TRANSACTION;


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
COMMIT;

START TRANSACTION;


DO $$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20210311090819_RenamesAndMissingFields') THEN
    DROP TABLE "KusamaIncomeTransactions";
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20210311090819_RenamesAndMissingFields') THEN
    DROP INDEX "IX_Offers_CollectionId";
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20210311090819_RenamesAndMissingFields') THEN
    ALTER TABLE "Offers" ADD "QuoteId" numeric(20,0) NOT NULL DEFAULT 2.0;
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20210311090819_RenamesAndMissingFields') THEN
    CREATE TABLE "NftOutgoingTransactions" (
        "Id" uuid NOT NULL,
        "CollectionId" numeric(20,0) NOT NULL,
        "TokenId" numeric(20,0) NOT NULL,
        "Value" text NOT NULL,
        "RecipientPublicKey" text NOT NULL,
        "Status" integer NOT NULL,
        "LockTime" timestamp without time zone NULL,
        "ErrorMessage" text NULL,
        CONSTRAINT "PK_NftOutgoingTransactions" PRIMARY KEY ("Id")
    );
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20210311090819_RenamesAndMissingFields') THEN
    CREATE TABLE "QuoteIncomeTransactions" (
        "Id" uuid NOT NULL,
        "Amount" text NOT NULL,
        "QuoteId" numeric(20,0) NOT NULL,
        "Description" text NOT NULL,
        "AccountPublicKey" text NOT NULL,
        "BlockId" numeric(20,0) NULL,
        "Status" integer NOT NULL,
        "LockTime" timestamp without time zone NULL,
        "ErrorMessage" text NULL,
        CONSTRAINT "PK_QuoteIncomeTransactions" PRIMARY KEY ("Id")
    );
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20210311090819_RenamesAndMissingFields') THEN
    CREATE INDEX "IX_Offers_OfferStatus_CollectionId_TokenId" ON "Offers" ("OfferStatus", "CollectionId", "TokenId");
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20210311090819_RenamesAndMissingFields') THEN
    CREATE INDEX "IX_NftOutgoingTransactions_Status_LockTime" ON "NftOutgoingTransactions" ("Status", "LockTime") WHERE "Status" = 0;
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20210311090819_RenamesAndMissingFields') THEN
    CREATE INDEX "IX_QuoteIncomeTransactions_AccountPublicKey" ON "QuoteIncomeTransactions" ("AccountPublicKey");
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20210311090819_RenamesAndMissingFields') THEN
    CREATE INDEX "IX_QuoteIncomeTransactions_Status_LockTime" ON "QuoteIncomeTransactions" ("Status", "LockTime") WHERE "Status" = 0;
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20210311090819_RenamesAndMissingFields') THEN
    INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
    VALUES ('20210311090819_RenamesAndMissingFields', '5.0.2');
    END IF;
END $$;
COMMIT;

START TRANSACTION;


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

START TRANSACTION;


DO $$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20210311095148_RenamedTablesToSingular') THEN
    ALTER TABLE "NftIncomeTransactions" DROP CONSTRAINT "FK_NftIncomeTransactions_UniqueProcessedBlocks_UniqueProcessed~";
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20210311095148_RenamedTablesToSingular') THEN
    ALTER TABLE "Trades" DROP CONSTRAINT "FK_Trades_Offers_OfferId";
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20210311095148_RenamedTablesToSingular') THEN
    ALTER TABLE "UniqueProcessedBlocks" DROP CONSTRAINT "PK_UniqueProcessedBlocks";
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20210311095148_RenamedTablesToSingular') THEN
    ALTER TABLE "Trades" DROP CONSTRAINT "PK_Trades";
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20210311095148_RenamedTablesToSingular') THEN
    ALTER TABLE "QuoteOutgoingTransactions" DROP CONSTRAINT "PK_QuoteOutgoingTransactions";
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20210311095148_RenamedTablesToSingular') THEN
    ALTER TABLE "Offers" DROP CONSTRAINT "PK_Offers";
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20210311095148_RenamedTablesToSingular') THEN
    ALTER TABLE "NftOutgoingTransactions" DROP CONSTRAINT "PK_NftOutgoingTransactions";
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20210311095148_RenamedTablesToSingular') THEN
    ALTER TABLE "NftIncomeTransactions" DROP CONSTRAINT "PK_NftIncomeTransactions";
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20210311095148_RenamedTablesToSingular') THEN
    ALTER TABLE "KusamaProcessedBlocks" DROP CONSTRAINT "PK_KusamaProcessedBlocks";
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20210311095148_RenamedTablesToSingular') THEN
    ALTER TABLE "UniqueProcessedBlocks" RENAME TO "UniqueProcessedBlock";
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20210311095148_RenamedTablesToSingular') THEN
    ALTER TABLE "Trades" RENAME TO "Trade";
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20210311095148_RenamedTablesToSingular') THEN
    ALTER TABLE "QuoteOutgoingTransactions" RENAME TO "QuoteOutgoingTransaction";
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20210311095148_RenamedTablesToSingular') THEN
    ALTER TABLE "Offers" RENAME TO "Offer";
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20210311095148_RenamedTablesToSingular') THEN
    ALTER TABLE "NftOutgoingTransactions" RENAME TO "NftOutgoingTransaction";
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20210311095148_RenamedTablesToSingular') THEN
    ALTER TABLE "NftIncomeTransactions" RENAME TO "NftIncomeTransaction";
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20210311095148_RenamedTablesToSingular') THEN
    ALTER TABLE "KusamaProcessedBlocks" RENAME TO "KusamaProcessedBlock";
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20210311095148_RenamedTablesToSingular') THEN
    ALTER INDEX "IX_Trades_OfferId" RENAME TO "IX_Trade_OfferId";
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20210311095148_RenamedTablesToSingular') THEN
    ALTER INDEX "IX_QuoteOutgoingTransactions_Status" RENAME TO "IX_QuoteOutgoingTransaction_Status";
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20210311095148_RenamedTablesToSingular') THEN
    ALTER INDEX "IX_Offers_OfferStatus_CollectionId_TokenId" RENAME TO "IX_Offer_OfferStatus_CollectionId_TokenId";
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20210311095148_RenamedTablesToSingular') THEN
    ALTER INDEX "IX_Offers_CreationDate" RENAME TO "IX_Offer_CreationDate";
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20210311095148_RenamedTablesToSingular') THEN
    ALTER INDEX "IX_NftOutgoingTransactions_Status_LockTime" RENAME TO "IX_NftOutgoingTransaction_Status_LockTime";
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20210311095148_RenamedTablesToSingular') THEN
    ALTER INDEX "IX_NftIncomeTransactions_UniqueProcessedBlockId" RENAME TO "IX_NftIncomeTransaction_UniqueProcessedBlockId";
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20210311095148_RenamedTablesToSingular') THEN
    ALTER INDEX "IX_NftIncomeTransactions_Status_LockTime" RENAME TO "IX_NftIncomeTransaction_Status_LockTime";
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20210311095148_RenamedTablesToSingular') THEN
    ALTER TABLE "UniqueProcessedBlock" ADD CONSTRAINT "PK_UniqueProcessedBlock" PRIMARY KEY ("BlockNumber");
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20210311095148_RenamedTablesToSingular') THEN
    ALTER TABLE "Trade" ADD CONSTRAINT "PK_Trade" PRIMARY KEY ("Id");
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20210311095148_RenamedTablesToSingular') THEN
    ALTER TABLE "QuoteOutgoingTransaction" ADD CONSTRAINT "PK_QuoteOutgoingTransaction" PRIMARY KEY ("Id");
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20210311095148_RenamedTablesToSingular') THEN
    ALTER TABLE "Offer" ADD CONSTRAINT "PK_Offer" PRIMARY KEY ("Id");
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20210311095148_RenamedTablesToSingular') THEN
    ALTER TABLE "NftOutgoingTransaction" ADD CONSTRAINT "PK_NftOutgoingTransaction" PRIMARY KEY ("Id");
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20210311095148_RenamedTablesToSingular') THEN
    ALTER TABLE "NftIncomeTransaction" ADD CONSTRAINT "PK_NftIncomeTransaction" PRIMARY KEY ("Id");
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20210311095148_RenamedTablesToSingular') THEN
    ALTER TABLE "KusamaProcessedBlock" ADD CONSTRAINT "PK_KusamaProcessedBlock" PRIMARY KEY ("BlockNumber");
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20210311095148_RenamedTablesToSingular') THEN
    ALTER TABLE "NftIncomeTransaction" ADD CONSTRAINT "FK_NftIncomeTransaction_UniqueProcessedBlock_UniqueProcessedBl~" FOREIGN KEY ("UniqueProcessedBlockId") REFERENCES "UniqueProcessedBlock" ("BlockNumber") ON DELETE CASCADE;
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20210311095148_RenamedTablesToSingular') THEN
    ALTER TABLE "Trade" ADD CONSTRAINT "FK_Trade_Offer_OfferId" FOREIGN KEY ("OfferId") REFERENCES "Offer" ("Id") ON DELETE CASCADE;
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20210311095148_RenamedTablesToSingular') THEN
    INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
    VALUES ('20210311095148_RenamedTablesToSingular', '5.0.2');
    END IF;
END $$;
COMMIT;

START TRANSACTION;


DO $$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20210311100100_RenamedIncomeToIncoming') THEN
    DROP TABLE "NftIncomeTransaction";
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20210311100100_RenamedIncomeToIncoming') THEN
    DROP TABLE "QuoteIncomeTransactions";
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20210311100100_RenamedIncomeToIncoming') THEN
    CREATE TABLE "NftIncomingTransaction" (
        "Id" uuid NOT NULL,
        "CollectionId" bigint NOT NULL,
        "TokenId" bigint NOT NULL,
        "Value" text NOT NULL,
        "OwnerPublicKey" text NOT NULL,
        "Status" integer NOT NULL,
        "LockTime" timestamp without time zone NULL,
        "ErrorMessage" text NULL,
        "UniqueProcessedBlockId" numeric(20,0) NOT NULL,
        CONSTRAINT "PK_NftIncomingTransaction" PRIMARY KEY ("Id"),
        CONSTRAINT "FK_NftIncomingTransaction_UniqueProcessedBlock_UniqueProcessed~" FOREIGN KEY ("UniqueProcessedBlockId") REFERENCES "UniqueProcessedBlock" ("BlockNumber") ON DELETE CASCADE
    );
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20210311100100_RenamedIncomeToIncoming') THEN
    CREATE TABLE "QuoteIncomingTransaction" (
        "Id" uuid NOT NULL,
        "Amount" text NOT NULL,
        "QuoteId" numeric(20,0) NOT NULL,
        "Description" text NOT NULL,
        "AccountPublicKey" text NOT NULL,
        "BlockId" numeric(20,0) NULL,
        "Status" integer NOT NULL,
        "LockTime" timestamp without time zone NULL,
        "ErrorMessage" text NULL,
        CONSTRAINT "PK_QuoteIncomingTransaction" PRIMARY KEY ("Id")
    );
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20210311100100_RenamedIncomeToIncoming') THEN
    CREATE INDEX "IX_NftIncomingTransaction_Status_LockTime" ON "NftIncomingTransaction" ("Status", "LockTime") WHERE "Status" = 0;
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20210311100100_RenamedIncomeToIncoming') THEN
    CREATE INDEX "IX_NftIncomingTransaction_UniqueProcessedBlockId" ON "NftIncomingTransaction" ("UniqueProcessedBlockId");
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20210311100100_RenamedIncomeToIncoming') THEN
    CREATE INDEX "IX_QuoteIncomingTransaction_AccountPublicKey" ON "QuoteIncomingTransaction" ("AccountPublicKey");
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20210311100100_RenamedIncomeToIncoming') THEN
    CREATE INDEX "IX_QuoteIncomingTransaction_Status_LockTime" ON "QuoteIncomingTransaction" ("Status", "LockTime") WHERE "Status" = 0;
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20210311100100_RenamedIncomeToIncoming') THEN
    INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
    VALUES ('20210311100100_RenamedIncomeToIncoming', '5.0.2');
    END IF;
END $$;
COMMIT;

START TRANSACTION;


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
COMMIT;

START TRANSACTION;


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
COMMIT;

START TRANSACTION;


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
COMMIT;

START TRANSACTION;


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
COMMIT;

START TRANSACTION;


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
COMMIT;

START TRANSACTION;


DO $$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20210805043620_AddTokenPrefixAndIdToSearch') THEN
    INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
    VALUES ('20210805043620_AddTokenPrefixAndIdToSearch', '5.0.2');
    END IF;
END $$;
COMMIT;


