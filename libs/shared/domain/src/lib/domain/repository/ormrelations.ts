/**
 * Defines a One-to-One relationship with another entity.
 */
export type OneToOne<Relation, SelfKey extends keyof Relation> = Omit<Relation, SelfKey>;

/**
 * Defines a One-to-Many relationship with another entity.
 */
export type OneToMany<Relation, SelfKey extends keyof Relation> = Omit<Relation, SelfKey>[];

/**
 * Defines a Many-to-One relationship with another entity.
 */
export type ManyToOne<Relation, SelfKey extends keyof Relation> = Omit<Relation, SelfKey>;

/**
 * Defines a Many-to-Many relationship with another entity.
 */
export type ManyToMany<Relation, SelfKey extends keyof Relation> = Omit<Relation, SelfKey>[];

/**
 * A utility type that represents any relationship type.
 */
export type AnyRelation<Relation, SelfKey extends keyof Relation> =
  | OneToOne<Relation, SelfKey>
  | OneToMany<Relation, SelfKey>
  | ManyToOne<Relation, SelfKey>
  | ManyToMany<Relation, SelfKey>;

/**
 * Filters an entity to only include its scalar fields (excluding relations).
 */
export type ScalarFields<T> = {
  [K in keyof T as T[K] extends object
    ? never
    : K]: T[K];
};

/**
 * Filters an entity to only include its relational fields.
 */
export type RelationFields<T> = {
  [K in keyof T as T[K] extends object
    ? K
    : never]: T[K];
};

/**
 * A utility type for inserting or updating an entity.
 * Handles relational structures and scalar fields.
 */
export type UpsertEntity<T> = {
  [K in keyof T]: T[K] extends object
    ? T[K] extends Array<infer Item>
      ? (UpsertEntity<Item> | string)[]
      : UpsertEntity<T[K]> | string | null | { id: string }
    : T[K];
};

/**
 * A utility type for updating an entity with partial fields.
 */
export type UpdateEntity<T> = Partial<UpsertEntity<T>>;
