import { IPagination, parseQuery, ExactQuery } from '@involvemint/shared/domain';
import { Socket } from 'socket.io';

interface ISubscription<Entity> {
  channel: string;
  socket: Socket;
  listener: () => Promise<Entity | Entity[] | IPagination<Entity>>;
  query: ExactQuery<Entity, unknown>;
}

interface IdsSubscription<Entity, IdType> extends ISubscription<Entity> {
  idsListenedTo: IdType[];
  type: 'entity';
}

interface QuerySubscription<Entity> extends ISubscription<Entity> {
  type: 'query';
}

type Subscription<Entity, IdType> = IdsSubscription<Entity, IdType> | QuerySubscription<Entity>;

export class GatewaysStorage<Entity extends { id: IdType }, IdType> {
  private readonly subscribers = new Map<string, Subscription<Entity, IdType>[]>();

  async provisionIdsSubscription(
    subscription: Omit<IdsSubscription<Entity, IdType>, 'idsListenedTo' | 'type'>
  ) {
    const res = await subscription.listener();
    const ids: IdType[] = this.getIds(res);
    const newSub: IdsSubscription<Entity, IdType> = { ...subscription, idsListenedTo: ids, type: 'entity' };
    return this.addSubscription(newSub);
  }

  async provisionQuerySubscription(subscription: Omit<QuerySubscription<Entity>, 'type'>) {
    const newSub: QuerySubscription<Entity> = { ...subscription, type: 'query' };
    return this.addSubscription(newSub);
  }

  removeListener(socket: Socket) {
    return this.subscribers.delete(socket.id);
  }

  /**
   * Only trigger subscribers who are watching Entities of ids.
   */
  async trigger(id: IdType | IdType[]) {
    const triggeredIds = Array.isArray(id) ? id : [id];
    for (const subscription of this.subscribers.values()) {
      for (const s of subscription) {
        if (s.type === 'entity') {
          if (triggeredIds.some((t) => s.idsListenedTo.includes(t))) {
            s.socket.emit(s.channel, parseQuery(s.query as any, await s.listener()));
          }
        } else if (s.type === 'query') {
          // TODO very inefficient for many clients listening to queries.
          const res = await s.listener();
          const ids = this.getIds(res);
          if (triggeredIds.some((t) => ids.includes(t))) {
            s.socket.emit(s.channel, parseQuery(s.query as any, res));
          }
        }
      }
    }
  }

  private async addSubscription(newSub: Subscription<Entity, IdType>) {
    let subscriptions = this.subscribers.get(newSub.socket.id);
    if (subscriptions) {
      // Replace client subscriptions that are on the same channel.
      subscriptions = subscriptions.filter((sub) => sub.channel !== newSub.channel);
      subscriptions.push(newSub);
      this.subscribers.set(newSub.socket.id, subscriptions);
    } else {
      this.subscribers.set(newSub.socket.id, [newSub]);
    }
    newSub.socket.emit(newSub.channel, parseQuery(newSub.query as any, await newSub.listener()));
  }

  private getIds(res: Entity | Entity[] | IPagination<Entity>) {
    const ids: IdType[] = [];
    if ('items' in res && 'meta' in res) {
      ids.push(...res.items.map((i) => i.id));
    } else if (Array.isArray(res)) {
      ids.push(...res.map((i) => i.id));
    } else {
      ids.push(res.id);
    }
    return ids;
  }
}
