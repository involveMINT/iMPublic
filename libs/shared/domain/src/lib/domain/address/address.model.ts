import { IOneToOne } from '../repository';
import { ChangeMaker } from '../change-maker';
import { EpApplication } from '../ep-application';
import { ExchangePartner } from '../exchange-partner';
import { Offer } from '../offer';
import { Project } from '../project';
import { ServePartner } from '../serve-partner';
import { SpApplication } from '../sp-application';

export interface Address {
  id: string;
  address1: string;
  address2?: string;
  address3?: string;
  city: string;
  state: string;
  zip: string;
  /** Defaults to USA. */
  country?: string;

  offer?: IOneToOne<Offer, 'address'>;
  changeMaker?: IOneToOne<ChangeMaker, 'address'>;
  exchangePartner?: IOneToOne<ExchangePartner, 'address'>;
  servePartner?: IOneToOne<ServePartner, 'address'>;
  project?: IOneToOne<Project, 'address'>;
  epApplication?: IOneToOne<EpApplication, 'address'>;
  spApplication?: IOneToOne<SpApplication, 'address'>;
}
