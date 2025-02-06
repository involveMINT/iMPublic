import { IPagination } from './pagination';
import { IParser, IParseUndefined } from './parser';
import { ExactQuery, Query } from './ormquery';
import { IPaginate } from './query';

type EntityOrPagination<T> = T | T[] | IPagination<T>;

export function parseQuery<T extends object, Q extends Query<T>>(
  query: ExactQuery<T, Q>,
  entities: T
): IParseUndefined<T, Q>;
export function parseQuery<T extends object, Q extends Query<T>>(
  query: ExactQuery<T, Q>,
  entities: T[] | IPagination<T>
): Q extends Required<IPaginate> ? IPagination<IParseUndefined<T, Q>> : IParseUndefined<T, Q>[];
export function parseQuery<T extends object, Q extends Query<T>>(
  query: ExactQuery<T, Q>,
  entities: EntityOrPagination<T> | undefined
): IParser<T, Q> | undefined {
  if (!entities) return undefined;

  if (isPagination(entities)) {
    const parsedItems = parseQuery(query, entities.items);
    return {
      ...entities,
      items: parsedItems,
    } as IPagination<IParseUndefined<T, Q>>;
  }

  const normalizedQuery = Array.isArray(query) ? query[0] : query;

  const remove = (e: T): IParseUndefined<T, Q> => {
    const qKeys = new Set(Object.keys(normalizedQuery));
    const filteredEntity = Object.fromEntries(
      Object.entries(e).filter(([key]) => qKeys.has(key))
    ) as IParseUndefined<T, Q>;

    for (const [key, value] of Object.entries(normalizedQuery)) {
      if (typeof value === 'object' && value !== null) {
        (filteredEntity as any)[key] = parseQuery(value, (e as any)[key]);
      }
    }

    return filteredEntity;
  };

  return Array.isArray(entities)
    ? entities.map(remove) as IParseUndefined<T, Q>[]
    : remove(entities);
}

function isPagination<T>(entity: EntityOrPagination<T>): entity is IPagination<T> {
  return entity !== null && typeof entity === 'object' && 'items' in entity && 'meta' in entity;
}

