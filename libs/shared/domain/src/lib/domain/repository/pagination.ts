import { Pagination } from 'nestjs-typeorm-paginate';

/**
 * Describes the response schema for a pagination-based Operation.
 */
export type IPagination<E> = Pagination<E>;

