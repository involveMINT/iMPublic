import { IOperation } from '@orcha/common';
import { AddServeAdminDto, GetServeAdminsForServePartnerDto, RemoveServeAdminDto } from './serve-admin.dtos';
import { ServeAdmin } from './serve-admin.model';

export interface IServeAdminOrchestration {
  getForServePartner: IOperation<ServeAdmin[], GetServeAdminsForServePartnerDto>;
  addAdmin: IOperation<ServeAdmin, AddServeAdminDto>;
  removeAdmin: IOperation<{ deletedId: string }, RemoveServeAdminDto>;
}
