import { IManyToOne } from '../repository';
import { ExchangePartner } from '../exchange-partner';
import { User } from '../user';

export interface ExchangeAdmin {
  id: string;
  datePermitted: Date | string;
  superAdmin: boolean;

  user: IManyToOne<User, 'exchangeAdmins'>;
  exchangePartner: IManyToOne<ExchangePartner, 'admins'>;
}
