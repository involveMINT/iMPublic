import { InvolvemintOrchestrations, IProjectOrchestration } from '@involvemint/shared/domain';
import { INestApplication } from '@nestjs/common';
import {
  createNestjsTestOrchestration,
  ITestOrchestration,
  TestOperation,
  TestOrchestration,
} from '@orcha/testing';

@TestOrchestration(InvolvemintOrchestrations.project)
class ProjectOrchestration implements ITestOrchestration<IProjectOrchestration> {
  @TestOperation()
  getAll!: ITestOrchestration<IProjectOrchestration>['getAll'];
  @TestOperation()
  getOne!: ITestOrchestration<IProjectOrchestration>['getOne'];
  @TestOperation()
  getAllOwnedBySp!: ITestOrchestration<IProjectOrchestration>['getAllOwnedBySp'];
  @TestOperation()
  create!: ITestOrchestration<IProjectOrchestration>['create'];
  @TestOperation()
  update!: ITestOrchestration<IProjectOrchestration>['update'];
  @TestOperation()
  uploadImages!: ITestOrchestration<IProjectOrchestration>['uploadImages'];
  @TestOperation()
  deleteImage!: ITestOrchestration<IProjectOrchestration>['deleteImage'];
  @TestOperation()
  delete!: ITestOrchestration<IProjectOrchestration>['delete'];
  @TestOperation()
  uploadCustomWaiver!: ITestOrchestration<IProjectOrchestration>['uploadCustomWaiver'];
}

export function createProjectOrchestration(app: INestApplication) {
  return createNestjsTestOrchestration(app, ProjectOrchestration);
}
