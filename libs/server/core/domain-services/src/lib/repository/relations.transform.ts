import { Query, ExactQuery, PAGINATE_KEY } from "@involvemint/shared/domain";

export function createTypeormRelationsArray<T, Q extends Query<T>>(query: ExactQuery<T, Q>) {
  const arr: string[] = [];

  const parse = (query: any, root: string) => {
    for (const key in query) {
      if (typeof query[key] === 'object' && key !== PAGINATE_KEY) {
        const newRoot = `${root}${root ? '.' : ''}${key}`;
        arr.push(newRoot);
        parse(query[key], newRoot);
      }
    }
    return arr;
  };

  return parse(query, '');
}
