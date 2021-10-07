import { ArgumentMetadata, HttpStatus, Injectable, Optional, PipeTransform } from "@nestjs/common";
import { ErrorHttpStatusCode, HttpErrorByCode } from "@nestjs/common/utils/http-error-by-code.util";
import { requestArray } from "src/parsers/request-array";
import { equalsIgnoreCase } from "src/string/equals-ignore-case";
import { TransformationResult } from "src/type-generators/transformation-result";
import { UntypedRequest } from "src/type-generators/untyped-request";
import { SortingOrder } from "./sorting-order";
import { SortingParameter } from "./sorting-parameter";
import { SortingRequest } from "./sorting-request";


export interface ParseSortingRequestPipeOptions {
  errorHttpStatusCode?: ErrorHttpStatusCode;
  exceptionFactory?: (error: string) => any;
}

@Injectable()
export class ParseSortingRequestPipe implements PipeTransform<any, TransformationResult<SortingRequest>> {
  protected exceptionFactory: (error: string) => any;
  private parsingRegex : RegExp;

  constructor(@Optional() options?: ParseSortingRequestPipeOptions) {
    options = options || {};
    const { exceptionFactory, errorHttpStatusCode = HttpStatus.BAD_REQUEST } =
      options;

    this.exceptionFactory =
      exceptionFactory ||
      (error => new HttpErrorByCode[errorHttpStatusCode](error));

      this.parsingRegex = /(?<order>asc|desc)\((?<column>\w+)\)/i;
  }

  transform(value: UntypedRequest<SortingRequest>, metadata: ArgumentMetadata): TransformationResult<SortingRequest> {
    if(metadata?.metatype?.name !== 'SortingRequest') {
      return value;
    }

    return new SortingRequest({
      sort: requestArray(value.sort).map((r) => this.parseSortingParameter(r)),
    });
  }

  parseSortingParameter(str: string): SortingParameter {
    try {
      const match = this.parsingRegex.exec(str);
      const column = match?.groups?.column ?? '';

      if(equalsIgnoreCase('asc', match?.groups?.order)) {
        return {
          order: SortingOrder.Asc,
          column
        };
      }

      if(equalsIgnoreCase('desc', match?.groups?.order)) {
        return {
          order: SortingOrder.Desc,
          column
        };
      }

    } catch (error) {
    }

    throw this.exceptionFactory(`Failed to parse sorting parameter. Expected an array of strings like 'asc(column)' or 'desc(column)'. Got ${str}.`);
  }
}