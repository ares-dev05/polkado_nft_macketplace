import { Connection } from "typeorm";

export interface MarketplaceRepository {
  connect(): Promise<Connection>;
}