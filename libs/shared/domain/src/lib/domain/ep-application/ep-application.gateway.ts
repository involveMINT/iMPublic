import { ISubscription } from '@orcha/common';
import { EpApplication } from './ep-application.model';

export interface IEpApplicationGateway {
  subAll: ISubscription<EpApplication[]>;
}
