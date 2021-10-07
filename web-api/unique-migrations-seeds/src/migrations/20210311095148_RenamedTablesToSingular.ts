import { MarketplaceMigration } from "./marketplace-migration";

const renamedTablesToSingular: MarketplaceMigration = {
  name: '20210311095148_RenamedTablesToSingular',
  script: `START TRANSACTION;


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
  COMMIT;`
}

export {renamedTablesToSingular};