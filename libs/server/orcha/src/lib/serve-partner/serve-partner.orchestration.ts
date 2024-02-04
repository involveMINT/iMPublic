import { ServePartnerService } from '@involvemint/server/core/application-services';
import {
  DeleteSpImageDto,
  EditSpProfileDto,
  InvolvemintRoutes,
  IServePartnerOrchestration,
  ServePartner,
  UpdateSpLogoFileDto,
  UploadSpImagesDto,
  UserQuery,
} from '@involvemint/shared/domain';
import { IQuery } from '@orcha/common';
import { IServerOrchestration, ServerOperation, ServerOrchestration } from '@orcha/nestjs';

@ServerOrchestration(InvolvemintRoutes.servePartner)
export class ServePartnerOrchestration implements IServerOrchestration<IServePartnerOrchestration> {
  constructor(private readonly sp: ServePartnerService) {}

  @ServerOperation({ validateQuery: UserQuery.serveAdmins.servePartner })
  async editProfile(query: IQuery<ServePartner>, token: string, dto: EditSpProfileDto) {
    return this.sp.editProfile(query, token, dto);
  }

  @ServerOperation({ validateQuery: UserQuery.serveAdmins.servePartner })
  async updateLogoFile(
    query: IQuery<ServePartner>,
    token: string,
    dto: UpdateSpLogoFileDto,
    file: Express.Multer.File
  ) {
    return this.sp.updateLogoFile(query, token, dto, file);
  }

  @ServerOperation({ validateQuery: UserQuery.serveAdmins.servePartner, fileUpload: 'multiple' })
  async uploadImages(
    query: IQuery<ServePartner>,
    token: string,
    dto: UploadSpImagesDto,
    files: Express.Multer.File[]
  ) {
    return this.sp.uploadImages(query, token, dto, files);
  }

  @ServerOperation({ validateQuery: UserQuery.serveAdmins.servePartner })
  async deleteImage(query: IQuery<ServePartner>, token: string, dto: DeleteSpImageDto) {
    return this.sp.deleteImage(query, token, dto);
  }
}
