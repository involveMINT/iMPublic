import { ISubscription } from '@orcha/common';
import { SpApplication } from './sp-application.model';

export interface ISpApplicationGateway {
  subAll: ISubscription<SpApplication[]>;
}
