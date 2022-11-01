import { InvolvemintGateways, ISpApplicationGateway } from '@involvemint/shared/domain';
import { ClientGateway, ClientSubscription, IClientGateway } from '@orcha/angular';

@ClientGateway(InvolvemintGateways.spApplication)
export class SpApplicationGateway implements IClientGateway<ISpApplicationGateway> {
  @ClientSubscription()
  subAll!: IClientGateway<ISpApplicationGateway>['subAll'];
}
