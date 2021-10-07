import { Injectable } from '@nestjs/common';
import { Connection, SelectQueryBuilder } from 'typeorm';
import { Trade } from '../../unique-migrations-seeds/src';
import { nullOrWhitespace } from 'src/string/null-or-white-space';
import {decodeAddress, encodeAddress} from "@polkadot/util-crypto";
import { PaginationRequest } from 'src/pagination/pagination-request';
import { PaginationResult } from 'src/pagination/pagination-result';
import { TradeDto } from './trade-dto';
import { paginate } from 'src/pagination/paginate';

@Injectable()
export class TradesService {

  constructor(private connection: Connection) {
  }

  filterByCollectionIds(query: SelectQueryBuilder<Trade>, collectionIds: number[] | undefined) {
    if(collectionIds == null || collectionIds.length <= 0) {
      return query;
    }

    return query.andWhere('offer.CollectionId in (:...collectionIds)', {collectionIds});
  }

  filterBySeller(query: SelectQueryBuilder<Trade>, seller: string | undefined): SelectQueryBuilder<Trade> {
    if(nullOrWhitespace(seller)) {
      return query;
    }

    const key = Buffer.from(decodeAddress(seller)).toString('base64');


    return query.andWhere('offer.Seller = :seller', {seller: key});
  }

  async get(collectionIds: number[] | undefined, seller: string | undefined, paginationRequest: PaginationRequest): Promise<PaginationResult<TradeDto>> {
    let tradesQuery = this.connection.manager.createQueryBuilder(Trade, 'trade')
      .innerJoinAndSelect('trade.offer', 'offer');

    tradesQuery = this.filterByCollectionIds(tradesQuery, collectionIds);
    tradesQuery = this.filterBySeller(tradesQuery, seller);

    const paginationResult = await paginate(tradesQuery, paginationRequest);

    return {
      ...paginationResult,
      items: paginationResult.items.map(t => this.mapToDto(t))
    }
  }

  mapToDto(trade: Trade): TradeDto {
    return {
      buyer: trade.buyer && encodeAddress(Buffer.from(trade.buyer, 'base64')),
      seller: trade.offer.seller && encodeAddress(Buffer.from(trade.offer.seller, 'base64')),
      collectionId: +trade.offer.collectionId,
      creationDate: trade.offer.creationDate,
      metadata: trade.offer.metadata,
      price: trade.offer.price?.toString(),
      quoteId: +trade.offer.quoteId,
      tokenId: +trade.offer.tokenId,
      tradeDate: trade.tradeDate
    }
  }
}
