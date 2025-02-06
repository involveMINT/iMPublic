/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-types */
import { PAGINATE_KEY, PAGINATE_LIMIT, PAGINATE_PAGE } from './constants';
import { IAnyRelation } from './relations';

/** Represents an empty response object. */
export type OrmEmptyResponse = Record<string, never>;

/** Fundamental type for a query model, without recursion. */
type BaseQueryModel = Record<string, true | unknown>;

/** Combines the base query model with pagination capabilities. */
export type QueryModel = BaseQueryModel | Paginate;

/** Constructs a query type for a given model structure. */
export type Query<T> = T extends Array<infer Element>
  ? QueryArray<Element> & Paginate
  : QueryArray<T>;

/** Determines how arrays in the query model are handled. */
export type QueryArray<T> = T extends Array<infer Element>
  ? QueryUndefined<Element>
  : QueryUndefined<T>;

/** Handles undefined values within the query type. */
export type QueryUndefined<T> = T extends undefined
  ? QueryObject<NonNullable<T>> | undefined
  : QueryObject<T>;

/** Builds the query type recursively for each property in the model. */
export type QueryObject<T> = {
  [K in keyof T]?: NonNullable<T[K]> extends object
    ? NonNullable<T[K]> extends IAnyRelation<infer R, infer _>
      ? Required<T> extends Required<R>
        ? true
        : QueryArray<T[K]>
      : QueryObject<NonNullable<T[K]>>
    : true;
};

/** Defines the structure for pagination information. */
export interface Paginate {
  [PAGINATE_KEY]?: {
    [PAGINATE_PAGE]: number;
    [PAGINATE_LIMIT]: number;
  };
}

/** Utility type to ensure the query matches the exact structure of model `T`. */
export type ExactQuery<T, Q> = T extends Array<infer A>
  ? ExactQueryObject<A, Q>
  : ExactQueryObject<T, Q>;

export type ExactQueryObject<T, Q> = Q & {
  [K in keyof Q]: K extends typeof PAGINATE_KEY
    ? Q[K]
    : K extends keyof T
    ? ExactQuery<T[K], Q[K]>
    : never;
};
