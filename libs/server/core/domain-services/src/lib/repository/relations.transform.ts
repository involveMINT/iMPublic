import { PAGINATE_KEY } from '../../../../../../shared/domain/src/lib/domain/repository/constants';
import { IExactQuery, IQuery } from '../../../../../../shared/domain/src/lib/domain/repository/query';

export function createTypeormRelationsArray<T, Q extends IQuery<T>>(query: IExactQuery<T, Q>) {
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
