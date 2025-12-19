import { IManyToOne, IOneToOne } from '../repository';
import { Address } from '../address';
import { Handle } from '../handle';
import { User } from '../user';

export interface SpApplication {
  id: string;
  name: string;
  website: string;
  phone: string;
  email: string;
  dateCreated: Date | string;

  user: IManyToOne<User, 'spApplications'>;
  handle: IOneToOne<Handle, 'spApplication'>;
  address: IOneToOne<Address, 'spApplication'>;
}
