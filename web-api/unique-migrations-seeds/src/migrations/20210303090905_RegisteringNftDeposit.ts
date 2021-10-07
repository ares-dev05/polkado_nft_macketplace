import { MarketplaceMigration } from "./marketplace-migration";

const registeringNftDeposit: MarketplaceMigration = {
  name: '20210303090905_RegisteringNftDeposit',
  script: `START TRANSACTION;


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
  COMMIT;`
};

export {registeringNftDeposit};