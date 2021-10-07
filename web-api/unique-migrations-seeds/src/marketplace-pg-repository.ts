import "reflect-metadata";
import { KusamaProcessedBlock, NftIncomingTransaction, NftOutgoingTransaction, Offer, QuoteIncomingTransaction, QuoteOutgoingTransaction, TokenTextSearch, Trade, UniqueProcessedBlock } from "./";
import { createConnection, Connection } from "typeorm";
import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";
import { MarketplaceRepository } from "./marketplace-repository";
import { migrationsList } from "./migrations/migrations-list";

type MarketplaceConnectionOptions = Required<Pick<PostgresConnectionOptions, 'host'|'port'|'username'|'password'|'database'>> & Pick<PostgresConnectionOptions, 'logger' | 'logging'>;

export class MarketplacePgRepository implements MarketplaceRepository {
  private static migrated = false;

  constructor(private connectionParameters: MarketplaceConnectionOptions) {
  }

  public async connect(): Promise<Connection> {
    const connection = await createConnection({
      ...this.connectionParameters,
      type: 'postgres',
      entities:[
        KusamaProcessedBlock,
        NftIncomingTransaction,
        NftOutgoingTransaction,
        Offer,
        QuoteIncomingTransaction,
        QuoteOutgoingTransaction,
        TokenTextSearch,
        Trade,
        UniqueProcessedBlock,
      ],
    });

    if(!MarketplacePgRepository.migrated) {
      for(let migration of migrationsList) {
        try {
          await connection.manager.query(migration.script);
        }catch(e) {
          throw {message: `Failed to apply migration: ${migration.name}`, error: e};
        }
      }
      MarketplacePgRepository.migrated = true;
    }

    return connection;
  }
}
