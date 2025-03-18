/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Creates a One-to-One relationship with another entity.
 *
 * @example
 * ```ts
 * interface User {
 *   id: string;
 *   privateData: IOneToOne<'user', UserPrivate>;
 * }
 *
 * interface UserPrivate {
 *   id: string;
 *   user: IOneToOne<'privateData', User>;
 * }
 * ```
 */
export type IOneToOne<Relation, SelfKey extends keyof Relation> = {
  [K in keyof Relation as SelfKey extends K ? never : K]: Relation[K];
};

/**
 * Creates a One-to-Many relationship with another entity.
 *
 * @example
 * ```ts
 * interface User {
 *   id: string;
 *   posts: IOneToMany<'user', Post>;
 * }
 *
 * interface Post {
 *   id: string;
 *   user: IManyToOne<'posts', User>;
 * }
 * ```
 */
export type IOneToMany<Relation, SelfKey extends keyof Relation> = {
  [K in keyof Relation as SelfKey extends K ? never : K]: Relation[K];
}[];

/**
 * Creates a Many-to-One relationship with another entity.
 *
 * @example
 * ```ts
 * interface Post {
 *   id: string;
 *   user: IManyToOne<'posts', User>;
 * }
 *
 * interface User {
 *   id: string;
 *   posts: IOneToMany<'user', Post>;
 * }
 * ```
 */
export type IManyToOne<Relation, SelfKey extends keyof Relation> = {
  [K in keyof Relation as SelfKey extends K ? never : K]: Relation[K];
};

/**
 * Creates a Many-to-Many relationship with another entity.
 *
 * @example
 * ```ts
 * interface Todo {
 *   id: string;
 *   todos: IManyToMany<'todos', Tag>;
 * }
 *
 * interface Tag {
 *   id: string;
 *   todos: IManyToMany<'tags', Todo>;
 * }
 * ```
 *
 * @note
 * It is not recommended to directly use Many-to-Many relationships but instead, create a separate
 * entity that links the two entities together by using One-to-Many and Many-to-One relations.
 * This has the added advantage of adding columns to your linked entities.
 *
 *
 * Instead of doing this:
 * ```ts
 * interface Todo {
 *   id: string;
 *   todos: IManyToMany<'todos', Tag>;
 * }
 *
 * interface Tag {
 *   id: string;
 *   todos: IManyToMany<'tags', Todo>;
 * }
 * ```
 * Do this:
 * ```ts
 * interface Todo {
 *   id: string;
 *   taggedTodos: IOneToMany<'todo', TaggedTodo>;
 * }
 *
 * interface Tag {
 *   id: string;
 *   taggedTodos: IOneToMany<'tag', TaggedTodo>;
 * }
 *
 * interface TaggedTodo {
 *   id: string;
 *   dateLinked: Date; // Added meta column.
 *   todo: IManyToOne<Todo, 'taggedTodo'>;
 *   tag: IManyToOne<Tag, 'taggedTodo'>;
 * }
 * ```
 */
export type IManyToMany<Relation, SelfKey extends keyof Relation> = {
  [K in keyof Relation as SelfKey extends K ? never : K]: Relation[K];
}[];

/**
 * Utility type for any relation.
 */
export type IAnyRelation<Relation, SelfKey extends keyof Relation> =
  | IOneToOne<Relation, SelfKey>
  | IOneToMany<Relation, SelfKey>
  | IManyToOne<Relation, SelfKey>
  | IManyToMany<Relation, SelfKey>;

/**
 * Filter an entity to only have its fields (no relations).
 */
export type IProps<T> = {
  [K in keyof T as NonNullable<T[K]> extends object
    ? {
        [_ in keyof NonNullable<T[K]>]: NonNullable<T[K]> extends IAnyRelation<infer R, infer _>
          ? Required<T> extends Required<R>
            ? K
            : never
          : K;
      }[keyof NonNullable<T[K]>]
    : K]: T[K];
};

/**
 * Filter an entity to only have relations (no fields).
 */
export type IRelations<T> = {
  [K in keyof T as NonNullable<T[K]> extends object
    ? {
        [_ in keyof NonNullable<T[K]>]: NonNullable<T[K]> extends IAnyRelation<infer R, infer _>
          ? Required<T> extends Required<R>
            ? never
            : K
          : never;
      }[keyof NonNullable<T[K]>]
    : never]: T[K];
};

/**
 * Utility type when upserting an entity to a database function.
 */
export type IUpsertEntity<T> = {
  [K in keyof T]: NonNullable<T[K]> extends object
    ? {
        [_ in keyof NonNullable<T[K]>]: NonNullable<T[K]> extends IAnyRelation<infer R, infer _>
          ? Required<T> extends Required<R>
            ? T[K]
            : T[K] extends Array<infer A>
            ? (IUpsertEntity<A> | string)[]
            : IUpsertEntity<T[K]> | string | null | { id: string }
          : T[K];
      }[keyof NonNullable<T[K]>]
    : T[K];
};

/**
 * Utility type when updating an entity to a database function.
 */
export type IUpdateEntity<T> = Partial<IUpsertEntity<T>>;
