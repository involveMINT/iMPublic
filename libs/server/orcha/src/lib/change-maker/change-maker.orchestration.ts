import { ChangeMakerService } from '@involvemint/server/core/application-services';
import {
  ChangeMaker,
  CreateChangeMakerProfileDto,
  EditCmProfileDto,
  IChangeMakerOrchestration,
  InvolvemintRoutes,
  UserQuery,
} from '@involvemint/shared/domain';
import { IQuery } from '@orcha/common';
import { IServerOrchestration, ServerOperation, ServerOrchestration } from '@orcha/nestjs';

@ServerOrchestration(InvolvemintRoutes.changeMaker)
export class ChangeMakerOrchestration implements IServerOrchestration<IChangeMakerOrchestration> {
  constructor(private readonly cmService: ChangeMakerService) {}

  @ServerOperation({ validateQuery: UserQuery.changeMaker })
  createProfile(query: IQuery<ChangeMaker>, token: string, dto: CreateChangeMakerProfileDto) {
    return this.cmService.createProfile(query, token, dto);
  }

  @ServerOperation({ validateQuery: UserQuery.changeMaker })
  async editProfile(query: IQuery<ChangeMaker>, token: string, dto: EditCmProfileDto) {
    return this.cmService.editProfile(query, token, dto);
  }

  @ServerOperation({ validateQuery: UserQuery.changeMaker, fileUpload: 'singular' })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async updateProfileImage(query: IQuery<ChangeMaker>, token: string, _: any, file: Express.Multer.File) {
    return this.cmService.updateProfileImage(query, token, file);
  }
}
