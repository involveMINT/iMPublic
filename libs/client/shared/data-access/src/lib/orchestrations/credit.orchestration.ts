import { ICreditOrchestration, InvolvemintOrchestrations } from '@involvemint/shared/domain';
import { ClientOperation, ClientOrchestration, IClientOrchestration } from '@orcha/angular';

@ClientOrchestration(InvolvemintOrchestrations.credit)
export class CreditOrchestration implements IClientOrchestration<ICreditOrchestration> {
  @ClientOperation()
  getCreditsForProfile!: IClientOrchestration<ICreditOrchestration>['getCreditsForProfile'];
  @ClientOperation()
  mint!: IClientOrchestration<ICreditOrchestration>['mint'];
}
