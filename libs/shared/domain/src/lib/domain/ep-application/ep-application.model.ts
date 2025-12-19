import { IManyToOne, IOneToOne } from '../repository';
import { Address } from '../address';
import { Handle } from '../handle';
import { User } from '../user';

export interface EpApplication {
  id: string;
  name: string;
  website: string;
  phone: string;
  email: string;
  ein: string;
  dateCreated: Date | string;

  user: IManyToOne<User, 'epApplications'>;
  handle: IOneToOne<Handle, 'epApplication'>;
  address: IOneToOne<Address, 'epApplication'>;
}
