import { IManyToOne } from '../repository';
import { ServePartner } from '../serve-partner';
import { User } from '../user';

export interface ServeAdmin {
  id: string;
  datePermitted: Date | string;
  superAdmin: boolean;

  user: IManyToOne<User, 'serveAdmins'>;
  servePartner: IManyToOne<ServePartner, 'admins'>;
}
