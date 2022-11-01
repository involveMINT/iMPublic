import { IOperation } from '@orcha/common';
import {
  AddExchangeAdminDto,
  GetExchangeAdminsForExchangePartnerDto,
  GetSuperAdminForExchangePartnerDto,
  RemoveExchangeAdminDto,
} from './exchange-admin.dtos';
import { ExchangeAdmin } from './exchange-admin.model';

export interface IExchangeAdminOrchestration {
  getForExchangePartner: IOperation<ExchangeAdmin[], GetExchangeAdminsForExchangePartnerDto>;
  getSuperAdminForExchangePartner: IOperation<ExchangeAdmin, GetSuperAdminForExchangePartnerDto>;
  addAdmin: IOperation<ExchangeAdmin, AddExchangeAdminDto>;
  removeAdmin: IOperation<{ deletedId: string }, RemoveExchangeAdminDto>;
}
