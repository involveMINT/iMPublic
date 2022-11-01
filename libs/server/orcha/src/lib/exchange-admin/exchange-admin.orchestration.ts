import { ExchangeAdminService } from '@involvemint/server/core/application-services';
import {
  AddExchangeAdminDto,
  BaDownloadEpAdminsQuery,
  EpAdminQuery,
  ExchangeAdmin,
  GetExchangeAdminsForExchangePartnerDto,
  GetSuperAdminForExchangePartnerDto,
  IExchangeAdminOrchestration,
  InvolvemintOrchestrations,
  RemoveExchangeAdminDto,
} from '@involvemint/shared/domain';
import { IQuery } from '@orcha/common';
import { IServerOrchestration, ServerOperation, ServerOrchestration } from '@orcha/nestjs';

@ServerOrchestration(InvolvemintOrchestrations.epAdmin)
export class ExchangeAdminOrchestration implements IServerOrchestration<IExchangeAdminOrchestration> {
  constructor(private readonly epAdmin: ExchangeAdminService) {}

  @ServerOperation({ validateQuery: EpAdminQuery })
  getForExchangePartner(
    query: IQuery<ExchangeAdmin>,
    token: string,
    dto: GetExchangeAdminsForExchangePartnerDto
  ) {
    return this.epAdmin.getForExchangePartner(query, token, dto);
  }

  @ServerOperation({ validateQuery: BaDownloadEpAdminsQuery })
  async getSuperAdminForExchangePartner(
    query: IQuery<ExchangeAdmin>,
    token: string,
    dto: GetSuperAdminForExchangePartnerDto
  ) {
    return this.epAdmin.getSuperAdminForExchangePartner(query, token, dto);
  }

  @ServerOperation({ validateQuery: EpAdminQuery })
  addAdmin(query: IQuery<ExchangeAdmin>, token: string, dto: AddExchangeAdminDto) {
    return this.epAdmin.addAdmin(query, token, dto);
  }

  @ServerOperation({ validateQuery: { deletedId: true } })
  removeAdmin(query: IQuery<{ deletedId: true }>, token: string, dto: RemoveExchangeAdminDto) {
    return this.epAdmin.removeAdmin(query, token, dto);
  }
}
