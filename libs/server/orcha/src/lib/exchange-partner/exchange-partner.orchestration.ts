import { ExchangePartnerService } from '@involvemint/server/core/application-services';
import {
  DeleteEpImageDto,
  EditEpProfileDto,
  ExchangePartner,
  ExchangePartnerMarketQuery,
  ExchangePartnerMarketQueryDto,
  ExchangePartnerSearchQuery,
  GetOneExchangePartnerDto,
  IExchangePartnerOrchestration,
  InvolvemintRoutes,
  SearchEpDto,
  UpdateEpLogoFileDto,
  UploadEpImagesDto,
  UserQuery,
} from '@involvemint/shared/domain';
import { IQuery } from '@orcha/common';
import { IServerOrchestration, ServerOperation, ServerOrchestration } from '@orcha/nestjs';

@ServerOrchestration(InvolvemintRoutes.exchangePartner)
export class ExchangePartnerOrchestration implements IServerOrchestration<IExchangePartnerOrchestration> {
  constructor(private readonly ep: ExchangePartnerService) {}

  @ServerOperation({ validateQuery: ExchangePartnerMarketQuery })
  query(query: IQuery<ExchangePartner[]>, _: string, dto: ExchangePartnerMarketQueryDto) {
    return this.ep.query(query, dto);
  }

  @ServerOperation({ validateQuery: ExchangePartnerMarketQuery })
  async getOne(query: IQuery<ExchangePartner>, _: string, dto: GetOneExchangePartnerDto) {
    return this.ep.getOne(query, dto);
  }

  @ServerOperation({ validateQuery: ExchangePartnerSearchQuery })
  async searchEps(query: IQuery<ExchangePartner>, _: string, dto: SearchEpDto) {
    return this.ep.searchEps(query, dto);
  }

  @ServerOperation({ validateQuery: UserQuery.exchangeAdmins.exchangePartner })
  async editProfile(query: IQuery<ExchangePartner>, token: string, dto: EditEpProfileDto) {
    return this.ep.editProfile(query, token, dto);
  }

  @ServerOperation({ validateQuery: UserQuery.exchangeAdmins.exchangePartner })
  async updateLogoFile(
    query: IQuery<ExchangePartner>,
    token: string,
    dto: UpdateEpLogoFileDto,
    file: Express.Multer.File
  ) {
    return this.ep.updateLogoFile(query, token, dto, file);
  }

  @ServerOperation({ validateQuery: UserQuery.exchangeAdmins.exchangePartner, fileUpload: 'multiple' })
  async uploadImages(
    query: IQuery<ExchangePartner>,
    token: string,
    dto: UploadEpImagesDto,
    files: Express.Multer.File[]
  ) {
    return this.ep.uploadImages(query, token, dto, files);
  }

  @ServerOperation({ validateQuery: UserQuery.exchangeAdmins.exchangePartner })
  async deleteImage(query: IQuery<ExchangePartner>, token: string, dto: DeleteEpImageDto) {
    return this.ep.deleteImage(query, token, dto);
  }
}
