import { IOneToMany, IOneToOne } from '../repository';
import { Address } from '../address';
import { Credit } from '../credit';
import { Handle } from '../handle';
import { Offer } from '../offer';
import { Project } from '../project';
import { Request } from '../request';
import { ServeAdmin } from '../serve-admin';
import { Transaction } from '../transaction';
import { Voucher } from '../voucher';

export interface ServePartner {
  id: string;
  name: string;
  website: string;
  phone: string;
  email: string;
  logoFilePath?: string;
  imagesFilePaths: string[];
  description?: string;
  latitude?: number;
  longitude?: number;
  dateCreated: Date | string;

  address: IOneToOne<Address, 'servePartner'>;
  handle: IOneToOne<Handle, 'servePartner'>;
  projects: IOneToMany<Project, 'servePartner'>;
  admins: IOneToMany<ServeAdmin, 'servePartner'>;
  credits: IOneToMany<Credit, 'servePartner'>;
  sendingTransactions: IOneToMany<Transaction, 'senderServePartner'>;
  receivingTransactions: IOneToMany<Transaction, 'receiverServePartner'>;
  offers: IOneToMany<Offer, 'servePartner'>;
  requests: IOneToMany<Request, 'servePartner'>;
  receivingVouchers: IOneToMany<Voucher, 'servePartnerReceiver'>;
}
