import { IChangeMakerOrchestration, InvolvemintOrchestrations } from '@involvemint/shared/domain';
import { INestApplication } from '@nestjs/common';
import {
  createNestjsTestOrchestration,
  ITestOrchestration,
  TestOperation,
  TestOrchestration,
} from '@orcha/testing';

@TestOrchestration(InvolvemintOrchestrations.changeMaker)
export class ChangeMakerOrchestration implements ITestOrchestration<IChangeMakerOrchestration> {
  @TestOperation()
  createProfile!: ITestOrchestration<IChangeMakerOrchestration>['createProfile'];
  @TestOperation()
  editProfile!: ITestOrchestration<IChangeMakerOrchestration>['editProfile'];
  @TestOperation()
  updateProfileImage!: ITestOrchestration<IChangeMakerOrchestration>['updateProfileImage'];
}

export function createChangeMakerOrchestration(app: INestApplication) {
  return createNestjsTestOrchestration(app, ChangeMakerOrchestration);
}
