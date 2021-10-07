import { SelectQueryBuilder } from "typeorm/query-builder/SelectQueryBuilder";
import { PaginationRequest } from "./pagination-request";
import { PaginationResult } from "./pagination-result";

export async function paginate<T>(query: SelectQueryBuilder<T>, parameter: PaginationRequest): Promise<PaginationResult<T>> {
  const page = parameter.page ?? 1;
  const pageSize = parameter.pageSize ?? 10;
  const [items, itemsCount] = await Promise.all([
    query.skip((page - 1) * pageSize).limit(pageSize).getMany(),
    query.getCount()]
  );

  return {
    page,
    pageSize,
    itemsCount,
    items
  };
}

export {};