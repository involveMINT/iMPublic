export type UnArray<T> = T extends Array<infer U> ? U : T;
