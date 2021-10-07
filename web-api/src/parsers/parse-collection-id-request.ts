import { BadRequestException } from "@nestjs/common";
import { QueryParamArray } from "src/query-param-array";
import { parseIntArrayRequest } from "./parse-int-array-request";

export function parseCollectionIdRequest(collectionId: QueryParamArray): number[] {
  return parseIntArrayRequest(
    collectionId,
    v => {
      throw new BadRequestException({}, `Failed to parse collection id from ${JSON.stringify(collectionId)}, unable to parse ${v} as integer.`)
    }
  );
}