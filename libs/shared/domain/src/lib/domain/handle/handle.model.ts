import { IOneToOne } from '../repository';
import { ChangeMaker } from '../change-maker';
import { EpApplication } from '../ep-application';
import { ExchangePartner } from '../exchange-partner';
import { ServePartner } from '../serve-partner';
import { SpApplication } from '../sp-application';

export interface Handle {
  id: string;

  changeMaker?: IOneToOne<ChangeMaker, 'handle'>;
  exchangePartner?: IOneToOne<ExchangePartner, 'handle'>;
  servePartner?: IOneToOne<ServePartner, 'handle'>;
  epApplication?: IOneToOne<EpApplication, 'handle'>;
  spApplication?: IOneToOne<SpApplication, 'handle'>;
}
