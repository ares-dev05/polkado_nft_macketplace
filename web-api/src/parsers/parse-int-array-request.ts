import { QueryParamArray } from "src/query-param-array";
import { parseIntRequest } from "./parse-int-request";
import { requestArray } from "./request-array";

export function parseIntArrayRequest(request: QueryParamArray, onError: (badValue: string) => void): number[] {
  return requestArray(request)
    .map(v => parseIntRequest(v, () => onError(v)))
    .filter(v => v != null) as number[];
}
