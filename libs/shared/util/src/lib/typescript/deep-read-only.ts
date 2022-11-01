/**
 * Makes me and all my children immutable
 */
export type DeepReadonly<T> = T extends Array<infer R>
  ? DeepReadonlyArray<R>
  : // eslint-disable-next-line @typescript-eslint/ban-types
  T extends Function
  ? T
  : // eslint-disable-next-line @typescript-eslint/ban-types
  T extends object
  ? Readonly<T>
  : T;

type DeepReadonlyArray<T> = ReadonlyArray<DeepReadonly<T>>;

/**
 * Makes me and all my children immutable
 * @param arg convert to deep read only
 */
export const convertDeepReadonly = <T>(arg: T) => arg as DeepReadonly<T>;
