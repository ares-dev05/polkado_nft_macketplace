import { ArgumentMetadata, HttpStatus, Injectable, Optional, PipeTransform } from "@nestjs/common";
import { ErrorHttpStatusCode, HttpErrorByCode } from "@nestjs/common/utils/http-error-by-code.util";
import { parseBigIntRequest } from "src/parsers/parse-big-int-request";
import { parseCollectionIdRequest } from "src/parsers/parse-collection-id-request";
import { parseIntRequest } from "src/parsers/parse-int-request";
import { requestArray } from "src/parsers/request-array";
import { TransformationResult } from "src/type-generators/transformation-result";
import { UntypedRequest } from "src/type-generators/untyped-request";
import { OffersFilter } from "./offers-filter";


export interface ParseOffersFilterPipeOptions {
  errorHttpStatusCode?: ErrorHttpStatusCode;
  exceptionFactory?: (error: string) => any;
}

@Injectable()
export class ParseOffersFilterPipe implements PipeTransform<any, TransformationResult<OffersFilter>> {
  protected exceptionFactory: (error: string) => any;

  constructor(@Optional() options?: ParseOffersFilterPipeOptions) {
    options = options || {};
    const { exceptionFactory, errorHttpStatusCode = HttpStatus.BAD_REQUEST } =
      options;

    this.exceptionFactory =
      exceptionFactory ||
      (error => new HttpErrorByCode[errorHttpStatusCode](error));
  }

  transform(value: UntypedRequest<OffersFilter>, metadata: ArgumentMetadata): TransformationResult<OffersFilter> {
    if(metadata?.metatype?.name !== 'OffersFilter') {
      return value;
    }

    return new OffersFilter({
      collectionId: parseCollectionIdRequest(value.collectionId),
      maxPrice: parseBigIntRequest(value.maxPrice, () => {throw this.exceptionFactory(`Failed to parse maxPrice. Expected a big integer value, got ${value.maxPrice}`)}),
      minPrice: parseBigIntRequest(value.minPrice, () => {throw this.exceptionFactory(`Failed to parse minPrice. Expected a big integer value, got ${value.minPrice}`)}),
      searchLocale: value.searchLocale,
      searchText: value.searchText,
      seller: value.seller,
      traitsCount: requestArray(value.traitsCount)
        .map(id => parseIntRequest(id, () => {throw this.exceptionFactory(`Failed to parse traits count. Expected an array of integers, got ${JSON.stringify(value.traitsCount)}`);}))
        .filter(id => id != null) as number[],
    });
  }
}