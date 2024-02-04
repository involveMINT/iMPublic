import { IExactQuery, IQuery } from './query';
import { PAGINATE_KEY } from './constants';

export function createTypeormRelationsArray<T, Q extends IQuery<T>>(query: IExactQuery<T, Q>) {
  const arr: string[] = [];

  const parse = (q: any, root: string) => {
    for (const k in q) {
      if (typeof q[k] === 'object' && k !== PAGINATE_KEY) {
        const newRoot = `${root}${root ? '.' : ''}${k}`;
        arr.push(newRoot);
        parse(q[k], newRoot);
      }
    }
    return arr;
  };

  return parse(query, '');
}
