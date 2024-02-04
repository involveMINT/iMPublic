import { InvolvemintRoutes, IPoiOrchestration } from '@involvemint/shared/domain';
import { INestApplication } from '@nestjs/common';
import {
  createNestjsTestOrchestration,
  ITestOrchestration,
  TestOperation,
  TestOrchestration,
} from '@orcha/testing';

@TestOrchestration(InvolvemintRoutes.poi)
class PoiOrchestration implements ITestOrchestration<IPoiOrchestration> {
  @TestOperation()
  get!: ITestOrchestration<IPoiOrchestration>['get'];
  @TestOperation()
  getByProject!: ITestOrchestration<IPoiOrchestration>['getByProject'];
  @TestOperation()
  create!: ITestOrchestration<IPoiOrchestration>['create'];
  @TestOperation()
  start!: ITestOrchestration<IPoiOrchestration>['start'];
  @TestOperation()
  stop!: ITestOrchestration<IPoiOrchestration>['stop'];
  @TestOperation()
  withdraw!: ITestOrchestration<IPoiOrchestration>['withdraw'];
  @TestOperation()
  pause!: ITestOrchestration<IPoiOrchestration>['pause'];
  @TestOperation()
  resume!: ITestOrchestration<IPoiOrchestration>['resume'];
  @TestOperation()
  submit!: ITestOrchestration<IPoiOrchestration>['submit'];
  @TestOperation()
  approve!: ITestOrchestration<IPoiOrchestration>['approve'];
  @TestOperation()
  deny!: ITestOrchestration<IPoiOrchestration>['deny'];
}

export function createPoiOrchestration(app: INestApplication) {
  return createNestjsTestOrchestration(app, PoiOrchestration);
}
