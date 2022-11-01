import { InvolvemintOrchestrations, IPoiOrchestration } from '@involvemint/shared/domain';
import { ClientOperation, ClientOrchestration, IClientOrchestration } from '@orcha/angular';

@ClientOrchestration(InvolvemintOrchestrations.poi)
export class PoiOrchestration implements IClientOrchestration<IPoiOrchestration> {
  @ClientOperation()
  get!: IClientOrchestration<IPoiOrchestration>['get'];
  @ClientOperation()
  getByProject!: IClientOrchestration<IPoiOrchestration>['getByProject'];
  @ClientOperation()
  create!: IClientOrchestration<IPoiOrchestration>['create'];
  @ClientOperation()
  start!: IClientOrchestration<IPoiOrchestration>['start'];
  @ClientOperation()
  stop!: IClientOrchestration<IPoiOrchestration>['stop'];
  @ClientOperation()
  withdraw!: IClientOrchestration<IPoiOrchestration>['withdraw'];
  @ClientOperation()
  pause!: IClientOrchestration<IPoiOrchestration>['pause'];
  @ClientOperation()
  resume!: IClientOrchestration<IPoiOrchestration>['resume'];
  @ClientOperation()
  submit!: IClientOrchestration<IPoiOrchestration>['submit'];
  @ClientOperation()
  approve!: IClientOrchestration<IPoiOrchestration>['approve'];
  @ClientOperation()
  deny!: IClientOrchestration<IPoiOrchestration>['deny'];
}
