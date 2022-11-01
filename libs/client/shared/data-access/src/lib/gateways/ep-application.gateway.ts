import { IEpApplicationGateway, InvolvemintGateways } from '@involvemint/shared/domain';
import { ClientGateway, ClientSubscription, IClientGateway } from '@orcha/angular';

@ClientGateway(InvolvemintGateways.epApplication)
export class EpApplicationGateway implements IClientGateway<IEpApplicationGateway> {
  @ClientSubscription()
  subAll!: IClientGateway<IEpApplicationGateway>['subAll'];
}
