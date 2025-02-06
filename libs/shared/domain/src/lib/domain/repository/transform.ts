/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-types */
import { IPagination } from './pagination';
import { IParser } from './parser';
import { ExactQuery, Query } from './ormquery';

/**
 * Manually parse an Query.
 *
 * This will recursively go through all `entities` and remove values that are not specified in the query.
 *
 * @example
 * ```ts
 * const query = createQuery<{ id: string; data: { name: string } }>()({
 *   id: true,
 *   data: {
 *     name: true,
 *   },
 * });
 * const parsed = parseQuery(query, [
 *   {
 *     id: 1,
 *     extraField: 'field',
 *     data: {
 *       name: 'James',
 *       initial: 'J',
 *     },
 *   },
 *   {
 *     id: 2,
 *     extraField: 'field',
 *     data: {
 *       name: 'Lilly',
 *       initial: 'L',
 *     },
 *   },
 * ]);
 *
 * // output:
 * // [
 * //   {
 * //     id: 1,
 * //     data: {
 * //       name: 'James',
 * //     },
 * //   },
 * //   {
 * //     id: 2,
 * //     data: {
 * //       name: 'Lilly',
 * //     },
 * //   },
 * // ]
 * ```
 *
 * @param query Reference Query.
 * @param entities Objects to parse.
 */
export function parseQuery<T, Q extends Query<T>>(query: ExactQuery<T, Q>, entities: T): IParser<T, Q>;
export function parseQuery<T, Q extends Query<T>>(
  query: ExactQuery<T, Q>,
  entities: T[] | IPagination<T>
): IParser<T[], Q>;
export function parseQuery<T, Q extends Query<T>>(
  query: ExactQuery<T, Q>,
  entities: T | T[] | IPagination<T> | undefined
) {
  if (!entities) return undefined;

  // is pagination
  if ('items' in entities && 'meta' in entities) {
    const i = parseQuery(query, entities.items);
    // TODO any
    (entities as any).items = i;
    return entities as unknown as IParser<T[], Q>;
  }

  if (Array.isArray(query)) {
    query = query[0];
  }

  const remove = (e: T) => {
    const qKeys = Object.keys(query as object);
    for (const k of Object.keys(e)) {
      if (!qKeys.includes(k)) {
        delete e[k as keyof T];
      }
    }

    for (const [k, q] of Object.entries(query as object)) {
      if (typeof q === 'object') {
        parseQuery(q, e[k as keyof T]);
      }
    }

    return e;
  };

  if (Array.isArray(entities)) {
    entities.map((e) => remove(e));
    return entities as unknown as IParser<T[], Q>;
  } else {
    entities = remove(entities);
    return entities as unknown as IParser<T, Q>;
  }
}
