/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-types */
import { PAGINATE_KEY, PAGINATE_PAGE, PAGINATE_LIMIT } from './constants';
import { IAnyRelation } from './relations';

/** Empty object `{}` response. */
export type EmptyResponse = {};

/**
 * Describes the fundamental type for an Orcha Query.
 * An Orcha Query model can be either an object with keys representing properties and values
 * indicating whether they should be included in the query, or an IPaginate object for pagination.
 *
 * @example
 * ```
 * const queryModel: IQueryModel = {
 *   name: true,  // Include 'name' property in the query
 *   age: {       // Include 'age' property and its sub-properties in the query
 *     greaterThan: 18,
 *   },
 *   paginate: {  // Use pagination settings
 *     page: 1,
 *     pageSize: 10,
 *   },
 * };
 * ```
 */
export type IQueryModel = { [k: string]: true | IQueryModel } | IPaginate;

/**
 * Create a primitive Orcha Query from a model.
 * The IQuery type is a utility type that transforms a query model into a corresponding
 * Orcha Query type, considering array types, pagination, and nested query objects.
 *
 * @template T - The type for which the query is intended.
 * @example
 * ```
 * type UserQuery = IQuery<User>;
 * ```
 */
export type IQuery<T> = T extends Array<infer A> ? IQueryArray<A> & IPaginate : IQueryArray<T>;

/**
 * Utility type to handle array types in Orcha Queries.
 * It transforms an array type into an IQueryArray type, considering pagination and nested queries.
 *
 * @template T - The type of the array elements.
 */
export type IQueryArray<T> = T extends Array<infer A> ? IQueryUndefined<A> : IQueryUndefined<T>;

/**
 * Utility type to handle undefined types in Orcha Queries.
 * It transforms an undefined type into an IQueryObject type, ensuring that undefined types are treated
 * as query objects with the same structure as their non-undefined counterparts.
 *
 * @template T - The type for which the undefined type is transformed.
 */
export type IQueryUndefined<T> = T extends undefined
  ? IQueryObject<NonNullable<T>> | undefined
  : IQueryObject<T>;

 /**
 * Represents a query object for searching or filtering data related to a type `T`.
 * The object's properties mirror the properties of the type `T`, and their types are determined
 * based on whether they are objects or non-objects. If a property is an object, additional
 * information is captured, especially when dealing with relations represented by the `IAnyRelation` type.
 *
 * For properties that are instances of `IAnyRelation`, the check determines if there is an
 * associated "orchestrated" relationship defined by that property. If such a relationship is defined
 * and is required, the property is automatically included in the resulting query object.
 *
 * @template T - The type for which the query object is intended.
 */
export type IQueryObject<T> = {
  [K in keyof T]?: NonNullable<T[K]> extends object
    ? {
        [_ in keyof NonNullable<T[K]>]: NonNullable<T[K]> extends IAnyRelation<infer R, infer _>
          ? Required<T> extends Required<R>
            ? true
            : IQueryArray<T[K]>
          : true;
      }[keyof NonNullable<T[K]>]
    : true;
};

/**
 * Required fields for pagination information.
 */
export interface IPaginate {
  [PAGINATE_KEY]?: {
    [PAGINATE_PAGE]: number;
    [PAGINATE_LIMIT]: number;
  };
}

/**
 * Represents an exact Orcha Query with a specific type `T` and a query model `Q`.
 * It transforms an array type into an IExactQueryObject type, considering pagination and nested queries.
 *
 * @template T - The type for which the exact query is intended.
 * @template Q - The query model describing the exact query.
 * @example
 * ```
 * type UserExactQuery = IExactQuery<User, { name: true, age: { greaterThan: 18 } }>;
 * ```
 */
export type IExactQuery<T, Q> = T extends Array<infer A> ? IExactQueryObject<A, Q> : IExactQueryObject<T, Q>;

/**
 * Utility type representing an exact Orcha Query object.
 * It is built based on the query model `Q` and the type `T`, ensuring that the resulting
 * query object has a structure compatible with the type `T`.
 *
 * @template T - The type for which the exact query object is intended.
 * @template Q - The query model describing the exact query.
 */
export type IExactQueryObject<T, Q> = Q & {
  [K in keyof Q]: K extends typeof PAGINATE_KEY
    ? Q[K] // Preserve pagination settings
    : K extends keyof T
    ? IExactQuery<T[K], Q[K]> // Handle nested queries
    : never;
};
