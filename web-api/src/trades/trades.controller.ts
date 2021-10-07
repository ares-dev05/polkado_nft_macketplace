import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';
import { queryArray } from 'src/decorators/query-array.decorator';
import { PaginationRequest } from 'src/pagination/pagination-request';
import { PaginationResult } from 'src/pagination/pagination-result';
import { parseCollectionIdRequest } from 'src/parsers/parse-collection-id-request';
import { QueryParamArray } from 'src/query-param-array';
import { TradeDto } from './trade-dto';
import { TradesService } from './trades.service';


@Controller('Trades')
export class TradesController {
  constructor(private readonly tradesService: TradesService) {}

  @ApiQuery(queryArray('collectionId', 'integer'))
  @Get()
  get(@Query() pagination: PaginationRequest, @Query('collectionId') collectionId?: QueryParamArray): Promise<PaginationResult<TradeDto>> {
    return this.tradesService.get(parseCollectionIdRequest(collectionId), undefined, pagination);
  }

  @ApiQuery(queryArray('collectionId', 'integer'))
  @Get(':seller')
  getBySeller(@Param('seller') seller: string, @Query() pagination: PaginationRequest, @Query('collectionId') collectionId?: QueryParamArray): Promise<PaginationResult<TradeDto>> {
    return this.tradesService.get(parseCollectionIdRequest(collectionId), seller, pagination);
  }
}
