export interface IRoute {
  ROOT: string;
  // eslint-disable-next-line @typescript-eslint/ban-types
  [k: string]: string | number | IRoute | Function;
}

export interface IRoutes<T> {
  path: T;
  postfix: T;
}

export const routesFactory = <T extends IRoute>(routes: T): IRoutes<T> => {
  let prevObj = { ...routes } as IRoute;
  let first = true;

  const convertToPath = (obj: IRoute): IRoute => {
    const iter = { ...obj };
    for (const k in iter) {
      const v = iter[k];
      if (k === 'ROOT') {
        if (first) {
          if (prevObj.ROOT === '') {
            iter[k] = '';
          } else {
            iter[k] = prevObj.ROOT;
          }
          first = false;
        } else {
          iter[k] = `${prevObj.ROOT}/${v}`;
        }
      } else {
        if (typeof v === 'object') {
          prevObj = iter;
          iter[k] = convertToPath(v);
        } else if (typeof v === 'string') {
          iter[k] = `${iter.ROOT}/${v}`;
        }
      }
    }
    return iter;
  };

  const path = convertToPath(routes) as T;

  return {
    path,
    postfix: routes,
  };
};
