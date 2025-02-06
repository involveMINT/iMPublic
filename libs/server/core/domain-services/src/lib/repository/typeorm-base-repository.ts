import {
  IPaginate,
  Query,
  ExactQuery,
  IUpdateEntity,
  IUpsertEntity,
  IProps,
  parseQuery,
  IParser,
  PAGINATE_KEY,
  PAGINATE_PAGE,
  PAGINATE_LIMIT,
  InvolvemintRoutes
} from '@involvemint/shared/domain';

import { paginate, Pagination } from 'nestjs-typeorm-paginate';
import { Socket } from 'socket.io';
import { DeepPartial, FindManyOptions, Repository } from 'typeorm';
import { createTypeormRelationsArray } from './relations.transform';
import { GatewaysStorage } from './subscription-storage';

/**
 * Inherits all repository functionalities required to perform CRUD operations on an entity.
 */
export abstract class IBaseRepository<
  Entity extends { id: IdType },
  IdType extends string | number = string
> {
  private readonly gatewaysStorage = new GatewaysStorage<Entity, IdType>();

  readonly subscriptions = {
    oneEntitySubscription: async <Q extends Query<Entity>>(
      socket: Socket,
      channel: string,
      id: IdType,
      query: ExactQuery<Entity, Q>
    ) => {
      const listener = () => {
        const relations = createTypeormRelationsArray(query);
        return this.repo.findOneOrFail(id, { relations });
      };
      return this.gatewaysStorage.provisionIdsSubscription({ socket, channel, listener, query });
    },

    manyEntitiesSubscription: async <Q extends Query<Entity>>(
      socket: Socket,
      channel: string,
      ids: IdType[],
      query: ExactQuery<Entity, Q>
    ) => {
      const listener = () => {
        const relations = createTypeormRelationsArray(query);
        return this.repo.findByIds(ids, { relations });
      };
      return this.gatewaysStorage.provisionIdsSubscription({ socket, channel, listener, query });
    },

    querySubscription: async <Q extends Query<Entity>>(
      socket: Socket,
      channel: string,
      query: ExactQuery<Entity, Q>,
      options?: Omit<FindManyOptions<Entity>, 'relations'>
    ) => {
      const listener = async () => this.provisionQuery(query, options);
      return this.gatewaysStorage.provisionQuerySubscription({ socket, channel, listener, query });
    },

    onDisconnect: (socket: Socket) => {
      return this.gatewaysStorage.removeListener(socket);
    },
  };

  constructor(
    /** Note: Calling mutating functions here will not trigger repo subscribers. */
    protected readonly repo: Repository<Entity>
  ) {}

  async findOneOrFail(id: IdType): Promise<IProps<Entity>>;
  async findOneOrFail<Q extends Query<Entity>>(
    id: IdType,
    query: ExactQuery<Entity, Q>
  ): Promise<IParser<Entity, Q>>;
  async findOneOrFail<Q extends Query<Entity>>(id: IdType, query?: ExactQuery<Entity, Q>) {
    if (query) {
      const relations = createTypeormRelationsArray(query);
      const dbRes = await this.repo.findOneOrFail(id, { relations });
      return parseQuery(query, dbRes);
    } else {
      return this.repo.findOneOrFail(id) as unknown as Promise<IProps<Entity>>;
    }
  }

  async findOne(id: IdType): Promise<IProps<Entity> | undefined>;
  async findOne<Q extends Query<Entity>>(
    id: IdType,
    query: ExactQuery<Entity, Q>
  ): Promise<IParser<Entity, Q> | undefined>;
  async findOne<Q extends Query<Entity>>(id: IdType, query?: ExactQuery<Entity, Q>) {
    if (query) {
      const relations = createTypeormRelationsArray(query);
      const dbRes = await this.repo.findOne(id, { relations });
      return parseQuery(query, dbRes);
    } else {
      return this.repo.findOne(id) as unknown as Promise<IProps<Entity> | undefined>;
    }
  }

  async findMany(ids: IdType[]): Promise<IProps<Entity>[]>;
  async findMany<Q extends Query<Entity>>(
    ids: IdType[],
    query: ExactQuery<Entity, Q>
  ): Promise<IParser<Entity[], Q>>;
  async findMany<Q extends Query<Entity>>(ids: IdType[], query?: ExactQuery<Entity, Q>) {
    if (ids.length === 0) return [] as unknown as IParser<Entity[], Q>;
    if (query) {
      const relations = createTypeormRelationsArray(query);
      const dbRes = await this.repo.findByIds(ids, { relations });
      return parseQuery(query, dbRes);
    } else {
      return this.repo.findByIds(ids) as unknown as Promise<IProps<Entity>[]>;
    }
  }

  async findAll(): Promise<IProps<Entity>[]>;
  async findAll<Q extends Query<Entity>>(query: ExactQuery<Entity, Q>): Promise<IParser<Entity[], Q>>;
  async findAll<Q extends Query<Entity>>(query?: ExactQuery<Entity, Q>) {
    if (query) {
      const relations = createTypeormRelationsArray(query);
      const dbRes = await this.repo.find({ relations });
      return parseQuery(query, dbRes);
    } else {
      return this.repo.find() as unknown as Promise<IProps<Entity>[]>;
    }
  }

  async query<Q extends Query<Entity>>(
    query: ExactQuery<Entity, Q>,
    options?: Omit<FindManyOptions<Entity>, 'relations'>
  ): Promise<IParser<Entity[], Q>> {
    const entities = await this.provisionQuery(query, options);
    return parseQuery(query, entities) as IParser<Entity[], Q>;
  }

  private async provisionQuery<Q extends Query<Entity>>(
    query: ExactQuery<Entity, Q>,
    options?: Omit<FindManyOptions<Entity>, 'relations'>
  ): Promise<Pagination<Entity> | Entity[]> {
    let entities: Pagination<Entity> | Entity[];
    const relations = createTypeormRelationsArray(query);

    const paginateOptions = (query as IPaginate)[PAGINATE_KEY];
    if (paginateOptions) {
      entities = await paginate(
        this.repo,
        { page: paginateOptions[PAGINATE_PAGE], limit: paginateOptions[PAGINATE_LIMIT] },
        { ...options, relations }
      );
    } else {
      entities = await this.repo.find({ ...options, relations });
    }
    return entities;
  }

  async update(id: IdType, entity: IUpdateEntity<Entity>): Promise<IProps<Entity>>;
  async update<Q extends Query<Entity>>(
    id: IdType,
    entity: IUpdateEntity<Entity>,
    query: ExactQuery<Entity, Q>
  ): Promise<IParser<Entity, Q>>;
  async update<Q extends Query<Entity>>(
    id: IdType,
    entity: IUpdateEntity<Entity>,
    query?: ExactQuery<Entity, Q>
  ) {
    await this.repo.save({ ...(entity as unknown as DeepPartial<Entity>), id });
    this.gatewaysStorage.trigger(id);
    return query ? this.findOneOrFail(id, query) : this.findOneOrFail(id);
  }
  

  async upsert(entity: IUpsertEntity<Entity>): Promise<IProps<Entity>>;
  async upsert<Q extends Query<Entity>>(
    entity: IUpsertEntity<Entity>,
    query: ExactQuery<Entity, Q>
  ): Promise<IParser<Entity, Q>>;
  async upsert<Q extends Query<Entity>>(entity: IUpsertEntity<Entity>, query?: ExactQuery<Entity, Q>) {
    await this.repo.save(entity as unknown as DeepPartial<Entity>);
    this.gatewaysStorage.trigger(entity.id as IdType);
    return query ? this.findOneOrFail(entity.id as IdType, query) : this.findOneOrFail(entity.id as IdType);
  }

  async upsertMany(entities: IUpsertEntity<Entity>[]): Promise<IProps<Entity>[]>;
  async upsertMany<Q extends Query<Entity>>(
    entities: IUpsertEntity<Entity>[],
    query: ExactQuery<Entity, Q>
  ): Promise<IParser<Entity[], Q>>;
  async upsertMany<Q extends Query<Entity>>(
    entities: IUpsertEntity<Entity>[],
    query?: ExactQuery<Entity, Q>
  ) {
    if (entities.length === 0) return [] as unknown as IParser<Entity[], Q>;
    await this.repo.save(entities as unknown as DeepPartial<Entity>[]);
    const ids = entities.map((e) => e.id) as IdType[];
    this.gatewaysStorage.trigger(ids);
    return query ? this.findMany(ids, query) : this.findMany(ids);
  }

  async delete(id: IdType): Promise<IdType> {
    await this.repo.delete(id);
    this.gatewaysStorage.trigger(id);
    return id;
  }

  async deleteMany(ids: IdType[]): Promise<IdType[]> {
    if (ids.length === 0) return [];
    await this.repo.delete(ids as string[]);
    this.gatewaysStorage.trigger(ids);
    return ids;
  }
}
