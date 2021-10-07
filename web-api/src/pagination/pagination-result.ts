export interface PaginationResult<T> {
  items: T[]
  itemsCount: number;
  page: number;
  pageSize: number;
}