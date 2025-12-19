import { IManyToOne } from '../repository';
import { ChangeMaker } from '../change-maker';
import { ExchangePartner } from '../exchange-partner';
import { Poi } from '../poi';
import { ServePartner } from '../serve-partner';

export interface Credit {
  id: string;
  amount: number;
  dateMinted: Date | string;
  escrow: boolean;

  poi?: IManyToOne<Poi, 'credits'>;

  // Possible owners:
  changeMaker?: IManyToOne<ChangeMaker, 'credits'>;
  servePartner?: IManyToOne<ServePartner, 'credits'>;
  exchangePartner?: IManyToOne<ExchangePartner, 'credits'>;
}
