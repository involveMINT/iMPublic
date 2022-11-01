import { IHandleOrchestration, InvolvemintOrchestrations } from '@involvemint/shared/domain';
import { INestApplication } from '@nestjs/common';
import {
  createNestjsTestOrchestration,
  ITestOrchestration,
  TestOperation,
  TestOrchestration,
} from '@orcha/testing';

@TestOrchestration(InvolvemintOrchestrations.handle)
class HandleOrchestration implements ITestOrchestration<IHandleOrchestration> {
  @TestOperation()
  verifyHandle!: ITestOrchestration<IHandleOrchestration>['verifyHandle'];
  @TestOperation()
  searchHandles!: ITestOrchestration<IHandleOrchestration>['searchHandles'];
  @TestOperation()
  viewProfile!: ITestOrchestration<IHandleOrchestration>['viewProfile'];
  @TestOperation()
  genericSearch!: ITestOrchestration<IHandleOrchestration>['genericSearch'];
}

export function createHandleOrchestration(app: INestApplication) {
  return createNestjsTestOrchestration(app, HandleOrchestration);
}
