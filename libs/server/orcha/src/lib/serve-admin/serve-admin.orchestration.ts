import { ServeAdminService } from '@involvemint/server/core/application-services';
import {
  AddServeAdminDto,
  GetServeAdminsForServePartnerDto,
  InvolvemintOrchestrations,
  IServeAdminOrchestration,
  RemoveServeAdminDto,
  ServeAdmin,
  SpAdminQuery,
} from '@involvemint/shared/domain';
import { IQuery } from '@orcha/common';
import { IServerOrchestration, ServerOperation, ServerOrchestration } from '@orcha/nestjs';

@ServerOrchestration(InvolvemintOrchestrations.spAdmin)
export class ServeAdminOrchestration implements IServerOrchestration<IServeAdminOrchestration> {
  constructor(private readonly spAdmin: ServeAdminService) {}

  @ServerOperation({ validateQuery: SpAdminQuery })
  getForServePartner(query: IQuery<ServeAdmin>, token: string, dto: GetServeAdminsForServePartnerDto) {
    return this.spAdmin.getForServePartner(query, token, dto);
  }

  @ServerOperation({ validateQuery: SpAdminQuery })
  addAdmin(query: IQuery<ServeAdmin>, token: string, dto: AddServeAdminDto) {
    return this.spAdmin.addAdmin(query, token, dto);
  }

  @ServerOperation({ validateQuery: { deletedId: true } })
  removeAdmin(query: IQuery<{ deletedId: true }>, token: string, dto: RemoveServeAdminDto) {
    return this.spAdmin.removeAdmin(query, token, dto);
  }
}
