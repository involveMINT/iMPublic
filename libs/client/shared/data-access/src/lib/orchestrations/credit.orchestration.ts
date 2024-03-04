import { ICreditOrchestration, InvolvemintRoutes } from '@involvemint/shared/domain';
import { ClientOperation, ClientOrchestration, IClientOrchestration } from '@orcha/angular';

@ClientOrchestration(InvolvemintRoutes.credit)
export class CreditOrchestration implements IClientOrchestration<ICreditOrchestration> {
  @ClientOperation()
  getCreditsForProfile!: IClientOrchestration<ICreditOrchestration>['getCreditsForProfile'];
  @ClientOperation()
  mint!: IClientOrchestration<ICreditOrchestration>['mint'];
}
