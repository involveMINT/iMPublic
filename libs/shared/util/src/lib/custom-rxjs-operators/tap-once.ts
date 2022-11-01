import { defer, MonoTypeOperatorFunction, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

export const tapOnce = <T>(next?: (arg: T) => void): MonoTypeOperatorFunction<T> => {
  return (source: Observable<T>) => {
    return defer(() => {
      let run = false;
      return source.pipe(
        tap((arg) => {
          if (!run) {
            if (next) next(arg);
            run = true;
          }
        })
      );
    });
  };
};
